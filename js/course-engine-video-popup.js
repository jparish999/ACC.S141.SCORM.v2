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

var PopupAnswersArray = [];
var PopupAnswersArrayOrdered = [];
var PopupMaxAnswers = -1;
var PopupRightAnswer = false;
var PopupRules;
var AnswerResultAudio="";
var ContinueOnCorrect = false;

var PopupQuizAnswerCache = [];
var PopupQuizAnswerTextCache = [];
var QTargetDialogName = "";

//------------------------------------------------------------------------------------------------------------------
function CloseStandardDialog()
{
	NewDialogClose();

	if (CourseMode=="Video") {
		//resume play
		isPlay = 1;

		$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
		$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

		if ((CourseMode=="Video") && (!FlashMode)) {
			if (!isiPad) //don't play audio on video popups
			{
				$("#jquery_jplayer_1").jPlayer("stop");
			}
			$("#jplayer_video").jPlayer("play" );
		}

		//resume flash
		if ((CourseMode=="Video") && (FlashMode) && (FlashTime!=-1))
		{
			if (!isiPad) //don't play audio on video popups
			{
				$("#jquery_jplayer_1").jPlayer("play");
				$("#Background_Audio_Player").jPlayer("play");
			}

			if ($("#jplayer_video").is(":visible")) { $("#jplayer_video").jPlayer("play" ); }
			if (tid==null) { tid = setInterval(FlashFrame, 100); }
		}

	} else
	{
		if (TextModeLinkClick == 0)
		{
			if (TextGoBackwards==1)	{ BackwardsClick(); } else { ForwardClick(); } //
		}

		TextModeLinkClick = 0;
	}
}


//------------------------------------------------------------------------------------------------------------------
function ShowStandardDialog(TargetDialogName)
{
	$(CourseXML).find("Dialogs").each(function() {
		$(CourseXML).find("StandardDialog").each(function() {
			if ($(this).attr("Name") == TargetDialogName )
			{
				DialogHeader = $(this).find("DialogHeader").text();
				DialogURL = $(this).attr("File");
				DialogAudio = $(this).attr("AudioFile");
				if (typeof DialogAudio =="undefined") { DialogAudio=""; };

				//only dialogs that overlay video can have audio, the jquery_jplayer_1 is resevered for audio on flash so can't be used here
				if ((DialogAudio!="") && (!FlashMode))
				{
					if (CourseMode=="Video") {
						if (!isiPad) //don't play audio on video popups
						{
							$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: DialogAudio });
							$("#jquery_jplayer_1").jPlayer("play");
							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
						}
					}
				}

				//pause playback for video
				if ((CourseMode=="Video") && (!FlashMode)) {
					$("#jplayer_video").jPlayer("pause" );
					isPlay = 0;
					$("#play-button").addClass("play-button-style").removeClass("pause-button-style");
					$("#play-button").attr('alt',admin_Play);	$("#play-button").attr('title',admin_Play);
				}

				//pause flash
				if ((CourseMode=="Video") && (FlashMode))
				{
					$("#jquery_jplayer_1").jPlayer("pause");
					$("#Background_Audio_Player").jPlayer("pause");

					if ($("#jplayer_video").is(":visible")) { $("#jplayer_video").jPlayer("pause" ); }
					BreakSequenceLoop = true;
					FlashAbortTimer();
					isPlay = 0;
					$("#play-button").addClass("play-button-style").removeClass("pause-button-style");
					$("#play-button").attr('alt',admin_Play);	$("#play-button").attr('title',admin_Play);
				}

				NewDialog( $(this).attr("Top") , $(this).attr("Left") , parseInt($(this).attr("Width"),10) , parseInt($(this).attr("Height"),10)+85 , $(this).attr("BgAudio"), DialogHeader, "<div id=\"wrapper\" style=\"width:"+(parseInt($(this).attr("Width"),10))+"px; -webkit-overflow-scrolling:touch;overflow:auto;\"></div>" + VideoPopupContentButton, true);

				//load content with delay so box and dimensions have rendered
				$.doTimeout( '', 250, function(){
					$("#introclosebutton").css('bottom','10px');
					$("#wrapper").load(DialogURL, function() { $("#wrapper").children(0).scrollTop(0);});//
				} );

			}
		});
	});
}


function fisherYates ( myArray ) {
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
function ClosePopupQuestionAnswerDialog_v2(UserChoice)
{
	if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
	{
		$("#FadeOutBackgroundDiv2").hide();
		$("#FreeFormDialogDiv").hide();
	}
	else
	{
		$("#FadeOutBackgroundDiv2").fadeOut(250);
		$("#FreeFormDialogDiv").fadeOut(250);
	}

	if (CourseMode=="Video") {
		if (!isiPad) //don't play audio on video popups
		{
			$("#jquery_jplayer_1").jPlayer("stop");
		}
	}


	//if user clicked without selecting just go back to the question
	if (UserChoice!="")
	{
		if ((ContinueOnCorrect) && (PopupRightAnswer))
		{
			NewDialogClose();

			if (CourseMode=="Video") {
				$("#jquery_jplayer_1").jPlayer("stop");

				//resume play
				isPlay = 1;

				$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
				$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

				$("#jplayer_video").jPlayer("play" );
			} else
			{
				if (TextGoBackwards==1)	{ BackwardsClick(); } else { ForwardClick(); } //
			}
		}
	}
}

// NEW QUIZ DIALOG WITH POPUP FEEDBACK

//------------------------------------------------------------------------------------------------------------------
function AnswerCheck_v2()
{

	if ((PopupRightAnswer)) // || (admin_ReviewMode)) //if right answer is already choosen
	{
		NewDialogClose();

		if (CourseMode=="Video") {
			if (!isiPad) //don't play audio on video popups
			{
				$("#jquery_jplayer_1").jPlayer("stop");
			}

			//resume play
			isPlay = 1;

			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

			$("#jplayer_video").jPlayer("play" );
		} else
		{
			if (TextGoBackwards==1)	{ BackwardsClick(); } else { ForwardClick(); } //
		}
	} else
	{
		Results1 = "";
		//loop the answers build the string to compare with results
		if (PopupAnswerType=="checkbox")
		{
			for (xCounter=0; xCounter<=PopupMaxAnswers; xCounter++)
			{
				if ($("#popupquiz_"+PopupAnswersArrayOrdered[xCounter]).is(':checked'))
				{
					if (Results1!="") { Results1 +=","; }
					Results1 +=PopupAnswersArrayOrdered[xCounter];
				}
			}
		} else
		if (PopupAnswerType=="radio")
		{
			if ($('input[name=popup_quiz_answer]:checked').val() != null) {
				   Results1 = $('input[name=popup_quiz_answer]:checked').val();
			}
		}

		//search the rules for correct answer
		AnswerResult = "";
		var AnswerResultNode;
		PopupRules.find("Rule").each(function() {
			if ( $(this).attr("AnswerID")+"," == Results1+",")
			{
				AnswerResult= $(this).text();
				AnswerResultNode = $(this);

				//if correct then set the button to close on next click
				if ($(this).attr("Correct")=="yes")
				{
					PopupRightAnswer=true;
					PopupQuizAnswerCache[QTargetDialogName] += $(this).attr("AnswerID")+",";
					PopupQuizAnswerTextCache[QTargetDialogName] = AnswerResult;
				}
			}
		});

		//find the * answer generic wrong result
		if (AnswerResult=="")
		{
			PopupRules.find("Rule").each(function() {
				if ( $(this).attr("AnswerID")=="*")
				{
					AnswerResult= $(this).text();
					AnswerResultNode = $(this);
				}
			});
		}


		//show free form dialog (can also be targeted text, if DarkenBackground is not set to "yes" the next button will work
		$("#FadeOutBackgroundDiv2").removeClass().addClass("InteractiveFadeoutStyle");
		$("#FadeOutBackgroundDiv2").css({"top" :"5px" , "left" : "5px" , "width": ($("#skin-container").width()-10) + "px" , "height": ($("#skin-container").height()-15) +"px", "border-radius":"5px"});

		$("#FreeFormDialogCloseButton").off('click');
		$("#FreeFormDialogDiv").css({"top": AnswerResultNode.attr("Top") + "px" , "left": AnswerResultNode.attr("Left")  +"px" });
		$("#FreeFormDialogDiv").html( AnswerResult );
		$("#FreeFormDialogCloseButton").attr('tabindex', "0");

		if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
		{
			$("#FadeOutBackgroundDiv2").show();
			$("#FreeFormDialogDiv").show();
		}
		else
		{
			$("#FadeOutBackgroundDiv2").fadeIn(250);
			$("#FreeFormDialogDiv").fadeIn(250);
		}

		$.doTimeout( '', 500, function(){
			$("#FreeFormDialogCloseButton").on('click', function()
			{
				ClosePopupQuestionAnswerDialog_v2(AnswerResult);
				return false;
			});
		});

		if (AnswerResultNode.attr("AudioFile")!="")
		{
			if (CourseMode=="Video") {
				if (!isiPad) //don't play audio on video popups
				{
					$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: AnswerResultNode.attr("AudioFile") });
					$("#jquery_jplayer_1").jPlayer("play");
					isPlay = 1;
					$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
					$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
				}
			}
		}
	}
}


//------------------------------------------------------------------------------------------------------------------
function ShowQuizDialog_v2(TargetDialogName)
{
	QTargetDialogName = TargetDialogName;
	if (typeof PopupQuizAnswerCache[QTargetDialogName] != 'undefined') {} else {PopupQuizAnswerCache[QTargetDialogName]=""; PopupQuizAnswerTextCache[QTargetDialogName]=""; }

	$(CourseXML).find("Dialogs").each(function() {

		$(CourseXML).find("QuizDialog").each(function() {
			if ($(this).attr("Name") == TargetDialogName )
			{
				DialogHeader = $(this).find("DialogHeader").text();
				DialogBody = $(this).find("DialogBody").text();
				DialogAudio = $(this).attr("AudioFile");

				ContinueOnCorrect = $(this).attr("ContinueOnCorrect").toLowerCase()==='true';

				PopupAnswerType = $(this).find("Answers").attr("Type").toLowerCase();

				PopupAnswersArray = [];
				PopupAnswersArrayOrdered = [];
				PopupMaxAnswers = -1;
				PopupRightAnswer = false;
				PopupRules = $(this).find("Rules");

				$(this).find("Answers").find("Answer").each(function() {
					PopupMaxAnswers++;
					PopupAnswersArray[PopupMaxAnswers] = $(this).attr("AnswerID");
					PopupAnswersArrayOrdered[PopupMaxAnswers] = $(this).attr("AnswerID");
				});

				//randomize questions if Randomize attribute is yes
				if ($(this).find("Answers").attr("Randomize")=="yes") { fisherYates(PopupAnswersArray); }

				Answers ="<table border=0 cellspacing=0 cellpadding=2>";

				for (xCounter=0; xCounter<=PopupMaxAnswers; xCounter++)
				{
					$(this).find("Answers").find("Answer").each(function() {
						if ($(this).attr("AnswerID")==PopupAnswersArray[xCounter])
						{
							var CheckCorrectAnswer = "";
							if (PopupQuizAnswerCache[QTargetDialogName].indexOf($(this).attr("AnswerID")) !== -1)
							{
								CheckCorrectAnswer = " checked ";
								PopupRightAnswer = true;
							}

							if (PopupAnswerType=="radio")
							{
								Answers += "<tr><td valign=top style='padding-top:6px'><input type='radio' name='popup_quiz_answer' value='"+$(this).attr("AnswerID")+"' class='graphically' id='popupquiz_"+$(this).attr("AnswerID")+"' "+CheckCorrectAnswer+"><label class='graphically' for='popupquiz_"+$(this).attr("AnswerID")+"'></label></td><td><label style='display:block; cursor:pointer;' for='popupquiz_"+$(this).attr("AnswerID")+"'>" + $(this).text() + "</label></td></tr>";
							} else
							if (PopupAnswerType=="checkbox")
							{
								Answers += "<tr><td valign=top style='padding-top:6px'><input type='checkbox' class='graphically' id='popupquiz_"+$(this).attr("AnswerID")+"' "+CheckCorrectAnswer+"><label class='graphically' for='popupquiz_"+$(this).attr("AnswerID")+"'></label></td><td><label style='display:block; cursor:pointer;' for='popupquiz_"+$(this).attr("AnswerID")+"'>" + $(this).text() + "</label></td></tr>";
							}
						}
					});
				}
				Answers +="</table>";


				if (DialogAudio!="")
				{
					if (CourseMode=="Video") {
						if (!isiPad) //don't play audio on video popups
						{
							$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: DialogAudio });
							$("#jquery_jplayer_1").jPlayer("play");
							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
						}
					}
				}


				//pause playback
				if (CourseMode=="Video") {
					isPlay = 0;
					$("#jplayer_video").jPlayer("pause" );
					$("#play-button").addClass("play-button-style").removeClass("pause-button-style");
					$("#play-button").attr('alt',admin_Play);	$("#play-button").attr('title',admin_Play);
				}

				//show dialog
				NewDialog( $(this).attr("Top") , $(this).attr("Left") , parseInt($(this).attr("Width"),10)+25 , parseInt($(this).attr("Height"),10)+90 , $(this).attr("BgAudio"), DialogHeader, DialogBody + "<br>" + Answers + VideoPopupQuizButton_v2, false);

			}
		});
	});
}



//------------------------- OLD QUIZ DİALOG WITH INLINE FEEDBACK

//------------------------------------------------------------------------------------------------------------------
function AnswerCheck()
{

	if ((PopupRightAnswer)) // || (admin_ReviewMode)) //if right answer is already choosen
	{
		NewDialogClose();

		if (CourseMode=="Video") {
			$("#jquery_jplayer_1").jPlayer("stop");

			//resume play
			isPlay = 1;

			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

			$("#jplayer_video").jPlayer("play" );
		} else
		{
			if (TextGoBackwards==1)	{ BackwardsClick(); } else { ForwardClick(); } //
		}
	} else
	{
		Results1 = "";
		//loop the answers build the string to compare with results
		if (PopupAnswerType=="checkbox")
		{
			for (xCounter=0; xCounter<=PopupMaxAnswers; xCounter++)
			{
				if ($("#popupquiz_"+PopupAnswersArrayOrdered[xCounter]).is(':checked'))
				{
					if (Results1!="") { Results1 +=","; }
					Results1 +=PopupAnswersArrayOrdered[xCounter];
				}
			}
		} else
		if (PopupAnswerType=="radio")
		{
			if ($('input[name=popup_quiz_answer]:checked').val() != null) {
				   Results1 = $('input[name=popup_quiz_answer]:checked').val();
			}
		}

		//search the rules for correct answer
		AnswerResult = "";
		AnswerResultAudio = "";
		PopupRules.find("Rule").each(function() {
			if ( $(this).attr("AnswerID")+"," == Results1+",")
			{
				AnswerResult= $(this).text();
				AnswerResultAudio = $(this).attr("AudioFile");

				//if correct then set the button to close on next click
				if ($(this).attr("Correct")=="yes")
				{
					PopupRightAnswer=true;
					PopupQuizAnswerCache[QTargetDialogName] += $(this).attr("AnswerID")+",";
					PopupQuizAnswerTextCache[QTargetDialogName] = AnswerResult;
				}
			}
		});

		//find the * answer generic wrong result
		if (AnswerResult=="")
		{
			PopupRules.find("Rule").each(function() {
				if ( $(this).attr("AnswerID")=="*")
				{
					AnswerResult= $(this).text();
					AnswerResultAudio = $(this).attr("AudioFile");
				}
			});
		}


		//if contineOnCorrect = true and rightanswer is true then close and resume
		if ((ContinueOnCorrect) && (PopupRightAnswer))
		{
			NewDialogClose();

			if (CourseMode=="Video") {
				$("#jquery_jplayer_1").jPlayer("stop");

				//resume play
				isPlay = 1;

				$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
				$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

				$("#jplayer_video").jPlayer("play" );
			} else
			{
				if (TextGoBackwards==1)	{ BackwardsClick(); } else { ForwardClick(); } //
			}
		} else
		{
			//if answer has audio play it
			if (AnswerResultAudio!="")
			{
				if (CourseMode=="Video") {
					if (!isiPad) //don't play audio on video popups
					{
						$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: AnswerResultAudio });
						$("#jquery_jplayer_1").jPlayer("play");
						isPlay = 1;
						$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
						$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
					}
				}
			}

			$("#popupquiz_feedback").html(AnswerResult);
		}
	}
}


//------------------------------------------------------------------------------------------------------------------
function ShowQuizDialog(TargetDialogName)
{
	QTargetDialogName = TargetDialogName;
	if (typeof PopupQuizAnswerCache[QTargetDialogName] != 'undefined') {} else {PopupQuizAnswerCache[QTargetDialogName]=""; PopupQuizAnswerTextCache[QTargetDialogName]=""; }

	$(CourseXML).find("Dialogs").each(function() {

		$(CourseXML).find("QuizDialog").each(function() {
			if ($(this).attr("Name") == TargetDialogName )
			{
				DialogHeader = $(this).find("DialogHeader").text();
				DialogBody = $(this).find("DialogBody").text();
				DialogAudio = $(this).attr("AudioFile");

				ContinueButton = $(this).attr("ContinueButton");
				StartButton = $(this).attr("StartButton");

				ContinueOnCorrect = $(this).attr("ContinueOnCorrect").toLowerCase()==='true';

				PopupAnswerType = $(this).find("Answers").attr("Type").toLowerCase();

				PopupAnswersArray = [];
				PopupAnswersArrayOrdered = [];
				PopupMaxAnswers = -1;
				PopupRightAnswer = false;
				PopupRules = $(this).find("Rules");

				$(this).find("Answers").find("Answer").each(function() {
					PopupMaxAnswers++;
					PopupAnswersArray[PopupMaxAnswers] = $(this).attr("AnswerID");
					PopupAnswersArrayOrdered[PopupMaxAnswers] = $(this).attr("AnswerID");
				});

				//randomize questions if Randomize attribute is yes
				if ($(this).find("Answers").attr("Randomize")=="yes") { fisherYates(PopupAnswersArray); }

				Answers ="<table border=0 cellspacing=0 cellpadding=2>";

				for (xCounter=0; xCounter<=PopupMaxAnswers; xCounter++)
				{
					$(this).find("Answers").find("Answer").each(function() {
						if ($(this).attr("AnswerID")==PopupAnswersArray[xCounter])
						{
							var CheckCorrectAnswer = "";
							if (PopupQuizAnswerCache[QTargetDialogName].indexOf($(this).attr("AnswerID")) !== -1)
							{
								CheckCorrectAnswer = " checked ";
								PopupRightAnswer = true;
							}

							if (PopupAnswerType=="radio")
							{
								Answers += "<tr><td valign=top style='padding-top:6px'><input type='radio' name='popup_quiz_answer' value='"+$(this).attr("AnswerID")+"' class='graphically' id='popupquiz_"+$(this).attr("AnswerID")+"' "+CheckCorrectAnswer+"><label class='graphically' for='popupquiz_"+$(this).attr("AnswerID")+"'></label></td><td><label style='display:block; cursor:pointer;' for='popupquiz_"+$(this).attr("AnswerID")+"'>" + $(this).text() + "</label></td></tr>";
							} else
							if (PopupAnswerType=="checkbox")
							{
								Answers += "<tr><td valign=top style='padding-top:6px'><input type='checkbox' class='graphically' id='popupquiz_"+$(this).attr("AnswerID")+"' "+CheckCorrectAnswer+"><label class='graphically' for='popupquiz_"+$(this).attr("AnswerID")+"'></label></td><td><label style='display:block; cursor:pointer;' for='popupquiz_"+$(this).attr("AnswerID")+"'>" + $(this).text() + "</label></td></tr>";
							}
						}
					});
				}
				Answers +="</table>";


				if (DialogAudio!="")
				{
					if (CourseMode=="Video") {
						if (!isiPad) //don't play audio on video popups
						{
							$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: DialogAudio });
							$("#jquery_jplayer_1").jPlayer("play");
							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
						}
					}
				}


				//pause playback
				if (CourseMode=="Video") {
					isPlay = 0;
					$("#jplayer_video").jPlayer("pause" );
					$("#play-button").addClass("play-button-style").removeClass("pause-button-style");
					$("#play-button").attr('alt',admin_Play);	$("#play-button").attr('title',admin_Play);
				}

				//show dialog
				NewDialog( $(this).attr("Top") , $(this).attr("Left") , parseInt($(this).attr("Width"),10)+25 , parseInt($(this).attr("Height"),10)+90 , $(this).attr("BgAudio"), DialogHeader, DialogBody + "<br>" + Answers + "<br><div id='popupquiz_feedback'>"+PopupQuizAnswerTextCache[QTargetDialogName]+"</div>" +VideoPopupQuizButton, false);

			}
		});
	});
}
