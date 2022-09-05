export default function dfsPostTreeEach(tree, func) {
  let node,
    nodes = tree.slice();
  let temp = new Map();
  while ((node = nodes[0])) {
    let childLength = node.children ? node.children.length : 0;
    if (childLength && !temp.has(node.id)) {
      nodes.unshift(...node.children);
    }
    if (!childLength || temp.has(node.id)) {
      func(node);
      nodes.shift();
      temp.delete(node.id);
    }
    temp.set(node.id);
  }
}
