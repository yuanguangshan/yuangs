# 期货交易系统中品种、合约与市场的对应关系

## 基本概念

在期货交易系统中，存在三个核心概念的层级关系：

1. **市场/交易所(Market/Exchange)**：如上海期货交易所(SHFE)、大连商品交易所(DCE)等
2. **品种(Variety/Product)**：如沪铜(cu)、螺纹钢(rb)等
3. **合约(Contract)**：如rb2505、ag2401等，通常是品种代码加上到期月份

## 数据结构

### 市场/交易所

市场数据结构包含以下关键字段：
- `mktid`: 市场ID，如113(上海期货交易所)
- `mktname`: 市场名称，如"上海期货交易所"
- `mktshort`: 市场简称，如"SHFE"

### 品种

品种数据结构包含以下关键字段：
- `vcode`: 品种代码，如"cu"(沪铜)
- `vname`: 品种名称，如"沪铜"
- `vtype`: 品种类型ID
- `mktid`: 所属市场ID

### 合约

合约数据结构包含以下关键字段：
- `code`: 合约代码，如"ag2401"
- `name`: 合约名称，如"沪银2401"
- `vcode`: 所属品种代码
- `mktid`: 所属市场ID

## 页面间参数传递规范

为了统一页面间的参数传递，建议采用以下规范：

### 1. future.html (期货市场概览)

**接收参数**：
- `variety`: 品种代码，如 "rb"、"ag"

**传出参数**：
- 点击品种时，跳转到 longshort.html 时传递 `variety` 参数

### 2. longshort.html (期货品种龙虎榜)

**接收参数**：
- `variety`: 品种代码，如 "rb"、"ag"
- `contract`: 合约名称，如 "螺纹钢"、"沪银"
- `dm`: 合约代码，如 "rb2505"、"ag2401"
- `sc`: 市场代码

**传出参数**：
- 点击机构名称时，跳转到 companyholding.html 时传递 `company` 和 `code`(品种代码) 参数

### 3. companyholding.html (机构持仓盈亏一览)

**接收参数**：
- `company`: 机构名称
- `code`: 品种代码

**传出参数**：
- 点击品种名称时，跳转到 future.html 时传递 `variety` 参数
- 点击净仓时，跳转到 longshort.html 时传递 `variety` 参数

## 参数映射关系

为确保页面间参数传递的一致性，建议使用以下映射关系：

1. 从 future.html 到 longshort.html：
   ```
   longshort.html?variety={vcode}
   ```

2. 从 longshort.html 到 companyholding.html：
   ```
   companyholding.html?company={companyName}&code={vcode}
   ```

3. 从 companyholding.html 到 future.html：
   ```
   future.html?variety={variety}
   ```

4. 从 companyholding.html 到 longshort.html：
   ```
   longshort.html?variety={variety}
   ```

## 交易所与市场ID对应关系

| 市场简称 | 市场ID | 市场名称 |
|---------|-------|--------|
| SHFE    | 113   | 上海期货交易所 |
| DCE     | 114   | 大连商品交易所 |
| CZCE    | 115   | 郑州商品交易所 |
| INE     | 142   | 上海国际能源交易中心 |
| CFFEX   | 220   | 中金所 |
| GFEX    | 225   | 广期所 |

## 注意事项

1. 品种代码(vcode)与合约代码(code)的区别：
   - 品种代码如 "rb"、"ag"
   - 合约代码如 "rb2505"、"ag2401"

2. 在页面间传递参数时，应优先使用品种代码(vcode)作为通用标识符

3. 当需要指定具体合约时，可使用合约代码(code)和市场代码(mktid或sc)的组合

4. 为提高兼容性，建议在接收参数时同时支持多种参数形式，但在传出参数时统一使用规范形式