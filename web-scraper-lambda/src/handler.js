
import { createSearch } from './services/search_request_repo';

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

/**
 * Add a new search record
 */
export const addSearch = async (event, context, callback) => {

  const body = JSON.parse(event.body);
  await createSearch(body.url, body.userId, body.searchText);

  callback(null, {statusCode: 200});
};
