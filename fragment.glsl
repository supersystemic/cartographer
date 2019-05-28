// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

uniform vec4 u_color;

void main() {
    //just return the set color
    gl_FragColor = u_color;
}
