var request = require('request');
var cheerio = require('cheerio');

module.exports = function(db) {
  return {
    get: function(callback) {
      db.select().from('bookmarks').rows(function(err, result) {
        if (err) return callback(err);
        callback(null, result);
      });
    },
    add: function(url, callback) {
      request(url, function(err, resp, body) {
        if (err) return callback(err, null);
        var $ = cheerio.load(body);
        var title = $('title').text().trim() || url;
        db.insert('bookmarks', {
          url: url,
          title: title
        }).run(function() {
          callback();
        });
      });
    }
  };
};
