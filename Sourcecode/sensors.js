var b = require('bonescript');
var fs = require('graceful-fs');
/*
functions
    calcDistance(val)
    calcVoltage(val);
x    getFront()
x    getRear()
x    getLeft()
x    getRight()
x    isFrontWall()
x    isRearWall()
x    isLeftWall()
x    isRightWall()
x    isBatteryGood()
*/


var frontLIR = "P9_37",
    frontRIR = "P9_38",
    leftIR = "P9_35",
    rightIR = "P9_39",
    rearIR = "P9_36",
    batteryVolt = "P9_33";

/*
functions:

    getLeftIR()
    getRightIR()
    getFrontIR()
    getRearIR()
    getVoltage()
*/
function read(pinId){
    return b.analogRead(pinId);
}

function getFrontLIR(){
    return read(frontLIR);
}
function getFrontRIR(){
    return read(frontRIR);
}
function getLeftIR(){
    return read(leftIR);
}
function getRightIR(){
    return read(rightIR);
}
function getRearIR(){
    return read(rearIR);
}
function getVoltage(){
    return read(batteryVolt);
}

module.exports = {
getFront: function(){
    var val = getFrontIR();
    return calcDistance(val);
},
getFrontLeft: function(){
    var val = getFrontLIR();
    return calcDistance(val);
},
getFrontRight: function(){
    var val = getFrontRIR();
    return calcDistance(val);
},
getLeft: function(){
    var val = getLeftIR();
    return calcDistance(val);
},
getRight: function(){
    var val = getRightIR();
    return calcDistance(val);
},
getRear: function(){
    var val = getRearIR();
    return calcDistance(val);
},
isFrontWall: function(){
    var val = getFront();
    if(val <= 5){
        return true;
    }
    else{
        return false;
    }
},
isRearWall: function(){
    var val = getRear();
    if(val <= 10){
        return true;
    }
    else{
        return false;
    }
},
isLeftWall: function(){
    var val = getLeft();
    if(val <= 3){
        return true;
    }
    else{
        return false;
    }
},
isRightWall: function(){
    var val = getRight();
    if(val <= 3){
        return true;
    }
    else{
        return false;
    }
},
    getVolt: function(){
    var val = getVoltage();
    return calcVoltage(val);
},
    isBatteryGood : function(){
    var val = getVolt();
    if(val > 7){
        return true;
    }
    else{
        return false;
    }
}
};


function calcDistance(val){
    var factor = .9222;
    var expon = 1.0/.891;
    var tv = val;
    var temp = factor/tv;
    
    return Math.pow(temp,expon);
}
function calcVoltage(val){

    var factor = 1.211*8.4;
    return factor * val;
}