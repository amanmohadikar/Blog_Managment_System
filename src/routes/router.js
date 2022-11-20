const express = require('express');
const router = express.Router();

const blogController = require("../controller/blogController")

const authorController = require("../controller/authorController")

const { authorisation, authentication } = require('../middleware/middleware')




router.get("/testMe", function (req, res) { res.status(200).send("All Done") })


router.post("/authors", authorController.authors)


router.post("/blogs", authentication, blogController.blogs)


router.get("/blogs", authentication, blogController.allBlogs)


router.put("/blogs/:blogId",authentication, blogController.updateBlog);


router.delete("/blogs/:blogId", authentication, authorisation, blogController.deleteBlog)


router.delete("/blogs", authentication, blogController.deletBlogByQuery)


router.post("/login", authorController.loginAuthor)



module.exports = router