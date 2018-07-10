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

var FlatRightAnswer = false;

//------------------------------------------------------------------------------------------------------------------
function CloseFlatFreeFormIntroDialog()
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
function CloseFlatAnswerFreeFormDialog(CorrectAnswer)
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

	if ((CorrectAnswer) || (GamifcationContinueOnFirstChoice))
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
function ShowFlatAnswer(AnswerID)
{
	$(CourseXML).find("Modules").each(function() {
		$(CourseXML).find("Module").each(function() {
			if ('M'+$(this).attr("Name") == ModulePageArray[selectedModuleID] )
			{
				$(this).find("Page").each(function() {
					if ('L'+$(this).attr("Name") == ModulePageArray[selectedPageID] )
					{
						$(this).find("Answer").each(function()
						{
							if ($(this).attr("AnswerID")==AnswerID)
							{
								//Gamification
								//console.log(GamificationScoreArray+" - "+selectedPageID+" - "+SearchInArray(GamificationScoreArray, selectedPageID)+" - "+GamificationScoreArray.length);
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

								AnswerResult= $(this).text();
								AnswerResult = GamificationStringReplace(AnswerResult);
								
								AnswerResultAudio = $(this).attr("AudioFile");
								AnswerTop = $(this).attr("Top");
								AnswerLeft = $(this).attr("Left");
								AnswerResultNode = $(this);
								
								
								//if correct then set the button to close on next click
								if ($(this).attr("Correct")=="yes")
								{
									FlatRightAnswer = true;
									$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
								}

								//if answer has audio play it
								if (AnswerResultAudio!="")
								{
									if ((CourseMode=="Video") && (typeof $(this).attr("AudioFile") !=="undefined")) {
										$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: AnswerResultAudio });
										$("#jquery_jplayer_1").jPlayer("play");
										isPlay = 1;
										$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
										$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
									}
								}

								//unlock next page if answer is correct
								if (FlatRightAnswer)
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

								if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
								{
									if (AnswerResultNode.attr("DarkenBackground")=="yes") { $("#FadeOutBackgroundDiv").show(); }
									$("#FreeFormDialogDiv").show();
									$("#FreeFormDialogDiv").css({"top": AnswerTop + "px" , "left": AnswerLeft  +"px" });
									$("#FreeFormDialogDiv").html(AnswerResult);
									$("#FreeFormDialogCloseButton").attr('tabindex', "10");
								}
								else
								{
									$("#FreeFormDialogDiv").css({"top": AnswerTop + "px" , "left": AnswerLeft  +"px" });
									$("#FreeFormDialogDiv").html(AnswerResult);
									$("#FreeFormDialogCloseButton").attr('tabindex', "10");
									if (AnswerResultNode.attr("DarkenBackground")=="yes") { $("#FadeOutBackgroundDiv").fadeIn(250); }
									$("#FreeFormDialogDiv").fadeIn(250);
								}

								$.doTimeout( '', 500, function(){
									$("#FreeFormDialogCloseButton").on('click', function()
									{
										CloseFlatAnswerFreeFormDialog(FlatRightAnswer);
										return false;
									});
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
function DrawFlatQuiz()
{
	FlatRightAnswer = false;

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

						ContinueButton = $(this).attr("ContinueButton");
						StartButton = $(this).attr("StartButton");
						
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

						RightAnswerHeader = $(this).find("RightAnswerHeader").text();
						WrongAnswerHeader = $(this).find("WrongAnswerHeader").text();

						AnswerBox = $(this).find("AnswerBox");
						IntroAudio = $(this).attr("AudioFile");

						BackgroundAudio = $(this).attr("BackgroundAudioFile");
						if (CourseMode=="Video") {
							$("#Background_Audio_Player").jPlayer("setMedia", { mp3: BackgroundAudio });
							$("#Background_Audio_Player").jPlayer("play");
							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
						}

						//draw page
						ThePageElements = $(this).find("Elements");
						ThePageElements.find("Element").each(function()
						{
							var AnswerLink ="onClick='return false;' style='cursor:default'";
							if (typeof $(this).attr("AnswerID") ==="undefined")	{  } else {AnswerLink = "onClick='ShowFlatAnswer("+ $(this).attr("AnswerID") +"); return false;'";}

							$("#template-place").append("<a href=\"#\"" +AnswerLink+"><div style='padding:10px; overflow:hidden; position:absolute; top:" + $(this).attr("Top") + "px; left:" + $(this).attr("Left") + "px; width:" + $(this).attr("Width") + "px; height:" + $(this).attr("Height") + "px;' class='"+$(this).attr("HoverClass")+"' >" + $(this).text() + "</div></a>");
						});


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
									CloseFlatFreeFormIntroDialog();
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
