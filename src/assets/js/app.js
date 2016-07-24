$(document).foundation();

$(document).ready(function() {
  $('#sidebar .menu').each(function(index, el) {
    if ( $(this).parents('.top-bar').length ) {
      return;
    }

    var accordion = $(this);
    var dropdown  = $(this).clone();

    dropdown.insertAfter(accordion);

    dropdown.find('> li').filter(function(index) {
      return !$(this).children('ul').length;
    }).each(function(index, el) {
      var menu = $('<ul class="vertical menu"><li></li></ul>');
      var link = $(this).children('a:first').clone();

      link.find('i').remove();
      menu.find('li').append(link);
      $(this).append(menu);
    });

    var acc_menu  = new Foundation.AccordionMenu(accordion);
    var drop_menu = new Foundation.DropdownMenu(dropdown);

    accordion.find('.is-accordion-submenu-parent > a').filter(function(index) {
      return !$(this).children('.fa-angle-right').length;
    }).append('<i class="fa fa-angle-right"></i>');
  });

  if ( $('.reveal-for-large').length ) {
    $('.off-canvas-wrapper-inner, .off-canvas, .off-canvas-content').addClass('no-transitions-large');
  }

  $('#sidebar .menu').on('down.zf.accordionMenu', function(event) {
    $(this).find('li[aria-expanded="true"] > a .fa-angle-right').removeClass('fa-angle-right').addClass('fa-angle-down');
  });

  $('#sidebar .menu').on('up.zf.accordionMenu', function(event) {
    $(this).find('li[aria-expanded="false"] > a .fa-angle-down').removeClass('fa-angle-down').addClass('fa-angle-right');
  });

  $('#sidebar').on(Foundation.transitionend($('#sidebar')), function() {
    $('#sidebar').removeClass('is-collapsing');
  });

  $('[data-toggle="sidebar"]').on('click', function(event) {
    event.preventDefault();

    if ( $('#sidebar').hasClass('reveal-for-large') && Foundation.MediaQuery.atLeast('large') ) {
      $('#sidebar').addClass('is-collapsing').toggleClass('is-collapsed');
    }
  });
});
