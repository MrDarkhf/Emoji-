// ==UserScript==
// @name            Emoji+
// @namespace       https://github.com/MrDarkhf/Emojiplus/
// @updateURL       https://raw.githubusercontent.com/MrDarkhf/Emojiplus/master/Emojiplus.user.js
// @version         1.0.0
// @description     A simple Emoji support script.
// @author          MrDark
// @resource        dropdownCSS https://github.com/MrDarkhf/Emojiplus/blob/master/dropdownCSS.css
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery.textcomplete/1.8.0/jquery.textcomplete.min.js
// @match           https://hackforums.net/editpost.php*
// @match           https://hackforums.net/showthread.php*
// @match           https://hackforums.net/newthread.php*
// @match           https://hackforums.net/newreply.php*
// @match           https://hackforums.net/private.php*
// @grant           GM_getResourceText
// @grant           GM_addStyle
// ==/UserScript==

dropdownCSS = GM_getResourceText('dropdownCSS');
GM_addStyle(dropdownCSS);

var emojis;
$.getJSON("https://raw.githubusercontent.com/MrDarkhf/Emojiplus/master/emotes.json", $.getJSON(""), function(data) {
    emojis = data;
});

(function($) {
    $.fn.emojify = function() {
        this.textcomplete([{
            index: 1,

            match: /\B:([\-+\w]*)$/,

            search: function(term, callback) {
                charBefore = $(this).text().charAt($(this).text().indexOf(term) - 2);
                data = $.map(emojis, function(img, emoji) {
                    return (charBefore == " " || charBefore === "") && emoji.indexOf(term) === 0 ? {'emoji': emoji, 'img': img} : null;
                });

                callback(data);
            },

            template: function(info) {
                return '<img src="' + info.img + '" width="16" height="16"> ' + info.emoji;
            },

            replace: function(info) {
                return '[img=20x20]' + info.img + '[/img] ';
            }
        }]);

        return this;
    };
})(jQuery);

$('textarea#message_new, textarea#message').emojify();


if (typeof Thread != "undefined") {
    originalEvent = Thread.quickEditLoaded;
    Thread.quickEditLoaded = function() {
        ret = originalEvent.apply(this, arguments);

        $('textarea[id^=quickedit]').emojify();

        return ret;
    };
}
