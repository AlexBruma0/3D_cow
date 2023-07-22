#version 300 es

precision mediump float;

in vec3 v_surfaceToLight;
in vec3 v_normal;
in vec3 v_surfaceToView;

out mediump vec4 outputColor;

uniform vec3 u_lightDirection;
uniform float u_limit;          

void main() {
    vec3 normal = normalize(v_normal);

    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
    float light = 0.0;
    float specular = 0.0;

    float dotFromDirection = dot(surfaceToLightDirection,u_lightDirection);
                                
    if (dotFromDirection >= u_limit) {
        light = dot(normal, surfaceToLightDirection);
        if (light > 0.0) {
        specular = pow(dot(normal, halfVector), 50.0);
        }
    }

    vec4 u_color = vec4(0.35,0.2,0.1,1);
    
    outputColor = u_color;
    outputColor.rgb *= light;
    outputColor.rgb += specular;
}