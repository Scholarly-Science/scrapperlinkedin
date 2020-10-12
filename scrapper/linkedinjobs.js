let puppeteer = require('puppeteer')
let cheerio = require('cheerio')

const EMAIL_SELECTOR = '#username';
const PASSWORD_SELECTOR = '#password';
const SUBMIT_SELECTOR = '#app__container > main > div > form > div.login__form_action_container > button';
const LINKEDIN_LOGIN_URL = 'https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin';

const fs = require('fs');
const writeStream = fs.createWriteStream('location2.csv');

writeStream.write(`Title,  Location, Link \n`)



module.exports = {
    jobs : () => {
        
            (() => {
                puppeteer.launch({ headless: false })
                    .then(async (browser) => {
                        let page = await browser.newPage()
                        page.setViewport({ width: 1366,height: 1000 });
                        await page.goto(LINKEDIN_LOGIN_URL, { waitUntil: 'domcontentloaded' })
                        await page.click(EMAIL_SELECTOR)
                        await page.keyboard.type('');
                        await page.click(PASSWORD_SELECTOR);
                        await page.keyboard.type('');
                        await page.click(SUBMIT_SELECTOR),
                        await page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                        page.setViewport({ width: 1366,height: 100000 });
                        let i=1;

                        do{
                            page.goto(`https://www.linkedin.com/search/results/companies/?page=${i}`, { waitUntil: 'domcontentloaded' })
                            .then(async () => {
                            
                                
                                page.content()
                                .then((success) => {
                                    const $ = cheerio.load(success)
                                    $('.reusable-search__result-container').each((i,el)=> {
                                       
                                        const title = $(el).find('.entity-result__title-text').text().trim();
                                        const location = $(el).find('.entity-result__primary-subtitle').text().trim();
                                       // const location = $(el).find('.job-card-container__metadata-item').text().trim().split(',').join(' ');
                                        const link = $(el).find('.app-aware-link').attr('href');

                                        let datas;
                                        if(link != undefined){
                                            datas = {i,title,location,link};
                                        }
                                        
                                      
                                        writeStream.write(`${title}, ${location}, ${link} \n`);
                                        console.log(datas)
                                        
                                    });
                                    
                                })
                              

                                
                                
                            });

                            i++;
                        }while(i<=15)
                    })
                    .catch((err) => {
                        console.log(" CAUGHT WITH AN ERROR ", err);
                    })
            })()
        

    }
}