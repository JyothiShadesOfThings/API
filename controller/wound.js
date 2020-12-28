const dbconnection = require('../database/mysqlConnection')

module.exports.wound = async (req,res)=>{
    patient_id = req.query.patient_id;
    dbconnection.query("SELECT distinct wound_id, wound_location, wound_reason from wound.wound where patient_id = ?",[patient_id],  function (err, data, field){
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

