
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

export const getUser = (userId) => {
  console.log('Looking up user', userId);

  const getItemParams =  {
    TableName: userInfoTable,
    Key: { 'userId': userId }
  };

  return dynamoDb.get(getItemParams).promise()
      .then( data => {
        console.log('Found UserInfo', data);
        return data.Item;
      })
      .catch( err => console.log('Error looking up User', err) );
};