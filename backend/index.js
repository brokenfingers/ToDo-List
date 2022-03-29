import express, { json } from 'express';
import cors from 'cors';
import { readFile, writeFile } from 'fs';
import getRoute from './controllers/get.js'
import deleteRoute from './controllers/delete.js'
import postRoute from './controllers/post.js'
import putRoute from './controllers/put.js'

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/', getRoute)
app.use('/', deleteRoute)
app.use('/', postRoute)
app.use('/', putRoute)


app.listen(5001, () => {
    console.log('serveris veikia')
})