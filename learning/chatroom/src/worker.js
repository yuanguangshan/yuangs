// src/worker.js

import { ChatRoomDurableObject } from './chatroom_do.js';
import html from '../public/index.html';

// Export Durable Object class for Cloudflare platform instantiation
export { ChatRoomDurableObject };

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
        // Normalize path to remove trailing slash for consistent matching
        let pathname = url.pathname;
        if (pathname.endsWith('/') && pathname.length > 1) {
            pathname = pathname.slice(0, -1);
        }
        const pathParts = pathname.split('/').filter(part => part);

        // Handle image upload
        if (pathname === '/upload' && request.method === 'POST') {
            try {
                if (!env.R2_BUCKET) {
                    console.error('R2_BUCKET is not bound in environment.');
                    return new Response('Server configuration error: R2_BUCKET not bound.', { status: 500 });
                }
                const filename = request.headers.get('X-Filename') || `upload-${Date.now()}`;
                
                const object = await env.R2_BUCKET.put(filename, request.body, {
                    httpMetadata: request.headers,
                });
                
                const publicUrl = `${new URL(request.url).origin}/${object.key}`;
                
                return new Response(JSON.stringify({ url: publicUrl }), {
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                console.error('Upload error:', error.stack);
                return new Response('Error uploading file.', { status: 500 });
            }
        }

        // Handle AI explanation request using DeepSeek API
        if (pathname === '/ai-explain' && request.method === 'POST') {
            try {
                const requestBody = await request.json();
                const text = requestBody.text;

                if (!text) {
                    console.error('AI explanation: Missing text in request body.');
                    return new Response('Missing text in request body.', { status: 400 });
                }

                // Use DEEPSEEK_API_KEY from environment variables
                const DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY; 
                if (!DEEPSEEK_API_KEY) {
                    console.error('AI explanation: DEEPSEEK_API_KEY is not set in environment variables.');
                    return new Response('Server configuration error: DEEPSEEK_API_KEY is not set.', { status: 500 });
                }
                console.log('AI explanation: DEEPSEEK_API_KEY loaded.');

                // DeepSeek API endpoint for chat completions
                const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

                const deepseekResponse = await fetch(DEEPSEEK_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // Add authorization header with DeepSeek API key
                        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                    },
                    body: JSON.stringify({
                        // Use the recommended model for chat
                        model: "deepseek-chat", 
                        messages: [
                            {
                                // System message to guide the AI
                                role: "system",
                                content: "You are a helpful assistant that explains text concisely and clearly."
                            },
                            {
                                // User message containing the text to explain
                                role: "user",
                                content: `解释以下文本：${text}`
                            }
                        ],
                        // Optional: control creativity and length
                        // temperature: 0.7, 
                        // max_tokens: 500 
                    })
                });

                if (!deepseekResponse.ok) {
                    const errorText = await deepseekResponse.text();
                    console.error(`AI explanation: DeepSeek API error: ${deepseekResponse.status} - ${errorText}`);
                    return new Response(`DeepSeek API error: ${errorText}`, { status: deepseekResponse.status });
                }

                const deepseekData = await deepseekResponse.json();
                
                // Extract the explanation from the response, using optional chaining for safety
                const explanation = deepseekData?.choices?.[0]?.message?.content;

                if (!explanation) {
                    console.error('AI explanation: Unexpected DeepSeek API response structure or missing explanation:', JSON.stringify(deepseekData));
                    return new Response('Unexpected AI response format.', { status: 500 });
                }

                return new Response(JSON.stringify({ explanation }), {
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                console.error('AI explanation request error:', error.stack); 
                return new Response('Error processing AI explanation request.', { status: 500 });
            }
        }

        // If the root path is accessed, guide the user to join a room.
        if (pathParts.length === 0) {
            return new Response('Welcome! Please access /&lt;room-name&gt; to join a chat room.', { status: 200 });
        }

        // Use the first path segment as the chat room's unique ID
        const roomName = pathParts[0];

        // Check if the request is a WebSocket upgrade request
        const upgradeHeader = request.headers.get("Upgrade");
        if (upgradeHeader === "websocket") {
            console.log(`Routing WebSocket for room [${roomName}] to Durable Object...`);
            if (!env.CHAT_ROOM_DO) {
                console.error('CHAT_ROOM_DO is not bound in environment.');
                return new Response('Server configuration error: CHAT_ROOM_DO not bound.', { status: 500 });
            }
            const doId = env.CHAT_ROOM_DO.idFromName(roomName);
            const stub = env.CHAT_ROOM_DO.get(doId);
            return stub.fetch(request);
        }

        // For all other GET requests that haven't matched specific API routes or WebSocket upgrades,
        // serve the single-page application HTML.
        return new Response(html, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
    },
};