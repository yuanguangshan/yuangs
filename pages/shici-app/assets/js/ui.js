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
    generateTagsHTML,
    isLongPoem,
    needsScrollableVerticalMode
} from './poem-display.js?v=1.0.1';

// 全局状态
let currentPoem = null;
let allPoems = null;
let filteredPoems = null;
let currentDisplayMode = 'normal'; // 'normal', 'scroll'

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

                // Show author's works
                showAuthorWorks(selectedAuthor, filteredPoems);
            } else {
                filteredPoems = null;

                // Hide author works section
                const authorWorksSection = document.getElementById('authorWorksSection');
                if (authorWorksSection) {
                    authorWorksSection.style.display = 'none';
                }
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
    
    // Theme menu toggle functionality (click outside handling)
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent menu from closing when clicking theme button
            const themeMenu = document.getElementById('themeMenu');
            if (themeMenu) {
                themeMenu.classList.toggle('active');
            }
        });
    }

    // Close theme menu when clicking outside
    document.addEventListener('click', function (e) {
        const themeMenu = document.getElementById('themeMenu');
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (themeMenu && darkModeToggle) {
            if (!themeMenu.contains(e.target) && !darkModeToggle.contains(e.target)) {
                themeMenu.classList.remove('active');
            }
        }
    });
    
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
            if (currentPoem) {
                window.toggleFavorite(currentPoem);
                updateFavoriteButton();
            }
        });
    }

    // Menu functionality
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const historyBtn = document.getElementById('historyBtn');
    const favoritesBtn = document.getElementById('favoritesBtn');
    const aboutBtn = document.getElementById('aboutBtn');
    const historySection = document.getElementById('historySection');
    const favoritesSection = document.getElementById('favoritesSection');
    const aboutSection = document.getElementById('aboutSection');
    const historyList = document.getElementById('historyList');
    const favoritesList = document.getElementById('favoritesList');

    // Toggle menu
    menuToggle?.addEventListener('click', function () {
        menuOverlay.classList.add('active');
    });

    // Close menu
    closeMenuBtn?.addEventListener('click', function () {
        menuOverlay.classList.remove('active');
        // Hide sections when closing
        if (historySection) historySection.style.display = 'none';
        if (favoritesSection) favoritesSection.style.display = 'none';
        if (aboutSection) aboutSection.style.display = 'none';
    });

    // Close menu when clicking on overlay
    menuOverlay?.addEventListener('click', function (e) {
        if (e.target === menuOverlay) {
            menuOverlay.classList.remove('active');
            // Hide sections when closing
            if (historySection) historySection.style.display = 'none';
            if (favoritesSection) favoritesSection.style.display = 'none';
            if (aboutSection) aboutSection.style.display = 'none';
        }
    });

    // Show history section
    historyBtn?.addEventListener('click', function () {
        if (favoritesSection) favoritesSection.style.display = 'none';
        if (aboutSection) aboutSection.style.display = 'none';
        if (historySection) {
            historySection.style.display = 'block';
            loadHistoryList();
        }
    });

    // Show favorites section
    favoritesBtn?.addEventListener('click', function () {
        if (historySection) historySection.style.display = 'none';
        if (aboutSection) aboutSection.style.display = 'none';
        if (favoritesSection) {
            favoritesSection.style.display = 'block';
            loadFavoritesList();
        }
    });

    // Show about section
    aboutBtn?.addEventListener('click', function () {
        if (historySection) historySection.style.display = 'none';
        if (favoritesSection) favoritesSection.style.display = 'none';
        if (aboutSection) aboutSection.style.display = 'block';
    });

    // Load and display history list
    function loadHistoryList() {
        const history = getHistoryFromStorage();
        if (historyList) {
            historyList.innerHTML = '';

            if (history.length === 0) {
                historyList.innerHTML = '<p style="padding: 10px; text-align: center; color: var(--text-tertiary);">暂无历史记录</p>';
                return;
            }

            history.forEach((item, index) => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <div class="title">${item.title}</div>
                    <div class="author">${item.author}</div>
                `;
                historyItem.addEventListener('click', function () {
                    searchAndDisplayPoem(item.title, item.author);
                    if (menuOverlay) menuOverlay.classList.remove('active');
                    if (historySection) historySection.style.display = 'none';
                });
                historyList.appendChild(historyItem);
            });
        }
    }

    // Load and display favorites list
    function loadFavoritesList() {
        const favorites = getFavoritesFromStorage();
        if (favoritesList) {
            favoritesList.innerHTML = '';

            if (favorites.length === 0) {
                favoritesList.innerHTML = '<p style="padding: 10px; text-align: center; color: var(--text-tertiary);">暂无收藏</p>';
                return;
            }

            favorites.forEach((item, index) => {
                const favoriteItem = document.createElement('div');
                favoriteItem.className = 'favorite-item';
                favoriteItem.innerHTML = `
                    <div class="title">${item.title}</div>
                    <div class="author">${item.author}</div>
                `;
                favoriteItem.addEventListener('click', function () {
                    searchAndDisplayPoem(item.title, item.author);
                    if (menuOverlay) menuOverlay.classList.remove('active');
                    if (favoritesSection) favoritesSection.style.display = 'none';
                });
                favoritesList.appendChild(favoriteItem);
            });
        }
    }

    // Function to search and display a specific poem by title and author
    async function searchAndDisplayPoem(title, author) {
        // Fetch all poems if not already loaded
        if (!allPoems) {
            allPoems = await fetchAndCachePoems();
        }

        // Find the poem in the data
        const poem = allPoems.find(p =>
            p.title === title && p.auth === author
        );

        if (poem) {
            displayPoem(poem);
        } else {
            alert('未找到该诗词');
        }
    }

    // Add the scroll mode toggle functionality
    const scrollModeToggle = document.getElementById('scrollModeToggle');

    scrollModeToggle?.addEventListener('click', function () {
        toggleScrollMode();
    });
}

// Toggle scroll mode functionality
function toggleScrollMode() {
    const verseElement = document.getElementById('poemVerse');
    if (!verseElement || !currentPoem) return;

    // Remove all display mode classes
    verseElement.classList.remove('vertical-mode', 'horizontal-mode', 'vertical-scroll-mode');

    if (currentDisplayMode === 'normal') {
        // Switch to vertical-scroll mode
        currentDisplayMode = 'scroll';
        verseElement.classList.add('vertical-scroll-mode');
        // Format content for scroll mode
        const lines = currentPoem.content.split('\\n').filter(line => line.trim() !== '');
        const formattedContent = lines.map(line => `<span>${line}</span>`).join('');
        verseElement.innerHTML = formattedContent;
    } else {
        // Switch back to normal mode
        currentDisplayMode = 'normal';
        // Determine which normal mode to use based on poem type
        const isArticleContent = isArticle(currentPoem);
        const isLongVerse = isLongPoem(currentPoem);

        if (isArticleContent) {
            verseElement.classList.add('article-mode');
            verseElement.innerHTML = insertLineBreaksAtPunctuation(currentPoem.content);
        } else if (isLongVerse) {
            verseElement.classList.add('horizontal-mode');
            verseElement.innerHTML = insertLineBreaksAtPunctuation(currentPoem.content);
        } else {
            verseElement.classList.add('vertical-mode');
            verseElement.innerHTML = insertLineBreaksAtPunctuation(currentPoem.content);
        }
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
        // 判断是否为长诗（超过10行）
        const isLongVerse = isLongPoem(poem);

        // 重置类名 to ensure clean state
        verseEl.className = 'poem-verse';

        if (isArticleContent) {
            // Set article mode directly
            verseEl.classList.add('article-mode');
            verseEl.innerHTML = insertLineBreaksAtPunctuation(poem.content);
            if (layoutToggleBtn) layoutToggleBtn.style.display = 'none'; // 文章不显示切换按钮
        } else {
            // 先处理内容，获取实际显示的HTML
            const processedContent = insertLineBreaksAtPunctuation(poem.content);
            
            // 统计实际显示的行数（<br>标签数量 + 1）
            const brCount = (processedContent.match(/<br>/g) || []).length;
            const lineCount = brCount + 1;
            
            // console.log('Poem:', poem.title, 'Line count:', lineCount, 'BR count:', brCount);

            // For poems with more than 6 lines, use horizontal layout
            if (lineCount > 6) {
                // Use horizontal layout for poems with more than 6 lines
                verseEl.classList.add('horizontal-mode');
                verseEl.innerHTML = processedContent;
                if (layoutToggleBtn) {
                    layoutToggleBtn.style.display = 'inline-block';
                    layoutToggleBtn.textContent = '📜'; // For horizontal layout, show the vertical layout icon
                }
            } else {
                // For poems with 6 or fewer lines, use default vertical layout
                verseEl.classList.add('vertical-mode');
                verseEl.innerHTML = processedContent;
                if (layoutToggleBtn) layoutToggleBtn.style.display = 'inline-block';
            }
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

    // Add to history and update favorite status
    if (poem) {
        window.addToHistory(poem);
        updateFavoriteButton();
    }
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
async function renderWaterfall(append = false) {
    const waterfallEl = document.getElementById('waterfallContent');
    if (!waterfallEl) {
        console.error('waterfallContent element not found!');
        return;
    }

    const poemsToUse = filteredPoems || allPoems;
    if (!poemsToUse || poemsToUse.length === 0) {
        console.error('No poems available for waterfall');
        return;
    }

    // Only clear if not appending
    if (!append) {
        waterfallEl.innerHTML = '';
    }

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

    // Set up scroll listener for infinite loading when not appending (first load)
    if (!append) {
        setupInfiniteScroll();
    }

    // Update sentinel element for intersection observer
    // Update sentinel both on initial load and when appending to ensure it's at the end
    updateWaterfallSentinel();
}

// Setup infinite scroll for waterfall mode
function setupInfiniteScroll() {
    const waterfallContainer = document.getElementById('waterfallContainer');
    const waterfallContent = document.getElementById('waterfallContent');

    if (!waterfallContainer || !waterfallContent) {
        console.log('Waterfall elements not found for infinite scroll');
        return;
    }

    // Remove existing scroll listener to prevent duplicates
    if (window.waterfallScrollHandler) {
        window.removeEventListener('scroll', window.waterfallScrollHandler, true);
    }

    // Create scroll handler
    window.waterfallScrollHandler = function() {
        // Check if waterfall is active
        if (!waterfallContainer.classList.contains('active')) {
            // Remove listener if waterfall is not active
            window.removeEventListener('scroll', window.waterfallScrollHandler, true);
            return;
        }

        // Calculate if we're near the bottom of the page
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // More reliable way to detect when near bottom
        const scrollBottom = scrollTop + windowHeight;

        // Trigger loading when we're within 100px of the bottom
        if (scrollBottom >= documentHeight - 100) {
            // Prevent multiple simultaneous loads
            if (!window.isLoadingMorePoems) {
                window.isLoadingMorePoems = true;

                // Add a small delay to avoid triggering multiple times
                setTimeout(async () => {
                    try {
                        await renderWaterfall(true); // Append more poems
                    } catch (error) {
                        console.error('Error loading more poems:', error);
                    } finally {
                        window.isLoadingMorePoems = false;
                    }
                }, 300);
            }
        }
    };

    // Add scroll listener
    window.addEventListener('scroll', window.waterfallScrollHandler, true);

    // Additionally, check if we need to load more immediately (if content is short)
    setTimeout(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        if (windowHeight >= documentHeight) {
            if (window.waterfallScrollHandler) {
                window.waterfallScrollHandler();
            }
        }
    }, 500); // Delay to let content render
}

// Update sentinel element for detecting when user scrolls near bottom
function updateWaterfallSentinel() {
    const waterfallEl = document.getElementById('waterfallContent');
    if (!waterfallEl) return;

    // Remove existing sentinel if it exists
    const existingSentinel = document.getElementById('waterfall-sentinel');
    if (existingSentinel) {
        existingSentinel.remove();
    }

    // Create sentinel element
    const sentinel = document.createElement('div');
    sentinel.id = 'waterfall-sentinel';
    sentinel.style.height = '10px';
    sentinel.style.width = '100%';
    sentinel.textContent = ''; // No visible content
    waterfallEl.appendChild(sentinel);

    // Set up intersection observer to detect when sentinel comes into view
    if (window.waterfallObserver) {
        window.waterfallObserver.disconnect();
    }

    window.waterfallObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !window.isLoadingMorePoems) {
                window.isLoadingMorePoems = true;

                setTimeout(async () => {
                    try {
                        await renderWaterfall(true); // Append more poems
                    } catch (error) {
                        console.error('Error loading more poems:', error);
                    } finally {
                        window.isLoadingMorePoems = false;
                    }
                }, 300);
            }
        });
    }, {
        rootMargin: '100px' // Trigger 100px before sentinel is visible
    });

    window.waterfallObserver.observe(sentinel);
}

// 切换布局模式
function toggleLayout() {
    const poemContent = document.querySelector('.poem-content');
    const poemDescContent = document.getElementById('poemDescContent');
    const waterfallContainer = document.getElementById('waterfallContainer');
    const layoutToggle = document.getElementById('layoutToggle');

    if (!poemContent || !waterfallContainer || !layoutToggle) {
        console.error('Required elements not found!');
        return;
    }

    if (waterfallContainer.classList.contains('active')) {
        // 切换到默认布局
        poemContent.style.display = 'flex';
        if (poemDescContent) poemDescContent.style.display = 'block';
        waterfallContainer.classList.remove('active');

        // Clean up waterfall observers when switching away
        if (window.waterfallObserver) {
            window.waterfallObserver.disconnect();
            window.waterfallObserver = null;
        }

        layoutToggle.textContent = '瀑布流';
    } else {
        // 切换到瀑布流布局
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
}

// Theme switching function
function switchTheme(themeName) {
    // Remove all theme classes
    document.body.classList.remove('dark-mode', 'classic-paper-theme', 'modern-minimal-theme', 'nature-green-theme', 'ocean-blue-theme');

    // Apply the selected theme
    switch(themeName) {
        case 'light':
            // Just remove all theme classes to get default light theme
            break;
        case 'dark':
            document.body.classList.add('dark-mode');
            break;
        case 'classic-paper':
            document.body.classList.add('classic-paper-theme');
            break;
        case 'modern-minimal':
            document.body.classList.add('modern-minimal-theme');
            break;
        case 'nature-green':
            document.body.classList.add('nature-green-theme');
            break;
        case 'ocean-blue':
            document.body.classList.add('ocean-blue-theme');
            break;
    }

    // Close the theme menu
    const themeMenu = document.getElementById('themeMenu');
    if (themeMenu) {
        themeMenu.classList.remove('active');
    }
}

// Show author's works
function showAuthorWorks(authorName, poems) {
    const authorWorksSection = document.getElementById('authorWorksSection');
    const authorWorksTitle = document.getElementById('authorWorksTitle');
    const authorWorksList = document.getElementById('authorWorksList');

    if (!authorWorksSection || !authorWorksTitle || !authorWorksList) {
        return;
    }

    if (poems && poems.length > 0) {
        // Set title
        authorWorksTitle.textContent = `${authorName} 的作品 (${poems.length} 首)`;

        // Clear previous list
        authorWorksList.innerHTML = '';

        // Create work items (limit to first 20 to avoid too many)
        const worksToShow = poems.slice(0, 20);
        worksToShow.forEach(poem => {
            const workItem = document.createElement('button');
            workItem.className = 'author-work-item';
            workItem.textContent = poem.title;
            workItem.style.cssText = `
                padding: 8px 16px;
                border: 1px solid var(--border-color);
                background: var(--bg-lighter);
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                white-space: nowrap;
            `;

            workItem.addEventListener('click', () => {
                // Display the selected poem
                currentPoem = poem;
                displayPoem(poem);
            });

            workItem.addEventListener('mouseover', () => {
                workItem.style.background = 'var(--xhs-pink-lighter)';
                workItem.style.color = 'white';
                workItem.style.borderColor = 'var(--xhs-pink)';
            });

            workItem.addEventListener('mouseout', () => {
                workItem.style.background = 'var(--bg-lighter)';
                workItem.style.color = '';
                workItem.style.borderColor = 'var(--border-color)';
            });

            authorWorksList.appendChild(workItem);
        });

        // Show the section
        authorWorksSection.style.display = 'block';
    } else {
        // Hide the section if no poems found
        authorWorksSection.style.display = 'none';
    }
}

// Favorites functionality
const FAVORITES_KEY = 'poem_favorites';
const MAX_FAVORITES = 100; // Store max 100 favorite items

// Toggle favorite status
window.toggleFavorite = function(poem) {
    if (!poem || !poem.title || !poem.auth) return;

    const isFavorite = isPoemFavorite(poem);
    const favorites = getFavoritesFromStorage();
    const favoriteEntry = {
        title: poem.title,
        author: poem.auth,
        source: poem.source || 'poem'
    };

    if (isFavorite) {
        // Remove from favorites
        const filteredFavorites = favorites.filter(item =>
            !(item.title === favoriteEntry.title && item.author === favoriteEntry.author)
        );
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(filteredFavorites));
    } else {
        // Add to favorites
        // Remove any existing entry first to avoid duplicates
        const filteredFavorites = favorites.filter(item =>
            !(item.title === favoriteEntry.title && item.author === favoriteEntry.author)
        );

        // Add new entry to the beginning
        filteredFavorites.unshift(favoriteEntry);

        // Keep only MAX_FAVORITES entries
        if (filteredFavorites.length > MAX_FAVORITES) {
            filteredFavorites.splice(MAX_FAVORITES);
        }

        localStorage.setItem(FAVORITES_KEY, JSON.stringify(filteredFavorites));
    }
}

// Check if a poem is in favorites
function isPoemFavorite(poem) {
    if (!poem || !poem.title || !poem.auth) return false;

    const favorites = getFavoritesFromStorage();
    return favorites.some(item =>
        item.title === poem.title && item.author === poem.auth
    );
}

// Get favorites from storage
function getFavoritesFromStorage() {
    try {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (e) {
        console.error('Error reading favorites from localStorage:', e);
        return [];
    }
}

// Update favorite button display
function updateFavoriteButton() {
    if (!currentPoem) return;

    const isFav = isPoemFavorite(currentPoem);
    const favoriteToggleBtn = document.getElementById('favoriteToggleBtn');
    if (favoriteToggleBtn) {
        favoriteToggleBtn.textContent = isFav ? '♥' : '♡';
        favoriteToggleBtn.style.color = isFav ? 'red' : '';
    }
}

// Also make it available globally for the HTML onclick attributes
window.switchTheme = switchTheme;

// History functionality
const HISTORY_KEY = 'poem_history';
const MAX_HISTORY = 50; // Store max 50 history items

// Add poem to history
window.addToHistory = function(poem) {
    if (!poem || !poem.title || !poem.auth) return;

    const history = getHistoryFromStorage();
    const newEntry = {
        title: poem.title,
        author: poem.auth,
        source: poem.source || 'poem'
    };

    // Remove any existing entry with same title and author
    const filteredHistory = history.filter(item =>
        !(item.title === newEntry.title && item.author === newEntry.author)
    );

    // Add new entry to the beginning
    filteredHistory.unshift(newEntry);

    // Keep only the most recent MAX_HISTORY entries
    if (filteredHistory.length > MAX_HISTORY) {
        filteredHistory.splice(MAX_HISTORY);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
}

// Get history from storage
function getHistoryFromStorage() {
    try {
        const history = localStorage.getItem(HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch (e) {
        console.error('Error reading history from localStorage:', e);
        return [];
    }
}

// Load and display history list
function loadHistoryList() {
    const history = getHistoryFromStorage();
    const historyList = document.getElementById('historyList');
    if (historyList) {
        historyList.innerHTML = '';

        if (history.length === 0) {
            historyList.innerHTML = '<p style="padding: 10px; text-align: center; color: var(--text-tertiary);">暂无历史记录</p>';
            return;
        }

        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="title">${item.title}</div>
                <div class="author">${item.author}</div>
            `;
            historyItem.addEventListener('click', function () {
                searchAndDisplayPoem(item.title, item.author);
                const menuOverlay = document.getElementById('menuOverlay');
                const historySection = document.getElementById('historySection');
                if (menuOverlay) menuOverlay.classList.remove('active');
                if (historySection) historySection.style.display = 'none';
            });
            historyList.appendChild(historyItem);
        });
    }
}

// Load and display favorites list
function loadFavoritesList() {
    const favorites = getFavoritesFromStorage();
    const favoritesList = document.getElementById('favoritesList');
    if (favoritesList) {
        favoritesList.innerHTML = '';

        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p style="padding: 10px; text-align: center; color: var(--text-tertiary);">暂无收藏</p>';
            return;
        }

        favorites.forEach((item, index) => {
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            favoriteItem.innerHTML = `
                <div class="title">${item.title}</div>
                <div class="author">${item.author}</div>
            `;
            favoriteItem.addEventListener('click', function () {
                searchAndDisplayPoem(item.title, item.author);
                const menuOverlay = document.getElementById('menuOverlay');
                const favoritesSection = document.getElementById('favoritesSection');
                if (menuOverlay) menuOverlay.classList.remove('active');
                if (favoritesSection) favoritesSection.style.display = 'none';
            });
            favoritesList.appendChild(favoriteItem);
        });
    }
}

// Function to search and display a specific poem by title and author
async function searchAndDisplayPoem(title, author) {
    // Fetch all poems if not already loaded
    if (!allPoems) {
        allPoems = await fetchAndCachePoems();
    }

    // Find the poem in the data
    const poem = allPoems.find(p =>
        p.title === title && p.auth === author
    );

    if (poem) {
        displayPoem(poem);
    } else {
        alert('未找到该诗词');
    }
}

// --- AI & API Configuration ---
const API_DOMAIN = 'https://aiproxy.want.biz/';
const API_PREFIX = API_DOMAIN.replace(/\/+$/, '');
const DEFAULT_TIMEOUT = 120; // 秒
const DEFAULT_MODEL_ID = 'gemini-flash-lite-latest';
const AI_CACHE_KEY = 'poem_ai_interpretations_v1';

const PROMPT_TEMPLATES = {
    '诗词': '请为以下古诗词提供深度解读和赏析，使用Markdown格式输出，包含以下部分：1. 诗词背景与作者心境 2. 逐句解析（如果诗句较短可合并解析） 3. 艺术手法与修辞特点 4. 主题思想与情感内涵 5. 文学价值与影响'
};
const DEFAULT_TEMPLATE_KEY = '诗词';

// --- Helper Functions ---

function toDisplayString(any) {
    if (any == null) return '';
    if (typeof any === 'string') return any;
    try { return JSON.stringify(any, null, 2); } catch { return String(any); }
}

async function requestJSON(method, path, payload) {
    const url = `${API_PREFIX}${path.startsWith('/') ? path : `/${path}`}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT * 1000);

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: payload ? JSON.stringify(payload) : null,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            let errorData = {};
            try {
                errorData = await response.json();
            } catch {
                errorData = { message: await response.text() };
            }
            throw new Error(`API请求失败 (HTTP ${response.status}): ${errorData.error?.message || toDisplayString(errorData)}`);
        }
        return await response.json();
    } catch (e) {
        clearTimeout(timeoutId);
        if (e.name === 'AbortError') {
            throw new Error(`网络请求超时 (超过 ${DEFAULT_TIMEOUT} 秒)`);
        }
        throw new Error(`网络或API错误: ${e.message}`);
    }
}

function markdownToHtml(md) {
    if (!md) return '';
    let html = md
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/`(.*?)`/gim, '<code>$1</code>')
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/\n/gim, '<br>');

    html = html.replace(/<p><\/p>/gim, '');
    html = `<p>${html}</p>`;
    html = html.replace(/<p><li>/gim, '<ul><li>')
        .replace(/<\/li><\/p>/gim, '</li></ul>')
        .replace(/<\/li><li>/gim, '</li><li>');
    
    // Simple fix for ordered lists mixed with unordered logic above
    // Ideally use a proper markdown parser, but this matches legacy behavior
    return html;
}

function getInterpretationFromCache(title, author) {
    try {
        const cache = localStorage.getItem(AI_CACHE_KEY);
        if (!cache) return null;
        const cacheObj = JSON.parse(cache);
        const key = `${title}-${author}`;
        return cacheObj[key] || null;
    } catch (e) {
        console.error('Error reading from cache:', e);
        return null;
    }
}

function saveInterpretationToCache(title, author, content) {
    try {
        const cache = localStorage.getItem(AI_CACHE_KEY);
        let cacheObj = {};
        if (cache) cacheObj = JSON.parse(cache);
        const key = `${title}-${author}`;
        cacheObj[key] = content;
        localStorage.setItem(AI_CACHE_KEY, JSON.stringify(cacheObj));
    } catch (e) {
        console.error('Error saving to cache:', e);
    }
}

async function explainText(text, model) {
    return await requestJSON('POST', '/ai/explain', { text, model });
}

async function getRealPoemInterpretation(title, author, verse, desc, forceRefresh = false) {
    if (!forceRefresh) {
        const cached = getInterpretationFromCache(title, author);
        if (cached) return cached;
    }

    const finalSystemPrompt = PROMPT_TEMPLATES[DEFAULT_TEMPLATE_KEY];
    const textToInterpret = `诗词题目：${title}
作者：${author}
诗词内容：
${verse}

原注释：${desc}`;

    const finalText = `${finalSystemPrompt}\n\n---\n\n${textToInterpret.trim()}`;

    try {
        const resultData = await explainText(finalText, DEFAULT_MODEL_ID);
        const markdownResult = resultData.explanation || resultData.data || resultData.text || resultData;

        if (typeof markdownResult !== 'string' || !markdownResult.trim()) {
            throw new Error(`API返回结果格式不正确: ${toDisplayString(resultData)}`);
        }

        const finalResult = markdownResult.trim();
        saveInterpretationToCache(title, author, finalResult);
        return finalResult;
    } catch (error) {
        console.error("[Poetry AI] Error:", error);
        throw error;
    }
}

// --- Feature Functions ---

// 复制诗词到剪贴板 (修复换行问题)
function copyPoemToClipboard() {
    if (!currentPoem) return;
    
    // 将内容中的字面量 \n 替换为真正的换行符
    const content = currentPoem.content.replace(/\\n/g, '\n');
    const text = `${currentPoem.title}\n${currentPoem.auth}\n\n${content}`;
    
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
        results.slice(0, 20).forEach(poem => { 
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

// 切换详情页布局（循环切换：竖排 -> 横排 -> 竖排...）
function togglePoemLayout() {
    const verseElem = document.getElementById('poemVerse');
    const btn = document.getElementById('layoutToggleBtn');

    if (verseElem.classList.contains('vertical-mode') || verseElem.classList.contains('vertical-mode-wider')) {
        // 从竖排（包括宽间距模式）切换到横排
        verseElem.classList.remove('vertical-mode', 'vertical-mode-wider');
        verseElem.classList.add('horizontal-mode');
        verseElem.innerHTML = insertLineBreaksAtPunctuation(currentPoem.content); // Update content for horizontal mode
        btn.textContent = '📜';
    } else if (verseElem.classList.contains('horizontal-mode')) {
        // 从横排切换回竖排 (check original line count to decide which vertical mode to use)
        verseElem.classList.remove('horizontal-mode');
        // Determine which vertical mode to use based on current poem
        const lines = currentPoem.content.split('\\n').filter(line => line.trim() !== '');
        const lineCount = lines.length;
        if (lineCount < 6) {
            if (lineCount === 4) {
                // For 4 lines, use vertical layout with special class for wider spacing
                verseElem.classList.add('vertical-mode-wider');
            } else {
                // For other counts under 6, use default vertical mode
                verseElem.classList.add('vertical-mode');
            }
            verseElem.innerHTML = insertLineBreaksAtPunctuation(currentPoem.content); // Revert to normal formatting
        } else {
            // If the poem has 6 or more lines, keep horizontal mode
            verseElem.classList.add('horizontal-mode');
            verseElem.innerHTML = insertLineBreaksAtPunctuation(currentPoem.content); // Make sure content is formatted for horizontal mode
        }
        btn.textContent = '📄';
    } else {
        // Default to appropriate mode based on line count for first time
        const lines = currentPoem.content.split('\\n').filter(line => line.trim() !== '');
        const lineCount = lines.length;

        verseElem.classList.remove('horizontal-mode', 'vertical-scroll-mode', 'vertical-mode-wider');

        if (lineCount < 6) {
            if (lineCount === 4) {
                verseElem.classList.add('vertical-mode-wider');
            } else {
                verseElem.classList.add('vertical-mode');
            }
            verseElem.innerHTML = insertLineBreaksAtPunctuation(currentPoem.content);
        } else {
            verseElem.classList.add('horizontal-mode');
            verseElem.innerHTML = insertLineBreaksAtPunctuation(currentPoem.content);
        }
        btn.textContent = '📄';
    }
}

// AI解读 (完整实现)
async function showAIInterpretation() {
    if (!currentPoem) return;
    
    const descContent = document.getElementById('poemDescContent');
    const desc = document.getElementById('poemDesc');
    
    descContent.style.display = 'block';
    
    const separator = '<div style="border-top: 1px dashed #ddd; margin: 20px 0;"></div>';
    const loadingBadge = '<div style="display:inline-block; background:linear-gradient(90deg, #6366f1, #8b5cf6); color:white; padding:2px 8px; border-radius:12px; font-size:0.8rem; margin-bottom:10px; font-weight:bold;">✨ AI 正在思考...</div>';
    
    // 保留原有注释（如果有）
    let originalDesc = desc.innerHTML;
    // 如果已经有AI解读，尝试提取原始注释
    if (originalDesc.includes('border-top: 1px dashed #ddd')) {
        originalDesc = originalDesc.split('<div style="border-top: 1px dashed #ddd')[0];
    }
    
    desc.innerHTML = originalDesc + separator + loadingBadge + '<div class="loading-spinner" style="margin: 20px auto;"></div>';
    
    try {
        // 获取诗词内容（处理换行）
        const verse = currentPoem.content.replace(/\\n/g, '\n');
        
        const result = await getRealPoemInterpretation(
            currentPoem.title, 
            currentPoem.auth, 
            verse, 
            originalDesc
        );
        
        const aiBadge = '<div style="display:inline-block; background:linear-gradient(90deg, #6366f1, #8b5cf6); color:white; padding:2px 8px; border-radius:12px; font-size:0.8rem; margin-bottom:10px; font-weight:bold;">✨ AI 深度赏析 <span onclick="window.regenerateAnalysis()" style="cursor:pointer; margin-left:10px; font-size:0.8em; opacity:0.8; border-bottom:1px solid white;" title="重新生成解读">🔄 重新生成</span></div>';
        
        desc.innerHTML = originalDesc + separator + aiBadge + markdownToHtml(result);
        
    } catch (error) {
        desc.innerHTML = originalDesc + separator + `<div style="color:red;">AI解读失败: ${error.message}</div>`;
    }
}

// 重新生成分析
window.regenerateAnalysis = async function() {
    if (!currentPoem) return;
    
    const desc = document.getElementById('poemDesc');
    let originalDesc = desc.innerHTML;
    if (originalDesc.includes('border-top: 1px dashed #ddd')) {
        originalDesc = originalDesc.split('<div style="border-top: 1px dashed #ddd')[0];
    }
    
    const separator = '<div style="border-top: 1px dashed #ddd; margin: 20px 0;"></div>';
    const loadingBadge = '<div style="display:inline-block; background:linear-gradient(90deg, #6366f1, #8b5cf6); color:white; padding:2px 8px; border-radius:12px; font-size:0.8rem; margin-bottom:10px; font-weight:bold;">✨ AI 正在重新思考...</div>';
    
    desc.innerHTML = originalDesc + separator + loadingBadge + '<div class="loading-spinner" style="margin: 20px auto;"></div>';
    
    try {
        const verse = currentPoem.content.replace(/\\n/g, '\n');
        const result = await getRealPoemInterpretation(
            currentPoem.title, 
            currentPoem.auth, 
            verse, 
            originalDesc,
            true // force refresh
        );
        
        const aiBadge = '<div style="display:inline-block; background:linear-gradient(90deg, #6366f1, #8b5cf6); color:white; padding:2px 8px; border-radius:12px; font-size:0.8rem; margin-bottom:10px; font-weight:bold;">✨ AI 深度赏析 <span onclick="window.regenerateAnalysis()" style="cursor:pointer; margin-left:10px; font-size:0.8em; opacity:0.8; border-bottom:1px solid white;" title="重新生成解读">🔄 重新生成</span></div>';
        
        desc.innerHTML = originalDesc + separator + aiBadge + markdownToHtml(result);
    } catch (error) {
        desc.innerHTML = originalDesc + separator + `<div style="color:red;">重新生成失败: ${error.message}</div>`;
    }
};

// 导出函数供 bindEventListeners 使用
export { 
    copyPoemToClipboard, 
    togglePoemLayout, 
    showAIInterpretation 
};
