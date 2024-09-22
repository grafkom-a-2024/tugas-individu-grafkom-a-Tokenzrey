function drawScene(
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
) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
	gl.clearDepth(1.0); // Clear everything
	gl.enable(gl.DEPTH_TEST); // Enable depth testing
	gl.depthFunc(gl.LEQUAL); // Near things obscure far things

	// Clear the canvas before we start drawing on it.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Create a perspective matrix
	const fieldOfView = (45 * Math.PI) / 180; // in radians
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;
	const projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

	// View matrix (camera positioning)
	const viewMatrix = mat4.create();
	mat4.lookAt(
		viewMatrix,
		cameraPos,
		[
			cameraPos[0] + cameraFront[0],
			cameraPos[1] + cameraFront[1],
			cameraPos[2] + cameraFront[2],
		],
		cameraUp
	);

	// Model matrix
	const modelViewMatrix = mat4.create();

	// Apply translation
	mat4.translate(modelViewMatrix, modelViewMatrix, [
		translationX,
		translationY,
		translationZ,
	]);

	// Apply rotations
	mat4.rotate(
		modelViewMatrix,
		modelViewMatrix,
		glMatrix.toRadian(rotationX),
		[1, 0, 0]
	);
	mat4.rotate(
		modelViewMatrix,
		modelViewMatrix,
		glMatrix.toRadian(rotationY),
		[0, 1, 0]
	);
	mat4.rotate(
		modelViewMatrix,
		modelViewMatrix,
		glMatrix.toRadian(rotationZ),
		[0, 0, 1]
	);

	// Apply scaling
	mat4.scale(modelViewMatrix, modelViewMatrix, [scale, scale, scale]);
	
	const normalMatrix = mat4.create();
	mat4.invert(normalMatrix, modelViewMatrix);
	mat4.transpose(normalMatrix, normalMatrix);
	// Combine view and model matrices
	const combinedMatrix = mat4.create();
	mat4.multiply(combinedMatrix, viewMatrix, modelViewMatrix);

	// Set the attributes for position and color
	setPositionAttribute(gl, buffers, programInfo);
	setTextureAttribute(gl, buffers, programInfo);
	// setColorAttribute(gl, buffers, programInfo);

	// Bind indices
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

	setNormalAttribute(gl, buffers, programInfo);

	// Use the shader program
	gl.useProgram(programInfo.program);

	// Set the uniforms
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.projectionMatrix,
		false,
		projectionMatrix
	);
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.modelViewMatrix,
		false,
		combinedMatrix
	);

	gl.uniformMatrix4fv(
		programInfo.uniformLocations.normalMatrix,
		false,
		normalMatrix
	);

	// Tell WebGL we want to affect texture unit 0
	gl.activeTexture(gl.TEXTURE0);

	// Bind the texture to texture unit 0
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// Tell the shader we bound the texture to texture unit 0
	gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
	{
		// Draw the scene
		const vertexCount = buffers.vertexCount;
		const type = gl.UNSIGNED_SHORT;
		const offset = 0;
		gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	}
}

// Position attribute
function setPositionAttribute(gl, buffers, programInfo) {
	const numComponents = 3;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
	gl.vertexAttribPointer(
		programInfo.attribLocations.vertexPosition,
		numComponents,
		type,
		normalize,
		stride,
		offset
	);
	gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// Color attribute
function setColorAttribute(gl, buffers, programInfo) {
	const numComponents = 4;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
	gl.vertexAttribPointer(
		programInfo.attribLocations.vertexColor,
		numComponents,
		type,
		normalize,
		stride,
		offset
	);
	gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

// tell webgl how to pull out the texture coordinates from buffer
function setTextureAttribute(gl, buffers, programInfo) {
	const num = 2; // every coordinate composed of 2 values
	const type = gl.FLOAT; // the data in the buffer is 32-bit float
	const normalize = false; // don't normalize
	const stride = 0; // how many bytes to get from one set to the next
	const offset = 0; // how many bytes inside the buffer to start from
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
	gl.vertexAttribPointer(
		programInfo.attribLocations.textureCoord,
		num,
		type,
		normalize,
		stride,
		offset
	);
	gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}

// Tell WebGL how to pull out the normals from
// the normal buffer into the vertexNormal attribute.
function setNormalAttribute(gl, buffers, programInfo) {
	const numComponents = 3;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
	gl.vertexAttribPointer(
		programInfo.attribLocations.vertexNormal,
		numComponents,
		type,
		normalize,
		stride,
		offset
	);
	gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}
export { drawScene };
