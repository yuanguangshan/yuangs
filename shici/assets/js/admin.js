/**
 * assets/js/admin.js
 * 对应你最新的 JSON 结构: { rhythmic, author, paragraphs, tags }
 */

// ✅ 1. 配置地址
// 读取地址：使用 Worker 读取（Worker 已配置 CORS）
// 保存地址：通过 Cloudflare Worker 写入
const READ_URL = 'https://shici.want.biz';
const WRITE_URL = 'https://shici.want.biz';

let currentToken = '';
let currentData = [];
let filteredData = []; // 存储筛选后的数据

// 防止重复绑定搜索/筛选事件（例如重复登录但不刷新页面）
let searchListenersBound = false;

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
      // 直接切换到管理界面（你这里是用“能否加载数据”来间接验证 token）
      loginSection.classList.add('hidden');
      managerSection.classList.remove('hidden');

      // 绑定搜索和筛选事件监听器（只绑定一次，避免重复登录导致叠加）
      bindSearchEventListeners();

      // 异步加载数据
      await loadData();

      showLoginMessage('登录成功！', 'success');
    } catch (error) {
      console.error(error);

      // 如果加载数据失败，说明 token 可能无效，退回登录界面
      loginSection.classList.remove('hidden');
      managerSection.classList.add('hidden');

      // 恢复按钮状态
      loginBtn.textContent = '✨ 验证并登录';
      loginBtn.disabled = false;

      showLoginMessage(`登录失败: ${error.message}`, 'error');
    }
  });

  // ============================================================
  // 1.1 绑定搜索和筛选事件监听器（只绑定一次）
  // ============================================================
  function bindSearchEventListeners() {
    if (searchListenersBound) return;
    searchListenersBound = true;

    // 搜索按钮点击事件
    searchBtn.addEventListener('click', applyFilters);

    // 按回车键也触发搜索
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applyFilters();
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
    let res;

    try {
      // 先尝试不带 token（公开读）
      res = await fetch(READ_URL + '?t=' + Date.now(), {
  headers: { 'X-Admin-Token': currentToken }
});
    } catch (fetchError) {
      console.warn('Public fetch failed, trying with token:', fetchError);
      // 公共读失败再带 token
      res = await fetch(READ_URL + '?t=' + Date.now(), {
        headers: { 'X-Admin-Token': currentToken }
      });
    }

    if (!res.ok) {
      if (res.status === 403) throw new Error('密钥错误或权限不足');
      throw new Error(`网络请求失败: ${res.status}`);
    }

    currentData = await res.json();

    // 简单校验一下数据格式，确保是数组
    if (!Array.isArray(currentData)) {
      console.error('读到的数据不是数组:', currentData);
      currentData = [];
    }

    // 载入后默认显示全量
    filteredData = [...currentData];

    // 初始化筛选选项
    initializeFilters();

    // 按当前筛选控件的值渲染（一般是空=全量）
    applyFilters();
  }

  // ============================================================
  // 3. 初始化筛选下拉（作者/标签）
  // ============================================================
  function initializeFilters() {
    // 获取所有唯一作者
    const authors = [...new Set(currentData.map(poem => poem.author).filter(Boolean))];

    // 清空并填充作者选择器
    const currentAuthorValue = authorFilter.value; // 尝试保留用户当前选择
    authorFilter.innerHTML = '<option value="">全部作者</option>';
    authors.forEach(author => {
      const option = document.createElement('option');
      option.value = author;
      option.textContent = author;
      authorFilter.appendChild(option);
    });
    // 还原选择（如果该作者仍存在）
    if (authors.includes(currentAuthorValue)) authorFilter.value = currentAuthorValue;

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
    const currentTagValue = tagFilter.value; // 尝试保留用户当前选择
    tagFilter.innerHTML = '<option value="">全部标签</option>';
    [...allTags].sort().forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      tagFilter.appendChild(option);
    });
    if ([...allTags].includes(currentTagValue)) tagFilter.value = currentTagValue;
  }

  // ============================================================
  // 4. 本地筛选（不请求云端）
  // ============================================================
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedAuthor = authorFilter.value;
    const selectedTag = tagFilter.value;

    filteredData = currentData.filter(poem => {
      const matchesSearch = !searchTerm ||
        (poem.rhythmic && poem.rhythmic.toLowerCase().includes(searchTerm)) ||
        (poem.author && poem.author.toLowerCase().includes(searchTerm)) ||
        (poem.tags && Array.isArray(poem.tags) &&
          poem.tags.some(tag => (tag || '').toLowerCase().includes(searchTerm)));

      const matchesAuthor = !selectedAuthor || poem.author === selectedAuthor;

      const matchesTag = !selectedTag ||
        (poem.tags && Array.isArray(poem.tags) && poem.tags.includes(selectedTag));

      return matchesSearch && matchesAuthor && matchesTag;
    });

    // 使用过滤后的数据渲染，回到第一页
    renderList(0, true);
  }

  function clearFilters() {
    searchInput.value = '';
    authorFilter.value = '';
    tagFilter.value = '';

    filteredData = [...currentData];
    renderList(0, true);
  }

  // ============================================================
  // 5. 渲染列表 + 分页（只渲染本地数据）
  // ============================================================
  function renderList(startIndex = null, useFilteredData = false) {
    const listEl = document.getElementById('poem-list');
    const dataToUse = useFilteredData ? filteredData : currentData;

    document.getElementById('count').textContent = dataToUse.length;
    listEl.innerHTML = '';

    // 只显示每页20条，提高性能
    const itemsToShow = 20;
    let pageData, actualStartIndex;

    if (startIndex !== null && startIndex >= 0) {
      actualStartIndex = Math.max(0, startIndex);
      pageData = dataToUse.slice(actualStartIndex, actualStartIndex + itemsToShow);
    } else {
      pageData = dataToUse.slice(-itemsToShow);
      actualStartIndex = Math.max(0, dataToUse.length - itemsToShow);
    }

    // 倒序排列，让新添加的显示在最上面（当前页范围内）
    pageData.slice().reverse().forEach((poem, index) => {
      let originalIndex;

      if (useFilteredData) {
        // 在 currentData 中定位原始索引（用于 edit/delete）
        originalIndex = currentData.findIndex(item =>
          item.rhythmic === poem.rhythmic &&
          item.author === poem.author &&
          JSON.stringify(item.paragraphs) === JSON.stringify(poem.paragraphs) &&
          JSON.stringify(item.tags) === JSON.stringify(poem.tags)
        );
      } else {
        originalIndex = actualStartIndex + (pageData.length - 1 - index);
      }

      const item = document.createElement('div');
      item.className = 'poem-item';

      const displayTitle = poem.rhythmic || poem.title || '无标题';

      item.innerHTML = `
        <div style="flex:1;">
          <b>${escapeHtml(displayTitle)}</b>
          <span style="color:#666; font-size:0.9em;"> - ${escapeHtml(poem.author || '')}</span>
          <br>
          <small style="color:#999;">${escapeHtml(poem.tags ? poem.tags.join(', ') : '')}</small>
        </div>
        <div class="btn-group">
          <button class="edit-btn" data-idx="${originalIndex}">✏️</button>
          <button class="delete-btn" data-idx="${originalIndex}">🗑️</button>
        </div>
      `;
      listEl.appendChild(item);
    });

    // 重新绑定删除和编辑按钮事件
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.target.getAttribute('data-idx'));
        deletePoem(idx);
      });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.target.getAttribute('data-idx'));
        editPoem(idx);
      });
    });

    // 分页控件
    if (dataToUse.length > itemsToShow) {
      const paginationContainer = document.createElement('div');
      paginationContainer.className = 'pagination-container';

      const totalPages = Math.ceil(dataToUse.length / itemsToShow);
      const currentPage = Math.floor(actualStartIndex / itemsToShow) + 1;

      // 信息文本
      const infoDiv = document.createElement('div');
      infoDiv.className = 'pagination-info';
      infoDiv.textContent = `显示 ${actualStartIndex + 1} - ${Math.min(actualStartIndex + itemsToShow, dataToUse.length)} 条，共 ${dataToUse.length} 条`;
      paginationContainer.appendChild(infoDiv);

      // 控制按钮容器
      const controlsDiv = document.createElement('div');
      controlsDiv.className = 'pagination-controls';
      paginationContainer.appendChild(controlsDiv);

      // 上一页按钮
      if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.id = 'prev-page';
        prevButton.className = 'pagination-btn pagination-prev-next';
        prevButton.innerHTML = '&lt;'; // Left arrow
        controlsDiv.appendChild(prevButton);
      }

      const maxVisiblePages = 3;
      let pagesToShow = [];

      // Calculate which pages to show
      if (totalPages <= maxVisiblePages) {
        // If total pages is less than or equal to max, show all
        for (let i = 1; i <= totalPages; i++) {
          pagesToShow.push(i);
        }
      } else {
        // Show current page and up to 1 page on each side, making sure we have 3 pages total centered around current page
        const leftPages = Math.floor((maxVisiblePages - 1) / 2);
        const rightPages = Math.ceil((maxVisiblePages - 1) / 2);

        let startToShow = Math.max(1, currentPage - leftPages);
        let endToShow = Math.min(totalPages, currentPage + rightPages);

        // Adjust if we're at the beginning or end
        if (endToShow - startToShow + 1 < maxVisiblePages) {
          if (startToShow === 1) {
            endToShow = Math.min(totalPages, startToShow + maxVisiblePages - 1);
          } else if (endToShow === totalPages) {
            startToShow = Math.max(1, endToShow - maxVisiblePages + 1);
          }
        }

        for (let i = startToShow; i <= endToShow; i++) {
          pagesToShow.push(i);
        }
      }

      // 第一页按钮 and ellipsis if needed
      if (pagesToShow[0] > 1) {
        const firstPageBtn = document.createElement('button');
        firstPageBtn.className = 'pagination-btn page-btn';
        firstPageBtn.setAttribute('data-page', '0');
        firstPageBtn.textContent = '1';
        controlsDiv.appendChild(firstPageBtn);

        if (pagesToShow[0] > 2) {
          const ellipsis1 = document.createElement('span');
          ellipsis1.className = 'pagination-ellipsis';
          ellipsis1.textContent = '.';
          controlsDiv.appendChild(ellipsis1);
        }
      }

      // 中间页码按钮 (the limited 3 pages)
      for (let i = 0; i < pagesToShow.length; i++) {
        const pageNumVal = pagesToShow[i];
        const isActive = pageNumVal === currentPage;
        const pageNum = pageNumVal - 1;

        const pageButton = document.createElement('button');
        pageButton.className = isActive ? 'pagination-btn current-page' : 'pagination-btn page-btn';
        pageButton.setAttribute('data-page', pageNum);
        pageButton.textContent = pageNumVal;

        controlsDiv.appendChild(pageButton);
      }

      // 最后一页按钮 and ellipsis if needed
      if (pagesToShow[pagesToShow.length - 1] < totalPages) {
        if (pagesToShow[pagesToShow.length - 1] < totalPages - 1) {
          const ellipsis2 = document.createElement('span');
          ellipsis2.className = 'pagination-ellipsis';
          ellipsis2.textContent = '.';
          controlsDiv.appendChild(ellipsis2);
        }

        const lastPageBtn = document.createElement('button');
        lastPageBtn.className = 'pagination-btn page-btn';
        lastPageBtn.setAttribute('data-page', totalPages - 1);
        lastPageBtn.textContent = totalPages;
        controlsDiv.appendChild(lastPageBtn);
      }

      // 下一页按钮
      if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.id = 'next-page';
        nextButton.className = 'pagination-btn pagination-prev-next';
        nextButton.innerHTML = '&gt;'; // Right arrow
        controlsDiv.appendChild(nextButton);
      }

      paginationContainer.appendChild(controlsDiv);
      listEl.appendChild(paginationContainer);

      // 绑定分页按钮事件
      const prev = document.getElementById('prev-page');
      if (prev) {
        prev.addEventListener('click', () => {
          const newStartIndex = Math.max(0, actualStartIndex - itemsToShow);
          renderList(newStartIndex, useFilteredData);
        });
      }

      const next = document.getElementById('next-page');
      if (next) {
        next.addEventListener('click', () => {
          const newStartIndex = actualStartIndex + itemsToShow;
          if (newStartIndex < dataToUse.length) renderList(newStartIndex, useFilteredData);
        });
      }

      document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const pageNum = Number(e.target.getAttribute('data-page'));
          const newStartIndex = pageNum * itemsToShow;
          renderList(newStartIndex, useFilteredData);
        });
      });
    }
  }

  // ============================================================
  // 6. 删除
  // ============================================================
  async function deletePoem(index) {
    if (!Number.isInteger(index) || index < 0 || index >= currentData.length) return;
    const poem = currentData[index];
    const title = poem.rhythmic || poem.title || '无标题';
    const author = poem.author || '佚名';
    if (!confirm(`确定要删除《${title}》(${author})吗？此操作不可撤销！`)) return;

    currentData.splice(index, 1);
    await syncToCloud();

    // 不重拉：直接更新筛选项 + 列表
    initializeFilters();
    applyFilters();
  }

  // ============================================================
  // 7. 保存（新增/编辑）
  // ============================================================
  function savePoem() {
    const saveBtn = document.getElementById('save-btn');
    const editIndexRaw = saveBtn.dataset.editIndex;
    const editIndex = editIndexRaw === undefined ? NaN : parseInt(editIndexRaw, 10);

    const titleVal = document.getElementById('title').value.trim(); // rhythmic
    const authorVal = document.getElementById('author').value.trim();
    const tagsVal = document.getElementById('dynasty').value.trim(); // tags
    const contentVal = document.getElementById('content').value.trim(); // paragraphs

    if (!titleVal || !contentVal) {
      alert('标题(rhythmic) 和 内容(paragraphs) 必填');
      return;
    }

    const poemData = {
      author: authorVal || '佚名',
      rhythmic: titleVal,
      paragraphs: contentVal.split('\n').map(s => s.trim()).filter(Boolean),
      tags: tagsVal ? tagsVal.split(/[,，]/).map(t => t.trim()).filter(Boolean) : []
    };

    if (!isNaN(editIndex)) {
      // 更新
      const isDuplicate = currentData.some((existingPoem, idx) =>
        idx !== editIndex &&
        existingPoem.rhythmic === poemData.rhythmic &&
        existingPoem.author === poemData.author &&
        JSON.stringify(existingPoem.paragraphs) === JSON.stringify(poemData.paragraphs) &&
        JSON.stringify(existingPoem.tags) === JSON.stringify(poemData.tags)
      );
      if (isDuplicate) {
        alert('该诗词已存在，无法重复添加！');
        return;
      }

      currentData[editIndex] = poemData;

      syncToCloud().then(() => {
        saveBtn.textContent = '✨ 保存并发布到云端';
        delete saveBtn.dataset.editIndex;

        initializeFilters();
        applyFilters();
      });
    } else {
      // 新增
      const isDuplicate = currentData.some(existingPoem =>
        existingPoem.rhythmic === poemData.rhythmic &&
        existingPoem.author === poemData.author &&
        JSON.stringify(existingPoem.paragraphs) === JSON.stringify(poemData.paragraphs) &&
        JSON.stringify(existingPoem.tags) === JSON.stringify(poemData.tags)
      );
      if (isDuplicate) {
        alert('该诗词已存在，无法重复添加！');
        return;
      }

      currentData.push(poemData);

      syncToCloud().then(() => {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('dynasty').value = '';
        document.getElementById('content').value = '';

        initializeFilters();
        applyFilters();
      });
    }
  }

  function editPoem(index) {
    if (!Number.isInteger(index) || index < 0 || index >= currentData.length) return;

    const poem = currentData[index];
    document.getElementById('title').value = poem.rhythmic || poem.title || '';
    document.getElementById('author').value = poem.author || '';
    document.getElementById('dynasty').value = poem.tags ? poem.tags.join(', ') : '';
    document.getElementById('content').value = poem.paragraphs ? poem.paragraphs.join('\n') : '';

    document.getElementById('manager-section').scrollIntoView({ behavior: 'smooth' });

    const saveBtn = document.getElementById('save-btn');
    saveBtn.textContent = '更新并保存';
    saveBtn.dataset.editIndex = String(index);
  }

  // 单一事件监听（新增/编辑共用）
  document.getElementById('save-btn').addEventListener('click', savePoem);

  // ============================================================
  // 8. 写入云端（PUT 覆盖，不重拉）
  // ============================================================
  async function syncToCloud() {
    const btn = document.getElementById('save-btn');
    const originalText = btn.textContent;
    btn.textContent = '正在保存到云端...';
    btn.disabled = true;

    try {
      const res = await fetch(WRITE_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': currentToken
        },
        body: JSON.stringify(currentData)
      });

      if (res.status === 403) {
        alert('保存失败：密钥错误！(Error 403)');
        return;
      }

      if (res.ok) {
        alert('保存成功！');
        // ✅ 单人管理：不再 await loadData()，避免重拉
        return;
      }

      alert('保存失败，状态码: ' + res.status);
    } catch (e) {
      console.error(e);
      alert('网络错误，请检查控制台日志');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }

  // ============================================================
  // 9. 简单防 XSS（避免标题/作者/标签里有 < > 导致 innerHTML 注入）
  // ============================================================
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return m;
      }
    });
  }
});