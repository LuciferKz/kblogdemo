export default function dfsPreTreeEach(tree, func) {
  let node,
    nodes = tree.slice();
  while ((node = nodes.shift())) {
    func(node);
    if (node.children && node.children.length) {
      nodes.unshift(...node.children);
    }
  }
}
