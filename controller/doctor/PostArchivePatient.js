const dbconnection = require('../../database/mysqlConnection')

module.exports.PostArchivePatient = async (req,res)=>{
    const patient_id = req.query.patient_id; 
   
   
   const query = dbconnection.query(`update  wound.patient
   set archive = true where patient_id = ?
   `,[patient_id],  function (err, data, field){
        if(err){
          res.status(400)
            res.json({ success : false , msg: 'error occured'});
            return;
        }
       else{
         res.status(200);
         res.json({ success : true , return_data: data});
                return;
       }
    } )
    console.log(query.sql);
  //  res.json({ success : true , msg: 'incorrect user_name'});
    
    return; 
   
}
