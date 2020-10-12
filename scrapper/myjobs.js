const request = require('request-promise');
const cheerio = require('cheerio');
const Company = require('../model/companies');

var http = require('http');
var https = require('https');
http.globalAgent.maxSockets = 1;
https.globalAgent.maxSockets = 1;

module.exports = {
    myjobs : () => {
            header = async () =>{ 

                const linksToVisit = [];
                
                    for(index=0;index <=3; index++){
                        
                        const result = await request.get(`https://www.myjobs.com.mm/jobs?sort_by=featured&page=${index}`);
                        const $ = await cheerio.load(result);
                    
                        $('.align--start--under-lg.search-result__job-meta').each((i,el)=> {
                            
                            const link ="https://www.myjobs.com.mm"+ $(el).find('a').attr('href');
                            const datas = {i,link};
                            linksToVisit.push(datas);
                            console.log('Datas : ',datas)
                        });
                   }
                
                    
                return linksToVisit;
            }
            
            companyData = async (head) =>{
                return await Promise.all(
                    head.map(async company => {
                        const html = await request.get(company.link);
                        const $ = await cheerio.load(html);
            
                        company.title = $('.text-lg.font-500.mb-2').text().trim();
                        company.location = $(".mx-4 > div.my-3 > div").eq(7).text().trim();
                        company.service = $('.my-5>div.flex').last().text().split(':')[1].trim();
                        company.website = $(".my-3 a").first().text();
                        company.logo=$('.bg-white.border-4.border-white.shadow > img').attr('data-src')
                    
                        
                        const title = company.title;
                        const location = company.location;
                        const service = company.service;
                        const website = company.website;
                        const logo = company.logo;
                        const datas = {title, service, location, website, logo};


                        const list = new Company({
                            title:title,
                            service:service,
                            location:location,
                            logo:logo,
                            link:website
                        })
            
                        list.save()
                        .then(result => {
                            console.log(result)
                        })

                        return company;
                    })    
                )
            }
        
            
            const main = async () =>{
                const head = await header();
                const data = await companyData(head);
                console.log("Total scrapped : " + data.length);
                return data;
            }

            main();
        
    }
}