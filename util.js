const create_buffer = (gl, positions) =>{
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        flatten(positions),
        gl.STATIC_DRAW);
    return buffer
}   