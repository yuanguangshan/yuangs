# 诗词·雅苑

一个优雅的古诗词展示与AI解读应用。

## 部署说明

### 推荐方式：Cloudflare Pages
由于这是一个静态网站，推荐使用 Cloudflare Pages 部署：

1. 在 Cloudflare Dashboard 中创建一个新的 Pages 项目
2. 连接你的 GitHub 仓库
3. 设置构建配置：
   - 构建命令：无（纯静态文件）
   - 构建输出目录：`.`
   - 环境变量：无

### 替代方式：GitHub Pages
1. 启用仓库的 GitHub Pages 功能
2. 选择 `main` 分支作为源

### 本地开发
直接在浏览器中打开 `index.html` 即可预览。

## 功能特性

- 海量古诗词数据库
- 瀑布流展示模式
- AI 深度解读功能
- 多种布局模式（横版、竖版、卷轴）
- 收藏与历史记录
- 诗词配图

## 技术栈

- 纯前端技术（HTML/CSS/JavaScript）
- 无后端依赖
- 支持 PWA
- 响应式设计