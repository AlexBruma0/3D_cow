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
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    float light = 0.0;
    float specular = 0.0;

    for(int i = 0; i < 2; i++){
        surfaceToLightDirection[i] = normalize(v_surfaceToLight[i]);
        dotFromDirection[i] = dot(surfaceToLightDirection[i],u_lightDirection[i]);
        vec3 halfVector = normalize(surfaceToLightDirection[i] + surfaceToViewDirection);

        if(i == 0){
            light = dot(normal, surfaceToLightDirection[i]);
            if (light > 0.0) {
                specular = pow(dot(normal, halfVector), 50.0);
            }   
        }       
        if (i == 1){
            if (dotFromDirection[i] >= 0.98) {
                light = dot(normal, surfaceToLightDirection[i]);
                if (light > 0.0) {
                    specular = pow(dot(normal, halfVector), 50.0);
            }
        }
        light_vector += vec4(light * u_lightColor[i],1);
        specular_vector += vec4(specular * u_specularColor[i],1);
    }
    
    outputColor = u_color * light_vector + specular_vector;
    }
}