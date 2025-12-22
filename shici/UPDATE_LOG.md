# AI 接口修复更新日志

## 日期: 2025-12-22

## 问题描述
- AI 接口返回错误："Missing 'text' field"
- 问题出现在新接口 v1/chat/completions 上

## 修复内容
1. 修改 explainText 函数
   - 旧接口 (ai/explain): 保持 `{ text, model }` 格式
   - 新接口 (v1/chat/completions): 使用 `{ text, model }` 格式（而不是 OpenAI 标准格式）
   - 移除了可能导致冲突的 messages 字段

2. 保持对新旧接口的兼容性
   - 通过 useLegacy 参数控制使用哪个接口
   - 两个接口都包含必需的 'text' 字段

## 技术说明
- 服务器端的 v1/chat/completions 接口并非标准 OpenAI 兼容接口
- 仍需要 'text' 字段作为主要输入参数
- 修复后两个接口都能正常工作