import createTopic from './createTopic';
import util from '../../../util';

exports.handler = async (event) => {
  try {
    let email = JSON.parse(event.body).email;
    let city = JSON.parse(event.body).city;
    let data = await createTopic(city, email);
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({ message: 'Successfully subscribed!' }),
    };
  } catch (error) {
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
