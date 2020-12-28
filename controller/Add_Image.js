const fs = require('fs');
const AWS = require('aws-sdk');
const path = require('path');
const dbconnection = require('../database/mysqlConnection')
const env = require('dotenv').config();


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


const uploadFile = (file,bucket,key) => {
        console.log(key);
       const params = {
           Bucket: bucket, 
           Key: key, //contacts.csv
           Body: fs.createReadStream(file)
       };
       s3.upload(params, function(s3Err, file) {
           if (s3Err) throw s3Err
          
       });
    
  };

  
  
module.exports.Add_Image = async (req,res)=>{
    
    console.log(req.file);

    let upload_id  = req.body.upload_id //Change made by Jyothi 
    
    let patient_id = req.body.patient_id;

    let tissue_type = req.body.tissue_type || ""
    let wound_area = req.body.wound_area
    let wound_stage = req.body.wound_stage || ""
    let wound_size_height = req.body.wound_size_height
    let wound_size_weight= req.body.wound_size_width
    let wound_size_depth = req.body.wound_size_depth
    let comment = req.body.comment
    let zoom_level = req.body.zoom_level
    let height_from_camera = req.body.height_from_camera

    let peri_wound_area = req.body.peri_wound_area
    let peri_wound_height = req.body.peri_wound_height
    let peri_wound_width = req.body.peri_wound_width
    let peri_wound_size_depth = req.body.peri_wound_size_depth
    let peri_wound_characterstics = req.body.peri_wound_characterstics
    let temperature = req.body.temperature
    let wound_temperature = req.body.wound_temperature 
    let peri_wound_temperature = req.body.peri_wound_temperature 
    let wound_id = req.body.wound_id
    let created_by = req.body.user_id
  
    let timestamp = Date.now() 
if(upload_id > 0){
    console.log(1)
	stmt = "UPDATE `wound`.`doc_wound_details` SET `wound_type` = '"+ wound_type +"',`tissue_type` = '"+tissue_type +"',`wound_stage` = '"+wound_stage+
	"',`wound_area` ="+wound_area+",`wound_size_height` = "+wound_size_height+",`wound_size_width` = "+wound_size_weight+ ",`wound_size_depth` = "+wound_size_depth+",`wound_id` = "+wound_id+",`temperature`="+wound_temperature+"  WHERE `upload_id` = "+upload_id
    console.log(2)


	  dbconnection.query(stmt,  function (err, data, field){
        if(err){
            console.log("ERROR EXECUTING DB QUERY")
            console.log(err);
            res.json({ success : false , msg: 'unable to insert into Wound Details'});
            return;
        }
    } );
    console.log(3)

stmt = " UPDATE `wound`.`doc_peri_wound_details` SET `peri_wound_area` = "+ peri_wound_area +",`peri_wound_size_height` ="+ peri_wound_height +",`peri_wound_size_width` ="+ peri_wound_width+",`wound_id` ="+ wound_id+",`temperature`="+peri_wound_temperature+" WHERE `upload_id` = "+ upload_id 
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
    console.log(5)
	
}
else{
    console.log(req.files);
    const image_RAW = req.files.image_RAW[0];
    const image_DEPTH = req.files.image_DEPTH[0];
    const image_PROCESS = req.files.image_PROCESS[0];
    const image_original = req.files.image_original[0];
    const depth_txt = req.files.depth_txt[0];
    const meta_text = req.files.meta_text[0];
    const video = req.files.video[0];
	 dbconnection.query("INSERT INTO wound.upload (`patient_id`, `user_id`,`upload_datetime`,`comment`,`zoom_level`,`height_from_camera`) values(?,?,CURRENT_TIMESTAMP(),?,?,?);    ",[patient_id,  created_by, comment, zoom_level,height_from_camera],  function (err, data, field){
        if(err){
            console.log(err)
            res.json({ success : false , msg: 'unable to insert'});
            return;
        }
    } );
     dbconnection.query("SELECT LAST_INSERT_ID() as id", function(err, data, field){
      
       upload_id = data[0].id  ;

       filename = `${patient_id}-${timestamp}-${created_by}${path.extname(image_RAW.originalname)}`;

      dbconnection.query("INSERT INTO wound.temperature (`upload_id`,`temperature`) values(?,?)",[upload_id,temperature],function(err,data,field){
           if(err){
               console.log(err);
           }
       })
    dbconnection.query("INSERT INTO `wound`.`upload_filename` (`upload_id`,`file_name`,`file_type`) values(?,?,'raw')",[upload_id,filename], function(err, data, field){
        if(err){console.log(err)} 
    });
   
       filename = `${patient_id}-${timestamp}-${created_by}${path.extname(image_DEPTH.originalname)}`;
       dbconnection.query("INSERT INTO `wound`.`upload_filename` (`upload_id`,`file_name`,`file_type`) values(?,?,'depth')",[upload_id,filename], function(err, data, field){
        if(err){console.log(err)} 
    });
       filename = `${patient_id}-${timestamp}-${created_by}${path.extname(image_PROCESS.originalname)}`;
       dbconnection.query("INSERT INTO `wound`.`upload_filename` (`upload_id`,`file_name`,`file_type`) values(?,?,'processed')",[upload_id,filename], function(err, data, field){
        if(err){console.log(err)} 
    });
       filename = `${patient_id}-${timestamp}-${created_by}${path.extname(video.originalname)}`;
       dbconnection.query("INSERT INTO `wound`.`upload_filename` (`upload_id`,`file_name`,`file_type`) values(?,?,'video')",[upload_id,filename], function(err, data, field){
        if(err){console.log(err)} 
    });

    dbconnection.query("INSERT INTO `wound`.`doc_peri_wound_details` (`wound_id`,`peri_wound_area`,`peri_wound_size_height`,`peri_wound_size_width`,`peri_wound_size_depth`,`temperature`,`upload_id`,`peri_wound_characterstics`) values(?,?,?,?,?,?,?,?)",
    [wound_id,peri_wound_area,peri_wound_height,peri_wound_width,peri_wound_size_depth,peri_wound_temperature,upload_id,peri_wound_characterstics], function(err, data, field){
        if(err){console.log(err)} 
    });

    dbconnection.query("INSERT INTO `wound`.`doc_wound_details` (`upload_id`,`wound_id`,`tissue_type`,`wound_stage`,`wound_size_height`,`wound_size_width`,`wound_size_depth`,`wound_area`,`temperature`) values(?,?,?,?,?,?,?,?,?)",[upload_id,req.body.wound_id,tissue_type,wound_stage,wound_size_height,wound_size_weight,wound_size_depth,wound_area,wound_temperature], function(err, data, field){
        if(err){console.log(err)} 
});
     


     });
    
  console.log("*********************811111111****************************************************")   
    
    filename = `${patient_id}-${timestamp}-${created_by}${ path.extname(image_RAW.originalname)}`;
    uploadFile(image_RAW.path,"wound.data.collection","RAW/"+filename)
    console.log(filename);
    fs.unlinkSync(image_RAW.path)
console.log(2)
filename = `${patient_id}-${timestamp}-${created_by}${path.extname(image_DEPTH.originalname)}`;

    uploadFile(image_DEPTH.path,"wound.data.collection","DEPTH/"+filename)
    fs.unlinkSync(image_DEPTH.path)
console.log(3)
filename = `${patient_id}-${timestamp}-${created_by}${path.extname(image_PROCESS.originalname)}`;
    uploadFile(image_PROCESS.path,"wound.data.collection","Image/"+filename)
    fs.unlinkSync(image_PROCESS.path)
    console.log(4)
    filename = `${patient_id}-${timestamp}-${created_by}${path.extname(video.originalname)}`;
    uploadFile(video.path,"wound.data.collection","video/"+filename)
    fs.unlinkSync(video.path)
    console.log(5)
    filename = `${patient_id}-${timestamp}-${created_by}${path.extname(image_original.originalname)}`;
    uploadFile(image_original.path,"wound.data.collection","Original/"+filename)
    fs.unlinkSync(image_original.path)


filename = `Meta-${patient_id}-${timestamp}-${created_by}${path.extname(meta_text.originalname)}`;
uploadFile(meta_text.path,"wound.data.collection","TXT/"+filename)
    fs.unlinkSync(meta_text.path)


filename = `Depth-${patient_id}-${timestamp}-${created_by}${path.extname(depth_txt.originalname)}`;
uploadFile(depth_txt.path,"wound.data.collection","TXT/"+filename)
    fs.unlinkSync(depth_txt.path)




}
    
  

    res.status(200)
    res.json({
        success:true
    })
    return;
}