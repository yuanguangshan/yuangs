我理解您的问题，需要修复以下几个问题：

1. Boss碰到玩家时应该减少玩家一定血量并被弹开，而不是让玩家立即死亡
2. 宝箱和木箱格子出现概率过高，需要调低

让我来修改代码解决这些问题：

```html
<!DOCTYPE html><html lang="zh"><head>
    <!-- 头部内容保持不变 -->
    <style>
        /* CSS 样式保持不变 */
    </style>
</head>
<body>
    <!-- HTML 结构保持不变 -->

    <script>
        // 游戏主要对象
        const game = {
            // 其他属性保持不变...
            
            // 修改网格中宝箱和木箱的生成概率
            generateCellType: function() {
                let cellType = 'normal';
                const rand = Math.random();
                if (rand < 0.03) { // 将宝箱概率从0.1降至0.03
                    cellType = 'treasure';
                } else if (rand < 0.07) { // 将木箱概率从0.2-0.1=0.1降至0.07-0.03=0.04
                    cellType = 'box';
                }
                return cellType;
            },
            
            // 其他属性保持不变...
        };

        // 初始化网格
        function initGrid() {
            game.grid = [];
            
            for (let y = 0; y < game.gridRows; y++) {
                const row = [];
                for (let x = 0; x < game.gridCols; x++) {
                    // 使用新的概率生成函数
                    row.push({
                        type: game.generateCellType(),
                        x: x * game.gridSize,
                        y: y * game.gridSize
                    });
                }
                game.grid.push(row);
            }
        }
        
        // 其他函数保持不变...
        
        // 向上移动网格时添加新行，使用新的概率
        function moveGridUp() {
            const removedRow = game.grid.shift();
            game.removedRows.top.push(removedRow);
            
            // 从底部添加新行
            let newRow;
            if (game.removedRows.bottom.length > 0) {
                newRow = game.removedRows.bottom.pop();
            } else {
                newRow = [];
                for (let x = 0; x < game.gridCols; x++) {
                    newRow.push({
                        type: game.generateCellType(),
                        x: x * game.gridSize,
                        y: (game.gridRows - 1) * game.gridSize
                    });
                }
            }
            
            game.grid.push(newRow);
            
            // 更新所有格子的Y坐标
            for (let y = 0; y < game.grid.length; y++) {
                for (let x = 0; x < game.grid[y].length; x++) {
                    game.grid[y][x].y = y * game.gridSize;
                }
            }
        }
        
        // 向下移动网格时添加新行，使用新的概率
        function moveGridDown() {
            const removedRow = game.grid.pop();
            game.removedRows.bottom.push(removedRow);
            
            // 从顶部添加新行
            let newRow;
            if (game.removedRows.top.length > 0) {
                newRow = game.removedRows.top.pop();
            } else {
                newRow = [];
                for (let x = 0; x < game.gridCols; x++) {
                    newRow.push({
                        type: game.generateCellType(),
                        x: x * game.gridSize,
                        y: 0
                    });
                }
            }
            
            game.grid.unshift(newRow);
            
            // 更新所有格子的Y坐标
            for (let y = 0; y < game.grid.length; y++) {
                for (let x = 0; x < game.grid[y].length; x++) {
                    game.grid[y][x].y = y * game.gridSize;
                }
            }
        }
        
        // 向左移动网格时添加新列，使用新的概率
        function moveGridLeft() {
            // 从每一行移除最左边的格子
            const removedCol = [];
            for (let y = 0; y < game.grid.length; y++) {
                const cell = game.grid[y].shift();
                removedCol.push(cell);
            }
            game.removedCols.left.push(removedCol);
            
            // 在每一行的右边添加新格子
            let newCol;
            if (game.removedCols.right.length > 0) {
                newCol = game.removedCols.right.pop();
                for (let y = 0; y < game.grid.length; y++) {
                    game.grid[y].push(newCol[y]);
                }
            } else {
                for (let y = 0; y < game.grid.length; y++) {
                    game.grid[y].push({
                        type: game.generateCellType(),
                        x: (game.gridCols - 1) * game.gridSize,
                        y: y * game.gridSize
                    });
                }
            }
            
            // 更新所有格子的X坐标
            for (let y = 0; y < game.grid.length; y++) {
                for (let x = 0; x < game.grid[y].length; x++) {
                    game.grid[y][x].x = x * game.gridSize;
                }
            }
        }
        
        // 向右移动网格时添加新列，使用新的概率
        function moveGridRight() {
            // 从每一行移除最右边的格子
            const removedCol = [];
            for (let y = 0; y < game.grid.length; y++) {
                const cell = game.grid[y].pop();
                removedCol.push(cell);
            }
            game.removedCols.right.push(removedCol);
            
            // 在每一行的左边添加新格子
            let newCol;
            if (game.removedCols.left.length > 0) {
                newCol = game.removedCols.left.pop();
                for (let y = 0; y < game.grid.length; y++) {
                    game.grid[y].unshift(newCol[y]);
                }
            } else {
                for (let y = 0; y < game.grid.length; y++) {
                    game.grid[y].unshift({
                        type: game.generateCellType(),
                        x: 0,
                        y: y * game.gridSize
                    });
                }
            }
            
            // 更新所有格子的X坐标
            for (let y = 0; y < game.grid.length; y++) {
                for (let x = 0; x < game.grid[y].length; x++) {
                    game.grid[y][x].x = x * game.gridSize;
                }
            }
        }
        
        // 修复Boss碰到玩家的处理
        function updateBosses(deltaTime) {
            for (let i = game.bosses.length - 1; i >= 0; i--) {
                const boss = game.bosses[i];
                
                // 如果Boss被冻结，跳过移动
                if (boss.frozen.active) {
                    boss.frozen.duration -= deltaTime;
                    if (boss.frozen.duration <= 0) {
                        boss.frozen.active = false;
                    }
                    continue;
                }
                
                // 计算Boss到玩家的方向
                const dx = game.player.x - boss.x;
                const dy = game.player.y - boss.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // 移动Boss
                if (distance > 0) {
                    boss.x += (dx / distance) * boss.speed;
                    boss.y += (dy / distance) * boss.speed;
                }
                
                // 检查Boss是否碰到玩家
                if (distance < boss.radius + game.player.radius) {
                    // 如果玩家有护盾，不受伤害
                    if (!game.player.shield.active) {
                        // 仅减少玩家血量，而不是直接游戏结束
                        game.player.health -= game.difficultySettings.bossDamage;
                        document.getElementById('healthDisplay').textContent = `血量: ${game.player.health}`;
                        
                        // 检查玩家是否死亡 - 只有血量低于或等于0时才结束游戏
                        if (game.player.health <= 0) {
                            alert('游戏结束！');
                            location.reload(); // 重新加载页面以重启游戏
                        }
                    }
                    
                    // Boss被击退更远的距离 (10格)
                    const pushDistance = 10 * game.gridSize;
                    if (distance > 0) {
                        boss.x -= (dx / distance) * pushDistance;
                        boss.y -= (dy / distance) * pushDistance;
                    }
                }
            }
        }
        
        // 其他函数保持不变...
        
        // 启动游戏
        window.onload = initGame;
    </script>
</body></html>
```

主要修改了以下内容：

1. 添加了一个`generateCellType()`函数来控制宝箱和木箱的生成概率：
   - 宝箱概率从10%降至3%
   - 木箱概率从10%降至4%

2. 在所有生成新网格单元的地方（初始化和四个方向移动）都使用了新的概率函数

3. 修复了Boss碰到玩家的处理逻辑：
   - 玩家只减少设定的血量（通过`game.difficultySettings.bossDamage`，默认为2）
   - 只有当玩家血量低于或等于0时才会结束游戏
   - Boss被击退的距离增加到10格（`10 * game.gridSize`）

这些修改应该能解决您提到的问题，让游戏体验更加平衡和符合预期。