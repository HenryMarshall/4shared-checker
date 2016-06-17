
$("#content-holder").prepend("<button id='my_validate'>validate</button>")

$("#my_validate").on("click", function(e) {
  e.preventDefault()
  console.log("validate button clicked")
  getAllResults()
  // chrome.runtime.sendMessage({ message: "clicked_validate" })
})

function getAllResults() {
  $(".gsc-table-result a.gs-title").each(function(index) {
    var href = $(this).attr("href")
    if (/4shared\.com/.test(href)) {
      validateLink(this, href)
    }
  })
}

function validateLink(link, href) {
  console.log("message sent")
  chrome.runtime.sendMessage({
    message: "validate_link",
    url: href
  })
}

console.log("initialized")
