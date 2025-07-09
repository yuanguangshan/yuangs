// src/ai.js

/**
 * 调用 DeepSeek API 获取文本解释。
 */
export async function getDeepSeekExplanation(text, env) {
    const apiKey = env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error('Server config error: DEEPSEEK_API_KEY is not set.');

    // 1. 获取当前的北京时间 (小时和分钟)
    const now = new Date();
    const beijingTimeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',    // 小时 (不带前导零，如 "0", "1"...)
        minute: 'numeric',  // 分钟 (不带前导零，如 "0", "5"...)
        hour12: false,      // 使用24小时制
        timeZone: 'Asia/Shanghai' // 指定北京时区
    });

    const formattedBeijingTime = beijingTimeFormatter.format(now); // 格式如 "0:35", "8:20"
    const [beijingHourStr, beijingMinuteStr] = formattedBeijingTime.split(':');
    const beijingHour = parseInt(beijingHourStr, 10);
    const beijingMinute = parseInt(beijingMinuteStr, 10);

    // 2. 根据北京时间判断使用哪个模型
    let modelToUse = "deepseek-chat"; // 默认模型

    // 北京时间 00:31-08:29 调用 deepseek-reasoner
    // 逻辑：
    // a. 小时是0，且分钟 >= 31 (即 00:31, 00:32 ... 00:59)
    // b. 小时在 1 到 7 之间 (即 01:xx, 02:xx ... 07:xx)
    // c. 小时是8，且分钟 <= 29 (即 08:00, 08:01 ... 08:29)
    if (
        (beijingHour === 0 && beijingMinute >= 31) ||
        (beijingHour > 0 && beijingHour < 8) ||
        (beijingHour === 8 && beijingMinute <= 29)
    ) {
        modelToUse = "deepseek-reasoner";
    }

    // 3. 调用 DeepSeek API
    const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: modelToUse, // 使用动态选择的模型
            messages: [{
                role: "system",
                content: "你是一个有用的，善于用简洁的markdown语言来解释下面的文本."
            }, {
                role: "user",
                content: text
            }]
        })
    });

    // 4. 处理 API 响应
    if (!response.ok) {
        throw new Error(`DeepSeek API error: ${await response.text()}`);
    }
    const data = await response.json();
    const explanation = data?.choices?.[0]?.message?.content;

    if (!explanation) {
        throw new Error('Unexpected AI response format from DeepSeek.');
    }
    return explanation;
}

/**
 * 调用 Google Gemini API 获取文本解释。
 */
export async function getGeminiExplanation(text, env) {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Server config error: GEMINI_API_KEY is not set.');
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: text }] }]
        })
    });
    if (!response.ok) throw new Error(`Gemini API error: ${await response.text()}`);
    const data = await response.json();
    const explanation = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!explanation) throw new Error('Unexpected AI response format from Gemini.');
    return explanation;
}

/**
 * 【修正版】从URL获取图片并高效地转换为Base64编码。
 */
async function fetchImageAsBase64(imageUrl) {
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    // --- 核心修正：使用更健壮和高效的编码方法 ---
    const hex = [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    let binary = '';
    for (let i = 0; i < hex.length; i += 2) {
        binary += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    const base64 = btoa(binary);
    
    return { base64, contentType };
}

/**
 * 调用 Google Gemini API 获取图片描述。
 */
export async function getGeminiImageDescription(imageUrl, env) {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Server config error: GEMINI_API_KEY is not set.');

    const { base64, contentType } = await fetchImageAsBase64(imageUrl);
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
    const prompt = "请仔细描述图片的内容，如果图片中识别出有文字，则在回复的内容中返回这些文字，并且这些文字支持复制，之后是对文字的仔细描述，格式为：图片中包含文字：{文字内容}；图片的描述：{图片描述}";

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: contentType, data: base64 } }] }]
        })
    });
    if (!response.ok) throw new Error(`Gemini Vision API error: ${await response.text()}`);
    const data = await response.json();
    const description = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!description) throw new Error('Unexpected AI response format from Gemini Vision.');
    return description;
}
