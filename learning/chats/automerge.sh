#!/bin/bash
# merge new features from dev to main
# 1. checkout main
git checkout main
sleep 2
# 2. merge dev
git merge dev -m 'main:get new features from dev '
sleep 2
# 3. push main
git push
sleep 2
git checkout dev
# 4. checkout dev
# 5. 回到原工作分支： dev