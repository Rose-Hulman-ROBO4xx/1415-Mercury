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


// sensor pins
var frontLIR = "P9_37", // Front Left IR
    frontRIR = "P9_38", // FFront Right IR
    leftIR = "P9_35", // Left IR
    rightIR = "P9_39", // Right IR
    rearIR = "P9_36", // Rear IR
    batteryVolt = "P9_33"; // Battery voltage

/*
functions:

    getLeftIR()
    getRightIR()
    getFrontIR()
    getRearIR()
    getVoltage()
*/

// Read the voltage on a pin
function read(pinId){
    return b.analogRead(pinId);
}
// Read value of a pin
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


// Get the value of a pin and calculate what that value means. Inches for IR sensors and battery voltage for the battery pin
module.exports = {
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
getVolt: function () {
    var val = getVoltage();
    return calcVoltage(val);
}
};

// Calculate the distance read by the IR sensors from the voltage read
function calcDistance(val){
    var factor = .9222;
    var expon = 1.0/.891;
    var tv = val;
    var temp = factor/tv;
    
    return Math.pow(temp,expon);
}

// Calculate the voltage of the Battery
function calcVoltage(val){

    var factor = 1.211*8.4;
    return factor * val;
}