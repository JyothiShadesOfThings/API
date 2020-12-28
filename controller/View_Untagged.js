const dbconnection = require('../database/mysqlConnection');


module.exports.View_Untagged = async (req,res)=>{
    const doctorName = req.query.user_id;
    dbconnection.query(
    ` select u.upload_id, comment, u.patient_id , p.patient_name, w.wound_location , w.wound_type, tissue_type,wound_stage, wound_area ,
       wound_size_height, wound_size_width, wound_size_depth, dwd.wound_id, dpwd.peri_wound_area,
       peri_wound_size_height, peri_wound_size_width, peri_wound_size_depth ,
       peri_wound_characterstics,dwd.temperature as wound_temperature, dpwd.temperature as peri_wound_temperature,  raw_file_name, depth_file_name, processed_file_name,video_file_name,
       case when u.patient_id='p1' then  'Untagged Patient'
       when dwd.wound_id=1 then 'Untagged Wound'
       when(wound_size_height is null or wound_size_height=0 or wound_size_width is null or wound_size_width = 0  or wound_size_depth is null or wound_size_depth=0 ) then 'Incomplete Wound Details'
       when (peri_wound_size_height is null or peri_wound_size_height = 0 or peri_wound_size_width is null or peri_wound_size_width = 0 or peri_wound_size_depth is null or peri_wound_size_depth = 0 ) then 'Incomplete Peri-Wound Details' else '' end as untagtype
       from wound.upload u left outer join doc_wound_details dwd on u.upload_id = dwd.upload_id
       inner join patient p on p.patient_id = u.patient_id
       left outer join doc_peri_wound_details dpwd on u.upload_id = dpwd.upload_id
       inner join wound w on w.wound_id = dwd.wound_id
       left outer join (
       SELECT upload_id,  GROUP_CONCAT( IF( file_type='video', file_name, NULL ) ) AS video_file_name,      
       GROUP_CONCAT( IF( file_type='raw', file_name, NULL ) ) AS raw_file_name,      
       GROUP_CONCAT( IF( file_type='depth', file_name, NULL ) ) AS depth_file_name,    
       GROUP_CONCAT( IF( file_type='processed', file_name, NULL ) ) AS processed_file_name
       FROM wound.upload_filename  GROUP BY upload_id) uf
       on uf.upload_id = u.upload_id
       where
       u.user_id = '${doctorName}' and
     
       (u.patient_id='p1'  or dwd.wound_id=1 or
           wound_size_height is null or  wound_size_height = 0
       or wound_size_width is null or wound_size_width = 0
       or wound_size_depth is null or wound_size_width = 0
       or peri_wound_size_height is null or wound_size_width = 0
       or peri_wound_size_width is null or wound_size_width =0
       or peri_wound_size_depth is null or wound_size_width =0 )`
        ,function(err,data,field){
            if(err){
                console.log(err)
            }
            console.log(data)
            return res.json({success: true, untaggedList:data});
        })
}
