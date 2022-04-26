//Requires
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const AppointmentService = require('./service/AppointmentService')
const { get } = require('jquery')


//expres e ejs
app.set('view engine', 'ejs')
app.use(express.static('public'))

//Body-Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//MongoDB com mongoose
mongoose.connect("mongodb://localhost:27017/Agendamento").then(() => {
    console.log('Servidor conectado')
}).catch(err => {
    console.log(err)
})

//Rotas


app.get('/', (req,res) =>{
    res.render('index')
})

app.get('/Cadastro', (req, res) =>{
    res.render('create')
})


app.post('/create', async (req, res) =>{

     var status = await AppointmentService.Create(
        req.body.name,
        req.body.email,
        req.body.cpf,
        req.body.date,
        req.body.time   
    )

    if(status){
        res.redirect('/')
    }else{
        res.send('Ocorreu um erro')
    }
})

app.get('/GetCalendar', async(req, res) =>{
    var appointment = await AppointmentService.GetAll(false)
    res.json(appointment)
})


app.get('/event/:id', async(req,res) =>{
    var appos = await AppointmentService.GetById(req.params.id)
    res.render('event', {appos})
})

app.post('/finish', async(req, res) =>{
    var id = req.body.id

    var result = await AppointmentService.Finishid(id)

    if(result == true){

        res.redirect('/')
    }
})

app.get('/List', async(req, res) =>{

     //await AppointmentService.Search('Julio.12@gmail.com')

    var appos = await AppointmentService.GetAll(true)
    res.render('List',{appos})

})

app.get('/search', async(req,res)=>{

    var appos = await AppointmentService.Search(req.query.search)
    res.render('List',{appos})
})


//Loop de envio de E-mail

var time = (1000 * 60) * 3;

setInterval(async () => {

    await AppointmentService.SendNotification();

}, 6000)




//Conexao com a internet
app.listen(7070, () =>{
    console.log('Conectado com a internet !!!')
})