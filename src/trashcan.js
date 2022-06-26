"use strict";
function intersects(X, Y, r, rectX, rectY, rectWidth, rectHeight) {
    let circleDistancex = Math.abs(X - rectX);
    let circleDistancey = Math.abs(Y - rectY);
    if (circleDistancex > (rectWidth / 2 + r)) {
        return false;
    }
    if (circleDistancey > (rectHeight / 2 + r)) {
        return false;
    }
    if (circleDistancex <= (rectWidth / 2)) {
        return true;
    }
    if (circleDistancey <= (rectHeight / 2)) {
        return true;
    }
    let cornerDistanceSq = Math.sqrt(circleDistancex - rectWidth / 2) +
        Math.sqrt(circleDistancey - rectHeight / 2);
    return (cornerDistanceSq <= (Math.sqrt(r)));
}
//# sourceMappingURL=trashcan.js.map