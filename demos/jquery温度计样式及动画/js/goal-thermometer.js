var goalAmount = 2000;
var animationTime = 3000;
var numberPrefix = "$";
var numberSuffix = "";
var tickMarkSegementCount = 4;
var widthOfNumbers = 50;
var glassTopImg = "images/glassTop.png";
var glassBodyImg = "images/glassBody.png";
var redVerticalImg = "images/redVertical.png";
var tooltipFGImg = "images/tickShine.png";
var glassBottomImg = "images/glassBottom.png";
var tootipPointImg = "images/tooltipPoint.png";
var tooltipMiddleImg = "images/tooltipMiddle.png";
var tooltipButtImg = "images/tooltipButt.png";
var glassTopImg2x = "images/glassTop2x.png";
var glassBodyImg2x = "images/glassBody2x.png";
var redVerticalImg2x = "images/redVertical2x.png";
var tooltipFGImg2x = "images/tickShine2x.png";
var glassBottomImg2x = "images/glassBottom2x.png";
var tootipPointImg2x = "images/tooltipPoint2x.png";
var tooltipMiddleImg2x = "images/tooltipMiddle2x.png";
var tooltipButtImg2x = "images/tooltipButt2x.png";
var arrayOfImages;
var imgsLoaded = 0;
var tickHeight = 40;
var mercuryHeightEmpty = 0;
var numberStartY = 6;
var thermTopHeight = 13;
var thermBottomHeight = 51;
var tooltipOffset = 15;
var heightOfBody;
var mercuryId;
var tooltipId;
var resolution2x = false;
$(document).ready(function () {
    determineImageSet()
});

function determineImageSet() {
    resolution2x = window.devicePixelRatio == 2;
    if (resolution2x) {
        glassTopImg = glassTopImg2x;
        glassBodyImg = glassBodyImg2x;
        redVerticalImg = redVerticalImg2x;
        glassBottomImg = glassBottomImg2x;
        tootipPointImg = tootipPointImg2x;
        tooltipButtImg = tooltipButtImg2x
    }
    createGraphics()
}

function createGraphics() {
    $("#goal-thermometer").html("<div id='therm-numbers'></div><div id='therm-graphics'><img id='therm-top' src='" + glassTopImg + "'></img><img id='therm-body-bg' src='" + glassBodyImg + "' ></img><img id='therm-body-mercury' src='" + redVerticalImg + "'></img><div id='therm-body-fore'></div><img id='therm-bottom' src='" + glassBottomImg + "'></img><div id='therm-tooltip'><img class='tip-left' src='" + tootipPointImg + "'></img><div class='tip-middle'><p>$0</p></div><img class='tip-right' src='" + tooltipButtImg + "'></img></div></div>");
    $("<img/>").attr("src", tooltipFGImg).load(function () {
        $(this).remove();
        $("#therm-body-fore").css("background-image", "url('" + tooltipFGImg + "')");
        checkIfAllImagesLoaded()
    });
    $("<img/>").attr("src", tooltipMiddleImg).load(function () {
        $(this).remove();
        $("#therm-tooltip .tip-middle").css("background-image", "url('" + tooltipMiddleImg + "')");
        checkIfAllImagesLoaded()
    });
    heightOfBody = tickMarkSegementCount * tickHeight;
    $("#therm-graphics").css("left", widthOfNumbers);
    $("#therm-body-bg").css("height", heightOfBody);
    $("#goal-thermometer").css("height", heightOfBody + thermTopHeight + thermBottomHeight);
    $("#therm-body-fore").css("height", heightOfBody);
    $("#therm-bottom").css("top", heightOfBody + thermTopHeight);
    mercuryId = $("#therm-body-mercury");
    mercuryId.css("top", heightOfBody + thermTopHeight);
    tooltipId = $("#therm-tooltip");
    tooltipId.css("top", heightOfBody + thermTopHeight - tooltipOffset);
    var e = $("#therm-numbers");
    var b = goalAmount / tickMarkSegementCount;
    var a = commaSeparateNumber(b);
    for (var d = 0; d < tickMarkSegementCount; d++) {
        var g = tickHeight * d + numberStartY;
        var f = $("<style>.pos" + d + " { top: " + g + "px; width:" + widthOfNumbers + "px }</style>");
        $("html > head").append(f);
        var c = commaSeparateNumber(goalAmount - b * d);
        $(e).append("<div class='therm-number pos" + d + "'>" + c + "</div>")
    }
    arrayOfImages = new Array("#therm-top", "#therm-body-bg", "#therm-body-mercury", "#therm-bottom", ".tip-left", ".tip-right");
    preload(arrayOfImages)
}

function preload(a) {
    for (i = 0; i < a.length; i++) {
        $(a[i]).load(function () {
            checkIfAllImagesLoaded()
        })
    }
}

function checkIfAllImagesLoaded() {
    imgsLoaded++;
    if (imgsLoaded == arrayOfImages.length + 2) {
        $("#goal-thermometer").fadeTo(1000, 1, function () {
            animateThermometer()
        })
    }
}

function animateThermometer() {
    var c = currentAmount / goalAmount;
    var a = Math.round(heightOfBody * c);
    var b = heightOfBody + thermTopHeight - a;
    mercuryId.animate({
        height: a + 1,
        top: b
    }, animationTime);
    tooltipId.animate({
        top: b - tooltipOffset
    }, {
        duration: animationTime
    });
    var d = $("#therm-tooltip .tip-middle p");
    $({
        tipAmount: 0
    }).animate({
        tipAmount: currentAmount
    }, {
        duration: animationTime,
        step: function () {
            d.html(commaSeparateNumber(this.tipAmount))
        }
    })
}

function commaSeparateNumber(a) {
    a = Math.round(a);
    while (/(\d+)(\d{3})/.test(a.toString())) {
        a = a.toString().replace(/(\d+)(\d{3})/, "$1,$2")
    }
    return numberPrefix + a + numberSuffix
};