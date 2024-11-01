import { MOVE_X_TIMES } from "../Constants";
import { RangeLabel } from "./RangleLabel";
import { Rectangle } from "./Rectangle";
import { SF_Point } from "./Types";

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

        const label: RangeLabel = this.source[id]
        if (!label) return

        this.rectangles[id] && this.rectangles[id].reflect(label.start, label.end)
    }

    public checkValidAvoid(id: number | string) {

        const overlaps = this.getOverlaps()

        return !Object.keys(overlaps).includes(id as string)
    }


    /**
     * 镜像避让
     */
    public mirrorAvoid(id: string | number) {

        let result = false

        this.reflectRectangle(id)

        const valid = this.checkValidAvoid(id)

        if (valid) {
            console.log('[镜像] 有 效避让:', id)
            result = true
        } else {
            this.reflectRectangle(id)
            console.log('[镜像] 无  效避让:', id)
        }

        return result
    }
    /**
     *  移动避让
     */
    public moveAvoid(id: string | number) {

        const label: RangeLabel = this.source[id]
        if (!label) return

        const points = label.points.slice()

        const rectangle: Rectangle = this.rectangles[id]


        if (!rectangle) return

        if (label.maxMovex <= 0) return

        const length = label.getLength()
        if (length <= 0) return

        const step = label.maxMovex / MOVE_X_TIMES

        const checkMove = (start: SF_Point, end: SF_Point) => {

            let result = false
            for (let i = 0; i < MOVE_X_TIMES; i++) {

                rectangle.moveAlongDirection(start, end, length, step * (i + 1))

                const valid = this.checkValidAvoid(id)

                if (valid) {
                    console.log('[移动X] 有 效避让:', id)
                    result = true
                    break
                }
            }

            return result
        }

        const moveFront = checkMove(label.start, label.end)

        if (moveFront) return

        const moveBack = checkMove(label.end, label.start)

        if (moveBack) return

        rectangle.points = points

        console.log('[移动X] 无 效避让:', id)

    }

    public optimize() {
        // 反转避让
        const overLaps = this.getOverlaps()


        const ids = Object.keys(overLaps)


        if (!ids.length) return

        for (let i = 0; i < ids.length; i++) {
            const id = ids[i]
            // const avoid = this.mirrorAvoid(id)
            // if (avoid) continue

            this.moveAvoid(id)
        }
    }

}

export {
    Collision
}