#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import * as kms from "aws-cdk-lib/aws-kms";
import { Construct } from "constructs";
// import { DemoSecretsManager } from "../lib/demo";
import { randomBytes } from "node:crypto";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

const generateRandomString = () => randomBytes(10).toString("hex");

export class SecreteDemo extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new secretsmanager.Secret(this, "test", {
      secretObjectValue: {
        username: cdk.SecretValue.unsafePlainText("TEST"),
        password: cdk.SecretValue.unsafePlainText(generateRandomString()),
        // password: cdk.SecretValue.unsafePlainText(
        //   "AQICAHgLqBpP0rujqadmwKpeXAPBA661bQ/pzchTcm0+bA5cxwHiVhOd4hSnPEe3WFtCf8Y+AAAAbTBrBgkqhkiG9w0BBwagXjBcAgEAMFcGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMdC1OL5oE>"
        // ),
      },
      secretName: "Secrets_A",
      encryptionKey: kms.Key.fromKeyArn(
        this,
        "key",
        "arn:aws:kms:ap-northeast-1:845672212599:key/c1410721-0fdc-40f6-9f72-26bc1c22b04f"
      ),
    });
  }
}

const app = new cdk.App();

new SecreteDemo(app, "SecreteDemo", {});

// new DemoSecretsManager(app, "DemoSecretsManager", {
//   names: ["Secrets_A", "Secrets_B", "Secrets_C"],
// });
