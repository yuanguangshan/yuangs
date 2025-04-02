# 龙虎榜代码详细分析

我将逐行分析这段期货龙虎榜相关代码的作用和功能：

## 初始化定义部分

```javascript
// 滑动图片
var sliderIconHref = 'https://qhrs.eastmoney.com/static/images/longhubang/slider.png';
// var sliderIconHref = 'http://10.228.131.110:8081/static/images/longhubang/slider.png';
```
定义图表滑动条上使用的图标路径，注释掉的是开发环境的路径。

```javascript
var marketList = [
    { market: 113, name: '上期所' },
    { market: 114, name: '大商所' },
    { market: 115, name: '郑商所' },
    { market: 225, name: '广期所' },
    { market: 142, name: '上期能源' },
    { market: 220, name: '中金所' }
];
```
定义各个期货交易所的市场ID和名称，用于请求各交易所数据。

```javascript
// 接口名称
var apisList = ['getMarketMaxDate', 'getAllPositionInfo', /* 更多API名称... */];
```
定义系统需要使用的API端点名称列表。

## API构建函数

```javascript
// apisData函数构建完整的API URL
var apisData = function () {
    var obj = {};
    apisList.forEach(function (item) {
        obj[item] = apis.lhbUrl + 'marketFutuWeb/dragonAndTigerInfo/' + item;
    });
    return obj;
}
```
将API名称列表转换为完整的URL路径对象，便于后续调用。

## 龙虎榜数据对象

```javascript
var lhbData = {
    // 记录合约展开收起的本地存储键
    cacheKey: 'lhb_stockExpand',
    dateCacheKey: 'lhb_uptDate',
    apis: apisData(),
    // 多空持仓图y轴文字
    chartTxt: [/* 图表文字配置 */],
    // 表格列表配置
    tableColumns: [/* 表头配置数组 */],
    
    // 获取对应的表格列表
    getTableColumns: function (name) {
      var nameList = ['dkcc', 'zc', 'jc', 'jcc', 'cjl'];
      var index = nameList.indexOf(name);
      return lhbData.tableColumns[index === -1 ? 0 : index];
    },
```
定义了龙虎榜数据对象，包含缓存键名、API列表、图表文字配置、表格列配置等，并提供获取表格列表的方法。

```javascript
    // 表格数据字段列表配置
    tableFieldList: [
        // 多空持仓，增仓，减仓
        [{val: 'longNum', zj: 'longChange'}, {val: 'shortNum', zj: 'shortChange'}],
        // 净持仓
        [{val: 'netLong', zj: 'netLongChange'}, {val: 'netShort', zj: 'netShortChange'}],
        // 成交量
        [{val: 'vloume', zj: 'vloumeChange'}, {val: 'vloume', zj: 'vloumeChange'}]
    ],
```
定义表格数据字段配置，根据不同类型(多空持仓/净持仓/成交量)使用不同的字段名。

```javascript
    // 表格合计行配置
    tableTotalList: [
        {
            name: '本日合计',
            list: [/* 本日合计字段配置 */]
        }, 
        {
            name: '上日合计',
            list: [/* 上日合计字段配置 */]
        }, 
        {
            name: '总量增减',
            list: [/* 总量增减字段配置 */]
        }
    ],
```
定义表格底部合计行的配置信息。

```javascript
    // 无数据提示文字生成函数
    nodataTip: function (date, time) {
        if (!date) return '交易所未公布数据';
        if (date === 'noData')  {
            return '该' + (time ? '合约' : '品种') + '没有龙虎榜数据';
        };
        if (date === 'empty') return '当日无数据';
        return !time ? date : date.replace(/(\d*)-(\d*)-(\d*)/g, '$1年$2月$3日') + '无数据<br/>' + time.replace(/(\d*)-(\d*)-(\d*)/g, '$1年$2月$3日') + '加载中……';
    },
```
根据不同情况生成无数据提示文本。

```javascript
    // 计算开始日期(前两年1月1日)
    getStartDate: function () {
        var startYear = new Date().getFullYear() - 2;
        return startYear + '-01-01';
    },
```
计算日期选择器的开始日期(默认为前两年)。

```javascript
    // 日期选择器配置
    pickerOptions: {
        // 禁用未来日期和两年前的日期
        disabledDate: function (time) {
            var startYear = lhbData.getStartDate().replace(/\-/g, '/');
            return time.getTime() > Date.now() || time.getTime() < new Date(startYear).getTime();
        },
        // 周末日期添加特殊类名
        cellClassName: function (Date) {
            if (Date.getDay() === 0 || Date.getDay() === 6) {
                return 'weekend';
            }
        }
    },
```
配置日期选择器，包括禁用日期范围和周末样式。

## 数据处理函数

```javascript
    // 处理交易所日期数据
    marketDateSuccess: function (res) {
        // 处理从API返回的市场日期数据
        var data = res.data.data;
        var list = [];
        if (data.length === 0) return list;
        
        // 匹配市场ID并格式化日期
        marketList.forEach(function (item) {
            data.forEach(function (n) {
                if (n.market - 0 !== item.market) return;
                var tradeDay = n.tradeDay;
                list.push(Object.assign({}, item, n, {
                  tradeDay: tradeDay !== '-' ? '-' + tradeDay.substr(4,2) + '月' + tradeDay.substr(6,2) + '日' : '暂无数据'
                }));
            });
        });
        return list;
    },
```
处理从API返回的市场日期数据，格式化交易日期并关联市场信息。

```javascript
    // 多空持仓图表数据处理
    chartDataSuccess: function (data, idx) {
        // 成交量标志
        var cjlFlg = idx === 4;
        // 根据不同类型(多空持仓/净持仓/成交量)选择不同数据源
        var list1 = data.longNums || data.clears;
        var list2 = data.shortNums || data.top20Vloumes;
        var list3 = data.longShortRate || data.totalVloumes;
        
        // 净持仓数据处理
        if (idx === 3) {
            var list1 = data.netLongs;
            var list2 = data.netShorts;
            var list3 = data.netLongShortRate;
        }
        
        // 计算一年前日期，用于设置图表默认显示范围
        var arr = lhbData.dateFmt().split('-');
        arr[0] = arr[0] - 1;
        var lastYearDate = arr.join('');
        var flg = true;
        var startValue = 0;
        var list = [];
        
        // 格式化数据并找出一年前的位置作为默认起始点
        data.dates.forEach(function (date, idx) {
            var value1 = list1[idx];
            var value2 = list2[idx];
            var value3 = list3[idx];
            
            // 初始化值，处理null为'-'
            value1 = value1 === null ? '-' : value1;
            value2 = value2 === null ? '-' : value2;
            value3 = value3 === null ? '-' : value3;
            if (value1 === '-' && value2 === '-' && value3 === '-') return;
            
            // 添加到数据列表
            list.push({date: date, longNum: value1, shortNum: value2, rate: value3});
            
            // 计算应该从哪个位置开始显示(默认显示一年数据)
            if (flg && lastYearDate <= date.replace(/\-/g, '')) {
                startValue = idx;
                flg = false;
            }
        });
        
        // 成交量图表默认只显示近30天
        if (cjlFlg) {
            startValue = list.length - 30;
        }
        
        // 返回格式化后的数据和图表显示范围
        return {
            list: list,
            startValue: startValue > 0 ? startValue : 0,
            endValue: list.length - 1
        }
    },
```
处理图表数据，根据不同类型准备不同的数据源，并计算默认显示范围。

```javascript
    // 表格数据处理
    tableDataSuccess: function (data, idx, codeFlg) {
        var index = idx === 3 ? 1 : idx === 4 ? 2 : 0;
        // 获取数据列表(多头/空头/净多/净空/成交量)
        var longInfoList = (data.longInfoList || data.netLongInfoList || data.vloumeInfoList || []).slice(0, codeFlg ? 20 : 1000);
        var shortInfoList = (data.shortInfoList || data.netShortInfoList || data.vloumeInfoList || []).slice(0, codeFlg ? 20 : 1000);
        
        // 准备合计列表
        var longTotalList = [];
        var shortTotalList = [];
        var accMul = utils.accMul;
        
        // 获取当前需要的字段配置
        var fieldList = lhbData.tableFieldList[index];
        var emptyObj = {num: '--', name: '--', val: '--', zj: '--'};
        
        // 格式化数据，计算增减
        longInfoList = lhbData.dataFmt(longInfoList, fieldList[0].val, fieldList[0].zj, idx);
        shortInfoList = lhbData.dataFmt(shortInfoList, fieldList[1].val, fieldList[1].zj, idx);
        
        // 无数据时添加空数据
        longInfoList.length === 0 && longInfoList.push(emptyObj);
        shortInfoList.length === 0 && shortInfoList.push(emptyObj);
        
        // 复制数据用于图表
        var ddlList = longInfoList.slice(0);
        var kdlList = shortInfoList.slice(0);
        
        // 处理空数据情况
        var filterFun = function (list) {
            list.forEach(function (item) {
                var name = item.name;
                item.chartName = name === '--' ? '' : name;
            });
            return list;
        }
        ddlList.length === 1 && filterFun(ddlList);
        kdlList.length === 1 && filterFun(kdlList);
        
        // 生成合计行数据
        lhbData.tableTotalList.forEach(function (item, itemIdx) {
            // 合计行基础对象
            var obj = {num: '', name: item.name, hoverCls: '', cls: 'total total' + itemIdx, totalFlg: true};
            var fieldList = item.list[index];
            
            // 获取数据值
            var longVal = data[fieldList[0].val];
            var longZj = data[fieldList[0].zj];
            var shortVal = data[fieldList[1].val];
            var shortZj = data[fieldList[1].zj];
            
            // 添加多头合计
            longTotalList.push(Object.assign({}, obj, {
                val: fieldList[0].val ? typeof longVal === 'undefined' || longVal === '-' ? '--' : longVal : '',
                zj: fieldList[0].zj ? typeof longZj === 'undefined' || longZj === '-' ? '--' : longZj : ''
            }));
            
            // 添加空头合计
            shortTotalList.push(Object.assign({}, obj, {
                val: fieldList[1].val ? typeof shortVal === 'undefined' || shortVal === '-' ? '--' : shortVal : '',
                zj: fieldList[1].zj ? typeof shortZj === 'undefined' || shortZj === '-' ? '--' : shortZj : ''
            }));
        });
        
        // 返回格式化后的表格数据和统计数据
        return {
            ddlList: ddlList, // 多头列表(用于图表)
            kdlList: kdlList, // 空头列表(用于图表)
            tableList: [{
                list: longInfoList, // 多头列表(用于表格)
                listLen: longInfoList.length,
                totalList: longTotalList, // 多头合计
                top1Name: longInfoList[0].name, // 第一名名称
                top1Rate: accMul(data.top1LongPositionRate || data.top1VloumeRate || '', 100), // 第一名占比
                top20Rate: accMul(data.top20LongPositionRate || data.top20VloumeRate || '', 100) // 前20名占比
            }, {
                list: shortInfoList, // 空头列表
                listLen: shortInfoList.length,
                totalList: shortTotalList, // 空头合计
                top1Name: shortInfoList[0].name, // 第一名名称
                top1Rate: accMul(data.top1ShortPositionRate || '', 100), // 第一名占比
                top20Rate: accMul(data.top20ShortPositionRate || '', 100) // 前20名占比
            }]
        }
    },
```
处理表格数据，生成多头、空头列表和合计信息，计算排名占比等。

```javascript
    // 数据格式化核心函数
    dataFmt: function (list, key1, key2, idx) {
        // 判断是否是净持仓模式
        var jccFlg = idx === 3;
        
        // 获取增减前三名的机构名称
        var rgs = lhbData.sortFun(list, key2);
        var maxBottom = 0;
        
        // 循环处理每条数据
        list.forEach(function (item, itemIdx) {
            var name = item.futureCompanyName;
            var val = item[key1]; // 持仓量
            var zj = item[key2];  // 变化量
            var zjAbs = Math.abs(zj); // 变化绝对值
            
            // 判断净持仓是否"多转空"或"空转多"
            // 多转空条件：净持仓模式 + 变化为正 + 变化值大于持仓值
            var transferFlg = jccFlg && zj > 0 && zj > val;
            
            // 扩充数据对象
            Object.assign(item, {
                num: itemIdx + 1, // 排名
                name: name, // 机构名称
                chartName: name, // 图表显示名称
                val: val, // 持仓值
                zj: zj, // 变化值
                zjAbs: !transferFlg ? zjAbs : '-', // 变化绝对值(多转空时不显示)
                
                // 增减到0轴的间距(用于图表绘制)
                gap: zj < 0 ? val : utils.accSub(val, zjAbs),
                
                // 净持仓多转空/空转多标志
                transferFlg: transferFlg,
                transferVal: transferFlg ? zj : '-',
                
                // 增减-多空头(计算转换部分)
                negaVal: transferFlg ? utils.accSub(zj, val) : 0,
                
                // 增减显示颜色类名
                cls: idx !== 1 && idx !== 2 ? rgs[0].indexOf(name) !== -1 ? 'r' : rgs[1].indexOf(name) !== -1 ? 'g' : '' : '',
                hoverCls: '',
                starFlg: item.singleSideFlag - 0 // 单边标记
            });
        });
        
        // 净持仓模式下的特殊处理
        if (jccFlg && list.length !== 0) {
            var tempList = list.slice(0);
            
            // 找出所有多转空情况中的最大negaVal值
            var maxNegaVal = tempList.sort(function (a, b) {
                return b.negaVal - a.negaVal;
            })[0].negaVal;
            
            // 再次循环处理每条数据，计算图表绘制所需的位置信息
            list.forEach(function (item) {
                var transferFlg = item.transferFlg;
                var jccGap = !transferFlg ? utils.accAdd(maxNegaVal, item.gap) : '-';
                
                Object.assign(item, {
                    // 多/空头柱子到0轴的间距
                    bottom: maxNegaVal,
                    
                    // 多转空/空转多到0轴的间距
                    negaGap: utils.accSub(maxNegaVal, item.negaVal),
                    
                    // 增减到0轴的间距
                    jccGap: jccGap,
                    
                    // 所有柱子的总长度
                    total: !transferFlg ? utils.accAdd(jccGap, item.zjAbs) : utils.accAdd(maxNegaVal, item.val)
                })
            });
        }
        
        return list;
    },
```
数据格式化的核心函数，处理持仓数据并计算图表绘制所需的各种值，特别处理了净持仓中的"多转空"情况。

```javascript
    // 日期格式化
    dateFmt: function (date) {
        var dateFmt = '';
        if (!date) dateFmt = new Date();
        if (typeof date === 'object') dateFmt = date;
        if (typeof date === 'string') {
            if (date.indexOf('-') !== -1) date = date.replace(/\-/g, '/');
            dateFmt = new Date(date);
        }
        var fmtNum = function (num) {
            return num > 9 ? num : '0' + num;
        }
        return fmtNum(dateFmt.getFullYear()) + '-' + fmtNum(dateFmt.getMonth() + 1) + '-' + fmtNum(dateFmt.getDate());
    },
```
将各种格式的日期转换为标准的YYYY-MM-DD格式。

```javascript
    // 排序，判断增减前三名
    sortFun: function (list, key) {
        var rs = []; // 增加前三名
        var gs = []; // 减少前三名
        var tempList = list.slice(0);
        
        // 根据变化值排序
        tempList.sort(function (a, b) {
            return b[key] - a[key];
        }).forEach(function (item, idx) {
            var val = item[key];
            var name = item.futureCompanyName;
            
            // 获取增加前三和减少前三的机构名称
            idx < 3 && val > 0 ? rs.push(name) : idx > tempList.length - 4 && val < 0 ? gs.push(name) : '';
        });
        
        return [rs, gs]; // 返回增加前三和减少前三的机构名称数组
    },
```
排序函数，找出持仓变化增加前三名和减少前三名的机构。

```javascript
    // 图表缩放参数配置
    dataZoomConf: {
        // 各种图表缩放条样式配置
        type: 'slider',
        showDetail: true,
        show: false,
        // ... 更多样式配置
    },
```
图表缩放条的样式配置。

```javascript
    // 设置横坐标间隔
    setInterval: function (chart, startValue, endValue, pzjccFlg) {
        // 获取图表当前配置
        var chartObj = chart && chart.getModel() ? chart.getModel().option : {}
        var valueObj = chartObj.dataZoom ? chartObj.dataZoom[0] : {}
        var series = chartObj.series || []
        
        // 获取当前展示范围
        var startValue = valueObj.startValue || startValue;
        var endValue = valueObj.endValue || endValue;
        if (typeof startValue === 'undefined' || typeof endValue === 'undefined') return;
        var onlyFlg = startValue === endValue;
        
        // 计算展示范围长度和间隔
        var length = endValue - startValue + 1;
        var interval = (length/(length > 25 ? 6 : length > 15 ? 4 : 2)).toFixed(2);
        
        var arr = [], list = [], seriesFmt = [];
        
        // 根据日期点数量决定显示策略
        for (var i = 0; i <= series.length; i++) {
            seriesFmt.push({ showSymbol: onlyFlg });
        }
        
        // 计算需要显示的横坐标点
        for (var i = 0; i <= 6; i++) {
            arr.push(Number((interval * i).toFixed()) + startValue);
        }
        for (var i = startValue; i <= endValue; i++) {
            if (i === startValue || i === endValue || arr.indexOf(i) !== -1) {
                list.push(i);
            }
        }
        
        // 设置横坐标刻度间隔显示
        var xAxisObj = {
            axisLabel: {
                interval: function (index) {
                    return list.indexOf(index) !== -1;
                },
            }
        }
        
        // 应用到图表
        chart.setOption({
            xAxis: !pzjccFlg ? xAxisObj : [xAxisObj, xAxisObj, xAxisObj],
            series: seriesFmt
        })
    },
```
动态计算图表横坐标的显示间隔，根据当前显示范围内的数据点数量决定显示哪些刻度。

```javascript
    // 多空持仓图表配置
    initDkccChart: function (list, startValue, endValue, nameObj, idx, codeFlg) {
        // 生成多空持仓/净持仓/成交量图表的ECharts配置对象
        // ... 图表配置代码
    },
```
生成多空持仓、净持仓、成交量图表的ECharts配置。

```javascript
    // 多头/空头持仓排名图表配置
    initLongShortChart: function (list, longFlg, cjlFlg) {
        // 生成多头排名和空头排名图表的ECharts配置对象
        // ... 图表配置代码
    },
```
生成多头排名和空头排名图表的ECharts配置。

```javascript
    // 日期切换函数
    dateBtnClick: function (date, idx) {
        // 根据交易日历，获取前一天/后一天的交易日期
        // ... 日期切换逻辑
    },
```
实现前一天/后一天按钮的功能，根据交易日历获取相邻的交易日。

```javascript
    // 机构名称格式化(未使用)
    nameFmt: function (name) {
        return name || '';
    },
```
机构名称格式化函数，但代码已被注释，仅返回原名称。

```javascript
    // 跳转到H5页面
    jumpHref: function (tabIdx, subTabIdx, type) {
        // 检测是否为移动端，如果是则跳转到H5页面
        // ... 跳转逻辑
    }
```
检测是否为移动端环境，如果是则跳转到相应的H5页面。

## 总结

这段代码是期货龙虎榜系统的核心JavaScript逻辑，主要功能包括：

1. 从各期货交易所获取持仓数据
2. 处理和格式化各类持仓数据(多空持仓、净持仓、成交量)
3. 生成多种图表配置(持仓趋势图、排名图)
4. 实现特殊情况如"多转空"的判断和处理
5. 计算各种统计值(占比、增减排名等)

特别值得注意的是"多转空"的判断逻辑：在净持仓模式下，如果机构的净持仓变化值为正且大于当前净持仓值，表示该机构从净多头转为净空头。代码中使用了精确的位置计算使这种转变在图表中能够正确直观地显示出来。