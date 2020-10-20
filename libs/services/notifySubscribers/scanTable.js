const util = require('./util');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' });
const Lambda = new AWS.Lambda();
const tableName = process.env.CITY_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient();
const publishMessageLambda = process.env.PUBLISH_MESSAGE_LAMBDA_NAME;
const weatherApiKey = process.env.WEATHER_API_KEY;

exports.handler = async (event) => {
  const scanParams = {
    TableName: tableName,
  };
  const lambdaParams = {
    FunctionName: publishMessageLambda,
    InvocationType: 'RequestResponse',
  };

  `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}`;

  try {
    let citiesArr = await docClient.scan(scanParams);
    console.log(citiesArr.Items);
  } catch (error) {}
};
