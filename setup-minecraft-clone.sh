#!/bin/bash

# Minecraft Clone - 自动化安装和设置脚本
# 这个脚本会检查系统、下载必要工具、准备项目

set -e

echo "=========================================="
echo "  Minecraft Clone 安装助手"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 macOS 版本
echo -e "${YELLOW}[1/8] 检查 macOS 版本...${NC}"
macos_version=$(sw_vers -productVersion)
echo "macOS 版本: $macos_version"

major_version=$(echo $macos_version | cut -d. -f1)
if [ "$major_version" -lt 11 ]; then
    echo -e "${RED}错误: 需要 macOS 11.0 或更高版本${NC}"
    exit 1
fi
echo -e "${GREEN}✓ macOS 版本兼容${NC}"
echo ""

# 检查可用磁盘空间
echo -e "${YELLOW}[2/8] 检查磁盘空间...${NC}"
available_space=$(df -BG / | awk '{print $4}' | tr -d ',')
required_space=20000000000  # 20GB

if [ "$available_space" -lt "$required_space" ]; then
    echo -e "${RED}错误: 磁盘空间不足（需要至少 20GB）${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 磁盘空间充足: $((available_space / 1024 / 1024 / 1024)) GB 可用${NC}"
echo ""

# 检查 Xcode Command Line Tools
echo -e "${YELLOW}[3/8] 检查 Xcode 工具...${NC}"
if ! command -v xcode-select &> /dev/null; then
    echo -e "${RED}错误: 需要安装 Xcode Command Line Tools${NC}"
    echo "运行: xcode-select --install"
    exit 1
fi
echo -e "${GREEN}✓ Xcode 工具已安装${NC}"
echo ""

# 检查 Python
echo -e "${YELLOW}[4/8] 检查 Python...${NC}"
if command -v python3 &> /dev/null; then
    python_version=$(python3 --version)
    echo -e "${GREEN}✓ Python 已安装: $python_version${NC}"
else
    echo -e "${YELLOW}⚠ Python 未安装（Unity 需要）${NC}"
fi
echo ""

# 创建项目目录
echo -e "${YELLOW}[5/8] 创建项目目录...${NC}"
PROJECT_ROOT="/Users/ygs/yuangs/minecraft-clone-project"
PROJECT_DIR="$PROJECT_ROOT/MinecraftClone"

if [ -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}⚠ 项目目录已存在${NC}"
else
    mkdir -p "$PROJECT_DIR"
    echo -e "${GREEN}✓ 项目目录创建: $PROJECT_DIR${NC}"
fi
echo ""

# 复制脚本文件
echo -e "${YELLOW}[6/8] 复制代码文件...${NC}"
SOURCE_SCRIPTS="/Users/ygs/yuangs/minecraft-clone/Assets/Scripts"
TARGET_SCRIPTS="$PROJECT_DIR/Assets/Scripts"

mkdir -p "$TARGET_SCRIPTS"
cp -r "$SOURCE_SCRIPTS"/* "$TARGET_SCRIPTS/"

script_count=$(find "$TARGET_SCRIPTS" -name "*.cs" | wc -l)
echo -e "${GREEN}✓ 已复制 $script_count 个 C# 脚本${NC}"
echo ""

# 创建 Unity 项目配置
echo -e "${YELLOW}[7/8] 创建项目配置...${NC}"

# 创建 Packages 目录结构
mkdir -p "$PROJECT_DIR/Packages"

# 创建 ProjectSettings
mkdir -p "$PROJECT_DIR/ProjectSettings"

# 创建基础项目文件
cat > "$PROJECT_DIR/ProjectSettings/ProjectVersion.txt" << 'EOF'
m_EditorVersion: 2023.2.0f1
m_EditorVersionWithRevision: 2023.2.0f1 (8e8d94556210)
EOF

echo -e "${GREEN}✓ 项目配置文件已创建${NC}"
echo ""

# 创建快速启动脚本
echo -e "${YELLOW}[8/8] 创建快速启动脚本...${NC}"
LAUNCH_SCRIPT="$PROJECT_ROOT/launch-unity.sh"

cat > "$LAUNCH_SCRIPT" << 'EOF'
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

EOF

chmod +x "$LAUNCH_SCRIPT"
echo -e "${GREEN}✓ 启动脚本创建: $LAUNCH_SCRIPT${NC}"
echo ""

# 创建快速操作指南
cat > "$PROJECT_ROOT/QUICK_START.md" << 'EOF'
# 🚀 Minecraft Clone 快速启动指南

## ✅ 已完成的自动化步骤

1. ✓ 系统检查通过
2. ✓ 磁盘空间充足
3. ✓ Xcode 工具已安装
4. ✓ 项目目录创建
5. ✓ 所有脚本已复制（16 个 C# 文件）
6. ✓ 项目配置文件已创建
7. ✓ 快速启动脚本已创建

---

## ⚠️ 需要手动完成的步骤

### 第 1 步：安装 Unity Hub（10 分钟）

**下载 Unity Hub:**
1. 打开浏览器，访问：https://unity.com/download
2. 点击 "Download Unity Hub for macOS"
3. 下载 `.dmg` 文件（约 100MB）
4. 打开下载的 `.dmg` 文件
5. 将 Unity Hub 拖到 Applications 文件夹
6. 打开 Unity Hub 应用
7. 创建 Unity 账号（免费）或登录

**安装 Unity 2023 LTS:**
1. 在 Unity Hub 中，点击左侧 "Installs"
2. 点击 "Install Editor" 按钮
3. 在版本列表中找到 "2023 LTS" 或 "2023.2.0f1"
4. 点击齿轮图标，勾选：
   - ✅ Mac Build Support (IL2CPP)
5. 点击 "Install"
6. 等待下载和安装（约 3-5GB，需要 10-20 分钟）

### 第 2 步：打开项目（1 分钟）

1. 打开 Unity Hub
2. 点击 "Projects" 标签
3. 点击 "Add project from disk"
4. 选择文件夹：`/Users/ygs/yuangs/minecraft-clone-project/MinecraftClone`
5. 点击 "Open"
6. Unity 会自动导入项目并打开

### 第 3 步：安装必需包（2 分钟）

在 Unity 编辑器中：
1. 等待 Unity 完成项目导入（右下角显示 "Done"）
2. 点击顶部菜单：`Window > Package Manager`
3. 确认以下包已安装：
   - **TextMeshPro**（默认已安装）
   - 如果没有，点击 "+" 搜索 "TextMeshPro" 并安装

**注意：** Burst 和 Job System 是 Unity 内置的，无需单独安装

### 第 4 步：创建纹理图集（需要美术资源）

**如果你有纹理：**
1. 创建文件夹：`Assets/Textures/`
2. 导入四个纹理图集（建议 256×256 或 512×512）：
   - `AlbedoAtlas.png`（方块基础颜色）
   - `NormalAtlas.png`（法线贴图）
   - `RoughnessAtlas.png`（粗糙度）
   - `MetallicAtlas.png`（金属度）
3. 选择每个纹理，在 Inspector 中：
   - Texture Type: Default
   - Max Size: 256 或 512
   - Generate Mip Maps: ✅
   - Compression: High Quality
4. 点击 Apply

**如果你暂时没有纹理：**
- Unity 会使用默认白色材质
- 游戏仍可运行（只是方块都是白色）
- 后续可以添加纹理

### 第 5 步：创建材质（1 分钟）

1. 创建文件夹：`Assets/Materials/`
2. 右键 > Create > Material
3. 命名为 "VoxelMaterial"
4. 在 Inspector 中设置：
   - Shader: HDRP/Lit
   - Base Map: 拖入 AlbedoAtlas.png
   - Normal Map: 拖入 NormalAtlas.png
   - Smoothness Map: 拖入 RoughnessAtlas.png
   - Metallic Map: 拾入 MetallicAtlas.png
5. 调整参数：
   - Smoothness: 0.5
   - Metallic: 0.0

### 第 6 步：设置场景（5 分钟）

**1. 创建 GameManager:**
- Hierarchy 面板右键 > Create Empty
- 命名为 "GameManager"
- Inspector 中点击 "Add Component"
- 搜索并添加 "GameManager"
- 设置：
  - World Seed: 12345
  - Render Distance: 8
  - Player Prefab: 暂留空（稍后创建）

**2. 创建 ChunkLoader:**
- Hierarchy 右键 > Create Empty
- 命名为 "ChunkLoader"
- 添加 "ChunkLoader" 组件

**3. 创建 FrustumCulling:**
- Hierarchy 右键 > Create Empty
- 命名为 "FrustumCulling"
- 添加 "FrustumCulling" 组件

**4. 创建 MaterialManager:**
- Hierarchy 右键 > Create Empty
- 命名为 "MaterialManager"
- 添加 "MaterialManager" 组件
- 将创建的材质拖入对应字段：
  - Albedo Atlas
  - Normal Atlas
  - Roughness Atlas
  - Metallic Atlas

**5. 创建玩家预制体：**
- Hierarchy 右键 > 3D Object > Capsule（用于玩家）
- 命名为 "Player"
- 添加 "CharacterController" 组件
  - Height: 1.8
  - Radius: 0.3
  - Slope Limit: 45
  - Step Offset: 0.3
- 添加 "PlayerController" 组件
  - Walk Speed: 4.5
  - Sprint Speed: 7.0
  - Jump Force: 5.0
  - Gravity: 20.0
- 添加 "BlockInteraction" 组件
  - Reach Distance: 5.0
  - Selected Block: Stone
- 创建 Camera:
  - 右键 Player > Camera
  - Position: (0, 1.6, 0)
- 保存为 Prefab：
  - 将 Player 从 Hierarchy 拖入 `Assets/Prefabs/` 文件夹
- 在 GameManager 中设置 Player Prefab 字段

**6. 设置 UI:**
- Hierarchy 右键 > UI > Canvas
- 添加 "PlayerHUD" 组件
- Canvas 下创建三个 TextMeshPro - Text:
  - 命名为 "SelectedBlockText"
  - Position: 左上角
  - Text: "Selected: Stone"
  - 拖入 PlayerHUD 的 Selected Block Text 字段
  - 命名为 "FPSText"
  - Position: 左上角，下方
  - Text: "FPS: 60"
  - 拖入 PlayerHUD 的 FPS Text 字段
  - 命名为 "PositionText"
  - Position: 左上角，再下方
  - Text: "Position: 0, 0, 0"
  - 拖入 PlayerHUD 的 Position Text 字段

### 第 7 步：测试运行（1 分钟）

1. 点击 Unity 顶部播放按钮 ▶️
2. 按住鼠标左键锁定光标
3. 使用 WASD 移动
4. 使用鼠标看四周
5. 空格键跳跃
6. 左键点击破坏方块
7. 右键点击放置方块
8. Q/E 键切换方块类型

---

## 🎮 控制说明

| 按键 | 功能 |
|------|--------|
| W | 前进 |
| A | 左移 |
| S | 后退 |
| D | 右移 |
| 空格 | 跳跃 |
| Shift | 加速 |
| 鼠标移动 | 看四周 |
| 鼠标左键 | 破坏方块 |
| 鼠标右键 | 放置方块 |
| Q | 上一个方块 |
| E | 下一个方块 |
| ESC | 释放光标 |

---

## 📦 项目结构

```
MinecraftClone/
├── Assets/
│   ├── Scripts/          ✅ 已自动复制
│   ├── Prefabs/          ⚠️ 需要手动创建
│   ├── Materials/         ⚠️ 需要手动创建
│   ├── Textures/          ⚠️ 需要手动导入
│   └── Scenes/           ⚠️ 需要手动创建
├── ProjectSettings/     ✅ 已自动创建
└── Packages/           ✅ 已自动创建
```

---

## 🔧 常见问题

### Q: Unity 提示 "Script compilation failed"
**A:** 检查 Unity 版本是否为 2023 LTS，确保所有 C# 文件已正确导入

### Q: 运行后看不到任何东西
**A:**
1. 检查是否创建了 Player 预制体
2. 检查是否设置了 GameManager 的 Player Prefab 字段
3. 检查 Camera 是否正确设置

### Q: 帧率很低（< 30 FPS）
**A:**
1. 降低 Render Distance（尝试 4 或 6）
2. 在 Edit > Project Settings > Quality 中降低质量
3. 关闭其他应用程序释放内存

### Q: 如何添加纹理？
**A:**
1. 下载方块纹理包（推荐 16×16 像素风格）
2. 创建纹理图集（将多个方块拼合到一张大图）
3. 导入到 Unity
4. 在 MaterialManager 中设置对应的图集

### Q: 崩溃或出错
**A:**
1. 查看 Console (Window > General > Console) 获取错误信息
2. 发送错误信息给我协助调试

---

## 📞 需要帮助？

如果遇到问题，请提供：
1. 错误截图
2. Console 错误信息
3. Unity 版本
4. macOS 版本

我会立即帮你解决！

---

## 🎯 下一步

项目运行后，可以添加：
- 更多方块类型
- 自定义纹理
- 生物群系
- 生物（怪物）
- 合成系统
- 多人联机

---

**祝你玩得愉快！** 🎮✨
EOF

echo ""
echo -e "${GREEN}=========================================="
echo -e "  ✅ 自动化步骤完成！"
echo -e "==========================================${NC}"
echo ""
echo -e "${YELLOW}下一步操作：${NC}"
echo ""
echo -e "${GREEN}1. 查看快速启动指南:${NC}"
echo "   cat $PROJECT_ROOT/QUICK_START.md"
echo ""
echo -e "${GREEN}2. 安装 Unity Hub（手动操作）：${NC}"
echo "   访问: https://unity.com/download"
echo "   下载并安装 Unity Hub for macOS"
echo ""
echo -e "${GREEN}3. 安装 Unity 2023 LTS（手动操作）：${NC}"
echo "   打开 Unity Hub > Installs > Install Editor > 2023 LTS"
echo ""
echo -e "${GREEN}4. 启动项目：${NC}"
echo "   运行: bash $LAUNCH_SCRIPT"
echo ""
echo ""
echo -e "${YELLOW}⚠️  注意: Unity 安装必须通过 GUI 完成（无法命令行自动化）${NC}"
echo -e "${YELLOW}⚠️  但我已经为你准备好了所有代码和配置文件！${NC}"
echo ""

# 显示快速启动链接
echo "快速访问链接："
echo ""
echo "📖 查看完整指南: file://$PROJECT_ROOT/QUICK_START.md"
echo "🚀 启动项目: file://$PROJECT_ROOT/launch-unity.sh"
echo ""
