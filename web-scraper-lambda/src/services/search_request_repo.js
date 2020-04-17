

const dynamoDbModule = require('aws-sdk/clients/dynamodb');
const dynamoDb = new dynamoDbModule.DocumentClient();

const searchRequestTable = process.env.searchRequestTable;

export const createSearch = async (url, userId, searchText) => {
  console.log('Updating DynamoDB Table', searchRequestTable);

  const existingItem = await getSearch(url, userId);
  const lowerCaseSearchText = searchText.toLowerCase().trim();

  if (existingItem) {
    console.log('This user already has a record for this url');
    // append new search term to existing list if it doesn't exist
    if (!existingItem.searches.includes(lowerCaseSearchText)) {
      existingItem.searches.push(lowerCaseSearchText);
    }

    await saveItem(url, userId, existingItem.searches);
  } else {

    console.log('No matching item found');
    await saveItem(url, userId, [lowerCaseSearchText]);
  }

};

export const getSearch = async (url, userId) => {
  console.log(`Looking up DynamoDB Item with Url(${url}) and UserId(${userId})`);

  const getItemParams = {
    TableName: searchRequestTable,
    Key: {
      'url': url,
      'userId': userId
    }
  };

  const response = await dynamoDb.get(getItemParams).promise();

  return response.Item;
};

const saveItem = async (url, userId, searches) => {
  console.log(`Writing new item Url(${url}) UserId(${userId}) Searches(${searches})`);

  const putRequest = {
    TableName: searchRequestTable,
    Item: {
      'url': url,
      'userId': userId,
      'searches': searches,
      'isFound': false,
      'lastModifiedDateTime': new Date().toISOString()
    }
  };

  dynamoDb.put(putRequest, (err, data) => {
    err ? console.log('Failed to write to DynamoDb', err) : console.log('DynamoDb write successful!', data);
  });
};
