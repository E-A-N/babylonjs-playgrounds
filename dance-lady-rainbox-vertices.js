let delayCreateScene = function () {
    let scene = new BABYLON.Scene(engine);
    let nodeNames = [];

    let duplicate = function(container, offset, delay, idNum) {
        let entries = container.instantiateModelsToScene(undefined, false, {doNotInstantiate: true});

        for (let node of entries.rootNodes) {
            node.position.x += offset;
        }

        let characterMeshes = [];

        for (let n in nodeNames){
            let name = nodeNames[n];
            let actualName = "Clone of " + name;
            let mesh = scene.getMeshByName(actualName);
            mesh.name = `lady${idNum}-${n}`;
            characterMeshes.push(mesh);
        }

        let animationOptions = Object.keys(entries.animationGroups);
        let animationChoice = Math.floor(
            Math.random() * animationOptions.length
        );
        let animationGroup = entries.animationGroups[
            animationOptions[
                animationChoice
            ]
        ]
        setTimeout(() => {
            animationGroup.play(true);
        }, delay);

        //color the vertices

        
        //only color the center character
        //notice the smeared vertex colors int the side characters
        //in addition to them still being colored at all
        if (idNum > 0){
            return;
        }

        let quads = 0;
        for (let i in characterMeshes){
            let mesh = characterMeshes[i];
            mesh.makeGeometryUnique();
        //    mesh.convertToUnIndexedMesh();
            mesh.useVertexColors = true;

            const vertexData = BABYLON.VertexData.ExtractFromMesh(mesh, true, true);
            if (vertexData.positions && vertexData.positions.length > 0) {
                const numPositions = vertexData.positions.length / 3;
                const colors = [];

                for (let tri = 0; tri < numPositions; tri++) {
                    let color = new BABYLON.Color4(0, 0, 0, 1.0);
                    quads++;
                   //if(quads > 100 && quads < 400){
                        color = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), 1.0);
                   // }
                    colors.push(color.r, color.g, color.b, color.a);
                }
                vertexData.colors = colors;
                vertexData.applyToMesh(mesh, true);
           //     mesh.optimizeIndices();
            }
        }
    }
    
    BABYLON.loadAssetContainerAsync("https://assets.babylonjs.com/meshes/HVGirl.glb", scene).then(function (container) {
        container.addAllToScene();

        //store original reference keys
        for (let i in scene.meshes){
            let mesh = scene.meshes[i];
            nodeNames.push(mesh.name);
        }

        duplicate(container, 0, Math.random() * 2000, 0);
        duplicate(container, 10.0, Math.random() * 2000, 1);
        duplicate(container, -10.0, Math.random() * 2000, 2);
        
        console.log(container);

        //wipe original mesh
        for (let i in nodeNames){
            let mesh = scene.getMeshByName(nodeNames[i]);
            if (mesh){
                mesh.dispose();
            }
        }

        scene.createDefaultCamera(true, true, true);
        scene.createDefaultEnvironment();
    });
    return scene;
}
