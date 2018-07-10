/*
 * IEngine4
 * IEngine4 Video Engine
 *
 * Copyright (c) Inspired eLearning Inc. 2003-2014.  All Rights Reserved.
 * This source file is proprietary property of Inspired eLearning Inc.
 * http://www.inspiredelearning.com/inspired/License
 *
 * @version 4.8.7
 */

var PolicyPageTextArray = [];
var PolicyPageTextArrayTop = [];
var PolicyPageTextArrayLeft = [];
var PolicyPageTextArrayWidth = [];
var PolicyPageTextArrayHeight = [];
var PolicyPageTextArrayCheck = [];
var MaxPolicyPageTextCount = 0;
var CurrentPolicyTextFrame = 0;
var CurrentPolicyPosition = 0;
var RadioCount = 0
var RadioValue = "1";
var RadioName = "check";

var IncompleteHeader = "";
var SuccessHeader = "";
var InvalidHeader = "";

var IncompleteBox = "";
var SuccessBox = "";
var InvalidBox = "";

var UseDialog = "yes";
var FeedBackDiv = "";


//------------------------------------------------------------------------------------------------------------------
function DrawAllPolicy()
{
	for (xCounter=1; xCounter<=MaxPolicyPageTextCount; xCounter++)
	{
		//load texts into target
		CurrentPolicyTextFrame=xCounter;

		xTop1 = "top:"+PolicyPageTextArrayTop[CurrentPolicyTextFrame]+"px; ";
		xLeft1 = "left:"+PolicyPageTextArrayLeft[CurrentPolicyTextFrame]+"px; ";
		xWidth1 = "width:"+PolicyPageTextArrayWidth[CurrentPolicyTextFrame]+"px; ";
		if ( (PolicyPageTextArrayWidth[CurrentPolicyTextFrame]=="") || (PolicyPageTextArrayWidth[CurrentPolicyTextFrame]=="undefined") || (PolicyPageTextArrayWidth[CurrentPolicyTextFrame]==null)) {xWidth1="";}
		xHeight1 = "height:"+PolicyPageTextArrayHeight[CurrentPolicyTextFrame]+"px; ";
		if ( (PolicyPageTextArrayHeight[CurrentPolicyTextFrame]=="") || (PolicyPageTextArrayHeight[CurrentPolicyTextFrame]=="undefined") || (PolicyPageTextArrayHeight[CurrentPolicyTextFrame]==null)) {xHeight1="";}

		$("#template-place").append("<div style='overflow:hidden; position:absolute; " + xTop1+ xLeft1+ xWidth1+ xHeight1 + "'>" + PolicyPageTextArray[CurrentPolicyTextFrame] + "</div>");
	}
	$("#PolicyButton").bind('click', function(event) { OpenNext(); } );

	if (ModulePageViewableArray[selectedPageID+1]==1)
	{
		for (i=1; i<=RadioCount; i++)
		{
			$("input:radio[name='"+RadioName+"_"+i+"'][value="+RadioValue+"]").attr('checked', 'checked');
			$("input:radio[name='"+RadioName+"_"+i+"']").attr('disabled', '');
		}

	}

}

function ClosePolicyDialog(MoveNext)
{
	NewDialogClose();

	$("#jquery_jplayer_1").jPlayer("stop");

	if (MoveNext==2)
	{
		$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
		if (selectedPageID<MaxModulePage)
		{
			if (ModulePageViewableArray[selectedPageID+1]!=1)
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
		//load audio file back
		if (CourseMode=="Video") {
			$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: IntroAudio });
			isPlay = 1;
			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
		}
	}
}

function OpenNext()
{
	var PolicyResult = 0;

	for (i=1; i<=RadioCount; i++)
	{
		if ( (typeof $("input:radio[name='"+RadioName+"_"+i+"']:checked").val() =="undefined") && (PolicyResult==0) )
		{
			PolicyResult = 2;
		}

		if ( ( $("input:radio[name='"+RadioName+"_"+i+"']:checked").val() !== RadioValue ) && (PolicyResult==0) )
		{
			PolicyResult = 1;
		}
	}

	if ( PolicyResult==0) //correct, unlock and resume course -- Success
	{
		if ((CourseMode=="Video") && (typeof SuccessBox.attr("AudioFile") !=="undefined")) {
			$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: SuccessBox.attr("AudioFile") }).jPlayer("play");
			isPlay = 1;
			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
		}

		//unlock forward button
		$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
		if (selectedPageID<MaxModulePage)
		{
			if (ModulePageViewableArray[selectedPageID+1]!=1)
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

		if (UseDialog=="yes")
		{
			NewDialog(SuccessBox.attr("Top"),SuccessBox.attr("Left"),SuccessBox.attr("Width"),SuccessBox.attr("Height"),SuccessBox.attr("BgAudio"), SuccessHeader.text(),SuccessBox.text() + PolicySuccessBoxButton, false);
		} else
		{
			$("#"+FeedBackDiv).html( SuccessBox.text() );
		}


	} else
	if ( PolicyResult==1) //not all is answered yes -- Invalid
	{
		if ((CourseMode=="Video") && (typeof InvalidBox.attr("AudioFile") !=="undefined")) {
			$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: InvalidBox.attr("AudioFile") }).jPlayer("play");
			isPlay = 1;
			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
		}

		if (UseDialog=="yes")
		{
			NewDialog(InvalidBox.attr("Top"),InvalidBox.attr("Left"),InvalidBox.attr("Width"),InvalidBox.attr("Height"),InvalidBox.attr("BgAudio"), InvalidHeader.text(),InvalidBox.text() + PolicyInvalidBoxButton, false);
		} else
		{
			$("#"+FeedBackDiv).html( InvalidBox.text() );
		}

	} else
	if ( PolicyResult==2) //not all fields have an answer -- Incomplete
	{
		if ((CourseMode=="Video") && (typeof IncompleteBox.attr("AudioFile") !=="undefined")) {
			$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: IncompleteBox.attr("AudioFile") }).jPlayer("play");
			isPlay = 1;
			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
		}

		if (UseDialog=="yes")
		{
			NewDialog(IncompleteBox.attr("Top"),IncompleteBox.attr("Left"),IncompleteBox.attr("Width"),IncompleteBox.attr("Height"),IncompleteBox.attr("BgAudio"), IncompleteHeader.text(),IncompleteBox.text() + PolicyIncompleteBoxButton, false);
		} else
		{
			$("#"+FeedBackDiv).html( IncompleteBox.text() );
		}

	}
}

//------------------------------------------------------------------------------------------------------------------
function DrawPolicy()
{
	$("#ajax-loading-graph").hide();

	DrawAllPolicy();

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

						ThePageElements = $(this).find("Element");

						//Load Page Text Fields into Arrays
						MaxPolicyPageTextCount = 0;

						RadioCount = $(this).attr("RadioCount");
						RadioValue = $(this).attr("RadioValue");
						RadioName = $(this).attr("RadioName");

						UseDialog = $(this).attr("UseDialog");
						if (typeof UseDialog =="undefined") { UseDialog="yes"; };

						FeedBackDiv = $(this).attr("FeedBackDiv");
						if (typeof FeedBackDiv =="undefined") { FeedBackDiv="NotAvail"; };

						IncompleteHeader = $(this).find("IncompleteHeader");
						SuccessHeader = $(this).find("SuccessHeader");
						InvalidHeader = $(this).find("InvalidHeader");

						IncompleteBox = $(this).find("IncompleteBox");
						SuccessBox = $(this).find("SuccessBox");
						InvalidBox = $(this).find("InvalidBox");
						IntroAudio = $(this).attr("AudioFile");

						BackgroundAudio = $(this).attr("BackgroundAudioFile");
						if (CourseMode=="Video") {
							$("#Background_Audio_Player").jPlayer("setMedia", { mp3: BackgroundAudio }).jPlayer("play");
							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
						}


						ThePageElements.each(function() {
							MaxPolicyPageTextCount++;
							PolicyPageTextArray[MaxPolicyPageTextCount] = $(this).text();
							PolicyPageTextArrayTop[MaxPolicyPageTextCount] = $(this).attr("Top");
							PolicyPageTextArrayLeft[MaxPolicyPageTextCount] = $(this).attr("Left");
							PolicyPageTextArrayWidth[MaxPolicyPageTextCount] = $(this).attr("Width");
							PolicyPageTextArrayHeight[MaxPolicyPageTextCount] = $(this).attr("Height");

							var str1=$(this).attr("HasCheck");
							if (typeof str1 ==="undefined") { str1="false";}
							PolicyPageTextArrayCheck[MaxPolicyPageTextCount] = str1.toLowerCase() === 'true';

						});
						CurrentPolicyTextFrame=0;
						CurrentPolicyPosition=0;

						if (CourseMode=="Video") {
							$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: IntroAudio }).jPlayer("play");
							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
						}
						DrawAllPolicy();
					}
				});
			}
		});
	});
}


