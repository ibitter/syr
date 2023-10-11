const axios = require("axios");
const token = process.env.NOTIFY;
const id = process.env.SYRID;
const password = process.env.SYRPWD;
let msg = '';//记录推送内容
let waitTime = 5000;//单位：ms
let index = 0;//记录账号顺序
const loginIn = async (id, password) => {
    return axios({
        method: 'post',
        url: 'https://www.suoyiren.cn/account/login',
        headers: {
            'Content-Type': 'application/json',
            'Host': 'www.suoyiren.cn',
            'Origin': 'https://www.suoyiren.cn/login',
            'Proxy-Connection': 'keep-alive',
            'Referer': 'https://www.suoyiren.cn/login',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/114.0.0.0'
        },
        data: {
            response_type: 'json',
            by_type: 'password',
            id: `${id}`,
            password: `${password}`
        }
    })
}


//睡眠函数
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const sign = async () =>{
    const response = await loginIn(id, password);
    if(response.data.status == "200"){
        const cookie = response.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
        await axios({
            method: 'get',
            url: 'https://www.suoyiren.cn/account/checkin/add',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Cookie': cookie,
                'Host': 'www.suoyiren.cn',
                'Origin': 'http://www.suoyiren.cn',
                'Proxy-Connection': 'keep-alive',
                'Referer': 'https://www.suoyiren.cn/account',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/114.0.0.0'
            }
        });
      await axios({
            method: 'get',
            url: 'https://www.suoyiren.cn/account/checkin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Cookie': cookie,
                'Host': 'www.suoyiren.cn',
                'Origin': 'http://www.suoyiren.cn',
                'Proxy-Connection': 'keep-alive',
                'Referer': 'https://www.suoyiren.cn/account',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/114.0.0.0'
            }
        });
        msg += `⏰锁艺人签到结果:签到成功！`;
    }else{
        msg += `⏰锁艺人签到结果:登录失败！`;
    }
    console.log(msg);
  if (token){
    await notify(msg);
  }
  
}
const notify = async (contents) => {
  await fetch(`https://www.pushplus.plus/send`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      token,
      title: '锁艺人签到通知',
      content: contents,
      template: 'markdown',
    }),
  })
}

const main = async () => {
  if(axios == ''){
        console.log("请安装依赖：axios");
        return;
    }
    console.log("开始运行签到任务");
    await sign();//签到
}

main()
