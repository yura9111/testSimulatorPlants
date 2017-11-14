/**
 * Created by Юра on 26.07.2017.
 */
const screenWidth = 100;
const screenHeight = 100;
const cellSize = 15;
var cellBorderWidth = 1;
const renderActions = 1;

function randomKey(obj) {
    var ret;
    var c = 0;
    for (var key in obj)
        if (Math.random() < 1/++c)
            ret = key;
    return ret;
}

var game = {
    shouldRender: true,

    play: function(){
        this.interval = setInterval(function(){game.nextTurn()},50);
    },
    stop: function(){
        clearInterval(this.interval);
    },
    mousemove:function(e){
        // Для браузера IE
        if (document.all)  {
            x = event.x + document.body.scrollLeft;
            y = event.y + document.body.scrollTop;
            // Для остальных браузеров
        } else {
            x = e.pageX; // Координата X курсора
            y = e.pageY; // Координата Y курсора
        }

        var x = x / screenWidth;
        var y = y / screenHeight;

    },

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
        canvas.width = (screenWidth * cellSize) + (screenWidth * cellBorderWidth);
        canvas.height = (screenHeight * cellSize) + (screenHeight * cellBorderWidth);

        var ctx = canvas.getContext('2d');
        var colorRed, colorGreen, colorBlue;
        for (var x = 0; x < screenWidth; x++){
            for (var y = 0; y < screenHeight; y++){
                if (this.map[x + "," + y].identification !== 0){
                    var plant = this.map[x + "," + y];
                    try{
                        var color = this.map[x + "," + y].getLifePercentage();
                    }catch (e){
                        console.log(this.map[x + "," + y].identification);
                        console.log(x + "," + y);
                        console.log(e);
                        continue;
                    }
                    //draw canvas
                    if (this.shouldRender){
                        colorRed = Math.round(color/4);
                        colorGreen = Math.round(color/4);
                        colorBlue = Math.round(color/4);
                        if (plant.influence.different < 0){
                            colorRed += Math.round(color/4);
                        }else
                        if (plant.influence.different > 0){
                            colorGreen += Math.round(color/4);
                        }
                        if (plant.influence.same < 0){
                            colorRed += Math.round(color/4);
                        }else
                        if (plant.influence.same > 0){
                            colorGreen += Math.round(color/4);
                        }
                        if (plant.influence.self < 0){
                            colorRed += Math.round(color/4);
                        }else
                        if (plant.influence.self > 0){
                            colorGreen += Math.round(color/4);
                        }
                        if (colorRed < 10)colorRed = "0"+colorRed;
                        if (colorGreen < 10)colorGreen = "0"+colorGreen;
                        if (colorBlue  < 10)colorBlue = "0"+colorBlue;
                        // console.log("#"+colorRed+""+colorGreen+""+colorBlue);
                        ctx.fillStyle="#"+colorRed+""+colorGreen+""+colorBlue;
                        ctx.fillRect(x + x*cellSize,y + y*cellSize,cellSize,cellSize);

                        // ctx.beginPath();
                        // ctx.arc(cellSize + x + x*cellSize,cellSize + y + y*cellSize,cellSize/2 - cellBorderWidth,0,2*Math.PI);
                        // ctx.fill();
                        // ctx.stroke();
                        // ctx.closePath();
                    }
                    this.map[x+","+y].onNextTurn();

                }else{
                    if (this.shouldRender) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect(x * (cellBorderWidth + cellSize), y * (cellBorderWidth + cellSize), cellSize, cellSize);
                        if(renderActions){
                            // plant.renderActions(ctx);
                        }
                    }
                }
            }
        }


    }
}
map = {
    cachedAdjust: [],
    kill: function(position){
        game.map[position] = new c_empty(position);
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
    getAdjust: function(position){
        var xy = position.split(",");
        var x2 = xy[0]*1+1;
        var y2 = xy[1]*1+1;
        var x= x2-2;
        var y = y2-2;
        if(x2 > screenWidth)x2 = screenWidth;
        if(y2 > screenHeight - 1)y2 = screenHeight - 1;
        if(x < 0)x = 0;
        if(y < 0)y = 0;
        var ret = [];
        for (x; x <= x2; x++){
            for (y; y <= y2; y++){
                // if (typeof(game.map[x+","+y]) == "undefined")continue;
                ret.push(game.map[x+","+y]);
            }
        }
        return ret;
    },
    getAdjustFree: function(position){
        var xy = position.split(",");
        var x2 = xy[0]*1+1;
        var y2 = xy[1]*1+1;
        var x= x2-2;
        var y = y2-2;
        if(x2 > screenWidth)x2 = screenWidth;
        if(y2 > screenHeight - 1)y2 = screenHeight - 1;
        if(x < 0)x = 0;
        if(y < 0)y = 0;
        var ret = [];
        for (x; x <= x2; x++){
            for (y; y <= y2; y++){
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
    var xy = position.split(",");
    var x = xy[0];
    var y = xy[1];
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x + x * cellSize, y + y * cellSize, cellSize, cellSize);
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
        this.identification = 1;
        this.multiplyChance = 50;
        this.influence = {
            different: 0,
            self: 0,
            same: 0
        };
    }else{
        var change = 0;
        var idPlus = 0;
        change = Math.round(_.random(-53, 52) / 100);
        if (change != 0)idPlus =1;
        this.maxHP = originalPlant.maxHP + change;
        this.hp = this.maxHP;

        change = Math.round(_.random(-53, 52) / 100);
        if (change != 0)idPlus =1;
        this.maxAge = originalPlant.maxAge + change;
        this.age = 0;

        this.position = position;
        // this.multiplyChance = originalPlant.multiplyChance + Math.round(_.random(-53, 52) / 100);
        this.influence = {};

        change = Math.round(_.random(-53, 52) / 100);
        if (change != 0)idPlus =1;
        this.influence.different = originalPlant.influence.different + change;


        change = Math.round(_.random(-53, 52) / 100);
        if (change != 0)idPlus =1;
        this.influence.self = originalPlant.influence.self + change;


        change = Math.round(_.random(-53, 52) / 100);
        if (change != 0)idPlus =1;
        this.influence.same = originalPlant.influence.same + change;

        if (idPlus > 0){
            this.identification = _.random(-10000, 10000);
        }else{
            this.identification = originalPlant.identification;
        }

    }
    this.addHP = function(val, from){
        this.hp += val;
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
            return map.getAdjust(this.position);
        },
        this.getAdjustFree = function(){
            return map.getAdjustFree(this.position);
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
                    _.invoke(_.filter(this.getAdjust(), function(obj){return obj.identification != selfIdentification}), "addHP", val, this);
                }
                if (x == 'self'){
                    if (this.addHP(val, this) === true)return;
                }
                if (x == 'same'){
                    _.invoke(_.where(this.getAdjust(), {identification: this.identification}), "addHP", val, this);
                }
            }
            // if (_.random(0, 100) < this.multiplyChance){
            var free = this.getAdjustFree();

            if (free.length > 0 ){
                // console.log(free);
                free = free[randomKey(free)];
                // console.log(free);
                // free = free.pop();
                game.map[free] = new c_plant(free, this);
            }
            // }
            if (this.age > this.maxAge){
                this.die();
            }
        },
        this.renderActions = function(ctx){
            var selfIdentification = this.identification;
            for (var x in this.influence){
                var val = this.influence[x];
                if (x == 'different'){
                    _.each(
                        _.filter(
                            this.getAdjust(),
                            function(obj){
                                return obj.identification != selfIdentification
                            }
                        ),
                        function(){
                            //pick color
                            // ctx.fillStyle = "#FFFFFF";
                            // ctx.beginPath();
                            // ctx.moveTo(0,0);
                            // ctx.lineTo(300,150);
                            // ctx.stroke();
                        }
                    );
                }
                if (x == 'self'){
                    if (this.addHP(val, this) === true)return;
                }
                if (x == 'same'){
                    _.invoke(_.where(this.getAdjust(), {identification: this.identification}), "addHP", val, this);
                }
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