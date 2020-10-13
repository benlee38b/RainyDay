import AWS from '../../libs/aws-sdk';
const sns = new AWS.SNS();

exports.createTopic = async (city, email) => {
  let params = {
    Name: city,
  };
  try {
    await sns.createTopic(params).promise();
  } catch (error) {}
};
