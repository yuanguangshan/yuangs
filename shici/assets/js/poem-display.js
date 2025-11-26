// poem-display.js - 诗词显示逻辑模块（简化与稳健化版，含"\\n"转真实换行修复）
// 处理诗词的格式化和渲染

import { CONFIG } from "./config.js";

/* =========================
   标点常量与工具函数
   ========================= */
const SENTENCE_END = /[。！？!?]/; // 句末标点（单次）
const HALF_PAUSE = /[，,、；;]/; // 半句停顿（逗号/顿号/分号）
const PUNCT_GLOBAL = /[，。！？、；：,.!?;:]/g;
const QUOTES_BRACKETS_GLOBAL = /["""‘’'（）\(\)《》〈〉【】\[\]『』「」]/g;

function normalizeContent(content) {
  if (!content) return "";
  // 关键修复：把字面量 "\r\n" 和 "\n" 还原为真实换行
  // 避免页面出现可见的 '\n'
  content = content
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n");

  // 统一实际换行为 \n
  let s = content.replace(/\r\n?/g, "\n");

  // 去除每行首尾空白并丢弃空行
  const lines = s
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "");
  return lines.join("\n");
}

function stripPunctAndQuotes(s) {
  return s.replace(PUNCT_GLOBAL, "").replace(QUOTES_BRACKETS_GLOBAL, "").trim();
}

function splitBySentenceEnds(content) {
  // 将句末引号/右括号等并入句尾
  const result = [];
  let buf = "";
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
      buf = "";
      i = j - 1;
    }
  }
  if (buf.trim()) result.push(buf.trim());
  return result.filter(Boolean);
}

function splitHalfByCommaOrPause(sentence) {
  // 按半句停顿切分；保留停顿标点在片段末尾
  const parts = [];
  let buf = "";
  for (let i = 0; i < sentence.length; i++) {
    const ch = sentence[i];
    buf += ch;
    if (HALF_PAUSE.test(ch)) {
      parts.push(buf.trim());
      buf = "";
    }
  }
  if (buf.trim()) parts.push(buf.trim());
  return parts;
}

function mergeEveryTwo(lines) {
  const out = [];
  for (let i = 0; i < lines.length; i += 2) {
    out.push(lines[i] + (lines[i + 1] || ""));
  }
  return out;
}

function renderLinesToHTML(lines) {
  const joined = lines.join("\n");
  let html = joined
    .replace(/\n/g, "<br>")
    .replace(
      /(<br>\s*){3,}/g,
      '<br><div class="poem-paragraph-break"></div><br>'
    )
    .replace(/(<br>\s*){2}/g, "<br><br>");
  return html;
}

/* =========================
   规整诗判定
   ========================= */

export function isRegularPoemWithPunctuation(content) {
  if (!content) return false;

  const normalized = normalizeContent(content);
  const lines = normalized.split("\n").filter((l) => l !== "");
  if (lines.length >= 2) {
    // 基于行：所有行去标点与引号后长度一致且为 5 或 7
    const cleanLens = lines.map((l) => stripPunctAndQuotes(l).length);
    const uniqueLens = [...new Set(cleanLens)];
    if (
      uniqueLens.length === 1 &&
      (uniqueLens[0] === 5 || uniqueLens[0] === 7)
    ) {
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
    const lengths = halves
      .map((h) => stripPunctAndQuotes(h).length)
      .filter((n) => n > 0);
    if (lengths.length > 0 && lengths.every((n) => n === 5 || n === 7)) ok++;
  }
  return ok / sentences.length >= 0.8;
}

export function isRegularPoem(poem) {
  if (!poem || !poem.content) return false;
  const normalized = normalizeContent(poem.content);
  const lines = normalized.split("\n").filter((l) => l !== "");
  if (lines.length < 2) return false;

  const cleanLens = lines.map((l) => stripPunctAndQuotes(l).length);
  const all5 = cleanLens.every((n) => n === 5);
  const all7 = cleanLens.every((n) => n === 7);
  return all5 || all7;
}

/* =========================
   文章/长诗判定与滚动需求
   ========================= */

// 计算数组的标准差
function calculateStandardDeviation(arr) {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance =
    arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

// 检测是否为规整诗词句式 (5言或7言为主)
function hasRegularPoemPattern(lengths) {
  if (lengths.length === 0) return false;
  const count5or7 = lengths.filter((len) => len === 5 || len === 7).length;
  return count5or7 / lengths.length > 0.7; // 70%以上是5或7言
}

/**
 * 高级文章判断函数 - 使用多维度评分机制
 * @param {Object} poem - 诗词对象
 * @returns {boolean} - 是否为文章
 */
export function isArticleAdvanced(poem) {
  if (!poem) return false;

  let score = 0; // 基准分0，>10为文章，<-10为诗词
  const weights = {
    tag: 40,
    sentence: 30,
    structure: 20,
    length: 10,
  };

  // === 1. 标签特征分析 (40%) ===
  const allTags = parseTagsForPoem(poem);
  const tagString = allTags.join(" ");

  if (
    tagString.includes("古文观止") ||
    tagString.includes("散文") ||
    tagString.includes("赋")
  ) {
    score += weights.tag;
  } else if (
    tagString.includes("唐诗") ||
    tagString.includes("宋词") ||
    tagString.includes("诗经")
  ) {
    score -= weights.tag;
  }

  // === 2. 句式特征分析 (30%) ===
  if (poem.content) {
    const sentences = poem.content
      .split(/[，。！？,.!?、；：]/)
      .filter((s) => s.trim() !== "");
    const lengths = sentences
      .map((s) => s.trim().length)
      .filter((len) => len > 0);

    if (lengths.length > 0) {
      // 2.1 句长离散度
      const stdDev = calculateStandardDeviation(lengths);
      if (stdDev > 8) {
        score += weights.sentence * 0.6; // 高离散度 -> 文章
      } else if (stdDev < 3) {
        score -= weights.sentence * 0.6; // 低离散度 -> 诗词
      }

      // 2.2 规整诗词模式检测
      if (hasRegularPoemPattern(lengths)) {
        score -= weights.sentence * 0.4; // 规整句式 -> 诗词
      }
    }
  }

  // === 3. 结构特征分析 (20%) ===
  if (poem.content) {
    const normalized = normalizeContent(poem.content);
    const lines = normalized.split("\n").filter((l) => l !== "");

    // 3.1 段落分析 (通过连续换行判断)
    const paragraphs = poem.content
      .split(/\n\s*\n/)
      .filter((p) => p.trim() !== "");
    if (paragraphs.length > 3) {
      score += weights.structure * 0.5; // 多段落 -> 文章
    }

    // 3.2 规整性检测
    if (isRegularPoemWithPunctuation(poem.content)) {
      score -= weights.structure * 0.5; // 规整诗 -> 诗词
    }
  }

  // === 4. 长度特征分析 (10%) ===
  if (poem.content) {
    const contentLength = poem.content.length;
    if (contentLength > 500) {
      score += weights.length; // 超长 -> 文章
    } else if (contentLength < 80) {
      score -= weights.length; // 极短 -> 诗词
    }
  }

  // === 最终判断 ===
  return score > 10; // 阈值可调整
}

/**
 * 原有的简化版文章判断函数 - 现在调用高级版本
 * 保留此函数以保持向后兼容性
 * @param {Object} poem - 诗词对象
 * @returns {boolean} - 是否为文章
 */
export function isArticle(poem) {
  return isArticleAdvanced(poem);
}

// 判断是否为长诗
export function isLongPoem(poem) {
  if (!poem || !poem.content) return false;
  const lines = normalizeContent(poem.content)
    .split("\n")
    .filter((l) => l !== "");
  return lines.length > 10;
}

/* =========================
   对联布局
   ========================= */

export function formatCoupletPoem(poem) {
  const lines = normalizeContent(poem.content || "")
    .split("\n")
    .filter((l) => l !== "");
  let html = "";
  for (let i = 0; i < lines.length; i += 2) {
    html += '<div class="couplet-row">';
    html += `<div class="couplet-line">${lines[i]}</div>`;
    if (i + 1 < lines.length) {
      html += `<div class="couplet-line">${lines[i + 1]}</div>`;
    }
    html += "</div>";
  }
  return html;
}

export function needsScrollableVerticalMode(poem) {
  if (!poem || !poem.content) return false;
  const lines = normalizeContent(poem.content)
    .split("\n")
    .filter((l) => l !== "");
  if (lines.length >= 7 && lines.length <= 10) return true;
  return false;
}

/* =========================
   断句与格式化
   ========================= */

// 兼容接口：插入标点符号后的换行（文章 vs 短诗）
export function insertLineBreaksAtPunctuation(content) {
  const normalized = normalizeContent(content);
  if (!normalized) return "";

  // 文章模式：保持原有段落结构，使用 P 标签包裹
  if (normalized.length > CONFIG.ARTICLE_LENGTH_THRESHOLD) {
    return renderArticleToHTML(normalized);
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

// 兼容接口：插入标点符号后的换行（文章 vs 短诗）
function renderArticleToHTML(content) {
  const lines = content.split("\n");
  let html = '<div class="article-content">';
  for (const line of lines) {
    if (line.trim()) {
      html += `<p>${line.trim()}</p>`;
    }
  }
  html += '</div>';
  return html;
}

// 根据规则断句诗歌，优先断为 4 句
export function formatPoemWithLineBreaks(content, poem) {
  const normalized = normalizeContent(content);

  // 若是规整诗（五言/七言）优先采用 4/8 规则
  if (isRegularPoemWithPunctuation(normalized)) {
    // 先按行
    let lines = normalized.split("\n").filter((l) => l !== "");
    if (lines.length === 4) {
      return renderLinesToHTML(lines);
    } else if (lines.length === 8) {
      return renderLinesToHTML(mergeEveryTwo(lines));
    } else if (lines.length > 8) {
      return renderLinesToHTML(lines);
    }

    // 【新增】优先尝试按逗号和句末标点切分（针对绝句）
    // 这样可以将"独在异乡为异客，每逢佳节倍思亲。遥知兄弟登高处，遍插茱萸少一人。"
    // 拆分成四句显示
    // 修复：使用捕获组保留标点符号，防止标点丢失
    const rawParts = normalized.split(/([，。！？,.!?])/);
    const halfSentences = [];
    
    for (let i = 0; i < rawParts.length; i++) {
      const part = rawParts[i].trim();
      if (!part) continue;
      
      // 如果是标点符号，且前一个元素存在，则追加到前一个元素
      if (/^[，。！？,.!?]$/.test(part)) {
        if (halfSentences.length > 0) {
          halfSentences[halfSentences.length - 1] += part;
        }
      } else {
        // 否则作为新的一句
        halfSentences.push(part);
      }
    }

    if (halfSentences.length === 4) {
      return renderLinesToHTML(halfSentences);
    } else if (halfSentences.length === 8) {
      return renderLinesToHTML(mergeEveryTwo(halfSentences));
    }

    // 按句末切句
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

export function parseTagsForPoem(poem) {
  let allTags = [];
  if (poem?.type) allTags = allTags.concat(parseTags(poem.type));
  if (poem?.tags) allTags = allTags.concat(parseTags(poem.tags));
  return allTags;
}

function parseTags(tagSource) {
  if (!tagSource) return [];

  // Known Chinese poetry tags to help with separation
  const knownTags = [
    "诗经", "楚辞", "乐府", "唐诗", "宋词", "清词", "词", "蒙学", "古文",
    "先秦", "汉", "魏晋", "南北朝", "隋", "唐", "五代", "南唐", "宋", "元", "明", "清", "现代", "近现代", "五代十国",
    "九歌", "九章", "论语", "儒家",
    "边塞", "田园", "送别", "思乡", "爱国", "山水", "爱情", "闺怨", "悼亡", "咏物", "咏史", "题画", "酬赠", "羁旅", "写景", "咏怀", "哲理", "宫怨", "讽刺", "记梦", "悼亡", "题画", "怀古", "咏史诗", "田园诗", "边塞诗", "山水诗", "爱情诗", "送别诗", "思乡诗", "哲理诗"
  ];

  // Create a regex pattern from the known tags (sort by length descending to match longer tags first)
  const sortedTags = [...knownTags].sort((a, b) => b.length - a.length);
  const tagPattern = sortedTags.map(tag => tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const combinedRegex = new RegExp(`(${tagPattern})`, 'g');

  function separateConcatenatedTags(tagString) {
    // If it contains any known tags concatenated together, split them
    const matches = tagString.match(combinedRegex);
    if (matches && matches.length > 1) {
      // Multiple known tags were found concatenated together, separate them
      return matches;
    }
    return [tagString]; // Return as single item if no separation needed
  }

  if (Array.isArray(tagSource)) {
    // If already an array, process each element
    const result = tagSource.flatMap(item => {
      if (typeof item === 'string') {
        // First split by separators
        const separatedByDelimiters = item.split(/[\/,，]/);
        // Then check each part for concatenated tags
        return separatedByDelimiters.flatMap(part => separateConcatenatedTags(part.trim())).filter(tag => tag);
      }
      return [];
    });
    return result;
  }

  // If it's a string, first split by delimiters, then check for concatenated tags
  const parts = tagSource.split(/[\/,，]/);
  const result = parts.flatMap(part => separateConcatenatedTags(part.trim())).filter(tag => tag);
  return result;
}

export function generateTagsHTML(poem) {
  let allTags = [];
  if (poem?.type) allTags = allTags.concat(parseTags(poem.type));
  if (poem?.tags) allTags = allTags.concat(parseTags(poem.tags));
  if (allTags.length === 0) return "";

  const uniqueTags = [...new Set(allTags)];
  
  // 如果是文章，自动添加"古文"标签
  if (isArticle(poem) && !uniqueTags.includes("古文")) {
    uniqueTags.unshift("古文");
  }

  const dynastyTags = [
    "先秦",
    "汉",
    "魏晋",
    "南北朝",
    "隋",
    "唐",
    "五代",
    "南唐",
    "宋",
    "元",
    "明",
    "清",
    "现代",
    "近现代",
  ];
  const typeTags = [
    "诗经",
    "楚辞",
    "乐府",
    "唐诗",
    "宋词",
    "清词",
    "词",
    "蒙学",
    "古文",
  ];

  return uniqueTags
    .slice(0, 5)
    .map((tag) => {
      let tagClass = "poem-tag";
      if (dynastyTags.includes(tag)) {
        tagClass += " dynasty";
      } else if (typeTags.includes(tag)) {
        tagClass += " type";
      }
      const safeTag = tag
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<span class="${tagClass}" onclick="window.handleTagClick && window.handleTagClick('${safeTag}')">${safeTag}</span>`;
    })
    .join("");
}