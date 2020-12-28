const dbconnection = require('../database/mysqlConnection')

module.exports.Get_Upload_Details = async (req,res)=>{
    const upload_id = req.query.upload_id; 
   const query = dbconnection.query(`select t.temperature as bodytemperature, u.upload_id,dwd.wound_size_depth ,dwd.wound_stage, dwd.tissue_type, dwd.wound_size_height, dwd.wound_size_width, 
dwd.wound_area, dpwd.peri_wound_area, dpwd.peri_wound_size_depth, w.wound_type,
dpwd.peri_wound_size_height, dpwd.peri_wound_size_width, dwd.wound_id, dwd.temperature as wound_tempereature, dpwd.temperature as peri_wound_temperature,
dpwd.peri_wound_characterstics, u.comment , dwd.wound_size_depth, u.upload_datetime, uf.file_name
from wound.doc_wound_details dwd
inner join wound.wound w on w.wound_id = dwd.wound_id
left join wound.doc_peri_wound_details dpwd on dwd.upload_id = dpwd.upload_id and dwd.wound_id = dpwd.wound_id
left join wound.upload u on u.upload_id = dwd.upload_id
left join temperature t on t.upload_id = u.upload_id
left outer join wound.upload_filename uf on uf.file_type = "processed" and uf.upload_id = u.upload_id 
where dwd.upload_id = ?;`,[upload_id],  function (err, data, field){
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
