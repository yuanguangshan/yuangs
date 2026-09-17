# KK 词典一键流水线
# 用法：make deploy（检查→同步→部署），make verify（线上验证），make rebuild（重建语料分片），make test（回归测试）

.PHONY: check sync shards sync-shards vocab sync-vocab deploy verify rebuild test setup

# 优先使用项目虚拟环境（make setup 创建），否则退回系统 python3
PY := $(if $(wildcard .venv/bin/python),.venv/bin/python,python3)

# 初始化开发环境：项目级虚拟环境 + 固定版本依赖（避免 --break-system-packages）
setup:
	python3 -m venv .venv
	.venv/bin/pip install -r requirements.txt

# 抽取 dict.html 内联 JS 做语法检查
check:
	@python3 -c "import re;open('/tmp/dict_check.js','w').write('\n;\n'.join(re.findall(r'<script>(.*?)</script>', open('dict.html').read(), re.S)))"
	@node --check /tmp/dict_check.js && echo "✓ JS 语法 OK"

# 同步页面到 deploy/（⚠️ 双文件规则：index.html 服务根路径 dict.want.biz，必须一起更新）
sync:
	@cp dict.html deploy/dict.html && cp dict.html deploy/index.html
	@echo "✓ 已同步 deploy/dict.html + deploy/index.html"

# 重建语料分片（词形还原 + 二级分片 + 版本目录；缺 lemminflect 会硬失败，见 requirements.txt）
shards:
	$(PY) tools/build_shards.py

# 词形归并回归测试：关键查询的召回预期（不规则变化/歧义词/二级路由）
test:
	$(PY) tools/regression_check.py

# 分片同步到 deploy（manifest 单独复制到站点根，避开长缓存通配规则）
sync-shards:
	@rsync -a --delete --exclude manifest.json corpus_shards/ deploy/corpus_shards/
	@cp corpus_manifest.json deploy/corpus_manifest.json
	@echo "✓ 分片已同步到 deploy/corpus_shards/ + corpus_manifest.json"

# 重建小学词汇表（解析词表源文件 + uapis 补音标词性，增量缓存断点续传）
vocab:
	$(PY) tools/build_vocab.py

sync-vocab:
	@if [ -f vocab_primary.json ]; then cp vocab_primary.json deploy/vocab_primary.json; echo "✓ 词汇表数据已同步"; else echo "⚠️ vocab_primary.json 不存在（make vocab 生成），跳过"; fi

# 全量发布：语法检查 → 页面同步 → 分片同步 → 词汇表同步 → 部署（内置 8 分钟超时 + 3 次重试，防代理假卡死）
deploy: check sync sync-shards sync-vocab
	@ok=0; \
	for i in 1 2 3; do \
		echo "部署尝试 $$i/3 ..."; \
		rm -f /tmp/kk_deploy.log; \
		timeout 480 npx wrangler pages deploy deploy --project-name=kk-dict --branch=main --commit-dirty=true > /tmp/kk_deploy.log 2>&1; \
		if grep -q "Deployment complete" /tmp/kk_deploy.log; then \
			grep -E "Success!|Deployment complete" /tmp/kk_deploy.log | tail -2; \
			ok=1; break; \
		fi; \
		echo "未完成（代理抖动或超时），5 秒后重试..."; sleep 5; \
	done; \
	[ $$ok -eq 1 ] || { echo "✗ 三次尝试均失败，查看 /tmp/kk_deploy.log"; exit 1; }

# 语料全量重建（先重跑拆句，再重建分片）
rebuild:
	python3 tools/build_corpus.py
	$(MAKE) shards

# 部署后验证：四入口内容哈希一致（比字节数更强）+ 线上/本地版本号一致 + 分片 immutable + 指针不缓存
# （注意：不要探测旧的 /corpus_shards/a.json —— 那是已下线路径，200 是边缘缓存存量，会误报）
verify:
	@echo "== 四入口内容哈希 =="
	@for U in https://kk-dict.pages.dev/ https://kk-dict.pages.dev/dict https://dict.want.biz/ https://dict.want.biz/dict; do \
		echo "$$U → $$(curl -sL --max-time 20 "$$U" | md5)"; \
	done | tee /tmp/kk_verify.md5; \
	HN=$$(awk -F'→ ' '{print $$2}' /tmp/kk_verify.md5 | sort -u | wc -l | tr -d ' '); \
	if [ "$$HN" = "1" ]; then echo "✓ 四入口内容一致"; else echo "✗ 存在差异"; fi
	@echo "== 版本指针与分片 =="
	@V=$$(curl -s --max-time 15 https://dict.want.biz/corpus_manifest.json | python3 -c "import json,sys;print(json.load(sys.stdin)['version'])"); \
	L=$$(python3 -c "import json;print(json.load(open('corpus_manifest.json'))['version'])"); \
	echo "线上版本: $$V ｜ 本地版本: $$L"; \
	if [ "$$V" = "$$L" ]; then echo "✓ 版本一致"; else echo "✗ 版本不一致：先 make deploy"; fi; \
	printf '%s' "版本分片探测: "; curl -sI --max-time 15 "https://dict.want.biz/corpus_shards/$$V/ab.json" | grep -iE "^HTTP" | tr -d '\r'; \
	curl -sI --max-time 15 "https://dict.want.biz/corpus_shards/$$V/ab.json" | grep -i "cache-control" | tr -d '\r'; \
	printf '%s' "manifest 缓存头: "; curl -sI --max-time 15 https://dict.want.biz/corpus_manifest.json | grep -i "cache-control" | tr -d '\r'
