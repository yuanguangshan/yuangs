const fs = require('fs');

// 读取史记简体数据
const shijiData = JSON.parse(fs.readFileSync('./assets/data/docs/shiji_struct_simplified.json', 'utf8'));

// 读取现有的诗词数据
const poetryData = JSON.parse(fs.readFileSync('./assets/data/poetry_data.json', 'utf8'));

console.log(`史记数据: ${shijiData.length} 篇`);
console.log(`现有诗词数据: ${poetryData.length} 篇`);

// 转换史记数据格式 - 使用存储格式（与其他诗词数据一致）
const convertedShiji = shijiData.map(chapter => {
  return {
    author: "司马迁",  // 存储格式使用 author
    paragraphs: chapter.content, // 存储格式使用 paragraphs (数组)
    rhythmic: `${chapter.volume_label}·${chapter.title}`, // 存储格式使用 rhythmic
    tags: ["史记", "古文", "先秦"]
  };
});

console.log(`转换后的史记数据: ${convertedShiji.length} 篇`);

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
console.log('✓ 数据格式已匹配存储格式 (author, paragraphs, rhythmic, tags)');
console.log('✓ data-loader.js 会自动将其转换为前端格式 (auth, content, title)');
