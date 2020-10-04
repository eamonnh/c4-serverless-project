import 'source-map-support/register'
import * as AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { DynamoDB } from 'aws-sdk';
import { parseUserId } from '../../auth/utils';

const docClient = new DynamoDB.DocumentClient();
const logger = createLogger('http')
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const bucket = process.env.ATTACHMENTS_S3_BUCKET
const todosTable = process.env.TODOS_TABLE
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  try {
    const todoId = event.pathParameters.todoId
    const attachmentUrl = `https://${bucket}.s3-eu-west-1.amazonaws.com/${todoId}.png`;

    //Create the SignedURL
    logger.info('Create SignedUrl for TodoID ' + todoId)

    const uploadUrl = s3.getSignedUrl('putObject', {
      Bucket: bucket,
      Key: todoId + '.png',
      Expires: urlExpiration
    })

    logger.info('SignedUrl created successfully ' + uploadUrl)

    //Update the Todo item in the database with URL
    logger.info('Updating attachmentUrl attribute in database')

    //Get the userid from the jwtToken
    const userId = parseUserId(event.headers.Authorization.split(' ')[1]);

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

    //SUCCESS
    logger.info('Url created', { uploadUrl });
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ uploadUrl })
    }
  }
  catch (e) {
    logger.error('Url create Failed!', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }
}