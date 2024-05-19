import { expect, countResources, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as SampleStack from "../../lib/sample-ts-stack";

test("Vpc", () => {
  const app = new cdk.App();
  const stack = new SampleStack.SampleTsStack(app, "SampleTsStack");

  expect(stack).to(countResources("AWS::EC2::VPC", 1));
  expect(stack).to(
    haveResource("AWS::EC2::VPC", {
      CidrBlock: "10.0.0.0/16",
      Tags: [{ Key: "Name", Value: "undefined-undefined-vpc" }],
    })
  );
});
