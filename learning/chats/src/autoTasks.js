/*
* 自动化任务均在此撰写  
*/
import { generateAndPostCharts } from './chart_generator.js';
import { getDeepSeekExplanation } from './ai.js';

/**
 * 1. 定义 Cron 表达式常量
 *    与 wrangler.toml 中的 [triggers].crons 保持一致
 */
const CRON_TRIGGERS = {
    // 假设每天早上8点发送文本消息 (注意：这里的时间可以自定义)
    DAILY_TEXT_MESSAGE: "*/5 * * * *",  
    // 盘中和夜盘时段，每小时整点生成图表
    HOURLY_CHART_GENERATION:   "*/15 17-23,2-10 * * 1-5" // 周一到周五的指定小时
};

/**
 * 2. 定义独立的任务执行函数
 */

/**
 * 任务：发送每日文本消息
 * @param {object} env - 环境变量
 * @param {object} ctx - 执行上下文
 */
async function executeTextTask(env, ctx) {
    const roomName = 'test'; // 目标房间

    // 基础提示词 (核心内容保持不变)
    const basePrompt = '你是deepseek小助手，自动向用户问好，并且每次附上一句名人名言，及每日一句精典英文句子，并仔细分析名言和英文句子的意思及衍生意义，帮助用户提升自我，最后鼓励用户好好工作，好好学习，好好生活。';

    // 生成一个每次都不同的唯一标识符
    // crypto.randomUUID() 是生成标准 UUID 的推荐方式
    const uniqueId = crypto.randomUUID(); 
    
    // 或者，如果你只是需要一个递增的唯一标识符，也可以用时间戳，但UUID更独特：
    // const uniqueTimestamp = Date.now(); 

    // 在提示词中加入唯一标识符和明确的“不要重复”指令
    // 使用模板字符串 (backticks) 方便拼接
    const finalPrompt = `${basePrompt} 
    
请务必生成**全新的**、**未曾出现过**的内容。不要重复任何句子、名言或其解析。此次请求的唯一标识符是：${uniqueId}。`;

    console.log(`[Cron Task] Executing daily text task for room: ${roomName}`);
    try {
        if (!env.CHAT_ROOM_DO) throw new Error("Durable Object 'CHAT_ROOM_DO' is not bound.");
        
        // 调用 getDeepSeekExplanation，并传入修改后的独特提示词
        // 确保你的 getDeepSeekExplanation 内部也设置了合适的 temperature (例如 0.7-0.9)
        const content = await getDeepSeekExplanation(finalPrompt, env); 
        
        const doId = env.CHAT_ROOM_DO.idFromName(roomName);
        const stub = env.CHAT_ROOM_DO.get(doId);
        
        // 使用 RPC 调用 DO 的方法
        ctx.waitUntil(stub.cronPost(content, env.CRON_SECRET));
        
        console.log(`[Cron Task] Successfully dispatched text message to room: ${roomName}`);
    } catch (error) {
        console.error(`CRON ERROR (text task):`, error.stack || error);
    }
}
/**
 * 任务：生成并发布图表
 * @param {object} env - 环境变量
 * @param {object} ctx - 执行上下文
 */
async function executeChartTask(env, ctx) {
    const roomName = 'future'; // 目标房间
    
    console.log(`[Cron Task] Executing chart generation task for room: ${roomName}`);
    try {
        // generateAndPostCharts 是一个重量级操作，适合用 waitUntil 在后台执行
        ctx.waitUntil(generateAndPostCharts(env, roomName));
        
        console.log(`[Cron Task] Chart generation process dispatched for room: ${roomName}`);
    } catch (error) {
        console.error(`CRON ERROR (chart task):`, error.stack || error);
    }
}

/**
 * 3. 创建 Cron 表达式到任务函数的映射
 */
export const taskMap = new Map([
    [CRON_TRIGGERS.DAILY_TEXT_MESSAGE, executeTextTask],
    [CRON_TRIGGERS.HOURLY_CHART_GENERATION, executeChartTask]
]);
