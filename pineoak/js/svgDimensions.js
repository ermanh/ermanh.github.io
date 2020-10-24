// var d3 = require('d3')

function getWidth (baseWords, parallelWords, widthBetweenWords, fontSpec, tagFontSpec) {
  var adjustment = 15;
  var baseTextWidth = baseWords.reduce(function(accum, obj) {
    return accum + d3.max([getTextWidth(obj.word, fontSpec), getTextWidth(obj.tag, tagFontSpec)]);
  }, 0);
  var parallelTextWidth = parallelWords.reduce(function(accum, obj) {
    return accum + d3.max([getTextWidth(obj.word, fontSpec), getTextWidth(obj.tag, tagFontSpec)]);
  }, 0);

  var baseTotalLength = baseTextWidth + baseWords.length * widthBetweenWords * 2 + adjustment;
  var parallelTotalLength = parallelTextWidth + parallelWords.length * widthBetweenWords * 2 + adjustment;

  var width = d3.max([baseTotalLength, parallelTotalLength]);
  var baseOrParallelLonger = width === baseTotalLength ? 'base' : 'parallel';
  var longerBy = Math.abs(baseTotalLength - parallelTotalLength);
  return { width: width, baseOrParallelLonger: baseOrParallelLonger, longerBy: longerBy };
}

function getHeight (baseWords, parallelWords, parallelIsEmpty, mainSentenceHeight, alignmentsHeight, singleLineHeight, singleDeprelHeight, firstDeprelHeight, treetopSpace) {
  var baseLayersArr = baseWords.map(function(obj) { return Object.keys(obj).length - 1; });
  var parallelLayersArr = parallelWords.map(function(obj) { return Object.keys(obj).length - 1; });

  var baseMaxLayers = d3.max(baseLayersArr);
  var parallelMaxLayers = d3.max(parallelLayersArr);

  var lineLayers = d3.max([baseMaxLayers, parallelMaxLayers]);
  var deprelLayers = parallelIsEmpty ? baseWords.length - 2 : baseWords.length - 2 + parallelWords.length - 2;

  // double the following if parallel sentence is NOT empty
  lineLayers = parallelIsEmpty ? lineLayers : lineLayers * 2;
  firstDeprelHeight = parallelIsEmpty ? firstDeprelHeight : firstDeprelHeight * 2;
  treetopSpace = parallelIsEmpty ? treetopSpace : treetopSpace * 2;
  mainSentenceHeight = parallelIsEmpty ? mainSentenceHeight : mainSentenceHeight * 2;
  alignmentsHeight = parallelIsEmpty ? 0 : alignmentsHeight;

  var lines = singleLineHeight * lineLayers;
  var deprels = singleDeprelHeight * deprelLayers + firstDeprelHeight;

  var height = lines + deprels + alignmentsHeight + treetopSpace + mainSentenceHeight;
  return height;
}

function getTextWidth (text, font) {
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
  var context = canvas.getContext('2d');
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}

function getAlignmentStartY (words, firstDeprelHeight, singleDeprelHeight, singleLineHeight, lineWordProperties, treetopSpace) {
  var treeHeight = firstDeprelHeight + (words.length - 1) * singleDeprelHeight;
  var linesHeight = lineWordProperties * singleLineHeight;
  return treeHeight + linesHeight + singleLineHeight + treetopSpace;
}
