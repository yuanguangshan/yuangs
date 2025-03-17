// 等待页面完全加载
// 页面加载完成后执行
window.onload = function() {
  // 确保我们在知乎文章页面
  if (window.location.href.includes('zhihu.com/p/') || window.location.href.includes('zhihu.com/question/')) {
    // 延迟执行，确保知乎的动态内容已加载
    setTimeout(() => {
      addCopyButton();
      addReadingProgress();
      // generateArticleSummary();
      // setupKeywordHighlight();
      // addReadAloudButton();
    }, 2000);
  }
};

// 由于知乎页面可能会动态加载内容，我们也监听页面变化
let observer = new MutationObserver(function(mutations) {
  // 检查页面变化，可能有新的回答或文章加载
  addCopyButton();
});

// 开始观察页面变化
observer.observe(document.body, { childList: true, subtree: true });

// 添加复制按钮的函数
function addCopyButton() {
  // 查找所有文章内容区域
  let articleContents = [];
  
  // 针对不同类型的知乎页面选择不同的内容选择器
  if (window.location.href.includes('zhihu.com/p/')) {
    // 普通文章页
    articleContents = Array.from(document.querySelectorAll('.Post-RichTextContainer, .RichText'));
  } else if (window.location.href.includes('zhihu.com/question/')) {
    // 问答页面，选择所有回答
    articleContents = Array.from(document.querySelectorAll('.AnswerItem .RichText, .ContentItem-RichText'));
  }
  
  // 为每个找到的文章内容添加复制按钮
  articleContents.forEach(articleContent => {
    // 检查这个特定内容元素是否已经有了关联的复制按钮
    // 我们通过查找其父元素或相关元素中是否已有按钮来判断
    const parentElement = articleContent.closest('.ContentItem') || articleContent.closest('.Post-content') || articleContent.parentElement;
    if (parentElement && parentElement.querySelector('.zhihu-copy-button')) {
      return; // 如果已经有按钮，跳过这个内容元素
    }
    
    // 计算阅读时间（假定每分钟阅读200字）
    const contentText = articleContent.innerText;
    const wordCount = contentText.length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200)); // 最少1分钟
    
    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'zhihu-copy-button';
    copyButton.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>';
    copyButton.title = `复制文章内容 (阅读时间约${readingTimeMinutes}分钟)`;
    
    // 创建阅读时间指示器
    const readingTime = document.createElement('span');
    readingTime.className = 'reading-time-indicator';
    readingTime.textContent = readingTimeMinutes;
    
    // 添加点击事件，使用闭包保存对当前文章内容的引用
    copyButton.addEventListener('click', function() {
      copyArticleContent(articleContent);
    });
    
    // 找到合适的位置插入按钮
    // 首先尝试找到当前文章/回答的操作栏
    let articleHeader;
    
    // 对于回答，查找其操作栏
    if (parentElement) {
      articleHeader = parentElement.querySelector('.ContentItem-actions') || 
                     parentElement.querySelector('.Post-Header') || 
                     parentElement.querySelector('.QuestionHeader-main');
    }
    
    // 如果找不到特定的操作栏，就使用内容元素的父元素
    if (!articleHeader) {
      articleHeader = articleContent.parentElement;
    }
    
    if (articleHeader) {
      // 创建一个容器来放置按钮，以便于定位
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'zhihu-copy-button-container';
      buttonContainer.appendChild(copyButton);
      buttonContainer.appendChild(readingTime);
      
      // 将按钮容器插入到文章头部或内容区域的前面
      articleHeader.appendChild(buttonContainer);
    }
  });
}

// 复制文章内容的函数
function copyArticleContent(articleElement) {
  if (!articleElement) return;
  
  // 获取纯文本内容
  let content = articleElement.innerText;
  
  // 复制到剪贴板
  navigator.clipboard.writeText(content)
    .then(() => {
      // 显示复制成功的提示
      showCopySuccessMessage();
      // 发送到PushDeer
      sendToPushDeer(content);
    })
    .catch(err => {
      console.error('复制失败:', err);
      // 使用备用方法
      fallbackCopy(content);
    });
}

// 备用的复制方法（兼容性更好）
function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';  // 避免滚动到底部
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showCopySuccessMessage();
    } else {
      console.error('复制失败');
    }
  } catch (err) {
    console.error('复制出错:', err);
  }
  
  document.body.removeChild(textArea);
}

// 显示复制成功的提示消息
function showCopySuccessMessage() {
  // 检查是否已存在提示，避免重复创建
  let toast = document.querySelector('.zhihu-copy-toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'zhihu-copy-toast';
    document.body.appendChild(toast);
  }
  
  toast.textContent = '文章内容已复制到剪贴板';
  toast.classList.add('show');
  
  // 2秒后隐藏提示
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// 添加选择性复制功能
document.body.addEventListener('mouseup', function(e) {
  // 检查是否在知乎页面的内容区域内
  if (!isInArticleContent(e.target)) return;
  
  // 获取选中的文本
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  // 如果有选中的文本，显示浮动复制按钮
  if (selectedText.length > 0) {
    // 移除可能已存在的浮动按钮
    removeExistingFloatingButton();
    
    // 创建新的浮动复制按钮
    const floatingButton = createFloatingCopyButton(selectedText);
    
    // 定位按钮到选中文本附近
    positionFloatingButton(floatingButton, selection);
    
    // 添加到DOM
    document.body.appendChild(floatingButton);
    
    // 点击文档其他区域时移除按钮
    document.addEventListener('mousedown', handleOutsideClick);
  }
});

// 检查元素是否在文章内容区域
function isInArticleContent(element) {
  const contentSelectors = ['.Post-RichTextContainer', '.RichText', '.ContentItem-RichText'];
  while (element && element !== document.body) {
    for (const selector of contentSelectors) {
      if (element.matches(selector)) return true;
    }
    element = element.parentElement;
  }
  return false;
}

// 创建浮动复制按钮
function createFloatingCopyButton(textToCopy) {
  const button = document.createElement('div');
  button.className = 'zhihu-floating-copy-button';
  button.innerHTML = `
    <div class="copy-options">
      <button data-format="text">复制文本</button>
      <button data-format="markdown">复制为MD</button>
    </div>
  `;
  
  // 添加点击事件
  button.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function() {
      const format = this.getAttribute('data-format');
      copySelectedText(textToCopy, format);
      removeExistingFloatingButton();
    });
  });
  
  return button;
}

// 定位浮动按钮
function positionFloatingButton(button, selection) {
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  button.style.position = 'absolute';
  button.style.top = `${window.scrollY + rect.top - 40}px`;
  button.style.left = `${window.scrollX + rect.left + rect.width/2}px`;
  button.style.transform = 'translateX(-50%)';
  button.style.zIndex = '10000';
}

// 复制选中的文本
function copySelectedText(text, format) {
  let formattedText = text;
  
  // 根据所选格式处理文本
  if (format === 'markdown') {
    formattedText = `> ${text.replace(/\n/g, '\n> ')}`;
  }
  
  navigator.clipboard.writeText(formattedText)
    .then(() => {
      showCopySuccessMessage(`已复制${format === 'markdown' ? 'Markdown' : '文本'}`);
      // 发送到PushDeer
      sendToPushDeer(formattedText);
    })
    .catch(err => {
      console.error('复制失败:', err);
      fallbackCopy(formattedText);
    });
}

// 移除之前的浮动按钮
function removeExistingFloatingButton() {
  const existingButton = document.querySelector('.zhihu-floating-copy-button');
  if (existingButton) {
    existingButton.remove();
    document.removeEventListener('mousedown', handleOutsideClick);
  }
}

// 处理在按钮外点击的事件
function handleOutsideClick(e) {
  const floatingButton = document.querySelector('.zhihu-floating-copy-button');
  if (floatingButton && !floatingButton.contains(e.target)) {
    removeExistingFloatingButton();
  }
}
// 添加阅读进度条
function addReadingProgress() {
  // 检查是否已存在进度条
  if (document.querySelector('.zhihu-reading-progress')) return;
  
  // 创建进度条元素
  const progressBar = document.createElement('div');
  progressBar.className = 'zhihu-reading-progress';
  document.body.appendChild(progressBar);
  
  // 监听滚动事件更新进度条
  window.addEventListener('scroll', updateReadingProgress);
  
  // 初始更新一次
  updateReadingProgress();
}

// 更新阅读进度条
function updateReadingProgress() {
  const progressBar = document.querySelector('.zhihu-reading-progress');
  if (!progressBar) return;
  
  // 获取当前正在阅读的文章元素
  let currentArticle = getCurrentArticle();
  if (!currentArticle) return;
  
  // 获取文章元素的位置和尺寸信息
  const articleRect = currentArticle.getBoundingClientRect();
  const articleTop = articleRect.top + window.scrollY;
  const articleHeight = currentArticle.offsetHeight;
  
  // 计算当前视口在文章中的位置
  const windowHeight = window.innerHeight;
  const scrollTop = window.scrollY;
  
  // 计算阅读进度（相对于文章内容）
  let progress = 0;
  
  // 如果已经滚动超过文章顶部
  if (scrollTop > articleTop) {
    // 计算已阅读的文章部分
    const readHeight = scrollTop + windowHeight - articleTop;
    // 计算进度百分比，考虑窗口高度
    progress = Math.min(readHeight / (articleHeight + windowHeight), 1) * 100;
  }
  
  // 更新进度条宽度
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}

// 获取当前正在阅读的文章元素
function getCurrentArticle() {
  let articleContents = [];
  
  // 针对不同类型的知乎页面选择不同的内容选择器
  if (window.location.href.includes('zhihu.com/p/')) {
    // 普通文章页
    articleContents = Array.from(document.querySelectorAll('.Post-RichTextContainer, .RichText'));
  } else if (window.location.href.includes('zhihu.com/question/')) {
    // 问答页面，选择所有回答
    articleContents = Array.from(document.querySelectorAll('.AnswerItem .RichText, .ContentItem-RichText'));
  }
  
  if (articleContents.length === 0) return null;
  
  // 如果只有一篇文章，直接返回
  if (articleContents.length === 1) return articleContents[0];
  
  // 如果有多篇文章/回答，找出当前在视口中最显眼的一个
  const windowHeight = window.innerHeight;
  const scrollTop = window.scrollY;
  const viewportCenter = scrollTop + windowHeight / 2;
  
  let bestArticle = null;
  let bestVisibility = -Infinity;
  
  for (const article of articleContents) {
    const rect = article.getBoundingClientRect();
    const articleTop = rect.top + window.scrollY;
    const articleBottom = articleTop + article.offsetHeight;
    
    // 计算文章在视口中的可见部分
    const visibleTop = Math.max(articleTop, scrollTop);
    const visibleBottom = Math.min(articleBottom, scrollTop + windowHeight);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    
    // 计算文章中心点与视口中心点的距离
    const articleCenter = articleTop + article.offsetHeight / 2;
    const distanceToCenter = Math.abs(articleCenter - viewportCenter);
    
    // 可见度评分：可见高度减去与中心的距离（加权）
    const visibility = visibleHeight - distanceToCenter * 0.5;
    
    if (visibility > bestVisibility) {
      bestVisibility = visibility;
      bestArticle = article;
    }
  }
  
  return bestArticle;
}

// 发送内容到PushDeer
function sendToPushDeer(content) {
  // 获取存储的PushDeer Key
  chrome.storage.sync.get(['pushDeerKey', 'enablePushDeer'], function(result) {
    // 检查是否启用了PushDeer功能
    if (!result.enablePushDeer || !result.pushDeerKey) {
      console.log('PushDeer功能未启用或未设置Key');
      return;
    }
    
    // 处理内容，确保中文字符正确编码
    let processedContent = content;
    if (content && content.length > 5000) {
      processedContent = content.substring(0, 5000) + '...(内容已截断)'; // 限制长度，避免请求过大
    }
    
    // 准备发送的数据
    const pushDeerMessage = {
      pushkey: result.pushDeerKey,
      text: "知乎精选-by 苑广山知乎助手",
      desp: processedContent,
      type: "text"
    };
    
    // 发送请求到PushDeer服务器
    fetch('https://www.889.ink/message/push', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(pushDeerMessage)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`PushDeer服务器响应错误: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.code === 0) {
        console.log('PushDeer发送成功:', data);
      } else {
        console.error('PushDeer发送失败:', data.error || '未知错误');
      }
    })
    .catch(error => {
      console.error('PushDeer发送失败:', error);
    });
  });
}

// 以下是文件结尾