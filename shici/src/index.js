// src/index.js - 基本的 Worker 脚本，用于服务静态文件

export default {
  async fetch(request, env, ctx) {
    // 解析请求的 URL
    const url = new URL(request.url);
    let pathname = url.pathname;

    // 确定要查找的文件路径
    let filePath = pathname.substring(1); // 移除开头的 "/"
    
    // 如果请求的是目录或根路径，则尝试加载 index.html
    if (filePath === '' || filePath.endsWith('/')) {
      filePath += 'index.html';
    }

    try {
      // 尝试从静态资源中获取文件
      let response = await env.ASSETS.fetch(`https://example.com/${filePath}`);
      
      // 如果文件不存在且请求的是 HTML 页面，尝试返回 index.html (用于 SPA)
      if (response.status === 404 && pathname.endsWith('.html')) {
        response = await env.ASSETS.fetch('https://example.com/index.html');
      }
      // 对于非 HTML 请求（如 API 请求），返回 404
      else if (response.status === 404) {
        return new Response('File not found', { status: 404 });
      }

      // 设置适当的 Content-Type
      const contentType = getContentType(filePath);
      if (contentType && !response.headers.get('Content-Type')) {
        response = new Response(response.body, {
          headers: {
            ...response.headers,
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000' // 长期缓存静态资源
          },
          status: response.status
        });
      }

      return response;
    } catch (e) {
      // 如果出现错误，返回 404
      return new Response('File not found', { status: 404 });
    }
  }
};

// 根据文件扩展名确定 Content-Type
function getContentType(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  const contentTypes = {
    'html': 'text/html; charset=utf-8',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'txt': 'text/plain; charset=utf-8',
    'xml': 'application/xml',
    'pdf': 'application/pdf'
  };
  return contentTypes[ext] || 'application/octet-stream';
}