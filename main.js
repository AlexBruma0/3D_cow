var gl;

window.onload = async function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
      alert("WebGL isn't available");
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    programBlack = initShaders(gl, "./shaders/static.vert", "./shaders/black.frag");
    render()
}

const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    cow()
    //window.requestAnimationFrame(render);
  };