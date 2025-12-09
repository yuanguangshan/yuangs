/*
  JSBox 脚本：ICS 完整解析展示工具
  功能：从URL获取ICS文件，解析并展示所有内容（北京时间）
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
        parseAndShowAll($clipboard.text);
      }
    }
  });
}

function fetchAndParseICS() {
  let icsUrl = "https://todo.want.biz/event";

  $ui.loading("正在获取ICS数据...");

  $http.get({
    url: icsUrl,
    timeout: 30,
    header: {
      "Accept": "text/calendar, text/plain, */*",
      "CF-Access-Client-Id": "ab3dfabfc32f6a520441a8110db26021.access",
      "CF-Access-Client-Secret": "3b754092a3820bbdab6f4960121a8ea36aedece969dd87c906ef8633bc50afb3"
    },
    handler: function(resp) {
      $ui.loading(false);
      if (resp.error) {
        console.log("网络请求错误:", resp.error);
        $ui.error("获取ICS数据失败: " + resp.error.localizedDescription);
        return;
      }

      let icsContent = resp.data;
      if (icsContent && typeof icsContent === "string" && icsContent.includes("BEGIN:VCALENDAR")) {
        parseAndShowAll(icsContent);
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
        parseAndShowAll(data.string);
      }
    }
  });
}

function parseAndShowAll(icsContent) {
  if (!icsContent) {
    $ui.error("内容为空");
    return;
  }

  const result = parseICSComplete(icsContent);
  
  if (result.error) {
    $ui.error("解析失败: " + result.error);
    return;
  }

  showCompleteView(result);
}

// 完整解析 ICS 内容
function parseICSComplete(icsContent) {
  try {
    const events = [];
    const calendar = {};
    const rawLines = [];
    
    const lines = icsContent.split(/\r\n|\n|\r/);
    
    let currentEvent = null;
    
    for (let rawLine of lines) {
      let line = rawLine.trim();
      if (!line) continue;
      
      rawLines.push(line);

      // 解析日历级别属性
      if (line.startsWith("VERSION:")) {
        calendar.version = line.substring(8);
      } else if (line.startsWith("PRODID:")) {
        calendar.prodId = line.substring(7);
      } else if (line.startsWith("METHOD:")) {
        calendar.method = line.substring(7);
      } else if (line.startsWith("CALSCALE:")) {
        calendar.calScale = line.substring(9);
      }

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
          currentEvent.description = unescapeICSText(line.substring(12));
        } else if (line.startsWith("LOCATION:")) {
          currentEvent.location = unescapeICSText(line.substring(9));
        } else if (line.startsWith("DTSTART")) {
          let timePart = line.includes(":") ? line.split(":").slice(1).join(":") : "";
          currentEvent.startDate = parseICSTime(timePart);
        } else if (line.startsWith("DTEND")) {
          let timePart = line.includes(":") ? line.split(":").slice(1).join(":") : "";
          currentEvent.endDate = parseICSTime(timePart);
        } else if (line.startsWith("UID:")) {
          currentEvent.uid = line.substring(4);
        } else if (line.startsWith("DTSTAMP:")) {
          currentEvent.timestamp = parseICSTime(line.substring(8));
        } else if (line.startsWith("LAST-MODIFIED:")) {
          currentEvent.lastModified = parseICSTime(line.substring(14));
        } else if (line.startsWith("STATUS:")) {
          currentEvent.status = line.substring(7);
        } else if (line.startsWith("PRIORITY:")) {
          currentEvent.priority = line.substring(9);
        } else if (line.startsWith("CATEGORIES:")) {
          currentEvent.categories = line.substring(11);
        } else if (line.startsWith("CLASS:")) {
          currentEvent.class = line.substring(6);
        } else if (line.startsWith("TRANSP:")) {
          currentEvent.transp = line.substring(7);
        }
      }
    }

    return {
      calendar: calendar,
      events: events,
      rawLines: rawLines,
      totalEvents: events.length
    };
  } catch (e) {
    return { error: e.message };
  }
}

function parseICSTime(timeStr) {
  if (!timeStr) return null;
  
  let clean = timeStr.trim().replace("Z", "");
  
  // 格式: YYYYMMDD (全天)
  if (clean.length === 8) {
    let y = parseInt(clean.substring(0, 4));
    let m = parseInt(clean.substring(4, 6)) - 1;
    let d = parseInt(clean.substring(6, 8));
    // 全天事件使用北京时间午夜
    return new Date(y, m, d, 0, 0, 0);
  }
  
  // 格式: YYYYMMDDTHHMMSS
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
      
      // UTC时间转北京时间（+8小时）
      let utcDate = new Date(Date.UTC(y, m, d, h, min, s));
      return new Date(utcDate.getTime() + 8 * 3600 * 1000);
    }
  }
  
  return null;
}

function unescapeICSText(text) {
  if (!text) return "";
  return text.replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');
}

function formatDate(date) {
  if (!date) return "未设置";
  
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let day = String(date.getDate()).padStart(2, '0');
  let hour = String(date.getHours()).padStart(2, '0');
  let min = String(date.getMinutes()).padStart(2, '0');
  let sec = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

// 显示完整内容视图
function showCompleteView(result) {
  const events = result.events;
  const calendar = result.calendar;
  
  // 构建显示数据
  let sections = [];
  
  // 第一部分：统计信息
  sections.push({
    title: "📊 解析统计",
    rows: [
      { title: "事件总数", detail: events.length + " 个" },
      { title: "待处理事件", detail: events.filter(e => e.status === "NEEDS-ACTION").length + " 个" },
      { title: "有描述的事件", detail: events.filter(e => e.description).length + " 个" }
    ]
  });

  // 第二部分：日历信息
  sections.push({
    title: "📅 日历信息",
    rows: [
      { title: "版本", detail: calendar.version || "未知" },
      { title: "生产者", detail: calendar.prodId || "未知" },
      { title: "方法", detail: calendar.method || "未知" },
      { title: "日历刻度", detail: calendar.calScale || "未知" }
    ]
  });

  // 第三部分：每个事件
  events.forEach((evt, idx) => {
    let eventRows = [];
    
    if (evt.title) {
      eventRows.push({ title: "标题", detail: evt.title });
    }
    
    if (evt.description) {
      eventRows.push({ title: "描述", detail: evt.description });
    }
    
    if (evt.location) {
      eventRows.push({ title: "地点", detail: evt.location });
    }
    
    if (evt.startDate) {
      eventRows.push({ title: "开始时间", detail: formatDate(evt.startDate) + " (北京时间)" });
    }
    
    if (evt.endDate) {
      eventRows.push({ title: "结束时间", detail: formatDate(evt.endDate) + " (北京时间)" });
    }
    
    if (evt.status) {
      eventRows.push({ title: "状态", detail: evt.status });
    }
    
    if (evt.priority) {
      eventRows.push({ title: "优先级", detail: evt.priority });
    }
    
    if (evt.categories) {
      eventRows.push({ title: "分类", detail: evt.categories });
    }
    
    if (evt.class) {
      eventRows.push({ title: "类别", detail: evt.class });
    }
    
    if (evt.transp) {
      eventRows.push({ title: "透明度", detail: evt.transp });
    }
    
    if (evt.uid) {
      eventRows.push({ title: "UID", detail: evt.uid });
    }
    
    if (evt.timestamp) {
      eventRows.push({ title: "时间戳", detail: formatDate(evt.timestamp) + " (北京时间)" });
    }
    
    if (evt.lastModified) {
      eventRows.push({ title: "最后修改", detail: formatDate(evt.lastModified) + " (北京时间)" });
    }
    
    sections.push({
      title: `🎯 事件 #${idx + 1}: ${evt.title || "无标题"}`,
      rows: eventRows
    });
  });

  // 渲染界面
  $ui.render({
    props: {
      title: "ICS 完整解析 (北京时间)",
      navButtons: [
        {
          title: "原始数据",
          handler: function() {
            showRawData(result.rawLines);
          }
        },
        {
          title: "导入日历",
          handler: function() {
            importToCalendar(events);
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          data: sections.map(section => ({
            title: section.title,
            rows: section.rows.map(row => ({
              type: "view",
              views: [
                {
                  type: "label",
                  props: {
                    text: row.title,
                    font: $font("bold", 15),
                    textColor: $color("#333333")
                  },
                  layout: function(make) {
                    make.left.inset(15);
                    make.top.inset(8);
                    make.width.equalTo(100);
                  }
                },
                {
                  type: "label",
                  props: {
                    text: row.detail,
                    lines: 0,
                    font: $font(14),
                    textColor: $color("#666666")
                  },
                  layout: function(make, view) {
                    make.left.equalTo(view.prev.right).offset(10);
                    make.right.inset(15);
                    make.top.inset(8);
                    make.bottom.inset(8);
                  }
                }
              ],
              layout: $layout.fill
            }))
          }))
        },
        layout: $layout.fill,
        events: {
          didSelect: function(sender, indexPath, data) {
            // 点击复制内容
            let section = sections[indexPath.section];
            let row = section.rows[indexPath.row];
            $clipboard.text = row.title + ": " + row.detail;
            $ui.toast("已复制: " + row.title);
          }
        }
      }
    ]
  });
}

function showRawData(rawLines) {
  $ui.alert({
    title: "原始ICS数据",
    message: rawLines.join("\n"),
    actions: [
      {
        title: "复制",
        handler: function() {
          $clipboard.text = rawLines.join("\n");
          $ui.toast("已复制原始数据");
        }
      },
      {
        title: "关闭"
      }
    ]
  });
}

function importToCalendar(events) {
  if (!$calendar) {
    $ui.error("无日历权限");
    return;
  }

  $ui.alert({
    title: "确认导入",
    message: `将 ${events.length} 个事件导入系统日历？`,
    actions: [
      {
        title: "确定",
        handler: function() {
          batchCreateEvents(events);
        }
      },
      { title: "取消" }
    ]
  });
}

function batchCreateEvents(events) {
  $ui.loading("正在写入日历...");
  
  let success = 0;
  let total = events.length;
  let processed = 0;

  events.forEach(evt => {
    let start = evt.startDate || new Date();
    let end = evt.endDate;
    
    if (!end || end <= start) {
      end = new Date(start.getTime() + 30 * 60000);
    }

    $calendar.create({
      title: evt.title || "无标题任务",
      startDate: start,
      endDate: end,
      notes: evt.description || "",
      location: evt.location || "",
      handler: function(resp) {
        processed++;
        if (resp && !resp.error) {
          success++;
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