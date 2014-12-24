var request = require('request');
var cheerio = require('cheerio');
var encoding = require('encoding');
var helpers = require('./helpers');

module.exports = function(db) {
  return {
    get: function(callback) {
      db.select().from('bookmarks').orderBy('hit_count desc')
          .rows(function(err, result) {
        if (err) return callback(err);
        callback(null, result);
      });
    },
    add: function(url, callback) {
      request({
        url: url,
        encoding: null
      }, function(err, resp, buff) {
        if (err) return callback(err, null);

        var $, enc, body;
        var type = resp.headers['content-type'];

        function loadDom(type) {
          enc = helpers.charsetOf(type);
          body = encoding.convert(buff, 'utf-8', enc).toString();
          $ = cheerio.load(body);
        }

        if (~type.indexOf('text/html')) {
          loadDom(resp.headers['content-type']);
          $('head meta[http-equiv]').each(function() {
            var type = $(this).attr('content');
            if (type && /charset/i.test(type)) loadDom(type);
          });
          title = $('title').text().trim() || url;
        } else {
          title = url;
        }

        db.insert('bookmarks', {
          url: url,
          title: title
        }).run(callback);
      });
    },
    destroy: function(id, callback) {
      db.delete().from('bookmarks').where('id', id).run(function(err, result) {
        if (err) return callback(err);
        if (result.rowCount === 0) return callback(new Error("Record not found"));
        callback();
      });
    },
    hit: function(id, callback) {
      db.run(function(client, done) {
        client.query(
            'update bookmarks set hit_count = hit_count + 1 where id = $1',
            [id], done);
      }, callback);
    }
  };
};
