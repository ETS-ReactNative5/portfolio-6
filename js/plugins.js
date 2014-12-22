// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/* Scrollwatch */
!function(a,b){"use strict";var c=["fixed","relative","absolute"],d="mousewheel resize",e=a(b),f=function(c,d){_.bindAll(this,"handleScroll","onScroll"),this.$el=a(c),this.el=this.$el[0],this.options=_.defaults(d||{},{watchOn:b}),this.$watchOn=a(this.options.watchOn),this._prepareContainer(),this.inViewport=!1,this.callbacks={scrollin:a.Callbacks(),scrollout:a.Callbacks(),scroll:a.Callbacks()},this.listen()};f.prototype={_prepareContainer:function(){if(this.$watchOn[0]!==b){var a=this.$watchOn.css("position"),d=_.contains(c,a);d||this.$watchOn.css("position","relative")}},listen:function(){this.$watchOn.on("scroll",this.onScroll),e.on(d,this.onScroll)},destroy:function(){this.$watchOn.off("scroll",this.onScroll),e.off(d,this.onScroll),this.$el.data("scrollWatch",null)},on:function(a,b,c,d){return _.isFunction(b)&&(d=c,c=b,b={}),b=_.extend({},this.options,b),c=_.bind(c,d||this.$el),b.delay&&(c=this._createDelayedCallback(a,c,b)),this.callbacks[a].add(c),this.$watchOn.scroll(),this},_createDelayedCallback:function(a,b,c){return function(){var a=arguments;_.delay(function(){b.apply(this,a)},c.delay)}},handleScroll:function(){var a=this.visibility,b=this.isInViewport(),c=this.$watchOn.scrollTop();return this.direction=this.lastOffset===!1?!1:c>this.lastOffset?"down":"up",this.lastOffset=c,this.visibility=b,this.inViewport||1!==b?this.inViewport&&0===b&&(this.inViewport=!1,this.dfd?this.dfd.done(_.bind(this.trigger,this,"scrollout")):this.trigger("scrollout")):(this.inViewport=!0,this.trigger("scrollin")),b!==a&&this.trigger("scroll"),this},onScroll:function(a){this.running||(this.running=!0,this.originalEvent=a,this.handleScroll(),this.running=!1)},trigger:function(a){return"scroll"!==a&&a===this.lastTriggered?!1:(this.lastTriggered=a,void this.callbacks[a].fire({direction:this.direction,visibility:this.visibility,originalEvent:this.originalEvent}))},_getOffsetTop:function(){if(this.$watchOn[0]===b)return this.$el.offset().top;var a=this.el,c=0;do c+=a.offsetTop,a=a.offsetParent;while(a&&a!==this.$watchOn[0]);return c},isInViewport:function(){var a=this.$watchOn.scrollTop(),b=this.$watchOn.height(),c=a+b,d=this._getOffsetTop(),e=this.$el.outerHeight(),f=d+e,g=e>=b;return g&&a>=d&&f>=c?1:!g&&d>=a&&c>=f?1:d>a&&c>d&&f>c?(c-d)/e:f>a&&c>f?(a-f)/e:0}},b.ScrollWatch=f,a.fn.scrollWatch=function(c){var d=a(this),e=d.data("scrollWatch");return e||d.data("scrollWatch",e=new b.ScrollWatch(this,c)),e}}(jQuery,window);
