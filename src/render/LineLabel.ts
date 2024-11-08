import Konva from "konva";
import { SF_Point } from "./Types";


enum LINE_LABEL_POSITION {
    TOP_RIGHT,
    TOP_LEFT,
    BUTTOM_RIGHT,
    BUTTOM_LEFT
}
class LineLabel {


    private _position: SF_Point


    private _props: any

    private _group: Konva.Group


    get title() {
        return this._props.title
    }

    get labelPos() {
        return this._props.pos
    }



    constructor(position: SF_Point, props: any, group: Konva.Group) {
        this._position = position

        this._group = group
        this._props = props
    }

    render() {

        const text = new Konva.Text({
            text: this.title,
            fontSize: 30,

            fontFamily: 'Arial',
            fill: 'black',
        });

        let lines: any = [], textCenter = this._position

        const posW = this._props.posW || 0
        const posH = this._props.posH || 0


        if (this.labelPos == LINE_LABEL_POSITION.TOP_RIGHT) {
            const { x, y } = this._position
            lines = [
                x, y,
                x + posW, y - posH,
                x + posW + text.width(), y - posH,
            ]
            textCenter.x = x + posW + (text.width()) / 2
            textCenter.y = y - posH

            text.offsetX(text.width() / 2)
            text.offsetY(text.height())

            text.x(textCenter.x)
            text.y(textCenter.y)
        }



        if (this.labelPos == LINE_LABEL_POSITION.TOP_LEFT) {
            const { x, y } = this._position
            lines = [
                x, y,
                x - posW, y - posH,
                x - posW - text.width(), y - posH,
            ]
            textCenter.x = x - posW
            textCenter.y = y - posH

            text.offsetX(text.width())
            text.offsetY(text.height())

            text.x(textCenter.x)
            text.y(textCenter.y)
        }

        if (this.labelPos == LINE_LABEL_POSITION.BUTTOM_LEFT) {
            const { x, y } = this._position
            lines = [
                x, y,
                x - posW, y + posH,
                x - posW - text.width(), y + posH,
            ]
            textCenter.x = x - posW
            textCenter.y = y + posH

            text.offsetX(text.width())
            text.offsetY(text.height())

            text.x(textCenter.x)
            text.y(textCenter.y)
        }
        if (this.labelPos == LINE_LABEL_POSITION.BUTTOM_RIGHT) {
            const { x, y } = this._position
            lines = [
                x, y,
                x + posW, y + posH,
                x + posW + text.width(), y + posH,
            ]
            textCenter.x = x + posW + (text.width()) / 2
            textCenter.y = y + posH

            text.offsetX(text.width() / 2)
            text.offsetY(text.height())

            text.x(textCenter.x)
            text.y(textCenter.y)
        }
        const line = new Konva.Line({
            points: lines,
            stroke: "#000",
            strokeWidth: 2
        })
        this._group.add(line)

        this._group.add(text)

    }



}

export {
    LineLabel,
    LINE_LABEL_POSITION
}