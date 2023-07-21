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
function setNormals2(faces,vertices) {
    return new Promise((resolve, reject) => {
        var face_normals = faceNormals(faces,vertices)

        var normals = []
        console.log(vertices.length)
        console.log(faces.length)
        for ( var i = 1; i <= vertices.length ; i++ ) {
            var faces_with_vertex = []
            for ( var j = 0; j < faces.length ; j++ ) {
                faces[j].forEach((vertex) => {
                    if(vertex == i){
                        faces_with_vertex.push(j)
                    }
                })
            }
            var temp = [0,0,0];
            for(var k = 0; k < faces_with_vertex.length; k++){
                temp[0] += face_normals[faces_with_vertex[k]][0]
                temp[1] += face_normals[faces_with_vertex[k]][1]
                temp[2] += face_normals[faces_with_vertex[k]][2]
            }
            temp[0] = temp[0] / faces_with_vertex.length
            temp[1] = temp[1] / faces_with_vertex.length
            temp[2] = temp[2] / faces_with_vertex.length
            
            normals.push(temp)
        }
        resolve(normals);

    })

}

function faceNormals(faces,vertices) {
    var normals = []
    for ( var i = 0; i < faces.length ; i++ ) {
        var u = subtract(vertices[faces[i][0] -1 ] , vertices[faces[i][1] -1 ])
        var v = subtract(vertices[faces[i][0] -1 ] , vertices[faces[i][2] -1 ])
        var c = cross(u,v)
        normals.push(c)
    }
    return normals
}
