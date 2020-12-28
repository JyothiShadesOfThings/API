const dbconnection = require('../../database/mysqlConnection')

require('dotenv').config()
let env = process.env
module.exports.GetAlgoUploadDetails = async (req,res)=>{
    const upload_id = req.query.upload_id; 
   
   const query = dbconnection.query(` select 
   u.upload_id, healing_score , 
   date_format(u.upload_datetime,'%d/%m/%Y') as uplaod_date,
   case when coalesce(healing_score,-1) = -1 then 'Unknown'
   when coalesce(healing_score,-1) = 1 then 'Good'
   when coalesce(healing_score,-1) = 2 then 'Normal'
   when coalesce(healing_score,-1) = 3 then 'Poor'
   when coalesce(healing_score,-1) = 4 then 'Bad'
   when coalesce(healing_score,-1) = 5 then 'Worse' end as healingLabel,
   pxl2cm ,
   concat("`+env.AWSBUCKET+`After_Cleaning/Algo/Image/",replace(file_name,'.zip','.jpg')) as wound_image,
concat("`+env.AWSBUCKET+`After_Cleaning/Algo/Wound/",replace(file_name,'.zip','.jpg')) as wound_marked_image,
concat("`+env.AWSBUCKET+`After_Cleaning/Algo/Wound_Characterstics/",replace(file_name,'.zip','.jpg')) as wound_classified,
concat("`+env.AWSBUCKET+`After_Cleaning/Algo/PeriWound/",replace(file_name,'.zip','.jpg')) as peri_wound_marked_image,
concat("`+env.AWSBUCKET+`After_Cleaning/Algo/PeriWound_Characterstics/",replace(file_name,'.zip','.jpg')) as peri_wound_classified,

   round(dwd.wound_size_height*coalesce(pxl2cm,.2),2) as wound_size_height , 
   round(dwd.wound_size_width*coalesce(pxl2cm,.2),2) as wound_size_width ,
   round(dwd.wound_area* coalesce(pxl2cm,.2) * coalesce(pxl2cm,.2),2) as wound_area, 
   round(dwd.wound_size_depth *coalesce(pxl2cm,.2),2)  as wound_size_depth ,
wound_stage, TissueType.TissueType as tissue_type, Edge.Edge as edge_type, 
pain_level,ordor_level, w.wound_type,Exudate.Exudate as exudate_type, 
round(dwd.temperature,1) as wound_temperature,temp.temperature  as body_temperature,
round(peri_wound_size_height *coalesce(pxl2cm,.2),2) as peri_wound_size_height, 
round(peri_wound_area *coalesce(pxl2cm,.2) *coalesce(pxl2cm,.2),2) as peri_wound_area, 
round(peri_wound_size_width  *coalesce(pxl2cm,.2),2) as peri_wound_size_width,
 round(peri_wound_size_depth *coalesce(pxl2cm,.2),2) as peri_wound_size_depth,
 Periwound_Characterstics.Periwound_Characterstics as peri_wound_characterstics, 
 dpwd.temperature as peri_wound_temperature,
w.wound_id,comment
from (select sum(wound_size_height) as wound_size_height,
sum(wound_size_width) as  wound_size_width, sum(wound_size_depth) as wound_size_depth,
sum(wound_area) as wound_area , group_concat(distinct wound_stage) as wound_stage, max(temperature) as temperature, wound_id, upload_id from
 wound.algo_wound_details group by upload_id) dwd
inner join wound.wound w on w.wound_id = dwd.wound_id
left join (
select upload_id, group_concat(distinct 
case when label ='slough' then 'Slough'
when label ='fat' then 'Fat'
when label ='bone' then 'Bone'
when label ='eschar' then 'Eschar'
when label ='UnHealthy_Granulation' then 'Un-Healthy Granulation'
when label ='Healthy_Granulation' then 'Healthy Granulation'
else label end
) as TissueType
from wound.algo_wound_characterstics_details
where label in ('slough','fat','bone','eschar','Ephitheral','UnHealthy_Granulation','Healthy_Granulation')
group by upload_id
)TissueType on TissueType.upload_id = dwd.upload_id
left join (
  select upload_id, group_concat(distinct 
  case when label = 'eczema' then 'Eczema'
  when label ='healed_wound' then 'Healed Wound'
  when label ='callus' then 'Callus'
  when label ='maceration' then 'Maceration'
  else label end
  ) as Periwound_Characterstics
  from wound.algo_wound_characterstics_details
  where label in ('Endema','Eczema','Hematone','HealedWound','Callus','Maceration','PeriWoundDiscoloration')
  group by upload_id
  )Periwound_Characterstics on Periwound_Characterstics.upload_id = dwd.upload_id
  left join (
    select upload_id, group_concat(distinct 
    case when label = 'thin' then 'Thin Exudate'
    when label = 'clear_exudate' then 'Clear Exudate' 
    when label ='cloudy_exudate' then 'Cloudy Exudate'
    end
    ) as Exudate
    from wound.algo_wound_characterstics_details
    where label in ('thin','clear_exudate','cloudy_exudate')
    group by upload_id
    )Exudate on Exudate.upload_id = dwd.upload_id
  
    left join (
      select upload_id, group_concat(distinct label) as Edge
      from wound.algo_wound_characterstics_details
      where label in ('HealthyEdge','RolledInEdge','RolledOutEdge')
      group by upload_id
      )Edge on Edge.upload_id = dwd.upload_id
    

left join wound.temperature temp on dwd.upload_id = temp.upload_id
left join (select sum(peri_wound_area) as peri_wound_area , sum(peri_wound_size_height) as peri_wound_size_height,
sum(peri_wound_size_width) as peri_wound_size_width, sum(peri_wound_size_depth) as peri_wound_size_depth, wound_id, max(temperature) as temperature, upload_id

from  wound.algo_peri_wound_details
group by upload_id) dpwd on dwd.upload_id = dpwd.upload_id and dwd.wound_id = dpwd.wound_id
left join wound.upload u on u.upload_id = dwd.upload_id
left join wound.wound_healing_score whs on whs.upload_id = u.upload_id
left outer join wound.upload_filename uf on uf.file_type = "raw" and uf.upload_id = u.upload_id 
where dwd.upload_id =?`,[upload_id],  function (err, data, field){
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
