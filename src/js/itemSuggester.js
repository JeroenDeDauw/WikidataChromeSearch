/**
 * @since 1.0
 *
 * @file
 * @ingroup WikidataChromeSearch
 *
 * @licence GNU GPL v2+
 * @author Jeroen De Dauw < jeroendedauw@gmail.com >
 */

chrome.omnibox.onInputChanged.addListener(
	function(text, suggest) {
		findMatchingEntities(
			text,
			function( foundEntities ) {
				suggest( getSuggestionsForEntities( foundEntities ) );
			}
		);
	}
);

function findMatchingEntities(query, callback) {
	var url = "https://www.wikidata.org/w/api.php?"
		+ "action=wbsearchentities&format=json&language=en&type=item&continue=0&limit="
		+ ( localStorage["wikidataSearchMaxSuggestionCount"] || 3 )
		+ "&search=" + encodeURIComponent( query );

	var req = new XMLHttpRequest();
	req.open("GET", url, true);

	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			var results = JSON.parse(req.response);
			callback(results.search);
		}
	};

	req.send(null);
	return req;
}

function getSuggestionsForEntities( foundEntities ) {
	var suggestions = [];

	for ( var i in foundEntities ) {
		if ( foundEntities.hasOwnProperty( i ) ) {
			var entity = foundEntities[i];
			var description = entity.label;

			if ( entity.description ) {
				description += ' - ' + entity.description;
			}

			suggestions.push( {
				"content": 'https:' + entity.url,
				"description": description
			} );
		}
	}

	return suggestions;
}

chrome.omnibox.onInputEntered.addListener(
	function(searchTermOrUrl) {
		if ( searchTermOrUrl.indexOf( 'https://www.wikidata.org/wiki/' ) === 0 ) {
			navigate(searchTermOrUrl);
		}
		else {
			navigate(
				'https://www.wikidata.org/wiki/Special:Search?search='
					+ encodeURIComponent( searchTermOrUrl )
			);
		}
	}
);

function navigate(url) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.update(tab.id, {url: url});
	});
}