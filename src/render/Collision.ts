import { RangeLabel } from "./RangleLabel";
import { Rectangle } from "./Rectangle";

/**
 * 标注避让
 */
class Collision {

    private source: {
        [key: number | string]: RangeLabel
    }

    private rectangles: any = {}

    // private overLaps = {}

    constructor(source: any) {
        this.source = source

        this.init()
    }

    public getRectangle() {
        return this.rectangles
    }

    private init() {
        this.rectangles = this.generageRectangle()
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



    public reflectRectangle(id: number | string) {
        const rect: Rectangle = this.rectangles[id]
        if (!rect) return

        const label: RangeLabel = this.source[id]
        if (!label) return

        rect.reflect(label.start, label.end)
    }

    public checkValidAvoid(id: number | string) {

        const overlaps = this.getOverlaps()

        return !Object.keys(overlaps).includes(id as string)
    }

    public optimize() {
        // 反转避让

        const overLaps = this.getOverlaps()

        const ids = Object.keys(overLaps)

        if (!ids.length) return

        for (let i = 0; i < ids.length; i++) {

            const id = ids[i]

            this.reflectRectangle(id)

            const valid = this.checkValidAvoid(id)

            if (valid) {
                console.log('有效避让:', id)
            } else {
                this.reflectRectangle(id)
            }

        }

    }

}

export {
    Collision
}