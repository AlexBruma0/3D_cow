var gl
var canvas
var angleX= 0 ;
var angleY=0;
var point_light_angle = 0;
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
var vs_source2;
var fs_source;
var vs;
var fs;
var prog;
var vao;
var previousTimestamp;
var translateX =0;
var translateY =0;
var translateZ = 0
var point_light = vec3(8,5,5);
var target = vec3(0, 0, 0);
var point_light_normal = normalize(subtract(target,point_light))
const cow_color = vec3(0.9,0.5,0.2)
const rot = rotate(5, [0.0, 1, 0.0]);
var v = 0

window.onload = async function setup() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
      alert("WebGL isn't available");
    }
    initializeContext();
    setEventListeners(canvas);
    setNormals()
    colorCube();
    createBuffers();
    await loadShaders();
    compileShaders();
    wire_frame_cube()
    createVertexArrayObjects();
    angularSpeed = 0.0;
    rotateLight()
    requestAnimationFrame(render)
};


function initializeContext() {

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1);
    gl.lineWidth(1.0);
    gl.enable(gl.DEPTH_TEST);
}


function loadShaderFile(url) {
    return fetch(url).then(response => response.text());
}

async function loadShaders() {
    const shaderURLs = [
        './shaders/main.vert',
        './shaders/cube.vert',
        './shaders/main.frag'
    ];
    const shader_files = await Promise.all(shaderURLs.map(loadShaderFile));
    vs_source = shader_files[0];
    vs_source2 = shader_files[1];
    fs_source = shader_files[2];
}

var vs2
var prog2
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

    vs2 = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs2, vs_source2); 
    gl.compileShader(vs2);

    prog2 = gl.createProgram()
    gl.attachShader(prog2,vs2)
    gl.attachShader(prog2,fs)
    gl.linkProgram(prog2)

}

function setNormals() {
    for ( var i = 0; i < faces.length ; i++ ) {
        var u = subtract(vertices[faces[i][0] -1 ] , vertices[faces[i][1] -1 ])
        var v = subtract(vertices[faces[i][0] -1 ] , vertices[faces[i][2] -1 ])
        var c = cross(u,v)
        normals.push(c)
    }
    return normals
}

var positions2 = []
const colorCube = () =>{
    [positions,colors] = cow(point_light_normal,normals, cow_color, vertices)
    positions2 = wire_frame_cube()
}


var position_buffer2

function createBuffers() {
    position_buffer = create_buffer(gl,positions)
    color_buffer = create_buffer(gl, colors)
    position_buffer2 = create_buffer(gl,positions2)
}

var cube_angle = 0;
function setUniformVariables() {
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

    gl.useProgram(prog2);
    var transform_loc2 = gl.getUniformLocation(prog2, "transform2");
    var model2 = rotate(cube_angle, [0.0, 1, 0.0]);
    var transform2 = mult(projection, mult(view, model2));
    gl.uniformMatrix4fv(transform_loc2, false, flatten(transform2));

    gl.useProgram(prog);
    var transform_loc = gl.getUniformLocation(prog, "transform");
    var model = rotate(angleX, [0.0, 1, 0.0]);
    var modelY = rotate(angleY, [1.0, 0, 0.0]);
    var t = translate( translateX, translateY, translateZ )
    var transform = mult(projection, mult(view, mult(mult(model,modelY),t)));
    gl.uniformMatrix4fv(transform_loc, false, flatten(transform));


}

var vao2
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

    vao2 = gl.createVertexArray();
    gl.bindVertexArray(vao2);
    var pos_idx2 = gl.getAttribLocation(prog2, "position2");
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer2);
    gl.vertexAttribPointer(pos_idx2, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(pos_idx2);

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
function rotateLight() {
    
    setInterval(() =>{
        point_light[0] = dot(vec4(point_light,0),rot[0] )
        point_light[2] = dot(vec4(point_light,0),rot[2] )

        if(Math.abs(dot(point_light,vec3(8,5,5))) < 0.1 ){
            console.log('hi')
            point_light= vec3(8,5,5)
        }


        cube_angle +=6
        point_light_normal = normalize(subtract(target,point_light))
        colors = []
        for ( var i = 0; i < faces.length ; i++ ) {
            var newColor = []
            var dot_product = dot(point_light_normal, normalize(normals[i]) )
            cow_color.forEach((c,j) => {newColor[j] = cow_color[j] * dot_product * -1})
            colors.push([ newColor[0], newColor[1], newColor[2], 1.0 ]);
            colors.push([ newColor[0], newColor[1], newColor[2], 1.0 ]);
            colors.push([ newColor[0], newColor[1], newColor[2], 1.0 ]);
        } 
        flatten(colors)
        color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER,
            flatten(colors),
            gl.STATIC_DRAW);
        var col_idx = gl.getAttribLocation(prog, "color");
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.vertexAttribPointer(col_idx, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(col_idx);
        gl.bindVertexArray(null);

        position_buffer2 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer2);
        gl.bufferData(gl.ARRAY_BUFFER,
            flatten(positions2),
            gl.STATIC_DRAW);
            vao2 = gl.createVertexArray();
        gl.bindVertexArray(vao2);
        var pos_idx2 = gl.getAttribLocation(prog, "position");
        gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer2);
        gl.vertexAttribPointer(pos_idx2, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(pos_idx2);

    },70)
}

function render(timestamp) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    updateAngle(timestamp)
    setUniformVariables();

    gl.useProgram(prog2);
    gl.bindVertexArray(vao2);
    gl.drawArrays(gl.LINES, 0, positions2.length/3);

    gl.useProgram(prog);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, positions.length/3);

    requestAnimationFrame(render);
}
document.addEventListener('contextmenu', event => event.preventDefault());
function setEventListeners(canvas) {
    canvas.addEventListener('mousemove', function (event) {
        if(event.which == 1){
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
