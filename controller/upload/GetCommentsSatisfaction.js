const dbconnection = require('../../database/mysqlConnection')

module.exports.GetCommentsSatisfaction = async (req,res)=>{
    const upload_id = req.query.upload_id; 
   
   const query = dbconnection.query(`select 
   dwd.doc_satisfaction as wound_satisfaction, dwd.doc_comments as wound_comments,
   dpwd.doc_satisfaction as peri_wound_satisfaction, dpwd.doc_comments as peri_wound_comments
from wound.algo_wound_details dwd
left join wound.algo_peri_wound_details dpwd on dwd.upload_id = dpwd.upload_id and dwd.wound_id = dpwd.wound_id
where dwd.upload_id = ? `,[upload_id],  function (err, data, field){
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
