// 加载保存的设置
function loadOptions() {
  chrome.storage.sync.get(['pushDeerKey', 'enablePushDeer'], function(items) {
    document.getElementById('pushDeerKey').value = items.pushDeerKey || '';
    document.getElementById('enablePushDeer').checked = items.enablePushDeer || false;
  });
}

// 保存设置
function saveOptions() {
  const pushDeerKey = document.getElementById('pushDeerKey').value;
  const enablePushDeer = document.getElementById('enablePushDeer').checked;
  
  chrome.storage.sync.set({
    pushDeerKey: pushDeerKey,
    enablePushDeer: enablePushDeer
  }, function() {
    // 更新状态显示
    const status = document.getElementById('status');
    status.textContent = '设置已保存';
    status.className = 'status success';
    
    // 3秒后隐藏状态消息
    setTimeout(function() {
      status.className = 'status';
    }, 3000);
    
    // 输出调试信息
    console.log('设置已保存:', { pushDeerKey, enablePushDeer });
  });
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
  // 加载设置
  loadOptions();
  
  // 绑定保存按钮点击事件
  document.getElementById('saveButton').addEventListener('click', saveOptions);
  
  // 添加调试信息
  console.log('选项页面已加载');
});