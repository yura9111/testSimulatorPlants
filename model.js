/**
 * Created by Юра on 26.07.2017.
 */
const screenWidth = 80;
const screenHeight = 30;
const cellSize = 20;
const cellBorderWidth = 1;

var bombRadius = 5;

const renderTickInterval = 50;

const lineDeviation = {x:10, y:10};
const HEXValues = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];

function getRandValueFromArray(Ar){
    return Ar[Math.floor(Math.random() * Ar.length)];
}

function randomKey(obj) {
    var ret;
    var c = 0;
    for (var key in obj)
        if (Math.random() < 1/++c)
            ret = key;
    return ret;
}

function drawCell(g2dContext, x, y) {
    g2dContext.fillRect(x * (cellSize + cellBorderWidth), y * (cellSize + cellBorderWidth), cellSize, cellSize);
}

var game = {
    shouldRender: true,
    shouldRenderArrows: false,

    play: function(){
        this.interval = setInterval(function(){game.nextTurn()},renderTickInterval);
    },
    stop: function(){
        clearInterval(this.interval);
    },
    mousemove:function(e){
        var position = map.pxToCellCoordinate(this.getCursorPosition(e));

        document.getElementById('position').innerHTML = position;

        if(typeof (game.map[position]) !== "undefined"){
            document.getElementById('age').innerHTML = game.map[position].age + "/" + game.map[position].maxAge;
            document.getElementById('hp').innerHTML = game.map[position].hp + "/" + game.map[position].maxHP;
            document.getElementById('multiply').innerHTML = game.map[position].multiplyChance;
            document.getElementById('identity').innerHTML = game.map[position].identification;
            if (game.map[position].influence !== undefined) {
                document.getElementById('same').innerHTML = game.map[position].influence.same;
                document.getElementById('different').innerHTML = game.map[position].influence.different;
            }
        }
    },
    getCursorPosition: function(e){
        // Для браузера IE
        if (document.all)  {
            x = event.x + document.body.scrollLeft;
            y = event.y + document.body.scrollTop;
            // Для остальных браузеров
        } else {
            x = e.pageX; // Координата X курсора
            y = e.pageY; // Координата Y курсора
        }

        x -= this.ctx.canvas.offsetLeft;
        y -= this.ctx.canvas.offsetTop;
        return {x: x, y: y}
    },

    blowBomb: function(e) {
        console.log('BLOW');
        var cursorPosition = this.getCursorPosition(e);
        var x = map.pxToCellPosition(cursorPosition.x);
        var y = map.pxToCellPosition(cursorPosition.y);
        var radiusSquare = bombRadius*bombRadius;

        for ( var mapX = x - bombRadius; mapX <= x + bombRadius; mapX++ ) {
            if (mapX < 0) mapX = 0;
            if (mapX > screenWidth) break;
            for ( var mapY = y - bombRadius; mapY <= y + bombRadius; mapY++ ) {
                if (mapY < 0) mapY = 0;
                if (mapY > screenWidth) break;
                //add some circles to this square mad world
                if (((mapX - x)*(mapX - x) + (mapY - y)*(mapY - y)) < radiusSquare) {
                    map.kill(mapX + "," + mapY);
                }
            }
        }
    } ,

    init: function(){
        this.map = [];
        for (var x = 0; x < screenWidth; x++){
            for (var y = 0; y < screenHeight; y++){
                this.map[x + "," + y] = new c_plant(x + "," + y);
            }
        }
        this.nextTurn();
    },

    nextTurn: function(){
        var canvas = document.getElementById("canvas");
        canvas.width = screenWidth * (cellSize + cellBorderWidth);
        canvas.height = screenHeight * (cellSize + cellBorderWidth);

        var ctx = canvas.getContext('2d');
        this.ctx = ctx;
        var colorRed, colorGreen, colorBlue;
        var afterDraw = [];
        for (var x = 0; x < screenWidth; x++){
            for (var y = 0; y < screenHeight; y++){
                if (this.map[x + "," + y].identification !== 0){
                    var plant = this.map[x + "," + y];
                    // try{
                    //     var color = this.map[x + "," + y].getLifePercentage();
                    // }catch (e){
                    //     console.log(this.map[x + "," + y].identification);
                    //     console.log(x + "," + y);
                    //     console.log(e);
                    //     continue;
                    // }
                    //draw canvas
                    if (this.shouldRender){
                        // colorRed = Math.round(color/4);
                        // colorGreen = Math.round(color/4);
                        // colorBlue = Math.round(color/4);
                        // if (plant.influence.different < 0){
                        //     colorRed += Math.round(color/4);
                        // }else
                        // if (plant.influence.different > 0){
                        //     colorGreen += Math.round(color/4);
                        // }
                        // if (plant.influence.same < 0){
                        //     colorRed += Math.round(color/4);
                        // }else
                        // if (plant.influence.same > 0){
                        //     colorGreen += Math.round(color/4);
                        // }
                        // if (plant.influence.self < 0){
                        //     colorRed += Math.round(color/4);
                        // }else
                        // if (plant.influence.self > 0){
                        //     colorGreen += Math.round(color/4);
                        // }
                        // if (colorRed < 10)colorRed = "0"+colorRed;
                        // if (colorGreen < 10)colorGreen = "0"+colorGreen;
                        // if (colorBlue  < 10)colorBlue = "0"+colorBlue;
                        // console.log("#"+colorRed+""+colorGreen+""+colorBlue);
                        // ctx.fillStyle="#"+colorRed+""+colorGreen+""+colorBlue;
                        // ctx.strokeStyle = "#"+colorRed+""+colorGreen+""+colorBlue;
                        if(plant.identification !== 0){
                            ctx.fillStyle=plant.identification;
                        }
                        if (this.shouldRender) {
                            drawCell(ctx, x, y);
                            // ctx.fillStyle = "#FFFFFF";
                            //drawCell(ctx, x, y);
                            if (this.shouldRenderArrows) {
                                afterDraw.push(plant.position);
                            }
                        }

                        // ctx.beginPath();
                        // ctx.arc(cellSize + x + x*cellSize,cellSize + y + y*cellSize,cellSize/2 - cellBorderWidth,0,2*Math.PI);
                        // ctx.fill();
                        // ctx.stroke();
                        // ctx.closePath();
                    }
                    this.map[x+","+y].onNextTurn();

                }else{

                }
            }
        }
        for(var x in afterDraw){
            this.map[ afterDraw[x] ].renderActions();
        }


    },
    renderArrow: function(color, fromPosition, toPosition){
        var ctx = this.ctx;
        // ctx.fillStyle = color;
        var fromRect = map.getRectPx(fromPosition);
        var toRect = map.getRectPx(toPosition);
        var line = {x: (fromRect.x + fromRect.x2) / 2, y: (fromRect.y + fromRect.y2) / 2, x2: (toRect.x + toRect.x2) / 2, y2: (toRect.y + toRect.y2) / 2};
        //decide if arrow higher or lower
        if(fromRect.x <= toRect.x){
            //higher
            line.y += lineDeviation.y;
            if(toRect.y < toRect.y){
                //left
                line.x -= lineDeviation.x;
            }else{
                //right
                line.x += lineDeviation.x;
            }
        }else{
            //lower
            line.y -= lineDeviation.y;
        }

        var headlen = 10;   // length of head in pixels
        var angle = Math.atan2(line.y2-line.y,line.x2-line.x);
        // ctx.fillStyle = ""
        ctx.beginPath();
        ctx.lineWidth=1;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x2, line.y2);
        ctx.lineTo(line.x2-headlen*Math.cos(angle-Math.PI/6),line.y2-headlen*Math.sin(angle-Math.PI/6));
        ctx.moveTo(line.x2, line.y2);
        ctx.lineTo(line.x2-headlen*Math.cos(angle+Math.PI/6),line.y2-headlen*Math.sin(angle+Math.PI/6));
        ctx.stroke();

    }
}
map = {
    cachedAdjust: [],
    kill: function(position){
        game.map[position] = new c_empty(position);
    },
    getRectPx: function(position){
        var xy = position.split(",");
        var x = xy[0] * (cellBorderWidth + cellSize);
        var y = xy[1] * (cellBorderWidth + cellSize);
        var x2 = x + cellSize;
        var y2 = y + cellSize;
        return {x:x,y:y,x2:x2,y2:y2};
    },
    pxToCellCoordinate: function(point) {
        return this.pxToCellPosition(point.x) + "," + this.pxToCellPosition(point.y);
    },
    pxToCellPosition: function(coordinate){
        return Math.floor(coordinate / (cellSize + cellBorderWidth));
    },
    // cacheAdjust: function(){
    //     for (var x=0;x<10;x++){
    //         for (var y=0;y<10;y++){
    //             this.cacheAdjust2(x+","+y);
    //         }
    //     }
    // },
    // getAdjust: function(position){
    //     var ret = [];
    //     for (var x in this.cachedAdjust[position]){
    //         if (typeof(this.cachedAdjust[position][x])!="undefined"){
    //             ret.push(this.cachedAdjust[position][x]);
    //         }
    //     }
    //     return ret;
    // },
    // cacheAdjust2: function(position){
    //     var xy = position.split(",");
    //     var x2 = xy[0];
    //     var y2 = xy[1];
    //     var ret = [];
    //     for (var x=x2-1;x<=x2+1;x++){
    //         for (var y=y2-1;y<=y2+1;y++){
    //             // if (typeof(game.map[x+","+y])!="undefined"){
    //                 ret.push(game.map[x+","+y]);
    //             // }
    //         }
    //     }
    //     cachedAdjust[position] = ret;
    // },
    getAdjust: function(xy){
        var x2 = xy[0]*1+1;
        var y2 = xy[1]*1+1;
        var x = x2-2;
        var y0 = y2-2;
        if(x2 > screenWidth - 1)x2 = screenWidth - 1;
        if(y2 > screenHeight - 1)y2 = screenHeight - 1;
        if(x < 0)x = 0;
        if(y0 < 0)y0 = 0;
        var ret = [];
        for (x; x <= x2; x++){
            for (var y = y0; y <= y2; y++){
                // if (typeof(game.map[x+","+y]) == "undefined")continue;
                ret.push(game.map[x+","+y]);
            }
        }
        return ret;
    },
    getAdjustFree: function(xy){
        var x2 = xy[0]*1+1;
        var y2 = xy[1]*1+1;
        var x= x2-2;
        var y0 = y2-2;
        if(x2 > screenWidth - 1)x2 = screenWidth - 1;
        if(y2 > screenHeight - 1)y2 = screenHeight - 1;
        if(x < 0)x = 0;
        if(y0 < 0)y0 = 0;
        var ret = [];
        for (x; x <= x2; x++){
            for (var y = y0; y <= y2; y++){
                if (game.map[x+","+y].identification === 0){
                    ret.push(x+","+y);
                }
            }
        }
        return ret;
    }
}
function c_empty(position){
    this.identification = 0;
    this.position = position;
    var xy = position.split(",");
    var x = xy[0];
    var y = xy[1];
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "#FFFFFF";
    drawCell(ctx, x, y);
    this.renderActions = function(){};
}
/**
 *
 * @param position
 * @param c_plant originalPlant
 */
function c_plant(position, originalPlant){
    if (typeof(originalPlant) == "undefined"){
        this.maxHP = 2;
        this.hp = _.random(1, this.maxHP);
        this.maxAge = 5;
        this.age = _.random(1, this.maxAge);
        this.position = position;
        this.xy = position.split(',');
        this.identification = "#666";
        this.multiplyChance = 20;
        this.influence = {
            different: 0,
            self: 0,
            same: 0
        };
    }else{

        function getRandomChange() {
            return Math.round(_.random(-53, 52) / 100);
        }

        var change = 0;
        var idPlus = 0;
        change = getRandomChange();
        if (change != 0) idPlus = 1;
        this.maxHP = originalPlant.maxHP + change;
        this.hp = this.maxHP;

        change = getRandomChange();
        if (change != 0) idPlus = 1;
        this.maxAge = originalPlant.maxAge + change;
        this.age = 0;

        this.position = position;
        this.xy = position.split(',');
        this.multiplyChance = originalPlant.multiplyChance + getRandomChange();
        this.influence = {};

        change = getRandomChange();
        if (change != 0) idPlus = 1;
        this.influence.different = originalPlant.influence.different + change;


        change = getRandomChange();
        if (change != 0) idPlus =1;
        this.influence.self = originalPlant.influence.self + change;


        change = getRandomChange();
        if (change != 0) idPlus =1;
        this.influence.same = originalPlant.influence.same + change;

        if (idPlus > 0){
            this.identification = "#"+getRandValueFromArray(HEXValues)+getRandValueFromArray(HEXValues)+getRandValueFromArray(HEXValues)+getRandValueFromArray(HEXValues)+getRandValueFromArray(HEXValues)+getRandValueFromArray(HEXValues);
            //TODO check performance
            //this.identification = '#'+Math.random().toString(16).substr(-6);

        }else{
            this.identification = originalPlant.identification;
        }

    }
    this.addHP = function(val, from){
        this.hp += val;
        if(this.hp > this.maxHP){
            this.hp = this.maxHP;
        }
        if (val < 0){
            from.hp -= val;
        }
        if (this.hp < 1){
            this.die();
            return true;
        }
    },
    this.draw = function(){

    },
    this.die = function(){
        map.kill(this.position);
    },
    this.getLifePercentage = function(){
        // return Math.min(Math.round((this.hp / this.maxHP) * 100), Math.round((this.maxAge - this.age) * 100));
        return Math.round(((this.maxAge - this.age))*20);
    },
    this.getAdjust = function(){
        return map.getAdjust(this.xy);
    },
    this.getAdjustFree = function(){
        return map.getAdjustFree(this.xy);
    },
    this.onNextTurn = function(){
        this.age++;
        if (this.age == 1){
            return;//when just born do nothing
        }
        var selfIdentification = this.identification;
        for (var x in this.influence){
            var val = this.influence[x];
            if (x == 'different'){
                _.invoke(_.filter(this.getAdjust(), function(obj){if(typeof(obj)=="undefined")debugger;return obj.identification != selfIdentification}), "addHP", val, this);
            }
            if (x == 'self'){
                if (this.addHP(val, this) === true)return;
            }
            if (x == 'same'){
                _.invoke(_.where(this.getAdjust(), {identification: this.identification}), "addHP", val, this);
            }
        }
        if (_.random(0, 100) < this.multiplyChance){
            var free = this.getAdjustFree();

            if (free.length > 0 ){
                this.hp -= Math.floor(this.hp/2);
                // console.log(free);
                free = free[randomKey(free)];
                // console.log(free);
                // free = free.pop();
                game.map[free] = new c_plant(free, this);
            }
        }
        if (this.age > this.maxAge){
            this.die();
        }
    },
    this.renderActions = function(){
        var selfIdentification = this.identification;
        for (var x in this.influence){
            var val = this.influence[x];
            if (x == 'different' && val != 0 ){
                _.each(
                    _.filter(
                        this.getAdjust(),
                        function(obj){
                            return obj.identification != selfIdentification
                        }
                    ),
                    function(plant){
                        var self = plant;
                        return function(plant, val){
                            var color = val > 0 ? "#00FF00": "#FF0000" ;
                            game.renderArrow(color, self.position, plant.position);
                        }
                    }(this, val)
                );
            }
            // if (x == 'self'){
            //     if (this.addHP(val, this) === true)return;
            // }
            // if (x == 'same'){
            //     _.each(_.where(this.getAdjust(), {identification: this.identification}), function (plant) {
            //         var self = plant;
            //         return function (plant, val) {
            //             var color = val > 0 ? "green" : "red";
            //             game.renderArrow(color, self.position, plant.position);
            //         }
            //     }(this, val));
            // }
        }
    }
}
//test rnd
var plus = 0;
var minus = 0;
for (var i = 0; i < 1000; i++){
    var rnd = Math.round(_.random(-52, 52) / 100);
    if (rnd > 0) plus++;
    if (rnd < 0) minus++;
}
console.log(minus,plus);