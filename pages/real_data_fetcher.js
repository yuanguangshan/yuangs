// 真实数据获取模块
// 整合各个外部API接口，提供统一的数据访问接口

class RealDataFetcher {
    constructor() {
        this.baseURL = 'https://q.889.ink';
        this.washDataURL = 'https://q.want.biz';
        this.ddcURL = 'https://api-ddc-wscn.awtmt.com';
        this.oneURL = 'https://api-one-wscn.awtmt.com';
        
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5分钟缓存
    }

    // 通用请求方法
    async fetch(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'cache-control': 'no-cache',
                    'pragma': 'no-cache',
                    'origin': 'https://i.want.biz',
                    'referer': 'https://i.want.biz/',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    // 带缓存的请求
    async fetchWithCache(key, url, options = {}) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log(`Using cached data for ${key}`);
            return cached.data;
        }

        const data = await this.fetch(url, options);
        if (data) {
            this.cache.set(key, { data, timestamp: Date.now() });
        }
        
        return data;
    }

    // ============ 期货市场数据 ============

    /**
     * 获取期货市场总体概述
     * 主力月份合约数据
     */
    async getMarketOverview() {
        return this.fetchWithCache('market_overview', `${this.baseURL}/`);
    }

    /**
     * 获取期货市场综合指数趋势
     * 衡量市场总体状况
     */
    async getMarketIndexTrend() {
        return this.fetchWithCache('market_index_trend', `${this.baseURL}/f`);
    }

    /**
     * 获取期货市场主力合约
     */
    async getMainContracts() {
        return this.fetchWithCache('main_contracts', `${this.baseURL}/m`);
    }

    /**
     * 获取期货市场涨跌情况
     */
    async getMarketUpDown() {
        return this.fetchWithCache('market_updown', `${this.baseURL}/overview`);
    }

    // ============ 资金流向数据 ============

    /**
     * 获取期货行业资金流向热力图
     * type=0: 行业资金流向
     */
    async getIndustryHeatmap() {
        return this.fetchWithCache('industry_heatmap', `${this.baseURL}/em_heatmap?type=0`);
    }

    /**
     * 获取期货品种资金流向热力图
     * type=1: 品种资金流向
     */
    async getVarietyHeatmap() {
        return this.fetchWithCache('variety_heatmap', `${this.baseURL}/em_heatmap?type=1`);
    }

    // ============ 资讯数据 ============

    /**
     * 获取同花顺新闻
     */
    async getTHSNews() {
        return this.fetchWithCache('ths_news', `${this.baseURL}/thsNews`);
    }

    /**
     * 获取东方财富资讯行情
     * interact: 1, client: wap_sf, biz: wap_stock
     */
    async getEMNews() {
        const url = `${this.baseURL}/em_news?interact=1&client=wap_sf&biz=wap_stock&fcolName=columns&fcolValue=345&type=1,20&order=1&pageIndex=1&pageSize=8`;
        return this.fetchWithCache('em_news', url);
    }

    /**
     * 获取华尔街见闻新闻
     */
    async getWallStreetNews() {
        const url = `${this.oneURL}/apiv1/content/lives?channel=global-channel&accept=live%2Cvip-live&limit=20&cursor=`;
        return this.fetchWithCache('wallstreet_news', url);
    }

    // ============ 龙虎榜数据 ============

    /**
     * 获取品种龙虎榜
     * date: 日期（YYYYMMDD格式）
     * market: 市场代码（113=沪金）
     * contract: 合约代码（au2604）
     */
    async getDragonTigerList(date, market = '113', contract = 'au2604') {
        const url = `${this.baseURL}/lhb/getLongAndShortPosition?date=${date}&market=${market}&contract=${contract}`;
        return this.fetchWithCache(`dragon_tiger_${date}_${market}_${contract}`, url);
    }

    /**
     * 获取品种汇总龙虎榜
     * contract: 品种代码（au）
     */
    async getDragonTigerVarietySummary(date, market = '113', contract = 'au') {
        const url = `${this.baseURL}/lhb/getLongAndShortPosition?date=${date}&market=${market}&contract=${contract}`;
        return this.fetchWithCache(`dragon_tiger_summary_${date}_${market}_${contract}`, url);
    }

    /**
     * 获取前20名持仓汇总情况
     */
    async getTop20Holdings(date, market = '113', contract = 'au2604') {
        const url = `${this.baseURL}/lhb/getAllVloumeAndPriceInfo?date=${date}&market=${market}&contract=${contract}`;
        return this.fetchWithCache(`top20_holdings_${date}_${market}_${contract}`, url);
    }

    /**
     * 获取机构名称列表
     */
    async getOrganizations() {
        return this.fetchWithCache('organizations', `${this.baseURL}/lhb/getChoiceOrg`);
    }

    /**
     * 获取机构各商品盈亏情况
     * companyCode: 机构代码
     */
    async getOrgVarietyProfit(companyCode, startDate, endDate, initFlag = 0) {
        const url = `${this.baseURL}/lhb/getVarietyPayGraphData?startDate=${startDate}&endDate=${endDate}&companyCode=${companyCode}&initFlag=${initFlag}`;
        return this.fetchWithCache(`org_profit_${companyCode}_${startDate}_${endDate}`, url);
    }

    /**
     * 获取品种多空持仓差异对比
     */
    async getVarietyPositionDiff() {
        return this.fetchWithCache('variety_position_diff', `${this.baseURL}/lhb/varietyPosition`);
    }

    /**
     * 获取期货商品盈亏席位分布
     * variety: 品种（au黄金）
     */
    async getCommodityProfit(variety = 'au', startDate, endDate, market = '113', initFlag = 0) {
        const url = `${this.baseURL}/commodity_profit?startDate=${startDate}&endDate=${endDate}&variety=${variety}&market=${market}&initFlag=${initFlag}`;
        return this.fetchWithCache(`commodity_profit_${variety}_${startDate}_${endDate}`, url);
    }

    // ============ 其他数据 ============

    /**
     * 获取期货公司保证金
     */
    async getMargin() {
        return this.fetchWithCache('margin', `${this.baseURL}/margin/`);
    }

    /**
     * 获取仓单数据
     */
    async getWarrantData() {
        return this.fetchWithCache('warrant', `${this.baseURL}/em_warrant`);
    }

    /**
     * 获取期货基差
     */
    async getBasis() {
        return this.fetchWithCache('basis', `${this.baseURL}/thsBasis`);
    }

    /**
     * 获取股票市场投资者情绪指数
     * 50是分界线
     */
    async getEmotionIndex() {
        return this.fetchWithCache('emotion', `${this.washDataURL}/emotion`);
    }

    /**
     * 获取东方财富国际商品行情
     */
    async getInternationalCommodities() {
        const url = `${this.ddcURL}/market/rank?market_type=forexdata&stk_type=commodity&order_by=none&sort_field=px_change_rate&limit=300&fields=prod_name%2Cprod_en_name%2Cprod_code%2Csymbol%2Clast_px%2Cpx_change%2Cpx_change_rate%2Chigh_px%2Clow_px%2Cweek_52_high%2Cweek_52_low%2Cprice_precision%2Cupdate_time`;
        return this.fetchWithCache('international_commodities', url);
    }

    // ============ 批量获取方法 ============

    /**
     * 获取Dashboard首页所有数据
     */
    async getDashboardData() {
        const [
            marketOverview,
            mainContracts,
            industryHeatmap,
            varietyHeatmap,
            thsNews,
            emNews,
            wallStreetNews,
            dragonTiger,
            top20Holdings,
            basis
        ] = await Promise.all([
            this.getMarketOverview(),
            this.getMainContracts(),
            this.getIndustryHeatmap(),
            this.getVarietyHeatmap(),
            this.getTHSNews(),
            this.getEMNews(),
            this.getWallStreetNews(),
            this.getDragonTigerList(this.formatDate(new Date())),
            this.getTop20Holdings(this.formatDate(new Date())),
            this.getBasis()
        ]);

        return {
            marketOverview,
            mainContracts,
            industryHeatmap,
            varietyHeatmap,
            news: {
                ths: thsNews,
                em: emNews,
                wallStreet: wallStreetNews
            },
            dragonTiger: {
                list: dragonTiger,
                top20: top20Holdings
            },
            basis
        };
    }

    /**
     * 获取龙虎榜Tab所有数据
     */
    async getDragonTigerData(date = this.formatDate(new Date())) {
        const [
            dragonTiger,
            varietySummary,
            top20Holdings,
            organizations,
            varietyPositionDiff
        ] = await Promise.all([
            this.getDragonTigerList(date),
            this.getDragonTigerVarietySummary(date),
            this.getTop20Holdings(date),
            this.getOrganizations(),
            this.getVarietyPositionDiff()
        ]);

        return {
            dragonTiger,
            varietySummary,
            top20Holdings,
            organizations,
            varietyPositionDiff
        };
    }

    /**
     * 获取资讯Tab所有数据
     */
    async getNewsData() {
        const [thsNews, emNews, wallStreetNews] = await Promise.all([
            this.getTHSNews(),
            this.getEMNews(),
            this.getWallStreetNews()
        ]);

        return {
            ths: thsNews,
            em: emNews,
            wallStreet: wallStreetNews
        };
    }

    /**
     * 获取技术分析Tab数据
     */
    async getAnalysisData(symbol = 'au2604', startDate, endDate) {
        const [marketIndexTrend, commodityProfit] = await Promise.all([
            this.getMarketIndexTrend(),
            this.getCommodityProfit('au', startDate, endDate)
        ]);

        return {
            marketIndexTrend,
            commodityProfit
        };
    }

    // ============ 工具方法 ============

    /**
     * 格式化日期为YYYYMMDD
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    /**
     * 清除缓存
     */
    clearCache() {
        this.cache.clear();
        console.log('Cache cleared');
    }

    /**
     * 获取缓存统计
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// 导出单例
const realDataFetcher = new RealDataFetcher();

// 如果在Node.js环境，导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = realDataFetcher;
}

// 如果在浏览器环境，挂载到window
if (typeof window !== 'undefined') {
    window.RealDataFetcher = realDataFetcher;
    window.realDataFetcher = realDataFetcher;
}
