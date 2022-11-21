"use strict";

// declare variables for easy access to often-used long-named variables
let Service, Characteristic;
const http = require('http');   // HTTP POST / GET method.
const bent = require('bent');
const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require('constants');
var request = require("request");

module.exports = function (homebridge) {

    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-solvis',
        'Solvis', solvistemp);
};


function solvistemp(log, config, api) {
    this.log = log;
    this.config = config;
    this.homebridge = api;
    this.name = config.name;
    this.sensor = config.solvissensor;
    this.xml = config.xml;
    this.log(config.xml);
    if (this.config.refreshInterval)
        this.refreshInterval = this.config.refreshInterval;
    else
        this.refreshInterval = 1000;

    this.tempsens = new Service.TemperatureSensor(this.config.name);
    // Set up Event Handler for bulb on/off
    this.tempsens.getCharacteristic(Characteristic.On)
        .on("get", this.getTemperature.bind(this))
    
    // polling
 //   this.timer = setTimeout(this.poll.bind(this), this.refreshInterval);
};

solvistemp.prototype = {
    getServices: function() {
        if (!this.tempsens) return [];
        const infoService =  
            new Service.AccessoryInformation();
        infoService
            .setCharacteristic(Characteristic.Manufacturer,
                'SensMan')
        return [infoService, this.tempsens];
    },    
    getTemperature: function(callback) {
        this.log('getTemperature');
        const getStream = bent(this.xml);
        //let stream = await getStream('/json.api');
        //const obj = await stream.json();
        this.log(getStream);
        //const str = await stream.text();
        //this.log(str);
//        let req = http.get(this.xml, res => {
//            let recv_data = '';
//              res.on('data', chunk => { recv_data += chunk});
//            res.on('end', () => {
                // recv_data contains volume info.
//                let vol = JSON.parse(recv_data).volume; // vol = [0,100]
//                this.log('Read from Sonos; volume: ' + vol);
//                this.vol = vol;
//                  this.log(recv_data);
//                callback(null, this.vol > 0);
          
 //           });
 //       });
        req.on('error', err => {
            this.log("Error in getTemperature: "+ err.message);
            callback(err);
        })
    },
    setPower: function(on, callback) {
        let new_vol;
        if(this.triggeredby=='slider') {
            this.log('setPower triggered by slider')
            new_vol = this.vol;
            delete this.triggeredby;
        } else {
            this.log('setPower ' + on)
            new_vol = on ? this.defaultVolume : 0;
        }

        let toSend = '{"volume": ' + new_vol + '}';
        let options = {
            host: 'localhost',
            port: 5000,
            path: '/volume',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': toSend.length
            }
        }

        let req = http.request(options, res => {
            let recv_data = '';
            res.on('data', chunk => {recv_data += chunk})
        });

        req.on('error', err=>{
            this.log('Error in setPower:' + err.message);
            callback(err);
        });

        req.end(toSend)
        this.log('Request sent to set volume to ' + new_vol)
        this.vol = new_vol;

        this.updateUI();
                
        callback(null);
    },
   /* updateUI: function () {
        setTimeout( () => {
            this.bulb.getCharacteristic(Characteristic.Brightness).updateValue(this.vol);
            this.bulb.getCharacteristic(Characteristic.On).updateValue(this.vol>0);
        }, 100);
    },*/
    getVolume: function (callback) {
        this.log('getVolume')

        // callback with volume read in getPower
        callback(null,this.vol)
    },
    setVolume: function (vol, callback) {
        if(vol==100) {callback(null); return;}
        this.log('setVolume ' + vol);

        this.vol = vol;
        this.triggeredby = 'slider';

        callback(null);
    }/*,
     poll: function() {
        if(this.timer) clearTimeout(this.timer);
        this.timer = null;

        // volume update from Sonos
        this.getTemperature( (err, poweron) => {  //this.vol updated.
            // update UI
            this.updateUI();
        });

        this.timer = setTimeout(this.poll.bind(this), this.refreshInterval)
    } */
}
