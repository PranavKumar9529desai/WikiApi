
//installing all the Dependencies
const express = require('express');
const app = express();
const ejs= require('ejs');
const  bodyparser = require ('body-parser');
const mongoose = require('mongoose');
const { title } = require('process');
const { error } = require('console');
const { findSourceMap } = require('module');
const { copyFileSync } = require('fs');
app.set('view engine' , "ejs");
app.use(express.static("public"));
const env = require ('dotenv').config ()
app.use(bodyparser.urlencoded({extended:true}));

// connecting MongoDb

mongoose.connect('mongodb://127.0.0.1:27017/WikiAPI_3_O?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.100');

/*------------------------------------------------MongoDB------------------------------------------------------------*/
//creating schema for Wikiapi

const WikiSchema = mongoose.Schema({"Title" : {type : String , immutable: false} ,"Content" : String , });

const Article = mongoose.model("Article" , WikiSchema);

// creating a new Article model 

const article = new Article({Title : "hello " , Content : "hello World"});
// article.save();


/*-----------------------------------------------articles route -------------------------------------------------*/
// chaining the article route
app.route("/articles")

// handling the get request
.get(async function(req,res){         
    const  allArticles = await Article.find({});
    try{
        res.json(allArticles);

    }catch (err){
        console.log(err);
    };

})

// handling the post request 
.post(function(req,res){
    const title = req.body.ArticleTitle;
    const content = req.body.ArticleContent;
    // console.log(title);
    // console.log(content);
// creating New Model from Posted data 
 const NewArticle = new Article({Title : title , Content : content});
 NewArticle.save()
.then(function(result){
    console.log(NewArticle);
    console.log("Article sucessfully saved");
    res.send("Sucessfully added the Articles");
})
//handling the error
.catch(function(err){
    console.log(err)
})
})

//delete request
.delete(function(req,res){
    Article.deleteMany()
    .then(function(result){
        console.log("All artilces deleted sucessfully");
    })
    .catch(function(err){
        console.log(err);
    })
}) ;


 /*-------------------------------------Targetting specificArticle--------------------------------------------- */

 app.route("/articles/:articleTitle")
.get(async function(req,res){
    
   const foundarticle = await Article.findOne({Title: req.params.articleTitle}) 
   if(!foundarticle){
    res.send("Article not found");
   }
   else {
    res.send(foundarticle);
   }
})

.put(async function(req,res){
    console.log(req.params.articleTitle);
    const updatedArticle = await Article.findOneAndUpdate({Title:req.params.articleTitle},{$set : {Content: req.body.content , Title: req.body.ToBeUpdated}},{new: true});
    if (updatedArticle){
      console.log("artilce sucessfully updated ");
      res.send(updatedArticle);

    }
    else {
        res.send("artilce not updated , as article with mentioned name is not updated ");
    }
    console.log(updatedArticle);
})

.patch(async function (req,res){
    const patchedArticle = await Article.findOneAndReplace({Title:req.params.articleTitle} , {Title: req.body.tobepatched , Content : req.body.content},{new: true});
    if(patchedArticle){
    console.log(patchedArticle);
    res.send(patchedArticle);
}
else {
    res.send("article not updated because specific articles is not found");
}
})

.delete(async function(req,res){
    const artilceToBeDeleted = await Article.findOneAndDelete({Title : req.params.articleTitle}).
    then(function(result){
        console.log("deleted theh article");
        res.send("Article sucessfully deleted ");
    })
})



// PORT
app.listen(3000,function(req,res){
    console.log("Running on PORT 3000");
    
    
});


