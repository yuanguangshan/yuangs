/**
 * assets/js/admin.js
 * 对应你最新的 JSON 结构: { rhythmic, author, paragraphs, tags }
 */

// ✅ 1. 配置地址
// 读取地址：直接从 R2 的公开链接读取，确保读到的是真实数据
const READ_URL = 'https://pic.want.biz/poetry_data.json';
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
    
    // 尝试获取数据来验证 Token 是否有效
    try {
        await loadData();
        // 如果成功加载，切换到管理界面
        loginSection.classList.add('hidden');
        managerSection.classList.remove('hidden');
        loginMsg.textContent = '';
    } catch (err) {
        console.error(err);
        loginMsg.textContent = '加载失败，请检查网络或稍后再试';
        loginBtn.textContent = '进入管理';
        loginBtn.disabled = false;
    }
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
function renderList() {
    const listEl = document.getElementById('poem-list');
    document.getElementById('count').textContent = currentData.length;
    listEl.innerHTML = '';

    // 倒序排列，让新添加的显示在最上面
    currentData.slice().reverse().forEach((poem, index) => {
        // 计算原始索引 (因为反转了，删除时需要原始索引)
        const originalIndex = currentData.length - 1 - index;
        
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
        
        // 3. 将“朝代”输入框的内容，按逗号分割成 tags 数组
        // 输入示例："道德经, 先秦" -> ["道德经", "先秦"]
        tags: tagsVal ? tagsVal.split(/[,，]/).map(t => t.trim()) : []
    };

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
            method: 'POST',
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
            renderList(); // 重新渲染列表
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