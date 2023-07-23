#version 300 es

in vec3 a_position;
in vec3 a_normal;
uniform vec3 u_viewWorldPosition;


out vec3 v_normal;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

uniform vec3 u_lightWorldPosition;
uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;
uniform mat4 transform;

void main() {
  gl_Position = transform * vec4(a_position, 1.0f);
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
  vec3 surfaceWorldPosition = (u_world * vec4(a_position,1.0)).xyz;
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;

}