// poem-display.js - 诗词显示逻辑模块
// 处理诗词的格式化和渲染

import { CONFIG } from './config.js';

// 插入标点符号后的换行
export function insertLineBreaksAtPunctuation(content) {
    // 检查内容长度，判断是否为文章
    if (content.length > CONFIG.ARTICLE_LENGTH_THRESHOLD) {
        // 文章模式：只在句末断句
        const lines = content.split('\\n')
            .map(line => line.trim())
            .filter(line => line !== '');
        
        let processed = lines.join('\\n');
        
        // Step 1: 在句末标点+引号后换行
        processed = processed
            .replace(/([。！？!?]["']+)(?!\\n)/g, '$1\\n');
        
        // Step 2: 修复孤立的左引号
        processed = processed.replace(/\\n+([""])/g, '\\n$1');
        
        // Step 3: 修复孤立的右引号
        processed = processed.replace(/\\n+(["'])/g, '$1\\n');
            
        // 转换为<br>
        processed = processed.replace(/\\n/g, '<br>');
        
        // 处理段落分隔
        processed = processed
            .replace(/(<br>\\s*){3,}/g, '<br><div class="poem-paragraph-break"></div><br>')
            .replace(/(<br>\\s*){2}/g, '<br><br>');
            
        return processed;
    }

    // 短诗模式：正常处理
    const lines = content.split('\\n')
        .map(line => line.trim())
        .filter(line => line !== '');

    let processed = lines.join('\\n');

    // 在逗号和问号后添加换行
    processed = processed
        .replace(/([，,])(?!\\n)/g, '$1\\n')
        .replace(/([？?])(?!\\n)/g, '$1\\n');

    // 转换为<br>
    processed = processed.replace(/\\n/g, '<br>');

    // 处理多个连续<br>
    processed = processed
        .replace(/(<br>\\s*){3,}/g, '<br><div class="poem-paragraph-break"></div><br>')
        .replace(/(<br>\\s*){2}/g, '<br>');

    return processed;
}

// 判断是否为格律诗（五言或七言）
export function isRegularPoem(poem) {
    if (!poem || !poem.content) return false;
    const lines = poem.content.split('\\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return false;
    
    // 检查是否所有行都是5字或7字
    const is5Char = lines.every(line => line.replace(/[，。！？,.!?]/g, '').length === 5);
    const is7Char = lines.every(line => line.replace(/[，。！？,.!?]/g, '').length === 7);
    
    return is5Char || is7Char;
}

// 格式化联句诗（对联布局）
export function formatCoupletPoem(poem) {
    const lines = poem.content.split('\\n').filter(line => line.trim() !== '');
    let html = '';
    
    for (let i = 0; i < lines.length; i += 2) {
        html += '<div class="couplet-row">';
        html += `<div class="couplet-line">${lines[i]}</div>`;
        if (i + 1 < lines.length) {
            html += `<div class="couplet-line">${lines[i + 1]}</div>`;
        }
        html += '</div>';
    }
    
    return html;
}

// 判断是否为文章
export function isArticle(poem) {
    if (!poem) return false;
    
    // 条件1：内容长度超过阈值
    if (poem.content && poem.content.length > CONFIG.ARTICLE_LENGTH_THRESHOLD) {
        return true;
    }
    
    // 条件2：标题包含文章关键词
    if (poem.title && CONFIG.ARTICLE_TITLE_REGEX.test(poem.title)) {
        return true;
    }
    
    return false;
}

// 处理标签（支持多种格式）
export function parseTags(tagField) {
    let allTags = [];
    
    if (!tagField) return allTags;
    
    if (Array.isArray(tagField)) {
        tagField.forEach(tagItem => {
            if (typeof tagItem === 'string') {
                if (tagItem.includes(',')) {
                    allTags = allTags.concat(tagItem.split(',').map(t => t.trim()).filter(t => t !== ''));
                } else if (tagItem.includes('/')) {
                    allTags = allTags.concat(tagItem.split('/').map(t => t.trim()).filter(t => t !== ''));
                } else {
                    allTags.push(tagItem.trim());
                }
            }
        });
    } else if (typeof tagField === 'string') {
        if (tagField.includes('/')) {
            allTags = tagField.split('/').map(t => t.trim()).filter(t => t !== '');
        } else if (tagField.includes(',')) {
            allTags = tagField.split(',').map(t => t.trim()).filter(t => t !== '');
        } else {
            allTags = tagField.split(' ').filter(t => t.trim() !== '');
        }
    }
    
    return allTags;
}

// 生成标签HTML
export function generateTagsHTML(poem) {
    let allTags = [];
    
    // 处理type字段
    if (poem.type) {
        allTags = allTags.concat(parseTags(poem.type));
    }
    
    // 处理tags字段
    if (poem.tags) {
        allTags = allTags.concat(parseTags(poem.tags));
    }
    
    if (allTags.length === 0) return '';
    
    const dynastyTags = ['先秦', '汉', '魏晋', '南北朝', '隋', '唐', '五代', '南唐', '宋', '元', '明', '清', '现代', '近现代'];
    const typeTags = ['诗经', '楚辞', '乐府', '唐诗', '宋词', '清词', '词', '蒙学'];
    
    return allTags.map(tag => {
        let tagClass = 'poem-tag';
        if (dynastyTags.includes(tag)) {
            tagClass += ' dynasty';
        } else if (typeTags.includes(tag)) {
            tagClass += ' type';
        }
        return `<span class="${tagClass}">${tag}</span>`;
    }).join('');
}
