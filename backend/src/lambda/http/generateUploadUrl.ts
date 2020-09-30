import 'source-map-support/register'
import * as AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'

const logger = createLogger('http')
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const bucket = process.env.ATTACHMENTS_S3_BUCKET
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  try {
    const todoId = event.pathParameters.todoId

    const url = s3.getSignedUrl('putObject', {
      Bucket: bucket,
      Key: todoId,
      Expires: urlExpiration
    })

    //SUCCESS
    logger.info('Url created', { url });
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ url })
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