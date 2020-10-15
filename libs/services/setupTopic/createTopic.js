import AWS from '../../libs/aws-sdk';
const sns = new AWS.SNS();
import putCity from './putCity';

exports.createTopic = async (city, email) => {
  let createParams = {
    Name: city,
  };

  let subscribeParams = {
    TopicArn: `arn:aws:sns:eu-west-2:*:${city}`,
  };

  try {
    if (putCity(city)) {
      await sns.createTopic(params).promise();
    } else {
      sns.subscribe();
    }
  } catch (error) {}
};
