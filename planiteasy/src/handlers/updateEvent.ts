import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const updateEventHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is missing." }),
      };
    }

    const requestBody = JSON.parse(event.body);
    const { id, name, date } = requestBody;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required field: id." }),
      };
    }

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.DYNAMODB_TABLE || "",
      Key: { id },
      UpdateExpression: "set #name = :name, #date = :date",
      ExpressionAttributeNames: {
        "#name": "name",
        "#date": "date",
      },
      ExpressionAttributeValues: {
        ":name": name,
        ":date": date,
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Event Plan updated successfully.",
        updatedItem: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error updating event plan:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
