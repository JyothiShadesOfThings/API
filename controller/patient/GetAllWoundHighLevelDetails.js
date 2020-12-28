const dbconnection = require('../../database/mysqlConnection')

require('dotenv').config()
let env = process.env

module.exports.GetAllWoundHighLevelDetails = async (req,res)=>{
    const patient_id = req.query.patient_id; 
   const query = dbconnection.query(`select u.pain_level ,  w.wound_id, w.patient_id, w.wound_location, 
   w.wound_side, w.wound_type, concat("`+env.AWSBUCKET+`After_Cleaning/Raw/Image/",ufn.file_name) as file_name, date_format(u.upload_datetime,'%d/%m/%Y') as Last_Activity_date,
   dwd2.wound_stage, 
   round(dwd2.wound_area * coalesce(pxl2cm,.2)* coalesce(pxl2cm,.2),2) as wound_area , coalesce(whs.healing_score,-1) as healing_score,
   case when coalesce(healing_score,-1) = -1 then 'Unknown'
   when coalesce(healing_score,-1) = 1 then 'Good'
   when coalesce(healing_score,-1) = 2 then 'Normal'
   when coalesce(healing_score,-1) = 3 then 'Poor'
   when coalesce(healing_score,-1) = 4 then 'Bad'
   when coalesce(healing_score,-1) = 5 then 'Worse'
  end as healingLabel
      from wound w 
      left outer join (
      select wound_id , max(last_upload_id) as last_upload_id , min(first_upload_id) as first_upload_id
      from
      (
      select wound_id, max(upload_id) as last_upload_id, min(upload_id) as first_upload_id
      from algo_wound_details
      group by wound_id
      
      union
      
      select wound_id, max(upload_id) as last_upload_id, min(upload_id) as first_upload_id
      from doc_wound_details
      group by wound_id
      )Consolidate_Uplaod
      group by wound_id

      )dwd
      on w.wound_id = dwd.wound_id
      left outer join wound.upload u2 on u2.upload_id = dwd.first_upload_id
      left outer join wound.upload u on u.upload_id = dwd.last_upload_id
      left outer join wound.wound_healing_score whs on whs.upload_id =  dwd.last_upload_id
      left outer join wound.upload_filename ufn on ufn.upload_id = dwd.first_upload_id and ufn.file_type = 'raw'
      left outer join (select upload_id, wound_id,wound_stage, tissue_type,sum(wound_area) as wound_area
      from algo_wound_details
      group by upload_id, wound_id,wound_stage, tissue_type
      )dwd2 on dwd2.upload_id = dwd.last_upload_id
      where w.patient_id = ?`,[patient_id],  function (err, data, field){
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
