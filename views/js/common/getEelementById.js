function getElementById (node, id) {
  while (node) {
    if (node.id === id) return node
    node = nextElement(node)
  }
}

function nextElement (node) {
  if (node.childNodes.length) {
    return node.childNodes[0]
  } else if (node.nextSibling) {
    return node.nextSibling
  }

  while (node.parentNode) {
    if (node.parentNode.nextSibling) {
      return node.parentNode.nextSibling
    }
    node = node.parentNode
  }

  return null
}