const dbconnection = require('../../database/mysqlConnection')


require('dotenv').config()
let env = process.env

module.exports.GetUploadDetails = async (req,res)=>{
    const upload_id = req.query.upload_id; 
   
   const query = dbconnection.query(`select 
   u.upload_id, healing_score , date_format(u.upload_datetime,'%d/%m/%Y') as uplaod_date,
   case when coalesce(healing_score,-1) = -1 then 'Unknown'
   when coalesce(healing_score,-1) = 1 then 'Good'
   when coalesce(healing_score,-1) = 2 then 'Normal'
   when coalesce(healing_score,-1) = 3 then 'Poor'
   when coalesce(healing_score,-1) = 4 then 'Bad'
   when coalesce(healing_score,-1) = 5 then 'Worse' end as healingLabel,
   concat("`+env.AWSBUCKET+`After_Cleaning/Raw/Image/",replace(file_name,'.zip','.jpg'))  as file_name,
   concat("`+env.AWSBUCKET+`Videos/",replace(replace(file_name,'.zip','.mp4'),'.jpg','.mp4'))  as video,
   concat("`+env.AWSBUCKET+`After_Cleaning/Algo/PLY/",replace(replace(file_name,'.zip','.ply'),'.jpg','.ply'))  Td_model,
   dwd.wound_size_height, dwd.wound_size_width, dwd.wound_area, dwd.wound_size_depth,
wound_stage, tissue_type, '' as edge_type, pain_level,ordor_level,
 w.wound_type, round(dwd.temperature,0) as wound_temperature,temp.temperature  as body_temperature,
peri_wound_size_height, peri_wound_area, peri_wound_size_width, peri_wound_size_depth,
 peri_wound_characterstics, dwd.exudate_type, dpwd.temperature as peri_wound_temperature,
w.wound_id,comment
from wound.upload u 
left join (select round(sum(wound_size_height),2) as wound_size_height,
round(sum(wound_size_width),2) as  wound_size_width, round(sum(wound_size_depth),2) as wound_size_depth,
round(sum(wound_area),2) as wound_area , group_concat(distinct wound_stage) as wound_stage, group_concat(distinct tissue_type) as tissue_type,
group_concat(distinct exudate_type) as exudate_type
, max(temperature) as temperature, wound_id, upload_id from
wound.doc_wound_details group by upload_id) dwd on u.upload_id = dwd.upload_id
left join wound.wound w on w.wound_id = dwd.wound_id
left join wound.temperature temp on u.upload_id = temp.upload_id
left join (select round(sum(peri_wound_area),2) as peri_wound_area , round(sum(peri_wound_size_height),2) as peri_wound_size_height, group_concat(distinct peri_wound_characterstics) as peri_wound_characterstics ,
round(sum(peri_wound_size_width),2) as peri_wound_size_width, round(sum(peri_wound_size_depth),2) as peri_wound_size_depth, wound_id, max(temperature) as temperature, upload_id

from  wound.doc_peri_wound_details
group by upload_id) dpwd on u.upload_id = dpwd.upload_id and dwd.wound_id = dpwd.wound_id
left join wound.wound_healing_score whs on whs.upload_id = u.upload_id
left outer join wound.upload_filename uf on uf.file_type = "raw" and uf.upload_id = u.upload_id 
where u.upload_id = ? `,[upload_id],  function (err, data, field){
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
