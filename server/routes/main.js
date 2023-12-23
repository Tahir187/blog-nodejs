const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Get / Home
router.get("", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb",
    };

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments();

    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

//  GET /  POST: id

router.get("/post/:id", async (req, res) => {
  try {

    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, ExpressJs & MongoDb",
    };

    res.render("post", { locals, data });
  } catch (error) {
    console.log(error);
  }
}); 


// POST/ POST searchTerm

router.post('/search', async(req,res) =>{
  
  try {

    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, ExpressJs & MongoDb",
    } 

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")

    const data = await Post.find({
      $or:[
        {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
        {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
      ]
    });
    res.render("search", {
      data,
      locals
    });
  } catch (error) {
    console.log(error)
  }
})



router.get("/about", (req, res) => {
  res.render("about");
});

// function insertPostData() {
//   Post.insertMany([
//     {
//       title: "Building a Blog",
//       body: "This is the body text",
//     },
//     {
//       title: "build real-time, event-driven application in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to built real-time, event-driven application in Node.js.",
//     },
//     {
//       title: "Dicover how to use Express.js",
//       body: "Dicover how to use Express.js a popular Node.js web framework, to build web appliation.",
//     },
//     {
//       title: "Nodejs Blog",
//       description: "Simple Blog created with NodeJs, ExpressJs & MongoDb",
//     },
//   ]);
// }
// insertPostData();

module.exports = router;
