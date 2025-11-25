// poem-display.js - 诗词显示逻辑模块（简化与稳健化版，含"\\n"转真实换行修复）
// 处理诗词的格式化和渲染

import { CONFIG } from './config.js';

/* =========================
   标点常量与工具函数
   ========================= */
const SENTENCE_END = /[。！？!?]/;              // 句末标点（单次）
const HALF_PAUSE = /[，,、；;]/;               // 半句停顿（逗号/顿号/分号）
const PUNCT_GLOBAL = /[，。！？、；：,.!?;:]/g;
const QUOTES_BRACKETS_GLOBAL = /["""‘’'（）\(\)《》〈〉【】\[\]『』「」]/g;

function normalizeContent(content) {
  if (!content) return '';
  // 关键修复：把字面量 "\r\n" 和 "\n" 还原为真实换行
  // 避免页面出现可见的 '\n'
  content = content
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n');

  // 统一实际换行为 \n
  let s = content.replace(/\r\n?/g, '\n');

  // 去除每行首尾空白并丢弃空行
  const lines = s.split('\n').map(l => l.trim()).filter(l => l !== '');
  return lines.join('\n');
}

function stripPunctAndQuotes(s) {
  return s.replace(PUNCT_GLOBAL, '').replace(QUOTES_BRACKETS_GLOBAL, '').trim();
}

function splitBySentenceEnds(content) {
  // 将句末引号/右括号等并入句尾
  const result = [];
  let buf = '';
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    buf += ch;
    if (SENTENCE_END.test(ch)) {
      let j = i + 1;
      while (j < content.length && /[""’'））》〉】』」]/.test(content[j])) {
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
  // 按半句停顿切分；保留停顿标点在片段末尾
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

function mergeEveryTwo(lines) {
  const out = [];
  for (let i = 0; i < lines.length; i += 2) {
    out.push(lines[i] + (lines[i + 1] || ''));
  }
  return out;
}

function renderLinesToHTML(lines) {
  const joined = lines.join('\n');
  let html = joined
    .replace(/\n/g, '<br>')
    .replace(/(<br>\s*){3,}/g, '<br><div class="poem-paragraph-break"></div><br>')
    .replace(/(<br>\s*){2}/g, '<br><br>');
  return html;
}

/* =========================
   规整诗判定
   ========================= */

export function isRegularPoemWithPunctuation(content) {
  if (!content) return false;

  const normalized = normalizeContent(content);
  const lines = normalized.split('\n').filter(l => l !== '');
  if (lines.length >= 2) {
    // 基于行：所有行去标点与引号后长度一致且为 5 或 7
    const cleanLens = lines.map(l => stripPunctAndQuotes(l).length);
    const uniqueLens = [...new Set(cleanLens)];
    if (uniqueLens.length === 1 && (uniqueLens[0] === 5 || uniqueLens[0] === 7)) {
      return true;
    }
    return false;
  }

  // 无换行：按句末切句后采用占比阈值判断
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

export function isRegularPoem(poem) {
  if (!poem || !poem.content) return false;
  const normalized = normalizeContent(poem.content);
  const lines = normalized.split('\n').filter(l => l !== '');
  if (lines.length < 2) return false;

  const cleanLens = lines.map(l => stripPunctAndQuotes(l).length);
  const all5 = cleanLens.every(n => n === 5);
  const all7 = cleanLens.every(n => n === 7);
  return all5 || all7;
}

/* =========================
   文章/长诗判定与滚动需求
   ========================= */

export function isArticle(poem) {
  if (!poem) return false;

  const allTags = parseTagsForPoem(poem);
  const tagString = allTags.join(' ');

  // 1. 古文观止 => 文章
  if (tagString.includes('古文观止')) return true;

  // 2. 唐诗/宋词 => 非文章
  if (tagString.includes('唐诗') || tagString.includes('宋词')) return false;

  // 3. 诗经 => 非文章
  if (tagString.includes('诗经')) return false;

  // 4. 统计每句字数离散度
  if (poem.content) {
    const sentences = poem.content.split(/[，。！？,.!?、；：]/).filter(s => s.trim() !== '');
    const lengths = sentences.map(s => s.trim().length);
    const unique = new Set(lengths);
    if (unique.size > 6) return true;
    if (unique.size < 3) return false;
  }

  // 5. 字数阈值
  if (poem.content && poem.content.length > CONFIG.ARTICLE_LENGTH_THRESHOLD) return true;

  // 6. 很短 => 非文章
  if (poem.content && poem.content.length < 80) return false;

  // 7. 默认非文章
  return false;
}

export function isLongPoem(poem) {
  if (!poem || !poem.content) return false;
  const lines = normalizeContent(poem.content).split('\n').filter(l => l !== '');
  return lines.length > 10;
}

export function needsScrollableVerticalMode(poem) {
  if (!poem || !poem.content) return false;
  const lines = normalizeContent(poem.content).split('\n').filter(l => l !== '');
  if (lines.length >= 7 && lines.length <= 10) return true;
  return false;
}

/* =========================
   断句与格式化
   ========================= */

// 兼容接口：插入标点符号后的换行（文章 vs 短诗）
export function insertLineBreaksAtPunctuation(content) {
  const normalized = normalizeContent(content);
  if (!normalized) return '';

  // 文章模式：只在句末断句
  if (normalized.length > CONFIG.ARTICLE_LENGTH_THRESHOLD) {
    const sentences = splitBySentenceEnds(normalized);
    return renderLinesToHTML(sentences);
  }

  // 短诗模式：句末断句 + 逗号半句
  const sentences = splitBySentenceEnds(normalized);
  const parts = [];
  for (const sen of sentences) {
    const halves = splitHalfByCommaOrPause(sen);
    parts.push(...halves);
  }

  return renderLinesToHTML(parts);
}

// 根据规则断句诗歌，优先断为 4 句
export function formatPoemWithLineBreaks(content, poem) {
  const normalized = normalizeContent(content);

  // 若是规整诗（五言/七言）优先采用 4/8 规则
  if (isRegularPoemWithPunctuation(normalized)) {
    // 先按行
    let lines = normalized.split('\n').filter(l => l !== '');
    if (lines.length === 4) {
      return renderLinesToHTML(lines);
    } else if (lines.length === 8) {
      return renderLinesToHTML(mergeEveryTwo(lines));
    } else if (lines.length > 8) {
      return renderLinesToHTML(lines);
    }

    // 无行或行数不理想，则按句末切句
    const sentences = splitBySentenceEnds(normalized);
    if (sentences.length === 4) {
      return renderLinesToHTML(sentences);
    } else if (sentences.length === 8) {
      return renderLinesToHTML(mergeEveryTwo(sentences));
    } else if (sentences.length > 8) {
      return renderLinesToHTML(sentences);
    }

    // 再尝试按半句靠近 4/8
    const halves = sentences.flatMap(splitHalfByCommaOrPause);
    if (halves.length === 4) {
      return renderLinesToHTML(halves);
    } else if (halves.length === 8) {
      return renderLinesToHTML(mergeEveryTwo(halves));
    } else if (halves.length > 8) {
      return renderLinesToHTML(halves);
    }

    // 否则回退到通用
    return insertLineBreaksAtPunctuation(normalized);
  }

  // 非规整诗：使用通用逻辑
  return insertLineBreaksAtPunctuation(normalized);
}

/* =========================
   对联布局
   ========================= */

export function formatCoupletPoem(poem) {
  const lines = normalizeContent(poem.content || '').split('\n').filter(l => l !== '');
  let html = '';
  for (let i = 0; i < lines.length; i += 2) {
    html += '<div class="couplet-row">';
    html += `<div class="couplet-line">${lines[i]}</div>`;
    if (i + 1 < lines.length) {
      html += `<div class="couplet-line">${lines[i + 1]}</div>`;
    }
    html += '</div>';
  }
  return html;
}

/* =========================
   标签处理
   ========================= */

export function parseTags(tagField) {
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

export function parseTagsForPoem(poem) {
  let allTags = [];
  if (poem?.type) allTags = allTags.concat(parseTags(poem.type));
  if (poem?.tags) allTags = allTags.concat(parseTags(poem.tags));
  const unique = [...new Set(allTags)];
  return unique;
}

export function generateTagsHTML(poem) {
  let allTags = [];
  if (poem?.type) allTags = allTags.concat(parseTags(poem.type));
  if (poem?.tags) allTags = allTags.concat(parseTags(poem.tags));
  if (allTags.length === 0) return '';

  const uniqueTags = [...new Set(allTags)];
  const dynastyTags = ['先秦', '汉', '魏晋', '南北朝', '隋', '唐', '五代', '南唐', '宋', '元', '明', '清', '现代', '近现代'];
  const typeTags = ['诗经', '楚辞', '乐府', '唐诗', '宋词', '清词', '词', '蒙学'];

  return uniqueTags.slice(0, 5).map(tag => {
    let tagClass = 'poem-tag';
    if (dynastyTags.includes(tag)) {
      tagClass += ' dynasty';
    } else if (typeTags.includes(tag)) {
      tagClass += ' type';
    }
    const safeTag = tag.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<span class="${tagClass}" onclick="window.handleTagClick && window.handleTagClick('${safeTag}')">${safeTag}</span>`;
  }).join('');
}