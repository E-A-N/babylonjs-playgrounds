var createScene = function() {

    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.35, 0.35, 0.42);

    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.setPosition(new BABYLON.Vector3(0.0, 3.0, -8.0));

    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.2;
    var pl = new BABYLON.PointLight('pl', camera.position, scene);
    pl.intensity = 0.9;

    var mesh = BABYLON.MeshBuilder.CreateIcoSphere("m", {radius: 2.0}, scene);
    mesh.updateFacetData();
    mesh.computeWorldMatrix(true);

    let facets = [...Array(mesh.facetNb).keys()];

    const faces = [];
    for (let f = 0; f < facets.length; f++) {
        if (facets[f] !== -1) faces.push(facets[f]);
    }

    let showFacetNormal = (mesh, findex, cB) => {
        try {
            var allPositions = mesh.getFacetLocalPositions();
            let normals = mesh.getFacetLocalNormals();
            var position = BABYLON.Vector3.TransformCoordinates(
                allPositions[findex], 
                mesh.getWorldMatrix()
            );
            let positionNormal = position
                .subtract(normals[findex])

            let cBi = cB.createInstance(("cBi000" + findex));
            cBi.position = position;//.clone().scale(0.01);
            cBi.lookAt(positionNormal, 0,0,0,0);
            cBi.freezeWorldMatrix();
        } catch (e) {
            console.log(e)
        }
    }

    const linePoints = [
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 0, -0.5)
    ]

    const templatedLine = BABYLON.MeshBuilder.CreateTube("thinTube", {
        path: linePoints,
        radius: 0.02,
        tessellation: 16
    }, scene);
    templatedLine.visibility = 1;

    for (let i = 0; i < faces.length; i++) {
        showFacetNormal(mesh, faces[i], templatedLine);
    }

    return scene;
};
