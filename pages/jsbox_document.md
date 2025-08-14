# 项目完整文档

## README.md

```markdown
# JSBox Online Documentation

To be continued...

```

## docs/README.md

```markdown
*本文档基于 [Docsify](https://docsify.js.org) 部署在 [GitHub](https://github.com/cyanzhong/jsbox-docs)，欢迎一起改进*

# JSBox APIs

通过 JavaScript 来为 JSBox 提供强大的扩展，支持 ES6 标准语法，并提供了丰富的 API 来与 Native 代码进行交互。

# JSBox Node.js

JSBox 从 2.0 开始，提供了对 Node.js 运行时的支持。关于这一部分的内容，请参考专门的文档：https://cyanzhong.github.io/jsbox-nodejs/#/

# 如何在 JSBox 里运行代码

- 在 JSBox 里面直接编写

  > JSBox 内置了一个简单的 js 编辑器，目前只提供了基本的代码高亮和自动补全，随着之后的版本更新将会提供更好的编辑器。

- 通过 URL Scheme 在线安装

  > 例如通过在 iOS 设备上点击：jsbox://import?url=url&name=name&icon=icon
  > 将会打开 JSBox 自动安装脚本，支持 `url`, `name`(可选), `icon`(可选) 3 个参数，均需要 URL Encode
  > icon 名称具体请参考：https://github.com/cyanzhong/xTeko/tree/master/extension-icons
  > 在线文件 URL 中请使用纯英文名

- 通过 VSCode 插件同步编辑

  > 1. 打开 JSBox 中任意一个脚本，进入设置页面打开调试模式
  > 2. 回到桌面后重新打开应用，打开设置 Tab 查看本机 HOST
  > 3. 在 VSCode 的扩展商店搜索安装 `JSBox` 插件
  > 4. 在 VSCode 打开 JavaScript 文件，点击菜单中的 `Set Host` 选项填入步骤 2 的 HOST
  > 5. 至此，编辑保存 JavaScript 文件之后，将同步运行到 JSBox 应用

- 通过 AirDrop 传输脚本

  > 你可以通过文件分享或 AirDrop 把脚本传输到 JSBox，但你需要手动同步被导入进来的脚本
  > 可以通过类似这个样例的脚本进行同步：https://github.com/cyanzhong/xTeko/blob/master/extension-demos/sync-inbox.js

- 发挥你的创造力，利用 JSBox 提供的接口获取脚本

  > 例如这个例子：https://github.com/cyanzhong/xTeko/blob/master/extension-demos/addin-gallery.js

# 开源项目

为了提供更多的样例代码，我们准备了一个开源项目：https://github.com/cyanzhong/xTeko

欢迎一起完善这个项目，通过 [提交 Issue](https://github.com/cyanzhong/xTeko/issues/new) 或 [提交 PR](https://github.com/cyanzhong/xTeko/compare) 等贡献方式。

# 联系我们

对文档有任何疑问都可以通过以下方式联系我们：

- Email: [log.e@qq.com](mailto:log.e@qq.com)
- Weibo: [@StackOverflowError](https://weibo.com/0x00eeee)
- Twitter: [@JSBoxApp](https://twitter.com/JSBoxApp)

*准备好了，[快速开始 >](quickstart/intro.md)*

> 此文档目前处于测试阶段，之后可能会有变化，如有错误欢迎指正。
```

## docs/_navbar.md

```markdown
- [EN / **CN**](/en/)
```

## docs/_sidebar.md

```markdown
- 快速开始
  - [README](README.md)
  - [隐私政策](privacy.md)
  - [开始之前](quickstart/intro.md)
  - [简单样例](quickstart/sample.md)

- 基础接口
  - [前言](foundation/intro.md)
  - [设备](foundation/device.md)
  - [应用](foundation/app.md)
  - [配置](foundation/prefs.md)
  - [系统](foundation/system.md)
  - [网络](foundation/network.md)
  - [缓存](foundation/cache.md)
  - [钥匙串](foundation/keychain.md)
  - [线程](foundation/thread.md)
  - [剪贴板](foundation/clipboard.md)
  - [本地化](foundation/l10n.md)

- 内建函数
  - [前言](function/intro.md)
  - [索引](function/index.md)

- 数据类型
  - [前言](data/intro.md)
  - [方法](data/method.md)
  - [对象](data/object.md)
  - [常量](data/constant.md)

- 构建界面
  - [前言](uikit/intro.md)
  - [渲染](uikit/render.md)
  - [视图](uikit/view.md)
  - [布局](uikit/layout.md)
  - [手势](uikit/gesture.md)
  - [事件处理](uikit/event.md)
  - [系统菜单](uikit/context-menu.md)
  - [动画](uikit/animation.md)
  - [接口](uikit/method.md)
  - [Dark Mode](uikit/dark-mode.md)

- 控件列表
  - [标签](component/label.md)
  - [按钮](component/button.md)
  - [输入](component/input.md)
  - [滑块](component/slider.md)
  - [开关](component/switch.md)
  - [指示器](component/spinner.md)
  - [进度条](component/progress.md)
  - [画廊](component/gallery.md)
  - [步进器](component/stepper.md)
  - [文本](component/text.md)
  - [图片](component/image.md)
  - [视频](component/video.md)
  - [滚动视图](component/scroll.md)
  - [堆栈视图](component/stack.md)
  - [菜单](component/menu.md)
  - [地图](component/map.md)
  - [网页](component/web.md)
  - [列表](component/list.md)
  - [网格](component/matrix.md)
  - [模糊效果](component/blur.md)
  - [渐变效果](component/gradient.md)
  - [日期选择器](component/date-picker.md)
  - [通用选择器](component/picker.md)
  - [画布](component/canvas.md)
  - [Markdown](component/markdown.md)
  - [Lottie](component/lottie.md)
  - [图表控件](component/chart.md)
  - [代码视图](component/code.md)
  - [Runtime](component/runtime.md)

- Safari 浏览器扩展
  - [介绍](safari-extension/intro.md)

- 桌面小组件（iOS 14）
  - [前言](home-widget/intro.md)
  - [时间线](home-widget/timeline.md)
  - [视图](home-widget/views.md)
  - [布局](home-widget/layout.md)
  - [属性](home-widget/modifiers.md)
  - [方法](home-widget/method.md)
  - [锁屏小组件](home-widget/lock-screen.md)

- Today 小组件（已过时）
  - [前言](widget/intro.md)
  - [方法](widget/method.md)

- Action Extension 扩展
  - [前言](context/intro.md)
  - [方法列表](context/method.md)

- 键盘扩展
  - [方法列表](keyboard/method.md)
  - [隐私策略](keyboard/privacy.md)

- 文件系统
  - [设计思路](file/design.md)
  - [接口](file/method.md)
  - [iCloud Drive](file/drive.md)

- SQLite
  - [前言](sqlite/intro.md)
  - [基本使用](sqlite/usage.md)
  - [事务](sqlite/transaction.md)
  - [Queue](sqlite/queue.md)

- 脚本相关
  - [方法列表](addin/method.md)
  - [样例](addin/sample.md)

- 媒体
  - [预览](media/quicklook.md)
  - [图片](media/photo.md)
  - [音频](media/audio.md)
  - [PDF](media/pdf.md)
  - [图像处理](media/imagekit.md)

- 原生 SDK
  - [前言](sdk/intro.md)
  - [消息](sdk/message.md)
  - [日历](sdk/calendar.md)
  - [提醒事项](sdk/reminder.md)
  - [联系人](sdk/contact.md)
  - [地理位置](sdk/location.md)
  - [传感数据](sdk/motion.md)
  - [Safari](sdk/safari.md)

- 网络相关
  - [Socket](network/socket.md)
  - [Server](network/server.md)

- 扩展接口
  - [前言](extend/intro.md)
  - [文本](extend/text.md)
  - [编辑器插件](extend/editor.md)
  - [XML](extend/xml.md)
  - [分享](extend/share.md)
  - [二维码](extend/qrcode.md)
  - [浏览器](extend/browser.md)
  - [消息推送](extend/push.md)
  - [文件压缩](extend/archiver.md)
  - [数据检测](extend/detector.md)

- 捷径（Shortcuts）
  - [前言](shortcuts/intro.md)
  - [语音](shortcuts/voice.md)
  - [Intents](shortcuts/intents.md)
  - [UI Intents](shortcuts/ui-intents.md)
  - [运行脚本](shortcuts/scripting.md)

- SSH
  - [前言](ssh/intro.md)
  - [Channel](ssh/channel.md)
  - [SFTP](ssh/sftp.md)

- 对象属性
  - [data](object/data.md)
  - [image](object/image.md)
  - [color](object/color.md)
  - [indexPath](object/index-path.md)
  - [error](object/error.md)
  - [response](object/response.md)
  - [navigationAction](object/navigation-action.md)
  - [calendarItem](object/calendar-item.md)
  - [reminderItem](object/reminder-item.md)
  - [contact](object/contact.md)
  - [resultSet](object/result-set.md)
  - [server](object/server.md)

- Promise
  - [前言](promise/intro.md)
  - [样例代码](promise/sample.md)
  - [接口列表](promise/index.md)

- 安装包格式
  - [前言](package/intro.md)
  - [模块化](package/module.md)
  - [内置模块](package/builtin.md)
  - [文件路径](package/path.md)
  - [VSCode](package/vscode.md)
  - [安装说明](package/install.md)

- Runtime
  - [前言](runtime/intro.md)
  - [动态调用](runtime/invoke.md)
  - [语法糖](runtime/sugar.md)
  - [动态创建](runtime/define.md)
  - [类型转换](runtime/types.md)
  - [Blocks](runtime/blocks.md)
  - [内存管理](runtime/memory.md)
  - [C 函数](runtime/c.md)

- 调试工具
  - [控制台](debug/console.md)
  - [检查器](debug/inspector.md)

- 关于
  - [如何使用](about/guide.md)
  - [更新说明](about/changelog.md)

```

## docs/about/changelog.md

```markdown
# 2021.11.26

- 改进配置项相关接口：[详情](foundation/prefs.md)
- 改进菜单相关接口：[详情](uikit/context-menu.md)
- 增加 Safari 扩展文档：[详情](safari-extension/intro.md)
- 增加钥匙串相关接口：[详情](foundation/keychain.md)

# 2020.10.03

- 增加桌面小组件相关：[详情](home-widget/intro.md)

# 2020.03.13

- 增加 Dark Mode 相关：[详情](uikit/dark-mode.md)

# 2020.03.04

- 增加富文本相关：[详情](component/text.md)

# 2020.01.29

- 增加图像处理相关：[详情](media/imagekit.md)

# 2020.01.28

- 添加关于内置模块的描述：[详情](package/builtin.md)

# 2019.12.28

- 增加代码视图相关：[详情](component/code.md)

# 2019.11.25

- 增加视图层级相关：[详情](uikit/view.md)

# 2019.11.21

- 增加 context menu 支持：[详情](uikit/context-menu.md)

# 2019.10.27

- $text.speech 增加语音设置：[详情](extend/text.md)

# 2019.09.02

- 增加应用配置相关：[详情](foundation/prefs.md)

# 2018.12.23

- 增加编辑器插件相关：[详情](extend/editor.md)

# 2018.11.09

- 增加 Apple Pencil 相关：[详情](uikit/view.md)

# 2018.10.21

- 增加 XML 相关：[详情](extend/xml.md)

# 2018.10.05

- 增加 Lottie View 相关：[详情](component/lottie.md)

# 2018.08.26

- 添加 Web Socket 相关：[详情](network/socket.md)
- 添加 Web Server 相关：[详情](network/server.md)

# 2018.08.11

- 增加 SQLite 相关：[详情](sqlite/intro.md)

# 2018.07.29

- 增加 Shortcuts 相关：[详情](shortcuts/intro.md)

# 2018.07.22

- 增加内建函数索引：[详情](function/intro.md)

# 2018.07.18

- $contact 增加分组相关操作：[详情](sdk/contact.md)

# 2018.07.08

- Runtime 语法糖：[详情](runtime/sugar.md)

# 2018.06.27

- matrix 增加长按排序：[详情](component/matrix.md)
- matrix 增加 itemSize 方法：[详情](component/matrix.md)
- matrix 和 list 增加 forEachItem 方法：[详情](component/matrix.md)

# 2018.06.17

- $audio.play 增加 events: [详情](media/audio.md)

# 2018.06.14

- 增加 $widget 接口文档：[详情](widget/method.md)

# 2018.06.08

- 增加对 Lua 虚拟机的文档：[详情](vm/lua.md)

# 2018.05.15

- 完善 Runtime 相关文档：[详情](runtime/blocks.md)
- 增加 C 函数相关文档：[详情](runtime/c.md)

# 2018.04.18

- 添加 Promise 相关文档：[详情](promise/intro.md)

# 2018.04.07

- 添加 SSH 相关接口：[详情](ssh/intro.md)

# 2018.04.06

- 添加 markdown 相关接口：[详情](extend/text.md)

# 2018.04.01

- 添加 view debugging 文档：[详情](uikit/render.md)

# 2018.03.25

- 添加 ifa_data 相关文档：[详情](foundation/network.md)
- 添加 ping 相关文档：[详情](foundation/network.md)

# 2018.03.18

- 添加关于键盘的文档：[详情](keyboard/method.md)

# 2018.03.11

- 添加 $location.select 接口

# 2018.03.09

- 为 $push 接口添加新内容：[详情](extend/push.md)
- 添加 $http.startServer 相关内容：[详情](foundation/network.md)
- $text.speech 新增语言

# 2018.02.28

- 新增安装包格式：[详情](package/intro.md)

# 2017.07.15

- 初始版本

```

## docs/about/guide.md

```markdown
# Tab 1

- 点击右上角按钮新建脚本
- 滑动删除某个脚本
- 长按对脚本进行排序
- 点击脚本进行编辑
- 点击播放按钮执行脚本

# Tab 2

- 在这里列举了各种 JavaScript 资源
- 和 JSBox 有关的内容在第二行，这是最重要的文档

# Tab 3

- 你可以将最常用的脚本固定在这个 Tab
- 你可以通过桌面 3D Touch 快速打开这个脚本

# Tab 4

- 在这里罗列了应用内的各种设置
- 你也可以在这里找到联系我们的方式
- 也非常诚恳希望能得到你在 App Store 的评分

# 其他启动方案

- JSBox 提供了 Today Widget
- JSBox 也提供了 Action Extension

# 脚本编辑器使用

- 滑动工具栏可移动关闭
- 长按符号可展示相关符号
- 点击操作按钮和符号按钮可以打开相应的键盘
- 点击回车按钮可以收起键盘
```

## docs/addin/method.md

```markdown
> 通过脚本可以控制 JSBox 的脚本，包括安装新脚本、删除脚本等操作

# $addin.list

获得已安装的全部脚本：

```js
const addins = $addin.list;
```

数据结构：

属性 | 类型 | 读写 | 说明
---|---|---|---
name | string | 读写 | 名称
category | string | 读写 | 分类
url | string | 读写 | url
data | $data | 读写 | 文件
id | string | 读写 | id
version | string | 读写 | 版本号
icon | string | 读写 | 图标
iconImage | image | 只读 | 获得图标
module | bool | 读写 | 是否保存为模块
author | string | 读写 | 作者
website | string | 读写 | 网站

以上字段 `name` 和 `data` 为必须，其余字段可选。

你可以对取出的 `addins` 进行更改，例如重新排序，然后这样保存：

```js
$addin.list = addins;
```

# $addin.categories

获取当前设备所有的脚本分类，返回 string 数组：

```js
const categories = $addin.categories;
```

你可以进行修改，例如重新排序或增加分类，然后这样保存：

```js
$addin.categories = categories;
```

# $addin.current

获取当前正在运行的脚本，结构如上述所示：

```js
const current = $addin.current;
```

# $addin.save(object)

安装一个新的脚本：

```js
$addin.save({
  name: "New Script",
  data: $data({string: "$ui.alert('Hey!')"}),
  handler: function(success) {
    
  }
})
```

JSBox 内将会安装一个叫做 New Script 的脚本，save 的所有字段遵循上述数据结构。

# $addin.delete(name)

通过脚本的名字删除一个脚本：

```js
$addin.delete("New Script")
```

将会删除前一个例子里面创建的脚本。

# $addin.run(name)

通过脚本的名字运行一个脚本：

```js
$addin.run("New Script")
```

将会运行名为 New Script 的脚本，当然前提是你没有删掉它。

从 v1.15.0 开始，你也可以传递而外的参数：

```js
$addin.run({
  name: "New Script",
  query: {
    "a": "b"
  }
})
```

参数将会被传递到 `$context.query` 以便获取到。

# $addin.restart()

重新运行当前的脚本。

# $addin.replay()

重新渲染当前有界面的脚本。

# $addin.compile(script)

将 script 转换成 JSBox 可用的语法：

```js
const result = $addin.compile("$ui.alert('Hey')");

// result => JSBox.ui.alert('Hey')
```

# $addin.eval(script)

与 `eval()` 类似，但先会将 script 转换成 JSBox 语法：

```js
$addin.eval("$ui.alert('Hey')");
```
```

## docs/addin/sample.md

```markdown
> 控制 JSBox 内的脚本是很有用的，这里将提供两个实用的例子

- 导入 AirDrop 到 JSBox 内的文件：[sync-inbox](https://github.com/cyanzhong/xTeko/blob/master/extension-demos/sync-inbox.js)
- 获取在线的扩展：[addin-gallery](https://github.com/cyanzhong/xTeko/blob/master/extension-demos/addin-gallery.js)

JSBox 默认并不会提供任何安装脚本的方式，这是出于安全考虑。
```

## docs/component/blur.md

```markdown
# type: "blur"

`blur` 用来创建一个模糊效果：

```js
{
  type: "blur",
  props: {
    style: 1 // 0 ~ 20
  },
  layout: $layout.fill
}
```

`style` 0 ~ 20 表示了不同的模糊效果，[参考](data/constant.md?id=blurstyle)。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
style | $blurStyle | w | 效果类型
```

## docs/component/button.md

```markdown
# type: "button"

`button` 可以创建一个按钮，用于处理用户的点击事件：

```js
{
  type: "button",
  props: {
    title: "Click"
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
  }
}
```

在画布中显示一个标题为 `Click` 的按钮。

类似 image 组件，button 也支持通过 src 属性来设置显示的图片。

另外 button 也支持显示 JSBox 自带的 icon，请参考 [$icon](data/method.md?id=iconcode-color-size)。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
title | string | 读写 | 标题
titleColor | $color | 读写 | 标题颜色
font | $font | 读写 | 字体
src | string | 读写 | 图片地址
source | object | 读写 | 图片加载信息
symbol | string | 读写 | SF symbols 名称
image | image | 读写 | 图片对象
icon | $icon | 只写 | 内置图标
type | $btnType | 只读 | 类型
menu | object | 只写 | Pull-Down 菜单
contentEdgeInsets | $insets | 读写 | 内容边距
titleEdgeInsets | $insets | 读写 | 标题边距
imageEdgeInsets | $insets | 读写 | 图片边距

# props: source

从 v1.55.0 开始，可以通过 `source` 对图片进行更详细的设定，例如：

```js
source: {
  url: url,
  placeholder: image,
  header: {
    "key1": "value1",
    "key2": "value2",
  }
}
```

# events: tapped

尤其不要忘记的是，button 也支持 `tapped` 事件：

```js
events: {
  tapped: function(sender) {
    
  }
}
```

# Pull-Down 菜单

`button` 视图支持 Pull-Down 菜单，请参考 [Pull-Down 菜单](uikit/context-menu?id=pull-down-菜单) 了解更多。
```

## docs/component/canvas.md

```markdown
# type: "canvas"

`canvas` 提供的是画图的功能，在绝大部分的情况下，你可以通过各种控件的组合构造出想要的效果，如果哪些控件仍然不让你满意，你可以自己绘图，比如：

```js
{
  type: "canvas",
  layout: $layout.fill,
  events: {
    draw: function(view, ctx) {
      var centerX = view.frame.width * 0.5
      var centerY = view.frame.height * 0.3
      var radius = 50.0
      ctx.fillColor = $color("red")
      ctx.moveToPoint(centerX, centerY - radius)
      for (var i=1; i<5; ++i) {
        var x = radius * Math.sin(i * Math.PI * 0.8)
        var y = radius * Math.cos(i * Math.PI * 0.8)
        ctx.addLineToPoint(x + centerX, centerY - y)
      }
      ctx.fillPath()
    }
  }
}
```

这将在屏幕上画一个红色的五角星，半径为 50pt。

# ctx

`canvas` 控件其实也是有一点点复杂，目前并未实现完全，请参考 Apple [官方文档](https://developer.apple.com/documentation/coregraphics)获得更多信息。

上述代码的 `ctx` 对象是我们绘制图形的上下文，要理解这个概念首先要阅读 Apple 的官方文档，其次我将介绍目前 JSBox 里面实现了的部分。

# ctx.fillColor

`fillColor` 是用于填充的颜色。

# ctx.strokeColor

`strokeColor` 是用于描边的颜色。

# ctx.font

`font` 是绘制文字时的字体。

# ctx.fontSize

`fontSize` 是绘制文字时的字号大小。

# ctx.allowsAntialiasing

`allowsAntialiasing` 表示是否允许自动抗锯齿，抗锯齿会获得更平滑的效果，但性能有所损失。

# saveGState()

存储状态。

# restoreGState()

恢复状态。

# scaleCTM(sx, sy)

进行缩放操作。

# translateCTM(tx, ty)

进行平移操作。

# rotateCTM(scale)

进行旋转操作。

# setLineWidth(width)

设置描边宽度。

# setLineCap(lineCap)

请参考文档：https://developer.apple.com/documentation/coregraphics/cglinecap

# setLineJoin(lineJoin)

请参考文档：https://developer.apple.com/documentation/coregraphics/cglinejoin

# setMiterLimit(miterLimit)

请参考文档：https://developer.apple.com/documentation/coregraphics/cgcontext/1456499-setmiterlimit

# setAlpha(alpha)

设置透明度。

# beginPath()

路径开始。

# moveToPoint(x, y)

移动到 `(x, y)` 这个点。

# addLineToPoint(x, y)

从当前点画一条线到 `(x, y)` 这个点。

# addCurveToPoint(cp1x, cp1y, cp2x, cp2y, x, y)

绘制一条曲线到 `(x, y)`，通过 `(cp1x, cp1y)` 和 `(cp2x, cp2y)` 进行曲率控制。

# addQuadCurveToPoint(cpx, cpy, x, y)

还是绘制曲线到 `(x, y)` 这个点，但是这次只有一个控制点 `(cpx, cpy)`。

# closePath()

将路径闭合。

# addRect(rect)

添加一个矩形。

# addArc(x, y, radius, startAngle, endAngle, clockwise)

添加一条弧线，以 `(x, y)` 为中点，`radius` 为半径，`startAngle` 为起始弧度，`endAngle` 为终止弧度，`clockwise` 表示是否顺时针。

# addArcToPoint(x1, y1, x2, y2, radius)

在 `(x1, y1)` 和 `(x2, y2)` 之间添加一条弧线。

# fillRect(rect)

填充一个矩形。

# strokeRect(rect)

对矩形进行描边。

# clearRect(rect)

清除一个矩形。

# fillPath()

填充一个闭合的路径。

# strokePath()

对闭合的路径进行描边。

# drawPath(mode)

使用指定模式绘制路径：

```
0: kCGPathFill,
1: kCGPathEOFill,
2: kCGPathStroke,
3: kCGPathFillStroke,
4: kCGPathEOFillStroke,
```

参考：https://developer.apple.com/documentation/coregraphics/1455195-cgcontextdrawpath

# drawImage(rect, image)

将 `image` 绘制到 `rect` 这个矩形上。

# drawText(rect, text, attributes)

将文字绘制到 `rect` 这个矩形上：

```js
ctx.drawText($rect(0, 0, 100, 100), "你好", {
  color: $color("red"),
  font: $font(30)
});
```
```

## docs/component/chart.md

```markdown
# type: "chart"

`chart` 用来绘制图表来实现数据可视化：

```js
{
  type: "chart",
  props: {
    options: {
      "legend": {
        "data": ["Chart"]
      },
      "xAxis": {
        "data": [
          "A",
          "B",
          "C",
          "D"
        ]
      },
      "yAxis": {},
      "series": [
        {
          "name": "foo",
          "type": "bar",
          "data": [5, 20, 36, 10]
        }
      ]
    }
  },
  layout: $layout.fill
}
```

这将在页面上画出一个柱状图，options 支持的参数请参考 [ECharts 文档](http://www.echartsjs.com/option.html)。

# 动态绘制

在某些时候数据不是静态的，绘制可以通过一个函数来完成，在 JSBox 里面你可以使用模板字符串来实现：

```js
$ui.render({
  views: [
    {
      type: "chart",
      layout: $layout.fill,
      events: {
        ready: chart => {
          let options = `
          options = {
            tooltip: {},
            backgroundColor: "#fff",
            visualMap: {
              show: false,
              dimension: 2,
              min: -1,
              max: 1,
              inRange: {
                color: [
                  "#313695",
                  "#4575b4",
                  "#74add1",
                  "#abd9e9",
                  "#e0f3f8",
                  "#ffffbf",
                  "#fee090",
                  "#fdae61",
                  "#f46d43",
                  "#d73027",
                  "#a50026"
                ]
              }
            },
            xAxis3D: {
              type: "value"
            },
            yAxis3D: {
              type: "value"
            },
            zAxis3D: {
              type: "value"
            },
            grid3D: {
              viewControl: {
                // projection: 'orthographic'
              }
            },
            series: [
              {
                type: "surface",
                wireframe: {
                  // show: false
                },
                equation: {
                  x: {
                    step: 0.05
                  },
                  y: {
                    step: 0.05
                  },
                  z: function(x, y) {
                    if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) {
                      return "-";
                    }
                    return Math.sin(x * Math.PI) * Math.sin(y * Math.PI);
                  }
                }
              }
            ]
          };`;
          chart.render(options);
        }
      }
    }
  ]
});
```

用 `options = ` 的方式定义，这种方式和静态绘制的区别是 options 可以含有函数调用。

# chart.dispatchAction(args)

用于触发事件：

```js
chart.dispatchAction({
  type: "dataZoom",
  start: 20,
  end: 30
});
```

# chart.getWidth(handler)

用于获取视图的宽度：

```js
let width = await chart.getWidth();
```

# chart.getHeight(handler)

用于获取视图的高度：

```js
let height = await chart.getHeight();
```

# chart.getOption(handler)

用于获取当前的 options:

```js
let options = await chart.getOption();
```

# chart.resize($size)

用于更新视图的大小：

```js
chart.resize($size(100, 100));
```

# chart.showLoading()

显示加载状态：

```js
chart.showLoading();
```

# chart.hideLoading()

隐藏加载状态：

```js
chart.hideLoading();
```

# chart.clear()

清除当前绘制的图表：

```js
chart.clear();
```

# event: rendered

`rendered` 会在绘制时被调用：

```js
events: {
  rendered: () => {

  }
}
```

# event: finished

`finished` 会在绘制完成时被调用：

```js
events: {
  finished: () => {

  }
}
```

# WebView

当前图表控件使用 WebView 封装 [ECharts](http://www.echartsjs.com/index.html) 来实现，所以支持所有 WebView 支持的特性，例如 JavaScript 注入以及 $notify 机制，详情请参考[网页视图](component/web.md)。

更多样例：https://github.com/cyanzhong/xTeko/tree/master/extension-demos/charts
```

## docs/component/code.md

```markdown
# type: "code"

用于对代码进行高亮，以及简单的编辑，支持常见的几十种编程语言以及主题：

```js
$ui.render({
  views: [
    {
      type: "code",
      props: {
        text: "const value = 100"
      },
      layout: $layout.fill
    }
  ]
});
```

可以通过下面这些参数来配置代码编辑视图：

属性 | 类型 | 默认值 | 说明
---|---|---|---
language | string | javascript | 编程语言类型
theme | string | nord | 编辑器主题
darkKeyboard | bool | true | 是否使用黑色键盘
adjustInsets | bool | true | 是否根据键盘调整 insets
lineNumbers | bool | false | 是否显示行号
invisibles | bool | false | 是否显示不可见字符
linePadding | number | null | 自定义行高
keys | [string] | null | 自定义键盘工具栏

请注意，这些参数必须在初始化视图时确定，不能通过动态设置的方式覆盖。

与此同时，此组件继承自 Text View，所以 [`type: text`](component/text.md) 支持的功能它都支持。

例如，你可以通过 `editable: false` 来将视图设置为只读，不可编辑。可以通过 `text` 属性来读写代码内容：

```js
const view = $("codeView");
const code = view.text;
view.text = "console.log([1, 2, 3])";
```

当然，也支持全部 text 组件支持的事件：

```js
$ui.render({
  views: [
    {
      type: "code",
      props: {
        text: "const value = 100"
      },
      layout: $layout.fill,
      events: {
        changed: sender => {
          console.log("code changed");
        }
      }
    }
  ]
});
```

# props: language

`code` 组件的实现基于开源项目 [highlightjs](https://highlightjs.org/)，支持的编程语言名字列表可以在这里找到：https://github.com/highlightjs/highlight.js/tree/master/src/languages

例如需要对 Python 进行高亮：

```js
props: {
  language: "python"
}
```

# props: theme

`code` 组件的实现基于开源项目 [highlightjs](https://highlightjs.org/)，支持的主题列表可以在这里找到：https://github.com/highlightjs/highlight.js/tree/master/src/styles

例如需要使用 `atom-one-light` 主题：

```js
props: {
  theme: "atom-one-light"
}
```

# props: adjustInsets

在很多时候，我们需要处理键盘遮挡输入区域的问题，比如全屏的编辑页面。`code` 组件自动为你处理了这件事情，它会根据键盘的高度自动调整自己的 insets，以避免输入区域被遮挡。

自动实现的逻辑很难做到完美，当你不需要这个功能，可以通过 `adjustInsets: false` 关闭。

# props: keys

代码视图默认提供一个键盘工具栏，如果需要根据不同的编程语言自定义，可以这样：

```js
$ui.render({
  views: [
    {
      type: "code",
      props: {
        language: "markdown",
        keys: [
          "#",
          "-",
          "*",
          "`",
          //...
        ]
      },
      layout: $layout.fill
    }
  ]
});
```

如果想要完全去除自定义工具栏，可以通过覆盖 text view 的 `accessoryView` 实现。
```

## docs/component/date-picker.md

```markdown
# type: "date-picker"

`date-picker` 用于创建一个日期选择器：

```js
{
  type: "date-picker",
  layout: function(make) {
    make.left.top.right.equalTo(0)
  }
}
```

创建一个默认的日期选择器。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
date | object | 读写 | 当前值
min | object | 读写 | 最小值
max | object | 读写 | 最大值
mode | number | 读写 | [请参考](https://developer.apple.com/documentation/uikit/uidatepickermode)
interval | number | 读写 | 步长（分钟）

# events: changed

`changed` 事件在当前值变化时回调：

```js
changed: function(sender) {
  
}
```
```

## docs/component/gallery.md

```markdown
# type: "gallery"

`gallery` 用于创建一个横向滚动的分页器，可以滚动显示：

```js
{
  type: "gallery",
  props: {
    items: [
      {
        type: "image",
        props: {
          src: "https://images.apple.com/v/iphone/home/v/images/home/limited_edition/iphone_7_product_red_large_2x.jpg"
        }
      },
      {
        type: "image",
        props: {
          src: "https://images.apple.com/v/iphone/home/v/images/home/airpods_large_2x.jpg"
        }
      },
      {
        type: "image",
        props: {
          src: "https://images.apple.com/v/iphone/home/v/images/home/apple_pay_large_2x.jpg"
        }
      }
    ],
    interval: 3,
    radius: 5.0
  },
  layout: function(make, view) {
    make.left.right.inset(10)
    make.centerY.equalTo(view.super)
    make.height.equalTo(320)
  }
}
```

创建一个有三个分页的视图，显示三张图片。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
items | object | 只写 | 每个分页项
page | number | 读写 | 当前页数
interval | number | 读写 | 自动播放间隔，为 0 表示不播放
pageControl | $view | 只读 | 页面控制组件

# events

页面改变时将会调用 changed:

```js
changed: function(sender) {
  
}
```

# 获取子 view

在 gallery 里面获取子 view 请使用以下方法：

```js
const views = $("gallery").itemViews; // All views
const view = $("gallery").viewWithIndex(0); // The first view
```

# 滚动到某一页

设置 `page` 将直接切换到某一页，如果需要带着动画滚动过去，请使用：

```js
$("gallery").scrollToPage(index);
```
```

## docs/component/gradient.md

```markdown
# type: "gradient"

用于创建一个渐变图层：

```js
$ui.render({
  props: {
    bgcolor: $color("white")
  },
  views: [
    {
      type: "gradient",
      props: {
        colors: [$color("red"), $color("clear"), $color("blue")],
        locations: [0.0, 0.5, 1.0],
        startPoint: $point(0, 0),
        endPoint: $point(1, 1)
      },
      layout: function(make, view) {
        make.left.top.equalTo(0)
        make.size.equalTo($size(100, 100))
      }
    }
  ]
})
```

这个控件的实现与 iOS 的 CAGradientLayer 完全一致，请参考：https://developer.apple.com/documentation/quartzcore/cagradientlayer

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
colors | array | 读写 | 颜色
locations | array | 读写 | 控制点
startPoint | $point | 读写 | 起始点
endPoint | $point | 读写 | 终止点
```

## docs/component/image.md

```markdown
# type: "image"

`image` 用于显示图片，可以加载远程的图片或本地图片：

```js
{
  type: "image",
  props: {
    src: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg"
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
    make.size.equalTo($size(100, 100))
  }
}
```

从远程加载一张图片，屏幕上尺寸是 100*100。

src 同样也支持 `data:image` 开头的 base64 字符串格式，例如：

```js
{
  type: "image",
  props: {
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAASCAMAAAB7LJ7rAAAANlBMVEUAAABnZ2dmZmZmZmZnZ2dmZmZmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhnZ2dnZ2dubm5paWlmZmbvpwLOAAAAEXRSTlMA9h6lQ95r4cmLdHNbTzksJ9o8+Y0AAABcSURBVCjPhc1JDoAwFAJQWus8cv/LqkkjMXwjCxa8BfjLWuI9L/nqhmwiLYnpAMjqpuQMDI+bcgNyW921A+Sxyl3NXeWu7lL3WOXS0Ck1N3WXut/HEz6z92l8Lyf1mAh1wPbVFAAAAABJRU5ErkJggg=="
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
    make.size.equalTo($size(100, 100))
  }
}
```

src 还支持以 `shared://` 或 `drive://` 开头的文件。

另外 image 也支持显示 JSBox 自带的 icon，[请参考](data/method.md?id=iconcode-color-size)。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
src | string | 只写 | 图片地址
source | object | 读写 | 图片加载信息
symbol | string | 读写 | SF symbols 名称
data | $data | 只写 | 二进制数据
size | $size | 只读 | 图片大小
orientation | number | 只读 | 图片方向
info | object | 只读 | 图片信息
scale | number | 只读 | 图片比例

# props: source

从 v1.55.0 开始，可以通过 `source` 对图片进行更详细的设定，例如：

```js
source: {
  url: url,
  placeholder: image,
  header: {
    "key1": "value1",
    "key2": "value2",
  }
}
```

# 双指缩放

从 `v1.56.0` 开始，可以很轻松地创建支持双指缩放的图片：

```js
$ui.render({
  views: [
    {
      type: "scroll",
      props: {
        zoomEnabled: true,
        maxZoomScale: 3, // Optional, default is 2,
        doubleTapToZoom: false // Optional, default is true
      },
      layout: $layout.fill,
      views: [
        {
          type: "image",
          props: {
            src: "https://..."
          },
          layout: $layout.fill
        }
      ]
    }
  ]
});
```

只需要用 `scroll` 组件作为容器，并设置为 `zoomEnabled` 即可。

# alwaysTemplate

返回一个使用 `template` 模式渲染的图片，结合 `tintColor` 可以用于对模板图片进行着色：

```js
{
  type: "image",
  props: {
    tintColor: $color("red"),
    image: rawImage.alwaysTemplate
  }
}
```

上述 `rawImage` 是原始的图片。

# alwaysOriginal

与 `alwaysTemplate` 相对于，此属性返回的图片总是渲染自身的颜色，而非 `tintColor`。

# resized($size)

返回一个重新调整大小后的图片：

```js
const resizedImage = image.resized($size(60, 60));
```

# resizableImage(args)

返回一个可伸缩的图片：

```js
const resizableImage = image.resizableImage($insets(10, 10, 10, 10));
```

也可以指定填充模式为 `tile` (默认为 stretch):

```js
const resizableImage = image.resizableImage({
  insets: $insets(10, 10, 10, 10),
  mode: "tile"
});
```
```

## docs/component/input.md

```markdown
# type: "input"

`input` 可以创建一个输入框，用于处理单行的文本输入：

```js
{
  type: "input",
  props: {
    type: $kbType.search,
    darkKeyboard: true,
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
    make.size.equalTo($size(100, 32))
  }
}
```

在画布中显示一个搜索键盘，同时是黑色的主题。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
type | $kbType | 读写 | 类型
darkKeyboard | boolean | 读写 | 黑色主题
text | string | 读写 | 文本内容
styledText | object | 读写 | 带格式的文本，[参考](component/text.md?id=styledtext)
textColor | $color | 读写 | 文本颜色
font | $font | 读写 | 字体
align | $align | 读写 | 对齐方式
placeholder | string | 读写 | placeholder
clearsOnBeginEditing | boolean | 读写 | 开始时清除文本
autoFontSize | boolean | 读写 | 是否动态调整字体大小
editing | boolean | 只读 | 是否在编辑
secure | boolean | 读写 | 是否密码框

# focus()

获取焦点，弹出键盘。

# blur()

模糊焦点，收起键盘。

# events: changed

`changed` 事件可以在文本变化时回调：

```js
changed: function(sender) {

}
```

# events: returned

`returned` 事件在回车键按下时调用：

```js
returned: function(sender) {

}
```

# events: didBeginEditing

`didBeginEditing` 事件在开始编辑时调用：

```js
didBeginEditing: function(sender) {

}
```

# events: didEndEditing

`didEndEditing` 事件在结束编辑时调用：

```js
didEndEditing: function(sender) {
  
}
```

# 自定义键盘工具栏

通过这样的方式自定义键盘工具栏：

```js
$ui.render({
  views: [
    {
      type: "input",
      props: {
        accessoryView: {
          type: "view",
          props: {
            height: 44
          },
          views: [

          ]
        }
      }
    }
  ]
});
```

# 自定义键盘视图

通过这样的方式自定义键盘视图：

```js
$ui.render({
  views: [
    {
      type: "input",
      props: {
        keyboardView: {
          type: "view",
          props: {
            height: 267
          },
          views: [

          ]
        }
      }
    }
  ]
});
```

# $input.text(object)

文字输入也可以使用这个快捷方法，将会直接弹出键盘以供输入：

```js
$input.text({
  type: $kbType.number,
  placeholder: "Input a number",
  handler: function(text) {

  }
})
```

# $input.speech(object)

使用系统听写接口输入文字（语音转文字）：

```js
$input.speech({
  locale: "en-US", // 可选
  autoFinish: false, // 可选
  handler: function(text) {

  }
})
```
```

## docs/component/label.md

```markdown
# type: "label"

`label` 用于显示一段不可编辑的文字，是最常用的控件之一：

```js
{
  type: "label",
  props: {
    text: "Hello, World!",
    align: $align.center
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
  }
}
```

在画布中显示一个 `Hello, World!`。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
text | string | 读写 | 文字内容
styledText | object | 读写 | 带格式的文本，[参考](component/text.md?id=styledtext)
font | $font | 读写 | 字体
textColor | $color | 读写 | 文字颜色
shadowColor | $color | 读写 | 阴影颜色
align | $align | 读写 | 对齐方式
lines | number | 读写 | 显示行数（0 表示任意多行）
autoFontSize | boolean | 读写 | 是否动态调整字体大小
```

## docs/component/list.md

```markdown
# type: "list"

`list` 用于创建一个列表，是一个稍微有一点点复杂的结构（其实很复杂），一个最简单的 list 可以是这样：

```js
{
  type: "list",
  props: {
    data: ["JavaScript", "Swift"]
  },
  layout: $layout.fill,
}
```

这会创建一个只有一个 `section` 的，每一行都是文字的列表。

如果你需要创建多个 section，只需要把 `data` 字段变成一个这样的结构：

```js
{
  type: "list",
  props: {
    data: [
      {
        title: "Section 0",
        rows: ["0-0", "0-1", "0-2"]
      },
      {
        title: "Section 1",
        rows: ["1-0", "1-1", "1-2"]
      }
    ]
  },
  layout: $layout.fill,
}
```

这会创建两个 section，每个 section 有三行，用什么样的形式取决于你想要的风格。

以上的每一行数据都是简单的一个 string，实际上 list 的每一行都是可以自定义的，我们称为 `template`（在 props 里）：

```js
template: {
  props: {
    bgcolor: $color("clear")
  },
  views: [
    {
      type: "label",
      props: {
        id: "label",
        bgcolor: $color("#474b51"),
        textColor: $color("#abb2bf"),
        align: $align.center,
        font: $font(32)
      },
      layout: $layout.fill
    }
  ]
}
```

你已经发现了， template 的描述和定义 view 没有任何区别，只不过 JSBox 会用它来渲染 list 的每一行视图，当然这样的话 data 的内容也就不仅仅是一个 string 了：

```js
data: [
  {
    label: {
      text: "Hello"
    }
  },
  {
    label: {
      text: "World"
    }
  }
]
```

事情是这样发生的，data 里面的每个结构对应一行数据，使用 `id: object` 的方式进行映射，例如上面的 `label`，映射的是 label 这种控件可以支持的全部 `props`，上面的 text 就是设置他的文本内容。

有了 template 这样的构造和 data 映射机制，基本上我们可以构造任何我们想要的列表项，不要忘了，即便是在 template 的机制下，也还是支持单 section 和多 section 两种构造方式。

# header & footer

`header` 和 `footer` 是放在头部和尾部的自定义 view，是可选项（在 props 里）：

```js
footer: {
  type: "label",
  props: {
    height: 20,
    text: "Write the Code. Change the world.",
    textColor: $color("#AAAAAA"),
    align: $align.center,
    font: $font(12)
  }
}
```

请在 props 里面指定他的高度 `height`。

# 静态 cells

在 list 里面你也许希望有些行是固定的，不希望以 template 来初始化并进行复用，这是可以的，而且很容易做到。

唯一需要做的是，在设置 `data` 的时候，把某一行的数据替换成一个 view 的定义，他可以和其他的数据混合在一起：

```js
data: [
  {
    title: "System (Text)",
    rows: [
      {
        type: "button",
        props: {
          title: "Button",
          selectable: false
        },
        layout: function(make, view) {
          make.center.equalTo(view.super)
          make.width.equalTo(64)
        },
        events: {
          tapped: function(sender) {
            $ui.toast("Tapped")
          }
        }
      }
    ]
  },
  {
    title: "System (Contact Add)",
    rows: [
      {
        type: "button",
        props: {
          type: 5
        },
        layout: $layout.center
      }
    ]
  }
]
```

其中 `selectable` 属性表示该行是否可以被选中，默认为 false。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
style | number | 只写 | 样式 0 ~ 2
data | object | 读写 | 数据源
separatorInset | $insets | 读写 | 分割线边距
separatorHidden | boolean | 读写 | 隐藏分割线
separatorColor | $color | 读写 | 分割线颜色
header | object | 读写 | header
footer | object | 读写 | footer
rowHeight | number | 只写 | 行高
autoRowHeight | boolean | 只写 | 是否自动行高
estimatedRowHeight | number | 只写 | 估算的行高
sectionTitleHeight | number | 只写 | section 标题高度
selectable | bool | 只写 | 行是否可被选中
stickyHeader | boolean | 只写 | section header 是否固定
reorder | boolean | 读写 | 是否可以长按排序
crossSections | boolean | 读写 | 长按排序时是否可以跨 section
hasActiveAction | boolean | 只读 | 是否正在使用 action

# props: actions

`actions` 用于定义滑动操作的按钮：

```js
actions: [
  {
    title: "delete",
    color: $color("gray"), // default to gray
    handler: function(sender, indexPath) {

    }
  },
  {
    title: "share",
    handler: function(sender, indexPath) {

    }
  }
]
```

定义了两个滑动操作选项，标题分别是 `delete` 和 `share`。

可以通过 `swipeEnabled` 函数来决定某一行是否能被滑动：

```js
swipeEnabled: function(sender, indexPath) {
  return indexPath.row > 0;
}
```

以上代码决定了第一行不能被滑动。

# object($indexPath)

返回在 indexPath 位置的数据：

```js
const data = tableView.object($indexPath(0, 0));
```

# insert(object)

插入新的数据：

```js
// indexPath 和 index 可选其一，value 要符合 data 元素的定义
tableView.insert({
  indexPath: $indexPath(0, 0),
  value: "Hey!"
})
```

# delete(object)

删除数据：

```js
// object 可以是 indexPath 或者 index
tableView.delete(0)
```

# cell($indexPath)

返回在 indexPath 位置的视图：

```js
const cell = tableView.cell($indexPath(0, 0));
```

# events: rowHeight

`rowHeight` 可以动态地为每一行指定行高，会覆盖 props 里面那个静态值：

```js
rowHeight: function(sender, indexPath) {
  if (indexPath.row == 0) {
    return 88.0
  } else {
    return 44.0
  }
}
```

# events: sectionTitleHeight

`sectionTitleHeight` 可以动态地为每个 section 指定标题高度，会覆盖 props 里面那个静态值：

```js
sectionTitleHeight: (sender, section) => {
  if (section == 0) {
    return 30;
  } else {
    return 40;
  }
}
```

# events: didSelect

`didSelect` 在点击某一行时回调：

```js
didSelect: function(sender, indexPath, data) {

}
```

# events: didLongPress

`didLongPress` 在长按某一行时回调：

```js
didLongPress: function(sender, indexPath, data) {

}
```

# events: forEachItem

按照顺序获得列表的每一项：

```js
forEachItem: function(view, indexPath) {
  
}
```

# 自动高度

很多时候我们需要动态计算行高，例如每行的文本可能不一样，但我们希望全部展示出来。

从 v2.5.0 开始，list view 支持自动高度，只需指定 `autoRowHeight` 和 `estimatedRowHeight`，并设置好相关约束：

```js
const sentences = [
  "Although moreover mistaken kindness me feelings do be marianne.",
  "Effects present letters inquiry no an removed or friends. Desire behind latter me though in. Supposing shameless am he engrossed up additions. My possible peculiar together to. Desire so better am cannot he up before points. Remember mistaken opinions it pleasure of debating. Court front maids forty if aware their at. Chicken use are pressed removed.",
  "He went such dare good mr fact. The small own seven saved man age ﻿no offer. Suspicion did mrs nor furniture smallness. Scale whole downs often leave not eat. An expression reasonably cultivated indulgence mr he surrounded instrument. Gentleman eat and consisted are pronounce distrusts.",
];

$ui.render({
  views: [
    {
      type: "list",
      props: {
        autoRowHeight: true,
        estimatedRowHeight: 44,
        template: [
          {
            type: "image",
            props: {
              id: "icon",
              symbol: "text.bubble"
            },
            layout: (make, view) => {
              make.left.equalTo(10);
              make.size.equalTo($size(24, 24));
              make.centerY.equalTo(view.super);
            }
          },
          {
            type: "label",
            props: {
              id: "label",
              lines: 0
            },
            layout: (make, view) => {
              const insets = $insets(10, 44, 10, 10);
              make.edges.equalTo(view.super).insets(insets);
            }
          }
        ],
        data: sentences.map(text => {
          return {
            "label": {text}
          }
        })
      },
      layout: $layout.fill
    }
  ]
});
```

简单的用来显示文本的列表，也支持自动高度：

```js
const sentences = [
  "Although moreover mistaken kindness me feelings do be marianne.",
  "Effects present letters inquiry no an removed or friends. Desire behind latter me though in. Supposing shameless am he engrossed up additions. My possible peculiar together to. Desire so better am cannot he up before points. Remember mistaken opinions it pleasure of debating. Court front maids forty if aware their at. Chicken use are pressed removed.",
  "He went such dare good mr fact. The small own seven saved man age ﻿no offer. Suspicion did mrs nor furniture smallness. Scale whole downs often leave not eat. An expression reasonably cultivated indulgence mr he surrounded instrument. Gentleman eat and consisted are pronounce distrusts.",
];

$ui.render({
  views: [
    {
      type: "list",
      props: {
        autoRowHeight: true,
        data: sentences
      },
      layout: $layout.fill
    }
  ]
});
```

# 长按排序

list 组件支持让用户通过长按来进行排序，需要实现以下内容：

首先需要在 `props` 里面设置 `reorder: true` 来打开这个功能：

```js
props: {
  reorder: true
}
```

其次，list 组件提供了三个方法来对用户排序的结果进行处理：

用户触发了长按排序操作：

```js
reorderBegan: function(indexPath) {

}
```

用户把一个列表项从 `fromIndex` 移动到了 `toIndex`:

```js
reorderMoved: function(fromIndexPath, toIndexPath) {
  // Reorder your data source here
}
```

用户结束了列表项的重新排序：

```js
reorderFinished: function(data) {
  // Save your data source here
}
```

可以通过 `canMoveItem` 来决定是否能被移动：

```js
canMoveItem: function(sender, indexPath) {
  return indexPath.row > 0;
}
```

上述代码将会使得除了第一个以外的内容都可以被长按排序。

简单说，我们通常需要在 `reorderMoved` 和 `reorderFinished` 里面对 `data` 进行一些处理。

请参考这个例子获得更多信息：https://github.com/cyanzhong/xTeko/blob/3ac0d3f5ac552a1c72ea39d0bd1099fd02f5ca70/extension-scripts/xteko-menu.js

# 分页加载

先看一个例子：

```js
let data = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];
$ui.render({
  views: [
    {
      type: "list",
      props: { data },
      layout: $layout.fill,
      events: {
        didReachBottom: function(sender) {
          $ui.toast("fetching...")
          $delay(1.5, () => {
            sender.endFetchingMore()
            data = data.concat(data.map(item => {
              return (parseInt(item) + 15).toString()
            }))
            $("list").data = data
          })
        }
      }
    }
  ]
})
```

当用户将 list 滚动到底部的时候，会触发 `didReachBottom` 方法，在这里加载你的下一页数据。

与此同时，用户会看到界面处于加载中的一个状态，此举是避免用户再次触发一次 `didReachBottom`。

当你数据加载完成之后，先调用 `endFetchingMore` 方法结束这个状态，然后对数据源进行更新。

最后，将数据源更新到 list 的 data 属性，即将新的内容显示到列表上。

# setEditing

结束 list 划出的状态：

```js
$("list").setEditing(false)
```

# scrollTo

滚动到某行：

```js
$("list").scrollTo({
  indexPath: $indexPath(0, 0),
  animated: true // 默认为 true
})
```

# 最后

此外，`list` 也是继承自 `scroll`，也会拥有 scroll 有的全部事件回调。

可见 list 并不简单，可以参考 `uikit-list.js` 和 `uikit-catalog.js` 获得更多信息。
```

## docs/component/lottie.md

```markdown
# type: "lottie"

`lottie` 用于创建一个 [Lottie](http://airbnb.io/lottie/) 控件：

```js
{
  type: "lottie",
  props: {
    src: "assets/lottie-btn.json",
  },
  layout: (make, view) => {
    make.size.equalTo($size(100, 100));
    make.center.equalTo(view.super);
  }
}
```

`src` 可以是 bundle 内的路径，也可以是一个 http 地址，同时，你还可以通过 `json` 或 `data` 来加载 Lottie：

```js
// JSON
$("lottie").json = {};
// Data
$("lottie").data = $file.read("assets/lottie-btn.json");
```

# lottie.play(args?)

播放动画：

```js
$("lottie").play();
```

注册回调消息：

```js
$("lottie").play({
  handler: finished => {

  }
});
```

控制起始结束帧数：

```js
$("lottie").play({
  fromFrame: 0, // Optional
  toFrame: 0,
  handler: finished => {
    // Optional
  }
});
```

控制起始结束进度：

```js
$("lottie").play({
  fromProgress: 0, // Optional
  toProgress: 0.5,
  handler: finished => {
    // Optional
  }
});
```

使用 Promise：

```js
let finished = await $("lottie").play({ toProgress: 0.5, async: true });
```

# lottie.pause()

暂停动画：

```js
$("lottie").pause();
```

# lottie.stop()

停止动画：

```js
$("lottie").stop();
```

# lottie.update()

强制重画当前帧：

```js
$("lottie").update();
```

# lottie.progressForFrame(frame)

获得帧对应的进度：

```js
let progress = $("lottie").progressForFrame(0);
```

# lottie.frameForProgress(progress)

获得进度对应的帧：

```js
let frame = $("lottie").frameForProgress(0.5);
```

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
json | json | 只写 | 使用 json 加载 Lottie
data | $data | 只写 | 使用 data 加载 Lottie
src | string | 只写 | 使用路径或网址加载 Lottie
playing | bool | 只读 | 是否正在播放
loop | bool | 读写 | 是否循环播放
autoReverse | bool | 读写 | 是否自动反转
progress | number | 读写 | 播放进度
frameIndex | number | 读写 | 播放帧数
speed | number | 读写 | 播放速度
duration | number | 只读 | 动画时长

请参考这个项目来了解更多：https://github.com/cyanzhong/xTeko/tree/master/extension-demos/lottie-example
```

## docs/component/map.md

```markdown
# type: "map"

`map` 用于创建一个地图，目前只是简单地支持在地图上显示位置：

```js
{
  type: "map",
  props: {
    location: {
      lat: 31.2990,
      lng: 120.5853
    }
  },
  layout: $layout.fill
}
```

在地图上显示苏州。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
location | object | 只写 | 用户位置

在后续的更新中将会添加更多细节，例如导航。
```

## docs/component/markdown.md

```markdown
# type: "markdown"

用来显示 Markdown 格式的文本，当你需要显示富文本内容时，除了使用 HTML 以外，Markdown 是一个不错的选择：

```js
$ui.render({
  views: [
    {
      type: "markdown",
      props: {
        content: "# Hello, *World!*",
        style: // optional, custom style sheet
        `
        body {
          background: #f0f0f0;
        }
        `
      },
      layout: $layout.fill
    }
  ]
})
```

属性 | 类型 | 读写 | 说明
---|---|---|---
webView | $view | r | webView
content | string | rw | 内容
scrollEnabled | bool | rw | 是否滚动
style | string | rw | 自定义样式
```

## docs/component/matrix.md

```markdown
# type: "matrix"

`matrix` 用于创建一个矩阵：

```js
{
  type: "matrix",
  props: {
    columns: 4,
    itemHeight: 88,
    spacing: 5,
    template: {
      props: {},
      views: [
        {
          type: "label",
          props: {
            id: "label",
            bgcolor: $color("#474b51"),
            textColor: $color("#abb2bf"),
            align: $align.center,
            font: $font(32)
          },
          layout: $layout.fill
        }
      ]
    }
  },
  layout: $layout.fill
}
```

实际上，写过 iOS 的朋友应该知道，在 iOS 原生控件里面，上面提到的 `list` 其实是 `UITableView`，但是我觉得 tableView 这个名字起得不好，明明只能是单列的，所以在 JSBox 里面就叫 list。

在 iOS 6 的时候 Apple 引入了 `UICollectionView` 用于实现类似网格的布局。

`collection` 这个单词太长了，而 `grid` 又不够酷，所以在 JSBox 里面网格布局称为 `matrix`，这也是电影黑客帝国的英文名。

和 list 的构造和逻辑基本一样，但是布局策略稍有不同，因为是矩阵的形式，所以多了 `itemSize`, `spacing` 和 `columns` 等概念。

同样，matrix 也是支持单 section 和多 section 的构造形式，虽然在大部分时候我们用一个 section 就够了。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
data | object | 读写 | 数据源
spacing | number | 只写 | 方块边距
itemSize | $size | 只写 | 方块大小
autoItemSize | boolean | 只写 | 是否自动大小
estimatedItemSize | $size | 只写 | 估算的大小
columns | number | 只写 | 列数
square | boolean | 只写 | 是否正方形
direction | $scrollDirection | 只写 | .vertical: 纵向 .horizontal: 横向
selectable | boolean | 读写 | 是否可被选中
waterfall | boolean | 只写 | 是否瀑布流布局

请使用有限的、确定的约束条件来实现方块大小，使用 `waterfall` 时必须指定 `columns`，布局冲突将会引起应用崩溃。

# header & footer

`header` 和 `footer` 是放在头部和尾部的自定义 view，是可选项（在 props 里）：

```js
footer: {
  type: "label",
  props: {
    height: 20,
    text: "Write the Code. Change the world.",
    textColor: $color("#AAAAAA"),
    align: $align.center,
    font: $font(12)
  }
}
```

如果高度是固定的，请在 `props` 里面指定他的高度 `height`。如需动态改变高度，可在 `events` 里指定一个 `height` 函数：

```js
footer: {
  type: "label",
  props: {
    text: "Write the Code. Change the world."
  },
  events: {
    height: sender => {
      return _height;
    }
  }
}
```

需要改变高度时，修改上述 `_height` 值，然后调用 `matrix.reload()` 进行更新。若创建的视图为横向滚动，则使用 `width` 代替上述 `height` 来指定宽度。

# 动态 header 和 footer

由于 header 和 footer 在 iOS 系统是可复用的视图，仅静态设置会有一些局限性。如果您的 header 或 footer 需要实时更新数据，可以使用以下懒加载的方式：

```js
footer: sender => {
  return {
    type: "view",
    props: {}
  }
}
```

简单来说，系统会调用这个函数生成新的 header 或 footer 以更新显示。

# object($indexPath)

返回在 indexPath 位置的数据：

```js
const data = matrix.object($indexPath(0, 0));
```

# insert(object)

插入新的数据：

```js
// indexPath 和 index 可选其一
matrix.insert({
  indexPath: $indexPath(0, 0),
  value: {

  }
})
```

# delete(object)

删除一个数据：

```js
// 参数可以是 indexPath 或 index
matrix.delete($indexPath(0, 0))
```

# cell($indexPath)

返回在 indexPath 位置的元素：

```js
const cell = matrix.cell($indexPath(0, 0));
```

# events: didSelect

`didSelect` 事件在元素被点击时回调：

```js
didSelect: function(sender, indexPath, data) {

}
```

# events: didLongPress

`didLongPress` 在长按某一行时回调：

```js
didLongPress: function(sender, indexPath, data) {

}
```

同样的，matrix 也是继承自 `scroll`，所以也具有 scroll 的全部回调事件。

# events: forEachItem

按照顺序获得矩阵的每一项：

```js
forEachItem: function(view, indexPath) {
  
}
```

# events: highlighted

自定义高亮效果：

```js
highlighted: function(view) {

}
```

# events: itemSize

设置动态的 item 大小：

```js
itemSize: function(sender, indexPath) {
  var index = indexPath.item + 1;
  return $size(40 * index, 40 * index);
}
```

# scrollTo

滚动到某个元素：

```js
$("matrix").scrollTo({
  indexPath: $indexPath(0, 0),
  animated: true // 默认为 true
})
```

# 自动大小

从 v2.5.0 开始，matrix view 支持自动大小，只需指定 `autoItemSize` 和 `estimatedItemSize`，并设置好相关约束：

```js
const sentences = [
  "Although moreover mistaken kindness me feelings do be marianne.",
  "Effects present letters inquiry no an removed or friends. Desire behind latter me though in.",
  "He went such dare good mr fact.",
];

$ui.render({
  views: [
    {
      type: "matrix",
      props: {
        autoItemSize: true,
        estimatedItemSize: $size(120, 0),
        spacing: 10,
        template: {
          props: {
            bgcolor: $color("#F0F0F0")
          },
          views: [
            {
              type: "image",
              props: {
                symbol: "sun.dust"
              },
              layout: (make, view) => {
                make.centerX.equalTo(view.super);
                make.size.equalTo($size(24, 24));
                make.top.equalTo(10);
              }
            },
            {
              type: "label",
              props: {
                id: "label",
                lines: 0
              },
              layout: (make, view) => {
                make.left.bottom.inset(10);
                make.top.equalTo(44);
                make.width.equalTo(100);
              }
            }
          ]
        },
        data: sentences.map(text => {
          return {
            "label": {text}
          }
        })
      },
      layout: $layout.fill
    }
  ]
});
```

# 长按排序

matrix 组件支持让用户通过长按来进行排序，需要实现以下内容：

首先需要在 `props` 里面设置 `reorder: true` 来打开这个功能：

```js
props: {
  reorder: true
}
```

其次，matrix 组件提供了三个方法来对用户排序的结果进行处理：

用户触发了长按排序操作：

```js
reorderBegan: function(indexPath) {

}
```

用户把一个项目从 `fromIndex` 移动到了 `toIndex`:

```js
reorderMoved: function(fromIndexPath, toIndexPath) {
  // Reorder your data source here
}
```

用户结束了重新排序：

```js
reorderFinished: function(data) {
  // Save your data source here
}
```

可以通过 `canMoveItem` 来决定是否能被移动：

```js
canMoveItem: function(sender, indexPath) {
  return indexPath.row > 0;
}
```

上述代码将会使得除了第一个以外的内容都可以被长按排序。

简单说，我们通常需要在 `reorderMoved` 和 `reorderFinished` 里面对 `data` 进行一些处理。
```

## docs/component/menu.md

```markdown
# type: "tab" & type: "menu"

提供两种方式用于显示一个菜单，当项目较少时，使用 `tab`，项目较多可以滚动时，使用 `menu`：

```js
$ui.render({
  views: [
    {
      type: "menu",
      props: {
        items: ["item 1", "item 2", "item 3", "item 4", "item 5", "item 6", "item 7", "item 8", "item 9"],
        dynamicWidth: true, // dynamic item width, default is false
      },
      layout: function(make) {
        make.left.top.right.equalTo(0)
        make.height.equalTo(44)
      },
      events: {
        changed: function(sender) {
          const items = sender.items;
          const index = sender.index;
          $ui.toast(`${index}: ${items[index]}`)
        }
      }
    }
  ]
})
```

上述代码生成一个菜单，并且处理用户点击的动作。

`sender.items` 表示所有项目，`sender.index` 表示被选中的 index（从 0 开始）。

`index` 属性也可以定义初始选中：

```js
props: {
  index: 1
}
```

默认选中第二个。
```

## docs/component/picker.md

```markdown
# type: "picker"

`picker` 用于创建一个通用的数据选择器：

```js
{
  type: "picker",
  props: {
    items: Array(3).fill(Array.from(Array(256).keys()))
  },
  layout: function(make) {
    make.left.top.right.equalTo(0)
  }
}
```

上述代码会创建一个用于选择 RGB 颜色的三个滚轮，他们之间彼此的滚动是独立的。

除此之外，你也可以创建具有`级联（cascade）`关系的选择器，类似于级联表单，在创建的时候指定 `items` 的方式有所不同：

```js
items: [
  {
    title: "Language",
    items: [
      {
        title: "Web",
        items: [
          {
            title: "JavaScript"
          },
          {
            title: "PHP"
          }
        ]
      },
      {
        title: "Client",
        items: [
          {
            title: "Swift"
          },
          {
            title: "Objective-C"
          }
        ]
      }
    ]
  },
  {
    title: "Framework",
    // ...
  }
]
```

显而易见这是一个递归的结构，当用户选择了某个 `title` 之后，将会更新下一级滚轮的 `items`，要理解这个控件首先要理解级联的含义。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
data | object | 只读 | 选中的所有项
selectedRows | object | 只读 | 选中的所有序号

# events: changed

`changed` 事件在当前值变化时回调：

```js
changed: function(sender) {
  
}
```

# $picker.date(object)

创建一个日期选择器的快捷方式，参数和上面的方式相同，picker 将会直接从屏幕底部弹出。

# $picker.data(object)

创建一个通用选择器的快捷方式，参数和上面的方式相同，picker 将会直接从屏幕底部弹出。

以上两个方法的参数和之前提到的格式完全相同。

# $picker.color(object)

使用内建的颜色选择器来选择颜色：

```js
const color = await $picker.color({
  // color: aColor
});
```
```

## docs/component/progress.md

```markdown
# type: "progress"

`progress` 用于创建一个不可交互的进度条，例如用来指示下载进度：

```js
{
  type: "progress",
  props: {
    value: 0.5
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
    make.width.equalTo(100)
  }
}
```

创建一个初始值在 50% 的进度条。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
value | number | 读写 | 进度(0.0 ~ 1.0)
progressColor | $color | 读写 | 已走进度的颜色
trackColor | $color | 读写 | 进度条背景色
```

## docs/component/runtime.md

```markdown
# type: "runtime"

可以使用 Runtime 来初始化一个 view:

```js
const label = $objc("UILabel").$new();
label.$setText("Hey!");

$ui.render({
  views: [
    {
      type: "runtime",
      props: {
        view: label
      },
      layout: function(make, view) {
        make.center.equalTo(view.super);
      }
    }
  ]
});
```

通过这种方式，你可以将 JSBox 提供的组件与 Runtime 生成的组件混合在一起。
```

## docs/component/scroll.md

```markdown
# type: "scroll"

`scroll` 用于布局一系列 views 在一个滚动的容器里：

```js
{
  type: "scroll",
  layout: function(make, view) {
    make.center.equalTo(view.super)
    make.size.equalTo($size(100, 500))
  },
  views: [
    {

    },
    {

    }
  ]
}
```

其实和创建别的 views 没有什么区别，唯一的不同是这个容器是可以滚动的。

# 视图大小

`scroll` 组件的可滚动区域大小是一个复杂的话题，有两种方法来调整大小。

方法一，scroll 组件的每个子 view 都显式的设置了大小，这样 scroll 组件会自动调整自己的大小：

```js
$ui.render({
  views: [{
    type: "scroll",
    layout: $layout.fill,
    views: [{
      type: "label",
      props: {
        text,
        lines: 0
      },
      layout: function(make, view) {
        make.width.equalTo(view.super)
        make.top.left.inset(0)
        make.height.equalTo(1000)
      }
    }]
  }]
})
```

方法二，手动给 scroll 组件设置 contentSize:

```js
props: {
  contentSize: $size(0, 1000)
}
```

简而言之，`scroll` 组件的高度依赖于设置，他不能完全靠子 view 计算得到。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
contentOffset | $point | 读写 | 滚动偏移
contentSize | $size | 读写 | 滚动区域大小
alwaysBounceVertical | boolean | 读写 | 永远可以上下滚动
alwaysBounceHorizontal | boolean | 读写 | 永远可以左右滚动
pagingEnabled | boolean | 读写 | 是否分页
scrollEnabled | boolean | 读写 | 是否可以滚动
showsHorizontalIndicator | boolean | 读写 | 显示横向滚动条
showsVerticalIndicator | boolean | 读写 | 显示纵向滚动条
contentInset | $insets | 读写 | 内容边距
indicatorInsets | $insets | 读写 | 滚动条边距
tracking | boolean | 只读 | 用户是否在触摸
dragging | boolean | 只读 | 用户是否在拖动
decelerating | boolean | 只读 | 是否正在减速
keyboardDismissMode | number | 读写 | 键盘收起模式
zoomEnabled | bool | 读写 | 内置图片是否可以缩放
maxZoomScale | number | 读写 | 图片缩放最大比例
doubleTapToZoom | number | 读写 | 是否双击缩放

# beginRefreshing()

开始显示下拉刷新的加载动画。

# endRefreshing()

结束显示下拉刷新加载动画。

# resize()

根据内容自动调整可滚动区域的大小。

# updateZoomScale()

重新计算可缩放视图的最佳比例，您可能需要在屏幕旋转后调用这个方法。

# scrollToOffset($point)

滚动到一个偏移量：

```js
$("scroll").scrollToOffset($point(0, 100));
```

# events: pulled

`pulled` 方法将触发下拉刷新：

```js
pulled: function(sender) {
  
}
```

# events: didScroll

`didScroll` 在视图滚动时回调：

```js
didScroll: function(sender) {

}
```

# events: willBeginDragging

`willBeginDragging` 在用户开始拖动时回调：

```js
willBeginDragging: function(sender) {
  
}
```

# events: willEndDragging

`willEndDragging` 在将要结束拖拽时回调：

```js
willEndDragging: function(sender, velocity, target) {

}
```

其中 `target` 为滚动停下来时候的位置，可以通过返回一个 `$point` 进行覆盖：

```js
willEndDragging: function(sender, velocity, target) {
  return $point(0, 0);
}
```

# events: didEndDragging

`didEndDragging` 在已经结束拖拽时回调：

```js
didEndDragging: function(sender, decelerate) {

}
```

# events: willBeginDecelerating

`willBeginDecelerating` 在将要开始减速时回调：

```js
willBeginDecelerating: function(sender) {

}
```

# events: didEndDecelerating

`didEndDecelerating` 在结束减速时回调：

```js
didEndDecelerating: function(sender) {

}
```

# events: didEndScrollingAnimation

`didEndScrollingAnimation` 也是在结束减速时回调（不同的是他会在非人为触发的滚动时回调）：

```js
didEndScrollingAnimation: function(sender) {

}
```

# events: didScrollToTop

`didScrollToTop` 在滚动到顶部时回调：

```js
didScrollToTop: function(sender) {

}
```

# Auto Layout

要让 Auto Layout 对 scrollView 正常工作有些困难，我们推荐通过 `layoutSubviews` 来解决某些问题：

```js
const contentHeight = 1000;
$ui.render({
  views: [
    {
      type: "scroll",
      layout: $layout.fill,
      events: {
        layoutSubviews: sender => {
          $("container").frame = $rect(0, 0, sender.frame.width, contentHeight);
        }
      },
      views: [
        {
          type: "view",
          props: {
            id: "container"
          },
          views: [
            {
              type: "view",
              props: {
                bgcolor: $color("red")
              },
              layout: (make, view) => {
                make.left.top.right.equalTo(0);
                make.height.equalTo(300);
              }
            }
          ]
        }
      ]
    }
  ]
});
```

也即，向 scrollView 添加一个用于布局的子 view，该子 view 通过 layoutSubviews 设置 frame，然后在上面添加的 view 就可以使用 Auto Layout 了。了解更多：https://developer.apple.com/library/archive/technotes/tn2154/_index.html
```

## docs/component/slider.md

```markdown
# type: "slider"

`slider` 用于创建一个可拖动的进度选择器：

```js
{
  type: "slider",
  props: {
    value: 0.5,
    max: 1.0,
    min: 0.0
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
    make.width.equalTo(100)
  }
}
```

将会创建一个取值范围为 0.0 ~ 1.0 的选择器，初始值是 0.5。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
value | number | 读写 | 当前值
min | number | 读写 | 最小值
max | number | 读写 | 最大值
continuous | boolean | 读写 | 是否连续
minColor | $color | 读写 | 左边颜色
maxColor | $color | 读写 | 右边颜色
thumbColor | $color | 读写 | 滑块颜色

# events: changed

`changed` 事件在数值变化时回调：

```js
changed: function(sender) {

}
```
```

## docs/component/spinner.md

```markdown
# type: "spinner"

`spinner` 用于创建一个 loading view：

```js
{
  type: "spinner",
  props: {
    loading: true
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
  }
}
```

将会创建一个初始状态是开启的开关。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
loading | boolean | 读写 | 是否加载中
color | $color | 读写 | 颜色
style | number | 读写 | 0 ~ 2 表示样式

# start()

开始加载，等同于 `spinner.loading = true`。

# stop()

结束加载，等同于 `spinner.loading = false`。

# toggle()

切换状态，等同于 `spinner.loading = !spinner.loading`。
```

## docs/component/stack.md

```markdown
# type: "stack"

这是一种特殊的视图，它本身并不渲染任何内容，而仅仅是用作对其子 view 自动布局。

请注意，JSBox 的 stack view 完全基于 `UIStackView`，所以为了更好地理解这一节的内容，请先阅读 Apple 的官方文档：https://developer.apple.com/documentation/uikit/uistackview

# 概览

请先看一个 Stack View 的简单样例：

```js
$ui.render({
  views: [
    {
      type: "stack",
      props: {
        spacing: 10,
        distribution: $stackViewDistribution.fillEqually,
        stack: {
          views: [
            {
              type: "label",
              props: {
                text: "Left",
                align: $align.center,
                bgcolor: $color("silver")
              }
            },
            {
              type: "label",
              props: {
                text: "Center",
                align: $align.center,
                bgcolor: $color("aqua")
              }
            },
            {
              type: "label",
              props: {
                text: "Right",
                align: $align.center,
                bgcolor: $color("lime")
              }
            }
          ]
        }
      },
      layout: $layout.fill
    }
  ]
});
```

如果你希望一些视图被 stack 自动布局，应该把它们放到 `stack` 里面，而不是直接放在 `views` 这个节点下面。

另外，你可以通过 `axis`, `distribution`, `alignment`, 和 `spacing` 等属性来控制布局策略。

# props: axis

`axis` 属性可以用来控制 stack 的布局方向，支持竖排或者横排，可选值：

```js
- $stackViewAxis.horizontal
- $stackViewAxis.vertical
```

# props: distribution

`distribution` 属性 stack 在 axis 方向上以何种策略分布，可选值：

```js
- $stackViewDistribution.fill
- $stackViewDistribution.fillEqually
- $stackViewDistribution.fillProportionally
- $stackViewDistribution.equalSpacing
- $stackViewDistribution.equalCentering
```

# props: alignment

`alignment` 属性决定了 stack 上的对齐方式，可选值：

```js
- $stackViewAlignment.fill
- $stackViewAlignment.leading
- $stackViewAlignment.top
- $stackViewAlignment.firstBaseline
- $stackViewAlignment.center
- $stackViewAlignment.trailing
- $stackViewAlignment.bottom
- $stackViewAlignment.lastBaseline
```

# props: spacing

`spacing` 属性决定了 stack 上各个子 view 之间的间距，应该填入一个数字，也可以使用下面这两个常量：

```js
- $stackViewSpacing.useDefault
- $stackViewSpacing.useSystem
```

# props: isBaselineRelative

`isBaselineRelative` 属性决定了垂直方向上的 spacing 是否基于 baseline，应该填入一个布尔值。

# props: isLayoutMarginsRelative

`isLayoutMarginsRelative` 属性决定了 stack 的布局策略是否基于 layoutMargins，应该填入一个布尔值。

# 动态改变一个视图

在视图初始化之后，你可以通过下面的方式动态改变他们：

```js
const stackView = $("stackView");
const views = stackView.stack.views;
views[0].hidden = true;

// This hides the first view in the stack
```

# 添加一个视图

除了在初始化的时候填入 `stack.views`，你还可以动态的添加一个视图到 stack：

```js
const stackView = $("stackView");
stackView.stack.add(newView);

// newView can be created with $ui.create
```

# 移除一个视图

可以通过这样的方式移除一个视图：

```js
const stackView = $("stackView");
stackView.stack.remove(existingView);

// existingView can be retrieved with id
```

# 插入一个视图

向 stack 插入一个视图到 index：

```js
const stackView = $("stackView");
stackView.stack.insert(newView, 2);
```

# 设置视图间距

Stack 视图会自动管理间距，你也可以为某个特定的视图自定义间距：

```js
const stackView = $("stackView");
stackView.stack.setSpacingAfterView(arrangedView, 20);

// arrangedView must be a view that is contained in the stack
```

# 获得视图间距

获得某个特定视图之后的间距：

```js
const stackView = $("stackView");
const spacing = stackView.stack.spacingAfterView(arrangedView);

// arrangedView must be a view that is contained in the stack
```

# 示例代码

相较于其他类型的视图，stack view 并不那么容易理解，所以我们构建了一个示例项目，方便让你理解上述的这些属性是如何工作的：https://github.com/cyanzhong/xTeko/blob/master/extension-demos/stack-view
```

## docs/component/stepper.md

```markdown
# type: "stepper"

`stepper` 用于创建控制加减的控件：

```js
{
  type: "stepper",
  props: {
    max: 10,
    min: 1,
    value: 5
  },
  layout: function(make, view) {
    make.centerX.equalTo(view.super)
    make.top.equalTo(24)
  },
  events: {
    changed: function(sender) {

    }
  }
}
```

创建一个取值范围 1 ~ 10，初始值是 5 的步进器。

> 步进器仅显示一个加减控件，你可以用 label 组件显示其数值。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
value | number | 读写 | 当前数值
min | number | 读写 | 最小值
max | number | 读写 | 最大值
step | number | 读写 | 步长
autorepeat | boolean | 读写 | 响应长按
continuous | boolean | 读写 | 连续响应事件

# events: changed

`changed` 事件在数值变化时回调：

```js
changed: function(sender) {
  
}
```
```

## docs/component/switch.md

```markdown
# type: "switch"

`switch` 用于创建一个开关：

```js
{
  type: "switch",
  props: {
    on: true
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
  }
}
```

将会创建一个初始状态是开启的开关。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
on | boolean | 读写 | 开关状态
onColor | $color | 读写 | 开启时颜色
thumbColor | $color | 读写 | 滑块颜色

# events: changed

`changed` 事件在状态变化时回调：

```js
changed: function(sender) {
  
}
```
```

## docs/component/text.md

```markdown
# type: "text"

`text` 用于创建一个可多行编辑的文本框，目前不支持富文本（但支持 HTML)：

```js
{
  type: "text",
  props: {
    text: "Hello, World!\n\nThis is a demo for Text View in JSBox extension!\n\nCurrently we don't support attributed string in iOS.\n\nYou can try html! Looks pretty cool."
  },
  layout: $layout.fill
}
```

将会在画布上显示一大段话，并且可以编辑。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
type | $kbType | 读写 | 键盘类型
darkKeyboard | boolean | 读写 | 是否黑色键盘
text | string | 读写 | 文本内容
styledText | object | 读写 | 带格式的文本
html | string | 只写 | 通过 html 渲染富文本
font | $font | 读写 | 字体
textColor | $color | 读写 | 文本颜色
align | $align | 读写 | 对齐方式
placeholder | string | 读写 | placeholder
selectedRange | $range | 读写 | 选中区域
editable | boolean | 读写 | 是否可编辑
selectable | boolean | 读写 | 是否可选择
insets | $insets | 读写 | 边距

# focus()

获取焦点，弹出键盘。

# blur()

模糊焦点，收起键盘。

# events: didBeginEditing

`didBeginEditing` 在开始编辑后回调：

```js
didBeginEditing: function(sender) {

}
```

# events: didEndEditing

`didEndEditing` 在结束编辑后回调：

```js
didEndEditing: function(sender) {
  
}
```

# events: didChange

`didChange` 在内容变化时回调：

```js
didChange: function(sender) {

}
```

# events: didChangeSelection

`didChangeSelection` 在选择区域变化时回调：

```js
didChangeSelection: function(sender) {

}
```

同时，`text` 继承自 `scroll`，所以 scroll 支持的全部事件和属性 text 也一样支持。

# styledText

用于设置带格式的文本，使用 Markdown 语法，支持粗体、斜体和链接，支持格式的嵌套：

```js
const text = `**Bold** *Italic* or __Bold__ _Italic_

[Inline Link](https://docs.xteko.com) <https://docs.xteko.com>

_Nested **styles**_`

$ui.render({
  views: [
    {
      type: "text",
      props: {
        styledText: text
      },
      layout: $layout.fill
    }
  ]
});
```

这将使用默认的字体和颜色进行渲染，也可以进行自定义：

```js
$ui.render({
  views: [
    {
      type: "text",
      props: {
        styledText: {
          text: "",
          font: $font(15),
          color: $color("black")
        }
      },
      layout: $layout.fill
    }
  ]
});
```

若需表示 `*`, `_` 等特殊符号，请使用 `\\` 进行转义。

如果需要对格式进行更精细的控制，可以通过 `styles` 为文字的不同位置指定样式：

```js
const text = `
AmericanTypewriter Cochin-Italic

Text Color Background Color

Kern

Strikethrough Underline

Stroke

Link

Baseline Offset

Obliqueness
`;

const _range = keyword => {
  return $range(text.indexOf(keyword), keyword.length);
}

$ui.render({
  views: [
    {
      type: "text",
      props: {
        styledText: {
          text,
          font: $font(17),
          color: $color("black"),
          markdown: false, // whether to use markdown syntax
          styles: [
            {
              range: _range("AmericanTypewriter"),
              font: $font("AmericanTypewriter", 17)
            },
            {
              range: _range("Cochin-Italic"),
              font: $font("Cochin-Italic", 17)
            },
            {
              range: _range("Text Color"),
              color: $color("red")
            },
            {
              range: _range("Background Color"),
              color: $color("white"),
              bgcolor: $color("blue")
            },
            {
              range: _range("Kern"),
              kern: 10
            },
            {
              range: _range("Strikethrough"),
              strikethroughStyle: 2,
              strikethroughColor: $color("red")
            },
            {
              range: _range("Underline"),
              underlineStyle: 9,
              underlineColor: $color("green")
            },
            {
              range: _range("Stroke"),
              strokeWidth: 3,
              strokeColor: $color("black")
            },
            {
              range: _range("Link"),
              link: "https://xteko.com"
            },
            {
              range: _range("Baseline Offset"),
              baselineOffset: 10
            },
            {
              range: _range("Obliqueness"),
              obliqueness: 1
            }
          ]
        }
      },
      layout: $layout.fill
    }
  ]
});
```

属性 | 类型 | 说明
---|---|---
range | $range | 文字范围
font | $font | 字体
color | $color | 前景色
bgcolor | $color | 背景色
kern | number | 字距
strikethroughStyle | number | 删除线样式 [Refer](https://developer.apple.com/documentation/uikit/nsunderlinestyle?language=objc)
strikethroughColor | $color | 删除线颜色
underlineStyle | number | 下划线样式 [Refer](https://developer.apple.com/documentation/uikit/nsunderlinestyle?language=objc)
underlineColor | $color | 下划线颜色
strokeWidth | number | 描边宽度
strokeColor | $color | 描边颜色
link | string | 链接 URL
baselineOffset | number | 基线偏移
obliqueness | number | 字体倾斜

使用 `styles` 默认不使用 markdown 语法，也可以通过 `markdown: true` 开启。

关于下划线和删除线，请参考 Apple 提供的文档，在此做一个简单的举例：

```js
NSUnderlineStyleNone = 0x00,
NSUnderlineStyleSingle = 0x01,
NSUnderlineStyleThick = 0x02,
NSUnderlineStyleDouble = 0x09,
NSUnderlineStylePatternSolid = 0x0000,
NSUnderlineStylePatternDot = 0x0100,
NSUnderlineStylePatternDash = 0x0200,
NSUnderlineStylePatternDashDot = 0x0300,
NSUnderlineStylePatternDashDotDot = 0x0400,
NSUnderlineStyleByWord = 0x8000,
```

如果想实现细的点状下划线，请使用 `NSUnderlineStyleSingle` 和 `NSUnderlineStylePatternDot` 的组合，也既：

```js
underlineStyle: 0x01 | 0x0100
```

# 自定义键盘工具栏

通过这样的方式自定义键盘工具栏：

```js
$ui.render({
  views: [
    {
      type: "input",
      props: {
        accessoryView: {
          type: "view",
          props: {
            height: 44
          },
          views: [

          ]
        }
      }
    }
  ]
});
```

# 自定义键盘视图

通过这样的方式自定义键盘视图：

```js
$ui.render({
  views: [
    {
      type: "input",
      props: {
        keyboardView: {
          type: "view",
          props: {
            height: 267
          },
          views: [

          ]
        }
      }
    }
  ]
});
```
```

## docs/component/video.md

```markdown
# type: "video"

`video` 用于创建一个播放视频的控件：

```js
{
  type: "video",
  props: {
    src: "https://images.apple.com/media/cn/ipad-pro/2017/43c41767_0723_4506_889f_0180acc13482/films/feature/ipad-pro-feature-cn-20170605_1280x720h.mp4",
    poster: "https://images.apple.com/v/iphone/home/v/images/home/limited_edition/iphone_7_product_red_large_2x.jpg"
  },
  layout: function(make, view) {
    make.left.right.equalTo(0)
    make.centerY.equalTo(view.super)
    make.height.equalTo(256)
  }
}
```

由于 video 组件目前使用 WebView 实现，你也可以用 `local://` 协议来加载本地文件：

```js
{
  type: "video",
  props: {
    src: "local://assets/video.mp4",
    poster: "local://assets/poster.jpg"
  },
  layout: function(make, view) {
    make.left.right.equalTo(0)
    make.centerY.equalTo(view.super)
    make.height.equalTo(256)
  }
}
```

另外，你还可以像这个 demo 一样使用 `AVPlayerViewController` 来播放视频：https://gist.github.com/cyanzhong/c3992af39043c8e0f25424536c379595

# video.pause()

停止播放视频：

```js
$("video").pause()
```

# video.play()

继续播放视频：

```js
$("video").play()
```

# video.toggle()

切换视频播放状态：

```js
$("video").toggle()
```

`src`: 视频地址 `poster`: 封面图片地址。

内部通过一个 WKWebView 实现，所以理论上也完全可以通过 web 组件自行实现。
```

## docs/component/web.md

```markdown
# type: "web"

`web` 用于创建一个简单的网页，在之后将会提供选项用于显示浏览器导航按钮：

```js
{
  type: "web",
  props: {
    url: "https://www.apple.com"
  },
  layout: $layout.fill
}
```

显示 Apple 首页。

也可以使用 `request` 参数附带更多信息：

```js
{
  type: "web",
  props: {
    request: {
      url: "https://www.apple.com",
      method: "GET",
      header: {},
      body: body // $data type
    }
  },
  layout: $layout.fill
}
```

# 加载本地文件

可以将 html, js 和 css 等文件都放在本地，然后用 html 属性加载：

```js
let html = $file.read("assets/index.html").string;
$ui.render({
  views: [
    {
      type: "web",
      props: {
        html
      },
      layout: $layout.fill
    }
  ]
});
```

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no">
    <link rel="stylesheet" href="local://assets/index.css">
    <script src="local://assets/index.js"></script>
  </head>
  <body>
    <h1>Hey, there!</h1><img src="local://assets/icon.png">
  </body>
  <script>
    window.onload = () => {
      alert(sum(1, 1));
    }
  </script>
</html>
```

本地文件将会从安装包内寻找，同时也支持 `shared://` 和 `drive://` 等协议。

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
title | string | 只读 | 网页标题
url | string | 只写 | 地址
toolbar | bool | 只写 | 显示工具栏
html | string | 只写 | html
text | string | 只写 | text
loading | boolean | 只读 | 是否在加载
progress | number | 只读 | 加载进度
canGoBack | boolean | 只读 | 是否可以后退
canGoForward | boolean | 只读 | 是否可以前进
ua | string | 只写 | UserAgent(iOS 9+)
scrollEnabled | bool | 读写 | 是否可以滚动
bounces | bool | 读写 | 是否滚动回弹
transparent | bool | 读写 | 是否背景透明
showsProgress | bool | 只写 | 是否显示进度条
inlineMedia | bool | 只写 | 是否允许 inline video
airPlay | bool | 只写 | 是否允许 AirPlay
pictureInPicture | bool | 只写 | 是否允许画中画
allowsNavigation | bool | 读写 | 是否允许滑动返回
allowsLinkPreview | bool | 读写 | 是否允许链接预览

# goBack()

后退。

# goForward()

前进。

# reload()

重新加载。

# reloadFromOrigin()

从初始的 URL 重新加载。

# stopLoading()

停止加载。

# eval(object)

运行一段 JavaScript：

```js
webView.eval({
  script: "var sum = 1 + 2",
  handler: function(result, error) {

  }
})
```

# exec(script)

与 `eval` 类似，但此函数为 async 函数：

```js
const {result, error} = await webView.exec("1 + 1");
```

# events: didClose

`didClose` 会在网页关闭时回调：

```js
didClose: function(sender) {

}
```

# events: decideNavigation

`decideNavigation` 可以决定是否加载网页，用于拦截某些请求：

```js
decideNavigation: function(sender, action) {
  if (action.requestURL === "https://apple.com") {
    return false
  }
  return true
}
```

# events: didStart

`didStart` 在网页开始加载时回调：

```js
didStart: function(sender, navigation) {

}
```

# events: didReceiveServerRedirect

`didReceiveServerRedirect` 在收到服务器重定向时回调：

```js
didReceiveServerRedirect: function(sender, navigation) {

}
```

# events: didFinish

`didFinish` 在网页成功加载时调用：

```js
didFinish: function(sender, navigation) {

}
```

# events: didFail

`didFail` 在网页加载失败时调用：

```js
didFail: function(sender, navigation, error) {

}
```

# events: didSendRequest

`didSendRequest` 在页面 JavaScript 发送了 XMLHttpRequest 时候调用：

```js
didSendRequest: function(request) {
  var method = request.method
  var url = request.url
  var header = request.header
  var body = request.body
}
```

# js 注入

web 组件通过向 WebView 注入 JavaScript 来控制页面的行为，只需在 `props` 里面定义：

```js
props: {
  script: function() {
    var images = document.getElementsByTagName("img")
    for (var i=0; i<images.length; ++i) {
      var element = images[i]
      element.onclick = function(event) {
        var source = event.target || event.srcElement
        $notify("share", {"url": source.getAttribute("data-original")})
        return false
      }
    }
  }
}
```

script 是一个 `function`，function 里面所有的代码会在网页加载完成之后执行。

或者 script 内容也可以是一个字符串字面量，可以通过 [Uglify](https://skalman.github.io/UglifyJS-online/) 和 [Escape](https://www.freeformatter.com/json-escape.html) 的方式转换成这样一个字符串：

```js
props: {
  script: "for(var images=document.getElementsByTagName(\"img\"),i=0;i<images.length;++i){var element=images[i];element.onclick=function(e){var t=e.target||e.srcElement;return $notify(\"share\",{url:t.getAttribute(\"data-original\")}),!1}}"
}
```

# $notify(event, message)

在 script 的内容里面，可以通过 `$notify` 方法来将事件传递到 `events` 里面去处理：

```js
props: {
  script: function() {
    $notify("customEvent", {"key": "value"})
  }
},
events: {
  customEvent: function(object) {
    // object = {"key": "value"}
  }
}
```

这样的话页面加载完成之后将会调用 `notify` 将事件传递到 `events` 里面的 `test` 事件，从而可以在这里进一步和 native 代码互通。

这套机制有一点点复杂，请参考下面这个完整的例子：

```js
$ui.render({
  props: {
    title: "斗图啦"
  },
  views: [
    {
      type: "button",
      props: {
        title: "搜索"
      },
      layout: function(make) {
        make.right.top.inset(10)
        make.size.equalTo($size(64, 32))
      },
      events: {
        tapped: function(sender) {
          search()
        }
      }
    },
    {
      type: "input",
      props: {
        placeholder: "输入关键字"
      },
      layout: function(make) {
        make.top.left.inset(10)
        make.right.equalTo($("button").left).offset(-10)
        make.height.equalTo($("button"))
      },
      events: {
        returned: function(sender) {
          search()
        }
      }
    },
    {
      type: "web",
      props: {
        script: "for(var images=document.getElementsByTagName(\"img\"),i=0;i<images.length;++i){var element=images[i];element.onclick=function(e){var t=e.target||e.srcElement;return $notify(\"share\",{url:t.getAttribute(\"data-original\")}),!1}}"
      },
      layout: function(make) {
        make.left.bottom.right.equalTo(0)
        make.top.equalTo($("input").bottom).offset(10)
      },
      events: {
        share: function(object) {
          $http.download({
            url: `http:${object.url}`,
            handler: function(resp) {
              $share.universal(resp.data)
            }
          })
        }
      }
    }
  ]
})

function search() {
  const keyword = $("input").text;
  const url = `https://www.doutula.com/search?keyword=${encodeURIComponent(keyword)}`;
  $("input").blur()
  $("web").url = url
}

$("input").focus()
```

# 注入 css

与注入 script 类似的，style 也可以注入：

```js
props: {
  style: ""
}
```

当然，你也可以通过 js 注入的方式执行实现上述效果。

# Native 调用 Web 组件

Native 代码可以通过 `notify(event, message)` 给 web 组件发送消息：

```js
const webView = $("webView");
webView.notify({
  "event": "foobar",
  "message": {"key": "value"}
});
```

这将可以实现 Native 调用网页上面的方法。
```

## docs/context/intro.md

```markdown
# Action Extension 上的扩展

`Action Extension` 是指 iOS 分享面板下面那一排图标，JSBox 的扩展支持从这里启动，从这里启动扩展通常是因为用户触发了一个分享操作，所以我们可以取到用户传递过来的分享内容。

# Action Extension 上面限制

与 Widget 类似的是，Action Extension 同样有些限制，虽然限制没有 Widget 那么多。

目前而言，限制主要有两点：

- 可用内存较小，当扩展使用过大的内存时，系统会强制关闭掉这个扩展
- 在 Action Extension 里面无法拍照，即无法使用 `$photo.pick` 接口

# $context

我们通过 `$context` 这个对象来封装来自外部的参数，Action Extension 里面表现为用户分享的内容。具体方法请见[方法列表](context/method.md)
```

## docs/context/method.md

```markdown
# $context.query

获取通过 URL Scheme 启动扩展时的所有参数：

```js
const query = $context.query;
```

用 `jsbox://runjs?file=demo.js&text=test` 启动时，query 值为：

```js
{
  "file": "demo.js",
  "text": "test"
}
```

若从其他第三方应用跳转至 JSBox，query 内可能包含来源应用的 Bundle ID:

```js
const sourceApp = $context.query.source_app;
```

您可以根据这个信息进行一些判断，但对 iOS 自带的应用无效。

# $context.text

返回一个文本（当用户选择文本进行分享时）：

```js
const text = $context.text;
```

# $context.textItems

返回所有文本。

# $context.link

返回一个链接（当用户选择链接进行分享时）：

```js
const link = $context.link;
```

# $context.linkItems

返回所有链接。

# $context.image

返回一个图片（当用户选择图片进行分享时）：

```js
const image = $context.image;
```

# $context.imageItems

返回所有图片。

# $context.safari.items

当用户在 Safari 上启动扩展时，通过此方法拿到浏览器中的对象：

```js
const items = $context.safari.items;
```

对象结构：

```json
{
  "baseURI": "",
  "source": "",
  "location": "",
  "contentType": "",
  "title": "",
  "selection": {
    "html": "",
    "text": "",
    "style": ""
  }
}
```

# $context.data

返回一个二进制文件（当用户选择文件进行分享时）：

```js
const data = $context.data;
```

# $context.dataItems

返回所有二进制文件。

# $context.allItems

一次返回上述所有的内容在一个 JSON 对象里。

以上返回的对象和在其他地方使用的方法完全相同，也就是说 `$context` 本质上是提供了一种获取输入数据的方式。

就目前而言，`$context` 仅对从 Action Extension 运行这种场景有效。

# $context.clear()

清除 context 内的所有数据，包括传递进来的参数和 Action Extension 的数据：

```js
$context.clear();
```

# $context.close()

在 Action Extension 中运行时，通过这个方法可以关闭 Extension，请注意如果先调用了 `$app.close()`，这条语句将不会生效，因为 $app.close() 之后的代码都不会生效。
```

## docs/data/constant.md

```markdown
# 常量列表

以下的内容是提供一些 JSBox 的 JavaScript 环境内置的常量，方便在接口调用中使用。

你当然也可以完全不使用这些定义，例如 `$align.left` 其实就是 `0`，提供常量表是为了便于使用。

# $env

指定适合运行的环境：

```js
const $env = {
  app: 1 << 0,
  today: 1 << 1,
  action: 1 << 2,
  safari: 1 << 3,
  notification: 1 << 4,
  keyboard: 1 << 5,
  siri: 1 << 6,
  widget: 1 << 7,
  all: (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3) | (1 << 4) | (1 << 5) | (1 << 6) | (1 << 7)
};
```

# $align

在 `label` 等控件里面表示文字对齐方式：

```js
const $align = {
  left: 0,
  center: 1,
  right: 2,
  justified: 3,
  natural: 4
};
```

# $contentMode

表示 view 的视图模式：

```js
const $contentMode = {
  scaleToFill: 0,
  scaleAspectFit: 1,
  scaleAspectFill: 2,
  redraw: 3,
  center: 4,
  top: 5,
  bottom: 6,
  left: 7,
  right: 8,
};
```

# $btnType

按钮的类型：

```js
const $btnType = {
  custom: 0,
  system: 1,
  disclosure: 2,
  infoLight: 3,
  infoDark: 4,
  contactAdd: 5,
};
```

# $alertActionType

Alert 选项类型：

```js
const $alertActionType = {
  default: 0, cancel: 1, destructive: 2
};
```

# $zero

提供各种零值：

```js
const $zero = {
  point: $point(0, 0),
  size: $size(0, 0),
  rect: $rect(0, 0, 0, 0),
  insets: $insets(0, 0, 0, 0)
};
```

# $layout

提供几个常用的 layout 对象：

```js
const $layout = {
  fill: function(make, view) {
    make.edges.equalTo(view.super)
  },
  fillSafeArea: function(make, view) {
    make.edges.equalTo(view.super.safeArea)
  },
  center: function(make, view) {
    make.center.equalTo(view.super)
  }
};
```

# $lineCap

在绘图时用到的常量：

```js
const $lineCap = {
  butt: 0,
  round: 1,
  square: 2
};
```

# $lineJoin

同上：

```js
const $lineJoin = {
  miter: 0,
  round: 1,
  bevel: 2
};
```

# $mediaType

iOS 内置的各种 [UTI](https://developer.apple.com/library/content/documentation/Miscellaneous/Reference/UTIRef/Introduction/Introduction.html):

```js
const $mediaType = {
  image: "public.image",
  jpeg: "public.jpeg",
  jpeg2000: "public.jpeg-2000",
  tiff: "public.tiff",
  pict: "com.apple.pict",
  gif: "com.compuserve.gif",
  png: "public.png",
  icns: "com.apple.icns",
  bmp: "com.microsoft.bmp",
  ico: "com.microsoft.ico",
  raw: "public.camera-raw-image",
  live: "com.apple.live-photo",
  movie: "public.movie",
  video: "public.video",
  audio: "public.audio",
  mov: "com.apple.quicktime-movie",
  mpeg: "public.mpeg",
  mpeg2: "public.mpeg-2-video",
  mp3: "public.mp3",
  mp4: "public.mpeg-4",
  avi: "public.avi",
  wav: "com.microsoft.waveform-audio",
  midi: "public.midi-audio"
};
```

# $imgPicker

在拍照时使用的各种常量：

```js
const $imgPicker = {
  quality: {
    high: 0,
    medium: 1,
    low: 2,
    r640x480: 3,
    r1280x720: 4,
    r960x540: 5
  },
  captureMode: {
    photo: 0,
    video: 1
  },
  device: {
    rear: 0,
    front: 1
  },
  flashMode: {
    off: -1,
    auto: 0,
    on: 1
  }
};
```

# $kbType

在输入框中指定键盘类型：

```js
const $kbType =  {
  default: 0,
  ascii: 1,
  nap: 2,
  url: 3,
  number: 4,
  phone: 5,
  namePhone: 6,
  email: 7,
  decimal: 8,
  twitter: 9,
  search: 10,
  asciiPhone: 11
};
```

# $assetMedia

在媒体相关接口中使用的常量：

```js
const $assetMedia = {
  type: {
    unknown: 0,
    image: 1,
    video: 2,
    audio: 3
  },
  subType: {
    none: 0,
    panorama: 1 << 0,
    hdr: 1 << 1,
    screenshot: 1 << 2,
    live: 1 << 3,
    depthEffect: 1 << 4,
    streamed: 1 << 16,
    highFrameRate: 1 << 17,
    timelapse: 1 << 18
  }
};
```

# $pageSize

使用 $pdf 制作 PDF 文档的时候，可用 pageSize 来指定页面大小：

```js
const $pageSize = {
  letter: 0, governmentLetter: 1, legal: 2, juniorLegal: 3, ledger: 4, tabloid: 5,
  A0: 6, A1: 7, A2: 8, A3: 9, A4: 10, A5: 11, A6: 12, A7: 13, A8: 14, A9: 15, A10: 16,
  B0: 17, B1: 18, B2: 19, B3: 20, B4: 21, B5: 22, B6: 23, B7: 24, B8: 25, B9: 26, B10: 27,
  C0: 28, C1: 29, C2: 30, C3: 31, C4: 32, C5: 33, C6: 34, C7: 35, C8: 36, C9: 37, C10: 38,
  custom: 52
};
```

# $UIEvent

使用 `addEventHandler` 时，指定事件类型的常量：

```js
const $UIEvent = {
  touchDown: 1 << 0,
  touchDownRepeat: 1 << 1,
  touchDragInside: 1 << 2,
  touchDragOutside: 1 << 3,
  touchDragEnter: 1 << 4,
  touchDragExit: 1 << 5,
  touchUpInside: 1 << 6,
  touchUpOutside: 1 << 7,
  touchCancel: 1 << 8,
  valueChanged: 1 << 12,
  primaryActionTriggered: 1 << 13,
  editingDidBegin: 1 << 16,
  editingChanged: 1 << 17,
  editingDidEnd: 1 << 18,
  editingDidEndOnExit: 1 << 19,
  allTouchEvents: 0x00000FFF,
  allEditingEvents: 0x000F0000,
  applicationReserved: 0x0F000000,
  systemReserved: 0xF0000000,
  allEvents: 0xFFFFFFFF,
};
```

# $stackViewAxis

Stack view 的 axis 常量：

```js
const $stackViewAxis = {
  horizontal: 0,
  vertical: 1,
};
```

# $stackViewDistribution

Stack view 的 distribution 常量：

```js
const $stackViewDistribution = {
  fill: 0,
  fillEqually: 1,
  fillProportionally: 2,
  equalSpacing: 3,
  equalCentering: 4,
};
```

# $stackViewAlignment

Stack view 的 alignment 常量：

```js
const $stackViewAlignment = {
  fill: 0,
  leading: 1,
  top: 1,
  firstBaseline: 2,
  center: 3,
  trailing: 4,
  bottom: 4,
  lastBaseline: 5,
};
```

# $stackViewSpacing

Stack view 的 spacing 常量：

```js
const $stackViewSpacing = {
  useDefault: UIStackViewSpacingUseDefault,
  useSystem: UIStackViewSpacingUseSystem,
};
```

# $popoverDirection

使用 `$ui.popover(...)` 时指定箭头方向的常量：

```js
const $popoverDirection = {
  up: 1 << 0,
  down: 1 << 1,
  left: 1 << 2,
  right: 1 << 3,
  any: (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3),
};
```

# $scrollDirection

使用 `matrix` 时的视图滚动方向：

```js
const $scrollDirection = {
  vertical: 0,
  horizontal: 1,
};
```

# $blurStyle

使用 `blur` 时的 `style` 常量：

```js
const $blurStyle = {
  // Additional Styles
  extraLight: 0,
  light: 1,
  dark: 2,
  extraDark: 3,
  regular: 4,
  prominent: 5,
  // Adaptable Styles (iOS 13)
  ultraThinMaterial: 6,
  thinMaterial: 7,
  material: 8,
  thickMaterial: 9,
  chromeMaterial: 10,
  // Light Styles (iOS 13)
  ultraThinMaterialLight: 11,
  thinMaterialLight: 12,
  materialLight: 13,
  thickMaterialLight: 14,
  chromeMaterialLight: 15,
  // Dark Styles (iOS 13)
  ultraThinMaterialDark: 16,
  thinMaterialDark: 17,
  materialDark: 18,
  thickMaterialDark: 19,
  chromeMaterialDark: 20,
};
```

请参考 Apple 提供的文档以了解更多：https://developer.apple.com/documentation/uikit/uiblureffectstyle

# $widgetFamily

判断桌面小组件的布局类型：

```js
const $widgetFamily = {
  small: 0,
  medium: 1,
  large: 2,
  xLarge: 3, // iPadOS 15
  
  // iOS 16 lock screen sizes
  accessoryCircular: 5,
  accessoryRectangular: 6,
  accessoryInline: 7,
};
```
```

## docs/data/intro.md

```markdown
# 数据类型

我们通过 JavaScript 与 Native 代码进行通信，这里面涉及到数据类型的问题，我们要在 JavaScript 层面产生 Native 代码需要的数据。

JavaScript 的基本数据类型例如 `number`, `boolean` 都会自动完成转换，但是在 iOS 的各种 API 尤其是界面相关的 API 里面，会有很多别的数据类型，例如颜色，大小。

这里的目的是通过提供一些内置的方法让 js 容易的产生这些数据。

当然，这一部分其实是一个参考表，你需要的时候来这里查就行了，不必细读。

# 利弊权衡

这实际上是权衡利弊之后的做法，实际上还有另一种做法是每次 JavaScript 都传递 Object 给 iOS，这样的话 JSBox 在内部完成数据的解析。

但是那样写起来可能并不会比提供很多构造方法要简单，另外是一致性方面很难保证，JSBox 内部要做太多太多的数据类型转换，很容易出错。
```

## docs/data/method.md

```markdown
# 方法列表

基于上述的考虑，JSBox 提供了下列这些方法来进行数据转换。

# $rect(x, y, width, height)

生成一个矩形，例如：

```js
const rect = $rect(0, 0, 100, 100);
```

# $size(width, height)

生成一个大小，例如：

```js
const size = $size(100, 100);
```

# $point(x, y)

生成一个位置，例如：

```js
const point = $point(0, 0);
```

# $insets(top, left, bottom, right)

返回一个边距，例如：

```js
const insets = $insets(10, 10, 10, 10);
```

# $color(string)

返回一个颜色，这里支持两种表达式，十六进制表达式：

```js
const color = $color("#00EEEE");
```

常见颜色名称：

```js
const blackColor = $color("black");
```

名称 | 颜色
---|---
tint | JSBox 主题色
black | 黑色
darkGray | 深灰
lightGray | 浅灰
white | 白色
gray | 灰色
red | 红色
green | 绿色
blue | 蓝色
cyan | 青色
yellow | 黄色
magenta | 品红
orange | 橙色
purple | 紫色
brown | 棕色
clear | 透明

以下颜色为语义化颜色，方便用于 Dark Mode 的适配，他们会在 Dark 和 Light 时展示不同的颜色：

名称 | 颜色
---|---
tintColor | 主题色
primarySurface | 一级背景
secondarySurface | 二级背景
tertiarySurface | 三级背景
primaryText | 一级文字
secondaryText | 二级文字
backgroundColor | 背景颜色
separatorColor | 分割线颜色
groupedBackground | grouped 列表背景色
insetGroupedBackground | insetGrouped 列表背景色

以下颜色为系统默认颜色，参考 [UI Element Colors](https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors)

名称 | 颜色
---|---
systemGray2 | UIColor.systemGray2Color
systemGray3 | UIColor.systemGray3Color
systemGray4 | UIColor.systemGray4Color
systemGray5 | UIColor.systemGray5Color
systemGray6 | UIColor.systemGray6Color
systemLabel | UIColor.labelColor
systemSecondaryLabel | UIColor.secondaryLabelColor
systemTertiaryLabel | UIColor.tertiaryLabelColor
systemQuaternaryLabel | UIColor.quaternaryLabelColor
systemLink | UIColor.linkColor
systemPlaceholderText | UIColor.placeholderTextColor
systemSeparator | UIColor.separatorColor
systemOpaqueSeparator | UIColor.opaqueSeparatorColor
systemBackground | UIColor.systemBackgroundColor
systemSecondaryBackground | UIColor.secondarySystemBackgroundColor
systemTertiaryBackground | UIColor.tertiarySystemBackgroundColor
systemGroupedBackground | UIColor.systemGroupedBackgroundColor
systemSecondaryGroupedBackground | UIColor.secondarySystemGroupedBackgroundColor
systemTertiaryGroupedBackground | UIColor.tertiarySystemGroupedBackgroundColor
systemFill | UIColor.systemFillColor
systemSecondaryFill | UIColor.secondarySystemFillColor
systemTertiaryFill | UIColor.tertiarySystemFillColor
systemQuaternaryFill | UIColor.quaternarySystemFillColor

这些颜色在分别在 Light 和 Dark 模式下使用不同的颜色，例如 `$color("tintColor")` 会在 Light 模式下使用主题色，在 Dark 模式下使用比较亮的蓝色。

可以使用 `$color("namedColors")` 来获取颜色盘里面所有可用的颜色，返回一个字典：

```js
const colors = $color("namedColors");
```

同时，`$color(...)` 接口也可用于返回适配 Dark Mode 需要的动态颜色，像是这样：

```js
const dynamicColor = $color({
  light: "#FFFFFF",
  dark: "#000000"
});
```

该颜色在两种模式下分别为黑色和白色，自动切换，也可以简写为：

```js
const dynamicColor = $color("#FFFFFF", "#000000");
```

写法支持嵌套，你可以用 `$rgba(...)` 接口生成颜色后，用 `$color(...)` 接口生成动态颜色：

```js
const dynamicColor = $color($rgba(0, 0, 0, 1), $rgba(255, 255, 255, 1));
```

另外，JSBox 的 Dark Mode 支持深灰或纯黑两种模式，如果需要对三种状态使用不同的颜色，可以使用：

```js
const dynamicColor = $color({
  light: "#FFFFFF",
  dark: "#141414",
  black: "#000000"
});
```

# $rgb(red, green, blue)

同样是生成颜色，但这里用的是十进制 `0 ~ 255` 的数值：

```js
const color = $rgb(100, 100, 100);
```
# $rgba(red, green, blue, alpha)

同样是生成颜色，但这个支持 `alpha` 通道：

```js
const color = $rgba(100, 100, 100, 0.5);
```

# $font(name, size)

返回一个字体，`name` 字段是可选的：

```js
const font1 = $font(15);
const font2 = $font("bold", 15);
```

其中 name 是 `"bold"` 和 `default` 时，分别会使用粗体和正常字体，否则根据 name 查找系统支持的字体。

有关 iOS 自带的字体请参考：http://iosfonts.com/

# $range(location, length)

返回一个范围，例如：

```js
const range = $range(0, 10);
```

# $indexPath(section, row)

返回一个 indexPath，表示区域和位置，这在 list 和 matrix 视图里面会很常用：

```js
const indexPath = $indexPath(0, 10);
```

# $data(object)

返回一个二进制数据，支持以下构造形式：

```js
// string
const data = $data({
  string: "Hello, World!",
  encoding: 4 // default, refer: https://developer.apple.com/documentation/foundation/nsstringencoding
});
```

```js
// path
const data = $data({
  path: "demo.txt"
});
```

```js
// url
const data = $data({
  url: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg"
});
```

```js
// base64
const data = $data({
  base64: "data:image/png;base64,..."
});
```

```js
// byte array
const data = $data({
  byteArray: [116, 101, 115, 116]
})
```

# $image(object, scale)

创建一个 image 对象，支持多种参数类型：

```js
// file path
const image = $image("assets/icon.png");
```

```js
// sf symbols
const image = $image("sunrise");
```

```js
// url
const image = $image("https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg");
```

```js
// base64
const image = $image("data:image/png;base64,...");
```

其中 `scale` 为可选参数，用于设置比例，默认为 1，设置成 0 的时候表示屏幕比例。

在最新版里面，可以使用 `$image(...)` 函数来创建适用于 Dark Mode 的动态图片，例如：

```js
const dynamicImage = $image({
  light: "light-image.png",
  dark: "dark-image.png"
});
```

该图片会分别在 Light 模式和 Dark 模式下使用不同的资源，自动完成切换，也可以简写成：

```js
const dynamicImage = $image("light-image.png", "dark-image.png");
```

除此之外，此接口还支持将图片嵌套，像是这样：

```js
const lightImage = $image("light-image.png");
const darkImage = $image("dark-image.png");
const dynamicImage = $image(lightImage, darkImage);
```

# $icon(code, color, size)

获得一个 JSBox 内置的图标，图标编号请参考：https://github.com/cyanzhong/xTeko/tree/master/extension-icons

使用样例：

```js
$ui.render({
  views: [
    {
      type: "button",
      props: {
        icon: $icon("005", $color("red"), $size(20, 20)),
        bgcolor: $color("clear")
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.size.equalTo($size(24, 24))
      }
    }
  ]
})
```

`color` 是可选参数，不填的话使用默认颜色。

`size` 是可选参数，不填的话使用默认大小。
```

## docs/data/object.md

```markdown
# 对象属性

在 JavaScript 和 Native 通信的过程中，`对象传递`是一个比较麻烦的话题，以下数据类型可以自动完成 JavaScript 和 Native 的转换：

  Objective-C type  |   JavaScript type
--------------------|---------------------
        nil         |     undefined
      NSNull        |        null
      NSString      |       string
      NSNumber      |   number, boolean
    NSDictionary    |   Object object
      NSArray       |    Array object
      NSDate        |     Date object
      NSBlock (1)   |   Function object (1)
        id (2)      |   Wrapper object (2)
      Class (3)     | Constructor object (3)

但是显然，在我们通过 JavaScript 调用原生接口时，会通过接口返回各种各样的类型，例如返回一个图片，当我们调用接口的时候，也可能传递一个图片/二进制文件等等数据。

当 Native 给 JavaScript 返回数据时，将会把数据封装成一个 Object 类型，JavaScript 可以通过属性名获取到内部的 property。

例如，当我们实现列表点击事件时，会实现这样的代码：

```js
didSelect: function(tableView, indexPath) {
  var row = indexPath.row
}
```

其中的 `indexPath` 本质上是 iOS 内部的 IndexPath 类型，在这个例子里面我们可以通过 `.section` 和 `.row` 来访问到它内部的属性。

对于具体有哪些属性，我们需要一个专门的表来列举全部内容，方便随时查阅：[对象属性表](object/data.md)。

# $props

`$props` 方法可以获取一个对象所有的属性名：

```js
const props = $props("string");
```

$props 是一个简单的 js 方法，实现如下：

```js
const $props = object => {
  const result = [];
  for (; object != null; object = Object.getPrototypeOf(object)) {
    const names = Object.getOwnPropertyNames(object);
    for (let idx=0; idx<names.length; idx++) {
      const name = names[idx];
      if (!result.includes(name)) {
        result.push(name)
      }
    }
  }
  return result
};
```

# $desc

`$desc` 方法可以获取一个对象的结构：

```js
let desc = $desc(object);
console.log(desc);
```
```

## docs/debug/console.md

```markdown
> 控制台的使用和相关接口

# 前言

任何程序都会有 bug，这是 `debug` 存在的理由，JSBox 作为一个开发平台，应该提供各种查错的手段，这是一个需要长期优化的方向。

JSBox 里面引入了一个简单的 Console（控制台），可以用来输出日志，以及执行一些简单的代码。

# console

`console` 对象提供了以下几个方法用于向控制台输出内容：

```js
console.info("General Information")  // 输出通用信息
console.warn("Warning Message")      // 输出警告信息
console.error("Error Message")       // 输出错误信息
console.assert(false, "Message")     // Assertion
console.clear()                      // 清空控制台
console.open()                       // 打开控制台
console.close()                      // 关闭控制台
```

同时控制台也支持通过输入框执行一些代码，执行结果也将被展示到控制台。

另外，当 JavaScript 异常被捕获到的时候，异常信息将会以 `error` 的形式展示到控制台。

# 控制台使用方法

- 点击界面上的虫子按钮进入
- 点击某一行查看全文内容
- 长按某一行可以复制内容
- 底部输入框输入内容可以调试代码
```

## docs/debug/inspector.md

```markdown
> 本章内容需要 iOS 16.4 及以上

# 准备工作

在 iOS 设备上打开系统设置，找到 Safari 浏览器、高级，开启网页检查器。

在 Mac 上打开 Safari，在设置中找到高级，开启 Develop 选项。

# 调试过程

将 iOS 设备连接至 Mac，运行脚本，打开 Mac 上的 Safari，在 Develop 菜单上找到您的设备名，选择相应的 JSContext 进行调试。

您将看到当前运行的代码，可以添加断点、单步执行。
```

## docs/en/README.md

```markdown
*This website is based on [Docsify](https://docsify.js.org), hosted on the [GitHub](https://github.com/cyanzhong/jsbox-docs), pull requests are welcome.*

# JSBox APIs

Create powerful addins for JSBox with JavaScript, ES6 is supported, and we provide tons of APIs to interact with iOS directly

# JSBox Node.js

JSBox 2.0 provides Node.js runtime, you can also use Node APIs. For details, please refer to: https://cyanzhong.github.io/jsbox-nodejs/#/en/

# How to run code in JSBox

- Write code in JSBox directly

  > There's a simple code editor inside JSBox, provides auto completion and syntax highlighting, it will be better in the future

- Get code through URL Scheme

  > For example: jsbox://import?url=url&name=name&icon=icon
  > - Parameters:
  >  - `url`: Code file url
  >  - `name`: The script name
  >  - `icon`: JSBox icon set name, refer: https://github.com/cyanzhong/xTeko/tree/master/extension-icons
  > - Note:
  >  - Parameters should be URL Encoded
  >  - Please use ASCII characters to naming a URL

- Write code using VSCode extension

  > 1. Open editor settings in JSBox, turn on `Debug Mode`
  > 2. Back to home screen and restart JSBox, switch to the 4th tab to check `Host`
  > 3. Search & install `JSBox` extension in VSCode extension market
  > 4. Open a JavaScript file with VSCode, set host on the menu
  > 5. Now you can write code, and sync it to your iPhone automatically

- AirDrop & Share Sheet

  > You can share a js file with AirDrop to JSBox, but you need to import those files manually.
  > For example you can do that with this script: https://github.com/cyanzhong/xTeko/blob/master/extension-demos/sync-inbox.js

- Do it yourself! JSBox provides APIs to manage your scripts

  > Here's an example: https://github.com/cyanzhong/xTeko/blob/master/extension-demos/addin-gallery.js

# Open Source

In order to provide more demo scripts, we created a open source project on GitHub: https://github.com/cyanzhong/xTeko

Welcome to improve this project together, you can contribute by [New issue](https://github.com/cyanzhong/xTeko/issues/new) or [New pull request](https://github.com/cyanzhong/xTeko/compare).

Thank you!

# Contact us

If you have any question or suggestion about JSBox, you can find us by:

- Email: [log.e@qq.com](mailto:log.e@qq.com)
- Weibo: [@StackOverflowError](https://weibo.com/0x00eeee)
- Twitter: [@JSBoxApp](https://twitter.com/JSBoxApp)

*I'm ready, [let's start >](en/quickstart/intro.md)*

> This document is still under construction, please note changes in the future
```

## docs/en/_navbar.md

```markdown
- [**EN** / CN](/)
```

## docs/en/_sidebar.md

```markdown
- Quick Start
  - [README](en/README.md)
  - [Privacy Policy](en/privacy.md)
  - [Intro](en/quickstart/intro.md)
  - [Sample](en/quickstart/sample.md)

- Foundation
  - [Intro](en/foundation/intro.md)
  - [Device](en/foundation/device.md)
  - [App](en/foundation/app.md)
  - [Prefs](en/foundation/prefs.md)
  - [System](en/foundation/system.md)
  - [Network](en/foundation/network.md)
  - [Cache](en/foundation/cache.md)
  - [Keychain](en/foundation/keychain.md)
  - [Thread](en/foundation/thread.md)
  - [Clipboard](en/foundation/clipboard.md)
  - [Localization](en/foundation/l10n.md)

- Built-in Functions
  - [Intro](en/function/intro.md)
  - [Index](en/function/index.md)

- Data Structure
  - [Intro](en/data/intro.md)
  - [Method](en/data/method.md)
  - [Object](en/data/object.md)
  - [Constant](en/data/constant.md)

- Build UI
  - [Intro](en/uikit/intro.md)
  - [Render](en/uikit/render.md)
  - [View](en/uikit/view.md)
  - [Layout](en/uikit/layout.md)
  - [Gesture](en/uikit/gesture.md)
  - [UI Event](en/uikit/event.md)
  - [Native Menus](en/uikit/context-menu.md)
  - [Animation](en/uikit/animation.md)
  - [Method](en/uikit/method.md)
  - [Dark Mode](en/uikit/dark-mode.md)

- Components
  - [Label](en/component/label.md)
  - [Button](en/component/button.md)
  - [Input](en/component/input.md)
  - [Slider](en/component/slider.md)
  - [Switch](en/component/switch.md)
  - [Spinner](en/component/spinner.md)
  - [Progress](en/component/progress.md)
  - [Gallery](en/component/gallery.md)
  - [Stepper](en/component/stepper.md)
  - [Text](en/component/text.md)
  - [Image](en/component/image.md)
  - [Video](en/component/video.md)
  - [Scroll](en/component/scroll.md)
  - [Stack](en/component/stack.md)
  - [Menu](en/component/menu.md)
  - [Map](en/component/map.md)
  - [Web](en/component/web.md)
  - [List](en/component/list.md)
  - [Matrix](en/component/matrix.md)
  - [Blur Effect](en/component/blur.md)
  - [Gradient Layer](en/component/gradient.md)
  - [Date Picker](en/component/date-picker.md)
  - [General Picker](en/component/picker.md)
  - [Canvas](en/component/canvas.md)
  - [Markdown](en/component/markdown.md)
  - [Lottie](en/component/lottie.md)
  - [Chart](en/component/chart.md)
  - [Code View](en/component/code.md)
  - [Runtime](en/component/runtime.md)

- Safari Extension
  - [Introduction](en/safari-extension/intro.md)

- Home Screen Widget (iOS 14)
  - [Intro](en/home-widget/intro.md)
  - [Timeline](en/home-widget/timeline.md)
  - [Views](en/home-widget/views.md)
  - [Layout](en/home-widget/layout.md)
  - [Modifiers](en/home-widget/modifiers.md)
  - [Method](en/home-widget/method.md)
  - [Lock Screen Widgets](en/home-widget/lock-screen.md)

- Today Widget (Deprecated)
  - [Intro](en/widget/intro.md)
  - [Method](en/widget/method.md)

- Action Extension
  - [Intro](en/context/intro.md)
  - [Method](en/context/method.md)

- Keyboard Extension
  - [Method](en/keyboard/method.md)
  - [Privacy Policy](en/keyboard/privacy.md)

- File System
  - [Concept](en/file/design.md)
  - [Method](en/file/method.md)
  - [iCloud Drive](en/file/drive.md)

- SQLite
  - [Intro](en/sqlite/intro.md)
  - [Usage](en/sqlite/usage.md)
  - [Transaction](en/sqlite/transaction.md)
  - [Queue](en/sqlite/queue.md)

- Addin Related
  - [Method](en/addin/method.md)
  - [Sample](en/addin/sample.md)

- Media
  - [Quick Look](en/media/quicklook.md)
  - [Photo](en/media/photo.md)
  - [Audio](en/media/audio.md)
  - [PDF](en/media/pdf.md)
  - [Image Processing](en/media/imagekit.md)

- Native SDK
  - [Intro](en/sdk/intro.md)
  - [Message](en/sdk/message.md)
  - [Calendar](en/sdk/calendar.md)
  - [Reminder](en/sdk/reminder.md)
  - [Contact](en/sdk/contact.md)
  - [Location](en/sdk/location.md)
  - [Motion](en/sdk/motion.md)
  - [Safari](en/sdk/safari.md)

- Networking
  - [Socket](en/network/socket.md)
  - [Server](en/network/server.md)

- Extended APIs
  - [Intro](en/extend/intro.md)
  - [Text](en/extend/text.md)
  - [Editor Plugins](en/extend/editor.md)
  - [XML](en/extend/xml.md)
  - [Share](en/extend/share.md)
  - [QRCode](en/extend/qrcode.md)
  - [Browser](en/extend/browser.md)
  - [Push Notification](en/extend/push.md)
  - [Archiver](en/extend/archiver.md)
  - [Data Detector](en/extend/detector.md)

- Shortcuts
  - [Intro](en/shortcuts/intro.md)
  - [Voice](en/shortcuts/voice.md)
  - [Intents](en/shortcuts/intents.md)
  - [UI Intents](en/shortcuts/ui-intents.md)
  - [Run JavaScript](en/shortcuts/scripting.md)

- SSH
  - [Intro](en/ssh/intro.md)
  - [Channel](en/ssh/channel.md)
  - [SFTP](en/ssh/sftp.md)

- Object Properties
  - [data](en/object/data.md)
  - [image](en/object/image.md)
  - [color](en/object/color.md)
  - [indexPath](en/object/index-path.md)
  - [error](en/object/error.md)
  - [response](en/object/response.md)
  - [navigationAction](en/object/navigation-action.md)
  - [calendarItem](en/object/calendar-item.md)
  - [reminderItem](en/object/reminder-item.md)
  - [contact](en/object/contact.md)
  - [resultSet](en/object/result-set.md)
  - [server](en/object/server.md)

- Promise
  - [Intro](en/promise/intro.md)
  - [Sample](en/promise/sample.md)
  - [Index](en/promise/index.md)

- Package
  - [Intro](en/package/intro.md)
  - [Module](en/package/module.md)
  - [Built-in Modules](en/package/builtin.md)
  - [File Path](en/package/path.md)
  - [VSCode](en/package/vscode.md)
  - [Install](en/package/install.md)

- Runtime
  - [Intro](en/runtime/intro.md)
  - [Invoke](en/runtime/invoke.md)
  - [Syntactic Sugar](en/runtime/sugar.md)
  - [Define](en/runtime/define.md)
  - [Types](en/runtime/types.md)
  - [Blocks](en/runtime/blocks.md)
  - [Memory](en/runtime/memory.md)
  - [C Functions](en/runtime/c.md)

- Debug
  - [Console](en/debug/console.md)
  - [Inspector](en/debug/inspector.md)

- About
  - [User Guide](en/about/guide.md)
  - [Changelog](en/about/changelog.md)

```

## docs/en/about/changelog.md

```markdown
# 2021.11.26

- Improve preference APIs: [Refer](en/foundation/prefs.md)
- Improve menu APIs: [Refer](en/uikit/context-menu.md)
- Add Safari Extension docs: [Refer](en/safari-extension/intro.md)
- Add keychain related: [Refer](en/foundation/keychain.md)

# 2020.10.03

- Add home screen widget related: [Refer](en/home-widget/intro.md)

# 2020.03.13

- Add dark mode related: [Refer](en/uikit/dark-mode.md)

# 2020.03.04

- Add styled text related: [Refer](en/component/text.md)

# 2020.01.29

- Add image processing related: [Refer](en/media/imagekit.md)

# 2020.01.28

- Add builtin modules related: [Refer](en/package/builtin.md)

# 2019.12.28

- Add code view related: [Refer](en/component/code.md)

# 2019.11.25

- Add view hierarchy related: [Refer](en/uikit/view.md)

# 2019.11.21

- Add context menu support: [Refer](en/uikit/context-menu.md)

# 2019.10.27

- Add voice settings for $text.speech: [Refer](en/extend/text.md)

# 2019.09.02

- Add app preferences related API: [Refer](en/foundation/prefs.md)

# 2018.12.23

- Add editor plugins related API: [Refer](en/extend/editor.md)

# 2018.11.09

- Add Apple Pencil related API: [Refer](en/uikit/view.md)

# 2018.10.21

- Add XML related API: [Refer](en/extend/xml.md)

# 2018.10.05

- Add Lottie View related: [Refer](en/component/lottie.md)

# 2018.08.26

- Add Web Socket related: [Refer](en/network/socket.md)
- Add Web Server related: [Refer](en/network/server.md)

# 2018.08.11

- Add SQLite documentation: [Refer](en/sqlite/intro.md)

# 2018.07.29

- Add Shortcuts introduction: [Refer](en/shortcuts/intro.md)

# 2018.07.22

- Add built-in functions reference: [Refer](en/function/intro.md)

# 2018.07.18

- Add group related methods to $contact: [Refer](en/sdk/contact.md)

# 2018.07.08

- Runtime syntactic sugar: [Refer](en/runtime/sugar.md)

# 2018.06.27

- matrix supports reorder: [Refer](en/component/matrix.md)
- matrix supports itemSize function: [Refer](en/component/matrix.md)
- matrix & list support forEachItem function: [Refer](en/component/matrix.md)

# 2018.06.17

- $audio.play supports events: [Refer](en/media/audio.md)

# 2018.06.14

- Add $widget docs: [Refer](en/widget/method.md)

# 2018.06.08

- Add Lua vm docs: [Refer](en/vm/lua.md)

# 2018.05.15

- Improve runtime docs: [Refer](en/runtime/blocks.md)
- Add C function docs: [Refer](en/runtime/c.md)

# 2018.04.18

- Add Promise docs: [Refer](en/promise/intro.md)

# 2018.04.07

- Add SSH APIs: [Refer](en/ssh/intro.md)

# 2018.04.06

- Add markdown APIs: [Refer](en/extend/text.md)

# 2018.04.01

- Add view debugging: [Refer](en/uikit/render.md)

# 2018.03.25

- Add docs about ifa_data: [Refer](en/foundation/network.md)
- Add docs about ping: [Refer](en/foundation/network.md)

# 2018.03.18

- Add docs about keyboard: [Refer](keyboard/method.md)

# 2018.03.11

- Add $location.select

# 2018.03.09

- Add overview for $push: [Refer](en/extend/push.md)
- Add $http.startServer: [Refer](en/foundation/network.md)
- Add language support for $text.speech

# 2018.02.28

- Add new format: [Refer](en/package/intro.md)

# 2017.07.15

- Initial version

```

## docs/en/about/guide.md

```markdown
# Tab 1

- Tap the add button to create a script
- Swipe a row to delete the script
- Long press a row to reorder the items
- Tap a row to edit the script
- Tap the play button to run the script

# Tab 2

- Listed a series of useful resources to learn JavaScript
- Please pay more attention on the JSBox Guides

# Tab 3

- You could pin your favorite script here
- You could launch this script using 3D Touch action

# Tab 4

- Listed JSBox settings
- You could contact us here
- Welcome to give us a review on App Store

# Launch Script from Other Apps

- JSBox provides Today Widget
- JSBox provides Action Extension as well

# How to Use Code Editor

- Swipe the toolbar to move cursor
- Long press a symbol to show related symbols
- Tap command/option key to switch keyboards
- Tap return key to dismiss the keyboard
```

## docs/en/addin/method.md

```markdown
> We can manage our scripts with $addin APIs

# $addin.list

Get all installed addins (scripts):

```js
const addins = $addin.list;
```

Data Structure:

Prop | Type | Read/Write | Description
---|---|---|---
name | string | rw | name
category | string | rw | category
url | string | rw | url
data | $data | rw | file
id | string | rw | id
version | string | rw | version number
icon | string | rw | icon name
iconImage | image | r | icon image
module | bool | rw | whether a module
author | string | rw | author name
website | string | rw | author website

Only `name` and `data` are necessary, other fields are optional.

You can modify the `addins`, such as reordering, and save it like this:

```js
$addin.list = addins;
```

# $addin.categories

Returns all categories as a string array:

```js
const categories = $addin.categories;
```

You can modify it, such as reordering or adding new category, and save it like this:

```js
$addin.categories = categories;
```

# $addin.current

Get current running addin:

```js
const current = $addin.current;
```

# $addin.save(object)

Install a new addin:

```js
$addin.save({
  name: "New Script",
  data: $data({string: "$ui.alert('Hey!')"}),
  handler: function(success) {
    
  }
})
```

JSBox will install a new script named `New Script`, the data structure just like we mentioned before.

# $addin.delete(name)

Delete an installed addin:

```js
$addin.delete("New Script")
```

A script named `New Script` will be deleted.

# $addin.run(name)

Run a script with name:

```js
$addin.run("New Script")
```

A script named `New Script` will be started.

Since v1.15.0, you can also put an extra parameter here:

```js
$addin.run({
  name: "New Script",
  query: {
    "a": "b"
  }
})
```

It will be passed to `$context.query`.

# $addin.restart()

Restart current running script.

# $addin.replay()

Replay the current running UI script.

# $addin.compile(script)

Convert scripts to JSBox syntax:

```js
const result = $addin.compile("$ui.alert('Hey')");

// result => JSBox.ui.alert('Hey')
```

# $addin.eval(script)

Similar to `eval()`, but convert script to JSBox syntax first:

```js
$addin.eval("$ui.alert('Hey')");
```
```

## docs/en/addin/sample.md

```markdown
> In order to understand $addin APIs are very important, we created two examples

- Import scripts from inbox: [sync-inbox](https://github.com/cyanzhong/xTeko/blob/master/extension-demos/sync-inbox.js)
- Install scripts online: [addin-gallery](https://github.com/cyanzhong/xTeko/blob/master/extension-demos/addin-gallery.js)

For the purpose of safety, we don't provide any solution to install a script by user.

You should understand the meaning of script before you run it.
```

## docs/en/component/blur.md

```markdown
# type: "blur"

`blur` is designed to add a blur effect:

```js
{
  type: "blur",
  props: {
    style: 1 // 0 ~ 20
  },
  layout: $layout.fill
}
```

`style` 0 ~ 20 stands for different blur styles, [reference](en/data/constant.md?id=blurstyle).

# props

Prop | Type | Read/Write | Description
---|---|---|---
style | $blurStyle | w | effect style
```

## docs/en/component/button.md

```markdown
# type: "button"

`button` is designed to create a button to handle tap action:

```js
{
  type: "button",
  props: {
    title: "Click"
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
  }
}
```

It shows a `Click` button.

Similar to image view, it supports configure the image content with a `src`.

In addition, button also supports JSBox icon set, [refer](en/data/method.md?id=iconcode-color-size).

# props

Prop | Type | Read/Write | Description
---|---|---|---
title | string | rw | title
titleColor | $color | rw | title color
font | $font | rw | font
src | string | rw | image url
source | object | rw | image loading info
symbol | string | rw | SF symbols id
image | image | rw | icon image
icon | $icon | w | builtin icon
type | $btnType | r | button type
menu | object | w | Pull-Down menu
contentEdgeInsets | $insets | rw | content edge insets
titleEdgeInsets | $insets | rw | title edge insets
imageEdgeInsets | $insets | rw | image edge insets

# props: source

After v1.55.0, the image can be specified with `source` for more detailed information:

```js
source: {
  url: url,
  placeholder: image,
  header: {
    "key1": "value1",
    "key2": "value2",
  }
}
```

# events: tapped

To support tap event on buttons, implement `tapped`:

```js
events: {
  tapped: function(sender) {
    
  }
}
```

# Pull-Down Menus

`button` supports Pull-Down Menus, refer to [Pull-Down Menus](en/uikit/context-menu?id=pull-down-menus) for usage.
```

## docs/en/component/canvas.md

```markdown
# type: "canvas"

`canvas` provides drawing ability to JSBox, in most cases you could create UI with views, but sometimes you need to draw something:

```js
{
  type: "canvas",
  layout: $layout.fill,
  events: {
    draw: function(view, ctx) {
      var centerX = view.frame.width * 0.5
      var centerY = view.frame.height * 0.3
      var radius = 50.0
      ctx.fillColor = $color("red")
      ctx.moveToPoint(centerX, centerY - radius)
      for (var i=1; i<5; ++i) {
        var x = radius * Math.sin(i * Math.PI * 0.8)
        var y = radius * Math.cos(i * Math.PI * 0.8)
        ctx.addLineToPoint(x + centerX, centerY - y)
      }
      ctx.fillPath()
    }
  }
}
```

It creates a red pentagram, the radius is 50pt.

# ctx

`canvas` is very complicated, and is still under construction, please refer [CoreGraphics](https://developer.apple.com/documentation/coregraphics) to learn more.

`ctx` means a context in drawing operations, to understand that please read Apple Developer Docs first.

Here are some interfaces we implemented now.

# ctx.fillColor

`fillColor` is the color to fill a rect.

# ctx.strokeColor

`strokeColor` is the color to draw a line.

# ctx.font

`font` is the font to draw texts.

# ctx.fontSize

`fontSize` is the font size when draw texts.

# ctx.allowsAntialiasing

`allowsAntialiasing` allows antialiasing.

# saveGState()

Save current state.

# restoreGState()

Restore state.

# scaleCTM(sx, sy)

Scale CTM.

# translateCTM(tx, ty)

Translate CTM.

# rotateCTM(scale)

Rotate CTM.

# setLineWidth(width)

Set the line width of context.

# setLineCap(lineCap)

Set the line cap of context: https://developer.apple.com/documentation/coregraphics/cglinecap

# setLineJoin(lineJoin)

Set the line join of context: https://developer.apple.com/documentation/coregraphics/cglinejoin

# setMiterLimit(miterLimit)

Set the miter limit of context: https://developer.apple.com/documentation/coregraphics/cgcontext/1456499-setmiterlimit

# setAlpha(alpha)

Set the alpha value of context.

# beginPath()

Begin a path.

# moveToPoint(x, y)

Move a point to (x, y).

# addLineToPoint(x, y)

Add a line to point (x, y).

# addCurveToPoint(cp1x, cp1y, cp2x, cp2y, x, y)

Add a curve to point (x, y), the curvature is controlled by `(cp1x, cp1y)` and `(cp2x, cp2y)`.

# addQuadCurveToPoint(cpx, cpy, x, y)

Add a curve to point (x, y), the curvature is controlled by `(cpx, cpy)`.

# closePath()

Close the path.

# addRect(rect)

Add a rect.

# addArc(x, y, radius, startAngle, endAngle, clockwise)

Add an arc, centered at `(x, y)`, starts from `startAngle`, ends with `endAngle`.

# addArcToPoint(x1, y1, x2, y2, radius)

Add an arch between `(x1, y1)` and `(x2, y2)`.

# fillRect(rect)

Fill the rect.

# strokeRect(rect)

Stroke the rect.

# clearRect(rect)

Clear the rect.

# fillPath()

Fille the path.

# strokePath()

Stroke the path.

# drawPath(mode)

Draw the context's path using drawing mode:

```
0: kCGPathFill,
1: kCGPathEOFill,
2: kCGPathStroke,
3: kCGPathFillStroke,
4: kCGPathEOFillStroke,
```

Reference: https://developer.apple.com/documentation/coregraphics/1455195-cgcontextdrawpath

# drawImage(rect, image)

Draw an image to rect.

# drawText(rect, text, attributes)

Draw a text to rect:

```js
ctx.drawText($rect(0, 0, 100, 100), "Hey!", {
  color: $color("red"),
  font: $font(30)
});
```
```

## docs/en/component/chart.md

```markdown
# type: "chart"

`chart` displays chart for data visualization:

```js
{
  type: "chart",
  props: {
    options: {
      "legend": {
        "data": ["Chart"]
      },
      "xAxis": {
        "data": [
          "A",
          "B",
          "C",
          "D"
        ]
      },
      "yAxis": {},
      "series": [
        {
          "name": "foo",
          "type": "bar",
          "data": [5, 20, 36, 10]
        }
      ]
    }
  },
  layout: $layout.fill
}
```

It shows you a columnar chart, options are exactly the same as [echarts](https://ecomfe.github.io/echarts-doc/public/en/option.html).

# Dynamic Plotting

Sometimes we need to generate the data dynamically, it can be done with JavaScript functions, in that case you need to render the chart with template string:

```js
$ui.render({
  views: [
    {
      type: "chart",
      layout: $layout.fill,
      events: {
        ready: chart => {
          let options = `
          options = {
            tooltip: {},
            backgroundColor: "#fff",
            visualMap: {
              show: false,
              dimension: 2,
              min: -1,
              max: 1,
              inRange: {
                color: [
                  "#313695",
                  "#4575b4",
                  "#74add1",
                  "#abd9e9",
                  "#e0f3f8",
                  "#ffffbf",
                  "#fee090",
                  "#fdae61",
                  "#f46d43",
                  "#d73027",
                  "#a50026"
                ]
              }
            },
            xAxis3D: {
              type: "value"
            },
            yAxis3D: {
              type: "value"
            },
            zAxis3D: {
              type: "value"
            },
            grid3D: {
              viewControl: {
                // projection: 'orthographic'
              }
            },
            series: [
              {
                type: "surface",
                wireframe: {
                  // show: false
                },
                equation: {
                  x: {
                    step: 0.05
                  },
                  y: {
                    step: 0.05
                  },
                  z: function(x, y) {
                    if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) {
                      return "-";
                    }
                    return Math.sin(x * Math.PI) * Math.sin(y * Math.PI);
                  }
                }
              }
            ]
          };`;
          chart.render(options);
        }
      }
    }
  ]
});
```

Define the options with `options = `, you can use functions inside the string.

# chart.dispatchAction(args)

Trigger actions:

```js
chart.dispatchAction({
  type: "dataZoom",
  start: 20,
  end: 30
});
```

# chart.getWidth(handler)

Get width of the chart:

```js
let width = await chart.getWidth();
```

# chart.getHeight(handler)

Get height of the chart:

```js
let height = await chart.getHeight();
```

# chart.getOption(handler)

Get options of the chart:

```js
let options = await chart.getOption();
```

# chart.resize($size)

Resize the chart:

```js
chart.resize($size(100, 100));
```

# chart.showLoading()

Shows loading animation:

```js
chart.showLoading();
```

# chart.hideLoading()

Hides loading animation:

```js
chart.hideLoading();
```

# chart.clear()

Clear current chart:

```js
chart.clear();
```

# event: rendered

`rendered` will be called after rendered:

```js
events: {
  rendered: () => {

  }
}
```

# event: finished

`finished` will be called when finish:

```js
events: {
  finished: () => {

  }
}
```

# WebView

Chart view is an [ECharts](https://ecomfe.github.io/echarts-doc/public/en/index.html) wrapper that uses WebView, so you can use all features in WebView, such as JavaScript injection and $notify, please refer to [WebView](en/component/web.md) for details.

More examples: https://github.com/cyanzhong/xTeko/tree/master/extension-demos/charts
```

## docs/en/component/code.md

```markdown
# type: "code"

Text view that provides syntax highlighting, and code editing, supports many commonly used languages and themes:

```js
$ui.render({
  views: [
    {
      type: "code",
      props: {
        text: "const value = 100"
      },
      layout: $layout.fill
    }
  ]
});
```

You can control its behavior with parameters like below:

Prop | Type | Default | Description
---|---|---|---
language | string | javascript | programming language
theme | string | nord | editor theme
darkKeyboard | bool | true | uses dark mode
adjustInsets | bool | true | adjust insets automatically
lineNumbers | bool | false | shows line numbers
invisibles | bool | false | show invisible characters
linePadding | number | null | line padding
keys | [string] | null | toolbar keys

Note that, those parameters have to be defined when creating a code view, cannot be overridden later.

Besides, code view inherits from text view, it behaves exactly the same as [`type: text`](en/component/text.md).

For instance, disable editing with `editable: false`. Or, control its content with the `text` property:

```js
const view = $("codeView");
const code = view.text;
view.text = "console.log([1, 2, 3])";
```

Of course, all events are supported:

```js
$ui.render({
  views: [
    {
      type: "code",
      props: {
        text: "const value = 100"
      },
      layout: $layout.fill,
      events: {
        changed: sender => {
          console.log("code changed");
        }
      }
    }
  ]
});
```

# props: language

`code` view is based on [highlightjs](https://highlightjs.org/), you can find all supported languages here: https://github.com/highlightjs/highlight.js/tree/master/src/languages

For example, syntax highlighting for Python:

```js
props: {
  language: "python"
}
```

# props: theme

`code` view is based on [highlightjs](https://highlightjs.org/), you can find all supported themes here: https://github.com/highlightjs/highlight.js/tree/master/src/styles

For example, use the `atom-one-light` theme:

```js
props: {
  theme: "atom-one-light"
}
```

# props: adjustInsets

In many cases, the keyboard is annoying because it hides the editing area. `code` view handles that for you, by default. It observes the keyboard height, and adjust the content insets automatically.

However, it's hard to make it perfect, you can disable it with `adjustInsets: false`.

# props: keys

By default, there will be an editing toolbar, here is how to customize:

```js
$ui.render({
  views: [
    {
      type: "code",
      props: {
        language: "markdown",
        keys: [
          "#",
          "-",
          "*",
          "`",
          //...
        ]
      },
      layout: $layout.fill
    }
  ]
});
```

If you want to remove the toolbar, you can override `accessoryView`.
```

## docs/en/component/date-picker.md

```markdown
# type: "date-picker"

`date-picker` is designed to display a date picker:

```js
{
  type: "date-picker",
  layout: function(make) {
    make.left.top.right.equalTo(0)
  }
}
```

Create a simple date picker.

# props

Prop | Type | Read/Write | Description
---|---|---|---
date | object | rw | current date
min | object | rw | minimum date
max | object | rw | maximum date
mode | number | rw | [Refer](https://developer.apple.com/documentation/uikit/uidatepickermode)
interval | number | rw | step (in minute)

# events: changed

`changed` will be called if the date has changed:

```js
changed: function(sender) {
  
}
```
```

## docs/en/component/gallery.md

```markdown
# type: "gallery"

`gallery` is used to display a series of views, it can be scrolled horizontally:

```js
{
  type: "gallery",
  props: {
    items: [
      {
        type: "image",
        props: {
          src: "https://images.apple.com/v/iphone/home/v/images/home/limited_edition/iphone_7_product_red_large_2x.jpg"
        }
      },
      {
        type: "image",
        props: {
          src: "https://images.apple.com/v/iphone/home/v/images/home/airpods_large_2x.jpg"
        }
      },
      {
        type: "image",
        props: {
          src: "https://images.apple.com/v/iphone/home/v/images/home/apple_pay_large_2x.jpg"
        }
      }
    ],
    interval: 3,
    radius: 5.0
  },
  layout: function(make, view) {
    make.left.right.inset(10)
    make.centerY.equalTo(view.super)
    make.height.equalTo(320)
  }
}
```

Create a gallery with 3 images.

# props

Prop | Type | Read/Write | Description
---|---|---|---
items | object | w | all items
page | number | rw | current page index
interval | number | rw | autoplay interval, 0 means off
pageControl | $view | r | page control component

# events

changed will be called when page changes:

```js
changed: function(sender) {
  
}
```

# Retrieve subviews

You can retrieve subviews with methods as below:

```js
const views = $("gallery").itemViews; // All views
const view = $("gallery").viewWithIndex(0); // The first view
```

# Scroll to a page

If you want to scroll to a page with animation, do this:

```js
$("gallery").scrollToPage(index);
```
```

## docs/en/component/gradient.md

```markdown
# type: "gradient"

Create a gradient layer:

```js
$ui.render({
  props: {
    bgcolor: $color("white")
  },
  views: [
    {
      type: "gradient",
      props: {
        colors: [$color("red"), $color("clear"), $color("blue")],
        locations: [0.0, 0.5, 1.0],
        startPoint: $point(0, 0),
        endPoint: $point(1, 1)
      },
      layout: function(make, view) {
        make.left.top.equalTo(0)
        make.size.equalTo($size(100, 100))
      }
    }
  ]
})
```

The design is exactly same as CAGradientLayer, for detail please refer to: https://developer.apple.com/documentation/quartzcore/cagradientlayer

# props

Prop | Type | Read/Write | Description
---|---|---|---
colors | array | rw | colors
locations | array | rw | locations
startPoint | $point | rw | start point
endPoint | $point | rw | end point
```

## docs/en/component/image.md

```markdown
# type: "image"

`image` is used to display an image, the resource could be local or remote.

```js
{
  type: "image",
  props: {
    src: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg"
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
    make.size.equalTo($size(100, 100))
  }
}
```

Load an image using remote resource, the size is 100*100.

scr could be a base64 data starts with `data:image`:

```js
{
  type: "image",
  props: {
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAASCAMAAAB7LJ7rAAAANlBMVEUAAABnZ2dmZmZmZmZnZ2dmZmZmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhnZ2dnZ2dubm5paWlmZmbvpwLOAAAAEXRSTlMA9h6lQ95r4cmLdHNbTzksJ9o8+Y0AAABcSURBVCjPhc1JDoAwFAJQWus8cv/LqkkjMXwjCxa8BfjLWuI9L/nqhmwiLYnpAMjqpuQMDI+bcgNyW921A+Sxyl3NXeWu7lL3WOXS0Ck1N3WXut/HEz6z92l8Lyf1mAh1wPbVFAAAAABJRU5ErkJggg=="
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
    make.size.equalTo($size(100, 100))
  }
}
```

In addition, src supports url starts with `share://` and `drive://` to load files in JSBox.

Finally, JSBox icon set is also supported by image, [refer](en/data/method.md?id=iconcode-color-size).

# props

Prop | Type | Read/Write | Description
---|---|---|---
src | string | w | source url
source | object | rw | image loading info
symbol | string | rw | SF symbols id
data | $data | w | binary file
size | $size | r | image size
orientation | number | r | image orientation
info | object | r | information, metadata
scale | number | r | image scale

# props: source

After v1.55.0, the image can be specified with `source` for more detailed information:

```js
source: {
  url: url,
  placeholder: image,
  header: {
    "key1": "value1",
    "key2": "value2",
  }
}
```

# Zoomable

Since `v1.56.0`, you can create zoomable images easily:

```js
$ui.render({
  views: [
    {
      type: "scroll",
      props: {
        zoomEnabled: true,
        maxZoomScale: 3, // Optional, default is 2,
        doubleTapToZoom: false // Optional, default is true
      },
      layout: $layout.fill,
      views: [
        {
          type: "image",
          props: {
            src: "https://..."
          },
          layout: $layout.fill
        }
      ]
    }
  ]
});
```

All you need to do is just wrapping the image view with a `scroll` view, and set it as `zoomEnabled`.

# alwaysTemplate

Returns a new image with the `template` rendering image, it can be used with `tintColor` to change the image color:

```js
{
  type: "image",
  props: {
    tintColor: $color("red"),
    image: rawImage.alwaysTemplate
  }
}
```

The ahove `rawImage` is the original image you have.

# alwaysOriginal

It's similar to `alwaysTemplate`, but it returns an image with the `original` rendering mode, `tintColor` will be ignored.

# resized($size)

Get a resized image:

```js
const resizedImage = image.resized($size(60, 60));
```

# resizableImage(args)

Get a resizable image:

```js
const resizableImage = image.resizableImage($insets(10, 10, 10, 10));
```

You can specify the fill mode as `tile` (default to stretch):

```js
const resizableImage = image.resizableImage({
  insets: $insets(10, 10, 10, 10),
  mode: "tile"
});
```
```

## docs/en/component/input.md

```markdown
# type: "input"

`input` is used to create a text field, to receive text from users:

```js
{
  type: "input",
  props: {
    type: $kbType.search,
    darkKeyboard: true,
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
    make.size.equalTo($size(100, 32))
  }
}
```

This code shows a text field on screen, the keyboard will be dark mode.

# props

Prop | Type | Read/Write | Description
---|---|---|---
type | $kbType | rw | type
darkKeyboard | boolean | rw | dark mode
text | string | rw | text content
styledText | object | rw | styled text, [refer](en/component/text.md?id=styledtext)
textColor | $color | rw | text color
font | $font | rw | font
align | $align | rw | alignment
placeholder | string | rw | placeholder
clearsOnBeginEditing | boolean | rw | clears text on begin
autoFontSize | boolean | rw | adjust font size automatically
editing | boolean | r | is editing
secure | boolean | rw | is password

# focus()

Get the focus, show keyboard.

# blur()

Blur the focus, dismiss keyboard.

# events: changed

`changed` will be called when text changed:

```js
changed: function(sender) {

}
```

# events: returned

`returned` will be called once the return key pressed:

```js
returned: function(sender) {

}
```

# events: didBeginEditing

`didBeginEditing` will be called after editing began:

```js
didBeginEditing: function(sender) {

}
```

# events: didEndEditing

`didEndEditing` will be called after editing ended:

```js
didEndEditing: function(sender) {
  
}
```

# Customize keyboard toolbar

You can customize toolbar as below:

```js
$ui.render({
  views: [
    {
      type: "input",
      props: {
        accessoryView: {
          type: "view",
          props: {
            height: 44
          },
          views: [

          ]
        }
      }
    }
  ]
});
```

# Customize keyboard view

You can customize keyboard as below:

```js
$ui.render({
  views: [
    {
      type: "input",
      props: {
        keyboardView: {
          type: "view",
          props: {
            height: 267
          },
          views: [

          ]
        }
      }
    }
  ]
});
```

# $input.text(object)

Instead of create a text field, you could also use `$input.text`:

```js
$input.text({
  type: $kbType.number,
  placeholder: "Input a number",
  handler: function(text) {

  }
})
```

# $input.speech(object)

Speech to text:

```js
$input.speech({
  locale: "en-US", // Optional
  autoFinish: false, // Optional
  handler: function(text) {

  }
})
```

It shows a popup text field to user directly, it's much easier.
```

## docs/en/component/label.md

```markdown
# type: "label"

`label` is designed to display text:

```js
{
  type: "label",
  props: {
    text: "Hello, World!",
    align: $align.center
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
  }
}
```

It shows `Hello, World!` on the screen.

# props

Prop | Type | Read/Write | Description
---|---|---|---
text | string | rw | text content
styledText | object | rw | styled text, [refer](en/component/text.md?id=styledtext)
font | $font | rw | font
textColor | $color | rw | text color
shadowColor | $color | rw | shadow color
align | $align | rw | alignment
lines | number | rw | lines, 0 means no limit
autoFontSize | boolean | rw | adjust font size automatically
```

## docs/en/component/list.md

```markdown
# type: "list"

`list` is the most complicated control in JSBox, it used to arrange a series of views:

```js
{
  type: "list",
  props: {
    data: ["JavaScript", "Swift"]
  },
  layout: $layout.fill,
}
```

It creates a list with only one section, each row inside is a label.

If you want to create a list with multiple sections, you need to:

```js
{
  type: "list",
  props: {
    data: [
      {
        title: "Section 0",
        rows: ["0-0", "0-1", "0-2"]
      },
      {
        title: "Section 1",
        rows: ["1-0", "1-1", "1-2"]
      }
    ]
  },
  layout: $layout.fill,
}
```

It creates 2 sections, each section has 3 rows, choose what you want.

Above samples are plain text list, actually list cells could be customized, we call it `template`:

```js
template: {
  props: {
    bgcolor: $color("clear")
  },
  views: [
    {
      type: "label",
      props: {
        id: "label",
        bgcolor: $color("#474b51"),
        textColor: $color("#abb2bf"),
        align: $align.center,
        font: $font(32)
      },
      layout: $layout.fill
    }
  ]
}
```

Views in template is just a common view like you know in `$ui.render`.

Now you could construct your `data` as:

```js
data: [
  {
    label: {
      text: "Hello"
    }
  },
  {
    label: {
      text: "World"
    }
  }
]
```

While rendering a row, JSBox searches each view by `id`, then configures all properties.

With `template` and `data`, we almost can implement any style if we want, and don't forget, we also can use multiple sections with templates.

# header & footer

`header` and `footer` are views, they are attached at the top/bottom of a list:

```js
footer: {
  type: "label",
  props: {
    height: 20,
    text: "Write the Code. Change the world.",
    textColor: $color("#AAAAAA"),
    align: $align.center,
    font: $font(12)
  }
}
```

Note: please specify the `height` manually in props.

# Static cells

Cells in template are reused by iOS automatically, sometimes you want to static data to render them.

JSBox could do that for you, you just need to put your view in `data`:

```js
data: [
  {
    title: "System (Text)",
    rows: [
      {
        type: "button",
        props: {
          title: "Button",
          selectable: false
        },
        layout: function(make, view) {
          make.center.equalTo(view.super)
          make.width.equalTo(64)
        },
        events: {
          tapped: function(sender) {
            $ui.toast("Tapped")
          }
        }
      }
    ]
  },
  {
    title: "System (Contact Add)",
    rows: [
      {
        type: "button",
        props: {
          type: 5
        },
        layout: $layout.center
      }
    ]
  }
]
```

It creates some static cells, instead of reuse them dynamically.

The `selectable` property indicates whether the cell is selectable, default to false.

# props

Prop | Type | Read/Write | Description
---|---|---|---
style | number | w | style 0 ~ 2
data | object | rw | data source
separatorInset | $insets | rw | separator inset
separatorHidden | boolean | rw | hide separator
separatorColor | $color | rw | separator color
header | object | rw | header view
footer | object | rw | footer view
rowHeight | number | w | row height
autoRowHeight | boolean | w | whether auto sizing
estimatedRowHeight | number | w | estimated row height
sectionTitleHeight | number | w | section title height
selectable | bool | w | is row selectable
stickyHeader | boolean | w | section/header are sticky
reorder | boolean | rw | whether can be reordered
crossSections | boolean | rw | whether recorder can cross sections
hasActiveAction | boolean | r | whether an action is being used

# props: actions

`actions` is designed to provide swipe actions:

```js
actions: [
  {
    title: "delete",
    color: $color("gray"), // default to gray
    handler: function(sender, indexPath) {

    }
  },
  {
    title: "share",
    handler: function(sender, indexPath) {

    }
  }
]
```

It creates 2 swipe actions, named `delete` and `share`.

Use `swipeEnabled` to decide whether users can swipe a row:

```js
swipeEnabled: function(sender, indexPath) {
  return indexPath.row > 0;
}
```

That means the first row can't be swiped.

# object($indexPath)

Returns the row data at indexPath:

```js
const data = tableView.object($indexPath(0, 0));
```

# insert(object)

Insert new data at indexPath or index:

```js
// Either indexPath or index, the value shoule be a row data
tableView.insert({
  indexPath: $indexPath(0, 0),
  value: "Hey!"
})
```

# delete(object)

Delete a row at indexPath or index:

```js
// object could be indexPath or index
tableView.delete(0)
```

# cell($indexPath)

Returns the cell at indexPath (might be null):

```js
const cell = tableView.cell($indexPath(0, 0));
```

# events: rowHeight

We could specify row height dynamically by making the `rowHeight` a function:

```js
rowHeight: function(sender, indexPath) {
  if (indexPath.row == 0) {
    return 88.0
  } else {
    return 44.0
  }
}
```

# events: sectionTitleHeight

We could specify section title height dynamically by making the `sectionTitleHeight` a function:

```js
sectionTitleHeight: (sender, section) => {
  if (section == 0) {
    return 30;
  } else {
    return 40;
  }
}
```

# events: didSelect

`didSelect` will be called once a row selected:

```js
didSelect: function(sender, indexPath, data) {

}
```

# events: didLongPress

`didLongPress` will be called when cell is long pressed:

```js
didLongPress: function(sender, indexPath, data) {

}
```

# events: forEachItem

Iterate all items:

```js
forEachItem: function(view, indexPath) {
  
}
```

# Auto sizing cells

In many cases, we want to calculate row height manually. For example, we want to display sentences that have different length.

Starting from v2.5.0, list view supports auto sizing, just set `autoRowHeight` and `estimatedRowHeight`, then provide proper layout constraints:

```js
const sentences = [
  "Although moreover mistaken kindness me feelings do be marianne.",
  "Effects present letters inquiry no an removed or friends. Desire behind latter me though in. Supposing shameless am he engrossed up additions. My possible peculiar together to. Desire so better am cannot he up before points. Remember mistaken opinions it pleasure of debating. Court front maids forty if aware their at. Chicken use are pressed removed.",
  "He went such dare good mr fact. The small own seven saved man age ﻿no offer. Suspicion did mrs nor furniture smallness. Scale whole downs often leave not eat. An expression reasonably cultivated indulgence mr he surrounded instrument. Gentleman eat and consisted are pronounce distrusts.",
];

$ui.render({
  views: [
    {
      type: "list",
      props: {
        autoRowHeight: true,
        estimatedRowHeight: 44,
        template: [
          {
            type: "image",
            props: {
              id: "icon",
              symbol: "text.bubble"
            },
            layout: (make, view) => {
              make.left.equalTo(10);
              make.size.equalTo($size(24, 24));
              make.centerY.equalTo(view.super);
            }
          },
          {
            type: "label",
            props: {
              id: "label",
              lines: 0
            },
            layout: (make, view) => {
              const insets = $insets(10, 44, 10, 10);
              make.edges.equalTo(view.super).insets(insets);
            }
          }
        ],
        data: sentences.map(text => {
          return {
            "label": {text}
          }
        })
      },
      layout: $layout.fill
    }
  ]
});
```

For simple list that shows strings, also supports auto-sizing:

```js
const sentences = [
  "Although moreover mistaken kindness me feelings do be marianne.",
  "Effects present letters inquiry no an removed or friends. Desire behind latter me though in. Supposing shameless am he engrossed up additions. My possible peculiar together to. Desire so better am cannot he up before points. Remember mistaken opinions it pleasure of debating. Court front maids forty if aware their at. Chicken use are pressed removed.",
  "He went such dare good mr fact. The small own seven saved man age ﻿no offer. Suspicion did mrs nor furniture smallness. Scale whole downs often leave not eat. An expression reasonably cultivated indulgence mr he surrounded instrument. Gentleman eat and consisted are pronounce distrusts.",
];

$ui.render({
  views: [
    {
      type: "list",
      props: {
        autoRowHeight: true,
        data: sentences
      },
      layout: $layout.fill
    }
  ]
});
```

# Long press rows

List view supports long press to reorder items, we need to turn on this feature:

```js
props: {
  reorder: true
}
```

In addition, we need to implement several methods:

Reorder action began:

```js
reorderBegan: function(indexPath) {

}
```

User moved a row:

```js
reorderMoved: function(fromIndexPath, toIndexPath) {
  // Reorder your data source here
}
```

User finished reordering:

```js
reorderFinished: function(data) {
  // Save your data source here
}
```

Decide whether it can be reordered by:

```js
canMoveItem: function(sender, indexPath) {
  return indexPath.row > 0;
}
```

It disables the first item's long press.

In short, we need to update data in `reorderMoved` and `reorderFinished`.

More example: https://github.com/cyanzhong/xTeko/blob/3ac0d3f5ac552a1c72ea39d0bd1099fd02f5ca70/extension-scripts/xteko-menu.js

# Paging

Let's see an example first:

```js
let data = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];
$ui.render({
  views: [
    {
      type: "list",
      props: { data },
      layout: $layout.fill,
      events: {
        didReachBottom: function(sender) {
          $ui.toast("fetching...")
          $delay(1.5, () => {
            sender.endFetchingMore()
            data = data.concat(data.map(item => {
              return (parseInt(item) + 15).toString()
            }))
            $("list").data = data
          })
        }
      }
    }
  ]
})
```

When list view reaches bottom, it triggers `didReachBottom` method, we load more data here.

When load more finished, we call `endFetchingMore` first to terminate the loading state, and update data source.

Finally, we setup the data back to the list view.

# setEditing

Set editing state programmatically:

```js
$("list").setEditing(false)
```

# scrollTo

Scroll to a specific indexPath programmatically:

```js
$("list").scrollTo({
  indexPath: $indexPath(0, 0),
  animated: true // Default is true
})
```

# One more thing

List views are subclasses of scroll view, they have all abilities inherited from scroll view.
```

## docs/en/component/lottie.md

```markdown
# type: "lottie"

`lottie` creates a [Lottie](http://airbnb.io/lottie/) view:

```js
{
  type: "lottie",
  props: {
    src: "assets/lottie-btn.json",
  },
  layout: (make, view) => {
    make.size.equalTo($size(100, 100));
    make.center.equalTo(view.super);
  }
}
```

`src` could be a bundle path, or a http url. Also, you can load lottie with `json` or `data`:

```js
// JSON
$("lottie").json = {};
// Data
$("lottie").data = $file.read("assets/lottie-btn.json");
```

# lottie.play(args?)

Play the animation:

```js
$("lottie").play();
```

Register completion callback:

```js
$("lottie").play({
  handler: finished => {

  }
});
```

Specify from frame and to frame:

```js
$("lottie").play({
  fromFrame: 0, // Optional
  toFrame: 0,
  handler: finished => {
    // Optional
  }
});
```

Specify from progress and to progress:

```js
$("lottie").play({
  fromProgress: 0, // Optional
  toProgress: 0.5,
  handler: finished => {
    // Optional
  }
});
```

Work with promise:

```js
let finished = await $("lottie").play({ toProgress: 0.5, async: true });
```

# lottie.pause()

Pause the animation:

```js
$("lottie").pause();
```

# lottie.stop()

Stop the animation:

```js
$("lottie").stop();
```

# lottie.update()

Force update current frame:

```js
$("lottie").update();
```

# lottie.progressForFrame(frame)

Convert frame to progress:

```js
let progress = $("lottie").progressForFrame(0);
```

# lottie.frameForProgress(progress)

Convert progress to frame:

```js
let frame = $("lottie").frameForProgress(0.5);
```

# props

Prop | Type | Read/Write | Description
---|---|---|---
json | json | w | load with json
data | $data | w | load with data
src | string | w | load with src
playing | bool | r | is playing
loop | bool | rw | is loop animation
autoReverse | bool | rw | is auto-reverse animation
progress | number | rw | animation progress
frameIndex | number | rw | current frame
speed | number | rw | animation speed
duration | number | r | animation duration

Learn more from here: https://github.com/cyanzhong/xTeko/tree/master/extension-demos/lottie-example
```

## docs/en/component/map.md

```markdown
# type: "map"

`map` is designed to display a map view:

```js
{
  type: "map",
  props: {
    location: {
      lat: 31.2990,
      lng: 120.5853
    }
  },
  layout: $layout.fill
}
```

It shows a map and locates at Suzhou, China.

# props

Prop | Type | Read/Write | Description
---|---|---|---
location | object | w | user location

We are still working on it, we might introduce new features like navigation in the future.
```

## docs/en/component/markdown.md

```markdown
# type: "markdown"

Render markdown contents, it's good way to display rich text:

```js
$ui.render({
  views: [
    {
      type: "markdown",
      props: {
        content: "# Hello, *World!*",
        style: // optional, custom style sheet
        `
        body {
          background: #f0f0f0;
        }
        `
      },
      layout: $layout.fill
    }
  ]
})
```

Prop | Type | Read/Write | Description
---|---|---|---
webView | $view | r | webView
content | string | rw | content
scrollEnabled | bool | rw | is scroll enabled
style | string | rw | custom style sheet
```

## docs/en/component/matrix.md

```markdown
# type: "matrix"

`matrix` is designed to show a grid view:

```js
{
  type: "matrix",
  props: {
    columns: 4,
    itemHeight: 88,
    spacing: 5,
    template: {
      props: {},
      views: [
        {
          type: "label",
          props: {
            id: "label",
            bgcolor: $color("#474b51"),
            textColor: $color("#abb2bf"),
            align: $align.center,
            font: $font(32)
          },
          layout: $layout.fill
        }
      ]
    }
  },
  layout: $layout.fill
}
```

Why we call it `matrix` instead of `grid` or `collection`?

Because `collection` looks so long and `grid` looks not cool.

The most important is, `The Matrix` is one of my favourite movie!

You can consider matrix is a special list with multiple columns anyway.

# props

Prop | Type | Read/Write | Description
---|---|---|---
data | object | rw | data source
spacing | number | w | spacing between items
itemSize | $size | w | item size of each item
autoItemSize | boolean | w | whether auto sizing
estimatedItemSize | $size | w | estimated item size
columns | number | w | column numbers
square | boolean | w | is square
direction | $scrollDirection | w | .vertical: vertically .horizontal: horizontally
selectable | boolean | rw | is selectable
waterfall | boolean | w | whether a waterfall layout (Pinterest-like)

Please choose constraints wisely to implement item size, `columns` must be provided for `waterfall` layout, layout issues can lead to app crash.

# header & footer

`header` and `footer` are views, they are attached at the top/bottom of a matrix:

```js
footer: {
  type: "label",
  props: {
    height: 20,
    text: "Write the Code. Change the world.",
    textColor: $color("#AAAAAA"),
    align: $align.center,
    font: $font(12)
  }
}
```

For fixed height, please specify the `height` manually in `props`. For dynamic height, provide a `height` function in its `events`:

```js
footer: {
  type: "label",
  props: {
    text: "Write the Code. Change the world."
  },
  events: {
    height: sender => {
      return _height;
    }
  }
}
```

When you want to change the height, update the `_height` value in the above example, then call `matrix.reload()` to trigger the update. For horizontal views, use `width` instead of `height` to specify its width.

# Dynamic header and footer

Since headers and footers on iOS are reusable, it's sometimes hard to update data dynamically. If you'd like to update your header or footer at runtime, you can use lazy rendering like this:

```js
footer: sender => {
  return {
    type: "view",
    props: {}
  }
}
```

In short, iOS calls this function at runtime to re-generate a heade or footer.

# object($indexPath)

Returns the item data at indexPath:

```js
const data = matrix.object($indexPath(0, 0));
```

# insert(object)

Insert new data to matrix:

```js
// Either indexPath or index is fine
matrix.insert({
  indexPath: $indexPath(0, 0),
  value: {

  }
})
```

# delete(object)

Delete a item at indexPath or index:

```js
// object could be either indexPath or index
matrix.delete($indexPath(0, 0))
```

# cell($indexPath)

Returns the cell at indexPath:

```js
const cell = matrix.cell($indexPath(0, 0));
```

# events: didSelect

`didSelect` will be called once item selected:

```js
didSelect: function(sender, indexPath, data) {

}
```

# events: didLongPress

`didLongPress` will be called when cell is long pressed:

```js
didLongPress: function(sender, indexPath, data) {

}
```

Of course, matrix is a subclass of scroll view, same as list.

# events: forEachItem

Iterate all items:

```js
forEachItem: function(view, indexPath) {
  
}
```

# events: highlighted

Customize highlighted visual:

```js
highlighted: function(view) {

}
```

# events: itemSize

Provide dynamic item size:

```js
itemSize: function(sender, indexPath) {
  var index = indexPath.item + 1;
  return $size(40 * index, 40 * index);
}
```

# scrollTo

Scroll to a specific indexPath programmatically:

```js
$("matrix").scrollTo({
  indexPath: $indexPath(0, 0),
  animated: true // Default to true
})
```

# Auto sizing cells

Starting from v2.5.0, matrix view supports auto sizing, just set `autoItemSize` and `estimatedItemSize`, then provide proper layout constraints:

```js
const sentences = [
  "Although moreover mistaken kindness me feelings do be marianne.",
  "Effects present letters inquiry no an removed or friends. Desire behind latter me though in.",
  "He went such dare good mr fact.",
];

$ui.render({
  views: [
    {
      type: "matrix",
      props: {
        autoItemSize: true,
        estimatedItemSize: $size(120, 0),
        spacing: 10,
        template: {
          props: {
            bgcolor: $color("#F0F0F0")
          },
          views: [
            {
              type: "image",
              props: {
                symbol: "sun.dust"
              },
              layout: (make, view) => {
                make.centerX.equalTo(view.super);
                make.size.equalTo($size(24, 24));
                make.top.equalTo(10);
              }
            },
            {
              type: "label",
              props: {
                id: "label",
                lines: 0
              },
              layout: (make, view) => {
                make.left.bottom.inset(10);
                make.top.equalTo(44);
                make.width.equalTo(100);
              }
            }
          ]
        },
        data: sentences.map(text => {
          return {
            "label": {text}
          }
        })
      },
      layout: $layout.fill
    }
  ]
});
```

# Long press rows

Matrix view supports long press to reorder items, we need to turn on this feature:

```js
props: {
  reorder: true
}
```

In addition, we need to implement several methods:

Reorder action began:

```js
reorderBegan: function(indexPath) {

}
```

User moved a row:

```js
reorderMoved: function(fromIndexPath, toIndexPath) {
  // Reorder your data source here
}
```

User finished reordering:

```js
reorderFinished: function(data) {
  // Save your data source here
}
```

Decide whether it can be reordered by:

```js
canMoveItem: function(sender, indexPath) {
  return indexPath.row > 0;
}
```

It disables the first item's long press.

In short, we need to update data in `reorderMoved` and `reorderFinished`.
```

## docs/en/component/menu.md

```markdown
# type: "tab" & type: "menu"

JSBox provides two menu types, use `tab` if you only have few items, use `menu` to display a lot of items:

```js
$ui.render({
  views: [
    {
      type: "menu",
      props: {
        items: ["item 1", "item 2", "item 3", "item 4", "item 5", "item 6", "item 7", "item 8", "item 9"],
        dynamicWidth: true, // dynamic item width, default is false
      },
      layout: function(make) {
        make.left.top.right.equalTo(0)
        make.height.equalTo(44)
      },
      events: {
        changed: function(sender) {
          const items = sender.items;
          const index = sender.index;
          $ui.toast(`${index}: ${items[index]}`)
        }
      }
    }
  ]
})
```

It creates a menu, and shows a toast if the selected item has changed.

`sender.items` represents all items, `sender.index` means selected index (starts from 0).

`index` could be used to set the initial value as well:

```js
props: {
  index: 1
}
```

Select the second item by default.
```

## docs/en/component/picker.md

```markdown
# type: "picker"

`picker` is used to display a general picker:

```js
{
  type: "picker",
  props: {
    items: Array(3).fill(Array.from(Array(256).keys()))
  },
  layout: function(make) {
    make.left.top.right.equalTo(0)
  }
}
```

It shows a rgb wheel, each part of them is independent.

Besides, you could also create a `cascade` picker, each colum is related tightly: 

```js
items: [
  {
    title: "Language",
    items: [
      {
        title: "Web",
        items: [
          {
            title: "JavaScript"
          },
          {
            title: "PHP"
          }
        ]
      },
      {
        title: "Client",
        items: [
          {
            title: "Swift"
          },
          {
            title: "Objective-C"
          }
        ]
      }
    ]
  },
  {
    title: "Framework",
    // ...
  }
]
```

This is a recursive structure, when user select `title`, the next wheel will update its rows.

# props

Prop | Type | Read/Write | Description
---|---|---|---
data | object | r | all selected items
selectedRows | object | r | all selected rows

# events: changed

`changed` will be called once the selected item changed:

```js
changed: function(sender) {
  
}
```

# $picker.date(object)

We provided an easy way to popup a date picker with `$picker.date(object)`.

# $picker.data(object)

We also provided an easy way to popup a general picker with `$picker.data(object)`.

The parameter of these 2 methods are exactly same as we mentioned before.

# $picker.color(object)

Select a color using the built-in color picker:

```js
const color = await $picker.color({
  // color: aColor
});
```
```

## docs/en/component/progress.md

```markdown
# type: "progress"

`progress` is used to create a progress bar, for example show download progress:

```js
{
  type: "progress",
  props: {
    value: 0.5
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
    make.width.equalTo(100)
  }
}
```

Create a progress bar, default value is 50%.

# props

Prop | Type | Read/Write | Description
---|---|---|---
value | number | rw | current value (0.0 ~ 1.0)
progressColor | $color | rw | color of the left part
trackColor | $color | rw | color of the right part
```

## docs/en/component/runtime.md

```markdown
# type: "runtime"

Initiate a view with Runtime APIs:

```js
const label = $objc("UILabel").$new();
label.$setText("Hey!");

$ui.render({
  views: [
    {
      type: "runtime",
      props: {
        view: label
      },
      layout: function(make, view) {
        make.center.equalTo(view.super);
      }
    }
  ]
});
```

With this solution, you can mix native views and runtime views.
```

## docs/en/component/scroll.md

```markdown
# type: "scroll"

`scroll` is used to create a scrollable view container:

```js
{
  type: "scroll",
  layout: function(make, view) {
    make.center.equalTo(view.super)
    make.size.equalTo($size(100, 500))
  },
  views: [
    {

    },
    {

    }
  ]
}
```

This container can be scrolled, but we should specify its content size first.

# Content Size

The content size means the size of scroll area, it might be larger than its frame.

We have two ways to set scroll views' content size.

The first one, provide size for all subviews that inside a scroll view:

```js
$ui.render({
  views: [{
    type: "scroll",
    layout: $layout.fill,
    views: [{
      type: "label",
      props: {
        text,
        lines: 0
      },
      layout: function(make, view) {
        make.width.equalTo(view.super)
        make.top.left.inset(0)
        make.height.equalTo(1000)
      }
    }]
  }]
})
```

Or, we could just set the `contentSize` of a scroll view manually:

```js
props: {
  contentSize: $size(0, 1000)
}
```

Specify content size of a scroll view is very important, otherwise it works weird.

# props

Prop | Type | Read/Write | Description
---|---|---|---
contentOffset | $point | rw | content offset
contentSize | $size | rw | content size
alwaysBounceVertical | boolean | rw | always bounce vertical
alwaysBounceHorizontal | boolean | rw | always bounce horizontal
pagingEnabled | boolean | rw | is paging enabled
scrollEnabled | boolean | rw | is scroll enabled
showsHorizontalIndicator | boolean | rw | shows horizontal indicator 
showsVerticalIndicator | boolean | rw | shows vertical indicator
contentInset | $insets | rw | content insets
indicatorInsets | $insets | rw | indicator insets
tracking | boolean | r | is tracking
dragging | boolean | r | is dragging
decelerating | boolean | r | is decelerating
keyboardDismissMode | number | rw | keyboard dismiss mode
zoomEnabled | bool | rw | zoom images with 2-finger pinch
maxZoomScale | number | rw | max zoom scale for images
doubleTapToZoom | number | rw | enables double tap to zoom

# beginRefreshing()

Begin the refreshing animation.

# endRefreshing()

End the refreshing animation.

# resize()

Resize the content size of itself.

# updateZoomScale()

Re-calculate the best scale for zoomable views, you may need to call this after screen rotation changes.

# scrollToOffset($point)

Scroll to an offset with animation:

```js
$("scroll").scrollToOffset($point(0, 100));
```

# events: pulled

`pulled` will be called once user triggered a refresh:

```js
pulled: function(sender) {
  
}
```

# events: didScroll

`didScroll` will be called while scrolling:

```js
didScroll: function(sender) {

}
```

# events: willBeginDragging

`willBeginDragging` will be called while dragging:

```js
willBeginDragging: function(sender) {
  
}
```

# events: willEndDragging

`willEndDragging` will be called before dragging ends:

```js
willEndDragging: function(sender, velocity, target) {

}
```

The `target` parameter tells us the target location, it can be overridden by returning a `$point`:

```js
willEndDragging: function(sender, velocity, target) {
  return $point(0, 0);
}
```

# events: didEndDragging

`didEndDragging` will be called after dragging ended:

```js
didEndDragging: function(sender, decelerate) {

}
```

# events: willBeginDecelerating

`willBeginDecelerating` will be called before decelerating:

```js
willBeginDecelerating: function(sender) {

}
```

# events: didEndDecelerating

`didEndDecelerating` will be called after decelerating ended:

```js
didEndDecelerating: function(sender) {

}
```

# events: didEndScrollingAnimation

`didEndScrollingAnimation` will be called after decelerating ended (program triggered):

```js
didEndScrollingAnimation: function(sender) {

}
```

# events: didScrollToTop

`didScrollToTop` will be called once it did reach top:

```js
didScrollToTop: function(sender) {

}
```

# Auto Layout

It is hard to make Auto Layout work for scrollViews, we suggest using `layoutSubviews` to work around some issues:

```js
const contentHeight = 1000;
$ui.render({
  views: [
    {
      type: "scroll",
      layout: $layout.fill,
      events: {
        layoutSubviews: sender => {
          $("container").frame = $rect(0, 0, sender.frame.width, contentHeight);
        }
      },
      views: [
        {
          type: "view",
          props: {
            id: "container"
          },
          views: [
            {
              type: "view",
              props: {
                bgcolor: $color("red")
              },
              layout: (make, view) => {
                make.left.top.right.equalTo(0);
                make.height.equalTo(300);
              }
            }
          ]
        }
      ]
    }
  ]
});
```

In short, instead of using Auto Layout for scrollView's subviews, we can add a container view to the scrollView, and set its frame with `layoutSubviews`, then subviews that belong to the container view can work with Auto Layout correctly. Learn more: https://developer.apple.com/library/archive/technotes/tn2154/_index.html
```

## docs/en/component/slider.md

```markdown
# type: "slider"

`slider` is used to create a slide control:

```js
{
  type: "slider",
  props: {
    value: 0.5,
    max: 1.0,
    min: 0.0
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
    make.width.equalTo(100)
  }
}
```

It creates a slider with range from 0.0 to 1.0, default is 0.5.

# props

Prop | Type | Read/Write | Description
---|---|---|---
value | number | rw | current value
min | number | rw | minimum value
max | number | rw | maximum value
continuous | boolean | rw | is continuous
minColor | $color | rw | color of left part
maxColor | $color | rw | color of right part
thumbColor | $color | rw | color of the knob

# events: changed

`changed` will be called once the value changed:

```js
changed: function(sender) {

}
```
```

## docs/en/component/spinner.md

```markdown
# type: "spinner"

`spinner` is designed to display a loading state:

```js
{
  type: "spinner",
  props: {
    loading: true
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
  }
}
```

You can switch the state by set `on` to true/false.

# props

Prop | Type | Read/Write | Description
---|---|---|---
loading | boolean | rw | loading state
color | $color | rw | color
style | number | rw | 0 ~ 2 for styles

# start()

Equals to `spinner.loading = true`.

# stop()

Equals to `spinner.loading = false`.

# toggle()

Equals to `spinner.loading = !spinner.loading`.
```

## docs/en/component/stack.md

```markdown
# type: "stack"

A special view that doesn't render anything, it's designed for laying out a collection of views.

Note that, stack view in JSBox is based on `UIStackView`, in order to understand how it works, you should take a look at Apple's documentation first: https://developer.apple.com/documentation/uikit/uistackview

# Overview

Here is a simple demo which creates a stack view:

```js
$ui.render({
  views: [
    {
      type: "stack",
      props: {
        spacing: 10,
        distribution: $stackViewDistribution.fillEqually,
        stack: {
          views: [
            {
              type: "label",
              props: {
                text: "Left",
                align: $align.center,
                bgcolor: $color("silver")
              }
            },
            {
              type: "label",
              props: {
                text: "Center",
                align: $align.center,
                bgcolor: $color("aqua")
              }
            },
            {
              type: "label",
              props: {
                text: "Right",
                align: $align.center,
                bgcolor: $color("lime")
              }
            }
          ]
        }
      },
      layout: $layout.fill
    }
  ]
});
```

If you want to arrange some views in a stack view, you should put them inside the `stack` prop, not directly under the `views` prop.

Also, you can control the layout with some properties, such as `axis`, `distribution`, `alignment`, and `spacing`.

# props: axis

The `axis` property determines the stack’s orientation, either vertically or horizontally.

Possible values:

```js
- $stackViewAxis.horizontal
- $stackViewAxis.vertical
```

# props: distribution

The `distribution` property determines the layout of the arranged views along the stack’s axis.

Possible values:

```js
- $stackViewDistribution.fill
- $stackViewDistribution.fillEqually
- $stackViewDistribution.fillProportionally
- $stackViewDistribution.equalSpacing
- $stackViewDistribution.equalCentering
```

# props: alignment

The `alignment` property determines the layout of the arranged views perpendicular to the stack’s axis.

Possible values:

```js
- $stackViewAlignment.fill
- $stackViewAlignment.leading
- $stackViewAlignment.top
- $stackViewAlignment.firstBaseline
- $stackViewAlignment.center
- $stackViewAlignment.trailing
- $stackViewAlignment.bottom
- $stackViewAlignment.lastBaseline
```

# props: spacing

The `spacing` property determines the minimum spacing between arranged views, should be a number.

You can also use the these two constants:

```js
- $stackViewSpacing.useDefault
- $stackViewSpacing.useSystem
```

# props: isBaselineRelative

The `isBaselineRelative` property determines whether the vertical spacing between views is measured from the baselines, should be a boolean value.

# props: isLayoutMarginsRelative

The `isLayoutMarginsRelative` property determines whether the stack view lays out its arranged views relative to its layout margins, should be a boolean value.

# Change a view dynamically

After arranged views initialized, you can change them dynamically like this:

```js
const stackView = $("stackView");
const views = stackView.stack.views;
views[0].hidden = true;

// This hides the first view in the stack
```

# Add a view

Other than initiate a stack view with `stack.views`, you can also append a view dynamically like this:

```js
const stackView = $("stackView");
stackView.stack.add(newView);

// newView can be created with $ui.create
```

# Remove a view

Remove a view from a stack:

```js
const stackView = $("stackView");
stackView.stack.remove(existingView);

// existingView can be retrieved with id
```

# Insert a view

Insert a new view into a stack, with index:

```js
const stackView = $("stackView");
stackView.stack.insert(newView, 2);
```

# Set spacing after a view

While stack view manages spacing automatically, you can specify custom spacing after a view:

```js
const stackView = $("stackView");
stackView.stack.setSpacingAfterView(arrangedView, 20);

// arrangedView must be a view that is contained in the stack
```

# Get spacing after a view

Get custom spacing after a particular view:

```js
const stackView = $("stackView");
const spacing = stackView.stack.spacingAfterView(arrangedView);

// arrangedView must be a view that is contained in the stack
```

# Demo

It's hard to understand stack views, since it's a bit more complicated than other view types.

We have built an example that shows you how do those properties work, you can check it out: https://github.com/cyanzhong/xTeko/blob/master/extension-demos/stack-view
```

## docs/en/component/stepper.md

```markdown
# type: "stepper"

`stepper` is used to create a control with `minus` and `plus` buttons:

```js
{
  type: "stepper",
  props: {
    max: 10,
    min: 1,
    value: 5
  },
  layout: function(make, view) {
    make.centerX.equalTo(view.super)
    make.top.equalTo(24)
  },
  events: {
    changed: function(sender) {

    }
  }
}
```

Create a stepper with range from 1 to 10, default value is 5.

> Usually we combine this control with a label to display its value.

# props

Prop | Type | Read/Write | Description
---|---|---|---
value | number | rw | current value
min | number | rw | minimum value
max | number | rw | maximum value
step | number | rw | step
autorepeat | boolean | rw | responds long press
continuous | boolean | rw | continuous

# events: changed

`changed` will be called once the value changed:

```js
changed: function(sender) {
  
}
```
```

## docs/en/component/switch.md

```markdown
# type: "switch"

`switch` is used to create an on/off control:

```js
{
  type: "switch",
  props: {
    on: true
  },
  layout: function(make, view) {
    make.center.equalTo(view.super)
  }
}
```

It creates a switch, default is on.

# props

Prop | Type | Read/Write | Description
---|---|---|---
on | boolean | rw | on/off state
onColor | $color | rw | color of on state
thumbColor | $color | rw | color of off state

# events: changed

`changed` will be called after the state changed:

```js
changed: function(sender) {
  
}
```
```

## docs/en/component/text.md

```markdown
# type: "text"

`text` is more complicated than `label`, it is editable:

```js
{
  type: "text",
  props: {
    text: "Hello, World!\n\nThis is a demo for Text View in JSBox extension!\n\nCurrently we don't support attributed string in iOS.\n\nYou can try html! Looks pretty cool."
  },
  layout: $layout.fill
}
```

Create an editable text view, shows a paragraph of text with multiple lines.

# props

Prop | Type | Read/Write | Description
---|---|---|---
type | $kbType | rw | keyboard type
darkKeyboard | boolean | rw | dark mode
text | string | rw | text content
styledText | object | rw | styled text
html | string | w | html content
font | $font | rw | font
textColor | $color | rw | text color
align | $align | rw | alignment
placeholder | string | rw | placeholder
selectedRange | $range | rw | selected range
editable | boolean | rw | is editable
selectable | boolean | rw | is selectable
insets | $insets | rw | edge insets

# focus()

Get the focus, show keyboard.

# blur()

Blur the focus, dismiss keyboard.

# events: didBeginEditing

`didBeginEditing` will be called after editing began:

```js
didBeginEditing: function(sender) {

}
```

# events: didEndEditing

`didEndEditing` will be called after editing ended:

```js
didEndEditing: function(sender) {
  
}
```

# events: didChange

`didChange` will be called once text changed:

```js
didChange: function(sender) {

}
```

# events: didChangeSelection

`didChangeSelection` will be called once selection changed:

```js
didChangeSelection: function(sender) {

}
```

`text` is a subclass of `scroll`, it works like a scroll view.

# styledText

Styled text based on markdown syntax, supports bold, italic and links, styles can be nested:

```js
const text = `**Bold** *Italic* or __Bold__ _Italic_

[Inline Link](https://docs.xteko.com) <https://docs.xteko.com>

_Nested **styles**_`

$ui.render({
  views: [
    {
      type: "text",
      props: {
        styledText: text
      },
      layout: $layout.fill
    }
  ]
});
```

This uses the default font and color, for using custom values:

```js
$ui.render({
  views: [
    {
      type: "text",
      props: {
        styledText: {
          text: "",
          font: $font(15),
          color: $color("black")
        }
      },
      layout: $layout.fill
    }
  ]
});
```

For literals like `*`, `_`, escape them with `\\`.

If you want to control formats precisely, you can set `styles` for each range:

```js
const text = `
AmericanTypewriter Cochin-Italic

Text Color Background Color

Kern

Strikethrough Underline

Stroke

Link

Baseline Offset

Obliqueness
`;

const _range = keyword => {
  return $range(text.indexOf(keyword), keyword.length);
}

$ui.render({
  views: [
    {
      type: "text",
      props: {
        styledText: {
          text,
          font: $font(17),
          color: $color("black"),
          markdown: false, // whether to use markdown syntax
          styles: [
            {
              range: _range("AmericanTypewriter"),
              font: $font("AmericanTypewriter", 17)
            },
            {
              range: _range("Cochin-Italic"),
              font: $font("Cochin-Italic", 17)
            },
            {
              range: _range("Text Color"),
              color: $color("red")
            },
            {
              range: _range("Background Color"),
              color: $color("white"),
              bgcolor: $color("blue")
            },
            {
              range: _range("Kern"),
              kern: 10
            },
            {
              range: _range("Strikethrough"),
              strikethroughStyle: 2,
              strikethroughColor: $color("red")
            },
            {
              range: _range("Underline"),
              underlineStyle: 9,
              underlineColor: $color("green")
            },
            {
              range: _range("Stroke"),
              strokeWidth: 3,
              strokeColor: $color("black")
            },
            {
              range: _range("Link"),
              link: "https://xteko.com"
            },
            {
              range: _range("Baseline Offset"),
              baselineOffset: 10
            },
            {
              range: _range("Obliqueness"),
              obliqueness: 1
            }
          ]
        }
      },
      layout: $layout.fill
    }
  ]
});
```

Attribute | Type | Description
---|---|---
range | $range | text range
font | $font | font
color | $color | foreground color
bgcolor | $color | background color
kern | number | font kerning
strikethroughStyle | number | strikethrough style [Refer](https://developer.apple.com/documentation/uikit/nsunderlinestyle?language=objc)
strikethroughColor | $color | strikethrough color
underlineStyle | number | underline style [Refer](https://developer.apple.com/documentation/uikit/nsunderlinestyle?language=objc)
underlineColor | $color | underline color
strokeWidth | number | stroke width
strokeColor | $color | stroke color
link | string | link URL
baselineOffset | number | baseline offset
obliqueness | number | font obliqueness

Markdown syntax is disable when `styles` is used, it can be turned on by specifying `markdown: true`.

For underline and strikethrough, please refer to Apple's documentation, here is an example:

```js
NSUnderlineStyleNone = 0x00,
NSUnderlineStyleSingle = 0x01,
NSUnderlineStyleThick = 0x02,
NSUnderlineStyleDouble = 0x09,
NSUnderlineStylePatternSolid = 0x0000,
NSUnderlineStylePatternDot = 0x0100,
NSUnderlineStylePatternDash = 0x0200,
NSUnderlineStylePatternDashDot = 0x0300,
NSUnderlineStylePatternDashDotDot = 0x0400,
NSUnderlineStyleByWord = 0x8000,
```

If you want a single line with dots, you can combine `NSUnderlineStyleSingle` and `NSUnderlineStylePatternDot`:

```js
underlineStyle: 0x01 | 0x0100
```

# Customize keyboard toolbar

You can customize toolbar as below:

```js
$ui.render({
  views: [
    {
      type: "input",
      props: {
        accessoryView: {
          type: "view",
          props: {
            height: 44
          },
          views: [

          ]
        }
      }
    }
  ]
});
```

# Customize keyboard view

You can customize keyboard as below:

```js
$ui.render({
  views: [
    {
      type: "input",
      props: {
        keyboardView: {
          type: "view",
          props: {
            height: 267
          },
          views: [

          ]
        }
      }
    }
  ]
});
```
```

## docs/en/component/video.md

```markdown
# type: "video"

`video` is used to play video:

```js
{
  type: "video",
  props: {
    src: "https://images.apple.com/media/cn/ipad-pro/2017/43c41767_0723_4506_889f_0180acc13482/films/feature/ipad-pro-feature-cn-20170605_1280x720h.mp4",
    poster: "https://images.apple.com/v/iphone/home/v/images/home/limited_edition/iphone_7_product_red_large_2x.jpg"
  },
  layout: function(make, view) {
    make.left.right.equalTo(0)
    make.centerY.equalTo(view.super)
    make.height.equalTo(256)
  }
}
```

Since video component is implemented with WebView internally, you can also load local videos with `local://` protocol:

```js
{
  type: "video",
  props: {
    src: "local://assets/video.mp4",
    poster: "local://assets/poster.jpg"
  },
  layout: function(make, view) {
    make.left.right.equalTo(0)
    make.centerY.equalTo(view.super)
    make.height.equalTo(256)
  }
}
```

Besides, there is a demo that uses `AVPlayerViewController` for video playing: https://gist.github.com/cyanzhong/c3992af39043c8e0f25424536c379595

# video.pause()

Pause the video:

```js
$("video").pause()
```

# video.play()

Play the video:

```js
$("video").play()
```

# video.toggle()

Toggle the state:

```js
$("video").toggle()
```

We can load the video by set `src`, and the the image by `poster`.

Video component is now implemented by a web view internally.

We're considering replace the implementation with native controls to have better performance in the future.
```

## docs/en/component/web.md

```markdown
# type: "web"

`web` is used to render a website:

```js
{
  type: "web",
  props: {
    url: "https://www.apple.com"
  },
  layout: $layout.fill
}
```

It shows the home page of Apple.

You can also use the `request` parameter to specify more information:

```js
{
  type: "web",
  props: {
    request: {
      url: "https://www.apple.com",
      method: "GET",
      header: {},
      body: body // $data type
    }
  },
  layout: $layout.fill
}
```

# Load local resources

You can load html, js and css files locally:

```js
let html = $file.read("assets/index.html").string;
$ui.render({
  views: [
    {
      type: "web",
      props: {
        html
      },
      layout: $layout.fill
    }
  ]
});
```

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no">
    <link rel="stylesheet" href="local://assets/index.css">
    <script src="local://assets/index.js"></script>
  </head>
  <body>
    <h1>Hey, there!</h1><img src="local://assets/icon.png">
  </body>
  <script>
    window.onload = () => {
      alert(sum(1, 1));
    }
  </script>
</html>
```

Local files will be loaded from bundle, `shared://` and `drive://` are supported.

# props

Prop | Type | Read/Write | Description
---|---|---|---
title | string | r | web page title
url | string | w | address
toolbar | bool | w | shows a toolbar
html | string | w | html content
text | string | w | text content
loading | boolean | r | is loading
progress | number | r | loading progress
canGoBack | boolean | r | can go back
canGoForward | boolean | r | can go forward
ua | string | w | User Agent
scrollEnabled | bool | rw | is scroll enabled
bounces | bool | rw | is bounces enabled
transparent | bool | rw | is background transparent
showsProgress | bool | w | whethe shows progress bar
inlineMedia | bool | w | allows inline video
airPlay | bool | w | allows AirPlay
pictureInPicture | bool | w | allows picture in picture
allowsNavigation | bool | rw | allows back gestures
allowsLinkPreview | bool | rw | allows link preview

# goBack()

Go back.

# goForward()

Go forward.

# reload()

Reload current page.

# reloadFromOrigin()

Reload from origin.

# stopLoading()

Stop loading.

# eval(object)

Evaluate JavaScript:

```js
webView.eval({
  script: "var sum = 1 + 2",
  handler: function(result, error) {

  }
})
```

# exec(script)

Similar to `eval`, but this one is an async function:

```js
const {result, error} = await webView.exec("1 + 1");
```

# events: didClose

`didClose` will be called after closed:

```js
didClose: function(sender) {

}
```

# events: decideNavigation

`decideNavigation` can be used to intercept requests:

```js
decideNavigation: function(sender, action) {
  if (action.requestURL === "https://apple.com") {
    return false
  }
  return true
}
```

# events: didStart

`didStart` will be called after started:

```js
didStart: function(sender, navigation) {

}
```

# events: didReceiveServerRedirect

`didReceiveServerRedirect` will be called after received server redirect:

```js
didReceiveServerRedirect: function(sender, navigation) {

}
```

# events: didFinish

`didFinish` will be called after load finished:

```js
didFinish: function(sender, navigation) {

}
```

# events: didFail

`didFail` will be called after load failed:

```js
didFail: function(sender, navigation, error) {

}
```

# events: didSendRequest

`didSendRequest` will be called after XMLHttpRequest sent:

```js
didSendRequest: function(request) {
  var method = request.method
  var url = request.url
  var header = request.header
  var body = request.body
}
```

# JavaScript Injection

We could control the web view by inject JavaScript, for example:

```js
props: {
  script: function() {
    var images = document.getElementsByTagName("img")
    for (var i=0; i<images.length; ++i) {
      var element = images[i]
      element.onclick = function(event) {
        var source = event.target || event.srcElement
        $notify("share", {"url": source.getAttribute("data-original")})
        return false
      }
    }
  }
}
```

`script` is a `function`, all code inside it will be executed after website load finished.

`script` could also be a `string`, but need to be escaped, for example use [Escape](https://www.freeformatter.com/json-escape.html):

```js
props: {
  script: "for(var images=document.getElementsByTagName(\"img\"),i=0;i<images.length;++i){var element=images[i];element.onclick=function(e){var t=e.target||e.srcElement;return $notify(\"share\",{url:t.getAttribute(\"data-original\")}),!1}}"
}
```

Obviously, use function as script looks more delightful.

# $notify(event, message)

Send message from script to native components, `$notify` message to `events`:

```js
props: {
  script: function() {
    $notify("customEvent", {"key": "value"})
  }
},
events: {
  customEvent: function(object) {
    // object = {"key": "value"}
  }
}
```

The message will be passed to `events -> customEvent`, we could handle native events here.

Above logic looks a bit complicated, please check this example:

```js
$ui.render({
  props: {
    title: "Doutu"
  },
  views: [
    {
      type: "button",
      props: {
        title: "Search"
      },
      layout: function(make) {
        make.right.top.inset(10)
        make.size.equalTo($size(64, 32))
      },
      events: {
        tapped: function(sender) {
          search()
        }
      }
    },
    {
      type: "input",
      props: {
        placeholder: "Please input keywords"
      },
      layout: function(make) {
        make.top.left.inset(10)
        make.right.equalTo($("button").left).offset(-10)
        make.height.equalTo($("button"))
      },
      events: {
        returned: function(sender) {
          search()
        }
      }
    },
    {
      type: "web",
      props: {
        script: "for(var images=document.getElementsByTagName(\"img\"),i=0;i<images.length;++i){var element=images[i];element.onclick=function(e){var t=e.target||e.srcElement;return $notify(\"share\",{url:t.getAttribute(\"data-original\")}),!1}}"
      },
      layout: function(make) {
        make.left.bottom.right.equalTo(0)
        make.top.equalTo($("input").bottom).offset(10)
      },
      events: {
        share: function(object) {
          $http.download({
            url: `http:${object.url}`,
            handler: function(resp) {
              $share.universal(resp.data)
            }
          })
        }
      }
    }
  ]
})

function search() {
  const keyword = $("input").text;
  const url = `https://www.doutula.com/search?keyword=${encodeURIComponent(keyword)}`;
  $("input").blur()
  $("web").url = url
}

$("input").focus()
```

# CSS Injection

Similar to JavaScript Injection, CSS Injection is also supported:

```js
props: {
  style: ""
}
```

Of course, you can implement this by using JavaScript Injection, it's just an easy way.

# webView.notify

Native code could send message to web view as well, just use `notify(event, message)`:

```js
const webView = $("webView");
webView.notify({
  "event": "foobar",
  "message": {"key": "value"}
});
```

Above mechanism provies opportunity to switch context between web and native.
```

## docs/en/context/intro.md

```markdown
# JSBox script on action extension

`Action Extension` is displayed on iOS share sheet, JSBox scripts could be launched from here.

Besides, action extension can retrieve the data selected by user.

# Limitations

Action extension also has some Limitations, not so much like today widget.

For now, there are basically two main restrictions:

- Memory are very limited, don't launch a script that needs huge memory
- Don't use `$photo.pick`, it doesn't work

# $context

We could use `$context` to fetch external data, that's very important to make an action extension.

Please refer to [Method](en/context/method.md) to see more details.
```

## docs/en/context/method.md

```markdown
# $context.query

Get all query items (URL Scheme launched script):

```js
const query = $context.query;
```

If we use `jsbox://runjs?file=demo.js&text=test` to launch it, the query is:

```js
{
  "file": "demo.js",
  "text": "test"
}
```

If the source application is another third-party app, there might be its bundle identifier:

```js
const sourceApp = $context.query.source_app;
```

You can check it when needed, it doesn't work for iOS built-in apps.

# $context.text

Returns a text (user shared a text):

```js
const text = $context.text;
```

# $context.textItems

Returns all text items.

# $context.link

Returns a link (user shared a link):

```js
const link = $context.link;
```

# $context.linkItems

Returns all link items.

# $context.image

Returns an image (user shared an image):

```js
const image = $context.image;
```

# $context.imageItems

Returns all image items.

# $context.safari.items

Returns all Safari items.

```js
const items = $context.safari.items;
```

Returns:

```json
{
  "baseURI": "",
  "source": "",
  "location": "",
  "contentType": "",
  "title": "",
  "selection": {
    "html": "",
    "text": "",
    "style": ""
  }
}

```

# $context.data

Returns a binary data (user shared a file):

```js
const data = $context.data;
```

# $context.dataItems

Returns all binary files.

# $context.allItems

Returns all items, ignores the type.

Basically, if we want to get external parameters, use `$context` APIs.

# $context.clear()

Clear all data in the context object, including query and Action Extension objects:

```js
$context.clear();
```

# $context.close()

Close current action extension, the script stops running.

```

## docs/en/data/constant.md

```markdown
# Constant Table

Here are some constants provided by JSBox, you can use it easily in your scripts.

For example `$align.left` is actually `0`, but it's no way to remember that, so we need constants.

# $env

JSBox environment:

```js
const $env = {
  app: 1 << 0,
  today: 1 << 1,
  action: 1 << 2,
  safari: 1 << 3,
  notification: 1 << 4,
  keyboard: 1 << 5,
  siri: 1 << 6,
  widget: 1 << 7,
  all: (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3) | (1 << 4) | (1 << 5) | (1 << 6) | (1 << 7)
};
```

# $align

iOS text alignment type:

```js
const $align = {
  left: 0,
  center: 1,
  right: 2,
  justified: 3,
  natural: 4
};
```

# $contentMode

iOS view content mode:

```js
const $contentMode = {
  scaleToFill: 0,
  scaleAspectFit: 1,
  scaleAspectFill: 2,
  redraw: 3,
  center: 4,
  top: 5,
  bottom: 6,
  left: 7,
  right: 8,
};
```

# $btnType

iOS button type:

```js
const $btnType = {
  custom: 0,
  system: 1,
  disclosure: 2,
  infoLight: 3,
  infoDark: 4,
  contactAdd: 5,
};
```

# $alertActionType

Alert item style:

```js
const $alertActionType = {
  default: 0, cancel: 1, destructive: 2
};
```

# $zero

Zero values:

```js
const $zero = {
  point: $point(0, 0),
  size: $size(0, 0),
  rect: $rect(0, 0, 0, 0),
  insets: $insets(0, 0, 0, 0)
};
```

# $layout

Common layout functions:

```js
const $layout = {
  fill: function(make, view) {
    make.edges.equalTo(view.super)
  },
  fillSafeArea: function(make, view) {
    make.edges.equalTo(view.super.safeArea)
  },
  center: function(make, view) {
    make.center.equalTo(view.super)
  }
};
```

# $lineCap

iOS line cap:

```js
const $lineCap = {
  butt: 0,
  round: 1,
  square: 2
};
```

# $lineJoin

iOS line join:

```js
const $lineJoin = {
  miter: 0,
  round: 1,
  bevel: 2
};
```

# $mediaType

[UTI Types](https://developer.apple.com/library/content/documentation/Miscellaneous/Reference/UTIRef/Introduction/Introduction.html):

```js
const $mediaType = {
  image: "public.image",
  jpeg: "public.jpeg",
  jpeg2000: "public.jpeg-2000",
  tiff: "public.tiff",
  pict: "com.apple.pict",
  gif: "com.compuserve.gif",
  png: "public.png",
  icns: "com.apple.icns",
  bmp: "com.microsoft.bmp",
  ico: "com.microsoft.ico",
  raw: "public.camera-raw-image",
  live: "com.apple.live-photo",
  movie: "public.movie",
  video: "public.video",
  audio: "public.audio",
  mov: "com.apple.quicktime-movie",
  mpeg: "public.mpeg",
  mpeg2: "public.mpeg-2-video",
  mp3: "public.mp3",
  mp4: "public.mpeg-4",
  avi: "public.avi",
  wav: "com.microsoft.waveform-audio",
  midi: "public.midi-audio"
};
```

# $imgPicker

iOS image picker constants:

```js
const $imgPicker = {
  quality: {
    high: 0,
    medium: 1,
    low: 2,
    r640x480: 3,
    r1280x720: 4,
    r960x540: 5
  },
  captureMode: {
    photo: 0,
    video: 1
  },
  device: {
    rear: 0,
    front: 1
  },
  flashMode: {
    off: -1,
    auto: 0,
    on: 1
  }
};
```

# $kbType

iOS keyboard types:

```js
const $kbType =  {
  default: 0,
  ascii: 1,
  nap: 2,
  url: 3,
  number: 4,
  phone: 5,
  namePhone: 6,
  email: 7,
  decimal: 8,
  twitter: 9,
  search: 10,
  asciiPhone: 11
};
```

# $assetMedia

iOS asset media constants:

```js
const $assetMedia = {
  type: {
    unknown: 0,
    image: 1,
    video: 2,
    audio: 3
  },
  subType: {
    none: 0,
    panorama: 1 << 0,
    hdr: 1 << 1,
    screenshot: 1 << 2,
    live: 1 << 3,
    depthEffect: 1 << 4,
    streamed: 1 << 16,
    highFrameRate: 1 << 17,
    timelapse: 1 << 18
  }
};
```

# $pageSize

$pdf page sizes:

```js
const $pageSize = {
  letter: 0, governmentLetter: 1, legal: 2, juniorLegal: 3, ledger: 4, tabloid: 5,
  A0: 6, A1: 7, A2: 8, A3: 9, A4: 10, A5: 11, A6: 12, A7: 13, A8: 14, A9: 15, A10: 16,
  B0: 17, B1: 18, B2: 19, B3: 20, B4: 21, B5: 22, B6: 23, B7: 24, B8: 25, B9: 26, B10: 27,
  C0: 28, C1: 29, C2: 30, C3: 31, C4: 32, C5: 33, C6: 34, C7: 35, C8: 36, C9: 37, C10: 38,
  custom: 52
};
```

# $UIEvent

Event types which are used in `addEventHandler` function:

```js
const $UIEvent = {
  touchDown: 1 << 0,
  touchDownRepeat: 1 << 1,
  touchDragInside: 1 << 2,
  touchDragOutside: 1 << 3,
  touchDragEnter: 1 << 4,
  touchDragExit: 1 << 5,
  touchUpInside: 1 << 6,
  touchUpOutside: 1 << 7,
  touchCancel: 1 << 8,
  valueChanged: 1 << 12,
  primaryActionTriggered: 1 << 13,
  editingDidBegin: 1 << 16,
  editingChanged: 1 << 17,
  editingDidEnd: 1 << 18,
  editingDidEndOnExit: 1 << 19,
  allTouchEvents: 0x00000FFF,
  allEditingEvents: 0x000F0000,
  applicationReserved: 0x0F000000,
  systemReserved: 0xF0000000,
  allEvents: 0xFFFFFFFF,
};
```

# $stackViewAxis

Axis values for stack view:

```js
const $stackViewAxis = {
  horizontal: 0,
  vertical: 1,
};
```

# $stackViewDistribution

Distribution values for stack view:

```js
const $stackViewDistribution = {
  fill: 0,
  fillEqually: 1,
  fillProportionally: 2,
  equalSpacing: 3,
  equalCentering: 4,
};
```

# $stackViewAlignment

Alignment values for stack view:

```js
const $stackViewAlignment = {
  fill: 0,
  leading: 1,
  top: 1,
  firstBaseline: 2,
  center: 3,
  trailing: 4,
  bottom: 4,
  lastBaseline: 5,
};
```

# $stackViewSpacing

Spacing values for stack view:

```js
const $stackViewSpacing = {
  useDefault: UIStackViewSpacingUseDefault,
  useSystem: UIStackViewSpacingUseSystem,
};
```

# $popoverDirection

Popover arrow directions for `$ui.popover(...)` method:

```js
const $popoverDirection = {
  up: 1 << 0,
  down: 1 << 1,
  left: 1 << 2,
  right: 1 << 3,
  any: (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3),
};
```

# $scrollDirection

Scroll directions for `matrix` views:

```js
const $scrollDirection = {
  vertical: 0,
  horizontal: 1,
};
```

# $blurStyle

Style constants for `blur` views:

```js
const $blurStyle = {
  // Additional Styles
  extraLight: 0,
  light: 1,
  dark: 2,
  extraDark: 3,
  regular: 4,
  prominent: 5,
  // Adaptable Styles (iOS 13)
  ultraThinMaterial: 6,
  thinMaterial: 7,
  material: 8,
  thickMaterial: 9,
  chromeMaterial: 10,
  // Light Styles (iOS 13)
  ultraThinMaterialLight: 11,
  thinMaterialLight: 12,
  materialLight: 13,
  thickMaterialLight: 14,
  chromeMaterialLight: 15,
  // Dark Styles (iOS 13)
  ultraThinMaterialDark: 16,
  thinMaterialDark: 17,
  materialDark: 18,
  thickMaterialDark: 19,
  chromeMaterialDark: 20,
};
```

Please refer to Apple's documentation for details: https://developer.apple.com/documentation/uikit/uiblureffectstyle

# $widgetFamily

Check layout type of a home screen widget:

```js
const $widgetFamily = {
  small: 0,
  medium: 1,
  large: 2,
  xLarge: 3, // iPadOS 15

  // iOS 16 lock screen sizes
  accessoryCircular: 5,
  accessoryRectangular: 6,
  accessoryInline: 7,
};
```
```

## docs/en/data/intro.md

```markdown
# Data Types

Pass values between JavaScript and Native environment is not easy, we need to handle complicated data types.

Some types like `number`, `boolean` will be converted automatically, but there are still a lot of types can't be handled automatically, such as `color`, `size` etc.

So we provided a series of methods for data converting, you could check this doc whenever you need.

# Trade-off

To be honest, this way is not perfect. We can also pass JavaScript Objects to iOS directly (it works like a dictionary, or map in other languages), then we parse JSON objects for each API everytime.

But that's looks ugly, and it's not easy to provide IDE features like auto completion and syntax highlighting with that pattern.

The most important is, manage all types together makes the program safer and easy to read.
```

## docs/en/data/method.md

```markdown
# Methods

As we mentioned before, we provided a series of methods.

# $rect(x, y, width, height)

Create a rectangle:

```js
const rect = $rect(0, 0, 100, 100);
```

# $size(width, height)

Create a size:

```js
const size = $size(100, 100);
```

# $point(x, y)

Create a point:

```js
const point = $point(0, 0);
```

# $insets(top, left, bottom, right)

Create an edge insets:

```js
const insets = $insets(10, 10, 10, 10);
```

# $color(string)

Create a color with hex string:

```js
const color = $color("#00EEEE");
```

Create a color with name:

```js
const blackColor = $color("black");
```

Available color names:

Name | Color
---|---
tint | JSBox theme color
black | black color
darkGray | dark gray
lightGray | light gray
white | white color
gray | gray color
red | red color
green | green color
blue | blue color
cyan | cyan color
yellow | yellow color
magenta | magenta color
orange | orange color
purple | purple color
brown | brown color
clear | clear color

The following colors are semantic colors, used for dynamic theme, it will be different in light or dark mode:

Name | Color
---|---
tintColor | tint color
primarySurface | primary surface
secondarySurface | secondary surface
tertiarySurface | tertiary surface
primaryText | primary text
secondaryText | secondary text
backgroundColor | background color
separatorColor | separator color
groupedBackground | grouped background
insetGroupedBackground | insetGrouped background

Below are system default colors, they are implemented based on [UI Element Colors](https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors)

Name | Color
---|---
systemGray2 | UIColor.systemGray2Color
systemGray3 | UIColor.systemGray3Color
systemGray4 | UIColor.systemGray4Color
systemGray5 | UIColor.systemGray5Color
systemGray6 | UIColor.systemGray6Color
systemLabel | UIColor.labelColor
systemSecondaryLabel | UIColor.secondaryLabelColor
systemTertiaryLabel | UIColor.tertiaryLabelColor
systemQuaternaryLabel | UIColor.quaternaryLabelColor
systemLink | UIColor.linkColor
systemPlaceholderText | UIColor.placeholderTextColor
systemSeparator | UIColor.separatorColor
systemOpaqueSeparator | UIColor.opaqueSeparatorColor
systemBackground | UIColor.systemBackgroundColor
systemSecondaryBackground | UIColor.secondarySystemBackgroundColor
systemTertiaryBackground | UIColor.tertiarySystemBackgroundColor
systemGroupedBackground | UIColor.systemGroupedBackgroundColor
systemSecondaryGroupedBackground | UIColor.secondarySystemGroupedBackgroundColor
systemTertiaryGroupedBackground | UIColor.tertiarySystemGroupedBackgroundColor
systemFill | UIColor.systemFillColor
systemSecondaryFill | UIColor.secondarySystemFillColor
systemTertiaryFill | UIColor.tertiarySystemFillColor
systemQuaternaryFill | UIColor.quaternarySystemFillColor

These colors behave differently for light or dark mode. For example, `$color("tintColor")` returns theme color for the light mode, and light blue for the dark mode.

You can retrieve all available colors in the color palette with `$color("namedColors")`, it returns a dictionary:

```js
const colors = $color("namedColors");
```

Also, `$color(...)` supports dynamic colors, it returns color for light and dark mode dynamically:

```js
const dynamicColor = $color({
  light: "#FFFFFF",
  dark: "#000000"
});
```

That color is white for light mode, and black for dark mode, changes automatically, can also be simplified as:

```js
const dynamicColor = $color("#FFFFFF", "#000000");
```

Colors can be nested, it can use colors generated by the `$rgba(...)` method:

```js
const dynamicColor = $color($rgba(0, 0, 0, 1), $rgba(255, 255, 255, 1));
```

Besides, if you want to provide colors for the pure black theme, you can do:

```js
const dynamicColor = $color({
  light: "#FFFFFF",
  dark: "#141414",
  black: "#000000"
});
```

# $rgb(red, green, blue)

Create a color with red, green, blue values.

The range of each number is 0 ~ 255:

```js
const color = $rgb(100, 100, 100);
```
# $rgba(red, green, blue, alpha)

Create a color with red, green, blue and alpha channel:

```js
const color = $rgba(100, 100, 100, 0.5);
```

# $font(name, size)

Create a font, name is an optional parameter:

```js
const font1 = $font(15);
const font2 = $font("bold", 15);
```

You can specify `"bold"` to use system font with bold weight, otherwise it will search fonts with the name.

Learn more: http://iosfonts.com/

# $range(location, length)

Create a range:

```js
const range = $range(0, 10);
```

# $indexPath(section, row)

Create an indexPath, to indicates the section and row:

```js
const indexPath = $indexPath(0, 10);
```

# $data(object)

Create a binary data:

```js
// string
const data = $data({
  string: "Hello, World!",
  encoding: 4 // default, refer: https://developer.apple.com/documentation/foundation/nsstringencoding
});
```

```js
// path
const data = $data({
  path: "demo.txt"
});
```

```js
// url
const data = $data({
  url: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg"
});
```

```js
// base64
const data = $data({
  base64: "data:image/png;base64,..."
});
```

```js
// byte array
const data = $data({
  byteArray: [116, 101, 115, 116]
})
```

# $image(object, scale)

Returns an image object, supports the following types:

```js
// file path
const image = $image("assets/icon.png");
```

```js
// sf symbols
const image = $image("sunrise");
```

```js
// url
const image = $image("https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg");
```

```js
// base64
const image = $image("data:image/png;base64,...");
```

The `scale` argument indicates its scale, default to 1, 0 means using screen scale.

In the latest version, you can use `$image(...)` to create dynamic images for dark mode, like this:

```js
const dynamicImage = $image({
  light: "light-image.png",
  dark: "dark-image.png"
});
```

This image chooses different resources for light and dark mode, it switches automatically, can be simplified as:

```js
const dynamicImage = $image("light-image.png", "dark-image.png");
```

Besides, images can also be nested, such as:

```js
const lightImage = $image("light-image.png");
const darkImage = $image("dark-image.png");
const dynamicImage = $image(lightImage, darkImage);
```

# $icon(code, color, size)

Get an icon provided by JSBox, refer: https://github.com/cyanzhong/xTeko/tree/master/extension-icons

For example:

```js
$ui.render({
  views: [
    {
      type: "button",
      props: {
        icon: $icon("005", $color("red"), $size(20, 20)),
        bgcolor: $color("clear")
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.size.equalTo($size(24, 24))
      }
    }
  ]
})
```

`color` is optional, uses gray style if not provided.

`size` is also optional, uses raw size if not provided.
```

## docs/en/data/object.md

```markdown
# Object

Here's a table shows all types handled by iOS automatically:

  Objective-C type  |   JavaScript type
--------------------|---------------------
        nil         |     undefined
      NSNull        |        null
      NSString      |       string
      NSNumber      |   number, boolean
    NSDictionary    |   Object object
      NSArray       |    Array object
      NSDate        |     Date object
      NSBlock (1)   |   Function object (1)
        id (2)      |   Wrapper object (2)
      Class (3)     | Constructor object (3)

But if we get an object from iOS native interface, it's not easy to know its properties.

For example:

```js
didSelect: function(tableView, indexPath) {
  var row = indexPath.row
}
```

`indexPath` is actually an native object, in this example we can access its properties with `.section` and `.row`.

To understand iOS native objects, we provided a table: [Object Properties](en/object/data.md).

# $props

`$props` helps you get all properties of an object:

```js
const props = $props("string");
```

$props is just a simple JavaScript function, it implemented like:

```js
const $props = object => {
  const result = [];
  for (; object != null; object = Object.getPrototypeOf(object)) {
    const names = Object.getOwnPropertyNames(object);
    for (let idx=0; idx<names.length; idx++) {
      const name = names[idx];
      if (!result.includes(name)) {
        result.push(name)
      }
    }
  }
  return result
};
```

# $desc

`$desc` returns description of an object:

```js
let desc = $desc(object);
console.log(desc);
```
```

## docs/en/debug/console.md

```markdown
> Console related APIs

# Intro

Bug is always exists, so we need to `debug`. As a development tool, JSBox has some utilities for troubleshooting.

JSBox provides a simple console for debug purpose, we can use it to log some information, and execute some scripts.

# console

`console` provides 4 methods for logging:

```js
console.info("General Information")  // Log information
console.warn("Warning Message")      // Log warning message
console.error("Error Message")       // Log error message
console.assert(false, "Message")     // Assertion
console.clear()                      // Clear all messages
console.open()                       // Open console
console.close()                      // Close console
```

Of course, the console of JSBox can run JavaScript as well, the result will be display on the console.

Besides, when JavaScript exception occured, it shows on console as an error automatically.

# How to Use Console

- Tap the bug button to enter
- Tap an item to check the details
- Long press an item to copy the content
- Input command at the bottom to debugging
```

## docs/en/debug/inspector.md

```markdown
> This feature requires iOS 16.4 and above

# Prerequisites

On iOS device, find Safari in system settings, enable web inspector in advanced settings.

On Mac, open Safari, enable Develop menu in advanced settings.

# How to Debug

Connect your iOS device to Mac. Run the script, open Safari on Mac, find the JSContext in Develop menu and select it.

You will be able to check the source code, add breakpoints and run step by step.
```

## docs/en/extend/archiver.md

```markdown
> JSBox has builtin archiver/unarchiver module

# $archiver.zip(object)

Compress files to a zip:

```js
var files = $context.dataItems
var dest = "Archive.zip"

if (files.length == 0) {
  return
}

$archiver.zip({
  files: files,
  dest: dest,
  handler: function(success) {
    if (success) {
      $share.sheet([dest, $file.read(dest)])
    }
  }
})
```

`files` is a file array, we could use `paths` as well.

You could also compress a folder by:

```js
$archiver.zip({
  directory: "",
  dest: "",
  handler: function(success) {
    
  }
})
```

# $archiver.unzip(object)

Unzip a file:

```js
$archiver.unzip({
  file,
  dest: "folder",
  handler: function(success) {

  }
})
```

File has to be a zip document, dest is the destination folder, it has to be existed.

Starts from 2.0, you can also use `path` property which points to the zip file, it uses less memory:

```js
const success = await $archiver.unzip({
  path: "archive.zip",
  dest: "folder"
});
```
```

## docs/en/extend/browser.md

```markdown
# $browser.exec

Provides a webView based JavaScript environment, lets you use Web APIs:

```js
$browser.exec({
  script: function() {
    const parser = new DOMParser();
    const doc = parser.parseFromString("<a>hey</a>", "application/xml");
    // $notify("customEvent", {"key": "value"})
    return doc.children[0].innerHTML;
  },
  handler: function(result) {
    $ui.alert(result);
  },
  customEvent: function(message) {

  }
})
```

# Handy shortcut

You can use Promise with super neat style:

```js
var result = await $browser.exec("return 1 + 1;");
```

# How to access variables in native

You can create script dynamically by:

```js
const name = "JSBox";
$browser.exec({
  script: `
  var parser = new DOMParser();
  var doc = parser.parseFromString("<a>hey ${name}</a>", "application/xml");
  return doc.children[0].innerHTML;`,
  handler: function(result) {
    $ui.alert(result);
  }
})
```

For details of `$notify`, refer to [web component](en/component/web.md?id=notifyevent-message).
```

## docs/en/extend/detector.md

```markdown
> JSBox has builtin data detector, it enhances the readability of regex

*PS: If you are an expert of regex, you don't need this then.*

# $detector.date(string)

Retrieve all dates from a string:

```js
const dates = $detector.date("2017.10.10");
```

# $detector.address(string)

Retrieve all addresses from a string:

```js
const addresses = $detector.address("");
```

# $detector.link(string)

Retrieve all links from a string:

```js
const links = $detector.link("http://apple.com hello http://xteko.com");
```

# $detector.phoneNumber(string)

Retrieve all phone numbers from a string:

```js
const phoneNumbers = $detector.phoneNumber("18666666666 hello 18777777777");
```
```

## docs/en/extend/editor.md

```markdown
# $editor

In JSBox, you can create plugins for the code editor, it helps you like an assistant.

Many useful features can be made with these APIs, such as custom indentation, or text encoding tools.

# $editor.text

Get or set all text in the code editor:

```js
const text = $editor.text;

$editor.text = "Hey!";
```

# $editor.view

Returns the text view of the current running editor:

```js
const editorView = $editor.view;
editorView.alpha = 0.5;
```

# $editor.selectedRange

Get or set selected range in the code editor:

```js
const range = $editor.selectedRange;

$editor.selectedRange = $(0, 10);
```

# $editor.selectedText

Get or set selected text in the code editor:

```js
const text = $editor.selectedText;

$editor.selectedText = "Hey!";
```

# $editor.hasText

Returns true when the editor has text:

```js
const hasText = $editor.hasText;
```

# $editor.isActive

Check whether the code editor is active:

```js
const isActive = $editor.isActive;
```

# $editor.canUndo

Check whether undo action can be taken:

```js
const canUndo = $editor.canUndo;
```

# $editor.canRedo

Check whether redo action can be taken:

```js
const canRedo = $editor.canRedo;
```

# $editor.save()

Save changes in the current editor:

```js
$editor.save();
```

# $editor.undo()

Perform undo action in the current editor:

```js
$editor.undo();
```

# $editor.redo()

Perform redo action in the current editor:

```js
$editor.redo();
```

# $editor.activate()

Activate the current editor:

```js
$editor.activate()
```

# $editor.deactivate()

Deactivate the current editor:

```js
$editor.deactivate()
```

# $editor.insertText(text)

Insert text into the selected range:

```js
$editor.insertText("Hello");
```

# $editor.deleteBackward()

Remove the character just before the cursor:

```js
$editor.deleteBackward();
```

# $editor.textInRange(range)

Get text in a range:

```js
const text = $editor.textInRange($range(0, 10));
```

# $editor.setTextInRange(text, range)

Set text in a range:

```js
$editor.setTextInRange("Hey!", $range(0, 10));
```
```

## docs/en/extend/intro.md

```markdown
# Extended APIs

JSBox provided various of APIs other than iOS builtin APIs, we will talk about those.

Basically we provided `$text`, `$share`, `$qrcode` and `$detector` for now.

# $text

Handle text easily, such as base64 encode/decode and much more.

# $share

Share media (text/image etc) to social network services.

# $qrcode

QRCode related features, such as encode/decode and scan.

# $browser

Simulate a browser environment, so you can leverage the ability of BOM and DOM.

# $detector

Some functions to handle common data detection easily, similar to regular expressions.
```

## docs/en/extend/push.md

```markdown
> Used to schedule a notification or cancel a scheduled notification

# $push.schedule(object)

Schedule a local notification:

```js
$push.schedule({
  title: "title",
  body: "content",
  delay: 5,
  handler: function(result) {
    const id = result.id;
  }
})
```

This notification will be delivered after 5 seconds.

Param | Type | Description
---|---|---
title | string | title
body | string | body
id | string | identifier (optional)
sound | string | sound
mute | bool | mute
repeats | bool | repeats
script | string | script name
height | number | 3D Touch view height
query | json | extra parameters, will be passed to $context.query
attachments | array | media attachments, e.g. ["assets/icon.png"]
renew | bool | whether renew

Above case is how to schedule a push with delay, you can also setup a date:

```js
const date = new Date();
date.setSeconds(date.getSeconds() + 10)

$push.schedule({
  title: "title",
  body: "content",
  date,
  handler: function(result) {
    const id = result.id;
  }
})
```

Not only that, you have another cool choice, schedule by location:

```js
$push.schedule({
  title: "title",
  body: "content",
  region: {
    lat: 0, // latitude
    lng: 0, // longitude
    radius: 1000, // meters
    notifyOnEntry: true, // notify on entry
    notifyOnExit: true // notify on exit
  }
})
```

JSBox will ask user for location access once this code get called.

Started from v1.10.0, $push supports setup a script to push notification by setting `script`, user can tap to run it, or simply force touch to have a quick preview.

# $push.cancel(object)

Cancel a scheduled notification:

```js
$push.cancel({
  title: "title",
  body: "content",
})
```

JSBox will cancel all notifications that match the `title` and `body`.

You can also can it the identifier:

```js
$push.cancel({id: ""})
```

# $push.clear()

Clear all scheduled notifications (notifications that registered before build 462 will be ignored):

```js
$push.clear()
```
```

## docs/en/extend/qrcode.md

```markdown
> JSBox has ability to handle QRCode

# $qrcode.encode(string)

Encode a string to QRCode image:

```js
const image = $qrcode.encode("https://apple.com");
```

# $qrcode.decode(image)

Decode a string from QRCode image:

```js
const text = $qrcode.decode(image);
```

# $qrcode.scan(function)

Scan QRCode with camera:

```js
$qrcode.scan(text => {
  
})
```

We could provide `cancelled` callback:

```js
$qrcode.scan({
  useFrontCamera: false, // Optional
  turnOnFlash: false, // Optional
  handler(string) {
    $ui.toast(string)
  },
  cancelled() {
    $ui.toast("Cancelled")
  }
})
```
```

## docs/en/extend/share.md

```markdown
> Provides APIs to share media to social network services, such as WeChat, QQ

# $share.sheet(object)

Using system builtin `share sheet`:

```js
$share.sheet(["https://apple.com", "apple"])
```

The object could be either a file or an array.

Currently we support `text`, `link`, `image` and `data`.

It's better to specify file name if the object is a file:

```js
$share.sheet([
  {
    "name": "sample.mp4",
    "data": data
  }
])
```

Start from Build 80, you can use following style:

```js
$share.sheet({
  items: [
    {
      "name": "sample.mp4",
      "data": data
    }
  ], // or item
  handler: function(success) {

  }
})
```

# $share.wechat(object)

Share content to WeChat:

```js
$share.wechat(image)
```

The object will be detected automatically, either image or text is correct.

# $share.qq(object)

Share content to QQ:

```js
$share.qq(image)
```

The object will be detected automatically, either image or text is correct.

# $share.universal(object)

Deprecated, please use `$share.sheet` instead.
```

## docs/en/extend/text.md

```markdown
> Provides a lot of utility functions to handle text

# $text.uuid

Generates a UUID string:

```js
const uuid = $text.uuid;
```

# $text.tokenize(object)

Text tokenize:

```js
$text.tokenize({
  text: "我能吞下玻璃而不伤身体",
  handler: function(results) {

  }
})
```

# $text.analysis(object)

// TODO: Text analysis

# $text.lookup(string)

Lookup text in system builtin dictionaries.

```js
$text.lookup("apple")
```

# $text.speech(object)

Text to speech (TTS):

```js
$text.speech({
  text: "Hello, World!",
  rate: 0.5,
  language: "en-US", // optional
})
```

You can stop/pause/continue a speaker by:

```js
const speaker = $text.speech({});
speaker.pause()
speaker.continue()
speaker.stop()
```

Events for state changes:

```js
$text.speech({
  text: "Hello, World!",
  events: {
    didStart: (sender) => {},
    didFinish: (sender) => {},
    didPause: (sender) => {},
    didContinue: (sender) => {},
    didCancel: (sender) => {},
  }
})
```

Supported languages:

```
ar-SA
cs-CZ
da-DK
de-DE
el-GR
en-AU
en-GB
en-IE
en-US
en-US
en-ZA
es-ES
es-MX
fi-FI
fr-CA
fr-FR
he-IL
hi-IN
hu-HU
id-ID
it-IT
ja-JP
ko-KR
nl-BE
nl-NL
no-NO
pl-PL
pt-BR
pt-PT
ro-RO
ru-RU
sk-SK
sv-SE
th-TH
tr-TR
zh-CN
zh-HK
zh-TW
```

# $text.ttsVoices

Returns supported voices, you can use one of them to specify the voice in $text.speech:

```js
const voices = $text.ttsVoices;
console.log(voices);

$text.speech({
  text: "Hello, World!",
  voice: voices[0]
});
```

Voice Object:

Prop | Type | Read/Write | Description
---|---|---|---
language | string | r | language
identifier | string | r | identifier
name | string | r | name
quality | number | r | quality
gender | number | r | gender
audioFileSettings | object | r | audio file settings

# $text.base64Encode(string)

Base64 encode.

# $text.base64Decode(string)

Base64 decode.

# $text.URLEncode(string)

URL encode.

# $text.URLDecode(string)

URL decode.

# $text.HTMLEscape(string)

HTML escape.

# $text.HTMLUnescape(string)

HTML unescape.

# $text.MD5(string)

MD5.

# $text.SHA1(string)

SHA1.

# $text.SHA256(string)

SHA256.

# $text.convertToPinYin(text)

Get Chinese PinYin of a string.

# $text.markdownToHtml(text)

Convert Markdown text to HTML text.

# $text.htmlToMarkdown(object)

Convert HTML text to Markdown text, this is an async func:

```js
$text.htmlToMarkdown({
  html: "<p>Hey</p>",
  handler: markdown => {

  }
})

// Or
var markdown = await $text.htmlToMarkdown("<p>Hey</p>");
```

# $text.decodeData(object)

Convert data to a string:

```js
const string = $text.decodeData({
  data: file,
  encoding: 4 // default, refer: https://developer.apple.com/documentation/foundation/nsstringencoding
});
```

# $text.sizeThatFits(object)

Calculate text bounding size dynamically:

```js
const size = $text.sizeThatFits({
  text: "Hello, World",
  width: 320,
  font: $font(20),
  lineSpacing: 15, // Optional
});
```
```

## docs/en/extend/xml.md

```markdown
# $xml

JSBox provides a simple XML/HTML parser, which is very easy to use, it supports `xPath` and `CSS selector` for node querying.

# $xml.parse(object)

Parsing XML string as XML document:

```js

let xml = 
`
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>
`;

let doc = $xml.parse({
  string: xml, // Or data: data
  mode: "xml", // Or "html", default to xml
});
```

# Document

$xml.parse() returns XML Document object:

```js
let version = doc.version;
let rootElement = doc.rootElement;
```

# Element

Element represents a node in XML Document, it contains properties as below:

Prop | Type | Read/Write | Description
---|---|---|---
node | string | r | node itself
document | $xmlDoc | r | Document
blank | bool | r | is blank node
namespace | string | r | namespace
tag | string | r | tag
lineNumber | number | r | line number
attributes | object | r | attributes
parent | $xmlElement | r | parent node
previous | $xmlElement | r | previous sibling
next | $xmlElement | r | next sibling
string | string | r | string represented value
number | number | r | number represented value
date | Date | r | date represented value

# Element.firstChild(object)

Document and Element object can query first child with xPath, selector and tag:

```js
let c1 = doc.rootElement.firstChild({
  "xPath": "//food/name"
});

let c2 = doc.rootElement.firstChild({
  "selector": "food > serving[units]"
});

let c3 = doc.rootElement.firstChild({
  "tag": "daily-values",
  "namespace": "namespace", // Optional
});
```

# Element.children(object)

Document and Element object can query children with tag and namespace:

```js
let children = doc.rootElement.children({
  "tag": "daily-values",
  "namespace": "namespace", // Optional
});

// Get all
let allChildren = doc.rootElement.children();
```

# Element.enumerate(object)

Document and Element object can enumerate elements with xPath and CSS selector:

```js
let element = doc.rootElement;
element.enumerate({
  xPath: "//food/name", // Or selector (e.g. food > serving[units])
  handler: (element, idx) => {

  }
});
```

# Element.value(object)

Document and Element object can query value with attribute and namespace:

```js
let value = doc.rootElement.value({
  "attribute": "attribute",
  "namespace": "namespace", // Optional
});
```

# Document.definePrefix(object)

Document can define prefix for namespace:

```js
doc.definePrefix({
  "prefix": "prefix",
  "namespace": "namespace"
});
```

Here is an example for $xml: https://github.com/cyanzhong/xTeko/tree/master/extension-demos/xml-demo
```

## docs/en/file/design.md

```markdown
# Design Principle

In JSBox we provided a lot of APIs to store/fetch files, in order to save files to disk, for example downloaded files.

As you know, iOS has an awesome mechanism called `Sandbox`, it makes each application independent.

JSBox has this ability as well, it sounds like `Sandbox in Sandbox`, it makes each script has its own file zone.

So, a script can't access all paths, it's limited, and JSBox hides all details to script developers. It is very safe and convenient.

# Shared Folder

Other than sandboxes, JSBox also provided a special folder can be shared by all scripts.

To use this folder, just use file path starts with `shared://`.

Please note all contents in this folder could be modified by all scripts.

# iCloud Drive

In addition, file system also supports read/write files in iCloud Drive Container.

To use this folder, just use file path starts with `drive://`.

Please note this folder doesn't work if user didn't turn on iCloud Drive for JSBox.

# Inbox

One more thing, all files imported by share sheet or AirDrop will be placed in a special folder.

To use this folder, just use file path starts with `inbox://`.

Please note all contents in this folder could be modified by all scripts.

# Absolute Paths

When absolute paths need to be handled, you can indicate that the current path is an absolute path by starting it with `absolute://`.

For example `$file.copy(...) `, when the target path is an absolute path, the above protocol is needed to provide information for this method.
```

## docs/en/file/drive.md

```markdown
> JSBox provides `$drive` in order to access iCloud Drive

# iCloud Drive

There are three types of operations:

- `$drive.open` open Document Picker
- `$drive.save` save file using Document Picker
- `$drive.read` read file directly, like `$file`

# $drive.open

Pick a file using iCloud Document Picker:

```js
$drive.open({
  handler: function(data) {
    
  }
})
```

We can set the UTI types to make it more accurate:

```js
types: ["public.png"]
```

You can also specify `multi` to allow multiple selection:

```js
const files = await $drive.open({ multi: true });
```

In this case, the returned `files` is an array of data.

# $drive.save

Save a file using Document Picker:

```js
$drive.save({
  data: $data({string: "Hello, World!"}),
  name: "File Name",
  handler: function() {

  }
})
```

# $drive.read

This API looks similar to $file.read:

```js
const file = $drive.read("demo.txt");
```

The only difference is we are reading file in iCloud Drive container.

It equals to:

```js
const file = $file.read("drive://demo.txt");
```

# $drive.xxx

Besides, every `$file` API has an equivalent `$drive` API:

- `$drive.read` vs [$file.read](en/file/method.md?id=filereadpath)
- `$drive.download` vs [$file.download](en/file/method.md?id=filedownloadpath)
- `$drive.write` vs [$file.write](en/file/method.md?id=filewriteobject)
- `$drive.delete` vs [$file.delete](en/file/method.md?id=filedeletepath)
- `$drive.list` vs [$file.list](en/file/method.md?id=filelistpath)
- `$drive.copy` vs [$file.copy](en/file/method.md?id=filecopyobject)
- `$drive.move` vs [$file.move](en/file/method.md?id=filemoveobject)
- `$drive.mkdir` vs [$file.mkdir](en/file/method.md?id=filemkdirpath)
- `$drive.exists` vs [$file.exists](en/file/method.md?id=fileexistspath)
- `$drive.isDirectory` vs [$file.isDirectory](en/file/method.md?id=fileisdirectorypath)
- `$drive.absolutePath` vs [$file.absolutePath](en/file/method.md?id=fileabsolutepath)
```

## docs/en/file/method.md

```markdown
> JSBox provides some APIs to store/fetch files safely

# $file.read(path)

Read a file:

```js
const file = $file.read("demo.txt");
```

# $file.download(path) -> Promise

This method ensures a iCloud drive file is downloaded before reading it:

```js
const data = await $file.download("drive://.test.db.icloud");
```

# $file.write(object)

Write a file:

```js
const success = $file.write({
  data: $data({string: "Hello, World!"}),
  path: "demo.txt"
});
```

# $file.delete(path)

Delete a file:

```js
const success = $file.delete("demo.txt");
```

# $file.list(path)

Get all file names in a folder:

```js
const contents = $file.list("download");
```

# $file.copy(object)

Copy a file:

```js
const success = $file.copy({
  src: "demo.txt",
  dst: "download/demo.txt"
});
```

# $file.move(object)

Move a file:

```js
const success = $file.move({
  src: "demo.txt",
  dst: "download/demo.txt"
});
```

# $file.mkdir(path)

Make a directory (folder):

```js
const success = $file.mkdir("download");
```

# $file.exists(path)

Check if a file exists:

```js
const exists = $file.exists("demo.txt");
```

# $file.isDirectory(path)

Checkc if a path is directory:

```js
const isDirectory = $file.isDirectory("download");
```

# $file.merge(args)

Merge multiple files into one file:

```js
$file.merge({
  files: ["assets/1.txt", "assets/2.txt"],
  dest: "assets/merged.txt",
  chunkSize: 1024 * 1024, // optional, default is 1024 * 1024
});
```

Split a file into multiple files:

```js
$file.split({
  file: "assets/merged.txt",
  chunkSize: 1024, // optional, default is 1024
});
```

The file will be split as: merged-001.txt, merged-002.txt, ...

# $file.absolutePath(path)

Returns the absolute path of a relative path:

```js
const absolutePath = $file.absolutePath(path);
```

# $file.rootPath

Returns the root path of the documents folder (in absolute path style):

```js
const rootPath = $file.rootPath;
```

# $file.extensions

Returns all installed scripts:

```js
const extensions = $file.extensions;
```

# shared://

Access shared folder like we mentioned before:

```js
const file = $file.read("shared://demo.txt");
```

# drive://

Access iCloud Drive container like we mentioned before:

```js
const file = $file.read("drive://demo.txt");
```
```

## docs/en/foundation/app.md

```markdown
> Offers APIs that relate to the application and addin itself

# $app.theme

Specify `theme` for the script, used for [Dark Mode](en/uikit/dark-mode.md) related stuff, possible values are `light` / `dark` / `auto`.

It will be overridden if a screen has its own `theme` value.

# $app.minSDKVer

Set the minimal available version of JSBox:

```js
$app.minSDKVer = "3.1.0"
```

# $app.minOSVer

Set the minimal available version of iOS:

```js
$app.minOSVer = "10.3.3"
```

PS: Numbers are separated by `.`, version comparation goes from left to right.

# $app.tips(string)

Give user a nice hint, the effect looks like `$ui.alert`, but only once for an addin's whole life:

```js
$app.tips("Hey!")
```

# $app.info

Returns the info of JSBox itself:

```js
{
  "bundleID": "app.cyan.jsbox",
  "version": "3.0.0",
  "build": "9527",
}
```

# $app.idleTimerDisabled

Disable auto dimming of the screen:

```js
$app.idleTimerDisabled = true
```

# $app.close(delay)

Close the addin that user current uses, `delay` is an optional parameter to specify a delay seconds.

> PS: It's better to call this manually if your addin doesn't have a user interface

# $app.isDebugging

Check whether it is debugging:

```js
if ($app.isDebugging) {
  
}
```

# $app.env

Get current environment:

```js
const env = $app.env;
```

Value | Description
---|---
$env.app | Main App
$env.today | Today Widget
$env.action | Action Extension
$env.safari | Safari Extension
$env.notification | Notification Extension
$env.keyboard | Keyboard Extension
$env.siri | Siri Extension
$env.widget | Home Screen Widget
$env.all | All (Default)

We can check whether an addin runs on widget:

```js
if ($app.env == $env.today) {

}
```

# $app.widgetIndex

Since JSBox supports multiple widgets, you can check which widget is being used:

```js
const index = $app.widgetIndex;

// 0 ~ 2, other value means not a widget
```

# $app.autoKeyboardEnabled

Manage scroll views automatically, to avoid the keyboard hides text fields:

```js
$app.autoKeyboardEnabled = true
```

# $app.keyboardToolbarEnabled

Display a toolbar at the top of keyboard:

```js
$app.keyboardToolbarEnabled = true
```

# $app.rotateDisabled

Set to true to disable screen rotating:

```js
$app.rotateDisabled = true
```

# $app.openURL(string)

Open a URL or a URL Scheme, for example open WeChat:

```js
$app.openURL("weixin://")
```

# $app.openBrowser(object)

Open a URL with external browsers:

```js
$app.openBrowser({
  type: 10000,
  url: "https://apple.com"
})
```

Type | Browser
---|---
10000 | Chrome
10001 | UC
10002 | Firefox
10003 | QQ
10004 | Opera
10005 | Quark
10006 | iCab
10007 | Maxthon
10008 | Dolphin
10009 | 2345

> We don't promise it works fine, because above browsers change their APIs frequently

# $app.openExtension(string)

Open another JSBox script, for example:

```js
$app.openExtension("demo.js")
```

# $app.listen(object)

Observe notifications posted by JSBox addins:

```js
$app.listen({
  // Will be called when app is ready
  ready: function() {

  },
  // Will be called when app exit
  exit: function() {
    
  },
  // Will be called when app resign active
  pause: function() {

  },
  // Will be called when app resume active
  resume: function() {

  }
});
```

# $app.notify(object)

Post a custom event:

```js
$app.listen({
  eventName: function(object) {
    console.log(object);
  }
});

$app.notify({
  name: "eventName",
  object: {"a": "b"}
});
```
```

## docs/en/foundation/cache.md

```markdown
> Persistence is always needed for a software, JSBox offers various persistence ways, cache is the easiest one

# Hint

JSBox provides memory cache and disk cache with a really simple interface, all JavaScript objects could be cached.

All APIs have both `sync` and `async` ways, choose one according to your scenarios.

# $cache.set(string, object)

Write to cache:

```js
$cache.set("sample", {
  "a": [1, 2, 3],
  "b": "1, 2, 3"
})
```

# $cache.setAsync(object)

Write to cache (async):

```js
$cache.setAsync({
  key: "sample",
  value: {
    "a": [1, 2, 3],
    "b": "1, 2, 3"
  },
  handler: function(object) {

  }
})
```

# $cache.get(string)

Read from cache:

```js
$cache.get("sample")
```

# $cache.getAsync(object)

Read from cache (async):

```js
$cache.getAsync({
  key: "sample",
  handler: function(object) {

  }
})
```

# $cache.remove(string)

Delete a cache:

```js
$cache.remove("sample")
```

# $cache.removeAsync(object)

Delete a cache (async):

```js
$cache.removeAsync({
  key: "sample",
  handler: function() {
    
  }
})
```

# $cache.clear()

Delete all cached objects:

```js
$cache.clear()
```

# $cache.clearAsync(object)

Delete all cached objects (async):

```js
$cache.clearAsync({
  handler: function() {

  }
})
```
```

## docs/en/foundation/clipboard.md

```markdown
> Clipboard is very important for iOS data sharing, JSBox provides various interfaces

# $clipboard.text

```js
// Get clipboard text
const text = $clipboard.text;
// Set clipboard text
$clipboard.text = "Hello, World!"
```

# $clipboard.image

```js
// Get clipboard image data
const data = $clipboard.image;
// Set clipboard image data
$clipboard.image = data
```

# $clipboard.items

```js
// Get all items from clipboard
const items = $clipboard.items;
// Set items to clipboard
$clipboard.items = items
```

# $clipboard.phoneNumbers

Get all phone numbers from clipboard.

# $clipboard.phoneNumber

Get the first phone number from clipboard.

# $clipboard.links

Get all links from clipboard.

# $clipboard.link

Get the first link from clipboard.

# $clipboard.emails

Get all emails from clipboard.

# $clipboard.email

Get the first email from clipboard.

# $clipboard.dates

Get all dates from clipboard.

# $clipboard.date

Get the first date from clipboard.

# $clipboard.setTextLocalOnly(string)

Set text to clipboard, but ignore `Universal Clipboard`.

# $clipboard.set(object)

Set clipboard by `type` and `value`:

```js
$clipboard.set({
  "type": "public.plain-text",
  "value": "Hello, World!"
})
```

# $clipboard.copy(object)

Set clipboard, you can provide an expiration date:

```js
$clipboard.copy({
  text: "Temporary text",
  ttl: 20
})
```

Param | Type | Description
---|---|---
text | string | text
image | image | image
data | data | data
ttl | number | time to live
locally | bool | locally

*`UTTypes`: https://developer.apple.com/documentation/mobilecoreservices/uttype*

# $clipboard.clear()

Clear all items in clipboard.
```

## docs/en/foundation/device.md

```markdown
> Retrieve some useful information of the device, such as language, device model etc

# $device.info

Returns the basic info of device:

```js
{
  "model": "string",
  "language": "string",
  "version": "string",
  "name": "cyan's iPhone",
  "screen": {
    "width": 240,
    "height": 320,
    "scale": 2.0,
    "orientation": 1,
  },
  "battery": {
    "state": 1, // 0: unknown 1: normal 2: charging 3: charging & fully charged
    "level": 0.9399999976158142
  }
}
```

# $device.ssid

Get the SSID of current Wi-Fi:

```js
const ssid = $device.ssid;
```

Example:

```json
{
  "SSIDDATA": {},
  "BSSID": "aa:bb:cc:dd:ee:ff",
  "SSID": "SSID"
}
```

Note: In iOS 13 and above, this API needs location access, you can use `$location` APIs to request the access.

# $device.networkType

Returns the network type:

```js
const networkType = $device.networkType;
```

Value | Type
---|---
0 | None
1 | Wi-Fi
2 | Cellular

# $device.space

Returns memory usage and disk usage of the device:

```js
const space = $device.space;
```

Example:

```json
{
  "disk": {
    "free": {
      "bytes": 87409733632,
      "string": "87.41 GB"
    },
    "total": {
      "bytes": 127989493760,
      "string": "127.99 GB"
    }
  },
  "memory": {
    "free": {
      "bytes": 217907200,
      "string": "207.8 MB"
    },
    "total": {
      "bytes": 3221225472,
      "string": "3 GB"
    }
  }
}
```

# $device.taptic(number)

Generate a Taptic Engine Feedback:

```js
$device.taptic(0)
```

Param | Type | Description
---|---|---
level | number | 0 ~ 2

# $device.wlanAddress

Get WLAN address:

```js
const address = $device.wlanAddress;
```

# $device.isDarkMode

Check whether device is dark mode:

```js
if ($device.isDarkMode) {
  
}
```

# $device.isXXX

Check screen type quickly:

```js
const isIphoneX = $device.isIphoneX;
const isIphonePlus = $device.isIphonePlus;
const isIpad = $device.isIpad;
const isIpadPro = $device.isIpadPro;
```

# $device.hasTouchID

Check whether Touch ID is supported:

```js
const hasTouchID = $device.hasTouchID;
```

# $device.hasFaceID

Check whether Face ID is supported:

```js
const hasFaceID = $device.hasFaceID;
```

# $device.isJailbroken

Check whether device is jailbroken:

```js
const isJailbroken = $device.isJailbroken;
```

# $device.isVoiceOverOn

Check whether VoiceOver is running:

```js
const isVoiceOverOn = $device.isVoiceOverOn;
```
```

## docs/en/foundation/intro.md

```markdown
# Foundation

In this part we introduce some basic APIs in JSBox, including `app/device/cache/network` etc.

# $device

Device related APIs.

# $app

Application related APIs.

# $system

Operating System related APIs.

# $http

HTTP client, create requests like HTTP `GET/POST`.

# $cache

Disk Cache and Memory Cache, all in one.

# $thread

Execute code on main thread or background thread, or schedule a function after delay.
```

## docs/en/foundation/keychain.md

```markdown
> Compared to object caching, keychain stores sensitive data like passwords and credentials in a safe way.

# $keychain.set(key, value, domain)

Write to keychain:

```js
const succeeded = $keychain.set("key", "value", "my.domain");
```

> When `domain` is provided, `key` should be unique in your script. Otherwise, `key` should be unique in all scripts.

# $keychain.get(key, domain)

Read from keychain:

```js
const item = $keychain.get("key", "my.domain");
```

> When `domain` is provided, `key` should be unique in your script. Otherwise, `key` should be unique in all scripts.

# $keychain.remove(key, domain)

Delete a keychain item:

```js
const succeeded = $keychain.remove("key", "my.domain");
```

> When `domain` is provided, `key` should be unique in your script. Otherwise, `key` should be unique in all scripts.

# $keychain.clear(domain)

Delete all keychain items:

```js
const succeeded = $keychain.clear("my.domain");
```

> `domain` is required.

# $keychain.keys(domain)

Retrieve all keychain item keys:

```js
const keys = $keychain.keys("my.domain");
```

> `domain` is required.
```

## docs/en/foundation/l10n.md

```markdown
> Provide localized texts for your script, it's a great habits, we should do that.

# $l10n

`l10n` means `Localization`, because localization has 10 characters.

You can use `$l10n` to support multiple languages easily, or you can detect the language and display what ever you want by yourself (not recommend).

# $app.strings

There are only 2 steps to localize a text:

- Use `$app.strings` to define all strings
- Use `$l10n` to get localized strings

For example:

```js
$app.strings = {
  "en": {
    "title": "tortoise"
  },
  "zh-Hans": {
    "title": "乌龟"
  },
  "zh-Hant": {
    "title": "烏龜"
  }
}
```

`en` means English, `zh-Hans` means Simplified-Chinese, `zh-Hant` means Traditional-Chinese.

How to use it:

```js
const title = $l10n("title");
```

The fallback logic:

- No suitable language pack, fallback to English (en)
- No suitable string for a key, fallback to the key itself
```

## docs/en/foundation/network.md

```markdown
> Network module is very important in JSBox, you can leverage this ability to achieve more

# $http.request(object)

Send a general HTTP request:

```js
$http.request({
  method: "POST",
  url: "https://apple.com",
  header: {
    k1: "v1",
    k2: "v2"
  },
  body: {
    k1: "v1",
    k2: "v2"
  },
  handler: function(resp) {
    const data = resp.data;
  }
})
```

Param | Type | Description
---|---|---
method | string | GET/POST/DELETE etc
url | string | url
header | object | http header
body | object | http body
timeout | number | timeout (second)
form | object | form-data
files | array | file list
proxy | json | proxy configuration
progress | function | upload/download callback
showsProgress | bool | shows progress
message | string | upload/download message
handler | function | finished callback

`body` could be a JSON object or a binary data,

If `body` is a JSON object:

- When `Content-Type` is `application/json`, body will be encoded as JSON object
- When `Content-Type` is `application/x-www-form-urlencoded`, body will be converted to `a=b&c=d` formatted string
- The default value of `Content-Type` is `application/json`

If `body` is a binary data:

body won't be converted, it directly pass to body field. 

For `form` and `files`, refer `$http.upload` to see details.

`resp` properties:

Param | Type | Description
---|---|---
data | string | json object will be parsed automatically
rawData | data | raw response binary data
response | response | [Refer](en/object/response.md)
error | error | [Refer](en/object/error.md)

Proxy configuration:

```js
{
  proxy: {
    "HTTPEnable": true,
    "HTTPProxy": "",
    "HTTPPort": 0,
    "HTTPSEnable": true,
    "HTTPSProxy": "",
    "HTTPSPort": 0
  }
}
```

# $http.get(object)

Send a `GET` request:

```js
$http.get({
  url: "https://apple.com",
  handler: function(resp) {
    const data = resp.data;
  }
})
```

It just like a general request, but the method is always `GET`.

# $http.post(object)

Send a `POST` request:

```js
$http.post({
  url: "https://apple.com",
  handler: function(resp) {
    const data = resp.data;
  }
})
```

It just like a general request, but the method is always `POST`.

# $http.download(object)

It just like a general request, but the `data` inside resp is a binary data (file):

```js
$http.download({
  url: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg",
  showsProgress: true, // Optional, default is true
  backgroundFetch: true, // Optional, default is false
  progress: function(bytesWritten, totalBytes) {
    const percentage = bytesWritten * 1.0 / totalBytes;
  },
  handler: function(resp) {
    $share.sheet(resp.data)
  }
})
```

# $http.upload(object)

File upload request, here's an example based on [qiniu](https://www.qiniu.com/):

```js
$photo.pick({
  handler: function(resp) {
    const image = resp.image;
    if (image) {
      $http.upload({
        url: "http://upload.qiniu.com/",
        form: {
          token: "<token>"
        },
        files: [
          {
            "image": image,
            "name": "file",
            "filename": "file.png"
          }
        ],
        progress: function(percentage) {

        },
        handler: function(resp) {
          
        }
      })
    }
  }
})
```

Pick a photo from photo library, upload it to qiniu (fill your own token).

You can fill form-data parameters in `form`, like `token` in this example.

`files` properties:

Param | Type | Description
---|---|---
image | object | image
data | object | binary data
name | string | form name
filename | string | file name
content-type | string | content type

# $http.startServer(object)

Start a web server, serve local files to provide HTTP interfaces:

```js
$http.startServer({
  port: 5588, // port number
  path: "", // script root path
  handler: function(result) {
    const url = result.url;
  }
})
```

This code will create a server based on root path, you can access by url, we also provide a web interface that allows use access on browser.

At the same time, you can access server by following APIs:

- `GET` /list?path=path list contents
- `GET` /download?path=path download file
- `POST` /upload `{"files[]": file}` upload file
- `POST` /move `{"oldPath": "", "newPath": ""}` move file
- `POST` /delete `{"path": ""}` delete file
- `POST` /create `{"path": ""}` create folder

Please understand above contents by using your knowledge of HTTP.

# $http.stopServer()

Stop a web server:

```js
$http.stopServer()
```

# $http.shorten(object)

Shorten a link:

```js
$http.shorten({
  url: "https://apple.com",
  handler: function(url) {

  }
})
```

# $http.lengthen(object)

Expand a link:

```js
$http.lengthen({
  url: "http://t.cn/RJZxkFD",
  handler: function(url) {

  }
})
```

# $network.ifa_data

Get network interface received/sent data in bytes:

```js
const ifa_data = $network.ifa_data;
console.log(ifa_data)
```

Example output:

```json
{
  "en0" : {
    "received" : 2581234688,
    "sent" : 469011456
  },
  "awdl0" : {
    "received" : 2231296,
    "sent" : 8180736
  },
  "utun0" : {
    "received" : 0,
    "sent" : 0
  },
  "pdp_ip1" : {
    "received" : 2048,
    "sent" : 2048
  },
  "pdp_ip0" : {
    "received" : 2215782400,
    "sent" : 211150848
  },
  "en2" : {
    "received" : 5859328,
    "sent" : 6347776
  },
  "utun2" : {
    "received" : 0,
    "sent" : 0
  },
  "lo0" : {
    "received" : 407684096,
    "sent" : 407684096
  },
  "utun1" : {
    "received" : 628973568,
    "sent" : 35312640
  }
}
```

# $network.interfaces

Returns all network interfaces on the current device:

```js
const interfaces = $network.interfaces;

// E.g. { 'en0/ipv4': 'x.x.x.x' }
```

# $network.startPinging(object)

start pinging:

```js
$network.startPinging({
  host: "google.com",
  timeout: 2.0, // default
  period: 1.0, // default
  payloadSize: 56, // default
  ttl: 49, // default
  didReceiveReply: function(summary) {

  },
  didReceiveUnexpectedReply: function(summary) {

  },
  didSendPing: function(summary) {

  },
  didTimeout: function(summary) {

  },
  didFail: function(error) {

  },
  didFailToSendPing: function(response) {

  }
})
```

`summary` structure:

```json
{
  "sequenceNumber": 0,
  "payloadSize": 0,
  "ttl": 0,
  "host": "",
  "sendDate": null,
  "receiveDate": null,
  "rtt": 0,
  "status": 0
}
```

For more information: https://github.com/lmirosevic/GBPing

# $network.stopPinging()

Stop pinging.

# $network.proxy_settings

Port of [CFNetworkCopySystemProxySettings](https://developer.apple.com/documentation/cfnetwork/1426754-cfnetworkcopysystemproxysettings)
```

## docs/en/foundation/prefs.md

```markdown
> The easiest way to create user preferences

# prefs.json

Start from v1.51.0, you can create user preferences with a simple `prefs.json` in the root folder. It generates settings view for you automatically.

Here is an example:

```json
{
  "title": "SETTINGS",
  "groups": [
    {
      "title": "GENERAL",
      "items": [
        {
          "title": "USER_NAME",
          "type": "string",
          "key": "user.name",
          "value": "default user name"
        },
        {
          "title": "AUTO_SAVE",
          "type": "boolean",
          "key": "auto.save",
          "value": true
        },
        {
          "title": "OTHERS",
          "type": "child",
          "value": {
            "title": "OTHERS",
            "groups": [
              
            ]
          }
        }
      ]
    }
  ]
}
```

In your script, the settings view can be opened with the following code:

```js
$prefs.open(() => {
  // Done
});
```

# Definition

The root element is a JSON object that contains `title` and `groups` nodes. `title` will be displayed as the page title, and `groups` specifies all setting groups in the current page.

Under `groups`, there is a JSON object which contains `title` and `items`. `items` means all setting rows in the current group.

If there is only one group, you can also simplify the configuration as:

```json
{
  "title": "GENERAL",
  "items": [
    {
      "title": "USER_NAME",
      "type": "string",
      "key": "user.name",
      "value": "default user name",
      "inline": true // inline edit, default is false
    }
  ]
}
```

A setting item contains the following attributes:

- `title`: title
- `type`: value type, such as "string" or "boolean"
- `key`: the key that will be used to persistent settings
- `value`: default value for the current setting, can be null
- `placeholder`: placeholder shown when input is empty
- `insetGrouped`: whether to use insetGrouped style list
- `inline`: whether to edit text inline

# title

In order to make localization easier, a title will be used as the localization key first, if nothing is found in the `strings` folder, itself will be used.

# type

Currently, below types are supported:

- `string`: normal text, edits multi-line text by default
- `password`: secure text entry, renders characters as dots
- `number`: decimal numbers
- `integer`: integer numbers
- `boolean`: boolean value, shows a switch
- `slider`: decimal between 0 and 1, shows a slider
- `list`: shows a string list, let the user pick one
- `info`: shows a readonly informative text
- `link`: shows a link, tap it to open
- `script`: contains a code snippet, tap it to run
- `child`: child node, tap it to open a new settings view

Types like `string`, `number` or `integer` are relatively easy to use, I'm going to show you some exceptions.

# type: "password"

Works the same as `type: "string"`, used for sensitive data like passwords.

# type: "slider"

It provides a slider that can be used to select a decimal value between 0 and 1. So, the `value` should also between 0 and 1.

If you don't want a value between 0 and 1, you need to do some transformations. In short, take it as a percentage.

# type: "list"

Shows a string list, like a memu:

```json
{
  "title": "IMAGE_QUALITY",
  "type": "list",
  "key": "image.quality",
  "items": ["LOW", "MEDIUM", "HIGH"],
  "value": 1
}
```

It displays "LOW", "MEDIUM" and "HIGH" in a list, and the `value` is actually an `index`. Also, it will be localized.

Note that, `items` are user-facing strings, not something that will be stored. What will be stored is the index value.

# type: "script"

Sometimes, you may want some customizable behaviors, like this:

```json
{
  "title": "TEST",
  "type": "script",
  "value": "require('scripts/test').runTest();"
}
```

# type: "child"

Sometimes, you may want to fold some settings to 2nd level or 3rd level, like this:

```json
{
  "title": "OTHERS",
  "type": "child",
  "value": {
    "title": "OTHERS",
    "groups": []
  }
}
```

The above `value` has exactly the same structure comparing to the root element, you can nest them as much as you can.

# key

`key` is a string that will be used to save/read settings, you have to make sure they are unique in the whole script.

Read settings:

```js
const name = $prefs.get("user.name");
```

In most cases, settings should be changed by users, but just in case you want some flexibility, you can change them programmatically:

```js
$prefs.set("user.name", "cyan");
```

# $prefs.all()

Returns all key values:

```js
const prefs = $prefs.all();
```

Obviously, `$prefs` cannot cover all scenarios, but for most common used ones, it's good enough, and easy to use. Here is an example: https://github.com/cyanzhong/xTeko/tree/master/extension-demos/prefs

# $prefs.edit(node)

Other than using the default `prefs.json` file, you can also edit any JSON preference objects, with formats mentioned above:

```js
const edited = await $prefs.edit({
  "title": "SETTINGS",
  "groups": [
    {
      "title": "GENERAL",
      "items": [
        {
          "title": "USER_NAME",
          "type": "string",
          "key": "user.name",
          "value": "default user name"
        }
        // ...
      ]
    }
  ]
});
```

The returned object is edited preferences, you can make user preferences more flexible that way.
```

## docs/en/foundation/system.md

```markdown
> Operating System related APIs

# $system.brightness

Get/Set the brightness of screen:

```js
$system.brightness = 0.5
```

# $system.volume

Get/Set the volume of speaker (0.0 ~ 1.0):

```js
$system.volume = 0.5
```

# $system.call(number)

Make a phone call, similar to `$app.openURL("tel:number")`.

# $system.sms(number)

Send a text message, similar to `$app.openURL("sms:number")`.

# $system.mailto(email)

Send an email, similar to `$app.openURL("mailto:email")`.

# $system.facetime(number)

Create a FaceTime session, similar to `$app.openURL("facetime:number")`.

# $system.makeIcon(object)

Create home screen icon for url:

```js
$system.makeIcon({
  title: "Title",
  url: "https://sspai.com",
  icon: image
})
```
```

## docs/en/foundation/thread.md

```markdown
> This topic including thread switching, after delay and timer

# $thread.background(object)

Run on background thread:

```js
$thread.background({
  delay: 0,
  handler: function() {

  }
})
```

# $thread.main(object)

Run on main thread (with delay):

```js
$thread.main({
  delay: 0.3,
  handler: function() {
    
  }
})
```

Param | Type | Description
---|---|---
delay | number | delay (seconds)
handler | function | handler

It can be simplifies as below if no delay is needed:

```js
$thread.main(() => {
  
});
```

# $delay(number, function)

Run after delay easily:

```js
$delay(3, () => {
  $ui.alert("Hey!")
})
```

Present an alert after 3 seconds.

You can cancel the task by:

```js
const task = $delay(10, () => {

});

// Cancel it
task.cancel();
```

# $wait(sec)

It's similar to $delay but Promise is supported:

```js
await $wait(2);

alert("Hey!");
```

# $timer.schedule(object)

Schedule a timer:

```js
const timer = $timer.schedule({
  interval: 3,
  handler: function() {
    $ui.toast("Hey!")
  }
});
```

Show a toast "Hey!" in every 3 seconds, cancel it by:

```js
timer.invalidate()
```
```

## docs/en/function/index.md

```markdown
# $l10n

`l10n` means `Localization`, because localization has 10 characters.

You can use `$l10n` to support multiple languages easily, or you can detect the language and display what ever you want by yourself (not recommend).

```js
const text = $l10n("MAIN_TITLE");
```

# $delay(number, function)

Run after delay easily:

```js
$delay(3, () => {
  $ui.alert("Hey!")
})
```

Present an alert after 3 seconds.

You can cancel the task by:

```js
const task = $delay(10, () => {

});

// Cancel it
task.cancel();
```

# $rect(x, y, width, height)

Create a rectangle:

```js
const rect = $rect(0, 0, 100, 100);
```

# $size(width, height)

Create a size:

```js
const size = $size(100, 100);
```

# $point(x, y)

Create a point:

```js
const point = $point(0, 0);
```

# $insets(top, left, bottom, right)

Create an edge insets:

```js
const insets = $insets(10, 10, 10, 10);
```

# $color(string)

Create a color with hex string:

```js
const color = $color("#00EEEE");
```

Create a color with name:

```js
const blackColor = $color("black");
```

Available color names:

Name | Color
---|---
tint | JSBox theme color
black | black color
darkGray | dark gray
lightGray | light gray
white | white color
gray | gray color
red | red color
green | green color
blue | blue color
cyan | cyan color
yellow | yellow color
magenta | magenta color
orange | orange color
purple | purple color
brown | brown color
clear | clear color

The following colors are semantic colors, used for dynamic theme, it will be different in light or dark mode:

Name | Color
---|---
tintColor | tint color
primarySurface | primary surface
secondarySurface | secondary surface
tertiarySurface | tertiary surface
primaryText | primary text
secondaryText | secondary text
backgroundColor | background color
separatorColor | separator color
groupedBackground | grouped background
insetGroupedBackground | insetGrouped background

Below are system default colors, they are implemented based on [UI Element Colors](https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors)

Name | Color
---|---
systemGray2 | UIColor.systemGray2Color
systemGray3 | UIColor.systemGray3Color
systemGray4 | UIColor.systemGray4Color
systemGray5 | UIColor.systemGray5Color
systemGray6 | UIColor.systemGray6Color
systemLabel | UIColor.labelColor
systemSecondaryLabel | UIColor.secondaryLabelColor
systemTertiaryLabel | UIColor.tertiaryLabelColor
systemQuaternaryLabel | UIColor.quaternaryLabelColor
systemLink | UIColor.linkColor
systemPlaceholderText | UIColor.placeholderTextColor
systemSeparator | UIColor.separatorColor
systemOpaqueSeparator | UIColor.opaqueSeparatorColor
systemBackground | UIColor.systemBackgroundColor
systemSecondaryBackground | UIColor.secondarySystemBackgroundColor
systemTertiaryBackground | UIColor.tertiarySystemBackgroundColor
systemGroupedBackground | UIColor.systemGroupedBackgroundColor
systemSecondaryGroupedBackground | UIColor.secondarySystemGroupedBackgroundColor
systemTertiaryGroupedBackground | UIColor.tertiarySystemGroupedBackgroundColor
systemFill | UIColor.systemFillColor
systemSecondaryFill | UIColor.secondarySystemFillColor
systemTertiaryFill | UIColor.tertiarySystemFillColor
systemQuaternaryFill | UIColor.quaternarySystemFillColor

These colors behave differently for light or dark mode. For example, `$color("tintColor")` returns theme color for the light mode, and light blue for the dark mode.

You can retrieve all available colors in the color palette with `$color("namedColors")`, it returns a dictionary:

```js
const colors = $color("namedColors");
```

Also, `$color(...)` supports dynamic colors, it returns color for light and dark mode dynamically:

```js
const dynamicColor = $color({
  light: "#FFFFFF",
  dark: "#000000"
});
```

That color is white for light mode, and black for dark mode, changes automatically, can also be simplified as:

```js
const dynamicColor = $color("#FFFFFF", "#000000");
```

Colors can be nested, it can use colors generated by the `$rgba(...)` method:

```js
const dynamicColor = $color($rgba(0, 0, 0, 1), $rgba(255, 255, 255, 1));
```

Besides, if you want to provide colors for the pure black theme, you can do:

```js
const dynamicColor = $color({
  light: "#FFFFFF",
  dark: "#141414",
  black: "#000000"
});
```

# $rgb(red, green, blue)

Create a color with red, green, blue values.

The range of each number is 0 ~ 255:

```js
const color = $rgb(100, 100, 100);
```
# $rgba(red, green, blue, alpha)

Create a color with red, green, blue and alpha channel:

```js
const color = $rgba(100, 100, 100, 0.5);
```

# $font(name, size)

Create a font, name is an optional parameter:

```js
const font1 = $font(15);
const font2 = $font("bold", 15);
```

You can specify `"bold"` to use system font with bold weight, otherwise it will search fonts with the name.

Learn more: http://iosfonts.com/

# $range(location, length)

Create a range:

```js
const range = $range(0, 10);
```

# $indexPath(section, row)

Create an indexPath, to indicates the section and row:

```js
const indexPath = $indexPath(0, 10);
```

# $data(object)

Create a binary data:

```js
// string
const data = $data({
  string: "Hello, World!",
  encoding: 4 // default, refer: https://developer.apple.com/documentation/foundation/nsstringencoding
});
```

```js
// path
const data = $data({
  path: "demo.txt"
});
```

```js
// url
const data = $data({
  url: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg"
});
```

# $image(object, scale)

Returns an image object, supports the following types:

```js
// file path
const image = $image("assets/icon.png");
```

```js
// sf symbols
const image = $image("sunrise");
```

```js
// url
const image = $image("https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg");
```

```js
// base64
const image = $image("data:image/png;base64,...");
```

The `scale` argument indicates its scale, default to 1, 0 means using screen scale.

In the latest version, you can use `$image(...)` to create dynamic images for dark mode, like this:

```js
const dynamicImage = $image({
  light: "light-image.png",
  dark: "dark-image.png"
});
```

This image chooses different resources for light and dark mode, it switches automatically, can be simplified as:

```js
const dynamicImage = $image("light-image.png", "dark-image.png");
```

Besides, images can also be nested, such as:

```js
const lightImage = $image("light-image.png");
const darkImage = $image("dark-image.png");
const dynamicImage = $image(lightImage, darkImage);
```

# $icon(code, color, size)

Get an icon provided by JSBox, refer: https://github.com/cyanzhong/xTeko/tree/master/extension-icons

For example:

```js
$ui.render({
  views: [
    {
      type: "button",
      props: {
        icon: $icon("005", $color("red"), $size(20, 20)),
        bgcolor: $color("clear")
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.size.equalTo($size(24, 24))
      }
    }
  ]
})
```

`color` is optional, uses gray style if not provided.

`size` is also optional, uses raw size if not provided.

# $accessibilityAction(title, handler)

Create a [UIAccessibilityCustomAction](https://developer.apple.com/documentation/uikit/uiaccessibilitycustomaction), for instance:

```js
{
  type: "view",
  props: {
    isAccessibilityElement: true,
    accessibilityCustomActions: [
      $accessibilityAction("Hello", () => alert("Hello"))
    ]
  }
}
```

# $objc_retain(object)

Sometimes, values generated by Runtime will be released by system automatically, in order to avoid that, you could manage reference yourself:

```js
const manager = $objc("Manager").invoke("new");
$objc_retain(manager)
```

It maintains the object until script stopped.

# $objc_relase(object)

Release a Runtime object manually:

```js
$objc_release(manager)
```

# $get_protocol(name)

Get an Objective-C Protocol:

```js
const p = $get_protocol(name);
```

# $objc_clean()

Clean all Objective-C definitions:

```js
$objc_clean();
```
```

## docs/en/function/intro.md

```markdown
# Built-in Functions

Besides functions that provided by JavaScript, JSBox offers many extra functions, you can use them globally.

For instance:

```js
const text = $l10n("MAIN_TITLE");
```

This function gives you a localized string.

In order to distinguish them from JavaScript built-in functions, built-in functions provided by JSBox start with `$`.
```

## docs/en/home-widget/intro.md

```markdown
# Home Screen Widgets

Apple has introduced home screen widgets in iOS 14, and JSBox `v2.12.0` provides full support for that. At the same time, support for the today widget has been deprecated and will be removed by Apple in future iOS releases.

Home screen widgets are very different from today widgets, so it's worth taking a moment to understand some of the basic concepts.

# Basic Concepts

Home screen widgets are essentially a series of **snapshot** based on a timeline, rather than dynamically built interfaces. So when a user sees a widget, iOS doesn't run the code contained in the widget directly. Instead, the system calls the widget's code at some point (the "timeline" mechanism, we will discuss later), and our code can provide a snapshot. The system then shows these snapshots at the appropriate time, and repeat this based on some policies.

Also, home screen widgets can only handle limited user interactions:

- 2 * 2 layout only supports tapping on the widget
- 2 * 4 and 4 * 4 layouts supports tapping on components
- Tapping will open the main app and carry a URL

These limitations dictate that the role of the home screen widget is more like **information board**, complex interactions should be delegated to the main app.

# Configuring Widgets

JSBox supports all widget layouts, to add them:

- Enter edit mode in home screen, tap the add button
- Find JSBox and drag a widget to your home screen
- In edit mode, select "Edit"
- Select a script that supports widget

In contrast to the today widget, which can only run one script (although JSBox provides three), the home screen widget can be configured to create as many instances as you like, and can be stacked to display different content via the system's "stack" feature.

For more information on how to use it, please refer to tutorials provided by Apple or other posts.

# Widget Parameter

For each widget, you can set which script to run, and an additional parameter to provide more information.

The parameter is a string value that can be retrieved like this:

```js
const inputValue = $widget.inputValue;
```

For script packages, widget parameters can be provided dynamically like:

```json
[
  {
    "name": "Option 1",
    "value": "Value 1"
  },
  {
    "name": "Option 2",
    "value": "Value 2"
  }
]
```

`name` is the display string for user, `value` stands for the actual value as mentioned above. To let widget provide dynamic options, just place the configuration as `widget-options.json` under the root path for each package.

# Example Scripts

To make your learning curve smoother, we have created some sample projects for reference:

- [WidgetDoodles](https://github.com/cyanzhong/jsbox-widgets/tree/master/WidgetDoodles)
- [AppleDevNews2](https://github.com/cyanzhong/jsbox-widgets/tree/master/AppleDevNews2)
- [QRCode](https://github.com/cyanzhong/jsbox-widgets/blob/master/QRCode.js)
- [xkcd](https://github.com/cyanzhong/jsbox-widgets/blob/master/xkcd.js)
- [clock](https://github.com/cyanzhong/jsbox-widgets/blob/master/clock.js)

We will improve this repository later to provide more examples.
```

## docs/en/home-widget/layout.md

```markdown
# Layout System

As we have already mentioned, the layout system of the widget is completely different from `$ui.render`, so before learning the JSBox implementation, it is recommended to have a basic understanding of SwiftUI's layout system.

- [View Layout and Presentation](https://developer.apple.com/documentation/swiftui/view-layout-and-presentation)
- [SwiftUI Layout System](https://kean.blog/post/swiftui-layout-system)

In short, compared to UIKit where we specify an auto layout constraint for each view, in the widget we implement the layout of its child views by using `hstack`, `vstack`, `zstack` and so on.

# type: "hstack"

Create a horizontal layout space, for example:

```js
$widget.setTimeline(ctx => {
  return {
    type: "hstack",
    props: {
      alignment: $widget.verticalAlignment.center,
      spacing: 20
    },
    views: [
      {
        type: "text",
        props: {
          text: "Hello"
        }
      },
      {
        type: "text",
        props: {
          text: "World"
        }
      }
    ]
  }
});
```

Where `spacing` specifies the spacing between views, and `alignment` uses [$widget.verticalAlignment](en/home-widget/method.md?id=widgetverticalalignment) to specify the vertical alignment of views.

# type: "vstack"

Create a vertical layout space, for example:

```js
$widget.setTimeline(ctx => {
  return {
    type: "vstack",
    props: {
      alignment: $widget.horizontalAlignment.center,
      spacing: 20
    },
    views: [
      {
        type: "text",
        props: {
          text: "Hello"
        }
      },
      {
        type: "text",
        props: {
          text: "World"
        }
      }
    ]
  }
});
```

Where `spacing` specifies the spacing between views, and `alignment` uses [$widget.horizontalAlignment](en/home-widget/method.md?id=widgethorizontalalignment) to specify the horizontal alignment of views.

# type: "zstack"

Create a space that stacks its children, for example:

```js
$widget.setTimeline(ctx => {
  return {
    type: "zstack",
    props: {
      alignment: $widget.alignment.center
    },
    views: [
      $color("red"),
      {
        type: "text",
        props: {
          text: "Hello, World!"
        }
      }
    ]
  }
});
```

Where `alignment` uses [$widget.alignment](en/home-widget/method.md?id=widgetalignment) to specify the views's alignment.

# type: "spacer"

Add spacing to the layout space, for example:

```js
$widget.setTimeline(ctx => {
  return {
    type: "hstack",
    views: [
      {
        type: "text",
        props: {
          text: "Hello"
        }
      },
      {
        type: "spacer",
        props: {
          // minLength: 10
        }
      },
      {
        type: "text",
        props: {
          text: "World"
        }
      }
    ]
  }
});
```

This will squeeze the two text views to the sides of the layout space, and `minLength` is the minimum length of the spacer.

# type: "hgrid"

Create a horizontal grid layout, E.g.:

```js
$widget.setTimeline(ctx => {
  return {
    type: "hgrid",
    props: {
      rows: Array(4).fill({
        flexible: {
          minimum: 10,
          maximum: Infinity
        },
        // spacing: 10,
        // alignment: $widget.alignment.left
      }),
      // spacing: 10,
      // alignment: $widget.verticalAlignment.center
    },
    views: Array(8).fill({
      type: "text",
      props: {
        text: "Item"
      }
    })
  }
});
```

The above code creates a horizontal grid of 4 rows and 2 columns, the contents of which are displayed as `Item`, and the item size can be used as follows:

```js
{
  fixed: 10
}
```

Refer: https://developer.apple.com/documentation/swiftui/griditem/size-swift.enum

```js
{
  flexible: {
    minimum: 10,
    maximum: Infinity
  }
}
```

Refer: https://developer.apple.com/documentation/swiftui/griditem/size-swift.enum

```js
{
  adaptive: {
    minimum: 10,
    maximum: Infinity
  }
}
```

Refer: https://developer.apple.com/documentation/swiftui/griditem/size-swift.enum

# type: "vgrid"

Create a vertical grid layout, E.g.:

```js
$widget.setTimeline(ctx => {
  return {
    type: "vgrid",
    props: {
      columns: Array(4).fill({
        flexible: {
          minimum: 10,
          maximum: Infinity
        },
        // spacing: 10,
        // alignment: $widget.alignment.left
      }),
      // spacing: 10,
      // alignment: $widget.horizontalAlignment.center
    },
    views: Array(8).fill({
      type: "text",
      props: {
        text: "Item"
      }
    })
  }
});
```

The above code creates a 2-row, 4-column vertical grid that is displayed as `Item`, the parameters have the same meaning as `hgrid`.
```

## docs/en/home-widget/lock-screen.md

```markdown
# Lock Screen Widgets (Beta)

In iOS 16 Beta, lock screen can also have widgets, and JSBox supports building them as well (currently in TestFlight).

## Building Lock Screen Widgets

Lock screen widgets are essentially just widgets that you're familiar with on your home screen, with two major differences.

### Vibrant Colors

In lock screen, widgets are rendered with vibrant colors instead of full colors.

You're encouraged to use full-alpha colors, such as white or black to build lock screen widgets. Translucent color will be mixed with the wallpaper and the result will not be readable.

### Smaller Sizes

There are three new sizes compared to widgets on home screen:

```js
const $widgetFamily = {
  // small, medium, large, xLarge
  accessoryCircular: 5,
  accessoryRectangular: 6,
  accessoryInline: 7,
}
```

- `accessoryCircular`: 1 * 1 circular
- `accessoryRectangular`: 1 * 2 rectangular
- `accessoryInline`: one line info right after the date

To detect the current running environment, check [here](en/home-widget/timeline.md?id=render).

## In-app Preview

The in-app preview built for widgets currently doesn't support lock screen widgets previewing, please stay tuned for upcoming updates.

## Example Scripts

Please check out this [GitHub repo](https://github.com/cyanzhong/jsbox-widgets) for reference.
```

## docs/en/home-widget/method.md

```markdown
# Handy Methods

We added some new methods and constants for home screen widgets to the `$widget` module for ease of use.

# $widget.setTimeline(object)

Provide a timeline:

```js
$widget.setTimeline({
  entries: [
    {
      date: new Date(),
      info: {}
    }
  ],
  policy: {
    atEnd: true
  },
  render: ctx => {
    return {
      type: "text",
      props: {
        text: "Hello, World!"
      }
    }
  }
});
```

Please refer to [timeline](en/home-widget/timeline.md) for details.

# $widget.reloadTimeline()

Trigger timeline refresh manually, the system can decide whether to refresh or not:

```js
$widget.reloadTimeline();
```

# $widget.inputValue

Return the parameter set for the current widget:

```js
const inputValue = $widget.inputValue;
```

> `inputValue` is undefined when the main app is running, use a mock value for testing purposes

# $widget.family

Return the layout of the current widget, 0 ~ 3 means small, medium, large, and extra large (iPadOS 15) respectively:

```js
const family = $widget.family;
// 0, 1, 2, 3
```

In most cases, you should rely on the `ctx` returned in the `render` function to retrieve `family`. Use this API only if you need to get it before calling `setTimeline`.

By default, this value is 0 when the main app is running, and can be overridden by the test code:

```js
$widget.family = $widgetFamily.medium;
```

# $widget.displaySize

Return the display size of the current widget:

```js
const size = $widget.displaySize;
// size.width, size.height
```

In most cases, you should rely on the `ctx` returned in the `render` function to retrieve `displaySize`. Use this API only if you need to get it before calling `setTimeline`.

By default, this value refers to small size when the main app is running, and can be tweaked by modifying the family:

```js
$widget.family = $widgetFamily.medium;
```

# $widget.isDarkMode

Check if the current widget is running in dark mode:

```js
const isDarkMode = $widget.isDarkMode;
```

In most cases, you should rely on the `ctx` returned in the `render` function to retrieve `isDarkMode`. Use this API only if you need to get it before calling `setTimeline`.

# $widget.alignment

Return the `alignment` constants for layout:

```js
const alignment = $widget.alignment;
// center, leading, trailing, top, bottom
// topLeading, topTrailing, bottomLeading, bottomTrailing
```

You can also use string literals, such as "center", "leading"...

# $widget.horizontalAlignment

Return the `horizontalAlignment` constants for layout:

```js
const horizontalAlignment = $widget.horizontalAlignment;
// leading, center, trailing
```

You can also use string literals, such as "leading", "center"...

# $widget.verticalAlignment

Return the `verticalAlignment` constants for layout:

```js
const verticalAlignment = $widget.verticalAlignment;
// top, center, bottom
// firstTextBaseline, lastTextBaseline
```

You can also use string literals, such as "top", "center"...

# $widget.dateStyle

Return the `dateStyle` constants that is used when configure a `text` view using dates:

```js
const dateStyle = $widget.dateStyle;
// time, date, relative, offset, timer
```

You can also use string literals, such as "time", "date"...

# $env.widget

Check if it's running in a home screen widget environment:

```js
if ($app.env == $env.widget) {
  
}
```
```

## docs/en/home-widget/modifiers.md

```markdown
# Properties

The properties of a widget specify its display effects and behavior, some properties support all types of views, and some properties are unique to text or images.

You can set multiple properties inside `props`, something like this:

```js
props: {
  frame: {
    width: 100,
    height: 100
  },
  background: $color("red"),
  padding: 15
}
```

Note that this simplification differs from SwiftUI's native [View Modifier](https://developer.apple.com/documentation/swiftui/viewmodifier):

- The same property can only be applied once.
- Unable to specify the order in which properties are applied

The way SwiftUI modifiers work dictates that different sequences produce different results, and each modifier produces a new view, so you can apply the same type of modifier over and over again.

When you need to fully mimic the logic in SwiftUI, you can use the `modifiers` array.

```js
modifiers: [
  {
    frame: { width: 100, height: 100 },
    background: $color("red")
  },
  { padding: 15 }
]
```

In the above code, the order of `frame` and `background` is undefined, but `padding` will be applied later.

The syntax is exactly the same as in `props` and the following examples will not be repeated.

# Properties for All Views

## props: frame

Specify the size and alignment of the view to:

```js
props: {
  frame: {
    width: 100,
    height: 100,
    alignment: $widget.alignment.center
  }
}
```

It can be more flexible:

```js
props: {
  frame: {
    minWidth: 0,
    idealWidth: 100,
    maxWidth: Infinity,
    minHeight: 0,
    idealHeight: 100,
    maxHeight: Infinity,
  }
}
```

The appropriate layout is inferred automatically, using `maxWidth: Infinity` and `maxHeight: Infinity` when the view is needed to fill the parent view.

## props: position

Specify the position of the view:

```js
props: {
  position: $point(0, 0) // {"x": 0, "y": 0}
}
```

## props: offset

Specifies the view's position offset:

```js
props: {
  offset: $point(-10, -10) // {"x": -10, "y": -10}
}
```

## props: padding

Specify the padding of the view:

```js
props: {
  padding: 10
}
```

This will give it a padding of 10 in all edges, or you can specify each edge separately:

```js
props: {
  padding: $insets(10, 0, 10, 0) // {"top": 10, "left": 0, "bottom": 10, "right": 0}
}
```

## props: layoutPriority

Sets the priority by which a parent layout should apportion space to this child (default: 0):

```js
props: {
  layoutPriority: 1
}
```

## props: cornerRadius

Apply corner radius:

```js
props: {
  cornerRadius: 10
}
```

When smooth corners are needed:

```js
props: {
  cornerRadius: {
    value: 10,
    style: 1 // 0: circular, 1: continuous
  }
}
```

## props: border

Create a border:

```js
props: {
  border: {
    color: $color("red"),
    width: 2
  }
}
```

## props: clipped

Whether to clip any content that extends beyond the layout bounds of the shape:

```js
props: {
  clipped: true
}
```

You can also enable antialiasing with `antialiased`:

```js
props: {
  clipped: {
    antialiased: true
  }
}
```

## props: opacity

Change the opacity of the view:

```js
props: {
  opacity: 0.5
}
```

## props: rotationEffect

Rotate the view with an angle in radians:

```js
props: {
  rotationEffect: Math.PI * 0.5
}
```

## props: blur

Apply a Gaussian blur:

```js
props: {
  blur: 10
}
```

## props: color

Set the foreground color, such as text color:

```js
props: {
  color: $color("red")
}
```

## props: background

Fill the background, it can be color, image, or gradient:

```js
props: {
  background: {
    type: "gradient",
    props: {
      colors: [
        $color("#f9d423", "#4CA1AF"),
        $color("#ff4e50", "#2C3E50"),
      ]
    }
  }
}
```

## props: link

Specify the link that will open when the view is tapped (only for 2 * 4 and 4 * 4 layouts).

```js
props: {
  link: "jsbox://run?name="
}
```

Regardless of what this link fills in, iOS will first open the JSBox main app, but the task to be performed can be delegated to the main app using a URL scheme.

Also, you can also use a special URL scheme to run scripts directly:

```js
props: {
  link: "jsbox://run?script=alert%28%22hello%22%29"
}
```

It opens the JSBox main app, and runs the script specified by the `script` parameter.

## props: widgetURL

Similar to `link`, but `widgetURL` specifies the link that is opened when the entire widget is tapped.

```js
props: {
  widgetURL: "jsbox://run?script=alert%28%22hello%22%29"
}
```

2 * 2 layout only supports this type of interaction.

# Properties for Text Views

## props: bold

Use bold fonts:

```js
props: {
  bold: true
}
```

## props: font

Specify the font:

```js
props: {
  font: {
    name: "AmericanTypewriter",
    size: 20,
    // weight: "regular" (ultraLight, thin, light, regular, medium, semibold, bold, heavy, black)
    // monospaced: true
  }
}
```

It can also be a font created using `$font`:

```js
props: {
  font: $font("bold", 20)
}
```

## props: lineLimit

Limit the maximum number of lines:

```js
props: {
  lineLimit: 1
}
```

## props: minimumScaleFactor

iOS may reduce the font size when there is not enough text to display. This property specifies the minimum acceptable scale:

```js
props: {
  minimumScaleFactor: 0.5
}
```

If it cannot be displayed in full, the content will be truncated.

# Properties for Image Views

## props: resizable

Specifies whether the image can be scaled:

```js
props: {
  resizable: true
}
```

## props: scaledToFill

Similar to [$contentMode.scaleAspectFill](en/data/constant.md?id=contentmode), this property determines whether the image fills the parent view in a way that stretches and is cropped.

```js
props: {
  scaledToFill: true
}
```

## props: scaledToFit

Similar to [$contentMode.scaleAspectFit](en/data/constant.md?id=contentmode), this property determines whether the image is placed in the parent view in a way that stretches and holds the content.

```js
props: {
  scaledToFit: true
}
```

## props: accessibilityHidden

Whether to disable VoiceOver:

```js
props: {
  accessibilityHidden: false
}
```

## props: accessibilityLabel

Set VoiceOver label:

```js
props: {
  accessibilityLabel: "Hey"
}
```

## props: accessibilityHint

Set VoiceOver hint:

```js
props: {
  accessibilityHint: "Double tap to open"
}
```
```

## docs/en/home-widget/timeline.md

```markdown
# Timeline

As we mentioned before, a home screen widget is a series of time-based snapshots. Timelines are the foundation of the entire way widgets work, and we'll spend a little time explaining that concept. But before we do, please read an article provided by Apple： https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date

This article is extremely important for understanding how the timeline works, especially the following diagram:

<img src='https://docs-assets.developer.apple.com/published/2971813b6a098a34d134a04e38a50b83/2550/WidgetKit-Timeline-At-End@2x.png' width=360px/>

Our code plays the role of the timeline provider in the diagram, where the system fetches a timeline and reload policy from us at the appropriate time. The system then calls the method we provide to display the widget, and makes the next fetch when the policy is satisfied.

So, an accurate timeline and a well-designed reload strategy are essential for the widget experience. For example, the weather app knows what the weather will be like for the next few hours, so it can provide multiple snapshots to the system at once and perform the next update after all snapshots are displayed.

# $widget.setTimeline(object)

JSBox uses `$widget.setTimeline(...)` to provide timelines mentioned above, E.g.:

```js
$widget.setTimeline({
  entries: [
    {
      date: new Date(),
      info: {}
    }
  ],
  policy: {
    atEnd: true
  },
  render: ctx => {
    return {
      type: "text",
      props: {
        text: "Hello, World!"
      }
    }
  }
});
```

Before calling `setTimeline`, we can perform some data fetching operations, such as requesting network or getting location. However, please note that we must provide a timeline as quick as we can, to avoid possible performance issues.

## entries

Specify the date and context data for a snapshot, when timeline is predictable, we can provide many entries at the same time.

In an `entry`, we use `date` for the time when a snapshot will be displayed, and use `info` to carry some contextual information that can be retrieved in the `render` function.

> If no entry is provided, JSBox will generate a default entry using the current time.

## policy

Specify the reload policy, there are several ways to do this:

```js
$widget.setTimeline({
  policy: {
    atEnd: true
  }
});
```

This method reloads the timeline after all entries are used.

```js
$widget.setTimeline({
  policy: {
    afterDate: aDate
  }
});
```

This method reloads the timeline with an expiration date called `afterDate`.

```js
$widget.setTimeline({
  policy: {
    never: true
  }
});
```

This methods marks the timeline as static, it won't be updated periodically.

Note that, the above strategy is just "suggestions" to the system, the system does not guarantee that the reload will be done. To prevent the system from filtering out aggressive updates, please design a moderate strategy to ensure the experience.

> Without providing `entries` and `policy`, JSBox provides a default implementation of an hourly refresh for each script.

## render

Upon reaching the time specified in each entry, the system will call the above `render` function, where our code returns a JSON data to describe the view.

```js
$widget.setTimeline({
  render: ctx => {
    return {
      type: "text",
      props: {
        text: "Hello, World!"
      }
    }
  }
});
```

This code shows a "Hello, World!" on the widget, we will go into more detail about the syntax later.

`ctx` contains the context to get some environmental information including entry:

```js
$widget.setTimeline({
  render: ctx => {
    const entry = ctx.entry;
    const family = ctx.family;
    const displaySize = ctx.displaySize;
    const isDarkMode = ctx.isDarkMode;
  }
});
```

Where `family` represents the type of the widget, and the values from 0 to 2 represent the three layouts: small, medium and large. `displaySize` reflects the current display size of the widget.

With these values, we can dynamically decide what view to return to the system.

## Default Implementation

When your script doesn't need to be refreshed, or the default refresh strategy is sufficient, you can simply provide a render function.

```js
$widget.setTimeline(ctx => {

});
```

As a result, JSBox will automatically create entries and set the policy to refresh every hour.

# In-app Preview

During development, when `$widget.setTimeline` is called from within the main app, a preview of the widget is opened. Three sizes are supported, and the first entry is fixed to be displayed in the timeline.

To apply the script to your actual home screen, please refer to the aforementioned setup method.

# Best Practice for Network Requests

To read data asynchronously, you can send network requests before calling `setTimeline`. Due to limitations of the timeline mechanism, we may not be able to implement the classic caching logic of first showing the cache, then fetching new data, and then refreshing the UI.

However, network requests are likely to fail, in that case, it is better to show cached content instead of an error. To achieve that, here is a suggested workflow we recommend:

```js
async function fetch() {
  const cache = readCache();
  const resp1 = await $http.get();
  if (failed(resp1)) {
    return cache;
  }

  const resp2 = await $http.download();
  if (failed(resp2)) {
    return cache;
  }

  const data = resp2.data;
  if (data) {
    writeCache(data);
  }

  return data;
}

const data = await fetch();
```

Then use `data` to build the timeline, so that there are always contents in the widget, even though it may not be up to date.

For a complete example, please refer to: https://github.com/cyanzhong/jsbox-widgets/blob/master/xkcd.js
```

## docs/en/home-widget/views.md

```markdown
# View

Compared to the `$ui.render` function, which supports a rich set of views, the widget supports a very limited set of view types.

Also, `$ui.render` is based on the UIKit, while `$widget.setTimeline` is based on the SwiftUI. Even though we designed a similar syntax for the widget, the differences between the two UI technologies meant that prior knowledge could not be completely transferred.

# Syntax

For any kind of view, we define it using the following syntax:

```js
{
  type: "",
  props: {}, // or modifiers: []
  views: []
}
```

This is similar to `$ui.render` in that `type` specifies the type, `props` or `modifiers` specifies the properties, and `views` specifies its child views.

The difference is that in SwiftUI we no longer use a UIKit-like layout system, so we don't use `layout` anymore.

We will cover the layout system later, let's get started by introducing some visible views.

# type: "text"

This view is used to display a piece of non-editable text, similar to the `type: "label"` in `$ui.render`, and can be constructed as following ways:

```js
{
  type: "text",
  props: {
    text: "Hey"
  }
}
```

This method displays a piece of text directly using the `text` property.

```js
{
  type: "text",
  props: {
    date: new Date(),
    style: $widget.dateStyle.time
  }
}
```

This method uses `date` and `style` to display a time or date, style can be referred to [$widget.dateStyle](en/home-widget/method.md?id=widgetdatestyle)。

```js
{
  type: "text",
  props: {
    startDate: startDate,
    endDate: endDate
  }
}
```

The method uses `startDate` and `endDate` to display a time interval.

Properties supported by the text view: [bold](en/home-widget/modifiers.md?id=props-bold), [font](en/home-widget/modifiers.md?id=props-font), [lineLimit](en/home-widget/modifiers.md?id=props-linelimit), [minimumScaleFactor](en/home-widget/modifiers.md?id=props-minimumscalefactor)。

# type: "image"

Display an image, like the `type: image` in `$ui.render`, and can be constructed in the following ways:

```js
{
  type: "image",
  props: {
    image: $image("assets/icon.png"),
    // data: $file.read("assets/icon.png")
  }
}
```

This method uses JSBox's existing APIs to provide `image` or `data` objects.

```js
{
  type: "image",
  props: {
    symbol: "trash",
    resizable: true
  }
}
```

This method uses [SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols/) to display an icon.

Since SF Symbols is essentially fonts, you can also specify font size and weight:

```js
{
  type: "image",
  props: {
    symbol: {
      glyph: "trash",
      size: 64, // Default: 24
      weight: "medium" // Default: "regular" Values: ultraLight, thin, light, regular, medium, semibold, bold, heavy, black
    },
    resizable: true
  }
}
```

```js
{
  type: "image",
  props: {
    path: "assets/icon.png"
  }
}
```

This method uses the file path directly to set the image content.

```js
{
  type: "image",
  props: {
    uri: "https://..."
  }
}
```

This method can use either an online image address, or an image string in base64 format.

Properties supported by the image view: [resizable](en/home-widget/modifiers.md?id=props-resizable), [scaledToFill](en/home-widget/modifiers.md?id=props-scaledtofill), [scaledToFit](en/home-widget/modifiers.md?id=props-scaledtofit), [accessibilityHidden](en/home-widget/modifiers.md?id=props-accessibilityhidden), [accessibilityLabel](en/home-widget/modifiers.md?id=props-accessibilitylabel), [accessibilityHint](en/home-widget/modifiers.md?id=props-accessibilityhint)。

# type: "color"

In home screen widgets, a color can be a view, or a property of other views, it can be constructed in the following ways:

```js
{
  type: "color",
  props: {
    color: "#00EEEE"
  }
}
```

This methods creates a color using hex value.

```js
{
  type: "color",
  props: {
    light: "#00EEEE",
    dark: "#EE00EE"
  }
}
```

This methods provides both colors for `light` mode and `dark` mode.

```js
{
  type: "color",
  props: {
    color: $color("red")
  }
}
```

This methods uses the existing `$color` function provided by JSBox.

# type: "gradient"

Create a linear gradient effect, E.g.:

```js
{
  type: "gradient",
  props: {
    startPoint: $point(0, 0), // {"x": 0, "y": 0}
    endPoint: $point(0, 1), // {"x": 0, "y": 1}
    // locations: [0, 1],
    colors: [
      $color("#f9d423", "#4CA1AF"),
      $color("#ff4e50", "#2C3E50"),
    ]
  }
}
```

Use `startPoint` and `endPoint` to specify the start and end points, and `colors` and `locations` to determine the color and position of each gradient section. Note: if `locations` is specified, it must be equal in number to `colors`.

# type: "divider"

Create a divider, E.g.:

```js
{
  type: "divider",
  props: {
    background: $color("blue")
  }
}
```
```

## docs/en/keyboard/method.md

```markdown
# Scripts on Keyboard

Since v1.12.0, JSBox supports design a keyboard extension with JavaScript, you can create a plugin to improve editing experience.

There's no need to understand how it works, you just leverage abilities of `$keyboard`

Here are two examples for demonstrating how to build a keyboard plugin: 

https://github.com/cyanzhong/xTeko/tree/master/extension-demos/keyboard

[Try it out](https://xteko.com/redir?url=https://github.com/cyanzhong/xTeko/raw/master/extension-demos/keyboard.box)

https://github.com/cyanzhong/xTeko/tree/master/extension-demos/emoji-key

[Try it out](https://xteko.com/redir?url=https://github.com/cyanzhong/xTeko/raw/master/extension-demos/emoji-key.box)

# $keyboard.insert(string)

Insert a string into current editing context:

```js
$keyboard.insert("Hey!")
```

# $keyboard.delete()

Delete selected text or delete backward:

```js
$keyboard.delete()
```

# $keyboard.moveCursor(number)

Move cursor by an offset:

```js
$keyboard.moveCursor(5)
```

# $keyboard.playInputClick()

Play sound effect of keyboard clicking:

```js
$keyboard.playInputClick()
```

# $keyboard.hasText

Check whether current input context has text:

```js
const hasText = $keyboard.hasText;
```

# $keyboard.selectedText

Get current selected text (iOS 11 only):

```js
const selectedText = $keyboard.selectedText;
```

# $keyboard.textBeforeInput

Get text before input:

```js
const textBeforeInput = $keyboard.textBeforeInput;
```

# $keyboard.textAfterInput

Get text after input:

```js
const textAfterInput = $keyboard.textAfterInput;
```

# $keyboard.getAllText(handler)

Get all text (iOS 11 only):

```js
$keyboard.getAllText(text => {

});
```

# $keyboard.next()

Switch to next keyboard:

```js
$keyboard.next()
```

# $keyboard.send()

Simulate send action in the keyboard:

```js
$keyboard.send()
```

# $keyboard.dismiss()

Dismiss the keyboard:

```js
$keyboard.dismiss()
```

# $keyboard.barHidden

Whether hides the bottom bar, this is a configuration, you should use it before the UI starts.

Please note, above APIs are only available for keyboard, if you try it on other environments, it will raise an error.

# $keyboard.height

Get or set keyboard height:

```js
let height = $keyboard.height;

$keyboard.height = 500;
```
```

## docs/en/keyboard/privacy.md

```markdown
# Privacy Policy

JSBox won't track user inputs, will never upload to our server, or even save it locally.

To make sure scripts work correctly, you may need to "**Allow Full Access**":

When "Allow Full Access" is off, there are many restrictions:

- Unable to access network
- Unable to access location
- Unable to access clipboard
- Unable to access iCloud
- Unable to get settings from app

Please consider allow full access on your behalf, but we have to say, even allow full access is on, we won't use any technical measures to manipulate user inputs.

Please be confident with our products.
```

## docs/en/media/audio.md

```markdown
> JSBox can play simple audio, for example a keyboard clicked sound

# $audio.play(object)

Use sound id:

```js
// Use sound id
$audio.play({
  id: 1000
})
```

Refer https://github.com/TUNER88/iOSSystemSoundsLibrary to learn more about system sounds.

```js
// Play remote audio
$audio.play({
  url: "https://"
})
```

```js
// Play local audio
$audio.play({
  path: "audio.wav"
})
```

```js
// Pause audio track
$audio.pause()
```

```js
// Resume audio track
$audio.resume()
```

```js
// Stop audio track
$audio.stop()
```

```js
// Seek to a position (in seconds)
$audio.seek(60)
```

```js
// Get current status
const status = $audio.status;
// 0: paused, 1: waiting, 2: playing
```

```js
// Get duration
const duration = $audio.duration;
```

```js
// Get current time
const offset = $audio.offset;
```

# Events

You can observe some events during play an audio track:

```js
$audio.play({
  events: {
    itemEnded: function() {},
    timeJumped: function() {},
    didPlayToEndTime: function() {},
    failedToPlayToEndTime: function() {},
    playbackStalled: function() {},
    newAccessLogEntry: function() {},
    newErrorLogEntry: function() {},
  }
})
```

Refer: https://developer.apple.com/documentation/avfoundation/avplayeritem?language=objc
```

## docs/en/media/imagekit.md

```markdown
# Image Processing

JSBox 2.1.0 brings `$imagekit` module for image processing, you can achieve many effects easily:

- Resize
- Rotate
- Grayscale
- Masking
...

In order to make it easier to understand, we created a demo project that uses all APIs: https://github.com/cyanzhong/jsbox-imagekit

# $imagekit.render(options, handler)

Create an image with options and drawing actions callback:

```js
const options = {
  size: $size(100, 100),
  color: $color("#00FF00"),
  // scale: default to screen scale
  // opaque: default to false
}

const image = $imagekit.render(options, ctx => {
  const centerX = 50;
  const centerY = 50;
  const radius = 25;
  ctx.fillColor = $color("#FF0000");
  ctx.moveToPoint(centerX, centerY - radius);
  for (let i = 1; i < 5; ++i) {
    const x = radius * Math.sin(i * Math.PI * 0.8);
    const y = radius * Math.cos(i * Math.PI * 0.8);
    ctx.addLineToPoint(x + centerX, centerY - y);
  }
  ctx.fillPath();
});
```

`ctx` works exactly the same as `canvas`, refer to [canvas](en/component/canvas.md) documentation.

# $imagekit.info(image)

Get image information:

```js
const info = $imagekit.info(source);
// width, height, orientation, scale, props
```

# $imagekit.grayscale(image)

Get grayscaled image:

```js
const output = $imagekit.grayscale(source);
```

# $imagekit.invert(image)

Invert colors:

```js
const output = $imagekit.invert(source);
```

# $imagekit.sepia(image)

Apply sepia filter:

```js
const output = $imagekit.sepia(source);
```

# $imagekit.adjustEnhance(image)

Enhance image automatically:

```js
const output = $imagekit.adjustEnhance(source);
```

# $imagekit.adjustRedEye(image)

Red-eye adjustment:

```js
const output = $imagekit.adjustRedEye(source);
```

# $imagekit.adjustBrightness(image, value)

Adjust brightness:

```js
const output = $imagekit.adjustBrightness(source, 100);
// value range: (-255, 255)
```

# $imagekit.adjustContrast(image, value)

Adjust contrast:

```js
const output = $imagekit.adjustContrast(source, 100);
// value range: (-255, 255)
```

# $imagekit.adjustGamma(image, value)

Adjust gamma value:

```js
const output = $imagekit.adjustGamma(source, 4);
// value range: (0.01, 8)
```

# $imagekit.adjustOpacity(image, value)

Adjust opacity:

```js
const output = $imagekit.adjustOpacity(source, 0.5);
// value range: (0, 1)
```

# $imagekit.blur(image, bias)

Apply gaussian blur:

```js
const output = $imagekit.blur(source, 0);
```

# $imagekit.emboss(image, bias)

Emboss effect:

```js
const output = $imagekit.emboss(source, 0);
```

# $imagekit.sharpen(image, bias)

Sharpen:

```js
const output = $imagekit.sharpen(source, 0);
```

# $imagekit.unsharpen(image, bias)

Unsharpen:

```js
const output = $imagekit.unsharpen(source, 0);
```

# $imagekit.detectEdge(source, bias)

Edge detection:

```js
const output = $imagekit.detectEdge(source, 0);
```

# $imagekit.mask(image, mask)

Crop an image with `mask`:

```js
const output = $imagekit.mask(source, mask);
```

# $imagekit.reflect(image, height, fromAlpha, toAlpha)

Create an up-down reflected image, from `height` position, change alpha value from `fromAlpha` to `toAlpha`:

```js
const output = $imagekit.reflect(source, 100, 0, 1);
```

# $imagekit.cropTo(image, size, mode)

Crop an image:

```js
const output = $imagekit.cropTo(source, $size(100, 100), 0);
// mode:
//   - 0: top-left
//   - 1: top-center
//   - 2: top-right
//   - 3: bottom-left
//   - 4: bottom-center
//   - 5: bottom-right
//   - 6: left-center
//   - 7: right-center
//   - 8: center
```

# $imagekit.scaleBy(image, value)

Resize an image with scale:

```js
const output = $imagekit.scaleBy(source, 0.5);
```

# $imagekit.scaleTo(image, size, mode)

Resize an image to a specific size:

```js
const output = $imagekit.scaleTo(source, $size(100, 100), 0);
// mode:
//   - 0: scaleFill
//   - 1: scaleAspectFit
//   - 2: scaleAspectFill
```

# $imagekit.scaleFill(image, size)

Resize an image using `scaleFill` mode:

```js
const output = $imagekit.scaleFill(source, $size(100, 100));
```

# $imagekit.scaleAspectFit(image, size)

Resize an image using `scaleAspectFit` mode:

```js
const output = $imagekit.scaleAspectFit(source, $size(100, 100));
```

# $imagekit.scaleAspectFill(image, size)

Resize an image using `scaleAspectFill` mode:

```js
const output = $imagekit.scaleAspectFill(source, $size(100, 100));
```

# $imagekit.rotate(image, radians)

Rotate an image (it may change the size):

```js
const output = $imagekit.rotate(source, Math.PI * 0.25);
```

# $imagekit.rotatePixels(image, radians)

Rotate an image (keeps the image size, some contents might be clipped):

```js
const output = $imagekit.rotatePixels(source, Math.PI * 0.25);
```

# $imagekit.flip(image, mode)

Flip an image:

```js
const output = $imagekit.flip(source, 0);
// mode:
//   - 0: vertically
//   - 1: horizontally
```

# $imagekit.concatenate(images, space, mode)

Concatenate images with space:

```js
const output = $imagekit.concatenate(images, 10, 0);
// mode:
//   - 0: vertically
//   - 1: horizontally
```

# $imagekit.combine(image, mask, mode)

Add `mask` directly on `image`:

```js
const output = $imagekit.combine(image1, image2, mode);
// mode:
//   - 0: top-left
//   - 1: top-center
//   - 2: top-right
//   - 3: bottom-left
//   - 4: bottom-center
//   - 5: bottom-right
//   - 6: left-center
//   - 7: right-center
//   - 8: center (default)
//   - $point(x, y): absolute position
```

# $imagekit.rounded(image, radius)

Get an image with rounded corners:

```js
const output = $imagekit.rounded(source, 10);
```

# $imagekit.circular(image)

Get a circular image, it will be centered and clipped if the source image isn't a square:

```js
const output = $imagekit.circular(source);
```

# $imagekit.extractGIF(data) -> Promise

Extract GIF data to frames:

```js
const {images, durations} = await $imagekit.extractGIF(data);
// image: all image frames
// durations: duration for each frame
```

# $imagekit.makeGIF(source, options) -> Promise

Make GIF with image array or video data:

```js
const images = [image1, image2];
const options = {
  durations: [0.5, 0.5],
  // size: 16, 12, 8, 4, 2
}
const data = await $imagekit.makeGIF(images, options);
```

You can also use `duration` instead of `durations`, it makes the duration of each frame are the same.

# $imagekit.makeVideo(source, options) -> Promise

Make video with image array or GIF data:

```js
const images = [image1, image2];
const data = await $imagekit.makeVideo(images, {
  durations: [0.5, 0.5]
});
```

You can also use `duration` instead of `durations`, it makes the duration of each frame are the same, GIF data doesn't require durations.
```

## docs/en/media/pdf.md

```markdown
> Create PDF documents with simple API

# $pdf.make(object)

Here is an example:

```js
$pdf.make({
  html: "<p>Hello, World!</p><h1 style='background-color: red;'>xTeko</h1>",
  handler: function(resp) {
    const data = resp.data;
    if (data) {
      $share.sheet(["sample.pdf", data])
    }
  }
})
```

Or, create PDF with images:

```js
let {data} = await $pdf.make({"images": images});
```

We could specify the `pageSize`:

```js
$pdf.make({
  url: "https://github.com",
  pageSize: $pageSize.A5,
  handler: function(resp) {
    const data = resp.data;
    if (data) {
      $share.sheet(["sample.pdf", data])
    }
  }
})
```

To understand how `$pageSize` works, please refer to: http://en.wikipedia.org/wiki/Paper_size.

# $pdf.toImages(data)

Render PDF as an image array:

```js
const images = $pdf.toImages(pdf);
```

# $pdf.toImage(data)

Render PDF as a single image:

```js
const image = $pdf.toImage(pdf);
```
```

## docs/en/media/photo.md

```markdown
> JSBox provided a series of APIs to interact with photos

# $photo.take(object)

Take a photo with camera:

```js
$photo.take({
  handler: function(resp) {
    const image = resp.image;
  }
})
```

Param | Type | Description
---|---|---
edit | boolean | edit image after picked
mediaTypes | array | media types
maxDuration | number | max duration of video
quality | number | quality
showsControls | boolean | shows controls
device | number | front/rear camera
flashMode | number | flash mode

Refer [Constant](en/data/constant.md) to see how constant works.

# $photo.pick(object)

Pick a photo from photo library:

```js
$photo.pick({
  handler: function(resp) {
    const image = resp.image;
  }
})
```

All parameters are same as `$photo.take`, they are just have different source type.

Unlike the `take` method, `pick` allows you to choose the return data type:

Param | Type | Description
---|---|---
format | string | "image" or "data", default is "image"

Besides, we can set `multi: true` to pick multiple photos, and `selectionLimit` for maximum number of selections, the result list is like:

Prop | Type | Description
---|---|---
status | bool | success
results | array | all images

The structure of an object in result (when format is `image`):

Prop | Type | Description
---|---|---
image | image | image object
metadata | object | metadata
filename | string | file name

The structure of an object in result (when format is `data`):

Prop | Type | Description
---|---|---
data | data | image file
metadata | object | metadata
filename | string | file name

# $photo.prompt(object)

Ask user take a photo or pick a photo:

```js
$photo.prompt({
  handler: function(resp) {
    const image = resp.image;
  }
})
```

# Get metadata of photo

We can retrieve metadata from a photo:

```js
$photo.pick({
  handler: function(resp) {
    const metadata = resp.metadata;
    if (metadata) {
      const gps = metadata["{GPS}"];
      const url = `https://maps.apple.com/?ll=${gps.Latitude},${gps.Longitude}`;
      $app.openURL(url)
    }
  }
})
```

It gets the GPS information, open it in Maps.

# $photo.scan()

Open documentation camera (iOS 13 only):

```js
const response = await $photo.scan();
// response.status, response.results
```

# $photo.save(object)

Save a photo to photo library:

```js
// data
$photo.save({
  data,
  handler: function(success) {

  }
})
```

```js
// image
$photo.save({
  image,
  handler: function(success) {

  }
})
```

# $photo.fetch(object)

Fetch photos from photo library:

```js
$photo.fetch({
  count: 3,
  handler: function(images) {

  }
})
```

There are some parameters to make fetch operation more accurate:

Param | Type | Description
---|---|---
type | number | type
subType | number | sub type
format | string | "image" or "data", default is "image"
size | $size | image size, default to raw size
count | number | fetch limit

# $photo.delete(object)

Delete photos in photo library:

```js
$photo.delete({
  count: 3,
  handler: function(success) {

  }
})
```

The parameters are same as `$photo.fetch`.

# Convert image object to binary data

We could convert image object to PNG or JPEG data:

```js
// PNG
const png = image.png;
// JPEG
const jpg = image.jpg(0.8);
```

There is a number (0.0 ~ 1.0) means jpeg compress quality.
```

## docs/en/media/quicklook.md

```markdown
# $quicklook

iOS has a builtin previewer to open files, a lot of file formats are supported.

This is very useful, we can use it to open office files, PDFs, and much more.

We can use it through url:

```js
$quicklook.open({
  url: "",
  handler: function() {
    // Handle dismiss action, optional
  }
})
```

Binary data:

```js
$quicklook.open({
  type: "jpg",
  data
})
```

Image object:

```js
$quicklook.open({
  image
})
```

Plain text:

```js
$quicklook.open({
  text: "Hello, World!"
})
```

JSON object:

```js
$quicklook.open({
  json: "{\"a\": [1, 2, true]}"
})
```

HTML contents:

```js
$quicklook.open({
  html: "<p>HTML</p>"
})
```

Or, a content list (they should be same type, either file or url):

```js
$quicklook.open({
  list: ["", "", ""]
})
```

Please note, we can set `type` to indicate the file type, it's optional, but it's better to have one.
```

## docs/en/network/server.md

```markdown
# $server

You can create a simple web server with $http.startServer, it creates a http server with standard html template.

If you want to create a server with custom request handlers, you can use $server APIs:

```js
const server = $server.new();

const options = {
  port: 6060, // Required
  bonjourName: "", // Optional
  bonjourType: "", // Optional
};

server.start(options);
```

# $server.start(object)

Start a simple HTTP server:

```js
const server = $server.start({
  port: 6060,
  path: "assets/website",
  handler: () => {
    $app.openURL("http://localhost:6060/index.html");
  }
});
```

# server.stop()

Stop the web server.

# server.listen(events)

Observer server events:

```js
server.listen({
  didStart: server => {
    $delay(1, () => {
      $app.openURL(`http://localhost:${port}`);
    });
  },
  didConnect: server => {},
  didDisconnect: server => {},
  didStop: server => {},
  didCompleteBonjourRegistration: server => {},
  didUpdateNATPortMapping: server => {}
});
```

# server.addHandler(object)

Register a request handler:

```js
const handler = {};

// Handler filter
handler.filter = rules => {
  const method = rules.method;
  const url = rules.url;
  // rules.headers, rules.path, rules.query;
  return "data"; // default, data, file, multipart, urlencoded
}

// Handler response
handler.response = request => {
  const method = request.method;
  const url = request.url;
  return {
    type: "data", // default, data, file, error
    props: {
      html: "<html><body style='font-size: 300px'>Hello!</body></html>"
      // json: {
      //   "status": 1,
      //   "values": ["a", "b", "c"]
      // }
    }
  };
}

// Handler async response
handler.asyncResponse = (request, completion) => {
const method = request.method;
  const url = request.url;
  completion({
    type: "data", // default, data, file, error
    props: {
      html: "<html><body style='font-size: 300px'>Hello!</body></html>"
      // json: {
      //   "status": 1,
      //   "values": ["a", "b", "c"]
      // }
    }
  });
}
```

 # handler.filter

 filter is a function, it passes rules as the parameter, you should return the type of request for it. Rules:

```json
{
  "method": "",
  "url": "",
  "headers": {

  },
  "path": "",
  "query": {

  }
}
```

Types include: `default`, `data`, `file`, `multipart`, `urlencoded`.

Starting from v1.51.0, you can also return an object that overrides the original rules:

```js
handler.filter = rules => {
  return {
    "type": "data",
    "method": "GET"
  }
}
```

You probably need this if you want to redirect a request, or change a `POST` method to `GET`, etc.

# handler.response

Response function passes request as the parameter, you should return a response for it:

```js
{
  type: "data",
  props: {
    html: "<html><body style='font-size: 300px'>Hello!</body></html>"
  }
}
```

Response type can be: `default`, `data`, `file`, it initiates response with different props.

`data` response can be created with `html`, `text` or `json` parameter. `file` response can be created with `path` parameter.

Other parameters:

Prop | Type | Description
---|---|---
contentType | string | content type
contentLength | number | content length
statusCode | number | status code
cacheControlMaxAge | number | cache control max age
lastModifiedDate | Date | last modified date
eTag | string | E-Tag
gzipEnabled | bool | gzip enabled
headers | object | HTTP headers

# server.clearHandlers()

Remove all registered handlers.

For detailed example, refer to: https://github.com/cyanzhong/xTeko/blob/master/extension-demos/server.js

Request and Response are complicated objects, please take a look [Detailed Docs](en/object/server.md).
```

## docs/en/network/socket.md

```markdown
# WebSocket

JSBox provides [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) like interfaces, it creates socket connection between client and server.

# $socket.new(object)

Create a new socket connection:

```js
const socket = $socket.new("wss://echo.websocket.org");
```

You can specify some parameters:

```js
const socket = $socket.new({
  url: "wss://echo.websocket.org",
  protocols: [],
  allowsUntrustedSSLCertificates: true
});
```

# socket.listen(object)

Observe socket events:

```js
socket.listen({
  didOpen: (sock) => {
    console.log("Websocket Connected");
  },
  didFail: (sock, error) => {
    console.error(`:( Websocket Failed With Error: ${error}`);
  },
  didClose: (sock, code, reason, wasClean) => {
    console.log("WebSocket closed");
  },
  didReceiveString: (sock, string) => {
    console.log(`Received: ${string}`);
  },
  didReceiveData: (sock, data) => {
    console.log(`Received: ${data}`);
  },
  didReceivePing: (sock, data) => {
    console.log("WebSocket received ping");
  },
  didReceivePong: (sock, data) => {
    console.log("WebSocket received pong");
  }
});
```

# socket.open()

Open WebSocket.

# socket.close(object)

Close WebSocket.

```js
socket.close({
  code: 1000, // Optional, see: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
  reason: "reason", // Optional
});
```

# socket.send(object)

Send content:

```js
const object = socket.send("Message");
const result = object.result;
const error = object.error;
```

You can also use data:

```js
socket.send({
  data,
  noCopy: true, // Optional
});
```

# socket.ping(data)

```js
const object = socket.ping(data);
const result = object.result;
const error = object.error;
```

# socket.readyState

Get ready state:

```js
const readyState = socket.readyState;
// 0: connecting, 1: open, 2: closing, 3: closed
```

For detailed example: https://github.com/cyanzhong/xTeko/blob/master/extension-demos/socket.js
```

## docs/en/object/calendar-item.md

```markdown
# calendarItem

`calendarItem` is used on `$calendar` APIs:

Prop | Type | Read/Write | Description
---|---|---|---
title | string | rw | title
location | string | rw | location
notes | string | rw | notes
url | string | rw | url
allDay | bool | rw | is all day event
startDate | date | rw | start date
endDate | date | rw | end date
status | number | r | status
eventIdentifier | string | r | event identifier
creationDate | date | r | creation date
modifiedDate | date | r | last modified date
```

## docs/en/object/color.md

```markdown
# color

`color` represents a color, it can be generated by `$color(hex)`:

```js
const color = $color("#00eeee");
```

# color.hexCode

Returns hex code of a color:

```js
const hexCode = color.hexCode;
// -> "#00eeee"
```

# color.components

Returns RGB values of a color:

```js
const components = color.components;
const red = components.red;
const green = components.green;
const blue = components.blue;
const alpha = components.alpha;
```
```

## docs/en/object/contact.md

```markdown
# contact

`contact` is used on `$contact` APIs:

Prop | Type | Read/Write | Description
---|---|---|---
identifier | string | r | identifier
content | string | r | content
contactType | number | r | type
namePrefix | string | rw | name prefix
givenName | string | rw | given name
middleName | string | rw | middle name
familyName | string | rw | family name
nameSuffix | string | rw | name suffix
nickname | string | rw | nick name
organizationName | string | rw | organization name
departmentName | string | rw | department name
jobTitle | string | rw | job title
note | string | rw | note
imageData | data | rw | avatar image data
phoneNumbers | array | rw | phone numbers
emailAddresses | array | rw | email addresses
postalAddresses | array | rw | postal addresses
urlAddresses | array | rw | url addresses
instantMessageAddresses | array | rw | instant message addresses

# group

`group` is object that returned from `$contact.fetchGroup`:

Prop | Type | Read/Write | Description
---|---|---|---
identifier | string | r | identifier
name | string | rw | name
```

## docs/en/object/data.md

```markdown
# data

`data` means a binary file:

Prop | Type | Read/Write | Description
---|---|---|---
info | object | r | metadata
string | string | r | convert to utf-8 string
byteArray | [number] | r | convert to byte array
image | image | r | convert to image object
fileName | string | r | possible file name
gzipped | $data | r | get gzipped data
gunzipped | $data | r | get gunzipped data
isGzipped | bool | r | check whether is a gzip file
```

## docs/en/object/error.md

```markdown
# error

`error` indicates an error message:

Prop | Type | Read/Write | Description
---|---|---|---
domain | string | r | domain
code | number | r | code
userInfo | object | r | user info
localizedDescription | string | r | localized description
localizedFailureReason | string | r | localized failure reason
localizedRecoverySuggestion | string | r | localized recovery suggestion
```

## docs/en/object/image.md

```markdown
# image

`image` means a bitmap in memory:

Prop | Type | Read/Write | Description
---|---|---|---
size | $size | r | size
orientation | number | r | orientation
info | object | r | metadata
scale | number | r | scale
png | data | r | png format data

# alwaysTemplate

Returns a new image with the `template` rendering image, it can be used with `tintColor` to change the image color:

```js
{
  type: "image",
  props: {
    tintColor: $color("red"),
    image: rawImage.alwaysTemplate
  }
}
```

The ahove `rawImage` is the original image you have.

# alwaysOriginal

It's similar to `alwaysTemplate`, but it returns an image with the `original` rendering mode, `tintColor` will be ignored.

# resized($size)

Returns a resized image:

```js
const resized = image.resized($size(100, 100));
```

# jpg(number)

Returns a data with jpeg format, the number means compress quality (0 ~ 1):

```js
const jpg = image.jpg(0.8);
```

# colorAtPixel($point)

Get color at a pixel:

```js
const color = image.colorAtPixel($point(0, 0));
const hexCode = color.hexCode;
```

# averageColor

Get average color of image:

```js
const avgColor = image.averageColor;
```

# orientationFixedImage

Get orientation fixed image:

```js
const fixedImage = image.orientationFixedImage;
```
```

## docs/en/object/index-path.md

```markdown
# indexPath

In `list` or `matrix` controls, indexPath indicates the position of an item:

Prop | Type | Read/Write | Description
---|---|---|---
section | number | rw | section
row | number | rw | row
item | number | rw | equals to `row`, usually use on `matrix`
```

## docs/en/object/navigation-action.md

```markdown
# navigationAction

`navigationAction` is used on `web` views:

Prop | Type | Read/Write | Description
---|---|---|---
type | number | r | type
sourceURL | string | r | source url
targetURL | string | r | target url
requestURL | string | r | request url
```

## docs/en/object/reminder-item.md

```markdown
# reminderItem

`reminderItem` is used on `$reminder` APIs:

Prop | Type | Read/Write | Description
---|---|---|---
title | string | rw | title
location | string | rw | location
notes | string | rw | notes
url | string | rw | url
priority | number | rw | priority
completed | bool | rw | is completed
completionDate | date | r | completion date
alarmDate | date | rw | alarm date
creationDate | date | r | creation date
modifiedDate | date | r | last modified date
```

## docs/en/object/response.md

```markdown
# response

`response` is the response object when we handle http requests:

```js
$http.get({
  url: "",
  handler: function(resp) {
    const response = resp.response;
  }
})
```

Prop | Type | Read/Write | Description
---|---|---|---
url | string | r | url
MIMEType | string | r | MIME type
expectedContentLength | number | r | expected content length (bytes)
textEncodingName | string | r | text encoding
suggestedFilename | string | r | suggested file name
statusCode | number | r | HTTP status code
headers | object | r | HTTP header
```

## docs/en/object/result-set.md

```markdown
# ResultSet

`ResultSet` is returned from a SQLite query:

```js
db.query("SELECT * FROM USER", (rs, err) => {
  while (rs.next()) {

  }
  rs.close();
});
```

Prop | Type | Read/Write | Description
---|---|---|---
query | string | r | SQL Query
columnCount | number | r | column count
values | object | r | all values

# next()

Move to next result.

# close()

Close result set.

# indexForName(string)

Get index for a column name.

# nameForIndex(number)

Get name for a column index.

# get(object)

Get value for a name or index.

# isNull(object)

Check whether null for a name or index.
```

## docs/en/object/server.md

```markdown
# request

Prop | Type | Read/Write | Description
---|---|---|---
method | string | r | http method
url | string | r | url
headers | json | r | http headers
path | string | r | path
query | json | r | query
contentType | string | r | Content-Type
contentLength | number | r | Content-Length
ifModifiedSince | date | r | If-Modified-Since
ifNoneMatch | bool | r | If-None-Match
acceptsGzip | bool | r | accepts Gzip encoding
localAddressData | data | r | local address data
localAddress | string | r | local address string
remoteAddressData | data | r | remote address data
remoteAddress | string | r | remote address string
hasBody | bool | r | has body
hasByteRange | bool | r | has byte range

# data request

data request contains all properties like request, these are special:

Prop | Type | Read/Write | Description
---|---|---|---
data | data | r | data
text | string | r | text
json | json | r | json

# file request

file request contains all properties like request, these are special:

Prop | Type | Read/Write | Description
---|---|---|---
temporaryPath | string | r | temporary file path

# multipart request

multipart request contains all properties like request, these are special:

Prop | Type | Read/Write | Description
---|---|---|---
arguments | array | r | arguments
files | array | r | files
mimeType | string | r | MIME Type

arguments properties:

Prop | Type | Read/Write | Description
---|---|---|---
controlName | string | r | control name
contentType | string | r | Content-Type
mimeType | string | r | MIME Type
data | data | r | data
string | string | r | string
fileName | string | r | file name
temporaryPath | string | r | temporary file path

# response

response is returned from handler.response:

Prop | Type | Read/Write | Description
---|---|---|---
redirect | string | rw | redirect url
permanent | bool | rw | permanent
statusCode | number | rw | http status code
contentType | string | rw | Content-Type
contentLength | string | rw | Content-Length
cacheControlMaxAge | number | rw | Cache-Control
lastModifiedDate | date | rw | Last-Modified
eTag | string | rw | ETag
gzipEnabled | bool | rw | gzip enabled
hasBody | bool | rw | has body

You can create a response like:

```js
return {
  type: "default",
  props: {
    statusCode: 404
  }
}
```

# data response

data response contains all properties like response, these are special:

Prop | Type | Read/Write | Description
---|---|---|---
text | string | rw | text
html | string | rw | html
json | json | rw | json

# file response

file response contains all properties like response, these are special:

Prop | Type | Read/Write | Description
---|---|---|---
path | string | rw | file path
isAttachment | bool | rw | is attachment
byteRange | range | rw | byte range
```

## docs/en/package/builtin.md

```markdown
# Built-in Modules

In order to make your life easier, JSBox has bundled some famous JavaScript modules:

- [underscore](https://underscorejs.org/)
- [moment](https://momentjs.com/)
- [crypto-js](https://github.com/brix/crypto-js)
- [cheerio](https://cheerio.js.org/)
- [lodash](https://lodash.com/)
- [ramba](https://ramdajs.com/)

These modules can be used with `require` directly, for instance:

```js
const lodash = require("lodash");
```

Please refer to their documentation, we don't want to be too verbose here.

If you want to use some other modules, you can bundle them with [browserify](http://browserify.org/). Generally, [CommonJS](https://en.wikipedia.org/wiki/CommonJS) modules that don't rely on native code are available.
```

## docs/en/package/install.md

```markdown
# Installation

There are tons of ways to install scripts:

- Share files to JSBox app
- Open file in Safari, launch action extension
- Use web server at the same Wi-Fi
- Use QRCode

If your desktop device is macOS, you can use AirDrop as the most cool way.

PS: All solutions above support `js/zip/box` formats.

# Package Sharing

When you share a package, there're 3 options:

- Share folder
- Share zip file
- Share box file

Share folder to desktop makes you easier to modify, it will be cool to work with VSCode.

Zip files are more likely being used on SNS, box files are basically zip files with `.box` path extensions.
```

## docs/en/package/intro.md

```markdown
# JSBox Package

Starting from `v1.9.0`, JSBox supports both JavaScript file and package format.

There're so many advantages:

- Modularize code by multiple files, folders
- JSON file based configurations
- Built-in resources like images, audio files

# Format Design

JSBox Package is actually a zip file, any zip file including these structure will be considered as a package:

- **assets/** Resources folder
- **scripts/** Scripts folder
- **strings/** Localization strings folder
- **config.json** Configurations
- **main.js** The main entrance

Here's an example: https://github.com/cyanzhong/xTeko/tree/master/extension-demos/package

By the way, you can also generate a package template inside JSBox app.

# assets

Put the resource files of your app here, you can refer them by path like `assets/filename`.

These files could be used in `$file` related APIs, also it can be a `src` for image and button.

There's an `icon.png` inside by default, the icon of this app, you replace it with your own design.

For the spec of icon, please refer to: https://github.com/cyanzhong/xTeko/tree/master/extension-icons

# scripts

Put script files here, you can require them by syntax like `require('./scripts/utility')`, we will introduce modules soon.

You can also create sub-folders here, with this said you can manage your scripts gracefully.

# strings

This folder is designed for providing localizable strings, in other words, provide resource for `$l10n`:

- **en.strings** English
- **zh-Hans.strings** Simplified-Chinese

The pattern of a string file:

```
"OK" = "好的";
"DONE" = "完成";
"HELLO_WORLD" = "你好，世界！";
```

PS: If you're using `strings` files and `$app.strings` at the same time, the later one will be used.

# config.json

Currently this file including 2 parts, the `info` node represents metadata of the app, refer: [$addin](en/addin/method.md?id=addinlist).

The `settings` node provides some settings like `$app` provided formerly: [$app](en/foundation/app.md?id=appminsdkver)

We will add more settings here in near future.

# main.js

main.js is the main entrance of an app, we can load other scripts here:

```js
const app = require('./scripts/app');

app.sayHello();
```

We are gonna to talk about how it works.
```

## docs/en/package/module.md

```markdown
# require('path')

`require` is designed for modularizing a script, with its own namespace we can expose functions and variables correctly.

You can easily expose APIs with `module.exports`:

```js
function sayHello() {
  $ui.alert($l10n('HELLO_WORLD'));
}

module.exports = {
  sayHello
}
```

With the name `sayHello`, the function sayHello will be accessible to other scripts.

Here's how to require:

```js
const app = require('./scripts/app');

app.sayHello();
```

This mechanism separates all logic into multiple files, without naming conflicts.

Note: please use relative as you can, auto-completion system doesn't work with absolute path.

# $include('path')

Another way is `$include`, but this is totally different, this function just simply copy the code from another file, and execute it like `eval`.

With 2 solutions above, we can design our architecture better comparing to single file.
```

## docs/en/package/path.md

```markdown
# Path

Both absolute paths and relative paths are supported:

```js
const app = require('./scripts/app');
```

In require function, `.js` can be omitted, in above case it represents `scripts/app.js`.

You can use this pattern to access all folders inside current package.

# $file

How to access files:

```js
const file = $file.read('strings/zh-Hans.strings');
```

This code opens the file in `strings/zh-Hans.strings`.

In short, in package mode, the root path is the package folder.
```

## docs/en/package/vscode.md

```markdown
# VSCode

We provided VSCode for JSBox from very early version: https://marketplace.visualstudio.com/items?itemName=Ying.jsbox

It improves your experience to writing code for JSBox, and also provides real-time syncing for JSBox.

Starting from v0.0.6, JSBox can upload package to your device, as long as the folder looks like:

- **assets/**
- **scripts/**
- **strings/**
- **config.json**
- **main.js**

It archives the folder, upload to your iOS device, and run it automatically.
```

## docs/en/privacy.md

```markdown
## Privacy Policy

JSBox is an IDE for learning JavaScript on iOS, it aims to provide a safe sandbox for JavaScript executing, for educational purpose only.

This privacy policy applies to the iOS main app itself, its embedded frameworks and app extensions, and official examples we provided, but obviously not to scripts that you, the user, write yourself. Especially when using networking APIs, please be aware that other terms (of the API service provider) may apply.

JSBox is **not** designed to be a "platform" that allows you run arbitrary code, but rather as a learning environment for **your own** programs. In order to prevent malicious scripts, you are strongly encouraged to always check the code before running.

**Data Collected by JSBox**

In short, the JSBox app itself does not collect any data from you. Yes, we don't do any data tracking technology for "Growth Hacking" purpose, we don't even count how many users we have. We just want to provide a safe programming environment, and do not care how "success" we are, or how the app is being used by users.

But you should be careful about using some APIs that may request your data, such as location, calendar, and reminders. Especially when you are running a script that someone gave you, double-check it before running.

Other than that, please be confident about our service, all secrets stay on your device, we don't have control over it.

**Cookies**

Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.

JSBox does not use these "cookies" explicitly. However, the app may use third-party code or libraries that may collect cookies to improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device.

**Changes to This Privacy Policy**

We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.

**Contact Us**

If you have any questions or suggestions about my Privacy Policy, do not hesitate to contact us at log.e@qq.com.
```

## docs/en/promise/index.md

```markdown
# Method list

Here is a list to show you promise interfaces that supported by JSBox, we are using `required` to indicate the callback must be handled, which means you can use promise directly. And `optional` means the callback can be omitted, as a result you need to set `async: true` to use Promise style.

# $thread

API | Type
---|---
main | required
background | required

# $http

API | Type
---|---
request | required
get | required
post | required
download | required
upload | required
shorten | required
lengthen | required
startServer | required

# $push

API | Type
---|---
schedule | optional

# $drive

API | Type
---|---
save | required
open | required

# $cache

API | Type
---|---
setAsync | required
getAsync | required
removeAsync | required
clearAsync | required

# $photo

API | Type
---|---
take | required
pick | required
save | optional
fetch | required
delete | optional

# $input

API | Type
---|---
text | required
speech | required

# $ui

API | Type
---|---
animate | optional
alert | required
action | required
menu | required

# $message

API | Type
---|---
sms | optional
mail | optional

# $calendar

API | Type
---|---
fetch | required
create | optional
save | optional
delete | optional

# $reminder

API | Type
---|---
fetch | required
create | optional
save | optional
delete | optional

# $contact

API | Type
---|---
pick | required
fetch | required
create | optional
save | optional
delete | optional
fetchGroups | required
addGroup | optional
deleteGroup | optional
updateGroup | optional
addToGroup | optional
removeFromGroup | optional

# $location

API | Type
---|---
select | required

# $ssh

API | Type
---|---
connect | required

# $text

API | Type
---|---
analysis | required
tokenize | required
htmlToMarkdown | required

# $qrcode

API | Type
---|---
scan | required

# $pdf

API | Type
---|---
make | required

# $quicklook

API | Type
---|---
open | optional

# $safari

API | Type
---|---
open | optional

# $archiver

API | Type
---|---
zip | required
unzip | required

# $browser

API | Type
---|---
exec | required

# $picker

API | Type
---|---
date | required
data | required
color | required

# $keyboard

API | Type
---|---
getAllText | required
```

## docs/en/promise/intro.md

```markdown
# Promise

Promise is an elegant solution to resolve callback hell, please refer to Mozilla's doc to have a better understanding: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise

Of course you can use Promise in JSBox, but previously APIs that we provided don't support Promise style, for example:

```js
$http.get({
  url: 'https://docs.xteko.com',
  handler: function(resp) {
    const data = resp.data;
  }
})
```

You have to specify a handler to take next action, but since v1.15.0, you have better solution:

```js
$http.get({ url: 'https://docs.xteko.com' }).then(resp => {
  const data = resp.data;
})
```

This can save you from callback hell, or even better (>= iOS 10.3):

```js
var resp = await $http.get({ url: 'https://docs.xteko.com' })
var data = resp.data
```

Or, you can use a very handy shortcut:

```js
var resp = await $http.get('https://docs.xteko.com')
var data = resp.data
```

There are so many details in Promise, we don't want to go deep at here, but we recommend you this article: https://javascript.info/async

Overall, we provide Promise style for JSBox APIs.
```

## docs/en/promise/sample.md

```markdown
# Two different ways

We have 2 different ways to handle an asynchronous function:

- You can use Promise directly
- You need to specify `async: true` to indicate it's Promise call

That's really easy to understand, in short, in some cases like:

```js
$ui.menu({
  items: ["A", "B", "C"],
  handler: (title, index) => {

  }
})
```

If you popup a menu, it doesn't make sense to not handle it, so we treat this as a `must be handled` API, you can directly:

```js
var result = await $ui.menu({ items: ["A", "B", "C"] })
var title = result.title
var index = result.index
// Or: var result = await $ui.menu(["A", "B", "C"])
```

But in some other cases, the callback could be omitted, you can simply do nothing:

```js
$photo.delete({
  count: 3,
  screenshot: true,
  handler: success => {
    // It's OK to remove handler here
  }
})
```

In that case you need to specify async mode to use Promise:

```js
var success = await $photo.delete({
  count: 3,
  screenshot: true,
  async: true
})
```

If you don't do that, we will treat this as a normal call instead of Promise.

Also, not all APIs are async calls, some APIs are total sync call, for example:

```js
const success = $file.delete("sample.txt");
```

There's no need (and can't) to provide Promise API for that, we will have a checklist for each API soon.

# Some handy shortcuts

Once you use Promise, you may realize there is only a parameter, so it's not needed to wrap it as JSON:

```js
var resp = await $http.get('https://docs.xteko.com')
```

Remember these shortcuts can save your time:

```js
// Thread
await $thread.main(3)
await $thread.background(3)

// HTTP
var resp = await $http.get('https://docs.xteko.com')
var result = await $http.shorten("http://docs.xteko.com")

// UIKit
var result = await $ui.menu(["A", "B", "C"])

// Cache
var cache = await $cache.getAsync("key")
```
```

## docs/en/quickstart/intro.md

```markdown
# JavaScript

`JavaScript` is a powerful and flexible programming language, to read this document, we suppose you have basic knowledge of JavaScript.

> Resources
> - [w3schools.com](https://www.w3schools.com/js/)
> - [mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

# Similar Projects

JSBox is not alone, there are so many products can `run scripts`, JSBox is heavily inspired from them, for example `Editorial` and `Automator`, they can run script too.

But JSBox is not just a copycat of those projects, we based on `JavaScript` and provided a lot of simple APIs, let you interact with iOS much easier.

By the way, there're so many frameworks provide ability to: `render native UI with JavaScript`, for example `React Native` from Facebook and `Weex` from Alibaba, JSBox didn't leverage them, there are several reasons:

- React Native and Weex are design for cross-platform
- JSBox is designed to create iOS utilities
- JSBox has a simple goal: `Keep it simple and easy to learn`

The only thing you need to know is JavaScript, you don't need to understand what's MVVM, what's React...

# Basic Concept

- API starts with `$`, e.g. `$clipboard`
- Unlike `Cocoa`, JSBox API looks extremely short, because write code on mobile device is not easy
- Mostly, parameters are `JavaScript Object`, unless it's only one parameter
- Every script has its own environment, it's like a sandbox, it's safe

Above is the brief introduction, *I'm familiar with JavaScript, can't wait to see [Sample >](en/quickstart/sample.md).*
```

## docs/en/quickstart/sample.md

```markdown
> Introduce API design patterns with some simple examples, helps you have a general understanding

# Hello, World!

```js
// Show alert
$ui.alert("Hello, World!")
```

```js
// Log to console
console.info("Hello, World!")
```

# Preview Clipboard Text

```js
$ui.preview({
  text: JSON.stringify($clipboard.items)
})
```

# HTTP Request

```js
$http.get({
  url: 'https://docs.xteko.com',
  handler: function(resp) {
    const data = resp.data;
  }
})
```

# Create a button

```js
$ui.render({
  views: [
    {
      type: "button",
      props: {
        title: "Button"
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.width.equalTo(64)
      },
      events: {
        tapped: function(sender) {
          $ui.toast("Tapped")
        }
      }
    }
  ]
})
```

Just a simple tour, explanation is coming soon.
```

## docs/en/runtime/blocks.md

```markdown
# Objective-C Blocks

Block is a special type in Objective-C, it's very similar to closure in other languages. It works like a function, and it can capture variable outside the block, it can be a variable, a parameter, or even a return value.

Teach you Blocks isn't the goal of our document, you can read more at here: https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithBlocks/WorkingwithBlocks.html

Let's see how to implement Blocks in JSBox.

# $block

In JSBox you can use $block to declare a block, for example:

```js
const handler = $block("void, UITableViewRowAction *, NSIndexPath *", (action, indexPath) => {
  $ui.alert("Action")
});
```

That means you need to declare all types (including return value and all parameters) with a string, and pass a function as the block body.

If you implement this block in Objective-C, it would be:

```objc
void(^handler)(UITableViewRowAction *, NSIndexPath *) = ^(UITableViewRowAction *action, NSIndexPath *indexPath) {
  // Alert
};
```

Please don't forget the return value, otherwise it can't be recognized correctly.

Here's an example to create a TableView with only Runtime code:

```js
//-- Create window --//

$ui.render()

//-- Cell --//

$define({
  type: "TableCell: UITableViewCell"
})

//-- TableView --//

$define({
  type: "TableView: UITableView",
  events: {
    "init": function() {
      self = self.invoke("super.init")
      self.invoke("setTableFooterView", $objc("UIView").invoke("new"))
      self.invoke("registerClass:forCellReuseIdentifier:", $objc("TableCell").invoke("class"), "identifier")
      return self
    }
  }
})

//-- Manager --//

$define({
  type: "Manager: NSObject <UITableViewDelegate, UITableViewDataSource>",
  events: {
    "tableView:numberOfRowsInSection:": function(tableView, section) {
      return 5
    },
    "tableView:cellForRowAtIndexPath:": function(tableView, indexPath) {
      const cell = tableView.invoke("dequeueReusableCellWithIdentifier:forIndexPath:", "identifier", indexPath);
      cell.invoke("textLabel").invoke("setText", `Row: ${indexPath.invoke("row")}`)
      return cell
    },
    "tableView:didSelectRowAtIndexPath:": function(tableView, indexPath) {
      tableView.invoke("deselectRowAtIndexPath:animated:", indexPath, true)
      const cell = tableView.invoke("cellForRowAtIndexPath:", indexPath);
      const text = cell.invoke("textLabel.text").jsValue();
      $ui.alert(`Tapped: ${text}`)
    },
    "tableView:editActionsForRowAtIndexPath:": function(tableView, indexPath) {
      const handler = $block("void, UITableViewRowAction *, NSIndexPath *", (action, indexPath) => {
        $ui.alert("Action")
      });
      const action = $objc("UITableViewRowAction").invoke("rowActionWithStyle:title:handler:", 1, "Foobar", handler);
      return [action]
    }
  }
})

const window = $ui.window.ocValue();
const manager = $objc("Manager").invoke("new");

const table = $objc("TableView").invoke("new");
table.invoke("setFrame", window.invoke("bounds"))
table.invoke("setDelegate", manager)
table.invoke("setDataSource", manager)
window.invoke("addSubview", table)
```
```

## docs/en/runtime/c.md

```markdown
# $defc

In JSBox, call C functions is also possible, you can include a C function like:

```js
$defc("NSClassFromString", "Class, NSString *")
```

The first parameter is name of C function, the second parameter is a type list that describes all parameters.

After that you can use it:

```js
NSClassFromString("NSURL")
```

Also, for a C function like: `int func(void *ptr, NSObject *obj, float num)` you need to:

```js
$defc("func", "int, void *, NSObject *, float")
```

Note: struct and block are not supported yet.
```

## docs/en/runtime/define.md

```markdown
> We can create Objective-C class in JSBox at runtime

# $define(object)

Here is an example:

```js
$define({
  type: "MyHelper: NSObject",
  events: {
    instanceMethod: function() {
      $ui.alert("instance")
    },
    "indexPathForRow:inSection:": function(row, section) {
      $ui.alert(`row: ${row}, section: ${section}`)
    }
  },
  classEvents: {
    classMethod: function() {
      $ui.alert("class")
    }
  }
})
```

There are basically 3 parts:

- `type` The class name
- `events` All instance methods
- `classEvents` All class methods

Now you can use it this way:

```js
$objc("MyHelper").invoke("alloc.init").invoke("instanceMethod")
$objc("MyHelper").invoke("classMethod")
```

It works like a native class.

# $delegate(object)

In Runtime code, we often create delegate instances, you can do that with $delegate function:

```js
const textView = $objc("UITextView").$new();
textView.$setDelegate($delegate({
  type: "UITextViewDelegate",
  events: {
    "textViewDidChange:": sender => {
      console.log(sender.$text().jsValue());
    }
  }
}));
```

It creates an anonymous delegate instance automatically, with the similar parameters like $define.
```

## docs/en/runtime/intro.md

```markdown
# Basic Concept

[Objective-C Runtime](https://developer.apple.com/documentation/objectivec/objective_c_runtime) is a powerful ability in iOS, it looks like reflection system in other languages, but it's more flexible.

Base on runtime we could do a lot:

- Invoke method dynamically
- Create class dynamically
- Create instance dynamically
- Replace existing method

Overall, runtime can do a lot, is the most important feature of Objective-C.

# Why we need runtime?

The main purpose is provide backup for defective APIs, so please don't use it in most cases.

You should consider runtime only if you have no better choice.

If a JSBox API is not strong enough, you can consider use Runtime APIs, but a better way would be send a feedback to us.

# Methods

- `$objc(className)` Get a class dynamically
- `invoke(methodName, arguments ...)` Call a method dynamically
- `$define(object)` Create a class
- `jsValue()` Convert an Objective-C value to JavaScript value
- `ocValue()` Convert a JavaScript value to Objective-C value
- `$objc_retain(object)` retain object
- `$objc_release(object)` release object

# Example

This example creates a button on screen, tap it to open WeChat:

```js
$define({
  type: "MyHelper",
  classEvents: {
    open: function(scheme) {
      const url = $objc("NSURL").invoke("URLWithString", scheme);
      $objc("UIApplication").invoke("sharedApplication.openURL", url)
    }
  }
})

$ui.render({
  views: [
    {
      type: "button",
      props: {
        bgcolor: $objc("UIColor").invoke("blackColor").jsValue(),
        titleColor: $color("#FFFFFF").ocValue().jsValue(),
        title: "WeChat"
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.size.equalTo($size(100, 32))
      },
      events: {
        tapped: function(sender) {
          $objc("MyHelper").invoke("open", "weixin://")
        }
      }
    }
  ]
})

const window = $ui.window.ocValue();
const label = $objc("UILabel").invoke("alloc.init");
label.invoke("setTextAlignment", 1)
label.invoke("setText", "Runtime")
label.invoke("setFrame", { x: $device.info.screen.width * 0.5 - 50, y: 240, width: 100, height: 32 })
window.invoke("addSubview", label)
```

You can learn how to handle values from this example.

Here's a complicated example, it shows you how to create a game (2048) with Runtime: https://github.com/cyanzhong/xTeko/tree/master/extension-scripts/2048
```

## docs/en/runtime/invoke.md

```markdown
> Call Objective-C APIs directly using runtime APIs

# invoke(methodName, arguments ...)

We could get an Objective-C object, and call its method:

```js
const label = $objc("UILabel").invoke("alloc.init");
label.invoke("setText", "Runtime")
```

It creates a label, and sets the text to `Runtime`.

Methods are chainable, so `invoke("alloc.init")` equals to `invoke("alloc").invoke("init")`.

If you want to import many Objective-C classes in one go, here is the solution:

```js
$objc("UIColor, UIApplication, NSIndexPath");

const color = UIColor.$redColor();
const application = UIApplication.$sharedApplication();
```

# selector

Invoke a method that has multiple parameters (Objective-C):

```objc
NSIndexPath *indexPath = [NSIndexPath indexPathForRow:0 inSection:0];
```

In JSBox runtime, we could do:

```js
const indexPath = $objc("NSIndexPath").invoke("indexPathForRow:inSection:", 0, 0);
```

`indexPathForRow:inSection:` is a selector (function) in Objective-C, the following are parameters.
```

## docs/en/runtime/memory.md

```markdown
# $objc_retain(object)

Sometimes, values generated by Runtime will be released by system automatically, in order to avoid that, you could manage reference yourself:

```js
const manager = $objc("Manager").invoke("new");
$objc_retain(manager)
```

It maintains the object until script stopped.

# $objc_relase(object)

Release a Runtime object manually:

```js
$objc_release(manager)
```
```

## docs/en/runtime/sugar.md

```markdown
# Syntactic Sugar

Runtime is running code in another language, it's kind of like reflection, so you will feel tired to write code like:

```js
const app = $objc("UIApplication").invoke("sharedApplication");
const url = $objc("NSURL").invoke("URLWithString", "https://sspai.com");
app.invoke("openURL", url);
```

So we need a syntactic sugar to avoid this complex, since v1.24.0, we have new syntax:

```js
const app = $objc("UIApplication").$sharedApplication();
const url = $objc("NSURL").$URLWithString("https://sspai.com");
app.$openURL(url);
```

You can write less code and achieve the same effect, and it looks more like nature code.

# Rules

This syntax has very simple rules:

- Begin with `$` (dollar sign) to announce this is a runtime method
- Use `_` (dash sign) to replace `:` in Objective-C method
- Use `__` (2 dash signs) to replace `_` in Objective-C method

For instance:

```js
const app = $objc("UIApplication").$sharedApplication();
app.$sendAction_to_from_forEvent(action, target, null, null);
```

This works exactly the same as this Objective-C code:

```objc
UIApplication *app = [UIApplication sharedApplication];
[app sendAction:action to:target from:nil forEvent:nil];
```

For more detailed example, you can take a look this game (2048): https://github.com/cyanzhong/xTeko/tree/master/extension-scripts/%242048

# Auto generated classes

Some classes are used very frequently, so we import it automatically for you:

Class | Refer
---|---
NSDictionary | https://developer.apple.com/documentation/foundation/nsdictionary
NSMutableDictionary | https://developer.apple.com/documentation/foundation/nsmutabledictionary
NSArray | https://developer.apple.com/documentation/foundation/nsarray
NSMutableArray | https://developer.apple.com/documentation/foundation/nsmutablearray
NSSet | https://developer.apple.com/documentation/foundation/nsset
NSMutableSet | https://developer.apple.com/documentation/foundation/nsmutableset
NSString | https://developer.apple.com/documentation/foundation/nsstring
NSMutableString | https://developer.apple.com/documentation/foundation/nsmutablestring
NSData | https://developer.apple.com/documentation/foundation/nsdata
NSMutableData | https://developer.apple.com/documentation/foundation/nsmutabledata
NSNumber | https://developer.apple.com/documentation/foundation/nsnumber
NSURL | https://developer.apple.com/documentation/foundation/nsurl
NSEnumerator | https://developer.apple.com/documentation/foundation/nsenumerator

These classes can be used directly without declare:

```js
const url = NSURL.$URLWithString("https://sspai.com");
```

Other classes you need to declare with $objc, you can use the return value:

```js
const appClass = $objc("UIApplication");

var app = appClass.$sharedApplication();

// Or
var app = UIApplication.$sharedApplication();
```

In short, $objc("UIApplication") also creates a variable named `UIApplication`, it's very convenient if you want to use it many times.
```

## docs/en/runtime/types.md

```markdown
> Convert values between runtime and native environment

# Methods

Note:

- All values generated by runtime APIs are Objective-C values.
- All values generated by JSBox APIs are JavaScript values.

Therefore, there are 2 methods provided to convert them:

- `jsValue()` Objective-C value to JavaScript value
- `ocValue()` JavaScript value to Objective-C value

# Example

This is a JavaScript value:

```js
const color1 = $color("red");
```

If we want to use this in runtime APIs, we need to concert it first: `color1.ocValue()`.

And this is a Objective-C value:

```js
const color2 = $objc("UIColor").invoke("grayColor");
```

If we want to use this in JSBox APIs, we also need to convert it:

```js
props: {
  bgcolor: color2.jsValue()
}
```

Through these two methods, we can handle all values between Runtime APIs and JSBox APIs.
```

## docs/en/safari-extension/intro.md

```markdown
# Safari Extension

On iOS 15 and above, JSBox offers full-fledged support for [Safari Extensions](https://support.apple.com/en-us/guide/iphone/iphab0432bf6/ios), you can customize your Safari using JavaScript, scripts can be run automatically or manually.

For more information on how to use Safari extensions, please refer to the official Apple documentation mentioned above, we are focusing on extension development here.

## JavaScript Web APIs

Unlike JSBox scripts, Safari extensions run in the browser environment and scripts can use all web APIs, but not JSBox-specific APIs.

For development documentation related to this, please refer to Mozilla's [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) documentation.

> You can test Safari extensions in a desktop browser or in an in-app WebView environment, but testing in a real Safari environment is still a necessary step.

## Safari Tools

Safari tools are designed to provide extensions to Safari that require users to manually select to run them, creating tools:

- New Project
- Safari Tool

To create Safari tools using VS Code, make the file name to end with `.safari-tool.js`, so that JSBox will recognize it as a Safari tool.

Example code:

```js
const video = document.querySelector("video");
if (video) {
  video.webkitSetPresentationMode("picture-in-picture");
} else {
  alert("No videos found.");
}
```

This tool turns videos on the YouTube website into Picture in Picture (PiP) mode.

## Safari Rules

Safari rules are designed to provide Safari with plugins that run automatically, without the user having to manually select to run them, creating rules:

- New Project
- Safari Rule

To create Safari rules using VS Code, make the file name to end with `.safari-rule.js`, so that JSBox will recognize it as a Safari rule.

Example code:

```js
const style = document.createElement("style");
const head = document.head || document.getElementsByTagName("head")[0];
head.appendChild(style);
style.appendChild(document.createTextNode("._9AhH0 { display: none }"));
```

When this rule is enabled, users will be able to download images on the Instagram website.

> For security reasons, Safari rules are disabled by default and need to be turned on manually by users in the app settings.
```

## docs/en/sdk/calendar.md

```markdown
> Manage calendar items in Calendar.app

# $calendar.fetch(object)

Fetch calendar items (request access first):

```js
$calendar.fetch({
  startDate: new Date(),
  hours: 3 * 24,
  handler: function(resp) {
    const events = resp.events;
  }
})
```

Fetch all calendar items from now to 3 days later, we could either use `hours` or `endDate`.

The structure of an object in results is:

Prop | Type | Read/Write | Description
---|---|---|---
title | string | rw | title
identifier | string | r | id
location | string | rw | location
notes | string | rw | notes
url | string | rw | url
modifiedDate | date | r | last modified date
creationDate | date | r | creation date
allDay | boolean | r | is all day event
startDate | date | r | start date
endDate | date | r | end date
status | number | r | [Refer](https://developer.apple.com/documentation/eventkit/ekeventstatus)

# $calendar.create(object)

Create a calendar item:

```js
$calendar.create({
  title: "Hey!",
  startDate: new Date(),
  hours: 3,
  notes: "Hello, World!",
  handler: function(resp) {

  }
})
```

# $calendar.save(object)

Save modified calendar item:

```js
$calendar.fetch({
  startDate: new Date(),
  hours: 3 * 24,
  handler: function(resp) {
    const event = resp.events[0];
    event.title = "Modified"
    $calendar.save({
      event
    })
  }
})
```

# $calendar.delete(object)

Delete a calendar item:

```js
$calendar.delete({
  event,
  handler: function(resp) {
    
  }
})
```
```

## docs/en/sdk/contact.md

```markdown
> Manage contact items in Contacts.app

# $contact.pick(object)

Pick one or multiple contact:

```js
$contact.pick({
  multi: false,
  handler: function(contact) {
    
  }
})
```

Please set `multi` to `true` if you want to pick up multiple items.

# $contact.fetch(object)

Fetch contacts with keywords:

```js
$contact.fetch({
  key: "Ying",
  handler: function(contacts) {

  }
})
```

The returned contacts is a list, please refer https://developer.apple.com/documentation/contacts/cncontact to understand the structure.

You can also query all contacts that in a group:

```js
$contact.fetch({
  group,
  handler: function(contacts) {

  }
})
```

# $contact.create(object)

Create contact item:

```js
$contact.create({
  givenName: "Ying",
  familyName: "Zhong",
  phoneNumbers: {
    "Home": "18000000000",
    "Office": "88888888"
  },
  emails: {
    "Home": "log.e@qq.com"
  },
  handler: function(resp) {

  }
})
```

# $contact.save(object)

Save modified contact item:

```js
$contact.save({
  contact,
  handler: function(resp) {

  }
})
```

# $contact.delete(object)

Delete contacts:

```js
$contact.delete({
  contacts: contacts
  handler: function(resp) {
    
  }
})
```

# $contact.fetchGroups(object)

Fetch all groups:

```js
var groups = await $contact.fetchGroups();

console.log("name: " + groups[0].name);
```

# $contact.addGroup(object)

Create a new group with name:

```js
var group = await $contact.addGroup({"name": "Group Name"});
```

# $contact.deleteGroup(object)

Delete a group:

```js
var groups = await $contact.fetchGroups();

$contact.deleteGroup(groups[0]);
```

# $contact.updateGroup(object)

Save updated group:

```js
var group = await $contact.fetchGroups()[0];
group.name = "New Name";

$contact.updateGroup(group);
```

# $contact.addToGroup(object)

Add a contact to a group:

```js
$contact.addToGroup({
  contact,
  group
});
```

# $contact.removeFromGroup(object)

Remove a contact from a group:

```js
$contact.removeFromGroup({
  contact,
  group
});
```
```

## docs/en/sdk/intro.md

```markdown
# Native SDK

In this part we are going to introduce some native SDKs to you.

With these APIs, we can talk to iOS native APIs directly.

# $message

Send text message or mail using native interface.

# $calendar

Manage calendar items.

# $reminder

Manage reminder items.

# $contact

Manage your contacts.

# $location

Fetch/Track user location.

# $motion

Track motion data from sensors.

# $push

Schedule local push notifications.

# $safari

Open website in safari

> Above is a brief introduction, examples are coming soon.
```

## docs/en/sdk/location.md

```markdown
> Fetch/Track GPS information easily

# $location.available

Check whether location service is available:

```js
let available = $location.available;
```

# $location.fetch(object)

Fetch location:

```js
$location.fetch({
  handler: function(resp) {
    const lat = resp.lat;
    const lng = resp.lng;
    const alt = resp.alt;
  }
})
```

# $location.startUpdates(object)

Track user location updates:

```js
$location.startUpdates({
  handler: function(resp) {
    const lat = resp.lat;
    const lng = resp.lng;
    const alt = resp.alt;
  }
})
```

# $location.trackHeading(object)

Track heading data (compass):

```js
$location.trackHeading({
  handler: function(resp) {
    const magneticHeading = resp.magneticHeading;
    const trueHeading = resp.trueHeading;
    const headingAccuracy = resp.headingAccuracy;
    const x = resp.x;
    const y = resp.y;
    const z = resp.z;
  }
})
```

# $location.stopUpdates()

Stop updates.

# $location.select(object)

Select a location from iOS built-in Map:

```js
$location.select({
  handler: function(result) {
    const lat = result.lat;
    const lng = result.lng;
  }
})
```

# $location.get()

Get the current location, similar to $location.fetch but uses async await.

```js
const location = await $location.get();
```

# $location.snapshot(object)

Generate a snapshot image:

```js
const loc = await $location.get();
const lat = loc.lat;
const lng = loc.lng;
const snapshot = await $location.snapshot({
  region: {
    lat,
    lng,
    // distance: 10000
  },
  // size: $size(256, 256),
  // showsPin: false,
  // style: 0 (0: unspecified, 1: light, 2: dark)
});
```
```

## docs/en/sdk/message.md

```markdown
> Send text messages and mails

# $message.sms(object)

Here is an example:

```js
$http.download({
  url: "https://images.apple.com/v/iphone/compare/f/images/compare/compare_iphone7_jetblack_large_2x.jpg",
  handler: function(resp) {
    $message.sms({
      recipients: ["18688888888", "10010"],
      body: "Message body",
      subject: "Message subject",
      attachments: [resp.data],
      handler: function(result) {

      }
    })
  }
})
```

Param | Description
---|---
recipients | receivers
body | body
subject | subject
attachments | attachments (files)
result | 0: cancelled 1: succeeded 2: failed

# $message.mail(object)

Here is an example:

```js
$http.download({
  url: "https://images.apple.com/v/iphone/compare/f/images/compare/compare_iphone7_jetblack_large_2x.jpg",
  handler: function(resp) {
    $message.mail({
      subject: "Message subject",
      to: ["18688888888", "10010"],
      cc: [],
      bcc: [],
      body: "Message body",
      attachments: [resp.data],
      handler: function(result) {

      }
    })
  }
})
```

Param | Description
---|---
subject | subject
to | receiver
cc | cc
bcc | bcc
body | body
isHTML | is body an HTML
attachments | attachments (files)
result | 0: cancelled 1: succeeded 2: failed
```

## docs/en/sdk/motion.md

```markdown
> Track sensor data updates

# $motion.startUpdates(object)

Start updates:

```js
$motion.startUpdates({
  interval: 0.1,
  handler: function(resp) {

  }
})
```

Learn more about the data [CMDeviceMotion](https://developer.apple.com/documentation/coremotion/cmdevicemotion).

# $motion.stopUpdates()

Stop updates.
```

## docs/en/sdk/reminder.md

```markdown
> Manage reminder items in Reminders.app

# $reminder.fetch(object)

Fetch reminder items (request access first):

```js
$reminder.fetch({
  startDate: new Date(),
  hours: 2 * 24,
  handler: function(resp) {
    const events = resp.events;
  }
})
```

It looks very similar to `$calendar` APIs, the object structure:

Prop | Type | Read/Write | Description
---|---|---|---
title | string | rw | title
identifier | string | r | id
location | string | rw | location
notes | string | rw | notes
url | string | rw | url
modifiedDate | date | r | last modified date
creationDate | date | r | creation date
completed | boolean | rw | is completed
completionDate | date | r | completion date
alarmDate | date | rw | alarm date
priority | number | rw | priority (1 ~ 9) 

# $reminder.create(object)

Create a reminder item:

```js
$reminder.create({
  title: "Hey!",
  alarmDate: new Date(),
  notes: "Hello, World!",
  url: "https://apple.com",
  handler: function(resp) {

  }
})
```

We could have alarm by set `alarmDate` or `alarmDates`.

# $reminder.save(object)

Similar to `$calendar.save`:

```js
$reminder.save({
  event,
  handler: function(resp) {

  }
})
```

# $reminder.delete(object)

Delete a calendar item:

```js
$reminder.delete({
  event,
  handler: function(resp) {
    
  }
})
```

> You may notice that `$reminder` is very similar to `$calendar`, you're right, they have same structure in iOS.
```

## docs/en/sdk/safari.md

```markdown
> APIs related to Safari or Safari View Controller

# $safari.open(object)

Open website with [Safari View Controller](https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller):

```js
$safari.open({
  url: "https://www.apple.com",
  entersReader: true,
  height: 360,
  handler: function() {

  }
})
```

`entersReader`: enters reader if available, optional.

`height`: the height when it runs on widget, optional.

`handler`: callback to handle dismiss event.

Above 3 parameters are optional.

# $safari.items

Get items in Safari when you are using Action Extension:

```js
const items = $safari.items; // JSON format
```

# $safari.inject(script)

> Deprecated on iOS 15, use [Safari Extension](en/safari-extension/intro.md) instead.

Inject JavaScript code to Safari when you are using Action Extension:

```js
$safari.inject("window.location.href = 'https://apple.com';")
```

The action extension will be closed, and the JavaScript will be executed on Safari.

More useful examples: https://github.com/cyanzhong/xTeko/tree/master/extension-scripts/safari-extensions

# $safari.addReadingItem(object)

Add item to Safari reading list:

```js
$safari.addReadingItem({
  url: "https://sspai.com",
  title: "Title", // Optional
  preview: "Preview text" // Optional
})
```
```

## docs/en/shortcuts/intents.md

```markdown
# Run JSBox script

It's very easy to run JSBox script in Siri/Shortcuts app, you can send a request and return a result for it.

All you need to do is use `$intents.finish()` like:

```js
var result = await $http.get("");

$intents.finish(result.data);
```

You can do it asynchronously, and finish it with `$intents.finish()`.

If you want to run code synchronously, you can simply ignore `$intents.finish()`, the shortcut will be finished automatically.

# Specify view height

By default, the view height is 320, you can change it by:

```js
$intents.height = 180;
```

# Parameters

If you are using Shortcuts app on iOS 13 or above, you can specify two arguments: `Name` and `Parameters`.

In the Shortcuts app, you will see `Parameters` is a Text, but please fill it with a Shortcuts Dictionary.

JSBox will decode the Dictionary to a JSON, and you can get it with `$context.query`:

```js
const query = $context.query;
```

Also, the result in `$intents.finish(result)` will be passed to the next Shortcuts action.
```

## docs/en/shortcuts/intro.md

```markdown
# What's Shortcuts

Shortcuts is the redesigned Workflow, here's an introduction that helps you understand: https://www.macrumors.com/2018/07/09/hands-on-with-ios-12-shortcuts-app/

In short, there isn't many differences between Workflow and Shortcuts, but Shortcuts has better support of Siri, and it can be improved with 3rd-party apps.

When we talk about "Shortcuts", the meaning has two parts:

- Siri's Shortcut actions
- The standalone Shortcuts app (formerly Workflow)

# JSBox's Shortcuts features

For now, JSBox supports Shortcuts as below:

- Run JSBox script via Siri voice
- Run JSBox script in Siri and Shortcuts app
- Present view with JSBox script on Siri's view
- Run JavaScript via JSBox in Shortcuts app

# Note

- iOS 12 is required
- You can install Shortcuts app in the App Store
```

## docs/en/shortcuts/scripting.md

```markdown
# JavaScript support for Shortcuts

JSBox can also donate JavaScript ability to Shortcuts app, when you handle complicated data or logic in Shortcuts, it's cool to leverage JavaScript.

Since Shortcuts doesn't support passing data between 3rd-party apps, we can use clipboard as a workaround:

- Copy JavaScript to clipboard
- Run JavaScript with JSBox's action
- Get result from clipboard

In short, JSBox reads JavaScript code from clipboard, evaluate it and set the result back to clipboard.

For async task, we need to finish actions with `$intents.finish` like:

```js
const a = "Hello";
const b = "World";
const result = [a, b].join(", ");

$intents.finish(result);
```

You can install this Shortcut to understand how it works: [Run JavaScript](shortcuts://import-workflow?url=https://github.com/cyanzhong/xTeko/raw/master/extension-demos/scripting.shortcut&name=Run%20JavaScript).
```

## docs/en/shortcuts/ui-intents.md

```markdown
# Present JSBox views

You can present views that provided by JSBox script on Siri, it looks no differences compare to other JSBox scripts that shows a view:

```js
$ui.render({
  views: [
    {
      type: "label",
      props: {
        text: "Hey, Siri!"
      },
      layout: function(make, view) {
        make.center.equalTo(view.super);
      }
    }
  ]
});
```

This code shows a `Hey, Siri!` on Siri's view (You can add it to Siri/Shortcuts in script's setting view).

# Parameters

If you are using Shortcuts app on iOS 13 or above, you can specify two arguments: `Name` and `Parameters`.

In the Shortcuts app, you will see `Parameters` is a Text, but please fill it with a Shortcuts Dictionary.

JSBox will decode the Dictionary to a JSON, and you can get it with `$context.query`:

```js
const query = $context.query;
```
```

## docs/en/shortcuts/voice.md

```markdown
# Shortcuts voice command

You can launch JSBox scripts with Siri voice command, it can execute code or present views.

Do it with these two ways:

- Script setting view -> Add to -> Add to Siri
- System setting view -> Siri -> Find shortcuts that you want to setup
```

## docs/en/sqlite/intro.md

```markdown
# SQLite

Other than file or cache system, in JSBox you can also use SQLite as persistence layer, SQLite is a lightweight database which is very good for mobile. For more information you can refer to: https://www.sqlite.org/.

# FMDB

[FMDB](https://github.com/ccgus/fmdb) is an Objective-C wrapper for SQLite, JSBox uses this library and provides a wrapper on a higher level, so you can interact SQLite with JavaScript. That means, you can also call SQLite APIs with Runtime if necessary, but in most cases JSBox APIs are good enough.

# SQLite Browser

For better user experience, we also provide a lightweight SQLite browser, you get it for free in file explorer, it can preview SQLite files with a decent user interface.

It is read-only for now, we will add more functionalities in the future.
```

## docs/en/sqlite/queue.md

```markdown
# SQLite in multi-thread

Don't use a SQLite connection in multiple threads, if necessary, use Queue instead:

```js
const queue = $sqlite.dbQueue("test.db");

// Operations
queue.operations(db => {
  db.update();
  db.query();
  //...
});

// Transaction
queue.transaction(db => {
  db.update();
  db.query();
  //...
  const rollback = errorOccured;
  return rollback;
});

queue.close();
```
```

## docs/en/sqlite/transaction.md

```markdown
# db.beginTransaction()

For a SQLite connection, `beginTransaction()` starts a transaction.

# db.commit()

For a SQLite connection, `commit()` commits a transaction.

# db.rollback()

For a SQLite connection, `rollback()` rollbacks a transaction.
```

## docs/en/sqlite/usage.md

```markdown
# $sqlite.open(path)

Open a SQLite connection with file path:

```js
const db = $sqlite.open("test.db");
```

# $sqlite.close(db)

Close a SQLite connection:

```js
const db = $sqlite.open("test.db");

//...
$sqlite.close(db); // Or db.close();
```

# Update

Here's how to execute update:

```js
db.update("CREATE TABLE User(name text, age integer)");
// Return: { result: true, error: error }
```

You can also use placeholders and arguments:

```js
db.update({
  sql: "INSERT INTO User values(?, ?)",
  args: ["Cyan", 28]
});
```

PS: never concatenate strings as sql, use placeholders and values forever.

# Query

Let's see how to execute query:

```js
db.query("SELECT * FROM User", (rs, err) => {
  while (rs.next()) {
    const values = rs.values;
    const name = rs.get("name"); // Or rs.get(0);
  }
  rs.close();
});
```

Result set supports functions as below:

```js
const columnCount = rs.columnCount; // Column count
const columnName = rs.nameForIndex(0); // Column name
const columnIndex = rs.indexForName("age"); // Column index
const query = rs.query; // SQL Query
```

Please take a look at [Result Set](en/object/result-set.md) for details.

It's similar to update when you have arguments:

```js
db.query({
  sql: "SELECT * FROM User where age = ?",
  args: [28]
}, (rs, err) => {

});
```
```

## docs/en/ssh/channel.md

```markdown
# session.channel

session object provides script executing operations, properties:

Prop | Type | Description
---|---|---
session | session | session
bufferSize | number | buffer size
type | number | type
lastResponse | string | last response
requestPty | bool | request pty
ptyTerminalType | number | pty terminal type
environmentVariables | json | environment variables

# channel.execute(object)

Execute script:

```js
channel.execute({
  script: "ls -l /var/lib/",
  timeout: 0,
  handler: function(result) {
    console.log(`response: ${result.response}`)
    console.log(`error: ${result.error}`)
  }
})
```

# channel.write(object)

Execute command:

```js
channel.write({
  command: "",
  timeout: 0,
  handler: function(result) {
    console.log(`success: ${result.success}`)
    console.log(`error: ${result.error}`)
  }
})
```

# channel.upload(object)

Upload local file to remote:

```js
channel.upload({
  path: "resources/notes.md",
  dest: "/home/user/notes.md",
  handler: function(success) {
    console.log(`success: ${success}`)
  }
})
```

# channel.download(object)

Download remote file to local:

```js
channel.download({
  path: "/home/user/notes.md",
  dest: "resources/notes.md",
  handler: function(success) {
    console.log(`success: ${success}`)
  }
})
```
```

## docs/en/ssh/intro.md

```markdown
# Secure Shell

Since v1.14.0 JSBox provides SSH abilities, you can connect to your server with very simple JavaScript, here is an example which can help you have a brief understanding: [ssh-example](https://github.com/cyanzhong/xTeko/tree/master/extension-demos/ssh-example).

Here are basically 3 things that related to SSH:

- session
- channel
- sftp

With these APIs, you can execute scripts or upload/download files.

JSBox's SSH based on [NMSSH](https://github.com/NMSSH/NMSSH), so you can refer to MNSSH's documentation to understand the design concept.

# $ssh.connect(object)

Connect to server with password or keys, you can execute a script at the same time:

```js
$ssh.connect({
  host: "",
  port: 22,
  username: "",
  public_key: "",
  private_key: "",
  // password: "",
  script: "ls -l /var/lib/",
  handler: function(session, response) {
    console.log(`connect: ${session.connected}`)
    console.log(`authorized: ${session.authorized}`)
    console.log(`response: ${response}`)
  }
})
```

This example uses `public_key` and `private_key` for authentication, you can put your keys in app bundle, just like [ssh-example](https://github.com/cyanzhong/xTeko/tree/master/extension-demos/ssh-example) does.

The result contains a session instance and a response string, here is how session looks like:

Prop | Type | Description
---|---|---
host | string | host
port | number | port
username | string | user name
timeout | number | timeout
lastError | error | last error
fingerprintHash | string | fingerprint hash
banner | string | banner
remoteBanner | string | remote banner
connected | bool | is connected
authorized | bool | is authorized
channel | channel | channel instance
sftp | sftp | sftp instance

We can do many taks through `channel` and `sftp` object.

# $ssh.disconnect()

Disconnect all SSH sessions connected by JSBox:

```js
$ssh.disconnect()
```
```

## docs/en/ssh/sftp.md

```markdown
# session.sftp

sftp instance in session object provides file related APIs, object properties:

Prop | Type | Description
---|---|---
session | session | session
bufferSize | number | buffer size
connected | bool | is connected

# sftp.connect()

Create SFTP connection:

```js
await sftp.connect();
```

# sftp.moveItem(object)

Move a file:

```js
sftp.moveItem({
  src: "/home/user/notes.md",
  dest: "/home/user/notes-new.md",
  handler: function(success) {
    
  }
})
```

# sftp.directoryExists(object)

Check whether a directory exists:

```js
sftp.directoryExists({
  path: "/home/user/notes.md",
  handler: function(exists) {

  }
})
```

# sftp.createDirectory(object)

Create a directory:

```js
sftp.createDirectory({
  path: "/home/user/folder",
  handler: function(success) {

  }
})
```

# sftp.removeDirectory(object)

Delete a directory:

```js
sftp.removeDirectory({
  path: "/home/user/folder",
  handler: function(success) {

  }
})
```

# sftp.contentsOfDirectory(object)

List all files in a directory:

```js
sftp.contentsOfDirectory({
  path: "/home/user/folder",
  handler: function(contents) {

  }
})
```

# sftp.infoForFile(object)

Get file information:

```js
sftp.infoForFile({
  path: "/home/user/notes.md",
  handler: function(file) {

  }
})
```

Object properties:

Prop | Type | Description
---|---|---
filename | string | file name
isDirectory | bool | is directory
modificationDate | date | modification date
lastAccess | date | last access date
fileSize | number | file size
ownerUserID | number | owner user id
ownerGroupID | number | owner group id
permissions | string | permissions
flags | number | flags

# sftp.fileExists(object)

Check whether a file exists:

```js
sftp.fileExists({
  path: "/home/user/notes.md",
  handler: function(exists) {

  }
})
```

# sftp.createSymbolicLink(object)

Create symbolic link:

```js
sftp.createSymbolicLink({
  path: "/home/user/notes.md",
  dest: "/home/user/notes-symbolic.md",
  handler: function(success) {

  }
})
```

# sftp.removeFile(object)

Delete a file:

```js
sftp.removeFile({
  path: "/home/user/notes.md",
  handler: function(success) {

  }
})
```

# sftp.contents(object)

Get a file (binary):

```js
sftp.contents({
  path: "/home/user/notes.md",
  handler: function(file) {

  }
})
```

# sftp.write(object)

Write file (binary) to remote:

```js
sftp.write({
  file,
  path: "/home/user/notes.md",
  progress: function(sent) {
    // Optional: determine whether is finished here
    return sent > 1024 * 1024
  },
  handler: function(success) {
    
  }
})
```

# sftp.append(object)

Append file (binary) to remote:

```js
sftp.append({
  file,
  path: "/home/user/notes.md",
  handler: function(success) {
    
  }
})
```

# sftp.copy(object)

Copy a file:

```js
sftp.copy({
  path: "/home/user/notes.md",
  dest: "/home/user/notes-copy.md",
  progress: function(copied, totalBytes) {
    // Optional: determine whether is finished here
    return sent > 1024 * 1024
  },
  handler: function(success) {
    
  }
})
```

Note: handler could be implemented with async/await.
```

## docs/en/uikit/animation.md

```markdown
> iOS animation is awesome, JSBox provides two ways to implement animations

# UIView animation

The most simple way is use `$ui.animate`:

```js
$ui.animate({
  duration: 0.4,
  animation: function() {
    $("label").alpha = 0
  },
  completion: function() {
    $("label").remove()
  }
})
```

This code changes alpha value of the label to 0 in 0.4 seconds, then remove this view.

Yes, you just need to put your code inside `animation`, everything works like magic.

You can create a `spring animation` by set:

Param | Type | Description
---|---|---
delay | number | delay
damping | number | damping
velocity | number | initial value
options | number | [Refer](https://developer.apple.com/documentation/uikit/uiviewanimationoptions)

# Chainable

We also introduced a chainable API based on [JHChainableAnimations](https://github.com/jhurray/JHChainableAnimations):

```js
$("label").animator.makeBackground($color("red")).easeIn.animate(0.5)
```

We could do same effect with a much cleaner syntax, just use an animator.

For more details, please refer to the official docs of [JHChainableAnimations](https://github.com/jhurray/JHChainableAnimations).

> It is no longer recommended, because that project is not being maintained actively
```

## docs/en/uikit/context-menu.md

```markdown
# Context Menu

You can provide [Context Menus](https://developer.apple.com/design/human-interface-guidelines/ios/controls/context-menus/) for any views, sub menus and SF Symbols are supported as well.

Here's a minimal example:

```js
$ui.render({
  views: [
    {
      type: "button",
      props: {
        title: "Long Press!",
        menu: {
          title: "Context Menu",
          items: [
            {
              title: "Title",
              handler: sender => {}
            }
          ]
        }
      },
      layout: (make, view) => {
        make.center.equalTo(view.super);
        make.size.equalTo($size(120, 36));
      }
    }
  ]
});
```

# SF Symbols

Other than just title, you can also set up an icon with the `symbol` property:

```js
{
  title: "Title",
  symbol: "paperplane",
  handler: sender => {}
}
```

For more information about SF Symbols, you can use the Apple official app: https://developer.apple.com/design/downloads/SF-Symbols.dmg or this JSBox script: https://xteko.com/install?id=141

# destructive

For important actions that may be dangerous, you can use the destructive style:

```js
{
  title: "Title",
  destructive: true,
  handler: sender => {}
}
```

# Sub Menus

When a menu item has `items` property, it becomes a sub-menu:

```js
{
  title: "Sub Menu",
  items: [
    {
      title: "Item 1",
      handler: sender => {}
    },
    {
      title: "Item 2",
      handler: sender => {}
    }
  ]
}
```

This sub-menu has two sub-items, sub-menus can be nested.

# Inline Menu

The above sub-menu items will be collapsed as secondary items, you can also display them directly, with some separators, just use the `inline` property:

```js
{
  title: "Sub Menu",
  inline: true,
  items: [
    {
      title: "Item",
      handler: sender => {}
    }
  ]
}
```

# list & matrix

For an element in `list` or `matrix`, an `indexPath` will be provided in the `handler` function:

```js
$ui.render({
  views: [
    {
      type: "list",
      props: {
        data: ["A", "B", "C"],
        menu: {
          title: "Context Menu",
          items: [
            {
              title: "Action 1",
              handler: (sender, indexPath) => {}
            }
          ]
        }
      },
      layout: $layout.fill
    }
  ]
});
```

It's very similar to `event: didSelect` in each case, the only difference is how to trigger the action.

# Pull-Down Menus

As one of the most important changes in iOS 14, you can add [Pull-Down](https://developer.apple.com/design/human-interface-guidelines/ios/controls/buttons/) menus to `button` and `navButtons`. They won't blur the background, also can be triggered as primary action.

To support Pull-Down menus for `button`, simply add a `pullDown: true` parameter to parameters mentioned above:

```js
$ui.render({
  views: [
    {
      type: "button",
      props: {
        title: "Long Press!",
        menu: {
          title: "Context Menu",
          pullDown: true,
          asPrimary: true,
          items: [
            {
              title: "Title",
              handler: sender => {}
            }
          ]
        }
      },
      layout: (make, view) => {
        make.center.equalTo(view.super);
        make.size.equalTo($size(120, 36));
      }
    }
  ]
});
```

To add Pull-Down menus to `navButtons`, simply use the `menu` parameter:

```js
$ui.render({
  props: {
    navButtons: [
      {
        title: "Title",
        symbol: "checkmark.seal",
        menu: {
          title: "Context Menu",
          asPrimary: true,
          items: [
            {
              title: "Title",
              handler: sender => {}
            }
          ]
        }
      }
    ]
  }
});
```

Note that, the parameter `asPrimary` indicates whether its a primary action.
```

## docs/en/uikit/dark-mode.md

```markdown
# Dark Mode

The latest JSBox version has supported Dark Mode, not only for the app itself, but also provided some easy-to-use APIs for creating dark-mode-perfect scripts.

This chapter talks about how does it work, and how to make your scripts Dark Mode ready.

# theme

`theme` specifies the appearance preference, its possible values are `light` / `dark` / `auto`, stand for light mode, dark mode and system default.

It can be a global setting like this:

```js
$app.theme = "auto";
```

Alternatively, uses the value in the [config.json](en/package/intro.md) file:

```json
{
  "settings": {
    "theme": "auto"
  }
}
```

Other than set that globally, you can also set a certain value for each screens, in its `props`:

```js
$ui.push({
  props: {
    "theme": "light"
  }
});
```

We can also override theme for a certain view like this:

```js
$ui.render({
  views: [
    {
      type: "view",
      props: {
        "theme": "light"
      }
    }
  ]
});
```

> Note, to avoid breaking your existing scripts, the default value of `theme` would be `light`. If you'd like to adapt dark mode, turn it to `auto`, then adjust your colors.

Default controls have different colors under different themes, please refer to the latest [UIKit-Catalog](https://github.com/cyanzhong/xTeko/blob/master/extension-scripts/uikit-catalog.js) demo for more information.

# Dynamic Colors

In order support different colors for light and dark, you can now create dynamic colors like this:

```js
const dynamicColor = $color({
  light: "#FFFFFF",
  dark: "#000000"
});
```

It can also be simplified as:

```js
const dynamicColor = $color("#FFFFFF", "#000000");
```

Colors can be nested, it can use colors generated by the `$rgba(...)` method:

```js
const dynamicColor = $color($rgba(0, 0, 0, 1), $rgba(255, 255, 255, 1));
```

Besides, if you want to provide colors for the pure black theme, you can do:

```js
const dynamicColor = $color({
  light: "#FFFFFF",
  dark: "#141414",
  black: "#000000"
});
```

Dynamic colors show different colors in light mode or dark mode, no need to observe theme changes and switch them manually.

Also, there are some [semantic colors](en/function/index.md?id=colorstring), you can use them directly.

# Dynamic Images

Similarly, you may need to provide dynamic images for light or dark mode, like this:

```js
const dynamicImage = $image({
  light: "light-image.png",
  dark: "dark-image.png"
});
```

This image chooses different resources for light and dark mode, it switches automatically, can be simplified as:

```js
const dynamicImage = $image("light-image.png", "dark-image.png");
```

Besides, images can also be nested, such as:

```js
const lightImage = $image("light-image.png");
const darkImage = $image("dark-image.png");
const dynamicImage = $image(lightImage, darkImage);
```

> Note, this doesn't work for SF Symbols and remote resources. For SF Symbols, please provide dynamic color for `tintColor` to achieve that

# events: themeChanged

Theme changes will emit a `themeChanged` event for all views:

```js
$ui.render({
  views: [
    {
      type: "view",
      layout: $layout.fill,
      events: {
        themeChanged: (sender, isDarkMode) => {
          // Update UI if needed
        }
      }
    }
  ]
});
```

This provides a chance to change some UI details dynamically, such as changing its `alpha` value, or changing its `borderColor` (it doesn't support dynamic colors).

# Blur Effect

In iOS 13 and above, [type: "blur"](en/component/blur.md) supports more styles. Some of those styles are designed for both light mode and dark mode, you can use [$blurStyle](en/data/constant.md?id=blurstyle) for that.

Please refer to Apple's [documentation](https://developer.apple.com/documentation/uikit/uiblureffectstyle) for more information.

# WebView

WebView has its own mechanism for Dark Mode, please refer to [WebKit docs](https://webkit.org/blog/8840/dark-mode-support-in-webkit/) for more information.

Just a tip: for WebViews in JSBox, you need to set `props: opaque` to `false`, this can avoid the whitescreen for the initial loading.

# Embrace Dark Mode

In general, there are three things you should do:

- Set `theme` to `auto`
- Use `$color(light, dark)` and `$image(light, dark)` to create dynamic assets
- Leverage `themeChanged` to update UI details

In order to demonstrate how it works clearly, we prepared an example project for you: https://github.com/cyanzhong/jsbox-dark-mode

As the mechanism continues to improve, we may provide more APIs in the future, which should make your life easier. Besides, the default value of `theme` is just a temporary solution for the transition period, it might be `auto` in the future, to make scripts that only use default controls support dark mode by default.
```

## docs/en/uikit/event.md

```markdown
# Event handling

Starts from v1.49.0, we provide better event handling strategy for views, action can be connected after view is created. All iOS built-in control events are supported.

# view.whenTapped(handler)

Single tap action is triggered:

```js
button.whenTapped(() => {
  
});
```

# view.whenDoubleTapped(handler)

Double tap action is triggered:

```js
button.whenDoubleTapped(() => {
  
});
```

# view.whenTouched(args)

Customizable touch event is triggered:

```js
button.whenTouched({
  touches: 2,
  taps: 2,
  handler: () => {

  }
});
```

Above code will be executed for two fingers quickly tap twice.

If the button is a Runtime object (ocValue), here are two solutions:

```js
button.jsValue().whenTapped(() => {
  
});
```

Or, use $block instead:

```js
button.$whenTapped($block("void, void", () => {

}));
```

# view.addEventHandler(args)

Add custom event handlers:

```js
textField.addEventHandler({
  events: $UIEvent.editingChanged,
  handler: sender => {

  }
});
```

Note that: this only available on components like `button`, `text`, `input`, since they are UI controls, but it won't work on `image` like components. Full list of UI events can be found here: [$UIEvent](data/constant.md?id=uievent)

# view.removeEventHandlers(events)

Remove existing event handlers:

```js
textField.removeEventHandlers($UIEvent.editingChanged);
```

Of course, above code can be used in Runtime environment:

```js
textField.$addEventHandler({
  events: $UIEvent.editingChanged,
  handler: $block("void, id", sender => {
    
  })
});
```
```

## docs/en/uikit/gesture.md

```markdown
# Gesture

Gesture recognization on mobile is the most important innovation in last 10 years!

Let's see Steve introduces the 1st generation iPhone: https://www.youtube.com/watch?v=x7qPAY9JqE4.

iOS supports various gestures, such as tap, pinch, pan etc, currently JSBox supports few of them.

# events: tapped

Triggers when tap gesture received:

```js
tapped: function(sender) {

}
```

# events: longPressed

Triggers when long press gesture received:

```js
longPressed: function(info) {
  let sender = info.sender;
  let location = info.location;
}
```

# events: doubleTapped

Triggers when double tap gesture received:

```js
doubleTapped: function(sender) {

}
```


# events: touchesBegan

When touch event is triggered:

```js
touchesBegan: function(sender, location, locations) {

}
```

# events: touchesMoved

When touch is moving:

```js
touchesMoved: function(sender, location, locations) {

}
```

# events: touchesEnded

When touch event finished:

```js
touchesEnded: function(sender, location, locations) {

}
```

# events: touchesCancelled

When touch event cancelled:

```js
touchesCancelled: function(sender, location, locations) {

}
```
```

## docs/en/uikit/intro.md

```markdown
# Basic Concept

In JSBox, build user interface is very easy, the only thing you need to provide is a JavaScript object, we actually based on [UIKit](https://developer.apple.com/documentation/uikit), but it's much easier, works like magic.

Unlike [React Native](https://facebook.github.io/react-native/) and [Weex](https://weex.incubator.apache.org/), you don't need to know `HTML` and `CSS`, JavaScript is enough to create delightful UI.

PS: Your can run without any user interface, absolutely.

# Example

Like we mentioned before, we can create a button with following code:

```js
$ui.render({
  views: [
    {
      type: "button",
      props: {
        title: "Button"
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.width.equalTo(64)
      },
      events: {
        tapped: function(sender) {
          $ui.toast("Tapped")
        }
      }
    }
  ]
})
```

This is very small but included all concept we needed to create UI: `type`, `props`, `layout` and `events`.

# type

To specify view's type, such as `button` and `label`, they are work different.

# props

It means properties, or attributes of a view. For example `title` in button, different view has different props, we will explain all of them later. 

# layout

In short, layout is used to determine the location and size of a view.

JSBox uses [Auto Layout](https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/AutolayoutPG/index.html) as layout system, you don't need to fully understand how it works, because we provided a solution based on a third party framework: [Masonry](https://github.com/SnapKit/Masonry).

Masonry is very easy to use, we have several examples later.

PS: we are considering support more layout systems in the future, for example [Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes).

# events

Provide events here, for example `tapped` in button, we will show different events supported by different views soon.

# views

It's an array to provided its subviews (children):

```js
{
  views: [

  ]
}
```

Yes, a view system is actually works like a tree, trees have theirs children.
```

## docs/en/uikit/layout.md

```markdown
> Layout is a series of constraints to determine the size and position of views

# Layout System

Layout is very important in a UI system, different platform has different design, for example [Auto Layout](https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/AutolayoutPG/index.html) in iOS, and [Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes) which is used widely in web applications.

In short: size & position.

*PS: This part is a little bit complicated, but it is also very important.*

In the early iOS, due to the limitation of screen, iOS only provides frame based layout. It's based on absolute position and size, so you can set `frame` in `props` as well (not recommend).

Because frame layout is clumsy:

- Hard to calculate, the ability is poor
- Need to know super view's size, won't update automatically
- Can not make sure everthing is fine on different screens

Use auto layout as much as you can, as an iOS developer I will tell you auto layout is much better than frame layout.

When you are using frame layout, you can use events->layoutSubview to retrieve super view's frame:

```js
$ui.render({
  views: [
    {
      type: "view",
      layout: $layout.fill,
      events: {
        layoutSubviews: function(view) {
          console.log(`frame: ${JSON.stringify(view.frame)}`)
        }
      }
    }
  ]
})
```

# Basic Concept

We are trying to describe auto layout with most simple words:

> Create some constraints in a view tree, to describe relationship between each views, for example super view, children and siblings

Constraints need to be complete, for example:

- The height is 40
- The relative position to super view is (10, 10)
- The training margin to super view is 10

We don't know the width of this view, but this view's layout is complete.

No matter how the screen looks, we can always have a view, the relationship is clear enough:

```js
layout: function(make) {
  make.height.equalTo(40)
  make.left.top.right.inset(10)
}
```

You can use `view` itself by:

```js
layout: function(make, view) {
  make.height.equalTo(40)
  make.width.equalTo(view.height)
}
```

In case you want to get the width/height, or `view.super`.

# What's constraint?

Basically it is a value to describe a relationship of a property.

The property could be top/bottom/left/right, the relationship could be equalTo/offset etc.

In short, constraint is property and relationship combined.

# Properties

Like we mentioned before, `height` and `left` are relationship, here are more examples, you can refer: [Masonry](https://github.com/SnapKit/Masonry) to check out all of them.

Prop | Description
---|---
width | width
height | height
size | size
center | center
centerX | x center
centerY | y center
left | left side
top | top side
right | right side
bottom | bottom side
leading | leadin
trailing | trailing
edges | 4 edges

Please note sometimes we need to support RTL (Right to Left) languages, consider use leading/trailing in that case.

# Relations

Describe relationship between two views, such as `equalTo`, `offset`：

Relation | Description
---|---
equalTo(object) | ==
greaterThanOrEqualTo(object) | >=
lessThanOrEqualTo(object) | <=
offset(number) | offset by
inset(number) | inset by
insets($insets) | edge insets
multipliedBy(number) | multiplied by
dividedBy(number) | divided by
priority(number) | set priority

We can create constraints with chainable syntax:

```js
layout: function(make) {
  make.left.equalTo($("label").right).offset(10)
  make.bottom.inset(0)
  make.size.equalTo($size(40, 40))
}
```

This view is 40x40pt, align to the bottom of its super view, and at the right of `label` with a small offset.

We have to know, layout is not an easy task, there's no best solution for all situations. Auto Layout has its disadvantages too.

However, understand concept above is enough to handle most cases, please check documents when you need:

[Masonry](https://github.com/SnapKit/Masonry) [Apple](https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/AutolayoutPG/index.html).

This document is still under construction, we will provide more examples soon.

# Flex

Sometimes, auto resizing is enough for you, you can use view's `flex` property:

```js
$ui.render({
  views: [
    {
      type: "view",
      props: {
        bgcolor: $color("red"),
        frame: $rect(0, 0, 0, 100),
        flex: "W"
      }
    }
  ]
});
```

This creates a view which has the same width as its parent, and the height is 100. The `flex` property is a string, acceptable characters are:

- `L`: [UIViewAutoresizingFlexibleLeftMargin](https://developer.apple.com/documentation/uikit/uiviewautoresizing/uiviewautoresizingflexibleleftmargin?language=objc)
- `W`: [UIViewAutoresizingFlexibleWidth](https://developer.apple.com/documentation/uikit/uiviewautoresizing/uiviewautoresizingflexiblewidth?language=objc)
- `R`: [UIViewAutoresizingFlexibleRightMargin](https://developer.apple.com/documentation/uikit/uiviewautoresizing/uiviewautoresizingflexiblerightmargin?language=objc)
- `T`: [UIViewAutoresizingFlexibleTopMargin](https://developer.apple.com/documentation/uikit/uiviewautoresizing/uiviewautoresizingflexibletopmargin?language=objc)
- `H`: [UIViewAutoresizingFlexibleHeight](https://developer.apple.com/documentation/uikit/uiviewautoresizing/uiviewautoresizingflexibleheight?language=objc)
- `B`: [UIViewAutoresizingFlexibleBottomMargin](https://developer.apple.com/documentation/uikit/uiviewautoresizing/uiviewautoresizingflexiblebottommargin?language=objc)

For example, using "LRTB" to describe `UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleBottomMargin`.
```

## docs/en/uikit/method.md

```markdown
> In the UI system of JSBox, there are still something we need to talk

# $ui.pop()

Pop out the most front view from the stack.

# $ui.popToRoot()

Pop to the root view.

# $ui.get(id)

Get a view instance by id, same as `$(id)`.

> You can also get view by type, only if this type is distinct.

# $ui.alert(object)

Present an alert, usually used to show a message or options:

```js
$ui.alert({
  title: "Hello",
  message: "World",
  actions: [
    {
      title: "OK",
      disabled: false, // Optional
      style: $alertActionType.default, // Optional
      handler: function() {

      }
    },
    {
      title: "Cancel",
      style: $alertActionType.destructive, // Optional
      handler: function() {

      }
    }
  ]
})
```

You can create an alert with title, message and actions, if no `actions` is provided, a default `OK` will be shown.

`title` and `message` are optional, and the minimal implementation is:

```js
$ui.alert("Haha!")
```

Yes, you could simply provide a string, it will work also.

# $ui.action(object)

Present an action sheet, all parameters are same as `$ui.alert`.

PS: This control can only be used in main application, don't use it in app extensions.

# $ui.menu(object)

Present a menu, it can be used to provide a series of options:

```js
$ui.menu({
  items: ["A", "B", "C"],
  handler: function(title, idx) {

  },
  finished: function(cancelled) {
    
  }
})
```

# $ui.popover(object)

Present a popover, provides two different styles.

Style 1, it can be filled with some simple options (string array):

```js
const {index, title} = await $ui.popover({
  sourceView: sender,
  sourceRect: sender.bounds, // default
  directions: $popoverDirection.up, // default
  size: $size(320, 200), // fits content by default
  items: ["Option A", "Option B"],
  dismissed: () => {},
});
```

In this way, fill options with `items` property, it returns a Promise.

Style 2, it can be filled with custom `views`:

```js
const popover = $ui.popover({
  sourceView: sender,
  sourceRect: sender.bounds, // default
  directions: $popoverDirection.any, // default
  size: $size(320, 200), // fits screen width by default
  views: [
    {
      type: "button",
      props: {
        title: "Button"
      },
      layout: (make, view) => {
        make.center.equalTo(view.super);
        make.size.equalTo($size(100, 36));
      },
      events: {
        tapped: () => {
          popover.dismiss();
        }
      }
    }
  ]
});
```

Create custom UI with `views` property, returns the popover itself, you can close it by calling its `dismiss` method.

The `sourceView` and `sourceRect` specifies where to present the popover, and `sourceRect` default to sourceView.bounds, `directions` defines the permitted arrow directions.

Please refer to the demo project we provided for more information: https://gist.github.com/cyanzhong/313b2c8d138691233658f1b8a52f02c6

# $ui.toast(message)

Show a toast message at top of the root view.

```js
$ui.toast("Hey!")
```

There is an optional parameter to set the stay seconds:

```js
$ui.toast("Hey!", 10)
```

This toast will be dismissed after 10 seconds.

> You can clear toast with $ui.clearToast();

# $ui.success(string)

Similar to `toast`, but the bar color is green, indicates success:

```js
$ui.success("Done");
```

# $ui.warning(string)

Similar to `toast`, but the bar color is yellow, indicates warning:

```js
$ui.warning("Be careful!");
```

# $ui.error(string)

Similar to `toast`, but the bar color is red, indicates error:

```js
$ui.error("Something went wrong!");
```

# $ui.loading(boolean)

Show a loading indicator:

```js
$ui.loading(true)
```

You can also display a message here:

```js
$ui.loading("Loading...")
```

# $ui.progress(number)

Display a progress bar, the range of number is [0, 1]:

```js
$ui.progress(0.5)
```

Also, an optional message is supported:

```js
$ui.progress(0.5, "Downloading...")
```

# $ui.preview(object)

Preview a url quickly:

```js
$ui.preview({
  title: "URL",
  url: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg"
})
```

Param | Type | Description
---|---|---
title | string | title
url | string | url
html | string | html content
text | string | text content

# $ui.create(object)

Create a view manually, the object should be a view like $ui.render:

```js
const canvas = $ui.create({
  type: "image",
  props: {
    bgcolor: $color("clear"),
    tintColor: $color("gray"),
    frame: $rect(0, 0, 100, 100)
  }
});
```

Note that, since there's no super view yet, you cannot use `layout` method at that moment.

Instead, you should do it after the view is added to its super:

```js
const subview = $ui.create(...);
superview.add(subview);
subview.layout((make, view) => {

});
```

# $ui.window

Get current window of $ui.render.

# $ui.controller

Get the most front view controller of the app.

# $ui.title

Get or set the most front view's title.

# $ui.selectIcon()

Select icon:

```js
var icon = await $ui.selectIcon();
```
```

## docs/en/uikit/render.md

```markdown
> We use render and push to draw views on the screen

# $ui.render(object)

Here's how `$ui.render` works, create a page:

```js
$ui.render({
  props: {
    id: "label",
    title: "Hello, World!"
  },
  views: [
    {
      type: "label",
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.size.equalTo($size(100, 100))
      }
    }
  ]
})
```

Because root view is also a view, it supports `props` as well, and you can set the title of the root view.

Other props:

Prop | Type | Description
---|---|---
theme | string | theme: light/dark/auto
title | string | title
titleColor | $color | title color
barColor | $color | bar color
iconColor | $color | icon color
debugging | bool | shows view debugging tool
navBarHidden | bool | whether hide navigation bar
statusBarHidden | bool | whether hide status bar
statusBarStyle | number | 0 for black, 1 for white
fullScreen | bool | whether present as full screen mode
formSheet | bool | whether present as form sheet (iPad only)
pageSheet | bool | whether present as page sheet (iOS 13)
bottomSheet | bool | whether present as bottom sheet (iOS 15)
modalInPresentation | bool | whether to prevent dismiss gesture
homeIndicatorHidden | bool | whether hide home indicator for iPhone X series
clipsToSafeArea | bool | whether clips to safe area
keyCommands | array | external keyboard commands

Starting from v1.36.0, you can render a page with $ui.render("main.ux") which is generated from UI editor.

# $ui.push(object)

Create a page, everthing is exactly same as $ui.render, but it pushes a new root view above previous view.

That's how native view navigation works, you can use it to implement `detail views` logic.

Starting from v1.36.0, you can push a page with $ui.push("detail.ux") which is generated from UI editor.

# $(id)

Get a view with id:

```js
const label = $("label");
```

If id is not provided, will search with type.

If you provided multiple views with same type, you need to provide id for each view.

# Life Cycle

Currently, $ui.render and $ui.push support below life cycle callback:

```js
events: {
  appeared: function() {

  },
  disappeared: function() {

  },
  dealloc: function() {

  }
}
```

As you can imagine, these will be called when page is appeared, disappeared and removed.

# Keyboard Height Changes

You can observe keyboard height changes with:

```js
events: {
  keyboardHeightChanged: height => {

  }
}
```

# Shake event

You can detect shake event with:

```js
events: {
  shakeDetected: function() {

  }
}
```

# Support external keyboard

Define keys with `keyCommands`:

```js
$ui.render({
  props: {
    keyCommands: [
      {
        input: "I",
        modifiers: 1 << 20,
        title: "Discoverability Title",
        handler: () => {
          console.log("Command+I triggered.");
        }
      }
    ]
  }
});
```

modifiers is a mask, values could be:

Type | Value
---|---
Caps lock | 1 << 16
Shift | 1 << 17
Control | 1 << 18
Alternate | 1 << 19
Command | 1 << 20
NumericPad | 1 << 21

For instance, (1 << 20 | 1 << 17) stands for hold `Command` + `Shift`.
```

## docs/en/uikit/view.md

```markdown
> Explain JSBox view system

# type: "view"

`view` is the base component of all views:

```js
$ui.render({
  views: [
    {
      type: "view",
      props: {
        bgcolor: $color("#FF0000")
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.size.equalTo($size(100, 100))
      },
      events: {
        tapped: function(sender) {

        }
      }
    }
  ]
})
```

Render a red rectangle on the screen.

# props

Prop | Type | Read/Write | Description
---|---|---|---
theme | string | rw | light, dark, auto
alpha | number | rw | alpha
bgcolor | $color | rw | background color
cornerRadius | number | rw | corner radius
smoothCorners | boolean | rw | use continuous curve for corners
radius | number | w | corner radius (deprecated, use `cornerRadius`)
smoothRadius | number | w | smooth corner radius (deprecated, use `smoothCorners`)
frame | $rect | rw | frame
size | $size | rw | size
center | $point | rw | center
flex | string | rw | auto resizing flexible mask
userInteractionEnabled | boolean | rw | user interaction enable
multipleTouchEnabled | boolean | rw | multiple touch support
super | view | r | super view
prev | view | r | previous view
next | view | r | next view
window | view | r | window
views | array | r | subviews
clipsToBounds | boolean | rw | clip subviews
opaque | boolean | rw | opaque
hidden | boolean | rw | hidden
contentMode | $contentMode | rw | [Refer](https://developer.apple.com/documentation/uikit/uiview/1622619-contentmode)
tintColor | $color | rw | tint color
borderWidth | number | rw | border width
borderColor | $color | rw | border color
circular | bool | rw | whether a circular shape
animator | object | r | animator
snapshot | object | r | create snapshot
info | object | rw | bind extra info
intrinsicSize | $size | rw | intrinsic content size
isAccessibilityElement | bool | rw | whether an accessible element
accessibilityLabel | string | rw | accessibility label
accessibilityHint | string | rw | accessibility hint
accessibilityValue | string | rw | accessibility value
accessibilityCustomActions | array | rw | [accessibility custom actions](en/function/index?id=accessibilityactiontitle-handler)

Note: you can't use `next` in layout functions, because the view hierarchy hasn't been generated.

# navButtons

Create custom navigation buttons:

```js
$ui.render({
  props: {
    navButtons: [
      {
        title: "Title",
        image, // Optional
        icon: "024", // Or you can use icon name
        symbol: "checkmark.seal", // SF symbols are supported
        handler: sender => {
          $ui.alert("Tapped!")
        },
        menu: {
          title: "Context Menu",
          items: [
            {
              title: "Title",
              handler: sender => {}
            }
          ]
        } // Pull-Down menu
      }
    ]
  }
})
```

Learn more about Pull-Down menus, refer to [Pull-Down Menus](en/uikit/context-menu?id=pull-down-menus).

# titleView

Other than setting title with `title`, you can also change the title view with `titleView`:

```js
$ui.render({
  props: {
    titleView: {
      type: "tab",
      props: {
        bgcolor: $rgb(240, 240, 240),
        items: ["A", "B", "C"]
      },
      events: {
        changed: sender => {
          console.log(sender.index);
        }
      }
    }
  },
  views: [

  ]
});
```

# layout(function)

Trigger layout method manually, arguments are exactly the same as the `layout` function in its view definition:

```js
view.layout((make, view) => {
  make.left.top.right.equalTo(0);
  make.height.equalTo(100);
});
```

# updateLayout(function)

Update a view's layout:

```js
$("label").updateLayout(make => {
  make.size.equalTo($size(200, 200))
})
```

Note that, `updateLayout` can only be used for existing constraints, or it won't work.

# remakeLayout(function)

Similar to updateLayout, but remake costs more performance, try to use update as much as you can.

# add(object)

Add a view to another view's hierarchy, refer `$ui.render(object)` to see how to create a view, it can also be a view instance that is created with `$ui.create(...)`.

# get(id)

Get a subview with specific identifier.

# remove()

Remove a view from its super view's hierarchy.

# insertBelow(view, other)

Insert a new view below an existing view:

```js
view.insertBelow(newView, existingView);
```

# insertAbove(view, other)

Insert a new view above an existing view:

```js
view.insertAbove(newView, existingView);
```

# insertAtIndex(view, index)

Insert a new view at a specific index:

```js
view.insertAtIndex(newView, 4);
```

# moveToFront()

Move self to super's front:

```js
existingView.moveToFront();
```

# moveToBack()

Move self to super's back:

```js
existingView.moveToBack();
```

# relayout()

Trigger layouting of a view, you can use this during animations.

Layout process will not be done immediately after views are created, calling this can trigger an additional layout loop, to make frame and size available.

# setNeedsLayout()

Mark a view as needs layout, it will be applied in the next drawing cycle.

# layoutIfNeeded()

Forces layout early before next drawing cycle, can be used with `setNeedsLayout`:

```js
view.setNeedsLayout();
view.layoutIfNeeded();
```

# sizeToFit()

Resize the view to its best size based on the current bounds.

# scale(number)

Scale a view (0.0 ~ 1.0):

```js
view.scale(0.5)
```

# snapshotWithScale(scale)

Create snapshot with scale:

```js
const image = view.snapshotWithScale(1)
```

# rotate(number)

Rotate a view:

```js
view.rotate(Math.PI)
```

# events: ready

`ready` event is supported for all views, it will be called when view is ready:

```js
ready: function(sender) {
  
}
```

# events: tapped

Observe tap gesture:

```js
tapped: function(sender) {

}
```

The sender is the source of event, usually means the view itself.

You can also use this syntax:

```js
tapped(sender) {

}
```

This has same effect.

# events: pencilTapped

Detect tap events from Apple Pencil:

```js
pencilTapped: function(info) {
  var action = info.action; // 0: Ignore, 1: Switch Eraser, 2: Switch Previous, 3: Show Color Palette
  var enabled = info.enabled; // whether the system reports double taps on Apple Pencil to your app
}
```

# events: hoverEntered

For iPadOS 13.4 (and above) with trackpad, this is called when pointer enters the view:

```js
hoverEntered: sender => {
  sender.alpha = 0.5;
}
```

# events: hoverExited

For iPadOS 13.4 (and above) with trackpad, this is called when pointer exits the view:

```js
hoverExited: sender => {
  sender.alpha = 1.0;
}
```

# events: themeChanged

Detect [dark mode](en/uikit/dark-mode.md) changes:

```js
themeChanged: (sender, isDarkMode) => {
  
}
```

Refer [Component](en/component/label.md) to see how to use other controls.
```

## docs/en/widget/intro.md

```markdown
# JSBox script on widget

The memory and user interaction are very limited on iOS today widget.

Therefore, not all scripts can be executed on widget correctly.

Here is a list for unavailable APIs:

API | Description
---|---
$ui.action | Present action sheet
$ui.preview | Preview content
$message.* | Send message
$photo.take | Take photo
$photo.pick | Pick photo
$photo.prompt | Ask user to get a photo
$share.sheet | Present share sheet
$text.lookup | Lookup in dictionary
$picker.* | Present pickers
$qrcode.scan | Scan QRCode
$input.speech | Speech to text

Please be careful when you are using above APIs.

When you want to get input from user, please use `$input.text` instead of `input` component.

# Some APIs are very useful on widget

Although there are some limitations, we still need to interact with users.

Here are some useful APIs you could consider:

API | Description
---|---
$ui.alert | Present alert
$ui.menu | Show popup menu
$ui.toast | Show toast message
$ui.loading | Show loading state
$input.text | Input text
```

## docs/en/widget/method.md

```markdown
# $widget

$widget provides API to interact with widgets.

# $widget.height

Get or set the height of widget:

```js
// Get
const height = $widget.height;
// Set
$widget.height = 400;
```

# $widget.mode

Get current display mode (show less/show more):

```js
const mode = $widget.mode; // 0: less 1: more
```

# $widget.modeChanged

Observe mode changes:

```js
$widget.modeChanged = mode => {
  
}
```
```

## docs/extend/archiver.md

```markdown
> JSBox 自带的压缩/解压缩模块

# $archiver.zip(object)

将多个文件压缩成一个 ZIP 文件：

```js
var files = $context.dataItems
var dest = "Archive.zip"

if (files.length == 0) {
  return
}

$archiver.zip({
  files: files,
  dest: dest,
  handler: function(success) {
    if (success) {
      $share.sheet([dest, $file.read(dest)])
    }
  }
})
```

`files` 是一个 data 数组，也可以通过 `paths` 指定一组文件。

你也可以通过 directory 参数来对一个文件夹进行压缩：

```js
$archiver.zip({
  directory: "",
  dest: "",
  handler: function(success) {
    
  }
})
```

# $archiver.unzip(object)

将一个 ZIP 文件解压到某个路径下：

```js
$archiver.unzip({
  file,
  dest: "folder",
  handler: function(success) {

  }
})
```

file 是一个 zip 的 data 对象，dest 所指向的目录需要存在，否则将会失败。

从 2.0 开始，你也可以使用 `path` 来指定需要解压的 zip 文件位置，这种方式使用更少的内存：

```js
const success = await $archiver.unzip({
  path: "archive.zip",
  dest: "folder"
});
```
```

## docs/extend/browser.md

```markdown
# $browser.exec

用来提供一个基于 webView 的 js 环境，这样的话你可以使用一些 Web APIs：

```js
$browser.exec({
  script: function() {
    const parser = new DOMParser();
    const doc = parser.parseFromString("<a>hey</a>", "application/xml");
    // $notify("customEvent", {"key": "value"})
    return doc.children[0].innerHTML;
  },
  handler: function(result) {
    $ui.alert(result);
  },
  customEvent: function(message) {

  }
})
```

# 方便的简写

你可以通过 Promise 写成非常简洁的形式：

```js
var result = await $browser.exec("return 1 + 1;");
```

# 如何访问 native 环境的变量

你可以通过类似这样的方式动态创建：

```js
const name = "JSBox";
$browser.exec({
  script: `
  var parser = new DOMParser();
  var doc = parser.parseFromString("<a>hey ${name}</a>", "application/xml");
  return doc.children[0].innerHTML;`,
  handler: function(result) {
    $ui.alert(result);
  }
})
```

通过字符串拼接的方法，name 会被填充为 native 环境的 `var name`。

关于 `$notify` 的使用，可以参考 [web 组件](component/web.md?id=notifyevent-message)。
```

## docs/extend/detector.md

```markdown
> JSBox 自带的文本检测模块，用于方便的提取文本中的特定内容

# $detector

严格的说来，这部分能提供的内容，用原生 JavaScript 的正则表达式同样可以实现，这里只是一个相对简洁的实现方式。

# $detector.date(string)

将文本中所有的日期提取出来：

```js
const dates = $detector.date("2017年10月10日");
```

# $detector.address(string)

将文本中所有的地址提取出来：

```js
const addresses = $detector.address("");
```

# $detector.link(string)

将文本中所有的链接提取出来：

```js
const links = $detector.link("http://apple.com hello http://xteko.com");
```

# $detector.phoneNumber(string)

将文本中所有的电话号码提取出来：

```js
const phoneNumbers = $detector.phoneNumber("18666666666 hello 18777777777");
```
```

## docs/extend/editor.md

```markdown
# $editor

在 JSBox 里，你可以通过 $editor 实现代码编辑器插件，用来控制编辑器的行为，起到辅助编辑的作用。

你可以通过这些接口实现很多功能，例如自己的代码排版规则，或是文字编码工具。

# $editor.text

获取或设置编辑器内的全部文本：

```js
const text = $editor.text;

$editor.text = "Hey!";
```

# $editor.view

获取当前编辑器正在使用的视图：

```js
const editorView = $editor.view;
editorView.alpha = 0.5;
```

# $editor.selectedRange

获取或设置编辑器内选中的范围：

```js
const range = $editor.selectedRange;

$editor.selectedRange = $(0, 10);
```

# $editor.selectedText

获取或设置编辑器内选中的文本：

```js
const text = $editor.selectedText;

$editor.selectedText = "Hey!";
```

# $editor.hasText

检查编辑器是否有内容：

```js
const hasText = $editor.hasText;
```

# $editor.isActive

获取编辑器当前是否处于激活状态：

```js
const isActive = $editor.isActive;
```

# $editor.canUndo

判断当前的编辑器是否可以执行撤销操作：

```js
const canUndo = $editor.canUndo;
```

# $editor.canRedo

判断当前的编辑器是否可以执行重做操作：

```js
const canRedo = $editor.canRedo;
```

# $editor.save()

保存当前编辑器的改动：

```js
$editor.save();
```

# $editor.undo()

对当前编辑器执行撤销操作：

```js
$editor.undo();
```

# $editor.redo()

对当前编辑器执行重做操作：

```js
$editor.redo();
```

# $editor.activate()

激活当前的编辑器：

```js
$editor.activate()
```

# $editor.deactivate()

结束当前编辑器的激活状态：

```js
$editor.deactivate()
```

# $editor.insertText(text)

插入文本到当前选中区域：

```js
$editor.insertText("Hello");
```

# $editor.deleteBackward()

删除光标前的字符：

```js
$editor.deleteBackward();
```

# $editor.textInRange(range)

获取当前编辑器里某个范围内的文本：

```js
const text = $editor.textInRange($range(0, 10));
```

# $editor.setTextInRange(text, range)

设置当前编辑器里某个范围内的文本：

```js
$editor.setTextInRange("Hey!", $range(0, 10));
```
```

## docs/extend/intro.md

```markdown
# 扩展接口

有一些接口是 JSBox 特有的，并不是仅仅对 iOS 原生 SDK 的扩展，这一部分接口我们会放在这里。

就目前而言这里的接口只有 `文本`、`分享` 和 `二维码` 几个组件，将会在日后的更新中逐步完善。

# $text

文本扩展组件，在这里封装一些对字符串的常见方法，或许你可以在 JavaScript 里面找到别的代替方案，但这个也许更好。

# $share

将文字、图片或链接等信息通过这个组件分享到社交平台。

# $qrcode

可以用这个组件进行二维码生成、解析和扫描。

# $browser

用来模拟浏览器环境，可以使用 BOM 和 DOM。

# $detector

用于检查文本中的链接、日期等内容。
```

## docs/extend/push.md

```markdown
> 用于构建本地的推送通知，例如一段时间之后提醒

# $push.schedule(object)

设定一个本地推送消息：

```js
$push.schedule({
  title: "标题",
  body: "内容",
  delay: 5,
  handler: function(result) {
    const id = result.id;
  }
})
```

将会在代码执行后 5 秒接收到一个本地推送消息。

参数 | 类型 | 说明
---|---|---
title | string | 标题
body | string | 内容
id | string | 标识符（可选）
sound | string | 声音
mute | bool | 是否静音
repeats | bool | 是否重复
script | string | 脚本名称
height | number | 3D Touch 页面高度
query | json | 额外参数，会被传递到 $context.query
attachments | array | 媒体文件，例如 ["assets/icon.png"]
renew | bool | 是否重复创建（固定通知）

上述样例代码是通过 delay 来触发一个通知，你也可以通过 date 来触发：

```js
const date = new Date();
date.setSeconds(date.getSeconds() + 10)

$push.schedule({
  title: "标题",
  body: "内容",
  date,
  handler: function(result) {
    const id = result.id;
  }
})
```

除此之外，你还能设置一个基于地理位置触发的通知：

```js
$push.schedule({
  title: "标题",
  body: "内容",
  region: {
    lat: 0, // latitude
    lng: 0, // longitude
    radius: 1000, // meters
    notifyOnEntry: true, // notify on entry
    notifyOnExit: true // notify on exit
  }
})
```

该方法调用后会请求用户授权地理位置，若用户拒绝授权则推送不会成功。

从 v1.10.0 开始，$push 支持了通过 script 字段来设置一个脚本，在用户点击推送之后会执行脚本，也可以通过 3D Touch 来预览。

# $push.cancel(object)

取消一个计划内的推送消息：

```js
$push.cancel({
  title: "标题",
  body: "内容",
})
```

将会取消以 `title` 和 `body` 组成的所有推送消息。

当你有多个标题和内容重复的推送时，你可以使用上述代码得到的 id 来取消：

```js
$push.cancel({id: ""})
```

# $push.clear()

清除当前脚本所有通知（在 Build 462 之前注册的通知会被忽略）：

```js
$push.clear()
```
```

## docs/extend/qrcode.md

```markdown
> JSBox 自带的二维码模块，可以进行编解码和扫描

# $qrcode.encode(string)

将字符串转换成一个二维码图片：

```js
const image = $qrcode.encode("https://apple.com");
```

# $qrcode.decode(image)

将二维码图片解码成字符串：

```js
const text = $qrcode.decode(image);
```

# $qrcode.scan(function)

开始扫描二维码，用户完成扫描之后返回字符串：

```js
$qrcode.scan(text => {
  
})
```

当用户取消扫描时，也支持回调，例如：

```js
$qrcode.scan({
  useFrontCamera: false, // Optional
  turnOnFlash: false, // Optional
  handler(string) {
    $ui.toast(string)
  },
  cancelled() {
    $ui.toast("Cancelled")
  }
})
```
```

## docs/extend/share.md

```markdown
> 提供了将图片或文字等信息分享到社交网络的相关方法

# $share.sheet(object)

调用系统的 `share sheet` 分享内容：

```js
$share.sheet(["https://apple.com", "apple"])
```

既可以分享一个数组，也可以分享单独的一个数据。

目前支持的数据类型：`文本`、`链接`、`图片`和`二进制数据`（data）。

当分享二进制数据的时候，可以指定文件名：

```js
$share.sheet([
  {
    "name": "sample.mp4",
    "data": data
  }
])
```

从 Build 80 开始，支持指定回调：

```js
$share.sheet({
  items: [
    {
      "name": "sample.mp4",
      "data": data
    }
  ], // 也支持 item
  handler: function(success) {

  }
})
```

# $share.wechat(object)

分享内容到微信：

```js
$share.wechat(image)
```

将会自动识别分享内容的数据类型，目前支持`文字`、`图片`和`图片二进制数据`。

# $share.qq(object)

分享内容到 QQ:

```js
$share.qq(image)
```

将会自动识别分享内容的数据类型，目前支持`文字`、`图片`和`图片`二进制数据。

# $share.universal(object)

调用 JSBox 内置的分享面板分享内容：

```js
$share.universal(image)
```

将会自动识别分享内容的数据类型，目前支持`图片`和`图片`二进制数据。
```

## docs/extend/text.md

```markdown
> 提供了大量的用于文字处理的接口

# $text.uuid

生成一个 UUID 字符串：

```js
const uuid = $text.uuid;
```

# $text.tokenize(object)

对文本进行分词处理：

```js
$text.tokenize({
  text: "我能吞下玻璃而不伤身体",
  handler: function(results) {

  }
})
```

# $text.analysis(object)

// TODO: 对文本进行自然语言分析

# $text.lookup(string)

在系统内置词典中查找文本：

```js
$text.lookup("apple")
```

# $text.speech(object)

文本转成语音：

```js
$text.speech({
  text: "Hello, World!",
  rate: 0.5,
  language: "zh-CN", // optional
})
```

你可以将此过程暂停/继续或停止：

```js
const speaker = $text.speech({});
speaker.pause()
speaker.continue()
speaker.stop()
```

可以通过 `events` 来获取状态：

```js
$text.speech({
  text: "Hello, World!",
  events: {
    didStart: (sender) => {},
    didFinish: (sender) => {},
    didPause: (sender) => {},
    didContinue: (sender) => {},
    didCancel: (sender) => {},
  }
})
```

支持语言列表：

```
ar-SA
cs-CZ
da-DK
de-DE
el-GR
en-AU
en-GB
en-IE
en-US
en-US
en-ZA
es-ES
es-MX
fi-FI
fr-CA
fr-FR
he-IL
hi-IN
hu-HU
id-ID
it-IT
ja-JP
ko-KR
nl-BE
nl-NL
no-NO
pl-PL
pt-BR
pt-PT
ro-RO
ru-RU
sk-SK
sv-SE
th-TH
tr-TR
zh-CN
zh-HK
zh-TW
```

# $text.ttsVoices

获取当前设备支持的语音列表，可以选择一个用于指定 $text.speech 语音：

```js
const voices = $text.ttsVoices;
console.log(voices);

$text.speech({
  text: "Hello, World!",
  voice: voices[0]
});
```

Voice 对象结构

属性 | 类型 | 读写 | 说明
---|---|---|---
language | string | 只读 | 语言
identifier | string | 只读 | 标识符
name | string | 只读 | 名称
quality | number | 只读 | 语音质量
gender | number | 只读 | 声音性别
audioFileSettings | object | 只读 | 音频文件设置

# $text.base64Encode(string)

Base64 encode.

# $text.base64Decode(string)

Base64 decode.

# $text.URLEncode(string)

URL encode.

# $text.URLDecode(string)

URL decode.

# $text.HTMLEscape(string)

HTML escape.

# $text.HTMLUnescape(string)

HTML unescape.

# $text.MD5(string)

MD5.

# $text.SHA1(string)

SHA1.

# $text.SHA256(string)

SHA256.

# $text.convertToPinYin(text)

将文字转换成汉语拼音。

# $text.markdownToHtml(text)

将 Markdown 文本转换成 HTML 文本。

# $text.htmlToMarkdown(object)

将 HTML 文本转换成 Markdown 文本，这是一个异步接口：

```js
$text.htmlToMarkdown({
  html: "<p>Hey</p>",
  handler: markdown => {

  }
})

// Or
var markdown = await $text.htmlToMarkdown("<p>Hey</p>");
```

# $text.decodeData(object)

将 data 转换成字符串：

```js
const string = $text.decodeData({
  data: file,
  encoding: 4 // default, refer: https://developer.apple.com/documentation/foundation/nsstringencoding
});
```

# $text.sizeThatFits(object)

动态计算文字的高度：

```js
const size = $text.sizeThatFits({
  text: "Hello, World",
  width: 320,
  font: $font(20),
  lineSpacing: 15, // Optional
});
```
```

## docs/extend/xml.md

```markdown
# $xml

JSBox 内置了一个简单易用的 XML 解析器，你可以用它来解析 XML 和 HTML 文档，并支持 `xPath` 和 `CSS selector` 两种查询方式。

# $xml.parse(object)

使用 `parse` 函数完成对字符串或文件的解析：

```js

let xml = 
`
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>
`;

let doc = $xml.parse({
  string: xml, // Or data: data
  mode: "xml", // Or "html", default to xml
});
```

# Document

$xml.parse() 返回一个 XML Document 对象：

```js
let version = doc.version;
let rootElement = doc.rootElement;
```

# Element

Element 对象表示 XML Document 上面的某一个节点，具有如下属性：

属性 | 类型 | 读写 | 说明
---|---|---|---
node | string | 只读 | 包括 tag 在内的字符串表示
document | $xmlDoc | 只读 | 此节点的 Document
blank | bool | 只读 | 节点是否为空
namespace | string | 只读 | 命名空间
tag | string | 只读 | tag
lineNumber | number | 只读 | 行数
attributes | object | 只读 | attributes
parent | $xmlElement | 只读 | 父节点
previous | $xmlElement | 只读 | 前一个兄弟节点
next | $xmlElement | 只读 | 后一个兄弟节点
string | string | 只读 | 节点的字符串表示
number | number | 只读 | 节点的数字表示
date | Date | 只读 | 节点的 Date 类型表示

# Element.firstChild(object)

Document 对象和 Element 对象都通过 xPath, selector 和 tag 获取第一个节点：

```js
let c1 = doc.rootElement.firstChild({
  "xPath": "//food/name"
});

let c2 = doc.rootElement.firstChild({
  "selector": "food > serving[units]"
});

let c3 = doc.rootElement.firstChild({
  "tag": "daily-values",
  "namespace": "namespace", // Optional
});
```

# Element.children(object)

Document 对象和 Element 对象都通过 tag 和 namespace 获取子节点：

```js
let children = doc.rootElement.children({
  "tag": "daily-values",
  "namespace": "namespace", // Optional
});

// Get all
let allChildren = doc.rootElement.children();
```

# Element.enumerate(object)

Document 对象和 Element 对象都通过 xPath 和 CSS selector 枚举：

```js
let element = doc.rootElement;
element.enumerate({
  xPath: "//food/name", // Or selector (e.g. food > serving[units])
  handler: (element, idx) => {

  }
});
```

# Element.value(object)

Document 对象和 Element 对象都通过 attribute 和 namespace 获取值：

```js
let value = doc.rootElement.value({
  "attribute": "attribute",
  "namespace": "namespace", // Optional
});
```

# Document.definePrefix(object)

Document 对象可以通过 definePrefix 定义命名空间前缀：

```js
doc.definePrefix({
  "prefix": "prefix",
  "namespace": "namespace"
});
```

请参考这个样例来了解更多：https://github.com/cyanzhong/xTeko/tree/master/extension-demos/xml-demo
```

## docs/file/design.md

```markdown
# 设计思路

在 JSBox 里面我们提供了访问文件系统的接口，目的是为了让扩展程序可以把文件存储到磁盘上，例如下载下来的数据。

众所周知 iOS 有沙盒机制，简单说每个 app 可以用的文件系统是被彼此独立开来的，互不干扰，同时 app 能访问的目录是很有限的。

JSBox 里面的文件读写则像是一个 `沙盒中的沙盒`，每个扩展程序的目录都是独立的，也会随着扩展程序的删除或者重命名被清理掉，这样能保证各个扩展程序之间互不干扰，同时也能减少垃圾文件的产生，避免干扰到 JSBox 文件目录下的其他数据。

所以基本原则就是，并不是任何路径都能进行文件读写，当然 JSBox 的接口屏蔽了这些细节，扩展的编写者无须关心具体路径是什么（也无从知晓）。

以上是一点小小的说明。

# 共享目录

为了多个扩展之间共享一些文件，除了每个扩展自己的目录，JSBox 也提供了一个共享的目录，路径以 `shared://` 开头即可。

请注意，共享目录的文件可以被所有的扩展任意读写。

# iCloud Drive

另外，文件系统支持读写 iCloud Drive 内的文件，路径以 `drive://` 开头即可。

请注意，当用户未开启 iCloud 或未允许 JSBox 使用 iCloud Drive 时，iCloud 相关操作将会失败。

# Inbox

文件系统可以读取通过 AirDrop 导入到 JSBox 应用内的文件，路径以 `inbox://` 开头即可。

请注意，Inbox 内的文件可以被所有的扩展任意读写。

# 绝对路径

当需要处理绝对路径的时候，可以通过 `absolute://` 开头来表示当前传入的路径是一个绝对路径。

例如 `$file.copy(...)` 接口，当目标路径为绝对路径时，需要通过上述协议来为该接口提供信息。
```

## docs/file/drive.md

```markdown
> $drive 用于操作 iCloud Drive 下的文件，与 $file 高度类似

# iCloud Drive

JSBox 支持 iCloud Drive 文件的操作，主要操作有三种类型：

- `$drive.open` 让用户选择文件
- `$drive.save` 让用户存储文件
- `$drive.read` 等和 `$file.read` 一致的接口

# $drive.open

打开 iOS 的文件选择器让用户选择一个文件：

```js
$drive.open({
  handler: function(data) {
    
  }
})
```

可以传入 `types` 用于限定文件 UTI:

```js
types: ["public.png"]
```

也可以通过指定 `multi` 来允许多选：

```js
const files = await $drive.open({ multi: true });
```

在这种情况下，返回的 `files` 是一个 data 的数组。

# $drive.save

打开 iOS 文件选择器让用户把文件存储到 iCloud Drive:

```js
$drive.save({
  data: $data({string: "Hello, World!"}),
  name: "File Name",
  handler: function() {

  }
})
```

# $drive.read

此接口效果与 `$file.read` 完全相同：

```js
const file = $drive.read("demo.txt");
```

不同之处是在于这个接口会从 JSBox 的 iCloud Drive 文件夹读取相应的子目录。

另外，此操作等价于：

```js
const file = $file.read("drive://demo.txt");
```

# $drive.xxx

同样的，`$drive` 也提供了类似 `$file` 的其他方法：

- `$drive.read` vs [$file.read](file/method.md?id=filereadpath)
- `$drive.download` vs [$file.download](file/method.md?id=filedownloadpath)
- `$drive.write` vs [$file.write](file/method.md?id=filewriteobject)
- `$drive.delete` vs [$file.delete](file/method.md?id=filedeletepath)
- `$drive.list` vs [$file.list](file/method.md?id=filelistpath)
- `$drive.copy` vs [$file.copy](file/method.md?id=filecopyobject)
- `$drive.move` vs [$file.move](file/method.md?id=filemoveobject)
- `$drive.mkdir` vs [$file.mkdir](file/method.md?id=filemkdirpath)
- `$drive.exists` vs [$file.exists](file/method.md?id=fileexistspath)
- `$drive.isDirectory` vs [$file.isDirectory](file/method.md?id=fileisdirectorypath)
- `$drive.absolutePath` vs [$file.absolutePath](file/method.md?id=fileabsolutepath)
```

## docs/file/method.md

```markdown
> 提供安全的接口用于操作沙盒内的文件

# $file.read(path)

读取文件：

```js
const file = $file.read("demo.txt");
```

# $file.download(path) -> Promise

当使用 `drive://` 路径时，这个方法先会保证文件被下载下来，然后返回其数据：

```js
const data = await $file.download("drive://.test.db.icloud");
```

# $file.write(object)

写入文件：

```js
const success = $file.write({
  data: $data({string: "Hello, World!"}),
  path: "demo.txt"
});
```

# $file.delete(path)

删除文件：

```js
const success = $file.delete("demo.txt");
```

# $file.list(path)

获取目录下所有文件名：

```js
const contents = $file.list("download");
```

# $file.copy(object)

复制文件：

```js
const success = $file.copy({
  src: "demo.txt",
  dst: "download/demo.txt"
});
```

# $file.move(object)

移动文件：

```js
const success = $file.move({
  src: "demo.txt",
  dst: "download/demo.txt"
});
```

# $file.mkdir(path)

创建文件夹：

```js
const success = $file.mkdir("download");
```

# $file.exists(path)

判断文件/目录是否存在：

```js
const exists = $file.exists("demo.txt");
```

# $file.isDirectory(path)

判断某个路径是否是目录：

```js
const isDirectory = $file.isDirectory("download");
```

# $file.merge(args)

将多个文件合并成一个：

```js
$file.merge({
  files: ["assets/1.txt", "assets/2.txt"],
  dest: "assets/merged.txt",
  chunkSize: 1024 * 1024, // optional, default is 1024 * 1024
});
```

将一个文件分割成多个：

```js
$file.split({
  file: "assets/merged.txt",
  chunkSize: 1024, // optional, default is 1024
});
```

文件将会被分割成 merged-001.txt, merged-002.txt, ...

# $file.absolutePath(path)

返回一个相对路径对应的绝对路径：

```js
const absolutePath = $file.absolutePath(path);
```

# $file.rootPath

返回文档根目录的文件路径（以绝对路径的形式）：

```js
const rootPath = $file.rootPath;
```

# $file.extensions

返回所有安装的 JavaScript extension 文件名：

```js
const extensions = $file.extensions;
```

# shared://

上述示例操作都是在扩展各自的目录下进行文件读写，如果目录以 `shared://` 开头，则读写操作都发生在共享目录，可以被别的扩展读取和覆盖：

```js
const file = $file.read("shared://demo.txt");
```

# drive://

用于读写在 iCloud Drive 目录下的文件和子目录：

```js
const file = $file.read("drive://demo.txt");
```
```

## docs/foundation/app.md

```markdown
> 和 JSBox 本身相关或和正在运行的脚本相关的接口

# $app.theme

为脚本指定 `theme`，用于 [Dark Mode](uikit/dark-mode.md) 相关，可选值为 `light` / `dark` / `auto`。

如果某个页面指定了 `theme`，则这个全局的值会被覆盖。

# $app.minSDKVer

指定此扩展可用的最低 SDK 版本（SDK 版本即 JSBox 的版本）：

```js
$app.minSDKVer = "3.1.0"
```

# $app.minOSVer

指定此扩展可用的最低 iOS 版本：

```js
$app.minOSVer = "10.3.3"
```

注：版本号都是小数点分割的两个数字或三个数字，从前往后依次比较大小。

# $app.tips(string)

给用户展示一个使用提示，效果如同 `$ui.alert`，但请注意这个提示只会运行一次：

```js
$app.tips("在 App Store 内通过分享面板使用")
```

# $app.info

返回 app 本身的信息，例如：

```js
{
  "bundleID": "app.cyan.jsbox",
  "version": "3.0.0",
  "build": "9527",
}
```

# $app.idleTimerDisabled

设置成 true 时屏幕不会自动休眠：

```js
$app.idleTimerDisabled = true
```

# $app.close(delay)

关闭当前的扩展，请注意扩展被关闭之后的代码都不会再被执行。

`delay` 表示延迟的秒数，可以缺省，缺省即立即关闭。

> 注：当一个扩展没有界面时，建议在逻辑完成之后手动调用 $app.close()，这样可以把引擎关闭。

# $app.isDebugging

检查当前是否在调试状态：

```js
if ($app.isDebugging) {
  
}
```

# $app.env

获得此扩展当前运行的环境：

```js
const env = $app.env;
```

参数 | 说明
---|---
$env.app | 主应用
$env.today | 通知中心小组件
$env.action | Action 扩展
$env.safari | Safari 扩展
$env.notification | 通知
$env.keyboard | 键盘扩展
$env.siri | Siri 环境
$env.widget | 桌面小组件
$env.all | 所有环境（默认值）

我们可以如此来判断扩展是否运行在通知中心：

```js
if ($app.env == $env.today) {

}
```

# $app.widgetIndex

因为 JSBox 支持多个小组件，你可以通过这个值判断哪个小组件正在被使用：

```js
const index = $app.widgetIndex;

// 0 ~ 2，其他值表示不是小组件
```

# $app.autoKeyboardEnabled

在某些滚动列表里面，可能会出现键盘遮挡住输入框的情况，开启之后将会自动避免这个问题：

```js
$app.autoKeyboardEnabled = true
```

# $app.keyboardToolbarEnabled

同样在滚动列表里，为键盘展示一个工具栏将会让输入更加方便，尤其是对于多个输入框：

```js
$app.keyboardToolbarEnabled = true
```

# $app.rotateDisabled

设置为 true 时屏幕将不可以旋转：

```js
$app.rotateDisabled = true
```

# $app.openURL(string)

打开一个 URL，例如打开微信：

```js
$app.openURL("weixin://")
```

# $app.openBrowser(object)

在用户安装了某个浏览器的情况下，通过某个浏览器打开 URL，例如：

```js
$app.openBrowser({
  type: 10000,
  url: "https://apple.com"
})
```

type | 浏览器
---|---
10000 | Chrome
10001 | UC
10002 | Firefox
10003 | QQ
10004 | Opera
10005 | Quark
10006 | iCab
10007 | Maxthon
10008 | Dolphin
10009 | 2345

> 由于各浏览器频繁改动其接口，上述接口并不保证能正确运行。

# $app.openExtension(string)

打开另一个已安装的 JSBox 脚本，例如：

```js
$app.openExtension("demo.js")
```

# $app.listen(object)

监听消息，目前支持 `ready` 和 `exit` 等：

```js
$app.listen({
  // 在应用启动之后调用
  ready: function() {

  },
  // 在应用退出之前调用
  exit: function() {
    
  },
  // 在应用停止响应后调用
  pause: function() {

  },
  // 在应用恢复响应后调用
  resume: function() {

  }
});
```

# $app.notify(object)

发出一个自定义的消息，可被 listen 接收：

```js
$app.listen({
  eventName: function(object) {
    console.log(object);
  }
});

$app.notify({
  name: "eventName",
  object: {"a": "b"}
});
```

```

## docs/foundation/cache.md

```markdown
> 持久化，是程序必备的内容，JSBox 提供了多种持久化方式，这里我们介绍对象缓存。

# 提示

JSBox 提供了对象的内存缓存和文件缓存，需注意缓存的对象要遵循 [NSCoding](https://developer.apple.com/documentation/foundation/nscoding)，默认的 JavaScript 对象都支持。

所有的接口均提供同步操作和异步操作（Async 结尾），可以根据需要选择。

# $cache.set(string, object)

写入缓存：

```js
$cache.set("sample", {
  "a": [1, 2, 3],
  "b": "1, 2, 3"
})
```

# $cache.setAsync(object)

异步写入缓存：

```js
$cache.setAsync({
  key: "sample",
  value: {
    "a": [1, 2, 3],
    "b": "1, 2, 3"
  },
  handler: function(object) {

  }
})
```

# $cache.get(string)

读取缓存：

```js
$cache.get("sample")
```

# $cache.getAsync(object)

异步读取缓存：

```js
$cache.getAsync({
  key: "sample",
  handler: function(object) {

  }
})
```

# $cache.remove(string)

移除缓存：

```js
$cache.remove("sample")
```

# $cache.removeAsync(object)

异步移除缓存：

```js
$cache.removeAsync({
  key: "sample",
  handler: function() {
    
  }
})
```

# $cache.clear()

清除该扩展的全部缓存，并不会影响其他扩展产生的任何缓存：

```js
$cache.clear()
```

# $cache.clearAsync(object)

异步清除该扩展的全部缓存：

```js
$cache.clearAsync({
  handler: function() {

  }
})
```
```

## docs/foundation/clipboard.md

```markdown
> 剪贴板对于 iOS 的数据分享和交换很重要，JSBox 提供了很多相关接口。

# $clipboard.text

```js
// 获取剪贴板文本
const text = $clipboard.text;
// 设置剪贴板文本
$clipboard.text = "Hello, World!"
```

# $clipboard.image

```js
// 获取剪贴板图片，请注意返回的是二进制数据
const data = $clipboard.image;
// 设置剪贴板图片
$clipboard.image = data
```

# $clipboard.items

```js
// 获取剪贴板中的所有项目
const items = $clipboard.items;
// 设置剪贴板中的所有项目
$clipboard.items = items
```

# $clipboard.phoneNumbers

获取剪贴板中的所有电话号码。

# $clipboard.phoneNumber

获取剪贴板中的第一个电话号码。

# $clipboard.links

获取剪贴板中的所有链接。

# $clipboard.link

获取剪贴板中的第一个链接。

# $clipboard.emails

获取剪贴板中的所有 email。

# $clipboard.email

获取剪贴板中的第一个 email。

# $clipboard.dates

获取剪贴板中的所有日期。

# $clipboard.date

获取剪贴板中的第一个日期。

# $clipboard.setTextLocalOnly(string)

设置剪贴板的文本，但忽略 `Universal Clipboard`：

# $clipboard.set(object)

通过 `type` 和 `value` 设置剪贴板，例如：

```js
$clipboard.set({
  "type": "public.plain-text",
  "value": "Hello, World!"
})
```

# $clipboard.copy(object)

此方法可以设置剪贴板过期时间：

```js
$clipboard.copy({
  text: "Temporary text",
  ttl: 20
})
```

支持参数：

属性 | 类型 | 说明
---|---|---
text | string | 文本
image | image | 图片
data | data | 数据
ttl | number | 几秒之后过期
locally | bool | 本地剪贴板

*关于 `UTTypes` 的介绍：https://developer.apple.com/documentation/mobilecoreservices/uttype*

# $clipboard.clear()

清除剪贴板里面的全部内容。
```

## docs/foundation/device.md

```markdown
> 在这里可以获取和设备有关的一些信息，例如设备语言、设备型号等等。

# $device.info

返回设备的基本信息，例如：

```js
{
  "model": "string",
  "language": "string",
  "version": "string",
  "name": "cyan's iPhone",
  "screen": {
    "width": 240,
    "height": 320,
    "scale": 2.0,
    "orientation": 1,
  },
  "battery": {
    "state": 1, // 0: unknown 1: normal 2: charging 3: charging & fully charged
    "level": 0.9399999976158142
  }
}
```

# $device.ssid

获取当前 Wi-Fi 的 SSID 信息：

```js
const ssid = $device.ssid;
```

返回数据样例：

```json
{
  "SSIDDATA": {},
  "BSSID": "aa:bb:cc:dd:ee:ff",
  "SSID": "SSID"
}
```

注：在 iOS 13 上，使用此接口需要应用具备地理位置权限，你可以通过 `$location` 相关接口获得权限。

# $device.networkType

获取当前设备的网络类型：

```js
const networkType = $device.networkType;
```

数值 | 说明
---|---
0 | 无网络
1 | Wi-Fi
2 | 蜂窝数据

# $device.space

获取设备的内存/磁盘空间：

```js
const space = $device.space;
```

返回数据样例：

```json
{
  "disk": {
    "free": {
      "bytes": 87409733632,
      "string": "87.41 GB"
    },
    "total": {
      "bytes": 127989493760,
      "string": "127.99 GB"
    }
  },
  "memory": {
    "free": {
      "bytes": 217907200,
      "string": "207.8 MB"
    },
    "total": {
      "bytes": 3221225472,
      "string": "3 GB"
    }
  }
}
```

# $device.taptic(number)

在有 Taptic Engine 的设备上触发一个轻微的振动，例如：

```js
$device.taptic(0)
```

参数 | 类型 | 说明
---|---|---
level | number | 0 ~ 2 表示振动等级

# $device.wlanAddress

获得局域网 IP 地址：

```js
const address = $device.wlanAddress;
```

# $device.isDarkMode

检查设备是否处于 Dark Mode 状态：

```js
if ($device.isDarkMode) {
  
}
```

# $device.isXXX

快速检查设备屏幕类型：

```js
const isIphoneX = $device.isIphoneX;
const isIphonePlus = $device.isIphonePlus;
const isIpad = $device.isIpad;
const isIpadPro = $device.isIpadPro;
```

# $device.hasTouchID

检查是否支持 Touch ID:

```js
const hasTouchID = $device.hasTouchID;
```

# $device.hasFaceID

检查是否支持 Face ID:

```js
const hasFaceID = $device.hasFaceID;
```

# $device.isJailbroken

检查设备是否越狱：

```js
const isJailbroken = $device.isJailbroken;
```

# $device.isVoiceOverOn

检查是否在使用 VoiceOver:

```js
const isVoiceOverOn = $device.isVoiceOverOn;
```
```

## docs/foundation/intro.md

```markdown
# 基础接口

这一部分内容我们主要介绍 JSBox 里面最最基本的接口，按理说这些部分是构成一个扩展程序十分必要的部分。

主要会包括 `app/设备/缓存/网络` 等琐事。

# $device

和设备本身相关的接口会放在这里。

# $app

和应用本身相关的接口被组织在这里。

# $system

这里会放置和系统有关的各种接口。

# $http

通过这个来实现各种网络请求，比如 `GET`/`POST`。

# $cache

当你需要缓存扩展产生的数据的时候，用这个工具。

# $thread

当你需要确保 Native 代码被执行在主线程/子线程的时候，这是一个很好的方式。
```

## docs/foundation/keychain.md

```markdown
> 相较于对象缓存，钥匙串以安全的方式存储密码、登录票据等敏感信息。

# $keychain.set(key, value, domain)

写入到钥匙串：

```js
const succeeded = $keychain.set("key", "value", "my.domain");
```

> 当提供 `domain` 时，`key` 应该在您的脚本内唯一。反之，`key` 应该在所有脚本内唯一。

# $keychain.get(key, domain)

从钥匙串中读取：

```js
const item = $keychain.get("key", "my.domain");
```

> 当提供 `domain` 时，`key` 应该在您的脚本内唯一。反之，`key` 应该在所有脚本内唯一。

# $keychain.remove(key, domain)

删除一个钥匙串项目：

```js
const succeeded = $keychain.remove("key", "my.domain");
```

> 当提供 `domain` 时，`key` 应该在您的脚本内唯一。反之，`key` 应该在所有脚本内唯一。

# $keychain.clear(domain)

删除所有的钥匙串项目：

```js
const succeeded = $keychain.clear("my.domain");
```

> `domain` 为必填项。

# $keychain.keys(domain)

获取所有钥匙串键：

```js
const keys = $keychain.keys("my.domain");
```

> `domain` 为必填项。
```

## docs/foundation/l10n.md

```markdown
> 让你的程序支持多种语言环境，将会有利于使用以及传播，这是一个好的观念和习惯。

# $l10n

扩展在显示文字的时候支持多种语言，JSBox 提供了简单的本地化支持，`l10n` 是 `Localization` 的缩写，因为刚好有 10 个字母。

当然，你也可以通过 `$device.info` 获取当前设备的语言，进而手动提供多种语言，`$l10n` 是一个简单的封装，让代码可以更简单。

# $app.strings

本地化工作有两个步骤：

- 通过 `$app.strings` 定义要用到的文本
- 通过 `$l10n` 获取本地化过的文本

示例：

```js
$app.strings = {
  "en": {
    "title": "tortoise"
  },
  "zh-Hans": {
    "title": "乌龟"
  },
  "zh-Hant": {
    "title": "烏龜"
  }
}
```

其中 `en` 表示英文，`zh-Hans` 表示简体中文，`zh-Hant` 表示繁体中文。

当我们使用时，通过 `$l10n` 取出：

```js
const title = $l10n("title");
```

请注意，当用户设备没能找到合适的字符串时，将会有如下回退策略：

- 没有找到对应语言，回退到英语版本
- 没有找到对于的 value，回退到 key 本身
```

## docs/foundation/network.md

```markdown
> 网络模块将是 JSBox 里面最重要的模块之一，他能帮助你完成很多需求。

# $http.request(object)

发起一个 HTTP 请求：

```js
$http.request({
  method: "POST",
  url: "https://apple.com",
  header: {
    k1: "v1",
    k2: "v2"
  },
  body: {
    k1: "v1",
    k2: "v2"
  },
  handler: function(resp) {
    const data = resp.data;
  }
})
```

参数 | 类型 | 说明
---|---|---
method | string | GET/POST/DELETE 等
url | string | 链接
header | object | http header
body | object | http body
timeout | number | 请求超时
form | object | form-data 参数
files | array | 文件列表
proxy | json | 代理设置
progress | function | upload/download 中进度回调
showsProgress | bool | 是否显示进度条
message | string | upload/download 中的提示语
handler | function | 回调函数

`body` 可以是一个 JSON 结构或是一个二进制数据，

如果 `body` 是一个 JSON 结构：

- 当 header 中的 `Content-Type` 为 `application/json` 时，body 将会以 `json` 的形式编码
- 当 header 中的 `Content-Type` 为 `application/x-www-form-urlencoded` 时，body 将会转换成 `a=b&c=d` 的 query 结构
- `Content-Type` 默认值是 `application/json`

如果 `body` 是一个二进制数据：

这 http body 不会进行编码，会直接使用传进来的数据。

`form` 和 `files` 样例见 `$http.upload`。

返回数据 `resp` 的结构：

参数 | 类型 | 说明
---|---|---
data | string | json 数据会自动 parse
rawData | data | 原始返回的二进制数据
response | response | [请参考](object/response.md)
error | error | [请参考](object/error.md)

代理设置：

```js
{
  proxy: {
    "HTTPEnable": true,
    "HTTPProxy": "",
    "HTTPPort": 0,
    "HTTPSEnable": true,
    "HTTPSProxy": "",
    "HTTPSPort": 0
  }
}
```

# $http.get(object)

发起一个 `GET` 请求，例如：

```js
$http.get({
  url: "https://apple.com",
  handler: function(resp) {
    const data = resp.data;
  }
})
```

除 `method` 为 `GET` 以外，参数和 `$http.request` 一致。

# $http.post(object)

发起一个 `POST` 请求，例如：

```js
$http.post({
  url: "https://apple.com",
  handler: function(resp) {
    const data = resp.data;
  }
})
```

除 `method` 为 `POST` 以外，参数和 `$http.request` 一致。

# $http.download(object)

参数和上述完全一样，不同之处在于此方法返回的 `data` 是一个二进制数据：

```js
$http.download({
  url: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg",
  showsProgress: true, // Optional, default is true
  backgroundFetch: true, // Optional, default is false
  progress: function(bytesWritten, totalBytes) {
    const percentage = bytesWritten * 1.0 / totalBytes;
  },
  handler: function(resp) {
    $share.sheet(resp.data)
  }
})
```

# $http.upload(object)

文件上传接口，此处以[七牛云](https://www.qiniu.com/)为例：

```js
$photo.pick({
  handler: function(resp) {
    const image = resp.image;
    if (image) {
      $http.upload({
        url: "http://upload.qiniu.com/",
        form: {
          token: "<token>"
        },
        files: [
          {
            "image": image,
            "name": "file",
            "filename": "file.png"
          }
        ],
        progress: function(percentage) {

        },
        handler: function(resp) {
          
        }
      })
    }
  }
})
```

从相册选取一张图片上传到七牛云，需要填入你自己的 token，此处仅为示例。

`form` 参数表示 form-data 中其他的参数，例如上述的 `token`。

`files` 参数文件结构定义：

参数 | 类型 | 说明
---|---|---
image | object | 图片
data | object | 二进制数据
name | string | 上传表单中的名称
filename | string | 上传之后的文件名
content-type | string | 文件格式

# $http.startServer(object)

启动一个 Web 服务器，将本地目录放到服务器以提供 HTTP 接口访问：

```js
$http.startServer({
  port: 5588, // port number
  path: "", // script root path
  handler: function(result) {
    const url = result.url;
  }
})
```

这将会把脚本的根目录作为 server 的根目录，你可以通过获取到的 url 访问这个目录，我们提供了一个 Web 界面供用户在浏览器中访问。

同时这个 Web 服务器提供以下几个 HTTP 接口来进行操作：

- `GET` /list?path=path 获得文件列表
- `GET` /download?path=path 下载文件
- `POST` /upload `{"files[]": file}` 上传文件
- `POST` /move `{"oldPath": "", "newPath": ""}` 移动文件
- `POST` /delete `{"path": ""}` 删除文件
- `POST` /create `{"path": ""}` 创建文件夹

请使用你的 HTTP 相关知识理解上述内容，在此不再赘述。

# $http.stopServer()

将启动的 Web 服务器停掉：

```js
$http.stopServer()
```

# $http.shorten(object)

生成短连接：

```js
$http.shorten({
  url: "https://apple.com",
  handler: function(url) {

  }
})
```

# $http.lengthen(object)

展开一个短连接：

```js
$http.lengthen({
  url: "http://t.cn/RJZxkFD",
  handler: function(url) {

  }
})
```

# $network.ifa_data

获得网卡`接收/发送`数据：

```js
const ifa_data = $network.ifa_data;
console.log(ifa_data)
```

样例输出：

```json
{
  "en0" : {
    "received" : 2581234688,
    "sent" : 469011456
  },
  "awdl0" : {
    "received" : 2231296,
    "sent" : 8180736
  },
  "utun0" : {
    "received" : 0,
    "sent" : 0
  },
  "pdp_ip1" : {
    "received" : 2048,
    "sent" : 2048
  },
  "pdp_ip0" : {
    "received" : 2215782400,
    "sent" : 211150848
  },
  "en2" : {
    "received" : 5859328,
    "sent" : 6347776
  },
  "utun2" : {
    "received" : 0,
    "sent" : 0
  },
  "lo0" : {
    "received" : 407684096,
    "sent" : 407684096
  },
  "utun1" : {
    "received" : 628973568,
    "sent" : 35312640
  }
}
```

# $network.interfaces

获取当前设备所有的网络接口：

```js
const interfaces = $network.interfaces;

// E.g. { 'en0/ipv4': 'x.x.x.x' }
```

# $network.startPinging(object)

开始 Ping:

```js
$network.startPinging({
  host: "google.com",
  timeout: 2.0, // default
  period: 1.0, // default
  payloadSize: 56, // default
  ttl: 49, // default
  didReceiveReply: function(summary) {

  },
  didReceiveUnexpectedReply: function(summary) {

  },
  didSendPing: function(summary) {

  },
  didTimeout: function(summary) {

  },
  didFail: function(error) {

  },
  didFailToSendPing: function(response) {

  }
})
```

`summary` 结构：

```json
{
  "sequenceNumber": 0,
  "payloadSize": 0,
  "ttl": 0,
  "host": "",
  "sendDate": null,
  "receiveDate": null,
  "rtt": 0,
  "status": 0
}
```

更多信息请参考：https://github.com/lmirosevic/GBPing

# $network.stopPinging()

停止 Ping。

# $network.proxy_settings

与 [CFNetworkCopySystemProxySettings](https://developer.apple.com/documentation/cfnetwork/1426754-cfnetworkcopysystemproxysettings) 效果相同。
```

## docs/foundation/prefs.md

```markdown
> 以最简单的配置文件为脚本应用提供配置项

# prefs.json

从 v1.51.0 开始，你只需要在应用根目录配置一个 `prefs.json` 文件，JSBox 就可以自动为你生成配置页面，从而为用户提供更为友好的设置界面。

来看一个例子：

```json
{
  "title": "SETTINGS",
  "groups": [
    {
      "title": "GENERAL",
      "items": [
        {
          "title": "USER_NAME",
          "type": "string",
          "key": "user.name",
          "value": "default user name"
        },
        {
          "title": "AUTO_SAVE",
          "type": "boolean",
          "key": "auto.save",
          "value": true
        },
        {
          "title": "OTHERS",
          "type": "child",
          "value": {
            "title": "OTHERS",
            "groups": [
              
            ]
          }
        }
      ]
    }
  ]
}
```

调用下面的代码即可打开配置界面，以供用户设置：

```js
$prefs.open(() => {
  // Done
});
```

# 配置文件结构

配置文件的根节点是一个 `title` 和 `groups` 的 JSON 对象，`title` 会被设置为页面的标题，`groups` 数组则表示当前的设置页的所有分组。

在 `groups` 下面，是由分组标题 `title` 以及所有选项 `items` 组成的 JSON 对象，`items` 数组里面的每一项就是一个具体的设置项。

如果当前页面只有一个分组，也可以简写成：

```json
{
  "title": "GENERAL",
  "items": [
    {
      "title": "USER_NAME",
      "type": "string",
      "key": "user.name",
      "value": "default user name",
      "inline": true // inline edit, default is false
    }
  ]
}
```

配置项节点由下列内容组成：

- `title`: 标题，显示在左侧
- `type`: 类型，比如字符串或是布尔值，下面会详细介绍
- `key`: 存储以及获取设置用的键，需要保证脚本内全局无冲突
- `value`: 在用户没有设置的时候，提供的缺省值，可以不提供
- `placeholder`: 没有输入时显示的提示
- `insetGrouped`: 是否使用 insetGrouped 样式的列表
- `inline`: 文本框是否行内编辑

# title

为了简化多语言环境下的配置，上述配置内容所有的 title 首先会从 `strings` 文件夹配置的字符串里面寻找本地化的字符串，如果没有，才使用字符串本身。

# type

目前配置文件支持下面的类型：

- `string`: 字符串类型，默认多行
- `password`: 密码类型，输入后显示为圆点
- `number`: 浮点数类型
- `integer`: 整数类型
- `boolean`: 布尔值，在页面中显示为一个开关
- `slider`: 0 ~ 1 的浮点数，在页面中显示为一个滑块
- `list`: 用于在一个列表里面选择一个值
- `info`: 显示一个不可变的信息，比如版本号
- `link`: 显示一个链接，点击后会直接打开
- `script`: 可配置一段脚本，点击后会执行
- `child`: 子设置项，点击之后打开一个新的设置页面

对于 `string`, `number` 以及 `integer` 等较为简单的类型，尝试一下即可了解，下面会介绍比较不同的几个。

# type: "password"

与 `type: "string"` 参数相同，用于输入密码等敏感信息。

# type: "slider"

将会显示一个滑块，用于设置 0 ~ 1 之间的浮点数，所以默认值 `value` 也需要符合 0 ~ 1 的定义。

如果你在程序中需要的值不是 0 ~ 1 的数，你需要做一些简单的变换来映射到你的取值区间，请将这个滑块理解成一个百分比滑块。

# type: "list"

在一个列表里面选择一个值，例如：

```json
{
  "title": "IMAGE_QUALITY",
  "type": "list",
  "key": "image.quality",
  "items": ["LOW", "MEDIUM", "HIGH"],
  "value": 1
}
```

界面会让用户在 "LOW", "MEDIUM" 和 "HIGH" 里面选一个值，而 `value` 则是选择的 `index`。同样的，为了本地化的方便，`items` 里面的内容也会从 `strings` 文件夹里面优先取值。

请注意，`items` 仅仅是显示给用户的内容，并不会被存储，而 `value` 存储的实际上是序号。

# type: "script"

有些时候，你可能希望设置项的某一行点击之后是你自己定义的行为，这种类型就是为了这个目的：

```json
{
  "title": "TEST",
  "type": "script",
  "value": "require('scripts/test').runTest();"
}
```

# type: "child"

有些时候，你可能希望将一些不那么重要的设置项放到二级甚至是三级设置里面，你可以通过这个类型做到：

```json
{
  "title": "OTHERS",
  "type": "child",
  "value": {
    "title": "OTHERS",
    "groups": []
  }
}
```

上述节点的 `value` 正是设置页面根节点的结构，你可以把这个结构无限嵌套下去来实现多级设置。

# key

`key` 是用来保存和读取一个设置项用的键，需要保证在脚本内全局唯一。

读取设置：

```js
const name = $prefs.get("user.name");
```

在多数情况下，设置项都应该是由用户通过界面配置的，但为了保证灵活性，你仍然可以像这样主动更新一个设置项：

```js
$prefs.set("user.name", "cyan");
```

# $prefs.all()

返回所有的键值对：

```js
const prefs = $prefs.all();
```

`$prefs` 显然并不能够应对任何设置项，但对于大部分的需求来说以及完全能够满足，并且使用极为简单。这里有一个完整的例子：https://github.com/cyanzhong/xTeko/tree/master/extension-demos/prefs

# $prefs.edit(node)

除了为默认的 `prefs.json` 配置文件提供可视化的编辑，您也可以使用 `$prefs.edit` 函数来编辑任意符合上述格式的 JSON 配置：

```js
const edited = await $prefs.edit({
  "title": "SETTINGS",
  "groups": [
    {
      "title": "GENERAL",
      "items": [
        {
          "title": "USER_NAME",
          "type": "string",
          "key": "user.name",
          "value": "default user name"
        }
        // ...
      ]
    }
  ]
});
```

返回的数据即为用户编辑后的配置文件，通过这样的方法可以为脚本提供更灵活的配置。
```

## docs/foundation/system.md

```markdown
> 和 iOS 系统本身相关的接口

# $system.brightness

设置屏幕，例如：

```js
$system.brightness = 0.5
```

# $system.volume

获取或设置设备音量 (0.0 ~ 1.0)：

```js
$system.volume = 0.5
```

# $system.call(number)

拨打电话，效果等同于 `$app.openURL("tel:number")`。

# $system.sms(number)

发送短信，效果等同于 `$app.openURL("sms:number")`。

# $system.mailto(email)

发送邮件，效果等同于 `$app.openURL("mailto:email")`。

# $system.facetime(number)

FaceTime，效果等同于 `$app.openURL("facetime:number")`。

# $system.makeIcon(object)

为链接创建一个桌面图标：

```js
$system.makeIcon({
  title: "Title",
  url: "https://sspai.com",
  icon: image
})
```
```

## docs/foundation/thread.md

```markdown
> 在这里涉及到线程切换、延时执行、重复执行等内容。

# $thread.background(object)

在子线程执行一段代码：

```js
$thread.background({
  delay: 0,
  handler: function() {

  }
})
```

# $thread.main(object)

在主线程执行一段代码：

```js
$thread.main({
  delay: 0.3,
  handler: function() {
    
  }
})
```

参数 | 类型 | 说明
---|---|---
delay | number | 延迟执行的时间，可选
handler | function | 回调

如果不需要延迟执行，也可以简单地写为：

```js
$thread.main(() => {
  
});
```

# $delay(number, function)

一种更简单的执行延时任务的方法：

```js
$delay(3, () => {
  $ui.alert("Hey!")
})
```

3 秒钟后弹出一个 alert。

你可以通过这个方式取消执行：

```js
const task = $delay(10, () => {

});

// Cancel it
task.cancel();
```

# $wait(sec)

与 $delay 类似但支持 Promise:

```js
await $wait(2);

alert("Hey!");
```

# $timer.schedule(object)

用于执行一个重复的任务：

```js
const timer = $timer.schedule({
  interval: 3,
  handler: function() {
    $ui.toast("Hey!")
  }
});
```

上述代码每隔三秒显示一次 `Hey!`，已经设置的任务可以取消：

```js
timer.invalidate()
```
```

## docs/function/index.md

```markdown
# $l10n

扩展在显示文字的时候支持多种语言，JSBox 提供了简单的本地化支持，`l10n` 是 `Localization` 的缩写，因为刚好有 10 个字母。

当然，你也可以通过 `$device.info` 获取当前设备的语言，进而手动提供多种语言，`$l10n` 是一个简单的封装，让代码可以更简单。

```js
const text = $l10n("MAIN_TITLE");
```

# $delay(number, function)

一种更简单的执行延时任务的方法：

```js
$delay(3, () => {
  $ui.alert("Hey!")
})
```

3 秒钟后弹出一个 alert。

你可以通过这个方式取消执行：

```js
const task = $delay(10, () => {

});

// Cancel it
task.cancel();
```

# $rect(x, y, width, height)

生成一个矩形，例如：

```js
const rect = $rect(0, 0, 100, 100);
```

# $size(width, height)

生成一个大小，例如：

```js
const size = $size(100, 100);
```

# $point(x, y)

生成一个位置，例如：

```js
const point = $point(0, 0);
```

# $insets(top, left, bottom, right)

返回一个边距，例如：

```js
const insets = $insets(10, 10, 10, 10);
```

# $color(string)

返回一个颜色，这里支持两种表达式，十六进制表达式：

```js
const color = $color("#00EEEE");
```

常见颜色名称：

```js
const blackColor = $color("black");
```

名称 | 颜色
---|---
tint | JSBox 主题色
black | 黑色
darkGray | 深灰
lightGray | 浅灰
white | 白色
gray | 灰色
red | 红色
green | 绿色
blue | 蓝色
cyan | 青色
yellow | 黄色
magenta | 品红
orange | 橙色
purple | 紫色
brown | 棕色
clear | 透明

以下颜色为语义化颜色，方便用于 Dark Mode 的适配，他们会在 Dark 和 Light 时展示不同的颜色：

名称 | 颜色
---|---
tintColor | 主题色
primarySurface | 一级背景
secondarySurface | 二级背景
tertiarySurface | 三级背景
primaryText | 一级文字
secondaryText | 二级文字
backgroundColor | 背景颜色
separatorColor | 分割线颜色
groupedBackground | grouped 列表背景色
insetGroupedBackground | insetGrouped 列表背景色

以下颜色为系统默认颜色，参考 [UI Element Colors](https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors)

名称 | 颜色
---|---
systemGray2 | UIColor.systemGray2Color
systemGray3 | UIColor.systemGray3Color
systemGray4 | UIColor.systemGray4Color
systemGray5 | UIColor.systemGray5Color
systemGray6 | UIColor.systemGray6Color
systemLabel | UIColor.labelColor
systemSecondaryLabel | UIColor.secondaryLabelColor
systemTertiaryLabel | UIColor.tertiaryLabelColor
systemQuaternaryLabel | UIColor.quaternaryLabelColor
systemLink | UIColor.linkColor
systemPlaceholderText | UIColor.placeholderTextColor
systemSeparator | UIColor.separatorColor
systemOpaqueSeparator | UIColor.opaqueSeparatorColor
systemBackground | UIColor.systemBackgroundColor
systemSecondaryBackground | UIColor.secondarySystemBackgroundColor
systemTertiaryBackground | UIColor.tertiarySystemBackgroundColor
systemGroupedBackground | UIColor.systemGroupedBackgroundColor
systemSecondaryGroupedBackground | UIColor.secondarySystemGroupedBackgroundColor
systemTertiaryGroupedBackground | UIColor.tertiarySystemGroupedBackgroundColor
systemFill | UIColor.systemFillColor
systemSecondaryFill | UIColor.secondarySystemFillColor
systemTertiaryFill | UIColor.tertiarySystemFillColor
systemQuaternaryFill | UIColor.quaternarySystemFillColor

这些颜色在分别在 Light 和 Dark 模式下使用不同的颜色，例如 `$color("tintColor")` 会在 Light 模式下使用主题色，在 Dark 模式下使用比较亮的蓝色。

可以使用 `$color("namedColors")` 来获取颜色盘里面所有可用的颜色，返回一个字典：

```js
const colors = $color("namedColors");
```

同时，`$color(...)` 接口也可用于返回适配 Dark Mode 需要的动态颜色，像是这样：

```js
const dynamicColor = $color({
  light: "#FFFFFF",
  dark: "#000000"
});
```

该颜色在两种模式下分别为黑色和白色，自动切换，也可以简写为：

```js
const dynamicColor = $color("#FFFFFF", "#000000");
```

写法支持嵌套，你可以用 `$rgba(...)` 接口生成颜色后，用 `$color(...)` 接口生成动态颜色：

```js
const dynamicColor = $color($rgba(0, 0, 0, 1), $rgba(255, 255, 255, 1));
```

另外，JSBox 的 Dark Mode 支持深灰或纯黑两种模式，如果需要对三种状态使用不同的颜色，可以使用：

```js
const dynamicColor = $color({
  light: "#FFFFFF",
  dark: "#141414",
  black: "#000000"
});
```

# $rgb(red, green, blue)

同样是生成颜色，但这里用的是十进制 `0 ~ 255` 的数值：

```js
const color = $rgb(100, 100, 100);
```
# $rgba(red, green, blue, alpha)

同样是生成颜色，但这个支持 `alpha` 通道：

```js
const color = $rgba(100, 100, 100, 0.5);
```

# $font(name, size)

返回一个字体，`name` 字段是可选的：

```js
const font1 = $font(15);
const font2 = $font("bold", 15);
```

其中 name 是 `"bold"` 和 `default` 时，分别会使用粗体和正常字体，否则根据 name 查找系统支持的字体。

有关 iOS 自带的字体请参考：http://iosfonts.com/

# $range(location, length)

返回一个范围，例如：

```js
const range = $range(0, 10);
```

# $indexPath(section, row)

返回一个 indexPath，表示区域和位置，这在 list 和 matrix 视图里面会很常用：

```js
const indexPath = $indexPath(0, 10);
```

# $data(object)

返回一个二进制数据，支持以下构造形式：

```js
// string
const data = $data({
  string: "Hello, World!",
  encoding: 4 // default, refer: https://developer.apple.com/documentation/foundation/nsstringencoding
});
```

```js
// path
const data = $data({
  path: "demo.txt"
});
```

```js
// url
const data = $data({
  url: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg"
});
```

# $image(object, scale)

创建一个 image 对象，支持多种参数类型：

```js
// file path
const image = $image("assets/icon.png");
```

```js
// sf symbols
const image = $image("sunrise");
```

```js
// url
const image = $image("https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg");
```

```js
// base64
const image = $image("data:image/png;base64,...");
```

其中 `scale` 为可选参数，用于设置比例，默认为 1，设置成 0 的时候表示屏幕比例。

在最新版里面，可以使用 `$image(...)` 函数来创建适用于 Dark Mode 的动态图片，例如：

```js
const dynamicImage = $image({
  light: "light-image.png",
  dark: "dark-image.png"
});
```

该图片会分别在 Light 模式和 Dark 模式下使用不同的资源，自动完成切换，也可以简写成：

```js
const dynamicImage = $image("light-image.png", "dark-image.png");
```

除此之外，此接口还支持将图片嵌套，像是这样：

```js
const lightImage = $image("light-image.png");
const darkImage = $image("dark-image.png");
const dynamicImage = $image(lightImage, darkImage);
```

# $icon(code, color, size)

获得一个 JSBox 内置的图标，图标编号请参考：https://github.com/cyanzhong/xTeko/tree/master/extension-icons

使用样例：

```js
$ui.render({
  views: [
    {
      type: "button",
      props: {
        icon: $icon("005", $color("red"), $size(20, 20)),
        bgcolor: $color("clear")
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.size.equalTo($size(24, 24))
      }
    }
  ]
})
```

`color` 是可选参数，不填的话使用默认颜色。

`size` 是可选参数，不填的话使用默认大小。

# $accessibilityAction(title, handler)

创建一个 [UIAccessibilityCustomAction](https://developer.apple.com/documentation/uikit/uiaccessibilitycustomaction)，例如：

```js
{
  type: "view",
  props: {
    isAccessibilityElement: true,
    accessibilityCustomActions: [
      $accessibilityAction("Hello", () => alert("Hello"))
    ]
  }
}
```

# $objc_retain(object)

在有些时候通过 Runtime 声明的对象会被系统释放掉，如果你想要长期持有一个对象，可以使用这个方法：

```js
const manager = $objc("Manager").invoke("new");
$objc_retain(manager)
```

这将在整个脚本运行期间保持 manger 不被释放。

# $objc_release(object)

与 retain 相对应的函数，目的是手动释放掉对象：

```js
$objc_release(manager)
```

# $get_protocol(name)

获得一个 Objective-C 的 Protocol:

```js
const p = $get_protocol(name);
```

# $objc_clean()

清除所有的 Objective-C 定义：

```js
$objc_clean();
```

```

## docs/function/intro.md

```markdown
# 内建函数

除了标准的 JavaScript 内建函数，例如 encodeURI, setTimeout 等，JSBox 还提供了很多内建函数，这些函数可以直接在全局使用。

例如：

```js
const text = $l10n("MAIN_TITLE");
```

可以获得一个本地化的字符串。

为了与 JavaScript 内置的函数有所区分，JSBox 提供的内建函数都以 `$` 开头。
```

## docs/home-widget/intro.md

```markdown
# 桌面小组件

Apple 在 iOS 14 引入了桌面小组件，JSBox `v2.12.0` 提供了全面支持。与此同时，通知中心小组件的支持也进入过时状态，会在未来的 iOS 版本中被 Apple 移除。

桌面小组件相较通知中心小组件有很大的不同，所以我们有必要花点时间来理解一些基本概念。

# 核心概念

桌面小组件的本质是基于时间线的一系列**快照**，而不是动态构建的界面。所以当用户看到小组件时，并不会直接运行小组件所包含的代码。相反，系统会在一些时机（时间线机制，之后会详细说明）调用小组件的代码，代码可以生成一个快照提供给系统。然后系统会在合适的时间展示这些快照，并通过一些策略重新获取一系列新的快照。

此外，桌面小组件仅能有限地处理用户交互：

- 2 * 2 布局仅支持点击整个小组件
- 2 * 4 和 4 * 4 布局支持点击某个控件
- 点击会打开主应用，并携带一个 URL 给主应用处理

这些系统限制决定了桌面小组件的角色更多是**快速展示信息**，并将复杂的交互和任务代理到主应用去执行。

# 配置小组件

JSBox 支持小组件的全部尺寸，添加步骤：

- 在桌面长按后点击左上角的加号
- 找到 JSBox 然后将某个小组件拖拽到桌面
- 在编辑模式选择“编辑小组件”
- 选择某个支持小组件的脚本

相比于通知中心小组件只能运行一个脚本（尽管 JSBox 提供了三个），桌面小组件可以通过上面的配置方式创建出任意多个实例，并且可以通过系统提供的“堆叠”功能将多个小组件叠放在一起，分别展示不同的内容。

具体使用方法，请参照 Apple 或网上提供的教程了解更多。

# 小组件参数

对于每个小组件，您可以设置要运行的脚本，以及提供更多信息的附加参数。

该参数是一个字符串，可以像这样获取：

```js
const inputValue = $widget.inputValue;
```

对于安装包格式的脚本，小组件参数可以由脚本配置文件提供，例如：

```json
[
  {
    "name": "Option 1",
    "value": "Value 1"
  },
  {
    "name": "Option 2",
    "value": "Value 2"
  }
]
```

其中 `name` 是显示给用户选择的标题，`value` 是上述接口实际会取得的值。将配置内容放置为脚本安装包根目录下的 `widget-options.json` 文件即可。

# 样例代码

为了让您可以更好地上手小组件的开发，我们创建了一些样例项目以供参考：

- [WidgetDoodles](https://github.com/cyanzhong/jsbox-widgets/tree/master/WidgetDoodles)
- [AppleDevNews2](https://github.com/cyanzhong/jsbox-widgets/tree/master/AppleDevNews2)
- [QRCode](https://github.com/cyanzhong/jsbox-widgets/blob/master/QRCode.js)
- [xkcd](https://github.com/cyanzhong/jsbox-widgets/blob/master/xkcd.js)
- [clock](https://github.com/cyanzhong/jsbox-widgets/blob/master/clock.js)

我们会在之后完善这个仓库，以提供更多例子。
```

## docs/home-widget/layout.md

```markdown
# 布局

前文我们已经提到过，小组件的布局方式和 `$ui.render` 完全不一样，在阅读 JSBox 相关实现之前，推荐对 SwiftUI 的 layout 系统有个基本了解：

- [View Layout and Presentation](https://developer.apple.com/documentation/swiftui/view-layout-and-presentation)
- [SwiftUI Layout System](https://kean.blog/post/swiftui-layout-system)

简单来说，相比 UIKit 我们对每个视图指定 auto layout 约束的方式，在小组件里面，我们通过 `hstack`, `vstack`, `zstack` 等结构来实现对其子视图的布局。

# type: "hstack"

实现一个横向布局空间，例如：

```js
$widget.setTimeline(ctx => {
  return {
    type: "hstack",
    props: {
      alignment: $widget.verticalAlignment.center,
      spacing: 20
    },
    views: [
      {
        type: "text",
        props: {
          text: "Hello"
        }
      },
      {
        type: "text",
        props: {
          text: "World"
        }
      }
    ]
  }
});
```

其中 `spacing` 指定了控件间的间距，`alignment` 使用 [$widget.verticalAlignment](home-widget/method.md?id=widgetverticalalignment) 来指定控件的纵向对齐方式。

# type: "vstack"

实现一个纵向布局空间，例如：

```js
$widget.setTimeline(ctx => {
  return {
    type: "vstack",
    props: {
      alignment: $widget.horizontalAlignment.center,
      spacing: 20
    },
    views: [
      {
        type: "text",
        props: {
          text: "Hello"
        }
      },
      {
        type: "text",
        props: {
          text: "World"
        }
      }
    ]
  }
});
```

其中 `spacing` 指定了控件间的间距，`alignment` 使用 [$widget.horizontalAlignment](home-widget/method.md?id=widgethorizontalalignment) 来指定控件的横向对齐方式。

# type: "zstack"

实现一个层叠布局空间，例如：

```js
$widget.setTimeline(ctx => {
  return {
    type: "zstack",
    props: {
      alignment: $widget.alignment.center
    },
    views: [
      $color("red"),
      {
        type: "text",
        props: {
          text: "Hello, World!"
        }
      }
    ]
  }
});
```

其中 `alignment` 使用 [$widget.alignment](home-widget/method.md?id=widgetalignment) 来指定控件的对齐方式。

# type: "spacer"

为布局空间增加间距，例如：

```js
$widget.setTimeline(ctx => {
  return {
    type: "hstack",
    views: [
      {
        type: "text",
        props: {
          text: "Hello"
        }
      },
      {
        type: "spacer",
        props: {
          // minLength: 10
        }
      },
      {
        type: "text",
        props: {
          text: "World"
        }
      }
    ]
  }
});
```

这会把两个文本控件挤到布局空间的两侧，`minLength` 表示 spacer 最短的长度。

# type: "hgrid"

实现一个横向的网格空间，例如：

```js
$widget.setTimeline(ctx => {
  return {
    type: "hgrid",
    props: {
      rows: Array(4).fill({
        flexible: {
          minimum: 10,
          maximum: Infinity
        },
        // spacing: 10,
        // alignment: $widget.alignment.left
      }),
      // spacing: 10,
      // alignment: $widget.verticalAlignment.center
    },
    views: Array(8).fill({
      type: "text",
      props: {
        text: "Item"
      }
    })
  }
});
```

上述代码创建了一个 4 行 2 列的横向网格，内容都显示成 `Item`，项目大小可以使用：

```js
{
  fixed: 10
}
```

参考：https://developer.apple.com/documentation/swiftui/griditem/size-swift.enum

```js
{
  flexible: {
    minimum: 10,
    maximum: Infinity
  }
}
```

参考：https://developer.apple.com/documentation/swiftui/griditem/size-swift.enum

```js
{
  adaptive: {
    minimum: 10,
    maximum: Infinity
  }
}
```

参考：https://developer.apple.com/documentation/swiftui/griditem/size-swift.enum

# type: "vgrid"

实现一个纵向的网格空间，例如：

```js
$widget.setTimeline(ctx => {
  return {
    type: "vgrid",
    props: {
      columns: Array(4).fill({
        flexible: {
          minimum: 10,
          maximum: Infinity
        },
        // spacing: 10,
        // alignment: $widget.alignment.left
      }),
      // spacing: 10,
      // alignment: $widget.horizontalAlignment.center
    },
    views: Array(8).fill({
      type: "text",
      props: {
        text: "Item"
      }
    })
  }
});
```

上述代码创建了一个 2 行 4 列的纵向网格，内容都显示成 `Item`，参数含义与 `hgrid` 一致。
```

## docs/home-widget/lock-screen.md

```markdown
# 锁屏小组件 (Beta)

在 iOS 16 Beta 中，锁屏界面也可以有小组件，JSBox 也支持构建它们（目前在 TestFlight 版本）。

## 构建锁屏小组件

锁屏小组件本质上就是您熟悉的桌面小组件，有两个主要区别。

### 明亮的颜色

在锁屏状态下，小组件是用明亮的颜色而不是全色来呈现的。

您应该使用没有透明度的颜色，如纯白或纯黑来构建锁屏小组件。半透明的颜色将与墙纸混合，结果将无法阅读。

### 更小的尺寸

与桌面小组件相比，锁屏小组件有三种新的尺寸：

```js
const $widgetFamily = {
  // small, medium, large, xLarge
  accessoryCircular: 5,
  accessoryRectangular: 6,
  accessoryInline: 7,
}
```

- `accessoryCircular`: 1 * 1 圆形
- `accessoryRectangular`: 1 * 2 长方形
- `accessoryInline`: 在日期后面的一行信息

要检测当前的运行环境，请参考[这里](home-widget/timeline.md?id=render)。

## 应用内预览

为小组件提供的应用内预览目前不支持锁屏小组件的预览，请继续关注即将到来的更新。

## 样例代码

请参考这个 [GitHub 仓库](https://github.com/cyanzhong/jsbox-widgets) 以了解更多。
```

## docs/home-widget/method.md

```markdown
# 相关方法

我们在 `$widget` 模块上新增了一些适用于桌面小组件的方法和常量，方便使用。

# $widget.setTimeline(object)

为桌面小组件提供时间线：

```js
$widget.setTimeline({
  entries: [
    {
      date: new Date(),
      info: {}
    }
  ],
  policy: {
    atEnd: true
  },
  render: ctx => {
    return {
      type: "text",
      props: {
        text: "Hello, World!"
      }
    }
  }
});
```

详情请参考[时间线](home-widget/timeline.md)。

# $widget.reloadTimeline()

手动触发时间线的刷新，是否刷新由系统决定：

```js
$widget.reloadTimeline();
```

# $widget.inputValue

返回当前小组件设置的参数：

```js
const inputValue = $widget.inputValue;
```

> 在主应用运行时 `inputValue` 为空，请使用假数据作为测试目的

# $widget.family

返回当前小组件的尺寸，0 ~ 3 分别表示小、中、大、超大（iPadOS 15）：

```js
const family = $widget.family;
// 0, 1, 2, 3
```

绝大部分情况下，您应该依赖上述 `render` 函数中返回的 `ctx` 来获取 `family`。仅当您需要在调用 `setTimeline` 之前就获取才使用这个接口。

在主应用运行时，这个值默认返回 0，可以被测试代码覆盖：

```js
$widget.family = $widgetFamily.medium;
```

# $widget.displaySize

返回当前小组件的显示大小：

```js
const size = $widget.displaySize;
// size.width, size.height
```

绝大部分情况下，您应该依赖上述 `render` 函数中返回的 `ctx` 来获取 `displaySize`。仅当您需要在调用 `setTimeline` 之前就获取才使用这个接口。

在主应用运行时，这个值默认返回小尺寸的大小，测试代码可以通过覆盖 `family` 来模拟这个值：

```js
$widget.family = $widgetFamily.medium;
```

# $widget.isDarkMode

当前小组件是否运行在深色模式下：

```js
const isDarkMode = $widget.isDarkMode;
```

绝大部分情况下，您应该依赖上述 `render` 函数中返回的 `ctx` 来获取 `isDarkMode`。仅当您需要在调用 `setTimeline` 之前就获取才使用这个接口。

# $widget.alignment

返回在视图里面会用到的 `alignment` 常量：

```js
const alignment = $widget.alignment;
// center, leading, trailing, top, bottom
// topLeading, topTrailing, bottomLeading, bottomTrailing
```

也可以直接使用字符串常量，例如 "center", "leading"...

# $widget.horizontalAlignment

返回在视图里面会用到的 `horizontalAlignment` 常量：

```js
const horizontalAlignment = $widget.horizontalAlignment;
// leading, center, trailing
```

也可以直接使用字符串常量，例如 "leading", "center"...

# $widget.verticalAlignment

返回在视图里面会用到的 `verticalAlignment` 常量：

```js
const verticalAlignment = $widget.verticalAlignment;
// top, center, bottom
// firstTextBaseline, lastTextBaseline
```

也可以直接使用字符串常量，例如 "top", "center"...

# $widget.dateStyle

返回在使用时间设置 `text` 组件时会用到的 `dateStyle` 常量：

```js
const dateStyle = $widget.dateStyle;
// time, date, relative, offset, timer
```

也可以直接使用字符串常量，例如 "time", "date"...

# $env.widget

检查是否运行在桌面小组件环境：

```js
if ($app.env == $env.widget) {
  
}
```
```

## docs/home-widget/modifiers.md

```markdown
# 属性

小组件的属性指定了其展示效果和行为，部分属性支持所有类型的视图，部分属性是文本或图片独有的。

您可以在 `props` 里面指定多个属性，类似这样：

```js
props: {
  frame: {
    width: 100,
    height: 100
  },
  background: $color("red"),
  padding: 15
}
```

请注意，这种简化方式和 SwiftUI 原生的 [View Modifier](https://developer.apple.com/documentation/swiftui/viewmodifier) 有所差别：

- 同一个属性只能被应用一次
- 无法指定属性应用的顺序

SwiftUI modifiers 的工作方式决定了不同的顺序会产生不同的结果，且每次应用都会产生新的视图，所以可以重复应用同类 modifier。

当您需要完全实现 SwiftUI 中的逻辑时，可以使用 `modifiers` 数组：

```js
modifiers: [
  {
    frame: { width: 100, height: 100 },
    background: $color("red")
  },
  { padding: 15 }
]
```

上述代码中，`frame` 和 `background` 的顺序是未定义的，但 `padding` 会在之后应用。

语法和 `props` 中完全相同，以下例子不再赘述。

# 适用于所有视图

## props: frame

限定视图的大小和对齐方式：

```js
props: {
  frame: {
    width: 100,
    height: 100,
    alignment: $widget.alignment.center
  }
}
```

也可以提供更灵活的实现：

```js
props: {
  frame: {
    minWidth: 0,
    idealWidth: 100,
    maxWidth: Infinity,
    minHeight: 0,
    idealHeight: 100,
    maxHeight: Infinity,
  }
}
```

系统会自动推断得到合适的布局效果，当需要视图撑满父视图时，使用 `maxWidth: Infinity` 和 `maxHeight: Infinity`。

## props: position

指定视图的位置：

```js
props: {
  position: $point(0, 0) // {"x": 0, "y": 0}
}
```

## props: offset

指定视图的位置偏移：

```js
props: {
  offset: $point(-10, -10) // {"x": -10, "y": -10}
}
```

## props: padding

指定视图的边距：

```js
props: {
  padding: 10
}
```

这将让其上下左右四个方向的边距都是 10，也可以分别指定各个方向：

```js
props: {
  padding: $insets(10, 0, 10, 0) // {"top": 10, "left": 0, "bottom": 10, "right": 0}
}
```

## props: layoutPriority

指定布局流程中的优先级（默认为 0）：

```js
props: {
  layoutPriority: 1
}
```

## props: cornerRadius

圆角效果：

```js
props: {
  cornerRadius: 10
}
```

如需实现平滑圆角，可使用：

```js
props: {
  cornerRadius: {
    value: 10,
    style: 1 // 0: circular, 1: continuous
  }
}
```

## props: border

实现边框效果：

```js
props: {
  border: {
    color: $color("red"),
    width: 2
  }
}
```

## props: clipped

是否裁剪超出边框部分的内容：

```js
props: {
  clipped: true
}
```

也可以通过 `antialiased` 指定抗锯齿：

```js
props: {
  clipped: {
    antialiased: true
  }
}
```

## props: opacity

半透明效果：

```js
props: {
  opacity: 0.5
}
```

## props: rotationEffect

以弧度角对视图进行旋转：

```js
props: {
  rotationEffect: Math.PI * 0.5
}
```

## props: blur

应用高斯模糊效果：

```js
props: {
  blur: 10
}
```

## props: color

视图的前景色，例如文字颜色：

```js
props: {
  color: $color("red")
}
```

## props: background

视图的背景填充，可以是颜色也可以是图片或者渐变效果：

```js
props: {
  background: {
    type: "gradient",
    props: {
      colors: [
        $color("#f9d423", "#4CA1AF"),
        $color("#ff4e50", "#2C3E50"),
      ]
    }
  }
}
```

## props: link

指定点击视图后会打开的链接（仅支持 2 * 4 和 4 * 4 的小组件）：

```js
props: {
  link: "jsbox://run?name="
}
```

不管这个链接填什么，iOS 都会先打开 JSBox 主应用，但可以将要执行的任务通过 URL scheme 的方式代理到主应用去执行。

另外，也可以使用 JSBox 支持的脚本即时执行功能：

```js
props: {
  link: "jsbox://run?script=alert%28%22hello%22%29"
}
```

这将跳转到 JSBox 主应用，并执行 `script` 参数指定的脚本。

## props: widgetURL

与 `link` 类似，但 `widgetURL` 指定的是点击整个小组件时候打开的链接：

```js
props: {
  widgetURL: "jsbox://run?script=alert%28%22hello%22%29"
}
```

2 * 2 小组件仅支持这种交互方式。

# 适用于文本

## props: bold

指定文本为粗体：

```js
props: {
  bold: true
}
```

## props: font

设置文本使用的字体：

```js
props: {
  font: {
    name: "AmericanTypewriter",
    size: 20,
    // weight: "regular" (ultraLight, thin, light, regular, medium, semibold, bold, heavy, black)
    // monospaced: true
  }
}
```

也可以使用 `$font` 方法构建的字体：

```js
props: {
  font: $font("bold", 20)
}
```

## props: lineLimit

指定文本最多支持的行数：

```js
props: {
  lineLimit: 1
}
```

## props: minimumScaleFactor

当文本不足以显示时，iOS 可能会将字体缩小，该属性指定了最小可以接受的比例：

```js
props: {
  minimumScaleFactor: 0.5
}
```

无法完整显示时，内容将会被截断。

# 适用于图片

## props: resizable

指定图片是否可以被缩放：

```js
props: {
  resizable: true
}
```

## props: scaledToFill

与 [$contentMode.scaleAspectFill](data/constant.md?id=contentmode) 类似，该属性决定图片是否以拉伸并被裁剪的方式填充满父视图：

```js
props: {
  scaledToFill: true
}
```

## props: scaledToFit

与 [$contentMode.scaleAspectFit](data/constant.md?id=contentmode) 类似，该属性决定图片是否以拉伸并保持内容的方式放入父视图内：

```js
props: {
  scaledToFit: true
}
```

## props: accessibilityHidden

为图片指定 VoiceOver 是否禁用：

```js
props: {
  accessibilityHidden: false
}
```

## props: accessibilityLabel

为图片指定 VoiceOver 标签：

```js
props: {
  accessibilityLabel: "Hey"
}
```

## props: accessibilityHint

为图片指定 VoiceOver 提示语：

```js
props: {
  accessibilityHint: "Double tap to open"
}
```
```

## docs/home-widget/timeline.md

```markdown
# 时间线

正如我们前文提到，桌面小组件是基于时间的一系列快照。时间线是整个小组件工作方式的基石，我们会花一点时间解释这个概念。不过在此之前，请先阅读 Apple 提供的一篇文章：https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date

这篇文章对理解时间线的工作原理极为重要，尤其是下面这个图：

<img src='https://docs-assets.developer.apple.com/published/2971813b6a098a34d134a04e38a50b83/2550/WidgetKit-Timeline-At-End@2x.png' width=360px/>

我们的代码扮演的是图中 Timeline Provider 的角色，系统在合适的时候向我们获取一个时间线和更新策略。然后系统会在合适的时间调用我们提供的方法显示小组件，并在策略满足的时候进行下一次获取。

所以，准确的时间线和合理的更新策略是小组件体验的保障。例如，天气应用可以知道接下来几个小时的天气状况，所以可以一次提供多个快照给系统，并在所有快照显示完成之后进行下一轮更新。

# $widget.setTimeline(object)

JSBox 使用 `$widget.setTimeline(...)` 函数来提供上述的时间线，使用样例：

```js
$widget.setTimeline({
  entries: [
    {
      date: new Date(),
      info: {}
    }
  ],
  policy: {
    atEnd: true
  },
  render: ctx => {
    return {
      type: "text",
      props: {
        text: "Hello, World!"
      }
    }
  }
});
```

在 `setTimeline` 之前，我们可以进行一些数据获取的操作，例如请求网络或地理位置。但请注意，小组件必须在很短的时间内完成对时间线的提供，以免因为性能问题而无法完成。

## entries

指定快照相应的时间和额外的上下文信息，在时间线可以预测的情况下，可以一次性提供多个给系统。

在一个 `entry` 里面，用 `date` 指定该快照显示的时间，用 `info` 携带上下文信息，可以在 `render` 函数中通过 `ctx` 取出。

> 如未提供 entries，JSBox 将以当前的时间生成一个默认的 entry。

## policy

指定系统下次获取时间线的策略，有以下几种方式：

```js
$widget.setTimeline({
  policy: {
    atEnd: true
  }
});
```

该方式在最后一个 entry 被使用之后，进行一次新的时间线获取。

```js
$widget.setTimeline({
  policy: {
    afterDate: aDate
  }
});
```

该方式在时间到达 `afterDate` 之后，进行一次新的时间线获取。

```js
$widget.setTimeline({
  policy: {
    never: true
  }
});
```

该方式表示时间线为静态内容，不会周期性地更新。

上述策略仅仅是给系统一些“建议”，系统并不保证刷新一定会完成。为了避免系统过滤掉太过频繁的刷新，请设计有节制的策略以确保体验。

> 在不提供 `entries` 和 `policy` 的状况下，JSBox 为每个脚本提供了每小时刷新一次的默认实现。

## render

在到达每个 entry 指定的时间时，系统将调用上述的 `render` 函数，我们的代码在这里返回一个 JSON 数据作为视图的描述：

```js
$widget.setTimeline({
  render: ctx => {
    return {
      type: "text",
      props: {
        text: "Hello, World!"
      }
    }
  }
});
```

上述代码将在小组件上显示 "Hello, World!"，关于描述视图的语法，我们将在后面详细介绍。

`ctx` 包含了上下文，可以获取到包括 entry 在内的一些环境信息：

```js
$widget.setTimeline({
  render: ctx => {
    const entry = ctx.entry;
    const family = ctx.family;
    const displaySize = ctx.displaySize;
    const isDarkMode = ctx.isDarkMode;
  }
});
```

其中 `family` 表示小组件的尺寸，取值从 0 ~ 2 分别表示小、中、大三种布局。`displaySize` 反映了当前小组件的显示大小。

通过这些环境信息，我们可以动态地决定要返回什么样的视图给系统。

## 默认实现

当您的脚本并不需要刷新，或是默认的刷新策略满足需求，您可以仅提供一个 render 函数：

```js
$widget.setTimeline(ctx => {

});
```

这样，JSBox 会自动创建 entry 并设置每小时刷新一次的策略。

# 应用内预览

开发阶段，在主应用内调用 `$widget.setTimeline` 时，将打开预览小组件的模拟环境。同时支持三种尺寸，固定展示在时间线中的第一个 entry。

如需将脚本应用到实际桌面，请参考前述的设置方法。

# 网络请求最佳实践

您可以在 `setTimeline` 之前请求网络，通过异步的方式获取数据。由于时间线工作机制的限制，我们可能无法实现先展示缓存，然后获取新数据，再刷新页面这样的经典缓存逻辑。

但网络请求总是可能会失败的，在这种情况下展示缓存结果要好于显示出错信息，所以我们建议使用如下缓存策略：

```js
async function fetch() {
  const cache = readCache();
  const resp1 = await $http.get();
  if (failed(resp1)) {
    return cache;
  }

  const resp2 = await $http.download();
  if (failed(resp2)) {
    return cache;
  }

  const data = resp2.data;
  if (data) {
    writeCache(data);
  }

  return data;
}

const data = await fetch();
```

然后使用 `data` 构建时间线，这样小组件上会尽可能地显示内容，尽管内容可能不是最新。

完整示例请参考：https://github.com/cyanzhong/jsbox-widgets/blob/master/xkcd.js
```

## docs/home-widget/views.md

```markdown
# 视图

与 `$ui.render` 函数支持丰富的控件相比，小组件支持的视图类型是极为有限的。

同时，`$ui.render` 底层基于 UIKit 实现，而 `$widget.setTimeline` 底层基于 SwiftUI 实现。尽管我们为小组件设计了类似的语法结构，但两种界面技术的差异决定了之前的知识不能完全平移过来。

# 语法结构

对于任何一种视图，我们都使用如下语法进行定义：

```js
{
  type: "",
  props: {}, // or modifiers: []
  views: []
}
```

这和 `$ui.render` 的方式是类似的，通过 `type` 指定类型，`props` 或 `modifiers` 指定相关属性，`views` 制定其子视图。

区别在于，在 SwiftUI 里面我们不再使用类似 UIKit 的布局方式，所以也就不再通过 `layout` 进行布局。

布局相关的内容之后我们会单独介绍，我们先来看看用于实际显示的视图。

# type: "text"

该组件用于展示一段不可编辑的文本，类似于 `$ui.render` 里面的 `type: "label"`，可以通过如下方式构造：

```js
{
  type: "text",
  props: {
    text: "Hey"
  }
}
```

该方法直接使用 `text` 属性显示一段文本。

```js
{
  type: "text",
  props: {
    date: new Date(),
    style: $widget.dateStyle.time
  }
}
```

该方法使用 `date` 和 `style` 显示一个时间或日期，style 可以参考 [$widget.dateStyle](home-widget/method.md?id=widgetdatestyle)。

```js
{
  type: "text",
  props: {
    startDate: startDate,
    endDate: endDate
  }
}
```

该方法使用 `startDate` 和 `endDate` 来显示一个时间区间。

文本组件支持的属性：[bold](home-widget/modifiers.md?id=props-bold), [font](home-widget/modifiers.md?id=props-font), [lineLimit](home-widget/modifiers.md?id=props-linelimit), [minimumScaleFactor](home-widget/modifiers.md?id=props-minimumscalefactor)。

# type: "image"

用于展示一个图片，与 `$ui.render` 里面的 `type: image` 类似，可以通过如下方式构造：

```js
{
  type: "image",
  props: {
    image: $image("assets/icon.png"),
    // data: $file.read("assets/icon.png")
  }
}
```

该方式使用 JSBox 现成的接口来提供 `image` 或 `data` 对象。

```js
{
  type: "image",
  props: {
    symbol: "trash",
    resizable: true
  }
}
```

该方式使用 [SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols/) 显示一个图标。

由于 SF Symbols 本质上是字体，所以也可以指定字号和字重：

```js
{
  type: "image",
  props: {
    symbol: {
      glyph: "trash",
      size: 64, // Default: 24
      weight: "medium" // Default: "regular" Values: ultraLight, thin, light, regular, medium, semibold, bold, heavy, black
    },
    resizable: true
  }
}
```

```js
{
  type: "image",
  props: {
    path: "assets/icon.png"
  }
}
```

该方式直接使用文件路径来设置图片内容。

```js
{
  type: "image",
  props: {
    uri: "https://..."
  }
}
```

该方式可以使用一个在线图片地址，或是一个 base64 格式的图片字符串。

图片控件支持的属性：[resizable](home-widget/modifiers.md?id=props-resizable), [scaledToFill](home-widget/modifiers.md?id=props-scaledtofill), [scaledToFit](home-widget/modifiers.md?id=props-scaledtofit), [accessibilityHidden](home-widget/modifiers.md?id=props-accessibilityhidden), [accessibilityLabel](home-widget/modifiers.md?id=props-accessibilitylabel), [accessibilityHint](home-widget/modifiers.md?id=props-accessibilityhint)。

# type: "color"

在小组件里面，颜色可以是一个组件也可以是其他组件的一个属性，可以通过如下方式构造：

```js
{
  type: "color",
  props: {
    color: "#00EEEE"
  }
}
```

该方式使用 hex 颜色构建。

```js
{
  type: "color",
  props: {
    light: "#00EEEE",
    dark: "#EE00EE"
  }
}
```

该方式使用 `light` 和 `dark` 分别指定浅色和深色的颜色。

```js
{
  type: "color",
  props: {
    color: $color("red")
  }
}
```

该方式使用 JSBox 现有的 `$color` 接口构造。

# type: "gradient"

用于实现渐变效果，可以通过如下方式构造：

```js
{
  type: "gradient",
  props: {
    startPoint: $point(0, 0), // {"x": 0, "y": 0}
    endPoint: $point(0, 1), // {"x": 0, "y": 1}
    // locations: [0, 1],
    colors: [
      $color("#f9d423", "#4CA1AF"),
      $color("#ff4e50", "#2C3E50"),
    ]
  }
}
```

使用 `startPoint` 和 `endPoint` 来指定起始和结束点，`colors` 和 `locations` 来决定每一段渐变的颜色和位置。注：`locations` 如果指定，数量必须和 `colors` 相等。

# type: "divider"

实现分割线效果：

```js
{
  type: "divider",
  props: {
    background: $color("blue")
  }
}
```
```

## docs/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JSBox</title>
  <link rel="icon" href="_asset/favicon.png">
  <meta name="keywords" content="jsbox,javascript,extension,doc,document,documentation">
  <meta name="description" content="JSBox Docs">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <link rel="stylesheet" href="_style/light.css">
  <link rel="stylesheet" href="_style/custom.css">
  <link rel="stylesheet" href="_style/dark.css" media="(prefers-color-scheme: dark)">
</head>
<body>
  <div id="app"></div>
</body>
<script src="//cdn.jsdelivr.net/npm/docsify-edit-on-github/index.js"></script>
<script>
  window.$docsify = {
    alias: {
      '/((?!en).)*/_sidebar.md': '/_sidebar.md',
      '/((?!en).)*/_navbar.md': '/_navbar.md',
      '/en/.*/_sidebar.md': '/en/_sidebar.md',
      '/en/.*/_navbar.md': '/en/_navbar.md'
    },
    auto2top: true,
    coverpage: false,
    executeScript: true,
    loadSidebar: true,
    loadNavbar: true,
    mergeNavbar: true,
    maxLevel: 4,
    subMaxLevel: 2,
    name: 'JSBox',
    search: {
      noData: {
        '/en/': 'No results :(',
        '/': '没有结果 :('
      },
      paths: 'auto',
      placeholder: {
        '/en/': 'Search',
        '/': '搜索'
      }
    },
    formatUpdated: '{MM}/{DD} {HH}:{mm}',
    externalLinkTarget: '_self',
    plugins: [
      EditOnGithubPlugin.create(
        'https://github.com/cyanzhong/jsbox-docs/blob/master/docs/',
        null,
        path => {
          if (path.indexOf('en/') === 0) {
            return 'Edit on GitHub';
          } else {
            return '在 GitHub 上编辑';
          }
        }
      )
    ]
  }
</script>
<script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/docsify-pagination/dist/docsify-pagination.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-javascript.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-json.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-markdown.min.js"></script>
</html>
```

## docs/keyboard/method.md

```markdown
# 键盘上运行的脚本

从 v1.12.0 开始，JSBox 支持让用户通过脚本直接编写一个键盘扩展，你可以通过 JavaScript 来实现对输入区域的操作，可以用于制作辅助输入的插件。

你完全无须关心这个机制是如何实现的，你只需通过 `$keyboard` 相关接口准备好你的脚本。

这里有两个完整的例子用于演示如何构建一个键盘插件：

https://github.com/cyanzhong/xTeko/tree/master/extension-demos/keyboard

[点击这里安装体验](https://xteko.com/redir?url=https://github.com/cyanzhong/xTeko/raw/master/extension-demos/keyboard.box)

https://github.com/cyanzhong/xTeko/tree/master/extension-demos/emoji-key

[点击这里安装体验](https://xteko.com/redir?url=https://github.com/cyanzhong/xTeko/raw/master/extension-demos/emoji-key.box)

# $keyboard.insert(string)

向当前的输入框插入一段文字：

```js
$keyboard.insert("Hey!")
```

# $keyboard.delete()

删除当前选中的内容或者向后删除一个字符：

```js
$keyboard.delete()
```

# $keyboard.moveCursor(number)

移动当前光标（向后移动 5 个位置）：

```js
$keyboard.moveCursor(5)
```

# $keyboard.playInputClick()

播放键盘按下去的音效：

```js
$keyboard.playInputClick()
```

# $keyboard.hasText

判断当前输入区域是否有文字：

```js
const hasText = $keyboard.hasText;
```

# $keyboard.selectedText

获取当前选中的文字（iOS 11 以上）：

```js
const selectedText = $keyboard.selectedText;
```

# $keyboard.textBeforeInput

输入前的文字：

```js
const textBeforeInput = $keyboard.textBeforeInput;
```

# $keyboard.textAfterInput

输入后的文字：

```js
const textAfterInput = $keyboard.textAfterInput;
```

# $keyboard.getAllText(handler)

获取当前的全部文字（iOS 11 以上）：

```js
$keyboard.getAllText(text => {
  
})
```

# $keyboard.next()

切换到下个输入法：

```js
$keyboard.next()
```

# $keyboard.send()

模拟键盘上的发送事件：

```js
$keyboard.send()
```

# $keyboard.dismiss()

将键盘收起来：

```js
$keyboard.dismiss()
```

# $keyboard.barHidden

是否隐藏底部的工具栏，这是一个属性，应该尽早设置。

以上所有的接口，都只能在键盘上面运行，但用户尝试将其运行在别的环境时，会得到运行时错误。

# $keyboard.height

获取和设置键盘的高度：

```js
let height = $keyboard.height;

$keyboard.height = 500;
```
```

## docs/keyboard/privacy.md

```markdown
# 隐私策略

JSBox 的键盘不会获取用户正在输入的内容，也不会将对用户的输入进行任何形式的记录或者上传操作。

为了保证脚本功能的正常使用，需要在系统设置里打开“**允许完全访问**”。

当完全访问被关闭时，键盘上的扩展会有诸多限制，例如：

- 无法访问网络
- 无法访问地理位置
- 无法访问剪贴板数据
- 无法访问 iCloud
- 无法访问主应用的一些设置

请你根据自己的需要权衡是否为 JSBox 打开“允许完全访问”，但我们需要指出的是，即便允许完全访问被打开，我们也不会通过技术手段对用户的输入做任何操作。

请放心使用。
```

## docs/media/audio.md

```markdown
> 对于简单的音频播放，JSBox 通过 $audio 提供了支持

# $audio.play(object)

播放一个音频：

```js
// 通过 sound id 播放系统音频
$audio.play({
  id: 1000
})
```

iOS 系统内置 sound id 请参考：https://github.com/TUNER88/iOSSystemSoundsLibrary 。

```js
// 播放网络上的音频
$audio.play({
  url: "https://"
})
```

```js
// 播放本地音频
$audio.play({
  path: "audio.wav"
})
```

```js
// 暂停播放
$audio.pause()
```

```js
// 恢复播放
$audio.resume()
```

```js
// 停止播放
$audio.stop()
```

```js
// 设置播放进度（秒）
$audio.seek(60)
```

```js
// 获得当前的状态
const status = $audio.status;
// 0: 已停止, 1: 等待播放, 2: 正在播放
```

```js
// 获取时长
const duration = $audio.duration;
```

```js
// 获取当前的播放时间
const offset = $audio.offset;
```

# 事件消息

音频播放过程中可以监听一些消息，例如：

```js
$audio.play({
  events: {
    itemEnded: function() {},
    timeJumped: function() {},
    didPlayToEndTime: function() {},
    failedToPlayToEndTime: function() {},
    playbackStalled: function() {},
    newAccessLogEntry: function() {},
    newErrorLogEntry: function() {},
  }
})
```

参考：https://developer.apple.com/documentation/avfoundation/avplayeritem?language=objc
```

## docs/media/imagekit.md

```markdown
# 图像处理

JSBox 2.1.0 增加了图像处理模块 `$imagekit`，通过这个模块你可以很轻松的处理图像，例如：

- 调整大小
- 旋转
- 制作灰度图像
- 图像叠加
...

为了更直观的介绍，我们构建了一个使用了所有接口的样例项目：https://github.com/cyanzhong/jsbox-imagekit

# $imagekit.render(options, handler)

创建一张图片，并可以使用 canvas 进行绘制：

```js
const options = {
  size: $size(100, 100),
  color: $color("#00FF00"),
  // scale: default to screen scale
  // opaque: default to false
}

const image = $imagekit.render(options, ctx => {
  const centerX = 50;
  const centerY = 50;
  const radius = 25;
  ctx.fillColor = $color("#FF0000");
  ctx.moveToPoint(centerX, centerY - radius);
  for (let i = 1; i < 5; ++i) {
    const x = radius * Math.sin(i * Math.PI * 0.8);
    const y = radius * Math.cos(i * Math.PI * 0.8);
    ctx.addLineToPoint(x + centerX, centerY - y);
  }
  ctx.fillPath();
});
```

`ctx` 与 `canvas` 组件中的一样，请参考 [canvas](component/canvas.md) 文档。

# $imagekit.info(image)

获取图片信息：

```js
const info = $imagekit.info(source);
// width, height, orientation, scale, props
```

# $imagekit.grayscale(image)

转换成灰度图像：

```js
const output = $imagekit.grayscale(source);
```

# $imagekit.invert(image)

将图像反色：

```js
const output = $imagekit.invert(source);
```

# $imagekit.sepia(image)

添加棕褐色滤镜：

```js
const output = $imagekit.sepia(source);
```

# $imagekit.adjustEnhance(image)

自动改善图像效果：

```js
const output = $imagekit.adjustEnhance(source);
```

# $imagekit.adjustRedEye(image)

自动红眼消除：

```js
const output = $imagekit.adjustRedEye(source);
```

# $imagekit.adjustBrightness(image, value)

调整图片亮度：

```js
const output = $imagekit.adjustBrightness(source, 100);
// value range: (-255, 255)
```

# $imagekit.adjustContrast(image, value)

调整图片对比度：

```js
const output = $imagekit.adjustContrast(source, 100);
// value range: (-255, 255)
```

# $imagekit.adjustGamma(image, value)

调整图片伽马值：

```js
const output = $imagekit.adjustGamma(source, 4);
// value range: (0.01, 8)
```

# $imagekit.adjustOpacity(image, value)

调整图片不透明度：

```js
const output = $imagekit.adjustOpacity(source, 0.5);
// value range: (0, 1)
```

# $imagekit.blur(image, bias)

高斯模糊效果：

```js
const output = $imagekit.blur(source, 0);
```

# $imagekit.emboss(image, bias)

浮雕效果：

```js
const output = $imagekit.emboss(source, 0);
```

# $imagekit.sharpen(image, bias)

锐化：

```js
const output = $imagekit.sharpen(source, 0);
```

# $imagekit.unsharpen(image, bias)

钝化:

```js
const output = $imagekit.unsharpen(source, 0);
```

# $imagekit.detectEdge(source, bias)

边缘检测：

```js
const output = $imagekit.detectEdge(source, 0);
```

# $imagekit.mask(image, mask)

使用 `mask` 作为蒙版进行切图：

```js
const output = $imagekit.mask(source, mask);
```

# $imagekit.reflect(image, height, fromAlpha, toAlpha)

创建上下镜像的图片，从 `height` 处折叠，透明度从 `fromAlpha` 变化到 `toAlpha`：

```js
const output = $imagekit.reflect(source, 100, 0, 1);
```

# $imagekit.cropTo(image, size, mode)

图片裁剪：

```js
const output = $imagekit.cropTo(source, $size(100, 100), 0);
// mode:
//   - 0: top-left
//   - 1: top-center
//   - 2: top-right
//   - 3: bottom-left
//   - 4: bottom-center
//   - 5: bottom-right
//   - 6: left-center
//   - 7: right-center
//   - 8: center
```

# $imagekit.scaleBy(image, value)

使用比例调整图片大小：

```js
const output = $imagekit.scaleBy(source, 0.5);
```

# $imagekit.scaleTo(image, size, mode)

使用 size 调整图片大小：

```js
const output = $imagekit.scaleTo(source, $size(100, 100), 0);
// mode:
//   - 0: scaleFill
//   - 1: scaleAspectFit
//   - 2: scaleAspectFill
```

# $imagekit.scaleFill(image, size)

使用 `scaleFill` 模式调整大小：

```js
const output = $imagekit.scaleFill(source, $size(100, 100));
```

# $imagekit.scaleAspectFit(image, size)

使用 `scaleAspectFit` 模式调整大小：

```js
const output = $imagekit.scaleAspectFit(source, $size(100, 100));
```

# $imagekit.scaleAspectFill(image, size)

使用 `scaleAspectFill` 模式调整大小：

```js
const output = $imagekit.scaleAspectFill(source, $size(100, 100));
```

# $imagekit.rotate(image, radians)

旋转图片（将会调整图像大小）：

```js
const output = $imagekit.rotate(source, Math.PI * 0.25);
```

# $imagekit.rotatePixels(image, radians)

旋转图片（不会改变图像大小，可能会裁剪）：

```js
const output = $imagekit.rotatePixels(source, Math.PI * 0.25);
```

# $imagekit.flip(image, mode)

获得镜像图片：

```js
const output = $imagekit.flip(source, 0);
// mode:
//   - 0: vertically
//   - 1: horizontally
```

# $imagekit.concatenate(images, space, mode)

拼接多张图片，可以添加间距：

```js
const output = $imagekit.concatenate(images, 10, 0);
// mode:
//   - 0: vertically
//   - 1: horizontally
```

# $imagekit.combine(image, mask, mode)

将两个图片叠加：

```js
const output = $imagekit.combine(image1, image2, mode);
// mode:
//   - 0: top-left
//   - 1: top-center
//   - 2: top-right
//   - 3: bottom-left
//   - 4: bottom-center
//   - 5: bottom-right
//   - 6: left-center
//   - 7: right-center
//   - 8: center (default)
//   - $point(x, y): absolute position
```

# $imagekit.rounded(image, radius)

获取圆角图片：

```js
const output = $imagekit.rounded(source, 10);
```

# $imagekit.circular(image)

获取正圆形图片，如果原图不是正方形则会居中并从来裁剪：

```js
const output = $imagekit.circular(source);
```

# $imagekit.extractGIF(data) -> Promise

将 GIF 文件分解成单帧：

```js
const {images, durations} = await $imagekit.extractGIF(data);
// image: all image frames
// durations: duration for each frame
```

# $imagekit.makeGIF(source, options) -> Promise

将 image 数组或视频文件 data 合成为 GIF 文件：

```js
const images = [image1, image2];
const options = {
  durations: [0.5, 0.5],
  // size: 16, 12, 8, 4, 2
}
const data = await $imagekit.makeGIF(images, options);
```

若使用 `duration` 替代 `durations`，则每张图片时长一致。

# $imagekit.makeVideo(source, options) -> Promise

将 image 数组或 GIF 文件合成为视频文件：

```js
const images = [image1, image2];
const data = await $imagekit.makeVideo(images, {
  durations: [0.5, 0.5]
});
```

若使用 `duration` 替代 `durations`，则每张图片时长一致，使用 GIF 时不需要指定时长。
```

## docs/media/pdf.md

```markdown
> 此接口用于创建 PDF 文档

# $pdf.make(object)

通过 URL 或者 html 来创建 PDF 文档：

```js
$pdf.make({
  html: "<p>Hello, World!</p><h1 style='background-color: red;'>xTeko</h1>",
  handler: function(resp) {
    const data = resp.data;
    if (data) {
      $share.sheet(["sample.pdf", data])
    }
  }
})
```

也可以使用图片来创建 PDF 文件：

```js
let {data} = await $pdf.make({"images": images});
```

支持通过 `pageSize` 来设置页面大小，例如：

```js
$pdf.make({
  url: "https://github.com",
  pageSize: $pageSize.A5,
  handler: function(resp) {
    const data = resp.data;
    if (data) {
      $share.sheet(["sample.pdf", data])
    }
  }
})
```

`$pageSize` 支持 A0 ~ A10, B0 ~ B10, C0 ~ C10 等取值，请参考：http://en.wikipedia.org/wiki/Paper_size

# $pdf.toImages(data)

将 PDF 文档渲染成一个 image 数组：

```js
const images = $pdf.toImages(pdf);
```

# $pdf.toImage(data)

将 PDF 文档渲染成一个 image 对象：

```js
const image = $pdf.toImage(pdf);
```
```

## docs/media/photo.md

```markdown
> JSBox 也提供了一套用于拍照或选择照片的接口

# $photo.take(object)

拍摄一张照片：

```js
$photo.take({
  handler: function(resp) {
    const image = resp.image;
  }
})
```

支持的参数表，常量请参考[常量表](data/constant.md)：

参数 | 类型 | 说明
---|---|---
edit | boolean | 是否编辑
mediaTypes | array | 媒体类型
maxDuration | number | 视频最大时长
quality | number | 质量
showsControls | boolean | 是否显示控制器
device | number | 前后镜头
flashMode | number | 闪光灯模式

# $photo.pick(object)

从系统相册选择一张图片：

```js
$photo.pick({
  handler: function(resp) {
    const image = resp.image;
  }
})
```

所支持的参数与 `$photo.take` 完全一致，你可以认为他们只是数据来源不同。

与 `take` 方法不同的是，`pick` 可以指定返回数据的类型：

参数 | 类型 | 说明
---|---|---
format | string | 可选 "image" 和 "data"，默认 "image"

此外，`$photo.pick` 支持通过 `multi: true` 来设置选择多个结果，通过 `selectionLimit` 来限制最多选择的张数，多选时返回的结果结构如下：

参数 | 类型 | 说明
---|---|---
status | bool | 是否成功
results | array | 所有结果

results 里面的某一项，当 format 为 `image` 时结构为：

参数 | 类型 | 说明
---|---|---
image | image | 图片对象
metadata | object | 元数据
filename | string | 文件名

当 format 为 `data` 时结构为：

参数 | 类型 | 说明
---|---|---
data | data | 图片二进制数据
metadata | object | 元数据
filename | string | 文件名

# $photo.prompt(object)

弹出一个 action sheet 让用户选择是拍照还是从相册选择图片：

```js
$photo.prompt({
  handler: function(resp) {
    const image = resp.image;
  }
})
```

# 获取图片的 metadata

在 `$photo.pick` 和 `$photo.take` 的返回结果中，可以取得图片的元数据，例如地理位置：

```js
$photo.pick({
  handler: function(resp) {
    const metadata = resp.metadata;
    if (metadata) {
      const gps = metadata["{GPS}"];
      const url = `https://maps.apple.com/?ll=${gps.Latitude},${gps.Longitude}`;
      $app.openURL(url)
    }
  }
})
```

获取图片的 GPS 信息并在 Apple 地图中打开。

# $photo.scan()

使用内置的文档扫描工具（仅 iOS 13）：

```js
const response = await $photo.scan();
// response.status, response.results
```

# $photo.save(object)

将图片存储到相册：

```js
// data
$photo.save({
  data,
  handler: function(success) {

  }
})
```

```js
// image
$photo.save({
  image,
  handler: function(success) {

  }
})
```

# $photo.fetch(object)

在系统相册中读取图片：

```js
$photo.fetch({
  count: 3,
  handler: function(images) {

  }
})
```

支持一些参数来确定搜索的范围，比如图片类型，常量请参考[常量表](data/constant.md)：

参数 | 类型 | 说明
---|---|---
type | number | 媒体类型
subType | number | 媒体子类型
format | string | 可选 "image" 和 "data"，默认 "image"
size | $size | 图片大小，默认原图
count | number | 读取数量

# $photo.delete(object)

在系统相册中删除图片：

```js
$photo.delete({
  count: 3,
  handler: function(success) {

  }
})
```

支持的参数和 `$photo.fetch` 相同。

# image 转换成 data

`image` 类型提供了两个方法用于转换成二进制数据：

```js
// PNG
const png = image.png;
// JPEG
const jpg = image.jpg(0.8);
```

jpg 格式使用 `0.0 ~ 1.0` 来表示质量。
```

## docs/media/quicklook.md

```markdown
# $quicklook

通过 $quicklook.open 我们可以通过 iOS 内置的文件查看器打开一些常见的文件格式。

通过 URL:

```js
$quicklook.open({
  url: "",
  handler: function() {
    // Handle dismiss action, optional
  }
})
```

通过 Data:

```js
$quicklook.open({
  type: "jpg",
  data
})
```

预览 image 对象：

```js
$quicklook.open({
  image
})
```

预览纯文本内容：

```js
$quicklook.open({
  text: "Hello, World!"
})
```

预览 JSON 对象：

```js
$quicklook.open({
  json: "{\"a\": [1, 2, true]}"
})
```

预览 HTML 内容：

```js
$quicklook.open({
  html: "<p>HTML</p>"
})
```

预览多个文件（list 内容必须全部为 data 或者全部是链接）：

```js
$quicklook.open({
  list: ["", "", ""]
})
```

请注意，可以传递一个 `type` 用于指定文件类型，该参数是可选的，指定的话会让结果更精确，否则则会猜测文件类型。
```

## docs/network/server.md

```markdown
# $server

你可以使用 $http.startServer 来创建一个简单的 Web 服务器，可以将文件放到上面，然后通过 HTTP 链接下载。当你需要自定义 Request Handler 时，可以使用 $server 相关的接口：

```js
const server = $server.new();

const options = {
  port: 6060, // Required
  bonjourName: "", // Optional
  bonjourType: "", // Optional
};

server.start(options);
```

# $server.start(object)

使用简单的参数快速启动一个 HTTP 服务器：

```js
const server = $server.start({
  port: 6060,
  path: "assets/website",
  handler: () => {
    $app.openURL("http://localhost:6060/index.html");
  }
});
```

# server.stop()

停止 Web 服务器。

# server.listen(events)

通过这个接口可以监听事件：

```js
server.listen({
  didStart: server => {
    $delay(1, () => {
      $app.openURL(`http://localhost:${port}`);
    });
  },
  didConnect: server => {},
  didDisconnect: server => {},
  didStop: server => {},
  didCompleteBonjourRegistration: server => {},
  didUpdateNATPortMapping: server => {}
});
```

# server.addHandler(object)

注册一个 Request Handler:

```js
const handler = {};

// Handler filter
handler.filter = rules => {
  const method = rules.method;
  const url = rules.url;
  // rules.headers, rules.path, rules.query;
  return "data"; // default, data, file, multipart, urlencoded
}

// Handler response
handler.response = request => {
  const method = request.method;
  const url = request.url;
  return {
    type: "data", // default, data, file, error
    props: {
      html: "<html><body style='font-size: 300px'>Hello!</body></html>"
      // json: {
      //   "status": 1,
      //   "values": ["a", "b", "c"]
      // }
    }
  };
}

// Handler async response
handler.asyncResponse = (request, completion) => {
const method = request.method;
  const url = request.url;
  completion({
    type: "data", // default, data, file, error
    props: {
      html: "<html><body style='font-size: 300px'>Hello!</body></html>"
      // json: {
      //   "status": 1,
      //   "values": ["a", "b", "c"]
      // }
    }
  });
}
```

 # handler.filter

 filter 是一个函数，在这里你可以根据传入的 rules 决定对这些规则使用什么样的 request，rules 结构：

```json
{
  "method": "",
  "url": "",
  "headers": {

  },
  "path": "",
  "query": {

  }
}
```

request 类型包括：`default`, `data`, `file`, `multipart`, `urlencoded`。

从 v1.51.0 开始，你可以返回一个字典，用来覆盖之前的规则，例如：

```js
handler.filter = rules => {
  return {
    "type": "data",
    "method": "GET"
  }
}
```

当你需要重定向一个请求，或是将 `POST` 改写为 `GET` 等需求时，可能会用得上。

# handler.response

这个函数传入一个 request，根据需要返回一个 response 用于完成对这个请求的响应，例如这是一种最简单的 response：

```js
{
  type: "data",
  props: {
    html: "<html><body style='font-size: 300px'>Hello!</body></html>"
  }
}
```

创建 response 可以指定类型为：`default`, `data`, `file`，通过不同的 props 来初始化一个 response。

`data` 类型支持通过 `html`, `text` 或 `json` 字段来构造。`file` 类型支持通过 `path` 来构造。

其他支持的参数：

属性 | 类型 | 说明
---|---|---
contentType | string | content type
contentLength | number | content length
statusCode | number | status code
cacheControlMaxAge | number | cache control max age
lastModifiedDate | Date | last modified date
eTag | string | E-Tag
gzipEnabled | bool | gzip enabled
headers | object | HTTP headers

# server.clearHandlers()

清除掉所有已注册的 Request Handlers。

完整例子请见：https://github.com/cyanzhong/xTeko/blob/master/extension-demos/server.js

Request 对象和 Response 对象包括多种类型，请参考[详细文档](object/server.md)。
```

## docs/network/socket.md

```markdown
# WebSocket

JSBox 支持类似 [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 的接口，用于与服务器之间提供 socket 连接。

# $socket.new(object)

创建一个新的 socket 对象：

```js
const socket = $socket.new("wss://echo.websocket.org");
```

你也可以指定一些参数：

```js
const socket = $socket.new({
  url: "wss://echo.websocket.org",
  protocols: [],
  allowsUntrustedSSLCertificates: true
});
```

# socket.listen(object)

用户监听 socket 消息：

```js
socket.listen({
  didOpen: (sock) => {
    console.log("Websocket Connected");
  },
  didFail: (sock, error) => {
    console.error(`:( Websocket Failed With Error: ${error}`);
  },
  didClose: (sock, code, reason, wasClean) => {
    console.log("WebSocket closed");
  },
  didReceiveString: (sock, string) => {
    console.log(`Received: ${string}`);
  },
  didReceiveData: (sock, data) => {
    console.log(`Received: ${data}`);
  },
  didReceivePing: (sock, data) => {
    console.log("WebSocket received ping");
  },
  didReceivePong: (sock, data) => {
    console.log("WebSocket received pong");
  }
});
```

# socket.open()

打开 WebSocket。

# socket.close(object)

关闭 WebSocket:

```js
socket.close({
  code: 1000, // Optional, see: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
  reason: "reason", // Optional
});
```

# socket.send(object)

发送内容，例如：

```js
const object = socket.send("Message");
const result = object.result;
const error = object.error;
```

也可以通过 data 发送：

```js
socket.send({
  data,
  noCopy: true, // Optional
});
```

# socket.ping(data)

```js
const object = socket.ping(data);
const result = object.result;
const error = object.error;
```

# socket.readyState

获取状态：

```js
const readyState = socket.readyState;
// 0: connecting, 1: open, 2: closing, 3: closed
```

完整例子请见：https://github.com/cyanzhong/xTeko/blob/master/extension-demos/socket.js
```

## docs/object/calendar-item.md

```markdown
# calendarItem

`calendarItem` 是使用 `$calendar` 接口时返回的数据对象。

属性 | 类型 | 读写 | 说明
---|---|---|---
title | string | 读写 | 标题
location | string | 读写 | 位置
notes | string | 读写 | 备注
url | string | 读写 | 链接
allDay | bool | 读写 | 是否全天时间
startDate | date | 读写 | 开始时间
endDate | date | 读写 | 结束时间
status | number | 只读 | 状态
eventIdentifier | string | 只读 | 标识符
creationDate | date | 只读 | 创建时间
modifiedDate | date | 只读 | 修改时间
```

## docs/object/color.md

```markdown
# color

`color` 类型表示一个颜色，可以通过 `$color` 函数生成：

```js
const color = $color("#00eeee");
```

# color.hexCode

获得颜色对应的 hex 字符串：

```js
const hexCode = color.hexCode;
// -> "#00eeee"
```

# color.components

获得颜色对应的 RGB 数值：

```js
const components = color.components;
const red = components.red;
const green = components.green;
const blue = components.blue;
const alpha = components.alpha;
```
```

## docs/object/contact.md

```markdown
# contact

`contact` 是使用 `$contact` 接口时返回的数据对象。

属性 | 类型 | 读写 | 说明
---|---|---|---
identifier | string | 只读 | 标识符
content | string | 只读 | 内容
contactType | number | 只读 | 类型
namePrefix | string | 读写 | name prefix
givenName | string | 读写 | given name
middleName | string | 读写 | middle name
familyName | string | 读写 | family name
nameSuffix | string | 读写 | name suffix
nickname | string | 读写 | nick name
organizationName | string | 读写 | 组织
departmentName | string | 读写 | 部门
jobTitle | string | 读写 | 职位
note | string | 读写 | 备注
imageData | data | 读写 | 头像
phoneNumbers | array | 读写 | 电话
emailAddresses | array | 读写 | 邮件
postalAddresses | array | 读写 | 邮编
urlAddresses | array | 读写 | 链接
instantMessageAddresses | array | 读写 | 即时通讯

# group

`group` 是使用 `$contact.fetchGroup` 接口时返回的对象

属性 | 类型 | 读写 | 说明
---|---|---|---
identifier | string | 只读 | 标识符
name | string | 读写 | 名称
```

## docs/object/data.md

```markdown
# data

`data` 类型表示一个二进制数据，亦即一个文件。

属性 | 类型 | 读写 | 说明
---|---|---|---
info | object | 只读 | metadata
string | string | 只读 | 转换成 UTF8 字符串
byteArray | [number] | 只读 | 转换成 byte array
image | image | 只读 | 转换成 image
fileName | string | 只读 | 可能的文件名
gzipped | $data | 只读 | 获取 gzip 后的文件
gunzipped | $data | 只读 | 获取 gunzip 后的文件
isGzipped | bool | 只读 | 检测是否是一个 gzip 文件
```

## docs/object/error.md

```markdown
# error

`error` 类型用于封装一个出错的信息。

属性 | 类型 | 读写 | 说明
---|---|---|---
domain | string | 只读 | domain
code | number | 只读 | code
userInfo | object | 只读 | userInfo
localizedDescription | string | 只读 | 描述
localizedFailureReason | string | 只读 | 原因
localizedRecoverySuggestion | string | 只读 | 建议
```

## docs/object/image.md

```markdown
# image

`image` 类型表示图片对象。

属性 | 类型 | 读写 | 说明
---|---|---|---
size | $size | 只读 | 尺寸
orientation | number | 只读 | 方向
info | object | 只读 | metadata
scale | number | 只读 | scale
png | data | 只读 | png 表示的二进制数据

# alwaysTemplate

返回一个使用 `template` 模式渲染的图片，结合 `tintColor` 可以用于对模板图片进行着色：

```js
{
  type: "image",
  props: {
    tintColor: $color("red"),
    image: rawImage.alwaysTemplate
  }
}
```

上述 `rawImage` 是原始的图片。

# alwaysOriginal

与 `alwaysTemplate` 相对于，此属性返回的图片总是渲染自身的颜色，而非 `tintColor`。

# resized($size)

返回调整尺寸的图片：

```js
const resized = image.resized($size(100, 100));
```

# jpg(number)

返回 jpg 表示的二进制数据，number 表示压缩质量(0 ~ 1)：

```js
const jpg = image.jpg(0.8);
```

# colorAtPixel($point)

获得某个点的颜色值：

```js
const color = image.colorAtPixel($point(0, 0));
const hexCode = color.hexCode;
```

# averageColor

获得整张图片的平均颜色：

```js
const avgColor = image.averageColor;
```

# orientationFixedImage

获得旋转方向修正了的图片：

```js
const fixedImage = image.orientationFixedImage;
```
```

## docs/object/index-path.md

```markdown
# indexPath

在 `list` 或 `matrix` 里面，表示一个元素所在的位置。

属性 | 类型 | 读写 | 说明
---|---|---|---
section | number | 读写 | 区号
row | number | 读写 | 行号
item | number | 读写 | 等于 `row`，通常在 matrix 里面使用
```

## docs/object/navigation-action.md

```markdown
# navigationAction

`navigationAction` 在 `web` 控件的回调里面表示一个导航操作。

属性 | 类型 | 读写 | 说明
---|---|---|---
type | number | 只读 | 类型
sourceURL | string | 只读 | source url
targetURL | string | 只读 | target url
requestURL | string | 只读 | request url
```

## docs/object/reminder-item.md

```markdown
# reminderItem

`reminderItem` 是使用 `$reminder` 接口时返回的数据对象。

属性 | 类型 | 读写 | 说明
---|---|---|---
title | string | 读写 | 标题
location | string | 读写 | 位置
notes | string | 读写 | 备注
url | string | 读写 | 链接
priority | number | 读写 | 优先级
completed | bool | 读写 | 是否完成
completionDate | date | 只读 | 完成时间
alarmDate | date | 读写 | 提醒时间
creationDate | date | 只读 | 创建时间
modifiedDate | date | 只读 | 修改时间
```

## docs/object/response.md

```markdown
# response

`response` 是 http 请求里面返回的内容，例如：

```js
$http.get({
  url: "",
  handler: function(resp) {
    const response = resp.response;
  }
})
```

属性 | 类型 | 读写 | 说明
---|---|---|---
url | string | 只读 | url
MIMEType | string | 只读 | MIME 类型
expectedContentLength | number | 只读 | 长度
textEncodingName | string | 只读 | 编码
suggestedFilename | string | 只读 | 建议的文件名
statusCode | number | 只读 | HTTP 状态码
headers | object | 只读 | HTTP header
```

## docs/object/result-set.md

```markdown
# ResultSet

`ResultSet` 是 SQLite 返回的查询结果：

```js
db.query("SELECT * FROM USER", (rs, err) => {
  while (rs.next()) {

  }
  rs.close();
});
```

属性 | 类型 | 读写 | 说明
---|---|---|---
query | string | 只读 | SQL Query
columnCount | number | 只读 | 列数
values | object | 只读 | 所有值

# next()

移动到下一个结果。

# close()

关闭查询结果。

# indexForName(string)

根据列的名字获得列的序号。

# nameForIndex(number)

根据列的序号获得列的名字。

# get(object)

根据列的序号或名字获得值。

# isNull(object)

根据列的序号或名字判断是否为空。
```

## docs/object/server.md

```markdown
# request

属性 | 类型 | 读写 | 说明
---|---|---|---
method | string | 只读 | http method
url | string | 只读 | url
headers | json | 只读 | http headers
path | string | 只读 | path
query | json | 只读 | query
contentType | string | 只读 | Content-Type
contentLength | number | 只读 | Content-Length
ifModifiedSince | date | 只读 | If-Modified-Since
ifNoneMatch | bool | 只读 | If-None-Match
acceptsGzip | bool | 只读 | accepts Gzip encoding
localAddressData | data | 只读 | local address data
localAddress | string | 只读 | local address string
remoteAddressData | data | 只读 | remote address data
remoteAddress | string | 只读 | remote address string
hasBody | bool | 只读 | has body
hasByteRange | bool | 只读 | has byte range

# data request

data request 包含所有 request 的属性，同时有如下属性：

属性 | 类型 | 读写 | 说明
---|---|---|---
data | data | 只读 | data
text | string | 只读 | text
json | json | 只读 | json

# file request

file request 包含所有 request 的属性，同时有如下属性：

属性 | 类型 | 读写 | 说明
---|---|---|---
temporaryPath | string | 只读 | temporary file path

# multipart request

multipart request 包含所有 request 的属性，同时有如下属性：

属性 | 类型 | 读写 | 说明
---|---|---|---
arguments | array | 只读 | arguments
files | array | 只读 | files
mimeType | string | 只读 | MIME Type

arguments 包含的数据结构：

属性 | 类型 | 读写 | 说明
---|---|---|---
controlName | string | 只读 | control name
contentType | string | 只读 | Content-Type
mimeType | string | 只读 | MIME Type
data | data | 只读 | data
string | string | 只读 | string
fileName | string | 只读 | file name
temporaryPath | string | 只读 | temporary file path

# response

response 是 handler.response 返回的对象：

属性 | 类型 | 读写 | 说明
---|---|---|---
redirect | string | 读写 | redirect url
permanent | bool | 读写 | permanent
statusCode | number | 读写 | http status code
contentType | string | 读写 | Content-Type
contentLength | string | 读写 | Content-Length
cacheControlMaxAge | number | 读写 | Cache-Control
lastModifiedDate | date | 读写 | Last-Modified
eTag | string | 读写 | ETag
gzipEnabled | bool | 读写 | gzip enabled
hasBody | bool | 读写 | has body

例如你能这样构造一个 response：

```js
return {
  type: "default",
  props: {
    statusCode: 404
  }
}
```

# data response

data response 包含所有 response 的属性，同时有如下属性：

属性 | 类型 | 读写 | 说明
---|---|---|---
text | string | 读写 | text
html | string | 读写 | html
json | json | 读写 | json

# file response

file response 包含所有 response 的属性，同时有如下属性：

属性 | 类型 | 读写 | 说明
---|---|---|---
path | string | 读写 | file path
isAttachment | bool | 读写 | is attachment
byteRange | range | 读写 | byte range
```

## docs/package/builtin.md

```markdown
# 内置模块

为了更方便使用，JSBox 内置了一些常见的模块：

- [underscore](https://underscorejs.org/)
- [moment](https://momentjs.com/)
- [crypto-js](https://github.com/brix/crypto-js)
- [cheerio](https://cheerio.js.org/)
- [lodash](https://lodash.com/)
- [ramba](https://ramdajs.com/)

这些模块无需打包在安装包内部即可被脚本通过 require 使用，例如：

```js
const lodash = require("lodash");
```

请参考模块各自的文档来使用，在本文档中不再赘述。

如果有其他模块的使用需求，可以通过 [browserify](http://browserify.org/) 进行打包，没有 native 依赖并符合 [CommonJS](https://en.wikipedia.org/wiki/CommonJS) 标准的模块一般可以使用。
```

## docs/package/install.md

```markdown
# 安装说明

从 `v1.9.0` 开始，JSBox 安装脚本的方式得到了空前的提高，支持各种方式：

- 把文件分享到 JSBox 应用内安装
- 通过 Safari 打开一个文件链接完成安装，例如直接打开：https://raw.githubusercontent.com/cyanzhong/xTeko/master/extension-scripts/api.js
- 通过 Web 服务器传输文件
- 通过 iOS 相机或 JSBox 应用内扫码

如果你是用 macOS，还可以将脚本直接分享到 iOS 完成安装，更支持直接分享安装包文件夹到 iOS。

需要注意的是，以上的安装方式，均同时支持安装 `js/zip/box` 三种后缀名形式。

# 分享说明

当使用 JSBox 内置的编辑器分享安装包时，有三个选项：

- 分享文件目录
- 分享 zip 格式
- 分享 box 格式

将文件目录分享到桌面端可以直接编辑，与 VSCode 插件同步则有更好的体验。

zip 格式则更利于在社交平台传播，box 后缀名本质也是 zip 格式，只是一个更利于识别的标志。
```

## docs/package/intro.md

```markdown
# JSBox 安装包格式

从 `v1.9.0` 开始，JSBox 不仅支持运行单个 JavaScript 文件，还设计了自己的安装包格式，可以带来如下好处：

- 可以将代码模块化，不需要将所有逻辑都放在同一个文件
- 可以将配置文件化，这样更容易维护
- 可以内置图片等资源，从而不需要通过 Base64 等手段引入图片

# 格式说明

JSBox 安装包格式是一个 zip 文件，只要文件目录包含以下结构则会被认为是一个 JSBox 安装包：

- **assets/** 用于存放资源
- **scripts/** 用于存放脚本
- **strings/** 用于存放本地化字符串
- **config.json** 安装包配置文件
- **main.js** 脚本主要入口，在这里加载其他脚本

这是一个样例：https://github.com/cyanzhong/xTeko/tree/master/extension-demos/package

你也可以通过 JSBox 应用直接创建一个应用模板。

# assets

将应用将用到的资源文件放置于这里，然后可以通过 `assets/filename` 样式的路径引用文件。

这些文件可以被用在 `$file` 相关接口，也可以作为 `src` 被设置为 image 或 button 等组件。

该文件夹默认包含一个 `icon.png`，这将作为应用的图标，在设置里面切换图标将会替换这个文件，你也可以手动替换这个文件以实现自定义图标。

图标制作标准请参考：https://github.com/cyanzhong/xTeko/tree/master/extension-icons

# scripts

将会用到的脚本放到这个文件夹下，可以通过 `require('scripts/utility')` 样式的代码模块化的加载文件，我们稍后会介绍如何模块化。

你可以在这个文件夹下面建立子文件夹，将脚本放到合适的位置，从而实现整个应用的架构划分。

# strings

这个文件夹提供的功能与 `$app.strings` 类似，即为 `$l10n` 提供本地化的字符串，默认包含：

- **en.strings** 英文
- **zh-Hans.strings** 中文简体

strings 文件是一个如下格式的文本文件（键值对）：

```
"OK" = "好的";
"DONE" = "完成";
"HELLO_WORLD" = "你好，世界！";
```

PS: 如果你同时使用了 strings 文件和 $app.strings，将以后者为准。

# config.json

此文件目前包含两个部分，一个是安装文件的元信息，位于 `info` 节点下面，请参考：[$addin](addin/method.md?id=addinlist)。

另一部分是 `settings` 节点，这部分设置与 `$app` 接口相关的一些设置相同，请参考：[$app](foundation/app.md?id=appminsdkver)。

使用 config.json 能更好的组织你的设置项，以后新增的设置项也会被放到这里。

# main.js

当一个应用被执行的时候，main.js 将是入口，在这里我们可以加载 scripts 文件夹里面的脚本，例如：

```js
const app = require('./scripts/app');

app.sayHello();
```

这将会以模块的形式引入 `scripts/app.js` 这个文件，然后调用该文件的 `sayHello` 函数，我们将稍后介绍这个机制。
```

## docs/package/module.md

```markdown
# require('path')

`require` 这个方法的机制是将被引入的脚本文件变成一个模块，从而有自己的命名空间，可以解决变量名暴露的问题。

需要模块化的文件需要使用 `module.exports`:


```js
function sayHello() {
  $ui.alert($l10n('HELLO_WORLD'));
}

module.exports = {
  sayHello
}
```

sayHello 原本是不能被外部访问的，你可以通过配置 module.exports 来为其提供一个在外部引用时的命名。

所以引入的时候则可以使用：

```js
const app = require('./scripts/app');

app.sayHello();
```

这个机制将各个文件的代码良好的隔离了开来，并且不会出现命名冲突。

注意：请尽可能的使用相对路径，自动补全机制对于绝对路径引入的模块不起作用。

# $include('path')

另外一个方式是使用 `$include` 方式来引入代码，这个机制与 require 完全不同，他不会产生模块化的效果，而仅仅是将代码从一个文件中引入过来，并且执行一遍，效果等同于 eval 一段源码。

通过以上两种方式我们可以有效地组织源码，从而做出架构更好的设计。
```

## docs/package/path.md

```markdown
# 路径

引入一个脚本时，可以使用绝对路径或相对路径：

例如：

```js
const app = require('./scripts/app');
```

`scripts/` 则是应用根目录 -> scripts 目录下的 app.js 文件，其中 `.js` 可以省略。

路径应用可以跨越各个文件夹，但仅限于当前应用根目录下。

# $file

可以这样读取一个文件：

```js
const file = $file.read('strings/zh-Hans.strings');
```

这会打开 strings 目录下的 zh-Hans.strings 文件。

简而言之，在安装包里面，和文件有关的根目录是应用的根目录。
```

## docs/package/vscode.md

```markdown
# VSCode

JSBox 从一开始就提供了 VSCode 插件：https://marketplace.visualstudio.com/items?itemName=Ying.jsbox

你可以用这个插件增强你写 JSBox 脚本的体验，他可以帮你将脚本从桌面端实时同步到手机端（在同一个 Wi-Fi 下面），也提供了简单的自动补全功能。

从 0.0.6 版本开始，JSBox 的 VSCode 插件也支持了安装包格式，只要当前编辑的文件夹符合 JSBox 安装包的定义：

- **assets/**
- **scripts/**
- **strings/**
- **config.json**
- **main.js**

同步的时候则会将整个目录（安装包）同步到手机，然后运行。
```

## docs/privacy.md

```markdown
## 隐私政策

JSBox 是一个用于在 iOS 上学习 JavaScript 的 IDE，它旨在为执行 JavaScript 提供一个安全的沙箱，仅出于教育目的。

此隐私政策适用于 iOS 主应用本身，其内嵌的框架和应用扩展，以及我们提供的官方示例。但显然不适用于您（用户）自己编写的脚本，特别是在使用网络 API 时，请留意（API 服务提供商的）其他可能适用的隐私政策。

JSBox **不是**旨在成为一个运行任何代码的“平台”，而是为了成为一个运行**您自己**程序的学习环境。为了防止恶意脚本，强烈建议您在运行之前始终检查代码。

**JSBox 收集的数据**

简而言之，JSBox 应用程序本身不会收集您的任何数据。是的，我们不会为实现增长的目的而使用任何数据跟踪技术，甚至不会计算拥有多少用户。我们只是想提供一个安全的编程环境，而不关心我们的用户规模，或是我们的应用是如何被用户使用的。

但是您应该谨慎地对待一些可能会请求您数据的 API，例如位置、日历和提醒。尤其是在运行别人给您的脚本时，请在运行前仔细检查它。

除此之外，请对我们的服务充满信心，所有隐私信息永远保留在您的设备上，我们无法控制它。

**Cookies**

Cookies 是具有少量数据的文件，通常用作匿名唯一标识符。这些信息将从您访问的网站发送到浏览器，并存储在设备中。

JSBox 不会显式使用 Cookie 技术。但我们用到的第三方代码或库可能收集 Cookie 以改善其服务，您可以选择接受还是拒绝这些 Cookie，并知道何时将 Cookie 发送到您的设备。

**本隐私政策的变更**

我们可能会不时地更新我们的隐私政策。因此，建议您定期查看此页面以了解更新后的内容。我们会通过在此页面上发布新的隐私政策来通知您任何更改。这些更改在此页面上发布后立即生效。

**联系我们**

如果您对我们的隐私政策有任何疑问或建议，请随时通过 log.e@qq.com 与我们联系。
```

## docs/promise/index.md

```markdown
# 接口列表

这里是一个表格，用于列举我们在前面文章中提到过的 Promise 接口问题，我们用 `required` 表示这是一个必须要回调的接口，也即你可以直接使用 Promise，用 `optional` 来表示该接口的回调可以省略，当你需要 Promise 调用的时候，需要 `async: true` 参数来指明。

# $thread

接口 | 类型
---|---
main | required
background | required

# $http

接口 | 类型
---|---
request | required
get | required
post | required
download | required
upload | required
shorten | required
lengthen | required
startServer | required

# $push

接口 | 类型
---|---
schedule | optional

# $drive

接口 | 类型
---|---
save | required
open | required

# $cache

接口 | 类型
---|---
setAsync | required
getAsync | required
removeAsync | required
clearAsync | required

# $photo

接口 | 类型
---|---
take | required
pick | required
save | optional
fetch | required
delete | optional

# $input

接口 | 类型
---|---
text | required
speech | required

# $ui

接口 | 类型
---|---
animate | optional
alert | required
action | required
menu | required

# $message

接口 | 类型
---|---
sms | optional
mail | optional

# $calendar

接口 | 类型
---|---
fetch | required
create | optional
save | optional
delete | optional

# $reminder

接口 | 类型
---|---
fetch | required
create | optional
save | optional
delete | optional

# $contact

接口 | 类型
---|---
pick | required
fetch | required
create | optional
save | optional
delete | optional
fetchGroups | required
addGroup | optional
deleteGroup | optional
updateGroup | optional
addToGroup | optional
removeFromGroup | optional

# $location

接口 | 类型
---|---
select | required

# $ssh

接口 | 类型
---|---
connect | required

# $text

接口 | 类型
---|---
analysis | required
tokenize | required
htmlToMarkdown | required

# $qrcode

接口 | 类型
---|---
scan | required

# $pdf

接口 | 类型
---|---
make | required

# $quicklook

接口 | 类型
---|---
open | optional

# $safari

接口 | 类型
---|---
open | optional

# $archiver

接口 | 类型
---|---
zip | required
unzip | required

# $browser

接口 | 类型
---|---
exec | required

# $picker

接口 | 类型
---|---
date | required
data | required
color | required

# $keyboard

接口 | 类型
---|---
getAllText | required
```

## docs/promise/intro.md

```markdown
# Promise

Promise 是一种为了解决回调地狱而引入的方案，请参考 Mozilla 的文档了解更多：https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise

JSBox 里面当然可以使用 Promise，但是 JSBox 里面提供的接口早期并不支持 Promise，只支持通过 callback 回调，比如说：

```js
$http.get({
  url: 'https://docs.xteko.com',
  handler: function(resp) {
    const data = resp.data;
  }
})
```

这个例子通过 `handler` 进行下一步操作，但从 v1.15.0 开始，你可以有更好的方案：

```js
$http.get({ url: 'https://docs.xteko.com' }).then(resp => {
  const data = resp.data;
})
```

这种写法可以避免你陷入回调地狱，或者更进一步地（iOS 10.3 以上）：

```js
var resp = await $http.get({ url: 'https://docs.xteko.com' })
var data = resp.data
```

如果你为了测试之用，对于 `$http.get` 你还能使用这个极简形式：

```js
var resp = await $http.get('https://docs.xteko.com')
var data = resp.data
```

关于 Promise 的种种细节，本文档不会详细描述，但这里会推荐一篇文档：https://javascript.info/async

总的来说，JSBox 现在已经对于一些 API 提供了 Promise 调用。
```

## docs/promise/sample.md

```markdown
# 两种模式

JSBox 提供的异步接口里面，对 Promise 的支持两种模式：

- 直接支持 Promise 相关调用
- 需要传参 `async: true` 表明这是一个 Promise 调用

这两种形式其实很好理解，是为了兼容早期 JSBox 的 handler 风格接口而做的妥协，之后可能会全部迁移至第一种。

简单来说，在有些接口里面，你必须处理回调，例如：

```js
$ui.menu({
  items: ["A", "B", "C"],
  handler: (title, index) => {

  }
})
```

如果你弹出一个菜单，用户选择之后什么都不做，这是没有道理的，所以这种情况我们会认为这是一个“必须要回调”的接口，你可以直接：

```js
var result = await $ui.menu({ items: ["A", "B", "C"] })
var title = result.title
var index = result.index
// Or: var result = await $ui.menu(["A", "B", "C"])
```

但是有些情况则不然，比如你可以删除一个图片，这个时候回调也可以不回调也没事：

```js
$photo.delete({
  count: 3,
  screenshot: true,
  handler: success => {
    // It's OK to remove handler here
  }
})
```

对于这种可选回调的异步接口，你需要添加 async 参数来指明你需要 Promise 调用：

```js
var success = await $photo.delete({
  count: 3,
  screenshot: true,
  async: true
})
```

这样的取舍是为了兼容两种调用方式，如果不指明 `async: true` 的话，这将是一个可选的 callback 回调。

同时，请注意不是所有的接口都能异步，有些接口完全是同步接口，例如：

```js
const success = $file.delete("sample.txt");
```

这样的接口没有必要（也无法）Promise 调用，我们之后将会有一个表来详细说明各个接口的支持情况。

# 一些好用的简写

当你使用 Promise 之后，你可能会发现有时候参数只剩下一个，是没有必要包装成一个 JSON 数据的，所以我们提供了一些简写，例如上面提到过的：

```js
var resp = await $http.get('https://docs.xteko.com')
```

这样一些方便的形式可以少写很多代码，这是一些样例：

```js
// Thread
await $thread.main(3)
await $thread.background(3)

// HTTP
var resp = await $http.get('https://docs.xteko.com')
var result = await $http.shorten("http://docs.xteko.com")

// UIKit
var result = await $ui.menu(["A", "B", "C"])

// Cache
var cache = await $cache.getAsync("key")
```
```

## docs/quickstart/intro.md

```markdown
# JavaScript

`JavaScript` 是一门强大而灵活的编程语言，本文假设读者具有基本的 JavaScript 基础。

> 相关资源
> - [w3schools.com](https://www.w3schools.com/js/)
> - [mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

# 相似的项目

JSBox 从理念上来说并没有太多的开创性，有很多 `可以运行脚本` 的产品，他们的形态和理念深深地影响着 JSBox 的开发，比如 `Editorial` 和 `Automator`，他们都是可以通过脚本来设计小程序的产品。

但 JSBox 开发过程中并没有模仿他们设计和实现，并且采用了完全不同的道路，就是基于 `JavaScript`，JSBox 与他们唯一的相似之处是能够运行脚本。

另外，市面上有大量的通过 JavaScript 描述 `Native UI` 的框架，例如 Facebook 的 `React Native` 和阿里的 `Weex`，JSBox 在设计和实现的过程中考虑过直接采用他们的方案，但最终考虑到灵活度的问题没有这样做，主要原因有三点：

- React Native 和 Weex 都是为了跨平台需求而设计的框架
- JSBox 是完全为了 iOS 而生，能更好的描述 iOS 的 Native 控件
- JSBox 有一个更重要的目标是：`尽可能简单和易学`，不会引入 JavaScript 之外的概念

# API 设计原则

- API 都以 `$` 符号开始，例如 `$clipboard`
- 与 `Cocoa` 的哲学相反，JSBox 的 API 会尽可能的短，因为在移动平台上面编写、修改代码不是一件容易的事情
- 绝大部分的时候，参数会是一个 `JavaScript Object`，除非只有一个参数
- 每个扩展有自己的运行环境，这个环境产生的数据是与其他的扩展隔绝的，也会随着扩展的删除而消失

以上是对于 JSBox 的基本介绍，*已经对 JavaScript 有所了解，想要看看[简单样例 >](quickstart/sample.md)。*
```

## docs/quickstart/sample.md

```markdown
> 以下内容是通过一些简单的样例展示 JSBox 的接口设计，可以对 JSBox 有个概括性的了解。

# Hello, World!

```js
// 弹出 alert
$ui.alert("Hello, World!")
```

```js
// 打印到控制台
console.info("Hello, World!")
```

# 获取并展示剪贴板内容

```js
$ui.preview({
  text: JSON.stringify($clipboard.items)
})
```

# 简单的 HTTP 请求

```js
$http.get({
  url: 'https://docs.xteko.com',
  handler: function(resp) {
    const data = resp.data;
  }
})
```

# 创建一个按钮

```js
$ui.render({
  views: [
    {
      type: "button",
      props: {
        title: "Button"
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.width.equalTo(64)
      },
      events: {
        tapped: function(sender) {
          $ui.toast("Tapped")
        }
      }
    }
  ]
})
```

以上几个例子可以简单的认识一下接口的基本设计，在之后的文档里面有更详尽的介绍。
```

## docs/runtime/blocks.md

```markdown
# Objective-C Blocks

Block 是 Objective-C 里面一种特殊的类型，虽然不完全相同但也很类似其他语言里面的闭包，如果用更通俗一点的语言来解释的话，你可以理解成 Block 很像一个函数，他能捕获外层的变量，并且能作为参数、变量甚至返回值。

关于 Block 的更多内容请参考 Apple 的官方文档：https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithBlocks/WorkingwithBlocks.html

本文档的内容是介绍如何在 JSBox 的 Runtime 环境里面使用 Blocks。

# $block

JSBox 里面使用 $block 来定义一个 block，例如：

```js
const handler = $block("void, UITableViewRowAction *, NSIndexPath *", (action, indexPath) => {
  $ui.alert("Action")
});
```

即使用一个字符串来按顺序声明函数的返回值和参数数据类型，然后使用一个函数来定义 Block 的函数体，这个 Block 在 Objective-C 实现的时候长这样：

```objc
void(^handler)(UITableViewRowAction *, NSIndexPath *) = ^(UITableViewRowAction *action, NSIndexPath *indexPath) {
  // Alert
};
```

请注意返回值一定要声明，否则将不能正确地识别。

这里有一个完整的使用 Runtime 构建 TableView 的例子：

```js
//-- Create window --//

$ui.render()

//-- Cell --//

$define({
  type: "TableCell: UITableViewCell"
})

//-- TableView --//

$define({
  type: "TableView: UITableView",
  events: {
    "init": function() {
      self = self.invoke("super.init")
      self.invoke("setTableFooterView", $objc("UIView").invoke("new"))
      self.invoke("registerClass:forCellReuseIdentifier:", $objc("TableCell").invoke("class"), "identifier")
      return self
    }
  }
})

//-- Manager --//

$define({
  type: "Manager: NSObject <UITableViewDelegate, UITableViewDataSource>",
  events: {
    "tableView:numberOfRowsInSection:": function(tableView, section) {
      return 5
    },
    "tableView:cellForRowAtIndexPath:": function(tableView, indexPath) {
      const cell = tableView.invoke("dequeueReusableCellWithIdentifier:forIndexPath:", "identifier", indexPath);
      cell.invoke("textLabel").invoke("setText", `Row: ${indexPath.invoke("row")}`)
      return cell
    },
    "tableView:didSelectRowAtIndexPath:": function(tableView, indexPath) {
      tableView.invoke("deselectRowAtIndexPath:animated:", indexPath, true)
      const cell = tableView.invoke("cellForRowAtIndexPath:", indexPath);
      const text = cell.invoke("textLabel.text").jsValue();
      $ui.alert(`Tapped: ${text}`)
    },
    "tableView:editActionsForRowAtIndexPath:": function(tableView, indexPath) {
      const handler = $block("void, UITableViewRowAction *, NSIndexPath *", (action, indexPath) => {
        $ui.alert("Action")
      });
      const action = $objc("UITableViewRowAction").invoke("rowActionWithStyle:title:handler:", 1, "Foobar", handler);
      return [action]
    }
  }
})

const window = $ui.window.ocValue();
const manager = $objc("Manager").invoke("new");

const table = $objc("TableView").invoke("new");
table.invoke("setFrame", window.invoke("bounds"))
table.invoke("setDelegate", manager)
table.invoke("setDataSource", manager)
window.invoke("addSubview", table)
```
```

## docs/runtime/c.md

```markdown
# $defc

JSBox 也提供了调用 C 函数的方法，对于 iOS 提供的 C 函数，你可以通过这个方式来引入：

```js
$defc("NSClassFromString", "Class, NSString *")
```

第一个参数是函数名，第二个字符串依次是返回值类型和各个参数的类型（类似 $block 的定义）。

定义之后你就可以这样使用这个 C 函数了：

```js
NSClassFromString("NSURL")
```

类似的，对于这样一个 C 函数：`int func(void *ptr, NSObject *obj, float num)` 则需要这样定义：

```js
$defc("func", "int, void *, NSObject *, float")
```

注：目前不支持在 C 函数里面传递 struct 和 block 类型。
```

## docs/runtime/define.md

```markdown
> 在 JSBox 中可以动态创建类和方法，用于实现更灵活的功能

# $define(object)

通过 `$define` 方法可以动态创建一个 Objective-C Class:

```js
$define({
  type: "MyHelper: NSObject",
  events: {
    instanceMethod: function() {
      $ui.alert("instance")
    },
    "indexPathForRow:inSection:": function(row, section) {
      $ui.alert(`row: ${row}, section: ${section}`)
    }
  },
  classEvents: {
    classMethod: function() {
      $ui.alert("class")
    }
  }
})
```

主要有三个部分：

- `type` 表示类名，声明方式与 Objective-C 相同
- `events` 中实现所有的实例方法
- `classEvents` 中实现所有的类方法

定义之后可以这样使用这个类：

```js
$objc("MyHelper").invoke("alloc.init").invoke("instanceMethod")
$objc("MyHelper").invoke("classMethod")
```

分别会弹出 `instance` 和 `class` 两个提示。

# $delegate(object)

在 Runtime 代码中，我们可能经常会需要创建一个 Delegate 对象，通过 $delegate 可以快速做到：

```js
const textView = $objc("UITextView").$new();
textView.$setDelegate($delegate({
  type: "UITextViewDelegate",
  events: {
    "textViewDidChange:": sender => {
      console.log(sender.$text().jsValue());
    }
  }
}));
```

简单来说，$delegate 使用和 $define 类似的定义。但无需指定类名，并且会自动创建实例。
```

## docs/runtime/intro.md

```markdown
# 基本概念

[Objective-C Runtime](https://developer.apple.com/documentation/objectivec/objective_c_runtime) 是一把利刃，类似于其他语言中的反射机制，却有着更灵活的运行时特性。

利用 Runtime 我们在 Objective-C 里面可以做到：

- 动态调用方法
- 动态创建类
- 动态创建实例
- 替换已有的方法

总之 Runtime 可以做到太多太多的事情，是 Objective-C 语言里面的黑魔法之一。

# 为什么要引入 Runtime

最根本的原因是为有缺陷的 API 提供一个备用方案，正如 Runtime 绝大多时候的应用场景一样，它是一把屠龙的刀，屠龙之技是不会用在日常生活中的。

假设你有一个功能要实现，JSBox 提供的 API 没有满足你，或者是满足的有缺陷，你可以考虑通过 JSBox 提供的 Runtime 接口直接调用 Objective-C 的 API。

当然，在你可以实现功能的时候，应该尽量避免使用 Runtime 接口，因为调用起来比较复杂，查错也相对困难。

# JSBox 提供的接口

- `$objc(className)` 用于动态获取一个 Objective-C 的类
- `invoke(methodName, arguments ...)` 用于动态调用一个 Objective-C 的方法
- `$define(object)` 用于动态创建一个 Objective-C 的类
- `jsValue()` 用于将 Objective-C 数据转换成 JavaScript 值
- `ocValue()` 用于将 JavaScript 值封装成 Objective-C 值
- `$objc_retain(object)` 维持 object
- `$objc_release(object)` 释放 object

# 一个例子

这个例子在 JSBox 的窗口中创建一个按钮和标签，点击按钮后会打开微信：

```js
$define({
  type: "MyHelper",
  classEvents: {
    open: function(scheme) {
      const url = $objc("NSURL").invoke("URLWithString", scheme);
      $objc("UIApplication").invoke("sharedApplication.openURL", url)
    }
  }
})

$ui.render({
  views: [
    {
      type: "button",
      props: {
        bgcolor: $objc("UIColor").invoke("blackColor").jsValue(),
        titleColor: $color("#FFFFFF").ocValue().jsValue(),
        title: "WeChat"
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.size.equalTo($size(100, 32))
      },
      events: {
        tapped: function(sender) {
          $objc("MyHelper").invoke("open", "weixin://")
        }
      }
    }
  ]
})

const window = $ui.window.ocValue();
const label = $objc("UILabel").invoke("alloc.init");
label.invoke("setTextAlignment", 1)
label.invoke("setText", "Runtime")
label.invoke("setFrame", { x: $device.info.screen.width * 0.5 - 50, y: 240, width: 100, height: 32 })
window.invoke("addSubview", label)
```

这个例子混合了原始的 JSBox 调用和 Runtime 调用两种方式，展示了两种数据类型如何处理。

一个更完善也更复杂的例子，完全使用 Runtime 构建一个 2048 小游戏：https://github.com/cyanzhong/xTeko/tree/master/extension-scripts/2048
```

## docs/runtime/invoke.md

```markdown
> 通过 JSBox 提供的接口，动态的与原生接口进行交互

# invoke(methodName, arguments ...)

当我们通过 `$objc("")` 拿到 Objective-C 类时，可以通过 `invoke` 方法动态的执行他的方法：

```js
const label = $objc("UILabel").invoke("alloc.init");
label.invoke("setText", "Runtime")
```

上面的代码动态创建了一个 `label`，同时把文字设置成了 `Runtime`。

`invoke("alloc.init")` 也等价于 `invoke("alloc").invoke("init")`。

如果你希望一次性导入多个 Objective-C 类，可以这么做：

```js
$objc("UIColor, UIApplication, NSIndexPath");

const color = UIColor.$redColor();
const application = UIApplication.$sharedApplication();
```

# selector

以 `NSIndexPath` 为例，Objective-C 中：

```objc
NSIndexPath *indexPath = [NSIndexPath indexPathForRow:0 inSection:0];
```

在 JSBox Runtime 中这么实现：

```js
const indexPath = $objc("NSIndexPath").invoke("indexPathForRow:inSection:", 0, 0);
```

`indexPathForRow:inSection:` 就是这个方法的 selector，而后面的就是参数列表。
```

## docs/runtime/memory.md

```markdown
# $objc_retain(object)

在有些时候通过 Runtime 声明的对象会被系统释放掉，如果你想要长期持有一个对象，可以使用这个方法：

```js
const manager = $objc("Manager").invoke("new");
$objc_retain(manager)
```

这将在整个脚本运行期间保持 manger 不被释放。

# $objc_relase(object)

与 retain 相对应的函数，目的是手动释放掉对象：

```js
$objc_release(manager)
```
```

## docs/runtime/sugar.md

```markdown
# 语法糖

Runtime 的本质是在一门语言里面写另一门语言，也就是通过字符串的方式来反射调用，类似这样的做法写起来极为繁琐：

```js
const app = $objc("UIApplication").invoke("sharedApplication");
const url = $objc("NSURL").invoke("URLWithString", "https://sspai.com");
app.invoke("openURL", url);
```

所以我们需要一种语法糖来缓解这种复杂，在 v1.24.0 以后，我们引入了一种新的语法结构：

```js
const app = $objc("UIApplication").$sharedApplication();
const url = $objc("NSURL").$URLWithString("https://sspai.com");
app.$openURL(url);
```

这不仅可以少写很多代码，更能让反射代码看起来更像原生的代码（虽然本质上是一样的）。

# 规则

这个语法规则十分简单，一共只有三个规则：

- 使用 `$` 符号（美元符）来表示这是一个 Runtime 调用
- 使用 `_` 符号（下划线）来表示 Objective-C 方法名里面的 `:` 号
- 使用 `__` 符号（两个下划线）来表示 Objective-C 方法名里面的 `_` 号

例如：

```js
const app = $objc("UIApplication").$sharedApplication();
app.$sendAction_to_from_forEvent(action, target, null, null);
```

这个代码等同于 Objective-C 里面的：

```objc
UIApplication *app = [UIApplication sharedApplication];
[app sendAction:action to:target from:nil forEvent:nil];
```

更完善的例子，请参考这个使用新语法实现的 2048 小游戏：https://github.com/cyanzhong/xTeko/tree/master/extension-scripts/%242048

# 自动生成的类

有些 Objective-C 十分常用，所以 JSBox 现在默认支持，而无需再使用 $objc("ClassName") 去获得：

类名 | 参考
---|---
NSDictionary | https://developer.apple.com/documentation/foundation/nsdictionary
NSMutableDictionary | https://developer.apple.com/documentation/foundation/nsmutabledictionary
NSArray | https://developer.apple.com/documentation/foundation/nsarray
NSMutableArray | https://developer.apple.com/documentation/foundation/nsmutablearray
NSSet | https://developer.apple.com/documentation/foundation/nsset
NSMutableSet | https://developer.apple.com/documentation/foundation/nsmutableset
NSString | https://developer.apple.com/documentation/foundation/nsstring
NSMutableString | https://developer.apple.com/documentation/foundation/nsmutablestring
NSData | https://developer.apple.com/documentation/foundation/nsdata
NSMutableData | https://developer.apple.com/documentation/foundation/nsmutabledata
NSNumber | https://developer.apple.com/documentation/foundation/nsnumber
NSURL | https://developer.apple.com/documentation/foundation/nsurl
NSEnumerator | https://developer.apple.com/documentation/foundation/nsenumerator

这些你可以直接使用，就像是这样：

```js
const url = NSURL.$URLWithString("https://sspai.com");
```

其他的类你需要通过 $objc 定义，你可以使用它的返回值，但同时他也会生成一个同名的对象：

```js
const appClass = $objc("UIApplication");

var app = appClass.$sharedApplication();

// Or
var app = UIApplication.$sharedApplication();
```

也即 $objc("UIApplication") 会生成一个叫做 `UIApplication` 的对象方便你下次使用。
```

## docs/runtime/types.md

```markdown
> 原生类型与 Runtime 类型的相互转换

# 类型转换

当使用上述 `invoke` 接口时，返回的数据类型是一个 Objective-C 类型，而 JSBox 其他的接口生成的都是 JavaScript 类型。

这两种代码要混合在一起的时候，需要通过下面两个方法进行转换：

- `jsValue()` 从 Objective-C 值转换成 JavaScript 值
- `ocValue()` 将 JavaScript 值封装成 Objective-C 值

# 例子

例如 JSBox 提供的 `$color` 生成的是一个 JavaScript 值：

```js
const color1 = $color("red");
```

这种值被应用在 invoke 方法时需要：`color1.ocValue()` 才行。

而 invoke 生成的都是 ocValue:

```js
const color2 = $objc("UIColor").invoke("grayColor");
```

这种值在应用在 JSBox 接口时需要调用 `color2.jsValue()` 才行，例如：

```js
props: {
  bgcolor: color2.jsValue()
}
```

通过这两个方法，我们可以在 Runtime 环境和原始环境中穿梭，从而将两种代码混合起来。
```

## docs/safari-extension/intro.md

```markdown
# Safari 浏览器扩展

在 iOS 15 及以上，JSBox 为 [Safari 浏览器扩展](https://support.apple.com/zh-cn/guide/iphone/iphab0432bf6/ios) 提供了全面支持，您可以使用 JavaScript 定制自己的 Safari，并且支持自动运行和手动运行两种形式。

关于 Safari 扩展的使用方法，请参考上述 Apple 官方文档，本文档主要讲解开发相关内容。

## JavaScript Web API

与 JSBox 脚本不同的是，Safari 扩展运行在浏览器环境，脚本可以使用所有的 Web 接口，但不能使用 JSBox 专属的接口。

与之相关的开发文档，请查询 Mozilla 的 [Web API 接口参考](https://developer.mozilla.org/zh-CN/docs/Web/API)。

> 您可以在桌面端浏览器或应用内的 WebView 环境测试 Safari 扩展，但在真实的 Safari 环境中测试仍然是必要的步骤。

## Safari 工具

Safari 工具旨在为 Safari 提供扩展功能，需用户手动点击运行，创建方式：

- 新建项目
- Safari 工具

如使用 VS Code 插件创建项目，文件名需以 `.safari-tool.js` 结尾，同步到 JSBox 后会被识别为 Safari 工具。

样例代码：

```js
const video = document.querySelector("video");
if (video) {
  video.webkitSetPresentationMode("picture-in-picture");
} else {
  alert("No videos found.");
}
```

此工具运行后，将会让 YouTube 页面的视频进入画中画模式。

## Safari 规则

Safari 规则旨在为 Safari 提供自动运行的插件，无需用户手动点击运行，创建方式：

- 新建项目
- Safari 规则

如使用 VS Code 插件创建项目，文件名需以 `.safari-rule.js` 结尾，同步到 JSBox 后会被识别为 Safari 规则。

样例代码：

```js
const style = document.createElement("style");
const head = document.head || document.getElementsByTagName("head")[0];
head.appendChild(style);
style.appendChild(document.createTextNode("._9AhH0 { display: none }"));
```

此规则运行后，将会允许用户下载 Instagram 页面的图片。

> 出于安全考虑，Safari 规则默认禁止自动运行，需用户在应用设置中手动开启。
```

## docs/sdk/calendar.md

```markdown
> 用于与系统日历进行交互，例如读取或写入

# $calendar.fetch(object)

用于读取日历事件（会提示用户授权）：

```js
$calendar.fetch({
  startDate: new Date(),
  hours: 3 * 24,
  handler: function(resp) {
    const events = resp.events;
  }
})
```

表示读取从现在开始往后 3 天的所有日历事件，除了指定 `hours` 以外，也可以自己计算并指定 `endDate`。

在返回的数据里面，events 内含的对象结构如下：

属性 | 类型 | 读写 | 说明
---|---|---|---
title | string | 读写 | 标题
identifier | string | 只读 | id
location | string | 读写 | 位置
notes | string | 读写 | 备注
url | string | 读写 | 网址
modifiedDate | date | 只读 | 修改时间
creationDate | date | 只读 | 创建时间
allDay | boolean | 只读 | 是否全天
startDate | date | 只读 | 开始时间
endDate | date | 只读 | 结束时间
status | number | 只读 | 状态[请参考](https://developer.apple.com/documentation/eventkit/ekeventstatus)

# $calendar.create(object)

用于创建一个日历事项：

```js
$calendar.create({
  title: "Hey!",
  startDate: new Date(),
  hours: 3,
  notes: "Hello, World!",
  handler: function(resp) {

  }
})
```

# $calendar.save(object)

通过 `$calendar.fetch` 取出来的日历项，可以修改一些属性，然后通过 save 接口更新：

```js
$calendar.fetch({
  startDate: new Date(),
  hours: 3 * 24,
  handler: function(resp) {
    const event = resp.events[0];
    event.title = "Modified"
    $calendar.save({
      event
    })
  }
})
```

可以通过 `alarmDate` 和 `alarmDates` 来指定提醒闹钟时间。

# $calendar.delete(object)

在系统日历中删除某个日历项：

```js
$calendar.delete({
  event,
  handler: function(resp) {
    
  }
})
```
```

## docs/sdk/contact.md

```markdown
> 用于与系统通讯录进行交互，例如读取或写入

# $contact.pick(object)

从通讯录中选择一个或多个联系人：

```js
$contact.pick({
  multi: false,
  handler: function(contact) {
    
  }
})
```

其中 `multi` 为 `true` 时表示选择多个联系人。

# $contact.fetch(object)

通过关键字查找某些联系人：

```js
$contact.fetch({
  key: "Ying",
  handler: function(contacts) {

  }
})
```

获得的是一个数组，每个元素支持很多属性，请参考：https://developer.apple.com/documentation/contacts/cncontact

也可以查找某个分组下面的所有联系人：

```js
$contact.fetch({
  group,
  handler: function(contacts) {

  }
})
```

# $contact.create(object)

创建联系人：

```js
$contact.create({
  givenName: "Ying",
  familyName: "Zhong",
  phoneNumbers: {
    "Home": "18000000000",
    "Office": "88888888"
  },
  emails: {
    "Home": "log.e@qq.com"
  },
  handler: function(resp) {

  }
})
```

# $contact.save(object)

将更新后的 contact 对象存储到系统通讯录：

```js
$contact.save({
  contact,
  handler: function(resp) {

  }
})
```

# $contact.delete(object)

删除一些联系人：

```js
$contact.delete({
  contacts: contacts
  handler: function(resp) {
    
  }
})
```

# $contact.fetchGroups(object)

获取联系人分组：

```js
var groups = await $contact.fetchGroups();

console.log("name: " + groups[0].name);
```

# $contact.addGroup(object)

添加一个新的分组：

```js
var group = await $contact.addGroup({"name": "Group Name"});
```

# $contact.deleteGroup(object)

删除一个分组：

```js
var groups = await $contact.fetchGroups();

$contact.deleteGroup(groups[0]);
```

# $contact.updateGroup(object)

保存更新后的分组：

```js
var group = await $contact.fetchGroups()[0];
group.name = "New Name";

$contact.updateGroup(group);
```

# $contact.addToGroup(object)

将联系人添加到分组：

```js
$contact.addToGroup({
  contact,
  group
});
```

# $contact.removeFromGroup(object)

将联系人从分组中移除：

```js
$contact.removeFromGroup({
  contact,
  group
});
```
```

## docs/sdk/intro.md

```markdown
# 原生 SDK

在这一章我们主要介绍 JSBox 对 iOS 原生 SDK 的封装，通过这些接口我们可以用 JavaScript 代码调用原生接口，从而实现强大的扩展功能。

iOS 的原生 SDK 是非常多的，目前 JSBox 第一版只实现了其中最重要的一些 SDK，以下是一个简短的介绍。

# $message

用于发送短信和邮件，相比于 `$system.sms` 和 `$system.mailto` 而言有更灵活的参数。

# $calendar

用于对系统日历进行读取和存储的接口。

# $reminder

用于对系统提醒事项进行读取和存储的接口。

# $contact

用于对系统联系人进行读取和存储的接口。

# $location

用于获取用户地理位置和罗盘数据等信息的接口。

# $motion

用于获取设备加速度等传感器数据的接口。

# $spotlight

用于更新 spotlight 索引的接口。

# $push

用于安排本机推送提醒的接口。

# $safari

通过 Safari View Controller 打开网页，获得比 WebView 更好的体验。

> 以上只是一个简短的介绍，在后面可以查询各个接口如何使用。
```

## docs/sdk/location.md

```markdown
> 用于与 GPS 模块进行交互，例如获取位置或追踪位置

# $location.available

检查位置服务是否可用：

```js
let available = $location.available;
```

# $location.fetch(object)

获取地理位置：

```js
$location.fetch({
  handler: function(resp) {
    const lat = resp.lat;
    const lng = resp.lng;
    const alt = resp.alt;
  }
})
```

# $location.startUpdates(object)

监听地理位置变化：

```js
$location.startUpdates({
  handler: function(resp) {
    const lat = resp.lat;
    const lng = resp.lng;
    const alt = resp.alt;
  }
})
```

# $location.trackHeading(object)

监听罗盘数据变化：

```js
$location.trackHeading({
  handler: function(resp) {
    const magneticHeading = resp.magneticHeading;
    const trueHeading = resp.trueHeading;
    const headingAccuracy = resp.headingAccuracy;
    const x = resp.x;
    const y = resp.y;
    const z = resp.z;
  }
})
```

# $location.stopUpdates()

停止更新。

# $location.select(object)

从 iOS 内置的地图上选取一个点：

```js
$location.select({
  handler: function(result) {
    const lat = result.lat;
    const lng = result.lng;
  }
})
```

# $location.get()

获取当前位置，和 $location.fetch 类似但使用 async await 实现。

```js
const location = await $location.get();
```

# $location.snapshot(object)

生成地图的一个截图：

```js
const loc = await $location.get();
const lat = loc.lat;
const lng = loc.lng;
const snapshot = await $location.snapshot({
  region: {
    lat,
    lng,
    // distance: 10000
  },
  // size: $size(256, 256),
  // showsPin: false,
  // style: 0 (0: unspecified, 1: light, 2: dark)
});
```
```

## docs/sdk/message.md

```markdown
> 用于处理和短信或邮件相关的操作

# $message.sms(object)

调用系统接口发送短信：

```js
$http.download({
  url: "https://images.apple.com/v/iphone/compare/f/images/compare/compare_iphone7_jetblack_large_2x.jpg",
  handler: function(resp) {
    $message.sms({
      recipients: ["18688888888", "10010"],
      body: "Message body",
      subject: "Message subject",
      attachments: [resp.data],
      handler: function(result) {

      }
    })
  }
})
```

参数 | 说明
---|---
recipients | 接受者
body | 内容
subject | 主题
attachments | 附件(图片或文件)
result | 0: 取消 1: 成功 2: 失败

# $message.mail(object)

调用系统接口发送邮件：

```js
$http.download({
  url: "https://images.apple.com/v/iphone/compare/f/images/compare/compare_iphone7_jetblack_large_2x.jpg",
  handler: function(resp) {
    $message.mail({
      subject: "Message subject",
      to: ["18688888888", "10010"],
      cc: [],
      bcc: [],
      body: "Message body",
      attachments: [resp.data],
      handler: function(result) {

      }
    })
  }
})
```

参数 | 说明
---|---
subject | 主题
to | 接受者
cc | 抄送
bcc | 密送
body | 内容
isHTML | 内容是否为 HTML
attachments | 附件(图片或文件)
result | 0: 取消 1: 保存 2: 成功 3: 失败
```

## docs/sdk/motion.md

```markdown
> 用于与系统自带的传感器交互，例如获取加速度

# $motion.startUpdates(object)

监听 motion 数据变化：

```js
$motion.startUpdates({
  interval: 0.1,
  handler: function(resp) {

  }
})
```

返回的数据请参考 [CMDeviceMotion](https://developer.apple.com/documentation/coremotion/cmdevicemotion)。

# $motion.stopUpdates()

停止更新 motion 数据。
```

## docs/sdk/reminder.md

```markdown
> 用于与系统提醒事项进行交互，例如读取或写入

# $reminder.fetch(object)

用于读取提醒事项（会提示用户授权）：

```js
$reminder.fetch({
  startDate: new Date(),
  hours: 2 * 24,
  handler: function(resp) {
    const events = resp.events;
  }
})
```

看起来和 `$calendar` 极为相似，返回的数据是如下结构：

属性 | 类型 | 读写 | 说明
---|---|---|---
title | string | 读写 | 标题
identifier | string | 只读 | id
location | string | 读写 | 位置
notes | string | 读写 | 备注
url | string | 读写 | 网址
modifiedDate | date | 只读 | 修改时间
creationDate | date | 只读 | 创建时间
completed | boolean | 读写 | 是否完成
completionDate | date | 只读 | 完成时间
alarmDate | date | 读写 | 闹钟时间
priority | number | 读写 | 优先级(1 ~ 9) 

# $reminder.create(object)

用于创建一个提醒事项：

```js
$reminder.create({
  title: "Hey!",
  alarmDate: new Date(),
  notes: "Hello, World!",
  url: "https://apple.com",
  handler: function(resp) {

  }
})
```

可以通过 `alarmDate` 和 `alarmDates` 来指定提醒闹钟时间。

# $reminder.save(object)

和 `$calendar.save` 类似，用于修改 event 后保存更新：

```js
$reminder.save({
  event,
  handler: function(resp) {

  }
})
```

# $reminder.delete(object)

删除某个提醒事项：

```js
$reminder.delete({
  event,
  handler: function(resp) {
    
  }
})
```

> 其实 `$reminder` 和 `$calendar` 极为类似，在 iOS 内部也的确如此，他们有类似的接口设计，并且继承同一个数据基类。
```

## docs/sdk/safari.md

```markdown
> 用于 Safari 交互，例如打开 Safari View Controller 或注入 JavaScript 到 Safari

# $safari.open(object)

通过 [Safari View Controller](https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller) 打开网页：

```js
$safari.open({
  url: "https://www.apple.com",
  entersReader: true,
  height: 360,
  handler: function() {

  }
})
```

`entersReader` 表示在可能的情况下自动进入阅读模式。

`height` 可以设置在 Widget 上运行时的打开高度，可选项。

`handler` 为完成后的回调，可选项。

# $safari.items

当你使用 Action Extension 时，可以使用这个方法获得 Safari 环境里的数据：

```js
const items = $safari.items; // JSON format
```

# $safari.inject(script)

> 在 iOS 15 上已过时，请使用更好的 [Safari 浏览器扩展](safari-extension/intro.md)。

当你使用 Action Extension 时，可以使用这个方法向 Safari 注入 JavaScript:

```js
$safari.inject("window.location.href = 'https://apple.com';")
```

Action Extension 会被关闭，同时 JavaScript 会被运行在 Safari。

更多有用的例子：https://github.com/cyanzhong/xTeko/tree/master/extension-scripts/safari-extensions

# $safari.addReadingItem(object)

添加到 Safari 的阅读列表：

```js
$safari.addReadingItem({
  url: "https://sspai.com",
  title: "Title", // Optional
  preview: "Preview text" // Optional
})
```
```

## docs/shortcuts/intents.md

```markdown
# 运行 JSBox 脚本

在 Siri 或 Shortcuts 应用中运行 JSBox 脚本非常简单，你可以发送一个请求并将返回的结果（字符串）。

做到这一点你仅需要通过 `$intents.finish()` 接口，例如：

```js
var result = await $http.get("");

$intents.finish(result.data);
```

简单来说，代码可以进行异步操作，最后通过 `$intents.finish()` 告诉 Siri 运行结束即可。

当代码中没有显式调用 `$intents.finish()`，将会在运行完之后自动结束，也即不能进行异步操作。

# 设置视图的高度

在 Siri 或 Shortcuts 应用运行带界面的脚本时，默认高度为 320，你可以这样设置高度：

```js
$intents.height = 180;
```

# 设置参数

在 iOS 13 的捷径应用上，你可以为 JSBox 的捷径模块指定两个参数：`脚本名`和`输入参数`。

输入参数在捷径应用中显示类型为字符串类型，但请填写一个捷径中的字典类型，JSBox 在获取到之后会解析成一个 JSON 数据，你可以通过 `$context.query` 获取：

```js
const query = $context.query;
```

同时，`$intents.finish(result)` 会将 result 作为结果输出给下一个捷径动作。
```

## docs/shortcuts/intro.md

```markdown
# 什么是捷径（Shortcuts）

被 Apple 收购的 Workflow 应用最终被重新塑造成了捷径应用，如果你还不知道这是什么，你可以通过[这篇文章](https://mp.weixin.qq.com/s/JGKnkHNFcz0I_A1n__-JsA)了解一下。

简单说，捷径和 Workflow 基本一样，但能够与 Siri 有更深的结合，同时也可以更好的和第三方应用协作。

当我们在说捷径的时候，指代的是下面两个部分：

- Siri 中的捷径语音指令
- 捷径独立应用（前 Workflow）

# JSBox 如何支持 Shortcuts

就目前而言，我们在 JSBox 上面设计了以下几个功能：

- 通过语音在 Siri 界面运行 JSBox 脚本
- 在 Siri 和捷径应用里面运行 JSBox 脚本
- 在 Siri 界面显示由 JSBox 脚本编写的界面
- 在捷径应用里面利用 JSBox 运行 JavaScript

# 注意事项

- 需要 iOS 12 及以上的系统版本
- 捷径独立应用请在 App Store 安装
```

## docs/shortcuts/scripting.md

```markdown
# 在捷径应用里运行 JavaScript

JSBox 还能为捷径应用增加运行 JavaScript 的功能，当你需要在捷径应用里面处理复杂的数据时，不如通过这个方案实现。

由于捷径应用并不支持第三方应用处理输入和输出数据，所以这套逻辑借助于剪贴板实现：

- 将 JavaScript 拷贝到剪贴板
- 执行 JSBox 提供的运行 JavaScript 动作
- 读取剪贴板中的结果

简单说，JSBox 执行动作的时候会读取剪贴板中的 JavaScript，执行之后把结果写回到剪贴板，进而完成了通过 JSBox 执行 JavaScript 的过程。

同样的，异步任务需要通过 $intents.finish 来告诉捷径应用已经执行完成：

```js
const a = "Hello";
const b = "World";
const result = [a, b].join(", ");

$intents.finish(result);
```

你可以通过安装这个 Shortcut 体验这个功能：[Run JavaScript](shortcuts://import-workflow?url=https://github.com/cyanzhong/xTeko/raw/master/extension-demos/scripting.shortcut&name=Run%20JavaScript)。
```

## docs/shortcuts/ui-intents.md

```markdown
# 显示 JSBox 界面

你可以在 Siri 界面显示由 JSBox 脚本编写的界面，这种形式无需通过 `$intents.finish()` 结束运行，更确切地说这种模式运行的脚本，就是普通的带界面的 JSBox 脚本，你只需要在脚本设置里面将其添加到 Siri 或捷径应用即可。

例如：

```js
$ui.render({
  views: [
    {
      type: "label",
      props: {
        text: "Hey, Siri!"
      },
      layout: function(make, view) {
        make.center.equalTo(view.super);
      }
    }
  ]
});
```

这个代码可以在 Siri 界面显示一个文字：`Hey, Siri!`。

# 设置参数

在 iOS 13 的捷径应用上，你可以为 JSBox 的捷径模块指定两个参数：`脚本名`和`输入参数`。

输入参数在捷径应用中显示类型为字符串类型，但请填写一个捷径中的字典类型，JSBox 在获取到之后会解析成一个 JSON 数据，你可以通过 `$context.query` 获取：

```js
const query = $context.query;
```
```

## docs/shortcuts/voice.md

```markdown
# Siri 语音指令

你可以通过 Siri 的语音指令启动 JSBox 脚本，并且可以直接在 Siri 界面展示结果或页面。

添加方式有如下两种：

- 脚本设置页面 -> 添加为 -> 添加为 Siri
- 系统设置页面 -> Siri 与搜索 -> 在捷径中找到相应的脚本
```

## docs/sqlite/intro.md

```markdown
# SQLite

除了使用文件和缓存系统以外，在 JSBox v1.28 之后你还可以使用 SQLite 作为数据持久化方案，SQLite 是一个轻量级的数据库系统，适合在移动平台使用。请参考 SQLite 官方文档以获得更多信息：https://www.sqlite.org/。

# FMDB

[FMDB](https://github.com/ccgus/fmdb) 是 SQLite 的一个 Objective-C 封装，JSBox 使用了这个库，并提供了更上一层的封装让你可以通过 JavaScript 调用。也即，在必要的情况下你可以通过 Runtime 直接使用 FMDB。当然在大部分的时候，JSBox 提供的接口已经够用。

# SQLite 浏览器

为了更好地支持 SQLite，与接口同时推出的还有一个轻量、简便的 SQLite 浏览器。你可以可视化的查看 SQLite 文件的内容，目前还是只读版本，敬请期待后续的更新。
```

## docs/sqlite/queue.md

```markdown
# 多线程下的 SQLite 实例

不要用多个线程同时访问一个 SQLite 实例，如果有这个必要，你可以通过 Queue 来实现：

```js
const queue = $sqlite.dbQueue("test.db");

// Operations
queue.operations(db => {
  db.update();
  db.query();
  //...
});

// Transaction
queue.transaction(db => {
  db.update();
  db.query();
  //...
  const rollback = errorOccured;
  return rollback;
});

queue.close();
```
```

## docs/sqlite/transaction.md

```markdown
# db.beginTransaction()

对于 SQLite 实例，可以使用 `beginTransaction()` 来开始一个事务。

# db.commit()

对于 SQLite 实例，可以使用 `commit()` 来提交一个事务。

# db.rollback()

对于 SQLite 实例，可以使用 `rollback()` 来回滚一个事务。
```

## docs/sqlite/usage.md

```markdown
# $sqlite.open(path)

使用文件路径来创建一个 SQLite 实例：

```js
const db = $sqlite.open("test.db");
```

# $sqlite.close(db)

关闭一个 SQLite 实例：

```js
const db = $sqlite.open("test.db");

//...
$sqlite.close(db); // Or db.close();
```

# 更新操作

SQLite 实例支持通过 update 进行更新操作：

```js
db.update("CREATE TABLE User(name text, age integer)");
// Return: { result: true, error: error }
```

也支持占位符和参数：

```js
db.update({
  sql: "INSERT INTO User values(?, ?)",
  args: ["Cyan", 28]
});
```

注：请勿通过参数拼接来进行数据库的更新操作，在任何时候都要使用占位符和参数列表。

# 查询操作

SQLite 实例支持通过 query 进行查询操作：

```js
db.query("SELECT * FROM User", (rs, err) => {
  while (rs.next()) {
    const values = rs.values;
    const name = rs.get("name"); // Or rs.get(0);
  }
  rs.close();
});
```

Result set 还支持如下操作：

```js
const columnCount = rs.columnCount; // Column count
const columnName = rs.nameForIndex(0); // Column name
const columnIndex = rs.indexForName("age"); // Column index
const query = rs.query; // SQL Query
```

请参考 [Result Set 文档](object/result-set.md)了解更多内容。

同样的，当查询有占位符和参数时，使用方法和 update 类似：

```js
db.query({
  sql: "SELECT * FROM User where age = ?",
  args: [28]
}, (rs, err) => {

});
```
```

## docs/ssh/channel.md

```markdown
# session.channel

session 中的 channel 对象提供执行脚本等操作，结构如下：

参数 | 类型 | 说明
---|---|---
session | session | session 实例
bufferSize | number | buffer size
type | number | 类型
lastResponse | string | 响应
requestPty | bool | request pty
ptyTerminalType | number | pty terminal type
environmentVariables | json | 环境变量

# channel.execute(object)

执行脚本：

```js
channel.execute({
  script: "ls -l /var/lib/",
  timeout: 0,
  handler: function(result) {
    console.log(`response: ${result.response}`)
    console.log(`error: ${result.error}`)
  }
})
```

# channel.write(object)

执行 command:

```js
channel.write({
  command: "",
  timeout: 0,
  handler: function(result) {
    console.log(`success: ${result.success}`)
    console.log(`error: ${result.error}`)
  }
})
```

# channel.upload(object)

上传本地文件到服务器：

```js
channel.upload({
  path: "resources/notes.md",
  dest: "/home/user/notes.md",
  handler: function(success) {
    console.log(`success: ${success}`)
  }
})
```

# channel.download(object)

从服务器下载文件到本地：

```js
channel.download({
  path: "/home/user/notes.md",
  dest: "resources/notes.md",
  handler: function(success) {
    console.log(`success: ${success}`)
  }
})
```
```

## docs/ssh/intro.md

```markdown
# Secure Shell

从 v1.14.0 开始，JSBox 支持 SSH，你可以通过简单的 JavaScript 连接至你的服务器，这里有一个完整的例子来帮你有个宏观的了解：[ssh-example](https://github.com/cyanzhong/xTeko/tree/master/extension-demos/ssh-example)。

JSBox 提供的 SSH 相关接口主要包括三个方面：

- session
- channel
- sftp

通过这些接口你可以连接服务器，执行脚本，也能上传下载文件。

JSBox 的 SSH 接口基于 [NMSSH](https://github.com/NMSSH/NMSSH) 的实现，你可以参考 NMSSH 的文档来了解整体设计。

# $ssh.connect(object)

通过密码或公钥私钥连接至服务器，同时能执行一段脚本：

```js
$ssh.connect({
  host: "",
  port: 22,
  username: "",
  public_key: "",
  private_key: "",
  // password: "",
  script: "ls -l /var/lib/",
  handler: function(session, response) {
    console.log(`connect: ${session.connected}`)
    console.log(`authorized: ${session.authorized}`)
    console.log(`response: ${response}`)
  }
})
```

这个例子通过 `public_key` 和 `private_key` 来授权，你可以将密钥文件打包放在安装包里，正如 [ssh-example](https://github.com/cyanzhong/xTeko/tree/master/extension-demos/ssh-example) 里面所示例的那样。

这个接口会返回一个 session 实例和 response，session 对象结构：

参数 | 类型 | 说明
---|---|---
host | string | 主机
port | number | 端口
username | string | 用户名
timeout | number | 超时时间
lastError | error | 错误
fingerprintHash | string | fingerprint
banner | string | banner
remoteBanner | string | remote banner
connected | bool | 是否连接
authorized | bool | 是否授权
channel | channel | channel 实例
sftp | sftp | sftp 实例

通过 session 对象中的 channel 和 sftp，我们可以完成后续的各种操作。

# $ssh.disconnect()

关掉 JSBox 开启的所有 SSH session:

```js
$ssh.disconnect()
```
```

## docs/ssh/sftp.md

```markdown
# session.sftp

session 中的 sftp 对象提供对文件相关的操作，结构如下：

参数 | 类型 | 说明
---|---|---
session | session | session 实例
bufferSize | number | buffer size
connected | bool | 是否连接

# sftp.connect()

创建 SFTP 连接：

```js
await sftp.connect();
```

# sftp.moveItem(object)

移动文件：

```js
sftp.moveItem({
  src: "/home/user/notes.md",
  dest: "/home/user/notes-new.md",
  handler: function(success) {

  }
})
```

# sftp.directoryExists(object)

判断文件夹是否存在：

```js
sftp.directoryExists({
  path: "/home/user/notes.md",
  handler: function(exists) {

  }
})
```

# sftp.createDirectory(object)

创建文件夹：

```js
sftp.createDirectory({
  path: "/home/user/folder",
  handler: function(success) {

  }
})
```

# sftp.removeDirectory(object)

删除文件夹：

```js
sftp.removeDirectory({
  path: "/home/user/folder",
  handler: function(success) {

  }
})
```

# sftp.contentsOfDirectory(object)

列出文件夹中所有的文件：

```js
sftp.contentsOfDirectory({
  path: "/home/user/folder",
  handler: function(contents) {

  }
})
```

# sftp.infoForFile(object)

获取一个文件的属性：

```js
sftp.infoForFile({
  path: "/home/user/notes.md",
  handler: function(file) {

  }
})
```

file 的数据结构：

参数 | 类型 | 说明
---|---|---
filename | string | 文件名
isDirectory | bool | 是否文件夹
modificationDate | date | 修改时间
lastAccess | date | 最后访问时间
fileSize | number | 文件大小
ownerUserID | number | owner user id
ownerGroupID | number | owner group id
permissions | string | 权限
flags | number | flags

# sftp.fileExists(object)

判断文件是否存在：

```js
sftp.fileExists({
  path: "/home/user/notes.md",
  handler: function(exists) {

  }
})
```

# sftp.createSymbolicLink(object)

创建符号链接：

```js
sftp.createSymbolicLink({
  path: "/home/user/notes.md",
  dest: "/home/user/notes-symbolic.md",
  handler: function(success) {

  }
})
```

# sftp.removeFile(object)

删除文件：

```js
sftp.removeFile({
  path: "/home/user/notes.md",
  handler: function(success) {

  }
})
```

# sftp.contents(object)

获取文件二进制数据：

```js
sftp.contents({
  path: "/home/user/notes.md",
  handler: function(file) {

  }
})
```

# sftp.write(object)

将二进制文件写入到服务器：

```js
sftp.write({
  file,
  path: "/home/user/notes.md",
  progress: function(sent) {
    // Optional: determine whether is finished here
    return sent > 1024 * 1024
  },
  handler: function(success) {
    
  }
})
```

# sftp.append(object)

将文件追加到远程文件：

```js
sftp.append({
  file,
  path: "/home/user/notes.md",
  handler: function(success) {
    
  }
})
```

# sftp.copy(object)

复制文件：

```js
sftp.copy({
  path: "/home/user/notes.md",
  dest: "/home/user/notes-copy.md",
  progress: function(copied, totalBytes) {
    // Optional: determine whether is finished here
    return sent > 1024 * 1024
  },
  handler: function(success) {
    
  }
})
```

注：以上所有的 handler 也可以通过 async/await 实现。
```

## docs/uikit/animation.md

```markdown
> 动画是 iOS 的强项之一，JSBox 也对其进行了简单的支持，并且提供了两种支持的方式。

# UIView animation

最简单的方式是使用 `$ui.animate`，例如：

```js
$ui.animate({
  duration: 0.4,
  animation: function() {
    $("label").alpha = 0
  },
  completion: function() {
    $("label").remove()
  }
})
```

这段代码会把 label 的透明度在 0.4 秒的时间里变成 0，然后移除这个 view（completion 是可选的）。

当然这个方法也支持更多的属性让你来实现一个 `spring animation`:

属性 | 类型 | 说明
---|---|---
delay | number | 延迟执行秒数
damping | number | 阻尼大小
velocity | number | 初始速度
options | number | 选项[请参考](https://developer.apple.com/documentation/uikit/uiviewanimationoptions)

# 链式调用

JSBox 引入了一种链式调用的机制，基于 [JHChainableAnimations](https://github.com/jhurray/JHChainableAnimations) 这个库：

```js
$("label").animator.makeBackground($color("red")).easeIn.animate(0.5)
```

比如这行代码可以让 label 的背景色在 0.5 秒的时间里变成红色，同时指定了动画曲线为 `easeIn`。

是的，对 view 调用 `animator` 对象，会返回一个 animator 实例，可以用一个链式语句完成整个动画过程。

具体细节请参考 `JHChainableAnimations` 的文档：https://github.com/jhurray/JHChainableAnimations

> 鉴于该项目缺乏持续的维护，目前不推荐使用此方式实现动画
```

## docs/uikit/context-menu.md

```markdown
# 长按菜单

你可以为任意的 view 提供长按菜单（[Context Menus](https://developer.apple.com/design/human-interface-guidelines/ios/controls/context-menus/)），支持子菜单和 [SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols/overview/)。

下面是一个最简单的样例：

```js
$ui.render({
  views: [
    {
      type: "button",
      props: {
        title: "Long Press!",
        menu: {
          title: "Context Menu",
          items: [
            {
              title: "Title",
              handler: sender => {}
            }
          ]
        }
      },
      layout: (make, view) => {
        make.center.equalTo(view.super);
        make.size.equalTo($size(120, 36));
      }
    }
  ]
});
```

# SF Symbols

除了显示标题，也可以用 `symbol` 属性指定图标，例如：

```js
{
  title: "Title",
  symbol: "paperplane",
  handler: sender => {}
}
```

查询 SF Symbols 相关的名字，你可以使用 Apple 官方提供的应用：https://developer.apple.com/design/downloads/SF-Symbols.dmg 或是这个 JSBox 脚本：https://xteko.com/install?id=141&lang=zh-Hans

# destructive

可以将标题显示成红色来表示这是个危险动作，提醒用户注意：

```js
{
  title: "Title",
  destructive: true,
  handler: sender => {}
}
```

# 子菜单

当一个菜单项包含 `items` 时，会被收纳为一个子菜单：

```js
{
  title: "Sub Menu",
  items: [
    {
      title: "Item 1",
      handler: sender => {}
    },
    {
      title: "Item 2",
      handler: sender => {}
    }
  ]
}
```

这个子菜单点击之后会显示两个二级选项，子菜单可以多层嵌套。

# Inline 子菜单

上述子菜单将会把菜单项作为二级菜单显示，也可以将其直接显示到当前菜单，用分割线隔开，只需设置 `inline` 属性：

```js
{
  title: "Sub Menu",
  inline: true,
  items: [
    {
      title: "Item",
      handler: sender => {}
    }
  ]
}
```

# list 和 matrix

可以为 `list` 和 `matrix` 的某一行或某一个元素提供长按菜单，在这种情况下 `handler` 将会携带 `indexPath` 信息：

```js
$ui.render({
  views: [
    {
      type: "list",
      props: {
        data: ["A", "B", "C"],
        menu: {
          title: "Context Menu",
          items: [
            {
              title: "Action 1",
              handler: (sender, indexPath) => {}
            }
          ]
        }
      },
      layout: $layout.fill
    }
  ]
});
```

这种场景类似于其 `event: didSelect`，只是触发方式是通过长按某一个元素。

# Pull-Down 菜单

作为 iOS 14 的主要改进之一，您可以为 `button` 和 `navButtons` 提供更现代化的 [Pull-Down](https://developer.apple.com/design/human-interface-guidelines/ios/controls/buttons/) 菜单选项。`Pull-Down` 菜单不会将背景模糊，并可以作为主要菜单触发，无需长按。

为 `button` 类型支持 Pull-Down 菜单，仅需在上述配置中增加 `pullDown: true` 参数：

```js
$ui.render({
  views: [
    {
      type: "button",
      props: {
        title: "Long Press!",
        menu: {
          title: "Context Menu",
          pullDown: true,
          asPrimary: true,
          items: [
            {
              title: "Title",
              handler: sender => {}
            }
          ]
        }
      },
      layout: (make, view) => {
        make.center.equalTo(view.super);
        make.size.equalTo($size(120, 36));
      }
    }
  ]
});
```

为 `navButtons` 支持 Pull-Down 菜单也类似，仅需使用 `menu` 参数：

```js
$ui.render({
  props: {
    navButtons: [
      {
        title: "Title",
        symbol: "checkmark.seal",
        menu: {
          title: "Context Menu",
          asPrimary: true,
          items: [
            {
              title: "Title",
              handler: sender => {}
            }
          ]
        }
      }
    ]
  }
});
```

上述参数中，`asPrimary` 表示是否作为一级操作，也即短按触发。
```

## docs/uikit/dark-mode.md

```markdown
# Dark Mode

JSBox 最新版已支持 Dark Mode，不仅是应用本身，更提供了一套 API 让脚本也可以很好地支持 Dark Mode。

本章我们将会讲解 Dark Mode 的机制是什么，以及如何对脚本进行适配。

# theme

`theme` 指定了该脚本的外观偏好，可选值是 `light` / `dark` / `auto`，分别表示始终 Light、始终 Dark，以及自动模式。

可以为脚本全局指定这个参数，例如：

```js
$app.theme = "auto";
```

或是在 [config.json](package/intro.md) 文件中指定：

```json
{
  "settings": {
    "theme": "auto"
  }
}
```

除了全局设置，还可以为某个单独的页面指定不同的 `theme`，写在其 `props` 里面即可：

```js
$ui.push({
  props: {
    "theme": "light"
  }
});
```

也可以对某个特定的 view 指定他的外观偏好：

```js
$ui.render({
  views: [
    {
      type: "view",
      props: {
        "theme": "light"
      }
    }
  ]
});
```

> 请注意，为了避免对现有的脚本造成破坏性的改动，目前脚本默认的 `theme` 是 `light`，也既浅色模式。如果需要适配 Dark Mode，请将其设置为 `auto` 后，再进行颜色的适配工作。

在不同的 theme 下，控件的默认颜色会有所不同，请参考更新后的 [UIKit-Catalog](https://github.com/cyanzhong/xTeko/blob/master/extension-scripts/uikit-catalog.js) 样例以了解更多。

# 动态颜色

为了更好地为 Light 和 Dark 适配不同的颜色，现提供动态颜色接口，例如：

```js
const dynamicColor = $color({
  light: "#FFFFFF",
  dark: "#000000"
});
```

也可以简写为：

```js
const dynamicColor = $color("#FFFFFF", "#000000");
```

写法支持嵌套，你可以用 `$rgba(...)` 接口生成颜色后，用 `$color(...)` 接口生成动态颜色：

```js
const dynamicColor = $color($rgba(0, 0, 0, 1), $rgba(255, 255, 255, 1));
```

另外，JSBox 的 Dark Mode 支持深灰或纯黑两种模式，如果需要对三种状态使用不同的颜色，可以使用：

```js
const dynamicColor = $color({
  light: "#FFFFFF",
  dark: "#141414",
  black: "#000000"
});
```

动态颜色会在 Light 和 Dark 模式下分别呈现不同的颜色，而无需通过监听 Dark Mode 变化之后进行重新设置。

同时，`$color(...)` 接口也支持了几个[语义化颜色](function/index.md?id=colorstring)，让你可以更方便地调用。

# 动态图片

类似的，你可能需要为 Light 或 Dark 提供两套不同的图片资源，像是这样：

```js
const dynamicImage = $image({
  light: "light-image.png",
  dark: "dark-image.png"
});
```

该图片会分别在 Light 模式和 Dark 模式下使用不同的资源，自动完成切换，也可以简写成：

```js
const dynamicImage = $image("light-image.png", "dark-image.png");
```

除此之外，此接口还支持将图片嵌套，像是这样：

```js
const lightImage = $image("light-image.png");
const darkImage = $image("dark-image.png");
const dynamicImage = $image(lightImage, darkImage);
```

> 请注意，这套机制并不适用于 SF Symbols 和在线资源。对于 SF Symbols，请用动态颜色设置 `tintColor` 来完成

# events: themeChanged

对于任何一个控件，都能收到一个 Dark Mode 改变时的事件，例如：

```js
$ui.render({
  views: [
    {
      type: "view",
      layout: $layout.fill,
      events: {
        themeChanged: (sender, isDarkMode) => {
          // Update UI if needed
        }
      }
    }
  ]
});
```

这提供了需要动态改变一些元素的机会，例如根据是否 Dark Mode 来决定控件的 `alpha` 值，或者改变其 `borderColor`（borderColor 不支持动态颜色）。

# Blur Effect

在 iOS 13 及以上，[type: "blur"](component/blur.md) 可以使用更多模糊效果。部分模糊效果可以根据 Light 或 Dark 自动切换，请使用 [$blurStyle](data/constant.md?id=blurstyle) 来实现。

请参考 Apple [相关文档](https://developer.apple.com/documentation/uikit/uiblureffectstyle)以了解更多。

# WebView

WebView 对 Dark Mode 的适配属于比较独立的话题，请参考 [WebKit 官方文档](https://webkit.org/blog/8840/dark-mode-support-in-webkit/)以了解如何适配网页内容。

需要指出的是：对于 JSBox 内置的 WebView，你需要将 `props: opaque` 设置为 `false` 以避免初次打开页面时的白屏问题。

# 如何适配 Dark Mode

大体上来说，让脚本支持 Dark Mode 有三个步骤：

- 将 `theme` 设置为 `auto`
- 使用 `$color(light, dark)` 和 `$image(light, dark)` 提供动态资源
- 使用 `themeChanged` 来完善一些需要动态改变的元素

为了更好地展示这套机制如何工作，我们准备了一个样例项目以供参考：https://github.com/cyanzhong/jsbox-dark-mode

随着机制不断完善，之后可能会增加其他接口，让适配工作变得更简单。同时，`theme` 默认为 `light` 是过渡期的一个设置，之后可能会改为默认为 `auto`，方便仅使用默认控件的脚本直接完美支持 Dark Mode。
```

## docs/uikit/event.md

```markdown
# 事件处理

从 v1.49.0 开始，我们引入了更为完善的事件处理机制，能够在视图生成之后对事件处理进行动态绑定，并且完整支持 iOS 内置的所有事件类型。

# view.whenTapped(handler)

当一个视图被按下时触发：

```js
button.whenTapped(() => {
  
});
```

# view.whenDoubleTapped(handler)

当一个视图被按下两次时触发：

```js
button.whenDoubleTapped(() => {
  
});
```

# view.whenTouched(args)

指定视图按下需要的触点个数和按下次数：

```js
button.whenTouched({
  touches: 2,
  taps: 2,
  handler: () => {

  }
});
```

上述代码在视图两指双击的状况下触发。

如果 button 是一个 Runtime 环境下的对象 (ocValue)，可以通过以下两种方式绑定事件：

```js
button.jsValue().whenTapped(() => {
  
});
```

或者使用 $block:

```js
button.$whenTapped($block("void, void", () => {

}));
```

# view.addEventHandler(args)

为视图添加自定义的事件响应：

```js
textField.addEventHandler({
  events: $UIEvent.editingChanged,
  handler: sender => {

  }
});
```

注意：此方法只能用于 `button`, `text`, `input` 等本身就支持事件响应的 UI controls，而对于 `image` 一类的视图则不支持。完整的事件类型请查看：[$UIEvent](data/constant.md?id=uievent)

# view.removeEventHandlers(events)

移除视图上已添加的事件：

```js
textField.removeEventHandlers($UIEvent.editingChanged);
```

同样的，上述代码也可以在 Runtime 环境使用：

```js
textField.$addEventHandler({
  events: $UIEvent.editingChanged,
  handler: $block("void, id", sender => {
    
  })
});
```
```

## docs/uikit/gesture.md

```markdown
# 手势识别

在触摸设备里面，手势是一个很重要的交互形式，这一伟大的创新得益于 2007 年 [iPhone 问世](https://www.youtube.com/watch?v=x7qPAY9JqE4)。

iOS 支持丰富的手势识别，在 JSBox 里面目前仅支持重要的几个。

# events: tapped

实现了 `tapped` 事件的 view 会响应点击手势：

```js
tapped: function(sender) {

}
```

# events: longPressed

实现了 `longPressed` 事件的 view 会响应长按手势：

```js
longPressed: function(info) {
  let sender = info.sender;
  let location = info.location;
}
```

# events: doubleTapped

实现了 `doubleTapped` 事件的 view 会响应双击事件：

```js
doubleTapped: function(sender) {

}
```

# events: touchesBegan

当点击事件触发时调用：

```js
touchesBegan: function(sender, location, locations) {

}
```

# events: touchesMoved

当点击发生移动时调用：

```js
touchesMoved: function(sender, location, locations) {

}
```

# events: touchesEnded

当点击事件结束时调用：

```js
touchesEnded: function(sender, location, locations) {

}
```

# events: touchesCancelled

当点击事件取消时调用：

```js
touchesCancelled: function(sender, location, locations) {

}
```
```

## docs/uikit/intro.md

```markdown
# 基本概念

JSBox 对 [UIKit](https://developer.apple.com/documentation/uikit) 进行了简单的封装和抽象，让用户可以通过简单的 `JavaScript` 在 JSBox 里面绘制界面，从而提供更好的交互。

JSBox 中界面绘制采用的方案和 [React Native](https://facebook.github.io/react-native/) 以及 [Weex](https://weex.incubator.apache.org/) 不同，不需要你掌握 `HTML` 和 `CSS`，只需要定义 JavaScript Object 就能完成所有工作。

PS: 当然，你写的扩展可以没有任何界面，不提供任何用户交互也是完全可以的。

# 样例

正如前文样例提到的那样，我们可以通过下面的代码在屏幕上创建一个按钮：

```js
$ui.render({
  views: [
    {
      type: "button",
      props: {
        title: "Button"
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.width.equalTo(64)
      },
      events: {
        tapped: function(sender) {
          $ui.toast("Tapped")
        }
      }
    }
  ]
})
```

这段代码囊括了 view 的四个核心：`type`, `props`, `layout` 和 `events`。

# type

type 指定了这个 view 的类型，例如上述的 button，在之后的文档里面我们会详细介绍每种 view 如何使用。

# props

props 里面可以对 view 进行各种属性设置，例如 button 支持的 `title` 属性，不同类型的 view 支持的属性不尽相同，在之后会分别介绍。

# layout

对 view 进行布局，JSBox 沿用了 iOS 里面的 [Auto Layout](https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/AutolayoutPG/index.html) 语法，但你无需对原生的 Auto Layout 有深入的了解（那很难用），因为我们提供的是基于 Masonry 的 DSL：https://github.com/SnapKit/Masonry 在之后我们会示例如何简单的使用 Masonry。

PS: 使用这套布局引擎实际上是一个权衡的方案，之后时间充裕的话可能会提供其他的布局引擎，例如 [Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes)。

# events

在这里响应这个 view 的各种事件，例如 button 支持的 `tapped` 事件，在事件回调方法里面进行各种处理，在之后的文档里面会详细介绍每种 view 支持的 events。

# views

在某个 view 里面定义 `views` 用于描述他的子 view:

```js
{
  views: [

  ]
}
```

子 view 的结构定义和 view 完全一样，递归定义构成一个视图树。

# 类型转换

Native 代码里面很多数据类型是 JavaScript 不具备的，所以 JSBox 提供了一系列的转换方法，这在绘制界面的时候尤其重要：[数据转换](data/intro.md)
```

## docs/uikit/layout.md

```markdown
> 布局指的是确定视图的大小和位置，以及它与其他视图之间的关系

# 布局系统

布局在用户界面的构建过程中是一个必须的步骤，不同的平台有自己不同的布局方案，比如 iOS 平台的 [Auto Layout](https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/AutolayoutPG/index.html) 和 Web 领域的 [Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes)。

布局的目的简单说是：确定控件的位置和大小。

*PS: 这一章有点繁琐，可以暂且跳过以看看后面各种控件，不过理解本章是非常重要的。*

在早期的 iOS 里面，由于屏幕尺寸的局限性，iOS 主流的布局方案是 `frame` 布局，也就是基于绝对的位置和大小，在 JSBox 的控件体系里面你也可以这样干（在 `props` 里面指定 `frame`），但基于下列的原因最好不要这样做：

- 计算过程十分繁琐，描述能力较差
- 需要了解父 view 尺寸，无法动态的得到和更新自身尺寸
- 无法适应复杂多变的屏幕分辨率。

事实上 frame 布局也不是一无是处，他的性能会高于 Auto Layout，但在绝大部分场景下 Auto Layout 已经足够了。

通过 frame 布局的时候，你可以考虑使用 events->layoutSubview 来获得父 view 实时的 frame:

```js
$ui.render({
  views: [
    {
      type: "view",
      layout: $layout.fill,
      events: {
        layoutSubviews: function(view) {
          console.log(`frame: ${JSON.stringify(view.frame)}`)
        }
      }
    }
  ]
})
```

# 基本观念

本节试图用最简单的语言来简单介绍 Auto Layout 的基本观念：

**Auto Layout 的核心观念是在一个视图树里建立一系列的约束关系，用以描述控件与父控件、兄弟控件（有同一个父控件的所有控件）的关系。**

上面这句话有点绕口，他是理解基于约束的布局系统的关键之处，只要所有控件之间的约束是完备的，控件的位置和大小就是基于约束而自适应的，例如有一个按钮：

- 他的高度是 40
- 他距离父控件的相对位置是 (10, 10)
- 他距离父控件右边的距离是 10

在上面的描述中我们并没有指定他的宽度是多少，但是他的大小和位置都是相对父控件而言确定的，无论屏幕的尺寸是多少，我们总是可以得到一个与父控件有一点点边距并且高度是 40 的按钮：

```js
layout: function(make) {
  make.height.equalTo(40)
  make.left.top.right.inset(10)
}
```

当你需要使用 view 实例的时候，可以直接加上这个参数：

```js
layout: function(make, view) {
  make.height.equalTo(40)
  make.width.equalTo(view.height)
}
```

比如你可能会需要宽度等于高度，或者要取 `view.super`。

# 什么是约束

对某些 `属性` 进行 `关系` 描述就是约束，属性可以有上下左右，关系可以有大于小于等于，这是最简单的理解。

# 支持的属性

正如上面代码所示，`height` 属性表示高度，`left` 表示左边，这里介绍最基本最常用的几个，完整文档请参考 [Masonry](https://github.com/SnapKit/Masonry)。

属性 | 说明
---|---
width | 宽度
height | 高度
size | 大小
center | 中心
centerX | x 轴中心
centerY | y 轴中心
left | 左边
top | 上边
right | 右边
bottom | 下边
leading | 前边
trailing | 后边
edges | 四边

你会发现大部分时候 leading/trailing 做的事情和 left/right 看起来没什么不同，这涉及到以阿拉伯语为代表的 RTL (Right-to-left) 语言。简单说，leading 可以屏蔽左右差异，让你的布局在 RTL 语言下面也按他们的顺序显示。

# 支持的关系

关系用来描述属性之间的相对状况，例如 `equalTo`, `offset`，下面是支持的部分关系表：

关系 | 说明
---|---
equalTo(object) | 等于
greaterThanOrEqualTo(object) | 大于或等于
lessThanOrEqualTo(object) | 小于或等于
offset(number) | 偏移量
inset(number) | 边距
insets($insets) | 四边的边距
multipliedBy(number) | 乘以一个倍数
dividedBy(number) | 除以一个倍数
priority(number) | 约束优先级

将上面所说的内容串联起来，我们能得到一个链式语法来描述一个约束：

```js
layout: function(make) {
  make.left.equalTo($("label").right).offset(10)
  make.bottom.inset(0)
  make.size.equalTo($size(40, 40))
}
```

表示此 view 位于 `label` 右侧 10pt 的位置，并且位于父 view 底部 10pt 的位置。

要知道，掌握布局并不是一件容易的事情，各种布局方案都有自己的优点和缺陷，Auto Layout 的描述能力也是有限的（但是是够用的）。

然而，掌握基本的大小和上下左右/居中观念，已经足够应对大部分的场景，剩下的问题可以需要的时候查看文档：

[Masonry 文档](https://github.com/SnapKit/Masonry) [Apple 文档](https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/AutolayoutPG/index.html)

这份文档还比较潦草，可以在后续的例子和 demo 扩展里面看到更多的用法。

# Flex

有时候你可能只需要简单的自动缩放，你可以使用视图的 `flex` 属性：

```js
$ui.render({
  views: [
    {
      type: "view",
      props: {
        bgcolor: $color("red"),
        frame: $rect(0, 0, 0, 100),
        flex: "W"
      }
    }
  ]
});
```

这将创建一个宽度等于父 view，高度为 100 的矩形。其中 flex 是一个字符串，可选字符为：

- `L`: [UIViewAutoresizingFlexibleLeftMargin](https://developer.apple.com/documentation/uikit/uiviewautoresizing/uiviewautoresizingflexibleleftmargin?language=objc)
- `W`: [UIViewAutoresizingFlexibleWidth](https://developer.apple.com/documentation/uikit/uiviewautoresizing/uiviewautoresizingflexiblewidth?language=objc)
- `R`: [UIViewAutoresizingFlexibleRightMargin](https://developer.apple.com/documentation/uikit/uiviewautoresizing/uiviewautoresizingflexiblerightmargin?language=objc)
- `T`: [UIViewAutoresizingFlexibleTopMargin](https://developer.apple.com/documentation/uikit/uiviewautoresizing/uiviewautoresizingflexibletopmargin?language=objc)
- `H`: [UIViewAutoresizingFlexibleHeight](https://developer.apple.com/documentation/uikit/uiviewautoresizing/uiviewautoresizingflexibleheight?language=objc)
- `B`: [UIViewAutoresizingFlexibleBottomMargin](https://developer.apple.com/documentation/uikit/uiviewautoresizing/uiviewautoresizingflexiblebottommargin?language=objc)

例如，使用 "LRTB" 表示 `UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleBottomMargin`。
```

## docs/uikit/method.md

```markdown
> 在 JSBox 的视图系统里面，还提供了很多接口用于与用户进行交互

# $ui.pop()

可以将 push 进来的视图弹出去一层。

# $ui.popToRoot()

直接回到视图栈的第一层。

# $ui.get(id)

获得一个 view 实例，等同于 `$(id)`。

> 如果页面里面只有一个该类型的 view 则可以使用 type 获得，例如 $("list")，否则需要指定 id。

# $ui.alert(object)

给用户一个 alert 框，用于提示或者选择：

```js
$ui.alert({
  title: "Hello",
  message: "World",
  actions: [
    {
      title: "OK",
      disabled: false, // Optional
      style: $alertActionType.default, // Optional
      handler: function() {

      }
    },
    {
      title: "Cancel",
      style: $alertActionType.destructive, // Optional
      handler: function() {

      }
    }
  ]
})
```

创建一个有标题、信息和按钮的 alert，如果不提供 `actions` 的话，一个默认的确定按钮会被自动提供。

`title` 和 `message` 都是可选项，同时如果偷懒的话可以只：

```js
$ui.alert("Haha!")
```

通常可以这样来测试得到的数据，因为目前还没有提供 debug 用的组件。

# $ui.action(object)

和 `$ui.alert` 基本一样，不同的是将会采用 `action sheet` 风格提供选项，目前 iPad 上不可使用。

# $ui.menu(object)

用一种更偷懒的方式创建一个菜单：

```js
$ui.menu({
  items: ["A", "B", "C"],
  handler: function(title, idx) {

  },
  finished: function(cancelled) {
    
  }
})
```

# $ui.popover(object)

使用 Popover 的样式弹出一个浮窗，该接口提供两种使用方式。

方式一，构建一个简单的列表选择浮窗：

```js
const {index, title} = await $ui.popover({
  sourceView: sender,
  sourceRect: sender.bounds, // default
  directions: $popoverDirection.up, // default
  size: $size(320, 200), // fits content by default
  items: ["Option A", "Option B"],
  dismissed: () => {},
});
```

此方式通过 `items` 指定每个选项的标题，返回一个 Promise。

方式二，使用自定义的 `views` 构建一个浮窗：

```js
const popover = $ui.popover({
  sourceView: sender,
  sourceRect: sender.bounds, // default
  directions: $popoverDirection.any, // default
  size: $size(320, 200), // fits screen width by default
  views: [
    {
      type: "button",
      props: {
        title: "Button"
      },
      layout: (make, view) => {
        make.center.equalTo(view.super);
        make.size.equalTo($size(100, 36));
      },
      events: {
        tapped: () => {
          popover.dismiss();
        }
      }
    }
  ]
});
```

此方式通过 `views` 来绘制自定义的界面，返回 popover 本身，可以调用 `dismiss` 方法将其关闭。

其中 `sourceView` 为弹出 popover 所必需的来源，它通常是一个 button，或是 navButtons 回调中的 sender。`sourceRect` 则为 popover 箭头所指向的位置（默认为 sourceView.bounds），`directions` 表示箭头允许的方向。

请参考我们提供的 demo 项目了解更多：https://gist.github.com/cyanzhong/313b2c8d138691233658f1b8a52f02c6

# $ui.toast(message)

显示一个悬浮的提示信息，几秒后自动消失：

```js
$ui.toast("Hey!")
```

`toast` 也支持设置显示时间：

```js
$ui.toast("Hey!", 10)
```

此 Toast 将会显示持续 10 秒钟。

> 你可以通过 $ui.clearToast() 来清除已经显示的 toast。

# $ui.success(string)

与 `toast` 类似，但背景色为绿色，以表示成功：

```js
$ui.success("Done");
```

# $ui.warning(string)

与 `toast` 类似，但背景色为黄色，以表示警告：

```js
$ui.warning("Be careful!");
```

# $ui.error(string)

与 `toast` 类似，但背景色为红色，以表示错误：

```js
$ui.error("Something went wrong!");
```

# $ui.loading(boolean)

在主界面显示一个正在加载的提示框：

```js
$ui.loading(true)
```

PS: 由于历史原因这个接口设计有点问题，除了使用 `true` 和 `false` 来开始或停止一个提示框以外，也可以使用是一个字符串来进行提示：

```js
$ui.loading("加载中...")
```

# $ui.progress(number)

显示加载进度，number 不处于 [0, 1] 之间时自动消失：

```js
$ui.progress(0.5)
```

同样，也支持通过一个（可选的）参数来设置提示语：

```js
$ui.progress(0.5, "下载中...")
```

# $ui.preview(object)

为文件/数据预览提供一个更便捷的方法：

```js
$ui.preview({
  title: "URL",
  url: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg"
})
```

支持的属性：

属性 | 类型 | 说明
---|---|---
title | string | 标题
url | string | 链接
html | string | html
text | string | 文本

# $ui.create(object)

手动创建一个 view，object 参数和 $ui.render 一致：

```js
const canvas = $ui.create({
  type: "image",
  props: {
    bgcolor: $color("clear"),
    tintColor: $color("gray"),
    frame: $rect(0, 0, 100, 100)
  }
});
```

请注意，这个时候 view 还没有父 view，所以在这个时候不能使用他的 `layout` 方法。

取而代之的是，应该在把它添加到父 view 之后，手动进行 layout:

```js
const subview = $ui.create(...);
superview.add(subview);
subview.layout((make, view) => {

});
```

# $ui.window

获得 $ui.push 页面的 window 对象。

# $ui.controller

获得应用内最顶部的 view controller 对象。

# $ui.title

获取或设置应用内最顶部视图的标题。

# $ui.selectIcon()

从图标库中选择图标：

```js
var icon = await $ui.selectIcon();
```
```

## docs/uikit/render.md

```markdown
> render 和 push 是 JSBox 里面绘制界面最主要的方法

# $ui.render(object)

通过 `$ui.render` 我们可以在画布上绘制界面，他的基本用法是：

```js
$ui.render({
  props: {
    id: "label",
    title: "Hello, World!"
  },
  views: [
    {
      type: "label",
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.size.equalTo($size(100, 100))
      }
    }
  ]
})
```

因为本质上画布也是一个 view，所以一样支持 `props`，里面的 title 表示在界面中的标题。

views 表示画布中的所有子 view，其中每个 view 也可以嵌套的包含 `views`，是一个递归的结构。

画布支持的额外 props：

属性 | 类型 | 说明
---|---|---
theme | string | 外观：light/dark/auto
title | string | 标题
titleColor | $color | 标题颜色
barColor | $color | bar 背景色
iconColor | $color | 图标颜色
debugging | bool | 显示界面调试工具
navBarHidden | bool | 隐藏导航栏
statusBarHidden | bool | 隐藏状态栏
statusBarStyle | number | 0 为黑色，1 为白色
fullScreen | bool | 是否显示成全屏模式
formSheet | bool | 是否显示成 form sheet（仅 iPad）
pageSheet | bool | 是否显示成 page sheet（iOS 13）
bottomSheet | bool | 是否显示成 bottom sheet（iOS 15）
modalInPresentation | bool | 是否阻止关闭手势
homeIndicatorHidden | bool | 是否为 iPhone X 系列隐藏 Home Indicator
clipsToSafeArea | bool | 是否以 Safe Area 为边界裁剪视图
keyCommands | array | 快捷键

# $ui.push(object)

基本上与 `$ui.render` 完全一致，只不过 render 直接绘制在画布上，而 `push` 则会滑进来一个新的画布（可以滑动返回），让整个界面变成一个视图栈，可以多次 push 用于表达查看详情等场景。

从 v1.36.0 版本开始，可以通过 $ui.push("detail.ux") 来推进一个通过可视化界面编辑器生成的页面。

# $(id)

该方法用于通过 `id` 在画布中查找一个 view，例如：

```js
const label = $("label");
```

当 id 没有被指定的时候，会通过 type 进行查找，如果画布中只有一个该类型的 view，也会被正确返回。

# 生命周期

目前对于 $ui.render 和 $ui.push，支持以下生命周期回调：

```js
events: {
  appeared: function() {

  },
  disappeared: function() {

  },
  dealloc: function() {

  }
}
```

顾名思义，分别在页面出现、消失和销毁时被调用。

# 键盘高度变化

你可以这样检测键盘高度变化：

```js
events: {
  keyboardHeightChanged: height => {

  }
}
```

# 摇一摇手势

你可以这样检测摇一摇手势：

```js
events: {
  shakeDetected: function() {

  }
}
```

# 支持外接键盘

可以通过 `keyCommands` 设置外接键盘快捷键：

```js
$ui.render({
  props: {
    keyCommands: [
      {
        input: "I",
        modifiers: 1 << 20,
        title: "Discoverability Title",
        handler: () => {
          console.log("Command+I triggered.");
        }
      }
    ]
  }
});
```

modifiers 是一个掩码，有如下取值：

属性 | 取值
---|---
Caps lock | 1 << 16
Shift | 1 << 17
Control | 1 << 18
Alternate | 1 << 19
Command | 1 << 20
NumericPad | 1 << 21

例如需要同时按住 `Command` 和 `Shift` 的话，则 modifiers 为 (1 << 20 | 1 << 17)。
```

## docs/uikit/view.md

```markdown
> JSBox 提供了一套绘制视图的方案，这里我们介绍这套方案的核心概念

# type: "view"

`view` 是最基层的控件，所有控件的父类：

```js
$ui.render({
  views: [
    {
      type: "view",
      props: {
        bgcolor: $color("#FF0000")
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.size.equalTo($size(100, 100))
      },
      events: {
        tapped: function(sender) {

        }
      }
    }
  ]
})
```

将会绘制一个红色的视图，`view` 是所有控件的父类，所以 view 支持的属性其他控件都支持。

PS: 关于各种属性的类型转换请参考：[数据转换](data/intro.md)

# props

属性 | 类型 | 读写 | 说明
---|---|---|---
theme | string | 读写 | light, dark, auto
alpha | number | 读写 | 透明度
bgcolor | $color | 读写 | 背景色
cornerRadius | number | 读写 | 圆角半径
smoothCorners | boolean | 读写 | 圆角是否使用平滑曲线
radius | number | 只写 | 圆角半径（过时，请使用 `cornerRadius`）
smoothRadius | number | 只写 | 平滑圆角半径（过时，请使用 `smoothCorners`）
frame | $rect | 读写 | 位置和大小
size | $size | 读写 | 大小
center | $point | 读写 | 中心位置
flex | string | 读写 | 自动缩放规则
userInteractionEnabled | boolean | 读写 | 是否响应触摸事件
multipleTouchEnabled | boolean | 读写 | 是否支持多点触摸
super | view | 只读 | 父视图
prev | view | 只读 | 前一个视图
next | view | 只读 | 后一个视图
window | view | 只读 | 所属的 window
views | array | 只读 | 子视图
clipsToBounds | boolean | 读写 | 是否裁剪子 view
opaque | boolean | 读写 | 是否不透明
hidden | boolean | 读写 | 是否隐藏
contentMode | $contentMode | 读写 | [请参考](https://developer.apple.com/documentation/uikit/uiview/1622619-contentmode)
tintColor | $color | 读写 | 着色
borderWidth | number | 读写 | 边框宽度
borderColor | $color | 读写 | 边框颜色
circular | bool | 读写 | 是否圆形
animator | object | 只读 | 动画对象
snapshot | object | 只读 | 生成截图
info | object | 读写 | 用于绑定一些信息，例如上下文参数
intrinsicSize | $size | 读写 | 固有内容尺寸
isAccessibilityElement | bool | 读写 | 是否支持无障碍
accessibilityLabel | string | 读写 | accessibility label
accessibilityHint | string | 读写 | accessibility hint
accessibilityValue | string | 读写 | accessibility value
accessibilityCustomActions | array | 读写 | [accessibility custom actions](function/index?id=accessibilityactiontitle-handler)

注意：你不能在 layout 函数里面使用 `next`，因为这个时候视图结构还没有被生成。

从 v1.36.0 版本开始，可以通过 $ui.render("main.ux") 来渲染一个通过可视化界面编辑器生成的页面。

# navButtons

我们可以在界面右上角自定义按钮，例如：

```js
$ui.render({
  props: {
    navButtons: [
      {
        title: "Title",
        image, // Optional
        icon: "024", // Or you can use icon name
        symbol: "checkmark.seal", // SF symbols are supported
        handler: sender => {
          $ui.alert("Tapped!")
        },
        menu: {
          title: "Context Menu",
          items: [
            {
              title: "Title",
              handler: sender => {}
            }
          ]
        } // Pull-Down menu
      }
    ]
  }
})
```

了解关于 Pull-Down menu 的更多信息，请参考 [Pull-Down 菜单](uikit/context-menu?id=pull-down-菜单)。

# titleView

除了通过 `title` 来指定标题，还可以通过 `titleView` 来指定 navBar 顶部展示的视图：

```js
$ui.render({
  props: {
    titleView: {
      type: "tab",
      props: {
        bgcolor: $rgb(240, 240, 240),
        items: ["A", "B", "C"]
      },
      events: {
        changed: sender => {
          console.log(sender.index);
        }
      }
    }
  },
  views: [

  ]
});
```

# layout(function)

手动触发 view 的 layout 方法，参数和 view 定义时的 `layout` 函数完全相同：

```js
view.layout((make, view) => {
  make.left.top.right.equalTo(0);
  make.height.equalTo(100);
});
```

# updateLayout(function)

`updateLayout` 方法可以更新一个控件的 layout：

```js
$("label").updateLayout(make => {
  make.size.equalTo($size(200, 200))
})
```

请注意，`updateLayout` 只能对**已存在**的约束进行更新，否则的话将没有效果。

# remakeLayout(function)

和 updateLayout 类似，但是重新设置 layout 会导致更多性能消耗，在可能时应该使用 updateLayout。

# add(object)

动态添加一个子 view，object 的结构定义和 `$ui.render(object)` 中 view 的完全一致，也可以是通过 `$ui.create(...)` 创建出来的 view 实例。

# get(id)

通过 id 获取一个子 view。

# remove()

将此 view 从父视图中移除。

# insertBelow(view, other)

将一个新的视图插入到一个已存在视图的下方：

```js
view.insertBelow(newView, existingView);
```

# insertAbove(view, other)

将一个新的视图插入到一个已存在视图的上方：

```js
view.insertAbove(newView, existingView);
```

# insertAtIndex(view, index)

将一个新的视图插入到一个指定的位置：

```js
view.insertAtIndex(newView, 4);
```

# moveToFront()

将自己移动到父视图的顶部：

```js
existingView.moveToFront();
```

# moveToBack()

将自己移动到父视图的底部：

```js
existingView.moveToBack();
```

# relayout()

更新 layout，此方法可能在动画中调用。

view 添加之后并不会立即 layout，此方法可以让新的约束立即执行，并可以在之后获取诸如 frame 或者 size 之类的信息。

# setNeedsLayout()

将此 view 标记为需要 layout，会在下一个绘制循环中被 layout。

# layoutIfNeeded()

强制触发下一个绘制循环，可以配合 `setNeedsLayout` 使用：

```js
view.setNeedsLayout();
view.layoutIfNeeded();
```

# sizeToFit()

将 view 调整到当前 bounds 下最合适的大小。

# scale(number)

将控件缩放到一个比例，例如：

```js
view.scale(0.5)
```

# snapshotWithScale(scale)

指定比例得到一个截图：

```js
const image = view.snapshotWithScale(1)
```

# rotate(number)

将控件旋转一个角度，例如：

```js
view.rotate(Math.PI)
```

# events: ready

所有的 view 都支持 `ready` 事件，将会在 view 初始化完成之后调用：

```js
ready: function(sender) {
  
}
```

# events: tapped

所有的 view 都支持 `tapped` 事件：

```js
tapped: function(sender) {

}
```

该事件会在被点击的时候调用，`sender` 表示触发此事件的对象，在上述例子中就是 view 本身。

另外，events 也可以简写成：

```js
tapped(sender) {

}
```

和上述代码具有同样效果。

# events: pencilTapped

所有的 view 都支持 `pencilTapped` 来检测来自 Apple Pencil 的点击：

```js
pencilTapped: function(info) {
  var action = info.action; // 0: Ignore, 1: Switch Eraser, 2: Switch Previous, 3: Show Color Palette
  var enabled = info.enabled; // whether the system reports double taps on Apple Pencil to your app
}
```

# events: hoverEntered

在 iPadOS 13.4 及以上使用 Trackpad，指针进入时调用：

```js
hoverEntered: sender => {
  sender.alpha = 0.5;
}
```

# events: hoverExited

在 iPadOS 13.4 及以上使用 Trackpad，指针移出时调用：

```js
hoverExited: sender => {
  sender.alpha = 1.0;
}
```

# events: themeChanged

用于监听 [Dark Mode](uikit/dark-mode.md) 的改变：

```js
themeChanged: (sender, isDarkMode) => {
  
}
```

更多控件如何使用请参考 [控件列表](component/label.md) 一章。
```

## docs/widget/intro.md

```markdown
# 运行在 Widget 上的扩展

由于 Widget 的交互限制，并不是所有的扩展都可以运行在 Widget 之上，以下是不支持运行在 Widget 的 API 黑名单：

API | 说明
---|---
$ui.action | 弹出 action sheet
$ui.preview | 预览文件或网页
$message.* | 消息相关接口
$photo.take | 拍照
$photo.pick | 选取图片
$photo.prompt | 询问用户获得图片
$share.sheet | 弹出 share sheet
$text.lookup | 查询词典
$picker.* | 选择器
$qrcode.scan | 扫描二维码
$input.speech | 语音识别

当扩展中包含上述接口时，在通知中心运行可能会出现问题。

当你需要进行文字输入时，请尽可能使用 `$input.text` 接口，而不是通过 input 控件。

# Widget 上支持的交互

尽管 Widget 上支持的交互很有限，但对于 `$ui` 还是有少量的接口可以用于提示用户：

API | 说明
---|---
$ui.alert | 弹出 alert
$ui.menu | 弹出菜单
$ui.toast | 显示消息
$ui.loading | 显示加载状态
$input.text | 输入文字
```

## docs/widget/method.md

```markdown
# $widget

$widget 接口提供对 Widget 的相关操作。

# $widget.height

获取或更改 widget 的高度：

```js
// Get
const height = $widget.height;
// Set
$widget.height = 400;
```

# $widget.mode

获取 widget 当前状态（展开/折叠）：

```js
const mode = $widget.mode; // 0: 折叠 1: 展开
```

# $widget.modeChanged

观察 widget 折叠展开状态的变化：

```js
$widget.modeChanged = mode => {
  
}
```
```

## generate-complete-doc.js

```javascript
const fs = require('fs')
const path = require('path')

// Function to read a file and format it for the markdown document
function formatFileContent(filePath) {
  try {
    // Skip binary files
    const ext = path.extname(filePath).toLowerCase()
    const binaryExtensions = ['.ico']
    if (binaryExtensions.includes(ext)) {
      const relativePath = path
        .relative(process.cwd(), filePath)
        .replace(/\\/g, '/')
      return `## ${relativePath}\n\n[Binary file - content not included]\n\n`
    }

    const content = fs.readFileSync(filePath, 'utf8')
    const relativePath = path
      .relative(process.cwd(), filePath)
      .replace(/\\/g, '/')
    return `## ${relativePath}\n\n\`\`\`${getFileExtension(filePath)}\n${content}\n\`\`\`\n\n`
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message)
    const relativePath = path
      .relative(process.cwd(), filePath)
      .replace(/\\/g, '/')
    return `## ${relativePath}\n\n[Error reading file]\n\n`
  }
}

// Get file extension for syntax highlighting
function getFileExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case '.js':
      return 'javascript'
    case '.json':
      return 'json'
    case '.md':
      return 'markdown'
    case '.toml':
      return 'toml'
    case '.html':
      return 'html'
    case '.css':
      return 'css'
    case '.ico':
      return 'icon'
    default:
      return ''
  }
}

// Function to get all files recursively with filter
function getAllFiles(dirPath, arrayOfFiles = [], fileFilter = null) {
  const files = fs.readdirSync(dirPath)

  files.forEach(file => {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Skip node_modules and other unnecessary directories
      if (file !== 'node_modules' && file !== '.git' && file !== '.wrangler') {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles, fileFilter)
      }
    } else {
      // Apply filter if provided
      if (!fileFilter || fileFilter(file)) {
        arrayOfFiles.push(filePath)
      }
    }
  })

  return arrayOfFiles
}

// Main function to generate the documentation
function generateDocumentation() {
  const output = []

  // Add title
  output.push('# 项目完整文档\n\n')

  // Define file filter for relevant file types
  const fileFilter = fileName => {
    const ext = path.extname(fileName).toLowerCase()
    return ['.js', '.md', '.html', '.toml'].includes(ext)
  }

  // Get all relevant files
  const allFiles = getAllFiles('.', [], fileFilter)

  // Sort files for consistent output
  allFiles.sort()

  // Process all files
  allFiles.forEach(filePath => {
    // Skip the output file itself
    if (path.basename(filePath) !== 'project-documentation-complete.md') {
      output.push(formatFileContent(filePath))
    }
  })

  // Write to output file
  const outputFile = 'project-documentation-complete.md'
  fs.writeFileSync(outputFile, output.join(''))
  console.log(`Complete documentation generated: ${outputFile}`)
}

// Run the script
generateDocumentation()

```

