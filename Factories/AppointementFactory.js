class AppointmentFatcory{


    Build(SimpleAppointement){
        //Data
        var day = SimpleAppointement.date.getDate() + 1;
        var moth = SimpleAppointement.date.getMonth();
        var year = SimpleAppointement.date.getFullYear();

        //Hora
        var hour = Number.parseInt(SimpleAppointement.time.split(":")[0]);
        var minutes = Number.parseInt(SimpleAppointement.time.split(":")[1]);

        var NewDate = new Date(year,moth,day,hour,minutes, 0, 0)
        
        
        var appo = {
            id: SimpleAppointement.id,
            title: SimpleAppointement.name + " - CPF: " + SimpleAppointement.cpf,
            start: NewDate,
            end: NewDate,
            notified: SimpleAppointement.notified,
            email: SimpleAppointement.email
        }

        return appo
    }
}

module.exports = new AppointmentFatcory();