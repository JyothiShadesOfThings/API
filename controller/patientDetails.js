const dbconnection = require('../database/mysqlConnection')

module.exports.patientDetails = async (req,res)=>{
    user_name = req.query.user_name;
    console.log(req.uuid);
    let unique_patients = [];
    dbconnection.query("SELECT  distinct patient_id, patient_name from wound.patient where created_by = ?",[user_name],  function (err, data, field){
      if(err){
        res.status(400)
          res.json({ success : false , msg: 'error occured'});
          return;
      }
     else{
       unique_patients = data;
     }
  } )
    dbconnection.query(`select p.patient_id, patient_name , wd.upload_id, w_cnt , w.wound_id , file_name
    from wound.patient p
    left outer join wound.wound w
    on p.patient_id = w.patient_id
    left outer join (
    select max(upload_id) as upload_id, count(*) as w_cnt , wound_id 
    from wound.doc_wound_details group by wound_id) wd 
    on wd.wound_id = w.wound_id
    left outer join (
    select ufn.file_name, ufn.upload_id , ufn.upload_filename_id
    from wound.upload_filename ufn inner join
    ( 
    select max(upload_filename_id) as upload_filename_id,upload_id
     from wound.upload_filename
     group by upload_id
     ) tempt on tempt.upload_filename_id = ufn.upload_filename_id
     )uf
    on uf.upload_id = wd.upload_id
    where p.created_by =?`,[user_name],  function (err, data, field){
      if(err){console.log("Error encountered")}
      res.json({ success : true , msg: 'succesful query', response_data: data,unique_patients });

    } )
   
    
    return; 
   
}

