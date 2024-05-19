import { expect, countResources, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as SampleStack from "../../lib/sample-ts-stack";

test("Subnet", () => {
  const app = new cdk.App();
  const stack = new SampleStack.SampleTsStack(app, "SampleTsStack");

  expect(stack).to(countResources("AWS::EC2::Subnet", 6));
  expect(stack).to(
    haveResource("AWS::EC2::Subnet", {
      CidrBlock: "10.0.11.0/24",
      AvailabilityZone: "ap-northeast-1a",
      Tags: [{ Key: "Name", Value: "undefined-undefined-subnet-public-1a" }],
    })
  );
  expect(stack).to(
    haveResource("AWS::EC2::Subnet", {
      CidrBlock: "10.0.12.0/24",
      AvailabilityZone: "ap-northeast-1c",
      Tags: [{ Key: "Name", Value: "undefined-undefined-subnet-public-1c" }],
    })
  );
});
