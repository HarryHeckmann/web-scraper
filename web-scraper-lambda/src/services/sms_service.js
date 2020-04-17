
// TODO Is there an SNS option that doesn't bring in the ENTIRE aws-sdk????
const AWS = require('aws-sdk');
const sns = new AWS.SNS({apiVersion: '2010-03-31'});

export const sendSmsTextMessage = (phoneNumber, message) => {
  console.log(`Sending SMS Text Message [${message}] To: [${phoneNumber}]`);

  const smsRequest = {
    Message: message,
    MessageAttributes: {
      // required property by SMS, controls the criticality of the message.
      //  see: https://docs.aws.amazon.com/sns/latest/dg/sms_publish-to-phone.html
      'AWS.SNS.SMS.SMSType': {
        DataType: 'String',
        StringValue: 'Promotional'
      }
    },
    PhoneNumber: phoneNumber
  };

  sns.publish(smsRequest).promise()
      .then(d => {
        console.log('SMS Message Success', d);
      })
      .catch(err => {
        console.log('SMS Message Failed', err);
      });
};