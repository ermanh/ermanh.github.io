// var d3 = require('d3')

function getWordsWithDimensions (wordsList, fontSpec, tagFontSpec, widthBetweenWords, getTextWidth, baseOrParallel, baseOrParallelLonger, longerBy) {
  var words = wordsList.sort(function(a, b) { return a.order - b.order; });
  var wordGroupStart = (baseOrParallel === baseOrParallelLonger) ? 15 : longerBy / 2 + 15;
  words.forEach(function(obj) {
    obj.treeLayers = words.length - 1;
    obj.wordGroupStart = wordGroupStart;
    var maxWidth = d3.max([getTextWidth(obj.word, fontSpec), getTextWidth(obj.tag, tagFontSpec)]);
    obj.wordGroupWidth = maxWidth;
    wordGroupStart += maxWidth + widthBetweenWords * 2;
  });
  return words;
}
