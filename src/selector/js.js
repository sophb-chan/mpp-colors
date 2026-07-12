/* testing code
for (const [name, color] of Object.entries(Color.map)) {
	console.log(name+':', new Color(color.r, color.g, color.b).toHexa());
}
*/

const colorInput = document.getElementById("color-input");
const colorPreview = document.getElementById("color-preview");
const colorName = document.getElementById("color-name");
const colorHex = document.getElementById("color-hex");

function render(color) {
	const classyColor = new Color(color);
	const name = classyColor.getName();
	const brightness = Color.getBrightness(classyColor);
	const isWhite = brightness < 255 / 2;

	colorPreview.style.background = classyColor.toHexa();
	colorName.textContent = name;
	colorName.style.color = isWhite ? "#fff" : "#000";
	colorHex.textContent = classyColor.toHexa().toUpperCase();
	colorInput.value = classyColor.toHexa().toUpperCase();
	if (name.startsWith("A shade of ")) {
		const baseColorName = name.substring("A shade of ".length).trim();
		const baseColorRGB = Color.map[baseColorName];
		const classyBaseColor = new Color(
			baseColorRGB.r,
			baseColorRGB.g,
			baseColorRGB.b,
		);
		const baseColorHex = classyBaseColor.toHexa().toUpperCase();
		colorPreview.title = `Base color: ${baseColorName} (${baseColorHex})`;
	} else colorPreview.title = "";
}
colorInput.addEventListener("input", (event) => render(event.target.value));
render("#52ff4c");
