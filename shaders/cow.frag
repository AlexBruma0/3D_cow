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
    vec3 c = normalize(vec3(22,12,5))*0.8;
    vec4 u_color = vec4(c,1);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    float light = 0.0;
    float specular = 0.0;

    for(int i = 0; i < 2; i++){
        surfaceToLightDirection[i] = normalize(v_surfaceToLight[i]);
        dotFromDirection[i] = dot(surfaceToLightDirection[i], normalize(u_lightDirection[i]));
        vec3 halfVector = normalize(surfaceToLightDirection[i] + surfaceToViewDirection);
        float t = 0.32;
        vec4 temp = vec4(t,t,t,1);

        if(i == 0){
            light = dot(normal, surfaceToLightDirection[i]);
            if (light > 0.0) {
                specular = pow(dot(normal, halfVector), 50.0);
            } 
            light_vector = vec4(light * u_lightColor[0],1) + temp;
            specular_vector = vec4(specular * u_specularColor[0],1);  
        }       
        if (i == 1){
            if (abs(dotFromDirection[i])  >= 0.989) {
                light = 1.0;
                if (light > 0.0) {
                    specular = pow(dot(normal, halfVector), 8.0);
                }
                light_vector = vec4(light * u_lightColor[1],1);
                specular_vector = vec4(specular * u_specularColor[1],1);
            }

        }
    }
    outputColor = u_color * light_vector + specular_vector;

}