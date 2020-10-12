import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/deleteTodo';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = event.pathParameters.todoId
  const logger = createLogger('http')
  
  try {
    logger.info('Starting delete of Todo ' + todoId)

    await deleteTodo(event);
    
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
