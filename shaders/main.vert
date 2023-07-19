#version 300 es

in vec3 position;
in vec4 color;

out vec4 vertexColor;

uniform mat4 transform;


void main() {

    gl_Position = transform*vec4(position, 1.0f);
    vertexColor = color;

}