!(($) ->

  class Collapse

    constructor: (element, options) ->
      this.$element = element
      this.options = $.extend({}, Collapse.defaults, this.$element.data(), options)

      this._init()
      this._events()

      Foundation.registerPlugin(this, 'Collapse')

    _init: ->
      self            = this
      this.$target    = $('#' + this.$element.attr('data-collapse'))
      this.$exiter    = $('[data-collapse], .js-off-canvas-exit')
      this.$wrapper   = $('.off-canvas-wrapper')
      this.$collapsed = false

      this.menus()

      if this.collapse()
        self.$wrapper.addClass('off-canvas-reveal-' + this.position())

      $(window).on 'resize', (event) ->
        if self.collapse()
          self.resume()
        else
          self.pause()

      this.$target.on Foundation.transitionend(this.$target), ->
        self.$target.removeClass('is-collapsing')
        self.$wrapper.removeClass('off-canvas-collapsing')

      this.$exiter.on 'click', (event) ->
        self.$wrapper.removeClass('off-canvas-no-transitions')

    _events: ->
      this.$element.off('click.zf.trigger').on('click.zf.trigger', this.toggle.bind(this))

    toggle: (event, trigger) ->
      if this.$target.hasClass('is-collapsed')
        this.close(event, trigger)
      else
        this.open(event, trigger)

    open: (event, trigger) ->
      if this.collapse()
        this.$wrapper.addClass('off-canvas-collapsing')
        this.$target.addClass('is-collapsing').addClass('is-collapsed')
        this.$wrapper.addClass('off-canvas-collapse-' + this.position())

        this.$collapsed = true
      else
        this.$target.foundation('open', event, trigger)

    close: (event, trigger) ->
      if this.collapse()
        this.$wrapper.addClass('off-canvas-collapsing')
        this.$target.addClass('is-collapsing').removeClass('is-collapsed')
        this.$wrapper.removeClass('off-canvas-collapse-' + this.position())

        this.$collapsed = false
      else
        this.$target.foundation('close', event, trigger)

    pause: ->
      this.$wrapper.removeClass('off-canvas-reveal-' + this.position())
      this.$target.removeClass('is-collapsed')
      this.$wrapper.removeClass('off-canvas-collapse-' + this.position())

    resume: ->
      this.$wrapper.addClass('off-canvas-reveal-' + this.position())

      if this.$collapsed
        this.$target.addClass('is-collapsed')
        this.$wrapper.addClass('off-canvas-collapse-' + this.position())

    collapse: ->
      if this.medium() or this.large()
        return true

    medium: ->
      if this.$target.hasClass('reveal-for-large') && Foundation.MediaQuery.atLeast('large')
        return true

    large: ->
      if this.$target.hasClass('reveal-for-medium') && Foundation.MediaQuery.atLeast('medium')
        return true

    position: ->
      if (this.$target.hasClass('position-left'))
        return 'left'

      if (this.$target.hasClass('position-right'))
        return 'right'

    menus: ->
      this.$target.find('[data-accordion-menu]').each (index, el) ->
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

    destroy: ->
      Foundation.unregisterPlugin(this)

  Collapse.defaults = {}

  Foundation.plugin(Collapse, 'Collapse')

)(jQuery)
