const dbconnection = require('../../database/mysqlConnection')




module.exports.GetTissueDistributionBtwnDate = async (req,res)=>{

  

    const wound_id = req.query.wound_id; 
    //const start_date = req.query.start_date;
    //const end_date = req.query.end_date;
    //where date(upload_datetime) >= ? and date(upload_datetime) <= ?
    

    const query = dbconnection.query(`select TBL.upload_id, TBL.upload_datetime,
    case when  label ='UnHealthyGranulation' then  3
    when label ='Others' then 0
     when label ='HealthyGranulation' then 4
    when label ='Eschar' then 1 
    when label ='Slough' then 2 end as order_label ,
    case when label ='UnHealthyGranulation' then 'UnHealthy Granulation' 
    when label ='HealthyGranulation' then 'Healthy Granulation'   else label end as wound_tissue,
    Wound_area,label_area,
    round(label_area*100/Wound_area,1) as PerTissue
    from
    (
    select awd.upload_id, awcd.label, sum(awcd.area) * coalesce(pxl2cm,.2) as label_area , 
    sum(wound_area) * coalesce(pxl2cm,.2) as Wound_area  from 
    (select upload_id, wound_id, sum(pxls) as wound_area from algo_wound_details 
    group by upload_id, wound_id ) awd
    inner join algo_wound_characterstics_details awcd on awcd.upload_id = awd.upload_id 
    and awcd.label in ('UnHealthyGranulation','HealthyGranulation','Eschar','Slough')
    and awd.wound_id = ?
    inner join wound.upload_filename ufn on ufn.upload_id = awd.upload_id 
    group by  awd.upload_id,awcd.label
     union
    
     select awd.upload_id,'Others' as label,  
     sum(wound_area) * coalesce(pxl2cm,.2) -  coalesce(sum(awcd.area),0) * coalesce(pxl2cm,.2) as label_area , 
     sum(wound_area) * coalesce(pxl2cm,.2) as Wound_area  
     from (select wound_id,upload_id, sum(pxls) as wound_area from algo_wound_details  where wound_id = ? group by wound_id,upload_id) awd
     left join (select upload_id, sum(area) as area from algo_wound_characterstics_details
     where label in ('UnHealthyGranulation','HealthyGranulation','Eschar','Slough')
      group by upload_id
     
      )awcd on awcd.upload_id = awd.upload_id 
     
     and awd.wound_id = ?
     inner join wound.upload_filename ufn on ufn.upload_id = awd.upload_id 
     group by awd.upload_id
    )WT
    inner join wound.upload TBL on TBL.upload_id = WT.upload_id
    order by  upload_datetime,order_label

;
`,[wound_id,wound_id,wound_id],  function (err, data, field){
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


