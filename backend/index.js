import express, { json } from 'express';
import cors from 'cors';
import { readFile, writeFile } from 'fs';


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
const database = './database.json';

app.get('/', (req, res) => {
    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: "failed", message: "nepavyko nuskaityti failo" })
            return
        }
        data = JSON.parse(data)
        res.json({ status: "success", data })
    })
})


app.get('/:id', (req, res) => {
    let id = req.params.id;
    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: "failed", message: "nepavyko nuskaityti failo" })
            return
        }
        data = JSON.parse(data).filter(element => element.id.toString() == id)
        res.json({ status: 'success', data, mode: 'edit' })
    })
})

app.delete('/delete-task/:id', (req, res) => {
    let id = req.params.id;
    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: "failed", message: "nepavyko nuskaityti failo" })
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
                res.json({ status: "success", message: "Uzduotis su nurodytu id sekmingai istrinta, ir irasyta" })
            }
        })
    })
})


app.put('/edit-todo/:id', (req, res) => {
    let { id, value } = req.query;

    if (value == '') {
        res.json({ status: "failed", message: "Neivesta informacija" })
        return
    }


    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: "failed", message: "nepavyko nuskaityti failo" })
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
            res.json({ status: "sucess", message: "Atnaujinimas sekmingai irasytas" })
        })


    })



})

app.delete('/mass-delete', (req, res) => {
    let ids = req.body.ids


    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: "failed", message: "nepavyko nuskaityti failo" })
            return
        }
        data = JSON.parse(data);

        data = data.filter(element => !ids.includes(element.id.toString()))



        writeFile(database, JSON.stringify(data), 'utf8', err => {
            if (err) {
                res.json({ status: "failed", message: "Nepavyko irasyti failo su istrintu id" })
                return
            } else {
                res.json({ status: "success", message: "Uzduotis su nurodytu id sekmingai istrinta, ir irasyta" })
            }
        })
    })

})

app.put('/mark-done/:id', (req, res) => {
    let id = req.params.id;
    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: "failed", message: "nepavyko nuskaityti failo" })
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

app.post('/add-task', (req, res) => {
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


app.listen(5001, () => {
    console.log('serveris veikia')
})