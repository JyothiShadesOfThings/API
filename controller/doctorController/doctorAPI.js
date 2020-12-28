const dbconnection = require("../../database/mysqlConnection");

module.exports.getPatients = async (req, res) => {
  const doctorName = req.uuid;
  dbconnection.query(
    `select p.patient_id, p.patient_name, gender, FLOOR(DATEDIFF( CURRENT_DATE() , dob)/365) as Age , 
        DATE_FORMAT(created_date, "%b %d %Y") as created_date ,NoWounds, LastUpdate
        from wound.patient  p
        inner join (
        select count(wound_id) as NoWounds, patient_id
        from wound.wound
        group by patient_id
        )w 
        on p.patient_id = w.patient_id
        inner join(
        select max(upload_datetime) as LastUpdate, patient_id
        from wound.upload
        group by patient_id
        )u
        on u.patient_id = p.patient_id
        where p.created_by = '${doctorName}';`,
    function (err, data, field) {
      if (err) {
        console.log(err);
      }
      if (data) {
        res.status(200);
        res.json({ success: true, patients_list: data });
      }
    }
  );
};

module.exports.getPatientDetail = async (req, res) => {
  const patientId = req.params.patientId;
  dbconnection.query(
    `select w.wound_id,w.patient_id, w.wound_location, w.wound_type, ufn.file_name,
    case when DATEDIFF(CURRENT_DATE() , DATE(u.upload_datetime)) < 7 then CONCAT(FLOOR(DATEDIFF(CURRENT_DATE() , DATE(u.upload_datetime))) ,' days ago')
    when DATEDIFF(CURRENT_DATE() , DATE(u.upload_datetime)) < 30 then CONCAT(FLOOR(DATEDIFF(CURRENT_DATE() , DATE(u.upload_datetime))/7 ),' weeks ago')
    else CONCAT(FLOOR(DATEDIFF(CURRENT_DATE() , DATE(u.upload_datetime))/30) ,' months ago') end as Last_Activity, w.wound_begin_date, 
    dwd2.wound_stage, dwd2.tissue_type,dwd2.wound_area, u2.upload_datetime as Date_Created , Floor(coalesce(CMPLT_entries,0)*100/TTL_entries) as PerCompleteInfo
    from wound w 
    inner join (
    select wound_id, max(upload_id) as max_upload_id, count(*) as TTL_entries , min(upload_id) as first_wound_id
    from doc_wound_details
    group by wound_id
    )dwd
    on w.wound_id = dwd.wound_id
    inner join wound.upload u2 on u2.upload_id = dwd.first_wound_id
    inner join wound.upload u on u.upload_id = dwd.max_upload_id
    inner join wound.upload_filename ufn on ufn.upload_id = dwd.max_upload_id and ufn.file_type = 'raw'
    inner join
    (
    select upload_id, wound_id,wound_stage, tissue_type,wound_area
    from doc_wound_details
    group by wound_id
    )dwd2
    on dwd2.wound_id = dwd.wound_id and dwd2.upload_id = dwd.max_upload_id
    left outer join(
    select count(*) as CMPLT_entries, wound_id
    from wound.doc_wound_details
    where wound_area > 0 and wound_area is not null and
    wound_size_height > 0 and wound_size_height is not null and
    wound_size_depth > 0 and wound_size_depth is not null and
    wound_size_width > 0 and wound_size_width is not null 
    group by wound_id
    ) cmpl_wd
    on cmpl_wd.wound_id = w.wound_id
    where w.patient_id = "${patientId}";`
  ,function(err,data,filed){
      if(err){
          console.log(err);
      }
      else{
        res.status(200);
        res.json({success: true,patient_detail: data });
      }
  });
};
