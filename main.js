 ;(function(){
    "use strict";
    
    let data = {
        el: document.getElementById('js-axel'),
        img: "sprite.png",
        a: 7,
        b: 4
    };

    let canvas = new CanvasBuilder(data);

    if (canvas.canvas.getContext) {
        canvas.render();
    }
 })();
