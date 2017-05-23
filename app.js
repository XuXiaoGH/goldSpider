var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var ejs = require('ejs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




var request = require('request');
var cheerio = require('cheerio')

cheerio.prototype.removeTagText = function () {
  var html = this.html()
  return html.replace(/<([\w\d]+)\b[^<]+?<\/\1>/g, (m) => {
    return ''
  })
}

/*request('http://fund.eastmoney.com/data/fundranking.html', (err, req)=>{
  if(!err){
    let body = req.body;
    var $ = cheerio.load(body, {
      decodeEntities: false
    });


  }
});*/
request('http://www.smzdm.com/youhui/', (err, req) => {
  if (!err) {
    var body = req.body
    var $ = cheerio.load(body, {
      decodeEntities: false
    })
    $('.list.list_preferential').each((i, item) => {
      var $title = $('.itemName a', item)
      var url = $title.attr('href')
      var title = $title.removeTagText().trim()

      var hl = $title.children().text().trim()
      var img = $('img', item).attr('src')
      var desc = $('.lrInfo', item).html().trim()
      desc = desc.replace(/<a\b.+?>阅读全文<\/a>/g, '')
      var mall = $('.botPart a.mall', item).text().trim()

      console.log({title, hl, url, img, desc, mall})
    })
  }
});


module.exports = app;
