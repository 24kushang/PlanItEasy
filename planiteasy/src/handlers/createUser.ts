import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  PutCommand,
  PutCommandInput 
} from "@aws-sdk/lib-dynamodb";
import { UserModel } from "../models/UserModel";
import { randomUUID } from "node:crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const createUserHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          message: "Request body is missing." 
        }),
      };
    }

    const requestBody: Partial<UserModel> = JSON.parse(event.body);

    // Validate required fields
    if (!requestBody.name || !requestBody.email) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          message: "Missing required fields in user data." 
        }),
      };
    }

    const timestamp = new Date().toISOString();

    const user: UserModel = {
      userId: requestBody.userId || randomUUID(), // Use provided userId or generate a new one
      name: requestBody.name,
      email: requestBody.email,
      createdAt: timestamp,
      updatedAt: timestamp,
      eventsCreated: requestBody.eventsCreated || [],
      eventsParticipated: requestBody.eventsParticipated || [],
    };

    const params: PutCommandInput = {
      TableName: process.env.USERS_DYNAMODB_TABLE || "",
      Item: user,
    };

    await docClient.send(new PutCommand(params));

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        message: "User created successfully.",
        user: user 
      }),
    };

  } catch (error) {
    console.error("Error adding user:", error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: "Error creating user.",
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};