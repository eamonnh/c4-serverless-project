import 'source-map-support/register'

import { APIGatewayProxyEvent } from 'aws-lambda'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoItem } from '../models/TodoItem';
import { v4 as uuid } from 'uuid';
import { createLogger } from '../utils/logger'
import { parseUserId } from '../auth/utils';
import { createTodoInDatabase } from '../dataLayer/createTodo';

const logger = createLogger('http')

export async function createTodo(event: APIGatewayProxyEvent,
  createTodoRequest: CreateTodoRequest): Promise<TodoItem> {

  const todoId = uuid.v4();
  const userId = parseUserId(event.headers.Authorization.split(' ')[1]);
  const createdAt = new Date(Date.now()).toISOString();

  //Build the new Todo Item object
  const todoItem = {
      userId,
      todoId,
      createdAt,
      done: false,
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate
  };

  //Add new Todo to database
  logger.info('Storing new item: ' + JSON.stringify(todoItem));
  await createTodoInDatabase(todoItem);

  return todoItem;
}