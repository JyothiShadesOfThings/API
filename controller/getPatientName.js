const dbconnection = require('../database/mysqlConnection')


module.exports.getName = async (req,res)=>{
    patient_id = req.params.patient_id;

    dbconnection.query('Select patient_name,gender from wound.patient where patient_id =?',[patient_id],function(err,data,field){
        if(err){
            res.json({ success : false , msg: err});
        }
        res.json({
            success:true,
            name : data[0].patient_name,
            gender: data[0].gender,
        })
    })
}