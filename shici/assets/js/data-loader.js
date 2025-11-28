// data-loader.js - 数据加载模块
// 处理诗词数据的获取、缓存和管理

import { CONFIG } from './config.js';

// 内存缓存
let allPoems = null;

// SimpleDB - IndexedDB封装
const SimpleDB = {
    dbName: CONFIG.DB_NAME,
    storeName: CONFIG.STORE_NAME,
    version: CONFIG.DB_VERSION,
    db: null,

    async open() {
        if (this.db) return this.db;
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };
            request.onerror = (event) => reject(event.target.error);
        });
    },

    async get(key) {
        try {
            await this.open();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.get(key);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (e) {
            console.warn("IndexedDB get failed:", e);
            return null;
        }
    },

    async set(key, value) {
        try {
            await this.open();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.put(value, key);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (e) {
            console.warn("IndexedDB set failed:", e);
        }
    }
};

// 获取并缓存诗词数据
export async function fetchAndCachePoems() {
    if (allPoems !== null) {
        return allPoems;
    }

    // 检查缓存
    try {
        const cachedData = await SimpleDB.get(CONFIG.CACHE_KEY);
        if (cachedData) {
            const { data, timestamp } = cachedData;
            const now = Date.now();

            if (now - timestamp < CONFIG.CACHE_DURATION) {
                allPoems = data;
                console.log("Using cached poetry data from IndexedDB");
                return allPoems;
            }
        }
    } catch (e) {
        console.warn("Error reading from IndexedDB:", e);
    }

    // 获取新数据
    try {
        console.log("Fetching fresh poetry data...");
        let response;
        let jsonData;

        try {
            // 1. 尝试从远程获取
            // 显式指定 cors 模式和忽略凭证（不带 Cookie），这是请求公开资源的最佳实践
            response = await fetch(CONFIG.DATA_PATH, {
                mode: 'cors',
                credentials: 'omit'
            });
            if (!response.ok) throw new Error(`Remote HTTP error! Status: ${response.status}`);
            jsonData = await response.json();
            console.log("Successfully fetched data from remote source");
        } catch (remoteError) {
            console.warn("Failed to fetch from remote, falling back to local data:", remoteError);
            // 2. 远程失败，尝试本地回退
            if (CONFIG.LOCAL_DATA_PATH) {
                response = await fetch(CONFIG.LOCAL_DATA_PATH);
                if (!response.ok) throw new Error(`Local HTTP error! Status: ${response.status}`);
                jsonData = await response.json();
                console.log("Successfully fetched data from local fallback");
            } else {
                throw remoteError;
            }
        }
        const poems = [];

        jsonData.forEach(item => {
            const title = item.rhythmic || '';
            const auth = item.author || '';
            const content = Array.isArray(item.paragraphs) ? item.paragraphs.join('\\n') : (item.paragraphs || '');
            // Avoid creating a type string that is just a concatenation of tags, 
            // as this causes duplicate tags in display (one combined, multiple individual)
            const type = Array.isArray(item.tags) ? '' : (item.tags || '');
            const tags = item.tags || [];
            const desc = item.desc || '';

            // 创建搜索链接
            const searchQuery = encodeURIComponent(`${auth || ''} ${title || ''}`);
            const searchLink = `https://chat.baidu.com/search?word=${searchQuery}&setype=csaitab`;

            let finalDesc = desc;
            if (!desc || desc.trim() === '') {
                finalDesc = `<div style="margin-top: 10px; padding: 10px; background-color: #e9ecef; border-radius: 5px; text-align: center;"><a href="${searchLink}" target="_blank" style="color: #007bff; text-decoration: none; font-weight: bold;">🔍 点击搜索诗词赏析</a></div>`;
            } else {
                finalDesc = `<div style="margin-top: 10px; padding: 10px; background-color: #e9ecef; border-radius: 5px; text-align: center;"><a href="${searchLink}" target="_blank" style="color: #007bff; text-decoration: none; font-weight: bold;">🔍 点击搜索诗词赏析</a></div><br><br>${desc}`;
            }

            // 判断是诗还是词
            let source = 'poem';
            const tagsArray = Array.isArray(tags) ? tags : [];
            if (tagsArray.some(tag => tag.includes('词') || tag === '宋词' || tag === '清词' || tag === '南唐')) {
                source = 'ci';
            }

            poems.push({
                title: title,
                auth: auth,
                type: type,
                tags: tags,
                content: content,
                desc: finalDesc,
                source: source
            });
        });

        // 存储到内存
        allPoems = poems;

        // 缓存到IndexedDB
        try {
            await SimpleDB.set(CONFIG.CACHE_KEY, {
                data: poems,
                timestamp: Date.now()
            });
            console.log("Poetry data cached to IndexedDB");
        } catch (e) {
            console.warn("Error caching to IndexedDB:", e);
        }

        return allPoems;

    } catch (error) {
        console.error("Error fetching poetry data:", error);
        return [];
    }
}

// 获取随机诗词
export function getRandomPoem(poems) {
    if (!poems || poems.length === 0) return null;
    return poems[Math.floor(Math.random() * poems.length)];
}

// 获取多个随机诗词
export function getRandomPoems(poems, count) {
    if (!poems || poems.length === 0) return [];
    const shuffled = [...poems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, poems.length));
}

// 清除缓存
export async function clearCache() {
    try {
        await SimpleDB.set(CONFIG.CACHE_KEY, null);
        allPoems = null;
        console.log("Cache cleared");
        return true;
    } catch (e) {
        console.error("Failed to clear cache:", e);
        return false;
    }
}
