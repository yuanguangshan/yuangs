#!/usr/bin/env node

/**
 * 简体转繁体脚本
 * 将当前目录下的所有文件从简体中文转换为繁体中文
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 检查并安装依赖
function ensureDependencies() {
  try {
    require.resolve('opencc-js');
    console.log('✓ 依赖已安装');
  } catch (e) {
    console.log('正在安装 opencc-js...');
    try {
      execSync('npm install opencc-js', { stdio: 'inherit' });
      console.log('✓ 依赖安装完成');
    } catch (error) {
      console.error('❌ 依赖安装失败，请手动运行: npm install opencc-js');
      process.exit(1);
    }
  }
}

// 确保依赖已安装
ensureDependencies();

// 导入 opencc-js
const OpenCC = require('opencc-js');

// 创建简体转繁体的转换器
const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

// 需要处理的文件扩展名
const VALID_EXTENSIONS = ['.txt', '.md'];

// 需要排除的目录
const EXCLUDE_DIRS = ['.git', 'node_modules'];

// 统计信息
const stats = {
  totalFiles: 0,
  convertedFiles: 0,
  skippedFiles: 0,
  errors: 0
};

/**
 * 递归遍历目录
 */
function walkDirectory(dirPath, callback) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 跳过排除的目录
      if (!EXCLUDE_DIRS.includes(file)) {
        walkDirectory(filePath, callback);
      }
    } else if (stat.isFile()) {
      callback(filePath);
    }
  });
}

/**
 * 转换单个文件
 */
function convertFile(filePath) {
  const ext = path.extname(filePath);
  
  // 检查文件扩展名
  if (!VALID_EXTENSIONS.includes(ext)) {
    stats.skippedFiles++;
    return;
  }

  stats.totalFiles++;
  
  try {
    console.log(`处理: ${filePath}`);
    
    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 转换为繁体
    const traditionalContent = converter(content);
    
    // 检查是否有变化
    if (content === traditionalContent) {
      console.log(`  ⊙ 无需转换（已是繁体或无中文）`);
      stats.skippedFiles++;
      return;
    }
    
    // 创建备份
    const backupPath = filePath + '.backup';
    fs.copyFileSync(filePath, backupPath);
    console.log(`  ✓ 已创建备份: ${backupPath}`);
    
    // 写入转换后的内容
    fs.writeFileSync(filePath, traditionalContent, 'utf8');
    console.log(`  ✓ 转换完成`);
    
    stats.convertedFiles++;
  } catch (error) {
    console.error(`  ❌ 错误: ${error.message}`);
    stats.errors++;
  }
}

/**
 * 主函数
 */
function main() {
  console.log('='.repeat(60));
  console.log('简体转繁体脚本');
  console.log('='.repeat(60));
  console.log();

  const currentDir = __dirname;
  console.log(`工作目录: ${currentDir}`);
  console.log(`处理文件类型: ${VALID_EXTENSIONS.join(', ')}`);
  console.log(`排除目录: ${EXCLUDE_DIRS.join(', ')}`);
  console.log();
  console.log('开始处理...');
  console.log();

  // 遍历并转换所有文件
  walkDirectory(currentDir, convertFile);

  // 输出统计信息
  console.log();
  console.log('='.repeat(60));
  console.log('转换完成！');
  console.log('='.repeat(60));
  console.log(`总文件数: ${stats.totalFiles}`);
  console.log(`已转换: ${stats.convertedFiles}`);
  console.log(`已跳过: ${stats.skippedFiles}`);
  console.log(`错误数: ${stats.errors}`);
  console.log();
  
  if (stats.convertedFiles > 0) {
    console.log('提示: 原文件已备份为 .backup 后缀');
    console.log('如需恢复，可运行: find . -name "*.backup" -exec sh -c \'mv "$1" "${1%.backup}"\' _ {} \\;');
  }
}

// 运行主函数
main();
