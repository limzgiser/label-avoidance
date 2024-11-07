import Konva from "konva";
import { SF_Point } from "./Types";

class PointLabel {


    private _position: SF_Point


    private _props: any

    private _group: Konva.Group


    get title() {
        return this._props.title
    }

    constructor(position: SF_Point, props: any, group: Konva.Group) {
        this._position = position

        this._group = group
        this._props = props
    }

    render() {

        const text = new Konva.Text({
            x: this._position.x,
            y: this._position.y,
            text: this.title,
            fontSize: 30,
            fontFamily: 'Arial',
            fill: 'black',

        });

        text.offsetX(text.width() / 2)
        text.offsetY(text.height() / 2)

        this._group.add(text)

    }



}

export {
    PointLabel
}