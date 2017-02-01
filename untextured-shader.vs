attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

varying lowp vec4 vColor;

void main(void)
{
	gl_Position = uPMatrix * uVMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	vColor = aVertexColor;
}
