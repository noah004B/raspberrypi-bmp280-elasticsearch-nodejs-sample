# Raspberry PI & BME280 & Blynk & Node.js sample

## Get source code

```
$ git clone bme280-elasticsearch
$ cd bme280-elasticsearch
$ npm install
```

## Settings

Common settings is in `/settings.json`
You have to input your elasticsearch host.

```
{
  "elasticsearch": {
    "host": "<your elasticsearch host>",
    "index": "environment",
    "type": "temperture_humidity"
  },
  "cron": "*/1 * * * *"
}
```

Job setting is in `/pm2.yml`

```
name: bme280-elasticsearch-heroku
script: index.js
watch: true
log-date-format: "YYYY-MM-DD HH:mm Z"
```

## Start job

```
$ npm install -g pm2
$ pm2 start pm2.yml
```

