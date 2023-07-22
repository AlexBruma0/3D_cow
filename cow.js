var gl
var canvas
var angleX= 0 ;
var angleY=0;
var point_light_angle = 0.0;
var angularSpeed = 0.0;
var positions = [];
var positions2 = []
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
var point_light = vec3(0, 0, 10);
var target = vec3(0, 0, 0);
var point_light_normal = point_light
const cow_color = vec3(0.9,0.5,0.2)
const rot = rotate(cube_angle, [0.0, 1, 0.0]);
var v = 0
var vertex_normals
window.onload = async function setup() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
      alert("WebGL isn't available");
    }
    initializeContext();
    setEventListeners(canvas);
    normals = setNormals(faces,vertices)
    vertex_normals = await setNormals2(faces,vertices)
    set_positions();
    createBuffers();
    await loadShaders();
    compileShaders();
    wire_frame_cube()
    createVertexArrayObjects();
    rotateLight()
    requestAnimationFrame(render)
};

function initializeContext() {
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1);
    gl.lineWidth(1.0);
    gl.enable(gl.DEPTH_TEST);
}


function loadShaderFile(url) {
    return fetch(url).then(response => response.text());
}
var cone_vs_source
var cube_fs_source
async function loadShaders() {
    const shaderURLs = [
        './shaders/cow.vert',
        './shaders/cube.vert',
        './shaders/cow.frag',
        './shaders/cone.vert',
        './shaders/cube.frag'
    ];
    const shader_files = await Promise.all(shaderURLs.map(loadShaderFile));
    vs_source = shader_files[0];
    vs_source2 = shader_files[1];
    fs_source = shader_files[2];
    cone_vs_source=shader_files[3];
    cube_fs_source = shader_files[4]
}

var vs2
var prog2
var cone_vs
var cone_prog
var cube_fs
function compileShaders() {
    vs = create_shader(gl,vs_source,gl.VERTEX_SHADER)

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        // there was an error
        console.error(gl.getShaderInfoLog(vs));
    }
    fs = create_shader(gl, fs_source, gl.FRAGMENT_SHADER)

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        // there was an error
        console.error(gl.getShaderInfoLog(fs));
    }
    vs2 = create_shader(gl, vs_source2, gl.VERTEX_SHADER)

    if (!gl.getShaderParameter(vs2, gl.COMPILE_STATUS)) {
        // there was an error
        console.error(gl.getShaderInfoLog(vs2));
    }
    cone_vs = create_shader(gl, cone_vs_source, gl.VERTEX_SHADER)

    if (!gl.getShaderParameter(cone_vs, gl.COMPILE_STATUS)) {
        // there was an error
        console.error(gl.getShaderInfoLog(cone_vs));
    }
    cube_fs = create_shader(gl,cube_fs_source,gl.FRAGMENT_SHADER)

    if (!gl.getShaderParameter(cube_fs, gl.COMPILE_STATUS)) {
        // there was an error
        console.error(gl.getShaderInfoLog(cube_fs_source));
    }



    prog = create_program(gl,vs,fs)
    prog2 = create_program(gl,vs2,cube_fs)
    cone_prog = create_program(gl,cone_vs,cube_fs)
}

var cone_positions
const set_positions = () =>{
    [positions,colors,normals] = cow(point_light_normal,vertex_normals, cow_color, vertices)
    positions2 = wire_frame_cube()
    cone_positions = cone()
}

var position_buffer2
var cone_position_buffer
var normal_buffer
function createBuffers() {
    normal_buffer = create_buffer(gl, normals);
    position_buffer = create_buffer(gl,positions)
    color_buffer = create_buffer(gl, colors)
    position_buffer2 = create_buffer(gl,positions2)
    cone_position_buffer = create_buffer(gl,cone_positions)
}

var cube_angle = 0;
var cone_angle = 0
var temp = []
function setUniformVariables() {
    var eye = vec3(0,0,30);
    var target = vec3(0, 0, 0);
    var up = vec3(0, 1, 0);
    var view = lookAt(
        eye,
        target,
        up
    );
    var aspect = canvas.width / canvas.height;
    var projection = perspective(30.0, aspect, 0.1, 20000.0);
    //for cube 
    gl.useProgram(prog2);
    var transform_loc2 = gl.getUniformLocation(prog2, "transform2");
    var model2 = rotate(cube_angle, [0.0, 1, 0.0]);
    var transform2 = mult(projection, mult(view, model2));
    gl.uniformMatrix4fv(transform_loc2, false, flatten(transform2));
    //for cow
    gl.useProgram(prog);
    var worldViewProjectionLocation = gl.getUniformLocation(prog, "u_worldViewProjection");
    var worldInverseTransposeLocation = gl.getUniformLocation(prog, "u_worldInverseTranspose");
    var lightWorldPositionLocation = gl.getUniformLocation(prog, "u_lightWorldPosition");
    var viewWorldPositionLocation = gl.getUniformLocation(prog, "u_viewWorldPosition");
    var worldLocation = gl.getUniformLocation(prog, "u_world");

    var projectionMatrix = projection
    var cameraMatrix = view
    var viewMatrix = inverse(cameraMatrix);
    var viewProjectionMatrix = mult(projectionMatrix, viewMatrix);
    var worldMatrix = rotate(angleX, [0.0, 1, 0.0]);
    var worldViewProjectionMatrix = mult(viewProjectionMatrix, worldMatrix);
    var worldInverseMatrix = inverse(worldMatrix);
    var worldInverseTransposeMatrix = transpose(worldInverseMatrix);

    gl.uniformMatrix4fv(worldViewProjectionLocation, false, flatten(worldViewProjectionMatrix));
    gl.uniformMatrix4fv(worldInverseTransposeLocation, false, flatten(worldInverseTransposeMatrix));
    gl.uniformMatrix4fv(worldLocation, false, flatten(worldMatrix));
    const lightPosition = [0, 1, 5];
    gl.uniform3fv(lightWorldPositionLocation, lightPosition);
    var transform_loc = gl.getUniformLocation(prog, "transform");
    var transform_loc = gl.getUniformLocation(prog, "transform");
    var model = rotate(angleX, [0.0, 1, 0.0]);
    var modelY = rotate(angleY, [1.0, 0, 0.0]);
    var t = translate( translateX, translateY, translateZ )
    var transform = mult(projection, mult(view, mult(mult(model,modelY),t)));
    gl.uniformMatrix4fv(transform_loc,false, flatten(transform));
    
    var camera = [0, 0, 30];
    gl.uniform3fv(viewWorldPositionLocation, camera);
    
    var lightDirection = [0, 0, 1];
    var limit = radians(20);
    var lightDirectionLocation = gl.getUniformLocation(prog, "u_lightDirection");
    var limitLocation = gl.getUniformLocation(prog, "u_limit");
    gl.uniform3fv(lightDirectionLocation, lightDirection);
    gl.uniform1f(limitLocation, Math.cos(limit));
    // var lightSource_loc = gl.getUniformLocation(prog, "lightSource");
    // gl.uniform3fv(lightSource_loc, point_light_normal)

    // var limit = 0.35;
    // var limitLocation = gl.getUniformLocation(prog, "u_limit");
    // gl.uniform1f(limitLocation, Math.cos(limit));

    // var worldMatrix = rotate(angleX, [0.0, 1, 0.0]);
    // var world_loc = gl.getUniformLocation(prog, "u_world");
    // gl.uniformMatrix4fv(world_loc,false,flatten(worldMatrix))

    // var viewWorldPositionLocation = gl.getUniformLocation(prog, "u_viewWorldPosition");
    // gl.uniform3fv(viewWorldPositionLocation, eye);

    // var lightDirection = [0,0, 1];
    // var limit = 9;
   
    // var lightDirectionLocation = gl.getUniformLocation(prog, "u_lightDirection");
    // var limitLocation = gl.getUniformLocation(prog, "u_limit");

    // gl.uniform3fv(lightDirectionLocation, lightDirection);
    // gl.uniform1f(limitLocation, Math.cos(limit));
    //for cone
    gl.useProgram(cone_prog);
    var transform_loc3 = gl.getUniformLocation(cone_prog, "transform2");
    var model3 = mult(translate(0,0,6),mult(rotate(cone_angle, [0, 1,0]),translate(0,0,-6)));
    var transform3 = mult(projection, mult(view, model3));
    gl.uniformMatrix4fv(transform_loc3, false, flatten(transform3));

}

var vao2
var vao3
function createVertexArrayObjects() {
    //for cow
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    var pos_idx = gl.getAttribLocation(prog, "a_position");
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    gl.vertexAttribPointer(pos_idx, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(pos_idx);

    var norm_idx = gl.getAttribLocation(prog, "a_normal")
    gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
    gl.vertexAttribPointer(norm_idx, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(norm_idx);
    gl.bindVertexArray(null);

    // var col_idx = gl.getAttribLocation(prog, "color");
    // gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    // gl.vertexAttribPointer(col_idx, 4, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(col_idx);
    // gl.bindVertexArray(null);
    // //for cube
    // vao2 = gl.createVertexArray();
    // gl.bindVertexArray(vao2);
    // var pos_idx2 = gl.getAttribLocation(prog2, "position2");
    // gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer2);
    // gl.vertexAttribPointer(pos_idx2, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(pos_idx2);

    // // //for cone
    // vao3 = gl.createVertexArray();
    // gl.bindVertexArray(vao3);
    // var pos_idx3 = gl.getAttribLocation(cone_prog, "position2");
    // gl.bindBuffer(gl.ARRAY_BUFFER, cone_position_buffer);
    // gl.vertexAttribPointer(pos_idx3, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(pos_idx3);

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
var theta = 10
var spotlight = vec4(0,6,6,0)
var spotlight_target = vec4(0,0,0,0)
var spotlight_normal
function rotateLight() {
    var origin_point_light = vec4(8,5,5,0)
    setInterval(() =>{
        // point_light[0] = dot(origin_point_light,rotate(cube_angle,[0,1,0])[0] )
        // point_light[2] = dot(origin_point_light,rotate(cube_angle,[0,1,0])[2] )

        spotlight_target[0] = dot(vec4(0,0,-6,0), rotate(cone_angle,[0,1,0])[0] )
        spotlight_target[2] = dot(vec4(0,0,-6,0), rotate(cone_angle,[0,1,0]) [2] )
        
        cube_angle +=6
        if(Math.abs(cone_angle) >= 30){
            theta = -theta
        }
        cone_angle +=theta
        
        // point_light_normal = normalize(subtract(target,point_light))
        // point_light_normal = scale(-1,point_light_normal)

        spotlight_normal = normalize(subtract(spotlight_target, spotlight))
        // colors = []
        // for ( var i = 0; i < faces.length ; i++ ) {
        //     var newColor = []
        //     var newColor2 = []
        //     var dot_product = dot(point_light_normal, normalize(normals[i]) )
        //     var dot_product_spotlight = dot(spotlight_normal, normalize(vec4(normals[i],1)) )
        //     cow_color.forEach((c,j) => {newColor[j] = cow_color[j] * dot_product_spotlight * -1})
        //     cow_color.forEach((c,j) => {newColor2[j] = cow_color[j] * dot_product * -1})
        //     colors.push([ newColor[0]+newColor2[0], newColor[1]+newColor2[1], newColor[2]+newColor2[2], 1.0 ]);
        //     colors.push([ newColor[0]+newColor2[0], newColor[1]+newColor2[1], newColor[2]+newColor2[2], 1.0 ]);
        //     colors.push([ newColor[0]+newColor2[0], newColor[1]+newColor2[1], newColor[2]+newColor2[2], 1.0 ]);
        // } 
        // flatten(colors)
        // color_buffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        // gl.bufferData(gl.ARRAY_BUFFER,
        //     flatten(colors),
        //     gl.STATIC_DRAW);
        // var col_idx = gl.getAttribLocation(prog, "color");
        // gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        // gl.vertexAttribPointer(col_idx, 4, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(col_idx);
        // gl.bindVertexArray(null);

    },70)
}

function render(timestamp) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    updateAngle(timestamp)
    setUniformVariables();

    gl.useProgram(prog2);
    gl.bindVertexArray(vao2);
    gl.drawArrays(gl.LINES, 0, positions2.length/3);

    gl.useProgram(cone_prog);
    gl.bindVertexArray(vao3);
    gl.drawArrays(gl.LINES, 0, cone_positions.length/3);

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
