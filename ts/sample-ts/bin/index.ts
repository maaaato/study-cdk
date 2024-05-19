#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import { Vpc, InstanceType, SubnetType } from "aws-cdk-lib/aws-ec2";
import { Role, ServicePrincipal, ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { Cluster, KubernetesVersion } from "aws-cdk-lib/aws-eks";
import * as s3 from "aws-cdk-lib/aws-s3";

export class EKS101Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const vpc = new Vpc(this, "vpc", {
    //   cidr: "192.168.0.0/16",
    //   natGateways: 1,
    //   subnetConfiguration: [
    //     {
    //       cidrMask: 24,
    //       name: "Public1",
    //       subnetType: SubnetType.PUBLIC,
    //     },
    //     {
    //       cidrMask: 24,
    //       name: "Public2",
    //       subnetType: SubnetType.PUBLIC,
    //     },
    //     {
    //       cidrMask: 24,
    //       name: "Private1",
    //       subnetType: SubnetType.PRIVATE_ISOLATED,
    //     },
    //     {
    //       cidrMask: 24,
    //       name: "Private2",
    //       subnetType: SubnetType.PRIVATE_ISOLATED,
    //     },
    //   ],
    // });

    const eksRole = new Role(this, "eksRole", {
      assumedBy: new ServicePrincipal("eks.amazonaws.com"),
    });
    // // eksRole.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
    // cdk.Tags.of(eksRole).add("DeletionPolicyUpdated", "RETAIN");
    // eksRole.addManagedPolicy(
    //   ManagedPolicy.fromAwsManagedPolicyName("AmazonEKSClusterPolicy")
    // );
    // eksRole.addManagedPolicy(
    //   ManagedPolicy.fromAwsManagedPolicyName("AmazonEKSServicePolicy")
    // );

    const cluster = new Cluster(this, "cluster", {
      // vpc: vpc,
      mastersRole: eksRole,
      clusterName: "boringWozniak",
      version: KubernetesVersion.of("1.24"),
      defaultCapacity: 0,
    });
    // cdk.Tags.of(cluster).add("DeletionPolicyUpdated", "RETAIN");

    // const bucket = new s3.Bucket(this, "Bucket", {
    //   removalPolicy: cdk.RemovalPolicy.RETAIN,
    //   // autoDeleteObjects: true,
    // });

    // cluster.addCapacity("capacity", {
    //   desiredCapacity: 0,
    //   instanceType: new InstanceType("m5.large"),
    // });
    // cluster.addResource("resource", deployment, service);
  }
}

const app = new cdk.App();
new EKS101Stack(app, "EKS101Stack", {
  env: {
    region: "ap-northeast-1",
  },
});
app.synth();
