const dbconnection = require('../database/mysqlConnection')

module.exports.GetTissueType = async (req,res)=>{
	
    const query = dbconnection.query(`select tissue_type from wound.tissue_type_list`,  function (err, data, field){
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
 
 