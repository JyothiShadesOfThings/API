const fs = require('fs');
const AWS = require('aws-sdk');
const path = require('path');
const dbconnection = require('../database/mysqlConnection')
const env = require('dotenv').config();
var AdmZip = require('adm-zip');
var rimraf = require("rimraf");
const {spawn} = require('child_process');


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

let bucket = process.env.BUCKET

const uploadFile = (file,bucket,key) => {
    //Upload Zip  
       const params = {
           Bucket: bucket, 
           Key: key, //contacts.csv
           Body: fs.createReadStream(file)
       };
       s3.upload(params, function(s3Err, file) {
           if (s3Err) throw s3Err
          
       });
    
  };
  

const uploadFile2  = (file,bucket,key) => {
    const fileContent = fs.readFileSync(file);
    
    const params = {
        Bucket: bucket, 
        Key: key, //contacts.csv
        Body: fileContent
    };
   

    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
      
    });

}
  
module.exports.Add_Image2 = async (req,res)=>{
    let upload_id  = req.body.upload_id 
    let patient_id = req.body.patient_id;
    let tissue_type = req.body.tissue_type || ""
    let wound_area = req.body.wound_area
    let wound_stage = req.body.wound_stage || ""
    let wound_size_height = req.body.wound_size_height
    let wound_size_weight= req.body.wound_size_width
    let wound_size_depth = req.body.wound_size_depth
    let comment = req.body.comment
    let height_from_camera = req.body.height_from_camera
    let pain_level = req.body.pain_level
    let ordor_level = req.body.ordor_level
    let peri_wound_area = req.body.peri_wound_area
    let peri_wound_height = req.body.peri_wound_height
    let peri_wound_width = req.body.peri_wound_width
    let exudate_type = req.body.exudate_type
    let peri_wound_characterstics = req.body.peri_wound_characterstics
    let temperature = req.body.temperature
    let wound_temperature = req.body.wound_temperature 
    let peri_wound_temperature = req.body.peri_wound_temperature 
    let wound_id = req.body.wound_id
    let created_by = req.body.user_id
  
    let timestamp = Date.now() 


    
    const image_RAW = req.files.ZipFiles[0];
 
	 dbconnection.query("INSERT INTO wound.upload (`patient_id`, `user_id`,`upload_datetime`,`comment`,`pain_level`,`ordor_level`) values(?,?,CURRENT_TIMESTAMP(),?,?,?);    ",[patient_id,  created_by, comment, pain_level,ordor_level],  function (err, data, field){
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
   
    
    dbconnection.query("INSERT INTO `wound`.`doc_peri_wound_details` (`wound_id`,`peri_wound_area`,`peri_wound_size_height`,`peri_wound_size_width`,`temperature`,`upload_id`,`peri_wound_characterstics`) values(?,?,?,?,?,?,?)",
    [wound_id,peri_wound_area,peri_wound_height,peri_wound_width,peri_wound_temperature,upload_id,peri_wound_characterstics], function(err, data, field){
        if(err){console.log(err)} 
    });
   
    dbconnection.query("INSERT INTO `wound`.`doc_wound_details` (`upload_id`,`wound_id`,`tissue_type`,`wound_stage`,`wound_size_height`,`wound_size_width`,`wound_size_depth`,`wound_area`,`temperature`,`exudate_type`) values(?,?,?,?,?,?,?,?,?,?)",[upload_id,req.body.wound_id,tissue_type,wound_stage,wound_size_height,wound_size_weight,wound_size_depth,wound_area,wound_temperature, exudate_type], function(err, data, field){
        if(err){console.log(err)} 
});
     


   

 
    filename = `${patient_id}-${timestamp}-${created_by}${ path.extname(image_RAW.originalname)}`;
    console.log("Uploading to Raw Folder")
    uploadFile(image_RAW.path,bucket,"Raw_Zip/"+filename)
    console.log("Uploaded to Raw Folder")
    
    foldername = "temp/"+`${patient_id}-${timestamp}-${created_by}`+"/"
    foldername = foldername.trim()
    
    var zip = new AdmZip(image_RAW.path); 
    zip.extractAllTo(foldername);

   
    filename = `${patient_id}-${timestamp}-${created_by}`
   
    
    if (fs.existsSync(foldername+'t\\After_Image_original.jpg')) {
        uploadFile2(foldername+'t\\After_Image_original.jpg',bucket,"After_Cleaning/Raw/Image/"+filename+'.jpg')
        uploadFile2(foldername+'t\\Before_Image_original.jpg',bucket,"Before_Cleaning/Raw/Image/"+filename+'.jpg')
        final_foldername = foldername+'t\\'
        fs.copyFile(foldername+'t\\After_Image_original.jpg', 'AI_Model_Images\\After\\'+filename+'.jpg', (err) => {
            if (err) throw err;
           
          });
          fs.copyFile(foldername+'t\\Before_Image_original.jpg', 'AI_Model_Images\\Before\\'+filename+'.jpg', (err) => {
            if (err) throw err;
           
          });
    }
    else if(fs.existsSync(foldername+'After_Image_original.jpg')){
        uploadFile2(foldername+'After_Image_original.jpg',bucket,"After_Cleaning/Raw/Image/"+filename+'.jpg')
        uploadFile2(foldername+'Before_Image_original.jpg',bucket,"Before_Cleaning/Raw/Image/"+filename+'.jpg')
        final_foldername = foldername
        fs.copyFile(foldername+'After_Image_original.jpg', 'AI_Model_Images\\After\\'+filename+'.jpg', (err) => {
            if (err) throw err;
           
          });
          fs.copyFile(foldername+'Before_Image_original.jpg', 'AI_Model_Images\\Before\\'+filename+'.jpg', (err) => {
            if (err) throw err;
           
          });
    }
  
    const pythonDepth = spawn('python', ['get_depth_meta.py',final_foldername,upload_id,filename], {detached: true, stdio: 'ignore'});
    const python = spawn('python', ['run_models.py',filename,upload_id,patient_id,wound_id, created_by], {detached: true, stdio: 'ignore'});
    


    fs.unlinkSync(image_RAW.path)
    

    res.status(200)
    res.json({
        success:true,
        upload_id: upload_id,
    })
});
    return;
}