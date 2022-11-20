const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema({
    title: { 
        type: String, 
        trim : true ,
        required: true 
    },
    body: { 
        type: String, 
        trim : true ,
        required: true 
    },
    authorId: { 
        type: objectId, 
        required: true ,
        ref : "Author"
    },
    tags: [ String ],
    category: { 
        type: String, 
        required: true 
    },
    deletedAt : {
        type : Date ,
        default : null

    } ,
    subcategory: [ String ],
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    publishedAt: {
        type : Date ,
        default : null
    },
    isPublished: { 
        type: Boolean, 
        default: false 
    }


}, { timestamps: true });




module.exports = mongoose.model("blog", blogSchema);