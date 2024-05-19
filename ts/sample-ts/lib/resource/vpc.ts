import * as cdk from "@aws-cdk/core";
import { CfnVPC } from "@aws-cdk/aws-ec2";

export class Vpc {
  public vpc: CfnVPC;
  constructor() {}

  public createResources(scope: cdk.Construct) {
    const stage = scope.node.tryGetContext("stage");
    const contextParam = scope.node.tryGetContext(stage);

    this.vpc = new CfnVPC(scope, "Vpc", {
      cidrBlock: "10.0.0.0/16",
      tags: [
        {
          key: "Name",
          value: `${contextParam.systemName}-${contextParam.envType}-vpc`,
        },
      ],
    });
  }
}
