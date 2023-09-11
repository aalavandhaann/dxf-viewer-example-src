<template>
    <q-page class="row items-stretch root">
        <div class="col relative-position">
            <slot></slot>
            <InteractiveDxfViewer ref="viewer" :dxfUrl="dxfUrl" :fonts="fonts"
                       @dxf-loaded="_OnLoaded" @dxf-cleared="_OnCleared" @dxf-message="_OnMessage"  @dxf-pointerdown="_OnPointerDown"/>
        </div>
        <div class="col-auto layersCol">
            <q-btn dense blue label="Extract Drawing" @click="_OnExtract"/>
            <LayersList :layers="layers" @toggleLayer="_OnToggleLayer" @toggleAll="_OnToggleAll"/>
        </div>        
    </q-page>
</template>

<script>
// import DxfViewer from "@/components/DxfViewer"
// import {DxfViewer as _DxfViewer} from "dxf-viewer"
// import {DxfViewer as _DxfViewer} from "../dxf-viewer/src/DxfViewer"

import InteractiveDxfViewer from "@/components/InteractiveDxfViewer"
import {InteractiveDxfViewer as _InteractiveDxfViewer} from "../classes/InteractiveDxfViewer"
import Vue from "vue"
import mainFont from "@/assets/fonts/Roboto-LightItalic.ttf"
import aux1Font from "@/assets/fonts/NotoSansDisplay-SemiCondensedLightItalic.ttf"
import aux2Font from "@/assets/fonts/HanaMinA.ttf"
import aux3Font from "@/assets/fonts/NanumGothic-Regular.ttf"
import LayersList from "@/components/LayersList"


export default {
    name: "ViewerPage",
    components: { LayersList, InteractiveDxfViewer },

    props: {
        dxfUrl: {
            type: String
        }
    },

    data() {
        return {
            layers: null
        }
    },

    methods: {
        _OnExtract(){
            let result = this.$refs.viewer.GetViewer().ExtractDrawing();
            let link;
            let image;
            let saveCanvas;
            let saveContext;
            
            if(result.success){
                link = document.createElement('a');
                saveCanvas = document.createElement('canvas');
                saveContext = saveCanvas.getContext("2d");
                image = new Image();

                image.onload = () =>{
                    console.log(result.anchor, result.size);
                    saveContext.drawImage(
                        image, 
                        result.anchor.x, 
                        result.anchor.y, 
                        result.size.x, 
                        result.size.y, 
                        0,
                        0,
                        result.anchor.x + result.size.x, 
                        result.anchor.y + result.size.y,
                        );
                    link.setAttribute('href', result.image);
                    link.setAttribute('target', '_blank');
                    link.setAttribute('download', "extraction.png");
                    link.click();       
                }
                
                saveCanvas.width = result.size.x;
                saveCanvas.height = result.size.y;
                image.src = result.image;                         
            }
            
            console.log(result);
        },
        _OnPointerDown(e, v){
            // console.log('pointer down ', e, v)
        },
        _OnLoaded() {
            const layers = this.$refs.viewer.GetViewer().GetLayers()
            layers.forEach(lyr => Vue.set(lyr, "isVisible", true))
            this.layers = layers
        },

        _OnCleared() {
            this.layers = null
        },

        _OnToggleLayer(layer, newState) {
            layer.isVisible = newState
            this.$refs.viewer.GetViewer().ShowLayer(layer.name, newState)
        },

        _OnToggleAll(newState) {
            if (this.layers) {
                for (const layer of this.layers) {
                    if (layer.isVisible !== newState) {
                        this._OnToggleLayer(layer, newState)
                    }
                }
            }
        },

        _OnMessage(e) {
            let type = "info"
            switch (e.detail.level) {
            case _DxfViewer.MessageLevel.WARN:
                type = "warning"
                break
            case _DxfViewer.MessageLevel.ERROR:
                type = "negative"
                break
            }
            this.$q.notify({ type, message: e.detail.message })
        }
    },

    created() {
        this.fonts = [mainFont, aux1Font, aux2Font, aux3Font]
    }
}
</script>

<style scoped lang="less">

.root {
    .layersCol {
        border-left: #DBDBDB solid 1px;
    }
}

</style>
