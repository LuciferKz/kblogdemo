export default {
  rect: {
    shape: {
      type: 'rect',
      size: [100, 50],
      style: {
        fill: '#EEE',
        stroke: '#CCC',
      }
    },
    props: { },
    anchorMatrix: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
    labelCfg: {
      hide: true,
    },
  },
  
  edge: {
    shape : {
      type: 'polyline',
      style: {
        stroke: '#edeef4',
        lineWidth: 2,
        arrowStyle: {
    
          lineWidth: 3,
    
          color: '#CCC',
    
          theta: 25,
          
          headlen: 15,
    
          fill: true
        },
      }
    },
    stateShapeMap: {
      default: {
        type: 'polyline',
        style: {
          stroke: '#edeef4',
          lineWidth: 2
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
    arrow: true,
  },

  anchor: {
    shape: {
      size: 5,
      style: {
        lineWidth: 2,
        stroke: '#00678a',
        fill: '#FFF',
      }
    },
    stateShapeMap: {
      default: {
        size: 5,
        style: {
          lineWidth: 2,
          stroke: '#00678a',
          fill: '#FFF',
          transition: {
            property: ['size'],
            duration: 300
          }
        }
      },
      hover: {
        size: 10,
        style: {
          lineWidth: 2,
          stroke: '#CCC',
          fill: '#FFB2B2',
          transition: {
            property: ['size'],
            duration: 300
          }
        }
      }
    },
    eventWhenHidden: true,
    alwaysShow: false,
    eventArea: { r: 10 },
  },
}