import { RangeLabel } from "./RangleLabel";
import { Rectangle } from "./Rectangle";

/**
 * 标注避让
 */
class Collision {

    private source: {
        [key: number | string]: RangeLabel
    }

    private rectangles = {}

    // private overLaps = {}

    constructor(source: any) {
        this.source = source

        this.init()
    }

    private init() {
        this.rectangles = this.generageRectangle()
        // this.overLaps = this.getOverlaps()
    }

    // 获取标注外包矩形
    private generageRectangle() {
        let result: any = {}

        Object.keys(this.source).forEach((id: string) => {
            const rectangle = this.source[id]

            result[id] = new Rectangle(rectangle.points, { id: rectangle.id })

        })

        return result
    }

    public getOverlaps() {
        let result: any = {}

        const rectangles: any = Object.values(this.rectangles)

        for (let i = 0; i < rectangles.length; i++) {
            const rect1: Rectangle = rectangles[i]

            for (let j = i + 1; j < rectangles.length; j++) {

                const rect2 = rectangles[j]

                if (rect1.overlaps(rect2)) {

                    result[rect1.props.id] = rect1
                    result[rect2.props.id] = rect2
                }

            }
        }

        return result

    }

}

export {
    Collision
}