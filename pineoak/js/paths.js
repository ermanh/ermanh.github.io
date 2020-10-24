function adjustPathTopLength (deprelLayer) {
  var start = 0.6;
  var max = 0.9;
  var adjustment = start + 0.05 * (deprelLayer - 1);
  adjustment = (adjustment > max) ? max : adjustment;
  return adjustment;
}

function getPath (deprelObj, fromElem, toElem, upOrDown, singleDeprelHeight, firstDeprelHeight) {
  var fromOrder = parseInt(fromElem.attr('order'));
  var fromStart = parseFloat(fromElem.select('text.word').attr('x'));
  var fromWidth = parseFloat(fromElem.attr('wordGroupWidth'));
  var toOrder = parseInt(toElem.attr('order'));
  var toStart = parseFloat(toElem.select('text.word').attr('x'));
  var toWidth = parseFloat(toElem.attr('wordGroupWidth'));
  var xReverse = fromOrder > toOrder;
  var xDirection = xReverse ? -1 : 1;
  var yDirection = (upOrDown === 'up') ? -1 : 1;

  var fromMidPoint = fromStart + fromWidth / 2;
  var toMidPoint = toStart + toWidth / 2;
  var midPointsLength = Math.abs(fromMidPoint - toMidPoint);

  var pathStartX = xReverse ? toMidPoint : fromMidPoint;
  var pathEndX = xReverse ? fromMidPoint : toMidPoint;
  var pathStartEndY = parseFloat(fromElem.select('text.word').attr('y'));
  pathStartEndY = (yDirection === 1) ? pathStartEndY + 10 : pathStartEndY - 20;

  var deprelLayer = Math.abs(fromOrder - toOrder);
  var pathHeight = (deprelLayer === 1) ? firstDeprelHeight - (singleDeprelHeight / 2) : firstDeprelHeight + singleDeprelHeight * (deprelLayer - 1) - singleDeprelHeight / 2;
  var pathTopY = pathStartEndY + yDirection * pathHeight;
  var pathTopLength = Math.abs(toMidPoint - fromMidPoint) * adjustPathTopLength(deprelLayer);
  var diagonalXLength = (midPointsLength - pathTopLength) / 2;

  var distanceAtoB = 10 * deprelLayer; // also the hypotenuse when calculating with sin/cos
  var pathBezierAngle = Math.atan(diagonalXLength / pathHeight);
  var pathStartBezierBX = xReverse ? pathStartX + diagonalXLength : pathStartX + diagonalXLength * xDirection;
  var pathStartBezierCX = xReverse ? pathStartBezierBX + distanceAtoB : pathStartBezierBX + distanceAtoB * xDirection;
  var pathStartBezierAX = xReverse ? pathStartBezierBX - Math.sin(pathBezierAngle) * distanceAtoB : pathStartBezierBX - Math.sin(pathBezierAngle) * distanceAtoB * xDirection;
  var pathStartBezierAY = pathTopY + Math.cos(pathBezierAngle) * distanceAtoB * yDirection * -1;

  var pathEndBezierBX = xReverse ? pathEndX - ((midPointsLength - pathTopLength) / 2) : pathEndX - (midPointsLength - pathTopLength) / 2 * xDirection;
  var pathEndBezierAX = xReverse ? pathEndBezierBX - distanceAtoB : pathEndBezierBX - distanceAtoB * xDirection;
  var pathEndBezierCX = xReverse ? pathEndBezierBX + Math.sin(pathBezierAngle) * distanceAtoB : pathEndBezierBX + Math.sin(pathBezierAngle) * distanceAtoB * xDirection;
  var pathEndBezierCY = pathStartBezierAY;

  var path = 'M' + pathStartX + ',' + pathStartEndY;
  path += ' L' + pathStartBezierAX + ',' + pathStartBezierAY;
  path += ' Q' + pathStartBezierBX + ',' + pathTopY + ' ' + pathStartBezierCX + ',' + pathTopY;
  path += ' L' + pathEndBezierAX + ',' + pathTopY;
  path += ' Q' + pathEndBezierBX + ',' + pathTopY + ' ' + pathEndBezierCX + ',' + pathEndBezierCY;
  path += ' L' + pathEndX + ',' + pathStartEndY;

  deprelObj.pathD = path;
  deprelObj.topY = pathTopY;
  deprelObj.topMidPointX = pathStartX + Math.abs(pathEndX - pathStartX) / 2;
  deprelObj.arrowTipX = xReverse ? pathStartX : pathEndX;
  deprelObj.arrowTipY = pathStartEndY;
  deprelObj.pathAngleFromXAxis = Math.PI / 2 - pathBezierAngle;
  deprelObj.pointsLeft = xReverse;
  deprelObj.pointsUp = (upOrDown === 'up');

  return path;
}

function getDeprelPathArrow (deprelObj, pointsLeft, pointsUp) {
  // arrow shape of ➤  // A is the tip in front ◀ ▶
  // B, C are the outward points in the back (B is the one closer to the x-axis)
  // D is the inner corner in the back
  // E is the midpoint on a line drawn between B and C, behind D (not part of the arrow, but needed for calculation)
  var xDirection = pointsLeft ? 1 : -1;
  var yDirection = pointsUp ? 1 : -1;
  var angle = deprelObj.pathAngleFromXAxis;
  var angleInnerHalf = Math.PI / 8.8;
  var A = { x: deprelObj.arrowTipX, y: deprelObj.arrowTipY };
  var AE = 7.5;
  var AD = AE / 1.8;
  var D = { x: A.x + Math.cos(angle) * AD * xDirection, y: A.y - Math.sin(angle) * AD * yDirection };
  var AB = AE / Math.cos(angleInnerHalf);
  var AC = AB;
  var B = { x: A.x + Math.cos(angle - angleInnerHalf) * AB * xDirection, y: A.y - Math.sin(angle - angleInnerHalf) * AB * yDirection };
  var C;
  if (angle + angleInnerHalf === 90) {
    C = { x: A.x, y: A.y - AC * yDirection };
  } else if (angle + angleInnerHalf < 90) {
    C = { x: A.x + Math.cos(angle + angleInnerHalf) * AC * xDirection, y: A.y - Math.sin(angle + angleInnerHalf) * AC * yDirection };
  } else {
    C = { x: A.x - Math.cos(180 - (angle + angleInnerHalf)) * AC * xDirection, y: A.y - Math.sin(180 - (angle + angleInnerHalf)) * AC * yDirection };
  }

  var path = 'M' + A.x + ',' + A.y + ' L' + B.x + ',' + B.y;
  path += ' L' + D.x + ',' + D.y + ' L' + C.x + ',' + C.y + ' Z';
  return path;
}

function getAlignmentPath (fromElem, toElem, upOrDown, alignmentsStartY, alignmentsHeight) {
  var adjustment = 4;
  var fromStartX = fromElem ? parseFloat(fromElem.select('text.word').attr('x')) : 0;
  var fromWidth = fromElem ? parseFloat(fromElem.attr('wordGroupWidth')) : 0;
  var toStartX = toElem ? parseFloat(toElem.select('text.word').attr('x')) : 0;
  var toWidth = toElem ? parseFloat(toElem.attr('wordGroupWidth')) : 0;
  var isBase = (upOrDown === 'up') ? 0 : 1;
  var isParallel = (upOrDown === 'up') ? 1 : 0;
  var fromCoord = { x: fromStartX + fromWidth / 2, y: alignmentsStartY + alignmentsHeight * isBase };
  var toCoord = { x: toStartX + toWidth / 2, y: alignmentsStartY + alignmentsHeight * isParallel + adjustment };
  var path = 'M' + fromCoord.x + ',' + fromCoord.y + ' L' + toCoord.x + ',' + toCoord.y;
  return toElem && fromElem ? path : '';
}
