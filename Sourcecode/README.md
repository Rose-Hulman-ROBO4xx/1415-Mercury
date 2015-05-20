README

Mercury Remote Robotics 2015

required installations:

socket.io
bonescript
express

Server.js:

	Contains html-server and control logic for the bone

	run with: node server.js

control.hml:

	the webpage


sensors.js:

	sensor module used by server.js . change pins as needed

motors.js:

	motors module used by server.js . change pins as needed

reconnectOnSignalLoss.js

	restarts wicd when it loses signal for a set period of time

	run with: node reconnectOnSignalLoss.js


MJPG-streamer

	This is the video streaming server

	run with: ./mjpg_streamer -i "./input_uvc.so -d /dev/video0" -o "./output_http.so -w ./www -p <port>"
