const dbconnection = require('../../database/mysqlConnection')

module.exports.GetAllPatientHighLevelDetailsForDoctor = async (req,res)=>{
  user_id = req.query.user_id; 
   const query = dbconnection.query(`
   select p.patient_id, patient_name, last_name, 
   FLOOR(DATEDIFF( CURRENT_DATE() , dob)/365) as patient_age , gender,
   DATE_FORMAT(created_date_time, "%d/%m/%Y") as patient_create_date,
   ceil(coalesce(avg(healing_score),-1)) as healingscore,
   case when ceil(coalesce(avg(healing_score),-1)) = -1 then 'Unknown'
   when ceil(coalesce(avg(healing_score),-1)) = 1 then 'Good'
   when ceil(coalesce(avg(healing_score),-1)) = 2 then 'Normal'
   when ceil(coalesce(avg(healing_score),-1)) = 3 then 'Poor'
   when ceil(coalesce(avg(healing_score),-1)) = 4 then 'Bad'
   when ceil(coalesce(avg(healing_score),-1)) = 5 then 'Worse'
   end as healingLabel,
   concat("https://s3-ap-southeast-1.amazonaws.com/trails.wound.management/Patient_Image/",p.patient_image_file_location) as patient_image_file_location
   from wound.patient  p 
   left outer join ( select patient_id,upload_id from wound.upload  )u on u.patient_id = p.patient_id
   left outer join ( select max(upload_id) as upload_id, wound_id from wound.algo_wound_details group by wound_id ) dwd on dwd.upload_id = u.upload_id
   left outer join ( select max(upload_id) as last_upload_patient, patient_id from wound.upload) up on up.patient_id = p.patient_id
   left outer join wound.temperature t on t.upload_id = up.last_upload_patient 
   left outer join wound.wound_healing_score hs on hs.upload_id = dwd.upload_id
   where p.created_by = ? and p.archive = false
   group by p.patient_id,patient_name, last_name , FLOOR(DATEDIFF( CURRENT_DATE() , dob)/365)  , gender,
   DATE_FORMAT(created_date_time, "%d/%m/%Y") , concat("https://s3-ap-southeast-1.amazonaws.com/trails.wound.management/Patient_Image/",p.patient_image_file_location) 
;`,[user_id],  function (err, data, field){
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

