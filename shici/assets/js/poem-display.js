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

    // 获取所有标签
    const allTags = parseTagsForPoem(poem);
    const tagString = allTags.join(' ');

    // 1. 如果tag 有 古文观止判断为文章
    if (tagString.includes('古文观止')) {
        return true;
    }

    // 2. 如果有唐诗或宋词标签，则为非文章
    if (tagString.includes('唐诗') || tagString.includes('宋词')) {
        return false;
    }

    // 3. 如果标签是诗经，为非文章
    if (tagString.includes('诗经')) {
        return false;
    }

    // 4. 如果文章字数大于600字，判断为文章
    if (poem.content && poem.content.length > CONFIG.ARTICLE_LENGTH_THRESHOLD) {
        return true;
    }

    // 5. 小于80字，判断为非文章
    if (poem.content && poem.content.length < 80) {
        return false;
    }

    // 6. 其他情况，优先判断为非文章
    return false;
}

// 判断是否为长诗（超过10行）
export function isLongPoem(poem) {
    if (!poem || !poem.content) return false;

    // 分割内容为行，计算行数
    const lines = poem.content.split('\\n').filter(line => line.trim() !== '');
    return lines.length > 10;
}

// 判断是否需要滚动的长诗（不仅根据行数，还要考虑是否会在垂直模式下显示不下）
export function needsScrollableVerticalMode(poem) {
    if (!poem || !poem.content) return false;

    // 分割内容为行，计算行数
    const lines = poem.content.split('\\n').filter(line => line.trim() !== '');

    // For poems with 7-10 lines, it might be too long for regular vertical display
    if (lines.length >= 7 && lines.length <= 10) return true;

    // Poems with more than 10 lines are handled differently (horizontal mode)
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

// 为诗词解析所有标签
export function parseTagsForPoem(poem) {
    let allTags = [];

    // 处理type字段
    if (poem.type) {
        const typeTags = parseTags(poem.type);
        allTags = allTags.concat(typeTags);
    }

    // 处理tags字段
    if (poem.tags) {
        const tagTags = parseTags(poem.tags);
        allTags = allTags.concat(tagTags);
    }

    // 去重
    const uniqueTags = [...new Set(allTags)];

    // Debug logging
    // console.log(`Parsed tags for "${poem.title || poem.rhythmic || 'Unknown'}":`, uniqueTags);

    return uniqueTags;
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

    // 去重
    const uniqueTags = [...new Set(allTags)];

    const dynastyTags = ['先秦', '汉', '魏晋', '南北朝', '隋', '唐', '五代', '南唐', '宋', '元', '明', '清', '现代', '近现代'];
    const typeTags = ['诗经', '楚辞', '乐府', '唐诗', '宋词', '清词', '词', '蒙学'];

    // 限制显示前5个标签
    return uniqueTags.slice(0, 5).map(tag => {
        let tagClass = 'poem-tag';
        // 在瀑布流中可能需要不同的类名，但这里保持通用，CSS可以适配
        // 注意：原版瀑布流使用的是 waterfall-tag 类，这里为了兼容性，我们可能需要调整
        // 或者在CSS中确保 poem-tag 在瀑布流中也有正确的样式

        if (dynastyTags.includes(tag)) {
            tagClass += ' dynasty';
        } else if (typeTags.includes(tag)) {
            tagClass += ' type';
        }
        return `<span class="${tagClass}" onclick="window.handleTagClick && window.handleTagClick('${tag}')">${tag}</span>`;
    }).join('');
}
