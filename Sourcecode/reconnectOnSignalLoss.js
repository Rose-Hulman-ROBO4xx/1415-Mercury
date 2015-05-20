var ex = require('child_process');
var b = require('bonescript');
var dns = require('dns');
var connected = 1;
var wasConnected = 1;

var connectLED = 'P9_22';

b.pinMode(connectLED,b.OUTPUT);

function  checkConnection(){
	dns.lookup('google.com',function(err) {
	
    	if (err && err.code == "ENOTFOUND") {
    	        connected = 0;
    	}
		else{
				connected = 1;
		}
	});
}

monitorConnection();

console.log("Connected");
function monitorConnection () {
    checkConnection();
    if(!connected){
        if(wasConnected){
            wasConnected = 0;
            b.digitalWrite(connectLED,0);
            console.log("Lost Connection");
        }
        ex.exec('service wicd restart', console.log);
        setTimeout(function() {monitorConnection();}, 10000);
    } else{
        if(!wasConnected){
            wasConnected = 1;
            b.digitalWrite(connectLED,1);
            console.log("Connected");
        }
        setTimeout(function() {monitorConnection();}, 5000);
    }
}

