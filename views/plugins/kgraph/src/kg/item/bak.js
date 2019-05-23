
    if (startEdge === 'left') {
      if (!endEdge) {
        if (quadrant === 2 || quadrant === 3) {
          points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
          points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
        } else if (quadrant === 1 || quadrant === 4) {
          points.push({ x: x1, y: y2 })
        }
      } else if (quadrant === 2) {
        if (endEdge === 'left') {
          points.push({ x: x2, y: y1 })
          points.push({ x: x2, y: y2 })
        } else if (endEdge === 'top') {
          points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
          points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
        } else if (endEdge === 'right') {
          points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
          points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
        } else if (endEdge === 'bottom') {
          points.push({ x: x2, y: y1 })
        }
      } else if (quadrant === 1) {
        if (endEdge === 'left') {
          points.push({ x: x1, y: y1 })
          points.push({ x: x1, y: y2 })
        } else if (endEdge === 'top') {
          points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
          points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
        } else if (endEdge === 'right') {
          points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
          points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
        } else if (endEdge === 'bottom') {
          points.push({ x: x2, y: y1 })
        }
      } 
    } else if (startEdge === 'top') {
      if (!endEdge) {
        if (quadrant === 1 || quadrant === 2) {
          points.push({ x: x1, y: y2 + (y1 - y2) / 2 })
          points.push({ x: x2, y: y2 + (y1 - y2) / 2 })
        } else if (quadrant === 3 || quadrant === 4) {
          points.push({ x: x2, y: y1 })
        }
      } else if (endEdge === 'left') {
        points.push({ x: x2, y: y1 })
        points.push({ x: x2, y: y2 })
      } else if (endEdge === 'top') {
        points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
        points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
      } else if (endEdge === 'right') {
        points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
        points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x2, y: y1 })
      }
    } else if (startEdge === 'right') {
      if (!endEdge) {
        if (quadrant === 1 || quadrant === 4) {
          points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
          points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
        } else if (quadrant === 2 || quadrant === 3) {
          points.push({ x: x1, y: y2 })
        }
      } else if (endEdge === 'left') {
        points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
        points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
      } else if (endEdge === 'top') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'right') {
        points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
        points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x2, y: y1 })
        points.push({ x: x2, y: y2 })
      }
    } else if (startEdge === 'bottom') {
      if (!endEdge) {
        if (quadrant === 3 || quadrant === 4) {
          points.push({ x: x1, y: y2 + (y1 - y2) / 2 })
          points.push({ x: x2, y: y2 + (y1 - y2) / 2 })
        } else if (quadrant === 1 || quadrant === 2) {
          points.push({ x: x2, y: y1 })
        }
      } else if (endEdge === 'left') {
        points.push({ x: x2, y: y1 })
        points.push({ x: x2, y: y2 })
      } else if (endEdge === 'top') {
        points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
        points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
      } else if (endEdge === 'right') {
        points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
        points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x2, y: y1 })
      }
    }











