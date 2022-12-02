"use strict";

// declare variables for easy access to often-used long-named variables
let Service, Characteristic;
     const needle = require("needle");

const user = 'solvis';
const pass = 'solvis';
const uri = 'http://192.168.178.80/sc2_val.xml';
const path='/sc2_val.xml';


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
        
   
         var options = {
               username:'solvis',
              password:'solvis',
              auth:'digest'
          };

          needle.get(uri, options, function (err, data, res) {
               if (err) {
                    console.log(err);
                    throw err; // you need to handle error
               }
               //console.log(data);
               console.log(res.getelementsbytagname('data'));
               // data is Buffer instance
               //console.log(data.toString());
          });
         callback(null);
   }
}
