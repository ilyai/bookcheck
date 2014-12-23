$(document).ready(function() {
  $('.bookmarks').on('click', '.destroy', function(event) {
    var id = $(this).data('id'),
      bookmark = $(this).closest('li');
    event.preventDefault();
    $.ajax({ url: '/bookmarks/' + id, type: 'delete' })
      .done(function() { bookmark.remove(); })
      .fail(function(jqxhr, status, error) { $.error(error); });
  }).on('click', '.link', function(event) {
    var id = $(this).data('id');
    if (/chrome/i.test(navigator.userAgent)) {
      var click = document.createEvent('MouseEvents');
      click.initMouseEvent("click", true, true, window,
        0, 0, 0, 0, 0, false, false, false, true, 0, null);
      this.dispatchEvent(click);
      event.preventDefault();
    }
    $.ajax({ url: '/bookmarks/' + id + '/hit', type: 'patch' })
      .fail(function(jqxhr, status, error) { $.error(error); });
  });
});
