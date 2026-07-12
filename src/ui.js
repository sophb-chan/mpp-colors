const colorsDiv = document.getElementById("colors");
function renderColors() {
	colorsDiv.innerHTML = "";
	for (const [name, rgb] of Object.entries(Color.map)) {
		const color = new Color(rgb.r, rgb.g, rgb.b);
		const hex = color.toHexa().toUpperCase();
		const brightness = Color.getBrightness(color);
		const isWhite = brightness < 255 / 2;

		const colorDiv = document.createElement("div");
		colorDiv.style.background = hex;
		colorDiv.classList.add("color");
		colorDiv.textContent = color.getName();
		colorDiv.style.color = isWhite ? "#fff" : "#000";
		colorDiv.title = `Click to copy my hex code! (${hex})`;
		colorDiv.dataset.name = color.getName();
		colorDiv.dataset.hex = hex;
		colorsDiv.appendChild(colorDiv);

		let clickTime,
			released = true;
		const resetTime = 3e3;
		colorDiv.addEventListener("mousedown", () => {
			clickTime = Date.now();
			navigator.clipboard.writeText(hex);
			colorDiv.textContent = "Copied!";
			released = false;
			setTimeout(() => {
				if (released) colorDiv.textContent = color.getName();
			}, resetTime);
		});
		colorDiv.addEventListener("mouseup", () => {
			released = true;
			if (Date.now() - clickTime >= resetTime)
				colorDiv.textContent = color.getName();
		});
	}
}
renderColors();

function normalize(text) {
	const regex = /[a-zA-Z0-9]/;
	const chars = [...text];
	const filteredChars = chars.filter((c) => regex.test(c));
	const normalized = filteredChars.join("").toLowerCase();
	return normalized;
}
const searchInput = document.getElementById("search");
searchInput.title = 'Type something to search...';
searchInput.addEventListener("input", (event) => {
	const query = event.target.value.trim();
	if (!query) {
		searchInput.title = 'Type something to search...';
		const colorDivs = [...colorsDiv.children];
		for (const colorDiv of colorDivs) {
			colorDiv.style.display = '';
		}
		return;
	}
	if (colorsDiv.querySelector('#oops')) colorsDiv.querySelector('#oops').remove();
	if (query.startsWith("#")) {
		searchInput.title = 'Searching by hex code';
		let totalMatches = 0;
		const colorDivs = [...colorsDiv.children];
		for (const colorDiv of colorDivs) {
			const name = colorDiv.dataset.name;
			const hex = colorDiv.dataset.hex;
			if (!name) continue;
			const queryMatches = normalize(hex).includes(normalize(query));
			colorDiv.style.display = queryMatches ? "" : "none";
			totalMatches += queryMatches;
		}
		if (!totalMatches) {
			const oops = document.createElement('p');
			oops.id = 'oops';
			oops.textContent = `No matches found :(\nMaybe you're looking for a shade of a color?`;
			colorsDiv.appendChild(oops);
		}
	} else {
		searchInput.title = 'Searching by name';
		let totalMatches = 0;
		const colorDivs = [...colorsDiv.children];
		for (const colorDiv of colorDivs) {
			const name = colorDiv.dataset.name;
			const hex = colorDiv.dataset.hex;
			if (!name) continue;
			const queryMatches = normalize(name).includes(normalize(query));
			colorDiv.style.display = queryMatches ? "" : "none";
			totalMatches += queryMatches;
		}
		if (!totalMatches) {
			const oops = document.createElement('p');
			oops.id = 'oops';
			oops.textContent = `No matches found :(`;
			colorsDiv.appendChild(oops);
		}
	}
});
