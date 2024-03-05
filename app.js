const express = require('express')
const cors = require('cors')
const bp = require('body-parser')
const con = require('./db/mysql')
const { hashPassword } = require('./db/hash')
const app = express()

app.use(bp.urlencoded({extended: true}))
app.use(bp.json())
app.use(cors())

app.get('/users/data', (req, res) => {
    con.query('SELECT * FROM users', (err, result) => {
        res.send(result)
    })
})

app.get('/users/data/:id', (req, res) => {
    const id = req.params.id
    con.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
        if(err) throw err
       
        if(result.length === 0) return res.status(404).json({status: false, msg: "not found data"})
        res.status(200).send(result[0])
    })
})

app.post('/users/add/data', (req, res) => {
    con.query('INSERT INTO users(name, password) VALUES (?, ?)', [req.body.username, hashPassword(req.body.password)], (err, result) => {
        if(err) throw err;
        res.status(201).json({status: true})
    })
})

app.put('/users/:id/change-password', (req, res) => {
    const {id} = req.params
    const {password} = req.body

    con.query('UPDATE users SET password = ? WHERE id = ?', [hashPassword(password), id], (err, result) => {
        if(err) return res.status(500).json({ status: false, msg: "Internal Server Error" });

        if(result.length === 0) res.status(404).json({status: false, msg: "data not found"});
        res.status(201).json({message: 'Data Updated'});
    })
})

app.delete('/delete/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';

    con.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ status: false, msg: "Internal Server Error" });

        if (result.length === 0) return res.status(404).json({ status: false, msg: "Data not found" });

        res.status(200).json({ status: true, msg: "User deleted successfully" });
    });
});


app.listen(5000, (err) => {
    if(err) throw err;
    console.log('Server running in localhost:5000')
})


