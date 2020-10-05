import 'source-map-support/register'
import { TodoItem } from '../models/TodoItem';
import { DynamoDB } from 'aws-sdk';

const todosTable = process.env.TODOS_TABLE
const docClient = new DynamoDB.DocumentClient();

//Add the new Todo to the database
export async function createTodoInDatabase(todoItem: TodoItem) {
  await docClient.put({
      TableName: todosTable,
      Item: todoItem
  }).promise();

}