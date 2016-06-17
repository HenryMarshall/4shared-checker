attemptSetupListener()

function attemptSetupListener() {
  // sometimes this is undefined on initial load because of a chrome bug
  if (chrome.runtime.onMessage) {
    console.log("successfully initialized")
    setupListener()
  }
  else {
    var errorMessage = "chrome.runtime.onMessage undefined\nsee: "
    errorMessage    += "http://stackoverflow.com/questions/36645615/chrome-runtime-onmessage-undefined-in-background-script-chrome-extension"
    console.error(errorMessage)
  }
}

// set up listeners to permit communication from content
function setupListener() {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message === "validate_link") {
        getText(request.url, function(response) {
          var isValid = checkForError(response)
          notifyContent(request.url, isValid)
        })
      }
    }
  )
}

function getText(url, callback) {
  // we can do cross site requests to sites in in manifest.json `permissions`
  // this is *not* permitted in content threads
  $.ajax({
    url: url,
    dataType: "html",
    success: callback,
    error: function(error) {
      console.error(url, error)
    }
  })
}

function notifyContent(url, isValid) {
  // to communicate back to the content we need to find the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var activeTab = tabs[0]
    chrome.tabs.sendMessage(
      activeTab.id,
      {
        message: "validated_link",
        isValid: isValid,
        url: url
      }
    )
  })
}

function checkForError(html) {
  // // matches these:
  // <img class = "warn" />
  // <div class="warn"></div>
  // <span class="warn foo"></span>
  // <div class='warn'></div>
  // <div id="bar" class="warn" data-attr="foo"></div>
  // // but not these:
  // <div class="warning"></div>
  // <div class="ultrawarn"></div>
  // <img class="foo"/>
  var reg = /<.+\sclass\s*=\s*['"][^'"]*\bwarn\b(?:['"]|\s[^'"]*['"]).*?\/?>/
  return !reg.test(html)
}

