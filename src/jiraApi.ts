import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();

// will accept Jira API details either as parameters or env vars
export async function QueryApiForWorkflow(workflowName: string, atlassianUrl?: string, atlassianEmail?: string, atlassianToken?: string) {
  const WORKFLOW_URI_FRIENDLY = encodeURIComponent(workflowName.trim());
  const API_EXPANSION_OPTIONS = '&expand=transitions.rules,statuses.properties,default';
  const ATLASSIAN_URL = atlassianUrl? atlassianUrl : process.env.ATLASSIAN_URL;
  const ATLASSIAN_EMAIL = atlassianEmail? atlassianEmail : process.env.ATLASSIAN_EMAIL;
  const ATLASSIAN_TOKEN = atlassianToken? atlassianToken : process.env.ATLASSIAN_TOKEN;

  const AUTH = Buffer.from(`${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}`).toString('base64');

  let response = await fetch(
    `${ATLASSIAN_URL}/rest/api/3/workflow/search?workflowName=${WORKFLOW_URI_FRIENDLY}&${API_EXPANSION_OPTIONS}`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${AUTH}`,
        Accept: "application/json",
      },
    }
  )
  // TODO: I deleted error handling code from the Jira docs example whilst trying to get this working
  // should be re-added as the app will currently crash if there is an issue with the API query
    return await response;
}