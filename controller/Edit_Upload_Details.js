const dbconnection = require('../database/mysqlConnection')

module.exports.Edit_Upload_Details = async (req,res)=>{


    let upload_id  = req.body.upload_id 
    let tissue_type = req.body.tissue_type || ""
    let wound_area = req.body.wound_area
    let wound_stage = req.body.wound_stage || ""
    let wound_size_height = req.body.wound_size_height
    let wound_size_weight= req.body.wound_size_width
    let wound_size_depth = req.body.wound_size_depth
    let comment = req.body.comment
    let zoom_level = req.body.zoom_level
    let height_from_camera = req.body.height_from_camera
    let pain_level = req.body.pain_level
    let ordor_level = req.body.ordor_level
    let peri_wound_area = req.body.peri_wound_area
    let peri_wound_height = req.body.peri_wound_height
    let peri_wound_width = req.body.peri_wound_width
    let peri_wound_size_depth = req.body.peri_wound_size_depth
    let peri_wound_characterstics = req.body.peri_wound_characterstics
    let temperature = req.body.temperature
    let wound_temperature = req.body.wound_temperature 
    let peri_wound_temperature = req.body.peri_wound_temperature 
    let wound_id = req.body.wound_id
   
  

	stmt = "UPDATE `wound`.`doc_wound_details` SET `tissue_type` = '"+tissue_type +"',`wound_stage` = '"+wound_stage+
	"',`wound_area` ="+wound_area+",`wound_size_height` = "+wound_size_height+",`wound_size_width` = "+wound_size_weight+ ",`wound_size_depth` = "+wound_size_depth+",`temperature`="+wound_temperature+"  WHERE `upload_id` = "+upload_id
   
 dbconnection.query(stmt,  function (err, data, field){
        if(err){
            console.log("ERROR EXECUTING DB QUERY")
            console.log(err);
            res.json({ success : false , msg: 'unable to insert into Wound Details'});
            return;
        }
    } );
    console.log(3)

stmt = " UPDATE `wound`.`doc_peri_wound_details` SET `peri_wound_area` = "+ peri_wound_area +",`peri_wound_size_height` ="+ peri_wound_height +",`peri_wound_size_width` ="+ peri_wound_width+",`temperature`="+peri_wound_temperature+" WHERE `upload_id` = "+ upload_id 
console.log(stmt)


	  dbconnection.query(stmt,  function (err, data, field){
        if(err){
            console.log(err);
            console.log("ERROR EXECUTING DB QUERY")
            res.json({ success : false , msg: 'unable to insert into Periwound Details'});
            return;
        }
    } );
	console.log(4)

stmt = " UPDATE `wound`.`temperature` SET `temperature` = "+ temperature + " WHERE `upload_id` = "+ upload_id 


	  dbconnection.query(stmt,  function (err, data, field){
        if(err){
            console.log("ERROR EXECUTING DB QUERY")
            res.json({ success : false , msg: 'unable to insert into Temperature'});
            return;
        }
    } );

    
stmt = " UPDATE `wound`.`upload` SET `pain_level` = "+ pain_level +", `ordor_level` = "+ordor_level +", `comment` = '"+comment+ "'"+ " WHERE `upload_id` = "+ upload_id 
dbconnection.query(stmt,  function (err, data, field){
  if(err){
      console.log("ERROR EXECUTING DB QUERY")
      res.json({ success : false , msg: 'unable to insert into Upload'});
      return;
  }
} );

res.status(200);
res.json({ success : true });
return;

}