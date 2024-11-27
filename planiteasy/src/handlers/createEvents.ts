import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { EventModel } from "../models/EventModel";
import { randomUUID } from "node:crypto";

// Initialize the DynamoDB client
const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);

export const createEventHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is missing." }),
      };
    }

    const requestBody: Partial<EventModel> = JSON.parse(event.body);

    // Basic validation
    if (!requestBody.name || !requestBody.date || !requestBody.location || !requestBody.createdBy) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields in event data." }),
      };
    }

    const timestamp = new Date().toISOString();
    const eventId = randomUUID();

    const newEvent: EventModel = {
      id: eventId,
      name: requestBody.name,
      description: requestBody.description,
      date: requestBody.date,
      location: requestBody.location,
      createdBy: requestBody.createdBy,
      participants: requestBody.participants || 0,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const command = new PutCommand({
      TableName: process.env.DYNAMODB_TABLE || "",
      Item: newEvent,
    });

    await dynamoDB.send(command);

    return {
      statusCode: 201,
      body: JSON.stringify({ 
        message: "Event added successfully.",
        eventId: eventId
      }),
    };
  } catch (error) {
    console.error("Error adding event:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error." }),
    };
  }
};