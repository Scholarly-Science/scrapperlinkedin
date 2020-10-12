const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema(
    {
        title: {
            type:String,
        },
        service: {
            type: String, 
        },
        location: {
            type: String, 
        },
        logo:{
            type:String
        },
        link:{
            type:String
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('myjobs', customerSchema)