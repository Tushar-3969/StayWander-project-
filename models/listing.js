const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image: {
    type: String,
    default: "https://images.unsplash.com/photo-1748182575169-e1e8e3901ec3?q=80&w=870&auto=format&fit=crop",
    set: (v) =>
        v.trim() === ""
            ? "https://images.unsplash.com/photo-1748182575169-e1e8e3901ec3?q=80&w=870&auto=format&fit=crop"
            : v,
    },
    price:{
        type:Number,
        min:1
    },
    location:{
        type:String
    },
    country:{
        type:String
    }
});

const Listing = mongoose.model("Listing",Schema);

module.exports=Listing;