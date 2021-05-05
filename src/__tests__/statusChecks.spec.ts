// big comments generated with https://fsymbols.com/generators/tarty/
import { TestExecution, TestResult } from "../testResults";
import { getStatus, checkStatusExists, getTransitionTos, checkStatusCanOnlyTransitionTo, checkStatusOnlyAcceptsTransitionFrom } from "../statusCheckers";
import { JiraApiStatus } from "../interfaces";

let EXPECTED_WORKFLOW: any;
let API_RESPONSE: any;

// ░░█ █▀▀ █▀ ▀█▀   █▀▀ █░░ █▀█ █▄▄ ▄▀█ █░░ █▀
// █▄█ ██▄ ▄█ ░█░   █▄█ █▄▄ █▄█ █▄█ █▀█ █▄▄ ▄█

beforeEach(() => {
  EXPECTED_WORKFLOW = JSON.parse(
    JSON.stringify(require("../config/expectmck.json"))
  );
  API_RESPONSE = JSON.parse(
    JSON.stringify(require("../config/mockApiResponse.json"))
  );
});

// █▀▀ █▀▀ ▀█▀   █▀ ▀█▀ ▄▀█ ▀█▀ █░█ █▀
// █▄█ ██▄ ░█░   ▄█ ░█░ █▀█ ░█░ █▄█ ▄█

test("getStatus returns correct status", async () => {
  const expectedStatus = EXPECTED_WORKFLOW.expectedStatuses[0];
  const actualWorkflow = API_RESPONSE.values[0];
  const result = getStatus(actualWorkflow, expectedStatus);

  expect(result).toBeDefined();
  expect(result.name).toEqual('Dev In Progress');
  expect(result.id).toEqual('10051');
});

// █▀ ▀█▀ ▄▀█ ▀█▀ █░█ █▀   █▀▀ ▀▄▀ █ █▀ ▀█▀ █▀
// ▄█ ░█░ █▀█ ░█░ █▄█ ▄█   ██▄ █░█ █ ▄█ ░█░ ▄█

test("checkStatusExists returns pass if status parameter is defined", async () => {
  const actualWorkflow = API_RESPONSE.values[0];
  const actualStatus = actualWorkflow.statuses[0];
  const result = checkStatusExists(actualStatus);

  const expectedReturnObject: TestExecution = {
    detail: "Test successful",
    expectDescription: "Status exists",
    result: TestResult.Pass,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

test("checkStatusExists returns fail if status parameter is undefined", async () => {
  const result = checkStatusExists(null);

  const expectedReturnObject: TestExecution = {
    detail: "Status was undefined",
    expectDescription: "Status exists",
    result: TestResult.Fail,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

test("checkStatusExists correctly uses custom test expectation string", async () => {
  const actualWorkflow = API_RESPONSE.values[0];
  const actualStatus = actualWorkflow.statuses[0];

  const customExpectation = "A custom expectation";
  const result = checkStatusExists(actualStatus, customExpectation);

  expect(result).toBeDefined();
  expect(result.expectDescription).toEqual(customExpectation);
});

// █▀▀ ▄▀█ █▄░█   ▀█▀ █▀█ ▄▀█ █▄░█ █▀ █ ▀█▀ █ █▀█ █▄░█   ▀█▀ █▀█
// █▄▄ █▀█ █░▀█   ░█░ █▀▄ █▀█ █░▀█ ▄█ █ ░█░ █ █▄█ █░▀█   ░█░ █▄█

test("getTransitionTos returns correct array of transitions", async () => {
  const actualWorkflow = API_RESPONSE.values[0];

  const status: JiraApiStatus =  {
    id: '10051',
    name: 'Dev In Progress',
    properties: {
      issueEditable: true
    }
  };
  
  const result = getTransitionTos(status, actualWorkflow);
  const expectedResult= ['10007', '10002', '10032'].sort();

  expect(result.sort()).toEqual(expectedResult);
});

test("checkStatusCanOnlyTransitionTo skips check if expected transition.transitionTo is undefined", async () => {
  const expectedStatus = EXPECTED_WORKFLOW.expectedStatuses[0];
  const actualWorkflow = API_RESPONSE.values[0];

  expectedStatus.transitionTo = null;
  const actualStatus = actualWorkflow.statuses[7]; //Ready to Dev TODO use .find here to make it more readable
  const result = checkStatusCanOnlyTransitionTo(
    expectedStatus,
    actualStatus,
    actualWorkflow
  );

  const expectedReturnObject: TestExecution = {
    detail: "Skip test, no expectation defined",
    expectDescription: 'Status can only transition to expected statuses',
    result: TestResult.Skip,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

test("checkStatusCanOnlyTransitionTo passes check if expected transition.transitionTo and actual to statuses match", async () => {
  const expectedStatus = EXPECTED_WORKFLOW.expectedStatuses[0];//Dev In Progress TODO use .find here, or a specific expectation file to make it more readable
  const actualWorkflow = API_RESPONSE.values[0];

  const actualStatus = actualWorkflow.statuses[7]; //Dev In Progress TODO use .find here to make it more readable
  const result = checkStatusCanOnlyTransitionTo(
    expectedStatus,
    actualStatus,
    actualWorkflow
  );

  const expectedReadableStatuses = ['Blocked' ,'Ready to Dev' , 'Code Review'].sort();

  const expectedReturnObject: TestExecution = {
    detail: "Test successful",
    expectDescription: `Status can only transition to "${expectedReadableStatuses}"`,
    result: TestResult.Pass,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

// ▄▀█ █▀▀ █▀▀ █▀▀ █▀█ ▀█▀   ▀█▀ █▀█ ▄▀█ █▄░█ █▀ █ ▀█▀ █ █▀█ █▄░█   █▀▀ █▀█ █▀█ █▀▄▀█
// █▀█ █▄▄ █▄▄ ██▄ █▀▀ ░█░   ░█░ █▀▄ █▀█ █░▀█ ▄█ █ ░█░ █ █▄█ █░▀█   █▀░ █▀▄ █▄█ █░▀░█

test("checkStatusOnlyAcceptsTransitionFrom skips check if expected transition.transitionFrom is undefined", async () => {
  const expectedStatus = EXPECTED_WORKFLOW.expectedStatuses[0];
  const actualWorkflow = API_RESPONSE.values[0];

  expectedStatus.transitionFrom = null;
  const actualStatus = actualWorkflow.statuses[7]; //Dev In Progress TODO use .find here and/or expect on name to make it more readable
  const result = checkStatusOnlyAcceptsTransitionFrom(
    expectedStatus,
    actualStatus,
    actualWorkflow
  );

  const expectedReturnObject: TestExecution = {
    detail: "Skip test, no expectation defined",
    expectDescription: 'Status only accepts transitions from expected statuses',
    result: TestResult.Skip,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

test("checkStatusOnlyAcceptsTransitionFrom passes check if expected transition.transitionTo and actual to statuses match", async () => {
  const expectedStatus = EXPECTED_WORKFLOW.expectedStatuses[0];//Ready to Dev TODO use .find here, or a specific expectation file to make it more readable
  const actualWorkflow = API_RESPONSE.values[0];

  const actualStatus = actualWorkflow.statuses[7]; //Ready to Dev TODO use .find here to make it more readable
  const result = checkStatusOnlyAcceptsTransitionFrom(
    expectedStatus,
    actualStatus,
    actualWorkflow
  );

  const expectedReadableStatuses = ['Blocked' ,'Ready to Dev' , 'Code Review'].sort();

  const expectedReturnObject: TestExecution = {
    detail: "Test successful",
    expectDescription: `Status only accepts transition from "${expectedReadableStatuses}"`,
    result: TestResult.Pass,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

// test("checkTransitionTo fails when ACTUAL transition.to is undefined, but EXPECTED transition.to is defined", async () => {
//   const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
//   const actualWorkflow = API_RESPONSE.values[0];

//   const actualTransition = actualWorkflow.transitions[0];
//   actualTransition.to = null;

//   const result = checkTransitionTo(
//     expectedTransition,
//     actualTransition,
//     actualWorkflow
//   );

//   const expectedReturnObject: TestExecution = {
//     detail: '"To" configuration was undefined',
//     expectDescription: 'Transitions to "Draft" status',
//     result: TestResult.Fail,
//   };

//   expect(result).toBeDefined();
//   expect(result).toEqual(expectedReturnObject);
// });

// // ▀█▀ █▀█ ▄▀█ █▄░█ █▀ █ ▀█▀ █ █▀█ █▄░█   █▀▀ █▀█ █▀█ █▀▄▀█
// // ░█░ █▀▄ █▀█ █░▀█ ▄█ █ ░█░ █ █▄█ █░▀█   █▀░ █▀▄ █▄█ █░▀░█

// test("checkTransitionFrom returns pass if transition to matches", async () => {
//   const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
//   const actualWorkflow = API_RESPONSE.values[0];
//   const actualTransition = actualWorkflow.transitions[0];
//   const result = checkTransitionFrom(
//     expectedTransition,
//     actualTransition,
//     actualWorkflow
//   );

//   const expectedReturnObject: TestExecution = {
//     detail: "Test successful",
//     expectDescription: 'Accepts transition from ""',
//     result: TestResult.Pass,
//   };

//   expect(result).toBeDefined();
//   expect(result).toEqual(expectedReturnObject);
// });

// test("checkTransitionFrom skips check if expected transition.from is undefined", async () => {
//   const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
//   const actualWorkflow = API_RESPONSE.values[0];
//   expectedTransition.from = null;

//   const actualTransition = actualWorkflow.transitions[0];
//   const result = checkTransitionFrom(
//     expectedTransition,
//     actualTransition,
//     actualWorkflow
//   );

//   const expectedReturnObject: TestExecution = {
//     detail: "Skip test, no expectation defined",
//     expectDescription: "Transition from status check",
//     result: TestResult.Skip,
//   };

//   expect(result).toBeDefined();
//   expect(result).toEqual(expectedReturnObject);
// });

// test("checkTransitionFrom fails when ACTUAL transition.to is undefined, but EXPECTED transition.to is defined", async () => {
//   const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
//   const actualWorkflow = API_RESPONSE.values[0];
//   const actualTransition = actualWorkflow.transitions[0];
//   actualTransition.from = null;

//   const result = checkTransitionFrom(
//     expectedTransition,
//     actualTransition,
//     actualWorkflow
//   );

//   const expectedReturnObject: TestExecution = {
//     detail: '"From" configuration was undefined',
//     expectDescription: 'Accepts transition from ""',
//     result: TestResult.Fail,
//   };

//   expect(result).toBeDefined();
//   expect(result).toEqual(expectedReturnObject);
// });

// // ▀█▀ █▀█ ▄▀█ █▄░█ █▀ █ ▀█▀ █ █▀█ █▄░█   █▀▀ █▀█ █▄░█ █▀▄ █ ▀█▀ █ █▀█ █▄░█ █▀
// // ░█░ █▀▄ █▀█ █░▀█ ▄█ █ ░█░ █ █▄█ █░▀█   █▄▄ █▄█ █░▀█ █▄▀ █ ░█░ █ █▄█ █░▀█ ▄█

// test("checkTransitionConditions returns pass if conditions match", async () => {
//   const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
//   const actualWorkflow = API_RESPONSE.values[0];
//   const actualTransition = actualWorkflow.transitions[0];
//   const result = checkTransitionConditions(
//     expectedTransition,
//     actualTransition
//   );

//   const expectedReturnObject: TestExecution = {
//     detail: "Test successful",
//     expectDescription: "Transition conditions match",
//     result: TestResult.Pass,
//   };

//   expect(result).toBeDefined();
//   expect(result).toEqual(expectedReturnObject);
// });

// test("checkTransitionCondition skips check if expected transition conditions are undefined", async () => {
//   const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
//   const actualWorkflow = API_RESPONSE.values[0];
//   expectedTransition.rules.conditions = null;

//   const actualTransition = actualWorkflow.transitions[0];
//   const result = checkTransitionConditions(
//     expectedTransition,
//     actualTransition
//   );

//   const expectedReturnObject: TestExecution = {
//     detail: "Skip test, no expectation defined",
//     expectDescription: "Transition conditions match",
//     result: TestResult.Skip,
//   };

//   expect(result).toBeDefined();
//   expect(result).toEqual(expectedReturnObject);
// });

// test("checkTransitionConditions fails when ACTUAL transition conditions are undefined, but EXPECTED transition conditions are defined", async () => {
//   const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
//   const actualWorkflow = API_RESPONSE.values[0];
//   const actualTransition = actualWorkflow.transitions[0];
//   actualTransition.rules.conditions = null;

//   const result = checkTransitionConditions(
//     expectedTransition,
//     actualTransition
//   );

//   const expectedReturnObject: TestExecution = {
//     detail: "Condition rules were undefined",
//     expectDescription: "Transition conditions match",
//     result: TestResult.Fail,
//   };

//   expect(result).toBeDefined();
//   expect(result).toEqual(expectedReturnObject);
// });

// // ▀█▀ █▀█ ▄▀█ █▄░█ █▀ █ ▀█▀ █ █▀█ █▄░█   █░█ ▄▀█ █░░ █ █▀▄ ▄▀█ ▀█▀ █▀█ █▀█ █▀
// // ░█░ █▀▄ █▀█ █░▀█ ▄█ █ ░█░ █ █▄█ █░▀█   ▀▄▀ █▀█ █▄▄ █ █▄▀ █▀█ ░█░ █▄█ █▀▄ ▄█

// test("checkTransitionValidators returns pass if validators match", async () => {
//   const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
//   const actualWorkflow = API_RESPONSE.values[0];
//   const actualTransition = actualWorkflow.transitions[0];
//   const result = checkTransitionValidators(
//     expectedTransition,
//     actualTransition
//   );

//   const expectedReturnObject: TestExecution = {
//     detail: "Test successful",
//     expectDescription: "Transition validators match",
//     result: TestResult.Pass,
//   };

//   expect(result).toBeDefined();
//   expect(result).toEqual(expectedReturnObject);
// });

// test("checkTransitionValidators skips check if expected transition validators are undefined", async () => {
//   const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
//   const actualWorkflow = API_RESPONSE.values[0];
//   expectedTransition.rules.validators = null;

//   const actualTransition = actualWorkflow.transitions[0];
//   const result = checkTransitionValidators(
//     expectedTransition,
//     actualTransition
//   );

//   const expectedReturnObject: TestExecution = {
//     detail: "Skip test, no expectation defined",
//     expectDescription: "Transition validators match",
//     result: TestResult.Skip,
//   };

//   expect(result).toBeDefined();
//   expect(result).toEqual(expectedReturnObject);
// });

// test("checkTransitionValidators fails when ACTUAL transition validators are undefined, but EXPECTED transition validators are defined", async () => {
//   const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
//   const actualWorkflow = API_RESPONSE.values[0];
//   const actualTransition = actualWorkflow.transitions[0];
//   actualTransition.rules.validators = null;

//   const result = checkTransitionValidators(
//     expectedTransition,
//     actualTransition
//   );

//   const expectedReturnObject: TestExecution = {
//     detail: "Validator rules were undefined",
//     expectDescription: "Transition validators match",
//     result: TestResult.Fail,
//   };

//   expect(result).toBeDefined();
//   expect(result).toEqual(expectedReturnObject);
// });
