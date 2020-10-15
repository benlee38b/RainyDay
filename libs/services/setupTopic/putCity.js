import AWS from '../../libs/aws-sdk';
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.CITY_TABLE;

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
      let data = await docClient.put(params);
      return true;
    } else return false;
  } catch (error) {
    console.log('ERROR', err);
  }
};
