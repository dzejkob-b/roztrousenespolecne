
    var is_resp1 = false, bef_is_resp = false;

    function _clamp(vmin, vmax, value) {
        return Math.min(vmax, Math.max(vmin, value));
    }

    function _menu_toggle(menu_ul, flag) {
        if (!is_resp1) {
            // skip ...

        } else if (flag) {
            menu_ul.stop(true, true);
            menu_ul.animate({
                right: 0
            });

        } else {
            menu_ul.stop(true, true);
            menu_ul.animate({
                right: -240
            });
        }
    }

    function _blur() {
        if (document.activeElement && typeof document.activeElement.blur != 'undefined') {
            document.activeElement.blur();
        }

        document.activeElement = null;
    }

    function _add_nbsp(elRef) {
        for (var sf = 0; sf < elRef.childNodes.length; sf++) {
            if (elRef.childNodes[sf].nodeType == 3) {
                var vv = '', txt = '';

                elRef.childNodes[sf].nodeValue.split(' ').forEach(function(val, idx) {
                    if (txt == '') {
                        txt += val;

                    } else if (vv.length > 0 && vv[vv.length - 1] == '.') {
                        // end of sentence
                        txt += ' ' + val;
                        vv = '';

                    } else if ((vv = val.trim()).length <= 2 && vv.length >= 1) {
                        txt += String.fromCharCode(160) + val;

                    } else {
                        txt += ' ' + val;
                    }
                });

                elRef.childNodes[sf].textContent = txt;
            }
        }
    }

    $(document).ready(function() {
        
        $.localScroll({
            target : $(document.body),
            queue : true,
            duration : 500,
            hash : true,
            onBefore : function(e, anchor, target) {
                // ...
                _blur();
            },
            onAfter : function(anchor, settings) {
                // ...
                _blur();
            }
        });

        var
            wnd = $(window),
            home_title = $('#home_title_ref'),
            intro = $('#intro'),
            image_book = $('#image_book_ref'),
            image_europe = $('#image_europe_ref'),
            image_head = $('#image_head_ref'),
            htop = $('#htop_ref'),
            hbot = $('#hbot_ref'),
            menu_ul = $('#menu_ul_ref'),
            menu_items = $('nav.main_menu li'),
            active_li = null;

        var fn = function() {

            var
                sc_top = wnd.scrollTop(), minTop, maxTop, offTop, useTop, kf, space, w_height = window.innerHeight;

            is_resp1 = window.innerWidth <= 1000;
            
            // == title

            offTop = sc_top + home_title.parent().offset().top;
            useTop = offTop + ((home_title.parent().outerHeight() - offTop) / 2);
            maxTop = (home_title.parent().offset().top + home_title.parent().outerHeight()) - (home_title.outerHeight() / 2);

            home_title.css('top', Math.min(maxTop, useTop) + 'px');


            // == book image

            if (is_resp1) {
                offTop = image_book.parent().offset().top;
                useTop = sc_top - offTop;
                maxTop = image_book.parent().parent().outerHeight() - w_height;

            } else {
                offTop = image_book.parent().offset().top;
                useTop = sc_top - offTop;
                maxTop = image_book.parent().outerHeight() - image_book.outerHeight();
            }

            if (useTop < 0) {
                image_book.css('position', '');
                image_book.css('top', '0');
                image_book.css('width', '');

            } else if (useTop >= maxTop) {
                image_book.css('position', '');
                image_book.css('top', maxTop + 'px');
                image_book.css('width', '');

            } else if (is_resp1) {
                image_book.css('position', 'fixed');
                image_book.css('top', '0');
                image_book.css('width', '');

            } else {
                image_book.css('position', 'fixed');
                image_book.css('top', '0');
                image_book.css('width', '50%');
            }


            if (sc_top > 200) {

                // == europe zoom

                minTop = image_europe.parent().offset().top;

                kf = sc_top < minTop ? 0 : ((sc_top - minTop) / image_europe.parent().outerHeight() / 2);

                /*
                image_europe.css('width', (100.0 + 100.0 * kf) + '%');
                image_europe.css('height', (100.0 + 100.0 * kf) + '%');
                image_europe.css('left', (-50 * kf) + '%');
                image_europe.css('top', (-50 * kf) + '%');
                */

                //image_europe.css('background-size', (100.0 + 100.0 * kf) + '% auto');
                image_europe.css('transform', 'scale(' + (1.0 + kf) + ', ' + (1.0 + kf) + ')');


                // == head zoom

                minTop = image_head.parent().offset().top + 200;

                kf = sc_top < minTop ? 0 : _clamp(0, 0.2, ((sc_top - minTop) / image_head.parent().outerHeight() / 2));

                /*
                image_head.css('width', (100.0 + 100.0 * kf) + '%');
                image_head.css('height', (100.0 + 100.0 * kf) + '%');
                image_head.css('left', (-50 * kf) + '%');
                image_head.css('top', (-50 * kf) + '%');
                */

                //image_head.css('background-size', 'auto ' + (100.0 + 100.0 * kf) + '%');
                image_head.css('transform', 'scale(' + (1.0 + kf) + ', ' + (1.0 + kf) + ')');

                
                // == europe, head opacity

                space = 200;
                minTop = (image_europe.parent().offset().top - (is_resp1 ? (w_height / 2) : 0) + image_europe.parent().outerHeight()) - space;
                maxTop = (image_head.parent().offset().top) + space;
                useTop = sc_top;

                kf = 1.0 - ((_clamp(minTop, maxTop, useTop) - minTop) / (space * 2));

                image_europe.css('opacity', kf);
                image_head.css('opacity', 1.0 - kf);
                
            }


            // == top href

            minTop = home_title.parent().height();

            if (sc_top >= minTop) {
                hbot.addClass("hbot_visible");
            } else {
                hbot.removeClass("hbot_visible");
            }

            if (is_resp1 && sc_top >= minTop) {
                htop.addClass("htop_visible");
            } else {
                htop.removeClass("htop_visible");
            }

            // == menu

            minTop = home_title.parent().offset().top + home_title.parent().outerHeight();
            maxTop = intro.offset().top;

            if (sc_top < minTop) {
                menu_ul.parent().removeClass("main_menu_white");
            } else {
                menu_ul.parent().addClass("main_menu_white");
            }

            if (is_resp1) {
                menu_ul.css('top', '0');

                if (is_resp1 != bef_is_resp) {
                    menu_ul.css('right', '-240px');
                }

            } else {
                maxTop = (w_height / 2.0);
                minTop = home_title.outerHeight() / 2.0;
                offTop = intro.offset().top;
                useTop = maxTop;

                if (sc_top >= offTop) {
                    kf = 1.0 - Math.min(((sc_top - offTop) / 500.0), 1.0);
                    useTop = ((maxTop - minTop) * kf) + minTop;
                }

                menu_ul.css('top', useTop + 'px');
                menu_ul.css('right', '');
            }


            // == menu items

            maxTop = home_title.parent().offset().top + home_title.parent().outerHeight();

            var new_active_li = null, max_idx = menu_items.length - 1;

            menu_items.each(function(idx, elRef) {

                elRef = $(elRef);

                if (elRef.offset().top >= maxTop) {
                    elRef.addClass("black");
                } else {
                    elRef.removeClass("black");
                }

                var scTrg = $('#' + elRef.children("a").attr("href").substr(1));
                var testOffset = idx == max_idx ? ($(document.body).height() - w_height - 200) : (scTrg.offset().top - 100);

                if (sc_top >= testOffset) {
                    new_active_li = elRef;
                }

            });

            if (new_active_li !== active_li) {
                if (active_li) {
                    $(active_li).removeClass("black_active");
                    $(active_li).removeClass("active");
                }

                $(new_active_li).addClass($(new_active_li).hasClass("black") ? "black_active" : "active");

                active_li = new_active_li;
            }

            bef_is_resp = is_resp1;

        };

        fn();

        $(window).scroll(fn);
        $(window).resize(fn);
        $(window).on("touchmove", fn);

        htop.click(function(event) {

            event.preventDefault();
            _menu_toggle(menu_ul, true);
            _blur();

            return false;
        });

        $(document.body).click(function(event) {

            _menu_toggle(menu_ul, false);
            _blur();
            
        });

        $("a.new-panel").click(function(event) {

            event.preventDefault();
            window.open($(this).attr('href'));
            
            return false;
        });

        $("p").each(function(idx, elRef) {
            _add_nbsp(elRef);
        });

        $("h2").each(function(idx, elRef) {
            _add_nbsp(elRef);
        });

    });
