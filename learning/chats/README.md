您完全正确！我之前的思维陷入了“必须从DOM读取”的模式，而忽略了最直接、最高效的方式。

从 fetchHistoryMessages 拉取到的 messages 数组直接推断用户状态，是目前为止最简单、最优雅、性能最好的方案。

非常感谢您的指正，这确实是最佳实践。让我们来重新实现它。

基于 messages 数组推断的最终方案
这个方案的逻辑是：

维护一个全局的 messages 数组，作为我们所有聊天记录的“单一事实来源”(Single Source of Truth)。
无论是加载历史还是接收新消息，都只是更新这个数组。
任何时候需要更新用户列表，都从这个数组中进行推断，而不是去扫描DOM。
这避免了频繁的DOM查询，性能更高，逻辑也更清晰。

修改步骤
1. 在脚本顶部添加一个全局变量
我们需要一个地方来存储所有的消息。

Generated javascript
// — State Variables —
        let allMessages = []; // 新增：全局消息数组，作为单一事实来源
        let selectedFile = null;
        // ... 其他状态变量
content_copy
download
Use code with caution.
JavaScript
2. 新的核心函数：updateActiveUsersFromMessages()
这个函数将从 allMessages 数组推断状态并更新UI。它将取代所有之前的相关函数。

Generated javascript
/**
         * 最终方案的核心函数：从全局 allMessages 数组推断并更新用户UI。
         */
        function updateActiveUsersFromMessages() {
            logDebug(’开始从 allMessages 数组推断并更新活跃用户...‘, LOG_LEVELS.INFO);

            if (allMessages.length === 0) {
                 // 如果没有消息，清空列表并返回
                 document.getElementById(’user-names‘).innerHTML = ’‘;
                 document.getElementById(’users-menu-list‘).innerHTML = ’‘;
                 document.getElementById(’online-count‘).textContent = ’0‘;
                 document.getElementById(’online-users-display‘).textContent = ’在线: 0‘;
                 document.getElementById(’user-stats-list‘).innerHTML = ’<p style=”color: rgba(255,255,255,0.7); font-size: 0.8em;“>暂无用户活动。</p>‘;
                 return;
            }

            const userLastSeen = new Map();
            const userMessageCount = new Map();

            // 1. 遍历 allMessages 数组，收集数据
            allMessages.forEach(msg => {
                const { username, timestamp } = msg;
                if (username && timestamp) {
                    // 更新最后发言时间
                    if (!userLastSeen.has(username) || timestamp > userLastSeen.get(username)) {
                        userLastSeen.set(username, timestamp);
                    }
                    // 更新发言数
                    userMessageCount.set(username, (userMessageCount.get(username) || 0) + 1);
                }
            });

            // 2. 筛选出活跃用户
            const activeUsernames = Array.from(userLastSeen.keys()).filter(name => 
                isUserActive(userLastSeen.get(name))
            );

            // — 渲染UI (这部分和之前一样，只是数据源变了) —
            const userNamesEl = document.getElementById(’user-names‘);
            const onlineCountEl = document.getElementById(’online-count‘);
            const menuListEl = document.getElementById(’users-menu-list‘);

            userNamesEl.innerHTML = ’‘;
            menuListEl.innerHTML = ’‘;
            activeUsernames.sort(); // 排序以方便显示

            activeUsernames.forEach(name => {
                const safeName = escapeHTML(name);
                userNamesEl.insertAdjacentHTML(’beforeend‘, `<div class=”user-item“>${safeName}</div>`);
                if (name === username) {
                    menuListEl.insertAdjacentHTML(’beforeend‘, `<li>${safeName} (你)</li>`);
                } else {
                    menuListEl.insertAdjacentHTML(’beforeend‘, `<li class=”user-menu-item-with-call“><span>${safeName}</span><button class=”call-btn“ data-username=”${safeName}“>📞</button></li>`);
                }
            });
            
            document.querySelectorAll(’.call-btn‘).forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    startCall(btn.dataset.username);
                    usersMenu.classList.remove(’show‘);
                };
            });

            onlineCountEl.textContent = activeUsernames.length;
            onlineDisplay.textContent = `在线: ${activeUsernames.length}`;

            // — 渲染用户统计 —
            const userStatsListEl = document.getElementById(’user-stats-list‘);
            userStatsListEl.innerHTML = ’‘;
            const allUsers = Array.from(userLastSeen.keys());

            allUsers.sort((a, b) => {
                const aIsActive = activeUsernames.includes(a);
                const bIsActive = activeUsernames.includes(b);
                if (aIsActive !== bIsActive) return bIsActive - aIsActive;
                return (userMessageCount.get(b) || 0) - (userMessageCount.get(a) || 0);
            });

            allUsers.forEach(name => {
                const item = document.createElement(’div‘);
                item.className = ’user-stats-item‘;
                const isActive = activeUsernames.includes(name);
                const lastSeen = userLastSeen.get(name);
                const lastSeenString = lastSeen ? new Date(lastSeen).toLocaleString() : ’未知‘;
                item.innerHTML = `...`; // (此处省略和之前版本相同的HTML模板)
                userStatsListEl.appendChild(item);
            });
        }
content_copy
download
Use code with caution.
JavaScript
(为了简洁，我省略了renderUserStats中重复的HTML模板部分，您可以从之前的代码中复制过来)

3. 修改数据流
现在，让所有操作都围绕 allMessages 数组进行。

修改 fetchHistoryMessages:

Generated javascript
async function fetchHistoryMessages() {
            try {
                logDebug(`开始获取房间 ${roomName} 的历史消息`, LOG_LEVELS.INFO);
                const workerBaseUrl = window.location.origin;
                const response = await fetch(`${workerBaseUrl}/api/messages/history?roomName=${roomName}`);
                if (!response.ok) throw new Error(response.statusText);
                
                const messages = await response.json();
                logDebug(`获取历史消息成功: ${messages.length}条`, LOG_LEVELS.SUCCESS);

                // 1. 用获取到的历史记录完全替换全局数组
                allMessages = messages;

                // 2. 清空并重新渲染所有消息到DOM
                chatWindowEl.innerHTML = ’‘;
                allMessages.forEach(msg => appendChatMessage(msg)); // appendChatMessage现在只负责渲染DOM
                
                // 3. 调用核心函数更新用户UI
                updateActiveUsersFromMessages();
                
                chatWindowEl.scrollTop = chatWindowEl.scrollHeight;
            } catch (error) {
                logDebug(`获取历史消息失败: ${error.message}`, LOG_LEVELS.ERROR);
            }
        }
content_copy
download
Use code with caution.
JavaScript
修改 appendChatMessage:

这个函数现在只负责渲染单条消息到DOM，不再承担任何逻辑。

Generated javascript
function appendChatMessage(msg) {
            // 注意：这个函数现在不更新 allMessages 数组，也不调用更新函数
            // 它只是一个纯粹的UI渲染工具
            const msgEl = document.createElement(’div‘);
            // ... (此处省略所有创建和渲染 msgEl 的代码，和您之前的版本完全一样) ...
            // ... (确保不包含对 updateUser... 函数的任何调用) ...
            let contentHTML = `...`;
            msgEl.innerHTML = contentHTML;
            
            chatWindowEl.appendChild(msgEl);
            chatWindowEl.scrollTop = chatWindowEl.scrollHeight;
        }
content_copy
download
Use code with caution.
JavaScript
修改 onSocketMessage:

当收到新消息时，我们更新 allMessages 数组，重新渲染消息，然后更新用户列表。

Generated javascript
async function onSocketMessage(event) {
            const data = JSON.parse(event.data);
            logDebug(`收到消息: type=${data.type}`, LOG_LEVELS.INFO);
            
            switch (data.type) {
                case ’chat‘: { // 使用块作用域
                    const newMessage = data.payload;
                    logDebug(`收到聊天消息: ${newMessage.username}: ...`, LOG_LEVELS.INFO);
                    
                    // 1. 将新消息添加到全局数组
                    allMessages.push(newMessage);
                    
                    // 2. 将新消息渲染到DOM
                    appendChatMessage(newMessage);
                    
                    // 3. 调用核心函数更新用户UI
                    updateActiveUsersFromMessages();
                    break;
                }
                case ’delete‘: { // 使用块作用域
                    const { id } = data.payload;
                    logDebug(`消息删除: ID=${id}`, LOG_LEVELS.WARNING);

                    // 1. 从全局数组中移除消息
                    allMessages = allMessages.filter(msg => msg.id !== id);
                    
                    // 2. 从DOM中移除消息
                    const msgEl = chatWindowEl.querySelector(`[data-id=”${id}“]`);
                    if (msgEl) msgEl.remove();

                    // 3. 调用核心函数更新用户UI
                    updateActiveUsersFromMessages();
                    break;
                }
                // ... (处理其他 case, 如 offer, answer 等)
            }
        }
content_copy
download
Use code with caution.
JavaScript
修改 onSocketOpen:

Generated javascript
function onSocketOpen() {
            statusEl.textContent = ’已连接‘;
            connectionDot.classList.remove(’disconnected‘);
            reconnectInterval = 1000;
            checkSendButtonState();
            logDebug(’WebSocket连接已建立‘, LOG_LEVELS.SUCCESS);
            
            // 1. 获取历史记录 (这会填充 allMessages 并首次更新UI)
            fetchHistoryMessages();
            
            // 2. 设置定时器，周期性调用核心函数
            if (window.userListInterval) clearInterval(window.userListInterval);
            window.userListInterval = setInterval(updateActiveUsersFromMessages, 15000); // 每15秒检查一次
        }
content_copy
download
Use code with caution.
JavaScript
4. 清理工作
现在您可以安全地删除以下所有不再需要的函数和相关的调用：

fetchUserStats()
setupStatsInterval()
updateUserList()
renderUserStats()
总结
您是对的，这个方案是最优的。它的数据流非常清晰：

Generated code
+————————+      +——————+
| API/。 
WebSocket          |——>|   allMessages    |<——+
| (数据来源)              |      |    (全局数组)     |      |
+————————+      +———+———+      |
                                         |                |
                                         v                |
                        +———————————+  |
                        |   updateActiveUsersFromMessages() |  |
                        +———————————+  |
                                         |                |
                                         v                |
                           +-—————————+   | 定时器
                           |    更新用户列表 & 统计UI     |   | (15s)
                           +-—————————+   |
                                                          |
                                                          |
-———————————————————+
content_copy
download
Use code with caution.
所有UI更新都由 updateActiveUsersFromMessages() 驱动，而这个函数的数据源是唯一的、可控的 allMessages 数组。这样就避免了任何不一致性。

再次感谢您的洞察力，这让最终的方案变得更加完美！
