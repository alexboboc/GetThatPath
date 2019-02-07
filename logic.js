(function() {

    console.log("Extension GetThatPat injected.");
    var currentElementHovered;

    function createCanvas() {
        // Create div covering 100% of the page and place on top
        var canvasContainer = document.createElement('div');
        canvasContainer.id = "extensionCanvasTemporary";
        document.body.appendChild(canvasContainer);
        canvasContainer.style.position = "absolute";
        canvasContainer.style.left = "0px";
        canvasContainer.style.top = "0px";
        canvasContainer.style.width = "100%";
        canvasContainer.style.height = "100%";
        canvasContainer.style.zIndex = "100000";
        
        // Create canvas filling the whole div
        var superContainer = document.body;
        canvas = document.createElement("canvas");
        canvas.style.width = superContainer.scrollWidth + "px";
        canvas.style.height = superContainer.scrollHeight + "px";
        canvas.width = superContainer.scrollWidth;
        canvas.height = superContainer.scrollHeight;
        canvas.style.overflow = "visible";
        canvas.style.position = "absolute";
        var context = canvas.getContext("2d");
        canvasContainer.appendChild(canvas);
        
        // Return context to be able to draw on it
        return context;
    }

    function getDomPath(el) {
        // Inversely traverse the DOM tree starting at the given node, and log steps
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
        
        // Join all elements traversed into final path
        var pathComponents = stack.slice(1);
        return pathComponents.join(' > ');
    }

    function copyToClipboard(text) {
        // Place text into clipboard by temporarily generating an invisible textarea
        var el = document.createElement("textarea");
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
        // Delete canvas and its container
        var canvasContainer = document.getElementById("extensionCanvasTemporary");
        if (canvasContainer) {
            canvasContainer.remove();
        }
    }

    function getElementUnderMouse(e) {
        // Check the highest element being hovered
        var x = e.pageX - window.pageXOffset;
        var y = e.pageY - window.pageYOffset;
        var currentElement = document.elementFromPoint(x, y);
        return currentElement;
    }

    document.onmousemove = function(e) {
        // Delete canvas to be able to read hovered element
        removeCanvas();
        
        // Read hovered element and its bounding box
        var rect = currentElement.getBoundingClientRect();
        var currentElement = getElementUnderMouse(e);        
        
        // Create canvas and draw a red box over the hovered element
        var context = createCanvas();
        context.fillStyle = "rgba(255,0,0,0.5)";
        context.fillRect(rect.x, rect.y + document.documentElement.scrollTop, rect.width, rect.height);
        
        currentElementHovered = currentElement;
    }

	document.onclick = function(e) {
        // Compute path of the hovered element and save to clipboard
        var path = getDomPath(currentElementHovered);
        copyToClipboard(path);
        
        // Cleanup events and canvas
        document.onclick = function(e) {}
        document.onmousemove = function(e) {}
        removeCanvas();
        
        // Display green rectangle for 1 second as success feedback
        var context = createCanvas();
        var rect = currentElementHovered.getBoundingClientRect();
        context.fillStyle = "rgba(0,255,0,0.5)";
        context.fillRect(rect.x, rect.y + document.documentElement.scrollTop, rect.width, rect.height);
        setTimeout(removeCanvas, 1000);
        
        console.log("Extension shut down."); 
    }

})();