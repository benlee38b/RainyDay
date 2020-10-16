const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.CITY_TABLE;
AWS.config.update({ region: 'eu-west-2' });

exports.handler = async (event) => {
  console.log('city', event.body.city);
  let city = event.body.city;
  let putParams = {
    TableName: tableName,
    Item: {
      city,
    },
  };
  let getParams = {
    TableName: tableName,
    Key: {
      city,
    },
  };
  try {
    let existingCity = await docClient.get(getParams).promise();
    console.log(existingCity);
    if (!existingCity.Item) {
      let data = await docClient.put(putParams).promise();
      console.log('dynamoDB data:', data);
      return false;
    } else return true;
  } catch (err) {
    console.log('ERROR', err);
  }
};
