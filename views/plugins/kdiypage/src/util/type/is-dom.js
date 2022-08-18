const isDom = typeof HTMLElement === 'object' ? function(obj) { return obj instanceof HTMLElement; }: function(obj){ return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'; };

export default isDom