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

var PreExamAnswersArray = [];
var PreExamAnswersArrayOrdered = [];
var PreExamAnswersArrayOrderedAnswerTexts = [];
var PreExamMaxAnswers = -1;
var PreExamRightAnswer = false;
var PreExamRules;

var PreExamAnswerLeft    = 50;
var PreExamAnswerTop     = 50;
var PreExamAnswerWidth   = 400;
var PreExamAnswerSpacing = 15;

var PreExamXML;

var AnswerLetters = ["A","B","C","D","E","F","G"];
var AnswerTextWithLetter = "";

var PreExamAnswerCache = [];
var PreExamAnswerTextCache = [];
var PreExamAnswerRightCache = [];

var PreExamScormQuestionCache = [];
var PreExamScormQuestionIDCache = [];
var PreExamScormAnswersCache = [];
var PreExamScormUserAnswerCache = [];
var PreExamScormCorrectAnswerCache = [];

var PreExamRoot;


//------------------------------------------------------------------------------------------------------------------
function CloseIntroDialogPreExam()
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

	DrawPreExamQuiz(PreExamCurrentActiveQuestion);
}


//------------------------------------------------------------------------------------------------------------------
function ClosePreExamScoreDialog()
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


//------------------------------------------------------------------------------------------------------------------
function ShowPreExamScore()
{
	if (CourseMode=="Video") {
		$("#jquery_jplayer_1").jPlayer("stop");
	}

	var TotalPreExamScore = 0;
	for (var i=1; i<=PreExamMaxQuestions; i++)
	{
		if (PreExamAnswerRightCache[i]) { TotalPreExamScore++; }
	}

	var PreExamScorePercentage = Math.round( (TotalPreExamScore / PreExamMaxQuestions ) *100);
	
	AddScormPreExamResult(PreExamScorePercentage);
	
	var ModuleScoreNode;
	var ModuleScoreResultX = "";

	ModuleScoreNode = $(PreExamXML).find("PreEndDialog");

	ModuleScoreResultX = ModuleScoreNode.text();

	//show results
	ModuleScoreResultX = ModuleScoreResultX.replace("#UserScore",TotalPreExamScore);
	ModuleScoreResultX = ModuleScoreResultX.replace("#MaxScore",PreExamMaxQuestions);
	ModuleScoreResultX = ModuleScoreResultX.replace("#UserPercentage",PreExamScorePercentage);
	
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
			ClosePreExamScoreDialog();
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
function PreExamCloseQuestionAnswerDialog(UserChoice)
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
		//if last question check results, if it is the last question call javascript function
		if (PreExamCurrentActiveQuestion == PreExamMaxQuestions)
		{
			$.doTimeout( '', 250, function(){
				ShowPreExamScore();
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
function AnswerCheckPreExam()
{
	if (PreExamAnswerCache[PreExamCurrentActiveQuestion] == 'N/A')
	{
		Results1 = "";
		var UserSelectedAnswersString = "";
		//loop the answers build the string to compare with results
		if (PreExamAnswerType=="checkbox")
		{
			for (xCounter=0; xCounter<=PreExamMaxAnswers; xCounter++)
			{
				if ($("#PreExamQuiz_"+PreExamAnswersArrayOrdered[xCounter]).is(':checked'))
				{
					if (Results1!="") { Results1 +=","; }
					Results1 +=PreExamAnswersArrayOrdered[xCounter];

					if (UserSelectedAnswersString!="") { UserSelectedAnswersString +=","; }
					UserSelectedAnswersString += (xCounter+1).toString();
				}
			}
		} else
		if (PreExamAnswerType=="radio")
		{
			if ($('input[name=PreExamQuizAnswer]:checked').val() != null) {
				Results1 = $('input[name=PreExamQuizAnswer]:checked').val();

				UserSelectedAnswersString = $('input[name=PreExamQuizAnswer]:checked').val();
			}
		}

		//search the rules for correct answer
		AnswerResult = "";
		var AnswerResultNode;
		PreExamRules.find("Rule").each(function() {
			if ( $(this).attr("AnswerID")+"," == Results1+",")
			{
				AnswerResult= $(this).text();
				AnswerResultNode = $(this);

				//if correct then set boolean to true to save to cache
				if ($(this).attr("Correct")=="yes")	{ PreExamRightAnswer=true; }
			}
		});

		//find the * answer generic wrong result
		if (AnswerResult=="")
		{
			PreExamRules.find("Rule").each(function() {
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
		PreExamRules.find("Rule").each(function() {
			if ($(this).attr("Correct")=="yes")
			{
				AnswerResult = AnswerResult.replace("***", AnswerLetters[ PreExamAnswersArray.indexOf( $(this).attr("AnswerID") ) ] );
				PreExamScormCorrectAnswerCache[PreExamCurrentActiveQuestion] = $(this).attr("AnswerID");
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
				PreExamCloseQuestionAnswerDialog(Results1);
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
			PreExamAnswerCache[PreExamCurrentActiveQuestion] = Results1;
			PreExamAnswerTextCache[PreExamCurrentActiveQuestion] = AnswerResultNoReplace;
			PreExamScormUserAnswerCache[PreExamCurrentActiveQuestion] = UserSelectedAnswersString;

			$('input.graphically').attr('disabled',true);
			$('input.graphically').attr('disabled',true);

			$("#AnswerBtn"+PreExamCurrentActiveQuestion).addClass("disabled");

			//save right/wrong answer
			PreExamAnswerRightCache[PreExamCurrentActiveQuestion] = PreExamRightAnswer;

			//unlock next button
			$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
		}
		
		//post question to javascript call after each question
		//
		AddScormPreExamAnswer( PreExamScormQuestionIDCache[PreExamCurrentActiveQuestion], PreExamScormQuestionCache[PreExamCurrentActiveQuestion], PreExamScormAnswersCache[PreExamCurrentActiveQuestion], PreExamScormCorrectAnswerCache[PreExamCurrentActiveQuestion], PreExamScormUserAnswerCache[PreExamCurrentActiveQuestion], PreExamAnswerRightCache[PreExamCurrentActiveQuestion] );
	}
}


//------------------------------------------------------------------------------------------------------------------
function SetupPreExam()
{
	var PreExamRoot = $(PreExamXML).find("PreExam").find("Questions");
	PreExamMaxQuestions=0;
	$(PreExamXML).find("PreExam").find("Question").each(function()
	{
		PreExamMaxQuestions++;
	});
	
	PreExamCurrentActiveQuestion = 1;
	
	$("#ajax-loading-graph").hide();
	$("#template-place").html( TemplateArray[CurrentTemplateID] );

	BackgroundAudio = PreExamRoot.attr("BackgroundAudioFile");
	if (CourseMode=="Video") {
		$("#Background_Audio_Player").jPlayer("setMedia", { mp3: BackgroundAudio }).jPlayer("play");
		isPlay = 1;
		$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
		$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
	}

	$("#FadeOutBackgroundDiv").removeClass().addClass("InteractiveFadeoutStyle");
	$("#FadeOutBackgroundDiv").css({"top" :"5px" , "left" : "5px" , "width": ($("#skin-container").width()-10) + "px" , "height": ($("#skin-container").height()-15) +"px", "border-radius":"5px"});

	//if has intro dialog then show it
	if (PreExamRoot.find("Intro").text().length>0)
	{
		$("#FreeFormDialogCloseButton").off('click');
		$("#FreeFormDialogDiv").css({"top": PreExamRoot.find("Intro").attr("Top") + "px" , "left": PreExamRoot.find("Intro").attr("Left")  +"px" });
		
		introtext = PreExamRoot.find("Intro").text();
		introtext = introtext.replace("#TotalQuestionCount",PreExamMaxQuestions );
		
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
				CloseIntroDialogPreExam();
				return false;
			});
		});

		IntroBoxAudio = PreExamRoot.find("Intro").attr("AudioFile");

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
		DrawPreExamQuiz(PreExamCurrentActiveQuestion);
	}
}

//------------------------------------------------------------------------------------------------------------------
function DrawPreExamQuiz()
{
	if (typeof PreExamAnswerCache[PreExamCurrentActiveQuestion] != 'undefined') { } else {PreExamAnswerCache[PreExamCurrentActiveQuestion]="N/A"; PreExamAnswerTextCache[PreExamCurrentActiveQuestion]=""; }

	var PreExamQuestion = $(PreExamXML).find("PreExam").find("Questions").find("Question:eq("+ (PreExamCurrentActiveQuestion-1) +")");
	var PreExamQuestionText = PreExamQuestion.find("QuestionText");

	$("#template-place").html( TemplateArray[CurrentTemplateID] );
	
	PreExamQuestion.find("Element").each(function()
	{
		elementtext = $(this).text();
		
		$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + $(this).attr("Top") + "px; left:" + $(this).attr("Left") + "px; width:" + $(this).attr("Width") + "px; height:" + $(this).attr("Height") + "px;'>" + elementtext + "</div>");
	});
	
	//disable next button and play audio for unanswered questions
	if ( (PreExamAnswerCache[PreExamCurrentActiveQuestion] == 'N/A') && (!admin_ReviewMode) )
	{
		$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
	}

	if (PreExamQuestionText.attr("AudioFile")!="")
	{
		if (CourseMode=="Video") {
			$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: PreExamQuestionText.attr("AudioFile") }).jPlayer("play");
			isPlay = 1;
			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
		}
	}

	$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + PreExamQuestionText.attr("Top") + "px; left:" + PreExamQuestionText.attr("Left") + "px; width:" + PreExamQuestionText.attr("Width") + "px; height:" + PreExamQuestionText.attr("Height") + "px;'>" + PreExamQuestionText.text() + "</div>");

	//load and draw page answers
	PreExamAnswerType = PreExamQuestion.find("Answers").attr("Type").toLowerCase();

	PreExamAnswerLeft    = parseInt(PreExamQuestion.find("Answers").attr("Left"),10);
	PreExamAnswerTop     = parseInt(PreExamQuestion.find("Answers").attr("Top"),10);
	PreExamAnswerWidth   = parseInt(PreExamQuestion.find("Answers").attr("Width"),10);
	PreExamAnswerSpacing = parseInt(PreExamQuestion.find("Answers").attr("Spacing"),10);

	PreExamAnswersArray = [];
	PreExamAnswersArrayOrdered = [];
	PreExamAnswersArrayOrderedAnswerTexts = [];
	PreExamMaxAnswers = -1;
	PreExamRightAnswer = false;
	PreExamRules = PreExamQuestion.find("Rules");

	PreExamScormAnswersCache[PreExamCurrentActiveQuestion] = "";

	PreExamQuestion.find("Answers").find("Answer").each(function() {
		PreExamMaxAnswers++;
		PreExamAnswersArray[PreExamMaxAnswers] = $(this).attr("AnswerID");
		PreExamAnswersArrayOrdered[PreExamMaxAnswers] = $(this).attr("AnswerID");
		PreExamAnswersArrayOrderedAnswerTexts[PreExamMaxAnswers] = $(this).text();

		//update array for scorm data
		if (PreExamScormAnswersCache[PreExamCurrentActiveQuestion]!="") { PreExamScormAnswersCache[PreExamCurrentActiveQuestion]+=", ";}
		PreExamScormAnswersCache[PreExamCurrentActiveQuestion] += $(this).text();
	});

	Answers ="<table border=0 cellspacing=0 cellpadding=2>";
	tabIndexC = 0;

	//update array for scorm data
	PreExamScormQuestionCache[PreExamCurrentActiveQuestion] = PreExamQuestionText.text();
	PreExamScormQuestionIDCache[PreExamCurrentActiveQuestion] = PreExamQuestionText.attr("QuestionID")

	for (xCounter=0; xCounter<=PreExamMaxAnswers; xCounter++)
	{
		PreExamQuestion.find("Answers").find("Answer").each(function() {
			if ($(this).attr("AnswerID")==PreExamAnswersArray[xCounter])
			{
				var CheckCorrectAnswer = "";
				//console.log(PreExamAnswerCache[PreExamCurrentActiveQuestion]+" "+$(this).attr("AnswerID"));
				if (PreExamAnswerCache[PreExamCurrentActiveQuestion].indexOf($(this).attr("AnswerID")) !== -1)
				{
					CheckCorrectAnswer = " checked ";
				}

				tabIndexC++;

				if (PreExamAnswerType=="radio")
				{
					AnswerTextWithLetter = $(this).text();
					AnswerTextWithLetter = AnswerTextWithLetter.replace("***", AnswerLetters[tabIndexC-1] );

					Answers += "<tr><td valign=top style='padding-top:6px'><span style=\"display:block; margin-bottom:" + PreExamAnswerSpacing + "px;\"><input type='radio' name='PreExamQuizAnswer' value='"+$(this).attr("AnswerID")+"' class='graphically' id='PreExamQuiz_"+$(this).attr("AnswerID")+"' "+CheckCorrectAnswer+"><label tabindex='"+ tabIndexC +"' class='graphically' for='PreExamQuiz_"+$(this).attr("AnswerID")+"'></label></td><td><label tabindex='"+ tabIndexC +"' style='display:block; cursor:pointer;' for='PreExamQuiz_"+$(this).attr("AnswerID")+"'>" + AnswerTextWithLetter + "</label></td></tr>";
				} else
				if (PreExamAnswerType=="checkbox")
				{
					AnswerTextWithLetter = $(this).text();
					AnswerTextWithLetter = AnswerTextWithLetter.replace("***", AnswerLetters[tabIndexC-1] );

					Answers += "<tr><td valign=top style='padding-top:6px'><span style=\"display:block; margin-bottom:" + PreExamAnswerSpacing + "px;\"><input type='checkbox'  class='graphically' id='PreExamQuiz_"+$(this).attr("AnswerID")+"' "+CheckCorrectAnswer+"><label tabindex='"+ tabIndexC +"'  class='graphically' for='PreExamQuiz_"+$(this).attr("AnswerID")+"'></label></td><td><label tabindex='"+ tabIndexC +"'  style='display:block; cursor:pointer;' for='PreExamQuiz_"+$(this).attr("AnswerID")+"'>" + AnswerTextWithLetter + "</label></td></tr>";
				}
			}
		});
	}

	Answers +="</table>";

	$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + PreExamAnswerTop + "px; left:" + PreExamAnswerLeft + "px; width:" + PreExamAnswerWidth + "px;'>" + Answers + "</div>");

	//add answer button
	var AnswerButtonPreExam = "<a href='#' onClick='AnswerCheckPreExam(); return false' id='AnswerBtn"+PreExamCurrentActiveQuestion+"' style='position:absolute; width:" + PreExamQuestion.find("AnswerButton").attr("Width") + "px; top:" + PreExamQuestion.find("AnswerButton").attr("Top") + "px; left:" + PreExamQuestion.find("AnswerButton").attr("Left") + "px; margin-bottom:5px;' class='" + PreExamQuestion.find("AnswerButton").attr("Class") +"' name='btn1' value='" + "'>" + FinalExamSubmitButton +"</a>";

	$("#template-place").append(AnswerButtonPreExam);

	//if quiz has already been answered fill in right answer and disable the buttons
	if (PreExamAnswerCache[PreExamCurrentActiveQuestion] != 'N/A')
	{
		$('input.graphically').attr('disabled',true);
		$('input.graphically').attr('disabled',true);
		$("#AnswerBtn"+PreExamCurrentActiveQuestion).addClass("disabled");

		//unlock next button
		$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
	}
}
