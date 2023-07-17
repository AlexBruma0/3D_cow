var gl
var canvas;
var angleX= 0 ;
var angleY=0;
var angularSpeed;
var positions = [];
var colors = [];
var normals = []
var faces = get_faces();
var vertices = get_vertices();
var position_buffer;
var color_buffer;
var normal_buffer;
var vs_source;
var fs_source;
var vs;
var fs;
var prog;
var vao;
var previousTimestamp;
var translateX =0;
var translateY =0;
var translateZ = 0

function initializeContext() {
    canvas = document.getElementById("myCanvas");
    gl = canvas.getContext("webgl2");
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1);
    gl.lineWidth(1.0);
    gl.enable(gl.DEPTH_TEST);
}

async function setup() {
    initializeContext();
    setEventListeners(canvas);
    colorCube();
    setNormals()
    createBuffers();
    await loadShaders();
    compileShaders();
    createVertexArrayObjects();
    angularSpeed = 0.0;
    requestAnimationFrame(render)
};
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

window.onload = setup;

function setNormals() {
    for ( var i = 0; i < faces.length ; i++ ) {
        var u = subtract(vertices[faces[i][0] -1 ] , vertices[faces[i][1] -1 ])
        var v = subtract(vertices[faces[i][0] -1 ] , vertices[faces[i][2] -1 ])
        var c = cross(u,v)
        normals.push(c)
    }
    normals = flatten(normals)
}

const colorCube = async() =>{
    for ( var i = 0; i < faces.length ; i++ ) {
        positions.push( vertices[faces[i][0] -1 ]);
        colors.push([ 0.0, 0.0, 0.0, 1.0 ]);
        positions.push( vertices[faces[i][1] -1 ]);
        colors.push([ 0.0, 0.0, 0.0, 1.0 ]);
        positions.push( vertices[faces[i][2] -1 ]);
        colors.push([ 0.0, 0.0, 0.0, 1.0 ]);
    }
    positions = flatten(positions);
    colors = flatten(colors);
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
    
    normal_buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(normals),
        gl.STATIC_DRAW);
}

function setUniformVariables() {
    gl.useProgram(prog);
    var transform_loc = gl.getUniformLocation(prog, "transform");
    var model = rotate(angleX, [0.0, 1, 0.0]);
    var modelY = rotate(angleY, [1.0, 0, 0.0]);
    var t = translate( translateX, translateY, translateZ )
    var eye = vec3(0, 0, 30);
    var target = vec3(0, 0, 0);
    var up = vec3(0, 1, 0);
    var view = lookAt(
        eye,
        target,
        up
    );
    var aspect = canvas.width / canvas.height;
    var projection = perspective(30.0, aspect, 0.1, 10000.0);
    var transform = mult(projection, mult(view, mult(mult(model,modelY),t)));
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

    var normalLocation = gl.getAttribLocation(prog, "normal")

}

function updateAngle(timestamp) {
    if (previousTimestamp === undefined) {
        previousTimestamp = timestamp;
    }
    var delta = (timestamp - previousTimestamp) / 1000;
    angleX += angularSpeed*delta;
    angleX -= Math.floor(angleX/360.0)*360.0;
    angularSpeed = Math.max(angularSpeed - 100.0*delta, 0.0);
    previousTimestamp = timestamp;
}
function updatePosition(timestamp) {
  if (previousTimestamp === undefined) {
    previousTimestamp = timestamp;
  }
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
document.addEventListener('contextmenu', event => event.preventDefault());
function setEventListeners(canvas) {
    canvas.addEventListener('mousemove', function (event) {
        if(event.which == 1){
          console.log(event.movementX)
          translateX = translateX +(event.movementX)/100
          translateY = translateY- (event.movementY)/80
        }
        if(event.which == 3) {
          angleX = angleX +(event.movementX)/2
          angleY = angleY + (event.movementY)/2
        }
    })
    canvas.addEventListener('wheel', function (event) {
      translateZ = translateZ - event.deltaY/10
    })

}
