import * as cdk from "aws-cdk-lib";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as assert from "assert";
import * as _ from "lodash";
import { Construct } from "constructs";

export interface DemoSecretsManagerProps {
  names: DemoSecretsManagerNames;
}

export type DemoSecretsManagerNames = string[];

export class DemoSecretsManager extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DemoSecretsManagerProps) {
    super(scope, id);

    const validateProps = (props: DemoSecretsManagerProps) => {
      assert(
        props.names.length > 0,
        "env should have actual value. empty string is invalid"
      );
    };

    validateProps(props);

    props.names.map((name) => {
      new secretsmanager.Secret(this, `${name}`, {
        secretObjectValue:{

        }
        secretName: name,
      });
    });
  }
}
