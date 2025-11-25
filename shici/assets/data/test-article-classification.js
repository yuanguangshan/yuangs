#!/usr/bin/env node
// test-article-classification.js - 测试文章分类逻辑
// 分析所有诗词数据并生成报告

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== 复制 poem-display.js 中的核心函数 ====================

const SENTENCE_END = /[。！？!?]/;
const HALF_PAUSE = /[，,、；;]/;
const PUNCT_GLOBAL = /[，。！？、；：,.!?;:]/g;
const QUOTES_BRACKETS_GLOBAL = /["""'''（）\(\)《》〈〉【】\[\]『』「」]/g;

const CONFIG = {
  ARTICLE_LENGTH_THRESHOLD: 300
};

function normalizeContent(content) {
  if (!content) return '';
  content = content
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n');
  let s = content.replace(/\r\n?/g, '\n');
  const lines = s.split('\n').map(l => l.trim()).filter(l => l !== '');
  return lines.join('\n');
}

function stripPunctAndQuotes(s) {
  return s.replace(PUNCT_GLOBAL, '').replace(QUOTES_BRACKETS_GLOBAL, '').trim();
}

function splitBySentenceEnds(content) {
  const result = [];
  let buf = '';
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    buf += ch;
    if (SENTENCE_END.test(ch)) {
      let j = i + 1;
      while (j < content.length && /["""''））》〉】』」]/.test(content[j])) {
        buf += content[j];
        j++;
      }
      result.push(buf.trim());
      buf = '';
      i = j - 1;
    }
  }
  if (buf.trim()) result.push(buf.trim());
  return result.filter(Boolean);
}

function splitHalfByCommaOrPause(sentence) {
  const parts = [];
  let buf = '';
  for (let i = 0; i < sentence.length; i++) {
    const ch = sentence[i];
    buf += ch;
    if (HALF_PAUSE.test(ch)) {
      parts.push(buf.trim());
      buf = '';
    }
  }
  if (buf.trim()) parts.push(buf.trim());
  return parts;
}

function isRegularPoemWithPunctuation(content) {
  if (!content) return false;
  const normalized = normalizeContent(content);
  const lines = normalized.split('\n').filter(l => l !== '');
  if (lines.length >= 2) {
    const cleanLens = lines.map(l => stripPunctAndQuotes(l).length);
    const uniqueLens = [...new Set(cleanLens)];
    if (uniqueLens.length === 1 && (uniqueLens[0] === 5 || uniqueLens[0] === 7)) {
      return true;
    }
    return false;
  }
  const sentences = splitBySentenceEnds(normalized);
  if (sentences.length === 0) return false;
  let ok = 0;
  for (const sen of sentences) {
    const halves = splitHalfByCommaOrPause(sen);
    const lengths = halves.map(h => stripPunctAndQuotes(h).length).filter(n => n > 0);
    if (lengths.length > 0 && lengths.every(n => n === 5 || n === 7)) ok++;
  }
  return ok / sentences.length >= 0.8;
}

function parseTags(tagField) {
  let allTags = [];
  if (!tagField) return allTags;
  if (Array.isArray(tagField)) {
    tagField.forEach(tagItem => {
      if (typeof tagItem === 'string') {
        if (tagItem.includes(',')) {
          allTags = allTags.concat(tagItem.split(',').map(t => t.trim()).filter(Boolean));
        } else if (tagItem.includes('/')) {
          allTags = allTags.concat(tagItem.split('/').map(t => t.trim()).filter(Boolean));
        } else {
          const trimmed = tagItem.trim();
          if (trimmed) allTags.push(trimmed);
        }
      }
    });
  } else if (typeof tagField === 'string') {
    if (tagField.includes('/')) {
      allTags = tagField.split('/').map(t => t.trim()).filter(Boolean);
    } else if (tagField.includes(',')) {
      allTags = tagField.split(',').map(t => t.trim()).filter(Boolean);
    } else {
      allTags = tagField.split(' ').map(t => t.trim()).filter(Boolean);
    }
  }
  return allTags;
}

function parseTagsForPoem(poem) {
  let allTags = [];
  if (poem?.type) allTags = allTags.concat(parseTags(poem.type));
  if (poem?.tags) allTags = allTags.concat(parseTags(poem.tags));
  const unique = [...new Set(allTags)];
  return unique;
}

// 计算数组的标准差
function calculateStandardDeviation(arr) {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

// 检测是否为规整诗词句式 (5言或7言为主)
function hasRegularPoemPattern(lengths) {
  if (lengths.length === 0) return false;
  const count5or7 = lengths.filter(len => len === 5 || len === 7).length;
  return count5or7 / lengths.length > 0.7;
}

// 高级文章判断函数
function isArticleAdvanced(poem) {
  if (!poem) return false;
  
  let score = 0;
  const weights = {
    tag: 40,
    sentence: 30,
    structure: 20,
    length: 10
  };
  
  const allTags = parseTagsForPoem(poem);
  const tagString = allTags.join(' ');
  
  if (tagString.includes('古文观止') || tagString.includes('散文') || tagString.includes('赋')) {
    score += weights.tag;
  } else if (tagString.includes('唐诗') || tagString.includes('宋词') || tagString.includes('诗经')) {
    score -= weights.tag;
  }
  
  if (poem.content) {
    const sentences = poem.content
      .split(/[，。！？,.!?、；：]/)
      .filter(s => s.trim() !== '');
    const lengths = sentences.map(s => s.trim().length).filter(len => len > 0);
    
    if (lengths.length > 0) {
      const stdDev = calculateStandardDeviation(lengths);
      if (stdDev > 8) {
        score += weights.sentence * 0.6;
      } else if (stdDev < 3) {
        score -= weights.sentence * 0.6;
      }
      
      if (hasRegularPoemPattern(lengths)) {
        score -= weights.sentence * 0.4;
      }
    }
  }
  
  if (poem.content) {
    const normalized = normalizeContent(poem.content);
    const lines = normalized.split('\n').filter(l => l !== '');
    
    const paragraphs = poem.content.split(/\n\s*\n/).filter(p => p.trim() !== '');
    if (paragraphs.length > 3) {
      score += weights.structure * 0.5;
    }
    
    if (isRegularPoemWithPunctuation(poem.content)) {
      score -= weights.structure * 0.5;
    }
  }
  
  if (poem.content) {
    const contentLength = poem.content.length;
    if (contentLength > 500) {
      score += weights.length;
    } else if (contentLength < 80) {
      score -= weights.length;
    }
  }
  
  return { isArticle: score > 10, score };
}

// ==================== 主测试逻辑 ====================

async function analyzePoetryData() {
  console.log('开始分析诗词数据...\n');
  
  // 读取数据
  const dataPath = path.join(__dirname, 'assets/data/poetry_data.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const poems = JSON.parse(rawData);
  
  console.log(`总共加载 ${poems.length} 篇诗词\n`);
  
  // 转换数据结构：将 paragraphs 数组转为 content 字符串
  const convertedPoems = poems.map(poem => ({
    ...poem,
    title: poem.rhythmic || '无题',
    content: Array.isArray(poem.paragraphs) ? poem.paragraphs.join('\n') : (poem.content || '')
  }));
  
  // 分析每一篇
  const results = convertedPoems.map(poem => {
    const { isArticle, score } = isArticleAdvanced(poem);
    const tags = parseTagsForPoem(poem);
    const contentLength = poem.content ? poem.content.length : 0;
    
    return {
      title: poem.title || '无题',
      author: poem.author || '佚名',
      tags: tags,
      contentLength,
      isArticle,
      score: score.toFixed(2),
      poem
    };
  });
  
  // 统计
  const articles = results.filter(r => r.isArticle);
  const poems_only = results.filter(r => !r.isArticle);
  
  console.log('='.repeat(80));
  console.log('统计摘要');
  console.log('='.repeat(80));
  console.log(`总数: ${results.length}`);
  console.log(`文章: ${articles.length} (${(articles.length / results.length * 100).toFixed(2)}%)`);
  console.log(`诗词: ${poems_only.length} (${(poems_only.length / results.length * 100).toFixed(2)}%)`);
  console.log('');
  
  // 按标签分类统计
  const tagStats = {};
  results.forEach(r => {
    r.tags.forEach(tag => {
      if (!tagStats[tag]) {
        tagStats[tag] = { total: 0, articles: 0, poems: 0 };
      }
      tagStats[tag].total++;
      if (r.isArticle) {
        tagStats[tag].articles++;
      } else {
        tagStats[tag].poems++;
      }
    });
  });
  
  console.log('='.repeat(80));
  console.log('按标签分类统计');
  console.log('='.repeat(80));
  const sortedTags = Object.entries(tagStats).sort((a, b) => b[1].total - a[1].total);
  sortedTags.forEach(([tag, stats]) => {
    const articlePct = (stats.articles / stats.total * 100).toFixed(1);
    console.log(`${tag.padEnd(12)} | 总数: ${String(stats.total).padStart(5)} | 文章: ${String(stats.articles).padStart(4)} (${String(articlePct).padStart(5)}%) | 诗词: ${String(stats.poems).padStart(4)}`);
  });
  console.log('');
  
  // 显示文章样例
  console.log('='.repeat(80));
  console.log('文章样例 (评分最高的前10篇)');
  console.log('='.repeat(80));
  const topArticles = articles.sort((a, b) => parseFloat(b.score) - parseFloat(a.score)).slice(0, 10);
  topArticles.forEach((r, i) => {
    console.log(`${i + 1}. 《${r.title}》 - ${r.author}`);
    console.log(`   标签: ${r.tags.join(', ')}`);
    console.log(`   字数: ${r.contentLength} | 评分: ${r.score}`);
    console.log('');
  });
  
  // 显示诗词样例
  console.log('='.repeat(80));
  console.log('诗词样例 (评分最低的前10篇)');
  console.log('='.repeat(80));
  const topPoems = poems_only.sort((a, b) => parseFloat(a.score) - parseFloat(b.score)).slice(0, 10);
  topPoems.forEach((r, i) => {
    console.log(`${i + 1}. 《${r.title}》 - ${r.author}`);
    console.log(`   标签: ${r.tags.join(', ')}`);
    console.log(`   字数: ${r.contentLength} | 评分: ${r.score}`);
    console.log('');
  });
  
  // 边界案例 (评分接近阈值的)
  console.log('='.repeat(80));
  console.log('边界案例 (评分在 0-20 之间)');
  console.log('='.repeat(80));
  const borderCases = results
    .filter(r => parseFloat(r.score) >= 0 && parseFloat(r.score) <= 20)
    .sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
    .slice(0, 20);
  borderCases.forEach((r, i) => {
    const type = r.isArticle ? '文章' : '诗词';
    console.log(`${i + 1}. 《${r.title}》 - ${r.author} [${type}]`);
    console.log(`   标签: ${r.tags.join(', ')}`);
    console.log(`   字数: ${r.contentLength} | 评分: ${r.score}`);
    console.log('');
  });
  
  // 生成详细报告文件
  const reportPath = path.join(__dirname, 'article-classification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    summary: {
      total: results.length,
      articles: articles.length,
      poems: poems_only.length,
      articlePercentage: (articles.length / results.length * 100).toFixed(2) + '%'
    },
    tagStats: Object.fromEntries(sortedTags),
    topArticles: topArticles.map(r => ({
      title: r.title,
      author: r.author,
      tags: r.tags,
      contentLength: r.contentLength,
      score: r.score
    })),
    topPoems: topPoems.map(r => ({
      title: r.title,
      author: r.author,
      tags: r.tags,
      contentLength: r.contentLength,
      score: r.score
    })),
    borderCases: borderCases.map(r => ({
      title: r.title,
      author: r.author,
      tags: r.tags,
      contentLength: r.contentLength,
      score: r.score,
      isArticle: r.isArticle
    })),
    allResults: results.map(r => ({
      title: r.title,
      author: r.author,
      tags: r.tags,
      contentLength: r.contentLength,
      score: r.score,
      isArticle: r.isArticle
    }))
  }, null, 2));
  
  console.log('='.repeat(80));
  console.log(`详细报告已保存到: ${reportPath}`);
  console.log('='.repeat(80));
}

// 运行分析
analyzePoetryData().catch(console.error);
