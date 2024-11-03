import Konva from "konva"
import { SF_Point } from "./Types"
import { FONST_SIZE, LABEL_LINE_COLOR, LABEL_OFFSET_Y, LABEL_TEXT_COLOR } from "../Constants"


class RangeLabel {


    private _layer: any = null
    private _group: any = null

    private _id = undefined

    private _start: SF_Point
    private _end: SF_Point

    private _thinkness: number
    private _offset = [0, 0]
    private _points: Array<SF_Point> = []

    private _text: Konva.Text = new Konva.Text()

    private _maxMovex = 0 // 沿着标注方向最大的移动距离


    get start() { return this._start }

    get end() { return this._end }

    constructor(opitons: any, layer: any) {

        const { start, end, thinkness, offset, id } = opitons

        this._id = id
        this._start = start
        this._end = end

        if (this._start.x > this._end.x) {

            let tmp = this._start
            this._start = this._end

            this._end = tmp;
        }

        this._thinkness = thinkness || 20
        this._offset = offset || [0, 0]
        this._layer = layer
        this._group = new Konva.Group()

        this._group.zIndex(5)
        this._layer.add(this._group)
    }

    get id() {
        return this._id
    }

    get maxMovex() {
        return this._maxMovex
    }
    get points() {
        return this._points
    }

    set points(value) {
        this._points = value
    }


    get thinkness() {
        return this._thinkness
    }

    set thinkness(value: number) {
        this._thinkness = value
    }

    get offset() {
        return this._offset
    }

    set offset(value) {
        this._offset = value
    }


    get textProperties() {

        const x = this._text.x();
        const y = this._text.y();

        const width = this._text.width();
        const height = this._text.height();

        const offsetX = this._text.offsetX();
        const offsetY = this._text.offsetY();

        const rotation = this._text.rotation() * (Math.PI / 180);

        return {
            x, y, width, height, offsetX, offsetY, rotation
        }
    }

    getLabelBoxPoints(offset?: any) {

        if (!this._text) return

        let { x, y, width, height, offsetX, offsetY, rotation } = this.textProperties

        if (offset) {
            offsetX += offset[0]
            offsetY += offset[1]
        }


        const corners = [
            { x: -offsetX, y: -offsetY },
            { x: width - offsetX, y: -offsetY },
            { x: width - offsetX, y: height - offsetY },
            { x: -offsetX, y: height - offsetY },
        ];

        const textPoints = corners.map(corner => {
            const offsetX = corner.x;
            const offsetY = corner.y;

            return {
                x: x + offsetX * Math.cos(rotation) - offsetY * Math.sin(rotation),
                y: y + offsetX * Math.sin(rotation) + offsetY * Math.cos(rotation),
            };
        });

        return textPoints

    }

    getLength() {
        const dx = this._end.x - this._start.x;
        const dy = this._end.y - this._start.y;

        return Math.sqrt(dx * dx + dy * dy);

    }


    getRenderPoints() {
        const dx = this._end.x - this._start.x;
        const dy = this._end.y - this._start.y;

        const length = Math.sqrt(dx * dx + dy * dy);

        const normalX = -dy / length
        const normalY = dx / length;

        return {

            start: {
                x: this._start.x + normalX * this._thinkness,
                y: this._start.y + normalY * this._thinkness,
            },
            end: {
                x: this._end.x + normalX * this._thinkness,
                y: this._end.y + normalY * this._thinkness,
            }
        }
    }

    reverseThinkness() {
        this.render()
    }

    update() {


    }
    render() {
        this._group.removeChildren()

        const { start, end } = this.getRenderPoints()
        const self = this


        // const renderLine = () => {
        //     const line = new Konva.Line({
        //         points: [this._start.x, this._start.y, this._end.x, this._end.y],
        //         stroke: '#f00',
        //         strokeWidth: 1
        //     });

        //     this._group.add(line);
        // }

        // renderLine()

        const renderPath = () => {
            const path = new Konva.Shape({

                sceneFunc: function (context, shape: any) {
                    context.beginPath();
                    context.moveTo(self._start.x, self._start.y);
                    context.lineTo(start.x, start.y);
                    context.lineTo(end.x, end.y)
                    context.lineTo(self._end.x, self._end.y);
                    context.strokeShape(shape);
                },

                stroke: LABEL_LINE_COLOR,
                strokeWidth: 1,
            });

            this._group.add(path);
        }

        const renderArrow = () => {
            const baseLineLeft = new Konva.Arrow({
                points: [start.x, start.y, end.x, end.y],
                stroke: LABEL_LINE_COLOR,
                strokeWidth: 1
            });

            this._group.add(baseLineLeft);


            const baseLineRight = new Konva.Arrow({
                points: [end.x, end.y, start.x, start.y],
                stroke: LABEL_LINE_COLOR,
                strokeWidth: 1,
            });


            this._group.add(baseLineRight);
        }


        const renderText = () => {

            const label = this.getLength()

            const text = new Konva.Text({
                x: (end.x + start.x) / 2,
                y: (end.y + start.y) / 2,
                align: 'center',
                text: this.id + '-' + (label >> 0)/**取整*/,
                fontSize: FONST_SIZE,

                fill: LABEL_TEXT_COLOR,
                listening: false,
                opacity: 1,
            });

            const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);



            const b = this._thinkness > 0 ? -1 : 1


            const height = text.height()
            const width = text.width()

            const len = this.getLength()

            if (len > width) {
                this._maxMovex = (len - width) / 2
            }


            text.offsetY(this._offset[1] + height / 2 + b * (height / 2 + LABEL_OFFSET_Y));
            text.offsetX(this._offset[0] + width / 2);


            text.rotation(angle);

            this._text = text
            this._group.add(text);
        }

        const renderTextBox = () => {
            if (!this._text) return
            const points: any = this.getLabelBoxPoints()

            this._points = points as any

            const [p1, p2, p3, p4] = points.map((item: SF_Point) => [item.x, item.y])



            if (!points) return

            const line = new Konva.Line({
                points: [p1, p2, p3, p4, p1].flat(),
                stroke: '#00f',
                strokeWidth: 1

            });

            // line.visible(false)

            this._group.add(line)

        }

        renderPath()

        renderArrow()

        renderText()

        renderTextBox()

    }
}

export {
    RangeLabel
}