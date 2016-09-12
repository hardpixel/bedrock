$(document).ready(function() {
  $(document).foundation();

  var wrapper = $('.off-canvas-wrapper');
  var inner = $('.off-canvas-wrapper-inner');

  wrapper.addClass('off-canvas-no-transitions');

  inner.on(Foundation.transitionend(inner), function() {
    wrapper.addClass('off-canvas-no-transitions');
  });
});
