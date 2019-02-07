// Inject JavaScript into current website
chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.executeScript(tab.ib, {
		file: 'logic.js'
	});
});