const jwt = require("jsonwebtoken")
const blogModel = require("../model/blogModel")

const mongoose = require('mongoose');




const authentication = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) return res.status(404).send({ status: false, message: "Token is not present in header" })

        console.log("This is token : ", token)

        let decoded = jwt.verify(token, "our first project")

        req.tokenAuthorId = decoded._id

        console.log("This is author Id of token : ", req.tokenAuthorId)
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}




const authorisation = async function (req, res, next) {
    try {
        let tokenAuthorId = req.tokenAuthorId
        let blogId = req.params.blogId

        // console.log(tokenAuthorId)
        if (!mongoose.Types.ObjectId.isValid(blogId)) return res.status(400).send({ Status: false, msg: "Invalid Blog Id." })

        let blogData = await blogModel.findById(blogId)

        if (!blogData) return res.status(400).send({ status: false, msg: "BlogId is not exist in DB." })

        // console.log(blogData)

        let authorInBlog = blogData.authorId

        // console.log(authorInBlog, blogData.authorId)

        if (authorInBlog.toString() !== tokenAuthorId.toString()) return res.status(403).send({ status: false, msg: "Unauthorize person , forbidden" })

        next()
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports = { authentication, authorisation }