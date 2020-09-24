import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem';
import { v4 as uuid } from 'uuid';
import { createLogger } from '../../utils/logger'
import { DynamoDB } from 'aws-sdk';

const todosTable = process.env.TODOS_TABLE
const todosIndex = process.env.INDEX_NAME
const logger = createLogger('http')
const docClient = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
 try {
      
      // Filter for current user and use an INDEX for improved performance
      const params = {
        TableName: todosTable,
        IndexName: todosIndex,
        FilterExpression: 'userId=:u',
        ExpressionAttributeValues: { ':u': 'Test123' }
      };

      const todosList = await docClient.scan(params).promise();

      // Return SUCCESS
      logger.info('Get TODOs Successful!');
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ items: todosList.Items })
      }
    }
    catch (e) 
    {
    logger.error('Get TODOs Failed!', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }
}
