import { SF_Point } from "./Types"



class Rectangle {


    private _points: Array<SF_Point>

    private _props

    get points() {
        return this._points
    }

    set points(value) {
        this._points = value
    }

    get props() {
        return this._props
    }

    constructor(points: Array<SF_Point>, props: any) {

        this._points = points

        this._props = props
    }

    public getCenter() {
        return {
            x: (this.points[0].x + this.points[2].x) / 2,
            y: (this.points[0].y + this.points[2].y) / 2
        }
    }


    public getBoundingBox() {
        const xs = this.points.map((p: SF_Point) => p.x);
        const ys = this.points.map((p: SF_Point) => p.y);
        return {
            minX: Math.min(...xs),
            maxX: Math.max(...xs),
            minY: Math.min(...ys),
            maxY: Math.max(...ys)
        };
    }

    public overlaps(other: Rectangle) {
        // 使用分离轴定理检测相交
        const axes = [...this.getAxes(), ...other.getAxes()];
        return axes.every(axis => {
            const projectionA = this.project(axis);
            const projectionB = other.project(axis);
            return this.isOverlapping(projectionA, projectionB);
        });
    }

    private getAxes() {
        const axes = [];
        for (let i = 0; i < this.points.length; i++) {
            const p1 = this.points[i];
            const p2 = this.points[(i + 1) % this.points.length];
            const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
            axes.push({ x: -edge.y, y: edge.x });
        }
        return axes;
    }

    private project(axis: SF_Point) {
        const dotProducts = this.points.map((p: SF_Point) => p.x * axis.x + p.y * axis.y);
        return { min: Math.min(...dotProducts), max: Math.max(...dotProducts) };
    }

    private isOverlapping(projA: { min: number, max: number }, projB: { min: number, max: number }) {

        return !(projA.max < projB.min || projB.max < projA.min);
    }

    /**
     * 矩形沿线镜像
     * @param lineStart 
     * @param lineEnd 
     */
    public reflect(lineStart: SF_Point, lineEnd: SF_Point) {

        const reflectPointAcrossLine = (point: SF_Point) => {

            // 计算线段的单位向量
            const lineVec = {
                x: lineEnd.x - lineStart.x,
                y: lineEnd.y - lineStart.y
            };
            const lineLength = Math.sqrt(lineVec.x * lineVec.x + lineVec.y * lineVec.y);
            const unitLineVec = {
                x: lineVec.x / lineLength,
                y: lineVec.y / lineLength
            };

            // 计算点到线段的投影
            const pointVec = {
                x: point.x - lineStart.x,
                y: point.y - lineStart.y
            };
            const projectionLength = pointVec.x * unitLineVec.x + pointVec.y * unitLineVec.y;

            // 计算投影点坐标
            const projectionPoint = {
                x: lineStart.x + projectionLength * unitLineVec.x,
                y: lineStart.y + projectionLength * unitLineVec.y
            };

            // 计算反射点
            const reflectedPoint = {
                x: projectionPoint.x + (projectionPoint.x - point.x),
                y: projectionPoint.y + (projectionPoint.y - point.y)
            };

            return reflectedPoint;
        }

        const points = this._points.map((point: any) => reflectPointAcrossLine(point));

        this.points = points

    }

    /**
     * 沿线移动
     * @param lineStart 
     * @param lineEnd 
     * @param distance 
     * @returns 
     */
    public moveAlongDirection(lineStart: SF_Point, lineEnd: SF_Point, length: number, distance: number) {


        const movePoint = (P: SF_Point) => {

            // 计算方向向量
            const direction = {
                x: lineEnd.x - lineStart.x,
                y: lineEnd.y - lineStart.y
            };
            if (direction.x == 0 && direction.y == 0) return P
            // 计算单位方向向量
            const normalize = {
                x: direction.x / length,
                y: direction.y / length
            };
            // 计算新的点
            const result = {
                x: P.x + normalize.x * distance,
                y: P.y + normalize.y * distance
            };
            return result;
        }

        const points = this._points.map((point: SF_Point) => movePoint(point))
        this.points = points

    }
}

export {
    Rectangle
}