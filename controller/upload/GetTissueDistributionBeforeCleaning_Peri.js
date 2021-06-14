const dbconnection = require('../../database/mysqlConnection')



module.exports.GetTissueDistributionBeforeCleaning_Peri = async (req,res)=>{

    const upload_id = req.query.upload_id; 
    const query = dbconnection.query(`select case 
    when label = 'Endema' then 'Edema'
    when label ='HealedWound' then 'Healed Wound'
    when label ='PeriWoundDiscoloration' then 'Discoloration'
    else label end as wound_tissue,
    Wound_area,label_area,
    round(label_area*100/Wound_area,1) as PerTissue
    from
    (
    select awcd.label, sum(awcd.area) * coalesce(pxl2cm,.2) as label_area , 
    sum(pxls) * coalesce(pxl2cm,.2) as Wound_area  from algo_peri_wound_details_before_cleaning awd
    inner join algo_wound_characterstics_details_before awcd on awcd.upload_id = awd.upload_id 
    and awcd.label in ('Endema','Callus','HealedWound','Eczema','Maceration','PeriWoundDiscoloration')
    and awd.upload_id = ?
    inner join wound.upload_filename ufn on ufn.upload_id = awd.upload_id 
    group by  awcd.label
     union
    
     select 'Others' as label,  
     sum(wound_area) * coalesce(pxl2cm,.2) -  coalesce(sum(awcd.area),0) * coalesce(pxl2cm,.2) as label_area , 
     sum(wound_area) * coalesce(pxl2cm,.2) as Wound_area  
     from (select upload_id, sum(pxls) as wound_area 
     from algo_peri_wound_details_before_cleaning where upload_id=? group by upload_id) awd
     left join (select upload_id, sum(area) as area from 
     algo_wound_characterstics_details_before
     where label in ('Endema','Callus','HealedWound','Eczema','Maceration','PeriWoundDiscoloration')
      group by upload_id
     )awcd on awcd.upload_id = awd.upload_id 
     
     and awd.upload_id = ?
     inner join wound.upload_filename ufn on ufn.upload_id = awd.upload_id 
    
    )WT

`,[upload_id,upload_id,upload_id],  function (err, data, field){
    if(err){
      res.status(400)
        res.json({ success : false , msg: 'error occured'});
        return;
    }
    else {
      const query = dbconnection.query(`SELECT  
      distinct case when label = 'PeriWoundDiscoloration' then 'Discoloration'
      when label = 'ScarTissue' then 'Scar Tissue'
      else label end as label from wound.algo_wound_characterstics_details
      where upload_id = ? and label in ('ScarTissue','Excoreation')
        `, [upload_id], function (err, other_data, field) {
      res.status(200);
      res.json({ success: true, return_data: data , others: other_data });
      return;
        })
    }
  })
  console.log(query.sql);
  //  res.json({ success : true , msg: 'incorrect user_name'});

  return;

}

