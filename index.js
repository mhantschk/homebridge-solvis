"use strict";

// declare variables for easy access to often-used long-named variables
let Service, Characteristic;
const needle = require('needle');
const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require('constants');

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
        this.log(this.xml);
        needle.get('http://solvis:solvis@solvisremote-576839.qrr9tjqalkqynuff.myfritz.net/', function(error, response) {
//  if (!error && response.statusCode == 200)
    
    console.log(response.body);
    //console.log(response.body);
});
        
        callback(null,'test');
    }}
