const express = require('express');
const path = require('path');

// Init App
const app = express();

 // Load View Engine
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'pug');

// Home Route
app.get('/', function(req, res){
  let articles = [
    {
      id: 1,
      title: 'Article One',
      author: 'John Doe',
      body: 'This is article one'
    },
    {
      id: 2,
      title: 'Article Two',
      author: 'Jane Doe',
      body: 'This is article two'
    },
    {
      id: 3,
      title: 'Article Three',
      author: 'Play Doh',
      body: 'This is article three'
    }
  ];
  res.render('index', {
    title: 'Articles',
    articles: articles
  });
});


// Add Route
app.get('/articles/add', function(req, res){
  res.render('add_articles', {
    title: 'Add Articles'
  });
});


// Start Server
app.listen(3000, function(){
  console.log('server started on port 3000...');
});
