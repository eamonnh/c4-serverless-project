import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
//import { DynamoDB } from 'aws-sdk';
import { parseUserId } from '../../auth/utils';
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient();

const todosTable = process.env.TODOS_TABLE
const todosIndex = process.env.INDEX_NAME
const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
 try {
      
      //Get the userid from the jwtToken
      const userId = parseUserId(event.headers.Authorization.split(' ')[1]);
      logger.info('UserId from JwtToken ' + userId)

      // Filter for current user and use an INDEX for improved performance
      //const params = {
      //  TableName: todosTable,
      //  IndexName: todosIndex,
      //  FilterExpression: 'userId=:u',
      //  ExpressionAttributeValues: { ':u': userId }
      //};

      const todosList = await docClient
      .query({
        TableName: todosTable,
        IndexName: todosIndex,
        KeyConditionExpression: 'userId=:u',
        ExpressionAttributeValues: {
          ':u': userId
        }
      })
      .promise()

      // Return SUCCESS
      logger.info('Get TODOs Successful!');
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ items: todosList.Items })
      }
    }
    catch (e) 
    {
    logger.error('Get TODOs Failed!', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }
}
