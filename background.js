chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("received message")
    if (request.message === "validate_link") {
      getText(request.url)
    }
  }
)

function getText(url) {
  console.log("inside getText", url)
  $.ajax({
    url: url,
    dataType: "html",
    success: function(response, status) {
      console.groupCollapsed("response: " + url)
      console.log(response)
      console.groupEnd()
    },
    error: function(error) {
      console.group("error: " + url)
      console.log(error)
      console.groupEnd()
    }
  })
}

