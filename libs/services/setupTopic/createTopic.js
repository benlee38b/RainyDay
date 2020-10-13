import AWS from '../../libs/aws-sdk';
const sns = new AWS.SNS();
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.CITY_TABLE;

exports.createTopic = async (city, email) => {
  let snsParams = {
    Name: city,
  };
  let dynamodbParams = {
    TableName,
    Item: {
      city,
    },
  };
  try {
    let existingCity = await docClient.get(params).promise();
    if (!existing) {
    }
    await sns.createTopic(params).promise();
  } catch (error) {}
};
