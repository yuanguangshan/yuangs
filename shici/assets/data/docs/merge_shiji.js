const fs = require('fs');

// 读取史记简体数据
const shijiData = JSON.parse(fs.readFileSync('./shiji_struct_simplified.json', 'utf8'));

// 读取现有的诗词数据
const poetryData = JSON.parse(fs.readFileSync('./assets/data/poetry_data.json', 'utf8'));

console.log(`史记数据: ${shijiData.length} 篇`);
console.log(`现有诗词数据: ${poetryData.length} 篇`);

// 转换史记数据格式
const convertedShiji = shijiData.map(chapter => {
  return {
    author: "司马迁",
    paragraphs: chapter.content, // content 已经是字符串数组
    rhythmic: `${chapter.volume_label}·${chapter.title}`,
    tags: ["史记", "古文", "先秦"]
  };
});

console.log(`转换后的史记数据: ${convertedShiji.length} 篇`);

// 合并数据
const mergedData = [...poetryData, ...convertedShiji];

console.log(`合并后总数据: ${mergedData.length} 篇`);

// 写入文件
fs.writeFileSync('./assets/data/poetry_data.json', JSON.stringify(mergedData, null, 2), 'utf8');

console.log('✓ 成功合并数据到 poetry_data.json');
