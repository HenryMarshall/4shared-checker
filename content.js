
$("#content-holder").prepend("<button id='my_validate'>validate</button>")

$("#my_validate").on("click", function(e) {
  e.preventDefault()
  console.log("validate button clicked")
  getAllResults()
})

function getAllResults() {
  $(".gsc-table-result a.gs-title").each(function(index) {
    var href = $(this).attr("href")
    if (/4shared\.com/.test(href)) {
      console.log("href: ", href)
    }
  })
}

console.log("initialized")
