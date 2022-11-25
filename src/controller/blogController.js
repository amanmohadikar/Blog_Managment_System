const authorModel = require('../model/authorModel')
const blogModel = require('../model/blogModel')
const mongoose = require('mongoose');


// This is my first project

const blogs = async function (req, res) {
    try {
        let data = req.body

        let { title, body, authorId, category } = req.body

        if (!title || !body || !authorId || !category) return res.status(400).send({ status: false, msg: "Mandatory field is not given" })

        authorId = req.body.authorId

        if (!mongoose.Types.ObjectId.isValid(authorId)) return res.status(400).send({ status: false, msg: "Invalid Author Id" })


        let isAuthorPresent = await authorModel.findOne({ _id: authorId })

        if (!isAuthorPresent) return res.status(400).send({ status: false, message: "Invalid Author Id" })

        let isPublished = req.body.isPublished
        let isDeleted = req.body.isDeleted
        let date = Date.now()

        if (isPublished) {
            req.body.publishedAt = date
            isPublished = true
        }

        if (isDeleted) {
            req.body.deletedAt = date
            isDeleted = true
        }
     
        let newData = await blogModel.create(data)
        res.status(201).send({ status: true, data: newData })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}




const allBlogs = async function (req, res) {
    try {
        const { authorId, category, tags, subcategory } = req.query

        let findObj = {
            isDeleted: false,
            isPublished: true
        }

        if (authorId) {
            findObj["authorId"] = authorId
        }
        if (category) {
            findObj["category"] = category
        }
        if (tags) {
            findObj["tags"] = tags
        }
        if (subcategory) {
            findObj["subcategory"] = subcategory
        }

        let data = await blogModel.find(findObj)

        if (data.length <= 0) return res.status(404).send({ status: false, message: 'No Data Found' })

        res.status(200).send({ status: true, AllDataAre: data.length, data: data })

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}





const updateBlog = async function (req, res) {
    try {
        let updatedBody = req.body;
        let { title, body, category, isPublished, tags, subcategory } = updatedBody;

        if (Object.keys(updatedBody).length <= 0) return res.status(400).send({ status: false, message: "Data must be present" });

        let blogId = req.params.blogId;

        let blogPresent = await blogModel.findById(blogId);
        // if (!mongoose.Types.ObjectId.isValid(blogId)) return res.status(400).send({ Status: false, msg: "Invalid Blog Id" })

        if (!blogPresent) return res.status(400).send({ status: false, message: "Blog id is Incorrect" });

        if (blogPresent["isDeleted"] == true) { return res.status(404).send({ status: false, message: "Blog is already deleted" }) }

        let publishDateAndTime;
        req.body.isPublished ? publishDateAndTime = Date.now() : publishDateAndTime = null

        let updatedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            { $set: { body, title, isPublished, category, publishedAt: publishDateAndTime }, $push: { tags: tags, subcategory: subcategory } },
            { new: true }
        );

        res.status(200).send({ status: true, message: "Blog has been successfully updated", Data: updatedBlog });
    }
    catch (Error) {
        return res.status(500).send({ status: false, message: Error.message || "Some server error occured" });
    }
}





const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId

        // // Check object id is valid or not by mongoose predefind method.

        // if (!mongoose.Types.ObjectId.isValid(blogId)) return res.status(400).send({ Status: false, msg: "Invalid Blog Id" })

        let isBlogPresent = await blogModel.findOne({ _id: blogId })

        if (!isBlogPresent) return res.status(400).send({ status: false, message: "Invalid Blog Id or the blog is not exist" })


        if (isBlogPresent.isDeleted == true) return res.status(400).send({ status: false, msg: "Blog is already deleted." })


        let del = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: Date.now() } })

        res.status(200).send()
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}





const deletBlogByQuery = async function (req, res) {
    try {

        const query = req.query
        const { category, tags, subcategory } = query


        // // // Every time when user want to delete data by query then give author id for authorisation purpose and blog should be not deleted.
        let findObj = { isDeleted: false, isPublished: false }


        // // // In next line we are looking user is authentic user and he/she can delete blog in own blogs.
        let tokenAuthorId = req.tokenAuthorId
        // // Adding one attribute in findObj that is authorId by token data.
        findObj.authorId = tokenAuthorId



        if (category) {
            findObj["category"] = category
        }
        if (tags) {
            findObj["tags"] = tags
        }
        if (subcategory) {
            findObj["subcategory"] = subcategory
        }



        // // Any data coming on query or not ?
        if (Object.keys(findObj).length <= 3) return res.status(400).send({ status: false, message: "Please give some data that you want to delete that is not deleted" })

        let data = await blogModel.updateMany(
            findObj,
            { $set: { isDeleted: true, deletedAt: Date.now() } }
        )

        // How many data matched with condition -->
        if (data.matchedCount <= 0) return res.status(404).send({ status: false, message: "No Data Found" })

        res.status(200).send({ status: true, message: `${data.matchedCount} is deleted` })

    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }

}




module.exports = { blogs, allBlogs, updateBlog, deleteBlog, deletBlogByQuery }