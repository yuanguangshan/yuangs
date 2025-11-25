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
        // .replace(/([，,])(?!\\n)/g, '$1\\n')
        .replace(/([.。])(?!\\n)/g, '$1\\n')
        .replace(/([？?])(?!\\n)/g, '$1\\n');

    // 转换为<br>
    processed = processed.replace(/\\n/g, '<br>');

    // 处理多个连续<br>
    processed = processed
        .replace(/(<br>\\s*){3,}/g, '<br><div class="poem-paragraph-break"></div><br>')
        .replace(/(<br>\\s*){2}/g, '<br>');

    return processed;
}

// 根据规则断句诗歌，优先断为4句
export function formatPoemWithLineBreaks(content, poem) {
    // 如果是格律诗（五言或七言），按新规则处理
    if (isRegularPoemWithPunctuation(content)) {
        // 先按换行分割（因为有的诗是多行的）
        const lines = content.split('\n').filter(line => line.trim() !== '');

        // 如果已经是按行分割的，则直接计算行数
        if (lines.length === 4) {
            return lines.join('<br>');
        } else if (lines.length === 8) {
            // 如果是8行，每2行合成1行显示（变成4行）
            let result = [];
            for (let i = 0; i < lines.length; i += 2) {
                result.push(lines[i] + (lines[i + 1] || ''));
            }
            return result.join('<br>');
        } else if (lines.length > 8) {
            // 如果多于8行，按原样显示
            return lines.join('<br>');
        } else {
            // 对于古典格律诗，处理特殊的古典诗词结构
            // 专门处理像 "君自故乡来，应知故乡事。来日绮窗前，寒梅著花未？" 这样的结构

            // 按照逗号和句末标点来识别古典诗歌的节奏单元
            // 有时需要更智能地识别节奏模式
            let parts = [];
            let currentIndex = 0;

            while (currentIndex < content.length) {
                let part = '';
                let charCount = 0;

                // 从当前位置开始构建一个节奏单元
                while (currentIndex < content.length) {
                    const char = content[currentIndex];
                    part += char;
                    currentIndex++;

                    // 如果是标点符号，不计入字符计数
                    if (!/[，。！？,.!?]/.test(char)) {
                        charCount++;
                    }

                    // 当达到5或7个字符且遇到逗号或句末标点时，可能是一个节奏单元
                    if ((charCount === 5 || charCount === 7) && /[，,]/.test(char)) {
                        // 如果是逗号，这可能是半个句子，继续寻找句末标点
                        continue;
                    } else if (/[。！？!?]/.test(char)) {
                        // 遇到句末标点，一个完整的节奏单元结束
                        parts.push(part.trim());
                        break;
                    }
                }
            }

            // 检查按古典节奏分割后的部分数量
            if (parts.length === 4) {
                return parts.join('<br>');
            } else if (parts.length === 8) {
                // 如果是8句，每2句合成1句显示（变成4句）
                let result = [];
                for (let i = 0; i < parts.length; i += 2) {
                    result.push(parts[i] + (parts[i + 1] || ''));
                }
                return result.join('<br>');
            } else if (parts.length > 8) {
                // 如果多于8句，按古典节奏分割显示
                return parts.join('<br>');
            } else {
                // 如果古典节奏分割未能得到理想结果，尝试按句末标点分割
                const sentenceParts = [];
                let currentSentence = '';

                for (let i = 0; i < content.length; i++) {
                    const char = content[i];
                    currentSentence += char;

                    if (/[。！？!?]/.test(char)) {
                        sentenceParts.push(currentSentence.trim());
                        currentSentence = '';
                    }
                }

                if (currentSentence.trim()) {
                    sentenceParts.push(currentSentence.trim());
                }

                // 再次检查按句末标点分割的结果
                if (sentenceParts.length === 4) {
                    return sentenceParts.join('<br>');
                } else if (sentenceParts.length === 8) {
                    let result = [];
                    for (let i = 0; i < sentenceParts.length; i += 2) {
                        result.push(sentenceParts[i] + (sentenceParts[i + 1] || ''));
                    }
                    return result.join('<br>');
                } else {
                    // 最后尝试使用一种更精确的古典诗歌解析方法
                    // 处理五言（5字+逗号）和七言（7字+逗号）的节奏模式
                    const refinedParts = [];
                    let tempPart = '';
                    let charCountSinceLastPunct = 0;

                    for (let i = 0; i < content.length; i++) {
                        const char = content[i];

                        if (/[，。！？,.!?]/.test(char)) {
                            // 遇到标点，添加到当前部分
                            tempPart += char;

                            if (/[。！？!?]/.test(char)) {
                                // 句末標點，結束一個單元
                                refinedParts.push(tempPart.trim());
                                tempPart = '';
                                charCountSinceLastPunct = 0;
                            } else if (/[，,]/.test(char) && (charCountSinceLastPunct === 5 || charCountSinceLastPunct === 7)) {
                                // 逗號且前面正好5个字或7个字，作为一个单元
                                // 这适用于五言诗（5字+逗号）和七言诗（7字+逗号）
                                refinedParts.push(tempPart.trim());
                                tempPart = '';
                                charCountSinceLastPunct = 0;
                            }
                        } else {
                            // 非標點字符，添加到当前部分并计数
                            tempPart += char;
                            charCountSinceLastPunct++;
                        }
                    }

                    // 添加最後剩餘部分
                    if (tempPart.trim()) {
                        refinedParts.push(tempPart.trim());
                    }

                    if (refinedParts.length === 4) {
                        return refinedParts.join('<br>');
                    } else {
                        // 其他情况继续使用原有逻辑
                        return insertLineBreaksAtPunctuation(content);
                    }
                }
            }
        }
    }

    // 非格律诗继续使用原有逻辑
    return insertLineBreaksAtPunctuation(content);
}

// 判断是否为带标点的格律诗
export function isRegularPoemWithPunctuation(content) {
    if (!content) return false;

    // 按换行符分割内容
    const lines = content.split('\\n').filter(line => line.trim() !== '');

    if (lines.length < 2) {
        // 如果没有换行符，尝试按标点符号分割来检测是否为规则诗
        // 将内容按句号、感叹号、问号分割
        const sentenceParts = content.split(/[。！？!?]/g).filter(part => part.trim() !== '');

        // 过滤掉空部分
        const nonEmptyParts = sentenceParts.filter(part => part.trim() !== '');

        if (nonEmptyParts.length === 0) return false;

        // 检查每个部分（去除逗号等标点后）是否都符合5字或7字
        for (const part of nonEmptyParts) {
            // 如果每个部分还包含逗号，再按逗号分割
            const subParts = part.split(/[，,]/g).filter(sub => sub.trim() !== '');

            for (const subPart of subParts) {
                const cleanPart = subPart.replace(/[，。！？,.!?]/g, '').trim();
                if (cleanPart.length !== 0 && cleanPart.length !== 5 && cleanPart.length !== 7) {
                    return false;
                }
            }
        }

        return true;
    }

    // 检查每行（去除标点后）是否都是5字或7字
    for (const line of lines) {
        const cleanLine = line.replace(/[，。！？,.!?]/g, '').trim();
        if (cleanLine.length !== 5 && cleanLine.length !== 7) {
            return false;
        }
    }

    return true;
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

    // 4. 全局判断条件：文章按逗号，句号，问号，叹号等分割后统计每句的字数
    if (poem.content) {
        // Split by punctuation
        const sentences = poem.content.split(/[，。！？,.!?、；：]/).filter(s => s.trim() !== '');
        
        // Calculate length of each segment
        const lengths = sentences.map(s => s.trim().length);
        
        // Count unique sentence lengths
        const uniqueLengths = new Set(lengths);
        
        // 如果数组的不同的值的数据量大于6，判断为文章
        if (uniqueLengths.size > 6) {
            return true;
        }
        
        // 小于3判断为非文章
        if (uniqueLengths.size < 3) {
            return false;
        }
    }

    // 5. 如果文章字数大于600字，判断为文章
    if (poem.content && poem.content.length > CONFIG.ARTICLE_LENGTH_THRESHOLD) {
        return true;
    }

    // 6. 小于80字，判断为非文章
    if (poem.content && poem.content.length < 80) {
        return false;
    }

    // 7. 其他情况，优先判断为非文章
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
