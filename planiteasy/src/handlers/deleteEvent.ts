import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

// Initialize the DynamoDB client
const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);

export const deleteEventHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required path parameter: id." }),
      };
    }

    const command = new DeleteCommand({
      TableName: process.env.DYNAMODB_TABLE || "",
      Key: { id },
      // Optional: Add a condition to ensure the item exists before deletion
      ConditionExpression: "attribute_exists(id)",
    });

    await dynamoDB.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: "Event deleted successfully.",
        deletedEventId: id
      }),
    };
  } catch (error: any) {
    console.error("Error deleting event:", error);
    
    // Handle conditional check failure (item doesn't exist)
    if (error.name === 'ConditionalCheckFailedException') {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Event not found." }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};