function initBuffers(gl) {
	const positionBuffer = initPositionBuffer(gl);
	const textureCoordBuffer = initTextureBuffer(gl);
	const indexBuffer = initIndexBuffer(gl);
	const normalBuffer = initNormalBuffer(gl);

	const initCylinderBuffers = createCylinderBuffers(gl, 1, 2.5, 1000);

	const initConeBuffers = createConeBuffers(gl, 1, 2.5, 1000);

	const profile = [
		{ x: 0, y: 0 }, // Pusat
		{ x: 0.5, y: 1 }, // Puncak
		{ x: 1, y: 0 }, // Pinggir
		{ x: 0.5, y: -1 }, // Dasar
		{ x: 0, y: -1 }, // Pusat bawah
	];
	const latheBuffers = createLatheBuffers(gl, profile, 1000);

	return {
		// position: positionBuffer,
		// normal: normalBuffer,
		// textureCoord: textureCoordBuffer,
		// indices: indexBuffer,
		// vertexCount: 36,

		// position: initCylinderBuffers.position,
		// normal: initCylinderBuffers.normal,
		// textureCoord: initCylinderBuffers.texture,
		// indices: initCylinderBuffers.index,
		// vertexCount: initCylinderBuffers.vertexCount,

		// position: initConeBuffers.position,
		// normal: initConeBuffers.normal,
		// textureCoord: initConeBuffers.texture,
		// indices: initConeBuffers.index,
		// vertexCount: initConeBuffers.vertexCount,

		position: latheBuffers.position,
		normal: latheBuffers.normal,
		textureCoord: latheBuffers.texture,
		indices: latheBuffers.index,
		vertexCount: latheBuffers.vertexCount,
	};
}

function initPositionBuffer(gl) {
	// Create a buffer for the square's positions.
	const positionBuffer = gl.createBuffer();

	// Select the positionBuffer as the one to apply buffer
	// operations to from here out.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Now create an array of positions for the square.
	const positions = [
		// Front face
		-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

		// Back face
		-1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

		// Top face
		-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

		// Bottom face
		-1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

		// Right face
		1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

		// Left face
		-1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
	];

	// Now pass the list of positions into WebGL to build the
	// shape. We do this by creating a Float32Array from the
	// JavaScript array, then use it to fill the current buffer.
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	return positionBuffer;
}

function initColorBuffer(gl) {
	const faceColors = [
		[1.0, 1.0, 1.0, 1.0], // Front face: white
		[1.0, 0.0, 0.0, 1.0], // Back face: red
		[0.0, 1.0, 0.0, 1.0], // Top face: green
		[0.0, 0.0, 1.0, 1.0], // Bottom face: blue
		[1.0, 1.0, 0.0, 1.0], // Right face: yellow
		[1.0, 0.0, 1.0, 1.0], // Left face: purple
	];

	var colors = [];

	for (var j = 0; j < faceColors.length; ++j) {
		const c = faceColors[j];
		// Repeat each color four times for the four vertices of the face
		colors = colors.concat(c, c, c, c);
	}

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	return colorBuffer;
}

function initIndexBuffer(gl) {
	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	// This array defines each face as two triangles, using the
	// indices into the vertex array to specify each triangle's
	// position.

	const indices = [
		0,
		1,
		2,
		0,
		2,
		3, // front
		4,
		5,
		6,
		4,
		6,
		7, // back
		8,
		9,
		10,
		8,
		10,
		11, // top
		12,
		13,
		14,
		12,
		14,
		15, // bottom
		16,
		17,
		18,
		16,
		18,
		19, // right
		20,
		21,
		22,
		20,
		22,
		23, // left
	];

	// Now send the element array to GL

	gl.bufferData(
		gl.ELEMENT_ARRAY_BUFFER,
		new Uint16Array(indices),
		gl.STATIC_DRAW
	);

	return indexBuffer;
}

function initTextureBuffer(gl) {
	const textureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

	const textureCoordinates = [
		// Front
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		// Back
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		// Top
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		// Bottom
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		// Right
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		// Left
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
	];

	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(textureCoordinates),
		gl.STATIC_DRAW
	);

	return textureCoordBuffer;
}

function initNormalBuffer(gl) {
	const normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

	const vertexNormals = [
		// Front
		0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

		// Back
		0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

		// Top
		0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

		// Bottom
		0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

		// Right
		1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

		// Left
		-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
	];

	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(vertexNormals),
		gl.STATIC_DRAW
	);

	return normalBuffer;
}

function initBuffer(gl, data, bufferType) {
	const buffer = gl.createBuffer();
	gl.bindBuffer(bufferType, buffer);
	gl.bufferData(bufferType, data, gl.STATIC_DRAW);
	return buffer;
}

function createCylinderBuffers(gl, radius, height, radialSegments) {
	const positions = [];
	const textureCoords = [];
	const normals = [];
	const indices = [];
	const halfHeight = height / 2;

	// Vertex untuk sisi silinder
	for (let i = 0; i <= radialSegments; i++) {
		const theta = (i / radialSegments) * 2 * Math.PI;
		const x = radius * Math.cos(theta);
		const z = radius * Math.sin(theta);
		const u = i / radialSegments;

		// Vertex posisi
		positions.push(x, -halfHeight, z); // Bawah
		positions.push(x, halfHeight, z); // Atas

		// Koordinat tekstur
		textureCoords.push(u, 0); // Bawah
		textureCoords.push(u, 1); // Atas

		// Normals
		normals.push(x, 0, z); // Sisi
		normals.push(x, 0, z); // Sisi
	}

	// Indeks untuk sisi silinder
	for (let i = 0; i < radialSegments; i++) {
		const first = i * 2;
		const second = first + 1;
		const third = first + 2;
		const fourth = first + 3;

		// Segitiga untuk sisi silinder
		indices.push(first, second, third);
		indices.push(second, fourth, third);
	}

	// Menambahkan penutup atas dan bawah
	const topCenterIndex = positions.length / 3; // Indeks untuk pusat atas
	const bottomCenterIndex = topCenterIndex + 1; // Indeks untuk pusat bawah

	// Pusat atas
	positions.push(0, halfHeight, 0);
	normals.push(0, 1, 0); // Normal mengarah ke atas
	textureCoords.push(0.5, 0.5); // Koordinat tengah

	// Pusat bawah
	positions.push(0, -halfHeight, 0);
	normals.push(0, -1, 0); // Normal mengarah ke bawah
	textureCoords.push(0.5, 0.5); // Koordinat tengah

	for (let i = 0; i < radialSegments; i++) {
		const first = i * 2;
		const second = first + 2;
		const third = topCenterIndex;
		const fourth = first + 1;
		const fifth = bottomCenterIndex;

		// Indeks untuk penutup atas
		indices.push(third, second, fourth);

		// Indeks untuk penutup bawah
		indices.push(fifth, fourth, second);
	}

	// Buat buffers
	const positionBuffer = initBuffer(
		gl,
		new Float32Array(positions),
		gl.ARRAY_BUFFER
	);
	const textureBuffer = initBuffer(
		gl,
		new Float32Array(textureCoords),
		gl.ARRAY_BUFFER
	);
	const normalBuffer = initBuffer(
		gl,
		new Float32Array(normals),
		gl.ARRAY_BUFFER
	);
	const indexBuffer = initBuffer(
		gl,
		new Uint16Array(indices),
		gl.ELEMENT_ARRAY_BUFFER
	);

	return {
		position: positionBuffer,
		normal: normalBuffer,
		texture: textureBuffer,
		index: indexBuffer,
		vertexCount: indices.length,
	};
}

function createConeBuffers(gl, radius, height, radialSegments) {
	const positions = [];
	const textureCoords = [];
	const normals = [];
	const indices = [];
	const halfHeight = height / 2;

	// Vertex untuk sisi kerucut
	for (let i = 0; i <= radialSegments; i++) {
		const theta = (i / radialSegments) * 2 * Math.PI;
		const x = radius * Math.cos(theta);
		const z = radius * Math.sin(theta);
		const u = i / radialSegments;

		// Vertex posisi
		positions.push(x, -halfHeight, z); // Bawah
		positions.push(0, halfHeight, 0); // Puncak kerucut

		// Koordinat tekstur
		textureCoords.push(u, 0); // Bawah
		textureCoords.push(0.5, 1); // Puncak kerucut

		// Normals
		normals.push(x, 0, z); // Sisi
		normals.push(0, 1, 0); // Normal puncak
	}

	// Indeks untuk sisi kerucut
	for (let i = 0; i < radialSegments; i++) {
		const first = i * 2;
		const second = first + 1;
		const third = first + 2;

		// Segitiga untuk sisi kerucut
		indices.push(first, second, third);
	}

	// Menambahkan penutup bawah
	const bottomCenterIndex = positions.length / 3; // Indeks untuk pusat bawah

	// Pusat bawah
	positions.push(0, -halfHeight, 0);
	normals.push(0, -1, 0); // Normal mengarah ke bawah
	textureCoords.push(0.5, 0.5); // Koordinat tengah

	// Indeks untuk penutup bawah
	for (let i = 0; i < radialSegments; i++) {
		const first = i * 2; // Indeks untuk sisi kerucut
		const second = first + 2; // Indeks untuk sisi kerucut

		indices.push(bottomCenterIndex, second, first);
	}

	// Buat buffers
	const positionBuffer = initBuffer(
		gl,
		new Float32Array(positions),
		gl.ARRAY_BUFFER
	);
	const textureBuffer = initBuffer(
		gl,
		new Float32Array(textureCoords),
		gl.ARRAY_BUFFER
	);
	const normalBuffer = initBuffer(
		gl,
		new Float32Array(normals),
		gl.ARRAY_BUFFER
	);
	const indexBuffer = initBuffer(
		gl,
		new Uint16Array(indices),
		gl.ELEMENT_ARRAY_BUFFER
	);

	return {
		position: positionBuffer,
		normal: normalBuffer,
		texture: textureBuffer,
		index: indexBuffer,
		vertexCount: indices.length,
	};
}

function createLatheBuffers(gl, profile, radialSegments) {
	const positions = [];
	const textureCoords = [];
	const normals = [];
	const indices = [];
	const length = profile.length;

	// Generate the lathe geometry by rotating the profile around the Y-axis
	for (let i = 0; i < radialSegments; i++) {
		const theta = (i / radialSegments) * 2 * Math.PI; // Angle for current segment
		const cosTheta = Math.cos(theta);
		const sinTheta = Math.sin(theta);

		for (let j = 0; j < length; j++) {
			const x = profile[j].x * cosTheta;
			const z = profile[j].x * sinTheta;
			const y = profile[j].y;

			// Vertex position
			positions.push(x, y, z);

			// Texture coordinates
			const u = i / radialSegments;
			const v = j / (length - 1);
			textureCoords.push(u, v);

			// Normals
			normals.push(cosTheta, 0, sinTheta);
		}
	}

	// Generate indices for the lathe geometry
	for (let i = 0; i < radialSegments; i++) {
		for (let j = 0; j < length - 1; j++) {
			const first = i * length + j;
			const second = first + length;

			// Two triangles per quad
			indices.push(first, second, first + 1);
			indices.push(second, second + 1, first + 1);
		}
	}

	// Create buffers
	const positionBuffer = initBuffer(
		gl,
		new Float32Array(positions),
		gl.ARRAY_BUFFER
	);
	const textureBuffer = initBuffer(
		gl,
		new Float32Array(textureCoords),
		gl.ARRAY_BUFFER
	);
	const normalBuffer = initBuffer(
		gl,
		new Float32Array(normals),
		gl.ARRAY_BUFFER
	);
	const indexBuffer = initBuffer(
		gl,
		new Uint16Array(indices),
		gl.ELEMENT_ARRAY_BUFFER
	);

	return {
		position: positionBuffer,
		normal: normalBuffer,
		texture: textureBuffer,
		index: indexBuffer,
		vertexCount: indices.length,
	};
}

export { initBuffers };
