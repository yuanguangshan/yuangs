// ui.js - UI交互逻辑模块
// 处理用户交互、DOM操作和事件监听

import { CONFIG, getRandomColor, getRandomImageUrl, addToImageCache, getRandomCachedImage } from './config.js?v=1.0.2';
import { AUTHOR_DATA, getDynastyByAuthorName } from './author-data.js?v=1.0.2';
import { fetchAndCachePoems, getRandomPoem, getRandomPoems, clearCache } from './data-loader.js?v=1.0.2';
import {
    formatPoemWithLineBreaks,
    isRegularPoem,
    formatCoupletPoem,
    isArticle,
    generateTagsHTML,
    isLongPoem,
    needsScrollableVerticalMode,
    parseTagsForPoem,
    insertLineBreaksAtPunctuation
} from './poem-display.js?v=1.0.2';

// 全局状态
let currentPoem = null;
let allPoems = null;
let filteredPoems = null;
let currentDisplayMode = 'vertical'; // 'horizontal', 'vertical', 'scroll'
let currentTagFilter = null; // Current tag filter for waterfall

// --- 辅助函数区域 ---

// 【优化】将超过指定长度的行切分
// 逻辑：如果切分点遇到标点符号，允许溢出（避头点原则），而不是强行移到下一行行首
function splitLongLines(lines, maxLength = 21) {
    const result = [];
    // 定义"避头点"：不应该出现在行首的标点符号
    const avoidLineStartRegex = /[。！？，；、：,.!?;:”’»›\)\]\}~～」』]/;

    for (const line of lines) {
        // 如果当前行本身未超过长度，直接保留
        if (line.length <= maxLength) {
            result.push(line);
            continue;
        }

        let current = line;
        while (current.length > 0) {
            // 1. 默认截取位置
            let cutIndex = maxLength;

            // 如果剩余内容已经小于等于最大长度，直接作为最后一段
            if (current.length <= maxLength) {
                result.push(current);
                break;
            }

            // 2. 排版优化：检查截取点之后的字符
            // 如果截取点后的第一个字符是"避头点"（如逗号），则不能在这里切分
            // 我们需要把切分点向后移，把标点包含在当前行里
            if (cutIndex < current.length && avoidLineStartRegex.test(current[cutIndex])) {
                // 向后延伸，直到不是避头点，或者超过硬性限制（允许溢出3个字符）
                let overflowLimit = 3; 
                while (
                    cutIndex < current.length && 
                    avoidLineStartRegex.test(current[cutIndex]) && 
                    overflowLimit > 0
                ) {
                    cutIndex++;
                    overflowLimit--;
                }
            }

            // 3. 生成分段
            let chunk = current.slice(0, cutIndex);
            let remainder = current.slice(cutIndex);

            result.push(chunk);
            current = remainder;
        }
    }

    // 返回之前，将每行末尾的标点移到行首
    return result.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        
        // 检查是否以标点符号结尾（句号、叹号、问号）
        const punctuationMatch = trimmed.match(/([，。！？；、：]+)$/);
        
        if (punctuationMatch) {
            const punctuation = punctuationMatch[1];
            const textWithoutPunctuation = trimmed.slice(0, -punctuation.length);
            return punctuation + textWithoutPunctuation;
        }
        return trimmed;
    });
}

// 辅助函数：处理文章内容，按句子切分，但保留标点在句尾
function splitArticleContent(content) {
    // 将文章按句号、叹号、问号切分，但保留标点符号
    // 替换逻辑：在标点后加换行符，然后split
    return content
        .replace(/([。！？])/g, '$1\n')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
}


// 初始化UI
export async function initUI() {
    console.log('Initializing UI...');

    // 加载保存的主题偏好
    loadSavedTheme();

    // 加载保存的布局模式偏好
    loadSavedLayoutMode();

    // 加载诗词数据
    allPoems = await fetchAndCachePoems();
    console.log(`Loaded ${allPoems.length} poems`);

    // 初始化作者选择器
    initAuthorSelect();

    // 绑定事件监听器
    bindEventListeners();

    // 初始化AI模型选择菜单
    initAIMenu();

    // 首次加载随机诗词
    await loadRandomPoem();
}

// 初始化作者选择器
function initAuthorSelect() {
    const select = document.getElementById('authorSelect');
    if (!select || !AUTHOR_DATA) return;

    // Calculate author work counts
    const authorWorkCounts = {};
    if (allPoems) {
        allPoems.forEach(poem => {
            const author = poem.auth;
            if (author) {
                authorWorkCounts[author] = (authorWorkCounts[author] || 0) + 1;
            }
        });
    }

    // Helper to normalize dynasty names
    function normalizeDynasty(dynasty) {
        if (!dynasty) return '未知';
        if (['春秋', '战国', '战国末期', '春秋末期', '秦'].includes(dynasty)) return '先秦';
        if (['西汉', '东汉', '东汉末年'].includes(dynasty)) return '汉';
        if (['三国', '三国·魏', '晋', '西晋', '东晋'].includes(dynasty)) return '魏晋';
        if (['北魏', '南朝·宋', '南朝·梁', '南朝·齐'].includes(dynasty)) return '南北朝';
        if (['五代十国·南唐'].includes(dynasty)) return '五代';
        if (['宋末元初'].includes(dynasty)) return '宋';
        if (['金末元初'].includes(dynasty)) return '元';
        if (['明末清初'].includes(dynasty)) return '清';
        if (['历代'].includes(dynasty)) return '未知';
        return dynasty;
    }

    // 按朝代分组
    const dynastyGroups = {};
    AUTHOR_DATA.forEach(author => {
        const rawDynasty = author.dynasty || '未知';
        const dynasty = normalizeDynasty(rawDynasty);

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

            // 为每个作者添加作品数量信息并排序
            const authorsWithCounts = dynastyGroups[dynasty].map(author => ({
                ...author,
                workCount: authorWorkCounts[author.name] || 0
            }));

            // 按作品数量降序排序
            authorsWithCounts.sort((a, b) => b.workCount - a.workCount);

            // 分离多作品作者和单作品作者
            const multiWorkAuthors = authorsWithCounts.filter(a => a.workCount > 1);
            const singleWorkAuthors = authorsWithCounts.filter(a => a.workCount === 1);

            // 添加多作品作者（始终显示）
            multiWorkAuthors.forEach(author => {
                const option = document.createElement('option');
                option.value = author.name;
                option.textContent = `${author.name} (${author.titles?.[0] || ''}) [${author.workCount}首]`;
                optgroup.appendChild(option);
            });

            // 如果有单作品作者，添加一个"显示更多"选项
            if (singleWorkAuthors.length > 0) {
                const showMoreOption = document.createElement('option');
                showMoreOption.value = `__show_more_${dynasty}__`;
                showMoreOption.textContent = `┗━ 显示更多 (${singleWorkAuthors.length}位单作品作者)...`;
                showMoreOption.style.fontStyle = 'italic';
                showMoreOption.style.color = '#999';
                showMoreOption.dataset.dynasty = dynasty;
                showMoreOption.dataset.singleAuthors = JSON.stringify(singleWorkAuthors.map(a => ({
                    name: a.name,
                    title: a.titles?.[0] || '',
                    workCount: a.workCount
                })));
                optgroup.appendChild(showMoreOption);
            }

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
                await renderWaterfall(false, currentTagFilter);
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
                await renderWaterfall(false, currentTagFilter);
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
            
            // 检查是否点击了"显示更多"选项
            if (selectedAuthor.startsWith('__show_more_')) {
                const selectedOption = e.target.options[e.target.selectedIndex];
                const dynasty = selectedOption.dataset.dynasty;
                const singleAuthors = JSON.parse(selectedOption.dataset.singleAuthors);
                
                // 找到对应的 optgroup
                const optgroups = Array.from(authorSelect.querySelectorAll('optgroup'));
                const targetOptgroup = optgroups.find(og => og.label === dynasty);
                
                if (targetOptgroup) {
                    // 移除"显示更多"选项
                    selectedOption.remove();
                    
                    // 添加所有单作品作者
                    singleAuthors.forEach(author => {
                        const option = document.createElement('option');
                        option.value = author.name;
                        option.textContent = `  ${author.name} (${author.title}) [${author.workCount}首]`;
                        option.style.color = '#666';
                        targetOptgroup.appendChild(option);
                    });
                    
                    // 添加"隐藏"选项
                    const hideOption = document.createElement('option');
                    hideOption.value = `__hide_more_${dynasty}__`;
                    hideOption.textContent = `┗━ 收起单作品作者`;
                    hideOption.style.fontStyle = 'italic';
                    hideOption.style.color = '#999';
                    hideOption.dataset.dynasty = dynasty;
                    hideOption.dataset.singleAuthors = JSON.stringify(singleAuthors);
                    targetOptgroup.appendChild(hideOption);
                }
                
                // 重置选择
                authorSelect.value = '';
                return;
            }
            
            // 检查是否点击了"隐藏"选项
            if (selectedAuthor.startsWith('__hide_more_')) {
                const selectedOption = e.target.options[e.target.selectedIndex];
                const dynasty = selectedOption.dataset.dynasty;
                const singleAuthors = JSON.parse(selectedOption.dataset.singleAuthors);
                
                // 找到对应的 optgroup
                const optgroups = Array.from(authorSelect.querySelectorAll('optgroup'));
                const targetOptgroup = optgroups.find(og => og.label === dynasty);
                
                if (targetOptgroup) {
                    // 移除所有单作品作者和"隐藏"选项
                    const singleAuthorNames = singleAuthors.map(a => a.name);
                    const optionsToRemove = Array.from(targetOptgroup.querySelectorAll('option'))
                        .filter(opt => singleAuthorNames.includes(opt.value) || opt.value.startsWith('__hide_more_'));
                    optionsToRemove.forEach(opt => opt.remove());
                    
                    // 重新添加"显示更多"选项
                    const showMoreOption = document.createElement('option');
                    showMoreOption.value = `__show_more_${dynasty}__`;
                    showMoreOption.textContent = `┗━ 显示更多 (${singleAuthors.length}位单作品作者)...`;
                    showMoreOption.style.fontStyle = 'italic';
                    showMoreOption.style.color = '#999';
                    showMoreOption.dataset.dynasty = dynasty;
                    showMoreOption.dataset.singleAuthors = JSON.stringify(singleAuthors);
                    targetOptgroup.appendChild(showMoreOption);
                }
                
                // 重置选择
                authorSelect.value = '';
                return;
            }
            
            // 正常的作者选择逻辑
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
            await renderWaterfall(false, currentTagFilter);
        });
    }
    
    // 清除作者筛选
    const clearAuthor = document.getElementById('clearAuthor');
    if (clearAuthor) {
        clearAuthor.addEventListener('click', async () => {
            if (authorSelect) authorSelect.value = '';
            filteredPoems = null;
            await loadRandomPoem();
            await renderWaterfall(false, currentTagFilter);
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
    
    // Theme menu toggle functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function (e) {
            e.stopPropagation(); 
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

    // AI model menu toggle functionality
    const aiModelToggle = document.getElementById('aiModelToggle');
    const aiModelMenu = document.getElementById('aiModelMenu');
    if (aiModelToggle && aiModelMenu) {
        aiModelToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            aiModelMenu.classList.toggle('active');
        });
    }

    // Close AI model menu when clicking outside
    document.addEventListener('click', function (e) {
        if (aiModelMenu && aiModelToggle) {
            if (!aiModelMenu.contains(e.target) && !aiModelToggle.contains(e.target)) {
                aiModelMenu.classList.remove('active');
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
    
    // 布局切换按钮 - 实现横版、竖版、卷轴三种模式轮换切换
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'layoutToggleBtn') {
            const verseElement = document.getElementById('poemVerse');
            if (!verseElement || !currentPoem) return;

            // 确定当前显示模式
            const isScrollMode = verseElement.classList.contains('vertical-scroll-mode');
            const isHorizontalMode = verseElement.classList.contains('horizontal-mode');
            const isVerticalMode = verseElement.classList.contains('vertical-mode') ||
                                  verseElement.classList.contains('article-mode');

            // 移除所有模式类
            verseElement.classList.remove('vertical-mode', 'horizontal-mode', 'vertical-scroll-mode', 'article-mode');

            // --- 准备数据逻辑（通用）---
            let contentLines = currentPoem.content.split('\\n').filter(line => line.trim() !== '');
            if (contentLines.length === 1) {
                // 如果是长文没有换行，按句子切分
                contentLines = splitArticleContent(contentLines[0]);
            }
            // 【修正】不再将标点移到开头，保持自然顺序
            contentLines = contentLines.map(line => line.trim());

            if (isHorizontalMode) {
                // 横版 → 竖版
                verseElement.classList.add('vertical-mode');

                // 限制每列最大字数，使用优化后的避头点逻辑
                const formattedLines = splitLongLines(contentLines);

                // 创建列 div 元素
                const formattedContent = formattedLines.map(line => {
                    return `<div class="scroll-column">${line}</div>`;
                }).join('');

                verseElement.innerHTML = formattedContent;

                currentDisplayMode = 'vertical';
                saveLayoutMode('vertical'); 

                if (layoutToggleBtn) {
                    layoutToggleBtn.textContent = '📜'; // 切换到卷轴模式图标
                    layoutToggleBtn.title = '切换卷轴模式';
                }

                // 确保滚动到最右侧
                setTimeout(() => {
                    verseElement.scrollLeft = verseElement.scrollWidth - verseElement.clientWidth;
                }, 10);

            } else if (isVerticalMode) {
                // 竖版 → 卷轴
                verseElement.classList.add('vertical-scroll-mode');

                // 限制每列最大字数
                const formattedLines = splitLongLines(contentLines);

                // 创建列 div 元素
                const formattedContent = formattedLines.map(line => {
                    return `<div class="scroll-column">${line}</div>`;
                }).join('');

                verseElement.innerHTML = formattedContent;

                currentDisplayMode = 'scroll';
                saveLayoutMode('scroll');

                if (layoutToggleBtn) {
                    layoutToggleBtn.textContent = '📄'; // 退出卷轴模式图标
                    layoutToggleBtn.title = '退出卷轴模式';
                }

                // 确保滚动到最右侧
                verseElement.scrollLeft = verseElement.scrollWidth - verseElement.clientWidth;

            } else if (isScrollMode) {
                // 卷轴 → 横版
                verseElement.classList.add('horizontal-mode');
                verseElement.innerHTML = formatPoemWithLineBreaks(currentPoem.content, currentPoem);

                currentDisplayMode = 'horizontal';
                saveLayoutMode('horizontal');

                if (layoutToggleBtn) {
                    layoutToggleBtn.textContent = '🔄'; // 切换竖版模式图标
                    layoutToggleBtn.title = '切换竖版模式';
                }
            }
        }
    });
    
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
        if (historySection) historySection.style.display = 'none';
        if (favoritesSection) favoritesSection.style.display = 'none';
        if (aboutSection) aboutSection.style.display = 'none';
    });

    // Close menu when clicking on overlay
    menuOverlay?.addEventListener('click', function (e) {
        if (e.target === menuOverlay) {
            menuOverlay.classList.remove('active');
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
        if (aboutSection) {
            aboutSection.style.display = 'block';
        }
    });
    
    // Add the scroll mode toggle functionality
    const scrollModeToggle = document.getElementById('scrollModeToggle');
    scrollModeToggle?.addEventListener('click', function () {
        toggleScrollMode();
    });

    // 刷新数据按钮
    const refreshDataBtn = document.getElementById('refreshDataBtn');
    if (refreshDataBtn) {
        refreshDataBtn.addEventListener('click', async () => {
            if (confirm('确定要清除缓存并重新加载最新数据吗？这将消耗少量流量。')) {
                const success = await clearCache();
                if (success) {
                    location.reload();
                } else {
                    alert('清除缓存失败，请尝试手动清除浏览器缓存。');
                }
            }
        });
    }
}

// Toggle scroll mode functionality
function toggleScrollMode() {
    const verseElement = document.getElementById('poemVerse');
    const scrollModeToggle = document.getElementById('scrollModeToggle');
    const layoutToggleBtn = document.getElementById('layoutToggleBtn');
    if (!verseElement || !currentPoem) return;

    const isScrollMode = verseElement.classList.contains('vertical-scroll-mode');

    // Remove all display mode classes
    verseElement.classList.remove('vertical-mode', 'horizontal-mode', 'vertical-scroll-mode', 'article-mode');

    if (isScrollMode) {
        // Switch to horizontal mode
        verseElement.classList.add('horizontal-mode');
        verseElement.innerHTML = formatPoemWithLineBreaks(currentPoem.content, currentPoem);

        currentDisplayMode = 'horizontal';
        saveLayoutMode('horizontal');

        if (scrollModeToggle) scrollModeToggle.innerHTML = '<span>📜</span> 卷轴模式';
        if (layoutToggleBtn) {
            layoutToggleBtn.textContent = '📜';
            layoutToggleBtn.title = '切换卷轴模式';
        }
    } else {
        // Switch to scroll mode
        verseElement.classList.add('vertical-scroll-mode');

        currentDisplayMode = 'scroll';
        saveLayoutMode('scroll');

        if (scrollModeToggle) scrollModeToggle.innerHTML = '<span>📜</span> 退出卷轴';
        if (layoutToggleBtn) {
            layoutToggleBtn.textContent = '📄';
            layoutToggleBtn.title = '退出卷轴模式';
        }

        // Data Preparation
        let contentLines = currentPoem.content.split('\\n').filter(line => line.trim() !== '');
        if (contentLines.length === 1) {
            contentLines = splitArticleContent(contentLines[0]);
        }
        // 【修正】保持自然顺序
        contentLines = contentLines.map(line => line.trim());
        
        // Limit max characters per column
        contentLines = splitLongLines(contentLines);

        const formattedContent = contentLines.map(line => {
            return `<div class="scroll-column">${line}</div>`;
        }).join('');

        verseElement.innerHTML = formattedContent;
        verseElement.scrollLeft = verseElement.scrollWidth - verseElement.clientWidth;
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

    // Update the current poem
    currentPoem = poem;

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
        authorEl.style.cursor = 'pointer';
        authorEl.onclick = () => showAuthorInfo(poem.auth);
    }

    // 内容
    const verseEl = document.getElementById('poemVerse');
    const layoutToggleBtn = document.getElementById('layoutToggleBtn');

    if (verseEl) {
        // 重置类名
        verseEl.className = 'poem-verse';

        // 准备数据（通用）
        let contentLines = poem.content.split('\\n').filter(line => line.trim() !== '');
        // 如果是文章且只有一行，按句子切分
        if (contentLines.length === 1 && contentLines[0].length > 30) { 
            contentLines = splitArticleContent(contentLines[0]);
        }
        // 统一 Trim
        contentLines = contentLines.map(line => line.trim());

        if (currentDisplayMode === 'scroll') {
            // 卷轴模式
            verseEl.classList.add('vertical-scroll-mode');
            const formattedLines = splitLongLines(contentLines);
            
            verseEl.innerHTML = formattedLines.map(line => {
                return `<div class="scroll-column">${line}</div>`;
            }).join('');
            
            if (layoutToggleBtn) {
                layoutToggleBtn.textContent = '📄';
                layoutToggleBtn.title = '退出卷轴模式';
                layoutToggleBtn.style.display = 'inline-block';
            }
            setTimeout(() => {
                verseEl.scrollLeft = verseEl.scrollWidth - verseEl.clientWidth;
            }, 10);

        } else if (currentDisplayMode === 'horizontal') {
            // 横版模式
            verseEl.classList.add('horizontal-mode');
            verseEl.innerHTML = formatPoemWithLineBreaks(poem.content, poem);
            
            if (layoutToggleBtn) {
                layoutToggleBtn.textContent = '🔄';
                layoutToggleBtn.title = '切换竖版模式';
                layoutToggleBtn.style.display = 'inline-block';
            }
        } else {
            // 竖版模式（默认）
            verseEl.classList.add('vertical-mode');
            const formattedLines = splitLongLines(contentLines);

            verseEl.innerHTML = formattedLines.map(line => {
                return `<div class="scroll-column">${line}</div>`;
            }).join('');
            
            if (layoutToggleBtn) {
                layoutToggleBtn.textContent = '📜';
                layoutToggleBtn.title = '切换卷轴模式';
                layoutToggleBtn.style.display = 'inline-block';
            }
            setTimeout(() => {
                verseEl.scrollLeft = verseEl.scrollWidth - verseEl.clientWidth;
            }, 10);
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

        // 检查缓存的 AI 解读
        const cachedAIInterpretation = getInterpretationFromCache(poem.title, poem.auth);
        if (cachedAIInterpretation) {
            const originalDesc = poem.desc || '暂无赏析';
            const separator = '<div style="border-top: 1px dashed #ddd; margin: 20px 0;"></div>';
            const aiBadge = '<div style="display:inline-block; background:linear-gradient(90deg, #6366f1, #8b5cf6); color:white; padding:2px 8px; border-radius:12px; font-size:0.8rem; margin-bottom:10px; font-weight:bold;">✨ AI 深度赏析 <span onclick="window.regenerateAnalysis()" style="cursor:pointer; margin-left:10px; font-size:0.8em; opacity:0.8; border-bottom:1px solid white;" title="重新生成解读">🔄 重新生成</span></div>';

            descEl.innerHTML = originalDesc + separator + aiBadge + markdownToHtml(cachedAIInterpretation);
        }
    }

    // 显示内容区域
    document.getElementById('poemTextContent').style.display = 'block';
    const descContent = document.getElementById('poemDescContent');
    if (descContent) {
        descContent.style.display = 'block';
    }
    document.getElementById('loading').style.display = 'none';

    const imageSection = document.querySelector('.image-section');
    if (imageSection) {
        imageSection.style.display = 'flex';
    }

    // 加载诗词配图
    loadPoemImage();

    // 添加到历史和更新收藏状态
    if (poem) {
        window.addToHistory(poem);
        updateFavoriteButton();
    }
}

// 加载诗词配图
function loadPoemImage() {
    const img = document.getElementById('poemImage');
    if (!img) return;

    let currentFallback = 1;
    const maxFallbacks = 6; 
    let timeoutId;

    function tryNextFallback() {
        if (currentFallback < maxFallbacks) {
            currentFallback++;
            if (timeoutId) clearTimeout(timeoutId);
            
            timeoutId = setTimeout(() => {
                if (currentFallback < maxFallbacks) {
                    tryNextFallback();
                } else {
                    handleImageFailure();
                }
            }, 15000); 

            img.src = getRandomImageUrl(currentFallback);
        } else {
            handleImageFailure();
        }
    }

    function handleImageFailure() {
        console.warn("All image loading attempts failed, hiding image section");
        const imageSection = document.querySelector('.image-section');
        if (imageSection) {
            imageSection.style.display = 'none';
        }
    }

    img.onload = function () {
        addToImageCache(img.src);
        const imageSection = document.querySelector('.image-section');
        if (imageSection) {
            imageSection.style.display = 'flex';
        }
    };

    img.onerror = function () {
        console.log(`Image loading error for fallback ${currentFallback}, trying next...`);
        const cachedImage = getRandomCachedImage();
        if (cachedImage && currentFallback >= maxFallbacks - 1) { 
            img.src = cachedImage;
            return; 
        }
        tryNextFallback();
    };

    img.src = getRandomImageUrl(currentFallback);

    timeoutId = setTimeout(() => {
        console.log(`Image loading timeout for fallback ${currentFallback}, trying next...`);
        const cachedImage = getRandomCachedImage();
        if (cachedImage) {
            img.src = cachedImage;
        } else {
            tryNextFallback();
        }
    }, 5000); 
}

// Analyze poem layout (for Waterfall)
function analyzePoemLayout(poem) {
    const content = poem.content.replace(/\\n/g, '').replace(/\s+/g, ''); 
    const sentences = content.split(/[。！？!?]/).filter(s => s.trim() !== '');

    const firstLineLen = sentences[0] ? sentences[0].replace(/[，,]/g, '').length : 0;
    const isRegular = (firstLineLen === 5 || firstLineLen === 7) &&
        sentences.every(s => {
            const cleanLen = s.replace(/[，,]/g, '').length;
            return cleanLen === firstLineLen * 2 || cleanLen === firstLineLen;
        });

    let displayLines = [];
    let layoutMode = 'vertical'; 

    if (isRegular && firstLineLen === 5 || firstLineLen === 7) {
        displayLines = sentences.slice(0, 4).map(s => {
            const parts = s.split(/[，,]/);
            return parts.join('');
        });
        layoutMode = 'vertical';
    } else {
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
async function renderWaterfall(append = false, tagFilter = null) {
    const waterfallEl = document.getElementById('waterfallContent');
    if (!waterfallEl) return;

    let poemsToUse = filteredPoems || allPoems;
    if (!poemsToUse || poemsToUse.length === 0) return;

    // Apply tag filter
    if (tagFilter) {
        const dynastyTags = ['先秦', '汉', '魏晋', '南北朝', '隋', '唐', '五代', '南唐', '宋', '元', '明', '清', '现代', '近现代', '五代十国'];
        const isDynastyTag = dynastyTags.includes(tagFilter);

        if (isDynastyTag) {
            poemsToUse = poemsToUse.filter(poem => {
                const authorDynasty = getDynastyByAuthorName(poem.auth);
                return authorDynasty === tagFilter ||
                       (tagFilter === '五代' && authorDynasty === '南唐') || 
                       (tagFilter === '五代十国' && authorDynasty === '五代') || 
                       (tagFilter === '五代十国' && authorDynasty === '南唐'); 
            });
        } else {
            poemsToUse = poemsToUse.filter(poem => {
                const allTags = parseTagsForPoem(poem);
                return allTags.includes(tagFilter);
            });
        }
    }

    if (!append) {
        waterfallEl.innerHTML = '';
    }

    const randomPoems = getRandomPoems(poemsToUse, CONFIG.WATERFALL_COUNT);

    randomPoems.forEach((poem, index) => {
        const card = document.createElement('div');
        card.className = 'waterfall-card';
        const layoutInfo = analyzePoemLayout(poem);

        let linesHtml = '';
        layoutInfo.lines.forEach(line => {
            if (line) linesHtml += `<div class="poem-line">${line}</div>`;
        });

        const backgroundColor = getRandomColor();
        let title = poem.title.length > 15 ? poem.title.substring(0, 15) + '...' : poem.title;
        let author = layoutInfo.author.length > 8 ? layoutInfo.author.substring(0, 8) + '...' : layoutInfo.author;
        const sealText = poem.source === 'ci' ? '词' : '诗';
        const tagsHTML = generateTagsHTML(poem);

        card.innerHTML = `
            <div class="color-block-container">
              <div class="color-block" style="background-color: ${backgroundColor};">
                 <div class="overlay-text layout-${layoutInfo.mode}">
                   ${linesHtml}
                 </div>
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

    if (!append) {
        setupInfiniteScroll();
    }
    updateWaterfallSentinel();
}

// Setup infinite scroll for waterfall mode
function setupInfiniteScroll() {
    const waterfallContainer = document.getElementById('waterfallContainer');
    if (!waterfallContainer) return;

    if (window.waterfallScrollHandler) {
        window.removeEventListener('scroll', window.waterfallScrollHandler, true);
    }

    window.waterfallScrollHandler = function() {
        if (!waterfallContainer.classList.contains('active')) {
            window.removeEventListener('scroll', window.waterfallScrollHandler, true);
            return;
        }

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollBottom = scrollTop + windowHeight;

        if (scrollBottom >= documentHeight - 100) {
            if (!window.isLoadingMorePoems) {
                window.isLoadingMorePoems = true;
                setTimeout(async () => {
                    try {
                        await renderWaterfall(true, currentTagFilter); 
                    } catch (error) {
                        console.error('Error loading more poems:', error);
                    } finally {
                        window.isLoadingMorePoems = false;
                    }
                }, 300);
            }
        }
    };

    window.addEventListener('scroll', window.waterfallScrollHandler, true);

    setTimeout(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        if (windowHeight >= documentHeight && window.waterfallScrollHandler) {
            window.waterfallScrollHandler();
        }
    }, 500); 
}

// Update sentinel element 
function updateWaterfallSentinel() {
    const waterfallEl = document.getElementById('waterfallContent');
    if (!waterfallEl) return;

    const existingSentinel = document.getElementById('waterfall-sentinel');
    if (existingSentinel) existingSentinel.remove();

    const sentinel = document.createElement('div');
    sentinel.id = 'waterfall-sentinel';
    sentinel.style.height = '10px';
    sentinel.style.width = '100%';
    waterfallEl.appendChild(sentinel);

    if (window.waterfallObserver) {
        window.waterfallObserver.disconnect();
    }

    window.waterfallObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !window.isLoadingMorePoems) {
                window.isLoadingMorePoems = true;
                setTimeout(async () => {
                    try {
                        await renderWaterfall(true, currentTagFilter); 
                    } catch (error) {
                        console.error('Error loading more poems:', error);
                    } finally {
                        window.isLoadingMorePoems = false;
                    }
                }, 300);
            }
        });
    }, {
        rootMargin: '100px' 
    });

    window.waterfallObserver.observe(sentinel);
}

// 切换布局模式
function toggleLayout() {
    const poemContent = document.querySelector('.poem-content');
    const poemDescContent = document.getElementById('poemDescContent');
    const waterfallContainer = document.getElementById('waterfallContainer');
    const layoutToggle = document.getElementById('layoutToggle');

    if (!poemContent || !waterfallContainer || !layoutToggle) return;

    if (waterfallContainer.classList.contains('active')) {
        poemContent.style.display = 'flex';
        if (poemDescContent) poemDescContent.style.display = 'block';
        waterfallContainer.classList.remove('active');

        if (window.waterfallObserver) {
            window.waterfallObserver.disconnect();
            window.waterfallObserver = null;
        }

        layoutToggle.textContent = '瀑布流';
        currentTagFilter = null;
    } else {
        poemContent.style.display = 'none';
        if (poemDescContent) poemDescContent.style.display = 'none';
        waterfallContainer.classList.add('active');
        layoutToggle.textContent = '默认布局';
        renderWaterfall(false, currentTagFilter);
    }
}

// Theme switching function
function switchTheme(themeName) {
    document.body.classList.remove('dark-mode', 'classic-paper-theme', 'modern-minimal-theme', 'nature-green-theme', 'ocean-blue-theme');

    switch(themeName) {
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

    localStorage.setItem('selectedTheme', themeName);
    const themeMenu = document.getElementById('themeMenu');
    if (themeMenu) themeMenu.classList.remove('active');
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        switchTheme(savedTheme);
    }
}

// Save layout mode preference
const LAYOUT_MODE_KEY = 'poem_layout_mode';
function saveLayoutMode(mode) {
    localStorage.setItem(LAYOUT_MODE_KEY, mode);
}
function loadSavedLayoutMode() {
    const savedMode = localStorage.getItem(LAYOUT_MODE_KEY);
    if (savedMode) {
        currentDisplayMode = savedMode;
    }
}

// Handle tag click 
function handleTagClick(tag) {
    currentTagFilter = tag;
    const poemContent = document.querySelector('.poem-content');
    const poemDescContent = document.getElementById('poemDescContent');
    const waterfallContainer = document.getElementById('waterfallContainer');
    const layoutToggle = document.getElementById('layoutToggle');

    if (!poemContent || !waterfallContainer || !layoutToggle) return;

    poemContent.style.display = 'none';
    if (poemDescContent) poemDescContent.style.display = 'none';
    waterfallContainer.classList.add('active');
    layoutToggle.textContent = '默认布局';
    renderWaterfall(false, tag);
}
window.handleTagClick = handleTagClick;

// Show author's works
function showAuthorWorks(authorName, poems) {
    const authorWorksSection = document.getElementById('authorWorksSection');
    const authorWorksTitle = document.getElementById('authorWorksTitle');
    const authorWorksList = document.getElementById('authorWorksList');

    if (!authorWorksSection || !authorWorksTitle || !authorWorksList) return;

    if (!poems && allPoems) {
        poems = allPoems.filter(p => p.auth === authorName);
    }

    if (poems && poems.length > 0) {
        const dynasty = getDynastyByAuthorName(authorName);
        authorWorksTitle.textContent = `${dynasty} · ${authorName} 的作品 (${poems.length} 首)`;
        authorWorksList.innerHTML = '';

        const worksToShow = poems.slice(0, 50);
        worksToShow.forEach(poem => {
            const workItem = document.createElement('button');
            workItem.className = 'author-work-item';
            workItem.textContent = poem.title;
            workItem.addEventListener('click', () => {
                currentPoem = poem;
                displayPoem(poem);
                document.querySelector('.poem-content')?.scrollIntoView({ behavior: 'smooth' });
            });
            authorWorksList.appendChild(workItem);
        });

        authorWorksSection.style.display = 'block';
        authorWorksSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        authorWorksSection.style.display = 'none';
    }
}

// Favorites functionality
const FAVORITES_KEY = 'poem_favorites';
const MAX_FAVORITES = 100;

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
        const filteredFavorites = favorites.filter(item =>
            !(item.title === favoriteEntry.title && item.author === favoriteEntry.author)
        );
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(filteredFavorites));
    } else {
        const filteredFavorites = favorites.filter(item =>
            !(item.title === favoriteEntry.title && item.author === favoriteEntry.author)
        );
        filteredFavorites.unshift(favoriteEntry);
        if (filteredFavorites.length > MAX_FAVORITES) {
            filteredFavorites.splice(MAX_FAVORITES);
        }
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(filteredFavorites));
    }
}

function isPoemFavorite(poem) {
    if (!poem || !poem.title || !poem.auth) return false;
    const favorites = getFavoritesFromStorage();
    return favorites.some(item => item.title === poem.title && item.author === poem.auth);
}

function getFavoritesFromStorage() {
    try {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (e) {
        return [];
    }
}

function updateFavoriteButton() {
    if (!currentPoem) return;
    const isFav = isPoemFavorite(currentPoem);
    const favoriteToggleBtn = document.getElementById('favoriteToggleBtn');
    if (favoriteToggleBtn) {
        favoriteToggleBtn.textContent = isFav ? '♥' : '♡';
        favoriteToggleBtn.style.color = isFav ? 'red' : '';
    }
}
window.switchTheme = switchTheme;

// History functionality
const HISTORY_KEY = 'poem_history';
const MAX_HISTORY = 50;

window.addToHistory = function(poem) {
    if (!poem || !poem.title || !poem.auth) return;
    const history = getHistoryFromStorage();
    const newEntry = {
        title: poem.title,
        author: poem.auth,
        source: poem.source || 'poem'
    };
    const filteredHistory = history.filter(item =>
        !(item.title === newEntry.title && item.author === newEntry.author)
    );
    filteredHistory.unshift(newEntry);
    if (filteredHistory.length > MAX_HISTORY) {
        filteredHistory.splice(MAX_HISTORY);
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
}

function getHistoryFromStorage() {
    try {
        const history = localStorage.getItem(HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch (e) {
        return [];
    }
}

function loadHistoryList() {
    const history = getHistoryFromStorage();
    const historyList = document.getElementById('historyList');
    if (historyList) {
        historyList.innerHTML = '';
        if (history.length === 0) {
            historyList.innerHTML = '<p style="padding: 10px; text-align: center; color: var(--text-tertiary);">暂无历史记录</p>';
            return;
        }
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `<div class="title">${item.title}</div><div class="author">${item.author}</div>`;
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

function loadFavoritesList() {
    const favorites = getFavoritesFromStorage();
    const favoritesList = document.getElementById('favoritesList');
    if (favoritesList) {
        favoritesList.innerHTML = '';
        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p style="padding: 10px; text-align: center; color: var(--text-tertiary);">暂无收藏</p>';
            return;
        }
        favorites.forEach(item => {
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            favoriteItem.innerHTML = `<div class="title">${item.title}</div><div class="author">${item.author}</div>`;
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

async function searchAndDisplayPoem(title, author) {
    if (!allPoems) allPoems = await fetchAndCachePoems();
    const poem = allPoems.find(p => p.title === title && p.auth === author);
    if (poem) {
        displayPoem(poem);
    } else {
        alert('未找到该诗词');
    }
}

// --- AI & API Configuration ---
const API_DOMAIN = 'https://aiproxy.want.biz/';
const API_PREFIX = API_DOMAIN.replace(/\/+$/, '');
const DEFAULT_TIMEOUT = 120;
const DEFAULT_MODEL_ID = 'weclaw';
const AI_MODEL_PREFERENCE_KEY = 'preferred_ai_model';
const AI_INTERFACE_PREFERENCE_KEY = 'preferred_ai_interface'; // 新增：AI接口偏好设置
const AI_CACHE_KEY = 'poem_ai_interpretations_v1';
const PROMPT_TEMPLATES = {
    '诗词': '请为以下古诗词提供深度解读和赏析，使用Markdown格式输出，包含以下部分：1. 诗词背景与作者心境 2. 逐句解析（如果诗句较短可合并解析） 3. 艺术手法与修辞特点 4. 主题思想与情感内涵 5. 文学价值与影响 6.作者生平与经历'
};
const DEFAULT_TEMPLATE_KEY = '诗词';

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
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-App-ID': 'shici',
                'Authorization': 'Bearer sk-frontend'
            },
            body: payload ? JSON.stringify(payload) : null,
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            let errorData = {};
            try {
                errorData = await response.json();
            } catch {
                // 如果响应不是JSON格式，尝试获取文本
                try {
                    const errorText = await response.text();
                    errorData = { message: errorText };
                } catch {
                    errorData = { message: `HTTP Error ${response.status}` };
                }
            }
            throw new Error(`API请求失败: ${errorData.error?.message || toDisplayString(errorData)}`);
        }
        return await response.json();
    } catch (e) {
        clearTimeout(timeoutId);
        if (e.name === 'AbortError') {
            console.error('[Poetry AI] 请求超时:', e);
            throw new Error('网络请求超时，请检查网络连接');
        }
        if (e instanceof TypeError && e.message.includes('fetch')) {
            console.error('[Poetry AI] 网络错误:', e);
            throw new Error('网络连接失败，请检查网络设置');
        }
        console.error('[Poetry AI] 请求错误:', e);
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
        return null;
    }
}

// 获取用户选择的AI模型
function getUserPreferredModel() {
    try {
        const preferredModel = localStorage.getItem(AI_MODEL_PREFERENCE_KEY);
        return preferredModel || DEFAULT_MODEL_ID;
    } catch (e) {
        console.warn('获取用户AI模型偏好失败:', e);
        return DEFAULT_MODEL_ID;
    }
}

// 设置用户选择的AI模型
function setUserPreferredModel(modelId) {
    try {
        localStorage.setItem(AI_MODEL_PREFERENCE_KEY, modelId);
        console.log('已设置AI模型:', modelId);
    } catch (e) {
        console.error('保存AI模型偏好失败:', e);
    }
}

// 获取用户选择的AI接口类型 (false=新接口, true=旧接口)
function getUserPreferredInterface() {
    try {
        const preferredInterface = localStorage.getItem(AI_INTERFACE_PREFERENCE_KEY);
        // 默认使用新接口 (false)，除非用户明确选择旧接口
        return preferredInterface === 'legacy';
    } catch (e) {
        console.warn('获取用户AI接口偏好失败:', e);
        return false; // 默认使用新接口
    }
}

// 设置用户选择的AI接口类型
function setUserPreferredInterface(useLegacy) {
    try {
        localStorage.setItem(AI_INTERFACE_PREFERENCE_KEY, useLegacy ? 'legacy' : 'new');
        console.log('已设置AI接口类型:', useLegacy ? '旧接口(ai/explain)' : '新接口(v1/chat/completions)');
    } catch (e) {
        console.error('保存AI接口偏好失败:', e);
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
    } catch (e) {}
}

// AI 接口兼容函数 - 支持新旧两种接口格式
async function explainText(text, model, useLegacy = false) {
    if (useLegacy) {
        // 使用旧接口 ai/explain - 需要 'text' 字段
        return await requestJSON('POST', '/ai/explain', { text, model });
    } else {
        // 使用新接口 v1/chat/completions - OpenAI兼容格式
        const payload = {
            model: model,
            messages: [{
                role: "user",
                content: text
            }],
            temperature: 0.7,
            max_tokens: 2000
        };
        return await requestJSON('POST', '/v1/chat/completions', payload);
    }
}

async function getRealPoemInterpretation(title, author, verse, desc, forceRefresh = false, useLegacy = null) {
    if (!forceRefresh) {
        const cached = getInterpretationFromCache(title, author);
        if (cached) return cached;
    }
    const finalSystemPrompt = PROMPT_TEMPLATES[DEFAULT_TEMPLATE_KEY];
    const textToInterpret = `诗词题目：${title}\n作者：${author}\n诗词内容：\n${verse}\n\n原注释：${desc}`;
    const finalText = `${finalSystemPrompt}\n\n---\n\n${textToInterpret.trim()}`;

    try {
        const userModel = getUserPreferredModel();
        // 如果没有明确指定接口类型，则使用用户偏好设置
        const shouldUseLegacy = useLegacy !== null ? useLegacy : getUserPreferredInterface();
        const resultData = await explainText(finalText, userModel, shouldUseLegacy);

        // 处理新旧接口不同的返回格式
        let markdownResult;
        if (shouldUseLegacy) {
            // 旧接口格式: { explanation: "...", data: "...", text: "..." }
            markdownResult = resultData.explanation || resultData.data || resultData.text || resultData;
        } else {
            // 新接口格式 (OpenAI兼容): { choices: [{ message: { content: "..." } }] }
            if (resultData && resultData.choices && resultData.choices[0]) {
                markdownResult = resultData.choices[0].message?.content || resultData.choices[0].text;
            }
            // 如果上面没有获取到结果，尝试其他可能的字段
            if (!markdownResult && resultData && typeof resultData === 'string') {
                markdownResult = resultData;
            }
            if (!markdownResult && resultData && resultData.content) {
                markdownResult = resultData.content;
            }
        }

        if (typeof markdownResult !== 'string' || !markdownResult.trim()) {
            console.error("[Poetry AI] API返回结果格式不正确:", resultData);
            throw new Error('API返回结果格式不正确，无法解析');
        }
        const finalResult = markdownResult.trim();
        saveInterpretationToCache(title, author, finalResult);
        return finalResult;
    } catch (error) {
        console.error("[Poetry AI] Error:", error);
        // 如果是网络或API错误，提供更友好的错误信息
        if (error.message.includes('网络') || error.message.includes('API') || error.message.includes('请求失败')) {
            throw new Error('AI服务暂时不可用，请稍后重试');
        }
        throw error;
    }
}

// 复制诗词
function copyPoemToClipboard() {
    if (!currentPoem) return;
    const content = currentPoem.content.replace(/\\n/g, '\n');
    const text = `${currentPoem.title}\n${currentPoem.auth}\n\n${content}`;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copyBtn');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✅';
            setTimeout(() => btn.textContent = originalText, 2000);
        }
    }).catch(err => alert('复制失败，请手动复制'));
}

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

window.hideSearch = function() {
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('searchResults').style.display = 'none';
};

window.performSearch = function() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;
    const queryLower = query.toLowerCase();
    const results = (allPoems || []).filter(poem =>
        (poem.title && poem.title.toLowerCase().includes(queryLower)) ||
        (poem.content && poem.content.includes(query)) ||
        (poem.auth && poem.auth.includes(query)) ||
        (poem.tags && poem.tags.some(tag => tag.toLowerCase().includes(queryLower)))
    );
    displaySearchResults(results);
};

window.handleSearchKeyPress = function(event) {
    if (event.key === 'Enter') performSearch();
};

function displaySearchResults(results) {
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
    document.getElementById('searchResults').style.display = 'block';
}

function togglePoemLayout() {
    // Deprecated, handled by layoutToggleBtn click listener above
}

async function showAIInterpretation() {
    if (!currentPoem) return;
    const descContent = document.getElementById('poemDescContent');
    const desc = document.getElementById('poemDesc');
    descContent.style.display = 'block';
    
    let originalDesc = desc.innerHTML;
    if (originalDesc.includes('border-top: 1px dashed #ddd')) {
        originalDesc = originalDesc.split('<div style="border-top: 1px dashed #ddd')[0];
    }
    
    const separator = '<div style="border-top: 1px dashed #ddd; margin: 20px 0;"></div>';
    const loadingBadge = '<div style="display:inline-block; background:linear-gradient(90deg, #6366f1, #8b5cf6); color:white; padding:2px 8px; border-radius:12px; font-size:0.8rem; margin-bottom:10px; font-weight:bold;">✨ AI 正在思考...</div>';
    desc.innerHTML = originalDesc + separator + loadingBadge + '<div class="loading-spinner" style="margin: 20px auto;"></div>';
    
    try {
        const verse = currentPoem.content.replace(/\\n/g, '\n');
        const result = await getRealPoemInterpretation(currentPoem.title, currentPoem.auth, verse, originalDesc); // 使用用户设置的接口类型
        const aiBadge = '<div style="display:inline-block; background:linear-gradient(90deg, #6366f1, #8b5cf6); color:white; padding:2px 8px; border-radius:12px; font-size:0.8rem; margin-bottom:10px; font-weight:bold;">✨ AI 深度赏析 <span onclick="window.regenerateAnalysis()" style="cursor:pointer; margin-left:10px; font-size:0.8em; opacity:0.8; border-bottom:1px solid white;" title="重新生成解读">🔄 重新生成</span></div>';
        desc.innerHTML = originalDesc + separator + aiBadge + markdownToHtml(result);
    } catch (error) {
        desc.innerHTML = originalDesc + separator + `<div style="color:red;">AI解读失败: ${error.message}</div>`;
    }
}

window.regenerateAnalysis = async function() {
    if (!currentPoem) return;
    const desc = document.getElementById('poemDesc');
    let originalDesc = desc.innerHTML.split('<div style="border-top: 1px dashed #ddd')[0];
    const separator = '<div style="border-top: 1px dashed #ddd; margin: 20px 0;"></div>';
    const loadingBadge = '<div style="display:inline-block; background:linear-gradient(90deg, #6366f1, #8b5cf6); color:white; padding:2px 8px; border-radius:12px; font-size:0.8rem; margin-bottom:10px; font-weight:bold;">✨ AI 正在重新思考...</div>';
    
    desc.innerHTML = originalDesc + separator + loadingBadge + '<div class="loading-spinner" style="margin: 20px auto;"></div>';
    
    try {
        const verse = currentPoem.content.replace(/\\n/g, '\n');
        const result = await getRealPoemInterpretation(currentPoem.title, currentPoem.auth, verse, originalDesc, true); // forceRefresh=true, 使用用户设置的接口类型
        const aiBadge = '<div style="display:inline-block; background:linear-gradient(90deg, #6366f1, #8b5cf6); color:white; padding:2px 8px; border-radius:12px; font-size:0.8rem; margin-bottom:10px; font-weight:bold;">✨ AI 深度赏析 <span onclick="window.regenerateAnalysis()" style="cursor:pointer; margin-left:10px; font-size:0.8em; opacity:0.8; border-bottom:1px solid white;" title="重新生成解读">🔄 重新生成</span></div>';
        desc.innerHTML = originalDesc + separator + aiBadge + markdownToHtml(result);
    } catch (error) {
        desc.innerHTML = originalDesc + separator + `<div style="color:red;">重新生成失败: ${error.message}</div>`;
    }
};

function showAuthorInfo(authorName) {
    if (!authorName) return;
    const authorInfo = AUTHOR_DATA.find(a => a.name === authorName);
    if (!authorInfo) {
        alert(`未找到作者"${authorName}"的详细信息`);
        return;
    }
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center;
        z-index: 10000; backdrop-filter: blur(5px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: var(--container-bg); border-radius: 20px; max-width: 600px; max-height: 80vh;
        overflow-y: auto; padding: 30px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); position: relative;
    `;
    
    let html = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: var(--xhs-pink); margin: 0 0 10px 0; font-family: 'Noto Serif SC', serif;">${authorInfo.name}</h2>
            <div style="color: var(--text-secondary); font-size: 0.9rem;">${authorInfo.dynasty} · ${authorInfo.life_span}</div>
            ${authorInfo.titles ? `<div style="margin-top: 10px;">${authorInfo.titles.map(t => `<span style="display: inline-block; background: var(--xhs-pink-lighter); color: var(--xhs-pink); padding: 3px 10px; border-radius: 12px; margin: 3px; font-size: 0.85rem;">${t}</span>`).join('')}</div>` : ''}
        </div>
        ${authorInfo.bio ? `<div style="margin-bottom: 20px;"><h3 style="color: var(--xhs-pink); font-size: 1.1rem; margin-bottom: 10px;">📖 生平简介</h3><p style="line-height: 1.8; color: var(--text-primary); text-indent: 2em;">${authorInfo.bio}</p></div>` : ''}
        ${authorInfo.achievements ? `<div style="margin-bottom: 20px;"><h3 style="color: var(--xhs-pink); font-size: 1.1rem; margin-bottom: 10px;">🏆 文学成就</h3><p style="line-height: 1.8; color: var(--text-primary); text-indent: 2em;">${authorInfo.achievements}</p></div>` : ''}
        ${authorInfo.style ? `<div style="margin-bottom: 20px;"><h3 style="color: var(--xhs-pink); font-size: 1.1rem; margin-bottom: 10px;">🎨 创作风格</h3><p style="line-height: 1.8; color: var(--text-primary); text-indent: 2em;">${authorInfo.style}</p></div>` : ''}
        ${authorInfo.works && authorInfo.works.length > 0 ? `<div style="margin-bottom: 20px;"><h3 style="color: var(--xhs-pink); font-size: 1.1rem; margin-bottom: 10px;">📝 代表作品</h3>${authorInfo.works.map(work => `<div style="margin-bottom: 12px; padding: 10px; background: var(--bg-lighter); border-radius: 10px;"><div style="font-weight: 600; color: var(--text-primary); margin-bottom: 5px;">《${work.title}》</div><div style="color: var(--text-secondary); font-size: 0.9rem; font-style: italic;">${work.line}</div></div>`).join('')}</div>` : ''}
        <button id="closeAuthorInfo" style="width: 100%; padding: 12px; background: linear-gradient(135deg, var(--xhs-pink), var(--xhs-pink-light)); color: white; border: none; border-radius: 10px; font-size: 1rem; cursor: pointer; transition: all 0.3s ease;">关闭</button>
    `;
    
    modalContent.innerHTML = html;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    const closeBtn = document.getElementById('closeAuthorInfo');
    const closeModal = () => document.body.removeChild(modal);
    closeBtn.onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
    
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// 设置AI模型的全局函数
window.setAIModel = function(modelId) {
    setUserPreferredModel(modelId);

    // Update UI to show selected model
    const aiModelOptions = document.querySelectorAll('.ai-model-option');
    aiModelOptions.forEach(option => {
        if (option.textContent.includes(modelId)) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });

    // Close the menu
    const aiModelMenu = document.getElementById('aiModelMenu');
    if (aiModelMenu) {
        aiModelMenu.classList.remove('active');
    }

    console.log('已设置AI模型:', modelId);
};

// 设置AI接口类型的全局函数
window.setAIInterface = function(useLegacy) {
    setUserPreferredInterface(useLegacy);

    // Update UI to show selected interface
    const aiInterfaceOptions = document.querySelectorAll('.ai-interface-option');
    aiInterfaceOptions.forEach(option => {
        if ((useLegacy && option.dataset.interface === 'legacy') ||
            (!useLegacy && option.dataset.interface === 'new')) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });

    console.log('已设置AI接口类型:', useLegacy ? '旧接口(ai/explain)' : '新接口(v1/chat/completions)');
};

// 初始化AI模型选择界面
function initAIMenu() {
    // Highlight the currently selected model
    const currentModel = getUserPreferredModel();
    const aiModelOptions = document.querySelectorAll('.ai-model-option');
    aiModelOptions.forEach(option => {
        if (option.textContent.includes(currentModel)) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });

    // Highlight the currently selected interface
    const currentInterface = getUserPreferredInterface();
    const aiInterfaceOptions = document.querySelectorAll('.ai-interface-option');
    aiInterfaceOptions.forEach(option => {
        if ((currentInterface && option.dataset.interface === 'legacy') ||
            (!currentInterface && option.dataset.interface === 'new')) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

// --- 统一暴露全局函数 ---
// 这样在 JSBox 或其他外部脚本中可以直接调用这些函数，无需每次手动修改
Object.assign(window, {
    // 核心功能
    loadRandomPoem,
    renderWaterfall,
    displayPoem,

    // AI 相关
    showAIInterpretation,
    regenerateAnalysis,
    setAIModel,
    setAIInterface,

    // 布局与显示
    toggleScrollMode,
    togglePoemLayout,
    switchTheme,
    showAuthorInfo,
    showAuthorWorks,

    // 交互操作
    copyPoemToClipboard,
    toggleFavorite,
    addToHistory,
    handleTagClick,

    // 搜索相关
    toggleSearch,
    performSearch,
    hideSearch,
    handleSearchKeyPress
});

console.log('Poetry App: All interactive functions have been exposed to global scope.');

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .then(registration => {
        console.log('Service Worker registered successfully:', registration.scope);

        // Send message to skip waiting if there's an updated service worker
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New update available
              if (confirm('应用有新版本，是否更新？')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

export { copyPoemToClipboard, togglePoemLayout, showAIInterpretation };