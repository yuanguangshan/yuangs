// src/chart_generator.js (Complete ECharts Renderer for 8 Charts)

import * as echarts from 'echarts';

// ==============================================
//  ECharts 服务端渲染兼容性设置
// ==============================================
// 确保 ECharts 在无头环境中可以运行
// 这通常已由 `globalThis.global = globalThis;` 解决
// 且 `compatibility_flags = ["nodejs_compat"]` 配合 npm install 已经到位

// ==============================================
//  数据字段映射表
//  与前端 index.html 保持一致
// ==============================================
const fieldMapping = {
    // 基础价格数据
    qrspj: '昨收盘价',    zjsj: '昨结算价',    o: '开盘价',       h: '最高价',
    l: '最低价',         p: '最新价',        j: '均价',         mrj: '买入价',
    mcj: '卖出价',       zt: '涨停',         dt: '跌停',        
    
    // 涨跌幅相关
    zdf: '涨跌幅',       zde: '涨跌额',       zdf3: '3日涨幅',    zdf5: '5日涨幅',
    zdf6: '6日涨幅',     zdf20: '20日涨幅',   zdf250: '250日涨幅', zdfly: '今年涨幅',
    zdf0: '近一年涨幅',   zdflm: '本月涨幅',   
    
    // 交易数据  
    vol: '成交量',       cje: '成交额',       ccl: '持仓量',      zccl: '昨持仓量',
    rz: '日增仓',        np: '内盘',         wp: '外盘',        cjbs: '成交笔数',
    
    // 技术指标
    tjd: '投机度',       zf: '振幅',         lb: '量比',        cdzj: '沉淀资金',
    
    // 其他字段 (可能在数据中但未用于图表)
    dm: '代码',          name: '合约名称',    ly: '计算来源',     sc: '市场代码',
    jyzt: '交易状态',    xs: '现手',         xsfx: '现手方向',   
    utime: '更新时间',   kpsj: '开盘时间',    spsj: '收盘时间',   jysj: '交易时间'
};

// ==============================================
//  通用图表样式配置 (与前端 index.html 保持一致)
// ==============================================
const commonAxisOptions = {
    axisLabel: { fontSize: 11, color: '#444', interval: 0, rotate: 45 },
    axisLine: { lineStyle: { color: '#ccc' } },
    splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } }
};

// ==============================================
//  工具函数区 (与前端 index.html 保持一致)
// ==============================================
function getSimplifiedName(fullName) {
    const match = fullName.match(/^([^\d]+)/);
    return match && match[1] ? match[1] : fullName;
}
function formatCjeToBillion(value) {
    if (value === null || value === undefined) return '-';
    return (value / 1e8).toFixed(2) + '亿';
}
function formatVolumeOrCCL(value) {
    if (value === null || value === undefined) return '-';
    if (value >= 100000000) return (value / 100000000).toFixed(2) + '亿手';
    if (value >= 10000) return (value / 10000).toFixed(2) + '万手';
    return value.toLocaleString() + '手';
}
function getZdfTreemapColor(zdf) {
    const abs = Math.abs(zdf);
    if (zdf <= 0) {
        if (abs >= 5) return '#006400';
        if (abs >= 2) return '#22c55e';
        if (abs >= 1) return '#66bb6a';
        return '#86efac';
    } else {
        if (abs >= 5) return '#8b0000';
        if (abs >= 2) return '#ef4444';
        if (abs >= 1) return '#ff8888';
        return '#fca5a5';
    }
}
function getOpenInterestChangeColor(rz) {
    if (rz > 0) return '#ef4444';
    if (rz < 0) return '#22c55e';
    return '#9ca3af';
}

// ==============================================
//  ECharts Option 生成函数 (全部从前端 renderChartX 适配而来)
// ==============================================

function getChart1Option(dataList) {
    const processedData = dataList.map(item => {
        const openChange = parseFloat(((item.o - item.zjsj) / item.zjsj * 100).toFixed(2));
        const closeChange = parseFloat(((item.p - item.zjsj) / item.zjsj * 100).toFixed(2));
        const lowChange = parseFloat(((item.l - item.zjsj) / item.zjsj * 100).toFixed(2));
        const highChange = parseFloat(((item.h - item.zjsj) / item.zjsj * 100).toFixed(2));
        return {
            name: getSimplifiedName(item.name), fullName: item.name, dm: item.dm,
            value: [openChange, closeChange, lowChange, highChange], // K线数据
            closeChange, openChange, highChange, lowChange,
            rawValues: { // 保存原始数据用于tooltip显示
                open: item.o, high: item.h, low: item.l, close: item.p, prevClose: item.zjsj
            }
        };
    });
    const sortedData = processedData.sort((a, b) => b.closeChange - a.closeChange);
    const categories = sortedData.map(item => item.name);
    const markPointData = [];
    if (sortedData.length > 0 && sortedData[0].closeChange > 0) {
        markPointData.push({ name: '涨幅最高', value: sortedData[0].closeChange, coord: [0, sortedData[0].value[1]], itemStyle: { color: '#ef4444' } });
    }
    if (sortedData.length > 1 && sortedData[sortedData.length - 1].closeChange < 0) {
        markPointData.push({ name: '跌幅最大', value: sortedData[sortedData.length - 1].closeChange, coord: [sortedData.length - 1, sortedData[sortedData.length - 1].value[1]], itemStyle: { color: '#22c553' } });
    }
    return {
        title: { text: '期货品种走势对比', left: 'center' },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', formatter: (params) => { /* ... (复杂tooltip，省略，Worker中可以简化) ... */ } },
        xAxis: { type: 'category', data: categories, axisLabel: { rotate: 45 } },
        yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
        series: [{ type: 'candlestick', data: sortedData, itemStyle: { color: '#ef4444', color0: '#22c55e' }, markPoint: { data: markPointData } }]
    };
}

function getChart2Option(dataList) {
    dataList.sort((a, b) => b.zdf - a.zdf);
    const categories = dataList.map(item => getSimplifiedName(item.name));
    return {
        title: { text: '投机度与涨跌幅对比', left: 'center' },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: { data: ['投机度', '涨跌幅'], top: 10 },
        xAxis: { type: 'category', data: categories, axisLabel: { rotate: 45 } },
        yAxis: [
            { type: 'value', name: '投机度', position: 'left' },
            { type: 'value', name: '涨跌幅(%)', position: 'right', axisLabel: { formatter: '{value}%' } }
        ],
        series: [
            { name: '投机度', type: 'bar', yAxisIndex: 0, data: dataList.map(item => item.tjd) },
            { name: '涨跌幅', type: 'line', yAxisIndex: 1, data: dataList.map(item => item.zdf) }
        ]
    };
}

function getChart3Option(dataList) {
    dataList.sort((a, b) => b.zdf - a.zdf);
    return {
        title: { text: '增仓率与涨跌幅对比', left: 'center' },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: { data: ['增仓率', '涨跌幅'], top: 10 },
        xAxis: { type: 'category', data: dataList.map(item => getSimplifiedName(item.name)), axisLabel: { rotate: 45 } },
        yAxis: [
            { type: 'value', name: '增仓率(%)', position: 'left', axisLabel: { formatter: '{value}%' } },
            { type: 'value', name: '涨跌幅(%)', position: 'right', axisLabel: { formatter: '{value}%' } }
        ],
        series: [
            {
                name: '增仓率', type: 'bar', yAxisIndex: 0,
                data: dataList.map(item => {
                    const divisor = item.ccl - item.rz;
                    return divisor === 0 ? 0 : parseFloat(((item.rz / divisor) * 100).toFixed(2));
                })
            },
            { name: '涨跌幅', type: 'line', yAxisIndex: 1, data: dataList.map(item => item.zdf) }
        ]
    };
}

function getChart4Option(dataList) {
    dataList.sort((a, b) => b.zdf - a.zdf);
    const seriesConfig = [
        { name: '当日涨幅', field: 'zdf', color: '#ef4444' },
        { name: '3日涨幅', field: 'zdf3', color: '#22c55e' },
        { name: '5日涨幅', field: 'zdf5', color: '#3b82f6' },
        { name: '20日涨幅', field: 'zdf20', color: '#a855f7' },
        { name: '今年涨幅', field: 'zdfly', color: '#f59e0b' },
        { name: '250日涨幅', field: 'zdf250', color: '#14b8a6' }
    ];
    return {
        title: { text: '各周期涨跌幅对比', left: 'center' },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', formatter: (params) => { /* ... (复杂tooltip，省略) ... */ } },
        legend: { data: seriesConfig.map(s => s.name), top: 10, type: 'scroll' },
        xAxis: { type: 'category', data: dataList.map(item => getSimplifiedName(item.name)), axisLabel: { rotate: 45 } },
        yAxis: { type: 'value', name: '涨跌幅(%)', axisLabel: { formatter: '{value}%' } },
        series: seriesConfig.map(s => ({
            name: s.name, type: 'line', smooth: true, data: dataList.map(item => item[s.field])
        }))
    };
}

function getChart5Option(dataList, metric1, metric2) {
    dataList.sort((a, b) => b[metric1] - a[metric1]);
    const categories = dataList.map(item => getSimplifiedName(item.name));
    return {
        title: { text: `${fieldMapping[metric1]}与${fieldMapping[metric2]}对比`, left: 'center' },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: { data: [fieldMapping[metric1], fieldMapping[metric2]], top: 10 },
        xAxis: { type: 'category', data: categories, axisLabel: { rotate: 45 } },
        yAxis: [
            { type: 'value', name: fieldMapping[metric1], position: 'left' },
            { type: 'value', name: fieldMapping[metric2], position: 'right' }
        ],
        series: [
            { name: fieldMapping[metric1], type: 'bar', yAxisIndex: 0, data: dataList.map(item => item[metric1]) },
            { name: fieldMapping[metric2], type: 'line', yAxisIndex: 1, data: dataList.map(item => item[metric2]) }
        ]
    };
}

function getChart6Option(dataList) {
    // 树状图只使用默认的 cje 作为面积指标，zdf 作为颜色指标
    const treemapData = dataList.filter(item => item.cje > 10 * 1e8 && typeof item.zdf === 'number');
    if (treemapData.length > 0) treemapData.sort((a, b) => b.cje - a.cje);

    const treemapSeriesData = treemapData.map(item => ({
        name: getSimplifiedName(item.name),
        value: item.cje, // 面积代表成交额
        zdf: item.zdf,   // 颜色代表涨跌幅
        itemStyle: { color: getZdfTreemapColor(item.zdf) },
        label: { show: true, position: 'inside', color: '#fff', fontSize: 12, formatter: (params) => `${params.name}\n${formatCjeToBillion(params.value)}\n${params.data.zdf.toFixed(2)}%` }
    }));

    return {
        title: { text: '品种涨跌图', left: 'center' },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item', formatter: (params) => { /* ... (复杂tooltip，省略) ... */ } },
        series: [{ type: 'treemap', data: treemapSeriesData, width: '100%', height: '85%', top: '15%', roam: false, nodeClick: false, breadcrumb: { show: false } }]
    };
}

function getChart7Option(dataList) {
    const scatterData = dataList.map(item => {
        const prevCcl = item.ccl - item.rz;
        const rzRatio = prevCcl === 0 ? 0 : parseFloat(((item.rz / prevCcl) * 100).toFixed(2));
        return {
            name: getSimplifiedName(item.name),
            value: [item.zdf, rzRatio, item.cdzj, item.cje, item.vol, item.ccl]
        };
    }).filter(item => item.value[0] !== undefined && item.value[1] !== undefined);

    const minSizeMetric = Math.min(...scatterData.map(d => d.value[2])); // 默认用 cdzj
    const maxSizeMetric = Math.max(...scatterData.map(d => d.value[2])); // 默认用 cdzj

    return {
        title: { text: '涨跌幅与增仓比关系图', left: 'center' },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item', formatter: (params) => { /* ... (复杂tooltip，省略) ... */ } },
        grid: { left: '10%', right: '10%', bottom: '15%', top: '10%' },
        xAxis: { type: 'value', name: '涨跌幅 (%)', nameLocation: 'middle', nameGap: 25, axisLabel: { formatter: '{value}%' } },
        yAxis: { type: 'value', name: '增仓比 (%)', nameLocation: 'middle', nameGap: 45, axisLabel: { formatter: '{value}%' } },
        visualMap: {
            type: 'continuous', dimension: 2, // 默认 cdzj (index 2)
            min: minSizeMetric, max: maxSizeMetric, show: false, inRange: { symbolSize: [30, 100] }
        },
        series: [{
            type: 'scatter', data: scatterData,
            itemStyle: {
                color: (params) => { /* ... (复杂颜色逻辑，省略) ... */ return '#95a5a6'; },
                opacity: 0.8, borderColor: 'rgba(255, 255, 255, 0.5)', borderWidth: 2
            },
            label: { show: true, position: 'inside', formatter: '{b}', fontSize: 11, color: '#fff', fontWeight: 'bold' }
        }]
    };
}

function getChart8Option(dataList) {
    // 1. 【修复】完整初始化 counts 对象
    const counts = {
        riseStop: { count: 0, label: '涨停', color: '#B91C1C' },
        rise5: { count: 0, label: '上涨 > 5%', color: '#EF4444' },
        rise2to5: { count: 0, label: '上涨 2-5%', color: '#F87171' },
        rise0to2: { count: 0, label: '上涨 0-2%', color: '#FCA5A5' },
        flat: { count: 0, label: '平盘', color: '#9CA3AF' },
        fall0to2: { count: 0, label: '下跌 0-2%', color: '#86EFAC' },
        fall2to5: { count: 0, label: '下跌 2-5%', color: '#4ADE80' },
        fall5: { count: 0, label: '下跌 > 5%', color: '#22C55E' },
        fallStop: { count: 0, label: '跌停', color: '#15803D' },
    };

    let totalRiseCount = 0;
    let sumRiseZdf = 0;
    let totalFallCount = 0;
    let sumFallZdf = 0;

    // 2. 【修复】补全 forEach 中的统计逻辑
    dataList.forEach(item => {
        const zdf = parseFloat(item.zdf);
        if (isNaN(zdf)) return; // 跳过无效数据

        if (zdf > 0) {
            totalRiseCount++;
            sumRiseZdf += zdf;
            if (item.p >= item.zt) counts.riseStop.count++;
            else if (zdf >= 5) counts.rise5.count++;
            else if (zdf >= 2) counts.rise2to5.count++;
            else counts.rise0to2.count++;
        } else if (zdf < 0) {
            totalFallCount++;
            sumFallZdf += zdf;
            if (item.p <= item.dt) counts.fallStop.count++;
            else if (zdf <= -5) counts.fall5.count++;
            else if (zdf <= -2) counts.fall2to5.count++;
            else counts.fall0to2.count++;
        } else {
            counts.flat.count++;
        }
    });

    const avgRiseZdf = totalRiseCount > 0 ? (sumRiseZdf / totalRiseCount).toFixed(2) : '0.00';
    const displayAvgFallZdf = totalFallCount > 0 ? (Math.abs(sumFallZdf) / totalFallCount).toFixed(2) : '0.00';

    // 过滤掉数量为0的区间，但保留“平盘”以便在图例中显示
    const chartData = Object.keys(counts)
        .filter(key => counts[key].count > 0 || key === 'flat')
        .map(key => ({
            name: counts[key].label,
            value: counts[key].count,
            itemStyle: { color: counts[key].color }
        }));
        
    // 按预设顺序排序，让饼图颜色分布更合理
    const order = ['涨停', '上涨 > 5%', '上涨 2-5%', '上涨 0-2%', '平盘', '下跌 0-2%', '下跌 2-5%', '下跌 > 5%', '跌停'];
    chartData.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

    return {
        title: { text: '品种涨跌幅区间统计', left: 'center' },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item', formatter: '{b}: {c}个 ({d}%)' },
        legend: {
            orient: 'vertical',
            left: 10,
            top: 20,
            data: chartData.map(item => item.name)
        },
        graphic: [
            { type: 'text', left: '55%', top: '40%', style: { text: `上涨：${totalRiseCount}个`, fill: '#ef4444', fontSize: 14, fontWeight: 'bold', textAlign: 'center' } },
            { type: 'text', left: '55%', top: '45%', style: { text: `均涨：${avgRiseZdf}%`, fill: '#ef4444', fontSize: 13, textAlign: 'center' } },
            { type: 'text', left: '55%', top: '55%', style: { text: `下跌：${totalFallCount}个`, fill: '#22c55e', fontSize: 14, fontWeight: 'bold', textAlign: 'center' } },
            { type: 'text', left: '55%', top: '60%', style: { text: `均跌：${displayAvgFallZdf}%`, fill: '#22c55e', fontSize: 13, textAlign: 'center' } }
        ],
        series: [{
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['55%', '50%'],
            data: chartData,
            avoidLabelOverlap: false,
            label: {
                show: true,
                position: 'outer',
                formatter: '{b}\n{c}个 ({d}%)',
                color: '#333',
                fontSize: 11,
                fontWeight: 'normal',
                alignTo: 'edge',
                bleedMargin: 5
            },
            labelLine: {
                show: true,
                length: 10,
                length2: 15
            }
        }]
    };
}


/**
 * 核心辅助函数：生成图表SVG，并上传到R2
 */
async function generateAndUploadChart(env, chartTitle, option, width, height) {
    const chart = echarts.init(null, null, { renderer: 'svg', ssr: true, width, height });
    chart.setOption(option);
    const svg = chart.renderToSVGString();
    
    const subfolder = 'charts/';
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${chartTitle}_${timestamp}.svg`;
    const r2Key = `${subfolder}${fileName}`;

    await env.R2_BUCKET.put(r2Key, svg, { httpMetadata: { contentType: 'image/svg+xml' } });
    
    // ✨【重要】请将下面的URL替换为您自己R2桶的公开访问URL
    const publicUrl = `https://pub-8dfbdda6df204465aae771b4c080140b.r2.dev/${r2Key}`;
    
    return { name: fileName, url: publicUrl, size: svg.length };
}

/**
 * 【核心导出函数】
 * 生成所有图表，并将它们作为图片消息发送到指定的聊天室。
 */
export async function generateAndPostCharts(env, roomName) {
    console.log(`[ChartGenerator] Starting for room: ${roomName}`);
    try {
        const dataResponse = await fetch("https://q.want.biz/");
        if (!dataResponse.ok) throw new Error("Failed to fetch data source.");
        const apiData = await dataResponse.json();
        
        // 确保数据过滤和前端保持一致：只保留沉淀资金大于15亿的品种
        let filteredData = apiData.list.filter(item => item.cdzj > 15 * 1e8); 
        if (filteredData.length === 0) {
            console.log("[ChartGenerator] No data meets the criteria (cdzj > 15亿), skipping chart generation.");
            return;
        }

        // 交易时段内进一步过滤活跃品种
        // Worker 端没有 getSessionType，这里直接使用简单判断
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const isTradingSession = (hour >= 21 || (hour >= 0 && hour < 2) || (hour === 2 && minute <= 30)) || // 夜盘
                                 (hour >= 9 && (hour < 11 || (hour === 11 && minute < 30))) || // 日盘上午
                                 (hour >= 13 && (hour < 15 || (hour === 15 && minute === 0))); // 日盘下午

        if (isTradingSession) {
            const hasOpenMarkets = filteredData.some(item => item.jyzt === 0);
            if (hasOpenMarkets) {
                filteredData = filteredData.filter(item => item.jyzt === 0);
            }
        }
        
        if (filteredData.length === 0) {
            console.log("[ChartGenerator] No active data after session filtering, skipping chart generation.");
            return;
        }
        
        console.log(`[ChartGenerator] Data fetched and filtered. ${filteredData.length} items remaining.`);

        const chartsToGenerate = [
            { title: '期货品种走势对比', optionFunc: getChart1Option, width: 1200, height: 600 },
            { title: '投机度与涨跌幅对比', optionFunc: getChart2Option, width: 1200, height: 600 },
            { title: '增仓率与涨跌幅对比', optionFunc: getChart3Option, width: 1200, height: 600 },
            { title: '各周期涨跌幅对比', optionFunc: getChart4Option, width: 1200, height: 600 },
            { title: '自定义指标对比', optionFunc: getChart5Option, width: 1200, height: 600, metric1: 'cdzj', metric2: 'tjd' }, // 使用默认指标
            { title: '品种涨跌图', optionFunc: getChart6Option, width: 800, height: 600 },
            { title: '涨跌幅与增仓比关系图', optionFunc: getChart7Option, width: 1000, height: 800 },
            { title: '品种涨跌幅区间统计', optionFunc: getChart8Option, width: 800, height: 600 }
        ];

        const uploadPromises = chartsToGenerate.map(chartDef => {
            const option = chartDef.optionFunc(filteredData, chartDef.metric1, chartDef.metric2);
            return generateAndUploadChart(env, chartDef.title, option, chartDef.width, chartDef.height);
        });
        
        const results = await Promise.all(uploadPromises);
        console.log(`[ChartGenerator] Charts uploaded to R2.`);

        const doId = env.CHAT_ROOM_DO.idFromName(roomName);
        const stub = env.CHAT_ROOM_DO.get(doId);

        const postPromises = results.map(chart => {
            const messagePayload = {
                type: 'image',
                imageUrl: chart.url,
                filename: chart.name,
                size: chart.size,
                caption: `📊 自动生成的图表: ${chart.name}`
            };
            return stub.postBotMessage(messagePayload, env.CRON_SECRET);
        });
        
        await Promise.all(postPromises);
        console.log(`[ChartGenerator] All charts posted to room: ${roomName}`);

    } catch (error) {
        console.error(`[ChartGenerator] Process failed:`, error.stack || error);
    }
}