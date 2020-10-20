const util = require('./util');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' });
const Lambda = new AWS.Lambda();
const axios = require('axios');
const tableName = process.env.CITY_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient();
const publishMessageLambda = process.env.PUBLISH_MESSAGE_LAMBDA_NAME;
const weatherApiKey = process.env.WEATHER_API_KEY;

exports.handler = async (event) => {
  const scanParams = {
    TableName: tableName,
    AttributesToGet: ['city'],
  };
  const lambdaParams = {
    FunctionName: publishMessageLambda,
    InvocationType: 'RequestResponse',
  };

  try {
    let citiesArr = await docClient.scan(scanParams).promise();

    citiesArr.Items.forEach(async (cityObj) => {
      console.log('cityObj', cityObj);
      console.log('city', cityObj.city);
      console.log('weatherApiKey:', weatherApiKey);
      let weatherReport = await axios({
        method: 'get',
        url: 'http://api.weatherapi.com/v1/forecast.json',
        params: {
          key: weatherApiKey,
          q: cityObj.city,
          days: 1,
        },
      });
      let dailyChanceOfRain =
        weatherReport.data.forecast.forecastday[0].day.daily_chance_of_rain;
      let totalPrecip =
        weatherReport.data.forecast.forecastday[0].day.totalprecip_mm;
      // console.log(
      //   'weatherReport: ',
      //   weatherReport.data.forecast.forecastday[0].day
      // );
    });

    console.log('cityItems:', citiesArr.Items);
    console.log('entire scan:', citiesArr);
  } catch (error) {
    console.log(error);
  }
};
