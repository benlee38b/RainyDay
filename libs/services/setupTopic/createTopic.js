import AWS from '../../libs/aws-sdk';
const sns = new AWS.SNS();
import putCity from './putCity';
const tableName = process.env.CITY_TABLE;

exports.createTopic = async (city, email) => {
  let params = {
    Name: city,
  };

  try {
    await sns.createTopic(params).promise();
  } catch (error) {}
};
