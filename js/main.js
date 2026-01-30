// 元素获取
const qqInput = document.getElementById('qqNum');
const signBtn = document.getElementById('signBtn');
const queryBtn = document.getElementById('queryBtn');

// 签到功能
signBtn.addEventListener('click', async () => {
  const qq = qqInput.value.trim();
  if (!checkQQ(qq)) {
    showModal('<i class="fas fa-exclamation-circle"></i>', '请输入正确的QQ号！', 'error');
    return;
  }
  const today = getToday();
  // 读取用户数据
  let users = await readGithubFile('users.json');
  // 读取签到积分配置
  const config = await readGithubFile('config.json');
  const signScore = config.signScore || 10;

  // 查找用户
  const userIndex = users.findIndex(item => item.qq === qq);
  if (userIndex > -1) {
    // 用户已存在，判断是否今日签到
    if (users[userIndex].lastSign === today) {
      showModal('<i class="fas fa-clock"></i>', '今日已签到啦，明天再来吧～', 'info');
      return;
    }
    // 未签到，更新积分和签到时间
    users[userIndex].score += signScore;
    users[userIndex].lastSign = today;
    // 添加签到记录
    users[userIndex].signRecords.push({
      time: new Date().toLocaleString(),
      score: signScore
    });
  } else {
    // 新用户，创建数据
    users.push({
      qq: qq,
      score: signScore,
      lastSign: today,
      signRecords: [{
        time: new Date().toLocaleString(),
        score: signScore
      }]
    });
  }

  // 提交数据到GitHub
  const isSuccess = await writeGithubFile('users.json', users);
  if (isSuccess) {
    showModal('<i class="fas fa-gift"></i>', `签到成功！获得${signScore}积分～`);
    qqInput.value = '';
  } else {
    showModal('<i class="fas fa-times-circle"></i>', '签到失败，请稍后重试！', 'error');
  }
});

// 查询积分功能
queryBtn.addEventListener('click', async () => {
  const qq = qqInput.value.trim();
  if (!checkQQ(qq)) {
    showModal('<i class="fas fa-exclamation-circle"></i>', '请输入正确的QQ号！', 'error');
    return;
  }
  // 读取用户数据
  const users = await readGithubFile('users.json');
  const user = users.find(item => item.qq === qq);
  if (user) {
    showModal('<i class="fas fa-coins"></i>', `QQ${qq}当前积分为：${user.score}～`);
  } else {
    showModal('<i class="fas fa-user-plus"></i>', '该用户尚未签到，快去签到领积分吧！', 'info');
  }
});
