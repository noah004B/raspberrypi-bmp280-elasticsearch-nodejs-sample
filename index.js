const BME280 = require('bme280-sensor');
const axios = require('axios');
const cron = require('node-cron');
const Settings = require('./settings.json')


// The BME280 constructor options are optional.
// 
const options = {
  i2cBusNo   : 1, // defaults to 1
  i2cAddress : 0x76 // defaults to 0x77
};
const bme280 = new BME280(options);

// Axios
//
const http = axios.create({
  baseURL: Settings.elasticsearch.host
});

// Read BME280 sensor data, repeat
//
const readSensorData = () => {
  bme280.readSensorData()
    .then(async (data) => {
      let fixedData = {
        timestamp: new Date().toJSON(),
        temperature: Math.round(data.temperature_C * 100) / 100,
        humidity: Math.round(data.humidity * 100) / 100,
        pressure: Math.round(data.pressure_hPa  * 100) / 100
      }
      console.log(fixedData);

      let uri = `${Settings.elasticsearch.index}/${Settings.elasticsearch.type}/`;
      await sendData(uri, fixedData)
      //setTimeout(readSensorData, 5000);
    })
    .catch((err) => {
      console.log(`BME280 read error: ${err}`);
      setTimeout(readSensorData, 2000);
    });
};

// Send data to elasticsearch
// 
const sendData = async (uri, data) => {
  http.post(uri, data)
    .then(function (response) {
      console.log(response.status);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Initialize the BME280 sensor
//
bme280.init()
  .then(() => {
    console.log('BME280 initialization succeeded');
    cron.schedule(Settings.cron, () => {
      readSensorData();
    });    
  })
  .catch((err) => console.error(`BME280 initialization failed: ${err} `));

