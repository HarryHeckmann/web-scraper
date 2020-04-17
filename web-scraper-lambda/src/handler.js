
import { createSearch } from './services/search_request_repo';
import { getSearchesByUserId } from "./services/search_request_repo";

export const getSearches = async event => {

  const userId = event.headers['X-UserId'];
  const responseBody = await getSearchesByUserId(userId);

  return {
    statusCode: 200,
    body: JSON.stringify(responseBody, null, 2)
  };
};

/**
 * Add a new search record
 */
export const addSearch = async (event, context, callback) => {

  const body = JSON.parse(event.body);
  await createSearch(body.url, body.userId, body.searchText);

  callback(null, {statusCode: 200});
};
