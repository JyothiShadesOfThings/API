const dbconnection = require('../database/mysqlConnection')

module.exports.Add_Wound = async (req,res)=>{
    console.log("In Add Wound")
   const patient_id = req.body.patient_id
   const wound_location = req.body.wound_location
   const  wound_reason = req.body.wound_reason
   const wound_begin_date = req.body.wound_begin_date
   const created_by = req.body.user_id
   const wound_type = req.body.wound_type
   const wound_side = req.body.wound_side
    const query = dbconnection.query("INSERT INTO wound.wound (`patient_id`, `wound_reason`,`wound_location`,`wound_begin_date`,`created_by`,`wound_type` ,`created_date_time`,`wound_side`) values(?,?,?,?,?,?,NOW() ,?);    ",[patient_id, wound_reason,wound_location,wound_begin_date,created_by,wound_type,wound_side],  function (err, data, field){
        if(err){
            res.json({ success : false , msg: err});
            return;
        }
      
        
    } )

 dbconnection.query("SELECT LAST_INSERT_ID() as id", function(err, data, field){
      
       w_id = data[0].id  ;

 res.json({ success : true , msg: 'inserted_record', wound_id: w_id});
                return;
    })
    return; 
}