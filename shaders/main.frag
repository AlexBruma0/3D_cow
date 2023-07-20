#version 300 es

precision mediump float;

in mediump vec4 vertexColor;

in vec3 vertexNormal;

out mediump vec4 outputColor;

void main() {
    outputColor = vec4(vertexNormal,1.0f);
}