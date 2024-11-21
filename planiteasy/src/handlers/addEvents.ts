import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const createEventHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is missing." }),
      };
    }

    // Parse the JSON body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid JSON format in request body." }),
      };
    }
    const { id, name, date } = requestBody;
    if (!id || !name || !date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields: id, name, date." }),
      };
    }
    const params = {
      TableName: process.env.DYNAMODB_TABLE || "",
      Item: {
        id,
        name,
        date
      }
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Event Plan added successfully" }),
    };
  } catch (error) {
    console.error("Error adding event plan:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to add event plan" }),
    };
  }
};
