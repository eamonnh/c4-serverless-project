import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { generateUploadURL } from '../../businessLogic/generateUploadURL';

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  try {
    
    //Create upload URL and update database with attachment URL
    const uploadUrl = await generateUploadURL(event);

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
    logger.error('Url create failed!', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }
}