import test from '../component/test.vue'

export const shapes = {
  // rect: {
  //   shape: {
  //     type: 'rect',
  //     size: [50, 50],
  //     style: {
  //       stroke: '#00678a',
  //       fill (ctx, cfg) {
  //         const gradient = ctx.createLinearGradient(cfg.x, cfg.y, cfg.x + cfg.width, cfg.y)
  //         gradient.addColorStop(0, "rgba(247, 83, 90, 1)")
  //         gradient.addColorStop(1, "rgba(247, 83, 90, 0.6)")
  //         return gradient
  //       },
  //       lineWidth: 2,
  //     },
  //   },
  //   stateShapeMap: {
  //     default: {
  //       type: 'rect',
  //       size: [50, 50],
  //       style: {
  //         stroke: '#00678a',
  //         // fill: '#eee',
  //         lineWidth: 2,
  //       }
  //     },
  //     hover: {
  //       type: 'rect',
  //       size: [50, 50],
  //       style: {
  //         stroke: '#00678a',
  //         // fill: '#000',
  //         lineWidth: 2,
  //       }
  //     }
  //   },
  //   props: {
  //     key: 'start',
  //     value: 'Start'
  //   },
  //   anchorMatrix: [[0.2, 0], [0.5, 0], [0.8, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
  //   anchorOffset: { 0: { x: -30, y: 0 } },
  //   label: '开始',
  //   labelCfg: {
  //     offsetY: 60,
  //     style: {
  //       color: '#F00',
  //       size: '14px'
  //     }
  //   },
  //   event: true
  // },
  rect2: {
    shape: {
      type: 'rect',
      size: [160, 100],
      style: {
        stroke: '#00678a',
        fill (ctx, cfg) {
          const gradient = ctx.createLinearGradient(cfg.x, cfg.y, cfg.x + cfg.width, cfg.y)
          gradient.addColorStop(0, "rgba(247, 83, 90, 1)")
          gradient.addColorStop(1, "rgba(247, 83, 90, 0.6)")
          return gradient
        },
        lineWidth: 2,
      },
    },
    props: {
      key: 'start',
      value: 'Start'
    },
    anchorMatrix: new Array(10).fill('').map(() => [Math.random(), Math.random()]),
    label: '开始',
    labelCfg: {
      offsetY: 60,
      style: {
        color: '#F00',
        size: '14px'
      }
    },
    event: true
  },
  vueElement: {
    shape: {
      type: 'rect',
      size: [200, 200],
      style: {
        stroke: '#000',
        fill: '#FFF',
        lineWidth: 2,
      },
    },
    anchorMatrix: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
    labelCfg: {
      hidden: false
    },
    event: true,
    vueComponent: test
  },
  table: {
    shape: {
      type: 'rect',
      size: [200, 200],
      style: {
        stroke: '#000',
        fill: '#FFF',
        lineWidth: 2,
      },
    },
    anchorMatrix: [[0.5, -0.05], [1.05, 0.5], [0.5, 1.05]],
    labelCfg: {
      hidden: true
    },
    event: true,
  },
  circle: {
    shape: {
      type: 'circle',
      size: 25,
      style: {
        stroke: '#00678a',
        fill (ctx, cfg) {
          const gradient = ctx.createLinearGradient(cfg.x, cfg.y, cfg.x + cfg.r, cfg.y)
          gradient.addColorStop(0, '#6552cf')
          gradient.addColorStop(1, "#765df6")
          return gradient
        },
        lineWidth: 2,
      }
    },
    props: {
      key: 'wait',
      value: 'wait'
    },
    anchorMatrix: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
    event: true
  },
  diamond: {
    shape: {
      type: 'diamond',
      size: [60, 60],
      style: {
        borderRadius: 10,
        stroke: '#00678a',
        fill (ctx, cfg) {
          const gradient = ctx.createLinearGradient(cfg.x, cfg.y, cfg.x + cfg.width, cfg.y)
          gradient.addColorStop(0, '#ef8c00')
          gradient.addColorStop(1, "#ffb700")
          return gradient
        },
        lineWidth: 2,
      }
    },
    props: {
      key: 'end',
      value: 'end'
    },
    anchorMatrix: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
    event: true
  },
  // edge: {
  //   shape : {
  //     type: 'polyline',
  //     style: {
  //       stroke: '#edeef4',
  //       lineWidth: 5
  //     }
  //   },
  //   stateShapeMap: {
  //     default: {
  //       type: 'polyline',
  //       style: {
  //         stroke: '#edeef4',
  //         lineWidth: 5
  //       }
  //     },
  //     hover: {
  //       style: {
  //         stroke: '#CCC'
  //       } 
  //     },
  //     focus: {
  //       style: {
  //         stroke: '#CCC'
  //       }
  //     }
  //   },
  //   label: 'Label',
  //   event: true,
  //   arrow: true,
  // },
  edge2: {
    shape : {
      type: 'polyline',
      style: {
        stroke: '#edeef4',
        lineWidth: 5
      }
    },
    stateShapeMap: {
      default: {
        type: 'polyline',
        style: {
          stroke: '#edeef4',
          lineWidth: 5
        }
      },
      hover: {
        style: {
          stroke: '#CCC'
        } 
      },
      focus: {
        style: {
          stroke: '#CCC'
        }
      }
    },
    label: 'Label',
    event: true,
  },
  // anchor: {
  //   shape: {
  //     size: 5,
  //     style: {
  //       lineWidth: 2,
  //       stroke: '#00678a',
  //       fill: '#FFF',
  //     }
  //   },
  //   stateShapeMap: {
  //     default: {
  //       size: 5,
  //       style: {
  //         lineWidth: 2,
  //         stroke: '#00678a',
  //         fill: '#FFF',
  //         transition: {
  //           property: ['size'],
  //           duration: 300
  //         }
  //       }
  //     },
  //     hover: {
  //       size: 10,
  //       style: {
  //         lineWidth: 2,
  //         stroke: '#CCC',
  //         fill: '#FFB2B2',
  //         transition: {
  //           property: ['size'],
  //           duration: 300
  //         }
  //       }
  //     }
  //   },
  //   arrow: true,
  //   eventWhenHidden: true,
  //   alwaysShow: false,
  //   eventArea: { r: 10 },
  //   event: true,
  // },
  anchor2: {
    shape: {
      size: 3,
      style: {
        lineWidth: 1,
        stroke: '#00678a',
        fill: '#FFF',
      }
    },
    stateShapeMap: {
      default: {
        size: 3,
        style: {
          lineWidth: 1,
          stroke: '#00678a',
          fill: '#FFF',
          transition: {
            property: ['size'],
            duration: 300
          }
        }
      },
    },
    arrow: true,
    eventWhenHidden: true,
    alwaysShow: false,
    eventArea: { r: 10 },
    event: true,
  },
  outline: {
    shape: {
      type: 'rect',
      size: [60, 60],
      style: {
        borderRadius: 5,
        stroke: '#FFF',
        lineDash: [8, 8]
      }
    },
    hidden: true,
    alwaysShow: false
  },
  image: {
    shape: {
      type: 'image',
      size: [32, 32],
      style: {
        swidth: 32,
        sheight: 32,
        width: 32,
        height: 32,
      }
    },
    labelCfg: {
      offsetY: 33,
      style: {
        color: '#333',
        size: '12px'
      }
    },
    anchorMatrix: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
    event: true
  },
  element: {
    shape: {
      type: 'element',
      size: [0, 0],
      autosize: true,
      style: {
        swidth: 32,
        sheight: 32,
        width: 32,
        height: 32,
      },
    },
    labelCfg: {
      offsetY: 33,
      style: {
        color: '#333',
        size: '12px'
      }
    },
    anchorMatrix: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
    event: true,
  },
}

export const items = {
  list: [{
    cfgKey: 'rect',
    props: {
      key: 'start',
      value: 'start',
      iconText: '&#xe6ec;',
    },
    label: '开始'
  }, {
    cfgKey: 'circle',
    props: {
      key: 'wait',
      value: 'wait',
      iconText: '&#xe644;',
    },
    label: '等待'
  }, {
    cfgKey: 'diamond',
    props: {
      key: 'end',
      value: 'end',
      iconText: '&#xe69d;',
    },
    label: '结束'
  }, {
    cfgKey: 'image',
    props: {
      key: 'variable',
      value: 'variable',
      iconImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsSAAALEgHS3X78AAACuElEQVRYhc1Xy3HiQBB9pnxm2AhwBrARMJOBiMDsDd3IYMnA3HQ0jsByBJIjWJwBZIAiYKu1b3AjDbIWwdZ2lapU0kz369ef6bk7HA5oI8bFYwARAAtgcmbLO4AcQFpkyaaN3i8BGBfPACwAjADsRDkAUb6tLH0A4EEOAXwAWBVZsr4IgHGxKFzT2xd5L7Ikb+OVcbGwJMAfycqsyJIq4PMAjIsjGpdNi7aGzwBZkR0BkVbX9AKbBPkrqbaXGhfhXktdr9R9IicM0HMx/lJkSW1xFzEuXjMkU83EEQBjvmEGX9W4cnDNJB37nNAhOMb8FsYpC9o4VkYPn3GfMOH2t7JO3QJi4vPBM7Bg3C9OuL8AkbOsS6Z77HAjTQv+sJIaF9cAyTfj4lVHHGJrJLZ7TIpdwPs9qRor4xFD1SlMtCVdNbpXdVqVlGUTsTrAtSLCzoDdTr4NWD0rfDYg6SFLxtoGKqvsMz16VDs4VK1G6rNna0ManwhASvjJuNhXkHz7yRA+84yoiuiY+CQM9mkAb4zVgH1iqNhasqkMlIGosl/+fSuyJASg1gdColnwylMyJB4M6OU5B5ZflXVbAJZP4ZNV0btlLoTky2RtBED0b2oQ0ckqufPB5Lq4f3gADw1rRLnhowEUzI/QcNJGSpv3HBhCSeIl9fGvnOd+UtozIa36t6XephCIzfe7vp0vOSw0sXB1MS4uDyUBIEh+AXDVbshFwysY32kH2agyAN8h80Dfzjd9O1/L+794xJbYlHefhNJCH4ns1tRbtviybeuJKGfnsreaCXh+iJ19kSWls7oPzFgaXY/aJjlOyH7NEQBntBlD0XiZuETUUHpyR6jdC3h8PvuppWs4SPuKxn9Ub0q1VswFUzafvEticm9OXdPQNe3/vJpVlHW5nMpxHJq22gNQQK5/PQfwG6FFqMZZt23fAAAAAElFTkSuQmCC'
    },
    label: '定义变量'
  }, {
    cfgKey: 'element',
    props: {
      key: 'element',
      value: 'element',
      iconText: '&#xe6ec;',
      id:'list'
    },
    label: '元素嵌入',
    isShowLabel: false,
  }, {
    cfgKey: 'vueElement',
    props: {
      key: 'vueElement',
      value: 'vueElement',
      iconText: '&#xe6ec;',
      vue: {
        props: {
          value: { a: 9, b: 9, c: 9 }
        }
      }
    },
    label: 'VUE模板渲染',
  }, {
    cfgKey: 'rect2',
    props: {
      key: 'testAnchor',
      value: 'testAnchor',
      iconText: '&#xe6ec;',
    },
    label: '测试锚点',
  }, {
    cfgKey: 'table',
    props: {
      key: 'table',
      value: 'table',
      iconText: '&#xe6ec;',
      vue: {
        props: {
          value: [
            { a: 1, b: 1, c: 1 },
            { a: 2, b: 2, c: 2 },
            { a: 3, b: 3, c: 3 },
            { a: 4, b: 4, c: 4 },
            { a: 5, b: 5, c: 5 },
            { a: 6, b: 6, c: 6 },
          ]
        }
      }
    },
    label: '表字段',
  }]
}