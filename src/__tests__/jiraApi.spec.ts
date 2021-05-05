import fetch from 'node-fetch'

import {QueryApiForWorkflow} from '../jiraApi'
jest.mock('node-fetch', ()=>jest.fn())

// const {Response} = jest.requireActual('node-fetch');

test('QueryApiForWorkflow calls fetch with the right args and returns the user id', async () => {
  
  await QueryApiForWorkflow('big bananas', 'https://smudged-bananas.totallyfake.com', 'test.email@smudged-bananas.com', 'fakeTOKEN');
  
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith('https://smudged-bananas.totallyfake.com/rest/api/3/workflow/search?workflowName=big%20bananas&&expand=transitions.rules,statuses.properties,default', {
    method: 'GET',
    headers: {
      Accept: "application/json",
      Authorization: "Basic dGVzdC5lbWFpbEBzbXVkZ2VkLWJhbmFuYXMuY29tOmZha2VUT0tFTg=="
       }}
  );

  //TODO: mock response? expect(response).toBe(xxxxxx);
});