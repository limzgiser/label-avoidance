import Konva from "konva";
import { MOVE_X_TIMES, MOVE_Y_TIMES } from "../Constants";
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
     *  这里没得x轴方向移动的正负可能有问题，需要测试
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

        const step = (label.maxMovex) / MOVE_X_TIMES

        let offset = label.offset.slice()

        let udpateOffsetX = 0


        const checkMove = (dir: 1 | -1) => {

            for (let i = 0; i < MOVE_X_TIMES; i++) {

                const tempStep = step * (i + 1) * dir

                // rectangle.moveAlongDirection(end, start, length, tempStep)
                const points = label.getLabelBoxPoints([tempStep, 0])

                if (points) {

                    rectangle.points = points

                    const valid = this.checkValidAvoid(id)

                    if (valid) {
                        udpateOffsetX = tempStep
                        label.offset = [offset[0] + udpateOffsetX, offset[1]]
                        break
                    }
                }

            }

            return udpateOffsetX
        }

        const moveFront = checkMove(1)

        if (moveFront) return moveFront

        const moveBack = checkMove(-1)

        if (moveBack) return moveBack

        rectangle.points = points

        label.offset = offset

        return 0
    }


    public moveAvoidY(id: string | number) {

        const label: RangeLabel = this.source[id]
        if (!label) return 0


        const rectangle: Rectangle = this.rectangles[id]

        if (!rectangle) return 0

        const length = label.getLength()
        if (length <= 0) return 0



        const points = rectangle.points.slice()

        let thinkness = label.thinkness

        let step = thinkness * 2


        const checkMove = (dir: 1 | -1) => {

            const direction = label.getYDirection()

            for (let i = 0; i < MOVE_Y_TIMES; i++) {

                const tempStep = step * (i + 1)

                rectangle.moveAlongDirection(direction.start, direction.end, direction.distance, tempStep)


                const valid = this.checkValidAvoid(id)

                if (valid) {

                    return tempStep * dir

                }


            }


            return 0
        }

        const moveUp = checkMove(1)

        if (moveUp) return moveUp

        const moveDown = checkMove(-1)

        if (moveDown) return moveDown

        rectangle.points = points

        return 0
    }

    public optimize(group: Konva.Group) {



        let overLaps: any = this.getOverlaps()


        const ids = Object.keys(overLaps)

        let mirro = 0
        let move = 0
        let yAvoidCount = 0

        if (!ids.length) return

        for (let i = 0; i < ids.length; i++) {
            const id = ids[i]

            if (i > 0) {

                if (!this.checkingOverlaps[id]) {
                    continue
                }
            }

            const label = this.source[id]

            // // 翻转避让
            // let avoid = this.mirrorAvoid(id)
            // if (avoid) {
            //     label.thinkness = -label.thinkness
            //     mirro++
            //     continue
            // }

            // // 移动避让
            // let step = this.moveAvoid(id)

            // if (step > 0) {
            //     move++
            //     continue
            // }

            let yAvoid = this.moveAvoidY(id)


            if (yAvoid > 0) {
                yAvoidCount++
                console.log(yAvoid)
                label.thinkness = yAvoid
                continue
            }

        }

        const overlap = this.getOverlaps()

        Object.values(this.source).forEach(item => item.render())


        return {
            total: ids.length,
            mirro: mirro,
            move: move,
            yAvoidCount,
            overlap: Object.keys(overlap).length
        }

    }

}

export {
    Collision
}