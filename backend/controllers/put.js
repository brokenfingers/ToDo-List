import express from 'express'
import { readFile, writeFile } from 'fs';
import { database } from '../config/index.js'


const putRoute = express.Router()

putRoute.put('/edit-todo/:id', (req, res) => {
    let { id, value } = req.query;

    if (value == '') {
        res.json({ status: "failed", message: "Neivesta informacija" })
        return
    }


    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: "failed", message: "Nepavyko nuskaityti failo" })
            return
        }
        data = JSON.parse(data);
        data = data.map(element => {
            if (element.id.toString() == id) {
                element.task = value
            }
            return element
        })
        writeFile(database, JSON.stringify(data), 'utf8', err => {
            if (err) {
                res.json({ status: "failed", message: "Nepavyko irasyti atnaujinimo" })
                return
            }
            res.json({ status: "sucess", message: "Uzduotis atnaujinta" })
        })


    })



})


putRoute.put('/mark-done/:id', (req, res) => {
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

        data[indx].done = data[indx].done == false ? true : false;
        writeFile(database, JSON.stringify(data), 'utf8', err => {
            if (err) {
                res.json({ status: "failed", message: "Nepavyko irasyti failo su istrintu id" })
                return
            } else {
                res.json({ status: "success", message: "Uzduotis su nurodytu id pakeista i done, ir irasyta" })
            }
        })
    })
})

export default putRoute;