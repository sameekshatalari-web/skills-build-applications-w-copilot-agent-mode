import express from 'express'
import { connectDatabase } from './config/database.js'
import apiRouter from './routes/index.js'

const app = express()
const port = 8000
const codespaceName = process.env.CODESPACE_NAME
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-${port}.app.github.dev`
  : `http://localhost:${port}`

app.use(express.json())
app.use((request, response, next) => {
  const origin = request.headers.origin
  if (origin === 'http://localhost:5173' || origin?.endsWith('.app.github.dev')) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  }
  if (request.method === 'OPTIONS') {
    response.sendStatus(204)
    return
  }
  next()
})
app.use('/api', apiRouter)

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

async function startServer(): Promise<void> {
  try {
    await connectDatabase()
    app.listen(port, () => {
      console.log(`Octofit API listening on port ${port}`)
      console.log(`API base URL: ${apiBaseUrl}`)
    })
  } catch (error) {
    console.error('Error connecting to octofit_db:', error)
    process.exitCode = 1
  }
}

void startServer()