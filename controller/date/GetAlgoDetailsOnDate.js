const dbconnection = require('../../database/mysqlConnection')

module.exports.GetAlgoDetailsOnDate = async (req,res)=>{
    const date = req.query.date; 
	const wound_id = req.query.wound_id; 
   
   const query = dbconnection.query(` 
  select upload.upload_id, temperature.temperature, pain_level, 50 as OnTime, 20 as Delay , 
 30 as Others, healing_score from
 (select max(upload_id) as upload_id  from algo_wound_details where wound_id = ?)wound_details
 inner join
 (select upload_id, pain_level from upload where date(upload_datetime) >?) upload
 on wound_details.upload_id = upload.upload_id
 left join temperature on temperature.upload_id = upload.upload_id
 left join wound_healing_score whs on whs.upload_id = upload.upload_id

 
  `,[wound_id, date],  function (err, data, field){
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
