const util = require('./util');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' });
const Lambda = new AWS.Lambda();
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
  console.log('lambdaparams: ', lambdaParams);
  let DLQ_ARN = process.env.DLQ_ARN;
  let RedrivePolicy = { deadLetterTargetArn: DLQ_ARN };

  let subscribeParams = {
    Protocol: 'email',
    TopicArn: `arn:aws:sns:eu-west-2:209148561688:${city}`,
    Endpoint: email,
    Attributes: {
      RedrivePolicy: JSON.stringify(RedrivePolicy),
    },
  };
  let data;
  try {
    const topicExists = await Lambda.invoke(lambdaParams).promise();
    if (topicExists) {
      await sns.createTopic(createParams).promise();
      console.log('before subscribe');
      data = await sns.subscribe(subscribeParams).promise();
    } else {
      data = await sns.subscribe(subscribeParams).promise();
    }
    console.log('subscribe data:', data);
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({ message: 'Successfully subscribed!' }),
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
