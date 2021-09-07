class Node {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.shape = {
      type: 'rect',
      size: [w || 80, h || 50],
      style: {
        stroke: '#00678a',
        fill: '#eee',
        lineWidth: 2,
      }
    };
    this.anchorMatrix = [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]];
    this.vueComponent = null;
    this.props = {};
    this.data = {};
    this.event = true;
  }
  setPos(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  setShape(shape) {
    this.shape = shape;
    return this;
  }

  setAnchor(t, r, b, l) {
    const _t = [0.5, 0], _r = [1, 0.5], _b = [0.5, 0], _l = [0.5, 0];
    let anchors = [];
    if (t) anchors.push(_t);
    if (r) anchors.push(_r);
    if (b) anchors.push(_b);
    if (l) anchors.push(_l);
    this.anchorMatrix = anchors;
    return this;
  }

  setData(data) {
    this.data = data;
    return this;
  }

  setComponent(c , props) {
    this.vueComponent = c;
    this.props.vue = { props };
    return this;
  }
}

export default (x, y, w, h) => {
  return new Node(x, y, w, h);
}