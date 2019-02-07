(function() {

    console.log("Extension GetThatPat injected.");
    var currentElementHovered;

    function createCanvas() {
        canvasContainer = document.createElement('div');
        canvasContainer.id = "extensionCanvasTemporary";
        document.body.appendChild(canvasContainer);
        canvasContainer.style.position = "absolute";
        canvasContainer.style.left = "0px";
        canvasContainer.style.top = "0px";
        canvasContainer.style.width = "100%";
        canvasContainer.style.height = "100%";
        canvasContainer.style.zIndex = "100000";
        superContainer = document.body;
        canvas = document.createElement('canvas');
        canvas.style.width = superContainer.scrollWidth+"px";
        canvas.style.height = superContainer.scrollHeight+"px";
        canvas.width = superContainer.scrollWidth;
        canvas.height = superContainer.scrollHeight;
        canvas.style.overflow = 'visible';
        canvas.style.position = 'absolute';
        var context = canvas.getContext('2d');
        canvasContainer.appendChild(canvas);
        return context;
    }

    function getDomPath(el) {
        var stack = [];
        while (el.parentNode != null) {
            var sibCount = 0;
            var sibIndex = 0;
            for (var i = 0; i < el.parentNode.childNodes.length; i++) {
                var sib = el.parentNode.childNodes[i];
                if (sib.nodeName == el.nodeName) {
                    if (sib === el) {
                        sibIndex = sibCount;
                    }
                    sibCount++;
                }
            }
            if (el.hasAttribute('id') && el.id != '') {
                stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
            } else if (sibCount > 1) {
                stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
            } else {
                stack.unshift(el.nodeName.toLowerCase());
            }
            el = el.parentNode;
        }
        var pathComponents = stack.slice(1);
        return pathComponents.join(' > ');
    }

    function copyToClipboard(text) {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    function removeCanvas() {
        var canvasContainer = document.getElementById("extensionCanvasTemporary");
        if (canvasContainer) {
            canvasContainer.remove();
        }
    }

    function getElementUnderMouse(e) {
        var x = e.pageX - window.pageXOffset;
        var y = e.pageY - window.pageYOffset;
        var currentElement = document.elementFromPoint(x, y);
        return currentElement;
    }

	document.onclick = function(e) {
        var path = getDomPath(currentElementHovered);
        copyToClipboard(path);
        document.onclick = function(e) {}
        document.onmousemove = function(e) {}
        removeCanvas();
        var context = createCanvas();
        var rect = currentElementHovered.getBoundingClientRect();
        context.fillStyle = "rgba(0,255,0,0.5)";
        context.fillRect(rect.x, rect.y + document.documentElement.scrollTop, rect.width, rect.height);
        setTimeout(removeCanvas, 1000);
        console.log("Extension shut down."); 
    }

    document.onmousemove = function(e) {
        removeCanvas();
        var currentElement = getElementUnderMouse(e);        
        var rect = currentElement.getBoundingClientRect();
        var context = createCanvas();
        context.fillStyle = "rgba(255,0,0,0.5)";
        context.fillRect(rect.x, rect.y + document.documentElement.scrollTop, rect.width, rect.height);
        currentElementHovered = currentElement;
    }

})();