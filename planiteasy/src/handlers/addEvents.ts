import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { EventModel } from "../models/EventModel";

const dynamoDb = new DynamoDB.DocumentClient();

export const addEventPlan = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is missing." }),
      };
    }

    const requestBody: EventModel = JSON.parse(event.body);

    // Basic validation
    if (!requestBody.id || !requestBody.name || !requestBody.date || !requestBody.location || !requestBody.createdBy) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields in event data." }),
      };
    }

    const params = {
      TableName: process.env.DYNAMODB_TABLE || "",
      Item: requestBody,
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Event added successfully." }),
    };
  } catch (error) {
    console.error("Error adding event:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error." }),
    };
  }
};
