$(document).ready(function() {
  $('.bookmarks').on('click', '.destroy', function(event) {
    var id = $(this).data('id'),
      bookmark = $(this).closest('li');
    event.preventDefault();
    $.ajax({ url: '/bookmarks/' + id, type: 'delete' })
      .done(function() { bookmark.remove(); })
      .fail(function(jqxhr, status, error) { $.error(error); });
  });
});
