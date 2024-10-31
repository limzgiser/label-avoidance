import Konva from "konva"
import { RangeLabel } from "../render/RangleLabel"
import { DATA_COUNT } from "../Constants"

const randomData = (layer: Konva.Layer) => {
    const labels = []

    for (let i = 0; i < DATA_COUNT; i++) {

        const label = new RangeLabel({

            id: i,
            start: {
                x: Math.floor(1000 * Math.random()), y: Math.floor(10 + 800 * Math.random())
            },

            end: {
                x: Math.floor(600 * Math.random()), y: Math.floor(10 + 600 * Math.random())
            },

            thinkness: Math.floor(25 * (Math.random() < 0.5 ? -1 : 1)),
            offset: [0, 0]
        }, layer)

        label.render()

        labels.push(label)

    }

    return labels

}


export {
    randomData
}