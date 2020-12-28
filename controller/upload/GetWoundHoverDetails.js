const dbconnection = require('../../database/mysqlConnection')

module.exports.GetWoundHoverDetails = async (req,res)=>{
    const upload_id = req.query.upload_id; 
   
   const query = dbconnection.query(`select 
   concat("https://s3-ap-southeast-1.amazonaws.com/trails.wound.management/After_Cleaning/Algo/PeriWound/",file_name) as image,
   concat("https://s3-ap-southeast-1.amazonaws.com/trails.wound.management/After_Cleaning/Algo/Wound/",replace(file_name,".jpg","_only_wound.jpg")) as wound_image,
   concat("https://s3-ap-southeast-1.amazonaws.com/trails.wound.management/After_Cleaning/Algo/PeriWound/",replace(file_name,".jpg","_only_periwound.jpg")) as peri_wound_image, 
   concat("https://s3-ap-southeast-1.amazonaws.com/trails.wound.management/After_Cleaning/Algo/PeriWound/",replace(file_name,".jpg","_ImageMarking.txt")) as pixel_classification_file,
   round(coalesce(wound_height*coalesce(pxl2cm,.2)),2) as wound_height,
   round(coalesce(wound_width*coalesce(pxl2cm,.2)),2) as wound_width,
   round(coalesce(wound_depth*coalesce(pxl2cm,.2)),2) as wound_depth,
   round(coalesce(wound_area*coalesce(pxl2cm,.2)*coalesce(pxl2cm,.2)),2) as wound_area,
   round(coalesce(peri_wound_height*coalesce(pxl2cm,.2)),2) as peri_wound_height,
   round(coalesce(peri_wound_width*coalesce(pxl2cm,.2)),2) as peri_wound_width,
   round(coalesce(peri_wound_area*coalesce(pxl2cm,.2)*coalesce(pxl2cm,.2)),2) as peri_wound_area
   from wound.upload_filename ufn
   left outer join (select upload_id, sum(wound_area) as wound_area,
   sum(wound_size_height) as wound_height,
   sum(wound_size_width) as wound_width,
   max(wound_size_depth) as wound_depth, max(temperature) as wound_temperature
   from wound.algo_wound_details
   group by upload_id) dwd on dwd.upload_id = ufn.upload_id
   left outer join (select upload_id, sum(peri_wound_area) as peri_wound_area,
   sum(peri_wound_size_height) as peri_wound_height,
   sum(peri_wound_size_width) as peri_wound_width,
   max(peri_wound_size_depth) as peri_wound_depth, max(temperature) as peri_wound_temperature
   from wound.algo_peri_wound_details
   group by upload_id) dpwd on dpwd.upload_id = ufn.upload_id
   where ufn.upload_id = ? `,[upload_id],  function (err, data, field){
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
