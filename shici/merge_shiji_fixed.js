const fs = require('fs');

// 读取史记简体数据
const shijiData = JSON.parse(fs.readFileSync('./assets/data/docs/shiji_struct_simplified.json', 'utf8'));

// 读取现有的诗词数据
const poetryData = JSON.parse(fs.readFileSync('./assets/data/poetry_data.json', 'utf8'));

console.log(`史记数据: ${shijiData.length} 篇`);
console.log(`现有诗词数据: ${poetryData.length} 篇`);

// 检查现有数据的格式
if (poetryData.length > 0) {
  console.log('现有数据格式示例:', Object.keys(poetryData[0]));
}

// 转换史记数据格式 - 匹配前端期望的字段名
const convertedShiji = shijiData.map(chapter => {
  return {
    title: `${chapter.volume_label}·${chapter.title}`, // 前端期望 title 字段
    auth: "司马迁",  // 前端期望 auth 字段（不是 author）
    content: chapter.content.join('\n'), // 前端期望 content 字段（字符串，用 \n 分隔）
    tags: ["史记", "古文", "先秦"]
  };
});

console.log(`转换后的史记数据: ${convertedShiji.length} 篇`);
console.log('转换后数据格式示例:', Object.keys(convertedShiji[0]));

// 过滤掉已有的史记数据（如果存在）
const filteredPoetryData = poetryData.filter(p => 
  !p.tags || !p.tags.includes('史记')
);

console.log(`过滤后的诗词数据: ${filteredPoetryData.length} 篇`);

// 合并数据
const mergedData = [...filteredPoetryData, ...convertedShiji];

console.log(`合并后总数据: ${mergedData.length} 篇`);

// 写入文件
fs.writeFileSync('./assets/data/poetry_data.json', JSON.stringify(mergedData, null, 2), 'utf8');

console.log('✓ 成功合并数据到 poetry_data.json');
console.log('✓ 数据格式已匹配前端期望 (title, auth, content, tags)');
