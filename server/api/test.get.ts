export default defineEventHandler(async (event) => {
  return {
    message: "Test endpoint working",
    timestamp: new Date().toISOString(),
    method: event.node.req.method,
    url: event.node.req.url
  }
})
