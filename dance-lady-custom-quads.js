/*
var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    // Camera
    var camera1 = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, -5, 0), scene);
    scene.activeCamera = camera1;
    scene.activeCamera.attachControl(canvas, true);
    camera1.lowerRadiusLimit = 2;
    camera1.upperRadiusLimit = 10;
    camera1.wheelDeltaPercentage = 0.01;

    // Lighting
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.6;
    light.specular = BABYLON.Color3.Black();

    var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
    light2.position = new BABYLON.Vector3(0, 5, 5);

    // Ground
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { height: 50, width: 50, subdivisions: 4 }, scene);
    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    groundMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    ground.material = groundMaterial;

    // Load the animated GLB model
    BABYLON.ImportMeshAsync("https://assets.babylonjs.com/meshes/HVGirl.glb", scene).then(function (result) {
        const root = result.meshes[0];
        // Loop through all meshes with geometry
        let quads = 0;
        
        result.meshes.forEach(mesh => {
            if (!(mesh instanceof BABYLON.Mesh) || mesh.getTotalVertices() === 0) return;
            mesh.convertToUnIndexedMesh();

            // Set up a material that supports vertex colors
            const mat = new BABYLON.StandardMaterial("mat", scene);
            mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
            // mat.specularColor = new BABYLON.Color3(0, 0, 0);
            mat.vertexColors = true;

            mesh.material = mat;

            // Extract vertex data
            const vertexData = BABYLON.VertexData.ExtractFromMesh(mesh, true);
            if (!vertexData.positions || vertexData.positions.length === 0) return;

            const numTriangles = vertexData.positions.length / 9; // 3 vertices per triangle, 3 floats per vertex
            const colors = [];

            for (let tri = 0; tri < numTriangles; tri += 2) {
                quads++;
                const color = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), 1.0);

                // Each triangle has 3 vertices
                for (let i = 0; i < 6; i++) {
                    colors.push(color.r, color.g, color.b, color.a);
                }
            }

            vertexData.colors = colors;
            vertexData.applyToMesh(mesh, true);
        });

        console.log("total meshes/quads:", result.meshes.length, quads);
        

        // Scale the whole model
        root.scaling.scaleInPlace(0.1);

        // Point camera at the model
        camera1.target = root;

        // Play animation
        const sambaAnim = scene.getAnimationGroupByName("WalkingBack");
        sambaAnim?.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
        console.log(scene.animationGroups);
    })
    .then(() => {
        setTimeout(() => {
            const sceneInstru = new BABYLON.SceneInstrumentation(scene);
            console.log("Drawcalls:", sceneInstru.drawCallsCounter.current);
        }, 5000)
    })


    return scene;
};

*/
var delayCreateScene = function () {
    var scene = new BABYLON.Scene(engine);
    let nodeNames = [];

    var duplicate = function(container, offset, delay, idNum) {
        let entries = container.instantiateModelsToScene();

        for (var node of entries.rootNodes) {
            node.position.x += offset;
            console.log("eandebug node is:", node.name);
        }

        for (let n in nodeNames){
            let name = nodeNames[n];
            let actualName = "Clone of " + name;
            let mesh = scene.getMeshByName(actualName);
            mesh.name = `lady${idNum}-${n}`;
            console.log("clone mesh:", mesh.name)
        }

        // const cloneMesh = scene.getMeshByName("Clone of Body");
        // console.log("eandebug clonemesh is:", cloneMesh);

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

