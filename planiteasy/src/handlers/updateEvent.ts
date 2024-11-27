import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { EventModel } from "../models/EventModel";

// Initialize the DynamoDB client
const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);

export const updateEventHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is missing." }),
      };
    }

    const requestBody: Partial<EventModel> = JSON.parse(event.body);
    const { id } = event.pathParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required path parameter: id." }),
      };
    }

    // Build update expression dynamically based on provided fields
    const updateFields = new Map<string, any>();
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Handle optional fields
    if (requestBody.name !== undefined) {
      updateFields.set('#name', ':name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = requestBody.name;
    }
    if (requestBody.date !== undefined) {
      updateFields.set('#date', ':date');
      expressionAttributeNames['#date'] = 'date';
      expressionAttributeValues[':date'] = requestBody.date;
    }
    if (requestBody.description !== undefined) {
      updateFields.set('#description', ':description');
      expressionAttributeNames['#description'] = 'description';
      expressionAttributeValues[':description'] = requestBody.description;
    }
    if (requestBody.location !== undefined) {
      updateFields.set('#location', ':location');
      expressionAttributeNames['#location'] = 'location';
      expressionAttributeValues[':location'] = requestBody.location;
    }
    if (requestBody.participants !== undefined) {
      updateFields.set('#participants', ':participants');
      expressionAttributeNames['#participants'] = 'participants';
      expressionAttributeValues[':participants'] = requestBody.participants;
    }

    // Always update the updatedAt timestamp
    updateFields.set('#updatedAt', ':updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    if (updateFields.size === 1) { // Only updatedAt was set
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No fields to update were provided." }),
      };
    }

    const updateExpression = 'set ' + Array.from(updateFields.entries())
      .map(([key, value]) => `${key} = ${value}`)
      .join(', ');

    const command = new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE || "",
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
      // Add condition to ensure item exists
      ConditionExpression: "attribute_exists(id)",
    });

    const result = await dynamoDB.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Event updated successfully.",
        updatedEvent: result.Attributes,
      }),
    };
  } catch (error: any) {
    console.error("Error updating event:", error);

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