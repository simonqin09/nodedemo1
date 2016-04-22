/**
 Node.js GPIO. Handles GPIO configuration and access.
 
 This app is a demo example of how to use Node.js to access 
 and control the Toradex Colibri VF61 GPIO.
 */

/* Modules */
var fs = require('fs'); //module to handle the file system
//var debug = require('debug')('myserver'); //debug module
var debug = require('debug');

/* VF61 GPIO pins */
const	SW5 = '63', // PTD31, 106(SODIMM)
	SW6 = '89', // PTD10, 135(SODIMM)
        LED1 = '88', // PTD9, 133(SODIMM)
	LED2 = '68'; // PTD26, 127(SODIMM)
	
/* Constants */
const HIGH = 1, LOW = 0;

//starting app
debug('Starting VF61 GPIO control'); //Hello message

setImmediate(function cfgOurPins(){
	cfGPIO(LED1, 'out'); //call cfGPIO to configure pins
	cfGPIO(LED2, 'out');
	cfGPIO(SW5, 'in');
	cfGPIO(SW6, 'in');
	setInterval(copySwToLed, 50); //poll the GPIO and copy switches status to LEDs
});

function cfGPIO(pin, direction){
/*---------- export pin if not exported and configure the pin direction -----------*/
        fs.access('/sys/class/gpio/gpio' + pin, fs.F_OK, function(err){//test if current GPIO file exist
                if(err){ //if GPIO isn't exported, do it
                        debug('exporting GPIO' + pin);
                        fs.writeFileSync('/sys/class/gpio/export', pin);//export pin
                }
                debug('Configuring GPIO' + pin + ' as ' + direction);
                fs.writeFileSync('/sys/class/gpio/gpio' + pin + '/direction', direction);
        });
}

function rdGPIO(pin){
/*---------- read GPIO value and return it -----------*/
	return fs.readFileSync('/sys/class/gpio/gpio' + pin + '/value');
}

function wrGPIO(pin, value){
/*---------- write value to corresponding GPIO -----------*/
	fs.writeFileSync('/sys/class/gpio/gpio' + pin + '/value', value);
}

function copySwToLed(){
/********* Copy the sw values into the LEDs  *********/
        var state_now; //temporary sw value
        
        debug('Polling the GPIO. Copying SWs state to respective LEDs\r');

        state_now = rdGPIO(SW5); //read pushbutton 5 and invert its value...
        wrGPIO(LED1,state_now); //...then copy its value to LED 1
        state_now = rdGPIO(SW6); //read pushbutton 6 and invert its value...
        wrGPIO(LED2,state_now); //...then copy its value to LED 2
}
