#version 300 es

in vec3 position2;
in vec4 color;

out vec4 vertexColor;

uniform mat4 transform2;

void main() {

    gl_Position = transform2*vec4(position2, 1.0f);
    vertexColor = color;

}