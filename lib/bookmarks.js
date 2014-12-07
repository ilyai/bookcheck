var request = require('request');
var cheerio = require('cheerio');

module.exports = function(db) {
  var bookmarks = {};
  bookmarks.add = function(url, cb) {
    request(url, function(err, resp, body) {
      if (err) return cb(err, null);
      var $ = cheerio.load(body);
      var title = $('title').text().trim() || url;
      db.insert('bookmarks', {
        url: url,
        title: title
      }).run(function() {
        cb();
      });
    });
  };

  return bookmarks;
};
