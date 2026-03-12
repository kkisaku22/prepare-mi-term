import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello my name is karel im 25 years old  and I m in dev ')
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})