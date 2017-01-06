/**
 * Listens for the app launching then creates the window
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('components/_element_/_type_/index.html', {
    bounds: {
      width: 1024,
      height: 800
    }
  });
});
