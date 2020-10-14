import 'source-map-support/register'
import { TodoItem } from '../models/TodoItem';
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
//import { DynamoDB } from 'aws-sdk';

const todosTable = process.env.TODOS_TABLE
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient();
//const docClient = new DynamoDB.DocumentClient();

//Add the new Todo to the database
export async function createTodoInDatabase(todoItem: TodoItem) {
  await docClient.put({
      TableName: todosTable,
      Item: todoItem
  }).promise();

}