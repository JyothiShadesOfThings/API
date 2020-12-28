const dbconnection = require('../database/mysqlConnection')

module.exports.patient = async (req,res)=>{
    user_name = req.body.username;
   
    dbconnection.query("SELECT distinct patient_id, patient_name from wound.patient where created_by = ?",[user_name],  function (err, data, field){
        if(err){
            res.json({ success : false , msg: 'error occured'});
            return;
        }
       else{
         res.json({ success : true , return_data: data});
                return;
       }
    } )
  //  res.json({ success : true , msg: 'incorrect user_name'});
    
    return; 
   
}

