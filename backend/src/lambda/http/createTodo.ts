import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem';
import { v4 as uuid } from 'uuid';
import { createLogger } from '../../utils/logger'
import { DynamoDB } from 'aws-sdk';
import { parseUserId } from '../../auth/utils';

const todosTable = process.env.TODOS_TABLE
const logger = createLogger('http')
const docClient = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logger.info('Creating new TODO')
    
    //Get the userid from the jwtToken
    const userId = parseUserId(event.headers.Authorization.split(' ')[1]);
    logger.info('UserId from JwtToken ' + userId)

    //Create new todo item
    const { name, dueDate }: CreateTodoRequest = JSON.parse(event.body)
    const newTodo: TodoItem = {
      todoId: uuid(),
      userId: userId,
      createdAt: JSON.stringify(new Date()),
      name: name,
      dueDate: dueDate,
      done: false
    }

    const params = {
      TableName: todosTable,
      Item: newTodo
    };

    await docClient.put(params).promise();

    // Return SUCCESS
    logger.info('Create TODO Successful!', { newTodo });
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ item: newTodo })
    }
  }
  catch (e) 
  {
    logger.error('Create TODO Failed!', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }
}
