$(document).ready(function() {
    init();
    showClock();
    getSearchEngine();
    setDateTime();
    uploadImage();
    settingImage();
    $("body").keydown(function() {
        if (event.keyCode == "13"  || event.which == 13) {
            getSearchUrl();
        }
    });
});

function init() {
    chrome.storage.local.get('backgroud_image_url', function (result) {
        var channels = result.backgroud_image_url;
        if (channels) {
            $("body").css('background-image', 'url(' + channels + ')');
        } else {
            $("body").css('background-image', 'url(../images/default-bg.jpg)');
        }
    });

    chrome.storage.local.get('background_size', function (result) {
        var channels = result.background_size;
        if (channels) {
            $("body").css('background-size', ''+channels+'');
        }
    });

    chrome.storage.local.get('background_repeat', function (result) {
        var channels = result.background_repeat;
        if (channels) {
            $("body").css('background-repeat', 'repeat').css('background-size', 'auto');
        }
    });

    $('input[type=radio][name=search-engine]').change(function() {
        var searchEngine = $("input[name=search-engine]:checked").val();
        changeSearchEngine(searchEngine);
    });

    $("#search-input").focus(function () {
        $(this).css('background-color', '#fff').css('color', '#000');
    }).blur(function () {
        $(this).css('background-color', 'transparent').css('color', '#999');
    });

    $(".image-size-change img").click(function () {
        var attr = $(this).attr('title');
        var $body = $("body");
        switch (attr)
        {
            case 'contain':
                $body.css('background-size', 'contain');
                chrome.storage.local.set({'background_size': 'contain'});
                chrome.storage.local.remove('background_repeat');
                break;
            case 'cover':
                $body.css('background-size', 'cover');
                chrome.storage.local.set({'background_size': 'cover'});
                chrome.storage.local.remove('background_repeat');
                break;
            case 'repeat':
                $body.css('background-repeat', 'repeat');
                $body.css('background-size', 'auto');
                chrome.storage.local.set({'background_repeat': 'cover'});
                chrome.storage.local.remove('background_size');
                break;
        }
    });
}

function uploadImage() {
    $("#upload-image-btn").click(function (event) {
        $("#upload-image").click();
    });
    $("#upload-image").change(function (event) {
        var files = event.target.files;
        $.each(files, function (key, file) {
            var url = window.URL.createObjectURL(file);
            $("body").css('background-image', 'url(' + url + ')');
            toDataURL(url, function(dataUrl) {
                chrome.storage.local.set({'backgroud_image_url': dataUrl});
            })
        });
    });
}

function settingImage() {
    $("#image-position-center").click(function () {
        $("body").css('background-position', 'center');
    });
    var clicked = false;
    $("#image-position-repeat").click(function () {
        if (clicked) {
            clicked = false;
            $("body").css('background-repeat', 'no-repeat');
        } else {
            clicked = true;
            $("body").css('background-repeat', 'repeat');
        }
    });
}

function setDateTime() {
    var m = moment();
    var week = formatWeek(m.weekday());
    $(".date-time").html(m.get('month')+' / '+m.get('date')+ ' / ' + m.get('year')+ '    '+week);
}

function formatWeek(week) {
    var cn_week = '';
    switch (week)
    {
        case 1:
            cn_week = 'Monday';
            break;
        case 2:
            cn_week = 'Tuesday';
            break;
        case 3:
            cn_week = 'Wednesday';
            break;
        case 4:
            cn_week = 'Thursday';
            break;
        case 5:
            cn_week = 'Friday';
            break;
        case 6:
            cn_week = 'Saturday';
            break;
        case 0:
            cn_week = 'Sunday';
            break;
    }
    return cn_week;
}

function showClock() {
    var clock;
    clock = $('.clock').FlipClock({
        clockFace: 'TwentyFourHourClock'
    });
    return clock;
}

function getSearchUrl() {
    chrome.storage.sync.get("searchUrl", function (obj) {
        var searchUrl = '';
        if(obj){
            searchUrl = obj.searchUrl;
        }else{
            searchUrl ='http://www.google.com/search?q=';
        }
        var keyWords = $("#search-input").val();
        window.location=searchUrl + encodeURIComponent(keyWords);
    });
}

function getSearchEngine() {
   chrome.storage.sync.get("searchEngine", function (obj) {
        if(obj.searchEngine){
            changeSearchEngine(obj.searchEngine);
        }else{
            changeSearchEngine('google');
        }
    });
}

function changeSearchEngine(searchEngine) {
    var searchUrl = '';
    var searchInputImage = $("#search-input-image");
    switch (searchEngine)
    {
        case 'google':
            $("#search-input").attr('placeholder','Press the enter key to search');
            searchUrl = 'http://www.google.com/search?q=';
            searchInputImage.attr('src', './../images/google.png');
            break;
        case 'baidu':
           $("#search-input").attr('placeholder','Press the enter key to search');
            searchUrl = 'https://www.baidu.com/s?wd=';
            searchInputImage.attr('src', './../images/baidu.png');
            break;
        case 'bing':
            $("#search-input").attr('placeholder','Press the enter key to search');
            searchUrl = 'https://bing.com/search?q=';
            searchInputImage.attr('src', './../images/bing.png');
            break;
    }
    chrome.storage.sync.set({'searchEngine': searchEngine,'searchUrl':searchUrl});
}

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}