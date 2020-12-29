import * as ec2 from "@aws-cdk/aws-ec2";
import {DefaultInstanceTenancy, NatProvider} from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";
import {StackProps} from "@aws-cdk/core";
import 'source-map-support/register';

export interface VpcProps extends StackProps {
}

export class VpcStack extends cdk.Stack {
    readonly vpc: ec2.Vpc;

    constructor(scope: cdk.Construct, id: string, env: string, props: VpcProps) {
        super(scope, id, {
            description: "Scientific Giraffe VPC",
            ...props
        });
        this.vpc = new ec2.Vpc(this, "mainVpc", {

            // We chose an arbitrary CIDR other than 10.0.0.0 on the off chance we need to pair with another VPC
            // (which is likely to have used the default 10.0.0.0 CIDR, which would clash)
            cidr: "25.0.0.0/16",
            defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
            enableDnsHostnames: false,
            enableDnsSupport: false,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'ingress',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: 'application',
                    subnetType: ec2.SubnetType.PRIVATE,
                }
            ],

            natGatewayProvider: NatProvider.gateway(),

            // only used for dynamo and s3
            gatewayEndpoints: {},
            // not needed
            maxAzs: undefined,
            // For logging network traffic- not needed
            flowLogs: undefined,
            // VPN- not used
            vpnConnections: undefined,
            vpnGateway: undefined,
            vpnGatewayAsn: undefined,
            vpnRoutePropagation: undefined
        });
    }
}
