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
   
       const params = {
           Bucket: bucket, 
           Key: key, //contacts.csv
           Body: fs.createReadStream(file)
       };
       s3.upload(params, function(s3Err, file) {
           if (s3Err) throw s3Err
          
       });
    
  };

module.exports.Add_Patient = async (req,res)=>{
    console.log("******");
    console.log(req.body);
    console.log("******");
    
    console.log("1");
    let height = req.body.height;
    let weight = req.body.weight;
    let systol = req.body.systol;
    let diastole = req.body.diastole;
    let blood_pressure = systol +"/"+diastole;
    console.log("height");
    console.log(height);
    let heart_rate =  req.body.heart_rate;
    console.log("3");
    let blood_group = req.body.blood_group;
    const currentDate = Date.now();


    let Patient_Name = req.body.Patient_Name;
    let Last_Name = req.body.Last_Name;
    let Patient_Image = req.files.Patient_Image[0];
    let DOB = req.body.DOB;
    let Gender = req.body.Gender;
    let Created_By = req.body.Created_By;
    let SugarLevel = req.body.SugarLevel;
    let body_temp = req.body.body_temp;
    console.log("body_temp");
    console.log(body_temp);

let PN = Patient_Name.toString().trim().replace(/  +/g,' ').replace(/\s/g,'_');

    let filename = `${PN}-${currentDate}-${Created_By}${path.extname(Patient_Image.originalname)}`
filename = filename.replace(/\s/g,'').toLowerCase()


    uploadFile(Patient_Image.path,"trails.wound.management","Patient_Image/"+filename)
fs.unlinkSync(Patient_Image.path)


    const query = dbconnection.query("INSERT INTO wound.patient (`patient_id`,`last_name`, `patient_name`,`gender`,`dob`,`created_by`,`created_date_time`,`patient_image_file_location` ,`archive`,`height`,`weight`,`blood_group`,`blood_pressure`,`heart_rate`,`SugarLevel`,`body_temp`) values(patient_auto_increment(), ?,? , ? ,?, ? , CURRENT_TIMESTAMP() ,?, 0,?,?,?,?,?,?,?);",[Last_Name,Patient_Name,Gender,DOB,Created_By,filename, height,weight,blood_group,blood_pressure,heart_rate,SugarLevel,body_temp],  function (err, data, field){
        if(err){
            res.json({ success : false , msg: 'unable to insert'});
           
            return;
        }
      
         res.json({ success : true , msg: 'inserted_record'});
                return;
    } )
    console.log("***");
    console.log(query.sql);
  //  res.json({ success : true , msg: 'incorrect user_name'});
    return; 
}
