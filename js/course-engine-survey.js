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

var SurveyAnswersArray = [];
var SurveyAnswersArrayOrdered = [];
var SurveyAnswersArrayOrderedAnswerTexts = [];
var SurveyMaxAnswers = -1;

var SurveyAnswerLeft    = 50;
var SurveyAnswerTop     = 50;
var SurveyAnswerWidth   = 400;
var SurveyAnswerSpacing = 15;

var SurveyXML;

var AnswerLetters = ["A","B","C","D","E","F","G"];
var AnswerTextWithLetter = "";

var SurveyAnswerCache = [];
var SurveyScormAnswersCache = [];
var SurveyScormQuestionIDCache = [];
var SurveyScormQuestionCache = [];
var SurveyScormUserAnswerCache = [];
var SurveyAnswerMemoCache = [];

var SurveyRoot;

var SurveyHasMemo = false;

var SelectOptionError = "Please Chose an answer.";
var InputTextError = "Please Write Your Answer in the Text box.";

//------------------------------------------------------------------------------------------------------------------
function CloseIntroDialogSurvey()
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

	DrawSurveyQuiz(SurveyCurrentActiveQuestion);
}


//------------------------------------------------------------------------------------------------------------------
function CloseSurveyScoreDialog()
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
function ShowSurveyEndDialog()
{
	if (CourseMode=="Video") {
		$("#jquery_jplayer_1").jPlayer("stop");
	}

	var ModuleScoreNode;
	var ModuleScoreResultX = "";

	ModuleScoreNode = $(SurveyXML).find("SurveyEndDialog");
	ModuleScoreResultX = ModuleScoreNode.text();

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
			CloseSurveyScoreDialog();
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
function AnswerCheckSurvey()
{
	if (SurveyAnswerCache[SurveyCurrentActiveQuestion] == 'N/A')
	{
		Results1 = "";
		var UserSelectedAnswersString = "";
		//loop the answers build the string to compare with results

		if (SurveyMaxAnswers>=0)
		{
			if (SurveyAnswerType=="checkbox")
			{
				for (xCounter=0; xCounter<=SurveyMaxAnswers; xCounter++)
				{
					if ($("#SurveyQuiz_"+SurveyAnswersArrayOrdered[xCounter]).is(':checked'))
					{
						if (Results1!="") { Results1 +=","; }
						Results1 +=SurveyAnswersArrayOrdered[xCounter];

						if (UserSelectedAnswersString!="") { UserSelectedAnswersString +=","; }
						UserSelectedAnswersString += (xCounter+1).toString();
					}
				}
			} else
			if (SurveyAnswerType=="radio")
			{
				if ($('input[name=SurveyQuizAnswer]:checked').val() != null) {
					Results1 = $('input[name=SurveyQuizAnswer]:checked').val();

					UserSelectedAnswersString = $('input[name=SurveyQuizAnswer]:checked').val();
				}
			}

			//search the rules for correct answer
		}
		
		var MemoNodeText = $("#SurveyMemo").val();

		if ((Results1=="") && (SurveyMaxAnswers>=0)) { alert(SelectOptionError); } else
		if ((MemoNodeText=="") && (SurveyHasMemo)) { alert(InputTextError); } else
		{
			//if an answer has been choosen also set the cache also enable the next button
			if ( (Results1!="") || ( (SurveyMaxAnswers==-1) && (MemoNodeText!="") ))
			{
				SurveyAnswerCache[SurveyCurrentActiveQuestion] = Results1;
				SurveyScormUserAnswerCache[SurveyCurrentActiveQuestion] = UserSelectedAnswersString;
				SurveyAnswerMemoCache[SurveyCurrentActiveQuestion] = MemoNodeText;

				//unlock next button
				$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");

				//post question to javascript call after each question

				AddScormSurveyAnswer( SurveyScormQuestionIDCache[SurveyCurrentActiveQuestion], SurveyScormQuestionCache[SurveyCurrentActiveQuestion], SurveyScormAnswersCache[SurveyCurrentActiveQuestion], SurveyScormUserAnswerCache[SurveyCurrentActiveQuestion], SurveyAnswerMemoCache[SurveyCurrentActiveQuestion] ); 

				//if last question check results, if it is the last question call javascript function
				if (SurveyCurrentActiveQuestion == SurveyMaxQuestions)
				{
					ShowSurveyEndDialog();
				} else
				{
					ForwardClick();
				}
			}
		}
		
	}
}


//------------------------------------------------------------------------------------------------------------------
function SetupSurvey()
{
	SelectOptionError = $(SurveyXML).find("Survey").attr("SelectOptionError");
	InputTextError = $(SurveyXML).find("Survey").attr("InputTextError");
	
	var SurveyRoot = $(SurveyXML).find("Survey").find("Questions");
	SurveyMaxQuestions=0;
	$(SurveyXML).find("Survey").find("Question").each(function()
	{
		SurveyMaxQuestions++;
	});
	
	SurveyCurrentActiveQuestion = 1;
	
	$("#ajax-loading-graph").hide();
	$("#template-place").html( TemplateArray[CurrentTemplateID] );

	BackgroundAudio = SurveyRoot.attr("BackgroundAudioFile");
	if (CourseMode=="Video") {
		$("#Background_Audio_Player").jPlayer("setMedia", { mp3: BackgroundAudio }).jPlayer("play");
		isPlay = 1;
		$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
		$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
	}

	$("#FadeOutBackgroundDiv").removeClass().addClass("InteractiveFadeoutStyle");
	$("#FadeOutBackgroundDiv").css({"top" :"5px" , "left" : "5px" , "width": ($("#skin-container").width()-10) + "px" , "height": ($("#skin-container").height()-15) +"px", "border-radius":"5px"});

	//if has intro dialog then show it
	if (SurveyRoot.find("Intro").text().length>0)
	{
		$("#FreeFormDialogCloseButton").off('click');
		$("#FreeFormDialogDiv").css({"top": SurveyRoot.find("Intro").attr("Top") + "px" , "left": SurveyRoot.find("Intro").attr("Left")  +"px" });
		
		introtext = SurveyRoot.find("Intro").text();
		introtext = introtext.replace("#TotalQuestionCount",SurveyMaxQuestions );
		
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
				CloseIntroDialogSurvey();
				return false;
			});
		});

		IntroBoxAudio = SurveyRoot.find("Intro").attr("AudioFile");

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
		DrawSurveyQuiz(SurveyCurrentActiveQuestion);
	}
}

//------------------------------------------------------------------------------------------------------------------
function DrawSurveyQuiz()
{
	if (typeof SurveyAnswerCache[SurveyCurrentActiveQuestion] != 'undefined') { } else {SurveyAnswerCache[SurveyCurrentActiveQuestion]="N/A"; }

	var SurveyQuestion = $(SurveyXML).find("Survey").find("Questions").find("Question:eq("+ (SurveyCurrentActiveQuestion-1) +")");
	var SurveyQuestionText = SurveyQuestion.find("QuestionText");

	$("#template-place").html( TemplateArray[CurrentTemplateID] );
	
	SurveyQuestion.find("Element").each(function()
	{
		elementtext = $(this).text();
		
		$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + $(this).attr("Top") + "px; left:" + $(this).attr("Left") + "px; width:" + $(this).attr("Width") + "px; height:" + $(this).attr("Height") + "px;'>" + elementtext + "</div>");
	});
	
	//disable next button and play audio for unanswered questions
	if ( (SurveyAnswerCache[SurveyCurrentActiveQuestion] == 'N/A') && (!admin_ReviewMode) )
	{
		$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
	}

	if (SurveyQuestionText.attr("AudioFile")!="")
	{
		if (CourseMode=="Video") {
			$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: SurveyQuestionText.attr("AudioFile") }).jPlayer("play");
			isPlay = 1;
			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
		}
	}

	$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + SurveyQuestionText.attr("Top") + "px; left:" + SurveyQuestionText.attr("Left") + "px; width:" + SurveyQuestionText.attr("Width") + "px; height:" + SurveyQuestionText.attr("Height") + "px;'>" + SurveyQuestionText.text() + "</div>");

	//load and draw page answers
	SurveyAnswerType = SurveyQuestion.find("Answers").attr("Type").toLowerCase();

	SurveyAnswerLeft    = parseInt(SurveyQuestion.find("Answers").attr("Left"),10);
	SurveyAnswerTop     = parseInt(SurveyQuestion.find("Answers").attr("Top"),10);
	SurveyAnswerWidth   = parseInt(SurveyQuestion.find("Answers").attr("Width"),10);
	SurveyAnswerSpacing = parseInt(SurveyQuestion.find("Answers").attr("Spacing"),10);

	SurveyAnswersArray = [];
	SurveyAnswersArrayOrdered = [];
	SurveyAnswersArrayOrderedAnswerTexts = [];
	SurveyMaxAnswers = -1;

	SurveyScormAnswersCache[SurveyCurrentActiveQuestion] = "";

	SurveyQuestion.find("Answers").find("Answer").each(function() {
		SurveyMaxAnswers++;
		SurveyAnswersArray[SurveyMaxAnswers] = $(this).attr("AnswerID");
		SurveyAnswersArrayOrdered[SurveyMaxAnswers] = $(this).attr("AnswerID");
		SurveyAnswersArrayOrderedAnswerTexts[SurveyMaxAnswers] = $(this).text();

		//update array for scorm data
		if (SurveyScormAnswersCache[SurveyCurrentActiveQuestion]!="") { SurveyScormAnswersCache[SurveyCurrentActiveQuestion]+=", ";}
		SurveyScormAnswersCache[SurveyCurrentActiveQuestion] += $(this).text();
	});

	//update array for scorm data
	SurveyScormQuestionCache[SurveyCurrentActiveQuestion] = SurveyQuestionText.text();
	SurveyScormQuestionIDCache[SurveyCurrentActiveQuestion] = SurveyQuestionText.attr("QuestionID");
	
	if (SurveyMaxAnswers>=0)
	{
		Answers ="<table border=0 cellspacing=0 cellpadding=2>";
		tabIndexC = 0;

		for (xCounter=0; xCounter<=SurveyMaxAnswers; xCounter++)
		{
			SurveyQuestion.find("Answers").find("Answer").each(function() {
				if ($(this).attr("AnswerID")==SurveyAnswersArray[xCounter])
				{
					var CheckCorrectAnswer = "";
					//console.log(SurveyAnswerCache[SurveyCurrentActiveQuestion]+" "+$(this).attr("AnswerID"));
					if (SurveyAnswerCache[SurveyCurrentActiveQuestion].indexOf($(this).attr("AnswerID")) !== -1)
					{
						CheckCorrectAnswer = " checked ";
					}

					tabIndexC++;

					if (SurveyAnswerType=="radio")
					{
						AnswerTextWithLetter = $(this).text();
						AnswerTextWithLetter = AnswerTextWithLetter.replace("***", AnswerLetters[tabIndexC-1] );

						Answers += "<tr><td valign=top style='padding-top:6px'><span style=\"display:block; margin-bottom:" + SurveyAnswerSpacing + "px;\"><input type='radio' name='SurveyQuizAnswer' value='"+$(this).attr("AnswerID")+"' class='graphically' id='SurveyQuiz_"+$(this).attr("AnswerID")+"' "+CheckCorrectAnswer+"><label tabindex='"+ tabIndexC +"' class='graphically' for='SurveyQuiz_"+$(this).attr("AnswerID")+"'></label></td><td><label tabindex='"+ tabIndexC +"' style='display:block; cursor:pointer;' for='SurveyQuiz_"+$(this).attr("AnswerID")+"'>" + AnswerTextWithLetter + "</label></td></tr>";
					} else
					if (SurveyAnswerType=="checkbox")
					{
						AnswerTextWithLetter = $(this).text();
						AnswerTextWithLetter = AnswerTextWithLetter.replace("***", AnswerLetters[tabIndexC-1] );

						Answers += "<tr><td valign=top style='padding-top:6px'><span style=\"display:block; margin-bottom:" + SurveyAnswerSpacing + "px;\"><input type='checkbox'  class='graphically' id='SurveyQuiz_"+$(this).attr("AnswerID")+"' "+CheckCorrectAnswer+"><label tabindex='"+ tabIndexC +"'  class='graphically' for='SurveyQuiz_"+$(this).attr("AnswerID")+"'></label></td><td><label tabindex='"+ tabIndexC +"'  style='display:block; cursor:pointer;' for='SurveyQuiz_"+$(this).attr("AnswerID")+"'>" + AnswerTextWithLetter + "</label></td></tr>";
					}
				}
			});
		}

		Answers +="</table>";

		$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + SurveyAnswerTop + "px; left:" + SurveyAnswerLeft + "px; width:" + SurveyAnswerWidth + "px;'>" + Answers + "</div>");
	}

	SurveyHasMemo = false;
	var MemoNode = "";
	MemoNode = SurveyQuestion.find("Memo");
	
	if ( (typeof MemoNode =="undefined") || (MemoNode=="") || (MemoNode.length==0) ) {  } else
	{
		SurveyHasMemo = true;
		MemoAnswerLeft    = parseInt(MemoNode.attr("Left"),10);
		MemoAnswerTop     = parseInt(MemoNode.attr("Top"),10);
		MemoAnswerWidth   = parseInt(MemoNode.attr("Width"),10);
		MemoAnswerHeight  = parseInt(MemoNode.attr("Height"),10);
		$("#template-place").append("<div style='padding:0px; margin:0px; position:absolute; top:" + MemoAnswerTop + "px; left:" + MemoAnswerLeft + "px;'><textarea id='SurveyMemo' name='SurveyMemo' style='width:" + MemoAnswerWidth + "px; height:" + MemoAnswerHeight+ "px;' ></textarea></div>");

	}

	//add answer button
	var AnswerButtonSurvey = "<a href='#' onClick='AnswerCheckSurvey(); return false' id='AnswerBtn"+SurveyCurrentActiveQuestion+"' style='position:absolute; width:" + SurveyQuestion.find("AnswerButton").attr("Width") + "px; top:" + SurveyQuestion.find("AnswerButton").attr("Top") + "px; left:" + SurveyQuestion.find("AnswerButton").attr("Left") + "px; margin-bottom:5px;' class='" + SurveyQuestion.find("AnswerButton").attr("Class") +"' name='btn1' value='" + "'>" + FinalExamSubmitButton +"</a>";

	$("#template-place").append(AnswerButtonSurvey);

	//if quiz has already been answered fill in right answer and disable the buttons
	if (SurveyAnswerCache[SurveyCurrentActiveQuestion] != 'N/A')
	{
		$('input.graphically').attr('disabled',true);
		$('input.graphically').attr('disabled',true);
		$("#AnswerBtn"+SurveyCurrentActiveQuestion).addClass("disabled");
		
		$("#SurveyMemo").val(SurveyAnswerMemoCache[SurveyCurrentActiveQuestion]);
		$("#SurveyMemo").attr('disabled',true);

		//unlock next button
		$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
	}
}

