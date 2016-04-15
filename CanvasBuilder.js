;(function(){
    'use strict';

    class CanvasBuilder {
        constructor(options) {
            this.a = options.a;
            this.b = options.b;
            this.width = options.el.width;
            this.height = options.el.height;
            this.IMAGE = options.img || "sprite.png";
            this.canvas = options.el;
            this.ctx = this.canvas.getContext('2d');
            this.start_x = 36;
            this.start_y = this.height - 63;
            this.interval = 39;
            this.offset = 0;
            this.data = {inputX: [], inputY: []};
            this._initEvents();
        }

        drawImage() {
            let img = new Image();
            img.onload = () => this.ctx.drawImage(img, 0, this.height - 83);
            img.src = this.IMAGE;  
        }

        drawCurve(number) {
            this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#C74183';
            this.ctx.moveTo(this.start_x + this.offset, this.start_y);           
            let endPointX = this.start_x + this.interval * number + this.offset,
                centerPointX = (this.interval * number) / 2 + this.start_x + this.offset,
                ratioScale = (this.interval * number / 1.8),
                centerPointY = this.start_y - ratioScale;
            
            this.data.inputX.push(centerPointX);
            this.data.inputY.push(centerPointY + ratioScale / 2);

            this.ctx.quadraticCurveTo(
                centerPointX, 
                centerPointY, 
                endPointX, 
                this.start_y
            );

            let arrowSkew = 4,
                arrowLenght = 16;
            this.ctx.moveTo(endPointX - 1, this.start_y - 1);    
            this.ctx.lineTo(endPointX - arrowSkew, this.start_y - arrowLenght + arrowSkew);
            this.ctx.moveTo(endPointX - 1, this.start_y - 1);
            this.ctx.lineTo(endPointX - arrowLenght + arrowSkew, this.start_y - arrowSkew);
            this.ctx.stroke();

            this.offset = this.offset + this.interval * number;
        }

        drawInput(x, y, style) {
            let input = document.createElement("input");
            input.setAttribute("type", "text");
            input.classList.add("my_input");
            input.style.position = "absolute";       
            input.style.zIndex = "10";
            let wrapper = this.canvas.parentNode;
            wrapper.appendChild(input);
            input.style.top = y - input.clientHeight - 15 + "px";
            input.style.left = x - input.clientWidth / 2 + "px";

            if (style) {
                input.classList.add(style);
            }

            return input;
        }

        drawNumber(x, y , value) {
            let div = document.createElement("div");
            div.classList.add("number");
            div.innerHTML = value;
            let wrapper = this.canvas.parentNode;
            wrapper.appendChild(div);
            div.style.top = y - 35 + "px";
            div.style.left = x - 5 + "px";

        }

        drawQuestion() {
            let span = document.createElement("span");
            span.classList.add("question");
            // не помешал бы шаблонизатор, я знаю ;)
            span.innerHTML = 
                `<span class="numberA">${this.a}</span> + 
                <span class="numberB">${this.b}</span> = 
                <span class="question_mark">?</span>
                <input type="text" class="input_question hide">`;
            let wrapper = this.canvas.parentNode;
            wrapper.appendChild(span);
        }

        hide(el) {
            el.classList.add("hide");
        }

        show(el) {
            el.classList.remove("hide");
        }

        _logicForHideShowAB(e, number, selector) {
            let currentNumber = document.querySelector(selector);
            let pos = currentNumber.classList.contains("numberA") ? 0 : 1;
       
            if (e.target.value === "" + number) {
                this.hide(e.target);
                this.drawNumber(this.data.inputX[pos], this.data.inputY[pos], number);
                currentNumber.classList.remove("error2");

                if (currentNumber.classList.contains("numberA")) {
                    this.drawCurve(this.b);
                    this.drawInput(this.data.inputX[1], this.data.inputY[1], "inputB");
                } else {
                    let question_mark = document.querySelector(".question_mark");
                    let input_question = document.querySelector(".input_question");
                    this.hide(question_mark);
                    this.show(input_question);
                }

            } else {
                e.target.classList.add("error");
                currentNumber.classList.add("error2");
            }               
        }

        _logicForHideShowQuestion(e) {
            let input = document.querySelector(".input_question");

            if (e.target.value === this.a + this.b + "") {
                let mark = document.querySelector(".question_mark");
                mark.innerHTML = this.a + this.b;
                this.hide(input);
                this.show(mark);
            } else {
                input.classList.add("error");
            }
        }

        _initEvents() {
            let self = this;
            this.canvas.parentNode.addEventListener("input", this._onInput.bind(self));
        }

        _onInput(event) {
            if (event.target.classList.contains("inputA")) {
                this._logicForHideShowAB(event, this.a, ".numberA");
            }

            if (event.target.classList.contains("inputB")) {
                this._logicForHideShowAB(event, this.b, ".numberB");
            }

            if (event.target.classList.contains("input_question")) {
                this._logicForHideShowQuestion(event);
            }
            
        }

        render() {
            this.drawImage();

            window.onload = () => {
                this.drawQuestion();
                this.drawCurve(this.a);
                this.drawInput(this.data.inputX[0], this.data.inputY[0], "inputA");
                 
            }
        }
    }

    window.CanvasBuilder = CanvasBuilder;
})(); 
