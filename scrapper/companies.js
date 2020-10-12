const puppeteer = require('puppeteer'); 
const cheerio = require('cheerio');
const Company = require('../model/companies');

const EMAIL_SELECTOR = '#username';
const PASSWORD_SELECTOR = '#password';
const SUBMIT_SELECTOR = '#app__container > main > div > form > div.login__form_action_container > button';
const LINKEDIN_LOGIN_URL = 'https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin';

module.exports = {
    companies : async () => {
        let linksToVisit = ['/company/apple'];
        const visitedLink =[];

        const browser = await puppeteer.launch({headless : false});

        const page = await browser.newPage();
        page.setViewport({ width: 1366,height: 1000 });
        await page.goto(LINKEDIN_LOGIN_URL, { waitUntil: 'domcontentloaded' })
        await page.click(EMAIL_SELECTOR)
        await page.keyboard.type('srijan.singh.45@gmail.com');
        await page.click(PASSWORD_SELECTOR);
        await page.keyboard.type('@Ameer1998');
        await page.click(SUBMIT_SELECTOR);
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

        while(linksToVisit.length > 0){
            const currentUrl = linksToVisit.pop();
            if(visitedLink.includes(currentUrl)) continue;
            await page.goto('https://www.linkedin.com' + currentUrl);
            const htmlContent = await page.content();

            const $ = cheerio.load(htmlContent);
            const title = $('h1.org-top-card-summary__title').text().trim();
            const service = $('div.org-top-card-summary-info-list__info-item').first().text().trim();
            const location = $('.inline-block div.org-top-card-summary-info-list__info-item').first().text().trim();
            const logo = $('.org-top-card-primary-content__logo-container img').attr('src');
            const link = "https://www.linkedin.com"+currentUrl;
            const newVisitedLink = $("span.org-right-rail-list__company-card--truncated > a").map((indx, element) => $(element).attr('href')).get();
            
            const list = new Company({
                title:title,
                service:service,
                location:location,
                logo:logo,
                link:link
            })

            list.save()
            .then(result => {
                console.log(result)
            })

            linksToVisit = [...linksToVisit, ...newVisitedLink]
            visitedLink.push(currentUrl)
            await sleep(4000);
        }
        
       async function sleep(mili){
           return new Promise((resolve) => setTimeout(resolve, mili))
       }
        

       




    }
} 


// $(".artdeco-list__item").each((i,el)=> {
            //     const title = $(el).find('.org-company-card-content__company-name').text().trim()
            //     const link = $(el).find('a').attr('href')
            //     const info = $(el).find('dd > span.t-normal').text().trim();
            //     const logo = $(el).find('img').attr('src');
            //     console.log({i, title,info, link, logo});


            //     linksToVisit = [...linksToVisit, ...link]
               
                
                
            // });