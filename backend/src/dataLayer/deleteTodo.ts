import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DynamoDB } from 'aws-sdk';

const todosTable = process.env.TODOS_TABLE
const XAWS = AWSXRay.captureAWS(AWS)
//const docClient = new XAWS.DynamoDB.DocumentClient();
const docClient = new DynamoDB.DocumentClient();

//Delete Todo from database
export async function deleteTodoInDatabase(todoId: String, userId: String) {
  const params = {
    TableName: todosTable,
    Key: { todoId, userId }
  };
  await docClient.delete(params).promise();
}