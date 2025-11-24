// ui.js - UI交互逻辑模块
// 处理用户交互、DOM操作和事件监听

import { CONFIG, getRandomColor } from './config.js?v=1.0.1';
import { AUTHOR_DATA, getDynastyByAuthorName } from './author-data.js?v=1.0.1';
import { fetchAndCachePoems, getRandomPoem, getRandomPoems } from './data-loader.js?v=1.0.1';
import { 
    insertLineBreaksAtPunctuation, 
    isRegularPoem, 
    formatCoupletPoem, 
    isArticle, 
    generateTagsHTML 
} from './poem-display.js?v=1.0.1';

// 全局状态
let currentPoem = null;
let allPoems = null;
let filteredPoems = null;

// 初始化UI
export async function initUI() {
    console.log('Initializing UI...');
    
    // 加载诗词数据
    allPoems = await fetchAndCachePoems();
    console.log(`Loaded ${allPoems.length} poems`);
    
    // 初始化作者选择器
    initAuthorSelect();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 首次加载随机诗词
    await loadRandomPoem();
    
    // 不自动初始化瀑布流，等用户点击切换
    // await renderWaterfall();
}

// 初始化作者选择器
function initAuthorSelect() {
    const select = document.getElementById('authorSelect');
    if (!select || !AUTHOR_DATA) return;
    
    // 按朝代分组
    const dynastyGroups = {};
    AUTHOR_DATA.forEach(author => {
        const dynasty = author.dynasty || '未知';
        if (!dynastyGroups[dynasty]) {
            dynastyGroups[dynasty] = [];
        }
        dynastyGroups[dynasty].push(author);
    });
    
    // 朝代顺序
    const dynastyOrder = ['先秦', '汉', '魏晋', '南北朝', '隋', '唐', '五代', '宋', '元', '明', '清', '近现代', '未知'];
    
    dynastyOrder.forEach(dynasty => {
        if (dynastyGroups[dynasty]) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = dynasty;
            
            dynastyGroups[dynasty].forEach(author => {
                const option = document.createElement('option');
                option.value = author.name;
                option.textContent = `${author.name} (${author.titles?.[0] || ''})`;
                optgroup.appendChild(option);
            });
            
            select.appendChild(optgroup);
        }
    });
}

// 绑定事件监听器

function bindEventListeners() {
    // 刷新按钮
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            const waterfallContainer = document.getElementById('waterfallContainer');
            if (waterfallContainer && waterfallContainer.classList.contains('active')) {
                await renderWaterfall();
            } else {
                await loadRandomPoem();
            }
        });
    }
    
    // 浮动刷新按钮
    const floatingRefreshBtn = document.getElementById('floatingRefreshBtn');
    if (floatingRefreshBtn) {
        floatingRefreshBtn.addEventListener('click', async () => {
            const waterfallContainer = document.getElementById('waterfallContainer');
            if (waterfallContainer && waterfallContainer.classList.contains('active')) {
                await renderWaterfall();
            } else {
                await loadRandomPoem();
            }
        });
    }
    
    // 作者选择
    const authorSelect = document.getElementById('authorSelect');
    if (authorSelect) {
        authorSelect.addEventListener('change', async (e) => {
            const selectedAuthor = e.target.value;
            if (selectedAuthor) {
                filteredPoems = allPoems.filter(p => p.auth === selectedAuthor);
                console.log(`Filtered ${filteredPoems.length} poems by ${selectedAuthor}`);
            } else {
                filteredPoems = null;
            }
            await loadRandomPoem();
            await renderWaterfall();
        });
    }
    
    // 清除作者筛选
    const clearAuthor = document.getElementById('clearAuthor');
    if (clearAuthor) {
        clearAuthor.addEventListener('click', async () => {
            if (authorSelect) authorSelect.value = '';
            filteredPoems = null;
            await loadRandomPoem();
            await renderWaterfall();
        });
    }
    
    // 搜索切换
    const searchToggle = document.getElementById('searchToggle');
    if (searchToggle) {
        searchToggle.addEventListener('click', window.toggleSearch);
    }
    
    // 布局切换（瀑布流）
    const layoutToggle = document.getElementById('layoutToggle');
    if (layoutToggle) {
        layoutToggle.addEventListener('click', toggleLayout);
    }
    
    // 主题切换
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // --- 详情页功能按钮 ---
    
    // 复制按钮
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyPoemToClipboard);
    }
    
    // 搜索按钮（跳转）
    const inlineSearchBtn = document.getElementById('inlineSearchBtn');
    if (inlineSearchBtn) {
        inlineSearchBtn.addEventListener('click', () => {
            if (!currentPoem) return;
            const query = `${currentPoem.title} ${currentPoem.auth} 赏析`;
            window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(query)}`, '_blank');
        });
    }
    
    // AI解读按钮
    const aiInterpretBtn = document.getElementById('aiInterpretBtn');
    if (aiInterpretBtn) {
        aiInterpretBtn.addEventListener('click', showAIInterpretation);
    }
    
    // 详情页布局切换（横竖排）
    const layoutToggleBtn = document.getElementById('layoutToggleBtn');
    if (layoutToggleBtn) {
        layoutToggleBtn.addEventListener('click', togglePoemLayout);
    }
    
    // 收藏按钮
    const favoriteToggleBtn = document.getElementById('favoriteToggleBtn');
    if (favoriteToggleBtn) {
        favoriteToggleBtn.addEventListener('click', function() {
            this.textContent = this.textContent === '♡' ? '♥' : '♡';
            this.style.color = this.textContent === '♥' ? 'red' : '';
        });
    }
}

// 加载随机诗词
export async function loadRandomPoem() {
    const poemsToUse = filteredPoems || allPoems;
    if (!poemsToUse || poemsToUse.length === 0) {
        console.error('No poems available');
        return;
    }
    
    currentPoem = getRandomPoem(poemsToUse);
    if (!currentPoem) return;
    
    // 显示诗词
    displayPoem(currentPoem);
}

// 显示诗词
function displayPoem(poem) {
    if (!poem) return;
    
    // 标题
    const titleEl = document.getElementById('poemTitle');
    if (titleEl) {
        titleEl.textContent = poem.title || '无题';
        titleEl.style.color = getRandomColor();
    }
    
    // 作者
    const authorEl = document.getElementById('poemAuthor');
    if (authorEl) {
        const dynasty = getDynastyByAuthorName(poem.auth);
        authorEl.textContent = `${dynasty} · ${poem.auth || '佚名'}`;
    }
    
    // 内容
    const verseEl = document.getElementById('poemVerse');
    const layoutToggleBtn = document.getElementById('layoutToggleBtn');
    
    if (verseEl) {
        // 判断是否为文章
        const isArticleContent = isArticle(poem);
        
        // 重置类名
        verseEl.className = 'poem-verse';
        
        if (isArticleContent) {
            verseEl.classList.add('article-mode');
            verseEl.innerHTML = insertLineBreaksAtPunctuation(poem.content);
            if (layoutToggleBtn) layoutToggleBtn.style.display = 'none'; // 文章不显示切换按钮
        } else {
            // 默认竖排
            verseEl.classList.add('vertical-mode');
            verseEl.innerHTML = insertLineBreaksAtPunctuation(poem.content);
            if (layoutToggleBtn) layoutToggleBtn.style.display = 'inline-block'; // 诗词显示切换按钮
        }
    }

    
    // 标签
    const tagsEl = document.getElementById('poemTags');
    if (tagsEl) {
        tagsEl.innerHTML = generateTagsHTML(poem);
    }
    
    // 赏析
    const descEl = document.getElementById('poemDesc');
    if (descEl) {
        descEl.innerHTML = poem.desc || '暂无赏析';
    }
    
    // 显示内容
    document.getElementById('poemTextContent').style.display = 'block';
    document.getElementById('poemDescContent').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
}

// Analyze poem layout (从原版移植)
function analyzePoemLayout(poem) {
    const content = poem.content.replace(/\\n/g, '').replace(/\s+/g, ''); // Remove literal \n and whitespace
    const sentences = content.split(/[。！？!?]/).filter(s => s.trim() !== '');

    // 1. Check if it's a 5-character or 7-character regulated verse (整齐的格律)
    // Simple check: see if the first line length is 5 or 7
    const firstLineLen = sentences[0] ? sentences[0].replace(/[，,]/g, '').length : 0;
    const isRegular = (firstLineLen === 5 || firstLineLen === 7) &&
        sentences.every(s => {
            const cleanLen = s.replace(/[，,]/g, '').length;
            // 一句可能是5/7字，或者是一联10/14字
            return cleanLen === firstLineLen * 2 || cleanLen === firstLineLen;
        });

    let displayLines = [];
    let layoutMode = 'vertical'; // default mode

    if (isRegular && firstLineLen === 5 || firstLineLen === 7) {
        // Mode 1: Vertical layout for regular 5/7-character poems
        displayLines = sentences.slice(0, 4).map(s => {
            const parts = s.split(/[，,]/);
            return parts.join('');
        });
        layoutMode = 'vertical';
    } else {
        // Mode 2: For ci/irregular poems, horizontal center layout
        // Display first two clauses from first two sentences (simplified)
        if (sentences.length >= 2) {
            displayLines = [sentences[0].split(/[，,]/)[0] || '', sentences[0].split(/[，,]/)[1] || ''];
        } else if (sentences.length === 1) {
            const parts = sentences[0].split(/[，,]/);
            displayLines = [parts[0] || '', parts[1] || ''];
        } else {
            displayLines = ['诗词内容', '诗词内容'];
        }
        layoutMode = 'horizontal-center';
    }

    return {
        lines: displayLines,
        mode: layoutMode,
        title: poem.title,
        author: poem.auth
    };
}

// 渲染瀑布流
async function renderWaterfall() {
    console.log('renderWaterfall called - v20251124-2010'); // Version timestamp
    const waterfallEl = document.getElementById('waterfallContent');
    console.log('waterfallContent element:', waterfallEl);
    if (!waterfallEl) {
        console.error('waterfallContent element not found!');
        return;
    }
    
    const poemsToUse = filteredPoems || allPoems;
    console.log('Poems to use:', poemsToUse ? poemsToUse.length : 'null');
    if (!poemsToUse || poemsToUse.length === 0) {
        console.error('No poems available for waterfall');
        return;
    }
    
    waterfallEl.innerHTML = '';
    
    const randomPoems = getRandomPoems(poemsToUse, CONFIG.WATERFALL_COUNT);
    console.log('Generated random poems:', randomPoems.length);
    console.log('Random poems content:', randomPoems.map(p => `${p.title} - ${p.auth}`)); // Log titles and authors
    
    randomPoems.forEach((poem, index) => {
        const card = document.createElement('div');
        card.className = 'waterfall-card';
        card.onclick = () => showPoemDetail(poem);
        
        // Analyze layout for the poem (从原版获取的analyzePoemLayout逻辑)
        const layoutInfo = analyzePoemLayout(poem);
        
        // Generate lines HTML
        let linesHtml = '';
        layoutInfo.lines.forEach(line => {
            if (line) linesHtml += `<div class="poem-line">${line}</div>`;
        });
        
        // Random background color
        const backgroundColor = getRandomColor();
        
        let title = poem.title;
        if (title.length > 15) {
            title = title.substring(0, 15) + '...';
        }
        
        let author = layoutInfo.author;
        if (author.length > 8) {
            author = author.substring(0, 8) + '...';
        }
        
        // Determine the appropriate seal based on poem type
        const sealText = poem.source === 'ci' ? '词' : '诗';
        
        // Generate tags HTML
        const tagsHTML = generateTagsHTML(poem);
        
        // 使用原版的HTML结构和类名
        card.innerHTML = `
            <div class="color-block-container">
              <div class="color-block" style="background-color: ${backgroundColor};">
                 <!-- This class changes based on mode dynamically -->
                 <div class="overlay-text layout-${layoutInfo.mode}">
                   ${linesHtml}
                 </div>

                 <!-- Add seal decoration for aesthetic enhancement (with type-specific character) -->
                 <div class="seal-decoration">${sealText}</div>
              </div>
            </div>
            <div class="waterfall-content-section">
              <div class="waterfall-tags">${tagsHTML}</div>
              <h3 class="waterfall-title">${title}</h3>
              <p class="waterfall-author">${author}</p>
            </div>
          `;
        
        card.addEventListener('click', () => {
            currentPoem = poem;
            displayPoem(poem);
            
            // 切换回默认布局
            const poemContent = document.querySelector('.poem-content');
            const waterfallContainer = document.getElementById('waterfallContainer');
            const layoutToggle = document.getElementById('layoutToggle');
            if (poemContent && waterfallContainer && layoutToggle) {
                poemContent.style.display = 'flex';
                const poemDescContent = document.getElementById('poemDescContent');
                if (poemDescContent) poemDescContent.style.display = 'block';
                waterfallContainer.classList.remove('active');
                layoutToggle.textContent = '瀑布流';
            }
        });
        
        waterfallEl.appendChild(card);
    });
    
    console.log('Waterfall rendered with', randomPoems.length, 'cards');
}

// 切换布局模式
function toggleLayout() {
    console.log('toggleLayout called');
    const poemContent = document.querySelector('.poem-content');
    const poemDescContent = document.getElementById('poemDescContent');
    const waterfallContainer = document.getElementById('waterfallContainer');
    const layoutToggle = document.getElementById('layoutToggle');
    
    console.log('Elements:', { poemContent, poemDescContent, waterfallContainer, layoutToggle });
    
    if (!poemContent || !waterfallContainer || !layoutToggle) {
        console.error('Required elements not found!');
        return;
    }
    
    if (waterfallContainer.classList.contains('active')) {
        // 切换到默认布局
        console.log('Switching to default layout');
        poemContent.style.display = 'flex';
        if (poemDescContent) poemDescContent.style.display = 'block';
        waterfallContainer.classList.remove('active');
        layoutToggle.textContent = '瀑布流';
    } else {
        // 切换到瀑布流布局
        console.log('Switching to waterfall layout');
        poemContent.style.display = 'none';
        if (poemDescContent) poemDescContent.style.display = 'none';
        waterfallContainer.classList.add('active');
        layoutToggle.textContent = '默认布局';
        renderWaterfall(); // 生成瀑布流内容
    }
}

// 切换主题
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    }
}

// --- 新增功能函数 ---

// 复制诗词到剪贴板
function copyPoemToClipboard() {
    if (!currentPoem) return;
    
    const text = `${currentPoem.title}\n${currentPoem.auth}\n\n${currentPoem.content}`;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copyBtn');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✅';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('复制失败，请手动复制');
    });
}

// 切换搜索框显示
window.toggleSearch = function() {
    const searchSection = document.getElementById('searchSection');
    if (searchSection.style.display === 'none') {
        searchSection.style.display = 'flex';
        document.getElementById('searchInput').focus();
    } else {
        searchSection.style.display = 'none';
        document.getElementById('searchResults').style.display = 'none';
    }
};

// 隐藏搜索框
window.hideSearch = function() {
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('searchResults').style.display = 'none';
};

// 执行搜索
window.performSearch = function() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;
    
    const poemsToSearch = allPoems || [];
    const results = poemsToSearch.filter(poem => 
        (poem.title && poem.title.includes(query)) || 
        (poem.content && poem.content.includes(query)) || 
        (poem.auth && poem.auth.includes(query))
    );
    
    displaySearchResults(results);
};

// 处理搜索框回车事件
window.handleSearchKeyPress = function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
};

// 显示搜索结果
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    const list = document.getElementById('searchResultsList');
    list.innerHTML = '';
    
    if (results.length === 0) {
        list.innerHTML = '<li>未找到相关诗词</li>';
    } else {
        results.slice(0, 20).forEach(poem => { // 限制显示前20条
            const li = document.createElement('li');
            li.textContent = `${poem.title} - ${poem.auth}`;
            li.onclick = () => {
                currentPoem = poem;
                displayPoem(poem);
                hideSearch();
            };
            list.appendChild(li);
        });
    }
    
    resultsContainer.style.display = 'block';
}

// 切换详情页布局（横/竖排）
function togglePoemLayout() {
    const verseElem = document.getElementById('poemVerse');
    const btn = document.getElementById('layoutToggleBtn');
    
    if (verseElem.classList.contains('vertical-mode')) {
        verseElem.classList.remove('vertical-mode');
        verseElem.classList.add('horizontal-mode');
        btn.textContent = '📄'; // 切换图标
    } else {
        verseElem.classList.remove('horizontal-mode');
        verseElem.classList.add('vertical-mode');
        btn.textContent = '📜'; // 切换图标
    }
}

// AI解读占位符
function showAIInterpretation() {
    if (!currentPoem) return;
    
    const descContent = document.getElementById('poemDescContent');
    const desc = document.getElementById('poemDesc');
    
    descContent.style.display = 'block';
    
    // 简单的模拟 AI 响应
    const loadingHtml = '<div style="padding: 20px; text-align: center;">✨ AI 正在思考中...</div>';
    const originalDesc = desc.innerHTML;
    desc.innerHTML = loadingHtml + originalDesc;
    
    setTimeout(() => {
        const aiAnalysis = `
            <div style="margin-bottom: 20px; padding: 15px; background: rgba(139, 92, 246, 0.1); border-radius: 8px; border-left: 4px solid #8b5cf6;">
                <h4 style="margin-top: 0; color: #8b5cf6;">✨ AI 深度赏析</h4>
                <p>这是一首关于${currentPoem.title}的诗词。作者${currentPoem.auth}通过精妙的笔触，描绘了...</p>
                <p>(注：这是AI功能的演示占位符，实际功能需要接入后端API)</p>
            </div>
        `;
        desc.innerHTML = aiAnalysis + originalDesc;
    }, 1500);
}

// 导出函数供 bindEventListeners 使用
export { 
    copyPoemToClipboard, 
    togglePoemLayout, 
    showAIInterpretation 
};
