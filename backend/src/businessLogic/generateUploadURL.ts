import 'source-map-support/register'

import { APIGatewayProxyEvent } from 'aws-lambda'
import { createLogger } from '../utils/logger'
import { parseUserId } from '../auth/utils';
import { updateTodoURL } from '../dataLayer/updateTodoURL';
import { getAttachmentURL } from '../fileStorage/getAttachmentURL';

const logger = createLogger('http')


export async function generateUploadURL(event: APIGatewayProxyEvent): Promise<String> {

  const userId = parseUserId(event.headers.Authorization.split(' ')[1]);
  const todoId = event.pathParameters.todoId
  

  logger.info('BLL update todo attachment URL: ' + todoId);

  //Create attachment upload URL
  const uploadURL = await getAttachmentURL(todoId);

  //Update todo URL in database
  await updateTodoURL(todoId, userId)
  
  return uploadURL;

}