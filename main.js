 var canvas = document.getElementById("webgl")

 var gl = canvas.getContext("webgl")
 if (!gl) console.console.log("no webgl!")

Promise.all([
    fetch('vertex.glsl').then(r=>r.text()),
    fetch('fragment.glsl').then(r=>r.text()),
]).then(arr=>{

    //init program
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, arr[0]);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, arr[1]);
    let program = createProgram(gl, vertexShader, fragmentShader);


    //lookup attributes (do this before render loop)
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    //lookup uniforms
    let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    let colorUniformLocation = gl.getUniformLocation(program, "u_color");


    var positionBuffer = gl.createBuffer();

    //bind buffer to bindpoint
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // three 2d points
    let positions = [
        10, 20,
        80, 20,
        10, 30,
        10, 30,
        80, 20,
        80, 30,
    ];
    //write to buffer                                           //hint, data won't change much
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    //setup canvas viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);



    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    gl.hint(gl.FRAGMENT_SHADER_DERIVATIVE_HINT, gl.NICEST);

    // set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // Bind the position buffer.
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    let size = 2;          // 2 components per iteration
    let type = gl.FLOAT;   // the data is 32bit floats
    let normalize = false; // don't normalize the data
    let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

    //render
    let primitiveType = gl.TRIANGLES;
    let offsetr = 0;
    let count = 6;
    gl.drawArrays(primitiveType, offsetr, count);
})

function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    } else {
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
}

function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    } else {
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}
