const puppeteer = require('puppeteer-core');
const path = require("path");
const fse = require("fs-extra");
const axios = require('axios');

// const URL = 'https://mp.weixin.qq.com/mp/homepage?__biz=MzA5NzQxOTM2Mw==&hid=5&sn=b5883fd15321dc38d1a82a07467c9b49';
// const URL = 'https://mp.weixin.qq.com/mp/homepage?__biz=MzA5NzQxOTM2Mw==&hid=2&sn=b1e5acf456ef87420745b1e332df4e5d';

const NODE_ARGS = process.argv.splice(2)[0];

if(!NODE_ARGS){
    console.log('Error: url参数缺失');
    process.exit(1)
}

const URL = NODE_ARGS;

const INCLUDE_URL = 'homepage'

let list = null;

const scrollWindow =  async page => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

const requestfinishedWatcher = page => {
    return new Promise(async(resolve, reject) => {
        try {
            //监听事件
            page.on("requestfinished", async request => {
                if (request.url().includes(INCLUDE_URL)) {
                    const res = await request.response();
                    const data_json =  await res.json();
                    list = list.concat(data_json.appmsg_list)
                    if(data_json.has_more === 0){
                        fse.writeFileSync('./list.txt',JSON.stringify(list))
                        resolve()
                    }else{
                        await scrollWindow(page);
                    }
                }
            })
            await scrollWindow(page);

        } catch (err) {
            reject(err)
        }
    })
}

const weixin = async browser => {
    const page = await browser.newPage();
    await page.goto(URL);
    const executionContext = await page.mainFrame().executionContext();
    const result = await executionContext.evaluate(() => window.data);
    list = result.appmsg_list;

    if(list.length < 6){
        fse.writeFileSync('./list.txt',JSON.stringify(list))
    }else{
        await requestfinishedWatcher(page);
    }
    
}


puppeteer.launch({
    executablePath: `C:\\Program Files (x86)/Google/Chrome/Application/chrome.exe`,
    headless: true,
}).then(async browser => {
    await weixin(browser)
    browser.close();

    console.log('Success:执行成功，请查看list.txt');
    process.exit(0)
});
