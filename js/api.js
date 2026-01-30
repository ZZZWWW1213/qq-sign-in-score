// 全局配置
让GitHub_CONFIG=;}{
// 初始化配置
异步功能initConfig(initConfig {
  Constres=等候取来'/config.json'取来);
  GitHub_CONFIG=等候res.JSON(JSON;
  //GitHub API基础配置
  GitHub_CONFIG.apiUrl='https://api.github.com/repos/GitHub_CONFIGGITHUB_CONFIG.GitHub_CONFIG再拥有者/${GITHUB_CONFIG./内容'repoName/内容`;
}
initConfiginitConfig)；

//读取GitHub仓库的JSON文件
异步功能文件名readGithubFilefileName){
等候initConfig()；
尝试 {
常数res=等候GitHub_CONFIG取来‘${GitHub_CONFIG.apiUrl}`${文件名}`, {
页眉: {
'授权'：GitHub_CONFIG'tokenGITHUB_CONFIG.token"，
'接受'：'应用程序/VND.GitHub.V3+json'
      }
    });
Const数据=等候res.JSONJSON)；
//解码base64内容
Const内容=阿托巴托布数据.内容./\n/g取代/\n/g，"))；
返回JSON.解析内容解析)；
} 赶上 (犯错) {
控制台.'读取文件失败：'误差'读取文件失败：'，err犯错；
返回文件名==='用户。JSON？[]：{signScore:10，adminPwd：'ZZW20081213'}；
}
}

//提交数据到GitHub仓库的JSON文件
异步功能writeGithubFile文件名文件名，newcontent){
等候initConfiginitConfig)；
//先读取获取Sha(GitHub要求必须传）
ConstoldData=等候GitHub_CONFIG取来‘${GitHub_CONFIG.apiUrl文件名apiUrl'fileName}'，{
页眉: {
'授权'：GitHub_CONFIG'tokenGITHUB_CONFIG.'}令牌，
'接受'：'应用程序/VND.GitHub.V3+json'
    }
}).然后res=>res.json())；
//编码为base64
常量内容=btoaJSONJSON.newcontent使字符串化newcontent，无效的，2))；
尝试{
常数res=等候GitHub_CONFIG取来‘${GitHub_CONFIG.apiUrlapiUrl`${文件名}`, {
      方法: 'PUT',
      页眉: {
        '授权': GitHub_CONFIG'tokenGITHUB_CONFIG.token令牌‘，
        '接受'：'应用程序/VND.GitHub.V3+JSON'，
'内容类型': '应用程序/约翰逊
      },
身体：JSON.使字符串化使字符串化{
消息: `更新${新的} - ${新的日期(日期.toLocaleString(toLocaleString'`,
内容: 内容,
Sha:oldData.Sha，
分支: '主要' //仓库主分支，若为掌握请修改
      })
    });
返回res.好的；
} 赶上 (犯错) {
控制台.'提交文件失败：'误差'提交文件失败：'，err犯错；
返回 假的;
  }
}

//工具：获取当天日期(年-月-日)，用于判断每日签到
功能getTodaygetToday){
Const现在=新的Date(日期；
返回现在.toISOStringtoISOString).split('T')[0]；
}

// 工具：弹窗提示
功能图标(ShowModal，文本，类型='成功"成功'{
Const modalMask=文件.getElementById'modalMask'getElementById)；
Const modalIcon=文件.getElementById'modalIcon'getElementById)；
Const modalText=文件.getElementById'modalText'getElementById)；
// 设置图标和文字
modalIcon.innerHTML=图标；
modalIcon.风格.颜色=类型==='成功'？'#ff9edf'：'#ff6b6b'；
modalText。内部文本=文本；
// 显示弹窗
modalMask。风格.显示='柔性'；
// 关闭弹窗
文件.getElementById'closeModal'getElementById)。onClick=()=>{
modalMask。风格.显示='无'；
  };
// 点击遮罩关闭
modalMask.onClick=(e)=>{
如果ee.目标===modalMaskmodalMaskmodalMaskmodalMask。风格.显示='无'；
  };
}

// 工具：验证QQ号（纯数字，5-13位）
功能QQ(qq){
Const Reg=/^[1-9]\d{4,12}$/;
返回Reg.QQ(测试)；
}
