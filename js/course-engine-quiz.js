/*
 * IEngine4
 * IEngine4 Video Engine
 *
 * Copyright (c) Inspired eLearning Inc. 2003-2014.  All Rights Reserved.
 * This source file is proprietary property of Inspired eLearning Inc.
 * http://http://www.inspiredelearning.com/inspired/License
 *
 * @version 4.8.7
 */

//------------------------------------------------------------------------------------------------------------------

var MaxQuestionModules = 0;
var QuizName = "";

var answer_dialog;
var CurrentQuestion = 0;
var TotalQuestions = 0;

var TotalUserScore = 0;
var TotalComputerScore = 0;

var AnswerArray = [];
var AnswerArrayPoints = [];
var AnswerArrayComputerPoints = [];
var AnswerArrayAudio = [];
var AnswerArrayText = [];

var AllAnswersArray = [];

var AnsweredQuestionsArray = [];
var AnsweredQuestionsCount = 0;

var CorrectAnswerArrayNumber = 0;
var ContinueButton = "Continue";
var StartButton = "Start";
var DialogFadeSpeed = 250;
var KeepScore=true;

var RightAnswerHeader = "Correct";
var WrongAnswerHeader = "Wrong";
var ScoreBoxHeader = "Current Score";

var CurrentQuestionName = "";
var CurrentAnswersText = "";
var CurrentCorrectAnswerText = "";
var CurrentUserAnswerText = "";

var QuizMaxScore = 0;
var QuizMaxPageScore = 0;
var QuizLastQuestionID = "";

var CoureFailureCloseCourse = false;

//	LoadCourseXML();


//------------------------------------------------------------------------------------------------------------------
function delPX(s)
{
    return Number(s.replace(/px$/, ''));
};

//------------------------------------------------------------------------------------------------------------------
function CloseScoreDialog()
{
	NewDialogClose();

	if (CoureFailureCloseCourse)
	{
		//call exit function
		if (admin_UseAicc) { CloseCourse_AICC(true); } else { CloseCourse(true); }
	} else
	{
		if (selectedPageID<MaxModulePage)
		{
			ModulePageViewableArray[selectedPageID+1] = 1;
			$("#C"+(selectedPageID+1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

			if (ModulePageArray[selectedPageID+1].charAt(0)=="M") //if next row is module then activate the one bellow too
			{
				ModulePageViewableArray[selectedPageID+2] = 1;
				$("#C"+(selectedPageID+2)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
			}

			selectedPageID++;
			LoadPage(selectedPageID,0,0,1);
		}
	}
}

//------------------------------------------------------------------------------------------------------------------
function ClickAnswerButton()
{
	NewDialogClose();

	if (CourseMode=="Video") {
		$("#jquery_jplayer_1").jPlayer("stop");
	}

	if (CurrentQuestion<TotalQuestions)
	{
		CurrentQuestion++;
		$.doTimeout( '', 300, function(){
			ShowQuestion(CurrentQuestion);
		});
	} else
	{
		//show score result dialog
		if (KeepScore)
		{
			if (TotalUserScore>=TotalComputerScore)
			{
				var ModuleScoreResultX = ModuleScoreResultUserWinner;
			} else
			{
				var ModuleScoreResultX = ModuleScoreResultComputerWinner;
			}
			ModuleScoreResultX = ModuleScoreResultX.replace("#UserScore",TotalUserScore);
			ModuleScoreResultX = ModuleScoreResultX.replace("#ComputerScore",TotalComputerScore);
			ModuleScoreResultX = ModuleScoreResultX.replace("#TotalScore",QuizMaxScore);
			ModuleScoreResultX = ModuleScoreResultX.replace("#TotalPageScore",QuizMaxPageScore);

			//check if question is last quiz question, if so check score precentage and post to scorm
			//console.log(selectedPageID+"-"+CurrentQuestion +"=="+ QuizLastQuestionID);
			if (selectedPageID+"-"+CurrentQuestion == QuizLastQuestionID)
			{
				//console.log("last question");
				var ScorePercentage = Math.round( (TotalUserScore / QuizMaxScore) *100);

				//console.log("Score % : "+ScorePercentage);
				if (ScorePercentage<admin_QuizPassingPercentage ) //fail
				{
					if (admin_ScormOrFinalQuiz=="Quiz")
					{
						if ((admin_QuizRetakeTillPass) && (admin_QuizRetakeCounter<admin_QuizRetakeMaxCount)) //reset quiz and allow retake don't post til scorm
						{
							CoureFailureCloseCourse = true;

							AnsweredQuestionsCount = 0;
							AnsweredQuestionsArray = [];
							AllAnswersArray = [];

							admin_QuizRetakeCounter++;
							SuspendData = "";
							TotalUserScore = 0;
							TotalComputerScore = 0;
							if (admin_UseAicc) { SetCourseRetake_AICC(); } else { SetCourseRetake(); }


						} else
						{
							CoureFailureCloseCourse = true;
							if (admin_UseAicc) { SetLessonPassed_AICC(ScorePercentage,false); } else { SetLessonPassed(ScorePercentage,false);  }
						}
					}

				} else
				{ //pass
					if (admin_ScormOrFinalQuiz=="Quiz")
					{
						if (admin_UseAicc) { SetLessonPassed_AICC(ScorePercentage,true); } else { SetLessonPassed(ScorePercentage,true);  }
					}
				}
			}

			$.doTimeout( '', 300, function(){
				NewDialog(IntroBox.attr("ScoreTop"),IntroBox.attr("ScoreLeft"),IntroBox.attr("ScoreWidth"),IntroBox.attr("ScoreHeight"),IntroBox.attr("ScoreBgAudio"), ScoreBoxHeader,ModuleScoreResultX + ScormQuizScoreDialogButton,false);
				QuizMode = false;
			});
		} else
		// if not keeping score directly advance to next page
		{
			if (selectedPageID<MaxModulePage)
			{
				ModulePageViewableArray[selectedPageID+1] = 1;
				$("#C"+(selectedPageID+1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

				if (ModulePageArray[selectedPageID+1].charAt(0)=="M") //if next row is module then activate the one bellow too
				{
					ModulePageViewableArray[selectedPageID+2] = 1;
					$("#C"+(selectedPageID+2)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
				}

				selectedPageID++;
				LoadPage(selectedPageID,0,0,1);
			} else
			{
				QuizMode = false;

			}
		}
	}
}

//------------------------------------------------------------------------------------------------------------------
function clickAnswer(AnswerNo)
{
	NewDialogClose();

	var ScoreAnswer = true;
	//check to see if question has been answered before
	if (AnsweredQuestionsCount==0)
	{
		AnsweredQuestionsCount++;
		AnsweredQuestionsArray.push(selectedPageID + "-" + CurrentQuestion);
	} else
	{
		if ($.inArray(selectedPageID + "-" + CurrentQuestion,AnsweredQuestionsArray)==-1)
		{
			AnsweredQuestionsCount++;
			AnsweredQuestionsArray.push(selectedPageID + "-" + CurrentQuestion);
		} else
		{
			ScoreAnswer = false;
		}
	}

	//check to see if anymore questions, otherwise show result screen;
	if (CorrectAnswerArrayNumber==AnswerNo)	{
		ResultBoxHeader = RightAnswerHeader;
		if ((ScoreAnswer) && (KeepScore)) {
			TotalUserScore += parseInt(AnswerArrayPoints[AnswerNo],10);
			SuspendData = SuspendData + selectedPageID + "," + CurrentQuestion + "," + AnswerNo + "," + parseInt(AnswerArrayPoints[AnswerNo],10) + "," + parseInt(AnswerArrayComputerPoints[AnswerNo],10) + ",1|";

			AllAnswersArray[selectedPageID + "-" + CurrentQuestion ] = AnswerNo;
		}
	} else {
		ResultBoxHeader = WrongAnswerHeader;
		if ((ScoreAnswer) && (KeepScore)) {
			TotalComputerScore += parseInt(AnswerArrayComputerPoints[AnswerNo],10);
			SuspendData = SuspendData + selectedPageID + "," + CurrentQuestion + "," + AnswerNo + "," + parseInt(AnswerArrayPoints[AnswerNo],10) + "," + parseInt(AnswerArrayComputerPoints[AnswerNo],10) + ",0|";

			AllAnswersArray[selectedPageID + "-" + CurrentQuestion ] = AnswerNo;
		}
	}

	if (AnswerArrayAudio[AnswerNo]!="")
	{
		if (CourseMode=="Video") {
			$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: AnswerArrayAudio[AnswerNo] });
			$("#jquery_jplayer_1").jPlayer("play");
			isPlay = 1;
			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
		}
	}

	$.doTimeout( '', 300, function(){
		NewDialog(IntroBox.attr("AnswerTop"),IntroBox.attr("AnswerLeft"),IntroBox.attr("AnswerWidth"),IntroBox.attr("AnswerHeight"),IntroBox.attr("AnswerBgAudio"), ResultBoxHeader,AnswerArray[AnswerNo] + ScormQuizAnswerButton,false);
	});

	//update scorm
	if (CorrectAnswerArrayNumber==AnswerNo)	{
		if ((ScoreAnswer) && (KeepScore) && (admin_ScormOrFinalQuiz=="Quiz")) {

			if (admin_UseAicc) {
				AddScormQuizAnswer_AICC( selectedPageID + "-" + CurrentQuestion + " " + CurrentQuestionName, CurrentAnswersText, CurrentCorrectAnswerText, AnswerArrayText[AnswerNo], true   );
			} else {
				AddScormQuizAnswer( selectedPageID + "-" + CurrentQuestion + " " + CurrentQuestionName, CurrentAnswersText, CurrentCorrectAnswerText, AnswerArrayText[AnswerNo], true   );
			}


		}
	} else
	{
		if ((ScoreAnswer) && (KeepScore) && (admin_ScormOrFinalQuiz=="Quiz")) {
			if (admin_UseAicc) {
				AddScormQuizAnswer_AICC( selectedPageID + "-" + CurrentQuestion + " " + CurrentQuestionName, CurrentAnswersText, CurrentCorrectAnswerText, AnswerArrayText[AnswerNo], false   );
			} else {
				AddScormQuizAnswer( selectedPageID + "-" + CurrentQuestion + " " + CurrentQuestionName, CurrentAnswersText, CurrentCorrectAnswerText, AnswerArrayText[AnswerNo], false   );
			}
		}
	}

};


//------------------------------------------------------------------------------------------------------------------
function ShowQuestion(QuestionNo)
{
	//clear the display and redrawing the stage without showing intro message
	DrawModule(0);

	$(CourseXML).find("Modules").each(function()
	{
		$(CourseXML).find("Module").each(function() {

			if ('M'+$(this).attr("Name") == ModulePageArray[selectedModuleID] )
			{
				ModuleName = $(this).attr("Name");
				$(this).find("Page").each(function() {

					if ('L'+$(this).attr("Name") == ModulePageArray[selectedPageID] )
					{
						QCounter = 0;
						$(this).find("Question").each(function()
						{
							QCounter++;
							//find the question to show
							if (QCounter==QuestionNo)
							{
								CurrentQuestionName = $(this).attr("Name");

								//paint highlights
								$(this).find("Highlight").each(function()
								{
									var xHighlightTitle = "";
									if ($(this).attr("Title") !== undefined )
									{
										xHighlightTitle = $(this).attr("Title");
									}

									var new_item = $("<div title='" + xHighlightTitle + "' class='"+ $(this).attr("Class") +"' style='display:none; position:absolute; top:" + $(this).attr("Top") + "px; left:" + $(this).attr("Left") + "px; width:" + $(this).attr("Width") + "px; height:" + $(this).attr("Height") + "px;  '>" + $(this).text() + "</div>");
									$("#template-place").append(new_item);
									new_item.show("blind",[],500);
								});


								AnswerBox = $(this).find("AnswerBox");
								AnswerBoxText = $(this).find("AnswerBox").text();

								// dont show header in answer box
								if (AnswerBoxText=="")
								{
									answerBoxClass = "no-close noTitleStuff";
								} else
								{
									answerBoxClass = "no-close";
								}

								//prepare answer buttons
								AnswerButtons = "";
								AnswerCounter = 0;

								AnswerArray = [];
								AnswerArrayPoints = [];
								AnswerArrayComputerPoints = [];
								AnswerArrayAudio = [];
								AnswerArrayText = [];

								CurrentAnswersText = "";
								CurrentCorrectAnswerText = "";


								$(this).find("Answer").each(function()
								{
									AnswerCounter++;
									AnswerArray[AnswerCounter] = $(this).text();
									AnswerArrayPoints[AnswerCounter] = $(this).attr("Points");
									AnswerArrayComputerPoints[AnswerCounter] = $(this).attr("ComputerPoints");
									if (AnswerArrayComputerPoints[AnswerCounter]=="") {AnswerArrayComputerPoints[AnswerCounter] = "0"; }
									AnswerArrayAudio[AnswerCounter] = $(this).attr("AudioFile");
									AnswerArrayText[AnswerCounter] = $(this).attr("Text");

									if ($(this).attr("Correct")=="yes")	{
										CorrectAnswerArrayNumber = AnswerCounter;
										CurrentCorrectAnswerText = CurrentCorrectAnswerText + $(this).attr("Text") + "|";
									}
									CurrentAnswersText = CurrentAnswersText + $(this).attr("Text") + "|";

									AnswerButtons = AnswerButtons + "<a href='#' "+AnswerCounter+" onClick='clickAnswer("+AnswerCounter+"); return false' id='AnswerBtn"+AnswerCounter+"' style='width:" + $(this).attr("Width") + "px; margin-bottom:5px;' class='" + $(this).attr("Class") +"' name='btn1' value='" + $(this).attr("Text") + "'><span class='"+$(this).attr("Icon")+"'>" + $(this).attr("Text") + "</span></a>";
								});

								$.doTimeout( '', 300, function(){
									NewDialog(AnswerBox.attr("Top"),AnswerBox.attr("Left"),AnswerBox.attr("Width"),AnswerBox.attr("Height"),AnswerBox.attr("BgAudio"), AnswerBoxText,AnswerButtons,false);
								});
							}
						});
					}
				});
			}
		});
	});
}

//------------------------------------------------------------------------------------------------------------------
function CloseIntroDialog()
{
	NewDialogClose();

	if (CourseMode=="Video") {
		$("#jquery_jplayer_1").jPlayer("stop");
	}

	ShowQuestion(CurrentQuestion);
}

//------------------------------------------------------------------------------------------------------------------
function DrawModule(DrawIntro)
{
	$("#ajax-loading-graph").hide();
	$(CourseXML).find("Modules").each(function() {

		$(CourseXML).find("Module").each(function() {

			if ('M'+$(this).attr("Name") == ModulePageArray[selectedModuleID] )
			{
				$(this).find("Page").each(function() {

					if ('L'+$(this).attr("Name") == ModulePageArray[selectedPageID] )
					{
						//console.log('L'+$(this).attr("Name")+" == "+ModulePageArray[selectedPageID]+" "+selectedPageID);
						ModuleName = $(this).attr("Name");
						KeepScore = ( $(this).attr("KeepScore")=="true" );
						$("#template-place").html("");
						$("#template-place").html( TemplateArray[CurrentTemplateID] );

						ThePageSetup = $(this).find("PageSetup");

						ContinueButton = ThePageSetup.attr("ContinueButton");
						StartButton = ThePageSetup.attr("StartButton");

						RightAnswerHeader = ThePageSetup.find("RightAnswerHeader").text();
						WrongAnswerHeader = ThePageSetup.find("WrongAnswerHeader").text();
						ScoreBoxHeader = ThePageSetup.find("ScoreBoxHeader").text();
						ModuleScoreResultUserWinner = ThePageSetup.find("ModuleScoreResultUserWinner").text();
						ModuleScoreResultComputerWinner = ThePageSetup.find("ModuleScoreResultComputerWinner").text();

						IntroTitle = ThePageSetup.find("IntroTitle").text();
						IntroBox = ThePageSetup.find("IntroText");
						IntroText = ThePageSetup.find("IntroText").text();
						IntroAudio = ThePageSetup.find("IntroText").attr("AudioFile");

						ThePageElements = ThePageSetup.find("Elements");

						ThePageElements.find("Element").each(function()
						{
							$("#template-place").append("<div style='overflow:hidden; position:absolute; top:" + $(this).attr("Top") + "px; left:" + $(this).attr("Left") + "px; width:" + $(this).attr("Width") + "px; height:" + $(this).attr("Height") + "px;  '>" + $(this).text() + "</div>");
						});

						if (DrawIntro==1)
						{
							//count total number of questions in module
							TotalQuestions = 0;
							QuizMaxPageScore = 0;
							$(this).find("Question").each(function() {
								TotalQuestions++;

								$(this).find("Answer").each(function()
								{
									if ($(this).attr("Correct")=="yes")	{
										QuizMaxPageScore += parseInt($(this).attr("Points"),10);
									}
								});
							});

							if (IntroAudio!="")
							{
								if (CourseMode=="Video") {
									$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: IntroAudio })
									$("#jquery_jplayer_1").jPlayer("play");
									isPlay = 1;
									$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
									$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
								}
							}


							CurrentQuestion = 1;

							$.doTimeout( '', 300, function(){
								NewDialog(IntroBox.attr("Top"),IntroBox.attr("Left"),IntroBox.attr("Width"),IntroBox.attr("Height"),IntroBox.attr("BgAudio"), IntroTitle,IntroText + ScormQuizStartAnswerButton, false);
							});
						}
					}
				});
			}
		});
	});
}


function InitQuiz()
{
	i = 0;
	$(CourseXML).find("Modules").each(function()
	{
		i++;
	});

	if (i==0) {
		//wait 1 second more for xml to load
		$.doTimeout( '', 1000, function(){ InitQuiz() } );
	}
	else
	{
		//load suspend data
		//parse it and populate score and boolean values
		if (SuspendData!="")
		{
			//console.log(SuspendData);
			SuspendDataArray = SuspendData.split('|');

			for(i = 0; i < SuspendDataArray.length; i++)
			{
				if ($.trim(SuspendDataArray[i])!="")
				{
					//console.log( SuspendDataArray[i] );
					SuspendQuestion = SuspendDataArray[i].split(",");

					//console.log(SuspendQuestion[0] + "-" + SuspendQuestion[1]);
					AnsweredQuestionsCount++;
					AnsweredQuestionsArray.push(SuspendQuestion[0] + "-" + SuspendQuestion[1]); //selectedPageID + "-" + CurrentQuestion

					AllAnswersArray[SuspendQuestion[0] + "-" + SuspendQuestion[1]] = SuspendQuestion[2];

					if (SuspendQuestion[5]=="1") { TotalUserScore += parseInt(SuspendQuestion[3],10); }
					if (SuspendQuestion[5]=="0") { TotalComputerScore += parseInt(SuspendQuestion[4],10); }
				}
			}
		}

		//loop through all questions return max score and last question ID as pageID-QuestionID
		$(CourseXML).find("Modules").each(function() {
			var TempPageCounter = 0;
			var TempQuestionCounter = 0;
			$(CourseXML).find("Module").each(function() {
				TempPageCounter++;
				$(this).find("Page").each(function() {

					TempPageCounter++;
					TempQuestionCounter = 0;

					if ( ($(this).attr("Type").toLowerCase()=="quiz") && ( $(this).attr("KeepScore")=="true" ) )
					{
						$(this).find("Question").each(function()
						{
							TempQuestionCounter++;

							$(this).find("Answer").each(function()
							{
								if ($(this).attr("Correct")=="yes")	{
									QuizMaxScore += parseInt($(this).attr("Points"),10);
									QuizLastQuestionID = TempPageCounter+"-"+TempQuestionCounter;
								}
							});
						});

					}
				});
			});
		});
	}
}

$(document).ready(function() {
	$.doTimeout( '', 1000, function(){ InitQuiz() } );
});