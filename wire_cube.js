const cow = (point_light_normal,normals, cow_color,vertices) => {
    var positions = []
    var colors = []
    var faces = get_faces();
    
    for ( var i = 0; i < faces.length ; i++ ) {
        var newColor = []
        var dot_product = dot(point_light_normal, normalize(normals[i]) )
        cow_color.forEach((c,j) => {newColor[j] = cow_color[j] * dot_product * -1})

        positions.push( vertices[faces[i][0] -1 ]);
        colors.push([ newColor[0], newColor[1], newColor[2], 1.0 ]);
        positions.push( vertices[faces[i][1] -1 ]);
        colors.push([ newColor[0], newColor[1], newColor[2], 1.0 ]);
        positions.push( vertices[faces[i][2] -1 ]);
        colors.push([ newColor[0], newColor[1], newColor[2], 1.0 ]);
    }
    positions = flatten(positions);
    colors = flatten(colors);
    return [positions,colors]
}


const compile_shaders_wfc = (gl, vs_source2, fs) =>{
    var vs2 = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs2, vs_source2); 
    gl.compileShader(vs2);

    var prog2 = gl.createProgram()
    gl.attachShader(prog2,vs2)
    gl.attachShader(prog2,fs)
    gl.linkProgram(prog2)

    return [vs2,prog2]
}

const wire_frame_cube = () => {
    var positions2 = []

    console.log('hi')

    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );

    function quad(a, b, c, d){         
        var vertices = [
            vec3( -0.5, -0.5,  10.5),
            vec3( -0.5,  0.5,  10.5),
            vec3(  0.5,  0.5,  10.5),
            vec3(  0.5, -0.5,  10.5),
            vec3( -0.5, -0.5,  9.5),
            vec3( -0.5,  0.5,  9.5),
            vec3(  0.5,  0.5,  9.5),
            vec3(  0.5, -0.5,  9.5)
        ];

        var indices = [ a, b, c, a, c, d ];
        for ( var i = 0; i < indices.length; ++i ) {
            positions2.push( vertices[indices[i]] );
        }
    }

    positions2 = flatten(positions2)
    return positions2
}


