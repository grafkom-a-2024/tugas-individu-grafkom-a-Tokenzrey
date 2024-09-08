const body = document.body;
const translationX = document.getElementById("translationX");
const translationY = document.getElementById("translationY");
const rotation = document.getElementById("rotation");
const scaleX = document.getElementById("scaleX");
const scaleY = document.getElementById("scaleY");

const translationXValue = document.getElementById("translationXValue");
const translationYValue = document.getElementById("translationYValue");
const rotationValue = document.getElementById("rotationValue");
const scaleXValue = document.getElementById("scaleXValue");
const scaleYValue = document.getElementById("scaleYValue");

const range = () => {
	let translateX = translationX.value;
	let translateY = translationY.value;
	let rotate = rotation.value;
	let scalingX = scaleX.value;
	let scalingY = scaleY.value;

    translationXValue.innerHTML = translateX;
    translationYValue.innerHTML = translateY;
    rotationValue.innerHTML = rotate;
    scaleXValue.innerHTML = scalingX;
    scaleYValue.innerHTML = scalingY;
};

translationX.addEventListener("input", range);
translationY.addEventListener("input", range);
rotation.addEventListener("input", range);
scaleX.addEventListener("input", range);
scaleY.addEventListener("input", range);

range();
