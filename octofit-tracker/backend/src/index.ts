import express from 'express'
import { connectDatabase } from './config/database.js'
import apiRouter from './routes/index.js'

const app = express()
const port = Number(process.env.PORT ?? 8000)

app.use(express.json())
app.use('/api', apiRouter)

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

async function startServer(): Promise<void> {
  try {
    await connectDatabase()
    app.listen(port, () => {
      console.log(`Octofit API listening on port ${port}`)
    })
  } catch (error) {
    console.error('Error connecting to octofit_db:', error)
    process.exitCode = 1
  }
}

void startServer()