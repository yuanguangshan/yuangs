#!/bin/bash

# Unity 项目快速启动脚本
PROJECT_DIR="/Users/ygs/yuangs/minecraft-clone-project/MinecraftClone"

echo "=========================================="
echo "  启动 Unity 项目"
echo "=========================================="
echo ""

# 检查 Unity Hub 是否已安装
if ! command -v unity-hub &> /dev/null; then
    echo "错误: Unity Hub 未安装！"
    echo ""
    echo "请先完成以下步骤："
    echo "1. 打开浏览器访问: https://unity.com/download"
    echo "2. 下载 Unity Hub for macOS"
    echo "3. 安装 Unity Hub"
    echo "4. 打开 Unity Hub"
    echo "5. 点击 'Install Editor'"
    echo "6. 选择 'Unity 2023 LTS' 版本"
    echo "7. 勾选 'Mac Build Support'"
    echo "8. 点击 'Install'"
    echo ""
    echo "安装完成后，重新运行此脚本"
    exit 1
fi

# 启动 Unity 项目
echo "启动 Unity 项目..."
open -a UnityHub "$PROJECT_DIR"

