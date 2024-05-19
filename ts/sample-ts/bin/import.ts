#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as s3 from "aws-cdk-lib/aws-s3";
// import { Role, ServicePrincipal, ManagedPolicy } from "aws-cdk-lib/aws-iam";
// import { Cluster, KubernetesVersion } from "aws-cdk-lib/aws-eks";

export class VPCStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, "dummy-s3", {
      bucketName: "dummy-s3-845672212599",
    });

    const vpc = new ec2.Vpc(this, "VPC", {
      cidr: "10.0.0.0/16",
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "cdk-test-subnet-public1-ap-northeast-1a",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "cdk-test-subnet-public2-ap-northeast-1c",
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    const cfnPublicSubnet1 = vpc.publicSubnets[0].node
      .defaultChild as ec2.CfnSubnet;
    cfnPublicSubnet1.addPropertyOverride("CidrBlock", `10.0.0.0/24`);
    const cfnPublicSubnet2 = vpc.publicSubnets[1].node
      .defaultChild as ec2.CfnSubnet;
    cfnPublicSubnet2.addPropertyOverride("CidrBlock", `10.1.16.0/24`);

    // const vpc = new ec2.CfnVPC(this, "vpc", {
    //   cidrBlock: "172.31.0.0/16",
    //   tags: [{ key: "Name", value: "vyos" }],
    // });

    // //InternetGateway
    // const igw = new ec2.CfnInternetGateway(this, "igw", {});
    // new ec2.CfnVPCGatewayAttachment(this, "igwAttachment", {
    //   internetGatewayId: igw.ref,
    //   vpcId: vpc.ref,
    // });

    // //PublicSubnet
    // const subnetPublic1a = new ec2.CfnSubnet(this, "SubnetPublic1a", {
    //   cidrBlock: "172.31.0.0/20",
    //   vpcId: vpc.ref,
    //   availabilityZone: "ap-northeast-1a",
    //   mapPublicIpOnLaunch: true,
    //   tags: [{ key: "Name", value: "vyos" }],
    // });

    // const subnetPublic1c = new ec2.CfnSubnet(this, "SubnetPublic1c", {
    //   cidrBlock: "172.31.16.0/20",
    //   vpcId: vpc.ref,
    //   availabilityZone: "ap-northeast-1c",
    //   mapPublicIpOnLaunch: true,
    //   tags: [{ key: "Name", value: "vyos_app" }],
    // });
  }
}

const app = new cdk.App();
new VPCStack(app, "VPCStack", {
  env: {
    region: "ap-northeast-1",
  },
});
// app.synth();
