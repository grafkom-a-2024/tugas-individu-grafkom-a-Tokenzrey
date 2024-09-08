class DigitalArt extends HTMLElement {
	constructor() {
		super();
		this.canvas = null;
		this.gl = null;
		this.onResize = this.onResize.bind(this);
		this.loop = this.loop.bind(this);
	}

	static register() {
		customElements.define("digital-art", DigitalArt);
	}

	connectedCallback() {
		if (!this.gl) {
			this.setup();
		}
	}

	disconnectedCallback() {
		this.dispose();
	}

	onResize() {
		const { canvas, gl, program } = this;
		const width = this.clientWidth;
		const height = this.clientHeight;

		canvas.width = width;
		canvas.height = height;
		gl.viewport(0, 0, width, height);
		const uResolution = gl.getUniformLocation(program, "resolution");
		gl.uniform2fv(uResolution, [width, height]);
	}

	createShader(type, code) {
		const { gl } = this;
		const shader = gl.createShader(type);
		gl.shaderSource(shader, code);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			throw gl.getShaderInfoLog(shader);
		}
		return shader;
	}

	createBuffers() {
		const { gl, program } = this;
		const bufferScripts = [...this.querySelectorAll("[type=buffer]")];
		this.buffers = {};
		let count = -1;
		bufferScripts.forEach((container) => {
			const name = container.getAttribute("name") || "position";
			const recordSize = parseInt(container.getAttribute("data-size"), 10) || 1;
			const data = new Float32Array(JSON.parse(container.textContent.trim()));
			const buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
			const attribLoc = gl.getAttribLocation(program, name);
			this.buffers[name] = { buffer, data, attribLoc, recordSize };
			count = Math.max(count, (data.length / recordSize) | 0);
			gl.enableVertexAttribArray(attribLoc);
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.vertexAttribPointer(attribLoc, recordSize, gl.FLOAT, false, 0, 0);
		});
		this.count = count;
	}

	updateUniforms() {
		const { gl, program } = this;

		const translationX =
			parseFloat(document.getElementById("translationX").value) / 50.0 - 1.0;
		const translationY =
			parseFloat(document.getElementById("translationY").value) / 50.0 - 1.0;
		const rotation =
			parseFloat(document.getElementById("rotation").value) * (Math.PI / 180.0);
		const scaleX = parseFloat(document.getElementById("scaleX").value) / 50.0;
		const scaleY = parseFloat(document.getElementById("scaleY").value) / 50.0;

		const uTranslation = gl.getUniformLocation(program, "uTranslation");
		const uRotation = gl.getUniformLocation(program, "uRotation");
		const uScale = gl.getUniformLocation(program, "uScale");

		gl.uniform2f(uTranslation, translationX, translationY);
		gl.uniform1f(uRotation, rotation);
		gl.uniform2f(uScale, scaleX, scaleY);
	}

	loop(time = 0) {
		const { gl } = this;
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Perbarui uniform sebelum menggambar
		this.updateUniforms();

		gl.drawArrays(gl.TRIANGLES, 0, this.count);
		this.frame = requestAnimationFrame(this.loop);
	}

	createPrograms() {
		const { gl } = this;
		const fragScript = this.querySelector("[type=frag]");
		const vertScript = this.querySelector("[type=vert]");
		const HEADER = "precision highp float;";
		const DEFAULT_VERT =
			HEADER +
			"attribute vec4 position;uniform vec2 uTranslation;uniform float uRotation;uniform vec2 uScale;varying vec4 vColor;void main(){vec2 scaledPosition = position.xy * uScale;float cosAngle = cos(uRotation);float sinAngle = sin(uRotation);vec2 rotatedPosition = vec2(cosAngle * scaledPosition.x - sinAngle * scaledPosition.y, sinAngle * scaledPosition.x + cosAngle * scaledPosition.y);vec2 translatedPosition = rotatedPosition + uTranslation;gl_Position = vec4(translatedPosition, position.z, position.w);vColor = vec4(1.0, 0.0, 0.0, 1.0);}";
		const DEFAULT_FRAG =
			HEADER + "varying vec4 vColor;void main(){gl_FragColor = vColor;}";

		this.fragCode = fragScript?.textContent || DEFAULT_FRAG;
		this.vertCode = vertScript?.textContent || DEFAULT_VERT;

		const program = gl.createProgram();
		this.program = program;
		this.gl = gl;

		this.fragShader = this.createShader(gl.FRAGMENT_SHADER, this.fragCode);
		this.vertShader = this.createShader(gl.VERTEX_SHADER, this.vertCode);

		gl.attachShader(program, this.fragShader);
		gl.attachShader(program, this.vertShader);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw gl.getProgramInfoLog(program);
		}
	}

	setup() {
		this.canvas = document.createElement("canvas");
		this.appendChild(this.canvas);
		this.gl =
			this.canvas.getContext("webgl") ||
			this.canvas.getContext("experimental-webgl");

		if (!this.gl) {
			console.error("WebGL not supported");
			return;
		}

		this.createPrograms(); // Make sure this function uses this.gl correctly
		this.createBuffers(); // Make sure this function uses this.gl correctly

		const { gl, program } = this; // Ensure gl and program are correctly assigned here
		gl.useProgram(program);
		gl.clearColor(0, 0, 0, 0); // Set background canvas to transparent
		this.onResize();
		window.addEventListener("resize", this.onResize, false);

		// Set up event listeners for sliders
		document
			.getElementById("translationX")
			.addEventListener("input", () => this.updateUniforms());
		document
			.getElementById("translationY")
			.addEventListener("input", () => this.updateUniforms());
		document
			.getElementById("rotation")
			.addEventListener("input", () => this.updateUniforms());
		document
			.getElementById("scaleX")
			.addEventListener("input", () => this.updateUniforms());
		document
			.getElementById("scaleY")
			.addEventListener("input", () => this.updateUniforms());

		this.frame = requestAnimationFrame(this.loop);
	}

	dispose() {
		cancelAnimationFrame(this.frame);
		this.frame = -1;
		window.removeEventListener("resize", this.onResize, false);
		Object.entries(this.buffers).forEach(([name, buf]) => {
			this.gl.deleteBuffer(buf.buffer);
		});
		this.gl.deleteProgram(this.program);
		const loseCtx = this.gl.getExtension("WEBGL_lose_context");
		if (loseCtx && typeof loseCtx.loseContext === "function") {
			loseCtx.loseContext();
		}
		this.removeChild(this.canvas);
		this.gl = null;
		this.canvas = null;
		this.buffers = {};
	}
}

DigitalArt.register();
