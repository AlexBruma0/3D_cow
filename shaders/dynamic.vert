attribute vec4 vPosition1;
uniform float height;
uniform float width;
void
main()
{
    gl_Position = vPosition1 + vec4(width, height, 0, 0)  ;
}