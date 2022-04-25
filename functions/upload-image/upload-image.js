// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  try {
    const body = JSON.parse(event.body)
    const name = body.name
    const base64 = body.base64
    return {
      statusCode: 200,
      body: JSON.stringify({ name, base64 }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
