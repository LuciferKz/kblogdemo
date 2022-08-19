import $k from "./index";

const newElement = function (elm, refs) {
  let k = $k(elm.dom ? elm.dom : document.createElement(elm.tag));
  refs = refs || {};

  elm.attrs && k.attrs(elm.attrs);
  elm.props && k.props(elm.props);
  elm.style && k.css(elm.style);
  elm.data && k.data(elm.data);
  elm.content && k.html(elm.content);

  for (let evt in elm.evts) {
    k.on(evt, elm.evts[evt]);
  }

  elm.children &&
    elm.children.forEach((child) => {
      k.append(newElement(child, refs));
    });

  elm.ref && (refs[elm.ref] = k);
  return k;
};

export default newElement;
