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

var FinalExamAnswersArray = [];
var FinalExamAnswersArrayOrdered = [];
var FinalExamAnswersArrayOrderedAnswerTexts = [];
var FinalExamMaxAnswers = -1;
var FinalExamRightAnswer = false;
var FinalExamRules;

var FinalExamAnswerLeft    = 50;
var FinalExamAnswerTop     = 50;
var FinalExamAnswerWidth   = 400;
var FinalExamAnswerSpacing = 15;

var FinalXML;

var AnswerLetters = ["A","B","C","D","E","F","G"];
var AnswerTextWithLetter = "";

var FinalExamAnswerCache = [];
var FinalExamAnswerTextCache = [];
var FinalExamAnswerRightCache = [];

var FinalExamScormQuestionCache = [];
var FinalExamScormQuestionIDCache = [];
var FinalExamScormAnswersCache = [];
var FinalExamScormUserAnswerCache = [];
var FinalExamScormCorrectAnswerCache = [];

var ResetExamToBeginingSub = false;
var ResetExamRetakeExamDirectly = false;
var FinalRoot;

var CurrentQuestionGroupPosition = 0;

var ShowFinalIntro = true;

//------------------------------------------------------------------------------------------------------------------
function fisherYates2 ( myArray ) {
  var i = myArray.length;
  if ( i == 0 ) return false;
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = myArray[i];
     var tempj = myArray[j];
     myArray[i] = tempj;
     myArray[j] = tempi;
   }
}

//------------------------------------------------------------------------------------------------------------------
function CloseIntroDialogFinalExam()
{
	if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
	{
		$("#FadeOutBackgroundDiv").hide();
		$("#FreeFormDialogDiv").hide();
	}
	else
	{
		$("#FadeOutBackgroundDiv").fadeOut(250);
		$("#FreeFormDialogDiv").fadeOut(250);
	}

	if (CourseMode=="Video") {
		$("#jquery_jplayer_1").jPlayer("stop");
	}

	DrawFinalExamQuiz(FinalExamCurrentActiveQuestion);
}


//------------------------------------------------------------------------------------------------------------------
function CloseSubFinalScoreDialog()
{
	if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
	{
		$("#FadeOutBackgroundDiv").hide();
		$("#FreeFormDialogDiv").hide();
	}
	else
	{
		$("#FadeOutBackgroundDiv").fadeOut(250);
		$("#FreeFormDialogDiv").fadeOut(250);
	}

	if (CourseMode=="Video") {
		$("#jquery_jplayer_1").jPlayer("stop");
	}

	if (CoureFailureCloseCourse)
	{
		//call exit function
		if (admin_UseAicc) { CloseCourse_AICC(true); } else { CloseCourse(true); }
	} else
		
	if (ResetExamToBeginingSub)
	{
		LoopBeginPosition = 0;
		LoopEndPosition = 0;

		if (CurrentQuestionGroupPosition>0) {
			for (var i=0; i<CurrentQuestionGroupPosition; i++) 
				{ LoopBeginPosition += FinalExamGroupMaxQuestionsByOrder[ i ]; }
		}
		LoopEndPosition = LoopBeginPosition+FinalExamGroupMaxQuestions[ CurrentQuestionGroup ];

		//Delete all answers and questions for current group only
		for (var i=LoopBeginPosition; i<LoopEndPosition; i++)
		{
			FinalExamAnswerCache[i] = "N/A";
			FinalExamAnswerTextCache[i] = "N/A";
			FinalExamScormUserAnswerCache[i] = "N/A";
			FinalExamAnswerRightCache[i] = "N/A";
			
			FinalExamScormQuestionCache[i] = "N/A";
			FinalExamScormQuestionIDCache[i] = "N/A";
			FinalExamScormAnswersCache[i] =  "N/A";
			FinalExamScormCorrectAnswerCache[i] =  "N/A";
		}
		
		if (ResetExamRetakeExamDirectly) 
		{
			LoadPage(selectedPageID,0,0,1);
		} 
		else
		{
			//loop backwards to first page or previous exam page
			i = selectedPageID;
			j = 0;
			while ((i>0) && (j==0))
			{
				i--;
				if (ModulePageArrayType[i]=="FinalExam") {j=1;}
			}
			LoadPage((i+1),0,0,1);
		}
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

			if ((admin_AutoForwardDefaultSetting==true) && (selectedPageID<MaxModulePage))
			{
				selectedPageID++;
				LoadPage(selectedPageID,0,0,1);
			} else
			{
				if (selectedPageID<MaxModulePage) {	FwdBlink(4000,1000); }
			}
		}
	}
}


//------------------------------------------------------------------------------------------------------------------
function ShowSubFinalScore()
{

	
	
	if (CourseMode=="Video") {
		$("#jquery_jplayer_1").jPlayer("stop");
	}


	//loop through current question group
	//
	//calculate score for this group only
	var SubTotalUserScore = 0;
	LoopBeginPosition = 0;
	LoopEndPosition = 0;

	if (CurrentQuestionGroupPosition>0) {
		for (var i=0; i<CurrentQuestionGroupPosition; i++) 
			{ LoopBeginPosition += FinalExamGroupMaxQuestionsByOrder[ i ]; }
	}
	LoopEndPosition = LoopBeginPosition+FinalExamGroupMaxQuestions[ CurrentQuestionGroup ];
	for (var i=LoopBeginPosition; i<LoopEndPosition; i++)
	{
		if (FinalExamAnswerRightCache[i]) { SubTotalUserScore++; }
	}

	var ScorePercentage = Math.round( (SubTotalUserScore / FinalExamGroupMaxQuestions[ CurrentQuestionGroup ] ) *100);
	
	
	//calculate Accumulative score
	var SubTotalAccumulativeUserScore = 0;
	LoopBeginPosition = 0;
	LoopEndPosition = 0;
	if (CurrentQuestionGroupPosition>0)
	{
		for (var i=0; i<CurrentQuestionGroupPosition; i++) 
			{ LoopEndPosition = LoopEndPosition += FinalExamGroupMaxQuestionsByOrder[ i ]; }
	}
	LoopEndPosition = LoopEndPosition+FinalExamGroupMaxQuestions[ CurrentQuestionGroup ];

	
	for (var i=LoopBeginPosition; i<LoopEndPosition; i++)
	{
		//console.log("Q ID:"+i);
		if (FinalExamAnswerRightCache[i]) { SubTotalAccumulativeUserScore++; }
	}

	var ScorePercentageAccumulative = Math.round( (SubTotalAccumulativeUserScore / LoopEndPosition) *100);

	//console.log("Q LOOP:"+CurrentQuestionGroupPosition+" "+LoopBeginPosition+" "+LoopEndPosition+" "+SubTotalUserScore+" "+ScorePercentage+" -- "+SubTotalAccumulativeUserScore+" "+ScorePercentageAccumulative);
	
	
	var ModuleScoreNode;
	var ModuleScoreResultX = "";

	if (ScorePercentage>=admin_QuizPassingPercentage ) //pass
	{
		
		//check if this is the last exam or not
		if (FinalExamCurrentActiveQuestion==(FinalExamMaxQuestions-1)) 
			{ ModuleScoreNode = $(FinalXML).find("FinalPass"); }  else
			{ ModuleScoreNode = $(FinalXML).find("SubFinalPass"); }
		
		ModuleScoreResultX = ModuleScoreNode.text();
		//show accumulative results
		ModuleScoreResultX = ModuleScoreResultX.replace("#UserScore",SubTotalAccumulativeUserScore);
		ModuleScoreResultX = ModuleScoreResultX.replace("#MaxScore",LoopEndPosition);
		ModuleScoreResultX = ModuleScoreResultX.replace("#PassingPercentage",admin_QuizPassingPercentage);
		ModuleScoreResultX = ModuleScoreResultX.replace("#UserPercentage",ScorePercentageAccumulative);
		
		ModuleScoreResultX = ModuleScoreResultX.replace("#MaxAtempt",admin_QuizRetakeMaxCount );
		ModuleScoreResultX = ModuleScoreResultX.replace("#AtemptsLeft",admin_QuizRetakeMaxCount-admin_QuizRetakeCounter[CurrentQuestionGroup] );
		ModuleScoreResultX = ModuleScoreResultX.replace("#SectionQuestionCount",FinalExamGroupMaxQuestions[ CurrentQuestionGroup ] );
		ModuleScoreResultX = ModuleScoreResultX.replace("#TotalQuestionCount",FinalExamMaxQuestions );
		
	} else
	{
		//show results for only this part if fail
		ShowFinalIntro = false;
		ModuleScoreNode = $(FinalXML).find("SubFinalFail");
		ModuleScoreResultX = ModuleScoreNode.text();

		ModuleScoreResultX = ModuleScoreResultX.replace("#UserScore",SubTotalUserScore);
		ModuleScoreResultX = ModuleScoreResultX.replace("#MaxScore",FinalExamGroupMaxQuestions[ CurrentQuestionGroup ]);
		ModuleScoreResultX = ModuleScoreResultX.replace("#PassingPercentage",admin_QuizPassingPercentage);
		ModuleScoreResultX = ModuleScoreResultX.replace("#UserPercentage",ScorePercentage);

		ModuleScoreResultX = ModuleScoreResultX.replace("#MaxAtempt",admin_QuizRetakeMaxCount );
		ModuleScoreResultX = ModuleScoreResultX.replace("#AtemptsLeft",admin_QuizRetakeMaxCount-admin_QuizRetakeCounter[CurrentQuestionGroup] );
		ModuleScoreResultX = ModuleScoreResultX.replace("#SectionQuestionCount",FinalExamGroupMaxQuestions[ CurrentQuestionGroup ] );
		ModuleScoreResultX = ModuleScoreResultX.replace("#TotalQuestionCount",FinalExamMaxQuestions );
	}
	
	ResetExamToBeginingSub = false;
	ResetExamRetakeExamDirectly = false;

	//console.log("Score % : "+ScorePercentage);
	if (admin_ScormOrFinalQuiz=="Final")
	{
		if (ScorePercentage<admin_QuizPassingPercentage ) //fail
		{
			if ( (admin_QuizRetakeCounter[CurrentQuestionGroup]<admin_QuizRetakeMaxCount)) //reset quiz and allow retake don't post til scorm
			{
				ResetExamToBeginingSub = true;
				ResetExamRetakeExamDirectly = true;
				ResetInteractionIDOnExamRetake();
			} else
			if ((admin_QuizRetakeTillPass) && (admin_QuizRetakeCounter[CurrentQuestionGroup]==admin_QuizRetakeMaxCount)) //reset quiz to the begining and allow retake don't post til scorm
			{
				admin_QuizRetakeCounter[CurrentQuestionGroup] = 0;
				ResetExamToBeginingSub = true;
				ResetExamRetakeExamDirectly = false;
				ShowFinalIntro = true;				

				ResetInteractionIDOnExamRetake();
				
				ModuleScoreNode = $(FinalXML).find("SubFinalResetFail");
				ModuleScoreResultX = ModuleScoreNode.text();

				ModuleScoreResultX = ModuleScoreResultX.replace("#UserScore",SubTotalUserScore);
				ModuleScoreResultX = ModuleScoreResultX.replace("#MaxScore",FinalExamGroupMaxQuestions[ CurrentQuestionGroup ]);
				ModuleScoreResultX = ModuleScoreResultX.replace("#PassingPercentage",admin_QuizPassingPercentage);
				ModuleScoreResultX = ModuleScoreResultX.replace("#UserPercentage",ScorePercentage);
				
				ModuleScoreResultX = ModuleScoreResultX.replace("#MaxAtempt",admin_QuizRetakeMaxCount );
				ModuleScoreResultX = ModuleScoreResultX.replace("#AtemptsLeft",admin_QuizRetakeMaxCount-admin_QuizRetakeCounter[CurrentQuestionGroup] );
				ModuleScoreResultX = ModuleScoreResultX.replace("#SectionQuestionCount",FinalExamGroupMaxQuestions[ CurrentQuestionGroup ] );
				ModuleScoreResultX = ModuleScoreResultX.replace("#TotalQuestionCount",FinalExamMaxQuestions );
			} else
			if ((!admin_QuizRetakeTillPass) && (admin_QuizRetakeCounter[CurrentQuestionGroup]>=admin_QuizRetakeMaxCount)) //fail the course close the window
			{
				CoureFailureCloseCourse = true;
				if (admin_UseAicc) { SetLessonPassed_AICC(ScorePercentageAccumulative,false); } else { SetLessonPassed(ScorePercentageAccumulative,false);  }

				ModuleScoreNode = $(FinalXML).find("FinalFullFail");

				ModuleScoreResultX = ModuleScoreNode.text();
				ModuleScoreResultX = ModuleScoreResultX.replace("#UserScore",SubTotalUserScore);
				ModuleScoreResultX = ModuleScoreResultX.replace("#MaxScore",FinalExamGroupMaxQuestions[ CurrentQuestionGroup ]);
				ModuleScoreResultX = ModuleScoreResultX.replace("#PassingPercentage",admin_QuizPassingPercentage);
				ModuleScoreResultX = ModuleScoreResultX.replace("#UserPercentage",ScorePercentage);

				ModuleScoreResultX = ModuleScoreResultX.replace("#MaxAtempt",admin_QuizRetakeMaxCount );
				ModuleScoreResultX = ModuleScoreResultX.replace("#AtemptsLeft",admin_QuizRetakeMaxCount-admin_QuizRetakeCounter[CurrentQuestionGroup] );
				ModuleScoreResultX = ModuleScoreResultX.replace("#SectionQuestionCount",FinalExamGroupMaxQuestions[ CurrentQuestionGroup ] );
				ModuleScoreResultX = ModuleScoreResultX.replace("#TotalQuestionCount",FinalExamMaxQuestions );
			}
		} else
		{ 
			//check if this is the last exam or not
			if (FinalExamCurrentActiveQuestion==(FinalExamMaxQuestions-1)) { 
				//console.log("CALLING SCORM ON LAST EXAM: Score "+ScorePercentageAccumulative+"%");
				ShowFinalIntro = true;
				
				if (admin_UseAicc) { SetLessonPassed_AICC(ScorePercentageAccumulative,true); } else { SetLessonPassed(ScorePercentageAccumulative,true);  }

				//if last page is exam then post the course passed too, else this will be posted from course-engine directly
				if (selectedPageID==MaxModulePage)
				{
					if (admin_UseAicc) { SetScormCoursePassed_AICC();  } else { SetScormCoursePassed();  }
				}
			} else
			{
				//pass sub section, do nothing continue the course
			}
		}
	}

	$("#FreeFormDialogCloseButton").off('click');
	$("#FreeFormDialogDiv").css({"top": ModuleScoreNode.attr("Top") + "px" , "left": ModuleScoreNode.attr("Left")  +"px" });
	$("#FreeFormDialogDiv").html( ModuleScoreResultX );
	$("#FreeFormDialogCloseButton").attr('tabindex', "0");

	if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
	{
		$("#FadeOutBackgroundDiv").show();
		$("#FreeFormDialogDiv").show();
	}
	else
	{
		$("#FadeOutBackgroundDiv").fadeIn(250);
		$("#FreeFormDialogDiv").fadeIn(250);
	}

	$.doTimeout( '', 500, function(){
		$("#FreeFormDialogCloseButton").on('click', function()
		{
			CloseSubFinalScoreDialog();
			return false;
		});
	});

	if (ModuleScoreNode.attr("AudioFile")!="")
	{
		if (CourseMode=="Video") {
			$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: ModuleScoreNode.attr("AudioFile") });
			$("#jquery_jplayer_1").jPlayer("play");
			isPlay = 1;
			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
		}
	}
}

//------------------------------------------------------------------------------------------------------------------
function CloseQuestionAnswerDialog(UserChoice)
{
	if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
	{
		$("#FadeOutBackgroundDiv").hide();
		$("#FreeFormDialogDiv").hide();
	}
	else
	{
		$("#FadeOutBackgroundDiv").fadeOut(250);
		$("#FreeFormDialogDiv").fadeOut(250);
	}

	if (CourseMode=="Video") {
		$("#jquery_jplayer_1").jPlayer("stop");
	}

	//if user clicked without selecting just go back to the question
	if (UserChoice!="")
	{
		//if last question check results, if it is the last question group then post to scorm as well
		if (VirtualQuestionGroupCounter == FinalExamGroupMaxQuestions[ CurrentQuestionGroup ])
		{
			$.doTimeout( '', 250, function(){
				ShowSubFinalScore();
			});
		} else
		{
			$.doTimeout( '', 250, function(){
				ForwardClick();
			});
		}
	}
}

//------------------------------------------------------------------------------------------------------------------
function AnswerCheckFinalExam()
{
	if (FinalExamAnswerCache[FinalExamCurrentActiveQuestion] == 'N/A')
	{
		Results1 = "";
		var UserSelectedAnswersString = "";
		//loop the answers build the string to compare with results
		if (FinalExamAnswerType=="checkbox")
		{
			for (xCounter=0; xCounter<=FinalExamMaxAnswers; xCounter++)
			{
				if ($("#FinalExamQuiz_"+FinalExamAnswersArrayOrdered[xCounter]).is(':checked'))
				{
					if (Results1!="") { Results1 +=","; }
					Results1 +=FinalExamAnswersArrayOrdered[xCounter];

					if (UserSelectedAnswersString!="") { UserSelectedAnswersString +=","; }
					UserSelectedAnswersString += (xCounter+1).toString();
				}
			}
		} else
		if (FinalExamAnswerType=="radio")
		{
			if ($('input[name=FinalExamQuizAnswer]:checked').val() != null) {
				Results1 = $('input[name=FinalExamQuizAnswer]:checked').val();

				UserSelectedAnswersString = $('input[name=FinalExamQuizAnswer]:checked').val();
			}
		}

		//search the rules for correct answer
		AnswerResult = "";
		var AnswerResultNode;
		FinalExamRules.find("Rule").each(function() {
			if ( $(this).attr("AnswerID")+"," == Results1+",")
			{
				AnswerResult= $(this).text();
				AnswerResultNode = $(this);

				//if correct then set boolean to true to save to cache
				if ($(this).attr("Correct")=="yes")	{ FinalExamRightAnswer=true; }
			}
		});

		//find the * answer generic wrong result
		if (AnswerResult=="")
		{
			FinalExamRules.find("Rule").each(function() {
				if ( $(this).attr("AnswerID")=="*")
				{
					AnswerResult= $(this).text();
					AnswerResultNode = $(this);
				}
			});
		}

		var AnswerResultNoReplace = AnswerResult;
		//replace *** in Answer Result with the correct letter
		//find the correct AnswerID's position in the array
		FinalExamRules.find("Rule").each(function() {
			if ($(this).attr("Correct")=="yes")
			{
				AnswerResult = AnswerResult.replace("***", AnswerLetters[ FinalExamAnswersArray.indexOf( $(this).attr("AnswerID") ) ] );
				FinalExamScormCorrectAnswerCache[FinalExamCurrentActiveQuestion] = $(this).attr("AnswerID");
			}
		});
		
		//show free form dialog (can also be targeted text, if DarkenBackground is not set to "yes" the next button will work
		$("#FreeFormDialogCloseButton").off('click');
		$("#FreeFormDialogDiv").css({"top": AnswerResultNode.attr("Top") + "px" , "left": AnswerResultNode.attr("Left")  +"px" });
		$("#FreeFormDialogDiv").html( AnswerResult );
		$("#FreeFormDialogCloseButton").attr('tabindex', "0");

		if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
		{
			if (AnswerResultNode.attr("DarkenBackground")=="yes") { $("#FadeOutBackgroundDiv").show(); }
			$("#FreeFormDialogDiv").show();
		}
		else
		{
			if (AnswerResultNode.attr("DarkenBackground")=="yes") { $("#FadeOutBackgroundDiv").fadeIn(250); }
			$("#FreeFormDialogDiv").fadeIn(250);
		}

		$.doTimeout( '', 500, function(){
			$("#FreeFormDialogCloseButton").on('click', function()
			{
				CloseQuestionAnswerDialog(Results1);
				return false;
			});
		});

		if (AnswerResultNode.attr("AudioFile")!="")
		{
			if (CourseMode=="Video") {
				$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: AnswerResultNode.attr("AudioFile") });
				$("#jquery_jplayer_1").jPlayer("play");
				isPlay = 1;
				$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
				$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
			}
		}

		//disable the form and submit button if an answer has been choosen also set the cache also enable the next button
		if (Results1!="")
		{
			FinalExamAnswerCache[FinalExamCurrentActiveQuestion] = Results1;
			FinalExamAnswerTextCache[FinalExamCurrentActiveQuestion] = AnswerResultNoReplace;
			FinalExamScormUserAnswerCache[FinalExamCurrentActiveQuestion] = UserSelectedAnswersString;

			$('input.graphically').attr('disabled',true);
			$('input.graphically').attr('disabled',true);

			$("#AnswerBtn"+FinalExamCurrentActiveQuestion).addClass("disabled");

			//save right/wrong answer
			FinalExamAnswerRightCache[FinalExamCurrentActiveQuestion] = FinalExamRightAnswer;

			//unlock next button
			$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
		}
		
		//post question to scorm directly after answer
		if (admin_FinalExamPostQuestionsScorm==true)
		{
			if (admin_ScormOrFinalQuiz=="Final")
			{
				if (admin_UseAicc) {
					AddScormQuizAnswer_AICC( FinalExamScormQuestionCache[FinalExamCurrentActiveQuestion], FinalExamScormAnswersCache[FinalExamCurrentActiveQuestion], FinalExamScormCorrectAnswerCache[FinalExamCurrentActiveQuestion], FinalExamScormUserAnswerCache[FinalExamCurrentActiveQuestion], FinalExamAnswerRightCache[FinalExamCurrentActiveQuestion] );
				} else 
				{
					AddScormQuizAnswer( FinalExamScormQuestionIDCache[FinalExamCurrentActiveQuestion], FinalExamScormQuestionCache[FinalExamCurrentActiveQuestion], FinalExamScormAnswersCache[FinalExamCurrentActiveQuestion], FinalExamScormCorrectAnswerCache[FinalExamCurrentActiveQuestion], FinalExamScormUserAnswerCache[FinalExamCurrentActiveQuestion], FinalExamAnswerRightCache[FinalExamCurrentActiveQuestion] );
				}
			}
		}
		
	}
}


//------------------------------------------------------------------------------------------------------------------
function SetupFinalExam(QuestionGroup)
{
	CurrentQuestionGroup = QuestionGroup;
	var FinalRoot = $(FinalXML).find("Final").find("QuestionGroup[Name='"+QuestionGroup+"']");
	
	//find first question of group real position and exam postion
	FinalExamCurrentActiveQuestion = -1;
	nCount = 0;
	while ((FinalExamCurrentActiveQuestion==-1) && ( nCount < FinalExamQArray.length ))
	{
		if (FinalExamQArray[nCount].group == QuestionGroup) { FinalExamCurrentActiveQuestion = FinalExamQArray[nCount].questionNo;  }
		nCount++;
	}
	VirtualQuestionGroupCounter = 1;
	
//	console.log("first quesiton in qroup: "+FinalExamCurrentActiveQuestion);
	
	$("#ajax-loading-graph").hide();
	$("#template-place").html( TemplateArray[CurrentTemplateID] );

	BackgroundAudio = FinalRoot.attr("BackgroundAudioFile");
	if (CourseMode=="Video") {
		$("#Background_Audio_Player").jPlayer("setMedia", { mp3: BackgroundAudio }).jPlayer("play");
		isPlay = 1;
		$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
		$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
	}

	$("#FadeOutBackgroundDiv").removeClass().addClass("InteractiveFadeoutStyle");
	$("#FadeOutBackgroundDiv").css({"top" :"5px" , "left" : "5px" , "width": ($("#skin-container").width()-10) + "px" , "height": ($("#skin-container").height()-15) +"px", "border-radius":"5px"});

	//if has intro dialog then show it
	if ((FinalRoot.find("Intro").text().length>0) && (ShowFinalIntro))
	{
		$("#FreeFormDialogCloseButton").off('click');
		$("#FreeFormDialogDiv").css({"top": FinalRoot.find("Intro").attr("Top") + "px" , "left": FinalRoot.find("Intro").attr("Left")  +"px" });
		
		introtext = FinalRoot.find("Intro").text();
		
		introtext = introtext.replace("#MaxAtempt",admin_QuizRetakeMaxCount );
		introtext = introtext.replace("#AtemptsLeft",admin_QuizRetakeMaxCount-admin_QuizRetakeCounter[CurrentQuestionGroup]+1 );
		introtext = introtext.replace("#SectionQuestionCount",FinalExamGroupMaxQuestions[ CurrentQuestionGroup ] );
		introtext = introtext.replace("#TotalQuestionCount",FinalExamMaxQuestions );
		
		$("#FreeFormDialogDiv").html( introtext );
		$("#FreeFormDialogCloseButton").attr('tabindex', "0");

		if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
		{
			$("#FadeOutBackgroundDiv").show();
			$("#FreeFormDialogDiv").show();
		}
		else
		{
			$("#FadeOutBackgroundDiv").fadeIn(250);
			$("#FreeFormDialogDiv").fadeIn(250);
		}

		$.doTimeout( '', 500, function(){
			$("#FreeFormDialogCloseButton").on('click', function()
			{
				CloseIntroDialogFinalExam();
				return false;
			});
		});

		IntroBoxAudio = FinalRoot.find("Intro").attr("AudioFile");

		if (IntroBoxAudio!="")
		{
			if (CourseMode=="Video") {
				$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: IntroBoxAudio });
				$("#jquery_jplayer_1").jPlayer("play");
				isPlay = 1;
				$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
				$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
			}
		}
	} else
	{
		DrawFinalExamQuiz(FinalExamCurrentActiveQuestion);
	}
	ShowFinalIntro = true;
}

//------------------------------------------------------------------------------------------------------------------
function DrawFinalExamQuiz(questionNo)
{
	if (typeof FinalExamAnswerCache[questionNo] != 'undefined') { } else {FinalExamAnswerCache[questionNo]="N/A"; FinalExamAnswerTextCache[questionNo]=""; }

	var FinalQuestion = $(FinalXML).find("Final").find("QuestionGroup[Name='"+ FinalExamQArray[questionNo].group +"']").find("Question:eq("+ FinalExamQArray[questionNo].groupPosition +")");
	var FinalQuestionText = FinalQuestion.find("QuestionText");

	CurrentQuestionGroupPosition = FinalExamQArray[questionNo].GroupCounter;
	
	$("#template-place").html( TemplateArray[CurrentTemplateID] );
	
	FinalQuestion.find("Element").each(function()
	{
		elementtext = $(this).text();
		elementtext = elementtext.replace("#CurrentGroupQ",(FinalExamQArray[questionNo].position+1) );
		elementtext = elementtext.replace("#CurrentGroupTotal",FinalExamGroupMaxQuestions[ CurrentQuestionGroup ]);
		
		$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + $(this).attr("Top") + "px; left:" + $(this).attr("Left") + "px; width:" + $(this).attr("Width") + "px; height:" + $(this).attr("Height") + "px;'>" + elementtext + "</div>");
	});
	
	//disable next button and play audio for unanswered questions
	if ( (FinalExamAnswerCache[questionNo] == 'N/A') && (!admin_ReviewMode) )
	{
		$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
	}

	if (FinalQuestionText.attr("AudioFile")!="")
	{
		if (CourseMode=="Video") {
			$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: FinalQuestionText.attr("AudioFile") }).jPlayer("play");
			isPlay = 1;
			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
		}
	}

	$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + FinalQuestionText.attr("Top") + "px; left:" + FinalQuestionText.attr("Left") + "px; width:" + FinalQuestionText.attr("Width") + "px; height:" + FinalQuestionText.attr("Height") + "px;'>" + FinalQuestionText.text() + "</div>");

	//load randomize and draw page answers
	FinalExamAnswerType = FinalQuestion.find("Answers").attr("Type").toLowerCase();

	FinalExamAnswerLeft    = parseInt(FinalQuestion.find("Answers").attr("Left"),10);
	FinalExamAnswerTop     = parseInt(FinalQuestion.find("Answers").attr("Top"),10);
	FinalExamAnswerWidth   = parseInt(FinalQuestion.find("Answers").attr("Width"),10);
	FinalExamAnswerSpacing = parseInt(FinalQuestion.find("Answers").attr("Spacing"),10);

	FinalExamAnswersArray = [];
	FinalExamAnswersArrayOrdered = [];
	FinalExamAnswersArrayOrderedAnswerTexts = [];
	FinalExamMaxAnswers = -1;
	FinalExamRightAnswer = false;
	FinalExamRules = FinalQuestion.find("Rules");

	FinalExamScormAnswersCache[questionNo] = "";

	FinalQuestion.find("Answers").find("Answer").each(function() {
		FinalExamMaxAnswers++;
		FinalExamAnswersArray[FinalExamMaxAnswers] = $(this).attr("AnswerID");
		FinalExamAnswersArrayOrdered[FinalExamMaxAnswers] = $(this).attr("AnswerID");
		FinalExamAnswersArrayOrderedAnswerTexts[FinalExamMaxAnswers] = $(this).text();

		//update array for scorm data
		if (FinalExamScormAnswersCache[questionNo]!="") { FinalExamScormAnswersCache[questionNo]+=", ";}
		FinalExamScormAnswersCache[questionNo] += $(this).text();
	});

	//randomize questions if Randomize attribute is yes
	if (FinalQuestion.find("Answers").attr("Randomize")=="yes") { fisherYates2(FinalExamAnswersArray); }

	Answers ="<table border=0 cellspacing=0 cellpadding=2>";
	tabIndexC = 0;

	//update array for scorm data
	FinalExamScormQuestionCache[questionNo] = FinalQuestionText.text();
	FinalExamScormQuestionIDCache[questionNo] = FinalQuestionText.attr("QuestionID");

	for (xCounter=0; xCounter<=FinalExamMaxAnswers; xCounter++)
	{
		FinalQuestion.find("Answers").find("Answer").each(function() {
			if ($(this).attr("AnswerID")==FinalExamAnswersArray[xCounter])
			{
				var CheckCorrectAnswer = "";
				//console.log(FinalExamAnswerCache[questionNo]+" "+$(this).attr("AnswerID"));
				if (FinalExamAnswerCache[questionNo].indexOf($(this).attr("AnswerID")) !== -1)
				{
					CheckCorrectAnswer = " checked ";
				}

				tabIndexC++;

				if (FinalExamAnswerType=="radio")
				{
					AnswerTextWithLetter = $(this).text();
					AnswerTextWithLetter = AnswerTextWithLetter.replace("***", AnswerLetters[tabIndexC-1] );

					Answers += "<tr><td valign=top style='padding-top:6px'><span style=\"display:block; margin-bottom:" + FinalExamAnswerSpacing + "px;\"><input type='radio' name='FinalExamQuizAnswer' value='"+$(this).attr("AnswerID")+"' class='graphically' id='FinalExamQuiz_"+$(this).attr("AnswerID")+"' "+CheckCorrectAnswer+"><label tabindex='"+ tabIndexC +"' class='graphically' for='FinalExamQuiz_"+$(this).attr("AnswerID")+"'></label></td><td><label tabindex='"+ tabIndexC +"' style='display:block; cursor:pointer;' for='FinalExamQuiz_"+$(this).attr("AnswerID")+"'>" + AnswerTextWithLetter + "</label></td></tr>";
				} else
				if (FinalExamAnswerType=="checkbox")
				{
					AnswerTextWithLetter = $(this).text();
					AnswerTextWithLetter = AnswerTextWithLetter.replace("***", AnswerLetters[tabIndexC-1] );

					Answers += "<tr><td valign=top style='padding-top:6px'><span style=\"display:block; margin-bottom:" + FinalExamAnswerSpacing + "px;\"><input type='checkbox'  class='graphically' id='FinalExamQuiz_"+$(this).attr("AnswerID")+"' "+CheckCorrectAnswer+"><label tabindex='"+ tabIndexC +"'  class='graphically' for='FinalExamQuiz_"+$(this).attr("AnswerID")+"'></label></td><td><label tabindex='"+ tabIndexC +"'  style='display:block; cursor:pointer;' for='FinalExamQuiz_"+$(this).attr("AnswerID")+"'>" + AnswerTextWithLetter + "</label></td></tr>";
				}
			}
		});
	}

	Answers +="</table>";

	$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + FinalExamAnswerTop + "px; left:" + FinalExamAnswerLeft + "px; width:" + FinalExamAnswerWidth + "px;'>" + Answers + "</div>");

	//add answer button
	var AnswerButtonFinalExam = "<a href='#' onClick='AnswerCheckFinalExam(); return false' id='AnswerBtn"+questionNo+"' style='position:absolute; width:" + FinalQuestion.find("AnswerButton").attr("Width") + "px; top:" + FinalQuestion.find("AnswerButton").attr("Top") + "px; left:" + FinalQuestion.find("AnswerButton").attr("Left") + "px; margin-bottom:5px;' class='" + FinalQuestion.find("AnswerButton").attr("Class") +"' name='btn1' value='" + "'>" + FinalExamSubmitButton +"</a>";

	$("#template-place").append(AnswerButtonFinalExam);

	//if quiz has already been answered fill in right answer and disable the buttons
	if (FinalExamAnswerCache[questionNo] != 'N/A')
	{
		$('input.graphically').attr('disabled',true);
		$('input.graphically').attr('disabled',true);
		$("#AnswerBtn"+FinalExamCurrentActiveQuestion).addClass("disabled");

		//unlock next button
		$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
	}
}
/*
 *	test:
 *	single exam on last page on scorm
 *	single exam not on last page on scorm
 *	
 *	multi part exam with last part on last page on scorm
 *	multi part exam with last part not on last page on scorm
 *	
 *	course with no exam on scorm
 *		
 * 
 */