let words = [];  // 用于存储从 JSON 文件中获取的题目数据
let currentQuestion = {};
let correctCount = 0;
let pendingPrizes = 0;
let totalScore = 0;
let answered = false;  // 标识当前问题是否已经回答
let wrongAttempt = 0;  // 连续错误次数

// 异步加载题目数据
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');  // 从外部文件获取题目
        const data = await response.json();
        words = data.words;  // 将题目数据存储到全局变量中
        displayQuestion();  // 加载成功后显示第一个问题
    } catch (error) {
        console.error('加载题目数据失败:', error);
    }
}

// 获取随机题目
function getRandomQuestion() {
    return words[Math.floor(Math.random() * words.length)];
}

// 显示随机题目
function displayQuestion() {
    if (words.length === 0) {
        console.error('题目数据尚未加载');
        return;
    }
    currentQuestion = getRandomQuestion();
    const questionElement = document.getElementById('question');
    if (currentQuestion.type === 'word') {
        questionElement.innerText = `请补全单词：\n${currentQuestion.hint}`;
    } else if (currentQuestion.type === 'phrase') {
        questionElement.innerText = `请补全短语：\n${currentQuestion.hint}`;
    }
    document.getElementById('answer').value = '';  // 清空输入框
    document.getElementById('answer').disabled = false;  // 启用输入框
    document.getElementById('result').innerText = '';  // 清空结果
    document.getElementById('link').innerHTML = '';  // 清空链接
    document.getElementById('submit-btn').innerText = '提交';  // 重置按钮文本
    document.getElementById('prize').style.display = 'none';  // 隐藏抽奖按钮
    answered = false;  // 重置为未回答状态
    wrongAttempt = 0;  // 重置错误次数
}

// 检查用户答案
function checkAnswer() {
    if (answered) {
        // 如果已经回答正确，点击按钮时显示下一个问题
        displayQuestion();
        return;
    }

    const userAnswer = document.getElementById('answer').value.trim().toLowerCase();
    let correctAnswer = '';
    if (currentQuestion.type === 'word') {
        correctAnswer = currentQuestion.word;
    } else if (currentQuestion.type === 'phrase') {
        correctAnswer = currentQuestion.phrase;
    }

    if (userAnswer === correctAnswer) {
        document.getElementById('result').innerText = '回答正确！';
        document.getElementById('answer').disabled = true;  // 禁用输入框
        correctCount++;
        if (currentQuestion.type === 'word') {
            document.getElementById('link').innerHTML = `单词 "${currentQuestion.word}" 的意思是：${currentQuestion.meaning}。<br>查询链接：<a href="https://dict.cn/search?q=${currentQuestion.word}" target="_blank">https://dict.cn/search?q=${currentQuestion.word}</a>`;
        } else if (currentQuestion.type === 'phrase') {
            document.getElementById('link').innerHTML = `短语 "${currentQuestion.phrase}" 的意思是：${currentQuestion.meaning}。`;
        }

        // 完成一轮后，调整按钮文本
        document.getElementById('submit-btn').innerText = '下一个问题';
        answered = true;  // 标记问题已回答
        wrongAttempt = 0;  // 重置错误次数

        // 每答对5题后，显示抽奖机会
        if (correctCount % 5 === 0) {
            pendingPrizes++;
            document.getElementById('prize').style.display = 'block';  // 显示抽奖按钮
        }
    } else {
        // 用户回答错误
        wrongAttempt++;
        if (wrongAttempt < 3) {
            document.getElementById('result').innerText = `回答错误，您还有 ${3 - wrongAttempt} 次机会！`;
        } else {
            // 连续三次错误，提示正确答案
            document.getElementById('result').innerText = '您已连续三次回答错误，正确答案是：';
            if (currentQuestion.type === 'word') {
                document.getElementById('link').innerHTML = `单词 "${currentQuestion.word}" 的意思是：${currentQuestion.meaning}。<br>更多解释：<a href="https://dict.cn/search?q=${currentQuestion.word}" target="_blank">https://dict.cn/search?q=${currentQuestion.word}</a>`;
            } else if (currentQuestion.type === 'phrase') {
                document.getElementById('link').innerHTML = `短语 "${currentQuestion.phrase}" 的意思是：${currentQuestion.meaning}。`;
            }
            document.getElementById('answer').disabled = true;  // 禁用输入框
            document.getElementById('submit-btn').innerText = '下一个问题';
            answered = true;  // 标记问题已回答
        }
    }
    document.getElementById('score').innerText = `当前分数：${totalScore}`;
}

// 抽奖功能
function drawPrize(time) {
    let probability = 0;
    if (time === 'now') {
        probability = 0.3;
    } else if (time === 'later') {
        probability = 0.35;
    }
    const randomNum = Math.random();
    let prize = 0;
    // 根据概率判断是否中奖
    if (randomNum <= probability) {
        const prizes = [100, 200, 500, 1000, 2000];  // 奖项列表
        prize = prizes[Math.floor(Math.random() * prizes.length)];
        alert(`恭喜您，抽中了${prize}分！`);
    } else {
        alert('很遗憾，未中奖！');
    }
    totalScore += prize;
    pendingPrizes--;  // 抽奖后减少待抽奖次数
    document.getElementById('score').innerText = `当前分数：${totalScore}`;
    document.getElementById('prize').style.display = 'none';  // 抽奖后隐藏按钮
    if (totalScore >= 100000) {
        document.getElementById('gift').style.display = 'block';  // 显示特殊奖励
    }
    displayQuestion();  // 显示下一题
}

// 加载题目数据并初始化游戏
loadQuestions();