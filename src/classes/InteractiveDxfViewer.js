import { AxesHelper, Box3, Color, Mesh, MeshBasicMaterial, PlaneGeometry, Raycaster, Vector2, Vector3 } from "three";
import {DxfViewer} from "../dxf-viewer/src/DxfViewer"

export class InteractiveDxfViewer extends DxfViewer{
    constructor(domContainer, options = null){
        super(domContainer, options);
        // let axes = new AxesHelper(50);
        // this.scene.add(axes);
    }

    ExtractDrawing(){
        let halfSize = new Vector2(this.canvasWidth * 0.5, this.canvasHeight * 0.5);
        let minProjection = new Vector3();
        let maxProjection = new Vector3();
        let topLeft = new Vector2();
        let imageSize = new Vector2();
        
        let size = new Vector3();
        let bbox = new Box3();
        let planeMesh;
        console.log('Extract the current floorplan');
        if(this.scene.getObjectByName('selection')){
            this.scene.getObjectByName('selection').removeFromParent();
        }
        if(!this.layers.size){
            console.warn('Empty floorplan and nothign to extract');
            return {
                anchor:null, 
                size: null, 
                success: false};
        }
        
        this.layers.forEach((layer, key, map)=>{
            if(layer.objects && layer.objects[0] && layer.objects[0].visible){
                layer.objects.forEach((instance)=>{
                    if(instance.geometry){
                        instance.geometry.computeBoundingBox();
                        if(instance.geometry.boundingBox){
                            bbox.union(instance.geometry.boundingBox);
                        }
                    }
                });
            }
        });
        
        size = bbox.getSize(size);       
        if(size.length() < 1e-6){
            return {
                anchor:null, 
                size: null, 
                success: false};
        }

        planeMesh = new Mesh(
            new PlaneGeometry(size.x, size.y),
            new MeshBasicMaterial({color: new Color().setStyle('#FF0000'), transparent: true, opacity: 0.4})
            );
        
        planeMesh.name = 'selection';
        planeMesh.position.set(
            bbox.min.x+(size.x*0.5), 
            bbox.min.y+(size.y*0.5), 
            0
            );

        this.camera.updateProjectionMatrix();
        
        minProjection =  bbox.min.clone().project(this.camera);
        maxProjection =  bbox.max.clone().project(this.camera);

        minProjection = minProjection.project(this.camera);
        maxProjection = maxProjection.project(this.camera);
        
        minProjection.x = (minProjection.x + 1) * halfSize.x;
        minProjection.y = - (minProjection.y - 1) * halfSize.y;

        maxProjection.x = (maxProjection.x + 1) * halfSize.x;
        maxProjection.y = - (maxProjection.y - 1) * halfSize.y;

        topLeft.x = Math.max(Math.min(minProjection.x, maxProjection.x), 0);
        topLeft.y = Math.max(Math.min(minProjection.y, maxProjection.y), 0);

        imageSize.x = Math.abs(maxProjection.x - minProjection.x);
        imageSize.y = Math.abs(maxProjection.y - minProjection.y);
        
        console.log(bbox.min, bbox.max);
        console.log(minProjection, maxProjection);
        
        this.scene.add(planeMesh);
        this.Render();
        
        return {
            anchor: topLeft, 
            size: imageSize, 
            image: this.renderer.domElement.toDataURL(),
            success: true,
        };
    }

    Clear(){
        super.Clear();
        if(this.scene.getObjectByName('selection')){
            this.scene.getObjectByName('selection').removeFromParent();
        }
    }

    _OnPointerEvent(e){
        super._OnPointerEvent(e);
    }

    _Emit(eventName, data = null){
        super._Emit(eventName, data);
        if(eventName !== 'pointerdown' && eventName !== 'pointerup'){
            return;
        }
        console.log(data, new Vector3(data.position.x, data.position.y, 0).project(this.camera));
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