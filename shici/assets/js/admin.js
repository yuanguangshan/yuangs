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

// DOM 元素引用
const loginSection = document.getElementById('login-section');
const managerSection = document.getElementById('manager-section');
const tokenInput = document.getElementById('admin-token');
const loginBtn = document.getElementById('login-btn');
const loginMsg = document.getElementById('login-msg');

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

    // 异步加载数据
    loadData().catch(err => {
        console.error(err);
        alert('注意：读取现有数据失败，请检查网络或跨域配置。\n您可以尝试刷新页面。');
    });
});

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
    
    renderList();
}

// ============================================================
// 3. 渲染列表
// ============================================================
function renderList(startIndex = null) {
    const listEl = document.getElementById('poem-list');
    document.getElementById('count').textContent = currentData.length;
    listEl.innerHTML = '';

    // 只显示最新的20条数据，提高性能
    const itemsToShow = 20;
    let recentData, actualStartIndex;

    if (startIndex !== null && startIndex >= 0) {
        // 如果指定了起始索引，显示从该索引开始的20条数据
        actualStartIndex = Math.max(0, startIndex);
        recentData = currentData.slice(actualStartIndex, actualStartIndex + itemsToShow);
    } else {
        // 否则显示最新的20条数据
        recentData = currentData.slice(-itemsToShow);
        actualStartIndex = Math.max(0, currentData.length - itemsToShow);
    }

    // 倒序排列，让新添加的显示在最上面 (在当前显示的数据范围内)
    recentData.slice().reverse().forEach((poem, index) => {
        // 计算原始索引 (相对于完整数据集)
        const originalIndex = actualStartIndex + (recentData.length - 1 - index);

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
    if (currentData.length > itemsToShow) {
        const paginationDiv = document.createElement('div');
        paginationDiv.style.textAlign = 'center';
        paginationDiv.style.marginTop = '15px';
        paginationDiv.style.color = '#666';

        // 计算当前页码
        const totalPages = Math.ceil(currentData.length / itemsToShow);
        const currentPage = Math.floor(actualStartIndex / itemsToShow) + 1;

        // 生成分页控件 HTML
        let paginationHTML = `<div style="margin-bottom: 10px">显示 ${actualStartIndex + 1} - ${Math.min(actualStartIndex + itemsToShow, currentData.length)} 条，共 ${currentData.length} 条</div>`;

        paginationHTML += '<div style="display: flex; justify-content: center; gap: 5px;">';

        // 上一页按钮
        if (currentPage > 1) {
            paginationHTML += `<button id="prev-page" style="padding: 5px 10px; margin: 0 2px;">&lt; 上一页</button>`;
        }

        // 页码按钮
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="0" style="padding: 5px 10px; margin: 0 2px;">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span style="padding: 5px 10px; margin: 0 2px;">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === currentPage;
            const pageNum = i - 1; // 转换为0基索引
            paginationHTML += `<button class="${isActive ? 'current-page' : 'page-btn'}" data-page="${pageNum}" style="padding: 5px 10px; margin: 0 2px; ${isActive ? 'font-weight: bold; background-color: #007bff; color: white;' : ''}">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span style="padding: 5px 10px; margin: 0 2px;">...</span>`;
            }
            paginationHTML += `<button class="page-btn" data-page="${totalPages - 1}" style="padding: 5px 10px; margin: 0 2px;">${totalPages}</button>`;
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
                renderList(newStartIndex);
            });
        });

        document.querySelectorAll('#next-page').forEach(btn => {
            btn.addEventListener('click', () => {
                const newStartIndex = actualStartIndex + itemsToShow;
                if (newStartIndex < currentData.length) {
                    renderList(newStartIndex);
                }
            });
        });

        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pageNum = parseInt(e.target.getAttribute('data-page'));
                const newStartIndex = pageNum * itemsToShow;
                renderList(newStartIndex);
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