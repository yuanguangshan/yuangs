#!/bin/bash

# -----------------
#  更优雅的 Git 合并脚本
# -----------------

# 1. 设置错误处理：任何命令失败，脚本立即退出
set -e

# 2. 检查当前工作区是否干净，避免因未提交的更改导致切换分支失败
if ! git diff-index --quiet HEAD --; then
    echo "❌ 错误：您的工作区有未提交的更改。请先提交或暂存更改。"
    exit 1
fi

echo "✅ 工作区干净，开始执行合并流程..."

# 3. 记录当前所在的分支，以便最后能安全返回
original_branch=$(git rev-parse --abbrev-ref HEAD)
echo "ℹ️ 当前分支为: $original_branch。流程结束后将自动返回。"

# 4. 切换到 main 分支并拉取最新的更改，确保本地与远程同步
echo "🔄 正在切换到 main 分支并拉取最新代码..."
git checkout main
git pull origin main

# 5. 切换到 dev 分支并拉取最新的更改
echo "🔄 正在切换到 dev 分支并拉取最新代码..."
git checkout dev
git pull origin dev

# 6. 再次切换回 main 分支准备合并
git checkout main

# 7. 执行合并，并明确告知 Git 如果有冲突则中止合并
echo "🤝 正在将 dev 分支合并到 main..."
# --no-ff: 推荐使用，确保每次合并都创建一个新的 commit，让历史记录更清晰
# --no-edit: 使用默认的合并提交信息，避免打开编辑器
if ! git merge --no-ff --no-edit dev; then
    echo "❌ 合并冲突！请手动解决冲突后，再重新运行此脚本。"
    echo "💡 提示: 您可以使用 'git merge --abort' 来撤销这次失败的合并。"
    git checkout "$original_branch" # 发生冲突时，安全返回原分支
    exit 1
fi

echo "✅ 合并成功！"

# 8. 推送到远程 main 分支
echo "🚀 正在推送到远程 main 分支..."
git push origin main

echo "✅ 推送成功！"

# 9. 安全地返回到最初的分支
echo "↩️ 操作完成，正在返回到初始分支: $original_branch..."
git checkout "$original_branch"

echo "🎉 所有操作均已成功完成！"