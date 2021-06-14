const dbconnection = require('../../database/mysqlConnection')

module.exports.GetPeriwoundCharactersticsBtwnDate = async (req,res)=>{
    const wound_id = req.query.wound_id; 
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    const query = dbconnection.query(`select TBL.upload_id, TBL.upload_datetime,
    case when label = 'Endema' then 2
    when label = 'Callus' then 3
    when label ='HealedWound' then 5
    when label ='Eczema' then 1
    when label ='Maceration' then 4 else 0 end as order_label,
     case when label ='HealedWound' then 'Healed Wound' 
     when label = 'PeriWoundDiscoloration' then 'Discoloration'
     when label = 'Endema' then 'Edema'
     else label end as wound_tissue,
    Wound_area,label_area,
    round(label_area*100/Wound_area,1) as PerTissue
    from
    (
    select  awd.upload_id, awcd.label, sum(awcd.area) * coalesce(pxl2cm,.2) as label_area , 
    sum(pxls) * coalesce(pxl2cm,.2) as Wound_area  from algo_peri_wound_details awd
    inner join algo_wound_characterstics_details awcd on awcd.upload_id = awd.upload_id 
    and awcd.label in ('Endema','Callus','HealedWound','Eczema','Maceration','PeriWoundDiscoloration')
    and awd.wound_id = ?
    inner join wound.upload_filename ufn on ufn.upload_id = awd.upload_id 
    group by  awd.upload_id,awcd.label
     
    union
    
     select awd.upload_id, 'Others' as label,  
     sum(wound_area) * coalesce(pxl2cm,.2) -  coalesce(sum(awcd.area),0) * coalesce(pxl2cm,.2) as label_area , 
     sum(wound_area) * coalesce(pxl2cm,.2) as Wound_area  
     from (select wound_id,upload_id, sum(pxls) as wound_area 
     from algo_peri_wound_details  where wound_id = ? group by wound_id,upload_id) awd
     left join (select upload_id, sum(area) as area from algo_wound_characterstics_details
     where label in ('Endema','Callus','HealedWound','Eczema','Maceration','PeriWoundDiscoloration')
      group by upload_id
     )awcd on awcd.upload_id = awd.upload_id 
     
     and awd.wound_id = ?
     inner join wound.upload_filename ufn on ufn.upload_id = awd.upload_id 
     group by awd.upload_id
    )WT
    inner join wound.upload TBL on TBL.upload_id = WT.upload_id
    where date(upload_datetime) >= ? and date(upload_datetime) <= ?
    order by upload_datetime, order_label
;
`,[wound_id,wound_id,wound_id, start_date, end_date],  function (err, data, field){
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


