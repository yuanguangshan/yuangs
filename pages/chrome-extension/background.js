// 处理来自popup的网络请求
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Background script received message:", request);
  
  if (request.action === "fetchData") {
    console.log("Fetching data from:", request.url);
    
    // 设置请求选项
    const fetchOptions = request.options || {};
    
    // 执行请求
    fetch(request.url, fetchOptions)
      .then(response => {
        // 获取响应状态
        const status = response.status;
        const ok = response.ok;
        
        // 根据content-type决定如何处理响应
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          return response.json().then(data => {
            return { data, status, ok, contentType: 'json' };
          });
        } else {
          return response.text().then(text => {
            return { data: text, status, ok, contentType: 'text' };
          });
        }
      })
      .then(result => {
        console.log("Fetch succeeded:", result.status);
        sendResponse({ 
          success: true, 
          ...result
        });
      })
      .catch(error => {
        console.error("Fetch failed:", error);
        sendResponse({ 
          success: false, 
          error: error.toString() 
        });
      });
    
    return true; // 保持消息通道开放，异步返回
  }
});

// 后台脚本初始化消息
console.log("Market data extension background script initialized");