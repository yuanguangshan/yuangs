// Test the updated parseTags function
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
      // Filter out empty strings and ensure we only return matched tags
      return matches.filter(tag => tag && tag.trim());
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

// Test cases
console.log("测试开始...\n");

// Test 1: Normal separated tags
console.log("测试 1 - 正常分隔的标签:");
console.log("输入:", ["诗经/先秦", "边塞，思乡"]);
console.log("输出:", parseTags(["诗经/先秦", "边塞，思乡"]));
console.log("预期: ['诗经', '先秦', '边塞', '思乡']\n");

// Test 2: Concatenated tags
console.log("测试 2 - 连接的标签:");
console.log("输入:", "先秦楚辞九歌");
console.log("输出:", parseTags("先秦楚辞九歌"));
console.log("预期: 根据已知标签模式进行分割\n");

// Test 3: Mixed case with delimiters and concatenated
console.log("测试 3 - 混合情况（分隔符+连接）:");
console.log("输入:", ["诗经/先秦田园", "边塞，思乡爱国"]);
console.log("输出:", parseTags(["诗经/先秦田园", "边塞，思乡爱国"]));
console.log("预期: 应该识别并分离连接的标签\n");

// Test 4: String input
console.log("测试 4 - 字符串输入:");
console.log("输入:", "唐诗宋词边塞田园");
console.log("输出:", parseTags("唐诗宋词边塞田园"));
console.log("预期: ['唐诗', '宋词', '边塞', '田园']\n");

// Test 5: Array with concatenated elements
console.log("测试 5 - 包含连接标签的数组:");
console.log("输入:", ["先秦楚辞", "唐诗宋词", "边塞田园"]);
console.log("输出:", parseTags(["先秦楚辞", "唐诗宋词", "边塞田园"]));
console.log("预期: 应该尝试分离像'先秦楚辞'这样的连接标签\n");

console.log("测试完成！");