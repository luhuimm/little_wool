/*
赚点是点

一天1-2毛  自动到账支付宝余额

https://json.dd-gz.com/ 域名的任意链接  抓链接末尾token和userid 的值

用#分开两个值

用 @  分割多账户

例如
https://json.dd-gz.com/zhuandianshidian/public/api.php/user/userinfo?  

假如末尾是 token=123&userid=456

青龙变量
export zdcookie= '123#456@第二个123#第二个456'

v2p 圈×变量  zdcookie
*/
const jsname = '赚点是点'
const $ = Env(jsname)
let ck = ($.isNode() ? process.env.zdcookie : $.getdata('zdcookie')) || '';
let ckArr = []
let envSplitor = ['@']
!(async () => {

    if (typeof $request !== "undefined") {
    }
    else {
        if (!(await checkEnv())) return;
        let i = 0
        for (let account of ckArr) {
            i += 1
            console.log(`\n=============账号${i}=============\n`)
            let accounts = account.split('#')
            let altoken = accounts[0]
            let alid = accounts[1]
            await userinfo(altoken,alid)
        }
    }

})()
    .catch((e) => console.log(e))
    .finally(() => $.done())

async function checkEnv() {
    if (ck) {
        for (let dt of ck.split('@')) {
            if (dt) ckArr.push(dt)
        }
    } else {
        console.log('未找到账号数据')
        if (ckArr.length < 1) return;
    }
    console.log(`共找到${ckArr.length}个账号`)

    return true;
}
async function userinfo(altoken,alid) {
    try {
        let url = `https://json.dd-gz.com/zhuandianshidian/public/api.php/user/userinfo?token=${altoken}&userid=${alid}`
        let body = ``
        let urlObject = populateUrlObject(url, body)
        await httpRequest('get', urlObject)
        let result = httpResult;
        if (result.state == 1) {
            this.cash = result.data.money_zc
            console.log(jsname + ` 当前金币 ：${this.cash} `)
            await timeMoney(altoken,alid)
        }
        if (this.cash >= 1000) {
            console.log(jsname + ` 开始提现 ：${this.cash * 0.0001} 元`)
            await addMoney(altoken,alid)
        }
    } catch (e) {
        console.log(e)
    } finally {
        return new Promise((resolve) => { resolve(1) });
    }
}
async function addMoney(altoken,alid) {
    try {
        let url = `https://json.dd-gz.com/zhuandianshidian/public/api.php/user/addMoney?price=${this.cash}&token=${altoken}&userid=${alid}`
        let body = ``
        let urlObject = populateUrlObject(url, body)
        await httpRequest('get', urlObject)
        let result = httpResult;
        if (result.state == 1) {
            console.log(`兑换金币成功`)
        } 
    } catch (e) {
        console.log(e)
    } finally {
        return new Promise((resolve) => { resolve(1) });
    }
}

async function timeMoney(altoken,alid) {
    try {
        let url = `https://json.dd-gz.com/zhuandianshidian/public/api.php/integral/timeMoney?token=${altoken}&userid=${alid}`
        let body = ``
        let urlObject = populateUrlObject(url, body)
        await httpRequest('get', urlObject)
        let result = httpResult;
        if (result.state == 1) {
            console.log(jsname + ` 开始领取金币 ：${result.data.priceMsg}`)
        } else if(result.state == 0) {
            var num1 = result.msg.replace(/[^\d]/g,'');
            console.log(jsname + ` 开始领取金币 ：还需要等待${num1}秒`)
        }
    } catch (e) {
        console.log(e)
    } finally {
        return new Promise((resolve) => { resolve(1) });
    }
}

/////////////////////////////////
function populateUrlObject(url, body = '') {
    let host = url.replace('//', '/').split('/')[1]
    let urlObject = {
        url: url,
        headers: {
            'Referer': "https://2021002117637233.hybrid.alipay-eco.com/2021002117637233/0.2.2206021449.52/index.html#pages/userduihuan/tixian/tixian?__appxPageId=6",
            'Host': host,
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Tinyapp-Intercept': 'tiny',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/18H17 Ariver/1.1.0 AliApp(AP/10.2.56.6000) Nebula WK RVKType(0) AlipayDefined(nt:4G,ws:414|832|2.0) AlipayClient/10.2.56.6000 Language/zh-Hans Region/CN NebulaX/1.0.0'
        },
        timeout: 5000,
    }
    if (body) {
        urlObject.body = body
    }
    return urlObject;
}

async function httpRequest(method, url) {
    httpResult = null, httpReq = null, httpResp = null;
    return new Promise((resolve) => {
        $.send(method, url, async (err, req, resp) => {
            try {
                httpReq = req;
                httpResp = resp;
                if (err) {
                    console.log(`${method}请求失败`);
                    console.log(err)
                    //console.log(req)
                    //console.log(resp)
                } else {
                    if (resp.body) {
                        if (typeof resp.body == "object") {
                            httpResult = resp.body;
                        } else {
                            try {
                                httpResult = JSON.parse(resp.body);
                            } catch (e) {
                                httpResult = resp.body;
                            }
                        }
                    }
                }
            } catch (e) {
                //console.log(e);
            } finally {
                resolve();
            }
        });
    });
}


function safeGet(data) {
    try {
        if (typeof JSON.parse(data) == "object") {
            return true;
        } else {
            console.log(data)
        }
    } catch (e) {
        console.log(e);
        console.log(`服务器访问数据为空，请检查自身设备网络情况`);
        return false;
    }
}

//定义一个加法函数
function add() {
    var args = arguments,//获取所有的参数
        lens = args.length,//获取参数的长度
        d = 0,//定义小数位的初始长度，默认为整数，即小数位为0
        sum = 0//定义sum来接收所有数据的和
    //循环所有的参数
    for (var key in args) {//遍历所有的参数
        //把数字转为字符串
        var str = "" + args[key];
        if (str.indexOf(".") != -1) {//判断数字是否为小数
            //获取小数位的长度
            var temp = str.split(".")[1].length;
            //比较此数的小数位与原小数位的长度，取小数位较长的存储到d中
            d = d < temp ? temp : d;
        }
    }
    //计算需要乘的数值
    var m = Math.pow(10, d);
    //遍历所有参数并相加
    for (var key in args) {
        sum += args[key] * m;
    }
    //返回结果
    return sum / m;

}
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}

function Env(name, env) {
    "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
    return new class {
        constructor(name, env) {
            this.name = name
            this.notifyStr = ''
            this.startTime = (new Date).getTime()
            Object.assign(this, env)
            console.log(`${this.name} 开始运行：\n`)
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports
        }
        isQuanX() {
            return "undefined" != typeof $task
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }
        isLoon() {
            return "undefined" != typeof $loon
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t),
                    r = s ? this.getval(s) : "";
                if (r)
                    try {
                        const t = JSON.parse(r);
                        e = t ? this.lodash_get(t, i, "") : e
                    } catch (t) {
                        e = ""
                    }
            }
            return e
        }
        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e),
                    o = this.getval(i),
                    h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t),
                        s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t),
                        s = this.setval(JSON.stringify(o), i)
                }
            }
            else
                s = this.setval(t, e);
            return s
        }
        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
        }
        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }
        send(m, t, e = (() => { })) {
            if (m != 'get' && m != 'post' && m != 'put' && m != 'delete') {
                console.log(`无效的http方法：${m}`);
                return;
            }
            if (m == 'get' && t.headers) {
                delete t.headers["Content-Type"];
                delete t.headers["Content-Length"];
            } else if (t.body && t.headers) {
                if (!t.headers["Content-Type"]) t.headers["Content-Type"] = "application/x-www-form-urlencoded";
            }
            if (this.isSurge() || this.isLoon()) {
                if (this.isSurge() && this.isNeedRewrite) {
                    t.headers = t.headers || {};
                    Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 });
                }
                let conf = {
                    method: m,
                    url: t.url,
                    headers: t.headers,
                    timeout: t.timeout,
                    data: t.body
                };
                if (m == 'get') delete conf.data
                $axios(conf).then(t => {
                    const {
                        status: i,
                        request: q,
                        headers: r,
                        data: o
                    } = t;
                    e(null, q, {
                        statusCode: i,
                        headers: r,
                        body: o
                    });
                }).catch(err => console.log(err))
            } else if (this.isQuanX()) {
                t.method = m.toUpperCase(), this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                    hints: !1
                })),
                    $task.fetch(t).then(t => {
                        const {
                            statusCode: i,
                            request: q,
                            headers: r,
                            body: o
                        } = t;
                        e(null, q, {
                            statusCode: i,
                            headers: r,
                            body: o
                        })
                    }, t => e(t))
            } else if (this.isNode()) {
                this.got = this.got ? this.got : require("got");
                const {
                    url: s,
                    ...i
                } = t;
                this.instance = this.got.extend({
                    followRedirect: false
                });
                this.instance[m](s, i).then(t => {
                    const {
                        statusCode: i,
                        request: q,
                        headers: r,
                        body: o
                    } = t;
                    e(null, q, {
                        statusCode: i,
                        headers: r,
                        body: o
                    })
                }, t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body)
                })
            }
        }
        time(t) {
            let e = {
                "M+": (new Date).getMonth() + 1,
                "d+": (new Date).getDate(),
                "h+": (new Date).getHours(),
                "m+": (new Date).getMinutes(),
                "s+": (new Date).getSeconds(),
                "q+": Math.floor(((new Date).getMonth() + 3) / 3),
                S: (new Date).getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let s in e)
                new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
            return t
        }
        async showmsg() {
            if (!this.notifyStr) return;
            let notifyBody = this.name + " 运行通知\n\n" + this.notifyStr
            if ($.isNode()) {
                var notify = require('./sendNotify');
                console.log('\n============== 推送 ==============')
                await notify.sendNotify(this.name, notifyBody);
            } else {
                this.msg(notifyBody);
            }
        }
        logAndNotify(str) {
            console.log(str)
            this.notifyStr += str
            this.notifyStr += '\n'
        }
        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t)
                    return t;
                if ("string" == typeof t)
                    return this.isLoon() ? t : this.isQuanX() ? {
                        "open-url": t
                    }
                        : this.isSurge() ? {
                            url: t
                        }
                            : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return {
                            openUrl: e,
                            mediaUrl: s
                        }
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return {
                            "open-url": e,
                            "media-url": s
                        }
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {
                            url: e
                        }
                    }
                }
            };
            this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
            let h = ["", "============== 系统通知 =============="];
            h.push(e),
                s && h.push(s),
                i && h.push(i),
                console.log(h.join("\n"))
        }
        getMin(a, b) {
            return ((a < b) ? a : b)
        }
        getMax(a, b) {
            return ((a < b) ? b : a)
        }
        padStr(num, length, padding = '0') {
            let numStr = String(num)
            let numPad = (length > numStr.length) ? (length - numStr.length) : 0
            let retStr = ''
            for (let i = 0; i < numPad; i++) {
                retStr += padding
            }
            retStr += numStr
            return retStr;
        }
        json2str(obj, c, encodeUrl = false) {
            let ret = []
            for (let keys of Object.keys(obj).sort()) {
                let v = obj[keys]
                if (v && encodeUrl) v = encodeURIComponent(v)
                ret.push(keys + '=' + v)
            }
            return ret.join(c);
        }
        str2json(str, decodeUrl = false) {
            let ret = {}
            for (let item of str.split('&')) {
                if (!item) continue;
                let idx = item.indexOf('=')
                if (idx == -1) continue;
                let k = item.substr(0, idx)
                let v = item.substr(idx + 1)
                if (decodeUrl) v = decodeURIComponent(v)
                ret[k] = v
            }
            return ret;
        }
        randomString(len, charset = 'abcdef0123456789') {
            let str = '';
            for (let i = 0; i < len; i++) {
                str += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            return str;
        }
        randomList(a) {
            let idx = Math.floor(Math.random() * a.length)
            return a[idx]
        }
        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }
        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            console.log(`\n${this.name} 运行结束，共运行了 ${s} 秒！`)
            if (this.isSurge() || this.isQuanX() || this.isLoon()) $done(t)
        }
    }(name, env)
}