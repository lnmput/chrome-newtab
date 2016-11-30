$(document).ready(function() {

    var clock = showClock();
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




















    // 日本
    $(".jp").click(function () {
        $('.clock').empty();
        var clock = showClock();
        // second
        clock.setTime(7200);
    });
    // 美国
    $(".us").click(function () {
        $('.clock').empty();
        var clock = showClock();
        // second
        clock.setTime(3600);
    });
    // 西班牙
    $(".es").click(function () {
        $('.clock').empty();
        var clock = showClock();
        // second
        clock.setTime(3600);
    });
    // 意大利
    $(".it").click(function () {
        $('.clock').empty();
        var clock = showClock();
        // second
        clock.setTime(3600);
    });

    
    
    
    
});

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
            cn_week = '星期二'
            break;
        case 3:
            cn_week = '星期三'
            break;
        case 4:
            cn_week = '星期四'
            break;
        case 5:
            cn_week = '星期五'
            break;
        case 6:
            cn_week = '星期六'
            break;
        case 0:
            cn_week = '星期日'
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
    }
    chrome.storage.sync.set({'searchEngine': searchEngine,'searchUrl':searchUrl}, function() {
    });
}
