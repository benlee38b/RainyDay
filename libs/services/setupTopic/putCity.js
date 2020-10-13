import AWS from '../../libs/aws-sdk';
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.CITY_TABLE;
import util from '../../../util';

exports.putCity = async (city) => {
  let params = {
    TableName: tableName,
    Item: {
      city,
    },
  };
  try {
    let existingCity = await docClient.get(params).promise();
    if (!existingCity) {
      let data = await data.put(params);
    }
  } catch (error) {
    console.log('ERROR', err);
  }
};
