const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3001', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize WebSocket server
  // We'll import this dynamically to avoid TypeScript issues
  import('./src/lib/websocket/server.js').then(({ initializeWebSocket }) => {
    initializeWebSocket(server)
    console.log('WebSocket server initialized on /api/socket')
  }).catch((err) => {
    console.error('Failed to initialize WebSocket:', err)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
    console.log(`> WebSocket available on ws://${hostname}:${port}/api/socket`)
  })
})
