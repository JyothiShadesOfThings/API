const dbconnection = require('../../database/mysqlConnection')

module.exports.GetTissueDistributionBtwnDate = async (req,res)=>{
    const wound_id = req.query.wound_id; 
    const query = dbconnection.query(`SELECT  TBL.upload_id,
    case when wt ="Healthy_Granulation" then "Healthy Granulation"
    when wt ="slough" then "Slough"
    when wt ="Eschar" then "Necrotic/Eschar"
    when wt ="UnHealthy_Granulation" then "Un-Healthy Granulation"
     else wt end as wound_tissue, round(sum(Tissue_area),2) as Tissue_area, round(sum(wound_area),2) as wound_area, round(sum(Tissue_area)*100/sum(wound_area),0) as PerTissue from
    (
    
	select wcd.upload_id,
    case when label in ('slough','Eschar','Healthy_Granulation','UnHealthy_Granulation','Ephitheral') then label
    else 'Others' end as wt, sum(area) *coalesce(pxl2cm,.2) *coalesce(pxl2cm,.2) as Tissue_area ,
     sum(awd.wound_area) *coalesce(pxl2cm,.2) *coalesce(pxl2cm,.2) as wound_area
    FROM wound.algo_wound_characterstics_details wcd
    inner join wound.upload_filename ufn on ufn.upload_id = wcd.upload_id
     inner join (select upload_id, wound_id, sum(wound_area) as wound_area from wound.algo_wound_details group by upload_id,wound_id having wound_id = ?)awd on  awd.upload_id = wcd.upload_id
   group by wcd.upload_id , case when label in ('slough','Eschar','Healthy_Granulation','UnHealthy_Granulation','Ephitheral') then label
    else 'Others' end

union

 select 
    awd.upload_id,"Others" as wt,
    sum(awd.wound_area) *coalesce(pxl2cm,.2) *coalesce(pxl2cm,.2) -  sum(TTL_tissue_identified) *coalesce(pxl2cm,.2) *coalesce(pxl2cm,.2)  as "Tissue_area",
    sum(awd.wound_area) *coalesce(pxl2cm,.2) *coalesce(pxl2cm,.2) as wound_area
    FROM 
    (
    select upload_id, sum(area) as TTL_tissue_identified
    from wound.algo_wound_characterstics_details 
    where label in ('slough','Eschar','fat','bone','dead_tissue','infection','cream','colony_infection','Healthy_Granulation','UnHealthy_Granulation','Ephitheral')
    group by upload_id
    )awcd_TTL 
    inner join (select upload_id,wound_id, sum(wound_area) as wound_area from wound.algo_wound_details group by upload_id,wound_id having wound_id = ?)awd on awd.upload_id = awcd_TTL.upload_id
    inner join wound.upload_filename ufn on ufn.upload_id = awd.upload_id
    group by awd.upload_id , "Others"
    
    )TBL
group by  TBL.upload_id, case when wt ="Healthy_Granulation" then "Healthy Granulation"
    when wt ="slough" then "Slough"
    when wt ="Eschar" then "Necrotic/Eschar"
    when wt ="UnHealthy_Granulation" then "Un-Healthy Granulation"
     else wt end

;
`,[wound_id,wound_id],  function (err, data, field){
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


