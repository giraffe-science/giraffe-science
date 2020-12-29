import * as ec2 from "@aws-cdk/aws-ec2";
import {InstanceClass, InstanceSize, InstanceType} from "@aws-cdk/aws-ec2";
import * as rds from "@aws-cdk/aws-rds";
import {PostgresEngineVersion} from "@aws-cdk/aws-rds";
import * as cdk from "@aws-cdk/core";
import {Duration, RemovalPolicy, StackProps} from "@aws-cdk/core";
import 'source-map-support/register';
import {PatientScienceEnv} from "./util";

export interface PostgresProps extends StackProps {
    env: PatientScienceEnv,
    vpc: ec2.Vpc
}

export class PostgresStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, env: string, props: PostgresProps) {
        super(scope, id, {
            description: "Scientific Giraffe Postgres DB",
            ...props
        });

        new rds.DatabaseInstance(this, "database", {
            databaseName: "patient_science",
            instanceIdentifier: `patientScience-${env}`,
            // Around 1am PST
            preferredBackupWindow: "09:00-10:00",
            // Around midnight PST
            preferredMaintenanceWindow: "Mon:08:00-Mon:09:00",
            credentials: rds.Credentials.fromGeneratedSecret('patient_science_admin'),
            vpc: props.vpc,

            // Avoid losing data in prod
            backupRetention: props.env.protectFromDataDeletion
                ? Duration.days(30)
                : Duration.days(2),
            deleteAutomatedBackups: !props.env.protectFromDataDeletion,
            deletionProtection: true,
            removalPolicy: props.env.protectFromDataDeletion ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,

            // Try to leave our options open to migrate to Aurora serverless,
            // which at time of writing only supports v10.12
            allowMajorVersionUpgrade: false,
            autoMinorVersionUpgrade: false,
            engine: rds.DatabaseInstanceEngine.postgres({
                version: PostgresEngineVersion.of("10", "12")
            }),

            // Free tier is a t2.micro, with 20GB of storage
            instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            allocatedStorage: 20,


            availabilityZone: undefined,
            multiAz: false,
            storageType: undefined,
            iops: undefined,
            processorFeatures: undefined,

        });
    }
}
