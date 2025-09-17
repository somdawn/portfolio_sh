$(document).ready(function () {

    let modalSwiper = null;

    $("header nav a").on("click", function (e) {
        e.preventDefault();
        var hash = this.hash;
        if (!hash) return;
        var $target = $(hash);
        if ($target.length === 0) return;
        var top = $target.offset().top;
        $("html, body").stop(true).animate({ scrollTop: top }, 1000, "swing");
    });

    function triggerLineAnimation() {
        $("section").each(function () {
            var $section = $(this);
            var triggerPoint = $section.offset().top + $section.outerHeight() * 0.1;
            if ($(window).scrollTop() + $(window).height() >= triggerPoint) {
                $section.find("[class*='_line']").each(function () {
                    if (!$(this).hasClass("line_draw")) $(this).addClass("line_draw");
                });
            }
        });
    }

    function updateNavStyle() {
        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();
        var currentId = null;
        $("section").each(function () {
            var $section = $(this);
            var sectionTop = $section.offset().top;
            var sectionHeight = $section.outerHeight();
            if (scrollTop >= sectionTop - windowHeight / 2 &&
                scrollTop < sectionTop + sectionHeight - windowHeight / 2) {
                currentId = $section.attr("id");
                return false;
            }
        });
        $("header nav a").each(function () {
            var $link = $(this);
            if ($link.attr("href") === "#" + currentId) {
                $link.css({ "color": "", "font-size": "" });
            } else {
                $link.css({ "color": "#867AA8", "font-size": "calc(100% - 2px)" });
            }
        });
    }

    $(window).on("scroll", function () {
        (function () {
            if ($(this).scrollTop() < 700) {
                $("#btn_top").hide();
            } else if ($(this).scrollTop() < 800) {
                $("#btn_top").fadeIn(500);
            }

            var $intro = $("#intro");
            if ($intro.length) {
                var introTop = $intro.offset().top;
                var introHeight = $intro.outerHeight();
                var scrollTop = $(window).scrollTop();
                var ratio = (scrollTop - introTop) / introHeight;
                if (ratio < 0) ratio = 0;
                if (ratio > 1) ratio = 1;
                var t = (ratio - 0.5) / 0.5;
                if (t < 0) t = 0;
                if (t > 1) t = 1;
                var start = { r: 0x21, g: 0x2C, b: 0x57 };
                var end = { r: 0x86, g: 0x7A, b: 0xA8 };
                var r = Math.round(start.r + (end.r - start.r) * t);
                var g = Math.round(start.g + (end.g - start.g) * t);
                var b = Math.round(start.b + (end.b - start.b) * t);
                $("header a").css("color", "rgb(" + r + "," + g + "," + b + ")");
            }

            var $about = $("#about");
            var $skills = $("#skill .skill_bg .skill_bar");
            if ($about.length && $skills.length) {
                var aboutTop = $about.offset().top;
                var aboutHeight = $about.outerHeight();
                var scrollTop = $(window).scrollTop();
                var $skill = $("#skill");
                var triggerStart = aboutTop + aboutHeight * 0.5;
                if (scrollTop >= triggerStart && !$skill.data("animated")) {
                    $skill.data("animated", true);
                    $("#skill .skill_bg").each(function (i) {
                        var $bar = $(this).find(".skill_bar");
                        var target = parseInt($bar.text());
                        $bar.stop(true, true);
                        $bar.css("width", 0).text("0%");
                        $bar.delay(i * 1000).animate({ width: target + "%" }, {
                            duration: 1000,
                            step: function (now) {
                                $bar.text(Math.round(now) + "%");
                            },
                            complete: function () {
                                $bar.text(target + "%");
                            }
                        });
                    });
                }
            }
        })();
        (function () { triggerLineAnimation(); })();
        (function () { updateNavStyle(); })();
    });

    triggerLineAnimation();
    updateNavStyle();

   $(".work_item").on("click", function () {
    const imgData = $(this).data("img");
    if (!imgData) return;

    const imgList = String(imgData)
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

    if (imgList.length === 0) return;

    if (modalSwiper) {
        modalSwiper.destroy(true, true);
        modalSwiper = null;
    }

    const $wrapper = $(".modal_wrap .swiper-wrapper").empty();
    imgList.forEach(src => {
        $wrapper.append(`<div class="swiper-slide"><img src="${src}" alt="portfolio image"></div>`);
    });

    $(".modal_wrap").addClass("show").fadeIn(300);

    setTimeout(() => {
        modalSwiper = new Swiper(".modal_swiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: imgList.length > 1,
            autoplay: imgList.length > 1 ? {
                delay: 1000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            } : false,
            speed: 300,
            effect: 'slide',
            breakpoints: {
                768: { 
                    slidesPerView: imgList.length >= 2 ? 2 : 1, 
                    spaceBetween: 25 
                },
                1024: { 
                    slidesPerView: imgList.length >= 3 ? 3 : imgList.length, 
                    spaceBetween: 30 
                }
            }
        });
    }, 100);
});

    function closeModal() {
    if (modalSwiper) {
        modalSwiper.destroy(true, true);
        modalSwiper = null;
    }
    
    $(".modal_wrap").fadeOut(300, function () {
        $(this).removeClass("show");
        $(".modal_wrap .swiper-wrapper").empty();
    });
}

$(document).on("click", ".modal_close", closeModal);

$(document).on("click", ".modal_wrap", function (e) {
    if ($(e.target).is(".modal_wrap")) {
        closeModal();
    }
});

$(document).on("keydown", function(e) {
    if (e.keyCode === 27 && $(".modal_wrap").hasClass("show")) {
        closeModal();
    }
});
});
