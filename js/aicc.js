var admin_AiccUrl = "";
var admin_AiccSid = "";
var startTime;
var scoTimer;
var exitPageStatus = false;
var bookmarkSupport = true;
var LastBookmark = "";
var LessonMode = "";
var LessonComplete = false;
var InteractionID = 0;
var AiccInitialized = false;
var CourseRetake = false;

var _AiccDebug = false;  // set this to false to turn debugging off
var REQUEST_TYPE_GET = "GETPARAM";
var REQUEST_TYPE_PUT = "PUTPARAM";
var REQUEST_TYPE_EXIT = "EXITAU";
var REQUEST_TYPE_PUT_INTERACTIONS = "PUTINTERACTIONS";
var RECORD_INTERACTIONS = true;
var OVERWRITE_QUESTIONS = true;
var RETRY_ATTEMPT = 2;
var ERROR_CODE = "0";
var aryDebug=new Array();
var winDebug;

var MODE_NORMAL=1;
var MODE_BROWSE=2;
var MODE_REVIEW=3;
var LESSON_STATUS_PASSED="P";
var LESSON_STATUS_COMPLETED="C";
var LESSON_STATUS_FAILED="F";
var LESSON_STATUS_INCOMPLETE="I";
var LESSON_STATUS_BROWSED="B";
var LESSON_STATUS_NOT_ATTEMPTED="N";
var AICC_INTERACTIONS_ID=0;
var AICC_INTERACTIONS_RESPONSE=1;
var AICC_INTERACTIONS_CORRECT=2;
var AICC_INTERACTIONS_CORRECT_RESPONSE=3;
var AICC_INTERACTIONS_TYPE=4;
var AICC_INTERACTION_TYPE_TRUE_FALSE="T";
var AICC_INTERACTION_TYPE_CHOICE="C";
var AICC_RESULT_CORRECT="C";
var AICC_RESULT_WRONG="W";

var aryAICCFoundItems=new Array();
var AICC_LMS_Version="";
var AICC_Student_ID="";
var AICC_Student_Name="";
var AICC_Lesson_Location="";
var AICC_Score="";
var AICC_Credit="";
var AICC_Lesson_Status="";
var AICC_Time="";
var AICC_Lesson_Mode="";
var AICC_Language="";
var AICC_Data_Chunk="";
var AICC_CourseID="";
var AICC_LESSON_ID="1";
var AICC_fltScoreRaw="";
var AICC_blnCredit=true;
var AICC_strLessonMode=MODE_NORMAL;
var AICC_Status=LESSON_STATUS_NOT_ATTEMPTED;


if(!(typeof (_AiccDebug)=="undefined") && _AiccDebug===true){
WriteToDebug_AICC("Showing Interactive AICC Debug Windows");
ShowDebugWindow_AICC();
}
WriteToDebug_AICC("----------------------------------------");
WriteToDebug_AICC("----------------------------------------");
WriteToDebug_AICC("In Start -- Last Modified="+window.document.lastModified);
WriteToDebug_AICC("Browser Info ("+navigator.appName+" "+navigator.appVersion+")");
WriteToDebug_AICC("URL: "+window.document.location.href);
WriteToDebug_AICC("----------------------------------------");
WriteToDebug_AICC("----------------------------------------");


function StartCourse_AICC(CourseName)
{
	//SuspendData = "5,1,1,10,0,1|5,2,1,10,0,1|5,3,1,10,0,1|5,4,2,0,10,0|6,1,1,0,10,0| 6,2,1,0,10,0|6,3,1,10,0,1|16,1,1,10,0,1|16,2,2,0,10,0|16,3,2,0,10,0|16,4,2,0,10,0|17,1,1,0,10,0| ";
	//LastBookmark = "15-17";
	//alert("admin_ReviewMode = " + admin_ReviewMode);
	//admin_ReviewMode = true;
	WriteToDebug_AICC("Calling StartCourse Function");
	WriteToDebug_AICC("..Admin_UseAicc = " + admin_UseAicc);
	if (admin_UseAicc)
	{
		admin_AiccUrl = getParameterByName_AICC('AICC_URL');
		admin_AiccSid = getParameterByName_AICC('AICC_SID');
		WriteToDebug_AICC("..AICC_URL = " + admin_AiccUrl);
		WriteToDebug_AICC("..AICC_SID = " + admin_AiccSid);

		if(admin_AiccUrl !="" && admin_AiccSid != ""){
			AiccInitialized = true;
		}

		if(AiccInitialized) {

			startTime = startTimer();
			GetParam();

			var status = AICC_Lesson_Status.toLowerCase();
			WriteToDebug_AICC("..Lesson Status = " + status.toString());
			if(status == "completed" || status == "passed" || status == "failed" || status == "c" || status == "p" || status == "f") {
				admin_ReviewMode = true;
				WriteToDebug_AICC("..Course will run in REVIEW mode");
			}
			else {
				admin_ReviewMode = false;
				WriteToDebug_AICC("..Setting incomplete status");
				AICC_Lesson_Status = LESSON_STATUS_INCOMPLETE;
				var _501 = FormAICCPostData();
				WriteToDebug_AICC("..Sending Status to LMS");
				SubmitFormUsingXMLHTTP(admin_AiccUrl,admin_AiccSid,REQUEST_TYPE_PUT,_501);
			}

			LessonMode = AICC_Lesson_Mode.toString();
			WriteToDebug_AICC("..Lesson Mode = " + AICC_Lesson_Mode.toString());
			LastBookmark = AICC_Lesson_Location.toString();
			WriteToDebug_AICC("..Last Bookmark = " + AICC_Lesson_Location.toString());

			SuspendData = AICC_Data_Chunk;
			//load quiz retake number from suspendData and delete it, so it wont stack
			var SuspendDataArrayTemp = SuspendData.split('|');
			if (SuspendDataArrayTemp.length>1) {
				//load quiz retake number
				admin_QuizRetakeCounter = parseInt(SuspendDataArrayTemp[0]);
				SuspendData = SuspendData.substring(SuspendData.indexOf("|") + 1);
			}
			//admin_QuizRetakeCounter = parseInt(SuspendDataArrayTemp[0]);
			WriteToDebug_AICC("..Suspend Data = " + SuspendData.toString());

			if(RECORD_INTERACTIONS){
				WriteToDebug_AICC("..RECORD_INTERACTIONS = " + RECORD_INTERACTIONS.toString());
				if(OVERWRITE_QUESTIONS){
					InteractionID = 0;
				}
				else{
					InteractionID = 0;
				}
				WriteToDebug_AICC("..Interaction Count = " + InteractionID);
			}
			return true;
		}
		else {
			return false;
		}
	}
	else
	{
		return false;
	}
}

function UpdateBookmark_AICC(ModuleID,PageID)
{
	WriteToDebug_AICC("Calling UpdateBookmark Function");
	if (AiccInitialized && !admin_ReviewMode)
	{
		//console.log(ModuleID,PageID);
		WriteToDebug_AICC("..Setting Bookmark = " + ModuleID+"-"+PageID);
		AICC_Lesson_Location = ModuleID+"-"+PageID;
		//alert(AICC_Lesson_Location);
		var _501 = FormAICCPostData();
		WriteToDebug_AICC("..Sending Bookmark to LMS");
		SubmitFormUsingXMLHTTP(admin_AiccUrl,admin_AiccSid,REQUEST_TYPE_PUT,_501);

		//WriteToDebug_AICC("......Calling VerifyData for Bookmark verification");
		//var verificationResult=VerifyData("bookmark",ModuleID+"-"+PageID);
		//WriteToDebug_AICC("......Result of Bookmark Verification = " + verificationResult);
		//if(!verificationResult)
		//	alert(ERROR_CODE + " -- " + lang040);
	}
}

function AddScormQuizAnswer_AICC(QuestionID,AnswerTexts,CorrectAnswerText,UserAnswerText,AnswerIsCorrect)
{
	//console.log( QuestionID + " , " + AnswerTexts + " , " + CorrectAnswerText + " , " + UserAnswerText + " , " + AnswerIsCorrect );
	//console.log(SuspendData);
	var AICC_aryInteractions=new Array();
	var _af;
	var _b0=new Array(5);
	_af=AICC_aryInteractions.length;
	WriteToDebug_AICC("Calling AddScormQuizAnswer Function");
	WriteToDebug_AICC("..QuestionId = " + QuestionID);
	WriteToDebug_AICC("..AnswerTexts = " + AnswerTexts);
	WriteToDebug_AICC("..CorrectAnswerText = " + CorrectAnswerText.toString().substring(0,CorrectAnswerText.toString().length-1));
	WriteToDebug_AICC("..UserAnswerText = " + UserAnswerText);
	WriteToDebug_AICC("..AnswerIsCorrect = " + AnswerIsCorrect);
	//this function will be called at the end of the lesson for all quiz questions answered (will only be called together with SetLessonPassed when learner is successful)
	if (AiccInitialized && !admin_ReviewMode)
	{
		WriteToDebug_AICC("..Setting Suspend Data as = " + admin_QuizRetakeCounter + "|" + SuspendData.toString());
		AICC_Data_Chunk = admin_QuizRetakeCounter + "|" + SuspendData;
		var _501 = FormAICCPostData();
		WriteToDebug_AICC("..Sending Suspend Data to LMS");
		SubmitFormUsingXMLHTTP(admin_AiccUrl,admin_AiccSid,REQUEST_TYPE_PUT,_501);

		/*
		 **
		 *currently this gives error:
		 *[08:32:16.675] LMSSetValue('cmi.interactions.Question_4.id', 'Question 4') returned 'false' in 0.001 seconds
		 *[08:32:16.676] CheckForSetValueError (cmi.interactions.Question_4.id, Question 4, cmi.interactions.Question_n.id, , )
		 *[08:32:16.676] SCORM ERROR FOUND - Set Error State: 201 - The parameter 'cmi.interactions.Question_4.id' is not recognized.
		 *
		 *
		var QuestionID2 = QuestionID.replace(" ","_");
		LMSSetValue( "cmi.interactions."+QuestionID2+".id", QuestionID );
		LMSSetValue( "cmi.interactions."+QuestionID2+".type", "choice" );
		LMSSetValue( "cmi.interactions."+QuestionID2+".student_response", UserAnswerText );
		LMSSetValue( "cmi.interactions."+QuestionID2+".correct_responses.1.pattern", CorrectAnswerText );
		LMSSetValue( "cmi.interactions."+QuestionID2+".result", AnswerIsCorrect );
		*/
		//WriteToDebug_AICC("..RECORD_INTERACTIONS = " + RECORD_INTERACTIONS.toString());

		if(RECORD_INTERACTIONS){
			WriteToDebug_AICC("..Recording Interaction for ID = " + InteractionID.toString());
			if(AnswerIsCorrect.toString().toLowerCase() == "true") AnswerIsCorrect = AICC_RESULT_CORRECT;
			if(AnswerIsCorrect.toString().toLowerCase() == "false") AnswerIsCorrect = AICC_RESULT_WRONG;
			InteractionID = InteractionID + 1;

			_b0[AICC_INTERACTIONS_ID]=QuestionID.toString();
			_b0[AICC_INTERACTIONS_RESPONSE]=UserAnswerText.toString();
			_b0[AICC_INTERACTIONS_CORRECT]=AnswerIsCorrect;
			_b0[AICC_INTERACTIONS_CORRECT_RESPONSE]=CorrectAnswerText.toString().substring(0,CorrectAnswerText.toString().length-1);
			_b0[AICC_INTERACTIONS_TYPE]=AICC_INTERACTION_TYPE_CHOICE;
			AICC_aryInteractions[_af]=_b0;

			if(AICC_aryInteractions.length > 0){
				var _502 = FormAICCInteractionsData(AICC_aryInteractions);
				WriteToDebug_AICC("..Sending Interactions to LMS");
				SubmitFormUsingXMLHTTP(admin_AiccUrl,admin_AiccSid,REQUEST_TYPE_PUT_INTERACTIONS,_502);
			}
		}
	}
}

function CloseCourse_AICC(CourseFailed) {
	WriteToDebug_AICC("Calling CloseCourse Function");
	if (AiccInitialized) {
		if(!admin_ReviewMode) {
			if (CourseFailed) {
				if ((admin_QuizRetakeTillPass) && (admin_QuizRetakeCounter<admin_QuizRetakeMaxCount)) {
					SetCourseRetake_AICC();
				}
			}
			else {
				WriteToDebug_AICC("..LessonComplete = " + LessonComplete.toString());
				if (!LessonComplete){
					AICC_Lesson_Status = LESSON_STATUS_INCOMPLETE;
				}
				else{
					AICC_Lesson_Location = "0";
					if(DISPLAY_CERTIFICATE)
					{
						window.open("xmls/en/certificate.htm?studentname="+AICC_Student_Name.toString(),"_new","toolbar=no, menubar=no, status=no, location=no,height=500, width=700");
					}
				}
			}
				}
		else
		{
			if(DISPLAY_CERTIFICATE_FOR_COMPLETED_COURSE)
			{
				window.open("xmls/en/certificate.htm?studentname="+AICC_Student_Name.toString(),"_new","toolbar=no, menubar=no, status=no, location=no,height=500, width=700");
			}
		}

		WriteToDebug_AICC("..Setting Session Time as = " + endTimer(startTime));
		var _501 = FormAICCPostData();
		WriteToDebug_AICC("..Sending Status, Bookmark, Time to LMS");
		SubmitFormUsingXMLHTTP(admin_AiccUrl,admin_AiccSid,REQUEST_TYPE_PUT,_501);
		WriteToDebug_AICC("..Calling Exit AU");
		WriteToDebug_AICC("..Sending Exit Signal to LMS");
		SubmitFormUsingXMLHTTP(admin_AiccUrl,admin_AiccSid, REQUEST_TYPE_EXIT, "");
		self.close();
	}
	else {
		//navigate to urlonExit
		if(admin_URLOnExit != "") {
			try {
				window.location.href=admin_URLOnExit;
			}
			catch (e) {
			// do nothing
			}
			//window.location.assign("http://www.google.com");
		}
	}
}

function unloadPage_AICC() {
	WriteToDebug_AICC("Calling unloadPage Function");
	CloseCourse_AICC(false);
}

function SetLessonPassed_AICC(ScorePercentage,HasPassedQuiz) {
	//console.log(ScorePercentage+" "+HasPassedQuiz+" "+ScormInitialized);
	//this function will be called at the end of the lesson after the learner is successful with the quiz)
	WriteToDebug_AICC("Calling SetLessonPassed Function");
	WriteToDebug_AICC("..ScorePercentage = " + ScorePercentage.toString());
	WriteToDebug_AICC("..HasPassedQuiz = " + HasPassedQuiz.toString());
	if (AiccInitialized && !admin_ReviewMode) {
		LessonComplete = true;
		WriteToDebug_AICC("..Setting Score = " + ScorePercentage.toString());
		AICC_Score = ScorePercentage.toString();

		//WriteToDebug_AICC("......Calling VerifyData for Score verification");
		//var verificationResult=VerifyData("score",ScorePercentage.toString());
		//WriteToDebug_AICC("......Result of Score Verification = " + verificationResult);
		//if(!verificationResult)
		//	alert(ERROR_CODE + " -- " + lang041);

		AICC_Lesson_Location = "0";

		var _501 = FormAICCPostData();
		WriteToDebug_AICC("..Sending Score, Bookmark to LMS");
		SubmitFormUsingXMLHTTP(admin_AiccUrl,admin_AiccSid,REQUEST_TYPE_PUT,_501);

		if (HasPassedQuiz) {
			WriteToDebug_AICC("..Setting Lesson Status as Passed");
			AICC_Lesson_Status = LESSON_STATUS_PASSED;

			//WriteToDebug_AICC("......Calling VerifyData for Status verification");
			//var verificationResult=VerifyData("status","passed");
			//WriteToDebug_AICC("......Result of Status Verification = " + verificationResult);
			//if(!verificationResult)
			//	alert(ERROR_CODE + " -- " + lang042);

		}
		else {
			WriteToDebug_AICC("..Setting Lesson Status as failed");
			AICC_Lesson_Status = LESSON_STATUS_FAILED;

			//WriteToDebug_AICC("......Calling VerifyData for Status verification");
			//var verificationResult=VerifyData("status","failed");
			//WriteToDebug_AICC("......Result of Status Verification = " + verificationResult);
			//if(!verificationResult)
			//	alert(ERROR_CODE + " -- " + lang042);
		}

		var _501 = FormAICCPostData();
		WriteToDebug_AICC("..Sending Status to LMS");
		SubmitFormUsingXMLHTTP(admin_AiccUrl,admin_AiccSid,REQUEST_TYPE_PUT,_501);

	}
}

function SetScormCoursePassed_AICC() {
	//console.log(ScorePercentage+" "+HasPassedQuiz+" "+ScormInitialized);
	//this function will be called at the end of the lesson after the learner is successful with the quiz)
	WriteToDebug_AICC("Calling SetScormCoursePassed Function");
	if (AiccInitialized && !admin_ReviewMode) {
		LessonComplete = true;

		AICC_Lesson_Location = "0";

		WriteToDebug_AICC("..Setting Lesson Status as completed");
		AICC_Lesson_Status = LESSON_STATUS_COMPLETED;

		//WriteToDebug_AICC("......Calling VerifyData for Status verification");
		//verificationResult=VerifyData("status","completed");
		//WriteToDebug_AICC("......Result of Status Verification = " + verificationResult);
		//if(!verificationResult)
		//	alert(ERROR_CODE + " -- " + lang042);

		var _501 = FormAICCPostData();
		WriteToDebug_AICC("..Sending Status to LMS");
		SubmitFormUsingXMLHTTP(admin_AiccUrl,admin_AiccSid,REQUEST_TYPE_PUT,_501);
	}
}

function SetCourseRetake_AICC() {
	CourseRetake = true;
	if (AiccInitialized && !admin_ReviewMode) {
		WriteToDebug_AICC("Calling SetCourseRetake Function");
		WriteToDebug_AICC("..Setting Bookmark as blank");
		AICC_Lesson_Location = "0";

		//WriteToDebug_AICC("......Calling VerifyData for Bookmark verification");
		//var verificationResult=VerifyData("bookmark","");
		//WriteToDebug_AICC("......Result of Status Verification = " + verificationResult);
		//if(!verificationResult)
		//	alert(ERROR_CODE + " -- " + lang042);

		WriteToDebug_AICC("..Setting Status as incopmlete");
		AICC_Lesson_Status = LESSON_STATUS_INCOMPLETE;

		var _501 = FormAICCPostData();
		WriteToDebug_AICC("..Sending Bookmark, Status to LMS");
		SubmitFormUsingXMLHTTP(admin_AiccUrl,admin_AiccSid,REQUEST_TYPE_PUT,_501);

		WriteToDebug_AICC("..Setting Score as zero");
		//	LMSSetValue("cmi.core.score.raw","0"); ------------------------------- **** SOME LMS missunderstand this as the course is completed with fail

		//WriteToDebug_AICC("......Calling VerifyData for Score verification");
		//var verificationResult=VerifyData("score","0");
		//WriteToDebug_AICC("......Result of Status Verification = " + verificationResult);
		//if(!verificationResult)
		//	alert(ERROR_CODE + " -- " + lang042);

		WriteToDebug_AICC("..Setting SuspendData as blank");
		AICC_Data_Chunk = admin_QuizRetakeCounter + "|";

		_501 = FormAICCPostData();
		WriteToDebug_AICC("..Sending Suspend Data to LMS");
		SubmitFormUsingXMLHTTP(admin_AiccUrl,admin_AiccSid,REQUEST_TYPE_PUT,_501);
	}
}

function AICC_CommitData(){

}


function pause(millisecondi){
	var now = new Date();
	var exitTime = now.getTime() + millisecondi;
	while(true){
		now = new Date();
		if(now.getTime() > exitTime) return;
	}
}

function GetParam(){
	var DataFromLMS = "";
	var getParamData = "command=getParam&version=2.2&session_id="+admin_AiccSid;
	WriteToDebug_AICC("..GetParam Called");
	PostRequest(admin_AiccUrl,getParamData);
}

function ParsePostData(txtResponse){
	var dataFromLMS = "";
	WriteToDebug_AICC("....In ParsePostData");
	if(txtResponse != "" && txtResponse != "undefined"){
		ParseGetParamData(txtResponse);
		//alert("AICC_Student_Name = " + AICC_Student_Name);
		//alert("AICC_Lesson_Location = " + AICC_Lesson_Location);
		//alert("AICC_Lesson_Status = " + AICC_Lesson_Status);
	}
}

function PostRequest(vURL,vParam){
	//var retVal;
	//var postData=vParam;
	$.ajax({
       type: "POST",
       url: vURL,
       data: vParam,
       contentType: "application/x-www-form-urlencoded",
       async: false,
       success: ParsePostData,
       error: function (XMLHttpRequest, textStatus, errorThrown) {
			WriteToDebug_AICC("..Error in PostRequest = " + XMLHttpRequest.responseText);
           alert(XMLHttpRequest.responseText);
       }
	});

	//return retVal;
}

function GetRequest(vURL){
	//var retVal;
	//var postData=vParam;
	$.ajax({
       type: "GET",
       url: vURL,
       contentType: "application/x-www-form-urlencoded",
       async: false,
       success: ParseGetData,
       error: function (XMLHttpRequest, textStatus, errorThrown) {
           alert(XMLHttpRequest.responseText);
       }
	});

	//return retVal;
}

function getParameterByName_AICC(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

//Parsing GetParam Data
function ParseGetParamData(_128){
WriteToDebug_AICC("....In ParseGetParamData");
var _129;
var _12a;
var _12b;
var _12c;
var i,j;
_128=new String(_128);
_129=_128.split("\n");
WriteToDebug_AICC("......Split String");
for(i=0;i<_129.length;i++){
WriteToDebug_AICC("......Processing Line #"+i+": "+_129[i]);
_12a=_129[i];
_12b="";
_12c="";
if(_12a.length>0){
WriteToDebug_AICC("......Found non-zero length string");
if(_12a.charAt(0)=="\r"){
WriteToDebug_AICC("......Detected leading \\r");
_12a=_12a.substr(1);
}
if(_12a.charAt(_12a.length-1)=="\r"){
WriteToDebug_AICC("......Detected trailing \\r");
_12a=_12a.substr(0,_12a.length-1);
}
if(_12a.charAt(0)!=";"){
WriteToDebug_AICC("......Found non-comment line");
_12b=GetNameFromAICCLine(_12a);
_12c=GetValueFromAICCLine(_12a);
WriteToDebug_AICC("......strLineName="+_12b+", strLineValue="+_12c);
}
}
_12b=_12b.toLowerCase();

if(!AICC_HasItemBeenFound(_12b)){
WriteToDebug_AICC("......Detected an un-found item");
AICC_FoundItem(_12b);
switch(_12b){
case "version":
WriteToDebug_AICC("......Item is version");
var _12f=parseFloat(_12c);
if(isNaN(_12f)){
_12f=0;
}
AICC_LMS_Version=_12f;
break;
case "student_id":
WriteToDebug_AICC("......Item is student_id");
AICC_Student_ID=_12c;
break;
case "student_name":
WriteToDebug_AICC("......Item is student_name");
AICC_Student_Name=_12c;
break;
case "lesson_location":
WriteToDebug_AICC("......Item is lesson_location");
AICC_Lesson_Location=_12c;
break;
case "score":
WriteToDebug_AICC("......Item is score");
AICC_Score=_12c;
AICC_SeperateScoreValues(AICC_Score);
break;
case "credit":
WriteToDebug_AICC("......Item is credit");
AICC_Credit=_12c;
AICC_TranslateCredit(AICC_Credit);
break;
case "lesson_status":
WriteToDebug_AICC("......Item is lesson_status");
AICC_Lesson_Status=_12c;
AICC_TranslateLessonStatus(AICC_Lesson_Status);
break;
case "lesson_mode":
WriteToDebug_AICC("......Item is lesson_mode");
AICC_Lesson_Mode=_12c;
AICC_TranslateLessonMode(AICC_Lesson_Mode);
break;
case "language":
WriteToDebug_AICC("......Item is language");
AICC_Language=_12c;
break;
case "course_id":
WriteToDebug_AICC("Item is course id");
AICC_CourseID=_12c;
break;
case "core_lesson":
WriteToDebug_AICC("......Item is core_lesson");
AICC_Data_Chunk="";
_12a="";
j=1;
if((i+j)<_129.length){
_12a=_129[i+j];
}
while(((i+j)<_129.length)&&(!IsGroupIdentifier(_12a))){
if(_12a.charAt(0)!=";"){
AICC_Data_Chunk+=_12a+"\n";
}
j=j+1;
if((i+j)<_129.length){
_12a=_129[i+j];
}
}
i=i+j-1;
AICC_Data_Chunk=AICC_Data_Chunk.replace(/\s*$/,"");
break;
default:
WriteToDebug_AICC("......Unknown Item Found");
break;
}
}
}
return true;
}
function IsGroupIdentifier(_130){
WriteToDebug_AICC("......In IsGroupIdentifier, strLine="+_130);
var _131;
_130=_130.replace(/^\s*/,"");
_131=_130.search(/\[[\w]+\]/);
WriteToDebug_AICC("intPos="+_131);
if(_131==0){
WriteToDebug_AICC("......Returning True");
return true;
}else{
WriteToDebug_AICC("......Returning False");
return false;
}
}
function AICC_FoundItem(_132){
WriteToDebug_AICC("......In AICC_FoundItem, strItem="+_132);
aryAICCFoundItems[_132]=true;
}
function AICC_HasItemBeenFound(_133){
WriteToDebug_AICC("......In AICC_HasItemBeenFound, strItem="+_133);
if(aryAICCFoundItems[_133]==true){
WriteToDebug_AICC("......Returning True");
return true;
}else{
WriteToDebug_AICC("......Returning False");
return false;
}
}
function AICC_TranslateCredit(_137){
WriteToDebug_AICC("......In AICC_TranslateCredit, strCredit="+_137);
var _138;
_138=_137.toLowerCase().charAt(0);
if(_138=="c"){
WriteToDebug_AICC("......Credit = true");
AICC_blnCredit=true;
}else{
if(_138=="n"){
WriteToDebug_AICC("......Credit = false");
AICC_blnCredit=false;
}else{
WriteToDebug_AICC("......ERROR - credit value from LMS is not a valid");
}
}
}
function AICC_TranslateLessonMode(_139){
WriteToDebug_AICC("......In AICC_TranslateLessonMode, strMode="+_139);
var _13a;
_13a=_139.toLowerCase().charAt(0);
if(_13a=="b"){
WriteToDebug_AICC("......Lesson Mode = Browse");
AICC_strLessonMode=MODE_BROWSE;
}else{
if(_13a=="n"){
WriteToDebug_AICC("......Lesson Mode = normal");
AICC_strLessonMode=MODE_NORMAL;
}else{
if(_13a=="r"){
WriteToDebug_AICC("......Lesson Mode = review");
AICC_strLessonMode=MODE_REVIEW;
if(!(typeof (REVIEW_MODE_IS_READ_ONLY)=="undefined")&&REVIEW_MODE_IS_READ_ONLY===true){
blnReviewModeSoReadOnly=true;
}
}else{
WriteToDebug_AICC("......ERROR - lesson_mode value from LMS is not a valid");
}
}
}
}
function AICC_TranslateLessonStatus(_143){
WriteToDebug_AICC("......In AICC_TranslateLessonStatus, strStatus="+_143);
var _144;
var _145;
var _146;
_144=_143.charAt(0).toLowerCase();
AICC_Lesson_Status =_144;
WriteToDebug_AICC("......AICC_Status="+AICC_Lesson_Status);
}
function AICC_SeperateScoreValues(_134){
WriteToDebug_AICC("......In AICC_SeperateScoreValues, AICC_Score="+_134);
var _135;
aryScore=_134.split(",");
AICC_fltScoreRaw=aryScore[0];
AICC_fltScoreRaw=parseFloat(AICC_fltScoreRaw);
WriteToDebug_AICC("......AICC_fltScoreRaw="+AICC_fltScoreRaw.toString());
}
function GetValueFromAICCLine(_11c){
WriteToDebug_AICC("......In GetValueFromAICCLine, strLine="+_11c);
var _11d;
var _11e="";
var _11f;
_11c=new String(_11c);
_11d=_11c.indexOf("=");
WriteToDebug_AICC("......intPos="+_11d);
if(_11d>-1&&((_11d+1)<_11c.length)){
WriteToDebug_AICC("......Grabbing value");
_11f=_11c.substring(_11d+1);
WriteToDebug_AICC("......strTemp="+_11f);
_11f=_11f.replace(/^\s*/,"");
_11f=_11f.replace(/\s*$/,"");
_11e=_11f;
}
WriteToDebug_AICC("......returning "+_11e);
return _11e;
}
function GetNameFromAICCLine(_120){
WriteToDebug_AICC("......In GetNameFromAICCLine, strLine="+_120);
var _121;
var _122;
var _123="";
_120=new String(_120);
_121=_120.indexOf("=");
WriteToDebug_AICC("......intPos="+_121);
if(_121>-1&&_121<_120.length){
WriteToDebug_AICC("......Grabbing name from name/value pair");
_122=_120.substring(0,_121);
WriteToDebug_AICC("strTemp="+_122);
_122=_122.replace(/^\s*/,"");
_122=_122.replace(/\s*$/,"");
_123=_122;
}else{
WriteToDebug_AICC("......Grabbing name from group / section heading");
_121=_120.indexOf("[");
WriteToDebug_AICC("......intPos="+_121);
if(_121>-1){
WriteToDebug_AICC("Replacing []");
_122=_120.replace(/[\[|\]]/g,"");
WriteToDebug_AICC("strTemp="+_122);
_122=_122.replace(/^\s*/,"");
_122=_122.replace(/\s*$/,"");
_123=_122;
}
}
WriteToDebug_AICC("......returning "+_123);
return _123;
}
//end

function SubmitFormUsingXMLHTTP(strAICCURL, strAICCSID, strRequestType, strAICCData){
	var strReturn;
	var strPostData;
	WriteToDebug ("....In SubmitFormUsingXMLHTTP, opening connetion");
	strPostData = "session_id=" + URLEncode(strAICCSID) +
				  "&version=3.5" +
				  "&command=" + URLEncode(strRequestType) +
				  "&aicc_data=" + URLEncode(strAICCData);

	$.ajax({
       type: "POST",
       url: strAICCURL,
       data: strPostData,
       contentType: "application/x-www-form-urlencoded",
       async: false,
       success: function(msg) {
		strReturn = msg;
		WriteToDebug ("....LMS Response=" + strReturn);
	   },
       error: function (XMLHttpRequest, textStatus, errorThrown) {
			WriteToDebug_AICC("....Error in PostRequest = " + XMLHttpRequest.responseText);
           alert(XMLHttpRequest.responseText);
       }
	});

	/*
	objXMLHTTP.open ("POST", strAICCURL, false);
	WriteToDebug ("..Setting Request Header");
	objXMLHTTP.setRequestHeader ("Content-Type", "application/x-www-form-urlencoded");
	WriteToDebug ("..Creating Post Data");
	WriteToDebug ("..Sending Post Data-" + strPostData);
	objXMLHTTP.send (strPostData);
	WriteToDebug ("..Looking up Response Text");
	strReturn = objXMLHTTP.responseText;
	WriteToDebug ("LMS Response=" + strReturn);
	//ProcessLMSResult(strRequestType, strReturn);
	*/
}

function FormAICCPostData(){
WriteToDebug_AICC("....In FormAICCPostData");
var _169="";
_169+="[Core]\r\n";
_169+="Lesson_Location="+AICC_Lesson_Location+"\r\n";
_169+="Lesson_Status="+AICC_Lesson_Status+"\r\n";
_169+="Score="+AICC_Score+"\r\n";
_169+="Time="+endTimer(startTime)+"\r\n";
_169+="[Comments]\r\n";
_169+="[Objectives_Status]\r\n";
//_169+="[Student_Preferences]\r\n";
//_169+="Audio=";
//_169+="Language=";
//_169+="Speed=";
//_169+="Text=";
_169+="[Core_Lesson]\r\n";
_169+=AICC_Data_Chunk;
WriteToDebug_AICC("....FormAICCPostData returning: "+_169);
return _169;
}

function FormAICCInteractionsData(AICC_aryInteractions){
WriteToDebug_AICC("....In FormAICCInteractionsData");
var _173;
var _174;
var _175;
var _176="";
_173="\"course_id\",\"student_id\",\"lesson_id\",\"interaction_id\","+"\"objective_id\",\"type_interaction\",\"correct_response\",\"student_response\","+"\"result\"\r\n";
var _177="";
var _178="";
var _179="";
var _17a="";
for(var i=0;i<AICC_aryInteractions.length;i++){
_176=AICC_aryInteractions[i][AICC_INTERACTIONS_CORRECT];
_178=AICC_aryInteractions[i][AICC_INTERACTIONS_RESPONSE];
_179=AICC_aryInteractions[i][AICC_INTERACTIONS_CORRECT_RESPONSE];
_178=new String(_178);
_179=new String(_179);

_173+="\""+AICC_CourseID.replace("\"","")+"\",\""+AICC_Student_ID.replace("\"","")+"\",\""+AICC_LESSON_ID.replace("\"","")+"\",\""+AICC_aryInteractions[i][AICC_INTERACTIONS_ID].replace("\"","")+"\","+"\"\""+",\""+AICC_aryInteractions[i][AICC_INTERACTIONS_TYPE]+"\",\""+_179.replace("\"","")+"\",\""+_178.replace("\"","")+"\",\""+_176+"\"\r\n";
}
WriteToDebug_AICC("....FormAICCInteractionsData returning: "+_173);
return _173;
}



function WriteToDebug_AICC(_165){
if(_AiccDebug){
var dtm=new Date();
var _167;
_167=aryDebug.length+":"+dtm.toString()+" - "+_165;
aryDebug[aryDebug.length]=_167;
if(winDebug&&!winDebug.closed){
winDebug.document.write(_167+"<br>\n");
}
}
return;
}
function ShowDebugWindow_AICC(){
if(winDebug&&!winDebug.closed){
winDebug.close();
}
winDebug=window.open("blank.htm","Debug","width=600,height=300,resizable,scrollbars");
winDebug.document.write(aryDebug.join("<br>\n"));
winDebug.document.close();
winDebug.focus();
return;
}

function URLEncode(str){
str = new String(str);
str = escape(str);
str = str.replace(/%20/g, "+");
return str;
}
