/*!
	Wheelzoom 3.0.0
	license: MIT
	http://www.jacklmoore.com/wheelzoom
*/
window.wheelzoom = (function() {
    var defaults = {
        zoom: 0.10
    };
    var canvas = document.createElement('canvas');

    function setSrcToBackground(img) {
        img.parentElement.style.backgroundImage = "url('" + img.src + "')";
        img.parentElement.style.backgroundRepeat = 'no-repeat';
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        //img.src = canvas.toDataURL();
        //img.style["z-index"]=-100;
        img.style["visibility"] = 'hidden';
    }

    main = function(img, options) {
        if (!img || !img.nodeName || img.nodeName !== 'IMG') { return; }

        var settings = {};
        var width;
        var height;
        var divHeight;
        var divWidth;
        var bgWidth;
        var bgHeight;
        var bgPosX;
        var bgPosY;
        var previousEvent;

        function updateBgStyle() {
            // if (bgPosX > 0) {
            // 	bgPosX = 0;
            // } else if (bgPosX < width - bgWidth) {
            // 	bgPosX = width - bgWidth;
            // }

            // if (bgPosY > 0) {
            // 	bgPosY = 0;
            // } else if (bgPosY < height - bgHeight) {
            // 	bgPosY = height - bgHeight;
            // }

            img.parentElement.style.backgroundSize = bgWidth + 'px ' + bgHeight + 'px';
            img.parentElement.style.backgroundPosition = bgPosX + 'px ' + bgPosY + 'px';
        }

        // function reset() {
        // 	bgWidth = width;
        // 	bgHeight = height;
        // 	bgPosX = bgPosY = '0';
        // 	updateBgStyle();
        // }
        function reset() {
            bgWidth = width;
            bgHeight = height;
            bgPosX = (divWidth - width) / 2;
            bgPosY = (divHeight - height) / 2;
            updateBgStyle();
        }

        function onwheel(e) {
            var deltaY = 0;

            e.preventDefault();

            if (e.deltaY) { // FireFox 17+ (IE9+, Chrome 31+?)
                deltaY = e.deltaY;
            } else if (e.wheelDelta) {
                deltaY = -e.wheelDelta;
            }

            // As far as I know, there is no good cross-browser way to get the cursor position relative to the event target.
            // We have to calculate the target element's position relative to the document, and subtrack that from the
            // cursor's position relative to the document.
            var rect = img.parentElement.getBoundingClientRect();
            var offsetX = e.pageX - rect.left - document.body.scrollLeft;
            var offsetY = e.pageY - rect.top - document.body.scrollTop;

            var oribgPosX = parseInt(img.parentElement.style.backgroundPositionX, 10);
            var oribgPosY = parseInt(img.parentElement.style.backgroundPositionY, 10);
            var a = offsetX - oribgPosX;
            var b = offsetY - oribgPosY;
            if (deltaY < 0) {
                a += a * settings.zoom;
                b += b * settings.zoom;
            } else {
                a -= a * settings.zoom;
                b -= b * settings.zoom;
            }

            bgPosX = offsetX - a;
            bgPosY = offsetY - b;

            // Use the previous offset to get the percent offset between the bg edge and cursor:
            //			var bgRatioX = bgCursorX/bgWidth;
            //			var bgRatioY = bgCursorY/bgHeight;
            //			var size = img.parentElement.style.backgroundSize.split(" ");
            //			bgWidth = parseInt(size[0],10);
            //			bgHeight= parseInt(size[1],10);
            // Update the bg size:
            if (deltaY < 0) {
                bgWidth += bgWidth * settings.zoom;
                bgHeight += bgHeight * settings.zoom;
            } else {
                bgWidth -= bgWidth * settings.zoom;
                bgHeight -= bgHeight * settings.zoom;
            }

            // Take the percent offset and apply it to the new size:
            //			bgPosX = offsetX - (bgWidth * bgRatioX);
            //			bgPosY = offsetY - (bgHeight * bgRatioY);

            // Prevent zooming out beyond the starting size
            if (bgWidth <= width || bgHeight <= height) {
                reset();
            } else {
                updateBgStyle();
            }
        }

        function drag(e) {
            e.preventDefault();
            bgPosX += (e.pageX - previousEvent.pageX);
            bgPosY += (e.pageY - previousEvent.pageY);
            previousEvent = e;
            updateBgStyle();
        }

        function removeDrag() {
            document.removeEventListener('mouseup', removeDrag);
            document.removeEventListener('mousemove', drag);
        }

        // Make the background draggable
        function draggable(e) {
            e.preventDefault();
            previousEvent = e;
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', removeDrag);
        }

        function loaded() {
            var computedStyle = window.getComputedStyle(img, null);

            width = parseInt(computedStyle.width, 10);
            height = parseInt(computedStyle.height, 10);

            // wjlong begin 缩小大图片
            // bgWidth = width;
            // bgHeight = height;
            // wjlong end

            divHeight = img.parentElement.clientHeight;
            divWidth = img.parentElement.clientWidth;
            // wjlong begin 如果图片尺寸 超过了 div的尺寸 先缩小图片
            if ((width>divWidth) || (height>divHeight)) {
                var rate = width / height;
                // 长度比较大
                if (width / divWidth > height / divHeight) {
                    width = divWidth;
                    height = parseInt(width / rate);
                } else {
                    height = divHeight;
                    width = parseInt(height * rate);
                }
            }
            bgWidth = width;
            bgHeight = height;
            // wjlong end

            bgPosX = (divWidth - width) / 2;
            bgPosY = (divHeight - height) / 2;



            setSrcToBackground(img);

            img.parentElement.style.backgroundSize = width + 'px ' + height + 'px';
            img.parentElement.style.backgroundPosition = bgPosX + 'px ' + bgPosY + 'px';
            img.parentElement.addEventListener('wheelzoom.reset', reset);

            img.parentElement.addEventListener('mousewheel', onwheel);
            img.parentElement.addEventListener('mousedown', draggable);
        }

        img.addEventListener('wheelzoom.destroy', function(originalProperties) {
            //img.parentElement.removeEventListener('wheelzoom.destroy');
            img.parentElement.removeEventListener('wheelzoom.reset', reset);
            img.parentElement.removeEventListener('load', onload);
            img.parentElement.removeEventListener('mouseup', removeDrag);
            img.parentElement.removeEventListener('mousemove', drag);
            img.parentElement.removeEventListener('mousedown', draggable);
            img.parentElement.removeEventListener('mousewheel', onwheel);
            img.removeEventListener('load', onload);

            img.parentElement.style.backgroundImage = originalProperties.backgroundImage;
            img.parentElement.style.backgroundRepeat = originalProperties.backgroundRepeat;
            img.parentElement.src = originalProperties.src;
            //			img.style["z-index"]=0;
            img.style["visibility"] = 'visible';
        }.bind(null, {
            backgroundImage: img.parentElement.style.backgroundImage,
            backgroundRepeat: img.parentElement.style.backgroundRepeat,
            src: img.parentElement.src
        }));

        options = options || {};

        Object.keys(defaults).forEach(function(key) {
            settings[key] = options[key] !== undefined ? options[key] : defaults[key];
        });

        function onload() {
            img.removeEventListener('load', onload);
            loaded();
        }
        img.addEventListener('load', onload);
        if (img.complete) {
            loaded();
        }
    };

    // Do nothing in IE8
    if (typeof window.getComputedStyle !== 'function') {
        return function(elements) {
            return elements;
        }
    } else {
        return function(elements, options) {
            if (elements && elements.length) {
                Array.prototype.forEach.call(elements, main, options);
            } else if (elements && elements.nodeName) {
                main(elements, options);
            }
            return elements;
        }
    }
}());
