import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const getEventsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { limit, lastKey } = event.queryStringParameters || {};
    const paginationLimit = limit ? parseInt(limit, 10) : 10;

    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: process.env.DYNAMODB_TABLE || "",
      Limit: paginationLimit,
    };

    // Handle pagination
    if (lastKey) {
      params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastKey));
    }

    const result = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: result.Items,
        lastKey: result.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null,
      }),
    };
  } catch (error) {
    console.error("Error fetching event plans:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
