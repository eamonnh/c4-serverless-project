import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import * as AWSXRay from 'aws-xray-sdk'

const logger = createLogger('http')
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const bucket = process.env.ATTACHMENTS_S3_BUCKET
const XAWS = AWSXRay.captureAWS(AWS);
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

//const XAWS = AWSXRay.captureAWS(AWS)

export async function getAttachmentURL(todoId: String): Promise<String> {

    //Create the SignedURL
    logger.info('FileStorage. Create SignedUrl for TodoID ' + todoId)

    const uploadUrl = s3.getSignedUrl('putObject', {
      Bucket: bucket,
      Key: todoId + '.png',
      Expires: urlExpiration
    })

    logger.info('FileStorage. SignedURL is ' + uploadUrl)

    return uploadUrl;
}