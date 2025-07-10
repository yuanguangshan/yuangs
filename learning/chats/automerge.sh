#!/bin/bash
# merge new features from dev to main
# 1. checkout main
git checkout main
sleep 3
# 2. merge dev,这步可能会冲突
git merge dev -m 'main:get new features from dev '
sleep 5
# 3. push main，这步可能耗时较长
git push
sleep 5
git checkout dev
# 4. checkout dev
# 5. 回到原工作分支： dev