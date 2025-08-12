var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 4}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    let targetMesh = sphere;
    targetMesh.convertToFlatShadedMesh();
   targetMesh.convertToUnIndexedMesh();

    let customData = {
        body: {
            mesh: targetMesh,
            data: {}
        }
    }
    // set sphere vertex colors as red
    const vColors = targetMesh.getVerticesData(BABYLON.VertexBuffer.ColorKind);
  
    //Event for vertex painting the faces under mouse cursor
    let onPointerMove = function (evt) {
        let pickResult = scene.pick(scene.pointerX, scene.pointerY);
        console.log("painting??", evt.button, pickResult.pickedMesh === targetMesh);
        if (pickResult.pickedMesh === targetMesh && pickResult.faceId !== -1) {
            let colorArray = evt.button === 2
                ? [0,0,0]
                : [1,0,0];
            
            let indices = targetMesh.getIndices();
            var hitFaceID = pickResult.faceId;

            // Get the three vertex indices of the triangle face
            var i0 = indices[hitFaceID * 3];
            var i1 = indices[hitFaceID * 3 + 1];
            var i2 = indices[hitFaceID * 3 + 2];

            // Set color to black for the picked triangle
            vColors[i0 * 4 + 0] = colorArray[0];
            vColors[i0 * 4 + 1] = colorArray[1];
            vColors[i0 * 4 + 2] = colorArray[2];

            vColors[i1 * 4 + 0] = colorArray[0];
            vColors[i1 * 4 + 1] = colorArray[1];
            vColors[i1 * 4 + 2] = colorArray[2];

            vColors[i2 * 4 + 0] = colorArray[0];
            vColors[i2 * 4 + 1] = colorArray[1];
            vColors[i2 * 4 + 2] = colorArray[2];

            customData.body.data[hitFaceID] = colorArray;

            targetMesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, vColors);
            
            console.log(customData)
        }
    };
    // scene.onPointerUp = onPointerMove;

    scene.onPointerDown = () => {
        scene.onPointerMove = onPointerMove;
    }

    scene.onPointerUp = () => {
        scene.onPointerMove = null;
    }

    /*
        let customData = {
            body: {
                mesh: sphere,
                data: {}
            }
        }
    */
    let changeColors = (characterData, colorArray) => {
        for (let i in characterData){
            let characterComponent = characterData[i];
            let thisData = characterComponent.data;
            let thisMesh = characterComponent.mesh
            let indices = thisMesh.getIndices();
            let vertexColors = thisMesh.getVerticesData(BABYLON.VertexBuffer.ColorKind);
            for (let facelet in thisData){      
                let faceletId = Number(facelet);        

                // Get the three vertex indices of the triangle face
                var i0 = indices[faceletId * 3];
                var i1 = indices[faceletId * 3 + 1];
                var i2 = indices[faceletId * 3 + 2];

                // Set color to black for the picked triangle
                vertexColors[i0 * 4 + 0] = colorArray[0];
                vertexColors[i0 * 4 + 1] = colorArray[1];
                vertexColors[i0 * 4 + 2] = colorArray[2];

                vertexColors[i1 * 4 + 0] = colorArray[0];
                vertexColors[i1 * 4 + 1] = colorArray[1];
                vertexColors[i1 * 4 + 2] = colorArray[2];

                vertexColors[i2 * 4 + 0] = colorArray[0];
                vertexColors[i2 * 4 + 1] = colorArray[1];
                vertexColors[i2 * 4 + 2] = colorArray[2];
            }

            thisMesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, vertexColors);
        }
    }

    return scene;
};
