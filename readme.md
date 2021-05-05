# Welcome to Jival!

Jival is a tool to help verify that Jira configurations are set correctly. Jival reads a list of expected Jira configuration settings (currently workflow, status and transition configurations) and checks these expectations against the actual configuration applied in Jira. All Jival results are in human readable form so that they can be easily used by non-technical people. Here's an example:

```
Workflow: "My test workflow" should be correctly defined
  Basic workflow configuration is correct
    ✓ Workflow exists
  Transition: "Create" should be correctly defined
    ✓ Transition exists
    ✓ Accepts transition from ""
    ✓ Transitions to "Draft" status
    ✓ Transition conditions match
    ✓ Transition validators match
  Transition: "Abandoned" should be correctly defined
    ✓ Transition exists
    ✓ Accepts transition from ""
    ✓ Transitions to "Abandoned" status
  Status: "Dev In Progress" should be correctly defined
    ✓ Status exists
    ✓ Status can only transition to "Blocked,Code Review,Ready to Dev"
    ✓ Status only accepts transition from "Blocked,Code Review,Ready to Dev"
```

## Example use cases
- You work in a highly regulated environment, and need an easy tool to provide some verification that critical parts of your Jira workflow are configured correctly when making changes
- You want to run a regular health check on your Jira environment to catch human configuration errors and ensure that critical configurations are still set as expected
- You have several Jira instances and need to check that configurations are the same between them

## Checks
### Workflow transitions
For each defined transition expectation
1. Transition exists (search by name)
2. From status list is the same
3. To status list is the same
4. Rules: conditions match
5. Rules: validators match

#### Workflow statuses
For each defined status expectation
1. Status exists (search by name)
2. Status settings are the same (excludes ID)
3. Status only accepts transition from expected statuses
4. Status can only transition to expected statuses

## Installation

Add the package to your project:

```
npm install @sanofi-iadc/jival
```
or
```
yarn add @sanofi-iadc/jival
```

## Usage
### Generate an Atlassian API token
Generate an API token using the instructions on this page: https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/.

The account associated with the token must have admin privilidges to your Jira workspace. This is required because the Atlassian API requires these privilidges in order to read workflow configurations from the API. Jival DOES NOT make any configuration updates using the API, it is only used for read calls.


```
import {PerformWorkflowChecks} from @sanofi-iadc/jival;

// require the json configuration
let expect = require('jival_config.json');

const result = await PerformWorkflowCheck(expect.expectedWorkflowName, expect.expectedStatuses, expect.expectedTransitions, <YOUR_ATLASSIAN_URL>,
<YOUR_ATLASSIAN_EMAIL>, <YOUR_ATLASSIAN_TOKEN>);

console.log(result.toString());
```

Alternatively import the file without using require:
**tsconfig.json**
```
"resolveJsonModule": true
```

Your script
```
import {PerformWorkflowChecks} from @sanofi-iadc/jival;
import {expectedWorkflowName, expectedStatuses, expectedTransitions} from 'jival_config.json';

const result = await PerformWorkflowCheck(expect.expectedWorkflowName, expect.expectedStatuses, expect.expectedTransitions, <YOUR_ATLASSIAN_URL>,
<YOUR_ATLASSIAN_EMAIL>, <YOUR_ATLASSIAN_TOKEN>);

console.log(result.toString());
```

## Setting up config files
Jival expects three configuration options, explained below.

### Basic principles
- IDs should therefore be removed from your configuration files (see the example files), as these can vary within Jira. For example if you were to delete and recreate the same workflow a different ID would be assigned even if the workflow configuration was exactly the same.
- Some verifications are done at object level, meaning that the object must contain an exact copy of the Jira API response in order to pass the verification. The easiest way to configure these is to query the API for your workflow and copy and paste that section of the response into your config file.
- Expectations can be partial - you do not need to specify all properties. For example if you specify an expected status with only name and transitionTo properties, all other properties will be ignored when performing verifications. Name is mandatory as this is used to look up the Jira object.

### expectedWorkflowName
Name of the workflow as a string, used to search the Jira API for the workflow to be verified.

### expectedTransitions
An array of expected transition configurations, with all IDs removed.

- name: name of the transition
- from: array of strings containing status names which trigger this transition when transitioning to the 'to' status
- to: the status when this transition has been completed
- type: string containing the type of the transition (e.g. initial)
- rules: object containing array of conditions and validators. Must be an exact copy of the Jira API response to pass verifications.

Example with simple configuration:
```
"expectedTransitions": [
      {
        "name": "Create",
        "from": [],
        "to": "Draft",
        "type": "initial"
      }
]
```

### expectedStatuses
An array of expected status configurations, with all IDs removed.
- name: string containing the name of the workflow
- transitionTo: an array of strings containing the names of the Jira statuses which an issue can transition to from this status
- transitionFrom: an array of strings containing the names of the Jira statuses which can transition into this status
- properties: an exact copy of the properties of this transition taken from the Jira API

```
"expectedStatuses": [
      {
        "name": "Dev In Progress",
        "transitionTo": ["Blocked" , "Code Review"],
        "transitionFrom": ["Blocked" ,"Ready to Dev" , "Code Review"],
        "properties": {
          "issueEditable": true
        }
      }
    ]
```

### Example files
The easiest way to get started is by using the example file in the examples folder. Try an initial run of your script with this configuration, changing the name of the workflow. You should see that the first test passes and the second test fails.
