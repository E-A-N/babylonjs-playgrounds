var delayCreateScene = function () {
    var scene = new BABYLON.Scene(engine);
    let nodeNames = [];

    var duplicate = function(container, offset, delay, idNum) {
        let entries = container.instantiateModelsToScene();

        for (var node of entries.rootNodes) {
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
        let quads = 0;
        if (idNum > 0){
            return;
        }
        for (let i in characterMeshes){
            let mesh = characterMeshes[i];
            mesh.convertToUnIndexedMesh();
            mesh.useVertexColors = true;

            const vertexData = BABYLON.VertexData.ExtractFromMesh(mesh, true);
            if (vertexData.positions && vertexData.positions.length > 0) {
                const numTriangles = vertexData.positions.length / 9; // 3 vertices per triangle, 3 floats per vertex
                const colors = [];

                for (let tri = 0; tri < numTriangles; tri += 2) {
                    let color = new BABYLON.Color4(0, 0, 0, 1.0);
                    quads++;
                    if(quads > 100 && quads < 400){
                        color = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), 1.0);
                    }
                    // Each triangle has 3 vertices
                    for (let i = 0; i < 6; i++) {
                        colors.push(color.r, color.g, color.b, color.a);
                    }
                }
                vertexData.colors = colors;
                vertexData.applyToMesh(mesh, true);
                mesh.optimizeIndices();
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

