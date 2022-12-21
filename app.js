import * as THREE from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new THREE.Color(0xffffff) });
let model;
viewer.grid.setGrid();
viewer.axes.setAxes();

async function loadIfc(url) {
    model = await viewer.IFC.loadIfcUrl(url);
    await viewer.shadowDropper.renderShadow(model.modelID);
    viewer.context.renderer.postProduction.active = true;
}

const input = document.getElementById('file-input');
input.onchange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    loadIfc(url);
};

function getAllIds() {
	return Array.from(
		new Set(model.geometry.attributes.expressID.array),
	);
}

window.onkeydown = (event) => {
    if (event.key === 'c') {
        viewer.clipper.active = true;
        viewer.clipper.createPlane();

        let testMaterial2 = new THREE.MeshBasicMaterial({
            color: 0xFFCE30,
            side: THREE.BackSide,
            clippingPlanes: viewer.context.getClippingPlanes(),
            polygonOffset: true,
            polygonOffsetFactor: -1, 
            polygonOffsetUnits: 1})
          
        viewer.filler.create("vukas", 0 ,getAllIds(),testMaterial2);
    }
}

