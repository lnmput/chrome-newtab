$(document).ready(function() {

    init();
    showClock();
    getSearchEngine();
    setDateTime();
    $("body").keydown(function() {
        if (event.keyCode == "13"  || event.which == 13) {
            getSearchUrl();
        }
    });

    $('input[type=radio][name=search-engine]').change(function() {
        var searchEngine = $("input[name=search-engine]:checked").val();
        changeSearchEngine(searchEngine);
    });

    uploadImage();

    settingImage();









});


function init() {
    chrome.storage.local.get('backgroud_image_url', function (result) {
        var channels = result.backgroud_image_url;
        console.log(channels);
        if (channels) {
            $("body").css('background-image', 'url(' + channels + ')');
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
    $(".date-time").html(m.get('year')+' / '+ m.get('month')+' / '+m.get('date')+ '  '+week);
}

function formatWeek(week) {
    var cn_week = '';
    switch (week)
    {
        case 1:
            cn_week = '星期一';
            break;
        case 2:
            cn_week = '星期二';
            break;
        case 3:
            cn_week = '星期三';
            break;
        case 4:
            cn_week = '星期四';
            break;
        case 5:
            cn_week = '星期五';
            break;
        case 6:
            cn_week = '星期六';
            break;
        case 0:
            cn_week = '星期日';
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
            searchUrl ='https://www.baidu.com/s?wd=';
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
            changeSearchEngine('baidu');
        }
    });
}

function changeSearchEngine(searchEngine) {
    var searchUrl = '';
    switch (searchEngine)
    {
        case 'google':
            $("#search-input").attr('placeholder','回车使用谷歌搜索');
            searchUrl = 'http://www.google.com/search?q=';
            break;
        case 'baidu':
            $("#search-input").attr('placeholder','回车使用百度搜索');
            searchUrl = 'https://www.baidu.com/s?wd=';
            break;
        case 'bing':
            $("#search-input").attr('placeholder','回车使用必应搜索');
            searchUrl = 'https://bing.com/search?q=';
            break;
    }
    chrome.storage.sync.set({'searchEngine': searchEngine,'searchUrl':searchUrl}, function() {
    });
}
