import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
//import { DynamoDB } from 'aws-sdk';

const todosTable = process.env.TODOS_TABLE
const bucket = process.env.ATTACHMENTS_S3_BUCKET
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient();
//const docClient = new DynamoDB.DocumentClient();

//Update Todo attachment URL in database
export async function updateTodoURL(todoId: String, userId: String) {

  const attachmentUrl = `https://${bucket}.s3-eu-west-1.amazonaws.com/${todoId}.png`;

  await docClient.update({
    TableName: todosTable,
    Key: { todoId, userId },
    UpdateExpression: 'set #attachmentUrl = :a',
    ExpressionAttributeValues: {
        ':a': attachmentUrl
    },
    ExpressionAttributeNames: {
        '#attachmentUrl': 'attachmentUrl'
    }
  }).promise();
}