import 'source-map-support/register'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import { parseUserId } from '../auth/utils';
import { updateTodoInDatabase } from '../dataLayer/updateTodo';

const logger = createLogger('http')

export async function updateTodo(event: APIGatewayProxyEvent) {

  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const userId = parseUserId(event.headers.Authorization.split(' ')[1]);

  //Call DLL to update todo in database
  logger.info('BLL Updating Todo',{todoId});
  await updateTodoInDatabase(updatedTodo, todoId, userId);

}