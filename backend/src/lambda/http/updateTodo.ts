import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { DynamoDB } from 'aws-sdk';
import { parseUserId } from '../../auth/utils';

const todosTable = process.env.TODOS_TABLE
const logger = createLogger('http')
const docClient = new DynamoDB.DocumentClient();

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  try {

        logger.info('Updating todo ',{todoId});

        //Get the userid from the jwtToken
        const userId = parseUserId(event.headers.Authorization.split(' ')[1]);

        await docClient.update({
          TableName: todosTable,
          Key: { todoId, userId },
          UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
          ExpressionAttributeValues: {
              ':n': updatedTodo.name,
              ':due': updatedTodo.dueDate,
              ':d': updatedTodo.done
          },
          ExpressionAttributeNames: {
              '#name': 'name',
              '#dueDate': 'dueDate',
              '#done': 'done'
          }
      }).promise();

    // Return SUCCESS
    logger.info('Update TODO Successful!', { todoId });
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
    logger.error('Update TODO Failed!', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }

}
