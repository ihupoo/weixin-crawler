const puppeteer = require('puppeteer-core');

(async () => {
  //创建一个浏览器实例
    const browser = await puppeteer.launch({ 
        executablePath: `C:\\Program Files (x86)/Google/Chrome/Application/chrome.exe`,
        headless: false,
        defaultViewport:{
            width:1920,
            height:768
        }
    });
    //创建一个新页面
    const page = await browser.newPage();
    //跳转到百度
    await page.goto('https://baidu.com');
    //截屏整个网页保存为 baidu.png 的图片
    await page.screenshot({path: 'baidu.png'});
    //关闭实例，不再使用
    await browser.close();
})();
