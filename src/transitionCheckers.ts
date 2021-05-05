import { JiraWorkflowTransition } from "./interfaces";
import { checkEquality, getReadableStatuses, lookupStatus } from "./helpers";
import { TestExecution, TestResult } from "./testResults";

export function getTransition(
    workflow: any,
    expectedTransition: JiraWorkflowTransition
  ) {
    console.log(`Getting transition: ${expectedTransition.name}`);
    return workflow.transitions.find(
      (transition: any) => transition.name === expectedTransition.name
    );
  }
  
  export function checkTransitionExists(
    transition: any,
    customExpectation?: string
  ): TestExecution {
    const expectation = customExpectation
      ? customExpectation
      : "Transition exists";
    const result = transition ? TestResult.Pass : TestResult.Fail;
    const detail = transition ? "Test successful" : "Transition was undefined";
    return TestExecution.buildTestExecution(expectation, result, detail);
  }
  
  export function checkTransitionConditions(
    expectedTransition: JiraWorkflowTransition,
    transition: any
  ): TestExecution {
    const expectation = `Transition conditions match`;
  
    if (!expectedTransition.rules || !expectedTransition.rules.conditions)
      return TestExecution.buildTestExecution(
        expectation,
        TestResult.Skip,
        "Skip test, no expectation defined"
      );
  
    const transitionExists = checkTransitionExists(transition, expectation);
    if (transitionExists.result == TestResult.Fail) return transitionExists;
  
    if (!transition.rules || !transition.rules.conditions) {
      return TestExecution.buildTestExecution(
        expectation,
        TestResult.Fail,
        "Condition rules were undefined"
      );
    }
    const result = checkEquality(
      "Transition conditions match",
      expectedTransition.rules.conditions,
      transition.rules.conditions
    );
  
    return TestExecution.buildTestExecution(
      expectation,
      result.testOk ? TestResult.Pass : TestResult.Fail,
      result.resultDetail
    );
  }
  
  export function checkTransitionValidators(
    expectedTransition: JiraWorkflowTransition,
    transition: any
  ): TestExecution {
    const expectation = `Transition validators match`;
  
    if (!expectedTransition.rules || !expectedTransition.rules.validators)
      return TestExecution.buildTestExecution(
        expectation,
        TestResult.Skip,
        "Skip test, no expectation defined"
      );
  
    const transitionExists = checkTransitionExists(transition, expectation);
    if (transitionExists.result == TestResult.Fail) return transitionExists;
  
    if (!transition.rules || !transition.rules.validators) {
      return TestExecution.buildTestExecution(
        expectation,
        TestResult.Fail,
        "Validator rules were undefined"
      );
    }
  
    const result = checkEquality(
      "Transition validators match",
      expectedTransition.rules.validators,
      transition.rules.validators
    );
  
    return TestExecution.buildTestExecution(
      expectation,
      result.testOk ? TestResult.Pass : TestResult.Fail,
      result.resultDetail
    );
  }
  
  export function checkTransitionTo(
    expectedTransition: JiraWorkflowTransition,
    transition: any,
    workflow: any
  ): TestExecution {
    if (!expectedTransition.to) {
      const expectation = "Transition to status check";
      return TestExecution.buildTestExecution(
        expectation,
        TestResult.Skip,
        "Skip test, no expectation defined"
      );
    }
  
    const expectation = `Transitions to "${expectedTransition.to.toString()}" status`;
    const transitionExists = checkTransitionExists(transition, expectation);
    if (transitionExists.result == TestResult.Fail) return transitionExists;
  
    if (!transition.to) {
      return TestExecution.buildTestExecution(
        expectation,
        TestResult.Fail,
        '"To" configuration was undefined'
      );
    }
  
    let readableTo = lookupStatus(workflow.statuses, transition.to);
    const result = checkEquality(expectation, expectedTransition.to, readableTo);
  
    return TestExecution.buildTestExecution(
      expectation,
      result.testOk ? TestResult.Pass : TestResult.Fail,
      result.resultDetail
    );
  }
  
  export function checkTransitionFrom(
    expectedTransition: JiraWorkflowTransition,
    transition: any,
    workflow: any
  ): TestExecution {
    if (!expectedTransition.from) {
      const expectation = "Transition from status check";
      return TestExecution.buildTestExecution(
        expectation,
        TestResult.Skip,
        "Skip test, no expectation defined"
      );
    }
  
    const expectation = `Accepts transition from "${expectedTransition.from.toString()}"`;
    const transitionExists = checkTransitionExists(transition, expectation);
    if (transitionExists.result == TestResult.Fail) return transitionExists;
  
    if (!transition.from) {
      return TestExecution.buildTestExecution(
        expectation,
        TestResult.Fail,
        '"From" configuration was undefined'
      );
    }
  
    const readableFrom = getReadableStatuses(transition.from, workflow).sort();
    const result = checkEquality(
      expectation,
      expectedTransition.from.sort(),
      readableFrom
    );
  
    return TestExecution.buildTestExecution(
      expectation,
      result.testOk ? TestResult.Pass : TestResult.Fail,
      result.resultDetail
    );
  }