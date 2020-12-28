const dbconnection = require('../database/mysqlConnection')

module.exports.Get_All_Patients = async (req,res)=>{
    user_id = req.query.user_id; 
   const query = dbconnection.query(`select coalesce(whs.healing_score,-1) as wound_healing_score,
   coalesce(whs.healing_score,'No Score Yet') as wound_healing_score_label,
   p.SugarLevel, p.body_temp, p.height, p.weight, p.blood_group, p.blood_pressure, p.heart_rate, 'No Allergies' as Allergies,'No  Medical History' as MedicalHistory, w.Causes_Of_Wound,  p.last_name,
      p.patient_id,
      concat("https://s3-ap-southeast-1.amazonaws.com/trails.wound.management/Patient_Image/" , p.patient_image_file_location) as patient_image_file_location, p.patient_name, gender, FLOOR(DATEDIFF( CURRENT_DATE() , dob)/365) as Age , 
      DATE_FORMAT(p.created_date_time, "%b %d %Y") as created_date ,coalesce(NoWounds,0) as NoWounds, 
      case when LastUpdate is null then 'No Activity' when DATEDIFF(CURRENT_DATE() , DATE(LastUpdate)) < 7 then CONCAT(FLOOR(DATEDIFF(CURRENT_DATE() , DATE(LastUpdate))) ,' days ago')
      when DATEDIFF(CURRENT_DATE() , DATE(LastUpdate)) < 30 then CONCAT(FLOOR(DATEDIFF(CURRENT_DATE() , DATE(LastUpdate))/7 ),' weeks ago')
      else CONCAT(FLOOR(DATEDIFF(CURRENT_DATE() , DATE(LastUpdate))/30) ,' months ago') end as Last_Activity
      from wound.patient  p
      left outer join (
      select count(wound_id) as NoWounds, patient_id , GROUP_CONCAT(distinct wound_reason) as Causes_Of_Wound
      from wound.wound
      group by patient_id
      )w 
      on p.patient_id = w.patient_id
      left outer join(
      select max(upload_datetime) as LastUpdate, max(upload_id) as latest_upload_id, patient_id
      from wound.upload
      group by patient_id
      )u
      left outer join wound.wound_healing_score whs
      on whs.upload_id = u.latest_upload_id
      on u.patient_id = p.patient_id
      where p.archive = false and p.created_by = ?;`,[user_id],  function (err, data, field){
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

