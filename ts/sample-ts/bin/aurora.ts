import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as constructs from "constructs";

class AuroraStack extends cdk.Stack {
  constructor(scope: constructs.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC for the Aurora DB
    const vpc = new ec2.Vpc(this, "AuroraVPC", {
      maxAzs: 2, // Specify the desired number of Availability Zones
      subnetConfiguration: [
        {
          name: "public-subnet",
          subnetType: ec2.SubnetType.PUBLIC, // Public subnet for NAT Gateway (if needed)
        },
        {
          name: "private-subnet",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED, // Private subnet for Aurora DB
        },
      ],
    });

    //     // Create a security group for the Aurora DB
    //     const dbSecurityGroup = new ec2.SecurityGroup(
    //       this,
    //       "AuroraDBSecurityGroup",
    //       {
    //         vpc,
    //         description: "Security group for Aurora DB",
    //       }
    //     );

    //     // Allow inbound connections to the Aurora DB on the desired port (e.g., 3306 for MySQL)
    //     dbSecurityGroup.addIngressRule(
    //       ec2.Peer.ipv4("126.120.153.46/32"),
    //       ec2.Port.tcp(3306),
    //       "Allow inbound on port 3306"
    //     );

    //     // Create the Aurora DB cluster in the private subnet
    //     const dbCluster = new rds.DatabaseCluster(this, "AuroraDBCluster", {
    //       defaultDatabaseName: "mydatabase", // Replace with your desired database name
    //       //   engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
    //       engine: rds.DatabaseClusterEngine.auroraMysql({
    //         version: rds.AuroraMysqlEngineVersion.of("8.0.mysql_aurora.3.04.0"),
    //       }),
    //       credentials: {
    //         username: "root", // Replace with your desired master username
    //         password: cdk.SecretValue.unsafePlainText("IeThu#a|qu9"), // Replace with your desired password
    //       },
    //       parameterGroup: rds.ParameterGroup.fromParameterGroupName(
    //         this,
    //         "ParameterGroup",
    //         "default.aurora-mysql8.0"
    //       ),
    //       instances: 1, // Number of instances in the cluster
    //       instanceProps: {
    //         vpc,
    //         instanceType: ec2.InstanceType.of(
    //           ec2.InstanceClass.BURSTABLE4_GRAVITON,
    //           ec2.InstanceSize.MEDIUM
    //         ),
    //         securityGroups: [dbSecurityGroup],
    //         vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    //         // parameterGroup: instanceParameterGroup,
    //       },
    //     });
  }
}

const app = new cdk.App();
new AuroraStack(app, "AuroraStack");
