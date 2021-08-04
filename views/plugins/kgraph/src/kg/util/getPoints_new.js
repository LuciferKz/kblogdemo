// 获取起始锚点处于节点的哪个位置
const inEdge = function () {
  let m1 = m[0]
  let m2 = m[1]

  if (m1 === m2 && m1 === 0) {
    return 'corner'
  } 
  if (m1 < 0.5 && (m1 >= m2 || m1 >= m2 - 0.5)) {
    return 'left'
  }
  if (m1 > 0.5 && (m1 - 0.5 >= m2 || m1 - 0.5 >= m2 - 0.5)) {
    return  'right'
  }
  if (m2 < 0.5 && (m1 <= m2 || m1 - 0.5 <= m2)) {
    return 'top'
  }
  if (m2 > 0.5 && (m1 - 0.5 <= m2 || m1 - 0.5 <= m2 - 0.5)) {
    return 'bottom'
  }
  return false
}

export default function (startMatrix, endMatrix, startPoint, endPoint, arrow) {
  console.log(startMatrix, endMatrix, startPoint, endPoint, arrow)










}