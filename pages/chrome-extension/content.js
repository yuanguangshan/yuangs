// 等待页面完全加载
// 页面加载完成后执行
window.onload = function() {
  // 扩展匹配条件，包括首页
  if (window.location.href.includes('zhihu.com/p/') || 
      window.location.href.includes('zhihu.com/question/') || 
      window.location.href.includes('zhihu.com/')|| 
      window.location.href.includes('zhihu.com/people/')) {
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
  }else if (window.location.href.includes('zhihu.com/people/')) {
    // 个人页面，选择所有回答
    articleContents = Array.from(document.querySelectorAll('.AnswerItem .RichText, .ContentItem-RichText'));
  }  else if (window.location.href.includes('zhihu.com/')) {
    // 首页，选择卡片中的内容
    articleContents = Array.from(document.querySelectorAll('.Feed .RichContent .RichText, .ContentItem-RichText'));
  }
  
  // 为每个找到的文章内容添加复制按钮
  articleContents.forEach(articleContent => {
    // 检查这个特定内容元素是否已经有了关联的复制按钮
    // 我们通过查找其父元素或相关元素中是否已有按钮来判断
    const parentElement = articleContent.closest('.ContentItem') || articleContent.closest('.Post-content') || articleContent.closest('.Feed-item') || articleContent.parentElement;
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
                     parentElement.querySelector('.QuestionHeader-main') ||
                     parentElement.querySelector('.Feed-meta'); // 首页的操作栏
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

// 复制文章内容的函数 - 改进版
function copyArticleContent(articleElement) {
  if (!articleElement) return;
  
  // 显示初始提示
  showCopySuccessMessage('正在准备内容...');
  
  // 检查是否有阅读全文按钮
  let expandButton = findExpandButton(articleElement);
  
  if (expandButton) {
    // 如果找到了展开按钮，先点击展开，然后等待内容加载完成后再复制
    console.log('发现阅读全文按钮，尝试展开...');
    showCopySuccessMessage('正在展开全文...');
    
    // 1. 先创建原始内容的深拷贝，确保我们有一个基准来比较
    const originalContent = articleElement.cloneNode(true);
    const originalTextLength = originalContent.innerText.length;
    console.log('原始内容长度:', originalTextLength);
    
    // 2. 设置展开处理状态
    let expandAttempts = 0;
    const maxExpandAttempts = 8; // 增加最大尝试次数
    let contentChanged = false;
    let lastContentLength = originalTextLength;
    let stabilityCount = 0;
    const requiredStability = 3; // 内容需要稳定这么多次才认为展开完成
    
    // 3. 创建一个记录完全展开内容的变量
    let fullyExpandedContent = null;
    
    // 4. 设置更长的监听时间，确保所有内容都已展开
    const expandCompletionTimeout = 4000; // 2秒总超时
    
    // 5. 创建一个MutationObserver来监听内容变化
    const contentObserver = new MutationObserver((mutations) => {
      // 获取当前内容长度
      const currentText = articleElement.innerText;
      const currentLength = currentText.length;
      
      // 检查内容是否有明显变化
      if (currentLength > lastContentLength * 1.05) { // 内容增加了至少5%
        console.log(`内容长度变化: ${lastContentLength} -> ${currentLength}`);
        lastContentLength = currentLength;
        contentChanged = true;
        stabilityCount = 0; // 重置稳定计数
        
        // 尝试查找更多展开按钮
        setTimeout(() => {
          const newExpandButton = findExpandButton(articleElement);
          if (newExpandButton && expandAttempts < maxExpandAttempts) {
            console.log(`尝试点击新的展开按钮 (尝试 ${expandAttempts + 1}/${maxExpandAttempts})`);
            expandAttempts++;
            newExpandButton.click();
          }
        }, 500);
      } else {
        // 内容没有明显变化，可能已经稳定
        stabilityCount++;
        console.log(`内容稳定计数: ${stabilityCount}/${requiredStability}`);
        
        // 如果内容已经稳定了足够次数，认为展开完成
        if (stabilityCount >= requiredStability) {
          // 保存完全展开的内容
          fullyExpandedContent = articleElement.innerText;
          console.log('内容已完全展开且稳定，长度:', fullyExpandedContent.length);
          
          // 停止观察
          contentObserver.disconnect();
          
          // 复制完全展开的内容
          copyTextToClipboard(fullyExpandedContent);
          showCopySuccessMessage(`已复制完整内容 (${fullyExpandedContent.length}字符)`);
        }
      }
    });
    
    // 6. 开始观察文章元素的变化
    contentObserver.observe(articleElement, {
      childList: true, 
      subtree: true, 
      characterData: true,
      attributes: true
    });
    
    // 7. 点击第一个展开按钮
    expandButton.click();
    expandAttempts++;
    
    // 8. 设置主超时，确保不会无限等待
    setTimeout(() => {
      // 停止观察
      contentObserver.disconnect();
      
      // 如果已经有完全展开的内容，使用它
      if (fullyExpandedContent) {
        console.log('使用已捕获的完全展开内容');
        return; // 已经处理过了，不需要再次复制
      }
      
      // 检查内容是否有变化
      if (contentChanged) {
        // 如果内容有变化但未达到稳定状态，使用当前内容
        const finalContent = articleElement.innerText;
        console.log('展开超时，使用当前内容，长度:', finalContent.length);
        copyTextToClipboard(finalContent);
        showCopySuccessMessage(`已复制内容 (${finalContent.length}字符)`);
      } else {
        // 如果内容没有变化，可能展开失败，使用原始内容
        console.log('展开似乎失败，使用原始内容');
        copyTextToClipboard(articleElement.innerText);
        showCopySuccessMessage('已复制当前可见内容');
      }
    }, expandCompletionTimeout);
    
    // 9. 额外的展开尝试，确保尽可能捕获到所有内容
    const expandInterval = setInterval(() => {
      // 如果已经完成或达到最大尝试次数，停止尝试
      if (fullyExpandedContent || expandAttempts >= maxExpandAttempts) {
        clearInterval(expandInterval);
        return;
      }
      
      // 查找新的展开按钮
      const newExpandButton = findExpandButton(articleElement);
      if (newExpandButton) {
        console.log(`定时尝试点击展开按钮 (尝试 ${expandAttempts + 1}/${maxExpandAttempts})`);
        expandAttempts++;
        newExpandButton.click();
      }
    }, 1000); // 每秒尝试一次
    
  } else {
    // 如果没有展开按钮，直接获取当前内容
    console.log('没有发现展开按钮，直接复制当前内容');
    const content = articleElement.innerText;
    copyTextToClipboard(content);
    showCopySuccessMessage(`已复制内容 (${content.length}字符)`);
  }
}

// 查找文章中的展开全文按钮
function findExpandButton(articleElement) {
  // 尝试多种可能的选择器来查找展开按钮
  // 知乎的展开按钮可能有多种类名和结构
  
  // 1. 直接在文章元素内查找
  let expandButton = articleElement.querySelector('.ContentItem-expandButton') || 
                     articleElement.querySelector('.RichContent-expandButton') || 
                     articleElement.querySelector('.RichContent-collapsedText') ||
                     articleElement.querySelector('.Button.Button--plain.ContentItem-more') ||
                     articleElement.querySelector('[role="button"][class*="expand"]') ||
                     articleElement.querySelector('.RichContent-actions button') ||
                     articleElement.querySelector('.ContentItem-actions button[class*="Button"]') ||
                     articleElement.querySelector('.FoldButton') ||
                     articleElement.querySelector('.ViewAll') ||
                     articleElement.querySelector('.RichContent--unescapable .ContentItem-rightButton');
  
  if (expandButton) return expandButton;
  
  // 2. 检查是否有折叠的内容区域
  const collapsedContent = articleElement.querySelector('.RichContent-inner.is-collapsed') ||
                          articleElement.querySelector('.is-collapsed') ||
                          articleElement.querySelector('[class*="collapsed"]');
  if (collapsedContent) {
    // 如果找到折叠内容，查找其中或附近的按钮
    const nearbyButton = collapsedContent.querySelector('button') || 
                        collapsedContent.nextElementSibling?.querySelector('button') ||
                        collapsedContent.parentElement?.querySelector('button');
    if (nearbyButton) return nearbyButton;
  }
  
  // 3. 查找包含"阅读全文"或"展开阅读"文本的按钮或元素
  const textPatterns = ['阅读全文', '展开阅读', '查看全部', '显示全部', '展开', '更多', '全文'];
  
  // 3.1 检查按钮
  const allButtons = articleElement.querySelectorAll('button, [role="button"]');
  for (const button of allButtons) {
    const buttonText = button.textContent.trim();
    if (textPatterns.some(pattern => buttonText.includes(pattern))) {
      return button;
    }
  }
  
  // 3.2 检查链接
  const allLinks = articleElement.querySelectorAll('a');
  for (const link of allLinks) {
    const linkText = link.textContent.trim();
    if (textPatterns.some(pattern => linkText.includes(pattern))) {
      return link;
    }
  }
  
  // 3.3 检查任何可能是按钮的元素
  const allClickables = articleElement.querySelectorAll('[class*="button"], [class*="Button"], [class*="more"], [class*="More"]');
  for (const element of allClickables) {
    const elementText = element.textContent.trim();
    if (textPatterns.some(pattern => elementText.includes(pattern))) {
      return element;
    }
  }
  
  // 4. 查找父元素中的展开按钮
  const parentElement = articleElement.closest('.ContentItem') || 
                       articleElement.closest('.Post-content') ||
                       articleElement.closest('.RichContent') ||
                       articleElement.closest('.Feed-item');
  if (parentElement) {
    // 4.1 在父元素中查找按钮
    expandButton = parentElement.querySelector('.ContentItem-expandButton') || 
                  parentElement.querySelector('.RichContent-expandButton') ||
                  parentElement.querySelector('.Button.Button--plain.ContentItem-more') ||
                  parentElement.querySelector('[role="button"][class*="expand"]') ||
                  parentElement.querySelector('.RichContent-actions button') ||
                  parentElement.querySelector('.ContentItem-actions button[class*="Button"]');
    if (expandButton) return expandButton;
    
    // 4.2 在父元素中查找折叠内容
    const parentCollapsed = parentElement.querySelector('.RichContent-inner.is-collapsed') ||
                           parentElement.querySelector('.is-collapsed') ||
                           parentElement.querySelector('[class*="collapsed"]');
    if (parentCollapsed) {
      const nearbyButton = parentCollapsed.querySelector('button') || 
                          parentCollapsed.nextElementSibling?.querySelector('button') ||
                          parentCollapsed.parentElement?.querySelector('button');
      if (nearbyButton) return nearbyButton;
    }
    
    // 4.3 在父元素中查找包含特定文本的元素
    const parentButtons = parentElement.querySelectorAll('button, [role="button"], a, [class*="button"], [class*="Button"], [class*="more"], [class*="More"]');
    for (const button of parentButtons) {
      const buttonText = button.textContent.trim();
      if (textPatterns.some(pattern => buttonText.includes(pattern))) {
        return button;
      }
    }
  }
  
  // 没有找到展开按钮
  return null;
}

// 复制文本到剪贴板的通用函数
function copyTextToClipboard(text) {
  // 复制到剪贴板
  navigator.clipboard.writeText(text)
    .then(() => {
      // 显示复制成功的提示
      showCopySuccessMessage(`已复制内容 (${text.length}字符)`);
      // 发送到PushDeer
      sendToPushDeer(text);
      // 保存为本地MD文件--注释的话就不下载，否则下载
      // saveToLocalMD(text);
    })
    .catch(err => {
      console.error('复制失败:', err);
      // 使用备用方法
      fallbackCopy(text);
    });
}

// 保存文本为本地MD文件
function saveToLocalMD(text) {
  // 格式化文本为MD
  const mdText = `> ${text.replace(/\n/g, '\n> ')}`;
  
  // 创建Blob对象
  const blob = new Blob([mdText], { type: 'text/markdown' });
  
  // 生成文件名
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `zhihu-copy-${timestamp}.md`;
  
  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  
  // 触发下载
  document.body.appendChild(a);
  a.click();
  
  // 清理
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
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
      showCopySuccessMessage(`已复制内容 (${text.length}字符)`);
    } else {
      console.error('复制失败');
    }
  } catch (err) {
    console.error('复制出错:', err);
  }
  
  document.body.removeChild(textArea);
}

// 显示复制成功的提示消息
function showCopySuccessMessage(message) {
  // 检查是否已存在提示，避免重复创建
  let toast = document.querySelector('.zhihu-copy-toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'zhihu-copy-toast';
    document.body.appendChild(toast);
  }
  
  // 使用传入的消息或默认消息
  toast.textContent = message || '文章内容已复制到剪贴板';
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
  const contentSelectors = ['.Post-RichTextContainer', '.RichText', '.ContentItem-RichText', '.RichContent'];
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
  } else if (window.location.href.includes('zhihu.com/')) {
    // 首页
    articleContents = Array.from(document.querySelectorAll('.Feed .RichContent, .ContentItem-RichText'));
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
    if (content && content.length > 20000) {
      processedContent = content.substring(0, 20000) + '...(内容已截断)'; // 限制长度，避免请求过大
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

// 添加必要的CSS样式
function addCssStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .zhihu-copy-button-container {
      display: inline-flex;
      align-items: center;
      margin-left: 10px;
      position: relative;
    }
    
    .zhihu-copy-button {
      background-color: #f0f2f5;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      padding: 3px 8px;
      font-size: 12px;
      display: flex;
      align-items: center;
      color: #8590a6;
      transition: all 0.2s;
    }
    
    .zhihu-copy-button:hover {
      background-color: #e5e7eb;
    }
    
    .reading-time-indicator {
      background-color: #0084ff;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      position: absolute;
      top: -6px;
      right: -6px;
    }
    
    .zhihu-copy-toast {
      position: fixed;
      bottom: 10%;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    }
    
    .zhihu-copy-toast.show {
      opacity: 1;
    }
    
    .zhihu-floating-copy-button {
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 8px;
      z-index: 10000;
    }
    
    .copy-options {
      display: flex;
      gap: 8px;
    }
    
    .copy-options button {
      background-color: #f0f2f5;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      padding: 4px 8px;
      font-size: 12px;
      color: #8590a6;
      transition: all 0.2s;
    }
    
    .copy-options button:hover {
      background-color: #e5e7eb;
    }
    
    .zhihu-reading-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background-color: #0084ff;
      z-index: 10000;
      width: 0;
      transition: width 0.2s;
    }
  `;
  document.head.appendChild(style);
}

// 页面加载时添加CSS样式
addCssStyles();