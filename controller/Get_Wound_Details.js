const dbconnection = require('../database/mysqlConnection')

module.exports.Get_Wound_Details = async (req,res)=>{
    const wound_id = req.query.wound_id; 
   const query = dbconnection.query(`select 
   upload_id, -1 as wound_healing_score, 'Un Known' as wound_healing_text,
   pain_level,ordor_level,
wound_size_depth ,wound_stage, tissue_type, wound_size_height, wound_size_width, 
wound_area, wound_type, wound_temperature,

peri_wound_size_height, peri_wound_area,  peri_wound_size_width, peri_wound_size_depth, peri_wound_characterstics, peri_wound_temperature,
wound_id,comment , wound_size_depth, upload_datetime, 

concat("https://s3-ap-southeast-1.amazonaws.com/trails.wound.management/After_Cleaning/Raw/Image/",replace(file_name,".zip",'.jpg')) as filename

,body_temperature,
sum(c1+c2+c3+c4+c5+c6+c7+c8+c9+c10+c11)/11 as Per_Complete,
case when sum(c1+c2+c3+c4+c5+c6+c7+c8+c9+c10+c11)/11 =1 then "Tagged" else "Untagged" end as TaggedUntagged , "" as TreatmentPrescribed

from
(
select temp.temperature as body_temperature, u.upload_id,dwd.wound_size_depth ,dwd.wound_stage, dwd.tissue_type, u.pain_level, u.ordor_level,
dwd.wound_size_height, dwd.wound_size_width, 
dwd.wound_area, dpwd.peri_wound_area, dpwd.peri_wound_size_depth, w.wound_type,
dpwd.peri_wound_size_height, dpwd.peri_wound_size_width, dwd.wound_id,
dpwd.peri_wound_characterstics, dpwd.temperature as peri_wound_temperature, u.comment ,u.upload_datetime, uf.file_name,
dwd.temperature as wound_temperature,
case when dwd.wound_size_depth is null then 0 when dwd.wound_size_depth > 0 then 1 else 0 end as c1,
case when dwd.wound_stage is null then 0  else 1 end as c2,
case when dwd.tissue_type is null then 0  else 1 end as c3,
case when dwd.wound_size_height is null then 0 when dwd.wound_size_height > 0 then 1 else 0 end as c4,
case when dwd.wound_size_width  is null then 0 when dwd.wound_size_width > 0 then 1 else 0 end as c5,
case when dwd.wound_area is null then 0 when dwd.wound_area > 0 then 1 else 0 end as c6,
case when dpwd.peri_wound_area is null then 0 when dpwd.peri_wound_area > 0 then 1 else 0 end as c7,
case when dpwd.peri_wound_size_depth is null then 0 when dpwd.peri_wound_size_depth > 0 then 1 else 0 end as c8,
case when dpwd.peri_wound_size_width is null then 0 when dpwd.peri_wound_size_width > 0 then 1 else 0 end as c9,
case when dpwd.peri_wound_size_height is null then 0 when dpwd.peri_wound_size_height > 0 then 1 else 0 end as c10,
case when dpwd.peri_wound_characterstics is null then 0  else 1 end as c11
from wound.doc_wound_details dwd
inner join wound.wound w on w.wound_id = dwd.wound_id
left join wound.temperature temp on dwd.upload_id = temp.upload_id
left join wound.doc_peri_wound_details dpwd on dwd.upload_id = dpwd.upload_id and dwd.wound_id = dpwd.wound_id
left join wound.upload u on u.upload_id = dwd.upload_id
left outer join wound.upload_filename uf on uf.file_type = "raw" and uf.upload_id = u.upload_id 
where dwd.wound_id = ?)TA;`,[wound_id],  function (err, data, field){
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
