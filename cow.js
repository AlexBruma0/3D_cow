var gl
var canvas;
var angle;
var angularSpeed;
var positions = [];
var colors = [];
var position_buffer;
var color_buffer;
var vs_source;
var fs_source;
var vs;
var fs;
var prog;
var vao;
var previousTimestamp;

function initializeContext() {
    canvas = document.getElementById("myCanvas");
    gl = canvas.getContext("webgl2");
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 0);
    gl.lineWidth(1.0);
    gl.enable(gl.DEPTH_TEST);
}

async function setup() {
    initializeContext();
    setEventListeners(canvas);
    colorCube();
    createBuffers();
    await loadShaders();
    compileShaders();
    createVertexArrayObjects();
    angle = 0.0;
    angularSpeed = 0.0;
    requestAnimationFrame(render)
};

window.onload = setup;
function colorCube()
{
    var vertices = get_vertices()
    var faces = get_faces()
    console.log(vertices.length)
    console.log(faces.length)
    for ( var i = 0; i < 5693; ++i ) {
        positions.push( vertices[faces[i][0]]);
        colors.push([ 0.0, 0.0, 0.0, 1.0 ]);
        positions.push( vertices[faces[i][1]]);
        colors.push([ 0.0, 0.0, 0.0, 1.0 ]);
        positions.push( vertices[faces[i][2]]);
        colors.push([ 0.0, 0.0, 0.0, 1.0 ]);
    }

    positions = flatten(positions);
    colors = flatten(colors);
}

function quad(a, b, c, d)
{
    var vertices = [
        vec3( -0.5, -0.5,  0.5),
        vec3( -0.5,  0.5,  0.5),
        vec3(  0.5,  0.5,  0.5),
        vec3(  0.5, -0.5,  0.5),
        vec3( -0.5, -0.5, -0.5),
        vec3( -0.5,  0.5, -0.5),
        vec3(  0.5,  0.5, -0.5),
        vec3(  0.5, -0.5, -0.5)
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
    ];
    var indices = [ a, b, c, a, c, d ];
    for ( var i = 0; i < indices.length; ++i ) {
        positions.push( vertices[indices[i]] );
        colors.push(vertexColors[indices[i]]);
    }
}
function createBuffers() {
    position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);
    color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(colors),
        gl.STATIC_DRAW);
}

function loadShaderFile(url) {
    return fetch(url).then(response => response.text());
}

async function loadShaders() {
    const shaderURLs = [
        './main.vert',
        './main.frag'
    ];
    const shader_files = await Promise.all(shaderURLs.map(loadShaderFile));
    vs_source = shader_files[0];
    fs_source = shader_files[1];
}

function compileShaders() {
    vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vs_source);
    gl.compileShader(vs);
    fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fs_source);
    gl.compileShader(fs);
    prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

}

function setUniformVariables() {
    gl.useProgram(prog);
    var transform_loc = gl.getUniformLocation(prog, "transform");
    var model = rotate(angle, [0.0, 1, 0.0]);
    var eye = vec3(0, 0, 10);
    var target = vec3(0, 0, 0);
    var up = vec3(0, 1, 0);
    var view = lookAt(
        eye,
        target,
        up
    );
    var aspect = canvas.width / canvas.height;
    var projection = perspective(90.0, aspect, 0.1, 1000.0);
    var transform = mult(projection, mult(view, model));
    gl.uniformMatrix4fv(transform_loc, false, flatten(transform));
}

function createVertexArrayObjects() {
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    var pos_idx = gl.getAttribLocation(prog, "position");
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    gl.vertexAttribPointer(pos_idx, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(pos_idx);
    var col_idx = gl.getAttribLocation(prog, "color");
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.vertexAttribPointer(col_idx, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(col_idx);
    gl.bindVertexArray(null);
}

function updateAngle(timestamp) {
    if (previousTimestamp === undefined) {
        previousTimestamp = timestamp;
    }
    var delta = (timestamp - previousTimestamp) / 1000;
    angle += angularSpeed*delta;
    angle -= Math.floor(angle/360.0)*360.0;
    angularSpeed = Math.max(angularSpeed - 100.0*delta, 0.0);
    previousTimestamp = timestamp;
}

function render(timestamp) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(prog);
    updateAngle(timestamp)
    setUniformVariables();
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, positions.length/3);
    requestAnimationFrame(render);
}

function setEventListeners(canvas) {
    canvas.addEventListener('click', function (event) {
        angularSpeed += 50;
    })
}
