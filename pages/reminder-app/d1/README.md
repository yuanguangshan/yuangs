# 生成 VAPID 密钥对

## 方法一（Node 环境）：

### 使用 web-push 库快速生成（一次性执行）：

```bash
npm i -g web-push
web-push generate-vapid-keys
```

输出会有 Public Key（base64url）与 Private Key（base64url d）。若要得到完整 JWK，可使用网页生成（方法二）或将 d/x/y 组合为 JWK。

## 方法二（浏览器控制台）：

在任意 HTTPS 页打开 DevTools Console，运行：

```javascript
(async () => {
  const key = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign','verify']);
  const jwkPriv = await crypto.subtle.exportKey('jwk', key.privateKey);
  const jwkPub = await crypto.subtle.exportKey('jwk', key.publicKey);
  const x = atob(jwkPub.x.replace(/-/g,'+').replace(/_/g,'/'));
  const y = atob(jwkPub.y.replace(/-/g,'+').replace(/_/g,'/'));
  const u8 = new Uint8Array(65); u8[0]=0x04;
  for (let i=0;i<32;i++) { u8[1+i]=x.charCodeAt(i); u8[33+i]=y.charCodeAt(i); }
  const b64u = btoa(String.fromCharCode(...u8)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  console.log("VAPID_PUBLIC_KEY (uncompressed 65 bytes, base64url):", b64u);
  console.log("VAPID_PRIVATE_JWK:", JSON.stringify(jwkPriv));
})();
```

收集到两个值：
- VAPID_PUBLIC_KEY（base64url，长度应为 86 字符左右）
- VAPID_PRIVATE_JWK（JSON）