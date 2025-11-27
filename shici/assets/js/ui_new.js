// 辅助函数：按标点符号分割内容，并将每段内的标点符号放在前面
function splitContentWithPunctuationFirst(content) {
    // 先按标点符号分割，保留标点符号在每段的后面
    // 包含常见中文标点：。！？;；:：,，、《》〈〉「」『』""''（）
    const segments = content.match(/[^。！？;；:：,，、《》〈〉「」『』""''（）]+[。！？;；:：,，、《》〈〉「」『』""''（）]?/g) || [content];
    
    // 对每一段，将标点符号移到前面
    const result = segments.map(segment => {
        const trimmed = segment.trim();
        if (!trimmed) return '';
        
        // 检查是否以标点符号结尾（包含所有常见中文标点）
        const punctuationMatch = trimmed.match(/([。！？;；:：,，、《》〈〉「」『』""''（）]+)$/);
        
        if (punctuationMatch) {
            // 有标点符号，将其移到前面
            const punctuation = punctuationMatch[1];
            const textWithoutPunctuation = trimmed.slice(0, -punctuation.length);
            return punctuation + textWithoutPunctuation;
        } else {
            // 没有标点符号，保持原样
            return trimmed;
        }
    });
    
    return result.filter(line => line.trim() !== '');
}
