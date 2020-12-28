const dbconnection = require('../database/mysqlConnection')

module.exports.GetPrediction = async (req,res)=>{
    const upload_id = req.query.upload_id; 
   const query = dbconnection.query(`select u.upload_id,dwd.wound_size_depth ,dwd.wound_stage,  dwd.wound_size_height, dwd.wound_size_width, 
   dwd.wound_area, dpwd.peri_wound_area, dpwd.peri_wound_size_depth, 
   dpwd.peri_wound_size_height, dpwd.peri_wound_size_width, dwd.wound_size_depth, uf.file_name
   from wound.algo_wound_details dwd
   inner join wound.wound w on w.wound_id = dwd.wound_id
   left join wound.algo_peri_wound_details dpwd on dwd.upload_id = dpwd.upload_id and dwd.wound_id = dpwd.wound_id
   left join wound.upload u on u.upload_id = dwd.upload_id
   left outer join wound.upload_filename uf on uf.file_type = "processed" and uf.upload_id = u.upload_id 
   where u.upload_id = ?;`,[upload_id],  function (err, data, field){
        if(err){
          res.status(400)
            res.json({ success : false , msg: 'error occured'});
            return;
        }
       else{
        const query = dbconnection.query(`select u.upload_id,dwd.wound_size_depth ,dwd.wound_stage,  dwd.wound_size_height, dwd.wound_size_width, 
        dwd.wound_area, dpwd.peri_wound_area, dpwd.peri_wound_size_depth, 
        dpwd.peri_wound_size_height, dpwd.peri_wound_size_width, dwd.wound_size_depth, uf.file_name
        from wound.algo_wound_details dwd
        inner join wound.wound w on w.wound_id = dwd.wound_id
        left join wound.algo_peri_wound_details dpwd on dwd.upload_id = dpwd.upload_id and dwd.wound_id = dpwd.wound_id
        left join wound.upload u on u.upload_id = dwd.upload_id
        left outer join wound.upload_filename uf on uf.file_type = "processed" and uf.upload_id = u.upload_id 
        where u.upload_id = ?;`,[upload_id],  function (err, data2, field){
            if(err){
                res.status(400)
                  res.json({ success : false , msg: 'error occured'});
                  return;
              }
              res.status(200);
              res.json({ success : true , wound_data: data, characterstics_data: data2 });
                     return;
        })
        
       }
    })
    console.log(query.sql);
  //  res.json({ success : true , msg: 'incorrect user_name'});
    
    return; 
   
}
