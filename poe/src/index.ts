// Type definitions
interface Message {
  role: string;
  content?: string;
  rawContent?: string;
  timestamp?: number;
  model?: string;
}

interface ConversationData {
  id: string;
  title: string;
  model: string;
  timestamp: number;
  messages?: Message[];
}

interface FileUploadData {
  id: string;
  title?: string;
  model?: string;
  timestamp?: number;
  messages?: Message[];
}

interface ProcessedContent {
  content: string;
  lineCount: number;
  isLargeFile: boolean;
  fileSize: number;
}

// src/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS, DELETE, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-ID",
  "Access-Control-Max-Age": "86400"
};

var jsonResponse = /* @__PURE__ */ function(data: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", ...extraHeaders }
  });
};

var index_default = {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Handle OPTIONS request for CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check endpoint
    if (pathname === "/api/health" || pathname === "/health") {
      return jsonResponse({ status: "ok", timestamp: Date.now() });
    }

    // API Routes
    if (pathname.startsWith("/api/") || pathname.startsWith("/v1/")) {
      
      // 1. Conversation History List (GET) & Create/Update (POST)
      if (pathname.replace(/\/$/, "") === "/api/history") {
        try {
          if (request.method === "GET") {
            const results = await env.DB.prepare(
              "SELECT id, title, model, created_at FROM conversations ORDER BY created_at DESC LIMIT 50"
            ).all();
            return jsonResponse(
              (results.results || []).map((c: any) => ({ ...c, timestamp: c.created_at })),
              200,
              { "Cache-Control": "public, max-age=5" }
            );
          }
          if (request.method === "POST") {
            const data = await request.json() as ConversationData;
            if (!data.id) return jsonResponse({ error: "Missing ID" }, 400);
            
            const batch: any[] = [];
            const timestamp = data.timestamp || Date.now();
            
            // Upsert conversation metadata
            batch.push(
              env.DB.prepare(
                "INSERT INTO conversations (id, title, model, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, model=excluded.model"
              ).bind(data.id, data.title || "New Chat", data.model || "GPT-4o-mini", timestamp)
            );

            // Helper function to count lines and get first 1000 lines
            const processMessageContent = (fullContent: string): ProcessedContent => {
              const lines = fullContent.split('\n');
              const lineCount = lines.length;
              
              // Only save first 1000 lines if content is too large
              const contentToSave = lineCount > 1000 ? lines.slice(0, 1000).join('\n') : fullContent;
              
              return {
                content: contentToSave,
                lineCount: lineCount,
                isLargeFile: lineCount > 1000,
                fileSize: new Blob([fullContent]).size
              };
            };
            
            // Batch insert messages with line count optimization
            if (data.messages && Array.isArray(data.messages)) {
              const stmt = env.DB.prepare(
                "INSERT INTO messages (conversation_id, role, content, raw_content, timestamp, model, is_large_file, ai_summary, file_original_size, line_count, r2_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(conversation_id, role, timestamp) DO UPDATE SET content=excluded.content, raw_content=excluded.raw_content, model=excluded.model, is_large_file=excluded.is_large_file, ai_summary=excluded.ai_summary, file_original_size=excluded.file_original_size, line_count=excluded.line_count, r2_key=excluded.r2_key"
              );

              for (const msg of data.messages) {
                // 1. 获取 HTML 内容 (msg.content) 和 Markdown 源码 (msg.rawContent)
                const htmlContent = msg.content || "";
                const markdownContent = msg.rawContent || msg.content || ""; // 兜底
                
                // 2. 处理内容（行数统计、大文件判断基于 Markdown）
                const contentInfo = processMessageContent(markdownContent);

                let r2Key = null;
                // ✨ Support: 大文件上传到 R2 (存 Markdown 完整版)
                if (contentInfo.isLargeFile && env.R2_BUCKET) {
                  r2Key = `chats/${data.id}/${msg.timestamp || Date.now()}.txt`;
                  try {
                    await env.R2_BUCKET.put(r2Key, markdownContent, {
                      customMetadata: {
                        conversation_id: data.id,
                        role: msg.role,
                        size: contentInfo.fileSize.toString()
                      }
                    });
                  } catch (r2Err) {
                    console.error("R2 upload error:", r2Err);
                  }
                }

                // 3. 绑定字段：content 存 HTML，raw_content 存 Markdown
                batch.push(stmt.bind(
                  data.id,
                  msg.role,
                  htmlContent, // 保持美观的 HTML 格式
                  r2Key ? `[Content moved to R2 Storage: ${r2Key}]` : markdownContent,
                  msg.timestamp || timestamp,
                  msg.model || null,
                  contentInfo.isLargeFile ? 1 : 0,
                  null, // ai_summary placeholder
                  contentInfo.fileSize,
                  contentInfo.lineCount,
                  r2Key
                ));
              }
            }
            
            await env.DB.batch(batch);
            return jsonResponse({ success: true });
          }
        } catch (e: any) {
          return jsonResponse({ error: `DB Error: ${e}` }, 500);
        }
      }

      // 2. Specific Message Deletion by Database ID (Most Reliable)
      if (pathname.match(/^\/api\/messages\/\d+$/)) {
        if (request.method === "DELETE") {
          const messageId = pathname.split("/").pop() || "";
          try {
            const result = await env.DB.prepare(
              "DELETE FROM messages WHERE id = ?"
            ).bind(messageId).run();

            if (result.success) {
              return jsonResponse({ success: true, deleted: result.meta.changes > 0, id: messageId });
            } else {
              return jsonResponse({ error: "Database error during deletion" }, 500);
            }
          } catch (e: any) {
            return jsonResponse({ error: `Delete Message Error: ${e}` }, 500);
          }
        }
      }

      // 3. Specific Message Deletion by Timestamp (Fallback)
      if (pathname.match(/^\/api\/history\/[^/]+\/messages\/\d+$/)) {
        if (request.method === "DELETE") {
          try {
            const parts = pathname.split("/");
            const timestampStr = parts.pop() || "0";
            parts.pop(); // remove 'messages'
            const conversationId = parts.pop() || "";
            
            // 修复：显式转换为 BigInt/Number 以确保与 DB 中的 INTEGER 类型匹配
            const timestamp = parseInt(timestampStr);
            
            const result = await env.DB.prepare(
              "DELETE FROM messages WHERE conversation_id = ? AND timestamp = ?"
            ).bind(conversationId, timestamp).run();

            if (result.success) {
              return jsonResponse({ success: true, deleted: result.meta.changes > 0, timestamp });
            } else {
              return jsonResponse({ error: "Database error during deletion" }, 500);
            }
          } catch (e: any) {
            return jsonResponse({ error: `Delete Message Error: ${e}` }, 500);
          }
        }
      }

      // 4. Single Conversation Operations
      if (pathname.startsWith("/api/history/")) {
        const id = pathname.split("/").pop() || "";

        if (request.method === "GET") {
          const url2 = new URL(request.url);
          const offset = parseInt(url2.searchParams.get("offset") || "0");
          const limit = parseInt(url2.searchParams.get("limit") || "20");
          
          const countResult = await env.DB.prepare(
            "SELECT COUNT(*) as count FROM messages WHERE conversation_id = ?"
          ).bind(id).first();
          
          const totalCount = countResult.count;
          const actualOffset = Math.max(0, totalCount - limit - offset);
          
          const msgResult = await env.DB.prepare(
            "SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC LIMIT ? OFFSET ?"
          ).bind(id, limit, actualOffset).all();
          
          const conv = await env.DB.prepare(
            "SELECT * FROM conversations WHERE id = ?"
          ).bind(id).first();
          
          if (!conv) {
             return jsonResponse({ error: "Conversation not found" }, 404);
          }

          return jsonResponse({
            ...conv,
            messages: msgResult.results,
            totalCount,
            offset: actualOffset,
            limit
          });
        }

        if (request.method === "DELETE") {
          await env.DB.batch([
            env.DB.prepare("DELETE FROM messages WHERE conversation_id = ?").bind(id),
            env.DB.prepare("DELETE FROM conversations WHERE id = ?").bind(id)
          ]);
          return jsonResponse({ success: true });
        }

        if (request.method === "PATCH") {
          const data = await request.json();
          if (!data.title) return jsonResponse({ error: "Missing title" }, 400);
          await env.DB.prepare("UPDATE conversations SET title = ? WHERE id = ?").bind(data.title, id).run();
          return jsonResponse({ success: true });
        }
      }

      // 5. Stats Endpoints
      if (pathname.startsWith("/api/stats/")) {
        if (request.method === "GET") {
          const statType = pathname.split("/").pop() || "";
          if (statType === "client-usage") {
            const results = await env.DB.prepare(
              "SELECT client_id, COUNT(*) as count FROM api_logs GROUP BY client_id ORDER BY count DESC"
            ).all();
            return jsonResponse({
              clientUsage: (results.results || []).map((r: any) => ({
                clientId: r.client_id,
                count: r.count
              }))
            });
          } else if (statType === "recent-logs") {
            const results = await env.DB.prepare(
              "SELECT client_id, path, method, timestamp FROM api_logs ORDER BY timestamp DESC LIMIT 20"
            ).all();
            return jsonResponse({
              recentLogs: results.results || []
            });
          }
        }
        return jsonResponse({ error: `Stats endpoint not found: ${pathname}` }, 404);
      }

      // 6. OpenAI API Proxy
      let targetPath = pathname;
      if (targetPath.startsWith("/api/v1/")) {
        targetPath = targetPath.replace("/api/", "/");
      }
      
      if (!targetPath.startsWith("/v1/")) {
        return jsonResponse({ error: `Route not found: ${pathname}` }, 404);
      }

      const targetUrl = new URL(targetPath, "https://aiproxy.want.biz");
      url.searchParams.forEach((value: string, key: string) => targetUrl.searchParams.append(key, value));
      
      const proxyHeaders = new Headers(request.headers);
      const clientId = proxyHeaders.get("X-Client-ID") || "unknown";
      
      ["Host", "Referer", "Origin", "cf-connecting-ip"].forEach((h: string) => proxyHeaders.delete(h));
      
      try {
        await env.DB.prepare(
          "INSERT INTO api_logs (client_id, path, method, timestamp) VALUES (?, ?, ?, ?)"
        ).bind(clientId, targetPath, request.method, Date.now()).run();
      } catch (logErr: any) {
        console.warn("Failed to log API call:", logErr);
      }

      try {
        const response = await fetch(targetUrl.toString(), {
          method: request.method,
          headers: proxyHeaders,
          body: request.body,
          redirect: "follow"
        });
        
        const newHeaders = new Headers(response.headers);
        Object.entries(corsHeaders).forEach(([k, v]: [string, string]) => newHeaders.set(k, v));
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders
        });
      } catch (e: any) {
        return jsonResponse({ error: { message: `Proxy error: ${e}` } }, 500);
      }
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    
    return new Response("Not Found", { status: 404 });
  }
};

export {
  index_default as default
};