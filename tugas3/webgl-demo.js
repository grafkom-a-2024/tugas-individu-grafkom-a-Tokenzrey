import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

/* CONTROLLER  */
// Camera control variables
let cameraPos = [0, 0, 0];
let cameraFront = [0, 0, -1];
let cameraUp = [0, 1, 0];
let yaw = -90;
let pitch = 0;
let firstMouse = true;
let speed = 0.1;
let sensitivity = 0.1;
let cameraMode = false; // Camera mode toggle
let pressedKeys = new Set(); // Set to track multiple key presses

// Object control variables
let translationX = 0;
let translationY = 0;
let translationZ = -7;
let rotationX = 0;
let rotationY = 0;
let rotationZ = 0;
let scale = 1;

const updateUI = () => {
	document.getElementById(
		"translationValue"
	).textContent = `[ ${translationX.toFixed(3)}px ${translationY.toFixed(
		3
	)}px ${translationZ.toFixed(3)}px ]`;
	document.getElementById(
		"rotationValue"
	).textContent = `[ ${rotationX}deg ${rotationY}deg ${rotationZ}deg ]`;
	document.getElementById("scaleValue").textContent = scale.toFixed(3);
};

// Toggle camera mode with Ctrl + M, and prevent default behavior
window.addEventListener("keydown", (event) => {
	if (event.ctrlKey && event.key === "m") {
		event.preventDefault(); // Prevent default browser behavior
		cameraMode = !cameraMode; // Toggle camera mode
		console.log(`Camera mode: ${cameraMode ? "ON" : "OFF"}`);
		firstMouse = true; // Reset mouse control
		if (cameraMode) {
			document.body.requestPointerLock(); // Lock pointer to window
		} else {
			document.exitPointerLock(); // Unlock pointer
		}

		// Toggle class !block for a specific element (example element with id 'myElement')
		const myElement = document.getElementById("crosshair");
		if (myElement) {
			myElement.classList.toggle("!block"); // Add or remove the !block class
		}

		updateCameraFront();
	}
});

// Update the camera front direction
const updateCameraFront = () => {
	let front = [];
	front[0] =
		Math.cos(glMatrix.toRadian(yaw)) * Math.cos(glMatrix.toRadian(pitch));
	front[1] = Math.sin(glMatrix.toRadian(pitch));
	front[2] =
		Math.sin(glMatrix.toRadian(yaw)) * Math.cos(glMatrix.toRadian(pitch));
	cameraFront = normalize(front);
};

// Multiple key press handling for camera movement
const handleMovement = () => {
	if (cameraMode) {
		let cameraSpeed = speed;

		if (pressedKeys.has("ShiftLeft")) {
			if (pressedKeys.has("KeyW")) {
				cameraPos[1] += cameraSpeed; // Move up
			} else if (pressedKeys.has("KeyS")) {
				cameraPos[1] -= cameraSpeed; // Move down
			}
		} else {
			if (pressedKeys.has("KeyW")) {
				cameraPos[0] += cameraSpeed * cameraFront[0];
				cameraPos[1] += cameraSpeed * cameraFront[1];
				cameraPos[2] += cameraSpeed * cameraFront[2];
			}
			if (pressedKeys.has("KeyS")) {
				cameraPos[0] -= cameraSpeed * cameraFront[0];
				cameraPos[1] -= cameraSpeed * cameraFront[1];
				cameraPos[2] -= cameraSpeed * cameraFront[2];
			}
			if (pressedKeys.has("KeyA")) {
				let crossLeft = cross(cameraFront, cameraUp);
				normalize(crossLeft);
				cameraPos[0] -= crossLeft[0] * cameraSpeed;
				cameraPos[2] -= crossLeft[2] * cameraSpeed;
			}
			if (pressedKeys.has("KeyD")) {
				let crossRight = cross(cameraFront, cameraUp);
				normalize(crossRight);
				cameraPos[0] += crossRight[0] * cameraSpeed;
				cameraPos[2] += crossRight[2] * cameraSpeed;
			}
		}
	}
};

// Track key presses
window.addEventListener("keydown", (event) => {
	pressedKeys.add(event.code);
	handleMovement();
});

window.addEventListener("keyup", (event) => {
	pressedKeys.delete(event.code);
});

// Mouse control for camera direction only when cameraMode is true
window.addEventListener("mousemove", (event) => {
	if (cameraMode) {
		let offsetX = event.movementX;
		let offsetY = event.movementY;

		offsetX *= sensitivity;
		offsetY *= sensitivity;

		// Arah sumbu Y mungkin perlu dibalik
		offsetY = -offsetY;

		yaw += offsetX;
		pitch += offsetY;

		// Prevent camera flip
		if (pitch > 89.0) pitch = 89.0;
		if (pitch < -89.0) pitch = -89.0;

		updateCameraFront();
	}
});

// Object control (arrow keys, rotation, and scale sliders)
window.addEventListener("keydown", (event) => {
	if (event.ctrlKey) {
		switch (event.key) {
			case "ArrowUp":
				translationY += 0.1;
				break;
			case "ArrowDown":
				translationY -= 0.1;
				break;
			case "ArrowLeft":
				translationX -= 0.1;
				break;
			case "ArrowRight":
				translationX += 0.1;
				break;
		}
		updateUI();
	}
	if (event.shiftKey) {
		switch (event.key) {
			case "ArrowLeft":
				translationZ -= 0.1;
				break;
			case "ArrowRight":
				translationZ += 0.1;
				break;
		}
		updateUI();
	}
});

const updateRotation = (axis, value) => {
	if (axis === "X") rotationX = parseFloat(value);
	if (axis === "Y") rotationY = parseFloat(value);
	if (axis === "Z") rotationZ = parseFloat(value);

	updateUI();
};

// Event listeners for rotation sliders
document.getElementById("rotationX").addEventListener("input", (event) => {
	updateRotation("X", event.target.value);
});

document.getElementById("rotationY").addEventListener("input", (event) => {
	updateRotation("Y", event.target.value);
});

document.getElementById("rotationZ").addEventListener("input", (event) => {
	updateRotation("Z", event.target.value);
});

document.getElementById("scale").addEventListener("input", (event) => {
	scale = parseFloat(event.target.value) / 50; // Scale factor 0.0 to 2.0
	updateUI();
});

// Normalize function for vector operations
function normalize(vec) {
	let length = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
	if (length === 0) return vec; // Prevent division by zero
	vec[0] /= length;
	vec[1] /= length;
	vec[2] /= length;
	return vec;
}

// Cross product for vectors
function cross(v1, v2) {
	return [
		v1[1] * v2[2] - v1[2] * v2[1],
		v1[2] * v2[0] - v1[0] * v2[2],
		v1[0] * v2[1] - v1[1] * v2[0],
	];
}

// Initialize UI and main rendering loop
updateUI();
main();

/* INITIALIZATION WEBGL  */
export function main() {
	const canvas = document.querySelector("#glcanvas");
	const scaleFactor = window.devicePixelRatio || 1;

	// Set ukuran canvas
	canvas.width = canvas.clientWidth * scaleFactor;
	canvas.height = canvas.clientHeight * scaleFactor;

	// Initialize the GL context
	const gl = canvas.getContext("webgl");
	gl.viewport(0, 0, canvas.width, canvas.height);
	// Only continue if WebGL is available and working
	if (gl === null) {
		alert(
			"Unable to initialize WebGL. Your browser or machine may not support it."
		);
		return;
	}

	// Set clear color to black, fully opaque
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// Clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Vertex shader program
	const vsSource = `
	attribute vec4 aVertexPosition;
	attribute vec3 aVertexNormal;
	attribute vec2 aTextureCoord;

	uniform mat4 uNormalMatrix;
	uniform mat4 uModelViewMatrix;
	uniform mat4 uProjectionMatrix;

	varying highp vec2 vTextureCoord;
	varying highp vec3 vLighting;

	void main(void) {
		gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
		vTextureCoord = aTextureCoord;

		// Pencahayaan ambient
		highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
		
		// Pencahayaan directional
		highp vec3 directionalLightColor = vec3(2.0, 2.0, 2.0); 
		highp vec3 directionalVector = normalize(vec3(7.0, 8.0, 5.0)); 

		highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
		highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);

		// Pencahayaan difus
		highp vec3 diffuse = directionalLightColor * directional;

		// Pencahayaan spekular
		highp vec3 viewDirection = normalize(-vec3(uModelViewMatrix[3][0], uModelViewMatrix[3][1], uModelViewMatrix[3][2]));
		highp vec3 reflectDir = reflect(-directionalVector, transformedNormal.xyz);
		highp float specular = pow(max(dot(viewDirection, reflectDir), 0.0), 16.0); // 16.0 adalah shininess

		vLighting = ambientLight + diffuse + specular;
	}
`;

	// Fragment shader program

	const fsSource = `
  	varying highp vec2 vTextureCoord;
	varying highp vec3 vLighting;

 	uniform sampler2D uSampler;

  	void main(void) {
		highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    	gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
  	}
	`;

	// Initialize a shader program; this is where all the lighting
	// for the vertices and so forth is established.
	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

	// Collect all the info needed to use the shader program.
	// Look up which attributes our shader program is using
	// for aVertexPosition, aVertexColor and also
	// look up uniform locations.
	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
			vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
			textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(
				shaderProgram,
				"uProjectionMatrix"
			),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
			normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
			uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
		},
	};

	// Here's where we call the routine that builds all the
	// objects we'll be drawing.
	const buffers = initBuffers(gl);

	// Load texture
	const texture = loadTexture(gl, "cubetexture.png");
	// Flip image pixels into the bottom-to-top order that WebGL expects.
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	// Draw the scene repeatedly
	function render() {
		drawScene(
			gl,
			programInfo,
			buffers,
			texture,
			translationX,
			translationY,
			translationZ,
			rotationX,
			rotationY,
			rotationZ,
			scale,
			cameraPos,
			cameraFront,
			cameraUp
		);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert(
			`Unable to initialize the shader program: ${gl.getProgramInfoLog(
				shaderProgram
			)}`
		);
		return null;
	}

	return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

	// Send the source to the shader object

	gl.shaderSource(shader, source);

	// Compile the shader program

	gl.compileShader(shader);

	// See if it compiled successfully

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(
			`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
		);
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Because images have to be downloaded over the internet
	// they might take a moment until they are ready.
	// Until then put a single pixel in the texture so we can
	// use it immediately. When the image has finished downloading
	// we'll update the texture with the contents of the image.
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
	gl.texImage2D(
		gl.TEXTURE_2D,
		level,
		internalFormat,
		width,
		height,
		border,
		srcFormat,
		srcType,
		pixel
	);

	const image = new Image();
	image.onload = () => {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(
			gl.TEXTURE_2D,
			level,
			internalFormat,
			srcFormat,
			srcType,
			image
		);

		// WebGL1 has different requirements for power of 2 images
		// vs non power of 2 images so check if the image is a
		// power of 2 in both dimensions.
		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			// Yes, it's a power of 2. Generate mips.
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			// No, it's not a power of 2. Turn off mips and set
			// wrapping to clamp to edge
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
	};
	image.src = url;

	return texture;
}

function isPowerOf2(value) {
	return (value & (value - 1)) === 0;
}
