/**
 *
 * @authors Roc (rochuang@xtremeprog.com)
 * @date    2015-08-21 17:02:18
 * @version V1.0.0
 */

$.fn.addressSelect = function (options) {
    var self = this;
    self.click(function (event) {
        $(document).on("mousedown.store-content", function (event) {
            //当点击的不是地址控件，隐藏
            var v = ".store-content";
            if (!$(event.target).closest($(v).add(self)).length) {
                $(".store-content").hide();
                $(document).off("mousedown.store-content");
            }
        });
    });

    var option = $.extend(
        {
            url: "",
            getContentCallback: function (data) {
                //Zn 后台返回格式
                return data.data;
            },
            spaceMark: "," /*隔开符号*/,
            level: [
                /*显示地址级别；数据类型：数组*/
                { key: "province", name: "省份" },
                { key: "city", name: "城市" },
                { key: "area", name: "县区" },
            ],
            value: "",
            selectCallback: function (data) {
                alert(data);
            },
        },
        options
    );
    self.init = function () {
        var self = this;
        var codes = option.value || self.find("input").attr("data-code");
        if (codes) {
            self.createDom(function () {
                self.initStatus(codes);
            });
        } else {
            self.createDom(function () {
                self.getContent(0, function (data) {
                    if (data) {
                        var $provinces = $("#stock_province_item");
                        self.fillTags($provinces, data);
                    }
                });
            });
        }
        return {};
    };
    self.createDom = function (callback) {
        var $storeContent = $("<div class='store-content'></div>");

        var $close = $("<span class='store-close'></span>").text("×");
        var $tab = $("<ul class='tab'></ul>");
        var level = option.level;
        for (var i = 0; i < level.length; i++) {
            var tabItemA = $("<a></a>")
                .attr("href", "javascript:void(0)")
                .text(level[i].name);
            var tabItem = $("<li></li>")
                .attr("data-key", level[i].key)
                .append(tabItemA);

            var mcId = "stock_" + level[i].key + "_item";
            var $mc = $("<div></div>").attr({
                class: "mc",
                "data-area": level[i].key,
                id: mcId,
            });
            if (i == 0) {
                tabItem.addClass("active");
                $mc.addClass("active");
            }
            $tab.append(tabItem);
            $storeContent.append($mc);
        }
        var $mt = $("<div class='mt'></div>").append($tab);
        $storeContent.prepend($close, $mt);
        var $storeBox = $("<div class='store-box'></div>");
        $storeBox.attr("style", "position: relative;");
        $storeBox = $storeBox.append(self.find("input")).append($storeContent);
        self.empty().append($storeBox);
        self.find("input").focus(function (e) {
            self.find(".store-content").show();
        });
        self.find(".store-content>.store-close").click(function (e) {
            self.find(".store-content").hide();
        });
        self.find(".store-content>.mt>.tab>li").click(function (e) {
            self.find(".store-content>.mt>.tab>li").removeClass("active");
            $(this).addClass("active");
            var dataArea = $(this).attr("data-key");
            self.find(".store-content .mc").each(function (index) {
                var $this = $(this);
                if ($this.attr("data-area") == dataArea) {
                    self.find(".store-content .mc").removeClass("active");
                    $this.addClass("active");
                }
            });
        });
        if (callback) {
            callback();
        }
        return self;
    };
    self.fillTags = function (targe, contents, callback) {
        if (contents) {
            var html = '<ul class="area-list">';
            for (var i = 0; i < contents.length; i++) {
                html +=
                    '<li><a href="javascript:void(0)" data-code=' +
                    contents[i].code +
                    ">" +
                    contents[i].name +
                    "</a></li>";
            }
            html += "</ul>";
            targe.html(html);
            if (callback) {
                callback();
            }
        } else {
            html = null;
        }
        self.select();
        return html;
    };
    self.getContent = function (code, callback) {
        var array = null;
        var url = "";
        if (option.url) {
            if (option.url.slice(-1) == "/") {
                url =
                    option.url.substr(0, option.url.length - 1) +
                    "?code=" +
                    encodeURI(encodeURI(code));
            } else {
                url = option.url + "?code=" + encodeURI(encodeURI(code));
            }
            $.get(
                url,
                function (data) {
                    array = option.getContentCallback(data);
                    if (callback) {
                        callback(array);
                    }
                    return array;
                },
                "json"
            );
        } else {
            return array;
        }
    };
    self.select = function () {
        var $address = self.find("input");
        $("ul.area-list>li").each(function (index) {
            $(this)
                .unbind()
                .bind("click", function (index) {
                    var $this = $(this);
                    var addresses = "";
                    var codes = "";
                    var code = $this.find("a").attr("data-code");
                    var currentArea = $this.closest(".mc").attr("data-area");
                    var nextArea = $this
                        .closest(".mc")
                        .next(".mc")
                        .attr("data-area");
                    var $currentArea = $("#stock_" + currentArea + "_item");
                    var $nextArea = $("#stock_" + nextArea + "_item");
                    $this
                        .closest(".mc")
                        .find("ul.area-list>li")
                        .removeClass("active");
                    $this.addClass("active");
                    if (nextArea) {
                        $currentArea.nextAll().empty();
                        self.getContent(code, function (data) {
                            self.fillTags($nextArea, data);
                            self.find(".store-content .tab>li").removeClass(
                                "active"
                            );
                            self.find(".store-content .tab>li").each(function (
                                index
                            ) {
                                if ($(this).attr("data-key") == nextArea) {
                                    $(this).addClass("active");
                                }
                            });
                            $currentArea.removeClass("active");
                            $nextArea.addClass("active");
                            self.select();
                        });
                    } else {
                        self.find(".store-content").hide();
                    }
                    self.find(".mc>ul.area-list>li.active>a").each(function (
                        index
                    ) {
                        addresses += $(this).text() + option.spaceMark;
                        codes += $(this).attr("data-code") + option.spaceMark;
                    });
                    $address.val(addresses.substring(0, addresses.length - 1));
                    $address.attr(
                        "data-code",
                        codes.substring(0, codes.length - 1)
                    );
                    var selectAddress =
                        $address.attr("data-code").split(option.spaceMark) ||
                        "";
                    option.selectCallback(selectAddress, $address.val());
                });
        });
    };
    self.initStatus = function (codes) {
        var codes =
            typeof codes == "string" ? codes.split(option.spaceMark) : codes;
        codes = codes || [];
        function setStatus(i) {
            var code = null;
            if (i < option.level.length) {
                if (i < 1) {
                    code = 0;
                } else {
                    code = codes[i - 1];
                }
                var $mc = self.find(".mc").eq(i);
                if (typeof code != "undefined") {
                    self.getContent(code, function (data) {
                        self.fillTags($mc, data, function () {
                            $mc.find("li").each(function (index) {
                                if (
                                    codes[i] &&
                                    $(this).find("a").attr("data-code") ==
                                        codes[i] &&
                                    !$(this).hasClass("active")
                                ) {
                                    $(this).addClass("active");
                                }
                            });
                            i++;
                            setStatus(i);
                        });
                    });
                } else {
                    i++;
                }
            } else {
                return;
            }
        }
        var i = 0;
        setStatus(i);
    };
    self.init();
};

//Plugin: jQuery.dragmove
//Source: github.com/nathco/jQuery.dragmove
//Author: Nathan Rutzky
//Update: 1.0
//jquery拖拽
$.fn.dragmove = function () {
    return this.each(function () {
        var $document = $(document),
            $this = $(this),
            active,
            startX,
            startY;

        $this.on("mousedown touchstart", function (e) {
            active = true;
            startX = e.originalEvent.pageX - $this.offset().left;
            startY = e.originalEvent.pageY - $this.offset().top;

            if ("mousedown" == e.type) click = $this;

            if ("touchstart" == e.type) touch = $this;

            if (window.mozInnerScreenX == null) return false;
        });

        $document
            .on("mousemove touchmove", function (e) {
                if ("mousemove" == e.type && active)
                    click.offset({
                        left: e.originalEvent.pageX - startX,
                        top: e.originalEvent.pageY - startY,
                    });

                if ("touchmove" == e.type && active)
                    touch.offset({
                        left: e.originalEvent.pageX - startX,
                        top: e.originalEvent.pageY - startY,
                    });
            })
            .on("mouseup touchend", function () {
                active = false;
            });
    });
};
