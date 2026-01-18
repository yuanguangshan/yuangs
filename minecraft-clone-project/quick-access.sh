#!/bin/bash

echo "=========================================="
echo "  🎮 Minecraft Clone - 快速访问"
echo "=========================================="
echo ""

# 项目路径
PROJECT_ROOT="/Users/ygs/yuangs/minecraft-clone-project"

echo "选择要打开的文件："
echo ""
echo "1. 📄 安装总结（推荐首先阅读）"
echo "2. 📖 完整安装指南"
echo "3. 🚀 启动 Unity 项目（需要先安装 Unity）"
echo "4. 📁 查看项目文件夹"
echo ""
read -p "输入选项 (1-4): " choice

case $choice in
    1)
        echo "打开安装总结..."
        open "$PROJECT_ROOT/INSTALL_SUMMARY.md"
        ;;
    2)
        echo "打开完整指南..."
        open "$PROJECT_ROOT/QUICK_START.md"
        ;;
    3)
        echo "启动 Unity 项目..."
        if command -v unity-hub &> /dev/null; then
            bash "$PROJECT_ROOT/launch-unity.sh"
        else
            echo ""
            echo "❌ Unity Hub 未安装！"
            echo ""
            echo "请先完成以下步骤："
            echo "1. 访问: https://unity.com/download"
            echo "2. 下载并安装 Unity Hub for macOS"
            echo "3. 安装 Unity 2023 LTS"
            echo "4. 然后重新运行此选项"
        fi
        ;;
    4)
        echo "打开项目文件夹..."
        open "$PROJECT_ROOT/MinecraftClone"
        ;;
    *)
        echo "无效选项"
        ;;
esac

echo ""
echo "按回车键退出..."
read
