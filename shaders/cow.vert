#version 300 es

in vec3 a_position;
in vec3 a_normal;
//in vec4 a_color;
uniform vec3 u_viewWorldPosition;


//out vec4 vertexColor;
out vec3 v_normal;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

uniform vec3 u_lightWorldPosition;
uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;
uniform mat4 transform;

void main() {

  // Multiply the position by the matrix.
  //gl_Position = u_worldViewProjection * vec4(a_position,1.0f);
  gl_Position = transform * vec4(a_position, 1.0f);

  // orient the normals and pass to the fragment shader
  v_normal = mat3(u_worldInverseTranspose) * a_normal;

  // compute the world position of the surfoace
  vec3 surfaceWorldPosition = (u_world * vec4(a_position,1.0)).xyz;

  // compute the vector of the surface to the light
  // and pass it to the fragment shader
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;

}