const express = require('express');
const multer = require('multer');

const tokenValidation = require('../token/validateToken');
const router = express.Router();



const GetAllPossibleWoundLocations = require('../controller/GetAllPossibleWoundLocations');
const Login_Validation = require('../controller/Login_Validation');
const GetPrediction = require('../controller/GetPrediction');
const Add_Patient = require('../controller/Add_Patient');
const Get_All_Patients = require('../controller/Get_All_Patients');
const Get_Wound_Details = require('../controller/Get_Wound_Details');
const Get_Upload_Details = require('../controller/Get_Upload_Details');
const Add_Image2 = require('../controller/Add_Image2');
const Edit_Upload_Details = require('../controller/Edit_Upload_Details');
const Add_Image = require('../controller/Add_Image');
const Get_All_Wounds = require('../controller/Get_All_Wounds');
const GetAllPossiblePeriWoundCharacterstics = require('../controller/GetAllPossiblePeriWoundCharacterstics');
const GetTissueType = require('../controller/GetTissueType');
const exudate_type_list = require('../controller/exudate_type_list');
const Get_Patients_Details = require('../controller/Get_Patients_Details');

const Login_Email_Id = require('../controller/actions/Login');

// const Get_Wounds_Details = require('../controller/Get_Wounds_Details')
const Add_Wound = require('../controller/Add_Wound');
const View_Untagged = require('../controller/View_Untagged');
// const Get_All_Untagged = require('../controller/Get_All_Untagged');
// const Update_Untagged = require('../controller/Update_Untagged')


router.route('/Login').post(Login_Validation.Login_Validation);
router.route('/Login_Email_Id').post(Login_Email_Id.Login_Validation);
router.route('/Get_All_Wounds').get(Get_All_Wounds.Get_All_Wounds);
router.route('/Get_Upload_Details').get(Get_Upload_Details.Get_Upload_Details);
router.route('/Get_Wound_Details').get(Get_Wound_Details.Get_Wound_Details); 

router.route('/Add_Patient').post(multer({dest:'temp/'}).fields([{name:'Patient_Image',maxCount:1},{name:'Patient_Name'},{name:'Last_Name',maxCount:1},{name:'DOB'},{name:'Gender'},{name:'Created_By'}
,{name:'blood_group'},{name:'heart_rate'},{name:'weight'},{name:'height'},
{name:'diastole'},{name:'systol'},{name:'SugarLevel'},{name:'body_temp'}]), Add_Patient.Add_Patient);      

router.route('/Add_Wound').post(Add_Wound.Add_Wound);    
router.route('/Get_All_Patients').get(Get_All_Patients.Get_All_Patients);
// router.route('/Update_Untagged').post(Update_Untagged.Update_Untagged)


router.route('/Edit_Upload_Details').post(multer({dest:'temp/'}).fields([{name:'upload_id'},
{name:'tissue_type'},{name:'wound_stage'},{name:'wound_size_height'},{name:'wound_size_width'},{name:'wound_area'},{name:'comment'},{name:'zoom_level'},{name:'height_from_camera'},{name:'wound_temperature'},{name:'peri_wound_temperature'},{name:'temperature'},
{name:'peri_wound_area'},{name:'peri_wound_height'},
{name:'peri_wound_width'},{name:'peri_wound_characterstics'},
{name:'wound_size_depth'},{name:'peri_wound_size_depth'},
{name:'ordor_level'},{name:'pain_level'}]),Edit_Upload_Details.Edit_Upload_Details);   

router.route('/Add_Image2').post(multer({dest:'temp/'}).fields([{name:'ZipFiles',maxCount:1},{name:'user_id'},{name:'patient_id'},{name:'wound_id'},
{name:'tissue_type'},{name:'wound_stage'},{name:'wound_size_height'},{name:'wound_size_width'},{name:'wound_area'},{name:'comment'},{name:'zoom_level'},{name:'height_from_camera'},{name:'wound_temperature'},{name:'peri_wound_temperature'},{name:'temperature'},
{name:'peri_wound_area'},{name:'peri_wound_height'},
{name:'peri_wound_width'},{name:'peri_wound_characterstics'},
{name:'wound_size_depth'},{name:'exudate_type'},
{name:'ordor_level'},{name:'pain_level'}]),Add_Image2.Add_Image2);   
 


router.route('/GetAllPossibleWoundLocations').get(GetAllPossibleWoundLocations.GetAllPossibleWoundLocations);
router.route('/GetAllPossiblePeriWoundCharacterstics').get(GetAllPossiblePeriWoundCharacterstics.GetAllPossiblePeriWoundCharacterstics);
router.route('/GetTissueType').get(GetTissueType.GetTissueType);
router.route('/exudate_type_list').get(exudate_type_list.exudate_type_list);

router.route('/View_Untagged').get(View_Untagged.View_Untagged);
router.route('/GetPrediction').get(GetPrediction.GetPrediction);
// New Flow Routes 
router.route('/Get_Patients_Details').get(Get_Patients_Details.Get_Patients_Details);

const doctorController = require('../controller/doctorController/doctorAPI');

router.route('/get_all_patients').get(tokenValidation.validateToken, doctorController.getPatients);

router.route('/getPatientDetail/:patientId').get(tokenValidation.validateToken, doctorController.getPatientDetail);




const LoginValidation= require('../controller/general/LoginValidation');
const GetAllPatientHighLevelDetailsForDoctor = require('../controller/doctor/GetAllPatientHighLevelDetailsForDoctor');
const GetPatientAllDetails = require('../controller/patient/GetPatientAllDetails');
const GetAllWoundHighLevelDetails = require('../controller/patient/GetAllWoundHighLevelDetails');
const GetUploadDetailsBetweenDates = require('../controller/wound/GetUploadDetailsBetweenDates');
const GetAlgoUploadDetails = require('../controller/upload/GetAlgoUploadDetails');
const GetAlgoUploadDetailsBeforeCleaning = require('../controller/upload/GetAlgoUploadDetailsBeforeCleaning');
const GetUploadDetails = require('../controller/upload/GetUploadDetails');

const PostUploadPeriWoundPredictionSatisfactionComment = require('../controller/upload/PostUploadPeriWoundPredictionSatisfactionComment');
const PostUploadPeriWoundPredictionSatisfactionCommentBeforeCleaning = require('../controller/upload/PostUploadPeriWoundPredictionSatisfactionCommentBeforeCleaning');
const PostUploadWoundPredictionCommentBeforeCleaning = require('../controller/upload/PostUploadWoundPredictionCommentBeforeCleaning');
const PostUploadWoundPredictionSatisfactionComment = require('../controller/upload/PostUploadWoundPredictionSatisfactionComment');

const GetWoundHighLevelDetails = require('../controller/wound/GetWoundHighLevelDetails')
const PostArchivePatient = require('../controller/doctor/PostArchivePatient')
const PostDeleteWound = require('../controller/wound/PostDeleteWound');
const GetCommentsSatisfaction = require('../controller/upload/GetCommentsSatisfaction');
const GetTissueDistribution = require('../controller/upload/GetTissueDistribution');
const BulkUpload_AfterCleaning_NoDepthInfo = require('../controller/actions/BulkUpload_AfterCleaning_NoDepthInfo')

router.route('/GetTissueDistribution').get(GetTissueDistribution.GetTissueDistribution);
router.route('/GetPatientAllDetails').get(GetPatientAllDetails.GetPatientAllDetails);
router.route('/GetAllPatientHighLevelDetailsForDoctor').get(GetAllPatientHighLevelDetailsForDoctor.GetAllPatientHighLevelDetailsForDoctor);
router.route('/GetAllWoundHighLevelDetails').get(GetAllWoundHighLevelDetails.GetAllWoundHighLevelDetails)
router.route('/GetUploadDetailsBetweenDates').get(GetUploadDetailsBetweenDates.GetUploadDetailsBetweenDates)
router.route('/GetWoundHighLevelDetails').get(GetWoundHighLevelDetails.GetWoundHighLevelDetails)
router.route('/PostArchivePatient').post(PostArchivePatient.PostArchivePatient);

router.route('/GetAlgoUploadDetails').get(GetAlgoUploadDetails.GetAlgoUploadDetails)
router.route('/GetAlgoUploadDetailsBeforeCleaning').get(GetAlgoUploadDetailsBeforeCleaning.GetAlgoUploadDetailsBeforeCleaning)
router.route('/GetUploadDetails').get(GetUploadDetails.GetUploadDetails)


router.route('/BulkUpload_AfterCleaning_NoDepthInfo').get(BulkUpload_AfterCleaning_NoDepthInfo.BulkUpload_AfterCleaning_NoDepthInfo)


router.route('/PostUploadPeriWoundPredictionSatisfactionComment').post(PostUploadPeriWoundPredictionSatisfactionComment.PostUploadPeriWoundPredictionSatisfactionComment)
router.route('/PostUploadPeriWoundPredictionSatisfactionCommentBeforeCleaning').post(PostUploadPeriWoundPredictionSatisfactionCommentBeforeCleaning.PostUploadPeriWoundPredictionSatisfactionCommentBeforeCleaning)
router.route('/PostUploadWoundPredictionCommentBeforeCleaning').post(PostUploadWoundPredictionCommentBeforeCleaning.PostUploadWoundPredictionCommentBeforeCleaning)
router.route('/PostUploadWoundPredictionSatisfactionComment').post(PostUploadWoundPredictionSatisfactionComment.PostUploadWoundPredictionSatisfactionComment)

router.route('/PostDeleteWound').post(PostDeleteWound.PostDeleteWound)
router.route('/GetCommentsSatisfaction').get(GetCommentsSatisfaction.GetCommentsSatisfaction)

const GetWoundHoverDetails = require('../controller/upload/GetWoundHoverDetails');
router.route('/GetWoundHoverDetails').get(GetWoundHoverDetails.GetWoundHoverDetails);

const GetAlgoDetailsOnDate = require('../controller/date/GetAlgoDetailsOnDate');
router.route('/GetAlgoDetailsOnDate').get(GetAlgoDetailsOnDate.GetAlgoDetailsOnDate);


const GetTissueDistributionBtwnDate = require('../controller/upload/GetTissueDistributionBtwnDate');
router.route('/GetTissueDistributionBtwnDate').get(GetTissueDistributionBtwnDate.GetTissueDistributionBtwnDate);

const SendEmail = require('../controller/actions/Sendemail');
router.route('/SendEmail').post(SendEmail.SendEmail);

const C_ImageHealighScoreDateUpload = require('../controller/upload/C_ImageHealighScoreDateUpload');
router.route('/C_ImageHealighScoreDateUpload').get(C_ImageHealighScoreDateUpload.C_ImageHealighScoreDateUpload);


const C_HelaingScoreUploadDate = require('../controller/upload/C_HelaingScoreUploadDate');
router.route('/C_HelaingScoreUploadDate').get(C_HelaingScoreUploadDate.C_HelaingScoreUploadDate);


const C_OrdorLevelUploadDate = require('../controller/upload/C_OrdorLevelUploadDate');
router.route('/C_OrdorLevelUploadDate').get(C_OrdorLevelUploadDate.C_OrdorLevelUploadDate);


const C_PainLevelUploadDate = require('../controller/upload/C_PainLevelUploadDate');
router.route('/C_PainLevelUploadDate').get(C_PainLevelUploadDate.C_PainLevelUploadDate);



const C_SizeUploadDate = require('../controller/upload/C_SizeUploadDate');
router.route('/C_SizeUploadDate').get(C_SizeUploadDate.C_SizeUploadDate);


const C_TemperatureUploadDate = require('../controller/upload/C_TemperatureUploadDate');
router.route('/C_TemperatureUploadDate').get(C_TemperatureUploadDate.C_TemperatureUploadDate);


const C_StageUploadDate = require('../controller/upload/C_StageUploadDate');
router.route('/C_StageUploadDate').get(C_StageUploadDate.C_StageUploadDate);


const C_DepthUploadDate = require('../controller/upload/C_DepthUploadDate');
router.route('/C_DepthUploadDate').get(C_DepthUploadDate.C_DepthUploadDate);








module.exports = router;