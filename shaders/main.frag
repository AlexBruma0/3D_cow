#version 300 es

precision mediump float;

in mediump vec4 vertexColor;
in vec3 vertexLightSource;
in vec3 vertexNormal;

out mediump vec4 outputColor;

void main() {
    vec3 normal = normalize(vertexNormal);
    vec3 light_color = vec3(3,3,3);
    vec3 light_source = normalize(vertexLightSource);
    float diffuse_strength = max(0.0, dot(light_source, normal));
    vec3 diffuse = diffuse_strength * light_color;

    vec3 camera_source = vec3(0,0,1);
    vec3 view_source = normalize(camera_source);
    vec3 reflect_source = normalize(reflect(-light_source,normal));
    float specular_strength = max(0.0,dot(view_source,reflect_source));
    specular_strength = pow(specular_strength, 20.0);
    vec3 specular = specular_strength * light_color;

    vec3 lighting = vec3(0,0,0);
    lighting = 0.5* diffuse + 0.5 *specular;

    vec3 model_color = vec3(0.35,0.2,0.1);
    vec3 color = model_color * lighting;



    outputColor = vec4(color,1.0f);
}