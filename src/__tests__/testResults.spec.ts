import {TestExecution, TestResult} from '../testResults'

test('buildTestExecution returns vald passing execution', async () => {
  
    const result = TestExecution.buildTestExecution('My expectation', TestResult.Pass, 'Some detail');
    const expectedReturnObject: TestExecution = {
        detail: 'Some detail',
        expectDescription: 'My expectation',
        result: TestResult.Pass,
      };
  expect(result).toEqual(expectedReturnObject);
});

test('buildTestExecution returns vald failing execution', async () => {
  
    const result = TestExecution.buildTestExecution('My expectation', TestResult.Fail, 'Some detail');
    const expectedReturnObject: TestExecution = {
        detail: 'Some detail',
        expectDescription: 'My expectation',
        result: TestResult.Fail,
      };
  expect(result).toEqual(expectedReturnObject);
});

