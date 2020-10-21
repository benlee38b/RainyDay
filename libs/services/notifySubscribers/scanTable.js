const util = require('./util');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' });
const lambda = new AWS.Lambda();
const axios = require('axios');
const tableName = process.env.CITY_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient();
const publishMessageLambda = process.env.PUBLISH_MESSAGE_LAMBDA_NAME;
const weatherApiKey = process.env.WEATHER_API_KEY;

console.log('cold start now');

exports.handler = async (event) => {
  const scanParams = {
    TableName: tableName,
    AttributesToGet: ['city'],
  };

  try {
    let citiesArr = await docClient.scan(scanParams).promise();

    citiesArr.Items.forEach(async (cityObj) => {
      // console.log('cityObj', cityObj);
      // console.log('city', cityObj.city);
      // console.log('weatherApiKey:', weatherApiKey);
      let weatherReport = await axios({
        method: 'get',
        url: 'http://api.weatherapi.com/v1/forecast.json',
        params: {
          key: weatherApiKey,
          q: cityObj.city,
          days: 1,
        },
      });

      // console.log(weatherReport);

      let city = cityObj.city;

      let dailyChanceOfRain = Number(
        weatherReport.data.forecast.forecastday[0].day.daily_chance_of_rain
      );
      let totalPrecip =
        weatherReport.data.forecast.forecastday[0].day.totalprecip_mm;
      let lambdaParams = {
        FunctionName: publishMessageLambda,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({
          body: { dailyChanceOfRain, totalPrecip, city },
        }),
      };
      console.log('dailyChanceOfRain: ', dailyChanceOfRain);
      console.log('totalPrecip: ', totalPrecip);
      if (dailyChanceOfRain > 50 && totalPrecip > 3) {
        let data = await lambda.invoke(lambdaParams).promise();
      }
      console.log(
        'weatherReport: ',
        weatherReport.data.forecast.forecastday[0].day
      );
    });
  } catch (error) {
    console.log(error);
  }
};
