/*
  JSBox 脚本：从URL获取ICS并写入系统日历 (修复版)
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
  // 您的 Cloudflare Worker 地址
  let icsUrl = "https://todo.want.biz/event";

  $ui.loading("正在获取ICS数据...");

  $http.get({
    url: icsUrl,
    timeout: 30,
    header: {
      "Accept": "text/calendar, text/plain, */*"
    },
    handler: function(resp) {
      $ui.loading(false);
      if (resp.error) {
        console.log("网络请求错误:", resp.error);
        $ui.error("获取ICS数据失败: " + resp.error.localizedDescription);
        return;
      }

      let icsContent = resp.data;
      // 简单的有效性检查
      if (icsContent && typeof icsContent === "string" && icsContent.includes("BEGIN:VCALENDAR")) {
        parseAndImport(icsContent);
      } else {
        $ui.error("获取的ICS内容无效或格式错误");
        console.log("接收到的内容:", icsContent);
      }
    }
  });
}

function pickFile() {
  $drive.open({
    types: ["public.item"],
    handler: function(data) {
      if (data) {
        parseAndImport(data.string);
      }
    }
  });
}

function parseAndImport(icsContent) {
  if (!icsContent) return;

  const events = [];
  // 兼容各种换行符
  const lines = icsContent.split(/\r\n|\n|\r/);
  
  let currentEvent = null;
  
  for (let rawLine of lines) {
    // 关键修复：去除首尾空格和回车符
    let line = rawLine.trim();
    if (!line) continue;

    if (line === "BEGIN:VEVENT") {
      currentEvent = {};
    } else if (line === "END:VEVENT") {
      if (currentEvent) events.push(currentEvent);
      currentEvent = null;
    } else if (currentEvent) {
      // 解析字段
      if (line.startsWith("SUMMARY:")) {
        currentEvent.title = unescapeICSText(line.substring(8));
      } else if (line.startsWith("DESCRIPTION:")) {
        currentEvent.notes = unescapeICSText(line.substring(12));
      } else if (line.startsWith("LOCATION:")) {
        currentEvent.location = unescapeICSText(line.substring(9));
      } else if (line.startsWith("DTSTART")) {
        // 处理 DTSTART: 和 DTSTART;TZID=...:
        let timePart = line.includes(":") ? line.split(":").slice(1).join(":") : "";
        currentEvent.startDate = parseICSTime(timePart);
      } else if (line.startsWith("DTEND")) {
        let timePart = line.includes(":") ? line.split(":").slice(1).join(":") : "";
        currentEvent.endDate = parseICSTime(timePart);
      }
    }
  }

  if (events.length === 0) {
    $ui.error("未找到有效事件");
    return;
  }

  // 预览第一个事件的时间，帮助确认是否解析正确
  let firstEventDate = events[0].startDate ? events[0].startDate.toLocaleString() : "未知时间";

  $ui.render({
    props: { title: "确认导入" },
    views: [
      {
        type: "label",
        props: {
          text: `解析到 ${events.length} 个事件\n\n首个事件: ${events[0].title}\n时间: ${firstEventDate}\n\n注意：请检查年份是否正确！`,
          lines: 0,
          align: $align.center
        },
        layout: function(make, view) {
          make.top.inset(20);
          make.left.right.inset(20);
        }
      },
      {
        type: "button",
        props: { title: "导入系统日历", bgcolor: $color("systemBlue") },
        layout: function(make, view) {
          make.top.equalTo(view.prev.bottom).offset(30);
          make.centerX.equalTo(view.super);
          make.width.equalTo(200);
          make.height.equalTo(44);
        },
        events: {
          tapped: function() {
            $ui.pop();
            batchCreateEvents(events);
          }
        }
      }
    ]
  });
}

// 修复后的时间解析函数
function parseICSTime(timeStr) {
  if (!timeStr) return new Date();
  
  // 清理多余字符
  let clean = timeStr.trim().replace("Z", "");
  
  // 格式: YYYYMMDD (全天)
  if (clean.length === 8) {
    let y = parseInt(clean.substring(0, 4));
    let m = parseInt(clean.substring(4, 6)) - 1;
    let d = parseInt(clean.substring(6, 8));
    return new Date(y, m, d);
  }
  
  // 格式: YYYYMMDDTHHMMSS
  // 关键修复：确保索引正确，即使前面有空格
  if (clean.includes("T")) {
    let parts = clean.split("T");
    let datePart = parts[0];
    let timePart = parts[1];
    
    if (datePart.length === 8 && timePart.length >= 6) {
      let y = parseInt(datePart.substring(0, 4));
      let m = parseInt(datePart.substring(4, 6)) - 1;
      let d = parseInt(datePart.substring(6, 8));
      
      let h = parseInt(timePart.substring(0, 2));
      let min = parseInt(timePart.substring(2, 4));
      let s = parseInt(timePart.substring(4, 6));
      
      // 这里假设是 UTC 时间 (因为 ICS 通常是 Z 结尾)
      // 创建 UTC 时间戳，然后转为本地 Date 对象
      return new Date(Date.UTC(y, m, d, h, min, s));
    }
  }
  
  console.log("无法解析时间:", timeStr);
  return new Date(); // 默认当前时间
}

function unescapeICSText(text) {
  if (!text) return "";
  return text.replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');
}

function batchCreateEvents(events) {
  if (!$calendar) {
    $ui.error("无日历权限");
    return;
  }

  $ui.loading("正在写入日历...");
  
  let success = 0;
  let total = events.length;
  let processed = 0;

  events.forEach(evt => {
    let start = evt.startDate || new Date();
    let end = evt.endDate;
    
    // 默认时长 30 分钟
    if (!end || end <= start) {
      end = new Date(start.getTime() + 30 * 60000);
    }

    $calendar.create({
      title: evt.title || "无标题任务",
      startDate: start,
      endDate: end,
      notes: evt.notes || "",
      location: evt.location || "",
      handler: function(resp) {
        processed++;
        // JSBox 的 resp 结构可能因版本而异，通常检查 error 字段
        if (resp && !resp.error) {
          success++;
        } else {
          console.log(`创建失败 [${evt.title}]:`, resp ? resp.error : "未知错误");
        }

        if (processed === total) {
          $ui.loading(false);
          $ui.alert(`导入完成\n成功: ${success}\n失败: ${total - success}`);
        }
      }
    });
  });
}

main();