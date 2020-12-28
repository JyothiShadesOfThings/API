const dbconnection = require('../database/mysqlConnection')

module.exports.Get_All_Wounds = async (req,res)=>{
    const patient_id = req.query.patient_id; 
   const query = dbconnection.query(`select u.pain_level , w.wound_id,w.patient_id, w.wound_location, w.wound_type, 
   concat("https://s3-ap-southeast-1.amazonaws.com/trails.wound.management/After_Cleaning/Raw/Image/",replace(ufn.file_name,".zip",".jpg")) as file_name,
   case 
when DATE(u.upload_datetime) is NULL then 'No Activity'
   when DATEDIFF(CURRENT_DATE() , DATE(u.upload_datetime)) < 7 then CONCAT(FLOOR(DATEDIFF(CURRENT_DATE() , DATE(u.upload_datetime))) ,' days ago')
   when DATEDIFF(CURRENT_DATE() , DATE(u.upload_datetime)) < 30 then CONCAT(FLOOR(DATEDIFF(CURRENT_DATE() , DATE(u.upload_datetime))/7 ),' weeks ago')
   else CONCAT(FLOOR(DATEDIFF(CURRENT_DATE() , DATE(u.upload_datetime))/30) ,' months ago') end as Last_Activity,
   u.upload_datetime as Last_Activity_date,
coalesce(w.wound_begin_date,date(w.created_date_time)) as wound_begin_date,  
   dwd2.wound_stage, dwd2.tissue_type,dwd2.wound_area, u2.upload_datetime as Date_Created , coalesce(TTL_entries,0) as TTL_entries ,
 Floor(coalesce(CMPLT_entries,0)*100/TTL_entries) as PerCompleteInfo
   from wound w 
   left outer join (
   

   select wound_id , max(last_upload_id) as max_upload_id, min(first_upload_id) as  first_wound_id , sum(TTL_entries) as TTL_entries
   from
   (
   select wound_id, max(upload_id) as last_upload_id, min(upload_id) as first_upload_id , count(*) as TTL_entries
   from algo_wound_details
   group by wound_id
   
   union
   
   select wound_id, max(upload_id) as last_upload_id, min(upload_id) as first_upload_id , count(*) as TTL_entries
   from doc_wound_details
   group by wound_id
   )Consolidate_Uplaod
   group by wound_id






   )dwd
   on w.wound_id = dwd.wound_id
   left outer join wound.upload u2 on u2.upload_id = dwd.first_wound_id
   left outer join wound.upload u on u.upload_id = dwd.max_upload_id
   left outer join wound.upload_filename ufn on ufn.upload_id = dwd.max_upload_id and ufn.file_type = 'raw'
   left outer join
   (
   select upload_id, wound_id,wound_stage, tissue_type,wound_area
   from doc_wound_details
   )dwd2
   on dwd2.wound_id = dwd.wound_id and dwd2.upload_id = dwd.max_upload_id
   left outer join(
   select count(*) as CMPLT_entries, wound_id
   from wound.doc_wound_details
   where wound_area > 0 and wound_area is not null and
   wound_size_height > 0 and wound_size_height is not null and
   wound_size_depth > 0 and wound_size_depth is not null and
   wound_size_width > 0 and wound_size_width is not null 
   group by wound_id
   ) cmpl_wd
   on cmpl_wd.wound_id = w.wound_id
   where w.patient_id = ?;`,[patient_id],  function (err, data, field){
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