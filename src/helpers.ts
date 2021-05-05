import * as _ from "lodash";
import { JiraApiStatus } from "./interfaces";

export function checkEquality(
  expectationDescription: string, //TODO: remove this as it's not required
  expected: any,
  actual: any): { testOk: boolean; resultDetail: string; } {
  const testOk = _.isEqual(expected, actual);
  const resultDetail = testOk
    ? "Test successful"
    : `Expected: "${expected.toString()}". Got: "${actual.toString()}"`;

  return { testOk, resultDetail };
}
export function getReadableStatuses(statusIds: string[], workflow: any): string[] {
  let readableFrom = [];
  for (let ts of statusIds) {
    readableFrom.push(lookupStatus(workflow.statuses, ts));
  }
  return readableFrom;
}
export function lookupStatus(wfStatuses: any, id: string): string {
  const jiraStatus = wfStatuses.find((status: JiraApiStatus) => status.id == id);
  return jiraStatus.name;
}
