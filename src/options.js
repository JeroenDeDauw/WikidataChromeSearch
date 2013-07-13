document.querySelector('#save').addEventListener(
	'click',
	function() {
		saveOptions();
	}
);

getCountElement().addEventListener(
	"keydown",
	function( event ) {
		if ( event.keyCode == '13' ) {
			saveOptions();
		}
	}
);

document.addEventListener(
	'DOMContentLoaded',
	function() {
		initializeI18n();
		restoreOptions();
	}
);

function saveOptions() {
	var maxSuggestionCount = parseInt( getCountValue() );
	setCountValue( maxSuggestionCount );

	localStorage["wikidataSearchMaxSuggestionCount"] = maxSuggestionCount;

	var status = document.getElementById("status");
	status.innerHTML = chrome.i18n.getMessage("optionsSaved");

	setTimeout(function() {
		status.innerHTML = "";
	}, 2000);
}

function initializeI18n() {
	document.title = chrome.i18n.getMessage("extensionOptions");
	document.getElementById("maxSuggestionsText" ).innerText = chrome.i18n.getMessage("maxSuggestions");
}

function restoreOptions() {
	var maxSuggestionCount = localStorage["wikidataSearchMaxSuggestionCount"];

	if (!maxSuggestionCount) {
		maxSuggestionCount = 3;
	}

	setCountValue( maxSuggestionCount );
}

function getCountElement() {
	return document.getElementById("maxSuggestionCount" );
}

function getCountValue() {
	return getCountElement().value;
}

function setCountValue( value ) {
	return getCountElement().value = value;
}
