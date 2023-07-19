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