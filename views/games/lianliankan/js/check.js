var checkLink = (function () {
    var matrix, focusPic,
        startMatrix = {}, stopMatrix = {},
        startPicture, stopPicture,
        pictureWidth, pictureHeight,
        originalTop, originalLeft,
        offsetsX, offsetsY,
        rowCount, colCount;
    //获取对象上方有多少空位
    var getTopBlockRow = function (r, c) {
        var jBlockRow = {},
        i = r - 1, min = -1;
        while (i >= min) {
            if (matrix[i]) {
                if (matrix[i][c]) {
                    break;
                }
            }
            jBlockRow[i] = {};
            jBlockRow[i].x = c;
            jBlockRow[i].y = i;
            i--
        }
        return jBlockRow;
    }
    //获取对象下方有多少空位
    var getBtmBlockRow = function (r, c) {
        var jBlockRow = {},
        i = r + 1, max = matrix.length + 1;
        while (i < max) {
            if (matrix[i]) {
                if (matrix[i][c]) {
                    break;
                }
            }
            jBlockRow[i] = {};
            jBlockRow[i].x = c;
            jBlockRow[i].y = i;
            i++
        }
        return jBlockRow;
    }
    //获取对象左方有多少空位
    var getLeftBlockRow = function (r, c) {
        var jBlockRow = {},
        i = c - 1, min = -1;
        while (i >= min) {
            if (matrix[r][i]) {
                break;
            }
            jBlockRow[i] = {};
            jBlockRow[i].x = i;
            jBlockRow[i].y = r;
            i--
        }
        return jBlockRow;
    }
    //获取对象右方有多少空位
    var getRightBlockRow = function (r, c) {
        var jBlockRow = {},
        i = c + 1, max = matrix[0].length + 1
        while (i < max) {
            if (matrix[r][i]) {
                break;
            }
            jBlockRow[i] = {};
            jBlockRow[i].x = i;
            jBlockRow[i].y = r;
            i++;
        }
        return jBlockRow;
    }
    //检查行是否无线
    var checkRow = function (r, c, sc) {
        var col, targetCol,
            returnValue = true;
        if (c < sc) {
            col = c;
            targetCol = sc - 1;
        } else if (c > sc) {
            col = sc;
            targetCol = c - 1;
        }
        while (col < targetCol) {
            col++;
            if (matrix[r][col]) {
                returnValue = false;
                break;
            }
        }
        return returnValue;
    };

    var checkCol = function (c, r, sr) {
        var row, targetRow,
            returnValue = true;
        if (r < sr) {
            row = r;
            targetRow = sr - 1;
        } else if (r > sr) {
            row = sr;
            targetRow = r - 1;
        }
        while (row < targetRow) {
            row++;
            if (matrix[row][c]) {
                returnValue = false;
            }
        }
        return returnValue;
    };

    //根据对象图片和画线的方向来获取点坐标
    var getPoint = function (o, d) {
        var self = o,dir=d,
            newPoint = {};
        if (dir == "top") {
            newPoint.x = self.x + offsetsX;
            newPoint.y = self.y;
        } else if (dir == "bottom") {
            newPoint.x = self.x + offsetsX;
            newPoint.y = self.y + pictureHeight;
        } else if (dir == "left") {
            newPoint.x = self.x;
            newPoint.y = self.y + offsetsY;
        } else if (dir == "right") {
            newPoint.x = self.x + pictureWidth;
            newPoint.y = self.y + offsetsY;
        }
        return newPoint;
    }
    var getPointX = function (n) {
        return n * pictureWidth + originalLeft + offsetsX;
    }
    var getPointY = function (n) {
        return n * pictureHeight + originalTop + offsetsY;
    }

    var getPath = function (args) {
        var option = args || { startSide: "right", stopSide: "left", clearRow: 0, clearCol: 0, type: 1 };
        var path = { start: {}, stop: [] };
        path.start = getPoint(startPicture, option.startSide);
        if (option.type === 1) {
            path.stop.push({ x: startPicture.x + offsetsX, y: stopPicture.y + offsetsY });
        } else if (option.type === 2) {
            path.stop.push({ x: stopPicture.x + offsetsX, y: startPicture.y + offsetsY });
        } else if (option.type === 3) {
            path.stop.push({ x: startPicture.x + offsetsX, y: getPointY(option.clearRow) });
            path.stop.push({ x: stopPicture.x + offsetsX, y: getPointY(option.clearRow) });
        } else if (option.type === 4) {
            path.stop.push({ x: getPointX(option.clearCol), y: startPicture.y + offsetsY });
            path.stop.push({ x: getPointX(option.clearCol), y: stopPicture.y + offsetsY });
        } else if (option.type === 5) {

        }
        path.stop.push(getPoint(stopPicture, option.stopSide));
        return path;
    }
    var init = function (w, h, t, l, rs, cs) {
        pictureWidth = w;
        pictureHeight = h;
        originalTop = t;
        originalLeft = l;
        offsetsX = pictureWidth / 2;
        offsetsY = pictureHeight / 2;
        rowCount = rs;
        colCount = cs;
    };
    //判断是否配对
    var match = function (m, f) {
        matrix = m,focusPic = f;
        startPicture = focusPic[0], stopPicture = focusPic[1];
        var startRow = startPicture.row, stopRow = stopPicture.row,
        startCol = startPicture.col, stopCol = stopPicture.col;
        startMatrix = {}, stopMatrix = {};
        var row = 0, col = 0, startDir, stopDir;
        var returnValue = false;

        startMatrix.btm = getBtmBlockRow(startRow, startCol);
        startMatrix.top = getTopBlockRow(startRow, startCol);
        startMatrix.lft = getLeftBlockRow(startRow, startCol);
        startMatrix.rt = getRightBlockRow(startRow, startCol);
        stopMatrix.btm = getBtmBlockRow(stopRow, stopCol);
        stopMatrix.top = getTopBlockRow(stopRow, stopCol);
        stopMatrix.lft = getLeftBlockRow(stopRow, stopCol);
        stopMatrix.rt = getRightBlockRow(stopRow, stopCol);

        //console.log(startMatrix, stopMatrix);

        //相邻 同行 同列
        if (startRow === stopRow) {
            if (Math.abs(startCol - stopCol) === 1) {
                returnValue = true;
            } else if (checkRow(startRow, startCol, stopCol)) {
                if (startCol > stopCol) {
                    returnValue = getPath({ startSide: "left", stopSide: "right", type: 5 });
                } else if (startCol < stopCol) {
                    returnValue = getPath({ startSide: "right", stopSide: "left", type: 5 });
                }
            } else if (startRow === 0) {
                returnValue = getPath({ startSide: "top", stopSide: "top", clearRow: -1, type: 3 });
            } else if (startRow === rowCount - 1) {
                returnValue = getPath({ startSide: "bottom", stopSide: "bottom", clearRow: rowCount, type: 3 });
            }
        } else if (startCol === stopCol) {
            if (Math.abs(startRow - stopRow) === 1) {
                returnValue = true;
            } else if (checkCol(startCol, startRow, stopRow)) {
                if (startRow > stopRow) {
                    returnValue = getPath({ startSide: "top", stopSide: "bottom", type: 5 });
                } else if (startRow < stopRow) {
                    returnValue = getPath({ startSide: "bottom", stopSide: "top", type: 5 });
                }
            } else if (startCol === 0) {
                returnValue = getPath({ startSide: "left", stopSide: "left", clearCol: -1, type: 4 });
            } else if (startCol === colCount - 1) {
                returnValue = getPath({ startSide: "right", stopSide: "right", clearCol: colCount, type: 4 });
            }
        } 
        //一个转角
        if (startMatrix.btm[stopRow] && stopMatrix.lft[startCol]) {
            returnValue = getPath({ startSide: "bottom", stopSide: "left", type: 1 });
        } else if (startMatrix.btm[stopRow] && stopMatrix.rt[startCol]) {
            returnValue = getPath({ startSide: "bottom", stopSide: "right", type: 1 });
        } else if (startMatrix.top[stopRow] && stopMatrix.lft[startCol]) {
            returnValue = getPath({ startSide: "top", stopSide: "left", type: 1 });
        } else if (startMatrix.top[stopRow] && stopMatrix.rt[startCol]) {
            returnValue = getPath({ startSide: "top", stopSide: "right", type: 1 });
        } else if (startMatrix.rt[stopCol] && stopMatrix.btm[startRow]) {
            returnValue = getPath({ startSide: "right", stopSide: "bottom", type: 2 });
        } else if (startMatrix.rt[stopCol] && stopMatrix.top[startRow]) {
            returnValue = getPath({ startSide: "right", stopSide: "top", type: 2});
        } else if (startMatrix.lft[stopCol] && stopMatrix.btm[startRow]) {
            returnValue = getPath({ startSide: "left", stopSide: "bottom", type: 2 });
        } else if (startMatrix.lft[stopCol] && stopMatrix.top[startRow]) {
            returnValue = getPath({ startSide: "left", stopSide: "top", type: 2});
        }

        //两个转角或一条直线
        if (!returnValue) {
            returnValue = checkBottom(startRow + 1);
        }
        if (!returnValue) {
            returnValue = checkTop(startRow - 1);
        }
        if (!returnValue) {
            returnValue = checkLeft(startCol - 1);
        }
        if (!returnValue) {
            returnValue = checkRight(startCol + 1);
        }
        return returnValue;
    }
    var checkBottom = function (row) {
        if (startMatrix.btm[row]) {
            if (stopMatrix.top[row]) {
                if (checkRow(startMatrix.btm[row].y, startMatrix.btm[row].x, stopMatrix.top[row].x)) {
                    return getPath({ startSide: "bottom", stopSide: "top", clearRow: row, type: 3 });
                }
            } else if (stopMatrix.btm[row]) {
                if (row == rowCount) {
                    return getPath({ startSide: "bottom", stopSide: "bottom", clearRow: row, type: 3 });
                } else if (checkRow(startMatrix.btm[row].y, startMatrix.btm[row].x, stopMatrix.btm[row].x)) {
                    return getPath({ startSide: "bottom", stopSide: "bottom", clearRow: row, type: 3 });
                }
            }
            row++;
            return checkBottom(row);
        } else {
            return false;
        }
    }
    var checkTop = function (row) {
        if (startMatrix.top[row]) {
            if (stopMatrix.top[row]) {
                if (row == -1) {
                    return getPath({ startSide: "top", stopSide: "top", clearRow: row, type: 3 });
                } else if (checkRow(startMatrix.top[row].y, startMatrix.top[row].x, stopMatrix.top[row].x)) {
                    return getPath({ startSide: "top", stopSide: "top", clearRow: row, type: 3 });
                };
            } else if (stopMatrix.btm[row]) {
                if (checkRow(startMatrix.top[row].y, startMatrix.top[row].x, stopMatrix.btm[row].x)) {
                    return getPath({ startSide: "top", stopSide: "bottom", clearRow: row, type: 3 });
                }
            }
            row--;
            return checkTop(row);
        } else {
            return false;
        }
    }
    var checkLeft = function (col) {
        if (startMatrix.lft[col]) {
            if (stopMatrix.lft[col]) {
                if (col == -1) {
                    return getPath({ startSide: "left", stopSide: "left", clearCol: col, type: 4 });
                } else if (checkCol(startMatrix.lft[col].x, startMatrix.lft[col].y, stopMatrix.lft[col].y)) {
                    return getPath({ startSide: "left", stopSide: "left", clearCol: col, type: 4 });
                }
            } else if (stopMatrix.rt[col]) {
                if (checkCol(startMatrix.lft[col].x, startMatrix.lft[col].y, stopMatrix.rt[col].y)) {
                    return getPath({ startSide: "left", stopSide: "right", clearCol: col, type: 4 });
                }
            }
            col--;
            return checkLeft(col);
        } else {
            return false;
        }
    }
    var checkRight = function (col) {
        if (startMatrix.rt[col]) {
            if (stopMatrix.lft[col]) {
                if (checkCol(startMatrix.rt[col].x, startMatrix.rt[col].y, stopMatrix.lft[col].y)) {
                    return getPath({ startSide: "right", stopSide: "left", clearCol: col, type: 4 });
                }
            } else if (stopMatrix.rt[col]) {
                if (col == colCount) {
                    return getPath({ startSide: "right", stopSide: "right", clearCol: col, type: 4 });
                } else if (checkCol(startMatrix.rt[col].x, startMatrix.rt[col].y, stopMatrix.rt[col].y)) {
                    return getPath({ startSide: "right", stopSide: "right", clearCol: col, type: 4 });
                }
            }
            col++;
            return checkRight(col);
        } else {
            return false;
        }
    }

    var getMatrix = function () {
        return matrix;
    }
    var getStartPicture = function () {
        return startPicture;
    }
    var getStopPicture = function () {
        return stopPicture;
    }
    return {
        init: init,
        match: match,
        getMatrix:getMatrix,
        getStartPicture:getStartPicture,
        getStopPicture:getStopPicture
    };
}());