/*!
 * jQuery messenger plugin
 * https://github.com/myspace-nu
 *
 * Copyright 2021 Johan Johansson
 * Released under the MIT license
 */
(function($) {
    var instances=[];
	$.fn.fancyMessenger = function(options) {
        instances.push(this);
		var settings = $.extend(true, {
            text:{
                heading:'Send us a message!',
                body:'<form><input class="form-control form-control-sm" type="email" placeholder="Your e-mail address" /><textarea class="form-control form-control-sm" placeholder="Your message"></textarea><button class="btn btn-light btn-sm">Send</button></form>',
                sent:'Message sent!',
                invalidEmail:'Invalid e-mail!'
            },
            closeOnSend:true,
            onSend:function(){ }
        }, options);
        var getTimezoneOffset = function (d, tz) {
            const a = d.toLocaleString("ja", {timeZone: tz}).split(/[/\s:]/);
            a[1]--;
            const t1 = Date.UTC.apply(null, a);
            const t2 = new Date(d).setMilliseconds(0);
            return (t2 - t1) / 60 / 1000;
        }
        var fancyParent = (this.length) ? this: $("body").first();
        var fancyMarkup = $('<div class="fancyMessenger"><div class="fancyMessenger-header"><div class="fancyMessenger-avatar"><div class="fancyMessenger-available">&check;</div></div><div class="fancyMessenger-text">'+settings.text.heading+'</div></div><div class="fancyMessenger-body">'+settings.text.body+'</div><div class="fancyMessenger-info"></div></div>');
        var fancyStyleSheet = $(`<style type="text/css">
.fancyMessenger{background-color:#2368af;border-radius:28px;max-width:250px;min-width:56px;display:inline-block;box-shadow:0 0 20px rgba(60,60,60,.2)}.fancyMessenger-header{position:relative;height:56px;cursor:pointer}.fancyMessenger-body,.fancyMessenger-info{display:none;color:#fff;margin:5px 5px 15px 5px;font-family:Roboto,sans-serif;font-size:12px}.fancyMessenger-body *{margin-bottom:5px}.fancyMessenger-avatar{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHdpZHRoPSIzMHB4IiBoZWlnaHQ9IjMwcHgiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzAgMzAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTI4LjQzNiwxNy42MjJjMC0xLjM2Ni0wLjQ3NS0yLjY0Ni0xLjI5NC0zLjc1NGMtMC40ODIsNC40NDQtNC40Niw4LjE4Ny0xMC4wMDMsOS4yODINCgljLTAuODM4LDAuMTY2LTEuNzAzLDAuMjY5LTIuNTY4LDAuMzAzYy0wLjgxOSwwLjAzMS0xLjYzNS0wLjAxNy0yLjQ0NC0wLjEwMmMxLjEzNywwLjc2NCwyLjQ5OSwxLjMzMiw0LjAwNCwxLjYzDQoJYzAuNjIyLDAuMTI1LDEuMjcsMC4yMDMsMS45MzMsMC4yMjljMC4xNzMsMC4wMDYsMC4zNDcsMC4wMTIsMC41MjIsMC4wMTJjMS43MTgsMCwzLjMzMy0wLjM0Miw0LjczOS0wLjkzOGwzLjU4NywxLjgzbC0wLjcyNS0zLjY1OA0KCUMyNy41OTEsMjEuMTQyLDI4LjQzNiwxOS40NiwyOC40MzYsMTcuNjIyeiIvPg0KPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTI2LjE4OCwxMy4xN2MtMC4wMTktMC42MTktMC4xMTItMS4yMjQtMC4yNzYtMS44MDljLTEuMjAxLTQuMjczLTYuMTMzLTcuNDc1LTEyLjAzNC03LjQ3NQ0KCUM3LjA3NiwzLjg4NywxLjU2Myw4LjEzOSwxLjU2MywxMy4zODRjMCwyLjI5NiwxLjA1Niw0LjM5OCwyLjgxMiw2LjA0MWwtMC45MDYsNC41NzJsNC40ODQtMi4yODcNCgljMS43NTgsMC43NDYsMy43NzYsMS4xNzIsNS45MjQsMS4xNzJjMC4yMiwwLDAuNDM4LTAuMDA2LDAuNjUzLTAuMDE0YzAuODI5LTAuMDMzLDEuNjM4LTAuMTMxLDIuNDE1LTAuMjg1DQoJYzUuMzE2LTEuMDUxLDkuMjQ2LTQuNzcxLDkuMjQ2LTkuMTk5QzI2LjE5LDEzLjMxMywyNi4xODksMTMuMjQyLDI2LjE4OCwxMy4xN3ogTTkuNTEsMTUuMjljLTAuNzQ0LDAtMS4zNDgtMC42MDQtMS4zNDgtMS4zNDkNCglzMC42MDQtMS4zNDksMS4zNDgtMS4zNDlzMS4zNDgsMC42MDQsMS4zNDgsMS4zNDlTMTAuMjU0LDE1LjI5LDkuNTEsMTUuMjl6IE0xMy44NzcsMTUuMjg4Yy0wLjc0MywwLTEuMzQ3LTAuNjA0LTEuMzQ3LTEuMzQ3DQoJYzAtMC43NDQsMC42MDQtMS4zNDcsMS4zNDctMS4zNDdjMC43NDQsMCwxLjM0OCwwLjYwMywxLjM0OCwxLjM0N0MxNS4yMjUsMTQuNjg1LDE0LjYyMSwxNS4yODgsMTMuODc3LDE1LjI4OHogTTE4LjI0NSwxNS4yODgNCgljLTAuNzQ0LDAtMS4zNDctMC42MDQtMS4zNDctMS4zNDdjMC0wLjc0NCwwLjYwMy0xLjM0NywxLjM0Ny0xLjM0N3MxLjM0OCwwLjYwMywxLjM0OCwxLjM0Nw0KCUMxOS41OTMsMTQuNjg1LDE4Ljk4OSwxNS4yODgsMTguMjQ1LDE1LjI4OHoiLz4NCjwvc3ZnPg0K);background-position:center;background-size:80%;background-repeat:no-repeat;top:5px;left:5px;width:46px;height:46px;border-radius:23px;position:absolute}.fancyMessenger-available{position:absolute;text-align:center;width:18px;height:18px;background-color:#40b681;color:#fff;font-size:12px;font-weight:700;top:0;left:35px;border-radius:100%}.fancyMessenger-text{padding:20px 40px 0 60px;color:#fff;font-family:Roboto,sans-serif;font-size:13px;display:none}.fancyMessenger-info{display:none}
</style>`);
        if(!this.length){
            $(fancyMarkup).css({position: "fixed", bottom: "20px", right: "20px" });
        }
        if(new Date().getUTCHours()<8+getTimezoneOffset(new Date,"Europe/Stockholm")/60 || new Date().getUTCHours()>=16+getTimezoneOffset(new Date,"Europe/Stockholm")/60){
            $(fancyMarkup).find('.fancyMessenger-available').hide();
        }
		fancyParent.each(function() {
            var thisElm = $(this);
            var inserted = fancyMarkup.appendTo(thisElm);
            $(inserted).first().find('button').click(function(event){
                event.preventDefault();
                var errors=0;
                $(inserted).find("input[type=email]").each(function() {
                    if(!$(this).val() || !$(this)[0].validity.valid){
                        $(this).closest(".fancyMessenger").find(".fancyMessenger-info").html(settings.text.invalidEmail).fadeIn(600).delay(3000).fadeOut(600);
                        errors++;
                    }
                });
                if(errors)
                    return false;
                settings.onSend(inserted);
                if(settings.closeOnSend){
                    $(this).closest(".fancyMessenger").find(".fancyMessenger-body").hide();
                    $(this).closest(".fancyMessenger").find(".fancyMessenger-text").hide();
                }
                if(settings.collapseOnSend){
                    $(this).closest(".fancyMessenger").find(".fancyMessenger-body").hide();
                }
                $(this).closest(".fancyMessenger").find(".fancyMessenger-info").html(settings.text.sent).fadeIn(600).delay(3000).fadeOut(600);
            });
            $(inserted).find(".fancyMessenger-header").click(function(event){
                event.stopPropagation();
                $(this).closest(".fancyMessenger").find(".fancyMessenger-body").toggle();
            });
            $(inserted).find('.fancyMessenger-avatar').click(function(event){
                event.stopPropagation();
                $(this).closest(".fancyMessenger").find(".fancyMessenger-text").toggle();
                if($(this).closest(".fancyMessenger").find(".fancyMessenger-text").is(":hidden")){
                    $(this).closest(".fancyMessenger").find(".fancyMessenger-body").hide();
                } else {
                    $(this).closest(".fancyMessenger").find(".fancyMessenger-body").show();
                }
                $(this).closest(".fancyMessenger").find(".fancyMessenger-info").hide();
            });
        });
        // Add stylesheed unless already defined
        if($(".fancyMessenger-info").css("display") != "none")
            fancyStyleSheet.appendTo($("body").first());
		return this;
	};
	$.fancyMessenger = function(options) {
		$.fn.fancyMessenger(options);
	};
}(jQuery));