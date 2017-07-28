var canvas = document.getElementById('gameRegion');
var ctx = canvas.getContext('2d');
var intevalID;
var timeOutID;
var radian = 0;
var raf;
var rect;
var score;
var best_score = 0;
var level = 1;
var blackBallTime = 0;
var blackBallArray = [];

function drawRoundedRect(x, y, width, height, radius){//画圆角矩形函数
    ctx.beginPath();
    ctx.moveTo(x, y+radius);
    ctx.lineTo(x, y+height-radius);
    ctx.quadraticCurveTo(x, y+height, x+radius,y+height);
    ctx.lineTo(x+width-radius, y+height);
    ctx.quadraticCurveTo(x+width, y+height, x+width, y+height-radius);
    ctx.lineTo(x+width, y+radius);
    ctx.quadraticCurveTo(x+width, y ,x+width-radius, y);
    ctx.lineTo(x+radius, y);
    ctx.quadraticCurveTo(x, y, x, y+radius);
    ctx.stroke();
}

function drawLine(x1, y1, x2, y2){//画直线函数
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawGrid(n, x0, y0, width) {//画游戏栅格函数
    ctx.lineWidth = 3;
    let radius;
    if(n <= 3){
        radius = 30;
    }
    else{
        radius = 50;
    }
    drawRoundedRect(x0, y0, width, width, radius);
    ctx.lineWidth = 1;
    for (var i = 1; i < n; i++){
        drawLine(x0, y0+parseInt(i*width/n), x0+width, y0+parseInt(i*width/n));
        drawLine(x0+parseInt(i*width/n), y0, x0+parseInt(i*width/n), y0+width);
    }
}

function drawStartInterface() {//画开始界面底层
    document.getElementById("menuHref").className = "start";
    document.getElementById("score").className = "start";
    document.getElementById("stop").className = "start";
    document.getElementById("init_best").innerHTML = best_score;
    var lingrad = ctx.createLinearGradient(0, 0, 0, 711);
    lingrad.addColorStop(0, '#FF0066');
    lingrad.addColorStop(1, '#FFCC66');
    ctx.fillStyle = lingrad;
    ctx.fillRect(1, 1, 598, 710);    
}

function startGame() {//开始游戏
    document.getElementById("menuHref").className = "play";
    document.getElementById("score").className = "play";    
    document.getElementById("init").className = "play";
    document.getElementById("over").className = "hidden";
    document.getElementById("stop").className = "play";
    level = 1;
    newRect();
    blackBallArray.length = 0;
    whiteBall.setPos(level);
    draw();
    drawLevelTip();
    score = 0;
    document.getElementById("score").innerHTML = 0;
    canvas.focus();
}

function levelInitial(){//关卡初始化
    document.getElementById("init").className = "play";
    document.getElementById("stop").className = "play";
    draw();
    intervalID = setInterval(update, 10);
}

function backToMenu(){//从游戏界面或结束界面返回开始界面
    if(typeof(timeOutID) != "undefined"){
        clearTimeout(timeOutID);
    }
    document.getElementById("init").className = "start";
    document.getElementById("over").className = "hidden";
    document.getElementById("stop").className = "start";
    if(typeof(intervalID) != "undefined"){
        clearInterval(intervalID);
    }
    blackBallArray.length = 0;
    draw();    
}

function gameOver(){//游戏结束处理
    clearInterval(intervalID);
    document.getElementById("menuHref").className = "over";
    document.getElementById("score").className = "over";    
    document.getElementById("init").className = "over"; 
    document.getElementById("stop").className = "over";
    document.getElementById("over").className = "appear";
    var final_score = document.getElementById("final_score");
    var over_best = document.getElementById("over_best");
    if (score > best_score) {
        best_score = score;
        final_score.className = over_best.className = "new";
        over_best.innerHTML = best_score + "*";
    }
    else {
        final_score.className = over_best.className = "";
        over_best.innerHTML = best_score;
    }
    final_score.innerHTML = score;
    draw(); 
}

function gameStop(){//游戏暂停/恢复的处理
    var stop = document.getElementById("stop");
    if(stop.className == "play"){
        clearInterval(intervalID);
        stop.className = "stop";
        stop.innerHTML = '<a onclick="gameStop();">START</a>';
    }
    else if(stop.className == "stop"){
        intervalID = setInterval(update, 10);
        canvas.focus();
        stop.className = "play";
        stop.innerHTML = '<a onclick="gameStop();">STOP</a>';
    }
}

function drawGameInterface() {//画游戏界面底层，全局变量level为关卡数，不同关卡的画面也不同
    var lingrad = ctx.createLinearGradient(0, 0, 0, 711);
    if(level == 1){
        lingrad.addColorStop(0, '#FF0066');
        lingrad.addColorStop(1, '#FFCC66');
    }
    else if(level == 2){
        lingrad.addColorStop(0, '#00CC66');
        lingrad.addColorStop(0.8, '#00CC66');
        lingrad.addColorStop(1, '#CC9933');
    }
    else{
        lingrad.addColorStop(0, '#9999CC');
        lingrad.addColorStop(0.8, '#9999CC');
        lingrad.addColorStop(1, '#009966');
    }
    ctx.fillStyle = lingrad;
    ctx.fillRect(1, 1, 598, 710);

    ctx.strokeStyle = "white";
    if(level == 1){//第1关栅格规模：n = 4
        drawGrid(4, 174, 240, 250);
    }
    else{//第2、3关栅格规模：n = 3
        drawGrid(3, 200, 240, 188);
    }
}

function drawOverInterface() {//画结束界面
    ctx.fillStyle = "rgba(36, 36, 36, 0.4)";
    ctx.fillRect(1, 1, 598, 710);
}

function drawLevelTip() {//画关卡过渡界面
    document.getElementById("init").className = "change";
    document.getElementById("stop").className = "change";
    ctx.fillStyle = "yellow";
    ctx.fillRect(1, 265, 598, 100);
    ctx.font = "48px 'Cooper Black'";
    let str = "LEVEL  " + level;
    ctx.fillStyle = "black";
    ctx.fillText(str, 190, 330);
    timeOutID = setTimeout(levelInitial, 1500);
}

function levelChange(){//关卡切换处理
    clearInterval(intervalID);
    blackBallArray.length = 0;
    level++;
    newRect();
    whiteBall.setPos(level);
    draw();
    drawLevelTip();
}

var whiteBall = {//白棋对象
    radius: 23,
    color: "white",
    setPos: function(level) {//设定初始位置
        this.px = 2;
        this.py = 2;
        if(level == 1){
            this.x = 268;
            this.y = 334;
        }
        else{
            this.x = 294;
            this.y = 334;
        }
    },
    draw: function(){//绘制白棋
        if(this.px == rect.px && this.py == rect.py){
            score += 1;
            document.getElementById("score").innerHTML = score;
            if(score == 20 || score == 40){
                levelChange();
                return;
            }
            else{
                newRect();
            }
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function randomBy(under, over){//范围随机数
    return parseInt(Math.random() * (over - under + 1) + under);
}

const left = 0, right = 1, up = 2, down = 3;
function blackBall(){//黑棋构造函数
    this.radius = 25;
    this.outOfRegion = false;
    this.color = "black";
    this.direction = randomBy(0, 3);
    if (level == 1){
        switch (this.direction) {
            case left:
                this.px = -1;
                this.py = randomBy(1, 4);
                this.x = canvas.width + this.radius;
                this.y = 240 + 31 + 62.5*(this.py-1);
                break;
            case right:
                this.px = -1;
                this.py = randomBy(1, 4);
                this.x = -this.radius;
                this.y = 240 + 31 + 62.5*(this.py-1);
                break;
            case up:
                this.px = randomBy(1, 4);
                this.py = -1;
                this.x = 174 + 31 + 62.5*(this.px-1);
                this.y = canvas.height + this.radius;
                break;
            case down:
                this.px = randomBy(1, 4);
                this.py = -1;
                this.x = 174 + 31 + 62.5*(this.px-1);
                this.y = -this.radius;
                break;
            default:
                break;
        }
    }
    else{
        switch (this.direction) {
            case left:
                this.px = -1;
                this.py = randomBy(1, 3);
                this.x = canvas.width + this.radius;
                this.y = 240 + 31 + 62.5*(this.py-1);
                break;
            case right:
                this.px = -1;
                this.py = randomBy(1, 3);
                this.x = -this.radius;
                this.y = 240 + 31 + 62.5*(this.py-1);
                break;
            case up:
                this.px = randomBy(1, 3);
                this.py = -1;
                this.x = 200 + 31 + 62.5*(this.px-1);
                this.y = canvas.height + this.radius;
                break;
            case down:
                this.px = randomBy(1, 3);
                this.py = -1;
                this.x = 200 + 31 + 62.5*(this.px-1);
                this.y = -this.radius;
                break;
            default:
                break;
        }
    }
}

blackBall.prototype.draw = function(){//绘制黑棋
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
}

function rectStar(){//小方块构造
    this.width = 20;
    this.color = "darkblue";
}

rectStar.prototype.draw = function(){//绘制小方块
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.width);
}

rectStar.prototype.rotateDraw = function(radian){//绘制小方块，含旋转效果处理
    if(radian == 0 || radian == Math.PI * 2){
        rectStar.prototype.draw.call(this);
        return;
    }
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.width / 2);
    ctx.rotate(radian);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.width / 2, this.width, this.width);
    ctx.restore();
}

function newRect(){//小方块随机构造
    rect = new rectStar();
    radian = 0;
    if(level == 1){
        rect.px = randomBy(1, 4);
        rect.py = randomBy(1, 4);
        rect.x = 195 + 62.5*(rect.px - 1);
        rect.y = 261 + 62.5*(rect.py - 1);
    }
    else{
        rect.px = randomBy(1, 3);
        rect.py = randomBy(1, 3);
        rect.x = 222 + 62.5*(rect.px - 1);
        rect.y = 262 + 62.5*(rect.py - 1);
    }
}

function pointDistance(x1, y1, x2, y2){
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function isImpacted(ball){//判断黑棋ball是否与白棋相撞
    if(Math.abs(pointDistance(ball.x, ball.y, whiteBall.x, whiteBall.y))<=ball.radius + whiteBall.radius){
        return true;
    }
    else{
        return false;
    }
}

function update(){//黑棋生成、移动的定时处理
    if(radian == 0 || radian == Math.PI * 2){
        radian = Math.PI / 180;
    }
    else{
        radian += Math.PI / 180;
    }
    if((level < 3 && blackBallTime % 130 == 0) || (level == 3 && blackBallTime % 100 == 0)){
        //增加一个黑球
        let flag = true;
        let len = blackBallArray.length;
        for (let i = 0; i < len; i++) {
            if (blackBallArray[i].outOfRegion) {
                blackBallArray[i] = new blackBall();
                flag = false;
                break;
            }
        }
        if (flag) {
            blackBallArray.push(new blackBall());
        }
    }
    //黑球移动
    for (let ball of blackBallArray) {
        switch (ball.direction) {
            case left:
                if (ball.x <= -ball.radius) {
                    ball.outOfRegion = true;
                }
                else if(level < 3){
                    ball.x -= 3;
                }
                else{
                    ball.x -= 4;
                }
                break;
            case right:
                if (ball.x >= canvas.width + ball.radius) {
                    ball.outOfRegion = true;
                }
                else if(level < 3){
                    ball.x += 3;
                }
                else{
                    ball.x += 4;
                }
                break;
            case up:
                if (ball.y <= -ball.radius) {
                    ball.outOfRegion = true;
                }
                else if(level < 3){
                    ball.y -= 3;
                }
                else{
                    ball.y -= 4;
                }
                break;
            case down:
                if (ball.y >= canvas.height + ball.radius) {
                    ball.outOfRegion = true;
                }
                else if(level < 3){
                    ball.y += 3;
                }
                else{
                    ball.y += 4;
                }
                break;
            default:
                break;
        }
        if(isImpacted(ball)){
            gameOver();
            return;
        }
    }
    draw();
    blackBallTime++;
}

function throttle(fn, time = 100){//延时函数
    let timer;
    return function(...args){
        if(timer == null){
            fn.apply(this, args);
            timer = setTimeout(() => {
                timer = null;
            }, time)
        }
    }
}

function draw(){//界面绘制
    var state = document.getElementById("init").className;
    if(state == "start"){ 
        ctx.clearRect(0, 0, canvas.width, canvas.height);     
        drawStartInterface();
    }
    else if(state == "play"){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGameInterface();
        rect.rotateDraw(radian);
        whiteBall.draw();
        for (let ball of blackBallArray) {
            ball.draw();
        }
    }
    else{
        drawOverInterface()
    }
}

canvas.addEventListener('keyup', function(e){//白点移动及游戏暂停控制函数
    if(document.getElementById("init").className == "play"){
        var keyCode = e.which || e.keyCode;
        if(keyCode == 32){
            gameStop();
        }
        else if(document.getElementById("stop").className == "play"){
            if(level == 1){
                switch (keyCode) {
                    case 37:
                        if (whiteBall.x > 210){
                            whiteBall.x -= 62.5;
                            whiteBall.px--;
                        }
                        break;
                    case 38:
                        if (whiteBall.y > 275){
                            whiteBall.y -= 62.5;
                            whiteBall.py--;
                        }
                        break;
                    case 39:
                        if (whiteBall.x < 386){
                            whiteBall.x += 62.5;
                            whiteBall.px++;
                        }
                        break;
                    case 40:
                        if (whiteBall.y < 453){
                            whiteBall.y += 62.5;
                            whiteBall.py++;
                        }
                        break;
                    default:
                        break;
                }
            }
            else{
                switch (keyCode) {
                    case 37:
                        if (whiteBall.x > 240){
                            whiteBall.x -= 62.5;
                            whiteBall.px--;
                        }
                        break;
                    case 38:
                        if (whiteBall.y > 275){
                            whiteBall.y -= 62.5;
                            whiteBall.py--;
                        }
                        break;
                    case 39:
                        if (whiteBall.x < 350){
                            whiteBall.x += 62.5;
                            whiteBall.px++;
                        }
                        break;
                    case 40:
                        if (whiteBall.y < 385){
                            whiteBall.y += 62.5;
                            whiteBall.py++;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        draw();
    }
}, true);
