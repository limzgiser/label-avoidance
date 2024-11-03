import { MOVE_X_TIMES, MOVE_Y_TIMES } from "../Constants";
import { RangeLabel } from "./RangleLabel";
import { Rectangle } from "./Rectangle";
import { SF_Point } from "./Types";
import { cloneDeep, replace } from 'lodash'

/**
 * 标注避让
 */
class Collision {

    private source: {
        [key: number | string]: RangeLabel
    }

    private rectangles: any = {}

    // private overLaps = {}

    private checkingOverlaps: any = {}

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

        this.checkingOverlaps = overlaps

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
            // console.log('[镜像] 有 效避让:', id)
            result = true
        } else {
            this.reflectRectangle(id)
            // console.log('[镜像] 无  效避让:', id)
        }

        return result
    }
    /**
     *  移动避让
     */
    public moveAvoid(id: string | number) {


        const label: RangeLabel = this.source[id]
        if (!label) return 0


        const rectangle: Rectangle = this.rectangles[id]

        const points = rectangle.points.slice()

        if (!rectangle) return 0

        if (label.maxMovex <= 0) return 0

        const length = label.getLength()
        if (length <= 0) return 0

        const step = label.maxMovex / MOVE_X_TIMES

        const offset = label.offset.slice()
        let udpateOffsetX = 0


        const checkMove = (start: SF_Point, end: SF_Point) => {



            for (let i = 0; i < MOVE_X_TIMES; i++) {

                const tempStep = step * (i + 1)

                rectangle.moveAlongDirection(start, end, length, tempStep)

                const valid = this.checkValidAvoid(id)

                if (valid) {

                    console.log(rectangle.points)

                    let [a] = rectangle.points
                    let [a1] = points

                    udpateOffsetX = a.x - a1.x

                    label.offset[0] = label.offset[0] + udpateOffsetX
                    break
                }
            }

            return udpateOffsetX
        }

        const moveFront = checkMove(label.start, label.end)

        if (moveFront) return moveFront

        const moveBack = checkMove(label.end, label.start)

        if (moveBack) return moveBack


        label.offset = offset

        rectangle.points = points

        return 0


    }


    public optimize() {



        let overLaps: any = this.getOverlaps()


        const ids = Object.keys(overLaps)

        let mirro = 0
        let move = 0

        if (!ids.length) return

        for (let i = 0; i < ids.length; i++) {
            const id = ids[i]

            if (i > 0) {

                if (!this.checkingOverlaps[id]) {
                    continue
                }
            }


            const label = this.source[id]

            // let avoid = this.mirrorAvoid(id)
            // if (avoid) {
            //     label.thinkness = -label.thinkness
            //     mirro++
            //     continue
            // }

            let step = this.moveAvoid(id)

            if (step > 0) {

                const [x, y] = label.offset

                label.offset = [step, y]
                move++
                continue
            }

        }

        console.log('累计重叠标注:', ids.length)

        console.log('镜像避让:', mirro)

        console.log('移动避让:', move)
        console.log(this.getOverlaps())


        Object.values(this.source).forEach(item => item.render())


    }

}

export {
    Collision
}