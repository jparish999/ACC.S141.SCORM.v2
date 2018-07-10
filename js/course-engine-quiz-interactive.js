/*
 * IEngine4
 * IEngine4 Video Engine
 *
 * Copyright (c) Inspired eLearning Inc. 2003-2014.  All Rights Reserved.
 * This source file is proprietary property of Inspired eLearning Inc.
 * http://http://www.inspiredelearning.com/inspired/License
 *
 * @version 4.8.11
 */

var InteractiveAnswersArray = [];
var InteractiveAnswersArrayOrdered = [];
var InteractiveMaxAnswers = -1;
var InteractiveRightAnswer = false;
var InteractiveRightAnswerSpace ="";
var InteractiveRules;

var InteractiveAnswerLeft    = 50;
var InteractiveAnswerTop     = 50;
var InteractiveAnswerWidth   = 400;
var InteractiveAnswerSpacing = 15;

var InteractiveQuizAnswerCache = [];

var CurrentInteractiveQuiz;

var AnswerResultNode;

//------------------------------------------------------------------------------------------------------------------
function CloseFreeFormOutroDialog()
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
	
	/* 4/7/2014 -- this seems like a leftover code as outro dialog should not have to start the audio of the page, like the intro dialog should 
	if (IntroAudio!="")
	{
		if (CourseMode=="Video") {
			$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: IntroAudio });
			$("#jquery_jplayer_1").jPlayer("play");
			isPlay = 1;
			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
		}
	}
	*/

	//go to next window
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
function CloseFreeFormIntroDialog()
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
	if (IntroAudio!="")
	{
		if (CourseMode=="Video") {
			$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: IntroAudio });
			$("#jquery_jplayer_1").jPlayer("play");
			isPlay = 1;
			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
		}
	}
}

//------------------------------------------------------------------------------------------------------------------
function CloseAnswerFreeFormDialog(CorrectAnswer)
{
	if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
	{
		$("#FreeFormDialogDiv").hide();
	}
	else
	{
		$("#FreeFormDialogDiv").fadeOut(250);
	}

	if (CourseMode=="Video") {
		isPlay = 0;
		$("#jquery_jplayer_1").jPlayer("stop");
		$("#play-button").removeClass("pause-button-style").addClass("play-button-style");
	}

	if ((CorrectAnswer) || ((GamifcationContinueOnFirstChoice) && (AnswerResultNode.attr("AnswerID")!="*") && (AnswerResultNode.attr("AnswerID")!="")) )
	{
		//if has outro dialog then show it, otherwise go to next page
		if (CurrentInteractiveQuiz.find("Outro").text().length>0)
		{
			$.doTimeout( '', 250, function(){
				$("#FreeFormDialogCloseButton").off('click');
				$("#FreeFormDialogDiv").css({"top": CurrentInteractiveQuiz.find("Intro").attr("Top") + "px" , "left": CurrentInteractiveQuiz.find("Intro").attr("Left")  +"px" });
				$("#FreeFormDialogDiv").html( CurrentInteractiveQuiz.find("Outro").text() );
				$("#FreeFormDialogCloseButton").attr('tabindex', "0");
				if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
				{
					$("#FreeFormDialogDiv").show();
				}
				else
				{
					$("#FreeFormDialogDiv").fadeIn(250);
				}

				$.doTimeout( '', 500, function(){
					$("#FreeFormDialogCloseButton").on('click', function()
					{
						CloseFreeFormOutroDialog();
						return false;
					});
				});
			});

			IntroBoxAudio = CurrentInteractiveQuiz.find("Outro").attr("AudioFile");

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
			//if gamfication score is going to be shown then don't auto advance instead call the gamification code which will auto-advance the lesson when closed by user
			if ( (GamificationShowInGameScore) || (GamificationLastQuestion) ) { 
				$.doTimeout( '', 250, function(){ GamificationDialog(GamificationLastQuestion) }); 
			} else
			{
				if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
				{
					$("#FadeOutBackgroundDiv").hide();
				}
				else
				{
					$("#FadeOutBackgroundDiv").fadeOut(250);
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
		}
	} else
	{
		if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
		{
			$("#FadeOutBackgroundDiv").hide();
		}
		else
		{
			$("#FadeOutBackgroundDiv").fadeOut(250);
		}

		//load audio file back
		if (CourseMode=="Video") {
			$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: IntroAudio });
			isPlay = 1;
			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
		}
	}
	return false
}

//------------------------------------------------------------------------------------------------------------------
function AnswerCheckV3()
{
	if (InteractiveRightAnswer)
	{
		$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
	} else
	{
		Results1 = "";
		//loop the answers build the string to compare with results
		if (InteractiveAnswerType=="checkbox")
		{
			for (xCounter=0; xCounter<=InteractiveMaxAnswers; xCounter++)
			{
				if ($("#InteractiveQuiz_"+InteractiveAnswersArrayOrdered[xCounter]).is(':checked'))
				{
					if (Results1!="") { Results1 +=","; }
					Results1 +=InteractiveAnswersArrayOrdered[xCounter];
				}
			}
		} else
		if (InteractiveAnswerType=="radio")
		{
			if ($('input[name=InteractiveQuizAnswer]:checked').val() != null) {
				   Results1 = $('input[name=InteractiveQuizAnswer]:checked').val();
			}
		}


		//search the rules for correct answer
		AnswerResult = "";
		AnswerResultAudio = "";
		AnswerTop = "100";
		AnswerLeft = "100";

		InteractiveRules.find("Rule").each(function() {
			if ( ($(this).attr("AnswerID")+"," == Results1+",") || (($(this).attr("AnswerID").indexOf("-")==0) && ($(this).attr("AnswerID").indexOf(Results1)>0))	)
			{
				AnswerResult= $(this).text();
				AnswerResultAudio = $(this).attr("AudioFile");
				AnswerTop = $(this).attr("Top");
				AnswerLeft = $(this).attr("Left");
				AnswerResultNode = $(this);
				
				//Gamification
				if ( (SearchInArray(GamificationScoreArray, selectedPageID)== -1) || (GamificationScoreArray.length==0) )
				{
					if ($(this).attr("Correct")=="yes") {
						GamificationUserScore += GamificationQuestionUserScore;
					} else
					{
						GamificationComputerScore += GamificationQuestionComputerScore;
					}
					GamificationScoreArray.push(selectedPageID);
					
					GamificationSuspendData = GamificationComputerScore+","+GamificationQuestionUserScore+",";
					for(var i=0; i<GamificationScoreArray.length; i++) { GamificationSuspendData += GamificationScoreArray[i] + ","; }
					
				}
				AnswerResult = GamificationStringReplace(AnswerResult);
				
				
				//if correct then set the button to close on next click
				if ($(this).attr("Correct")=="yes")
				{
					InteractiveRightAnswer=true;
					InteractiveQuizAnswerCache[selectedPageID] += $(this).attr("AnswerID")+",";
					$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
				}
			}
		});

		//find the * answer generic wrong result
		if (AnswerResult=="")
		{
			InteractiveRules.find("Rule").each(function() {
				if ( $(this).attr("AnswerID")=="*")
				{
					AnswerResult= $(this).text();
					AnswerResultAudio = $(this).attr("AudioFile");
					AnswerTop = $(this).attr("Top");
					AnswerLeft = $(this).attr("Left");
					AnswerResultNode = $(this);
				}
			});
		}

		//if answer has audio play it
		if (AnswerResultAudio!="")
		{
			if (CourseMode=="Video") {
				$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: AnswerResultAudio });
				$("#jquery_jplayer_1").jPlayer("play");
				isPlay = 1;
				$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
				$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

			}
		}

		//unlock next page if answer is correct
		if (InteractiveRightAnswer)
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
			}
		}


		$("#FreeFormDialogCloseButton").off('click');
		$("#FreeFormDialogDiv").css({"top": AnswerTop + "px" , "left": AnswerLeft  +"px" });
		$("#FreeFormDialogDiv").html(AnswerResult);
		$("#FreeFormDialogCloseButton").attr('tabindex', "10");

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
				CloseAnswerFreeFormDialog(InteractiveRightAnswer);
				return false;
			});
		});
	}
}


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
function DrawInteractiveQuiz()
{
	if (typeof InteractiveQuizAnswerCache[selectedPageID] != 'undefined') { } else {InteractiveQuizAnswerCache[selectedPageID]="N/A"; }

	//if next chapter is grayed and not in review mode disable next button
	var DisableNextButton=false;
	if (selectedPageID<MaxModulePage)
	{
		if ( (ModulePageViewableArray[selectedPageID+1]!= 1) && (ModulePageArray[selectedPageID+1].charAt(0)!="M")) {DisableNextButton=true;}
		if ( (ModulePageViewableArray[selectedPageID+2]!= 1) && (ModulePageArray[selectedPageID+1].charAt(0)=="M")) {DisableNextButton=true;}
	}
	if (admin_ReviewMode) {DisableNextButton=false;}
	if (DisableNextButton)
	{
		$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
	}

	$("#FadeOutBackgroundDiv").removeClass().addClass("InteractiveFadeoutStyle");
	$("#FadeOutBackgroundDiv").css({"top" :"5px" , "left" : "5px" , "width": ($("#skin-container").width()-10) + "px" , "height": ($("#skin-container").height()-15) +"px", "border-radius":"5px"});


	$("#ajax-loading-graph").hide();
	$(CourseXML).find("Modules").each(function() {

		$(CourseXML).find("Module").each(function() {

			if ('M'+$(this).attr("Name") == ModulePageArray[selectedModuleID] )
			{
				$(this).find("Page").each(function() {

					if ('L'+$(this).attr("Name") == ModulePageArray[selectedPageID] )
					{
						ModuleName = $(this).attr("Name");
						$("#template-place").html("");
						$("#template-place").html( TemplateArray[CurrentTemplateID] );

						CurrentInteractiveQuiz = $(this);

						IntroAudio = $(this).attr("AudioFile");
						
						GamifcationContinueOnFirstChoice = false;
						GamifcationContinueOnFirstChoice = $(this).attr("GamifcationContinueOnFirstChoice");
						if (typeof GamifcationContinueOnFirstChoice=="undefined") { GamifcationContinueOnFirstChoice=false; } 

						GamificationQuestionUserScore = $(this).attr("GamifictionUser");
						if (typeof GamificationQuestionUserScore=="undefined") { GamificationQuestionUserScore=0; } else { GamificationQuestionUserScore = parseInt(GamificationQuestionUserScore,10) } ;
						GamificationQuestionComputerScore = $(this).attr("GamifictionComputer");
						if (typeof GamificationQuestionComputerScore=="undefined") { GamificationQuestionComputerScore=0; } else { GamificationQuestionComputerScore = parseInt(GamificationQuestionComputerScore,10) } ;

						GamificationShowInGameScore = $(this).attr("GamificationShowInGameScore");
						if (typeof GamificationShowInGameScore=="undefined") { GamificationShowInGameScore=false; } else { GamificationShowInGameScore=true; } ;
						
						GamificationLastQuestion = $(this).attr("GamificationLastQuestion");
						if (typeof GamificationLastQuestion=="undefined") { GamificationLastQuestion=false; } else { GamificationLastQuestion=true; } ;
						
						
						BackgroundAudio = $(this).attr("BackgroundAudioFile");
						if ((CourseMode=="Video") && (typeof BackgroundAudio != 'undefined'))  {
							$("#Background_Audio_Player").jPlayer("setMedia", { mp3: BackgroundAudio });
							$("#Background_Audio_Player").jPlayer("play");
							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
						}

						//draw page elements
						ThePageElements = $(this).find("Elements");
						ThePageElements.find("Element").each(function()
						{

							$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + $(this).attr("Top") + "px; left:" + $(this).attr("Left") + "px; width:" + $(this).attr("Width") + "px; height:" + $(this).attr("Height") + "px;'>" + $(this).text() + "</div>");
						});

						//load randomize and draw page answers
						InteractiveAnswerType = $(this).find("Answers").attr("Type").toLowerCase();

						InteractiveAnswerLeft    = parseInt($(this).find("Answers").attr("Left"),10);
						InteractiveAnswerTop     = parseInt($(this).find("Answers").attr("Top"),10);
						InteractiveAnswerWidth   = parseInt($(this).find("Answers").attr("Width"),10);
						InteractiveAnswerSpacing = parseInt($(this).find("Answers").attr("Spacing"),10);

						InteractiveAnswersArray = [];
						InteractiveAnswersArrayOrdered = [];
						InteractiveMaxAnswers = -1;
						InteractiveRightAnswer = false;
						InteractiveRules = $(this).find("Rules");

						$(this).find("Answers").find("Answer").each(function() {
							InteractiveMaxAnswers++;
							InteractiveAnswersArray[InteractiveMaxAnswers] = $(this).attr("AnswerID");
							InteractiveAnswersArrayOrdered[InteractiveMaxAnswers] = $(this).attr("AnswerID");
						});

						//randomize questions if Randomize attribute is yes
						if ($(this).find("Answers").attr("Randomize")=="yes") { fisherYates2(InteractiveAnswersArray); }

						Answers ="<table border=0 cellspacing=0 cellpadding=2>";
						tabIndexC = 0;

						for (xCounter=0; xCounter<=InteractiveMaxAnswers; xCounter++)
						{
							$(this).find("Answers").find("Answer").each(function() {
								if ($(this).attr("AnswerID")==InteractiveAnswersArray[xCounter])
								{
									var CheckCorrectAnswer = "";
									if (InteractiveQuizAnswerCache[selectedPageID].indexOf($(this).attr("AnswerID")) !== -1)
									{
										CheckCorrectAnswer = " checked ";
									}

									tabIndexC++;
									if (InteractiveAnswerType=="radio")
									{
										Answers += "<tr><td valign=top style='padding-top:6px'><span style=\"display:block; margin-bottom:" + InteractiveAnswerSpacing + "px;\"><input type='radio' name='InteractiveQuizAnswer' value='"+$(this).attr("AnswerID")+"' class='graphically' id='InteractiveQuiz_"+$(this).attr("AnswerID")+"' "+CheckCorrectAnswer+"><label tabindex='"+ tabIndexC +"' class='graphically' for='InteractiveQuiz_"+$(this).attr("AnswerID")+"'></label></td><td><label tabindex='"+ tabIndexC +"' style='display:block; cursor:pointer;' for='InteractiveQuiz_"+$(this).attr("AnswerID")+"'>" + $(this).text() + "</label></td></tr>";
									} else
									if (InteractiveAnswerType=="checkbox")
									{
										Answers += "<tr><td valign=top style='padding-top:6px'><span style=\"display:block; margin-bottom:" + InteractiveAnswerSpacing + "px;\"><input type='checkbox'  class='graphically' id='InteractiveQuiz_"+$(this).attr("AnswerID")+"' "+CheckCorrectAnswer+"><label tabindex='"+ tabIndexC +"' class='graphically' for='InteractiveQuiz_"+$(this).attr("AnswerID")+"'></label></td><td><label tabindex='"+ tabIndexC +"' style='display:block; cursor:pointer;' for='InteractiveQuiz_"+$(this).attr("AnswerID")+"'>" + $(this).text() + "</label></td></tr>";
									}
								}
							});
						}
						Answers +="</table>";

						$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + InteractiveAnswerTop + "px; left:" + InteractiveAnswerLeft + "px; width:" + InteractiveAnswerWidth + "px;'>" + Answers + "</div>");

						//add answer button
						var AnswerButtonV3 = "<a href='#' onClick='AnswerCheckV3(); return false' id='AnswerBtn"+selectedPageID+"' style='text-align:center; position:absolute; width:" + $(this).find("AnswerButton").attr("Width") + "px; top:" + $(this).find("AnswerButton").attr("Top") + "px; left:" + $(this).find("AnswerButton").attr("Left") + "px; margin-bottom:5px;' class='" + $(this).find("AnswerButton").attr("Class") +"' name='btn1' value='" + $(this).find("AnswerButton").attr("Text") + "'>" + $(this).find("AnswerButton").attr("Text") + InteractiveQuizSubmitButton + "</a>";

						$("#template-place").append(AnswerButtonV3);

						//if has intro dialog then show it, otherwise play the audio
						if ($(this).find("Intro").text().length>0)
						{

							$("#FreeFormDialogCloseButton").off('click');
							$("#FreeFormDialogDiv").css({"top": $(this).find("Intro").attr("Top") + "px" , "left": $(this).find("Intro").attr("Left")  +"px" });
							$("#FreeFormDialogDiv").html( $(this).find("Intro").text() );
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
									CloseFreeFormIntroDialog();
									return false;
								});
							});

							IntroBoxAudio = $(this).find("Intro").attr("AudioFile");

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
							//play intro audio directly of intro dialog
							if (IntroAudio!="")
							{
								if (CourseMode=="Video") {
									$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: IntroAudio });
									$("#jquery_jplayer_1").jPlayer("play");
									isPlay = 1;
									$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
									$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
								}
							}

						}
					}
				});
			}
		});
	});
}
