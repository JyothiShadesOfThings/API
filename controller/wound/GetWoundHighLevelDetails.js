const dbconnection = require('../../database/mysqlConnection')

module.exports.GetWoundHighLevelDetails = async (req,res)=>{
    const wound_id = req.query.wound_id; 
   const query = dbconnection.query(`select  w.wound_id, w.wound_location, 
   w.wound_side, w.wound_type
      from wound w 
      where w.wound_id = ?`,[wound_id],  function (err, data, field){
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
