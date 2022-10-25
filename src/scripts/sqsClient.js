import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool  } from "@aws-sdk/credential-provider-cognito-identity";
import { SQSClient } from "@aws-sdk/client-sqs";
const REGION = "us-east-2";
const IdentityPoolId = "us-east-2:48695028-1aee-43d5-8738-7b4f5006798b";

const sqsClient = new SQSClient({
    region: REGION,
    credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: REGION }),
        identityPoolId: IdentityPoolId
    }),
});
export { sqsClient };