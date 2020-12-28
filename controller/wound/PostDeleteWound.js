const dbconnection = require('../../database/mysqlConnection')

module.exports.PostDeleteWound = async (req,res)=>{
    const wound_id = req.query.wound_id; 
   
   
   const query = dbconnection.query(`update  wound.wound
   set archive = true where wound_id = ?
   `,[wound_id],  function (err, data, field){
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
