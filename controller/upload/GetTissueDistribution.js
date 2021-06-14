const dbconnection = require('../../database/mysqlConnection')



module.exports.GetTissueDistribution = async (req,res)=>{

  
  

    const upload_id = req.query.upload_id; 
    const query = dbconnection.query(`select case when label ='UnHealthyGranulation' then 'UnHealthy Granulation' 
    when label ='HealthyGranulation' then 'Healthy Granulation'   else label end as wound_tissue,
    Wound_area,label_area,
    round(label_area*100/Wound_area,1) as PerTissue
    from
    (
    select awcd.label, sum(awcd.area) * coalesce(pxl2cm,.2) as label_area ,
     sum(wound_area) * coalesce(pxl2cm,.2) as Wound_area  from  
     (select upload_id, wound_id, sum(pxls) as wound_area from algo_wound_details 
     group by upload_id, wound_id ) awd
    inner join algo_wound_characterstics_details awcd on awcd.upload_id = awd.upload_id 
    and awcd.label in ('UnHealthyGranulation','HealthyGranulation','Eschar','Slough')
    and awd.upload_id = ?
    inner join wound.upload_filename ufn on ufn.upload_id = awd.upload_id 
    group by  awcd.label
     union
    
     select 'Others' as label,  
     sum(wound_area) * coalesce(pxl2cm,.2) -  coalesce(sum(awcd.area),0) * coalesce(pxl2cm,.2) as label_area , 
     sum(wound_area) * coalesce(pxl2cm,.2) as Wound_area  
     from (select upload_id, sum(pxls) as wound_area from algo_wound_details 
     where upload_id=? group by upload_id ) awd
     left join (select upload_id, sum(area) as area from algo_wound_characterstics_details
     where label in ('UnHealthyGranulation','HealthyGranulation','Eschar','Slough')
      group by upload_id
     )awcd on awcd.upload_id = awd.upload_id 
     
     and awd.upload_id = ?
     inner join wound.upload_filename ufn on ufn.upload_id = awd.upload_id 
    
    )WT

;
`,[upload_id,upload_id,upload_id],  function (err, data, field){
    if(err){
      res.status(400)
        res.json({ success : false , msg: 'error occured'});
        return;
    }
    
      const query2 = dbconnection.query(`SELECT  
      distinct case when label = 'DeadMuscle' then 'Dead Muscle'
      when label = 'DeadTendon' then 'Dead Tendon'
      when label = 'DeadTissue' then 'Dead Tissue'
      else label end as label from wound.algo_wound_characterstics_details
      where upload_id = ? and label in ('Bone','Blood','DeadMuscle','DeadTendon','DeadTissue','Tendon')
        `, [upload_id], function (err, other_data, field) {
      res.status(200);
      res.json({ success: true, others: other_data, return_data: data  });
      return;
        })
    
  })
  console.log(query.sql);
  //  res.json({ success : true , msg: 'incorrect user_name'});

  return;

}



