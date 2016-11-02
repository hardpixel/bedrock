!(($) ->

  class OffCanvasMenu

    constructor: (element, options) ->
      this.$element  = element
      this.options   = $.extend({}, OffCanvasMenu.defaults, this.$element.data(), options)
      this.offcanvas = new Foundation.OffCanvas(this.$element, this.options)

      this._init()
      this._events()

      Foundation.registerPlugin(this, 'OffCanvasMenu')

    _init: ->
      id              = this.$element.attr('id')
      this.$exiter    = $('[data-toggle=' + id + '], [data-open="' + id + '"], [data-close="' + id + '"]')
      this.$wrapper   = $('.off-canvas-wrapper')
      this.$collapsed = this.$element.hasClass('is-collapsed')

      this._state(this)
      this._menus(this)

    _events: ->
      this.$exiter.on('click.zf.offcanvas', this.toggle.bind(this))

    _state: (self) ->
      if self.collapse()
        self.$wrapper.addClass('off-canvas-reveal-' + self.position())

      $(window).on 'resize', (event) ->
        if self.collapse() then self.resume() else self.pause()

    _menus: (self) ->
      self.$element.find('[data-accordion-menu]').each (index, el) ->
        accordion = $(el).foundation('destroy')
        dropdown  = $(el).clone()
        parents   = dropdown.children('li').filter (index, el) ->
          return !$(el).children('ul').length

        parents.each (index, el) ->
          menu = $('<ul class="vertical menu"><li></li></ul>')
          link = $(el).children('a:first').clone()

          link.find('i').remove()
          menu.find('li').append(link)
          $(el).append(menu)

        dropdown.insertAfter(accordion)

        new Foundation.AccordionMenu(accordion)
        new Foundation.DropdownMenu(dropdown)

    toggle: (event, trigger) ->
      if this.$collapsed
        this.close(event, trigger)
      else
        this.open(event, trigger)

    open: (event, trigger) ->
      if this.collapse()
        this.$element.addClass('is-collapsed')
        this.$wrapper.addClass('off-canvas-collapse-' + this.position())
        this.$element.trigger('opened.zf.offcanvas')

        this.$collapsed = true

    close: (event, trigger) ->
      if this.collapse()
        this.$element.removeClass('is-collapsed')
        this.$wrapper.removeClass('off-canvas-collapse-' + this.position())
        this.$element.trigger('closed.zf.offcanvas')

        this.$collapsed = false

    pause: ->
      this.$wrapper.removeClass('off-canvas-reveal-' + this.position())
      this.$element.removeClass('is-collapsed')
      this.$wrapper.removeClass('off-canvas-collapse-' + this.position())

    resume: ->
      this.$wrapper.addClass('off-canvas-reveal-' + this.position())

      if this.$collapsed
        this.$element.addClass('is-collapsed')
        this.$wrapper.addClass('off-canvas-collapse-' + this.position())

    collapse: ->
      medium = this.$element.hasClass('reveal-for-large') && Foundation.MediaQuery.atLeast('large')
      large  = this.$element.hasClass('reveal-for-medium') && Foundation.MediaQuery.atLeast('medium')

      if medium or large
        return true

    position: ->
      if this.$element.hasClass('position-left')
        return 'left'

      if this.$element.hasClass('position-right')
        return 'right'

    destroy: ->
      Foundation.unregisterPlugin(this)

  OffCanvasMenu.defaults = {}

  Foundation.plugin(OffCanvasMenu, 'OffCanvasMenu')

)(jQuery)
