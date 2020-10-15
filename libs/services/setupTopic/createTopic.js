import AWS from '../../libs/aws-sdk';
const sns = new AWS.SNS();
import putCity from './putCity';

exports.createTopic = async (city, email) => {
  let createParams = {
    Name: city,
  };

  let subscribeParams = {
    Protocol: 'email',
    TopicArn: `arn:aws:sns:eu-west-2:*:${city}`,
    Endpoint: email,
    RedrivePolicy: { deadLetterTargetArn: process.env.DLQ_ARN },
  };
  let data;
  try {
    if (putCity(city)) {
      await sns.createTopic(createParams).promise();
      data = await sns.subscribe(subscribeParams);
    } else {
      data = await sns.subscribe(subscribeParams);
    }
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: 'Successfully subscribed!',
    };
  } catch (err) {
    console.log('ERROR', err);
  }
};
