import {
  JiraApiStatus,
  JiraStatus,
  JiraWorkflowTransition,
} from "./interfaces";
import { TestExecution, TestResult } from "./testResults";
import { checkEquality, getReadableStatuses } from "./helpers";

export function getStatus(workflow: any, expectedStatus: JiraStatus) {
  console.log(`Getting status: ${expectedStatus.name}`);
  return workflow.statuses.find(
    (status: any) => status.name === expectedStatus.name
  );
}

export function checkStatusExists(
  transition: any,
  customExpectation?: string
): TestExecution {
  const expectation = customExpectation ? customExpectation : "Status exists";
  const result = transition ? TestResult.Pass : TestResult.Fail;
  const detail = transition ? "Test successful" : "Status was undefined";
  return TestExecution.buildTestExecution(expectation, result, detail);
}

export function checkStatusCanOnlyTransitionTo(
  expectedStatus: JiraStatus,
  status: any,
  workflow: any
): TestExecution {
  // Do the following to get the status
  //get ID of status
  //get 'To status' value of all transitions where this status is in the from field
  // get readable name of those status'
  //compare readable with expected

  let expectation = `Status can only transition to expected statuses`;

  if (!expectedStatus.transitionTo) {
    return TestExecution.buildTestExecution(
      expectation,
      TestResult.Skip,
      "Skip test, no expectation defined"
    );
  }
  expectedStatus.transitionTo.sort();
  expectation = `Status can only transition to "${expectedStatus.transitionTo}"`;

    const statusExists = checkStatusExists(status, expectation);
  if (statusExists.result == TestResult.Fail) return statusExists;

  const readableTargetStatuses = getReadableTransitionsFromThisStatus(status, workflow);

    const result = checkEquality(
    "Transition conditions match",
    expectedStatus.transitionTo,
    readableTargetStatuses
  );

    return TestExecution.buildTestExecution(
    expectation,
    result.testOk ? TestResult.Pass : TestResult.Fail,
    result.resultDetail
  );
}

export function checkStatusOnlyAcceptsTransitionFrom(
  expectedStatus: JiraStatus,
  status: any,
  workflow: any
): TestExecution {
  // Do the following to get the status
  //get ID of status
  //get 'From status' value of all transitions where this status is in the To field
  // get readable name of those status'
  //compare readable with expected

  let expectation = `Status only accepts transitions from expected statuses`;

  if (!expectedStatus.transitionFrom) {
    return TestExecution.buildTestExecution(
      expectation,
      TestResult.Skip,
      "Skip test, no expectation defined"
    );
  }
  expectedStatus.transitionFrom.sort();
  expectation = `Status only accepts transition from "${expectedStatus.transitionFrom}"`;

    const statusExists = checkStatusExists(status, expectation);
  if (statusExists.result == TestResult.Fail) return statusExists;

  const readablePreStatuses = getReadableTransitionsToThisStatus(status, workflow);

    const result = checkEquality(
    expectation,
    expectedStatus.transitionFrom,
    readablePreStatuses
  );

    return TestExecution.buildTestExecution(
    expectation,
    result.testOk ? TestResult.Pass : TestResult.Fail,
    result.resultDetail
  );
}

export function getTransitionTos(status: JiraApiStatus, workflow: any): any {
  //get 'To status' value of all transitions where this status is in the from field

  //TODO: define a proper interface for actual transitions and stop using 'any'
  // the current interface is for transition expectations
  const allIds = (workflow.transitions as any[])
    .filter((transition) => transition.from.includes(status.id))
    .map((transition) => transition.to);

  return allIds;
}

function getReadableTransitionsFromThisStatus(
  status: JiraApiStatus,
  workflow: any
) {
  const statusIds = getTransitionTos(status, workflow);
  const readableIds = getReadableStatuses(statusIds, workflow).sort();
  return readableIds;
}

function getReadableTransitionsToThisStatus(
  status: JiraApiStatus,
  workflow: any
) {
  const statusIds = getTransitionFroms(status, workflow);
  const readableIds = getReadableStatuses(statusIds, workflow).sort();
  return readableIds;
}

export function getTransitionFroms(status: JiraApiStatus, workflow: any): any {
  //get 'From status' value of all transitions where this status is in the from field

  //TODO: define a proper interface for actual transitions and stop using 'any'
  // the current interface is for transition expectations
  const allIds = (workflow.transitions as any[])
    .filter((transition) => transition.to == status.id)
    .map((transition) => transition.from);

  return allIds;
}
// export function checkTransitionConditions(
//   expectedTransition: JiraWorkflowTransition,
//   transition: any
// ): TestExecution {
//   const expectation = `Transition conditions match`;

//   if (!expectedTransition.rules || !expectedTransition.rules.conditions)
//     return TestExecution.buildTestExecution(
//       expectation,
//       TestResult.Skip,
//       "Skip test, no expectation defined"
//     );

//   const transitionExists = checkTransitionExists(transition, expectation);
//   if (transitionExists.result == TestResult.Fail) return transitionExists;

//   if (!transition.rules || !transition.rules.conditions) {
//     return TestExecution.buildTestExecution(
//       expectation,
//       TestResult.Fail,
//       "Condition rules were undefined"
//     );
//   }
//   const result = checkEquality(
//     "Transition conditions match",
//     expectedTransition.rules.conditions,
//     transition.rules.conditions
//   );

//   return TestExecution.buildTestExecution(
//     expectation,
//     result.testOk ? TestResult.Pass : TestResult.Fail,
//     result.resultDetail
//   );
// }
