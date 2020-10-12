const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const express = require('express');
const app = express()
const {jobs} = require('./scrapper/linkedinjobs');
const {companies} = require('./scrapper/companies');
const {myjobs} = require('./scrapper/myjobs');
const companyRoute = require('./routes/routes');


app.use(express.json());
app.use('/api',companyRoute);

app.get('/', (req, res, next) => {res.send('Linkedin web scrapper.')});


main = () => {
   // 
   myjobs();
}




mongoose.connect(
    'mongourl'
).then(result => {
    app.listen(port, () => {
        console.log("Server running at http://localhost:"+port);
        main()
    })
})
.catch(err => console.log(err))