export const getSearches = async event => ({
  statusCode: 200,
  body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
  ),
});

export const addSearch = async event => ({
  statusCode: 201,
  body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
  ),
});
