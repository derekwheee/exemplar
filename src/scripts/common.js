/* globals lousyLoad */
/* jshint unused: false */

var Common = function () {
    
        // Initialize image lazy loading
        window.ll = new lousyLoad(document.body, {
            selector: 'div.ll-image, img.ll-image',
            backgroundClass: '.ll-background',
            threshold: 500
        });
    
        if ($('.js-datepicker').length) {
            $('.js-datepicker').datepicker();
        }
    
        window.debounce = function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        };
    
    };
    
    Common.prototype.initPageEvents = function() {
    
    };
    
    // Shows an ajax spinner over the specified element
    // Ex: common.showAjaxLoader($("#myElement"));
    Common.prototype.showAjaxLoader = function($el) {
        var width = $el.width();
        var height = $el.height();
    
        var $html = $('<div class="ajaxContainer"><div class="ajaxLoader"></div></div>');
        $html.css({ "height": height, "width": width });
    
        // Element must be relative for the graphic to overlay properly
        // TODO: Check for position and maybe do a thing
        if ($el.css("position") === "static") {
            $el.css("position", "relative");
        }
    
        $el.append($html);
    };
    
    Common.prototype.convertFromUtc = function(time, timeZone){
        moment.tz(time, "UTC").clone().tz(timeZone);
    };
    
    Common.prototype.hideAjaxLoader = function($el) {
        $el.find(".ajaxContainer").remove();
    };
    
    Common.prototype.insertParam = function(url, key, value) {
        return url + (url.indexOf("?") < 0 ? "?" : "&") + key + "=" + value;
    };
    
    Common.prototype.executeFunctionByName = function(functionName, context /*, args */) {
        var args = Array.prototype.slice.call(arguments).splice(2);
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func].apply(this, args);
    };
    
    Common.prototype.isValidPassword = function (str) {
        /*
                (?=.*[A-Z].*[A-Z])        Ensure string has at least one uppercase letter.
                (?=.*[!@#$&*])            Ensure string has at least one special case letter.
                (?=.*[0-9])        Ensure string has at least one digit.
                (?=.*[a-z]) Ensure string has at least one lowercase letter.
                .{8,}                     Ensure string is at least of length 8.
            */
        return /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{12,}/.test(str);
    };
    
    /**
     * http://stackoverflow.com/a/10997390/11236
     */
    Common.prototype.updateURLParameter = function(url, param, paramVal) {
        var newAdditionalURL = "";
        var tempArray = url.split("?");
        var baseURL = tempArray[0];
        var additionalURL = tempArray[1];
        var temp = "";
        if (additionalURL) {
            tempArray = additionalURL.split("&");
            for (var i = 0; i < tempArray.length; i++) {
                if (tempArray[i].split('=')[0] !== param) {
                    newAdditionalURL += temp + tempArray[i];
                    temp = "&";
                }
            }
        }
    
        var rows_txt = temp + "" + param + "=" + paramVal;
        return baseURL + "?" + newAdditionalURL + rows_txt;
    };
    
    // Keep at the bottom
    $(function () {
        window.common = new Common();
        window.common.initPageEvents();
    
        window.EDGE = new EDGE();
    });