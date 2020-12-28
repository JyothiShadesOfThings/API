const dbconnection = require('../../database/mysqlConnection')

module.exports.PostUploadWoundPredictionSatisfactionComment = async (req,res)=>{
    const upload_id = req.query.upload_id; 
    const satisfaction = req.query.satisfaction; 
    const comment = req.query.comment;  
   const query = dbconnection.query(`update wound.algo_wound_details
   set doc_satisfaction = ? ,  doc_comments = ? where upload_id = ?
   `,[satisfaction,comment,upload_id],  function (err, data, field){
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
