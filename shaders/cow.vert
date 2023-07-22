#version 300 es

in vec3 position;
in vec3 normal;
in vec4 color;


out vec4 vertexColor;
out vec3 vertexNormal;
out vec3 vertexLightSource;

uniform mat4 transform;
uniform vec3 lightSource; 
uniform mat4 u_world;


void main() {

    gl_Position = transform*vec4(position, 1.0f);
    vertexColor = color;
    vertexNormal = normal;

    vec3 surfaceWorldPosition = (u_world * vec4(position,1)).xyz;

    vertexLightSource = lightSource - surfaceWorldPosition;
  

}