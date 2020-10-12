import 'source-map-support/register'
//import * as AWSXRay from 'aws-xray-sdk'
import { DynamoDB } from 'aws-sdk';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const todosTable = process.env.TODOS_TABLE
const docClient = new DynamoDB.DocumentClient();
const logger = createLogger('http')
//const XAWS = AWSXRay.captureAWS(AWS)
//const docClient = new XAWS.DynamoDB.DocumentClient();

//Update Todo in database
export async function updateTodoInDatabase(updatedTodo: UpdateTodoRequest, todoId: String, userId: String) {

  logger.info('DLL Updating Todo',{todoId});

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
}