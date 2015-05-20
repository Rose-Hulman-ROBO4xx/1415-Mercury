var b = require('bonescript');
var exports = module.exports = {};

// Direction Pins
var FLdirect = 'P9_23'; // Front Left Motor
var FRdirect = 'P9_13'; // Front Right Motor
var RLdirect = 'P9_15'; // Rear Left Motor
var RRdirect = 'P9_11'; // Rear Right Motor

// PWM pins
var LPwm = 'P9_14';     // Left side motors PWM
var RPwm = 'P9_16';     // Right side motors PWM
var ArmPwm = 'P9_21';   // Arm servo PWM

// Set pin mode for digital pins (direction pins)
b.pinMode(FLdirect, b.OUTPUT);
b.pinMode(FRdirect, b.OUTPUT);
b.pinMode(RLdirect, b.OUTPUT);
b.pinMode(RRdirect, b.OUTPUT);

// Set pin mode for PWM pins
b.pinMode(LPwm, b.ANALOG_OUTPUT);
b.pinMode(RPwm, b.ANALOG_OUTPUT);
b.pinMode(ArmPwm, b.ANALOG_OUTPUT);


function setMotorSpeed(directId, pwmId, direction, speed){
    b.digitalWrite(directId, direction, function(x){
       b.analogWrite(pwmId, speed);
    });
}

function LmotorSpeed(speed, direction){
    setMotorSpeed(FLdirect, LPwm, direction, speed);
    setMotorSpeed(RLdirect, LPwm, direction, speed);
}

function RmotorSpeed(speed, direction){
    setMotorSpeed(FRdirect, RPwm, direction, speed);
    setMotorSpeed(RRdirect, RPwm, direction, speed);
}

function stopMotor( id){
    b.analogWrite(id, 0);
}

exports.stopMove = function(){
    stopMotor(LPwm);
    stopMotor(RPwm);

};
exports.forward = function(speed){
    LmotorSpeed(speed, 1);
    RmotorSpeed(speed, 1);
};
exports.reverse = function(speed){
    LmotorSpeed(speed, 0);
    RmotorSpeed(speed, 0);
};

exports.clockwise = function(speed){
    LmotorSpeed(speed, 1);
    RmotorSpeed(speed, 0);
};
exports.counterwise = function(speed){
    LmotorSpeed(speed, 0);
    RmotorSpeed(speed, 1);
};
exports.skid = function(leftSpeed, rightSpeed){
    var leftDirection = 1,
        rightDirection = 1;
    
    if(leftSpeed < 0){
        leftDirection = 0;
        leftSpeed = 0-(leftSpeed);
    }
    if(rightSpeed < 0){
        rightDirection = 0;
        rightSpeed = 0-(rightSpeed);
    }

    LmotorSpeed(leftSpeed,leftDirection);
    RmotorSpeed(rightSpeed,rightDirection);

};

exports.armSet = function(angle){
    
    var pwm = angleToDC(angle);
    var freq = 50.0;
    b.analogWrite(ArmPwm,pwm,freq);
}
exports.armOff = function(){
    b.analogWrite(ArmPwm,0,50);
}

function angleToDC(a){
    var p = 2600 - (a * 11.667);
    var d = ( p / 20000.0);
    console.log(p + ' ' + d);
    return d;
}