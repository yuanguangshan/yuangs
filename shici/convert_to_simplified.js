const fs = require('fs');
const OpenCC = require('opencc-js');

// 初始化繁简转换器
const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });

// 读取 JSON 文件
const inputFile = './shiji_struct.json';
const outputFile = './shiji_struct_simplified.json';

console.log('正在读取文件...');
const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

console.log(`共 ${data.length} 个章节，开始转换...`);

// 转换每个章节
const convertedData = data.map((chapter, index) => {
  if ((index + 1) % 10 === 0) {
    console.log(`已处理 ${index + 1}/${data.length} 个章节...`);
  }
  
  return {
    ...chapter,
    volume_label: converter(chapter.volume_label),
    title: converter(chapter.title),
    content: chapter.content.map(paragraph => converter(paragraph))
  };
});

// 写入新文件
console.log('正在保存文件...');
fs.writeFileSync(outputFile, JSON.stringify(convertedData, null, 2), 'utf8');

console.log(`✓ 转换完成！已保存为 ${outputFile}`);
console.log(`共转换 ${convertedData.length} 个章节`);
