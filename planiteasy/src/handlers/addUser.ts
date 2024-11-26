import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB, CognitoIdentityServiceProvider } from "aws-sdk";
import { UserModel } from "../models/UserModel";

const dynamoDb = new DynamoDB.DocumentClient();
const cognito = new CognitoIdentityServiceProvider();

export const addUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is missing." }),
      };
    }

    const requestBody: UserModel = JSON.parse(event.body);

    // Validate required fields
    if (!requestBody.id || !requestBody.name || !requestBody.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields in user data." }),
      };
    }

    const timestamp = new Date().toISOString();

    // Step 1: Create user in Cognito
    const cognitoParams = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID || "",
      Username: requestBody.email, // Use email as the username
      UserAttributes: [
        { Name: "email", Value: requestBody.email },
        { Name: "name", Value: requestBody.name },
      ],
    };

    await cognito.adminCreateUser(cognitoParams).promise();

    // Step 2: Store user in DynamoDB
    const user: UserModel = {
      ...requestBody,
      createdAt: timestamp,
    };

    const dbParams = {
      TableName: process.env.USERS_DYNAMODB_TABLE || "",
      Item: user,
    };

    await dynamoDb.put(dbParams).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User created successfully." }),
    };
  } catch (error) {
    console.error("Error adding user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating user.",
        error: error.message,
      }),
    };
  }
};
