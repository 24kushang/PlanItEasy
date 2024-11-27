import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  ScanCommand,
  ScanCommandInput 
} from "@aws-sdk/lib-dynamodb";
import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from 'aws-lambda';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const getEventsHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { limit, lastKey } = event.queryStringParameters || {};
    const paginationLimit = limit ? parseInt(limit, 10) : 10;

    const params: ScanCommandInput = {
      TableName: process.env.DYNAMODB_TABLE || "",
      Limit: paginationLimit,
    };

    // Handle pagination
    if (lastKey) {
      params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastKey));
    }

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Update this based on your CORS requirements
      },
      body: JSON.stringify({
        items: result.Items,
        lastKey: result.LastEvaluatedKey 
          ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) 
          : null,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Update this based on your CORS requirements
      },
      body: JSON.stringify({ 
        error: error || 'Internal Server Error'
      }),
    };
  }
};