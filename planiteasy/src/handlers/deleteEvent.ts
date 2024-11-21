import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const deleteEventHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required path parameter: id." }),
      };
    }

    const params: DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: process.env.DYNAMODB_TABLE || "",
      Key: { id },
    };

    await dynamoDb.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Event Plan deleted successfully." }),
    };
  } catch (error) {
    console.error("Error deleting event plan:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
