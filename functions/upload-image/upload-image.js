const { Credentials } = require('aws-sdk')
const S3 = require('aws-sdk/clients/s3')

const s3Client = new S3({
  region: process.env.LINODE_OBJECT_STORAGE_REGION,
  endpoint: process.env.LINODE_OBJECT_STORAGE_ENDPOINT,
  sslEnabled: false,
  s3ForcePathStyle: true,
  credentials: new Credentials({
    accessKeyId: process.env.LINODE_OBJECT_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.LINODE_OBJECT_STORAGE_SECRET_ACCESS_KEY
  })
})

const uploadFileToS3 = async (name, data, type) => {
  const params = {
    Bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET,
    Key: name,
    Body: Buffer.from(data.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: type
  }

  return new Promise((resolve, reject) => {
    s3Client.upload(params, function(err, data) {
      if (err) {
        console.log(err.toString())
        reject({
          statusCode: 500,
          body: err.toString()
        })
      } else {
        resolve({
          statusCode: 200,
          body: data
        })
      }
    })
  })
}

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  try {
    const { name, base64, type } = JSON.parse(event.body)
    const response = await uploadFileToS3(name, base64, type)
    if (response.statusCode !== 200) {
      return {
        statusCode: response.statusCode,
        body: response.body,
      }
    } else {
      return {
        statusCode: response.statusCode,
        body: JSON.stringify({ name: name, url: response.body.Location })
      }
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
