// src/worker.js

import { ChatRoomDurableObject } from './chatroom_do.js';
import html from '../public/index.html';

// Export Durable Object class for Cloudflare platform instantiation
export { ChatRoomDurableObject };

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
        // Normalize path to remove trailing slash for consistent matching
        // This helps ensure that /ai-explain and /ai-explain/ are treated the same.
        let pathname = url.pathname;
        if (pathname.endsWith('/') && pathname.length > 1) {
            pathname = pathname.slice(0, -1);
        }
        const pathParts = pathname.split('/').filter(part => part);

        // Handle image upload
        if (pathname === '/upload' && request.method === 'POST') {
            try {
                // Ensure R2_BUCKET is bound in wrangler.toml
                if (!env.R2_BUCKET) {
                    console.error('R2_BUCKET is not bound in environment.');
                    return new Response('Server configuration error: R2_BUCKET not bound.', { status: 500 });
                }
                const filename = request.headers.get('X-Filename') || `upload-${Date.now()}`;
                
                // The request.body is a ReadableStream, which `put` can directly consume.
                const object = await env.R2_BUCKET.put(filename, request.body, {
                    httpMetadata: request.headers, // Pass original headers for metadata like Content-Type
                });
                
                // Construct publicly accessible URL. Cloudflare R2 makes objects accessible via their key.
                // The origin should be the worker's origin.
                const publicUrl = `${new URL(request.url).origin}/${object.key}`;
                
                return new Response(JSON.stringify({ url: publicUrl }), {
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                console.error('Upload error:', error.stack); // Log full stack trace for debugging
                return new Response('Error uploading file.', { status: 500 });
            }
        }

        // Handle AI explanation request
        // This check now uses the normalized 'pathname'
        if (pathname === '/ai-explain' && request.method === 'POST') {
            try {
                const requestBody = await request.json(); // Parse the JSON body
                const text = requestBody.text;

                if (!text) {
                    console.error('AI explanation: Missing text in request body.');
                    return new Response('Missing text in request body.', { status: 400 });
                }

                const GEMINI_API_KEY = env.GEMINI_API_KEY; // Get API key from environment variables
                if (!GEMINI_API_KEY) {
                    console.error('AI explanation: GEMINI_API_KEY is not set in environment variables.');
                    return new Response('Server configuration error: GEMINI_API_KEY is not set.', { status: 500 });
                }
                console.log('AI explanation: GEMINI_API_KEY loaded.');

                const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY;

                const geminiResponse = await fetch(GEMINI_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `解释以下文本：${text}`
                            }]
                        }]
                    })
                });

                if (!geminiResponse.ok) {
                    const errorText = await geminiResponse.text();
                    console.error(`AI explanation: Gemini API error: ${geminiResponse.status} - ${errorText}`);
                    return new Response(`Gemini API error: ${errorText}`, { status: geminiResponse.status });
                }

                const geminiData = await geminiResponse.json();
                
                // Robustly access the explanation text using optional chaining
                const explanation = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

                if (!explanation) {
                    // Log the structure if explanation is missing, to help debug unexpected API responses
                    console.error('AI explanation: Unexpected Gemini API response structure or missing explanation:', JSON.stringify(geminiData));
                    return new Response('Unexpected AI response format.', { status: 500 });
                }

                return new Response(JSON.stringify({ explanation }), {
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                console.error('AI explanation request error:', error.stack); // Log full stack trace for debugging
                return new Response('Error processing AI explanation request.', { status: 500 });
            }
        }

        // If the root path is accessed, guide the user to join a room.
        // This check should ideally happen after specific API routes are checked.
        if (pathParts.length === 0) {
            // Changed from 404 to a more user-friendly message for root access.
            // A 404 for the root path might be confusing if the intention is to serve index.html.
            // However, if the user expects to *start* a chat room from the root, this message is appropriate.
            return new Response('Welcome! Please access /&lt;room-name&gt; to join a chat room.', { status: 200 });
        }

        // Use the first path segment as the chat room's unique ID
        const roomName = pathParts[0];

        // Check if the request is a WebSocket upgrade request
        const upgradeHeader = request.headers.get("Upgrade");
        if (upgradeHeader === "websocket") {
            // If it's a WebSocket request, route it to the corresponding Durable Object instance
            console.log(`Routing WebSocket for room [${roomName}] to Durable Object...`);
            // Ensure CHAT_ROOM_DO is bound in wrangler.toml
            if (!env.CHAT_ROOM_DO) {
                console.error('CHAT_ROOM_DO is not bound in environment.');
                return new Response('Server configuration error: CHAT_ROOM_DO not bound.', { status: 500 });
            }
            const doId = env.CHAT_ROOM_DO.idFromName(roomName);
            const stub = env.CHAT_ROOM_DO.get(doId);
            // Pass the request and response control entirely to the Durable Object
            return stub.fetch(request);
        }

        // For all other GET requests that haven't matched specific API routes or WebSocket upgrades,
        // serve the single-page application HTML. This acts as a catch-all for frontend routes.
        // This means accessing /some/other/path (that is not /upload or /ai-explain) will serve index.html.
        return new Response(html, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
    },
};