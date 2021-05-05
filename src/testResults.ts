export class TestExecution {
  expectDescription: string;
  result: TestResult;
  detail: string;

  constructor(expectDescription: string, result: TestResult, detail: string) {
    this.expectDescription = expectDescription;
    this.result = result;
    this.detail = detail;
  }

  public static buildTestExecution(
    expectation: string,
    result: TestResult,
    executionDetail: string
  ): TestExecution {
    const execution = new TestExecution(expectation, result, executionDetail);

    // results.push(execution);
    console.log(execution);
    return execution;
  }
}

export enum TestResult {
  Pass = "Pass",
  Fail = "Fail",
  Skip = "Skip",
}

export class TestResultLog {
  workflowCheckDescription: string;
  checks: HealthCheckGroup[];
  executionDuration?: number;

  constructor(workflowCheckDescription: string) {
    this.workflowCheckDescription = workflowCheckDescription;
    this.checks = [];
  }

  public add(healthCheckGroup: HealthCheckGroup) {
    this.checks.push(healthCheckGroup);
  }

  public toString(): string {
    let output: string[] = [];
    output.push(this.workflowCheckDescription);

    for (let healthCheckGroup of this.checks) {
      output.push(`  ${healthCheckGroup.toString(4)}`);
    }

    output.push("");
    output.push(`Checks completed in ${this.executionDuration} milliseconds.`);

    return output.join("\n");
  }
}

export class HealthCheckGroup {
  healthCheckGroupDescription: string;
  checks: TestExecution[];

  constructor(healthCheckGroupDescription: string) {
    this.healthCheckGroupDescription = healthCheckGroupDescription;
    this.checks = [];
  }

  public add(testExecution: TestExecution) {
    this.checks.push(testExecution);
  }

  public toString(startingIndent: number = 0): string {
    let output: string[] = [];
    const indent = " ".repeat(startingIndent);
    output.push(this.healthCheckGroupDescription);

    for (let healthCheck of this.checks) {
      if (healthCheck.result == TestResult.Skip) continue;

      let resultCharacter = healthCheck.result == TestResult.Pass ? "✓" : "✕";
      output.push(
        `${indent}${resultCharacter} ${healthCheck.expectDescription}`
      );

      if (healthCheck.result == TestResult.Fail) {
        output.push(`${indent}  ⤷ ${healthCheck.detail}`);
      }
    }

    return output.join("\n");
  }

  public toHTML = (): string => {
    throw new Error("not yet implemented");
  };
}
