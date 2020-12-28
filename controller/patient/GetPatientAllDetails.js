const dbconnection = require('../../database/mysqlConnection')

module.exports.GetPatientAllDetails = async (req,res)=>{
    patient_id = req.query.patient_id; 
   const query = dbconnection.query(`
   select p.patient_id, patient_name, last_name, FLOOR(DATEDIFF( CURRENT_DATE() , dob)/365) as patient_age , gender,
DATE_FORMAT(created_date_time, "%d/%m/%Y") as patient_create_date, NoWounds, Causes_Of_Wound,
height,weight,coalesce(blood_group,'NA') as blood_group, blood_pressure, heart_rate,
ceil(coalesce(avg(healing_score),-1)) as healingscore,
   case when ceil(coalesce(avg(healing_score),-1)) = -1 then 'Unknown'
   when ceil(coalesce(avg(healing_score),-1)) = 1 then 'Good'
   when ceil(coalesce(avg(healing_score),-1)) = 2 then 'Normal'
   when ceil(coalesce(avg(healing_score),-1)) = 3 then 'Poor'
   when ceil(coalesce(avg(healing_score),-1)) = 4 then 'Bad'
   when ceil(coalesce(avg(healing_score),-1)) = 5 then 'Worse'
   end as healingLabel,
t.temperature,
concat("https://s3-ap-southeast-1.amazonaws.com/trails.wound.management/Patient_Image/",p.patient_image_file_location) as patient_image_file_location
from wound.patient  p 
left outer join ( select patient_id,upload_id from wound.upload )u on u.patient_id = p.patient_id
left outer join ( select max(upload_id) as upload_id, wound_id from wound.doc_wound_details group by wound_id ) dwd on dwd.upload_id = u.upload_id
left outer join ( select max(upload_id) as last_upload_patient, patient_id from wound.upload group by patient_id) up on up.patient_id = p.patient_id
left outer join wound.temperature t on t.upload_id = up.last_upload_patient 
left outer join wound.wound_healing_score hs on hs.upload_id = dwd.upload_id
left outer join (
  select count(wound_id) as NoWounds, patient_id , GROUP_CONCAT(distinct wound_reason) as Causes_Of_Wound
  from wound.wound
  group by patient_id
  )w 
  on p.patient_id = w.patient_id
where p.patient_id =?;`,[patient_id],  function (err, data, field){
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

