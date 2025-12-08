#!/bin/bash
# Deployment script for Todo List PWA to Cloudflare Workers

echo "开始部署云端待办事项应用到 Cloudflare Workers..."

# 检查是否已安装 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "错误: 未找到 wrangler。请先安装 wrangler CLI:"
    echo "npm install -g wrangler"
    exit 1
fi

# 检查是否已登录
echo "检查 Cloudflare 登录状态..."
wrangler config 2>/dev/null
if [ $? -ne 0 ]; then
    echo "未登录 Cloudflare，正在启动登录流程..."
    wrangler login
    if [ $? -ne 0 ]; then
        echo "登录失败，请手动执行: wrangler login"
        exit 1
    fi
fi

echo "部署前检查完成！"
echo "请确保在 wrangler.toml 中已配置您的 account_id"
echo "要部署应用，请运行: wrangler deploy"

# 显示部署命令
echo ""
echo "部署命令:"
echo "wrangler deploy"