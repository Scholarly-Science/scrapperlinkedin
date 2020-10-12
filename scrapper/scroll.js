const fs = require('fs');
const puppeteer = require('puppeteer');

module.exports = {
    jobs : () => {
        function extractItems() {
            const extractedElements = document.querySelectorAll('.job-result-card');
            const items = [];
            for (let element of extractedElements) {
             const data = element.innerText
              items.push({data});
            }
            return items;
          }
          
          async function scrapeInfiniteScrollItems(
            page,
            extractItems,
            itemTargetCount,
            scrollDelay = 2000,
          ) {
            let items = [];
            try {
              let previousHeight;
              while (items.length < itemTargetCount) {
                items = await page.evaluate(extractItems);
                previousHeight = await page.evaluate('document.body.scrollHeight');
                await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
                await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
                await page.waitFor(scrollDelay);
              }
            } catch(e) { }
            return items;
          }
          
          (async () => {
            // Set up browser and page.
            const browser = await puppeteer.launch({
              headless: false,
              args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();
            page.setViewport({ width: 1360, height: 926 });
          
            // Navigate to the demo page.
            await page.goto('https://www.linkedin.com/jobs/search?location=australia');
          
            // Scroll and extract items from the page.
            const items = await scrapeInfiniteScrollItems(page, extractItems, 1000);
          
            // Save extracted items to a file.
            let datas = JSON.stringify(items);
            fs.writeFileSync('./item3.json', datas);
          
            // Close the browser.
            await browser.close();
          })();
    }
}