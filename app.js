const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');



const dbConnectionOptions = {
  useMongoClient: true,
  authSource: 'admin'
}

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


// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));





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

// Get Single Article
app.get('/article/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      article: article
    });
  });
});

// Load Edit Form
app.get('/article/edit/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      title:'Edit Article',
      article: article
    });
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
      req.flash('success', 'Article Added'); // I see the problem. I put res.flash instead of req.flash
      res.redirect('/');
    }
  });
});

// Update Submit POST route
app.post('/articles/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body =  req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else{
      res.redirect('/');
    }
  })
});

app.delete('/article/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query,function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});


// Start Server
app.listen(3000, function(){
  console.log('server started on port 3000...');
});
