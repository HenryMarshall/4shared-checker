
$("#content-holder").prepend("<button id='my_validate'>validate</button>")

// set up listeners to pemrit communication with background thread
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "validated_link") {
      var newColor = request.isValid ? "green" : "red"
      // I was unsuccessful passing the jquery object around directly so I just
      // refound the link by its href.
      $(`.gsc-table-result a.gs-title[href='${request.url}']`).css('color', newColor)
    }
  }
)

$("#my_validate").on("click", function(e) {
  e.preventDefault()
  console.log("validate button clicked")
  getAllResults()
})

function getAllResults() {
  $(".gsc-table-result a.gs-title").each(function(index) {
    var href = $(this).attr("href")
    if (/4shared\.com/.test(href)) {
      validateLink(href)
    }
  })
}

function validateLink(href) {
  // sending messages to the background is easy!
  chrome.runtime.sendMessage({
    // arbitrary object as payload
    message: "validate_link",
    url: href
  })
}
