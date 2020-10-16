const util = require('./util');
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({
  region: 'eu-west-2',
});
const sns = new AWS.SNS();

exports.handler = async (event) => {
  let email = JSON.parse(event.body).email;
  let city = JSON.parse(event.body).city;
  console.log(email, city);

  let createParams = {
    Name: city,
  };
  const lambdaParams = {
    FunctionName: process.env.PUT_CITY_LAMBDA_NAME,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({ body: { city } }),
  };

  let subscribeParams = {
    Protocol: 'email',
    TopicArn: `arn:aws:sns:eu-west-2:*:${city}`,
    Endpoint: email,
    RedrivePolicy: { deadLetterTargetArn: process.env.DLQ_ARN },
  };
  let data;
  try {
    if (await lambda.invoke(lambdaParams).promise()) {
      await sns.createTopic(createParams).promise();
      data = await sns.subscribe(subscribeParams);
    } else {
      data = await sns.subscribe(subscribeParams);
    }
    console.log(data);
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({ message: 'Successfully subscribed!', data: data }),
    };
  } catch (err) {
    console.log('ERROR', err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : 'exception',
        message: err.message ? err.message : 'Unknown Error',
      }),
    };
  }
};
