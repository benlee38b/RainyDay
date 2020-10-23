const util = require('./util');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' });
const lambda = new AWS.Lambda();
const axios = require('axios').default;
const tableName = process.env.CITY_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient();
const publishMessageLambda = process.env.PUBLISH_MESSAGE_LAMBDA_NAME;
const weatherApiKey = process.env.WEATHER_API_KEY;

console.log('cold start now');

exports.handler = async (event) => {
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUp - Lambda is warm!');
    /** Slightly delayed (25ms) response 
    	to ensure concurrent invocation */
    await new Promise((r) => setTimeout(r, 25));
    return 'Lambda is warm!';
  } else {
    const scanParams = {
      TableName: tableName,
      AttributesToGet: ['city'],
    };

    try {
      let data = await docClient.scan(scanParams).promise();
      let weatherReport;
      let cityArr = data.Items;

      for await (let cityObj of cityArr) {
        let city = cityObj.city;

        weatherReport = await axios({
          method: 'get',
          url: 'http://api.weatherapi.com/v1/forecast.json',
          params: {
            key: weatherApiKey,
            q: city,
            days: 1,
          },
        });

        let dailyForecast = await weatherReport.data.forecast.forecastday[0]
          .day;

        let dailyChanceOfRain = Number(dailyForecast.daily_chance_of_rain);
        let totalPrecip = dailyForecast.totalprecip_mm;
        let lambdaParams = {
          FunctionName: publishMessageLambda,
          InvocationType: 'RequestResponse',
          Payload: JSON.stringify({
            body: { dailyChanceOfRain, totalPrecip, city },
          }),
        };
        if (dailyChanceOfRain > 50 && totalPrecip > 3) {
          let data = await lambda.invoke(lambdaParams).promise();
          console.log(data);
        } else console.log('not much rain today!!!');
      }

      return {
        statusCode: 200,
        headers: util.getResponseHeaders(),
        body: JSON.stringify({ message: 'Weather has been assessed!' }),
      };
    } catch (error) {
      console.log(error);
    }
  }
};
