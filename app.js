const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const dbConnectionOptions = {
  useMongoClient: true,
  authSource: 'admin'
}

// Credit goes to the youtube comments in part 4 of the series for sharing a fix to deal with mongoose >= 4.11.0
mongoose.connect('mongodb://localhost/nodekb', {
  useMongoClient: true
});
//mongoose.connect('mongodb://user:password@localhost:27017/nodekb', dbConnectionOptions);

let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connecte to nodekb on MongoDB instance was successful');
});


// Check for DB errors
db.on('error', function(err){
    console.log(err);
});

// Init App
const app = express();

  // Bring in Models
  let Article = require('./models/article');


 // Load View Engine
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'pug');

 // Body parser middleware
 // parse application/x-www-form-urlencoded
 app.use(bodyParser.urlencoded({ extended: false }))

 // parse application/json
 app.use(bodyParser.json())

// Set Public folder
app.use(express.static(path.join(__dirname, 'public')));

// Home Route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {

      res.render('index', {
        title: 'Articles',
        articles: articles
      });
    }
  });
});


// Add Route
app.get('/articles/add', function(req, res){
  res.render('add_articles', {
    title: 'Add Articles'
  });
});

// Add Submit POST route
app.post('/articles/add', function(req, res){
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body =  req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    } else{
      res.redirect('/');
    }
  })
});


// Start Server
app.listen(3000, function(){
  console.log('server started on port 3000...');
});
