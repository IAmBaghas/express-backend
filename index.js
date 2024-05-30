const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const cors = require('cors')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');
app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`)
})