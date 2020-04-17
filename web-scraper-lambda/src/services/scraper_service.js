
import fetch from 'node-fetch';

import { getActiveSearches, markUrlAsFound } from "./search_request_repo";
import { sendSmsTextMessage } from "./sms_service";
import { getUser } from "./user_repo";

export const scrape = async () => {
  console.log('Scraping the web to check all our searches');

  const activeSearches = await getActiveSearches();
  console.log('Found active searches', activeSearches);

  activeSearches.forEach( (searchItem) => {
    const fetchUrl = searchItem.url;
    const userId = searchItem.userId;
    const searchTerms = searchItem.searches;

    console.log(`Testing search item UserID(${userId}), URL(${fetchUrl}), SearchTerms(${searchTerms})`);
    const searchPromise = searchUrl(fetchUrl, searchTerms);

    searchPromise.then( termExists => {
      if (termExists) {
        console.log('Search Term Found!');

        const textMsgBody = `Your search terms were found at ${fetchUrl}!`;

        const userInfoPromise = getUser(userId);
        userInfoPromise.then(userInfo => {

          if (userInfo) {
            sendSmsTextMessage(userInfo.phoneNum, textMsgBody);
            markUrlAsFound(fetchUrl, userId);
          } else {
            console.log('UserID does not exist', userId);
          }
        });

      } else {
        console.log('Search term not found!');
      }
    });

  });

};

const searchUrl = (url, searches) => {
  console.log(`Searching ${url} for any search term in ${searches}`);

  return fetch(url)
      .then(resp => resp.text())
      .then(htmlResponse => {
        let found = false;
        searches.forEach((searchTerm) => {
          if (htmlResponse.match(searchTerm) !== null) {
            found = true;
            console.log(`Found term (${searchTerm}) on URL(${url})`);
          } else {
            console.log(`Term (${searchTerm}) not found on URL(${url})`);
          }
        });
        return found;
      });
};