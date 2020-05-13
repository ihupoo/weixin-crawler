const puppeteer = require('puppeteer-core');


puppeteer.launch({
    executablePath: `./chrome-win/chrome.exe`,
    headless: false,
    devtools:true,
    ignoreDefaultArgs:[
        '--enable-automation'
    ]
}).then(async browser => {

    const page = await browser.newPage();
    
    // await page.evaluateOnNewDocument(() => {
    //     Object.defineProperty(navigator, 'webdriver', {
    //         get: () => undefined,
    //     });
    // })

    await page.goto('https://m.zhaopin.com');
    // browser.close();

    // process.exit(0)
});
