import express from 'express'
import { readFile, writeFile } from 'fs';
const getRoute = express.Router()
import { database } from '../config/index.js'
getRoute.get('/', (req, res) => {
    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: "failed", message: "Nepavyko nuskaityti failo" })
            return
        }
        data = JSON.parse(data)
        res.json({ status: "success", data })
    })
})


getRoute.get('/:id', (req, res) => {
    let id = req.params.id;
    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: "failed", message: "Nepavyko nuskaityti failo" })
            return
        }
        data = JSON.parse(data).filter(element => element.id.toString() == id)
        res.json({ status: 'success', data, mode: 'edit' })
    })
})

export default getRoute;