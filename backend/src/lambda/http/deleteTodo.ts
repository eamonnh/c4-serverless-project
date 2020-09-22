import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { DynamoDB } from 'aws-sdk';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = event.pathParameters.todoId
  const todosTable = process.env.TODOS_TABLE
  const logger = createLogger('http')
  const docClient = new DynamoDB.DocumentClient();

 
  try {

    const params = {
      TableName: todosTable,
      Key: { todoId }
    };

    await docClient.delete(params).promise();

    // Return SUCCESS
    logger.info('Delete TODO Successful!', { todoId });
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  }
  catch (e) 
  {
    logger.error('Delete TODO Failed!', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }
}
