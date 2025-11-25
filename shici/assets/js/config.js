// config.js - 应用配置和常量

export const CONFIG = {
    // 数据路径
    DATA_PATH: './assets/data/poetry_data.json',
    
    // IndexedDB配置
    DB_NAME: 'PoetryDB',
    DB_VERSION: 1,
    STORE_NAME: 'poems',
    
    // 缓存键名
    CACHE_KEY: 'poetry_cache_timestamp',
    CACHE_DURATION: 7 * 24 * 60 * 60 * 1000, // 7天
    
    // 文章判断阈值
    ARTICLE_LENGTH_THRESHOLD: 600,
    ARTICLE_TITLE_REGEX: /世家|列传|序|记|书|表|论|说|赋|解|文/,
    
    // 显示配置
    WATERFALL_COUNT: 12,
    
    // 主题列表
    THEMES: ['default', 'dark-mode', 'classic-paper-theme', 'modern-minimal-theme', 'nature-green-theme']
};

// 颜色调色板
export const COLOR_PALETTES = [
    // 现代清爽蓝青系
    ['#146C94', '#19A7CE', '#AFD3E2', '#0B4C66', '#083344', '#2EC4B6', '#1C5D99', '#4F46E5', '#22C55E', '#E11D48', '#F59E0B', '#0EA5E9', '#475569'],
    
    // 暖灰复古咖
    ['#6B4F3B', '#A0795E', '#D9C2B0', '#3E2E26', '#8F6D57', '#E6D8CC', '#9A8C7A', '#B86F52', '#7A3E2E', '#D97706', '#92400E', '#F2E8DF', '#4B5563'],
    
    // 霓虹赛博
    ['#00F5D4', '#00BBF9', '#FE53BB', '#FEE440', '#845EC2', '#0081CF', '#2EE59D', '#FF6F91', '#FFC75F', '#4D8076', '#1F2937', '#0F172A', '#94A3B8'],
    
    // 森系自然绿
    ['#0B6E4F', '#10A37F', '#37B24D', '#74C69D', '#B7E4C7', '#1B4332', '#2D6A4F', '#95D5B2', '#E9F5EC', '#FFD166', '#EF476F', '#26547C', '#606C38'],
    
    // 高级莫兰迪
    ['#8E9AAF', '#CBC0D3', '#EFD3D7', '#DEE2FF', '#B8CAD4', '#9CA3AF', '#7E8A97', '#A3A380', '#D6CE93', '#C4A381', '#A97155', '#6B7280', '#374151'],
    
    // 日落橙粉
    ['#FF6B6B', '#FFA38F', '#FFD166', '#FFE29A', '#FCA5A5', '#FB923C', '#F59E0B', '#F472B6', '#EC4899', '#E11D48', '#3730A3', '#0EA5E9', '#111827'],
    
    // 冰川蓝灰
    ['#0F4C81', '#2A6F97', '#468FAF', '#61A5C2', '#A9D6E5', '#1B263B', '#415A77', '#778DA9', '#E0E1DD', '#14B8A6', '#F59E0B', '#EF4444', '#64748B'],
    
    // 低对比豆沙粉绿
    ['#A26769', '#D5B9B2', '#BFB1C1', '#A0B2A6', '#CEDFD9', '#6E7573', '#8FA3A4', '#B7C4CF', '#EAEAEA', '#C6946A', '#7A6C5D', '#5B5B5B', '#2F2F2F'],
    
    // 明快校园配色
    ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#A78BFA', '#F43F5E', '#84CC16', '#14B8A6', '#0EA5E9', '#111827', '#334155', '#E5E7EB'],
    
    // 墨青+洋红撞色
    ['#003049', '#0A9396', '#94D2BD', '#E9D8A6', '#EE9B00', '#CA6702', '#BB3E03', '#9B2226', '#C9184A', '#FF4D6D', '#A2D2FF', '#2B2D42', '#8D99AE'],
    
    // 石墨中性灰阶
    ['#111827', '#1F2937', '#374151', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6', '#FFFFFF', '#EF4444', '#22C55E', '#3B82F6'],
    
    // 清透薄荷蓝
    ['#1AA7EC', '#39C3F2', '#74D7F2', '#A8E6CF', '#56C596', '#2EC4B6', '#0E7490', '#155E75', '#083344', '#FFB703', '#FB8500', '#E63946', '#457B9D']
];

// 获取随机颜色
export function getRandomColor() {
    const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
    return palette[Math.floor(Math.random() * palette.length)];
}

// 图片缓存，存储最近20张图片
let imageCache = [];
const MAX_CACHE_SIZE = 20;

// 获取随机图片URL的函数
export function getRandomImageUrl(fallbackNum = 1) {
    const timestamp = Date.now();
    switch (fallbackNum) {
        case 1:
            // 主要来源：picsum带随机种子
            return `https://picsum.photos/seed/${timestamp}/400/300`;
        case 2:
            // 备选1：picsum无种子（随机图片）
            return `https://picsum.photos/400/300?random=${timestamp}`;
        case 3:
            // 备选2：Unsplash来源带随机种子
            return `https://source.unsplash.com/400x300/?nature,random&ts=${timestamp}`;
        case 4:
            // 备选3：Pexel来源带随机种子
            return `https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=400&h=300&ts=${timestamp}`;
        case 5:
            // 本地备选：base64编码的占位图片
            return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkPDpXNpIFBvaWN0cnkgUGxhY2Vob2xkZXI8L3RleHQ+PC9zdmc+`;
        default:
            // 最后备选：简单占位符
            return `https://placehold.co/400x300/cccccc/666666?text=诗词配图`;
    }
}

// 将图片添加到缓存
export function addToImageCache(imgUrl) {
    // 检查图片是否已在缓存中
    const existingIndex = imageCache.indexOf(imgUrl);
    if (existingIndex !== -1) {
        // 如果已存在，移至最前面
        imageCache.splice(existingIndex, 1);
    } else if (imageCache.length >= MAX_CACHE_SIZE) {
        // 如果缓存已满，移除最旧的项
        imageCache.pop();
    }
    // 添加到缓存开头
    imageCache.unshift(imgUrl);
}

// 获取随机缓存图片
export function getRandomCachedImage() {
    if (imageCache.length === 0) {
        return null;
    }
    // 从缓存中返回随机图片
    return imageCache[Math.floor(Math.random() * imageCache.length)];
}
