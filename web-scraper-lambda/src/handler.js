
import { createSearch } from './services/search_request_repo';
import { getSearchesByUserId } from "./services/search_request_repo";
import { createUser } from "./services/user_repo";
import { scrape } from "./services/scraper_service";

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

/**
 * Add a new search record
 */
export const addUser = async (event, context, callback) => {

  const userId = event.headers['X-UserId'];
  const body = JSON.parse(event.body);

  await createUser(userId, body.phoneNum);

  callback(null, {statusCode: 200});
};

export const scraper = async (event, context, callback) => {
  console.log('Starting web scrape daemon service');
  await scrape();

  callback(null, 'Function Complete!');
};
