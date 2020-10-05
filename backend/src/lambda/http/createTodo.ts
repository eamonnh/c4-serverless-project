import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem';
import { createLogger } from '../../utils/logger'
import { createTodo } from '../../businessLogic/createTodo';

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logger.info('Creating new TODO')
    
    //Create new todo item
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    //Call Business Logic Layer to create new Todo item
    const todoItem: TodoItem = await createTodo(event, newTodo);

    // Return SUCCESS
    logger.info('Create TODO Successful!', { todoItem });
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ item: todoItem })
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
