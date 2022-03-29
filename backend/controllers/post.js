import express from 'express'
import { readFile, writeFile } from 'fs';
import { database } from '../config/index.js'


const postRoute = express.Router()


postRoute.post('/add-task', (req, res) => {
    let task = req.query.task;
    let dataArr = [];
    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: "failed", message: "nepavyko nuskaityti failo" })
            return
        }

        data = JSON.parse(data)

        let id = data.length > 0 ? data[data.length - 1].id + 1 : 0
        data.push({ id, task, done: false })
        writeFile(database, JSON.stringify(data), 'utf8', (err) => {
            if (err) {
                res.json({ status: "failed", message: "nepavyko įrasyti failo" })
            } else {
                res.json({ status: "success", message: "nduomenys sekmingai irasyti" })

            }

        })
    })

})


export default postRoute;