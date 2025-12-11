const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 1. 引入 mongoose

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- 2. 连接数据库 ---
// 【重要】请把下面的 <password> 换成你刚才在网站上设置的密码
const DB_URL = 'mongodb+srv://yuanguangshan:Test%401234@cluster0.rsppwmz.mongodb.net/?appName=Cluster0';

mongoose.connect(DB_URL)
    .then(() => console.log('✅ 数据库连接成功！'))
    .catch(err => console.error('❌ 数据库连接失败:', err));

// --- 3. 定义数据模型 (Schema) ---
// 告诉 Mongoose，我们的用户长什么样
const UserSchema = new mongoose.Schema({
    name: String,
    // MongoDB 会自动生成 _id，不需要我们定义
});

// 创建模型：User 代表了数据库里的 "users" 集合
const User = mongoose.model('User', UserSchema);


// --- 路由重写 (全部变成异步 async/await) ---

// 查 (GET)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // 相当于之前的 readData()
        res.json({ msg: '获取成功', data: users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 增 (POST)
app.post('/users', async (req, res) => {
    try {
        // 直接创建一个新 User 实例并保存
        const newUser = await User.create(req.body);
        res.status(201).json({ msg: '创建成功', data: newUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 改 (PUT) - 注意这里参数改成了 :id (MongoDB 的 _id)
app.put('/users/:id', async (req, res) => {
    try {
        // findByIdAndUpdate: 找到并更新
        // { new: true } 表示返回更新后的数据
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json({ msg: '修改成功', data: updatedUser });
    } catch (err) {
        res.status(404).json({ error: '用户不存在或ID格式错误' });
    }
});

// 删 (DELETE)
app.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: '删除成功' });
    } catch (err) {
        res.status(404).json({ error: '删除失败' });
    }
});

app.listen(PORT, () => {
    console.log(`服务器启动: http://localhost:${PORT}`);
});