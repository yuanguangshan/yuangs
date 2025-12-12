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

// DOM 元素引用
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
        alert('请输入密钥');
        return;
    }

    loginBtn.textContent = '验证中...';
    loginBtn.disabled = true;

    // 暂存 Token
    currentToken = token;

    // 直接切换到管理界面
    loginSection.classList.add('hidden');
    managerSection.classList.remove('hidden');
    loginMsg.textContent = '';

    // 绑定搜索和筛选事件监听器
    bindSearchEventListeners();

    // 异步加载数据
    loadData().catch(err => {
        console.error(err);
        alert('注意：读取现有数据失败，请检查网络或跨域配置。\n您可以尝试刷新页面。');
    });
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

// ============================================================
// 2. 加载数据 (GET)
// ============================================================
async function loadData() {
    // 修改：从公开 JSON 地址读取，而不是从 Worker 读取
    // 这样可以避免 Worker GET 逻辑没写好导致读不到数据的问题
    const res = await fetch(READ_URL + '?t=' + Date.now()); // 加时间戳防缓存
    if (!res.ok) throw new Error('Network response was not ok');

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

// ============================================================
// 2.1 初始化筛选选项
// ============================================================
function initializeFilters() {
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

// ============================================================
// 2.2 执行搜索和筛选
// ============================================================
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

// ============================================================
// 2.3 清除搜索和筛选
// ============================================================
function clearFilters() {
    searchInput.value = '';
    authorFilter.value = '';
    tagFilter.value = '';
    searchResultsCount.textContent = '';
    filteredData = [...currentData]; // 重置为全部数据

    renderList(0, false); // 使用全部数据，并重置到第一页
}

// ============================================================
// 3. 渲染列表
// ============================================================
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

// ============================================================
// 4. 添加数据 (POST) - 核心修改部分
// ============================================================
document.getElementById('save-btn').addEventListener('click', async () => {
    // 获取输入框的值
    const titleVal = document.getElementById('title').value.trim(); // 对应 rhythmic
    const authorVal = document.getElementById('author').value.trim();
    const tagsVal = document.getElementById('dynasty').value.trim(); // 对应 tags (借用朝代输入框)
    const contentVal = document.getElementById('content').value.trim(); // 对应 paragraphs

    // 简单校验
    if (!titleVal || !contentVal) {
        alert('标题(rhythmic) 和 内容(paragraphs) 必填');
        return;
    }

    // ✅ 构造符合你新 JSON 结构的对象
    const newPoem = {
        author: authorVal || '佚名',

        // 1. 标题映射到 rhythmic
        rhythmic: titleVal,

        // 2. 内容按换行符分割成数组，映射到 paragraphs
        paragraphs: contentVal.split('\n').filter(line => line.trim() !== ''),

        // 3. 将"朝代"输入框的内容，按逗号分割成 tags 数组
        // 输入示例："道德经, 先秦" -> ["道德经", "先秦"]
        tags: tagsVal ? tagsVal.split(/[,，]/).map(t => t.trim()) : []
    };

    // Check for duplicate entries before adding to prevent potential duplication
    const isDuplicate = currentData.some(existingPoem =>
        existingPoem.rhythmic === newPoem.rhythmic &&
        existingPoem.author === newPoem.author &&
        JSON.stringify(existingPoem.paragraphs) === JSON.stringify(newPoem.paragraphs) &&
        JSON.stringify(existingPoem.tags) === JSON.stringify(newPoem.tags)
    );

    if (isDuplicate) {
        alert('该诗词已存在，无法重复添加！');
        return;
    }

    // 添加到本地数组
    currentData.push(newPoem);

    // 同步到云端
    await syncToCloud();

    // 清空表单
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('dynasty').value = ''; // 清空 tags
    document.getElementById('content').value = '';
});

// ============================================================
// 5. 删除数据
// ============================================================
async function deletePoem(index) {
    if(!confirm('确定要删除这首吗？')) return;
    
    // 从数组移除
    currentData.splice(index, 1);
    await syncToCloud();
}

// ============================================================
// 6. 同步保存到云端 (Worker)
// ============================================================
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

// ============================================================
// 7. 数据更新后保持搜索筛选状态
// ============================================================
// 在删除操作后也应用筛选，以防删除的是当前显示的最后一个项目
async function deletePoem(index) {
    if(!confirm('确定要删除这首吗？')) return;

    // 从数组移除
    currentData.splice(index, 1);
    await syncToCloud();

    // 确保筛选数据同步更新
    filteredData = [...currentData];
}