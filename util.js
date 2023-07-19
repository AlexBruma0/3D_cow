const create_buffer = (gl, positions) =>{
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        flatten(positions),
        gl.STATIC_DRAW);
    return buffer
}   

const create_shader = (gl, vs_source, type) => {
    var vs = gl.createShader(type);
    gl.shaderSource(vs, vs_source);
    gl.compileShader(vs);
    return vs
}

const create_program = (gl,vs,fs) => {
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    return prog
}

function setNormals(faces,vertices) {
    var normals = []
    for ( var i = 0; i < faces.length ; i++ ) {
        var u = subtract(vertices[faces[i][0] -1 ] , vertices[faces[i][1] -1 ])
        var v = subtract(vertices[faces[i][0] -1 ] , vertices[faces[i][2] -1 ])
        var c = cross(u,v)
        normals.push(c)
    }
    return normals
}
