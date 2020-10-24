var boxPaddingLeft = 3.5;
var boxPaddingRight = 3.5;
var boxPaddingTop = 4;
var boxPaddingBottom = 3.5;
var boxWidthAdjustment = 3;

function getLabelX (deprelObj, getTextWidth, fontSpec) {
  var deprelText = deprelObj.deprel;
  var textWidth = getTextWidth(deprelText, fontSpec);
  var midPoint = parseFloat(deprelObj.topMidPointX);
  var textX = midPoint - textWidth / 2 + 1;
  var boxX = textX - boxPaddingLeft - 1;
  var boxWidth = textWidth + boxPaddingLeft + boxPaddingRight + boxWidthAdjustment;
  return {
    textX: textX,
    boxX: boxX,
    boxWidth: boxWidth
  };
}

function getLabelY (deprelObj, deprelTextHeight) {
  var yAdjust = 1;
  var topY = parseFloat(deprelObj.topY);
  var textY = topY + deprelTextHeight / 2 - yAdjust;
  var boxY = topY - boxPaddingTop - boxPaddingBottom - yAdjust;
  var boxHeight = deprelTextHeight + boxPaddingTop + boxPaddingBottom;
  return {
    textY: textY,
    boxY: boxY,
    boxHeight: boxHeight
  };
}
