hotkeys('a', function(event,handler){
    $(".setting").click();
});

hotkeys('space', function(event,handler){
    $("#search-input").focus();
});

// search switch hot key
hotkeys('alt+b,alt+g', function(event,handler){
    switch(handler.key){
        case "alt+b":
            changeSearchEngine('baidu');
            break;
        case "alt+g":
            changeSearchEngine('google');
            break;
    }
});



