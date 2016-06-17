
$("#content-holder").prepend("<button id='my_validate'>validate</button>")

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("message received")

    if (request.message === "validated_link") {
      console.log("received request: ", request)
      var newColor = request.isValid ? "green" : "red"
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
  chrome.runtime.sendMessage({
    message: "validate_link",
    url: href
  })
}
