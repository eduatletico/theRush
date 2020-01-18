const express = require('express')
const cors = require('cors')
const rushing = require('./rushing.json')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  return res.json(rushing)
})

app.listen(3333)
