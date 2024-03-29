(function ($, window, document, undefined) {
    "use strict";
    var _globalWalkthrough = {},
    _elements = [],
    _activeWalkthrough,
    _activeId,
    _hasDefault = true,
    _counter = 0,
    _isCookieLoad,
    _firstTimeLoad = true,
    _onLoad = true,
    _index = 0,
    _isWalkthroughActive = false,
    $jpwOverlay = $('<div id="jpwOverlay"></div>'),
    $jpWalkthrough = $('<div id="jpWalkthrough"></div>'),
    $jpwTooltip = $('<div id="jpwTooltip"></div>');
    var methods = {
        isActive: function () {
            return !!_isWalkthroughActive
        },
        index: function (value) {
            if (typeof value !== "undefined") {
                _index = value
            }
            return _index
        },
        init: function (options) {
            options = $.extend(true, {},
            $.fn.pagewalkthrough.defaults, options);
            var that = this;
            if (!options.name) {
                throw new Error("Must provide a unique name for a tour")
            }
            this.first().data("jpw", options);
            options._element = this;
            return this.each(function (i) {
                options = options || {};
                options.elementID = options.name;
                _globalWalkthrough[options.name] = options;
                _elements.push(options.name);
                if (options.onLoad) {
                    _counter++
                }
                if (_counter === 1 && _onLoad) {
                    _activeId = options.name;
                    _activeWalkthrough = _globalWalkthrough[_activeId];
                    _onLoad = false
                }
                if (i + 1 === that.length && _counter === 0) {
                    _activeId = options.name;
                    _activeWalkthrough = _globalWalkthrough[_elements[0]];
                    _hasDefault = false
                }
            })
        },
        renderOverlay: function () {
            if (_counter > 1) {
                debug("Warning: Only 1st walkthrough will be shown onLoad as default")
            }
            _isCookieLoad = getCookie("_walkthrough-" + _activeId);
            if (typeof _isCookieLoad === "undefined") {
                _isWalkthroughActive = true;
                if (!onEnter()) return;
                showStep();
                showButton("jpwClose", "body");
                setTimeout(function () {
                    if (isFirstStep() && _firstTimeLoad) {
                        if (!onAfterShow()) return
                    }
                },
                100)
            } else {
                onCookieLoad(_globalWalkthrough)
            }
        },
        restart: function (e) {
            if (isFirstStep()) return;
            _index = 0;
            if (!onRestart(e)) return;
            if (!onEnter(e)) return;
            showStep()
        },
        close: function () {
            var options = _activeWalkthrough;
            onLeave();
            if (typeof options.onClose === "function") {
                options.onClose.call(this)
            }
            _index = 0;
            _firstTimeLoad = true;
            _isWalkthroughActive = false;
            setCookie("_walkthrough-" + _activeId, 0, 365);
            _isCookieLoad = getCookie("_walkthrough-" + _activeId);
            $jpwOverlay.fadeOut("slow",
            function () {
                $(this).remove()
            });
            $jpWalkthrough.fadeOut("slow",
            function () {
                $(this).html("").remove()
            });
            $("#jpwClose").fadeOut("slow",
            function () {
                $(this).remove()
            })
        },
        show: function (name, e) {
            e = name == null ? name : e;
            name = name || this.first().data("jpw").name;
            _activeWalkthrough = _globalWalkthrough[this.first().data("jpw").name];
            if (name === _activeId && _isWalkthroughActive || !onEnter(e)) return;
            _isWalkthroughActive = true;
            _firstTimeLoad = true;
            if (!onBeforeShow()) return;
            showStep();
            showButton("jpwClose", "body");
            if (isFirstStep() && _firstTimeLoad) {
                if (!onAfterShow()) return
            }
        },
        next: function (e) {
            _firstTimeLoad = false;
            if (isLastStep()) return;
            if (!onLeave(e)) return;
            _index = parseInt(_index, 10) + 1;
            if (!onEnter(e)) {
                methods.next()
            }
            showStep("next")
        },
        prev: function (e) {
            if (isFirstStep()) return;
            if (!onLeave(e)) return;
            _index = parseInt(_index, 10) - 1;
            if (!onEnter(e)) {
                methods.prev()
            }
            showStep("prev")
        },
        getOptions: function (activeWalkthrough) {
            var _wtObj;
            if (activeWalkthrough) {
                _wtObj = {};
                _wtObj = _activeWalkthrough
            } else {
                _wtObj = [];
                for (var wt in _globalWalkthrough) {
                    _wtObj.push(_globalWalkthrough[wt])
                }
            }
            return _wtObj
        },
        refresh: function () {
            showStep("next")
        }
    };
    function showStep(skipDirection) {
        var options = _activeWalkthrough,
        step = options.steps[_index],
        targetElement = options._element.find(step.wrapper),
        scrollTarget = getScrollParent(targetElement),
        maxScroll,
        scrollTo;
        if (step.popup.type !== "modal" && !targetElement.length) {
            if (step.popup.fallback === "skip" || typeof step.popup.fallback === "undefined") {
                methods[skipDirection]();
                return
            }
            step.popup.type = step.popup.fallback
        }
        maxScroll = scrollTarget[0].scrollHeight - scrollTarget.outerHeight();
        scrollTo = step.popup.type === "modal" ? 0 : Math.floor(targetElement.offset().top - $(window).height() / 2 + scrollTarget.scrollTop());
        if (scrollTarget.scrollTop() !== scrollTo && (scrollTarget.scrollTop() === maxScroll && scrollTo < maxScroll || scrollTo <= 0 && scrollTarget.scrollTop() > 0 || scrollTo > 0)) {
            $jpWalkthrough.addClass("jpw-scrolling");
            $jpwTooltip.fadeOut("fast");
            scrollTarget.animate({
                scrollTop: scrollTo
            },
            options.steps[_index].scrollSpeed, buildWalkthrough)
        } else {
            buildWalkthrough()
        }
    }
    function buildWalkthrough() {
        $jpWalkthrough.removeClass("jpw-scrolling");
        var options = _activeWalkthrough,
        step = options.steps[_index],
        targetElement,
        scrollParent,
        maxHeight;
        options.steps[_index] = $.extend(true, {},
        $.fn.pagewalkthrough.defaults.steps[0], step);
        targetElement = options._element.find(step.wrapper);
        scrollParent = getScrollParent(targetElement);
        $jpwOverlay.show();
        if (step.popup.type !== "modal" && step.popup.type !== "nohighlight") {
            $jpWalkthrough.html("");
            if (step.wrapper === "" || typeof step.wrapper === "undefined") {
                debug('Your walkthrough position is: "' + step.popup.type + '" but wrapper is empty or undefined. Please check your "' + _activeId + '" wrapper parameter.');
                return
            }
            maxHeight = scrollParent.outerHeight() - targetElement.offset().top + scrollParent.offset().top + scrollParent.scrollTop();
            maxHeight = maxHeight <= 0 ? targetElement.outerHeight() : maxHeight;
            $jpwOverlay.appendTo($jpWalkthrough);
            $("<div>").addClass("overlay-hole").height(Math.min(maxHeight, targetElement.outerHeight())).width(targetElement.outerWidth()).css({
                padding: "20px",
                position: "absolute",
                top: targetElement.offset().top - 20,
                left: targetElement.offset().left - 20,
                "z-index": 999998,
                "box-shadow": "0 0 1px 10000px rgba(0, 0, 0, 0.6)"
            }).append($("<div>").css({
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            })).appendTo($jpWalkthrough);
            if ($("#jpWalkthrough").length) {
                $("#jpWalkthrough").remove()
            }
            $jpWalkthrough.appendTo("body").show();
            $jpwTooltip.show();
            showTooltip()
        } else if (step.popup.type === "modal") {
            if ($("#jpWalkthrough").length) {
                $("#jpWalkthrough").remove()
            }
            showModal()
        } else {
            if ($("#jpWalkthrough").length) {
                $("#jpWalkthrough").remove()
            }
        }
        showButton("jpwPrevious");
        showButton("jpwNext");
        showButton("jpwFinish")
    }
    function showModal() {
        var options = _activeWalkthrough,
        step = options.steps[_index];
        $jpwOverlay.appendTo("body").show().removeClass("transparent");
        var textRotation = setRotation(parseInt(step.popup.contentRotation, 10));
        $jpwTooltip.css({
            position: "absolute",
            left: "50%",
            top: "25%",
            "margin-left": -(parseInt(step.popup.width, 10) + 60) / 2 + "px",
            "z-index": "999999"
        });
        var tooltipSlide = $('<div id="tooltipTop">' + '<div id="topLeft"></div>' + '<div id="topRight"></div>' + "</div>" + '<div id="tooltipInner">' + "</div>" + '<div id="tooltipBottom">' + '<div id="bottomLeft"></div>' + '<div id="bottomRight"></div>' + "</div>");
        $jpWalkthrough.html("");
        $jpwTooltip.html("").append(tooltipSlide).wrapInner($("<div />", {
            id: "tooltipWrapper",
            style: "width:" + cleanValue(parseInt(step.popup.width, 10) + 30)
        })).append('<div id="bottom-scratch"></div>').appendTo($jpWalkthrough);
        $jpWalkthrough.appendTo("body");
        $jpwTooltip.show();
        $("#tooltipWrapper").css(textRotation);
        $("#tooltipInner").append(getContent(step)).show();
        $jpWalkthrough.show()
    }
    function showTooltip() {
        var opt = _activeWalkthrough,
        step = opt.steps[_index];
        var top, left, arrowTop, arrowLeft, overlayHoleWidth = $("#jpWalkthrough .overlay-hole").outerWidth(),
        overlayHoleHeight = $("#jpWalkthrough .overlay-hole").outerHeight(),
        overlayHoleTop = $("#jpWalkthrough .overlay-hole").offset().top,
        overlayHoleLeft = $("#jpWalkthrough .overlay-hole").offset().left,
        arrow = 30;
        var textRotation = typeof step.popup.contentRotation === "undefined" || parseInt(step.popup.contentRotation, 10) === 0 ? clearRotation() : setRotation(parseInt(step.popup.contentRotation, 10));
        if ($("#jpwOverlay").length) {
            $("#jpwOverlay").addClass("transparent")
        }
        var tooltipSlide = $('<div id="tooltipTop">' + '<div id="topLeft"></div>' + '<div id="topRight"></div>' + "</div>" + '<div id="tooltipInner">' + "</div>" + '<div id="tooltipBottom">' + '<div id="bottomLeft"></div>' + '<div id="bottomRight"></div>' + "</div>");
        $jpwTooltip.html("").css({
            "margin-left": "0",
            "margin-top": "0",
            position: "absolute",
            "z-index": "999999"
        }).append(tooltipSlide).wrapInner($("<div />", {
            id: "tooltipWrapper",
            style: "width:" + cleanValue(parseInt(step.popup.width, 10) + 30)
        })).appendTo($jpWalkthrough);
        $jpWalkthrough.appendTo("body").show();
        $("#tooltipWrapper").css(textRotation);
        $("#tooltipInner").append(getContent(step)).show();
        $jpwTooltip.append('<span class="' + step.popup.position + '">&nbsp;</span>');
        switch (step.popup.position) {
            case "top":
                top = overlayHoleTop - ($jpwTooltip.height() + arrow / 2) + parseInt(step.popup.offsetVertical, 10) - 86;
                left = overlayHoleLeft + overlayHoleWidth / 2 - $jpwTooltip.width() / 2 - 5 + parseInt(step.popup.offsetHorizontal, 10);
                arrowLeft = $jpwTooltip.width() / 2 - arrow + parseInt(step.popup.offsetArrowHorizontal, 10);
                arrowTop = step.popup.offsetArrowVertical ? parseInt(step.popup.offsetArrowVertical, 10) : "";
                break;
            case "right":
                top = overlayHoleTop - arrow / 2 + parseInt(step.popup.offsetVertical, 10)+25;
                left = overlayHoleLeft + overlayHoleWidth + arrow / 2 + parseInt(step.popup.offsetHorizontal, 10) + 105;
                arrowTop = arrow + parseInt(step.popup.offsetArrowVertical, 10);
                arrowLeft = step.popup.offsetArrowHorizontal ? parseInt(step.popup.offsetArrowHorizontal, 10) : "";
                break;
            case "bottom":
                top = overlayHoleTop + overlayHoleHeight + parseInt(step.popup.offsetVertical, 10) + 86;
                left = overlayHoleLeft + overlayHoleWidth / 2 - $jpwTooltip.width() / 2 - 5 + parseInt(step.popup.offsetHorizontal, 10);
                arrowLeft = $jpwTooltip.width() / 2 - arrow + parseInt(step.popup.offsetArrowHorizontal, 10);
                arrowTop = step.popup.offsetArrowVertical ? parseInt(step.popup.offsetArrowVertical, 10) : "";
                break;
            case "left":
                top = overlayHoleTop - arrow / 2 + parseInt(step.popup.offsetVertical, 10);
                left = overlayHoleLeft - $jpwTooltip.width() - arrow + parseInt(step.popup.offsetHorizontal, 10) - 105;
                arrowTop = arrow + parseInt(step.popup.offsetArrowVertical, 10);
                arrowLeft = step.popup.offsetArrowVertical ? parseInt(step.popup.offsetArrowHorizontal, 10) : "";
                break
        }
        $("#jpwTooltip span." + step.popup.position).css({
            top: cleanValue(arrowTop),
            left: cleanValue(arrowLeft)
        });
        $jpwTooltip.css({
            top: cleanValue(top),
            left: cleanValue(left)
        });
        $jpWalkthrough.show()
    }
    function getContent(step) {
        var option = step.popup.content,
        content;
        try {
            content = $("body").find(option).html()
        } catch (e) { }
        return content || option
    }
    function showButton(id, appendTo) {
        if ($("#" + id).length) return;
        var btn = _activeWalkthrough.buttons[id];
        appendTo = appendTo || "#tooltipWrapper";
        if (!btn) return;
        if (typeof btn.show === "function" && !btn.show() || !btn.show) {
            return
        }
        $(appendTo).append($("<a />", {
            id: id,
            html: btn.i18n
        }))
        //$("#jpwClose").addClass("rightClose");
        //$("#jpwClose").clone(true).appendTo("#jpwTooltip");
        //$("#jpwTooltip #jpwClose").attr({ id: "jpwCloseNew" });
        //$("#jpwClose").attr({ id: "jpwCloseTmp" });
        //$("#jpwTooltip #jpwCloseNew").attr({ id: "jpwClose" });
        //$("#jpwCloseTmp").css("display", "none");
        addClose();
    }
    function addClose() {
        $("#jpwTooltip #jpwClose").remove();
        $("#jpwClose").attr({ id: "jpwCloseTmp" });
        $("#jpwCloseTmp").clone(true).appendTo("#jpwTooltip");
        $("#jpwTooltip #jpwCloseTmp").attr({ id: "jpwClose" });
        $("#jpwCloseTmp").css("display", "none");
        $("#jpwTooltip #jpwClose").css("display", "block");
    }
    function onCookieLoad(options) {
        for (var i = 0; i < _elements.length; i++) {
            if (typeof options[_elements[i]].onCookieLoad === "function") {
                options[_elements[i]].onCookieLoad.call(this)
            }
        }
        return false
    }
    function onLeave(e) {
        var options = _activeWalkthrough;
        if (typeof options.steps[_index].onLeave === "function") {
            if (!options.steps[_index].onLeave.call(this, e, _index)) {
                return false
            }
        }
        return true
    }
    function onEnter(e) {
        var options = _activeWalkthrough;
        if (typeof options.steps[_index].onEnter === "function") {
            return options.steps[_index].onEnter.call(this, e, _index)
        }
        return true
    }
    function onRestart(e) {
        var options = _activeWalkthrough;
        _isWalkthroughActive = true;
        methods.restart(e);
        if (typeof options.onRestart === "function") {
            if (!options.onRestart.call(this)) {
                return false
            }
        }
        return true
    }
    function onBeforeShow() {
        var options = _activeWalkthrough || {};
        _index = 0;
        if (typeof options.onBeforeShow === "function") {
            if (!options.onBeforeShow.call(this)) {
                return false
            }
        }
        return true
    }
    function onAfterShow() {
        var options = _activeWalkthrough;
        _index = 0;
        if (typeof options.onAfterShow === "function") {
            if (!options.onAfterShow.call(this)) {
                return false
            }
        }
        return true
    }
    function debug(message) {
        if (window.console && window.console.log) window.console.log(message)
    }
    function clearRotation() {
        var rotationStyle = {
            "-webkit-transform": "none",
            "-moz-transform": "none",
            "-o-transform": "none",
            filter: "none",
            "-ms-transform": "none"
        };
        return rotationStyle
    }
    function setRotation(angle) {
        var M11, M12, M21, M22, deg2rad, rad;
        deg2rad = Math.PI * 2 / 360;
        rad = angle * deg2rad;
        M11 = Math.cos(rad);
        M12 = Math.sin(rad);
        M21 = Math.sin(rad);
        M22 = Math.cos(rad);
        var rotationStyle = {
            "-webkit-transform": "rotate(" + parseInt(angle, 10) + "deg)",
            "-moz-transform": "rotate(" + parseInt(angle, 10) + "deg)",
            "-o-transform": "rotate(" + parseInt(angle, 10) + "deg)",
            "-ms-transform": "rotate(" + parseInt(angle, 10) + "deg)"
        };
        return rotationStyle
    }
    function cleanValue(value) {
        if (typeof value === "string") {
            if (value.toLowerCase().indexOf("px") === -1) {
                return value + "px"
            } else {
                return value
            }
        } else {
            return value + "px"
        }
    }
    function setCookie(cName, value, exdays) {
        var exdate = new Date;
        exdate.setDate(exdate.getDate() + exdays);
        var cValue = encodeURIComponent(value) + (exdays == null ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = [cName, "=", cValue].join("")
    }
    function getCookie(cName) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x === cName) {
                return decodeURIComponent(y)
            }
        }
    }
    function isLastStep() {
        return _index === _activeWalkthrough.steps.length - 1
    }
    function isFirstStep() {
        return _index === 0
    }
    function getScrollParent(element) {
        if (!(element instanceof $)) {
            element = $(element)
        }
        element = element.first();
        var position = element.css("position"),
        excludeStaticParent = position === "absolute",
        scrollParent = element.parents().filter(function () {
            var parent = $(this);
            if (excludeStaticParent && parent.css("position") === "static") {
                return false
            }
            return /(auto|scroll)/.test(parent.css("overflow") + parent.css("overflow-y") + parent.css("overflow-x"))
        }).eq(0);
        return position === "fixed" ? $() : !scrollParent.length ? $("body") : scrollParent
    }
    $(document).on("click", "#jpwClose, #jpwFinish", methods.close);
    $(document).on("click", "#jpwNext",
    function () {
        $.pagewalkthrough("next")
    });
    $(document).on("click", "#jpwPrevious",
    function () {
        $.pagewalkthrough("prev")
    });
    $(document).on("click", "#jpwOverlay, #jpwTooltip",
    function (ev) {
        ev.stopPropagation();
        ev.stopImmediatePropagation()
    });
    $.pagewalkthrough = $.fn.pagewalkthrough = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, [].slice.call(arguments, 1))
        } else if (typeof method === "object" || !method) {
            methods.init.apply(this, arguments);
            if (_hasDefault && _counter < 2) {
                setTimeout(function () {
                    methods.renderOverlay()
                },
                500)
            }
        } else {
            $.error("Method " + method + " does not exist on jQuery.pagewalkthrough")
        }
        
    };
    $.fn.pagewalkthrough.defaults = {
        steps: [{
            wrapper: "",
            popup: {
                content: "",
                type: "modal",
                position: "top",
                offsetHorizontal: 0,
                offsetVertical: 0,
                offsetArrowHorizontal: 0,
                offsetArrowVertical: 0,
                width: "320",
                contentRotation: 0
            },
            autoScroll: true,
            scrollSpeed: 1e3,
            lockScrolling: false,
            onEnter: null,
            onLeave: null
        }],
        name: null,
        onLoad: true,
        onBeforeShow: null,
        onAfterShow: null,
        onRestart: null,
        onClose: null,
        onCookieLoad: null,
        buttons: {
            jpwClose: {
                i18n: "",
                show: true
            },
            jpwNext: {
                i18n: "下一步 &rarr;",
                show: function () {
                    return !isLastStep()
                }
            },
            jpwPrevious: {
                i18n: "&larr; 上一步",
                show: function () {
                    return !isFirstStep()
                }
            },
            jpwFinish: {
                i18n: "完成 &#10004;",
                show: function () {
                    return isLastStep()
                }
            }
        }
    }
})(jQuery, window, document);