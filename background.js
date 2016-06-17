console.log("chrome.runtime: ", chrome.runtime.onMessage)

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

function getText(url, callback) {
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
  console.log("result sent")
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
  // <img class="foo"/>
  var reg = /<.+\sclass\s*=\s*['"][^'"]*\bwarn\b(?:['"]|\s[^'"]*['"]).*?\/?>/
  return !reg.test(html)
}

