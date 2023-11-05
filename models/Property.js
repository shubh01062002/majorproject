const mongoose =require("mongoose")

const PropertyScehema= mongoose.Schema({
    currentOwner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        min: 6,
    },
    type: {
        type: String,
        enum: ["Harshvardan nagar", "Vaishali nagar", "Nehru nagar"],
        required: true
    },
    desc: {
        type: String,
        // required: true,
        // min: 50,
    },
    img: {
        type: String,
        // required: true
    },
    price: {
        type: Number,
        required: true
    },
    beds: {
        type: Number,
        // required: true,
        // min: 1
    },
    featured: {
        type: Boolean,
        // default: false
    },
    ownerContact:{
        type: String,
        required: true,
        // min: 10,
        // max: 10
    },
    ownerName:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    preference:{
        type: String,
    },
    hostel:{
        type: String,
        // required: true,
    },
},{timestamps:true})

module.exports=mongoose.model("Property",PropertyScehema)