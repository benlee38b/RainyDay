const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.CITY_TABLE;
AWS.config.update({ region: 'eu-west-2' });

exports.handler = async (event) => {
  let city = JSON.parse(event.body).city;
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
  } catch (err) {
    console.log('ERROR', err);
  }
};
