/*
 * IEngine4
 * IEngine4 Video Engine
 *
 * Copyright (c) Inspired eLearning Inc. 2003-2014.  All Rights Reserved.
 * This source file is proprietary property of Inspired eLearning Inc.
 * http://http://www.inspiredelearning.com/inspired/License
 *
 * @version 4.8.1
 */

//http://scorm.com/scorm-explained/technical-scorm/run-time/run-time-reference/

var _Debug = false;  // set this to false to turn debugging off
var RECORD_INTERACTIONS = true;
var OVERWRITE_QUESTIONS = true;
var RETRY_ATTEMPT = 2;
var ERROR_CODE = "0";

var startTime;
var scoTimer;
var exitPageStatus = false;
var bookmarkSupport = true;
var LastBookmark = "";
var LessonMode = "";
var LessonComplete = false;
var InteractionID = 0;
var ScormInitialized = false;
var CourseRetake = false;
var StudentName = "";
var PreExamInteractionId = 0;
var PreExamValues = "PreExam";
var oldRetakeCounter = "";


if(!(typeof (_Debug)=="undefined") && _Debug===true){
WriteToDebug("Showing Interactive Debug Windows");
ShowDebugWindow();
}
WriteToDebug("----------------------------------------");
WriteToDebug("----------------------------------------");
WriteToDebug("In Start - Version: "+VERSION+"  -- Last Modified="+window.document.lastModified);
WriteToDebug("Browser Info ("+navigator.appName+" "+navigator.appVersion+")");
WriteToDebug("URL: "+window.document.location.href);
WriteToDebug("----------------------------------------");
WriteToDebug("----------------------------------------");

function StartCourse(CourseName)
{
	//SuspendData = "5,1,1,10,0,1|5,2,1,10,0,1|5,3,1,10,0,1|5,4,2,0,10,0|6,1,1,0,10,0| 6,2,1,0,10,0|6,3,1,10,0,1|16,1,1,10,0,1|16,2,2,0,10,0|16,3,2,0,10,0|16,4,2,0,10,0|17,1,1,0,10,0| ";
	//LastBookmark = "15-17";
	//alert("admin_ReviewMode = " + admin_ReviewMode);
	//admin_ReviewMode = true;
	WriteToDebug("Calling StartCourse Function");
	WriteToDebug("..Admin_UseSCORM = " + admin_UseScorm);
	if (admin_UseScorm)
	{
		startTime = startTimer();
		if(LMSIsInitialized()){
			WriteToDebug("..LMS is already Initialized");
			ScormInitialized = true;
		}
		else{
			WriteToDebug("..Calling LMSInitialize");
			ScormInitialized = LMSInitialize();
		}
		//console.log( "scorm init status: "+ScormInitialized );
		// uncomment bellow line to start in review mode
		// admin_ReviewMode = true;
		WriteToDebug("..LMS Initialized = " + ScormInitialized);
		if (ScormInitialized)
		{
			var status = LMSGetValue( "cmi.core.lesson_status" ); //(“passed”, “completed”, “failed”, “incomplete”, “browsed”, “not attempted”, RW)
			WriteToDebug("..Lesson Status = " + status.toString());
			if(status.toLowerCase() == "completed" || status.toLowerCase() == "passed" || status.toLowerCase() == "failed")
			{
				admin_ReviewMode = true;
				WriteToDebug("..Course will run in REVIEW mode");
			}
			else
			{
				admin_ReviewMode = false;
			}
			var status2 = LMSGetValue( "cmi.core.entry" ); //  (“ab-initio”, “resume”, “”, RO) Asserts whether the learner has previously accessed the SCO
			WriteToDebug("..Cmi.Core.Entry = " + status2.toString());
			if ((status == "not attempted") || (status2== "ab-initio"))
			{
				// the student is now attempting the lesson
				WriteToDebug("..Setting incomplete status");
				LMSSetValue( "cmi.core.lesson_status", "incomplete" );
				admin_ReviewMode = false;
			}
			
			StudentName = LMSGetValue("cmi.core.student_name");
			WriteToDebug("..Student Name = " + StudentName.toString());
			
			//console.log("status: "+ status + " entry: "+ status2 );
			LessonMode = LMSGetValue("cmi.core.lesson_mode"); // (“browse”, “normal”, “review”, RO)
			WriteToDebug("..Lesson Mode = " + LessonMode.toString());
			LastBookmark = LMSGetValue("cmi.core.lesson_location");
			WriteToDebug("..Last Bookmark = " + LastBookmark.toString());
			SuspendData = LMSGetValue("cmi.suspend_data");
			SuspendData = String(SuspendData);
			//load quiz retake number from suspendData and delete it, so it wont stack
			
			var SuspendDataArrayTemp = SuspendData.split('|');
			
			if (SuspendDataArrayTemp.length>1)
			{
				//load quiz retake number
				retakeCounterStr = SuspendDataArrayTemp[0];
				var retakeCounterStrSplit1 = retakeCounterStr.split(";");

				for (var i = 0, length = retakeCounterStrSplit1.length; i < length; i++) {
	
					var chunk = retakeCounterStrSplit1[i];
					var retakeCounterStrSplit2 = chunk.split("-");
					admin_QuizRetakeCounter[retakeCounterStrSplit2[0]] = parseInt(retakeCounterStrSplit2[1],10);
					if (admin_QuizRetakeCounter[retakeCounterStrSplit2[0]]==admin_QuizRetakeMaxCount)
					{
						admin_QuizRetakeCounter[retakeCounterStrSplit2[0]] = 0;
					}
				}
				
				SuspendData = SuspendData.substring(SuspendData.indexOf("|") + 1);

				GamificationCounterStr = SuspendDataArrayTemp[1];
				var GamificationCounterStrSplit1 = GamificationCounterStr.split(",");
				
				GamificationComputerScore = parseInt(GamificationCounterStrSplit1[0]);
				GamificationQuestionUserScore = parseInt(GamificationCounterStrSplit1[1]);
				
				for(var i=2; i<GamificationScoreArray.length; i++) 
				{ 
					if (GamificationCounterStrSplit1[i]!="") 
					{
						GamificationScoreArray.push( parseInt(GamificationCounterStrSplit1[i]) );
					}
				}
			}

			WriteToDebug("..Suspend Data = " + SuspendData.toString());
			GetPreExamValueFromSuspendData(SuspendData);
			if(RECORD_INTERACTIONS){
				WriteToDebug("..RECORD_INTERACTIONS = " + RECORD_INTERACTIONS.toString());
				if(OVERWRITE_QUESTIONS){
					InteractionID = 0;
				}
				else{
					InteractionID = LMSGetValue("cmi.interactions._count");
				}
				
				if( admin_HostedOniLMS == true && (typeof admin_PreExamFile!="undefined"))
				{
					InteractionID = PreExamInteractionId;
				}
				WriteToDebug("..HostedOniLMS = " + admin_HostedOniLMS + " , PreExamFile = " + admin_PreExamFile);
				WriteToDebug("..Interaction Count = " + InteractionID);
			}
			//console.log("BookMark: "+ LastBookmark + ", Suspend Data: "+ SuspendData );
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}

function UpdateBookmark(ModuleID,PageID)
{
	WriteToDebug("Calling UpdateBookmark Function");
	if (ScormInitialized && !admin_ReviewMode)
	{
		//console.log(ModuleID,PageID);
		WriteToDebug("..Setting Bookmark = " + ModuleID+"-"+PageID);
		LMSSetValue("cmi.core.lesson_location", ModuleID+"-"+PageID );

		WriteToDebug("......Calling VerifyData for Bookmark verification");
		var verificationResult=VerifyData("bookmark",ModuleID+"-"+PageID);
		WriteToDebug("......Result of Bookmark Verification = " + verificationResult);
		if(!verificationResult)
			alert(ERROR_CODE + " -- " + lang040);
		
		//update suspend data with bookmark in case final exam doesnt report each question to scorm
		var retakeCounterStr = "";
		for (var key in admin_QuizRetakeCounter) {
			if (retakeCounterStr!="") { retakeCounterStr += ";"; }
			retakeCounterStr +=key+"-"+admin_QuizRetakeCounter[key];
		}	
		WriteToDebug("..Setting Suspend Data as = " + retakeCounterStr + "|" + SuspendData.toString());
		LMSSetValue( "cmi.suspend_data", retakeCounterStr + "|" + GamificationSuspendData + "|" + SuspendData );
	}
}

function AddScormQuizAnswer(QuestionID,QuestionText,AnswerTexts,CorrectAnswerText,UserAnswerText,AnswerIsCorrect)
{
	//console.log( QuestionID + " , " + AnswerTexts + " , " + CorrectAnswerText + " , " + UserAnswerText + " , " + AnswerIsCorrect );
	//console.log(SuspendData);
	WriteToDebug("Calling AddScormQuizAnswer Function");
	WriteToDebug("..QuestionId = " + QuestionID);
	WriteToDebug("..QuestionText = " + striphtmlcode(QuestionText));
	WriteToDebug("..AnswerTexts = " + striphtmlcode(AnswerTexts));
	WriteToDebug("..CorrectAnswerText = " + CorrectAnswerText.toString());
	WriteToDebug("..UserAnswerText = " + UserAnswerText);
	WriteToDebug("..AnswerIsCorrect = " + AnswerIsCorrect);
	//this function will be called at the end of the lesson for all quiz questions answered (will only be called together with SetLessonPassed when learner is successful)
	
	retakeCounterStr = "";
	for (var key in admin_QuizRetakeCounter) {
		if (retakeCounterStr!="") { retakeCounterStr += ";"; }
		retakeCounterStr +=key+"-"+admin_QuizRetakeCounter[key];
	}	
//	 console.log(retakeCounterStr);
	
	if (ScormInitialized && !admin_ReviewMode)
	{
		WriteToDebug("..Setting Suspend Data as = " + retakeCounterStr + "|" + SuspendData.toString());
		LMSSetValue( "cmi.suspend_data", retakeCounterStr + "|" + GamificationSuspendData + "|" + SuspendData );
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
		//WriteToDebug("..RECORD_INTERACTIONS = " + RECORD_INTERACTIONS.toString());
		if(RECORD_INTERACTIONS){
			if(admin_HostedOniLMS){
			WriteToDebug("..Recording Interaction for ID = " + InteractionID.toString());
			LMSSetValue( "cmi.interactions."+InteractionID+".id", QuestionID.toString() );
			LMSSetValue( "cmi.interactions."+InteractionID+".type", "choice" );
			LMSSetValue( "cmi.interactions."+InteractionID+".student_response", UserAnswerText.toString() );
				LMSSetValue( "cmi.interactions."+InteractionID+".correct_responses.0.pattern", CorrectAnswerText.toString());
			if(AnswerIsCorrect.toString().toLowerCase() == "true") AnswerIsCorrect = "correct";
			if(AnswerIsCorrect.toString().toLowerCase() == "false") AnswerIsCorrect = "wrong";
			LMSSetValue( "cmi.interactions."+InteractionID+".result", AnswerIsCorrect );
				InteractionID = parseInt(InteractionID) + 1;
			}
			else{
				WriteToDebug("..Recording Interaction for ID = " + InteractionID.toString());
				LMSSetValue( "cmi.interactions."+InteractionID+".id", QuestionText.toString() );
				LMSSetValue( "cmi.interactions."+InteractionID+".type", "choice" );
				LMSSetValue( "cmi.interactions."+InteractionID+".student_response", UserAnswerText.toString() );
				LMSSetValue( "cmi.interactions."+InteractionID+".correct_responses.0.pattern", CorrectAnswerText.toString());
				if(AnswerIsCorrect.toString().toLowerCase() == "true") AnswerIsCorrect = "correct";
				if(AnswerIsCorrect.toString().toLowerCase() == "false") AnswerIsCorrect = "wrong";
				LMSSetValue( "cmi.interactions."+InteractionID+".result", AnswerIsCorrect );
				InteractionID = parseInt(InteractionID) + 1;
			}
		}
	}
}

function CloseCourse(CourseFailed)
{
	WriteToDebug("Calling CloseCourse Function");
	if (ScormInitialized)
	{

		if(!admin_ReviewMode)
		{
			if (CourseFailed)
			{
				if ((admin_QuizRetakeTillPass) && (admin_QuizRetakeCounter[CurrentQuestionGroup]<admin_QuizRetakeMaxCount))
				{
					SetCourseRetake();
				}
			} else
			{
				WriteToDebug("..LessonComplete = " + LessonComplete.toString());
				if (!LessonComplete){
					LMSSetValue( "cmi.core.lesson_status", "incomplete" );
				}
				else{
					LMSSetValue("cmi.core.lesson_location","0");
					if(DISPLAY_CERTIFICATE)
					{
						window.open("certificate.htm?studentname="+StudentName,"_new","toolbar=no, menubar=no, status=no, location=no,height=500, width=700");
				}
			}
		}
		}
		else
		{
			if(DISPLAY_CERTIFICATE_FOR_COMPLETED_COURSE)
			{
				window.open("certificate.htm?studentname="+StudentName,"_new","toolbar=no, menubar=no, status=no, location=no,height=500, width=700");
			}
		}

		WriteToDebug("..Setting Session Time as = " + endTimer(startTime));
		LMSSetValue("cmi.core.session_time",endTimer(startTime));
		LMSSetValue( "cmi.core.exit", "logout" );
		WriteToDebug("..Calling LMSFinish");
		LMSFinish("");
		self.close();
	} else
	{
		//navigate to urlonExit
		if(admin_URLOnExit != ""){
			try
			{
			window.location.href=admin_URLOnExit;
		}
			catch (e)
			{
			// do nothing
			}
			//window.location.assign("http://www.google.com");
		}
	}
}

function unloadPage()
{
	WriteToDebug("Calling unloadPage Function");
	CloseCourse(false);
}

function SetLessonPassed(ScorePercentage,HasPassedQuiz)
{
	//console.log(ScorePercentage+" "+HasPassedQuiz+" "+ScormInitialized);
	//this function will be called at the end of the lesson after the learner is successful with the quiz)
	WriteToDebug("Calling SetLessonPassed Function");
	WriteToDebug("..ScorePercentage = " + ScorePercentage.toString());
	WriteToDebug("..HasPassedQuiz = " + HasPassedQuiz.toString());
	if (ScormInitialized && !admin_ReviewMode)
	{
		LMSSetValue("cmi.core.score.min","0");
		LMSSetValue("cmi.core.score.max","100");
		WriteToDebug("..Setting Score");
		LMSSetValue("cmi.core.score.raw",ScorePercentage.toString());

		WriteToDebug("......Calling VerifyData for Score verification");
		var verificationResult=VerifyData("score",ScorePercentage.toString());
		WriteToDebug("......Result of Score Verification = " + verificationResult);
		if(!verificationResult)
			alert(ERROR_CODE + " -- " + lang041);

		LMSSetValue("cmi.core.lesson_location","0");

		if (HasPassedQuiz)
		{
			WriteToDebug("..Setting Lesson Status as Passed");
			LMSSetValue( "cmi.core.lesson_status", "passed" );

			WriteToDebug("......Calling VerifyData for Status verification");
			var verificationResult=VerifyData("status","passed");
			WriteToDebug("......Result of Status Verification = " + verificationResult);
			if(!verificationResult)
				alert(ERROR_CODE + " -- " + lang042);

		}
		else
		{
			WriteToDebug("..Setting Lesson Status as failed");
			LMSSetValue( "cmi.core.lesson_status", "failed" );

			WriteToDebug("......Calling VerifyData for Status verification");
			var verificationResult=VerifyData("status","failed");
			WriteToDebug("......Result of Status Verification = " + verificationResult);
			if(!verificationResult)
				alert(ERROR_CODE + " -- " + lang042);
		}
	}
}

function SetScormCoursePassed()
{
	//console.log(ScorePercentage+" "+HasPassedQuiz+" "+ScormInitialized);
	//this function will be called at the end of the lesson after the learner is successful with the quiz)
	WriteToDebug("Calling SetLessonPassed Function");
	if (ScormInitialized && !admin_ReviewMode)
	{
		LessonComplete = true;

		LMSSetValue("cmi.core.lesson_location","0");

		WriteToDebug("..Setting Lesson Status as completed");
		LMSSetValue( "cmi.core.lesson_status", "completed" );

		WriteToDebug("......Calling VerifyData for Status verification");
		verificationResult=VerifyData("status","completed");
		WriteToDebug("......Result of Status Verification = " + verificationResult);
		if(!verificationResult)
			alert(ERROR_CODE + " -- " + lang042);
	}
}

function VerifyData(dataElement, valueFromCourse){
	WriteToDebug("........In VerifyData for = " + dataElement);
	var result=true;
	var _155;
	if(dataElement.toLowerCase()=="bookmark"){
		_155=LMSGetValue("cmi.core.lesson_location");
		_155=_155+'';
		if(_155!=valueFromCourse){
			WriteToDebug("........value is not matching from LMS, retrying...");
			for(var i=0;i<RETRY_ATTEMPT-1; i++){
				LMSSetValue("cmi.core.lesson_location",valueFromCourse);
				var ERROR_CODE=LMSGetLastError().toString();
				if(ERROR_CODE.toString()=="0" || ERROR_CODE.toString()==""){
					result=true;
					break;
				}
				else{
					result=false;
				}
			}
		}
	}
	if(dataElement.toLowerCase()=="status"){
		_155=LMSGetValue("cmi.core.lesson_status");
		_155=_155+'';
		if(_155!=valueFromCourse){
			WriteToDebug("........value is not matching from LMS, retrying...");
			for(var i=0;i<RETRY_ATTEMPT-1; i++){
				LMSSetValue("cmi.core.lesson_status",valueFromCourse);
				var ERROR_CODE=LMSGetLastError().toString();
				if(ERROR_CODE.toString()=="0" || ERROR_CODE.toString()==""){
					result=true;
					break;
				}
				else{
					result=false;
				}
			}
		}
	}
	if(dataElement.toLowerCase()=="score"){
		_155=LMSGetValue("cmi.core.score.raw");
		_155=_155+'';
		if(_155!=valueFromCourse){
			WriteToDebug("........value is not matching from LMS, retrying...");
			for(var i=0;i<RETRY_ATTEMPT-1; i++){
				LMSSetValue("cmi.core.score.raw",valueFromCourse);
				var ERROR_CODE=LMSGetLastError().toString();
				if(ERROR_CODE.toString()=="0" || ERROR_CODE.toString()==""){
					result=true;
					break;
				}
				else{
					result=false;
				}
			}
		}
	}
	return result;
}

function SetCourseRetake(){
	CourseRetake = true;
	FirstExamPage = true;
	if (ScormInitialized && !admin_ReviewMode){
	WriteToDebug("Calling SetCourseRetake Function");
	WriteToDebug("..Setting Bookmark as blank");

	LMSSetValue("cmi.core.lesson_location","0");
	WriteToDebug("......Calling VerifyData for Bookmark verification");
	var verificationResult=VerifyData("bookmark","");
	WriteToDebug("......Result of Status Verification = " + verificationResult);
	if(!verificationResult)
		alert(ERROR_CODE + " -- " + lang042);

	WriteToDebug("..Setting Status as incopmlete");
	LMSSetValue("cmi.core.lesson_status","incomplete");

	WriteToDebug("..Setting Score as zero");
//	LMSSetValue("cmi.core.score.raw","0"); ------------------------------- **** SOME LMS missunderstand this as the course is completed with fail
	WriteToDebug("......Calling VerifyData for Score verification");
	var verificationResult=VerifyData("score","0");
	WriteToDebug("......Result of Status Verification = " + verificationResult);
	if(!verificationResult)
		alert(ERROR_CODE + " -- " + lang042);

	WriteToDebug("..Setting SuspendData as blank");
	LMSSetValue( "cmi.suspend_data",  "|"  );
	}

}

function striphtmlcode(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function AddScormPreExamAnswer(QuestionID,QuestionText,AnswerTexts,CorrectAnswerText,UserAnswerText,AnswerIsCorrect)
{
	//console.log("QuestionID: "+ striphtmlcode(QuestionID) );
	//console.log("QuestionText: "+ striphtmlcode(QuestionText) );
	//console.log("Answers: "+ striphtmlcode(AnswerTexts) );
	//console.log("Correct Answer: "+ CorrectAnswerText );
	//console.log("User Choice: "+ UserAnswerText );
	//console.log("is Correct: "+ AnswerIsCorrect );
	WriteToDebug("Calling AddScormPreExamAnswer Function");
	WriteToDebug("..QuestionId = " + QuestionID);
	WriteToDebug("..QuestionText = " + striphtmlcode(QuestionText));
	//WriteToDebug("..AnswerTexts = " + AnswerTexts);
	WriteToDebug("..CorrectAnswerText = " + CorrectAnswerText.toString());
	WriteToDebug("..UserAnswerText = " + UserAnswerText);
	WriteToDebug("..AnswerIsCorrect = " + AnswerIsCorrect);
	
	if (ScormInitialized && !admin_ReviewMode)
	{
		if(RECORD_INTERACTIONS && admin_HostedOniLMS){
			WriteToDebug("..Recording Interaction for ID = " + InteractionID.toString());
			LMSSetValue( "cmi.interactions."+InteractionID+".id", QuestionID.toString());
			LMSSetValue( "cmi.interactions."+InteractionID+".type", "choice" );
			LMSSetValue( "cmi.interactions."+InteractionID+".student_response", UserAnswerText.toString() );
			LMSSetValue( "cmi.interactions."+InteractionID+".correct_responses.0.pattern", CorrectAnswerText.toString());
			if(AnswerIsCorrect.toString().toLowerCase() == "true") AnswerIsCorrect = "correct";
			if(AnswerIsCorrect.toString().toLowerCase() == "false") AnswerIsCorrect = "wrong";
			LMSSetValue( "cmi.interactions."+InteractionID+".result", AnswerIsCorrect );
			InteractionID = parseInt(InteractionID) + 1;
		}
	}

}

function AddScormPreExamResult(Percentage)
{
	if(admin_HostedOniLMS){
		PreExamInteractionId = InteractionID;
		//console.log("Passing Percentage: "+ Percentage );
		
		WriteToDebug("..Setting SuspendData = " + SuspendData.toString() + "|PreExam-" + InteractionID + "-"+Percentage);
		LMSSetValue( "cmi.suspend_data",  SuspendData.toString() + "|PreExam-" + InteractionID + "-"+Percentage );
		SuspendData = SuspendData.toString() + "|PreExam-" + InteractionID + "-"+Percentage;
	}
}

function GetPreExamValueFromSuspendData(suspendDataText)
{
	//WriteToDebug("..Calling GetPreExamValueFromSuspendData function");
	var SuspendDataArrayTemp = suspendDataText.split('|');
	//WriteToDebug("....Length = " + SuspendDataArrayTemp.length);
	for(i=0;i<SuspendDataArrayTemp.length;i++)
	{
		if(SuspendDataArrayTemp[i].toString().indexOf("PreExam")>-1)
		{
			//WriteToDebug("....PreExam value found");
			var PreExamArrayTemp = SuspendDataArrayTemp[i].split("-");
			if(PreExamArrayTemp.length>1)
			{
				PreExamValues = PreExamValues + "-" + PreExamArrayTemp[1] + "-" + PreExamArrayTemp[2];
				PreExamInteractionId = PreExamArrayTemp[1];
				//WriteToDebug("....InteractionID = " + PreExamArrayTemp[1] + " -- Percentage = " + PreExamArrayTemp[2]);
			}
		}
	}
	
}

function ResetInteractionIDOnExamRetake(){
	WriteToDebug("..Calling ResetInteractionIDOnExamRetake function");
	InteractionID = PreExamInteractionId;
}

function AddScormSurveyAnswer(QuestionID,QuestionText,AnswerTexts,UserAnswerText,UserAnswerMemo)
{
	// QuestionID contains question ID
	// QuestionText contains question text
	// AnswerTexts contains all options (including text)
	// UserAnswerText contains selected choice by the user. In case of free form question, this contains blank
	// UserAnswerMemo contains free form answer entered by the user. In case question doesn't have this option, then it will return as undefined
	//alert("Survey Question: "+ striphtmlcode(QuestionID) );
	//alert("Answers: "+ striphtmlcode(AnswerTexts) );
	//alert("User Choice: "+ UserAnswerText );
	//alert("User Memo: "+ UserAnswerMemo );
	
	WriteToDebug("Calling AddScormSurveyAnswer Function");
	WriteToDebug("..QuestionId = " + QuestionID);
	WriteToDebug("..QuestionText = " + striphtmlcode(QuestionText));
	WriteToDebug("..AnswerTexts = " + striphtmlcode(AnswerTexts));
	WriteToDebug("..UserAnswerText = " + UserAnswerText);
	WriteToDebug("..UserAnswerMemo = " + UserAnswerMemo);
	
	if (ScormInitialized && !admin_ReviewMode)
	{
		if(RECORD_INTERACTIONS && admin_HostedOniLMS){
			var surveyQuestionCode = ""; // F - Free Form, M - Multiple Choice, S - Multiple Choice + Free Form
			if(UserAnswerMemo !=null && UserAnswerMemo != 'undefined') {
				if(UserAnswerText == "") {
					surveyQuestionCode="F";
				}
				else{
					surveyQuestionCode="S";
				}
			}
			else{
				surveyQuestionCode="M";
			}
			
			switch(surveyQuestionCode){
				case "F":
					WriteToDebug("..Recording Survey Interaction for ID = " + InteractionID.toString());
					LMSSetValue( "cmi.interactions."+InteractionID+".id", QuestionID.toString());
					LMSSetValue( "cmi.interactions."+InteractionID+".type", "fill-in" );
					LMSSetValue( "cmi.interactions."+InteractionID+".student_response", UserAnswerMemo.toString() );
					//LMSSetValue( "cmi.interactions."+InteractionID+".correct_responses.0.pattern", CorrectAnswerText.toString());
					LMSSetValue( "cmi.interactions."+InteractionID+".result", "correct" );
					InteractionID = parseInt(InteractionID) + 1;
					break;
				case "M":
					WriteToDebug("..Recording Survey Interaction for ID = " + InteractionID.toString());
					LMSSetValue( "cmi.interactions."+InteractionID+".id", QuestionID.toString());
					LMSSetValue( "cmi.interactions."+InteractionID+".type", "choice" );
					LMSSetValue( "cmi.interactions."+InteractionID+".student_response", UserAnswerText.toString() );
					//LMSSetValue( "cmi.interactions."+InteractionID+".correct_responses.0.pattern", CorrectAnswerText.toString());
					LMSSetValue( "cmi.interactions."+InteractionID+".result", "correct" );
					InteractionID = parseInt(InteractionID) + 1;
					break;
				case "S":
					WriteToDebug("..Recording Survey Interaction for ID = " + InteractionID.toString());
					LMSSetValue( "cmi.interactions."+InteractionID+".id", QuestionID.toString()+".1");
					LMSSetValue( "cmi.interactions."+InteractionID+".type", "choice" );
					LMSSetValue( "cmi.interactions."+InteractionID+".student_response", UserAnswerText.toString() );
					//LMSSetValue( "cmi.interactions."+InteractionID+".correct_responses.0.pattern", CorrectAnswerText.toString());
					LMSSetValue( "cmi.interactions."+InteractionID+".result", "correct" );
					InteractionID = parseInt(InteractionID) + 1;
					
					LMSSetValue( "cmi.interactions."+InteractionID+".id", QuestionID.toString()+".2");
					LMSSetValue( "cmi.interactions."+InteractionID+".type", "fill-in" );
					LMSSetValue( "cmi.interactions."+InteractionID+".student_response", UserAnswerMemo.toString() );
					//LMSSetValue( "cmi.interactions."+InteractionID+".correct_responses.0.pattern", CorrectAnswerText.toString());
					LMSSetValue( "cmi.interactions."+InteractionID+".result", "correct" );
					
					InteractionID = parseInt(InteractionID) + 1;
					break;
			}
			
		}
	}
}
