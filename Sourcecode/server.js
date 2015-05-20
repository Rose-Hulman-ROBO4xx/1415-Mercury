// from http://codehenge.net/blog/2011/12/getting-started-with-node-js-and-socket-io-v0-7-part-2/
var sensors = require('./sensors.js');
var motion = require('./motors.js');
var b = require('bonescript');

var express = require('express');
var app = express();
var exec = require('child_process').exec;
var proc;

var path = require('path');
var fs = require('graceful-fs');

var http = require('http')
, url = require('url')
, fs = require('fs')
, usrs = 0
, server = http.Server(app);

var state = 'STOP';
var paused = 0;

var isConnected = 0,
    connection = 0;

var multi = 1;

app.use('/', express.static(path.join(__dirname, 'stream')));
 
 
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/control.html');
  console.log('serving webpage');
});
 

send404 = function(res) {
  res.writeHead(404);
  res.write('404');
  res.end();
};


server.listen(9091, function() {
  console.log('listening on *:9091');
});

// socket.io, I choose you 
var io = require('socket.io').listen(server);

// on a 'connection' event 

io.set('heartbeat interval',1000);
io.set('heartbeat timeout',5000);

io.sockets.on('connection', function(socket) {
  
  usrs ++;
  
  io.sockets.emit('userId',usrs);
  console.log("Connection " + socket.id + " accepted.");
  console.log("User : " + usrs);
  
  // now that we have our connected 'socket' object, we can 
  // define its event handlers 
  socket.on('message', function(message) { 
    console.log("Received message: " + message + " - from client "  + socket.id); 
  });

  socket.on('disconnect', function() { 
    usrs --;
    console.log("Connection " + socket.id + " terminated."); 
    
    motion.stopMove();
    console.log("Stopping");
    state = 'STOP';
    io.sockets.emit('userDc',usrs);
    clearInterval(stimer);
  });
  
  
  
  
  var stimer = setInterval(function(){
      var frontL = sensors.getFrontLeft().toFixed(2);
      var frontR = sensors.getFrontRight().toFixed(2);
      var left = sensors.getLeft().toFixed(2);
      var right = sensors.getRight().toFixed(2);
      var rear = sensors.getRear().toFixed(2);
      var battery = sensors.getVolt().toFixed(2);
      var leftM = leftSpeed;
      var rightM = rightSpeed;
    //   console.log("front: "+ front +"\nleft: "+left+"\nright: "+right+"\nbattery: "+battery);
      io.sockets.emit('sensors',{frontLS: frontL, frontRS: frontR, leftS: left, rightS: right, rearS: rear, volt: battery, leftMotor: leftM, rightMotor: rightM});
  },
  1000);
  // Manual controls

    socket.on('forward', function(){
      
      if(!paused && state == 'MANUAL'){
        motion.forward(.5 * multi);
        console.log("Moving forward");
      }
    });
    socket.on('left', function(){
        if(!paused && state == 'MANUAL'){
            console.log("Rotating counterclockwise");
            motion.counterwise(.5 * multi);
        }
    });
  
    socket.on('right', function(){
        if(!paused && state == 'MANUAL'){
            console.log("Rotating clockwise");
            motion.clockwise(.5 * multi);
        }
    });
    socket.on('reverse', function(){
        if(!paused && state == 'MANUAL'){
            console.log("Moving backward");
            motion.reverse(.5 * multi);
        }
    });
    
    socket.on('pause',function(){
      console.log("pausing");
      paused = 1;
      motion.stopMove(); 
      setTimeout(function(){paused = 0;},100);
      
    });
  
    socket.on('stop', function(){
        console.log("stoping");
        state = 'STOP';
    });
  // Step controls
    socket.on('stepForward',function(){
      if(!paused && state == 'MANUAL'){
        console.log("Stepping forward");
        paused = 1;
        motion.forward(.5 * multi);
        setTimeout(function(){
          motion.stopMove();
          paused = 0;
        },100);
      }
    });
    
    socket.on('stepBackward',function(){
      if(!paused && state == 'MANUAL'){
        console.log("Stepping Backward");
        paused = 1;
        motion.reverse(.5 * multi);
        setTimeout(function(){
          motion.stopMove();
          paused = 0;
        },100);
      }
    });
    
    socket.on('stepClockwise',function(){
      if(!paused && state == 'MANUAL'){
        console.log("Stepping clockwise");
        paused = 1;
        motion.clockwise(.5 * multi);
        setTimeout(function(){
          motion.stopMove();
          paused = 0;
        },100);
      }
    });
    
    socket.on('stepCounterwise',function(){
      if(!paused && state == 'MANUAL'){
        console.log("Stepping Counterclockwise");
        paused = 1;
        motion.counterwise(.5 * multi);
        setTimeout(function(){
          motion.stopMove();
          paused = 0;
        },100);
      }
    });
    
    socket.on('rotate180cw',function(){
      if(!paused && state == 'MANUAL'){
        console.log("Rotating 180 cw");
        paused = 1;
        motion.clockwise(.5);
        setTimeout(function(){
          motion.stopMove();
          paused = 0;
        },2525);
      }
    });
    
    socket.on('rotate180ccw',function(){
      if(!paused && state == 'MANUAL'){
        console.log("Rotating 180 ccw");
        paused = 1;
        motion.counterwise(.5);
        setTimeout(function(){
          motion.stopMove();
          paused = 0;
        },2525);
      }
    });
    
    
    
  
  // Autonomy controls
  
  socket.on('startAuto', function(){
      console.log("Starting autonomous control");
      state = 'AUTO';
      
  });
  socket.on('stopAuto', function(){
      console.log("Stopping autonomous control");
      state = 'STOP';
  });
  socket.on('startManual',function(){
      console.log("Switching to manual control");
      state = 'MANUAL';
  });
  
  
  socket.on('setArmAngle',function(angle){
    console.log("moving arm to " + angle);
    motion.armSet(angle);
  });
  
  socket.on('setSpeed', function(speed){
    console.log("updating speed to " + speed);
    multi = speed;
  });
  
  socket.on('updateMaxD',function(newMaxD){
    console.log("updating maxD to " + newMaxD);
    maxD = newMaxD;
    kp = (1.0)/(2*maxD);
    console.log("updating kp to " + kp);
  });
  
  socket.on('updateAddD',function(newAddD){
    console.log("updating addD to " + newAddD);
    addD = newAddD;
  });
  
  socket.on('updateMinD',function(newMinD){
    console.log("updating minD to " + newMinD);
    minD = newMinD;
  });
  
  socket.on('updateMinF',function(newMinF){
    console.log("updating minF to " + newMinF);
    minF = newMinF;
  });
  
  socket.on('updateMinD',function(newMod){
    console.log("updating mod to " + newMod);
    mod = newMod;
  });
  
  socket.on('updateKi',function(newKi){
    console.log("updating mod to " + newKi);
    ki = cons * newKi;
  });
  
  socket.on('updateKd',function(newKd){
    console.log("updating mod to " + newKd);
    kd = cons * newKd;
  });
  
});

var left,
    right,
    
    error,
    
    turn,
    
    kp,
    ki,
    kd,
    
    leftSpeed,
    rightSpeed,
    
    runT,
    runS,
    cycleTime,
    
    dT,
    
    addD,
    
    avg,
    minD,
    minF,
    
    mod,
    
    intF,
    diff,
    last,
    
    cons,
    
    maxD;
    
cycleTime = 50;
    
function init(){
    runT = 0;
    runS = 0;
    leftSpeed = 0;
    rightSpeed = 0;

    turn = 0;
    error = 0;
    maxD = 15;
    
    cons = (1.0)/(2*maxD)
    
    kp = 1 * cons;
    ki = 0 * cons;
    kd = (.075) * cons;
    minD = 3.7;
    minF = 7;
    mod = 4;
    addD = 5;
    
    intF = 0;
    diff = 0;
    last = 0;
    
    avg = kp * maxD;
}

init();

function auto(){
          
    // Get sensor values
    left = sensors.getLeft();
    right = sensors.getRight();
    
    frontLeft = sensors.getFrontLeft();
    frontRight = sensors.getFrontRight();
    
    // Adjust for front sensors
    if(frontLeft > maxD){
        frontLeft = maxD;
    }
    if(frontRight > maxD){
        frontRight = maxD;
    }
    
    // Adjust for sensor limits
    if(left <= minD){
      right +=addD;
    }
    if(right <= minD){
      left +=addD;
    }
    
    // Keep sensor values bounded so that the PWM values are less than 1
    if(left > maxD){
        left = maxD;
    }
    if(right > maxD){
        right = maxD;
    }
    
    if(frontLeft > minF){
      left += mod;
    }
    
    if(frontRight > minF){
      right += mod;
    }

    // calculate error value
    error = left - right;
    
    // update integral value
    intF += error;
    
    // update derivative value
    diff = error + last;
    last = error;
    
    // update Turn value
    turnP = kp * error;
    turnI = ki * intF;
    turnD = kd * diff;
    

    turn = turnP + turnI + turnD;
    
    
    // console.log("Turn : " + turn);
    
    // calculate PWM values for each motor
    leftSpeed = avg - turn;
    rightSpeed = avg + turn;
    
    // keep pwm values less than 1
    if(leftSpeed >=1){
      leftSpeed = .9;
    }
    if(rightSpeed >=1){
      rightSpeed = .9;
    }
    
    // update motors
    motion.skid(leftSpeed ,rightSpeed );
        
}

function main(){
    /*
    STATE
        STOP:     no action or stop previous action
        
        MANUAL:     take manual control input
        
        AUTO:       Autonomous control
        
    */

    if(state == 'STOP'){
        paused = 1;
        motion.stopMove();
    }
    else if(state =='MANUAL'){
        paused = 0;
    }
    else if(state =='AUTO'){
        paused = 0;
        auto();
    }
}

var mainLoop = setInterval(function(){
    main();
},cycleTime);

