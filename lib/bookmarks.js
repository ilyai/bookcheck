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
        var title, $;
        if (err) return callback(err, null);
        if (resp.headers['content-type'] === 'text/html') {
          $ = cheerio.load(body);
          title = $('title').text().trim();
        }
        if (!title) title = url;
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
