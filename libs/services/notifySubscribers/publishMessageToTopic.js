const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' });
const accountId = process.env.ACCOUNT_ID;

const sns = new AWS.SNS();

exports.handler = async (event) => {
  let { dailyChanceOfRain, totalPrecip, city } = event.body;

  console.log('body:', event.body);

  console.log(dailyChanceOfRain, totalPrecip, city);

  let message;

  if (dailyChanceOfRain > 75) {
    message = `There is high ${dailyChanceOfRain}% chance of rain today with approximately ${totalPrecip}mm of rain forecasted. Make sure you are prepared.`;
  } else {
    message = `There is a medium ${dailyChanceOfRain}% chance of rain today with approximately ${totalPrecip}mm of rain forecasted. Make sure you are prepared.`;
  }

  let params = {
    Message: message,
    TopicArn: `arn:aws:sns:eu-west-2:${accountId}:${city}`,
    Subject: 'Rainy Day Alert',
  };
  try {
    let data = await sns.publish(params).promise();
    if (data.MessageId) {
      console.log(data);
      return {
        message: 'Message published successfully',
      };
    } else throw error;
  } catch (error) {
    console.log(error);
  }
};
