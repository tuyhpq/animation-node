/**
 * To extract data from html
 */
exports.extractDataFromHtml = function (data, start, end, native = false) {
    var startPosition = data.indexOf(start) + (native ? 0 : start.length)
    var endPosition = data.indexOf(end, startPosition + 1)

    return data.slice(startPosition, endPosition)
}