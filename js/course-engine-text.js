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

//------------------------------------------------------------------------------------------------------------------
(function($) {
  var cache = [];
  $.preLoadImages = function() {
    var args_len = arguments.length;
    for (var i = args_len; i--;) {
      var cacheImage = document.createElement('img');
      cacheImage.src = arguments[i];
      cache.push(cacheImage);
    }
  }
})(jQuery)

//------------------------------------------------------------------------------------------------------------------
function loadCourseCssFile(pathToFile) {

if(document.createStyleSheet) {
    try { document.createStyleSheet(pathToFile); } catch (e) { }
}
else {
    var css;
    css         = document.createElement('link');
    css.rel     = 'stylesheet';
    css.type    = 'text/css';
    css.media   = "all";
    css.href    = pathToFile;
    document.getElementsByTagName("head")[0].appendChild(css);
}
/*
	$('link[href="'+pathToFile+'"]').remove();

	var css = jQuery("<link>");
	css.attr({
		rel:  "stylesheet",
		type: "text/css",
		href: pathToFile
	});
	$("head").append(css);
*/
}

//------------------------------------------------------------------------------------------------------------------
function getParameterByName(name)
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

//------------------------------------------------------------------------------------------------------------------
function SearchInArray(xarray,needle) {
	var i = -1, index = -1;

	for(i = 0; i < xarray.length; i++) {
		if(xarray[i] === needle) {
			index = i;
			break;
		}
	}
	return index;
}


//------------------------------------------------------------------------------------------------------------------
var SettingsXML;

var isiPad = navigator.userAgent.match(/iPad/i) != null;
var isiPhone = navigator.userAgent.match(/iPhone/i) != null;

var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

var CourseLanguage = getParameterByName("lang");
if (CourseLanguage=="") { CourseLanguage="en"; }

var CourseMode = "Text";

var admin_SkinCSS = "";

var admin_CopyrightInfo = "";
var admin_Version = "";

var admin_URLOnExit = "";

var admin_DisableVolume = false;

var admin_BottomLogo = "";
var admin_TopLogo = "";

var admin_HelpFile = "";
var admin_GlossaryFile = "";
var admin_CourseFile = "";

var admin_ScormOrFinalQuiz = "";
var admin_RetakeFinalExam = "";

var admin_Submit = "";
var admin_Finish = "";
var admin_Help = "";
var admin_Glossary = "";
var admin_SaveAndExit = "";
var admin_Review = "";
var admin_ReviewMode = false;

var admin_Prev = "";

var admin_Next = "";

var admin_Progress = "";
var admin_ProgressWidth = 775;

var admin_MinTimeWaitAlert = "";
var admin_DropDownAlert = "";

var admin_UseScorm = false;
var admin_HostedOniLMS = false;

var FirstLoad = true;
var FirstHomeCall = true;

var SuspendData = "";

var admin_QuizPassingPercentage = 50;
var admin_QuizRetakeTillPass = true;
var admin_QuizRetakeMaxCount = 999;
var admin_QuizRetakeCounter = [];

var CourseStartTime = new Date();
var CourseTotalSeconds = 0;

var admin_TimerText = "Time: ";
var admin_ShowTimer = false;
var admin_MinTime = 0;
var admin_MinTimeMessage = "";


//------------------------------------------------------------------------------------------------------------------
var isDown = false;   // Tracks status of mouse button

var isPageComboOpen = false;
var isGlossaryOpen = false;
var isHelpOpen = false;

var ProgressPrecentage = 0;
var isProgressVisisble = false;
var ProgressTimer = null;
var ProgressShowTimer = null;

var isVolumeVisible = false;
var VolumeTimer = null;
var VolumeMute = false;
var VolumeSliderMouseDown = false;
var VolumeMouseMin = 15;
var VolumeMouseMax = 140;
var VolumeYOffset = -10;
var VolumeValue = 75;
var VolumerelativePosition = { left: 0, top : VolumeMouseMin};

var CourseXML;
var selectedModuleID = 1;
var selectedPageID = 2;
var PageCount = 1;
var CurrentPageNumber = 1;
var CurrentTemplateID = 1;

var GlossaryXML;

var HelpHTML;

var DialogIsVisible = true;

var PageRowDivID = "C2";
var GlossarySelectID = "Glossary_1";

var XDiff = 0;
var YDiff = 0;

var TemplateArray = [];
var TemplateArrayHasVideo = [];
var TemplateVideoWidth = [];
var TemplateVideoHeight = [];
var TemplateCSS;

var ModulePageArray = [];
var ModulePageArrayType = [];
var ModulePageMinTimeArray = [];
var ModulePageViewableArray = [];
var ModulePageImageArray = [];

var MaxModulePage = 0;
var GlossaryTerms = [];
var CourseName = "";

var PageTextArray = [];
var PageTextArrayTime = [];
var PageTextArrayTarget = [];
var PageTextArrayInsert = [];
var PageTextArraySkipClick = [];
var PageTextArrayImage = [];
var MaxPageTextCount = 0;
var CurrentTextFrame = 1;

var QuizMode = false;
var SlideMode = false;
var PolicyMode = false;
var FlatQuizMode = false;
var PopupMode = false;
var FinalExamMode = false;
var FlashMode = false;
var PreExamExamMode = false;
var SurveyMode = false;

var FirstTimeLoad = true;

var ScormTotalTime = 0;
var ScormTotalHours = 0;
var ScormTotalMinutes = 0;
var ScormTotalSeconds = 0;
var startingTime = false;


var HelpText;
var GlossaryText;
var ChapterText;

var TextGoBackwards=0;
var xke = "";
var homecode = "";

var FlashFrameInterval = 1;
var admin_ForwardBlink = false;

var VideoPopopStyle = "quiz";

var admin_L_URL = "";
var KeyCode = "";
var XCode = "1111";
var XCode2 = "1111";
var XCode3 = "1111";


var admin_FinalExamFile="";
var FinalXML = "";
var FinalExamMaxQuestions = 0;
var FinalExamCurrentActiveQuestion = 0;
var FinalExamCurrentGroupMaxQuestions = 0;

var SuspendDataArray =[];

var FinalExamQArray = [];
var FinalExamGroupMaxQuestions = [];
var FinalExamGroupMaxQuestionsByOrder = [];
var CurrentQuestionGroup = "";
var VirtualQuestionGroupCounter = 0;

var admin_FinalExamPostQuestionsScorm = true;

var FirstExamPage = true;

var admin_PreExamFile="";
var PreExamXML = "";
var PreExamCurrentActiveQuestion = 0;
var PreExamQArray = [];
var PreExamMaxQuestions =0;

var admin_SurveyFile="";
var SurveyXML = "";
var SurveyCurrentActiveQuestion = 0;
var SurveyQArray = [];
var SurveyMaxQuestions =0;

// AICC Variables
var admin_UseAicc = false;
var admin_AiccUrl = "";
var admin_AiccSid = "";
// END

var TextModeLinkClick = 0;

var GamificationUserScore = 0;
var GamificationComputerScore = 0;
var GamificationScoreArray = [];
var GamificationQuestionUserScore = 0;
var GamificationQuestionComputerScore = 0;
var GamifcationContinueOnFirstChoice = false;
var GamificationShowInGameScore = false;
var GamificationLastQuestion = false;
var GamificationSuspendData = "";
var GamificationPassingPoints = 0;

var TextModeForwardNextSlide = false;

//------------------------------------------------------------------------------------------------------------------
function GamificationStringReplace(xString)
{
	xString = xString.replace("%%GamificationUserScore",GamificationUserScore);
	xString = xString.replace("%%GamificationComputerScore",GamificationComputerScore);


	xStartPos = xString.indexOf("%%GamificationUserWinning");
	xString = xString.replace("%%GamificationUserWinning","");

	xEndPos = xString.indexOf("%%GamificationUserLosing");
	xString = xString.replace("%%GamificationUserLosing","");

	xEndPos2 = xString.indexOf("%%");
	xString = xString.replace("%%","");

	if (xStartPos!=-1)
	{
		if (GamificationUserScore>=GamificationComputerScore)
		{
			xString = xString.replace(xString.substring(xEndPos, xEndPos2), "");
		} else
		{
			xString = xString.replace(xString.substring(xStartPos, xEndPos), "");
		}
	}
	return xString;
}

//------------------------------------------------------------------------------------------------------------------
function CloseGamificationInGameDialog()
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
function CloseGamificationFinalDialog(LostGame)
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
	
	if (LostGame)
	{
		if (!admin_QuizRetakeTillPass)
		{
			//call exit function
			if (admin_UseAicc) { CloseCourse_AICC(true); } else { CloseCourse(true); }
		} else
		{
			GamificationUserScore = 0;
			GamificationComputerScore = 0;
			GamificationScoreArray = [];
			GamificationQuestionUserScore = 0;
			GamificationQuestionComputerScore = 0;
			GamificationShowInGameScore = false;
			GamificationLastQuestion = false;
			
			PreExamAnswerCache = [];
			PreExamAnswerTextCache = [];
			PreExamAnswerRightCache = [];

			PreExamScormQuestionCache = [];
			PreExamScormAnswersCache = [];
			PreExamScormUserAnswerCache = [];
			PreExamScormCorrectAnswerCache = [];
			
			selectedPageID=1;
			LoadPage(selectedPageID,0,0,1);
		}
	} else
	{
		if (admin_UseAicc) { SetLessonPassed_AICC(100,true);  } else { SetLessonPassed(100,true);  }
		
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
}

//------------------------------------------------------------------------------------------------------------------
function GamificationDialog(LastQuestion)
{
	var GamificationIsLost = false;
	if (LastQuestion)
	{
		if ( ((GamificationUserScore<GamificationComputerScore) && (GamificationPassingPoints==0)) || (GamificationUserScore<GamificationPassingPoints) )
		{
			GamificationIsLost=true;
			$("#FreeFormDialogCloseButton").off('click');
			$("#FreeFormDialogDiv").css({"top": $(CourseXML).find("GamificationLost").attr("Top") + "px" , "left": $(CourseXML).find("GamificationLost").attr("Left")  +"px" });
			$("#FreeFormDialogDiv").html( GamificationStringReplace ( $(CourseXML).find("GamificationLost").text() ) );
			$("#FreeFormDialogCloseButton").attr('tabindex', "10");

			GamficationBoxAudio = $(CourseXML).find("GamificationLost").attr("AudioFile");

			if (GamficationBoxAudio!="")
			{
				if (CourseMode=="Video") {
					$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: GamficationBoxAudio });
					$("#jquery_jplayer_1").jPlayer("play");
					isPlay = 1;
					$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
					$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
				}
			}
		} else
		{
			$("#FreeFormDialogCloseButton").off('click');
			$("#FreeFormDialogDiv").css({"top": $(CourseXML).find("GamificationWon").attr("Top") + "px" , "left": $(CourseXML).find("GamificationWon").attr("Left")  +"px" });
			$("#FreeFormDialogDiv").html( GamificationStringReplace ( $(CourseXML).find("GamificationWon").text() ) );
			$("#FreeFormDialogCloseButton").attr('tabindex', "10");

			GamficationBoxAudio = $(CourseXML).find("GamificationWon").attr("AudioFile");

			if (GamficationBoxAudio!="")
			{
				if (CourseMode=="Video") {
					$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: GamficationBoxAudio });
					$("#jquery_jplayer_1").jPlayer("play");
					isPlay = 1;
					$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
					$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
				}
			}
		}

		$("#FadeOutBackgroundDiv").css({"top" :"5px" , "left" : "5px" , "width": ($("#skin-container").width()-10) + "px" , "height": ($("#skin-container").height()-15) +"px", "border-radius":"5px"});

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
				CloseGamificationFinalDialog(GamificationIsLost);
				return false;
			});
		});
	} else
	{
		if (GamificationUserScore<GamificationComputerScore)
		{
			$("#FreeFormDialogCloseButton").off('click');
			$("#FreeFormDialogDiv").css({"top": $(CourseXML).find("GamificationLoosing").attr("Top") + "px" , "left": $(CourseXML).find("GamificationLoosing").attr("Left")  +"px" });
			$("#FreeFormDialogDiv").html( GamificationStringReplace ( $(CourseXML).find("GamificationLoosing").text() ) );
			$("#FreeFormDialogCloseButton").attr('tabindex', "10");

			GamficationBoxAudio = $(CourseXML).find("GamificationLoosing").attr("AudioFile");

			if (GamficationBoxAudio!="")
			{
				if (CourseMode=="Video") {
					$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: GamficationBoxAudio });
					$("#jquery_jplayer_1").jPlayer("play");
					isPlay = 1;
					$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
					$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
				}
			}
		} else
		{
			$("#FreeFormDialogCloseButton").off('click');
			$("#FreeFormDialogDiv").css({"top": $(CourseXML).find("GamificationWinning").attr("Top") + "px" , "left": $(CourseXML).find("GamificationWinning").attr("Left")  +"px" });
			$("#FreeFormDialogDiv").html( GamificationStringReplace ( $(CourseXML).find("GamificationWinning").text() ) );
			$("#FreeFormDialogCloseButton").attr('tabindex', "10");

			GamficationBoxAudio = $(CourseXML).find("GamificationWinning").attr("AudioFile");

			if (GamficationBoxAudio!="")
			{
				if (CourseMode=="Video") {
					$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: GamficationBoxAudio });
					$("#jquery_jplayer_1").jPlayer("play");
					isPlay = 1;
					$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
					$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
				}
			}
		}

		$("#FadeOutBackgroundDiv").css({"top" :"5px" , "left" : "5px" , "width": ($("#skin-container").width()-10) + "px" , "height": ($("#skin-container").height()-15) +"px", "border-radius":"5px"});

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
				CloseGamificationInGameDialog();
				return false;
			});
		});
	}
}

//------------------------------------------------------------------------------------------------------------------
function NewDialog(Top,Left,Width,Height,BgAudioFile,NewDialogTitle,NewDialogContent,ExternalContent)
{

	var ContentMargin = 20;
	if (ExternalContent) { ContentMargin = 0; }
	if (SurveyMode)
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseFinalFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseFinalDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseFinalDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseFinalDialogContent");
	} else
	if (PreExamMode)
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseFinalFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseFinalDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseFinalDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseFinalDialogContent");
	} else
	if (FinalExamMode)
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseFinalFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseFinalDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseFinalDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseFinalDialogContent");
	} else
	if (FlashMode)
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseFlashFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseFlashDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseFlashDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseFlashDialogContent");
	} else
	if (PolicyMode)
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CoursePolicyFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CoursePolicyDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CoursePolicyDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CoursePolicyDialogContent");
	} else
 	if (FlatQuizMode) //also is for interactive quiz
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseFlatFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseFlatDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseFlatDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseFlatDialogContent");
	} else
	if (QuizMode)
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseQuizFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseQuizDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseQuizDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseQuizDialogContent");
	} else
	if (SlideMode)
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseSlideFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseSlideDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseSlideDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseSlideDialogContent");
	} else
	if ( (!QuizMode) && (!SlideMode) && (!PolicyMode) && (!FlatQuizMode) && (!FinalExamMode) && (!PreExamMode) && (!SurveyMode) && (!FlashMode)) //video mode
	{
		if (VideoPopopStyle=="quiz")
		{
			$("#FadeOutBackgroundDiv").removeClass().addClass("CourseVideoQuizFadeOutBackground");
			$("#CourseDialogContainerDiv").removeClass().addClass("CourseVideoQuizDialogContainer");
			$("#CourseDialogHeaderDiv").removeClass().addClass("CourseVideoQuizDialogHeader");
			$("#CourseDialogContentDiv").removeClass().addClass("CourseVideoQuizDialogContent");
		} else
		if (VideoPopopStyle=="content")
		{
			$("#FadeOutBackgroundDiv").removeClass().addClass("CourseVideoContentFadeOutBackground");
			$("#CourseDialogContainerDiv").removeClass().addClass("CourseVideoContentDialogContainer");
			$("#CourseDialogHeaderDiv").removeClass().addClass("CourseVideoContentDialogHeader");
			$("#CourseDialogContentDiv").removeClass().addClass("CourseVideoContentDialogContent");
		}
	} else
	{ //default classes
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseDefaultFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseDefaultDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseDefaultDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseDefaultDialogContent");
	}

	$("#CourseDialogContentDiv").css({"padding":""});
	if (ExternalContent) { $("#CourseDialogContentDiv").css({"padding":"0px"}); }



	if (NewDialogTitle=="") {$("#CourseDialogHeaderDiv").hide(); ContentMargin = 0; } else {$("#CourseDialogHeaderDiv").show();}

	$("#CourseDialogContainerDiv").css({"top": Top + "px" , "left": Left +"px" ,"width":Width+"px","height":Height+"px"});
	$("#CourseDialogContentDiv").css({"width": ($("#CourseDialogContainerDiv").width()-ContentMargin) });

	$("#FadeOutBackgroundDiv").css({"top" :"5px" , "left" : "5px" , "width": ($("#skin-container").width()-10) + "px" , "height": ($("#skin-container").height()-15) +"px", "border-radius":"5px"});

	$("#CourseDialogContentDiv").html("");
	$("#CourseDialogHeaderDiv").html(NewDialogTitle);
	if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
	{
		$("#FadeOutBackgroundDiv").show();
		$("#CourseDialogContainerDiv").show();
	}
	else
	{
		$("#FadeOutBackgroundDiv").fadeIn(DialogFadeSpeed);
		$("#CourseDialogContainerDiv").fadeIn(DialogFadeSpeed);
	}

	$.doTimeout( '', 50, function(){
		$("#CourseDialogContentDiv").css({"height": ( $("#CourseDialogContainerDiv").innerHeight() - $("#CourseDialogHeaderDiv").outerHeight() - ContentMargin) });
		$("#CourseDialogContentDiv").html(NewDialogContent);
	});


}

//------------------------------------------------------------------------------------------------------------------
function NewDialogClose()
{
	if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
	{
		$("#FadeOutBackgroundDiv").hide();
		$("#CourseDialogContainerDiv").hide();
	} else
	{
		$("#FadeOutBackgroundDiv").fadeOut(DialogFadeSpeed);
		$("#CourseDialogContainerDiv").fadeOut(DialogFadeSpeed);
	}
}


//------------------------------------------------------------------------------------------------------------------
function FwdBlink(time, interval){
	if (admin_ForwardBlink)
	{
		FwdButtonBlinkTimer = window.setInterval(function(){
			$("#forward-button").removeClass("forward-button-style").addClass("forward-button-blink-style");
			window.setTimeout(function(){
				$("#forward-button").removeClass("forward-button-blink-style").addClass("forward-button-style");
			}, 500);
		}, interval);

		var fwdtimerblink = window.setTimeout(function(){
			clearInterval(FwdButtonBlinkTimer);
			window.setTimeout(function(){
				$("#forward-button").removeClass("forward-button-style").addClass("forward-button-blink-style");
			}, 500);
		}, time);
	}
}

//------------------------------------------------------------------------------------------------------------------
function parseVersionXml(xml)
{
	admin_Version = $(xml).find("Version").text();
	xke = $(xml).find("VersionText").text();
	homecode = $(xml).find("HomeCode").text();
	if (typeof homecode =="undefined") { homecode=""; };
	$("#version-text").html( admin_Version );

	KeyCode = $(xml).find("KeyCode").text();

	LoadSettingsXML();
}

//------------------------------------------------------------------------------------------------------------------
function parseSettingsXml(xml)
{
	loadCourseCssFile($(xml).find("CourseCSSFile").text());
	loadCourseCssFile("skins/"+$(xml).find( "SkinCSSFile").text()+"/"+$(xml).find( "SkinCSSFile").text()+".css" );

	if ((parseInt($.browser.version, 10) === 11) || ($.browser.msie  && parseInt($.browser.version, 10) === 8))
	{
		//ignore skinning if it is MSIEE 11
	} else
	{
		loadCourseCssFile("skins/"+$(xml).find( "SkinCSSFile").text()+"/_styles.css?q=470" );

		if (($.browser.msie  && parseInt($.browser.version, 10) === 8))// || (parseInt($.browser.version, 10) === 11))
		{
			loadCourseCssFile("skins/"+$(xml).find( "SkinCSSFile").text()+"/_styles-ie8.css?q=470" );
		} else
		{
			loadCourseCssFile("skins/"+$(xml).find( "SkinCSSFile").text()+"/_styles.css?q=470" );
		}
	}

	update_buttons_SkinPath("skins/"+$(xml).find( "SkinCSSFile").text()+"/");
	$("#ajax-loading-graph").attr("src","skins/"+$(xml).find( "SkinCSSFile").text()+"/ajax-loader.gif");

	//read the progressbar width with delay to make sure css has loaded
	$.doTimeout( '', 500, function(){
		var $tempwidth_p = $("<p id=\"tempwidth\" class=\"skin_progressbar_width\"></p>").hide().appendTo("body");
//		alert(parseInt( $tempwidth_p.css("width"), 10));
		if (parseInt( $tempwidth_p.css("width"), 10)>100)
		{
			admin_ProgressWidth = parseInt( $tempwidth_p.css("width"), 10);
			$("#video-progress-bar").width(Math.round((admin_ProgressWidth+5))+"px" );
		}
		$tempwidth_p.remove();
	});

	admin_L_URL = $(xml).find("LicenseURL").text();

	//Read AICC Variables
	admin_UseAicc = $(xml).find("UseAICC").text().toLowerCase() === 'true';
	if(admin_UseAicc){
		admin_AiccUrl = getParameterByName('AICC_URL');
		admin_AiccSid = getParameterByName('AICC_SID');
		if(admin_AiccUrl == "" && admin_AiccSid == ""){
			alert("AICC HACP communication parameters are missing. Please contact administrator.");
		}
	}
	//End

		if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
		if (DialogIsVisible) { 
			window.location.href=admin_L_URL;  
			return false; 
		} 
	}

	admin_URLOnExit = $(xml).find("URLOnExit").text();

	admin_CopyrightInfo = $(xml).find("CopyrightInfo").text();
	$("#copyright-text").html( admin_CopyrightInfo );

	admin_AutoForwardDefaultSetting = $(xml).find("AutoForwardDefaultSetting").text().toLowerCase() === 'true';
	admin_AutoForwardEnabled = $(xml).find("AutoForwardEnabled").text().toLowerCase() === 'true';
	admin_ForwardBlink = $(xml).find("ForwardBlink").text().toLowerCase() === 'true';
	admin_ForwardBlink = false; //disable blinking in textmode

	admin_UseScorm = $(xml).find("UseScorm").text().toLowerCase() === 'true';
	admin_HostedOniLMS = $(xml).find("HostedOniLMS").text().toLowerCase() === 'true';

	admin_DisableVolume = $(xml).find("DisableVolume").text().toLowerCase() === 'true';
	admin_DisableVolume = true;

	admin_BottomLogo = $(xml).find("BottomLogo").text();
	admin_TopLogo = $(xml).find("TopLogo").text();

	admin_HelpFile = $(xml).find("HelpFile").text();
	admin_GlossaryFile = $(xml).find("GlossaryFile").text();
	admin_CourseFile = $(xml).find("CourseFile").text();

	admin_RetakeFinalExam = $(xml).find("RetakeFinalExam").text();
	
	admin_Submit = $(xml).find("Submit").text();
	admin_Finish = $(xml).find("Finish").text();
	admin_Help = $(xml).find("Help").text();
	admin_Glossary = $(xml).find("Glossary").text();
	admin_SaveAndExit = $(xml).find("SaveAndExit").text();


	admin_Review = $(xml).find("Review").text();

	//if review has not already been set by scorm get it from adminsettings.xml
	if (!admin_ReviewMode) {admin_ReviewMode = $(xml).find("ReviewMode").text().toLowerCase()==='true';}

	admin_Volume = $(xml).find("Volume").text();
	admin_Mute = $(xml).find("Mute").text();
	admin_UnMute = $(xml).find("UnMute").text();

	admin_Prev = $(xml).find("Prev").text();

	admin_Next = $(xml).find("Next").text();

	admin_Progress = $(xml).find("Progress").text();

	admin_MinTimeWaitAlert = $(xml).find("MinTimeWaitAlert").text();
	admin_DropDownAlert = $(xml).find("DropDownAlert").text();
	admin_FlatQuizAlert = $(xml).find("FlatQuizAlert").text();

	admin_ShowTimer = $(xml).find("ShowTimer").text().toLowerCase()==='true';
	admin_MinTime = $(xml).find("MinTime").text();
	admin_MinTime = parseInt(admin_MinTime,10);
	admin_MinTimeMessage = $(xml).find("MinTimeMessage").text();
	admin_TimerText = $(xml).find("TimerText").text();
	
	admin_FinalExamPostQuestionsScorm = $(xml).find("FinalExamPostQuestionsScorm").text().toLowerCase() === 'true';

	LoadCourseXML();
	LoadGlossary();

	$("#custom-logo").css( { backgroundImage : 'url('+admin_TopLogo+')', backgroundRepeat: 'no-repeat' } );
	$("#product-logo").css( { backgroundImage : 'url('+admin_BottomLogo+')', backgroundRepeat: 'no-repeat' } );

	$("#glossary-select-title-text").html( admin_Glossary );
	$("#help-window-title-text").html( admin_Help );

	$("#help-button").attr('alt',admin_Help );	$("#help-button").attr('title',admin_Help );
	$("#glossary-button").attr('alt',admin_Glossary );	$("#glossary-button").attr('title',admin_Glossary );
	$("#exit-button").attr('alt',admin_SaveAndExit );	$("#exit-button").attr('title',admin_SaveAndExit );

	$("#volume-button").attr('alt',admin_Volume);	$("#volume-button").attr('title',admin_Volume);
	$("#volume-popup-mute").attr('alt',admin_Mute);	$("#volume-popup-mute").attr('title',admin_Mute);

	$("#forward-button").attr('alt',admin_Next);	$("#forward-button").attr('title',admin_Next);
	$("#backward-button").attr('alt',admin_Prev);	$("#backward-button").attr('title',admin_Prev);

	$("#replay-button").removeClass("replay-button-style").addClass("replay-button-disabled-style");
	$("#play-button").removeClass("play-button-style").addClass("play-button-disabled-style");

	//disable auto forward
	$("#autoforward-button").removeClass("autoforward-button-style").addClass("autoforward-button-disabled-style");

	$("#mode-button").removeClass("mode-button-style").addClass("mode-button-style-offline");
	$("#volume-button").removeClass("volume-button-style").addClass("volume-button-disabled-style");

	$("#help-window-description").load(admin_HelpFile);


	$.get(admin_HelpFile, function(data){	HelpText= data;	});


	//disable volume control if ipad or android
	if (isiPad) { admin_DisableVolume = true; }
	if (isAndroid) { admin_DisableVolume = true; }

}


//------------------------------------------------------------------------------------------------------------------
function SaveSettingsXML(xml)
{
	SettingsXML = xml;
	parseSettingsXml(SettingsXML);
}

//------------------------------------------------------------------------------------------------------------------
function LoadSettingsXML()
{
	$.ajax({
		type: "GET",
		url: "xmls/"+CourseLanguage+"/adminsettings.xml?q=430&time="+Math.round(+new Date()/1000),
		dataType: "xml",
		success: SaveSettingsXML
	});
}

//------------------------------------------------------------------------------------------------------------------
function SaveVersionXML(xml)
{
	VersionXML = xml;
	parseVersionXml(VersionXML);
}

//------------------------------------------------------------------------------------------------------------------
function LoadVersionXML()
{
	$.ajax({
		type: "GET",
		url: "js/data.xml?q=430&time="+Math.round(+new Date()/1000),
		dataType: "xml",
		success: SaveVersionXML
	});
}

//------------------------------------------------------------------------------------------------------------------
function resizeControls()
{
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();

	UpdateProgressBar();

	var NewTop = ((windowHeight/2) - ($("#skin-container").height() / 2));
	if (NewTop<5) { NewTop = 5;}
	$("#page").css( { "margin-top":NewTop +"px" } );

	var NewLeft = ((windowWidth/2) - ($("#skin-container").width() / 2));
	if (NewLeft<5) { NewLeft = 5;}
	$("#page").css( { "margin-left":NewLeft +"px" } );
	$("#page").show();
}

//------------------------------------------------------------------------------------------------------------------
function UpdateProgressBar()
{
	ProgressPrecentage = Math.round( (CurrentPageNumber / PageCount ) * 100 );
	if ( typeof ModulePageArray[selectedPageID] !== 'undefined' )
	{
		PageToolTip = admin_Progress;
		PageToolTip = PageToolTip.replace("%%PageNo",CurrentPageNumber);
		PageToolTip = PageToolTip.replace("%%TotalPages",PageCount);
		PageToolTip = PageToolTip.replace("%%PageName",ModulePageArray[selectedPageID].slice(1));

		$("#tooltip-text").html( "<nobr>" + PageToolTip + "</nobr>" ); //Page " + CurrentPageNumber + " out of " + PageCount + " - " +ModulePageArray[selectedPageID].slice(1) + "
	} else
	{
		$("#tooltip-text").html("IEngine");
	}


	$("#progress-bar-circle").css( { "left":Math.round((admin_ProgressWidth * ProgressPrecentage / 100)-9 )+"px" } );
	$("#progress-bar-middle").width(Math.round(admin_ProgressWidth * ProgressPrecentage / 100)+"px");

	var tooltip_left = $("#progress-bar").position().left + Math.round((admin_ProgressWidth * ProgressPrecentage / 100)-5 );
	var tooltip_width = $("#tooltip").width();
	var tooltip_half_width = Math.round($("#tooltip").width() / 2);
	var bubble_width = Math.round($("#tooltip-bubble").width() / 2);

	var bubble_position = tooltip_half_width-bubble_width;

	var tooltip_left_pos = tooltip_left-tooltip_half_width+bubble_width-4;

	if (tooltip_left_pos<10) {
		$("#tooltip-bubble").show();
		bubble_position = bubble_position + tooltip_left_pos - 10;
		if (ProgressPrecentage<4) { $("#tooltip-bubble").hide(); } else { $("#tooltip-bubble").show(); }
		tooltip_left_pos = 10;
	} else

	if ( (tooltip_left_pos+tooltip_width) > (admin_ProgressWidth) ) {
		bubble_position = bubble_position + (tooltip_left_pos+tooltip_width-(admin_ProgressWidth+17));
		tooltip_left_pos = (admin_ProgressWidth+17)-tooltip_width;

		if (ProgressPrecentage>90) { $("#tooltip-bubble").hide(); } else { $("#tooltip-bubble").show(); }
	} else
	{
		$("#tooltip-bubble").show();
	}

	//console.log(tooltip_left_pos);

	$("#tooltip").css( { "left":( tooltip_left_pos )+"px" } );
	$("#tooltip-bubble").css( { "left": bubble_position+"px" } );
	$("#tooltip").css( { "top": ($("#progress-bar").position().top-60)+"px" } );
}

//------------------------------------------------------------------------------------------------------------------
function HideProgress()
{
	//console.log("hide progress");
	isProgressVisisble = false;
	$("#tooltip").fadeOut('slow');
	$("#progress-bar-circle").fadeOut('slow');
}

//------------------------------------------------------------------------------------------------------------------
function ShowProgress()
{
	if (isProgressVisisble==false)
	{
		//console.log("show progress");
		isProgressVisisble = true;
		$("#progress-bar-circle").css('visibility','visible').fadeIn('fast');
		$("#tooltip").css('visibility','visible').fadeIn('fast');
	}
	//console.log("clear timeout");
	clearTimeout(ProgressTimer);
}

//------------------------------------------------------------------------------------------------------------------
function ShowVolume()
{
	if (!admin_DisableVolume)
	{
		if ((isVolumeVisible==false)) // && (VolumeMute==0))
		{
			isVolumeVisible = true;
			$("#volume-box").css('visibility','visible').show('slide', { direction: 'down' }, 350); //.fadeIn('fast');
			$("#volume-button").addClass("volume-button-style-hover");
		}
		clearTimeout(VolumeTimer);
	}
}


//------------------------------------------------------------------------------------------------------------------
function CloseQuizDialogs()
{
	NewDialogClose();
}


//------------------------------------------------------------------------------------------------------------------
function ForwardClick()
{
	if ( $("#forward-button").hasClass("forward-button-style-offline") ) {

		if ((FlatQuizMode) || (QuizMode) || (FinalExamMode) || (PreExamMode) || (SurveyMode))
		{
			alert(admin_FlatQuizAlert);
		}
		return false;
	}

	if ((QuizMode)  && (!admin_ReviewMode)) { return false; }

	if (FinalExamMode) {
//		console.log(VirtualQuestionGroupCounter+"<"+FinalExamGroupMaxQuestions[ CurrentQuestionGroup ]);
		if (VirtualQuestionGroupCounter<FinalExamGroupMaxQuestions[ CurrentQuestionGroup ])
		{
			if (!admin_ReviewMode)
			{
				$("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
				$("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
			}

			VirtualQuestionGroupCounter++;
			FinalExamCurrentActiveQuestion++;
			DrawFinalExamQuiz(FinalExamCurrentActiveQuestion);
			return false;
		} else
		{
			//unlock next page if exam is over
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
	}
	
	if (PreExamMode) {
		if (PreExamCurrentActiveQuestion<PreExamMaxQuestions)
		{
			if (!admin_ReviewMode)
			{
				$("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
				$("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
			}

			PreExamCurrentActiveQuestion++;
			DrawPreExamQuiz(PreExamCurrentActiveQuestion);
			return false;
		} else
		{
			//unlock next page if exam is over
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
	}
	
	if (SurveyMode) {
		if (SurveyCurrentActiveQuestion<SurveyMaxQuestions)
		{
			if (!admin_ReviewMode)
			{
				$("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
				$("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
			}

			SurveyCurrentActiveQuestion++;
			DrawSurveyQuiz(SurveyCurrentActiveQuestion);
			return false;
		} else
		{
			//unlock next page if exam is over
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
	}

	if ((ModulePageViewableArray[selectedPageID+1]==0) && (!admin_ReviewMode) && (FlatQuizMode) )
	{
		alert(admin_FlatQuizAlert);
	} else
	{
		CloseQuizDialogs();
//		console.log(FlashMode+" "+FlashFinished+" "+TextModeForwardNextSlide+" "+FlashTime);
		if ((FlashMode) && (!FlashFinished) && (!TextModeForwardNextSlide))
		{
			TextGoBackwards = 0;
			if (FlashMode) {
				FlashXMLCodePause = false;
				if (tid==null) { tid = setInterval(FlashFrame, FlashFrameInterval); }
			}
		} else
		if ((CurrentTextFrame<MaxPageTextCount) && (!PolicyMode) && (!SlideMode) && (!FlatQuizMode) && (!FlashMode) )
		{
			CurrentTextFrame++;
			UpdateTextArea(1,0);
			$("#backward-button").removeClass("backward-button-style-offline").addClass("backward-button-style");
		} else
		{
			selectedPageID++;
			if (selectedPageID<=MaxModulePage)
			{
				ModulePageViewableArray[selectedPageID] = 1;
				$("#chapterdialog #C"+(selectedPageID)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

				if (ModulePageArray[selectedPageID].charAt(0)=="M") //if next row is module then activate the one bellow too
				{
					ModulePageViewableArray[selectedPageID+1] = 1;
					$("#chapterdialog #C"+(selectedPageID+1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
				}
			}
			FlashAbortTimer();
			FlashTime=-1;
			FlashFinished = true;

			TextGoBackwards = 0;
			LoadPage(selectedPageID,0,0);
		}
	}
}

//------------------------------------------------------------------------------------------------------------------
function BackwardsClick()
{
	if ( $("#backward-button").hasClass("backward-button-style-offline") ) { return false; }
	if ((QuizMode)  && (!admin_ReviewMode)) { return false; }
	if ( (FinalExamMode) && (!admin_ReviewMode)) { return false; }
	if ( (PreExamMode) && (!admin_ReviewMode)) { return false; }
	if ( (SurveyMode) && (!admin_ReviewMode)) { return false; }

	CloseQuizDialogs();

	if ((CurrentTextFrame>1) && (!PolicyMode) && (!SlideMode) && (!FlatQuizMode) && (!FlashMode))
	{
		//v4.8.11 ---- disable going back frames instead jump to begining of page
		//CurrentTextFrame--;
		//if (PageTextArrayInsert[CurrentTextFrame]=="fadeout") { CurrentTextFrame--; }
		//UpdateTextArea(1,1);
		
		CurrentTextFrame = 1;
		LoadPage(selectedPageID,0,1);
		
	} else
	{
		if (selectedPageID>2)
		{
			selectedPageID--;
			if (ModulePageArray[selectedPageID].charAt(0)=="M") {selectedPageID--;}

			FlashAbortTimer();
			FlashTime=-1;
			FlashFinished = true;

			LoadPage(selectedPageID,0,1);
			CurrentTextFrame=1;//MaxPageTextCount;
			UpdateTextArea(1,1);
		} else
		{
			$("#backward-button").addClass("backward-button-style-offline").removeClass("backward-button-style");
		}

	}
}

//------------------------------------------------------------------------------------------------------------------
function ChapterComboClick()
{
	if ((QuizMode)  && (!admin_ReviewMode)) { return false; }

	$( "#chapterdialog" ).dialog({
		modal: true,
		resizable:false,
		closeOnEscape: true,
		position:[ delPX( $("#page").css("margin-left") ) + 100 , delPX( $("#page").css("margin-top") ) + 50 ],
		width: 650,
		height: 500,
		show: { effect: 'fade', duration:DialogFadeSpeed },
		hide: { effect: 'fade', duration:DialogFadeSpeed }
	});

	$.doTimeout( '', 50, function(){ 
		$("#chapterdialog").scrollTop($("#chapterdialog").scrollTop() + $(".page-select-text-line-style-active").position().top - ( $("#chapterdialog").height()/2 + $(".page-select-text-line-style-active").height()/2) );
	}); 
	
}

//------------------------------------------------------------------------------------------------------------------
function GlossaryClick()
{
	if ((QuizMode)  && (!admin_ReviewMode)) { return false; }

	$("#glossarydialog").remove();

	$("#template-place").append("<div id='glossarydialog' title='"+admin_Glossary +"'>" + GlossaryText + "</div>");

	$( "#glossarydialog" ).dialog({
		modal: true,
		resizable:false,
		closeOnEscape: true,
		position:[ delPX( $("#page").css("margin-left") ) + 100 , delPX( $("#page").css("margin-top") ) + 50 ],
		width: 650,
		height: 500,
		show: { effect: 'fade', duration:DialogFadeSpeed },
		hide: { effect: 'fade', duration:DialogFadeSpeed }
	});
}

//------------------------------------------------------------------------------------------------------------------
function HelpClick()
{
	if ((QuizMode)  && (!admin_ReviewMode)) { return false; }

	$("#helpdialog").remove();

	$("#template-place").append("<div id='helpdialog' title='"+admin_Help+"'>" + HelpText + "</div>");

	$( "#helpdialog" ).dialog({
		modal: true,
		resizable:false,
		closeOnEscape: true,
		position:[ delPX( $("#page").css("margin-left") ) + 100 , delPX( $("#page").css("margin-top") ) + 50 ],
		width: 650,
		height: 500,
		show: { effect: 'fade', duration:DialogFadeSpeed },
		hide: { effect: 'fade', duration:DialogFadeSpeed }
	});
}

//------------------------------------------------------------------------------------------------------------------
function attachClickAction()
{
	$(".textlink").on('click', function()
	{
		VideoPopopStyle = "content";
		ShowStandardDialog($(this).data('dialog'));
		return false;
	});

	$(".maillink").on('click', function()
	{
		if ((CourseMode=="Video") && (!FlashMode)) {
			$("#jplayer_video").jPlayer("pause" );
			isPlay = 0;
			$("#play-button").addClass("play-button-style").removeClass("pause-button-style");
			$("#play-button").attr('alt',admin_Play);	$("#play-button").attr('title',admin_Play);
		}

		var link = 'mailto.html#mailto:' + $(this).data('mailto');
		window.open(link, 'Mailer');
		return false;
	});

}


//------------------------------------------------------------------------------------------------------------------
function UpdateTextArea(ForceUpdate,GoBackwards)
{

	TextGoBackwards = GoBackwards;

	$(".textlink").die('click');

	if ((ForceUpdate==1) && (!PolicyMode) && (!SlideMode) && (!FlatQuizMode))
	{
		if ( (CurrentTextFrame==1) || ( (GoBackwards==1) && (CurrentTextFrame==MaxPageTextCount) ) )
		{
			$("#"+PageTextArrayTarget[CurrentTextFrame]).html( PageTextArray[CurrentTextFrame] );
			$("#jplayer_video").html('<IMG SRC="' + PageTextArrayImage[CurrentTextFrame] +'" width='+TemplateVideoWidth[CurrentTemplateID]+' height='+TemplateVideoHeight[CurrentTemplateID]+'>'  );
		} else
		{
			if (PageTextArrayInsert[CurrentTextFrame]=="popupdialog")
			{
				VideoPopopStyle = "content";
				ShowStandardDialog(PageTextArrayTarget[CurrentTextFrame]);
			} else

			if (PageTextArrayInsert[CurrentTextFrame]=="quizdialog")
			{
				VideoPopopStyle = "quiz";
				ShowQuizDialog(PageTextArrayTarget[CurrentTextFrame]);
			} else

			if (PageTextArrayInsert[CurrentTextFrame]=="quizdialog_popupfeedback")
			{
				VideoPopopStyle = "quiz";
				ShowQuizDialog_v2(PageTextArrayTarget[CurrentTextFrame]);
			} else


			if ((PageTextArrayInsert[CurrentTextFrame]=="insert") )
			{
				$("#jplayer_video").html('<IMG SRC="' + PageTextArrayImage[CurrentTextFrame] +'" width='+TemplateVideoWidth[CurrentTemplateID]+' height='+TemplateVideoHeight[CurrentTemplateID]+'>'  );
				if (GoBackwards==1)
				{
					i3 = CurrentTextFrame;
					while ((i3>=1) && (!(PageTextArrayInsert[i3]=="overwrite")))
					{
						i3--;
					}

					textStr = "";
					for (i4=i3; i4<=CurrentTextFrame; i4++)
					{
						textStr += PageTextArray[i4];
					}

					$("#"+PageTextArrayTarget[CurrentTextFrame]).html(textStr);
					//if (PageTextArraySkipClick[CurrentTextFrame] == "yes")  { BackwardsClick(); }
				} else
				{
					$("#"+PageTextArrayTarget[CurrentTextFrame]).append( $(PageTextArray[CurrentTextFrame]).hide().fadeIn('fast') );
					if ((PageTextArraySkipClick[CurrentTextFrame] == "yes") && (!GoBackwards))  { ForwardClick(); }
				}
			} else
			if (PageTextArrayInsert[CurrentTextFrame]=="overwrite")
			{
				$("#jplayer_video").html('<IMG SRC="' + PageTextArrayImage[CurrentTextFrame] +'" width='+TemplateVideoWidth[CurrentTemplateID]+' height='+TemplateVideoHeight[CurrentTemplateID]+'>'  );
				$("#"+PageTextArrayTarget[CurrentTextFrame]).fadeOut('fast', function(){
					$("#"+PageTextArrayTarget[CurrentTextFrame]).html( PageTextArray[CurrentTextFrame] ).fadeIn('fast', function()
					{
						if ((PageTextArraySkipClick[CurrentTextFrame] == "yes") && (!GoBackwards))  { ForwardClick();  }
						//if ((PageTextArraySkipClick[CurrentTextFrame] == "yes") && (GoBackwards==1))  { BackwardsClick(); }
					});
				});
			} else

			if (PageTextArrayInsert[CurrentTextFrame]=="fadeout")
			{
				$("#"+PageTextArrayTarget[CurrentTextFrame]).fadeOut( 'fast' );
				if (!GoBackwards) { ForwardClick(); }
			} else
			
			if (PageTextArrayInsert[CurrentTextFrame]=="hide")
			{
				$("#"+PageTextArrayTarget[CurrentTextFrame]).hide();
			} else

			if (PageTextArrayInsert[CurrentTextFrame]=="show")
			{
				$("#jplayer_video").html('<IMG SRC="' + PageTextArrayImage[CurrentTextFrame] +'" width='+TemplateVideoWidth[CurrentTemplateID]+' height='+TemplateVideoHeight[CurrentTemplateID]+'>'  );
				$("#"+PageTextArrayTarget[CurrentTextFrame]).html( PageTextArray[CurrentTextFrame] ).show( function() {
						attachClickAction();
				});
				if ((PageTextArraySkipClick[CurrentTextFrame] == "yes") && (!GoBackwards))  { ForwardClick();  }
				
			}

			
		}
		$(".textlink").die('click');
		$(".textlink").live('click', function()
		{
			TextModeLinkClick = 1;
			VideoPopopStyle = "content";
			ShowStandardDialog($(this).data('dialog'));
			return false;
		}  );
	}

	if (admin_UseAicc) { UpdateBookmark_AICC( selectedModuleID, selectedPageID+"-"+CurrentTextFrame ); } else { UpdateBookmark( selectedModuleID, selectedPageID+"-"+CurrentTextFrame ); }

	if ((CurrentPageNumber<=1) && (CurrentTextFrame==1)) {
		$("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
	}

	if ((CurrentPageNumber>=PageCount) && (CurrentTextFrame==MaxPageTextCount))
	{
		$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
	}

}


//------------------------------------------------------------------------------------------------------------------
//pages in combobox have divID starting with C then rownumber
//module names also have row number increased and start with C
//LoadPage takes the ID and checks that the ModulePageArray
//the ModulePageArray contains names of Pages and Modules
//if it is a module then it has a M insert in front of it if it
//is a Page it has a L inserted in front of the name.
//So if the selected ID row in the Array starts with "M" it will
//select the next row which has to be a Page. And also highlight this next row.
//If the selected ID Row in the Array start with "L" then it will
//look backwards to find the modules name for the page but will highlight the selected row.

//This way calling LoadPage with ActivePageID + 1 will autoadvance and
//even if it is a module it will skip it properly.

//------------------------------------------------------------------------------------------------------------------
function LoadPage(PageID,PositionX,GoBackwards)
{
	if (PageID<1)	{ PageID = 1;	}
	if (PageID>MaxModulePage)	{
		PageID = MaxModulePage;
		$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
		return false;
	}

	//check if there is a minimum time requirment, if so show message when user tries to enter last page
	if ( (admin_MinTime>0) && (admin_ShowTimer) && (CourseTotalSeconds<(admin_MinTime*60)) && (PageID==MaxModulePage))
	{
		PageID = MaxModulePage-1;
		alert(admin_MinTimeMessage.replace("%%MinTime",admin_MinTime));
	}


	if (ModulePageViewableArray[PageID]==0) { PageID = PageID-1; }

	//remove previously selected row from combobox
	$("#"+PageRowDivID).removeClass("page-select-text-line-style-active");

	if (ModulePageArray[PageID].charAt(0)=="M") //goto first page of module show page and module
	{
		selectedModuleID = parseInt( PageID,10 );
		selectedPageID = selectedModuleID+1;
	} else
	if (ModulePageArray[PageID].charAt(0)=="L") //find name of module and open page
	{
		selectedModuleID = 1;
		selectedPageID = parseInt(PageID,10);
		j = selectedPageID;
		while ((ModulePageArray[j].charAt(0)!="M") && (j>1)) { j--; }
		selectedModuleID = j;
	}

	//skip the video intro page if it is second load
	if ( (ModulePageArrayType[selectedPageID]=="iPadOnly") && (isiPad) && (!isiPadFirstTimeLoad) )
	{
		selectedPageID++;
	}

	//use selectedPageID not pageID, as pageID might be on a module name in which case it is actually +1
	
	if ((ModulePageArrayType[selectedPageID]=="FinalExam") && (selectedPageID==MaxModulePage))
	{ 
		//if last page is final exam then do nothing as the final exam closing dialog will do the scorm postings and course complete posting
	} else
	{
		if ((selectedPageID==MaxModulePage) && (QuizMaxScore==0)) { //QuizMaxScore==0 is for courses that do not have final exam or quiz that posts to scorm
			if (admin_UseAicc) { SetLessonPassed_AICC(100,true);  } else { SetLessonPassed(100,true);  }
			if (admin_UseAicc) { SetScormCoursePassed_AICC();  } else { SetScormCoursePassed();  }
		} 
		else 
		if (selectedPageID==MaxModulePage) { //if course has quiz or final exam, and you get to the last page then send the scorm course passed function
			if (admin_UseAicc) { SetScormCoursePassed_AICC();  } else { SetScormCoursePassed();  }
		} //at last page call SetLessonPassed to make course passed
	}
	
	if ((LastBookmark!="") && (FirstLoad))
	{
		//console.log(LastBookmark);
		var LastBookmarks=LastBookmark.split("-");
		//console.log(LastBookmarks.length+" "+LastBookmarks[0]+" "+LastBookmarks[1]);

		if (admin_ReviewMode)
		{
			for (i=1;i<=MaxModulePage;i++ )
			{
				ModulePageViewableArray[i] = 1;
				$("#chapterdialog #C"+(i)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
			}

		}

		if (LastBookmarks.length==3)
		{
			for (i=1;i<=LastBookmarks[1];i++ )
			{
				ModulePageViewableArray[i] = 1;
				$("#chapterdialog #C"+(i)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
			}

			selectedModuleID = parseInt(LastBookmarks[0],10);
			selectedPageID = parseInt(LastBookmarks[1],10);
		}
		FirstLoad = false;
	}

	$("#module-name").html( ModulePageArray[selectedModuleID].slice(1) );
	$("#page-combo").html( ModulePageArray[selectedPageID].slice(1) );

	//add style to new row and save its ID
	PageRowDivID="C"+selectedPageID;
	$("#"+PageRowDivID).addClass("page-select-text-line-style-active");

	//find the pages real position skipping counting for the rows with module names to update the progressbar
	j = 0;
	k = 0;
	while ( j<selectedPageID ) {
		j++;
		if (ModulePageArray[j].charAt(0)=="L") { k++; }
	}
	CurrentPageNumber = k;

	$("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
	$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");

	$(CourseXML).find("Modules").each(function() {

		$(CourseXML).find("Module").each(function() {

			if ('M'+$(this).attr("Name") == ModulePageArray[selectedModuleID] )
			{
				$(this).find("Page").each(function() {

					if ('L'+$(this).attr("Name") == ModulePageArray[selectedPageID] )
					{

						if (admin_UseAicc) { UpdateBookmark_AICC( selectedModuleID, selectedPageID+"-1" ); } else { UpdateBookmark( selectedModuleID, selectedPageID+"-1" ); }


						if ((homecode!="") && (FirstHomeCall)) {
							FirstHomeCall = false;
							$.ajax({url:GibberishAES.dec( homecode , "IEngine")+"&cm=T&m="+selectedModuleID+"&p="+selectedPageID, dataType: 'jsonp',	success:function(json){	}, error:function(){ }	});
						}

						if (ModulePageArrayType[selectedPageID]=="Flash")
						{
							FlashMode = true;
							QuizMode = false;
							SlideMode = true;
							PolicyMode = false;
							FlatQuizMode = false;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = false;
							
							TextModeForwardNextSlide = $(this).attr("TextModeForwardNextSlide");
							if (typeof TextModeForwardNextSlide =="undefined") { TextModeForwardNextSlide=false } else
							{ TextModeForwardNextSlide = $(this).attr("TextModeForwardNextSlide").toLowerCase()==="true"; }


							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							GamificationShowInGameScore = $(this).attr("GamificationShowInGameScore");
							if (typeof GamificationShowInGameScore=="undefined") { GamificationShowInGameScore=false; } else { GamificationShowInGameScore=true; } ;

							GamificationLastQuestion = $(this).attr("GamificationLastQuestion");
							if (typeof GamificationLastQuestion=="undefined") { GamificationLastQuestion=false; } else { GamificationLastQuestion=true; } ;

							if ($(this).find("FlashForText").length>0) {  //no TextModeFlash defined use the video mode instead
								SetupFlash( $(this).find("FlashForText") );
							} else
							{
								SetupFlash( $(this).find("FlashForVideo") );
							}
						} else

						if (ModulePageArrayType[selectedPageID]=="FlatQuiz")
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = false;
							PolicyMode = false;
							FlatQuizMode = true;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = false;

							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							DrawFlatQuiz();

						} else
						if (ModulePageArrayType[selectedPageID]=="InteractiveQuiz")
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = false;
							PolicyMode = false;
							FlatQuizMode = true;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = false;

							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							DrawInteractiveQuiz();
						} else
						if (ModulePageArrayType[selectedPageID]=="FinalExam")
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = false;
							PolicyMode = false;
							FlatQuizMode = true;
							FinalExamMode = true;
							PreExamMode = false;
							SurveyMode = false;

							//increment the retry counter for current exam section
							if (typeof admin_QuizRetakeCounter[ $(this).attr("Group") ] !== 'undefined') { admin_QuizRetakeCounter[ $(this).attr("Group") ]++; } else { admin_QuizRetakeCounter[ $(this).attr("Group") ] = 1; }
							RebuildFinalExamArray();

						
							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							SetupFinalExam($(this).attr("Group"));
							
						} else
						if (ModulePageArrayType[selectedPageID]=="PreExam")
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = false;
							PolicyMode = false;
							FlatQuizMode = false;
							FinalExamMode = false;
							PreExamMode = true;
							SurveyMode = false;

							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							SetupPreExam();
						} else
						if (ModulePageArrayType[selectedPageID]=="Survey")
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = false;
							PolicyMode = false;
							FlatQuizMode = false;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = true;
							
							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							SetupSurvey();
						} else
						if (ModulePageArrayType[selectedPageID]=="Policy")
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = true;
							PolicyMode = true;
							FlatQuizMode = false;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = false;

							if (ModulePageViewableArray[selectedPageID+1]!=1)
							{
								$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
							}

							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							DrawPolicy();

						} else
						if (ModulePageArrayType[selectedPageID]=="Slide")
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = true;
							PolicyMode = false;
							FlatQuizMode = false;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = false;

							CurrentTextFrame=1;
							MaxPageTextCount=1;
							CurrentPosition=1;
							PositionX=1;

							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							DrawSlide();

						} else
						if (ModulePageArrayType[selectedPageID]=="Quiz")
						{

							if (!admin_ReviewMode)
							{
								$("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
								$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
							}

							$("#mode-button").removeClass("mode-button-style").addClass("mode-button-style-offline");

							FlashMode = false;
							QuizMode = true;
							SlideMode = false;
							PolicyMode = false;
							FlatQuizMode = false;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = false;

							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							DrawModule(1);

						} else
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = false;
							PolicyMode = false;
							FlatQuizMode = false;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = false;

							CurrentTemplateID = $(this).attr("TextTemplate");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							//Load Page Text Fields into Arrays
							MaxPageTextCount = 0;
							$(this).find("Text").each(function() {
//								if ($(this).attr("Target").toLowerCase()!="videooverlap")
								{
									MaxPageTextCount++;
									PageTextArray[MaxPageTextCount] = $(this).text();
									xTime = $(this).attr("TimeToShow");
									xTimes = xTime.split(":");

									PageTextArrayTime[MaxPageTextCount] = parseInt(xTimes[0]*3600,10) + parseInt(xTimes[1]*60,10) + parseInt(xTimes[2],10);
									PageTextArrayTarget[MaxPageTextCount] = $(this).attr("Target");
									PageTextArrayInsert[MaxPageTextCount] = $(this).attr("Insert").toLowerCase();

									PageTextArraySkipClick[MaxPageTextCount] = $(this).attr("TextModeNoBreak");
									if (typeof PageTextArraySkipClick[MaxPageTextCount]=="undefined") { PageTextArraySkipClick[MaxPageTextCount] = ""; }
									PageTextArraySkipClick[MaxPageTextCount] = PageTextArraySkipClick[MaxPageTextCount].toLowerCase();

									PageTextArrayImage[MaxPageTextCount] = $(this).attr("AltImage");
									$.preLoadImages($(this).attr("AltImage"));
								}
							});
							CurrentTextFrame=1;
							PositionX=0;
							CurrentPosition=0;


							//load first keyframe
							UpdateTextArea(1,TextGoBackwards);
							CurrentPosition = 0;
						}
					}
				});
			}
		});
	});

	if ((CurrentPageNumber<=1) && (CurrentTextFrame==1)) {
		$("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
	}

	if ((CurrentPageNumber>=PageCount) && (CurrentTextFrame==MaxPageTextCount))
	{
		$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
	}

	UpdateProgressBar();
}

//------------------------------------------------------------------------------------------------------------------
function PageClick(e)
{
	if ((QuizMode)  && (!admin_ReviewMode)) { return false; }
	CloseQuizDialogs();

	if (ModulePageViewableArray[e.target.id.slice(1)]!=1)
	{
		alert(admin_DropDownAlert);
	} else
	{
		FlashAbortTimer();
		FlashTime=-1;
		FlashFinished = true;

		LoadPage( e.target.id.slice(1),0,0 );
	}

	$( "#chapterdialog" ).dialog( "close" );
}


//------------------------------------------------------------------------------------------------------------------
function RebuildFinalExamArray()
{
	//build final exam
	FinalExamQArray = [];
	FinalExamGroupMaxQuestions = [];
	FinalExamGroupMaxQuestionsByOrder = [];
	
	/*
	FinalExamAnswerCache = [];
	FinalExamAnswerTextCache = [];
	FinalExamAnswerRightCache = [];
	FinalExamScormUserAnswerCache = [];

	FinalExamScormQuestionCache = [];
	FinalExamScormAnswersCache = [];
	FinalExamScormCorrectAnswerCache = [];
	*/
	
	
	QuestionCounter = 0;
	FinalExamMaxQuestions = 0;
	FinalExamCurrentActiveQuestion = 0;
	
	QuestionGroupCounter = -1; //zero based counter so first group is 0
	
	$(FinalXML).find("QuestionGroup").each(function()
	{
		FinalExamMaxQuestions += parseInt($(this).attr("QuestionCount"),10);
		
		QuestionGroupCounter++;
		QGroup = $(this).attr("Name");
		
		//loop through each group pull questions revelant to retry counter into array
		QCount = 0;
		
		if (typeof admin_QuizRetakeCounter[ $(this).attr("Name") ] !== 'undefined') { 
			QArrayCounter = (admin_QuizRetakeCounter[ $(this).attr("Name") ]-1) * parseInt($(this).attr("QuestionCount"),10);
		
		} else { 
			QArrayCounter = 0;
		}
		
		//console.log(QArrayCounter+" - "+$(this).attr("Name")+" - "+admin_QuizRetakeCounter[$(this).attr("Name")]+" - "+parseInt($(this).attr("QuestionCount"),10))
		
		if ((QArrayCounter+1) >$(this).find("Question").length) { QArrayCounter = 0; }
		
		FinalExamGroupMaxQuestions[ QGroup ] = parseInt($(this).attr("QuestionCount"),10);
		FinalExamGroupMaxQuestionsByOrder[ QuestionGroupCounter ] = parseInt($(this).attr("QuestionCount"),10);
		
		while (QCount < parseInt($(this).attr("QuestionCount"),10) )
		{
			NewQ = new Object();
			NewQ.position = QCount;
			NewQ.groupPosition = QArrayCounter;
			NewQ.questionNo = QuestionCounter;
			NewQ.group = QGroup;
			NewQ.GroupCounter = QuestionGroupCounter;
			
			FinalExamQArray.push(NewQ); 

			QuestionCounter++;
		
			QCount++;
			QArrayCounter++;
			if ((QArrayCounter+1)>$(this).find("Question").length) { QArrayCounter = 0; }
		}
	});
	
}

//------------------------------------------------------------------------------------------------------------------
function SaveFinalXML(xml)
{
	FinalXML = xml;
	
	//set quizmaxscore to more than zero so last page will post course complete and not 100%
	QuizMaxScore=99;
}

//------------------------------------------------------------------------------------------------------------------
function LoadFinalXML(FinalFileName)
{
	$.ajax({
		type: "GET",
		async:   false,
		url: FinalFileName+'?q=430&time='+Math.round(+new Date()/1000),
		dataType: "xml",
		success: SaveFinalXML
	});
}

//------------------------------------------------------------------------------------------------------------------
function SavePreExamXML(xml)
{
	PreExamXML = xml;
}

//------------------------------------------------------------------------------------------------------------------
function LoadPreExamXML(PreExamFileName)
{
	$.ajax({
		type: "GET",
		async:   false,
		url: PreExamFileName+'?q=430&time='+Math.round(+new Date()/1000),
		dataType: "xml",
		success: SavePreExamXML
	});
}

//------------------------------------------------------------------------------------------------------------------
function SaveSurveyXML(xml)
{
	SurveyXML = xml;
}

//------------------------------------------------------------------------------------------------------------------
function LoadSurveyXML(SurveyFileName)
{
	$.ajax({
		type: "GET",
		async:   false,
		url: SurveyFileName+'?q=430&time='+Math.round(+new Date()/1000),
		dataType: "xml",
		success: SaveSurveyXML
	});
}


//------------------------------------------------------------------------------------------------------------------
function parseCourseXml(xml)
{
	//find every Tutorial and print the author

	$(xml).find("Template").each(function() {
		TemplateArray[ $(this).attr("Name") ] = $(this).text();

		TemplateVideoWidth[ $(this).attr("Name") ] = $(this).attr("VideoWidth");
		TemplateVideoHeight[ $(this).attr("Name") ] = $(this).attr("VideoHeight");
	});
	
	admin_FinalExamFile = $(xml).find("QuizSetup").attr("FinalFile");
	if (typeof admin_FinalExamFile=="undefined") { } else
	{
		LoadFinalXML(admin_FinalExamFile);
	}

	admin_PreExamFile = $(xml).find("QuizSetup").attr("PreExamFile");
	if (typeof admin_PreExamFile=="undefined") { } else
	{
		LoadPreExamXML(admin_PreExamFile);
	}

	admin_SurveyFile = $(xml).find("QuizSetup").attr("SurveyFile");
	if (typeof admin_SurveyFile=="undefined") { } else
	{
		LoadSurveyXML(admin_SurveyFile);
	}
	

	admin_QuizPassingPercentage = parseInt($(xml).find("QuizSetup").attr("PassingPercentage"),10);
	admin_QuizRetakeTillPass = $(xml).find("QuizSetup").attr("RetakeTillPass").toLowerCase()==="true";

	admin_QuizRetakeMaxCount = $(xml).find("QuizSetup").attr("RetakeTries");
	if (typeof admin_QuizRetakeMaxCount=="undefined") { admin_QuizRetakeMaxCount=99; } else {admin_QuizRetakeMaxCount = parseInt(admin_QuizRetakeMaxCount,10); };

	GamificationPassingPoints = $(xml).find("QuizSetup").attr("GamificationPassingPoints");
	if (typeof GamificationPassingPoints=="undefined") { GamificationPassingPoints=0; } else {GamificationPassingPoints = parseInt(GamificationPassingPoints,10);  };

	admin_ScormOrFinalQuiz = $(xml).find("QuizSetup").attr("ScormPost");

	CourseName = $(xml).find("course").attr("Name");

	if (admin_ReviewMode) { $("#course-header").html(CourseName+" ("+admin_Review+")"); } else {$("#course-header").html(CourseName);}

	PageCount = 0;
	ChapterText = "";
	$(xml).find("Modules").each(function() {
		$(xml).find("Module").each(function() {
			MaxModulePage++;
			ModulePageArray[MaxModulePage] = 'M'+$(this).attr("Name");

			ChapterText += '<a href="#" onClick="event.preventDefault();" id="C'+(MaxModulePage)+'" class="page-disabled-text-line-style" style="font-size:14px; line-height:200%" >'+ ModulePageArray[MaxModulePage].slice(1) +'</a><br>';


			ModulePageMinTimeArray[MaxModulePage] = -99;
			ModulePageViewableArray[MaxModulePage] = 0;
			if (admin_ReviewMode) {ModulePageViewableArray[MaxModulePage] = 1;}

			$(this).find("Page").each(function() {
				if ($(this).attr("Type")=="iPadOnly")
				{
					//alert("ignore");
					//ignore ipad only pages also ignore if ipad and textmode
				} else
				{

					MaxModulePage++;
					ModulePageArray[MaxModulePage] = 'L'+$(this).attr("Name");

					ModulePageMinTimeArray[MaxModulePage] = $(this).attr("MinTime");
					ModulePageArrayType[MaxModulePage] = $(this).attr("Type");
					ModulePageViewableArray[MaxModulePage] = 0;
					if (admin_ReviewMode) {ModulePageViewableArray[MaxModulePage] = 1;}

					ChapterText +='<a href="#" onClick="event.preventDefault();" id="C'+(MaxModulePage)+'" class="page-disabled-text-line-style" style="font-size:14px; line-height:200%" >&nbsp;&nbsp;&nbsp;'+ ModulePageArray[MaxModulePage].slice(1) +'</a><br>';
					PageCount++;
				}
			});
		});
	});

	ChapterText += "";

	$("#chapterdialog").html(ChapterText);

	ModulePageViewableArray[1] = 1;
	$("#C1").removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
	ModulePageViewableArray[2] = 1;
	$("#C2").removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

	$(".page-select-text-line-style").bind('click', function(event) { PageClick(event); } );
	$(".page-disabled-text-line-style").bind('click', function(event) { PageClick(event); } );

	$.doTimeout( '', 1500, function(){
		if (admin_UseAicc) { StartCourse_AICC("course"); } else { StartCourse("course"); }
		resizeControls();
		LoadPage(selectedPageID,0,0);

		$.doTimeout( '', 1000, function(){ resizeControls(); $.doTimeout( '', 1000, function(){ resizeControls() } ); } );
	} );
}

//------------------------------------------------------------------------------------------------------------------
function SaveCourseXML(xml)
{
	CourseXML = xml;
	parseCourseXml(CourseXML);
}

//------------------------------------------------------------------------------------------------------------------
function LoadCourseXML()
{
	$.ajax({
		type: "GET",
		url: admin_CourseFile+'?q=430&time='+Math.round(+new Date()/1000),
		dataType: "xml",
		success: SaveCourseXML
	});
}


//------------------------------------------------------------------------------------------------------------------
function parseGlossaryXml(xml)
{
	GlossaryText="<span style='font-size:14px; line-height:150%'>";
	j = 0;
	$(xml).find("Term").each(function() {
		j++;
		GlossaryText += "<b><a href='#' onClick='$(\"#glossaryText_"+j+"\").show(); event.preventDefault();' style='color:black'>" + $(this).attr("Name") + "</a></b><br><div id='glossaryText_"+j+"' style='display:none;' ><a href='#' onClick='event.preventDefault();' style='color:black'>" + $(this).text()+"</a><br><br></div>";
	});
	GlossaryText+="</span>";
}

//------------------------------------------------------------------------------------------------------------------
function SaveGlossaryXML(xml)
{
	GlossaryXML = xml;
	parseGlossaryXml(GlossaryXML);
}

//------------------------------------------------------------------------------------------------------------------
function LoadGlossary()
{
	$.ajax({
		type: "GET",
		url: admin_GlossaryFile+'?q=430&time='+Math.round(+new Date()/1000),
		dataType: "xml",
		success: SaveGlossaryXML
	});
}


//------------------------------------------------------------------------------------------------------------------
function ExitClick()
{
	if (admin_UseAicc) { CloseCourse_AICC(false); } else { CloseCourse(false); }
}

//------------------------------------------------------------------------------------------------------------------
function ScormTime()
{
	if ( (admin_UseScorm)  && (ScormInitialized) && (!startingTime) )
	{
		//read scorm total time once
		startingTime=true;
		ScormTotalTime = LMSGetValue("cmi.core.total_time");
//			console.log("scorm time:"+ScormTotalTime);
		if (ScormTotalTime=="") { ScormTotalTime = "00:00:00"; }
		if (ScormTotalTime==null) { ScormTotalTime = "00:00:00"; }
//			console.log("scorm time:"+ScormTotalTime);
		var splitTime = ScormTotalTime.split(":");
		ScormTotalHours = parseInt(splitTime[0],10);
		ScormTotalMinutes = parseInt(splitTime[1],10);
		ScormTotalSeconds = parseInt(splitTime[2],10);
	}

	if ( (!startingTime) && (!admin_UseScorm) )
	{
		startingTime=true;
		ScormTotalHours = 0;
		ScormTotalMinutes = 0;
		ScormTotalSeconds = 0;
	}

	if ( (admin_ShowTimer) && (startingTime) )
	{
		$("#scorm-timer-container").show();

		var endtime2=new Date();
		var totaltime2=Math.floor( (endtime2 - CourseStartTime)/1000);

		var totalhours2=Math.floor(totaltime2/3600);

		var totalminutes2=(Math.floor((totaltime2%3600)/60) + ScormTotalMinutes);
		if (totalminutes2 >= 60) { totalhours2++; totalminutes2=totalminutes2-60; }

		var totalseconds2=( Math.floor(totaltime2%60)+ScormTotalSeconds) ;
		if (totalseconds2 >= 60) { totalminutes2++; totalseconds2=totalseconds2-60; }

		CourseTotalSeconds = ( (totalhours2+ScormTotalHours)*3600) + (totalminutes2*60) + (totalseconds2);

		$("#scorm-timer").html(admin_TimerText+LZ((totalhours2+ScormTotalHours))+":"+LZ(totalminutes2)+":"+LZ(totalseconds2) );

	}
	$.doTimeout( '', 1000, function(){	ScormTime()  });

}


//------------------------------------------------------------------------------------------------------------------
$(document).ready(function() {

	var aDate = new Date();
	xcode = $.timerY(aDate.getFullYear()+"."+aDate.getUTCMonth()+"."+aDate.getDate(), 'IEngine');
	XCode = xcode.substring(0,3)+xcode.substr(xcode.length-1,1);

	xcode2 = $.timerY(aDate.getFullYear()+"."+aDate.getUTCMonth()+"."+(aDate.getDate()-1), 'IEngine');
	XCode2 = xcode2.substring(0,3)+xcode2.substr(xcode2.length-1,1);

	xcode3 = $.timerY(aDate.getFullYear()+"."+aDate.getUTCMonth()+"."+(aDate.getDate()+1), 'IEngine');
	XCode3 = xcode3.substring(0,3)+xcode3.substr(xcode3.length-1,1);

	LoadVersionXML();

	$("body").css("overflow", "hidden");

	$("#tooltip").hide();
	$("#page-select").hide();

	$("#progress-bar").bind('mouseover', function() { clearTimeout(ProgressTimer); ProgressShowTimer = setTimeout('ShowProgress()',200); }  );
	$("#progress-bar").bind('mouseout',function() { clearTimeout(ProgressShowTimer); ProgressTimer = setTimeout('HideProgress()',800); });

	$(document).mousedown(function() { isDown = true; });
	$(document).mouseup(function() { isDown = false; });

	$("#forward-button").bind('click',function() { ForwardClick(); });
	$("#backward-button").bind('click',function() { BackwardsClick(); });

	$("#exit-button").bind('click',function() { ExitClick(); });

	$("#page-combo").bind('click',function() { ChapterComboClick(); });

	$("#glossary-button").bind('click',function() { GlossaryClick(); });

	$("#help-button").bind('click',function() { HelpClick(); });


	$("div").die("keypress").live("keypress", function(e) {
		if (e.which == 32) {
			$(this).trigger("click");
			e.preventDefault();
		}
	});

//		select is disabled from CSS FILE
		document.onselectstart = function() {return false;} // ie
		
		document.onmousedown = function(e) {
			e = e || window.event;
			var elementId = e.target ? e.target.id : e.srcElement.id;
			if (elementId!="SurveyMemo") { return false; }
		} // mozilla

	$.doTimeout( '', 1000, function(){	ScormTime()  });

});

//------------------------------------------------------------------------------------------------------------------
$(window).resize(function(){
  $.doTimeout( 'resize', 150, function(){
	resizeControls()
  });
});
