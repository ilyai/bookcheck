exports.truncate = function(text, max) {
  if (text.length <= max) {
    return text;
  } else {
    var idx = text.lastIndexOf(' ', max + 1);
    return text.substring(0, ~idx ? idx : max).trim() + '…';
  }
};
