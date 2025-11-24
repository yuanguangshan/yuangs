// main.js - 应用主入口
// 初始化应用并协调各模块

import { initUI } from './ui.js';

// 应用初始化
async function init() {
    console.log('诗词·雅苑 - 正在启动...');
    
    try {
        // 显示加载指示器
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'block';
        
        // 初始化UI
        await initUI();
        
        console.log('应用启动成功！');
    } catch (error) {
        console.error('应用启动失败:', error);
        alert('应用加载失败,请刷新页面重试');
    }
}

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
