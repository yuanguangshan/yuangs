/*
* 自动化任务均在此撰写  
*/
import { generateAndPostCharts } from './chart_generator.js';

/**
 * 1. 定义 Cron 表达式常量
 *    与 wrangler.toml 中的 [triggers].crons 保持一致
 */
const CRON_TRIGGERS = {
    // 假设每天早上8点发送文本消息 (注意：这里的时间可以自定义)
    DAILY_TEXT_MESSAGE: "*/10 2-7 * * *",
    // 盘中和夜盘时段，每小时整点生成图表
    HOURLY_CHART_GENERATION:   "*/15 17-23,2-7 * * 1-5" // 周一到周五的指定小时
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
    const content = `[每日播报] 早上好！现在是北京时间 ${new Date(Date.now() + 8 * 3600 * 1000).toLocaleTimeString('zh-CN')}。`;
    
    console.log(`[Cron Task] Executing daily text task for room: ${roomName}`);
    try {
        if (!env.CHAT_ROOM_DO) throw new Error("Durable Object 'CHAT_ROOM_DO' is not bound.");
        
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
