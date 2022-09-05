export default function bfsTreeEach(tree, func) {
  let node,
    nodes = tree.slice();
  while ((node = nodes.shift())) {
    func(node);
    if (node.children && node.children.length) {
      nodes.push(...node.children);
    }
  }
}
