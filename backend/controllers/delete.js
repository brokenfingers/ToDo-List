import express, { json } from 'express';
import cors from 'cors';
import { readFile, writeFile } from 'fs';
import { database } from '../config/index.js'

const deleteRoute = express.Router();

deleteRoute.delete('/delete-task/:id', (req, res) => {
    let id = req.params.id;
    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: "failed", message: "Nepavyko nuskaityti failo" })
            return
        }
        data = JSON.parse(data);
        let indx = null
        data.forEach((element, index) => {
            if (element.id.toString() == id) {
                indx = index;
                return
            }
        });

        if (indx == null) {
            res.json({ status: "failed", message: "Nepavyko rasti uzduoties tokiu id" })
            return
        }
        data.splice(indx, 1);
        writeFile(database, JSON.stringify(data), 'utf8', err => {
            if (err) {
                res.json({ status: "failed", message: "Nepavyko irasyti failo su istrintu id" })
                return
            } else {
                res.json({ status: "success", message: "Uzduotis sekmingai istrinta" })
            }
        })
    })
})

deleteRoute.delete('/mass-delete', (req, res) => {
    let ids = req.body.ids
    console.log(ids)

    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: "failed", message: "Nepavyko nuskaityti failo" })
            return
        }
        data = JSON.parse(data);

        data = data.filter(element => !ids.includes(element.id.toString()))



        writeFile(database, JSON.stringify(data), 'utf8', err => {
            if (err) {
                res.json({ status: "failed", message: "Nepavyko irasyti failo su istrintu id" })
                return
            } else {
                res.json({ status: "success", message: "Uzduotys sekmingai istrintos" })
            }
        })
    })

})

export default deleteRoute;