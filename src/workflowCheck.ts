import { performance } from "perf_hooks";
import { QueryApiForWorkflow } from "./jiraApi";
import {
  JiraWorkflowTransition,
  JiraStatus,
} from "./interfaces";
import {
  TestResult,
  TestExecution,
  TestResultLog,
  HealthCheckGroup,
} from "./testResults";
import {
  checkTransitionConditions,
  checkTransitionExists,
  checkTransitionFrom,
  checkTransitionTo,
  checkTransitionValidators,
  getTransition,
} from "./transitionCheckers";
import {
  checkStatusExists,
  checkStatusCanOnlyTransitionTo,
  getStatus,
  checkStatusOnlyAcceptsTransitionFrom,
} from "./statusCheckers";

let results: TestResultLog;

export async function PerformWorkflowCheck(
  expectedWorkflowName: string,
  expectedStatuses: any,
  expectedTransitions: JiraWorkflowTransition[],
  atlassianUrl?: string,
  atlassianEmail?: string,
  atlassianToken?: string
): Promise<TestResultLog> {
  let performanceT0 = performance.now();

  const wfExpectation = `Workflow: "${expectedWorkflowName}" should be correctly defined`;
  results = new TestResultLog(wfExpectation);
  let currentChecks = new HealthCheckGroup(
    "Basic workflow configuration is correct"
  );

  const jiraQueryResult = await (
    await QueryApiForWorkflow(
      expectedWorkflowName,
      atlassianUrl,
      atlassianEmail,
      atlassianToken
    )
  ).json();
  const workflow = jiraQueryResult.values[0];

  results.add(currentChecks);

  let result = checkWorkflowExists(workflow);
  currentChecks.add(result);

  if (result.result != TestResult.Pass) return results; //stop tests if workflow not defined

  for (let expectedTransition of expectedTransitions) {
    performTransitionChecks(expectedTransition, workflow);
  }

  for (let expectedStatus of expectedStatuses) {
    performStatusChecks(expectedStatus, workflow);
  }

  let performanceT1 = performance.now();
  results.executionDuration =
    Math.round((performanceT1 - performanceT0) * 100) / 100;

  return results;
}

function performStatusChecks(expectedStatus: JiraStatus, workflow: any) {
  let statusCheck = new HealthCheckGroup(
    `Status: "${expectedStatus.name}" should be correctly defined`
  );

  const status = getStatus(workflow, expectedStatus);

  let result = checkStatusExists(status);
  recordResult(result, statusCheck);

  result = checkStatusCanOnlyTransitionTo(expectedStatus, status, workflow);
  if (result) statusCheck.add(result);

  result = checkStatusOnlyAcceptsTransitionFrom(
    expectedStatus,
    status,
    workflow
  );
  if (result) statusCheck.add(result);

  results.add(statusCheck);
}

function performTransitionChecks(
  expectedTransition: JiraWorkflowTransition,
  workflow: any
) {
  let transitionCheck = new HealthCheckGroup(
    `Transition: "${expectedTransition.name}" should be correctly defined`
  );

  const transition = getTransition(workflow, expectedTransition);

  let result = checkTransitionExists(transition);
  recordResult(result, transitionCheck);

  result = checkTransitionFrom(expectedTransition, transition, workflow);
  if (result) transitionCheck.add(result);

  result = checkTransitionTo(expectedTransition, transition, workflow);
  if (result) transitionCheck.add(result);

  result = checkTransitionConditions(expectedTransition, transition);
  if (result) transitionCheck.add(result);

  result = checkTransitionValidators(expectedTransition, transition);
  if (result) transitionCheck.add(result);

  results.add(transitionCheck);
}

function recordResult(result: TestExecution, checkGroup: HealthCheckGroup) {
  if (result.result != TestResult.Skip) checkGroup.add(result);
}

function checkWorkflowExists(workflow: any): TestExecution {
  let expectation = `Workflow exists`;
  const result = workflow ? TestResult.Pass : TestResult.Fail;
  const detail = workflow
    ? "Test successful"
    : "Workflow was undefined, no further tests can be executed";

  return TestExecution.buildTestExecution(expectation, result, detail);
}
