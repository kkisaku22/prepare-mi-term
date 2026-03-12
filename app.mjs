import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Hello my name is karel im 25 years old  and I m in dev ')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})