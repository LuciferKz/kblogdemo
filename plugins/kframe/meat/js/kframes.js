const run = function (x) {
    x = Math.abs(x)
    window.requestAnimationFrame(function () {
        for (let i = 0, len = layers.length; i < len; i++) {
            let layer = layers[i], jlen = layer.frames.length
            if (x < layer.frames[1].startX) {
                Object.assign(layer.o, layer.frames[0]);
            } else if (x > layer.frames[jlen - 1].endX) {
                Object.assign(layer.o, layer.frames[jlen - 1]);
            } else {
                for (let j = 1; j < jlen; j++) {
                    let frame = layer.frames[j],
                    prevFrame = layer.frames[j - 1],
                    nextFrame = layer.frames[j + 1];

                    if (x >= frame.startX && x < frame.endX) {
                        let dis = frame.endX - frame.startX
                        for (let k in frame) {
                            let ratio = (frame[k] - prevFrame[k]) / dis
                            layer.o[k] = prevFrame[k] + (x - frame.startX) * ratio
                        }
                    } 
                    else if (prevFrame && x < frame.startX && x > prevFrame.endX) {
                        Object.assign(layer.o, prevFrame);
                    } else if (nextFrame && x > frame.startX && x < nextFrame.endX) {
                        Object.assign(layer.o, nextFrame);
                    }
                }
            }
        }

        rerender()
    })
}