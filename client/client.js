const express = require('express')
const app = express()
const fs= require('fs')
const {uuid} = require('uuidv4');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { response } = require('express');
const client = require('../server/connection');
// const client = require('../server/connection')
// const db = client.db('tugas_mongo_crud')





app.set('view engine', 'ejs')
app.set('views', './public/views')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.get('/', async (req,res)=>{
    // const data = fs.readFileSync('./data/data.json', 'utf-8')
    // const dataParsed = JSON.parse(data)
    try {
        const response = await axios.get('http://localhost:3000/api/users');
        // const users = 
        console.log(response.data);
        res.render('main', {
            pageTitle: "Main Page",
            data: response.data.data
        })
      } catch (error) {
        console.error(error);
      }
    
})

app.get('/add', (req,res)=>{
    res.render('add', {
        pageTitle: "User Register"
    })
})

app.post('/add', async (req,res)=>{
    // await client.connect()
    const { name , email, password }=req.body
    const newData = {
        name,
        email,
        password
        }
    const response = await axios.post('http://localhost:3000/api/user/add', newData);
    console.log(response.newData)  
    // const user = await db.collection('users').findOne({ _id:ObjectId(req.params.id) })
    if(response.status === 201){
        res.redirect('/')
    }else{
        res.redirect('/add')
    }
})

app.get('/edit', async (req,res) => {
    const{ id } = req.query
    const response = await axios.get(`http://localhost:3000/api/user/${id}`);
    if(response.data.status === "success"){
        res.render('edit.ejs', {
            pageTitle:"Edit",
            data: response.data.data
        })
    }
})

// Edit
app.post('/edit', async (req, res) => {
    const {id} = req.query
    const {name, email, password} = req.body
    const dataToEdit = {
        name:name,
        email:email,
        password:password
    }
    const response = await axios.put(`http://localhost:3000/api/user/${id}`, dataToEdit);
    if (response.data.status === "success"){
        res.redirect("/")
    }else{
        res.redirect(`/edit?id=${id}`)
    }
})

app.post('/delete', async (req, res) => {
    const {id} = req.query
    const response = await axios.delete(`http://localhost:3000/api/user?id=${id}`);
    if(response.data.status === "success"){
        res.redirect('/')
    }
})






const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})