// big comments generated with https://fsymbols.com/generators/tarty/
import { TestExecution, TestResult } from "../testResults";
import {
  checkTransitionTo,
  checkTransitionFrom,
  checkTransitionExists,
  getTransition,
  checkTransitionConditions,
  checkTransitionValidators,
} from "../transitionCheckers";

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

// █▀▀ █▀▀ ▀█▀   ▀█▀ █▀█ ▄▀█ █▄░█ █▀ █ ▀█▀ █ █▀█ █▄░█
// █▄█ ██▄ ░█░   ░█░ █▀▄ █▀█ █░▀█ ▄█ █ ░█░ █ █▄█ █░▀█

test("getTransition returns correct transition", async () => {
  const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
  const actualWorkflow = API_RESPONSE.values[0];
  const actualTransition = actualWorkflow.transitions[0];

  const result = getTransition(actualWorkflow, expectedTransition);

  expect(result).toBeDefined();
  expect(result.name).toEqual("Create");
  expect(result).toEqual(actualTransition);
});

// ▀█▀ █▀█ ▄▀█ █▄░█ █▀ █ ▀█▀ █ █▀█ █▄░█   █▀▀ ▀▄▀ █ █▀ ▀█▀ █▀
// ░█░ █▀▄ █▀█ █░▀█ ▄█ █ ░█░ █ █▄█ █░▀█   ██▄ █░█ █ ▄█ ░█░ ▄█

test("checkTransitionExists returns pass if transition parameter is defined", async () => {
  const actualWorkflow = API_RESPONSE.values[0];
  const actualTransition = actualWorkflow.transitions[0];
  const result = checkTransitionExists(actualTransition);

  const expectedReturnObject: TestExecution = {
    detail: "Test successful",
    expectDescription: "Transition exists",
    result: TestResult.Pass,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

test("checkTransitionExists returns fail if transition parameter is undefined", async () => {
  const result = checkTransitionExists(null);

  const expectedReturnObject: TestExecution = {
    detail: "Transition was undefined",
    expectDescription: "Transition exists",
    result: TestResult.Fail,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

test("checkTransitionExists correctly uses custom test expectation string", async () => {
  const actualWorkflow = API_RESPONSE.values[0];
  const actualTransition = actualWorkflow.transitions[0];

  const customExpectation = "A custom expectation";
  const result = checkTransitionExists(actualTransition, customExpectation);

  expect(result).toBeDefined();
  expect(result.expectDescription).toEqual(customExpectation);
});

// ▀█▀ █▀█ ▄▀█ █▄░█ █▀ █ ▀█▀ █ █▀█ █▄░█   ▀█▀ █▀█
// ░█░ █▀▄ █▀█ █░▀█ ▄█ █ ░█░ █ █▄█ █░▀█   ░█░ █▄█

test("checkTransitionTo returns pass if transition to matches", async () => {
  const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
  const actualWorkflow = API_RESPONSE.values[0];
  const actualTransition = actualWorkflow.transitions[0];
  const result = checkTransitionTo(
    expectedTransition,
    actualTransition,
    actualWorkflow
  );

  const expectedReturnObject: TestExecution = {
    detail: "Test successful",
    expectDescription: 'Transitions to "Draft" status',
    result: TestResult.Pass,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

test("checkTransitionTo skips check if expected transition.to is undefined", async () => {
  const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
  const actualWorkflow = API_RESPONSE.values[0];

  expectedTransition.to = null;
  const actualTransition = actualWorkflow.transitions[0];
  const result = checkTransitionTo(
    expectedTransition,
    actualTransition,
    actualWorkflow
  );

  const expectedReturnObject: TestExecution = {
    detail: "Skip test, no expectation defined",
    expectDescription: "Transition to status check",
    result: TestResult.Skip,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

test("checkTransitionTo fails when ACTUAL transition.to is undefined, but EXPECTED transition.to is defined", async () => {
  const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
  const actualWorkflow = API_RESPONSE.values[0];

  const actualTransition = actualWorkflow.transitions[0];
  actualTransition.to = null;

  const result = checkTransitionTo(
    expectedTransition,
    actualTransition,
    actualWorkflow
  );

  const expectedReturnObject: TestExecution = {
    detail: '"To" configuration was undefined',
    expectDescription: 'Transitions to "Draft" status',
    result: TestResult.Fail,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

// ▀█▀ █▀█ ▄▀█ █▄░█ █▀ █ ▀█▀ █ █▀█ █▄░█   █▀▀ █▀█ █▀█ █▀▄▀█
// ░█░ █▀▄ █▀█ █░▀█ ▄█ █ ░█░ █ █▄█ █░▀█   █▀░ █▀▄ █▄█ █░▀░█

test("checkTransitionFrom returns pass if transition to matches", async () => {
  const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
  const actualWorkflow = API_RESPONSE.values[0];
  const actualTransition = actualWorkflow.transitions[0];
  const result = checkTransitionFrom(
    expectedTransition,
    actualTransition,
    actualWorkflow
  );

  const expectedReturnObject: TestExecution = {
    detail: "Test successful",
    expectDescription: 'Accepts transition from ""',
    result: TestResult.Pass,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

test("checkTransitionFrom skips check if expected transition.from is undefined", async () => {
  const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
  const actualWorkflow = API_RESPONSE.values[0];
  expectedTransition.from = null;

  const actualTransition = actualWorkflow.transitions[0];
  const result = checkTransitionFrom(
    expectedTransition,
    actualTransition,
    actualWorkflow
  );

  const expectedReturnObject: TestExecution = {
    detail: "Skip test, no expectation defined",
    expectDescription: "Transition from status check",
    result: TestResult.Skip,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

test("checkTransitionFrom fails when ACTUAL transition.to is undefined, but EXPECTED transition.to is defined", async () => {
  const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
  const actualWorkflow = API_RESPONSE.values[0];
  const actualTransition = actualWorkflow.transitions[0];
  actualTransition.from = null;

  const result = checkTransitionFrom(
    expectedTransition,
    actualTransition,
    actualWorkflow
  );

  const expectedReturnObject: TestExecution = {
    detail: '"From" configuration was undefined',
    expectDescription: 'Accepts transition from ""',
    result: TestResult.Fail,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

// ▀█▀ █▀█ ▄▀█ █▄░█ █▀ █ ▀█▀ █ █▀█ █▄░█   █▀▀ █▀█ █▄░█ █▀▄ █ ▀█▀ █ █▀█ █▄░█ █▀
// ░█░ █▀▄ █▀█ █░▀█ ▄█ █ ░█░ █ █▄█ █░▀█   █▄▄ █▄█ █░▀█ █▄▀ █ ░█░ █ █▄█ █░▀█ ▄█

test("checkTransitionConditions returns pass if conditions match", async () => {
  const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
  const actualWorkflow = API_RESPONSE.values[0];
  const actualTransition = actualWorkflow.transitions[0];
  const result = checkTransitionConditions(
    expectedTransition,
    actualTransition
  );

  const expectedReturnObject: TestExecution = {
    detail: "Test successful",
    expectDescription: "Transition conditions match",
    result: TestResult.Pass,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

test("checkTransitionCondition skips check if expected transition conditions are undefined", async () => {
  const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
  const actualWorkflow = API_RESPONSE.values[0];
  expectedTransition.rules.conditions = null;

  const actualTransition = actualWorkflow.transitions[0];
  const result = checkTransitionConditions(
    expectedTransition,
    actualTransition
  );

  const expectedReturnObject: TestExecution = {
    detail: "Skip test, no expectation defined",
    expectDescription: "Transition conditions match",
    result: TestResult.Skip,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

test("checkTransitionConditions fails when ACTUAL transition conditions are undefined, but EXPECTED transition conditions are defined", async () => {
  const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
  const actualWorkflow = API_RESPONSE.values[0];
  const actualTransition = actualWorkflow.transitions[0];
  actualTransition.rules.conditions = null;

  const result = checkTransitionConditions(
    expectedTransition,
    actualTransition
  );

  const expectedReturnObject: TestExecution = {
    detail: "Condition rules were undefined",
    expectDescription: "Transition conditions match",
    result: TestResult.Fail,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

// ▀█▀ █▀█ ▄▀█ █▄░█ █▀ █ ▀█▀ █ █▀█ █▄░█   █░█ ▄▀█ █░░ █ █▀▄ ▄▀█ ▀█▀ █▀█ █▀█ █▀
// ░█░ █▀▄ █▀█ █░▀█ ▄█ █ ░█░ █ █▄█ █░▀█   ▀▄▀ █▀█ █▄▄ █ █▄▀ █▀█ ░█░ █▄█ █▀▄ ▄█

test("checkTransitionValidators returns pass if validators match", async () => {
  const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
  const actualWorkflow = API_RESPONSE.values[0];
  const actualTransition = actualWorkflow.transitions[0];
  const result = checkTransitionValidators(
    expectedTransition,
    actualTransition
  );

  const expectedReturnObject: TestExecution = {
    detail: "Test successful",
    expectDescription: "Transition validators match",
    result: TestResult.Pass,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

test("checkTransitionValidators skips check if expected transition validators are undefined", async () => {
  const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
  const actualWorkflow = API_RESPONSE.values[0];
  expectedTransition.rules.validators = null;

  const actualTransition = actualWorkflow.transitions[0];
  const result = checkTransitionValidators(
    expectedTransition,
    actualTransition
  );

  const expectedReturnObject: TestExecution = {
    detail: "Skip test, no expectation defined",
    expectDescription: "Transition validators match",
    result: TestResult.Skip,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});

test("checkTransitionValidators fails when ACTUAL transition validators are undefined, but EXPECTED transition validators are defined", async () => {
  const expectedTransition = EXPECTED_WORKFLOW.expectedTransitions[0];
  const actualWorkflow = API_RESPONSE.values[0];
  const actualTransition = actualWorkflow.transitions[0];
  actualTransition.rules.validators = null;

  const result = checkTransitionValidators(
    expectedTransition,
    actualTransition
  );

  const expectedReturnObject: TestExecution = {
    detail: "Validator rules were undefined",
    expectDescription: "Transition validators match",
    result: TestResult.Fail,
  };

  expect(result).toBeDefined();
  expect(result).toEqual(expectedReturnObject);
});
