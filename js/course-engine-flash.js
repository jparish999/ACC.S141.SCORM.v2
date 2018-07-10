/*
 * IEngine4
 * IEngine4 Video Engine
 *
 * Copyright (c) Inspired eLearning Inc. 2003-2014.  All Rights Reserved.
 * This source file is proprietary property of Inspired eLearning Inc.
 * http://http://www.inspiredelearning.com/inspired/License
 *
 * @version 4.8.13
 */

var FlashXML;
var tid=null;
var FlashTime=-1;
var FlashStageElements;
var FlashStageSequencer;
var FlashStageSequencerRule="";
var xLiveRules = [];
var xPlayTime = [];
var FoundFrame = false;
var xTime = "";
var FlashFinished = false;

var EnterGoToPosition = 0;

var GameVar1 = 0;
var GameVar2 = 0;
var GameVar3 = 0;

var FlashXMLCodePause = false;

var MaxiPadImages = 10;
var iPadImageCounter = 0;
var iPadImageDelay = 1000;
var iPadImageFilePattern = "";
var iPadImageInterval = null;
var iPadImageClearLast = true;

var iPadSwapImage = false;

var html5_audiotypes={
	"mp3": "audio/mpeg",
	"mp4": "audio/mp4",
	"ogg": "audio/ogg",
	"wav": "audio/wav"
}

var SequencerVideoEndGoTo = 0;
var SequencerVideoEndBlank = true;

function createsoundbite(sound){
	var html5audio=document.createElement('audio')
	if (html5audio.canPlayType){ //check support for HTML5 audio
		for (var i=0; i<arguments.length; i++){
			var sourceel=document.createElement('source')
			sourceel.setAttribute('src', arguments[i])
			if (arguments[i].match(/\.(\w+)$/i))
				sourceel.setAttribute('type', html5_audiotypes[RegExp.$1])
			html5audio.appendChild(sourceel)
		}
		html5audio.load()
		html5audio.playclip=function(){
			html5audio.pause()
			html5audio.currentTime=0
			html5audio.play()
		}
		return html5audio
	}
	else{
		return {playclip:function(){throw new Error("Your browser doesn't support HTML5 audio unfortunately")}}
	}
}

//Initialize two sound clips with 1 fallback file each:
/*
var mouseoversound=createsoundbite("whistle.ogg", "whistle.mp3")
var clicksound=createsoundbite("click.ogg", "click.mp3")
*/


//------------------------------------------------------------------------------------------------------------------
function FlashAbortTimer() { // to be called when you want to stop the timer
  clearInterval(tid);
  tid=null;
}


//------------------------------------------------------------------------------------------------------------------
// Call from within course.xml to change frame position
function SeqGoToAndPlay(FrameNo) { 

	xPlayTime2 = parseInt(FrameNo,10) -1;

	BreakSequenceLoop = true;
	FlashXMLCodePause = false;
	FlashTime = xPlayTime2;
	if (tid==null) { tid = setInterval(FlashFrame, FlashFrameInterval); }
}


//------------------------------------------------------------------------------------------------------------------
function toggleEnableSelectStart(enable) {
        document.onmousedown = function (e) { return enable; };
        document.onselectstart = function (e) { return enable; };
}

//------------------------------------------------------------------------------------------------------------------
function loadCssFile(pathToFile) {

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
function CloseIntroDialogFlash()
{
	NewDialogClose();
	if (CourseMode=="Video") {
		$("#jquery_jplayer_1").jPlayer("stop");
		isPlay = 0;
		$("#play-button").removeClass("pause-button-style").addClass("play-button-style");
		$("#play-button").attr('alt',admin_Play);$("#play-button").attr('title',admin_Play);
	}

	StartFlashSimulation();

//	DrawFlashQuiz(FlashActiveQuestions);
}


//------------------------------------------------------------------------------------------------------------------
function FlashMoveNext(OpenNextPage)
{
	//if text mode always move to next page at end
	if (CourseMode=="Text") { OpenNextPage = true; }

	$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
	if (CurrentPageNumber>=PageCount)
	{
		$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
	}

	FlashFinished = true;

	if (selectedPageID<MaxModulePage)
	{
		ModulePageViewableArray[selectedPageID+1] = 1;
		$("#C"+(selectedPageID+1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

		if (ModulePageArray[selectedPageID+1].charAt(0)=="M") //if next row is module then activate the one bellow too
		{
			ModulePageViewableArray[selectedPageID+2] = 1;
			$("#C"+(selectedPageID+2)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
		}

		if (OpenNextPage)
		{
			NewDialogClose();

			if (CourseMode=="Video") {
				$("#jquery_jplayer_1").jPlayer("stop");
				isPlay = 0;
				$("#play-button").removeClass("pause-button-style").addClass("play-button-style");
				$("#play-button").attr('alt',admin_Play);$("#play-button").attr('title',admin_Play);
			}

			if ((admin_AutoForwardDefaultSetting==true) && (selectedPageID<MaxModulePage))
			{
				selectedPageID++;
				LoadPage(selectedPageID,0,0,1);
			} else
			{
				if (selectedPageID<MaxModulePage) {	FwdBlink(4000,1000); }
			}
		} else
		{
			if (selectedPageID<MaxModulePage) {	FwdBlink(4000,1000); }
		}
	}
}



//------------------------------------------------------------------------------------------------------------------
function SetupFlash(FlashXML_Source)
{
	//reset flash timer
	FlashAbortTimer();
	FlashTime=-1;
	GameVar1 = 0;
	GameVar2 = 0;
	GameVar3 = 0;
	FlashXMLCodePause = false;
	FlashFinished = false;
	
	FlashModeAudioEndBlink = false;
	FlashModeAudioEndNext = false;
	
	FlashXML = FlashXML_Source;

	DisableNextButton=true;
	if (admin_ReviewMode) {DisableNextButton=false;}
	if ( $("#C"+(selectedPageID+1)).hasClass("page-select-text-line-style") ) { DisableNextButton=false; }
	if (CourseMode=="Text") { DisableNextButton = false; }

	if (DisableNextButton)
	{
		$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
	}

	$("#ajax-loading-graph").hide();
	$("#template-place").html( TemplateArray[CurrentTemplateID] );

	FlashStageElements = $(FlashXML).find("Stage");
	FlashStageSequencer = $(FlashXML).find("Sequencer");
	
	/* old fix for repeating pause -- can be deleted at version 4.8.3 or later
	FlashStageSequencer.find("Sequence").each(function() {
			xTime = $(this).attr("T");
			xTime = parseInt(xTime,10);
	});
	
	if (xTime==0) { 
		FlashStageSequencer.find("Sequence").last().attr('T', '010' ); 
	}
	*/
	

	//if RuleToPass is defined the format will be changed from 1,2,3 to ,1,,2,,3, and as each rule is done it will be remved as ,1, ,2, ,3,
	FlashStageSequencerRule = FlashStageSequencer.attr("RuleToPass");
	if ((FlashStageSequencerRule==="") || (typeof FlashStageSequencerRule =="undefined"))
		{ FlashStageSequencerRule=""; } else
		{
			FlashStageSequencerRule = FlashStageSequencerRule.replace(/,/g,",,");
			FlashStageSequencerRule = ","+FlashStageSequencerRule+",";
		}


	var ExCssFile = $(FlashXML).attr("CSSFile");
	var ExJsFile = $(FlashXML).attr("JSFile");

	if ((ExCssFile==="") || (typeof ExCssFile =="undefined")) { } else { loadCssFile(ExCssFile); }
	if ((ExJsFile==="") || (typeof ExJsFile =="undefined")) { } else { $.getScript(ExJsFile, function() { /*initExJS();*/ }); }




	FlashStageElements.find("Element").each(function() {
		xText = $(this).text();
		xTarget = $(this).attr("Target");
		xClass = $(this).attr("Class");
		xID = $(this).attr("ID");

		var new_item = $("<div ID='"+ xID +"' style='position:absolute; top:" + $(this).attr("Top") + "px; left:" + $(this).attr("Left") + "px; width:" + $(this).attr("Width") + "px; height:" + $(this).attr("Height") + "px;  '>" + $(this).text() + "</div>").hide();
		$("#"+xTarget).append( new_item);
	});

	ContinueButton = $(FlashXML).attr("ContinueButton");
	StartButton = $(FlashXML).attr("StartButton");

	BackgroundAudio = $(FlashXML).attr("BackgroundAudioFile");
	if ((CourseMode=="Video") && (typeof BackgroundAudio != 'undefined'))  {
		$("#Background_Audio_Player").jPlayer("setMedia", { mp3: BackgroundAudio });
		$("#Background_Audio_Player").jPlayer("play");
	}

	//if has intro dialog then show it, otherwise play the audio
	if ($(FlashXML).find("IntroTitle").length>0)
	{
		IntroBoxTitle = $(FlashXML).find("IntroTitle").text();
		IntroBox = $(FlashXML).find("IntroText");
		IntroBoxText = IntroBox.text();
		IntroBoxAudio = IntroBox.attr("AudioFile");

		if (IntroBoxAudio!="")
		{
			if (CourseMode=="Video") {
				$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: IntroBoxAudio })
				$("#jquery_jplayer_1").jPlayer("play");
			}
		}

		NewDialog(IntroBox.attr("Top"),IntroBox.attr("Left"),IntroBox.attr("Width"),IntroBox.attr("Height"),IntroBox.attr("BgAudio"), IntroBoxTitle,IntroBoxText + FlashIntroButton, false);
	} else
	{
		StartFlashSimulation();
	}

	jQuery("input[type=text]").focusin(function () {  toggleEnableSelectStart(true); });
    jQuery("input[type=text]").mouseover(function () { toggleEnableSelectStart(true); });
    jQuery("input[type=text]").focusout(function () { toggleEnableSelectStart(false); });
    jQuery("input[type=text]").mouseout(function () { toggleEnableSelectStart(false); });
    jQuery("input[type=text]").keypress(function(e) {
		if(e.which == 13) {
			if (EnterGoToPosition!=0)
			{
				BreakSequenceLoop = true;
				FlashTime = EnterGoToPosition;
				//FlashFrame();
				if (tid==null) { tid = setInterval(FlashFrame, FlashFrameInterval); }
			}
		}
	});
}


//------------------------------------------------------------------------------------------------------------------
function padnum(str, max) {
  str = str.toString();
  return str.length < max ? padnum("0" + str, max) : str;
}

//------------------------------------------------------------------------------------------------------------------
function InitMiniVideo(vTop,vLeft,vWidth,vHeight,VideoFile,WebmFile,PosterFile)
{
	vTop = parseInt(vTop,10);
	vLeft = parseInt(vLeft,10);
	vWidth = parseInt(vWidth,10);
	vHeight = parseInt(vHeight,10);

	HideVideoProgress();
	var offsetPoster = $('#template-place').position();
	$("#ajax-poster").css({"top": (offsetPoster.top+vTop) + "px" }); //140+55 = 195
	$("#ajax-poster").css({"left": (offsetPoster.left+vLeft) + "px" }); //140+55 = 195
	$("#ajax-poster").css({"height": vHeight+"px" });
	$("#ajax-poster").css({"width":  vWidth+"px" });
	$("#ajax-poster").attr("src",PosterFile);
	$("#ajax-poster").css({"z-index":5});

	$("#jplayer_video").css({"top": (offsetPoster.top+vTop) + "px" }); //140+55 = 195
	$("#jplayer_video").css({"left": (offsetPoster.left+vLeft) + "px" }); //140+55 = 195
	$("#jplayer_video").css({"z-index":4});

	MSIE8_Fix_ClearMedia = false;
	$("#jplayer_video").jPlayer( "clearMedia" );
	$("#jplayer_video").jPlayer( "option", "size", { height: vHeight+"px",width: vWidth+"px", loop:true } );

	if ((VideoFile!="") && (WebmFile!="")) {	$("#jplayer_video").jPlayer("setMedia", {m4v:VideoFile,webmv:WebmFile}); }
	if ((VideoFile!="") && (WebmFile=="")) {	$("#jplayer_video").jPlayer("setMedia", {m4v:VideoFile}); }
	if ((VideoFile=="") && (WebmFile!="")) {	$("#jplayer_video").jPlayer("setMedia", {webmv:WebmFile}); }

	$("#jplayer_video").show();

	if (!admin_DisableVolume)
	{
		if (VolumeMute)
		{
			$("#jplayer_video").jPlayer("mute", true );
		} else
		{
			$("#jplayer_video").jPlayer("mute", false );
		}
	}

	$("#ajax-loading-graph").css({"top": parseInt( (offsetPoster.top+vTop) +  (vHeight/2) - 16 )+"px" });
	$("#ajax-loading-graph").css({"left":parseInt( (offsetPoster.left+vLeft) +  (vWidth/2) - 16 )+"px" });

	$("#jplayer_video").jPlayer("play" );
}


// set interval
function FlashFrame()
{
	FlashTime++;
//	console.log(FlashTime);

	if (CourseMode=="Video") {
		isPlay = 1;
		$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
		$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
	}

	var FoundFrame = false;
	BreakSequenceLoop = false;
	xTime = "";

	FlashStageSequencer.find("Sequence").each(function() {
		if (!BreakSequenceLoop)
		{
			xTime = $(this).attr("T");
			xTime = parseInt(xTime,10);
			xID = $(this).attr("ID");

			if (xTime==FlashTime)
			{
				$(".textlink").off('click');

				FoundFrame = true;
				xClass = $(this).attr("Class");
				xOperation = $(this).attr("Operation");
				xOperation = xOperation.toLowerCase();

				xOptions = $(this).attr("Options");
				if ((xOptions==="") || (typeof xOptions =="undefined")) { xOptions = {}; } else
				{
					xOptions = eval("("+xOptions+")");
				}
				xDelay = parseInt($(this).attr("Delay"),10);

				if (CourseMode=="Text") {  xDelay = 0; } //if in text mode then dont slow down course with delays

				xEffect = $(this).attr("Effect");
				xClass = $(this).attr("Class");
				xFile = $(this).attr("File");

				//console.log(xID+" "+FlashTime+" "+xOperation+" "+xEffect+" "+xOptions);
				//'blind', 'clip', 'drop', 'explode', 'fold', 'puff', 'slide', 'scale', 'size', 'pulsate'.
				if (xOperation=="addclass")
				{
					$("#"+xID).addClass( xClass );
				} else
				if (xOperation=="removeclass")
				{
					$("#"+xID).removeClass( xClass );
				} else

				if (xOperation=="playvideo")
				{
					if (CourseMode=="Video") {

						//slide show on iPAD instead of video
						if ((isiPad))// || (1==1))
						{
							var iPadSeq = $(this).attr("iPadSeq");
							
							var str = iPadSeq.substring(iPadSeq.indexOf("[") + 1);
							var str2= str.substr(0, str.indexOf(']')); 
							
							iPadImageFilePattern = iPadSeq;
							iPadImageFilePattern = iPadImageFilePattern.replace('['+str2+']','***');
							
							var str3= str2.split(",");
							
							MaxiPadImages = parseInt( str3[0], 10 );
							iPadImageCounter = 1;
							iPadImageDelay = parseInt( str3[1], 10 );
//							iPadImageDelay = 1000;
							iPadImageClearLast = str3[2].toLowerCase() === 'true';
							//console.log(iPadImageFilePattern+' '+MaxiPadImages+' '+iPadImageCounter+' '+iPadImageDelay);
							
							iPadImageInterval = setInterval( function() {
								iPadImageCounter++;
								
								if (iPadImageCounter>MaxiPadImages)
								{
									if (iPadImageClearLast) { $("#ipadvideoimagediv1").remove(); $("#ipadvideoimagediv2").remove(); }
									clearInterval(iPadImageInterval);
									if (SequencerVideoEndGoTo!=0)
									{
										SeqGoToAndPlay(SequencerVideoEndGoTo); //jump to timefreme
									}
								} else
								{
									iPadSwapImage = !iPadSwapImage;
									
									if (iPadSwapImage) {
										$("#ipadvideoimage2").hide();
										$("#ipadvideoimage2").attr( {"src":iPadImageFilePattern.replace('***',padnum(iPadImageCounter,2)) });

										$("#ipadvideoimagediv1").css( {"z-index":"190" });
										$("#ipadvideoimagediv2").css( {"z-index":"200" });
										
										$("#ipadvideoimage2").hide().fadeIn(iPadImageDelay);
										
									} else
									{
										$("#ipadvideoimage1").hide();
										$("#ipadvideoimage1").attr( {"src":iPadImageFilePattern.replace('***',padnum(iPadImageCounter,2)) });

										$("#ipadvideoimagediv2").css( {"z-index":"190" });
										$("#ipadvideoimagediv1").css( {"z-index":"200" });
										
										$("#ipadvideoimage1").hide().fadeIn(iPadImageDelay);
									}
								}
							}, iPadImageDelay);
							
							var vTop = parseInt($(this).attr("Top"),10);
							var vLeft = parseInt($(this).attr("Left"),10);
							var vWidth = parseInt($(this).attr("Width"),10);
							var vHeight = parseInt($(this).attr("Height"),10);
							
							$('#template-place').append("<div style='position:absolute; overflow:hidden' id='ipadvideoimagediv1'><img src='' id='ipadvideoimage1' /></div><div style='position:absolute; overflow:hidden' id='ipadvideoimagediv2'><img src='' id='ipadvideoimage2' /></div>");

							SequencerVideoEndGoTo = $(this).attr("GoToAndPlayAtEnd");
							if (typeof SequencerVideoEndGoTo=="undefined") {  SequencerVideoEndGoTo=0; };

							$("#ipadvideoimagediv1").css({"z-index": "200" });
							$("#ipadvideoimagediv1").css({"top": (vTop) + "px" });
							$("#ipadvideoimagediv1").css({"left": (vLeft) + "px" });
							$("#ipadvideoimagediv1").css({"height": vHeight+"px" });
							$("#ipadvideoimagediv1").css({"width":  vWidth+"px" });

							$("#ipadvideoimagediv2").css({"z-index": "190" });
							$("#ipadvideoimagediv2").css({"top": (vTop) + "px" });
							$("#ipadvideoimagediv2").css({"left": (vLeft) + "px" });
							$("#ipadvideoimagediv2").css({"height": vHeight+"px" });
							$("#ipadvideoimagediv2").css({"width":  vWidth+"px" });
						
							$("#ipadvideoimage1").attr("src",iPadImageFilePattern.replace('***',padnum(iPadImageCounter,2)));
							$("#ipadvideoimage2").attr("src",iPadImageFilePattern.replace('***',padnum(iPadImageCounter,2)));
							
						
							$("#ipadvideoimagediv").css({"z-index":5});
							$("#ipadvideoimagediv").show();
						} else
						{
							$("#video-progress-bar").hide();
							$("#jplayer_video").show();
							MSIE8_Fix_ClearMedia = true;
							$("#jplayer_video").jPlayer( "clearMedia" );
							var VideoImageFile = $(this).attr("VideoImage");
							
							SequencerVideoEndGoTo = $(this).attr("GoToAndPlayAtEnd");
							if (typeof SequencerVideoEndGoTo=="undefined") {  SequencerVideoEndGoTo=0; };
							
							
							SequencerVideoEndBlank = $(this).attr("BlankAtEnd");
							if (typeof SequencerVideoEndBlank=="undefined") { SequencerVideoEndBlank=false; } else
							{ SequencerVideoEndBlank = SequencerVideoEndBlank.toLowerCase() === 'true'; }

							tempStrX = $(this).attr("File");
							tempStrX2 = tempStrX.split(",");

							var m4vFile ="";
							var WebmFile = "";

							//single file
							if (tempStrX2.length==1) {
								if ( tempStrX2[0].search(".mp4")!==-1 ) { m4vFile = tempStrX2[0]; if (m4vFile.search("://")==-1) { m4vFile = cleanURL(document.URL)+m4vFile+""; }  }
								if ( tempStrX2[0].search(".webm")!==-1 ) { WebmFile = tempStrX2[0]; if (WebmFile.search("://")==-1) { WebmFile = cleanURL(document.URL)+WebmFile+""; } }
							}

							//dual file
							if (tempStrX2.length==2) {
								if ( tempStrX2[0].search(".mp4")!==-1 ) { m4vFile = tempStrX2[0]; if (m4vFile.search("://")==-1) { m4vFile = cleanURL(document.URL)+m4vFile+""; }  }
								if ( tempStrX2[0].search(".webm")!==-1 ) { WebmFile = tempStrX2[0]; if (WebmFile.search("://")==-1) { WebmFile = cleanURL(document.URL)+WebmFile+""; } }

								if ( tempStrX2[1].search(".mp4")!==-1 ) { m4vFile = tempStrX2[1]; if (m4vFile.search("://")==-1) { m4vFile = cleanURL(document.URL)+m4vFile+""; }  }
								if ( tempStrX2[1].search(".webm")!==-1 ) { WebmFile = tempStrX2[1]; if (WebmFile.search("://")==-1) { WebmFile = cleanURL(document.URL)+WebmFile+""; } }
							}

							if (VideoImageFile.search("://")==-1) { VideoImageFile = cleanURL(document.URL)+VideoImageFile+""; }

							InitMiniVideo($(this).attr("Top"),$(this).attr("Left"),$(this).attr("Width"),$(this).attr("Height"), m4vFile, WebmFile , VideoImageFile);
						}
					}
				} else

				if (xOperation=="stopvideo")
				{
					if (CourseMode=="Video") {
						if (isiPad)
						{
							$("#ajax-poster").hide();
						} else
						{
							$("#jplayer_video").jPlayer("stop");
							$("#jplayer_video").hide();
							MSIE8_Fix_ClearMedia = true;
							$("#jplayer_video").jPlayer( "clearMedia" );
						}
					}
				} else

				if (xOperation=="playsound")
				{
					if (CourseMode=="Video") {

						FlashModeAudioEndBlink = false;
						FlashModeAudioEndNext = false;
						
						$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: xFile });
						$("#jquery_jplayer_1").jPlayer("play");
						
						if ($(this).attr("AudioEndBlink")=="true") { FlashModeAudioEndBlink = true; }
						if ($(this).attr("AudioEndNext")=="true") { FlashModeAudioEndNext = true; }
					}
				} else

				if (xOperation=="stopsound")
				{
					if (CourseMode=="Video") {
						$("#jquery_jplayer_1").jPlayer("stop");
					}
				} else

				if (xOperation=="playbackgroundsound")
				{
					if (CourseMode=="Video") {

						$("#Background_Audio_Player").jPlayer("setMedia", { mp3: xFile });
						$("#Background_Audio_Player").jPlayer("play");
					}
				} else

				if (xOperation=="stopbackgroundsound")
				{
					if (CourseMode=="Video") {
						$("#Background_Audio_Player").jPlayer("stop");
					}
				} else
					
				if (xOperation=="gamifictioncomputer")
				{
					//Gamification
					if ( (SearchInArray(GamificationScoreArray, selectedPageID)== -1) || (GamificationScoreArray.length==0) )
					{
						GamificationComputerScore += parseInt($(this).attr("Point"),10);
						GamificationScoreArray.push(selectedPageID);

						GamificationSuspendData = GamificationComputerScore+","+GamificationQuestionUserScore+",";
						for(var i=0; i<GamificationScoreArray.length; i++) { GamificationSuspendData += GamificationScoreArray[i] + ","; }

						if ($(this).attr("UpdateTextBlock")!="")
						{
							$("#"+$(this).attr("UpdateTextBlock")).html( GamificationStringReplace( $("#"+$(this).attr("UpdateTextBlock")).html()  )  );
						}
					}
				} else
					
				if (xOperation=="gamifictionuser")
				{
					//Gamification
					if ( (SearchInArray(GamificationScoreArray, selectedPageID)== -1) || (GamificationScoreArray.length==0) )
					{
						GamificationUserScore += parseInt($(this).attr("Point"),10);
						GamificationScoreArray.push(selectedPageID);
						
						GamificationSuspendData = GamificationComputerScore+","+GamificationQuestionUserScore+",";
						for(var i=0; i<GamificationScoreArray.length; i++) { GamificationSuspendData += GamificationScoreArray[i] + ","; }
						
						if ($(this).attr("UpdateTextBlock")!="")
						{
							$("#"+$(this).attr("UpdateTextBlock")).html( GamificationStringReplace( $("#"+$(this).attr("UpdateTextBlock")).html()  )  );
						}
					}
				} else
					
				if (xOperation=="animate")
				{
					$("#"+xID).animate( xOptions, xDelay );
				} else
				if (xOperation=="showeffect")
				{
					if (CourseMode=="Text") {$("#"+xID).show();} else
					{
						$("#"+xID).show( xEffect, xOptions, xDelay );
					}
				} else
				if (xOperation=="hideeffect")
				{
					if (CourseMode=="Text") {$("#"+xID).hide();} else
					{
						$("#"+xID).hide( xEffect, xOptions, xDelay );
					}
				} else
				if (xOperation=="fadein")
				{
					$("#"+xID).fadeIn( xDelay );
				} else
				if (xOperation=="fadeout")
				{
					$("#"+xID).fadeOut( xDelay );
				} else
				if (xOperation=="fadeto")
				{
					$("#"+xID).fadeTo( xDelay, $(this).attr("Opacity") );
				} else
				if (xOperation=="show")
				{
					$("#"+xID).show();
				} else
				if (xOperation=="hide")
				{
					$("#"+xID).hide();
				} else

				//pause ignored in textmode
				if ((xOperation=="pause") && (CourseMode=="Video"))
				{
					BreakSequenceLoop = true;
					FlashXMLCodePause = true;
					FlashAbortTimer();
				} else

				//special pause that is only for textmode
				if ((xOperation=="textmodepause") && (CourseMode=="Text"))
				{
					BreakSequenceLoop = true;
					FlashXMLCodePause = true;
					FlashAbortTimer();
				} else

				if (xOperation=="play")
				{
					xPlayTime2 = $(this).attr("GoTo");
					xPlayTime2 = parseInt(xPlayTime2,10) -1;

					BreakSequenceLoop = true;
					FlashXMLCodePause = false;
					FlashTime = xPlayTime2;
					//FlashFrame();
					if (tid==null) { tid = setInterval(FlashFrame, FlashFrameInterval); }
				} else

				if (xOperation=="enterkey")
				{
					EnterGoToPosition = $(this).attr("GoTo");
					EnterGoToPosition = parseInt(EnterGoToPosition,10) -1;
				} else

				if (xOperation=="script")
				{
					eval( $(this).text() );
				} else

				if (xOperation=="addclick")
				{
					xPlayTime[xID] = $(this).attr("GoTo");
					xPlayTime[xID] = parseInt(xPlayTime[xID],10)-1;
					
					xLiveRules[xID] = $(this).attr("AddRule");
					if ((xLiveRules[xID]==="") || (typeof xLiveRules[xID] =="undefined")) { xLiveRules[xID]=""; }

					//remove any event in case a loop is initiated that would make multiple assignments to same object
					$("#"+xID).off('click');

					$("#"+xID).click( function() {
						FlashTime = xPlayTime[$(this).attr("id")];

						//remove the clicked rule frome the liverules string
						if (xLiveRules[$(this).attr("id")]!="")
						{
							FlashStageSequencerRule = FlashStageSequencerRule.replace(","+xLiveRules[$(this).attr("id")]+",","");
						}

						if (tid==null) {
							tid = setInterval(FlashFrame, FlashFrameInterval);
						}
					});
				} else

				if (xOperation=="addhover")
				{
					xPlayTime[xID] = $(this).attr("GoTo");
					xPlayTime[xID] = parseInt(xPlayTime[xID],10)-1;

					xPlayTime[xID+"_out"] = $(this).attr("GoToOut");
					xPlayTime[xID+"_out"] = parseInt(xPlayTime[xID+"_out"],10)-1;

					//remove any event in case a loop is initiated that would make multiple assignments to same object
					$("#"+xID).off('mouseenter mouseleave');

					$("#"+xID).hover( function() {
						FlashTime = xPlayTime[$(this).attr("id")];

						if (tid==null) {
							tid = setInterval(FlashFrame, FlashFrameInterval);
						}
					},function() {
						FlashTime = xPlayTime[$(this).attr("id")+"_out"];

						if (tid==null) {
							tid = setInterval(FlashFrame, FlashFrameInterval);
						}
					});
				} else
				
				if (xOperation=="enableprevious")
				{
					if (CourseMode=="Text") 
					{
						$("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
					}
				} else

				if (xOperation=="disableprevious")
				{
					if (CourseMode=="Text") 
					{
						$("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
						$("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
					}
				} else

				if (xOperation=="enablenext")
				{
					$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");

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
				} else

				if (xOperation=="blinknext")
				{
					if (selectedPageID<MaxModulePage) {	FwdBlink(4000,1000); }
				} else


				if (xOperation=="moveforward")
				{
					if ((admin_AutoForwardDefaultSetting) || (admin_ReviewMode))
					{
						FlashAbortTimer();
						FlashTime=-1;
						FlashMoveNext(true);
					} else
					{
						FlashAbortTimer();
						FlashTime=-1;
						FlashMoveNext(false);
					}
				} else

				if (xOperation=="setfirstgamevar")
				{
					if ($(this).attr("Action")=="+") {	GameVar1++; }
					if ($(this).attr("Action")=="-") {	GameVar1--; }
				} else

				if (xOperation=="setsecondgamevar")
				{
					if ($(this).attr("Action")=="+") {	GameVar2++; }
					if ($(this).attr("Action")=="-") {	GameVar2--; }
				} else

				if (xOperation=="setthirdgamevar")
				{
					if ($(this).attr("Action")=="+") {	GameVar3++; }
					if ($(this).attr("Action")=="-") {	GameVar3--; }
				} else

				if (xOperation=="comparegamevar")
				{
					var Equals1 = $(this).attr("FirstGameVar");
					var Equals2 = $(this).attr("SecondGameVar");
					var Equals3 = $(this).attr("ThirdGameVar");

					if (typeof Equals1 !== 'undefined' && Equals1 !== false) { Equals1 = parseInt( Equals1 ,10); } else { Equals1 = GameVar1; }
					if (typeof Equals2 !== 'undefined' && Equals2 !== false) { Equals2 = parseInt( Equals2 ,10); } else { Equals2 = GameVar2; }
					if (typeof Equals3 !== 'undefined' && Equals3 !== false) { Equals3 = parseInt( Equals3 ,10); } else { Equals3 = GameVar3; }

					if ((Equals1 == GameVar1) && (Equals2 == GameVar2) && (Equals3 == GameVar3))
					{
						xPlayTime2 = $(this).attr("IfTrue");
						xPlayTime2 = parseInt(xPlayTime2,10) -1;
						//console.log("jump: "+xPlayTime2);

						BreakSequenceLoop = true;
						FlashTime = xPlayTime2;
						//FlashFrame();
						if (tid==null) {
						//	console.log("resume");
							tid = setInterval(FlashFrame, FlashFrameInterval);
						}
					}
				} else

				if (xOperation=="checktext")
				{
					var TextToMatch = $(this).attr("Value");
					var TextInput = $("input[id="+$(this).attr("ID")+"]" ).val();

					if (TextToMatch == TextInput)
					{
						xPlayTime2 = $(this).attr("IfTrue");
						xPlayTime2 = parseInt(xPlayTime2,10) -1;

						BreakSequenceLoop = true;
						FlashTime = xPlayTime2;
						//FlashFrame();
						if (tid==null) {
							//console.log("resume");
							tid = setInterval(FlashFrame, FlashFrameInterval);
						}
					}
				} else


				if (xOperation=="checkrule")
				{
					xPlayTime2 = $(this).attr("IfTrue");
					xPlayTime2 = parseInt(xPlayTime2,10) -1;

					if (FlashStageSequencerRule=="")
					{
						BreakSequenceLoop = true;
						FlashTime = xPlayTime2;
						//FlashFrame();
						if (tid==null) {
						//	console.log("resume");
							tid = setInterval(FlashFrame, FlashFrameInterval);
						}
					}
				}

				$(".textlink").on('click', function()
				{
					TextModeLinkClick = 1;
					VideoPopopStyle = "content";
					ShowStandardDialog($(this).data('dialog'));
					return false;
				}  );

			}

		}
	});

	//frame not found and flashTime is equal or greater than last time then end of file move forward to next page
	if ((!FoundFrame) && (FlashTime>=xTime))
	{
		FlashAbortTimer();
		
		//if gamfication score is going to be shown then don't auto advance instead call the gamification code which will auto-advance the lesson when closed by user
		if ( (GamificationShowInGameScore) || (GamificationLastQuestion) ) { 
			FlashTime=-1;
			$.doTimeout( '', 250, function(){ GamificationDialog(GamificationLastQuestion) }); 
		} else
		{
			if ( (FlashModeAudioEndBlink) || (FlashModeAudioEndNext) )
			{} else
			{
				FlashTime=-1;
				FlashMoveNext(false);
			}
		}
	}
}


//------------------------------------------------------------------------------------------------------------------
function StartFlashSimulation()
{
	FlashFrame();
	if (tid==null) { tid = setInterval(FlashFrame, FlashFrameInterval); }
}