#version 300 es

precision mediump float;

in vec3 v_surfaceToLight[2];
in vec3 v_normal;
in vec3 v_surfaceToView;

out mediump vec4 outputColor;

uniform vec3 u_lightDirection[2];
uniform float u_limit[2];   

uniform vec3 u_lightColor[2];
uniform vec3 u_specularColor[2];

void main() {
    vec3 normal = normalize(v_normal);
    vec3 surfaceToLightDirection[2];
    float dotFromDirection[2];
    float limit[2];
    vec4 light_vector;
    vec4 specular_vector;
    vec4 u_color = vec4(0.35,0.2,0.1,1);


    for(int i = 0; i < 2; i++){
        surfaceToLightDirection[i] = normalize(v_surfaceToLight[0]);
        dotFromDirection[i] = dot(surfaceToLightDirection[0],u_lightDirection[0]);
    }

    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection[1] + surfaceToViewDirection);
    float light = 0.0;
    float specular = 0.0;

    //0 -> spotlight
    //1 -> pointl

    if(u_limit[1] > -100000.0){
        light = dot(normal, surfaceToLightDirection[1]);
        if (light > 0.0) {
            specular = pow(dot(normal, halfVector), 50.0);
        }   
    }       
    else {
        if (dotFromDirection[1] >= 0.98) {
            light = dot(normal, surfaceToLightDirection[1]);
            if (light > 0.0) {
                specular = pow(dot(normal, halfVector), 50.0);
        }
        }
    }
    light_vector = vec4(light * u_lightColor[0],1);
    specular_vector = vec4(specular * u_specularColor[0],1);
    
    outputColor = u_color * light_vector + specular_vector;
}