const appointment = require('../models/Appointment')
const mongoose = require('mongoose')
const AppointmentFatcory = require('../Factories/AppointementFactory')
const NodeEmail = require('nodemailer')


const Appo = mongoose.model('Appointment', appointment)



class AppointmentService{
    async Create(name, email, cpf, date, time){
        var newAppo = new Appo({
            name,
            email,
            cpf,
            date,
            time,
            finishid: false,
            notified: false
        })
        try{
            await newAppo.save();
            return true
        }catch(err){
            console.log(err)
            return false
        }
    }


    async GetAll(showFinishid){
        if(showFinishid){
            return await Appo.find()
        }else{
        var appos = await Appo.find({"finishid":  false})
        var appointments = [];

        appos.forEach(appointment =>{

            if(appointment.date != undefined){
                appointments.push(AppointmentFatcory.Build(appointment))
            }    
        })  

        return appointments;
        }

    }

    async GetById(id){
        try {
            var event = await Appo.findById({'_id': id})
            return event
        } catch (error) {
            console.log(error)
        }
        
    }


    async Finishid(id){
        try {
            await Appo.findByIdAndUpdate(id, {finishid : true})
            return true
        } catch (error) {
            console.log(error)
            return false
        }
        

    }

    async Search(query){
        try {
            var appos = await Appo.find().or([{email: query}, {cpf: query}])
            return appos
            
        } catch (error) {
            console.log(error)
            return []
        }
    }


    async SendNotification(){
        var appos = await this.GetAll(false)

        var tranport = NodeEmail.createTransport({
            host:"smtp.mailtrap.io",
            port: 25,
            auth: {
                user: "67648d4cccc89f",
                pass: "59ea166e6e0292"
            }
        })


        appos.forEach(async app =>{

        
            var date = app.start.getTime()
            var hour = 1000 * 60 * 60
            var gap = date - Date.now()

            if(gap <= hour){

                if(!app.notified){

                    await Appo.findByIdAndUpdate(app.id,{notified: true})

                    tranport.sendMail({
                        from: 'Joseph Binal <DoctorJosephBinal@gmail.com>',
                        to: app.email,
                        subject:"Aviso de Horario",
                        text:"Sua consulta marca para hoje esta proxima a ser atendida, por favor compareca ao consultorio em 1h"
                    }).then(() => {

                    }).catch(err =>{
                        console.log(err)
                    })

                }
            }
        })
    }
}

module.exports =  new AppointmentService();