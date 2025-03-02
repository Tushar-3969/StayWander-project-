const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema=new Schema({
       title: {
          type:String,
          required:true,
       },
       description:String,
       image:{
          type:String,
          default: "https://unsplash.com/photos/palm-trees-line-the-beach-as-the-sun-sets-Y06mQMNXnSo",
          set: (v)=> v ==="" ? " https://unsplash.com/photos/palm-trees-line-the-beach-as-the-sun-sets-Y06mQMNXnSo" 
          : v,
       },
       price: {
          type:Number,
          min:0,
       },
       location: String,
       country: String,
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports=Listing;