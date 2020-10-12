import 'source-map-support/register'

import { APIGatewayProxyEvent } from 'aws-lambda'
import { createLogger } from '../utils/logger'
import { parseUserId } from '../auth/utils';
import { deleteTodoInDatabase } from '../dataLayer/deleteTodo';

const logger = createLogger('http')

export async function deleteTodo(event: APIGatewayProxyEvent) {

  const userId = parseUserId(event.headers.Authorization.split(' ')[1]);
  const todoId = event.pathParameters.todoId

  //Delete Todo in database
  logger.info('deleting Todo item: ' + todoId);
  await deleteTodoInDatabase(todoId, userId);

}