// big comments generated with https://fsymbols.com/generators/tarty/
import { getReadableStatuses, checkEquality } from "../helpers";

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

test("checkEquality returns passing test when values match", async () => {
  const inputObject = {
    item1: "hello",
    item2: ["hi", 123],
    item3: 7,
  };

  const inputCompareObject = {
    item1: "hello",
    item2: ["hi", 123],
    item3: 7,
  };
  const result = checkEquality(
    "My expectation",
    inputObject,
    inputCompareObject
  );
  const expectedResult = {
    testOk: true,
    resultDetail: "Test successful",
  };

  expect(result).toEqual(expectedResult);
});

test("checkEquality returns passing test when values match", async () => {
  const inputObject = {
    item1: "Bonjour",
    item2: ["hi", 123],
    item3: 7,
  };

  const inputCompareObject = {
    item1: "hello",
    item2: ["hi", 123],
    item3: 7,
  };
  const result = checkEquality(
    "Failing expectation",
    inputObject,
    inputCompareObject
  );

  expect(result.testOk).toEqual(false);
  expect(result.resultDetail).toContain("Expected:");
  expect(result.resultDetail).toContain("Got:");
});

test("getReadableStatuses from returns text form of IDs", async () => {
  const actualWorkflow = API_RESPONSE.values[0];
  //   const actualTransition = actualWorkflow.transitions[0];
  const inputIds = [
    "10002",
    "10012",
    "10032",
    "10047",
    "10049",
    "10051",
    "10057",
  ];

  const expectedResult = [
    "Ready to Dev",
    "Abandoned",
    "Code Review",
    "Draft",
    "To Refine",
    "Dev In Progress",
    "Testing",
  ];

  const result = getReadableStatuses(inputIds, actualWorkflow);
  expect(result.sort).toEqual(expectedResult.sort);
});
