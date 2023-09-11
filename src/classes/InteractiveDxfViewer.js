import { AxesHelper, Raycaster, Vector2 } from "three";
import {DxfViewer} from "../dxf-viewer/src/DxfViewer"

export class InteractiveDxfViewer extends DxfViewer{
    constructor(domContainer, options = null){
        super(domContainer, options);
        // let axes = new AxesHelper(50);
        // this.scene.add(axes);
    }

    Clear(){
        super.Clear();
        // let axes = new AxesHelper(50);
        // this.scene.add(axes);
    }

    _OnPointerEvent(e){
        super._OnPointerEvent(e);
    }

    _Emit(eventName, data = null){
        super._Emit(eventName, data);
        if(eventName !== 'pointerdown' && eventName !== 'pointerup'){
            return;
        }
        if(data && data.canvasCoord && this.GetCamera()){
            let mouse = new Vector2(data.canvasCoord.x, data.canvasCoord.y);
            let raycaster = new Raycaster();
            let intersections;
            // raycaster.setFromCamera(mouse, this.GetCamera());
            // intersections = raycaster.intersectObjects(this.scene.children, true);
            // console.log('check intersections');
            // console.log(this.layers);
        }        
    }
}