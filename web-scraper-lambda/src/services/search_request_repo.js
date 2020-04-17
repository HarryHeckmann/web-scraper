

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

export const getSearchesByUserId = async (userId) => {
  console.log(`Looking up DynamoDB Items that match UserId(${userId})`);

  const queryRequest = {
    TableName: searchRequestTable,
    IndexName: "UserIdIndex",
    KeyConditionExpression: "userId = :userId",
    ProjectionExpression: "#url, searches, isFound",
    ExpressionAttributeNames: {
      "#url": "url"
    },
    ExpressionAttributeValues: {
      ":userId": userId
    },
    ScanIndexForward: false
  };


  return await dynamoDb.query(queryRequest).promise()
      .then( resp => {
          console.log(`Found (${resp.Count}) matching items`);
          console.log('All Items Found:', resp.Items);

          // resp.Items isn't actually an Array, it's an AWS SDK type AttributeMap.  We can't use reduce(...)
          let transformedResponse = [];
          resp.Items.forEach((item) => {
            item.searches.forEach((search) => {
              transformedResponse.push({
                userId: userId,
                url: item.url,
                searchText: search
              });
            });
          });

          console.log('Transformed Response:', transformedResponse);
          return transformedResponse;
        }
      ).catch(err => console.log('Failed to query DynamoDb:', err));
};

export const getActiveSearches = async () => {
  console.log('Scanning DynamoDB Table', searchRequestTable);

  const scanParams = {
    TableName: searchRequestTable,
    ProjectExpression: 'url, isFound, searches',
    FilterExpression: 'isFound = :notFound',
    ExpressionAttributeValues: {
      ':notFound': false
    }
  };

  return dynamoDb.scan(scanParams).promise()
      .then( resp => resp.Items )
      .catch( err => console.log("Failed to scan DynamoDB table", err));
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
