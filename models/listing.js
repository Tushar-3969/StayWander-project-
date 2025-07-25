const mongoose = require('mongoose');
const Review = require("./review.js");

const Schema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    image: {
        url:String,
        filename:String,
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review' 
        }
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    category:{
        type:String,
        enum:[ "trending","rooms","iconic-cities","mountains","castles","arctic-pools","campings","farms","arctic","beachfront","luxury"]
    }

});

//mongoose middleware
Schema.post('findOneAndDelete', async(listing)=> {
    if(listing.reviews.length){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
});

const Listing = mongoose.model("Listing",Schema);

module.exports=Listing;