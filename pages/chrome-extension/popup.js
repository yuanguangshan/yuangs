// 全局变量
let chart = null;
let premiumChart = null;
let contractDetailChart = null;
let echartsLoadRetries = 0;
const MAX_RETRIES = 3;
let autoUpdateInterval = null;
let isAutoUpdateEnabled = true;
let futuresData = [];
let contractsData = {};
let varietyIdMap = {}; // 品种ID映射
let currentVariety = null; // 当前选择的品种

// 数据备份和回退机制（方案五）
let lastSuccessfulFuturesData = null; // 上次成功获取的期货数据
let lastSuccessfulContractsData = {}; // 上次成功获取的合约数据
let lastUpdateTime = null; // 上次成功更新的时间

// 交易所映射表
const EXCHANGE_MAP = {
  'SHFE': 113,
  'DCE': 114,
  'CZCE': 115,
  'GFEX': 225,
  'INE': 142,
  'CFFEX': 220
};

// 通过background.js获取数据的函数
function fetchViaBackground(url, options = {}) {
  return new Promise((resolve, reject) => {
    console.log('通过background.js获取数据:', url);
    chrome.runtime.sendMessage(
      {action: "fetchData", url: url, options: options},
      function(response) {
        if (!response) {
          reject(new Error("未收到来自background.js的响应"));
          return;
        }
        
        if (response.success) {
          console.log('获取数据成功:', url);
          if (response.contentType === 'json') {
            resolve(response.data);
          } else {
            try {
              // 尝试解析JSON
              resolve(JSON.parse(response.data));
            } catch (e) {
              // 如果不是JSON，返回原始文本
              resolve(response.data);
            }
          }
        } else {
          console.error('获取数据失败:', response.error);
          reject(new Error(response.error || "获取数据失败"));
        }
      }
    );
  });
}

// 带超时的fetch请求 - 使用background.js
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  return fetchViaBackground(url, options);
}

// 带重试的fetch请求 - 使用background.js
async function fetchWithRetry(url, options = {}, retries = 2) {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchWithTimeout(url, options);
    } catch (error) {
      console.warn(`请求失败(${i+1}/${retries}):`, error);
      lastError = error;
      // 等待一段时间再重试
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }
  
  throw lastError;
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
  // 隐藏错误信息
  document.getElementById('error').style.display = 'none';
  
  // 绑定刷新按钮事件
  const refreshBtn = document.getElementById('refresh-btn');
  const refreshBtnHeader = document.getElementById('refresh-btn-header');
  const refreshVarietyBtn = document.getElementById('refresh-variety-data');
  
  refreshBtn.addEventListener('click', function() {
    fetchData();
  });
  
  refreshBtnHeader.addEventListener('click', function() {
    if (isAutoUpdateEnabled) {
      // 如果自动更新开启，点击按钮暂停
      stopAutoUpdate();
      refreshBtnHeader.textContent = '开启自动更新';
      refreshBtnHeader.classList.add('paused');
    } else {
      // 如果自动更新关闭，点击按钮开启
      startAutoUpdate();
      refreshBtnHeader.textContent = '暂停自动更新';
      refreshBtnHeader.classList.remove('paused');
    }
  });
  
  refreshVarietyBtn.addEventListener('click', function() {
    const variety = document.getElementById('variety-select').value;
    console.log('刷新品种数据按钮点击，选择的品种:', variety);
    
    if (variety) {
      fetchVarietyContracts(variety);
    } else {
      alert('请先选择品种');
    }
  });
  
  // 绑定后退按钮事件
  document.getElementById('back-to-overview').addEventListener('click', function() {
    showOverview();
  });
  
  // 绑定关闭合约详情按钮事件
  document.getElementById('close-detail').addEventListener('click', function() {
    document.getElementById('contract-detail').style.display = 'none';
    document.getElementById('contract-selector').style.display = 'block';
  });
  
  // 绑定品种选择器事件
  document.getElementById('variety-select').addEventListener('change', function() {
    const variety = this.value;
    console.log('品种选择变更:', variety);
    
    if (variety) {
      currentVariety = variety;
      fetchVarietyContracts(variety);
    } else {
      const premiumChartElement = document.getElementById('premium-chart');
      if (premiumChartElement) {
        premiumChartElement.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#666;">请选择品种</div>';
      }
      const contractsBody = document.getElementById('contracts-body');
      if (contractsBody) {
        contractsBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">请选择品种</td></tr>';
      }
    }
  });
  
  // 从sessionStorage恢复当前品种（如果有）
  try {
    const savedVariety = sessionStorage.getItem('currentVariety');
    if (savedVariety) {
      currentVariety = savedVariety;
    }
  } catch (e) {
    console.warn('无法从sessionStorage读取当前品种:', e);
  }
  
  // 检查ECharts是否加载
  checkEChartsLoaded();
  
  // 启动自动更新
  startAutoUpdate();
});

// 从品种名称获取品种ID
function getVarietyIdFromName(name) {
  if (!name) return '';
  
  // 提取不含数字的中文品种名
  const varietyName = extractVarietyCode(name);
  
  // 查找映射表中的品种ID
  if (varietyIdMap[varietyName]) {
    return varietyIdMap[varietyName];
  }
  
  // 如果没有找到，查找futuresData尝试构建ID
  const matchedItem = futuresData.find(item => {
    return extractVarietyCode(item.name) === varietyName;
  });
  
  if (matchedItem && matchedItem.uid) {
    const [exchange, code] = matchedItem.uid.split('|');
    if (exchange && code) {
      const variety = code.replace(/\d+/g, '');
      const msgid = `${EXCHANGE_MAP[exchange] || ''}_${variety}`.toLowerCase();
      varietyIdMap[varietyName] = msgid; // 保存到映射表
      return msgid;
    }
  }
  
  // 如果找不到，尝试直接将名称用作ID
  return varietyName.toLowerCase();
}

// 开始自动更新 - 使用setTimeout代替setInterval，避免重叠执行
function startAutoUpdate() {
  isAutoUpdateEnabled = true;
  // 立即获取一次数据
  fetchData()
    .catch(error => {
      console.error('初始数据加载失败:', error);
      showErrorMessage('初始数据加载失败: ' + error.message);
    })
    .finally(() => {
      // 设置下一次刷新
      if (isAutoUpdateEnabled) {
        if (autoUpdateInterval) clearTimeout(autoUpdateInterval);
        autoUpdateInterval = setTimeout(() => startAutoUpdate(), 30000);
      }
    });
}

// 停止自动更新
function stopAutoUpdate() {
  isAutoUpdateEnabled = false;
  if (autoUpdateInterval) {
    clearTimeout(autoUpdateInterval);
    autoUpdateInterval = null;
  }
}

// 显示错误信息
function showErrorMessage(message) {
  const errorElement = document.getElementById('error');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

// 创建缓存数据警告元素
function createCacheWarning(message, container) {
  const warningDiv = document.createElement('div');
  warningDiv.className = 'cache-warning';
  warningDiv.textContent = message;
  
  if (container) {
    // 清空容器并添加警告
    container.innerHTML = '';
    container.appendChild(warningDiv);
    
    // 3秒后自动移除警告
    setTimeout(() => {
      if (warningDiv.parentNode === container) {
        container.removeChild(warningDiv);
      }
    }, 5000);
  }
  
  return warningDiv;
}

// 检查ECharts是否加载
function checkEChartsLoaded() {
  if (typeof echarts !== 'undefined') {
    console.log('ECharts已成功加载');
    // ECharts已加载，初始加载数据
    fetchData();
  } else if (echartsLoadRetries < MAX_RETRIES) {
    console.log(`ECharts未加载，尝试重新加载 (${echartsLoadRetries + 1}/${MAX_RETRIES})`);
    echartsLoadRetries++;
    
    // 尝试动态加载ECharts
    const script = document.createElement('script');
    // 使用本地文件
    script.src = 'echarts.min.js';
    script.onload = function() {
      console.log('ECharts动态加载成功');
      fetchData();
    };
    script.onerror = function() {
      console.error('ECharts动态加载失败');
      setTimeout(checkEChartsLoaded, 1000); // 1秒后重试
    };
    document.head.appendChild(script);
  } else {
    console.error('ECharts加载失败，已达到最大重试次数');
    const errorElement = document.getElementById('error');
    errorElement.textContent = 'ECharts加载失败，请检查网络连接';
    errorElement.style.display = 'block';
    document.getElementById('loading').style.display = 'none';
  }
}

// 获取期货市场数据 - 增加数据备份和回退机制
async function fetchData() {
  const loadingIndicator = document.getElementById('loading');
  const contentElement = document.getElementById('content');
  const errorElement = document.getElementById('error');
  
  // 显示加载指示器
  loadingIndicator.style.display = 'block';
  contentElement.style.display = 'none';
  errorElement.style.display = 'none';
  
  try {
    // 检查ECharts是否可用
    if (typeof echarts === 'undefined') {
      throw new Error('ECharts未加载，无法显示图表');
    }
    
    // 获取期货数据
    const data = await fetchWithRetry('https://q.want.biz/');
    if (!data || !data.list || data.list.length === 0) {
      throw new Error('获取数据失败，数据结构不符合预期');
    }
    
    // 保存数据
    futuresData = data.list;
    
    // 同时保存成功的数据为备份
    lastSuccessfulFuturesData = [...data.list];
    lastUpdateTime = new Date();
    
    // 更新品种ID映射
    buildVarietyIdMap();
    
    // 分析数据
    const analysisResults = analyzeFuturesData(futuresData);
    
    // 先显示内容容器，因为图表需要可见的容器来计算尺寸
    contentElement.style.display = 'block';
    loadingIndicator.style.display = 'none';
    
    // 更新期货列表和摘要
    updateFuturesList(futuresData);
    updateSummary(analysisResults);
    
    // 如果有保存的当前品种并且在合约选择器视图，则自动加载它
    if (currentVariety && document.getElementById('contract-selector').style.display === 'block') {
      fetchVarietyContracts(currentVariety);
    }
    
  } catch (error) {
    console.error('获取或处理数据时出错:', error);
    
    // 如果有上次成功获取的数据，使用它
    if (lastSuccessfulFuturesData && lastSuccessfulFuturesData.length > 0) {
      console.log('使用上次缓存的数据', lastUpdateTime?.toLocaleString() || '未知时间');
      
      // 使用备份数据
      futuresData = [...lastSuccessfulFuturesData];
      
      // 分析备份数据
      const analysisResults = analyzeFuturesData(futuresData);
      analysisResults.lastUpdated += ' (缓存)';
      
      // 显示内容
      contentElement.style.display = 'block';
      loadingIndicator.style.display = 'none';
      
      // 更新UI使用备份数据
      updateFuturesList(futuresData);
      updateSummary(analysisResults);
      
      // 显示缓存数据警告
      const cacheWarning = document.createElement('div');
      cacheWarning.className = 'cache-warning';
      cacheWarning.textContent = `数据更新失败，使用缓存数据 (${error.message})`;
      
      // 添加到内容区域顶部
      if (contentElement.firstChild) {
        contentElement.insertBefore(cacheWarning, contentElement.firstChild);
      } else {
        contentElement.appendChild(cacheWarning);
      }
      
      // 5秒后自动移除警告
      setTimeout(() => {
        if (cacheWarning.parentNode) {
          cacheWarning.parentNode.removeChild(cacheWarning);
        }
      }, 5000);
      
      // 如果当前在合约选择器页面，尝试刷新合约数据
      if (currentVariety && document.getElementById('contract-selector').style.display === 'block') {
        fetchVarietyContracts(currentVariety);
      }
    } else {
      // 没有备份数据，显示错误信息
      errorElement.textContent = error.message || '加载数据失败';
      errorElement.style.display = 'block';
      loadingIndicator.style.display = 'none';
    }
  }
}

// 构建品种ID映射表
function buildVarietyIdMap() {
  varietyIdMap = {};
  
  futuresData.forEach(item => {
    if (!item.uid || !item.name) return;
    
    const [exchange, code] = item.uid.split('|');
    if (!exchange || !code) return;
    
    const variety = code.replace(/\d+/g, '');
    const varietyName = extractVarietyCode(item.name);
    
    if (variety && varietyName && EXCHANGE_MAP[exchange]) {
      const msgid = `${EXCHANGE_MAP[exchange]}_${variety}`.toLowerCase();
      varietyIdMap[varietyName] = msgid;
    }
  });
  
  console.log('已构建品种ID映射表:', varietyIdMap);
}

// 判断当前是否是夜盘交易时间
function isTradingHours() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // 日盘交易时段：9:00-11:30 和 13:30-15:00
    const daySession1 = (9 * 60) <= totalMinutes && totalMinutes < (11 * 60 + 30);
    const daySession2 = (13 * 60 + 30) <= totalMinutes && totalMinutes < (15 * 60);
    
    // 夜盘交易时段：21:00-次日2:30
    const nightSession = (totalMinutes >= 21 * 60) || (totalMinutes < 2 * 60 + 30);

    return daySession1 || daySession2 || nightSession;
}

// 计算增仓率 - 使用原始公式: rz/(ccl-rz)
function calculatePositionChangeRate(item) {
  const rz = parseFloat(item.rz) || 0;
  const ccl = parseFloat(item.ccl) || 0;
  
  // 如果ccl或ccl-rz为0，返回0，避免除以0的错误
  if (ccl === 0 || ccl <= rz) return 0;
  
  // 计算增仓率
  const rate = (rz / (ccl - rz)) * 100;
  return rate.toFixed(2);
}

// 分析期货数据
function analyzeFuturesData(futuresData) {
  // 默认值
  let result = {
    totalVolume: 0,
    totalContracts: 0,
    upCount: 0,
    downCount: 0,
    neutralCount: 0,
    avgUpChange: 0,
    avgDownChange: 0,
    lastUpdated: new Date().toLocaleString('zh-CN')
  };
  
  // 如果没有数据，返回默认值
  if (!futuresData || futuresData.length === 0) {
    return result;
  }
  
  try {
    // 计算上涨和下跌的品种数量
    const upCount = futuresData.filter(item => parseFloat(item.zdf) > 0).length;
    const downCount = futuresData.filter(item => parseFloat(item.zdf) < 0).length;
    const neutralCount = futuresData.filter(item => parseFloat(item.zdf) === 0 || isNaN(parseFloat(item.zdf))).length;
    
    // 计算平均涨跌幅
    const upItems = futuresData.filter(item => parseFloat(item.zdf) > 0);
    const downItems = futuresData.filter(item => parseFloat(item.zdf) < 0);
    
    const avgUpChange = upItems.length > 0 ? 
      (upItems.reduce((sum, item) => sum + parseFloat(item.zdf), 0) / upItems.length).toFixed(2) : 0;
    
    const avgDownChange = downItems.length > 0 ? 
      (downItems.reduce((sum, item) => sum + parseFloat(item.zdf), 0) / downItems.length).toFixed(2) : 0;
    
    // 获取当前时间
    const lastUpdated = new Date().toLocaleString('zh-CN');
    
    return {
      ...result,
      totalContracts: futuresData.length,
      upCount,
      downCount,
      neutralCount,
      avgUpChange,
      avgDownChange,
      lastUpdated
    };
  } catch (error) {
    console.error('分析期货数据出错:', error);
    // 出错时返回默认值
    return result;
  }
}

// 更新期货列表
function updateFuturesList(futuresData) {
  const listContainer = document.getElementById('futures-list');
  if (!listContainer) return;
  
  try {
    // 清空列表
    listContainer.innerHTML = '';
    
    // 按涨跌幅绝对值排序，取前10
    const sortedData = [...futuresData]
      .sort((a, b) => Math.abs(parseFloat(b.zdf) || 0) - Math.abs(parseFloat(a.zdf) || 0))
      .slice(0, 10);
    
    // 创建每个期货品种的列表项
    sortedData.forEach(item => {
      const li = document.createElement('li');
      
      // 计算涨跌幅和增仓率
      const change = parseFloat(item.zdf) || 0;
      const posChangeRate = calculatePositionChangeRate(item);
      
      // 确定增仓率状态和颜色
      let posRateStatusClass = 'neutral';
      if (posChangeRate > 0) {
        posRateStatusClass = 'up';
      } else if (posChangeRate < 0) {
        posRateStatusClass = 'down';
      }
      
      // It's always better to use isFinite to check for a valid number
      const absChange = isFinite(change) ? Math.abs(change) : 0;
      
      // 确定涨跌幅颜色
      const changeColor = change > 0 ? '#ff7675' : '#55efc4';
      
      // 使用非线性缩放，让小数值也能看到一定的进度条长度
      // 增加了系数从2.5到5，最大值从30%增加到50%
      const scaledWidth = Math.min(absChange *10, 90);
      
      li.innerHTML = `
        <div class="change-arrow ${posRateStatusClass}"></div>
        <div class="futures-name">${item.name}</div>
        <div class="futures-change">
          <div class="change-bar">
            <div class="change-value" style="width: ${scaledWidth}%; background-color: ${changeColor}"></div>
            <div class="change-text">${change > 0 ? '+' : ''}${change}%</div>
          </div>
        </div>
        <div class="futures-posrate ${posRateStatusClass}">${posChangeRate > 0 ? '+' : ''}${posChangeRate}%</div>
      `;
      
      // 添加点击事件
      li.addEventListener('click', () => {
        const variety = getVarietyIdFromName(item.name);
        if (variety) {
          showContractSelector(variety);
        }
      });
      
      // 添加到列表
      listContainer.appendChild(li);
    });
  } catch (error) {
    console.error('更新期货列表出错:', error);
    listContainer.innerHTML = '<div class="error-message">更新期货列表失败</div>';
  }
}

// 更新数据摘要
function updateSummary(data) {
  const statusElement = document.getElementById('market-status-text');
  if (!statusElement) {
    console.error('状态元素未找到');
    return;
  }
  // 更新市场状态和时间
  const statusText = isTradingHours() ? '🟢 交易中' : '🔴 休市中';
  statusElement.textContent = statusText;
  document.getElementById('update-time').textContent = data.lastUpdated;
  
  // 更新状态指示器样式
  const statusIndicator = document.querySelector('.status-indicator');
  if (statusIndicator) {
    if (isAutoUpdateEnabled) {
      statusIndicator.classList.remove('status-paused');
      statusIndicator.classList.add('status-normal');
    } else {
      statusIndicator.classList.remove('status-normal');
      statusIndicator.classList.add('status-paused');
    }
  }
  
  // 更新涨跌统计
  document.getElementById('up-count').textContent = data.upCount;
  document.getElementById('down-count').textContent = data.downCount;
  document.getElementById('neutral-count').textContent = data.neutralCount;
  
  // 更新平均涨跌幅和总计数据
  document.getElementById('limit-up-count').textContent = data.avgUpChange + '%';
  document.getElementById('limit-down-count').textContent = data.avgDownChange + '%';
  document.getElementById('total-count').textContent = data.totalContracts;
}

// 格式化数字
function formatNumber(num) {
  if (isNaN(num)) return '0';
  
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿';
  } else if (num >= 10000) {
    return (num / 10000).toFixed(2) + '万';
  } else {
    return num.toString();
  }
}

// 显示合约选择器
function showContractSelector(variety) {
  console.log('显示合约选择器，品种:', variety);
  
  // 保存当前品种到sessionStorage，确保刷新时可以恢复
  try {
    sessionStorage.setItem('currentVariety', variety);
    currentVariety = variety;
  } catch (e) {
    console.warn('无法保存当前品种到sessionStorage:', e);
  }
  
  // 隐藏概览区域
  document.getElementById('overview-section').style.display = 'none';
  document.getElementById('contract-detail').style.display = 'none';
  
  // 显示选择器区域
  const contractSelector = document.getElementById('contract-selector');
  contractSelector.style.display = 'block';
  
  // 更新品种选择框
  updateVarietySelect(variety);
  
  // 检查是否有有效的variety
  if (!variety) {
    const premiumChartElement = document.getElementById('premium-chart');
    if (premiumChartElement) {
      premiumChartElement.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#666;">请选择品种</div>';
    }
    const contractsBody = document.getElementById('contracts-body');
    if (contractsBody) {
      contractsBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">请选择品种</td></tr>';
    }
    return;
  }
  
  // 获取指定品种的合约列表并显示升贴水图表
  fetchVarietyContracts(variety);
}

// 更新品种选择框
function updateVarietySelect(selectedVariety) {
  const varietySelect = document.getElementById('variety-select');
  if (!varietySelect) return;
  
  varietySelect.innerHTML = '<option value="">请选择品种</option>';
  
  try {
    // 获取所有期货品种
    const varieties = [];
    
    // 遍历futuresData提取品种信息
    futuresData.forEach(item => {
      if (!item.uid) return;
      
      const [exchange, code] = item.uid.split('|');
      if (!code) return;
      
      const variety = code.replace(/\d+/g, '');
      const name = item.name ? item.name.replace(/\d+/g, '') : '';
      
      if (!variety || !name || !exchange) return;
      
      // 创建msgid
      const msgid = `${EXCHANGE_MAP[exchange] || ''}_${variety}`.toLowerCase();
      
      // 保存到varietyIdMap映射
      varietyIdMap[name] = msgid;
      
      // 检查是否已经添加过这个品种
      if (!varieties.some(v => v.code === variety)) {
        varieties.push({
          code: variety,
          name: name,
          exchange: exchange,
          msgid: msgid
        });
      }
    });
    
    // 添加品种选项
    varieties.forEach(variety => {
      const option = document.createElement('option');
      option.value = variety.msgid;
      option.textContent = variety.name;
      
      // 如果是当前选中的品种，设置为选中状态
      if (variety.code === selectedVariety || variety.msgid === selectedVariety || 
          variety.name === selectedVariety) {
        option.selected = true;
      }
      
      varietySelect.appendChild(option);
    });
    
    console.log('品种选择框已更新，品种数量:', varieties.length);
  } catch (error) {
    console.error('更新品种选择框失败:', error);
  }
}

// 从品种名称中提取品种代码
function extractVarietyCode(name) {
  if (!name) return '';
  
  // 移除所有数字和特殊字符，保留中文
  return name.replace(/[0-9()（）]/g, '').trim();
}

// 获取指定品种的合约列表 - 增加数据备份和回退机制
async function fetchVarietyContracts(variety) {
  const premiumChartElement = document.getElementById('premium-chart');
  const contractsBody = document.getElementById('contracts-body');
  
  if (!premiumChartElement || !contractsBody) {
    console.error('找不到必要的DOM元素');
    return;
  }
  
  try {
    console.log(`获取${variety}的合约列表，msgid:${variety}`);
    
    // 显示加载状态
    premiumChartElement.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#666;">加载中...</div>';
    contractsBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">加载中...</td></tr>';
    
    // 保证variety不为空
    if (!variety) {
      throw new Error('品种ID为空');
    }
    
    // 1. 从API获取合约列表 - 使用try/catch分开处理每个步骤的错误
    let contractCodes = [];
    try {
      const contractsData = await fetchWithRetry(`https://q.889.ink/redis?msgid=${encodeURIComponent(variety)}`);
      console.log('获取到合约列表数据:', contractsData);
      
      if (!contractsData || !Array.isArray(contractsData)) {
        throw new Error('获取合约列表失败，数据格式不正确');
      }
      
      // 过滤并提取合约代码
      contractCodes = contractsData
        .filter(item => item && item.code && /\d+/.test(item.code))
        .map(item => `${item.mktid}_${item.code}`);
      
      if (contractCodes.length === 0) {
        throw new Error('未找到有效的合约');
      }
      
      console.log('提取的合约代码:', contractCodes);
    } catch (contractError) {
      console.error('获取合约列表步骤失败:', contractError);
      
      // 尝试从缓存获取数据
      if (lastSuccessfulContractsData[variety]) {
        console.log(`使用缓存的${variety}合约数据`);
        
        // 显示缓存警告
        createCacheWarning(`使用缓存的合约数据 (${contractError.message})`, premiumChartElement);
        
        // 使用缓存数据更新UI
        setTimeout(() => {
          renderContractsTable(lastSuccessfulContractsData[variety]);
          renderPremiumChart(variety, lastSuccessfulContractsData[variety]);
        }, 500);
        
        return;
      }
      
      throw contractError; // 无缓存可用，重新抛出错误
    }
    
    // 2. 获取合约价格数据
    try {
      // 构建URL，确保合约代码正确编码
      const customUrl = `https://q.889.ink/custom/${contractCodes.join(',')}?orderBy=code&sort=asc&pageSize=100&pageIndex=0&callbackName=`;
      console.log('请求价格数据URL:', customUrl);
      
      // 获取价格数据
      const pricesText = await fetchWithRetry(customUrl);
      
      // 处理JSON或JSONP响应
      let pricesData;
      if (typeof pricesText === 'string') {
        // 尝试提取JSON部分
        const jsonStr = pricesText.replace(/^[^({]*\(|\)[^}]*$/g, '');
        try {
          pricesData = JSON.parse(jsonStr);
        } catch (e) {
          console.error('JSON解析错误:', e, '原始字符串:', jsonStr);
          throw new Error(`解析价格数据失败: ${e.message}`);
        }
      } else {
        // 如果已经是对象，直接使用
        pricesData = pricesText;
      }
      
      if (!pricesData || !pricesData.list || !Array.isArray(pricesData.list)) {
        console.error('价格数据格式不正确:', pricesData);
        throw new Error('价格数据格式不正确');
      }
      
      const prices = pricesData.list;
      
      if (prices.length === 0) {
        throw new Error('未获取到任何价格数据');
      }
      
      // 转换数据为统一格式
      const formattedPrices = prices.map(item => ({
        code: item.name || '',
        price: item.p || '0',
        change: item.zdf || '0',
        volume: item.vol || '0',
        position: item.ccl || '0'
      }));
      
      // 保存数据 - 使用正确的品种名称作为键
      const varietyName = extractVarietyCode(prices[0]?.name || '');
      contractsData[varietyName] = formattedPrices;
      
      // 同时使用msgid作为键存储数据，确保可以通过两种方式访问
      contractsData[variety] = formattedPrices;
      
      // 同时保存到备份中
      lastSuccessfulContractsData[varietyName] = [...formattedPrices];
      lastSuccessfulContractsData[variety] = [...formattedPrices];
      
      console.log(`保存了品种数据: ${varietyName}, ${variety}`, formattedPrices);
      
      // 显示合约列表
      renderContractsTable(formattedPrices);
      
      // 显示升贴水图表
      renderPremiumChart(varietyName, formattedPrices);
      
    } catch (pricesError) {
      console.error('获取价格数据步骤失败:', pricesError);
      
      // 尝试从缓存获取数据
      if (lastSuccessfulContractsData[variety]) {
        console.log(`使用缓存的${variety}价格数据`);
        
        // 显示缓存警告
        createCacheWarning(`使用缓存的价格数据 (${pricesError.message})`, premiumChartElement);
        
        // 使用缓存数据更新UI
        setTimeout(() => {
          renderContractsTable(lastSuccessfulContractsData[variety]);
          renderPremiumChart(variety, lastSuccessfulContractsData[variety]);
        }, 500);
      } else {
        // 获取价格数据失败，显示错误信息
        if (premiumChartElement) {
          premiumChartElement.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#ff7675;">价格数据加载失败: ${pricesError.message}</div>`;
        }
        
        if (contractsBody) {
          contractsBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">获取价格数据失败: ${pricesError.message}</td></tr>`;
        }
      }
    }
    
  } catch (error) {
    console.error('获取合约列表失败:', error);
    
    // 更新DOM，显示错误信息
    if (premiumChartElement) {
      premiumChartElement.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#ff7675;">加载失败: ${error.message}</div>`;
    }
    
    if (contractsBody) {
      contractsBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">获取合约列表失败，${error.message}</td></tr>`;
    }
  }
}

// 渲染合约表格 - 增加错误处理
function renderContractsTable(contracts) {
  const contractsBody = document.getElementById('contracts-body');
  const contractsTable = document.getElementById('contracts-table');
  const tableContainer = document.getElementById('table-container');
  
  if (!contractsBody || !contractsTable || !tableContainer) {
    console.error('找不到必要的DOM元素');
    return;
  }
  
  // 清空现有内容
  contractsBody.innerHTML = '';
  
  if (!contracts || contracts.length === 0) {
    contractsBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">无合约数据</td></tr>';
    return;
  }
  
  try {
    // 按合约月份排序
    contracts.sort((a, b) => {
      const monthA = a.code.match(/\d+/) ? a.code.match(/\d+/)[0] : '';
      const monthB = b.code.match(/\d+/) ? b.code.match(/\d+/)[0] : '';
      return monthA.localeCompare(monthB);
    });
    
    // 填充表格
    contracts.forEach(contract => {
      const row = document.createElement('tr');
      
      // 为涨跌幅添加颜色样式
      const change = parseFloat(contract.change);
      const changeClass = change >= 0 ? 'price-up' : 'price-down';
      const changeSign = change >= 0 ? '+' : '';
      const changeText = change ? `${changeSign}${change}%` : '-';
      
      row.innerHTML = `
        <td>${contract.code || '-'}</td>
        <td>${contract.price || '-'}</td>
        <td class="${changeClass}">${changeText}</td>
        <td>${formatNumber(contract.volume)}</td>
        <td>${formatNumber(contract.position)}</td>
      `;
      
      // 为行添加点击事件 - 确保保存contract对象的副本
      row.addEventListener('click', function() {
        const contractCopy = {...contract};
        console.log('点击合约行:', contractCopy);
        showContractDetail(contractCopy);
      });
      
      contractsBody.appendChild(row);
    });
    
    // 显示表格容器
    tableContainer.style.display = 'block';
    contractsTable.style.display = 'table';
  } catch (error) {
    console.error('渲染合约表格失败:', error);
    contractsBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">渲染表格失败: ${error.message}</td></tr>`;
  }
}

// 显示合约详情 - 增加错误处理
function showContractDetail(contract) {
  if (!contract) {
    console.error('合约对象为空，无法显示详情');
    return;
  }
  
  console.log('显示合约详情:', contract);
  
  try {
    // 隐藏合约选择器和概览
    document.getElementById('contract-selector').style.display = 'none';
    document.getElementById('overview-section').style.display = 'none';
    
    // 显示合约详情
    const detailElement = document.getElementById('contract-detail');
    detailElement.style.display = 'block';
    
    // 更新合约详情数据
    document.getElementById('contract-name').textContent = contract.code || '未知合约';
    document.getElementById('contract-price').textContent = contract.price || '-';
    
    const change = parseFloat(contract.change);
    const changeValue = document.getElementById('contract-change');
    changeValue.textContent = change ? `${change >= 0 ? '+' : ''}${change}%` : '-';
    changeValue.className = `contract-info-value ${change >= 0 ? 'up' : 'down'}`;
    
    document.getElementById('contract-volume').textContent = formatNumber(contract.volume);
    document.getElementById('contract-position').textContent = formatNumber(contract.position);
    
    // 生成并显示升贴水图表
    setTimeout(() => {
      renderContractPremiumChart(contract);
    }, 100);
  } catch (error) {
    console.error('显示合约详情失败:', error);
    alert('显示合约详情失败：' + error.message);
  }
}

// 渲染品种升贴水图表 (品种选择页面) - 增加错误处理和回退机制
function renderPremiumChart(variety, contracts) {
  const chartWrapper = document.getElementById('premium-chart-wrapper');
  
  if (!chartWrapper) {
    console.error('找不到图表容器');
    return;
  }
  
  // 确保容器中只有一个图表元素
  chartWrapper.innerHTML = '<div id="premium-chart" style="width: 100%; height: 100%;"></div>';
  const chartContainer = document.getElementById('premium-chart');
  
  // 确保ECharts已加载
  if (typeof echarts === 'undefined') {
    chartContainer.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#ff7675;">ECharts未加载</div>';
    return;
  }
  
  // 确保有合约数据
  if (!contracts || contracts.length === 0) {
    chartContainer.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#666;">无合约数据</div>';
    return;
  }
  
  // 确保至少有价格数据的合约
  const validContracts = contracts.filter(c => c.price && !isNaN(parseFloat(c.price)));
  if (validContracts.length === 0) {
    chartContainer.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#666;">无有效价格数据</div>';
    return;
  }
  
  try {
    // 按合约月份排序
    validContracts.sort((a, b) => {
      const monthA = a.code.match(/\d+/) ? a.code.match(/\d+/)[0] : '';
      const monthB = b.code.match(/\d+/) ? b.code.match(/\d+/)[0] : '';
      return monthA.localeCompare(monthB);
    });
    
    // 获取合约月份和价格
    const months = validContracts.map(c => {
      // 提取合约月份，例如从 "沪铜2310" 中提取 "2310"
      const match = c.code.match(/\d+/);
      return match ? match[0] : c.code;
    });
    
    const prices = validContracts.map(c => parseFloat(c.price) || 0);
    
    // 计算升贴水（相对于第一个合约）
    const basePrice = parseFloat(validContracts[0].price);
    const premium = prices.map(price => ((price - basePrice) / basePrice * 100).toFixed(2));
    
    // 生成柱状图颜色
    const colors = premium.map((p, idx) => {
      // 当前合约为橙色
      if (idx === 0) return '#f8cda6';
      // 升水为红色，贴水为绿色
      return parseFloat(p) >= 0 ? '#ff7675' : '#55efc4';
    });
    
    // 安全地销毁旧图表
    if (premiumChart) {
      try {
        premiumChart.dispose();
      } catch (e) {
        console.warn('销毁旧图表实例失败:', e);
      }
      premiumChart = null;
    }
    
    // 创建新图表
    premiumChart = echarts.init(chartContainer);
    
    // 设置图表选项
    const option = {
      title: {
        text: `${variety}合约升贴水结构`,
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          const idx = params[0].dataIndex;
          return `${validContracts[idx].code}<br/>价格: ${validContracts[idx].price}<br/>升贴水: ${premium[idx]}%`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: {
          interval: 0,
          fontSize: 11,
          color: '#666'
        }
      },
      yAxis: {
        type: 'value',
        name: '升贴水(%)',
        nameTextStyle: {
          fontSize: 12,
          color: '#666'
        },
        axisLabel: {
          formatter: '{value}%',
          fontSize: 11,
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            color: '#eee'
          }
        }
      },
      series: [
        {
          name: '升贴水',
          type: 'bar',
          barWidth: '60%',
          data: premium.map((value, idx) => {
            return {
              value: value,
              itemStyle: {
                color: colors[idx]
              }
            };
          }),
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            fontSize: 10,
            color: '#666'
          }
        }
      ]
    };
    
    // 设置图表
    premiumChart.setOption(option);
    
    // 重新绑定窗口大小变化事件
    const resizeHandler = () => {
      if (premiumChart) {
        try {
          premiumChart.resize();
        } catch (e) {
          console.warn('图表调整大小失败:', e);
        }
      }
    };
    
    window.removeEventListener('resize', resizeHandler);
    window.addEventListener('resize', resizeHandler);
  } catch (error) {
    console.error('渲染升贴水图表失败:', error);
    chartContainer.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#ff7675;">渲染图表失败: ${error.message}</div>`;
  }
}

// 渲染合约详情页的升贴水图表 - 增加错误处理和回退机制
function renderContractPremiumChart(contract) {
  const chartWrapper = document.getElementById('contract-premium-chart-wrapper');
  
  if (!chartWrapper) {
    console.error('找不到合约详情图表容器');
    return;
  }
  
  // 确保容器中只有一个图表元素
  chartWrapper.innerHTML = '<div id="contract-premium-chart" class="contract-chart"></div>';
  const chartContainer = document.getElementById('contract-premium-chart');
  
  // 确保ECharts已加载
  if (typeof echarts === 'undefined') {
    chartContainer.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#ff7675;">ECharts未加载</div>';
    return;
  }
  
  // 获取品种
  const variety = extractVarietyCode(contract.code);
  console.log('当前合约品种:', variety, '合约代码:', contract.code);
  
  // 查找合约数据，先从当前数据中找，再从缓存中找
  let contracts = null;
  let isUsingCache = false;
  
  // 使用保存的合约数据 - 优先使用品种名称，其次使用msgid
  if (contractsData[variety]) {
    contracts = contractsData[variety];
  } else if (contractsData[currentVariety]) {
    contracts = contractsData[currentVariety];
  } else if (lastSuccessfulContractsData[variety]) {
    // 尝试从缓存中获取
    contracts = lastSuccessfulContractsData[variety];
    isUsingCache = true;
  } else if (lastSuccessfulContractsData[currentVariety]) {
    contracts = lastSuccessfulContractsData[currentVariety];
    isUsingCache = true;
  }
  
  // 如果没有找到合约数据，显示错误
  if (!contracts || contracts.length === 0) {
    chartContainer.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#ff7675;">无法获取品种合约数据</div>';
    return;
  }
  
  // 如果使用缓存，显示提示
  if (isUsingCache) {
    createCacheWarning('使用缓存的合约数据', chartContainer);
  }
  
  // 确保至少有价格数据的合约
  const validContracts = contracts.filter(c => c.price && !isNaN(parseFloat(c.price)));
  if (validContracts.length === 0) {
    chartContainer.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#666;">无有效价格数据</div>';
    return;
  }
  
  try {
    // 按合约月份排序
    validContracts.sort((a, b) => {
      const monthA = a.code.match(/\d+/) ? a.code.match(/\d+/)[0] : '';
      const monthB = b.code.match(/\d+/) ? b.code.match(/\d+/)[0] : '';
      return monthA.localeCompare(monthB);
    });
    
    // 获取合约月份和价格
    const months = validContracts.map(c => {
      // 提取合约月份，例如从 "沪铜2310" 中提取 "2310"
      const match = c.code.match(/\d+/);
      return match ? match[0] : c.code;
    });
    
    const prices = validContracts.map(c => parseFloat(c.price) || 0);
    
    // 找出当前合约在列表中的位置
    const basePriceIndex = validContracts.findIndex(c => c.code === contract.code);
    
    const basePrice = parseFloat(contract.price) || (basePriceIndex >= 0 ? parseFloat(validContracts[basePriceIndex].price) : parseFloat(validContracts[0].price));
    
    // 计算升贴水（相对于当前合约）
    const premium = prices.map(price => ((price - basePrice) / basePrice * 100).toFixed(2));
    
    // 生成柱状图颜色
    const colors = premium.map((p, idx) => {
      // 当前合约为橙色
      if ((basePriceIndex >= 0 && idx === basePriceIndex) || 
          (basePriceIndex < 0 && validContracts[idx].code === contract.code)) {
        return '#f8cda6';
      }
      // 升水为红色，贴水为绿色
      return parseFloat(p) >= 0 ? '#ff7675' : '#55efc4';
    });
    
    // 安全地销毁旧图表
    if (contractDetailChart) {
      try {
        contractDetailChart.dispose();
      } catch (e) {
        console.warn('销毁旧合约详情图表实例失败:', e);
      }
      contractDetailChart = null;
    }
    
    // 创建新图表
    contractDetailChart = echarts.init(chartContainer);
    
    // 设置图表选项
    const option = {
      title: {
        text: `${contract.code}升贴水结构`,
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          const idx = params[0].dataIndex;
          return `${validContracts[idx].code}<br/>价格: ${validContracts[idx].price}<br/>升贴水: ${premium[idx]}%`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: {
          interval: 0,
          fontSize: 11,
          color: '#666'
        }
      },
      yAxis: {
        type: 'value',
        name: '升贴水(%)',
        nameTextStyle: {
          fontSize: 12,
          color: '#666'
        },
        axisLabel: {
          formatter: '{value}%',
          fontSize: 11,
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            color: '#eee'
          }
        }
      },
      series: [
        {
          name: '升贴水',
          type: 'bar',
          barWidth: '60%',
          data: premium.map((value, idx) => {
            return {
              value: value,
              itemStyle: {
                color: colors[idx]
              }
            };
          }),
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            fontSize: 10,
            color: '#666'
          }
        }
      ]
    };
    
    // 设置图表
    contractDetailChart.setOption(option);
    
    // 重新绑定窗口大小变化事件
    const resizeHandler = () => {
      if (contractDetailChart) {
        try {
          contractDetailChart.resize();
        } catch (e) {
          console.warn('合约详情图表调整大小失败:', e);
        }
      }
    };
    
    window.removeEventListener('resize', resizeHandler);
    window.addEventListener('resize', resizeHandler);
  } catch (error) {
    console.error('渲染合约详情图表失败:', error);
    chartContainer.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#ff7675;">渲染图表失败: ${error.message}</div>`;
  }
}

// 显示概览
function showOverview() {
  document.getElementById('overview-section').style.display = 'block';
  document.getElementById('contract-selector').style.display = 'none';
  document.getElementById('contract-detail').style.display = 'none';
}