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


const cone = () => {
    var positions2 = []

     quad( 8, 0, 3, 8 );
    quad( 8, 3, 7, 8 );
    quad( 3, 0, 4, 7 );
    quad( 4, 8, 8, 7 );
     quad( 8, 4, 0, 8 );

    function quad(a, b, c, d){         
        var vertices = [
            vec3( -0.5, 5.5,  6.5), //0
            vec3( -0.5,  6.5,  6.5), //1
            vec3(  0.5,  6.5,  6.5), //2
            vec3(  0.5, 5.5,  6.5),//3
            vec3( -0.5, 5.5,  5.5),//4
            vec3( .5,  6.5,  5.5),//5
            vec3(  0.5,  6.5,  5.5),//6
            vec3(  0.5, 5.5,  5.5),//7

            vec3(  0,    6.2,   6)//8
        ];

        var indices = [ a, b, c, a, c, d ];
        for ( var i = 0; i < indices.length; ++i ) {
            positions2.push( vertices[indices[i]] );
        }
    }

    positions2 = flatten(positions2)
    return positions2

}

const wire_frame_cube = () => {
    var positions2 = []

    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );

    function quad(a, b, c, d){         
        var vertices = [
            vec3( 4.5, 4.5,  0.5),
            vec3( 4.5,  5.5,  0.5),
            vec3(  5.5,  5.5,  0.5),
            vec3(  5.5, 4.5,  0.5),
            vec3( 4.5, 4.5,  -0.5),
            vec3( 4.5,  5.5,  -0.5),
            vec3(  5.5,  5.5,  -0.5),
            vec3(  5.5, 4.5,  -0.5)
        ];

        var indices = [ a, b, c, a, c, d ];
        for ( var i = 0; i < indices.length; ++i ) {
            positions2.push( vertices[indices[i]] );
        }
    }

    positions2 = flatten(positions2)
    return positions2
}
const sin = (x) => {
    const divisor = 40;

    return Math.sin(x) / divisor;
    };
const cos = (x) => {
    const divisor = 40;

    return Math.cos(x) / divisor;
};





