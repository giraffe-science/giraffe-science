import * as cdk from "@aws-cdk/core";

export interface PatientScienceEnv extends cdk.Environment {
    name: string,
    // If set to false, deleting a database, for example, would also delete the data
    protectFromDataDeletion: boolean
}
