const util = require('./util');
const putCity = require('./putCity');

exports.handler = async (event) => {
  let email = JSON.parse(event.body).email;
  let city = JSON.parse(event.body).city;
  console.log(email, city);

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
    if (await putCity(city).promise()) {
      await sns.createTopic(createParams).promise();
      data = await sns.subscribe(subscribeParams);
    } else {
      data = await sns.subscribe(subscribeParams);
    }
    console.log(data);
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({ message: 'Successfully subscribed!', data: data }),
    };
  } catch (err) {
    console.log('ERROR', err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : 'exception',
        message: err.message ? err.message : 'Unknown Error',
      }),
    };
  }
};
