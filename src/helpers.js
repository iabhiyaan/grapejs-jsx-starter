export function checkFileExist(urlToFile) {
   var xhr = new XMLHttpRequest()
   xhr.open('HEAD', urlToFile, false)
   xhr.send()
   return xhr.status == '404' ? false : true
}
