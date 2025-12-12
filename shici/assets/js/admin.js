/**
 * assets/js/admin.js
 * 对应你最新的 JSON 结构: { rhythmic, author, paragraphs, tags }
 */

// ✅ 1. 配置地址
// 读取地址：改回使用 Worker 读取，因为 Worker 代码里已经正确配置了 CORS 头
const READ_URL = 'https://shici.want.biz';
// 保存地址：通过 Cloudflare Worker 写入
const WRITE_URL = 'https://shici.want.biz'; 

let currentToken = '';
let currentData = [];
let filteredData = []; // 存储筛选后的数据

// Wait for DOM to load before initializing elements and attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素引用 - 定义在 DOM 加载完成后
    const loginSection = document.getElementById('login-section');
    const managerSection = document.getElementById('manager-section');
    const tokenInput = document.getElementById('admin-token');
    const loginBtn = document.getElementById('login-btn');
    const loginMsg = document.getElementById('login-msg');

    // 搜索和筛选元素
    const searchInput = document.getElementById('search-input');
    const authorFilter = document.getElementById('author-filter');
    const tagFilter = document.getElementById('tag-filter');
    const searchBtn = document.getElementById('search-btn');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const searchResultsCount = document.getElementById('search-results-count');

    // ============================================================
    // 1. 登录逻辑
    // ============================================================
    loginBtn.addEventListener('click', async () => {
        const token = tokenInput.value.trim();
        if (!token) {
            showLoginMessage('请输入密钥', 'error');
            return;
        }

        loginBtn.textContent = '验证中...';
        loginBtn.disabled = true;
        loginMsg.textContent = '';

        // 暂存 Token
        currentToken = token;

        try {
            // 先尝试加载数据来验证token是否有效
            // 直接切换到管理界面
            loginSection.classList.add('hidden');
            managerSection.classList.remove('hidden');

            // 绑定搜索和筛选事件监听器
            bindSearchEventListeners();

            // 异步加载数据
            await loadData();

            showLoginMessage('登录成功！', 'success');
        } catch (error) {
            console.error(error);

            // 如果加载数据失败，说明token可能无效，退回登录界面
            loginSection.classList.remove('hidden');
            managerSection.classList.add('hidden');

            // 恢复按钮状态
            loginBtn.textContent = '✨ 验证并登录';
            loginBtn.disabled = false;

            showLoginMessage(`登录失败: ${error.message}`, 'error');
        }
    });

    // ============================================================
    // 1.1 绑定搜索和筛选事件监听器
    // ============================================================
    function bindSearchEventListeners() {
        // 搜索按钮点击事件
        searchBtn.addEventListener('click', applyFilters);

        // 按回车键也触发搜索
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });

        // 作者筛选变化时触发
        authorFilter.addEventListener('change', applyFilters);

        // 标签筛选变化时触发
        tagFilter.addEventListener('change', applyFilters);

        // 清除筛选按钮点击事件
        clearSearchBtn.addEventListener('click', clearFilters);
    }

    // 显示登录消息的辅助函数
    function showLoginMessage(message, type) {
        loginMsg.textContent = message;
        loginMsg.className = `message ${type}`;
    }

    // ============================================================
    // 2. 加载数据 (GET)
    // ============================================================
    async function loadData() {
        // 修改：从公开 JSON 地址读取，而不是从 Worker 读取
        // 这样可以避免 Worker GET 逻辑没写好导致读不到数据的问题
        // Note: Reading typically doesn't require a token, but we'll try both approaches
        let res;
        let errorMessage = '';

        try {
            // First try to fetch without token (for public read access)
            res = await fetch(READ_URL + '?t=' + Date.now()); // 加时间戳防缓存
        } catch (fetchError) {
            console.warn('Public fetch failed, trying with token:', fetchError);
            // If public fetch fails, try with token as fallback
            res = await fetch(READ_URL + '?t=' + Date.now(), {
                headers: {
                    'X-Admin-Token': currentToken  // Include token for authentication if needed
                }
            });
        }

        if (!res.ok) {
            if (res.status === 403) {
                throw new Error('密钥错误或权限不足');
            } else {
                throw new Error(`网络请求失败: ${res.status}`);
            }
        }

        // 解析 JSON
        currentData = await res.json();

        // 简单校验一下数据格式，确保是数组
        if (!Array.isArray(currentData)) {
            console.error('读到的数据不是数组:', currentData);
            currentData = [];
        }

        // 初始化筛选选项
        initializeFilters();

        renderList();
    }

    // Add helper functions that are used inside the DOMContentLoaded scope
    async function initializeFilters() {
        // 获取所有唯一作者
        const authors = [...new Set(currentData.map(poem => poem.author))];

        // 清空并填充作者选择器
        authorFilter.innerHTML = '<option value="">全部作者</option>';
        authors.forEach(author => {
            if (author) {
                const option = document.createElement('option');
                option.value = author;
                option.textContent = author;
                authorFilter.appendChild(option);
            }
        });

        // 获取所有唯一标签
        const allTags = new Set();
        currentData.forEach(poem => {
            if (poem.tags && Array.isArray(poem.tags)) {
                poem.tags.forEach(tag => {
                    if (tag) allTags.add(tag);
                });
            }
        });

        // 清空并填充标签选择器
        tagFilter.innerHTML = '<option value="">全部标签</option>';
        [...allTags].sort().forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagFilter.appendChild(option);
        });
    }

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedAuthor = authorFilter.value;
        const selectedTag = tagFilter.value;

        // 根据筛选条件过滤数据
        filteredData = currentData.filter(poem => {
            // 搜索词匹配（标题/rhythmic、作者、标签）
            const matchesSearch = !searchTerm ||
                (poem.rhythmic && poem.rhythmic.toLowerCase().includes(searchTerm)) ||
                (poem.author && poem.author.toLowerCase().includes(searchTerm)) ||
                (poem.tags && Array.isArray(poem.tags) &&
                 poem.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

            // 作者筛选
            const matchesAuthor = !selectedAuthor || poem.author === selectedAuthor;

            // 标签筛选
            const matchesTag = !selectedTag ||
                (poem.tags && Array.isArray(poem.tags) && poem.tags.includes(selectedTag));

            return matchesSearch && matchesAuthor && matchesTag;
        });

        // 更新搜索结果计数
        searchResultsCount.textContent = `找到 ${filteredData.length} 条结果`;

        // 重新渲染列表（使用过滤后的数据）
        renderList(0, true); // 使用过滤后的数据，并重置到第一页
    }

    function clearFilters() {
        searchInput.value = '';
        authorFilter.value = '';
        tagFilter.value = '';
        searchResultsCount.textContent = '';
        filteredData = [...currentData]; // 重置为全部数据

        renderList(0, false); // 使用全部数据，并重置到第一页
    }

    function renderList(startIndex = null, useFilteredData = false) {
        const listEl = document.getElementById('poem-list');

        // 根据参数决定使用原始数据还是过滤后的数据
        const dataToUse = useFilteredData ? filteredData : currentData;
        document.getElementById('count').textContent = dataToUse.length;

        listEl.innerHTML = '';

        // 只显示最新的20条数据，提高性能
        const itemsToShow = 20;
        let recentData, actualStartIndex;

        if (startIndex !== null && startIndex >= 0) {
            // 如果指定了起始索引，显示从该索引开始的20条数据
            actualStartIndex = Math.max(0, startIndex);
            recentData = dataToUse.slice(actualStartIndex, actualStartIndex + itemsToShow);
        } else {
            // 否则显示最新的20条数据
            recentData = dataToUse.slice(-itemsToShow);
            actualStartIndex = Math.max(0, dataToUse.length - itemsToShow);
        }

        // 倒序排列，让新添加的显示在最上面 (在当前显示的数据范围内)
        recentData.slice().reverse().forEach((poem, index) => {
            // 计算原始索引 (相对于原始完整数据集)
            // 当使用过滤数据时，需要查找该诗在原数组中的实际索引
            let originalIndex;
            if (useFilteredData) {
                originalIndex = currentData.findIndex(item =>
                    item.rhythmic === poem.rhythmic &&
                    item.author === poem.author &&
                    JSON.stringify(item.paragraphs) === JSON.stringify(poem.paragraphs) &&
                    JSON.stringify(item.tags) === JSON.stringify(poem.tags)
                );
            } else {
                originalIndex = actualStartIndex + (recentData.length - 1 - index);
            }

            const item = document.createElement('div');
            item.className = 'poem-item';

            // ✅ 适配你的新字段：rhythmic (作为标题)
            // 如果旧数据里只有 title，为了兼容显示，做个 || 处理
            const displayTitle = poem.rhythmic || poem.title || '无标题';

            item.innerHTML = `
                <div style="flex:1;">
                    <b>${displayTitle}</b>
                    <span style="color:#666; font-size:0.9em;"> - ${poem.author}</span>
                    <br>
                    <small style="color:#999;">${poem.tags ? poem.tags.join(', ') : ''}</small>
                </div>
                <button class="delete-btn" data-idx="${originalIndex}">删除</button>
            `;
            listEl.appendChild(item);
        });

        // 重新绑定删除按钮事件
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-idx');
                deletePoem(idx);
            });
        });

        // 添加分页控件
        if (dataToUse.length > itemsToShow) {
            const paginationDiv = document.createElement('div');
            paginationDiv.style.textAlign = 'center';
            paginationDiv.style.marginTop = '15px';
            paginationDiv.style.color = '#666';

            // 计算当前页码
            const totalPages = Math.ceil(dataToUse.length / itemsToShow);
            const currentPage = Math.floor(actualStartIndex / itemsToShow) + 1;

            // 生成分页控件 HTML
            let paginationHTML = `<div style="margin-bottom: 10px">显示 ${actualStartIndex + 1} - ${Math.min(actualStartIndex + itemsToShow, dataToUse.length)} 条，共 ${dataToUse.length} 条</div>`;

            paginationHTML += '<div style="display: flex; justify-content: center; gap: 5px;">';

            // 上一页按钮
            if (currentPage > 1) {
                paginationHTML += `<button id="prev-page" style="padding: 5px 10px; margin: 0 2px;">&lt; 上一页</button>`;
            }

            // 页码按钮
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);

            if (startPage > 1) {
                paginationHTML += `<button class="page-btn" data-page="${useFilteredData ? 'filtered:' : ''}0" style="padding: 5px 10px; margin: 0 2px;">1</button>`;
                if (startPage > 2) {
                    paginationHTML += `<span style="padding: 5px 10px; margin: 0 2px;">...</span>`;
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                const isActive = i === currentPage;
                const pageNum = i - 1; // 转换为0基索引
                const pageDataPrefix = useFilteredData ? 'filtered:' : '';
                paginationHTML += `<button class="${isActive ? 'current-page' : 'page-btn'}" data-page="${pageDataPrefix}${pageNum}" style="padding: 5px 10px; margin: 0 2px; ${isActive ? 'font-weight: bold; background-color: #007bff; color: white;' : ''}">${i}</button>`;
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    paginationHTML += `<span style="padding: 5px 10px; margin: 0 2px;">...</span>`;
                }
                paginationHTML += `<button class="page-btn" data-page="${pageDataPrefix}${totalPages - 1}" style="padding: 5px 10px; margin: 0 2px;">${totalPages}</button>`;
            }

            // 下一页按钮
            if (currentPage < totalPages) {
                paginationHTML += `<button id="next-page" style="padding: 5px 10px; margin: 0 2px;">下一页 &gt;</button>`;
            }

            paginationHTML += '</div>';

            paginationDiv.innerHTML = paginationHTML;
            listEl.appendChild(paginationDiv);

            // 绑定分页按钮事件
            document.querySelectorAll('#prev-page').forEach(btn => {
                btn.addEventListener('click', () => {
                    const newStartIndex = Math.max(0, actualStartIndex - itemsToShow);
                    renderList(newStartIndex, useFilteredData);
                });
            });

            document.querySelectorAll('#next-page').forEach(btn => {
                btn.addEventListener('click', () => {
                    const newStartIndex = actualStartIndex + itemsToShow;
                    if (newStartIndex < dataToUse.length) {
                        renderList(newStartIndex, useFilteredData);
                    }
                });
            });

            document.querySelectorAll('.page-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const pageDataValue = e.target.getAttribute('data-page');
                    const useFiltered = pageDataValue.startsWith('filtered:');
                    const pageNum = parseInt(pageDataValue.replace('filtered:', ''));
                    const newStartIndex = pageNum * itemsToShow;

                    if (useFiltered) {
                        renderList(newStartIndex, true);
                    } else {
                        renderList(newStartIndex, false);
                    }
                });
            });
        }
    }

    async function deletePoem(index) {
        if(!confirm('确定要删除这首吗？')) return;

        // 从数组移除
        currentData.splice(index, 1);
        await syncToCloud();

        // 确保筛选数据同步更新
        filteredData = [...currentData];
    }

    async function syncToCloud() {
        const btn = document.getElementById('save-btn');
        const originalText = btn.textContent;
        btn.textContent = '正在保存到云端...';
        btn.disabled = true;

        try {
            const res = await fetch(WRITE_URL, {
                method: 'PUT',  // Changed from POST to PUT to use overwrite mode instead of append mode
                headers: {
                    'Content-Type': 'application/json',
                    // ✅ 必须带上 Token
                    'X-Admin-Token': currentToken
                },
                // ✅ 发送完整的数组
                body: JSON.stringify(currentData)
            });

            if (res.status === 403) {
                alert('保存失败：密钥错误！(Error 403)');
            } else if (res.ok) {
                alert('保存成功！');
                // 重新加载数据以确保与服务器状态同步 and prevent potential duplication issues
                await loadData();
            } else {
                alert('保存失败，状态码: ' + res.status);
            }
        } catch (e) {
            console.error(e);
            alert('网络错误，请检查控制台日志');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }
});


