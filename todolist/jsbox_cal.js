/*
  JSBox 脚本：从URL获取ICS并写入系统日历
  功能：定期获取ICS文件内容，解析事件，直接写入日历
*/

function main() {
  $ui.menu({
    items: ["从URL获取并解析", "从文件导入 (.ics)", "从剪贴板导入"],
    handler: function(title, idx) {
      if (idx === 0) {
        fetchAndParseICS();
      } else if (idx === 1) {
        pickFile();
      } else {
        parseAndImport($clipboard.text);
      }
    }
  });
}

function fetchAndParseICS() {
  // 使用你的端点URL
  let icsUrl = "https://todo.want.biz/event";
  
  $ui.loading("正在获取ICS数据...");
  
  $http.get({
    url: icsUrl,
    timeout: 30,
    handler: function(resp) {
      $ui.loading(false);
      if (resp.error) {
        $ui.error("获取ICS数据失败: " + resp.error.localizedDescription);
        return;
      }
      
      let icsContent = resp.data;
      if (icsContent && icsContent.includes("BEGIN:VCALENDAR")) {
        parseAndImport(icsContent);
      } else {
        $ui.error("获取的ICS内容无效");
      }
    }
  });
}

function pickFile() {
  $drive.open({
    types: ["public.item"], // 允许选择所有类型，避免过滤掉 .ics
    handler: function(data) {
      if (data) {
        let content = data.string;
        if (content) {
          parseAndImport(content);
        } else {
          $ui.error("无法读取文件内容");
        }
      }
    }
  });
}

function parseAndImport(icsContent) {
  if (!icsContent || !icsContent.includes("BEGIN:VCALENDAR")) {
    $ui.error("无效的 ICS 内容");
    return;
  }

  // 简单的正则表达式解析 ICS
  // 注意：ICS 格式很复杂，这里只提取核心信息 (标题、开始时间、结束时间、描述)
  const events = [];
  const lines = icsContent.split(/\r\n|\n|\r/);
  
  let currentEvent = null;
  
  for (let line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) {
      currentEvent = {};
    } else if (line.startsWith("END:VEVENT")) {
      if (currentEvent) events.push(currentEvent);
      currentEvent = null;
    } else if (currentEvent) {
      // 解析字段
      if (line.startsWith("SUMMARY:")) currentEvent.title = unescapeICSText(line.substring(8));
      else if (line.startsWith("DESCRIPTION:")) currentEvent.notes = unescapeICSText(line.substring(12));
      else if (line.startsWith("LOCATION:")) currentEvent.location = unescapeICSText(line.substring(9));
      else if (line.startsWith("DTSTART:")) currentEvent.startDate = parseICSTime(line.substring(8));
      // 处理带时区的格式 DTSTART;TZID=Asia/Shanghai:2023...
      else if (line.startsWith("DTSTART;")) currentEvent.startDate = parseICSTime(line.split(":")[1]);
      
      else if (line.startsWith("DTEND:")) currentEvent.endDate = parseICSTime(line.substring(6));
      else if (line.startsWith("DTEND;")) currentEvent.endDate = parseICSTime(line.split(":")[1]);
      
      // 处理状态字段
      else if (line.startsWith("STATUS:")) currentEvent.status = line.substring(7);
      
      // 处理优先级字段
      else if (line.startsWith("PRIORITY:")) currentEvent.priority = line.substring(9);
    }
  }

  if (events.length === 0) {
    $ui.error("未在ICS内容中找到事件");
    return;
  }

  $ui.alert({
    title: "确认导入",
    message: `解析到 ${events.length} 个事件，是否导入系统日历？\n(首个事件: ${events[0].title || '无标题'})`,
    actions: [
      {
        title: "导入",
        handler: function() {
          batchCreateEvents(events);
        }
      },
      {
        title: "查看列表",
        handler: function() {
          showEventList(events);
        }
      },
      {
        title: "取消",
        style: "Cancel"
      }
    ]
  });
}

// 辅助函数：解析 ICS 时间字符串 (例如 20231027T080000Z)
function parseICSTime(timeStr) {
  if (!timeStr) return new Date();
  
  // 简单的格式清理
  let cleanStr = timeStr.replace("Z", ""); 
  
  // 提取年月日时分秒
  // 格式通常是 YYYYMMDDTHHMMSS
  if (cleanStr.length >= 15) {
    let year = parseInt(cleanStr.substring(0, 4));
    let month = parseInt(cleanStr.substring(4, 6)) - 1;
    let day = parseInt(cleanStr.substring(6, 8));
    let hour = parseInt(cleanStr.substring(9, 11));
    let minute = parseInt(cleanStr.substring(11, 13));
    let second = parseInt(cleanStr.substring(13, 15));
    // 创建UTC时间然后转换为本地时间
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  } else if (cleanStr.length === 8) {
    // 仅日期 YYYYMMDD
    let year = parseInt(cleanStr.substring(0, 4));
    let month = parseInt(cleanStr.substring(4, 6)) - 1;
    let day = parseInt(cleanStr.substring(6, 8));
    return new Date(year, month, day);
  }
  
  return new Date();
}

// 辅助函数：解码ICS文本中的转义字符
function unescapeICSText(text) {
  if (!text) return text;
  return text
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\n/g, '\n')
    .replace(/\\\\/g, '\\');
}

function showEventList(events) {
  let items = events.map((event, index) => {
    let title = event.title || "无标题";
    let date = event.startDate ? event.startDate.toLocaleString() : "无日期";
    return `${index + 1}. ${title} - ${date}`;
  });
  
  $ui.push({
    props: {
      title: "事件列表"
    },
    views: [
      {
        type: "list",
        props: {
          data: items,
          rowHeight: 50
        },
        layout: $layout.fill
      }
    ]
  });
}

function batchCreateEvents(events) {
  let successCount = 0;
  let errorCount = 0;
  
  $ui.loading(`正在导入 ${events.length} 个事件...`);
  
  // 使用 Promise 确保所有事件都已处理
  let promises = events.map(evt => {
    return new Promise((resolve, reject) => {
      $calendar.create({
        title: evt.title || "无标题事件",
        startDate: evt.startDate || new Date(),
        endDate: evt.endDate || new Date(new Date().getTime() + 30 * 60000), // 默认30分钟
        notes: evt.notes || "",
        location: evt.location || "",
        handler: function(resp) {
          if (resp.success) {
            successCount++;
          } else {
            errorCount++;
            console.log("创建事件失败:", resp.error);
          }
          resolve();
        }
      });
    });
  });

  Promise.all(promises).then(() => {
    $ui.loading(false);
    $ui.alert({
      title: "导入完成",
      message: `成功导入 ${successCount} 个事件，${errorCount} 个失败`,
      actions: [
        {
          title: "确定"
        }
      ]
    });
  });
}

// 自动获取模式 - 可选功能
function autoFetchMode() {
  $ui.alert({
    title: "自动获取模式",
    message: "是否开启自动获取模式？每10分钟会自动从服务器获取最新的ICS数据并导入。",
    actions: [
      {
        title: "开启",
        handler: function() {
          setInterval(function() {
            fetchAndParseICS();
          }, 10 * 60 * 1000); // 10分钟
          $ui.toast("自动获取已开启，每10分钟更新一次");
        }
      },
      {
        title: "取消",
        style: "Cancel"
      }
    ]
  });
}

main();