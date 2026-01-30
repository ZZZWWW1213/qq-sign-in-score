// 登录元素
const loginBox = document.getElementById('loginBox');
const adminBox = document.getElementById('adminBox');
const adminPwdInput = document.getElementById('adminPwd');
const loginBtn = document.getElementById('loginBtn');

// 配置区元素
const signScoreSet = document.getElementById('signScoreSet');
const saveConfigBtn = document.getElementById('saveConfigBtn');

// 单个用户操作
const singleQq = document.getElementById('singleQq');
const singleScore = document.getElementById('singleScore');
const singleOperBtn = document.getElementById('singleOperBtn');
const checkRecordBtn = document.getElementById('checkRecordBtn');

// 全员操作
const allScore = document.getElementById('allScore');
const allOperBtn = document.getElementById('allOperBtn');

// 用户列表
const userList = document.getElementById('userList');
const emptyTip = document.getElementById('emptyTip');

// 弹窗元素
const recordModal = document.getElementById('recordModal');
const recordTitle = document.getElementById('recordTitle');
const recordList = document.getElementById('recordList');
const closeRecordModal = document.getElementById('closeRecordModal');

// 管理员登录
loginBtn.addEventListener('click', async () => {
  const inputPwd = adminPwdInput.value.trim();
  const config = await readGithubFile('config.json');
  if (inputPwd === config.adminPwd) {
    loginBox.style.display = 'none';
    adminBox.style.display = 'block';
    // 初始化配置和用户列表
    initAdminData();
  } else {
    showModal('<i class="fas fa-times-circle"></i>', '密码错误！请重新输入', 'error');
    adminPwdInput.value = '';
  }
});

// 初始化后台数据
async function initAdminData() {
  // 加载签到积分配置
  const config = await readGithubFile('config.json');
  signScoreSet.value = config.signScore || 10;
  // 加载用户列表
  renderUserList();
}

// 保存配置（修改签到积分）
saveConfigBtn.addEventListener('click', async () => {
  const newScore = Number(signScoreSet.value.trim());
  if (isNaN(newScore) || newScore < 1) {
    showModal('<i class="fas fa-exclamation-circle"></i>', '请输入大于0的数字！', 'error');
    return;
  }
  const config = await readGithubFile('config.json');
  config.signScore = newScore;
  const isSuccess = await writeGithubFile('config.json', config);
  if (isSuccess) {
    showModal('<i class="fas fa-check-circle"></i>', '签到积分配置保存成功！');
  } else {
    showModal('<i class="fas fa-times-circle"></i>', '保存失败，请稍后重试！', 'error');
  }
});

// 单个用户积分操作
singleOperBtn.addEventListener('click', async () => {
  const qq = singleQq.value.trim();
  const score = Number(singleScore.value.trim());
  if (!checkQQ(qq)) {
    showModal('<i class="fas fa-exclamation-circle"></i>', '请输入正确的QQ号！', 'error');
    return;
  }
  if (isNaN(score)) {
    showModal('<i class="fas fa-exclamation-circle"></i>', '请输入有效的积分值！', 'error');
    return;
  }
  let users = await readGithubFile('users.json');
  const userIndex = users.findIndex(item => item.qq === qq);
  if (userIndex === -1) {
    showModal('<i class="fas fa-user"></i>', '该用户不存在！', 'error');
    return;
  }
  // 更新积分
  users[userIndex].score += score;
  // 积分不能为负
  users[userIndex].score = Math.max(0, users[userIndex].score);
  const isSuccess = await writeGithubFile('users.json', users);
  if (isSuccess) {
    showModal('<i class="fas fa-check-circle"></i>', `QQ${qq}积分${score>0?'增加':'减少'}${Math.abs(score)}，当前积分：${users[userIndex].score}！`);
    singleQq.value = '';
    singleScore.value = '';
    renderUserList(); // 刷新列表
  } else {
    showModal('<i class="fas fa-times-circle"></i>', '操作失败，请稍后重试！', 'error');
  }
});

// 全员积分操作
allOperBtn.addEventListener('click', async () => {
  const score = Number(allScore.value.trim());
  if (isNaN(score)) {
    showModal('<i class="fas fa-exclamation-circle"></i>', '请输入有效的积分值！', 'error');
    return;
  }
  let users = await readGithubFile('users.json');
  if (users.length === 0) {
    showModal('<i class="fas fa-users"></i>', '暂无用户数据，无需操作！', 'info');
    return;
  }
  // 批量更新
  users = users.map(item => {
    item.score += score;
    item.score = Math.max(0, item.score);
    return item;
  });
  const isSuccess = await writeGithubFile('users.json', users);
  if (isSuccess) {
    showModal('<i class="fas fa-check-circle"></i>', `全员积分${score>0?'增加':'减少'}${Math.abs(score)}，操作成功！`);
    allScore.value = '';
    renderUserList(); // 刷新列表
  } else {
    showModal('<i class="fas fa-times-circle"></i>', '操作失败，请稍后重试！', 'error');
  }
});

// 渲染用户列表
async function renderUserList() {
  const users = await readGithubFile('users.json');
  userList.innerHTML = '';
  if (users.length === 0) {
    emptyTip.style.display = 'block';
    return;
  }
  emptyTip.style.display = 'none';
  // 按积分倒序排列
  users.sort((a, b) => b.score - a.score);
  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.qq}</td>
      <td class="font-bold text-cutePink">${user.score}</td>
      <td>${user.lastSign || '从未签到'}</td>
      <td>
        <button class="viewRecord bg-cuteLightPink text-cutePink py-1 px-3 rounded-xl text-sm" data-qq="${user.qq}" data-name="${user.qq}">
          查看记录
        </button>
      </td>
    `;
    userList.appendChild(tr);
  });
  // 绑定查看记录事件
  document.querySelectorAll('.viewRecord').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const qq = e.target.dataset.qq;
      const users = await readGithubFile('users.json');
      const user = users.find(item => item.qq === qq);
      if (user) {
        showRecordModal(qq, user.signRecords);
      }
    });
  });
}

// 显示签到记录弹窗
function showRecordModal(qq, records) {
  recordTitle.innerText = `QQ${qq}的签到记录（共${records.length}次）`;
  recordList.innerHTML = '';
  if (records.length === 0) {
    recordList.innerHTML = '<p class="text-center text-gray-500">暂无签到记录</p>';
  } else {
    // 按时间倒序
    records.sort((a, b) => new Date(b.time) - new Date(a.time));
    records.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'p-3 border border-cuteLightPink rounded-xl bg-cuteBg';
      div.innerHTML = `
        <div class="flex justify-between items-center">
          <span class="font-bold">第${index+1}次签到</span>
          <span class="text-cutePink font-bold">+${item.score}积分</span>
        </div>
        <span class="text-gray-500 text-sm">${item.time}</span>
      `;
      recordList.appendChild(div);
    });
  }
  // 显示弹窗
  recordModal.style.display = 'flex';
  // 关闭弹窗
  closeRecordModal.onclick = () => {
    recordModal.style.display = 'none';
  };
  // 点击遮罩关闭
  recordModal.onclick = (e) => {
    if (e.target === recordModal) recordModal.style.display = 'none';
  };
}

// 查看指定用户记录
checkRecordBtn.addEventListener('click', async () => {
  const qq = singleQq.value.trim();
  if (!checkQQ(qq)) {
    showModal('<i class="fas fa-exclamation-circle"></i>', '请输入正确的QQ号！', 'error');
    return;
  }
  const users = await readGithubFile('users.json');
  const user = users.find(item => item.qq === qq);
  if (!user) {
    showModal('<i class="fas fa-user"></i>', '该用户不存在！', 'error');
    return;
  }
  showRecordModal(qq, user.signRecords);
});
