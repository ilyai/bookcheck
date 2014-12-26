$(document).ready(function() {
  var bookmarks = $('.bookmarks');
  var search = $('.search.control');

  // Delete a link
  bookmarks.on('click', '.destroy', function(event) {
    var id = $(this).data('id'),
      bookmark = $(this).closest('li');
    event.preventDefault();
    $.ajax({ url: '/bookmarks/' + id, type: 'delete' })
      .done(function() { bookmark.remove(); })
      .fail(function(jqxhr, status, error) { $.error(error); });
  });

  // Open a link
  bookmarks.on('click', '.link', function(event) {
    var id = $(this).data('id');
    if (/chrome/i.test(navigator.userAgent)) {
      var a = document.createElement('a');
      a.target = '_blank';
      a.href = $(this).attr('href');
      var click = document.createEvent('MouseEvents');
      // FIXME: Either one or another method works, depending
      // on the version of Chrome.
      // click.initMouseEvent("click", true, true, window,
        // 0, 0, 0, 0, 0, false, false, false, true, 0, null);
      click.initMouseEvent("click", true, true, window,
          0, 0, 0, 0, 0, true, false, false, false, 0, null);
      a.dispatchEvent(click);
      event.preventDefault();
    }
    $.ajax({ url: '/bookmarks/' + id + '/hit', type: 'patch' })
      .fail(function(jqxhr, status, error) { $.error(error); });
  });

  // Filter out by pattern as you type
  // ignoring case.
  search.on('change keyup', function(event) {
    var pattern = $(this).val().toLowerCase();
    bookmarks.children().each(function() {
      var link = $(this).find('.link');
      if (!pattern.trim() ||
          ~link.attr('href').toLowerCase().indexOf(pattern) ||
          ~link.text().toLowerCase().indexOf(pattern)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  // Open selected url by pressing enter
  search.on('keypress', function(event) {
    if (event.keyCode !== 13) return;
    var selected = $('li:visible .link');
    if (selected.length === 1) selected.click();
  });
});
