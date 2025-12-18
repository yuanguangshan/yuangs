OpenAI Compatible API OpenAI 兼容 API

Copy for LLM 复制到 LLM

View as Markdown Markdown 查看
The Poe API provides access to hundreds of AI models and bots through a single OpenAI-compatible endpoint. Switch between frontier models from all major labs, open-source models, and millions of community-created bots using the same familiar interface.
Poe API 通过一个 OpenAI 兼容的端点，提供对数百个 AI 模型和机器人的访问。使用相同的熟悉界面，在所有主要实验室的前沿模型、开源模型以及数百万个社区创建的机器人之间切换。

Key benefits: 主要优势：

Use your existing Poe subscription points with no additional setup
无需额外设置即可使用现有的 Poe 订阅积分
Access models across all modalities: text, image, video, and audio generation
访问跨所有模态的模型：文本、图像、视频和音频生成
OpenAI-compatible interface works with existing tools like Cursor, Cline, Continue, and more
与 Cursor、Cline、Continue 等现有工具兼容的 OpenAI 接口
Single API key for hundreds of models instead of managing multiple provider keys
一个 API 密钥即可访问数百个模型，无需管理多个提供商密钥
If you're already using the OpenAI libraries, you can use this API as a low-cost way to switch between calling OpenAI models and Poe hosted models/bots to compare output, cost, and scalability, without changing your existing code. If you aren't already using the OpenAI libraries, we recommend that you use our Python SDK.
如果您已经使用 OpenAI 库，可以将此 API 作为低成本方式，在调用 OpenAI 模型和 Poe 托管的模型/机器人之间切换，以比较输出、成本和可扩展性，而无需更改现有代码。如果您尚未使用 OpenAI 库，我们建议您使用我们的 Python SDK。

Using the OpenAI SDK
使用 OpenAI SDK
Python
Node.js
cURL

# pip install openai

import os, openai

client = openai.OpenAI(
api_key=os.getenv("POE_API_KEY"), # https://poe.com/api_key
base_url="https://api.poe.com/v1",
)

chat = client.chat.completions.create(
model="Claude-Opus-4.1", # or other models (Claude-Sonnet-4, Gemini-2.5-Pro, Llama-3.1-405B, Grok-4..)
messages=[{"role": "user", "content": "Top 3 things to do in NYC?"}],
)
print(chat.choices[0].message.content)
Options 选项
Poe Python Library (✅ recommended)
Poe Python 库（✅ 推荐）

Install with pip install fastapi-poe for a native Python interface, better error handling, and ongoing feature support.
使用 pip install fastapi-poe 进行安装，以获得原生 Python 接口、更好的错误处理和持续的功能支持。

→ See the External Application Guide to get started.
→ 参考外部应用程序指南开始使用。

OpenAI-Compatible API (for compatibility use cases only)
OpenAI 兼容 API（仅限兼容性使用场景）

Poe also supports the /v1/chat/completions format if you're migrating from OpenAI or need a REST-only setup.
如果你从 OpenAI 迁移或需要纯 REST 设置，Poe 也支持 /v1/chat/completions 格式。

Base URL: https://api.poe.com/v1 基础 URL： https://api.poe.com/v1

For new projects, use the Python SDK--it's the most reliable and flexible way to build on Poe.
对于新项目，请使用 Python SDK——这是在 Poe 上构建最可靠和灵活的方式。

Known Issues & Limitations
已知问题与限制
Bot Availability 机器人可用性
Private bots are not currently supported - Only public bots can be accessed through the API
私有机器人目前不受支持 - 仅可通过 API 访问公共机器人
The App-Creator and Script-Bot-Creator bots are not available via the OpenAI-compatible API endpoint (or via the Poe Python library)
App-Creator 和 Script-Bot-Creator 机器人无法通过 OpenAI 兼容的 API 端点（或通过 Poe Python 库）访问
Media Bot Recommendations
媒体机器人推荐
Image, video, and audio bots should be called with stream=False for optimal performance and reliability
图像、视频和音频机器人应使用 stream=False 调用以获得最佳性能和可靠性
Parameter Handling 参数处理
Best-effort parameter passing - We make our best attempts to pass down parameters where possible, but some model-specific parameters may not be fully supported across all bots
尽力参数传递 - 我们会尽力在可能的情况下传递参数，但某些特定于模型的参数可能无法在所有机器人中完全支持
Custom parameters (aspect, size, etc.) - You can pass custom bot parameters through the OpenAI SDK using the extra_body parameter. For example: extra_body={"aspect": "1280x720"} for Sora-2. Alternatively, you can use the Poe Python SDK with fp.ProtocolMessage(parameters={...}). See the External Application Guide for details on available parameters.
自定义参数（方面、大小等）- 你可以通过 OpenAI SDK 使用 extra_body 参数传递自定义机器人参数。例如： extra_body={"aspect": "1280x720"} 用于 Sora-2。或者，你可以使用 Poe Python SDK 并使用 fp.ProtocolMessage(parameters={...}) 。有关可用参数的详细信息，请参阅外部应用程序指南。
Additional Considerations
其他注意事项
Some community bots may have varying response formats or capabilities compared to standard language models
一些社区机器人可能与标准语言模型相比具有不同的响应格式或功能
API behavior API 行为
Here are the most substantial differences from using OpenAI:
以下是使用 OpenAI 的主要差异：

Structured outputs are not supported - The response_format parameter with type: "json_schema" is not supported at this time.
不支持结构化输出 - 目前不支持 response_format 参数与 type: "json_schema"
The strict parameter for function calling is ignored, which means the tool use JSON is not guaranteed to follow the supplied schema.
函数调用的 strict 参数被忽略，这意味着工具使用 JSON 不保证遵循提供的模式。
Audio input is not supported; it will simply be ignored and stripped from input
不支持音频输入；它将被简单地忽略并从输入中删除。
Most unsupported fields are silently ignored rather than producing errors. These are all documented below.
大多数不支持的字段会被静默忽略而不是产生错误。这些都在下方有详细说明。
Detailed OpenAI Compatible API Support
详细的 OpenAI 兼容 API 支持
Request fields 请求字段
Field 字段 Support status 支持状态
model Use Poe bot names (Note: Poe UI-specific system prompts are skipped)
使用 Poe 机器人名称（注意：Poe UI 特定的系统提示将被跳过）
max_tokens Fully supported 完全支持
max_completion_tokens Fully supported 完全支持
stream Fully supported 完全支持
stream_options Fully supported 完全支持
top_p Fully supported 完全支持
tools Fully Supported 完全支持
tool_choice Fully Supported 完全支持
parallel_tool_calls Fully Supported 完全支持
stop All non-whitespace stop sequences work
所有非空白停用序列都有效
temperature Between 0 and 2 (inclusive).
在 0 和 2 之间（包括 0 和 2）。
n Must be exactly 1 必须是 1
logprobs Fully supported 完全支持
store Ignored 忽略
metadata Ignored 忽略
response_format Ignored 忽略
prediction Ignored 忽略
presence_penalty Ignored 忽略
frequency_penalty Ignored 忽略
seed Ignored 忽略
service_tier Ignored 忽略
audio Ignored 忽略
logit_bias Ignored 忽略
user Ignored 忽略
modalities Ignored 忽略
top_logprobs Fully supported 完全支持
reasoning_effort Ignored (use extra_body instead)
忽略（使用 extra_body 代替）
extra_body Fully supported - use to pass custom bot parameters like reasoning_effort, thinking_budget, etc.
完全支持 - 使用以传递自定义机器人参数，如 reasoning_effort 、 thinking_budget 等。
Response fields 响应字段
Field 字段 Support status 支持状态
id Fully supported 完全支持
choices[] Will always have a length of 1
长度始终为 1
choices[].finish_reason Fully supported 完全支持
choices[].index Fully supported 完全支持
choices[].message.role Fully supported 完全支持
choices[].message.content Fully supported 完全支持
choices[].message.tool_calls Fully supported 完全支持
object Fully supported 完全支持
created Fully supported 完全支持
model Fully supported 完全支持
finish_reason Fully supported 完全支持
content Fully supported 完全支持
usage.completion_tokens Fully supported 完全支持
usage.prompt_tokens Fully supported 完全支持
usage.total_tokens Fully supported 完全支持
usage.completion_tokens_details Always empty 始终为空
usage.prompt_tokens_details Always empty 始终为空
choices[].message.refusal Always empty 始终为空
choices[].message.audio Always empty 始终为空
logprobs Always empty 始终为空
service_tier Always empty 始终为空
system_fingerprint Always empty 始终为空
Using Custom Parameters with extra_body
使用自定义参数 extra_body
You can pass custom bot-specific parameters using the extra_body field. This allows you to control features like reasoning effort, thinking budget, aspect ratios for image generation, and other model-specific settings.
您可以使用 extra_body 字段传递自定义的机器人特定参数。这允许您控制推理工作量、思考预算、图像生成的宽高比以及其他模型特定的设置。

Python
Node.js

import os, openai

client = openai.OpenAI(
api_key=os.getenv("POE_API_KEY"),
base_url="https://api.poe.com/v1",
)

# Example: Using aspect ratio and quality with image generation models

response = client.chat.completions.create(
model="GPT-Image-1",
messages=[{"role": "user", "content": "A serene landscape with mountains"}],
extra_body={
"aspect": "3:2", # Options: "1:1", "3:2", "2:3", "auto"
"quality": "high" # Options: "low", "medium", "high"
},
stream=False # Recommended for image generation
)
Python
Node.js

import os, openai

client = openai.OpenAI(
api_key=os.getenv("POE_API_KEY"),
base_url="https://api.poe.com/v1",
)

# Example: Using web search and thinking level with Gemini models

response = client.chat.completions.create(
model="Gemini-3-Pro",
messages=[{"role": "user", "content": "What are the latest developments in quantum computing?"}],
extra_body={
"web_search": True,
"thinking_level": "high"
}
)
Error message compatibility
错误消息兼容性
The compatibility layer maintains consistent error formats with the OpenAI API. However, the detailed error messages may not be equivalent. We recommend only using the error messages for logging and debugging.
兼容层与 OpenAI API 保持一致的错误格式。然而，详细的错误消息可能并不相同。我们建议仅将错误消息用于日志记录和调试。

All errors return: 所有错误返回：

{
"error": {
"code": 401,
"type": "authentication_error",
"message": "Invalid API key",
"metadata": {...}
}
}
HTTP / code type When it happens 当发生这种情况时
400 invalid_request_error malformed JSON, missing fields
格式错误的 JSON，缺少字段
401 authentication_error bad/expired key 无效/过期密钥
402 insufficient_credits balance ≤ 0 余额 ≤ 0
403 moderation_error permission denied or authorization issues
权限被拒绝或授权问题
404 not_found_error wrong endpoint / model 错误的端点/模型
408 timeout_error model didn't start in a reasonable time
模型未在合理时间内启动
413 request_too_large tokens > context window token 数量超过上下文窗口
429 rate_limit_error rpm/tpm cap hit RPM/TPM 上限触发
500 provider_error provider-side issues, or invalid requests
提供方问题，或无效请求
502 upstream_error model backend not working
模型后端无法工作
529 overloaded_error transient traffic spike 临时流量激增
Retry tips 重试提示

Respect Retry-After header on 429/503.
在 429/503 时尊重 Retry-After 头信息
Exponential back‑off (starting at 250 ms) plus jitter works well.
指数退避（起始 250 毫秒）加上抖动效果很好。
Idempotency: resubmit the exact same payload to safely retry.
幂等性：重新提交完全相同的负载以安全重试。
Header compatibility 头部兼容性
While the OpenAI SDK automatically manages headers, here is the complete list of headers supported by Poe's API for developers who need to work with them directly.
虽然 OpenAI SDK 自动管理头部，但这里列出了 Poe API 支持的所有头部，供需要直接处理头部的开发者参考。

Response Headers: 响应头：

Header 标题 Definition 定义 Support Status 支持状态
openai-organization OpenAI org Unsupported 不支持
openai-processing-ms Time taken processing your API request
处理您的 API 请求所需时间 Supported 支持
openai-version REST API version (2020-10-01)
REST API 版本（ 2020-10-01 ） Supported 支持
x-request-id Unique identifier for this API request (troubleshooting)
此 API 请求的唯一标识符（用于故障排除） Supported 支持
Rate Limit Headers 速率限制标头

Our rate limit is 500 requests per minute (rpm). We support request-based rate limit headers but do not support token-based rate limiting:
我们的速率限制是每分钟 500 次请求（rpm）。我们支持基于请求的速率限制头，但不支持基于令牌的速率限制：

Supported (Request-based):
已支持（基于请求）：

x-ratelimit-limit-requests - Maximum requests allowed per time window (500)
x-ratelimit-limit-requests - 每个时间窗口允许的最大请求次数（500）
x-ratelimit-remaining-requests - Remaining requests in current time window
x-ratelimit-remaining-requests - 当前时间窗口剩余的请求次数
x-ratelimit-reset-requests - Seconds until the rate limit resets
x-ratelimit-reset-requests - 速率限制重置前的秒数
Not Supported (Token-based):
不支持的（基于令牌）：

x-ratelimit-limit-tokens - Not applicable (Poe does not use token-based rate limiting)
x-ratelimit-limit-tokens - 不适用（Poe 不使用基于 token 的速率限制）
x-ratelimit-remaining-tokens - Not applicable x-ratelimit-remaining-tokens - 不适用
x-ratelimit-reset-tokens - Not applicable x-ratelimit-reset-tokens - 不适用
Getting Started 入门指南
Python
Node.js
cURL

# pip install openai

import os
import openai

client = openai.OpenAI(
api_key=os.environ.get("POE_API_KEY"),
base_url="https://api.poe.com/v1",
)
completion = client.chat.completions.create(
model="gemini-2.5-pro", # or other models (Claude-Sonnet-4, GPT-4.1, Llama-3.1-405B, Grok-4..)
messages=[{"role": "user", "content": "What are the top 3 things to do in New York?"}],
)

print(completion.choices[0].message.content)
Streaming 流式传输
You can also use OpenAI's streaming capabilities to stream back your response:
您也可以使用 OpenAI 的流式传输功能来流式返回您的响应：

Python
Node.js
cURL

# pip install openai

import os
import openai

client = openai.OpenAI(
api_key=os.environ.get("POE_API_KEY"),
base_url="https://api.poe.com/v1",
)

stream = client.chat.completions.create(
model="Claude-Sonnet-4", # or other models (Gemini-2.5-Pro, GPT-Image-1, Veo-3, Grok-4..)
messages=[
{"role": "system", "content": "You are a travel agent. Be descriptive and helpful."},
{"role": "user", "content": "Tell me about San Francisco"},
],
stream=True,
)

for chunk in stream:
print(chunk.choices[0].delta.content or "", end="", flush=True)
File Inputs 文件输入
You can also pass in files using base64-encoded data URLs:
您也可以使用 base64 编码的数据 URL 传递文件：

Python
Node.js
cURL

# pip install openai

import os
import openai

client = openai.OpenAI(
api_key=os.environ.get("POE_API_KEY"),
base_url="https://api.poe.com/v1",
)

with open("test_pdf.pdf", "rb") as f:
base64_pdf = base64.b64encode(f.read()).decode("utf-8")

with open("test_image.jpeg", "rb") as f:
base64_image = base64.b64encode(f.read()).decode("utf-8")

with open("test_audio.mp3", "rb") as f:
base64_audio = base64.b64encode(f.read()).decode("utf-8")

with open("test_video.mp4", "rb") as f:
base64_video = base64.b64encode(f.read()).decode("utf-8")

stream = client.chat.completions.create(
model="Claude-Sonnet-4", # or other models
messages=[
{
"role": "user",
"content": [
{
"type": "text",
"text": "Please describe these attachments."
},
{
"type": "image_url",
"image_url": {
"url": f"data:image/jpg;base64,{base64_image}"
}
},
{
"type": "file",
"file": {
"filename": "test_guide.pdf",
"file_data": f"data:application/pdf;base64,{base64_pdf}"
}
},
{
"type": "file",
"file": {
"filename": "test_audio.mp3",
"file_data": f"data:audio/mp3;base64,{base64_audio}"
}
},
{
"type": "file",
"file": {
"filename": "test_video.mp3",
"file_data": f"data:video77/mp4;base64,{base64_video}"
}
}
]
}
],
stream=True,
)

for chunk in stream:
print(chunk.choices[0].delta.content or "", end="", flush=True)
Additionally, Poe accepts image input files that are hosted on publicly accessible URLs.
此外，Poe 也接受托管在公开可访问 URL 上的图像输入文件。

Python
Node.js
cURL

# pip install openai

import openai

client = openai.OpenAI(
api_key=os.environ.get("POE_API_KEY"),
base_url="https://api.poe.com/v1",
)

stream = client.chat.completions.create(
model="GPT-4o", # or other models
messages=[
{
"role": "user",
"content": [
{
"type": "text",
"text": "Please describe these attachments."
},
{
"type": "image_url",
"image_url": {
"url": "https://psc2.cf2.poecdn.net/assets/_next/static/media/poeFullMultibot.aa56caf5.svg"
}
}
]
}
],
stream=True,
)

for chunk in stream:
print(chunk.choices[0].delta.content or "", end="", flush=True)
Migration checklist (OpenAI → Poe in 60 s)
迁移清单（OpenAI → Poe 在 60 秒内）
Swap base URL - https://api.openai.com/v1 → https://api.poe.com/v1
切换基础 URL - https://api.openai.com/v1 → https://api.poe.com/v1
Replace key env var - OPENAI_API_KEY → POE_API_KEY
替换密钥环境变量 - OPENAI_API_KEY → POE_API_KEY
Select the model/bot you want to use e.g. Claude-Opus-4.1
选择你想使用的模型/机器人，例如 Claude-Opus-4.1
Delete any n > 1, audio, or parallel_tool_calls params.
删除任何 n > 1 、音频或 parallel_tool_calls 参数。
Run tests - output should match except for intentional gaps above.
运行测试 - 输出应匹配，除了上述有意留下的空白。
Pricing & Availability 定价与可用性
All Poe subscribers can use their existing subscription points with the API at no additional cost.
所有 Poe 订阅者都可以免费使用他们现有的订阅点与 API。

This means you can seamlessly transition between the web interface and API without worrying about separate billing structures or additional fees. Your regular monthly point allocation works exactly the same way whether you're chatting directly on Poe or accessing bots programmatically through the API.
这意味着您可以在网页界面和 API 之间无缝切换，而无需担心独立的计费结构或额外费用。无论您是在 Poe 上直接聊天还是在 API 中通过编程方式访问机器人，您的常规每月点数分配都完全相同。

If your Poe subscription is not enough, you can now purchase add-on points to get as much access as your application requires. Our intent in pricing these points is to charge the same amount for model access that underlying model providers charge. Any add-on points you purchase can be used with any model or bot on Poe and work across both the API and Poe chat on web, iOS, Android, Mac, and Windows.
如果你的 Poe 订阅额度不够，现在你可以购买附加点数来获得应用程序所需的访问权限。我们在定价这些点数时的意图是，为模型访问收取与底层模型提供者收取的相同费用。你购买的任何附加点数都可以在 Poe 的任何模型或机器人上使用，并且可以在 API 以及 Web、iOS、Android、Mac 和 Windows 上的 Poe 聊天中跨平台使用。

Support 支持
Feel free to reach out to support if you come across some unexpected behavior when using our API or have suggestions for future improvements.
在使用我们的 API 时遇到意外行为或对未来的改进有建议，请随时联系支持。
