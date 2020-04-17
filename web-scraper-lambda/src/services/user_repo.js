
const dynamoDbModule = require('aws-sdk/clients/dynamodb');
const dynamoDb = new dynamoDbModule.DocumentClient();

const userInfoTable = process.env.userInfoTable;

export const createUser = async (userId, phoneNum) => {
  console.log(`Upserting user ${userId}`);

  const putRequest = {
    TableName: userInfoTable,
    Item: {
      'userId': userId,
      'phoneNum': phoneNum
    }
  };

  dynamoDb.put(putRequest, (err, data) => {
    err ? console.log('Failed to write to DynamoDb', err) : console.log('DynamoDb write successful!', data);
  });
};