const dbconnection = require('../../database/mysqlConnection')

module.exports.GetTissueDistribution = async (req,res)=>{
    const upload_id = req.query.upload_id; 
    const query = dbconnection.query(`SELECT  
    case when wt ="Healthy_Granulation" then "Healthy Granulation"
    when wt ="slough" then "Slough"
    when wt ="Eschar" then "Necrotic/Eschar"
    when wt ="UnHealthy_Granulation" then "Un-Healthy Granulation"
     else wt end as wound_tissue, round(sum(Tissue_area),2) as Tissue_area, round(sum(wound_area),2) as wound_area, round(sum(Tissue_area)*100/sum(wound_area),0) as PerTissue from
    (
    
    select case when label in ('slough','Eschar','Healthy_Granulation','UnHealthy_Granulation','Ephitheral') then label
    else 'Others' end as wt, area *coalesce(pxl2cm,.2) *coalesce(pxl2cm,.2) as Tissue_area ,
     awd.wound_area *coalesce(pxl2cm,.2) *coalesce(pxl2cm,.2) as wound_area
    FROM wound.algo_wound_characterstics_details wcd
    inner join wound.upload_filename ufn on ufn.upload_id = wcd.upload_id
     inner join (select upload_id, sum(wound_area) as wound_area from wound.algo_wound_details group by upload_id)awd on  awd.upload_id = wcd.upload_id
    where wcd.upload_id = ?
   and label in ('UnHealthy_Granulation','slough','Healthy_Granulation','eschar','Bone','DeadTissue')


union

 select 
    "Others" as wt,
    awd.wound_area *coalesce(pxl2cm,.2) *coalesce(pxl2cm,.2) -  TTL_tissue_identified *coalesce(pxl2cm,.2) *coalesce(pxl2cm,.2)  as "Tissue_area",
    awd.wound_area *coalesce(pxl2cm,.2) *coalesce(pxl2cm,.2) as wound_area
    FROM 
    (
    select upload_id, sum(area) as TTL_tissue_identified
    from wound.algo_wound_characterstics_details 
    where label in('UnHealthy_Granulation','slough','Healthy_Granulation','eschar','Bone','DeadTissue')

    group by upload_id
    )awcd_TTL 
    inner join (select upload_id, sum(wound_area) as wound_area from wound.algo_wound_details group by upload_id)awd on awd.upload_id = awcd_TTL.upload_id
    inner join wound.upload_filename ufn on ufn.upload_id = awd.upload_id
    where awd.upload_id = ?
    )TBL
group by   case when wt ="Healthy_Granulation" then "Healthy Granulation"
    when wt ="slough" then "Slough"
    when wt ="Eschar" then "Necrotic/Eschar"
    when wt ="UnHealthy_Granulation" then "Un-Healthy Granulation"
     else wt end


;
`,[upload_id,upload_id],  function (err, data, field){
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


