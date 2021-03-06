(function () {
	'use strict';

	const CANVAS = document.querySelector('#main-canvas');
	const CANVAS_CTX = CANVAS.getContext('2d');
	const LOADED_FILE = document.querySelector('#load-file');
	const BUTTON_MAIN_ALGORITHM = document.querySelector('#use-main-algorithm');
	const BUTTON_GREYSCALE_ALGORITHM = document.querySelector('#use-greyscale-algorithm');
	const BUTTON_REVERSE_ALGORITHM = document.querySelector('#use-reverse-algorithm');

	LOADED_FILE.addEventListener('change', () => {
		let path = document.querySelector('.file-path');
		path.placeholder = LOADED_FILE.files[0].name;
		createCanvasImage(LOADED_FILE.files[0]);
	}, false);

	BUTTON_MAIN_ALGORITHM.addEventListener('click', () => {
		let imageData = CANVAS_CTX.getImageData(0, 0, CANVAS.width, CANVAS.height);
		let imageWidth = CANVAS_CTX.getImageData(0, 0, CANVAS.width, CANVAS.height).width;
		let imageDataLength = imageData.data.length;
		let componentR = [],
			componentG = [],
			componentB = [];
		let newPixel, error;

		for (let i = 0; i < 256; i++) {
			componentR[i] = i * 0.299;
			componentG[i] = i * 0.587;
			componentB[i] = i * 0.110;
		}

		for (let i = 0; i < imageDataLength; i += 4) {
			imageData.data[i] = Math.floor(componentR[imageData.data[i]] + componentG[imageData.data[i + 1]] + componentB[imageData.data[i + 2]]);
		}

		for (let i = 0; i < imageDataLength; i += 4) {
			newPixel = imageData.data[i] < 150 ? 0 : 255;
			error = Math.floor((imageData.data[i] - newPixel) / 23);
			imageData.data[i] = newPixel;
			imageData.data[i + 4] += error * 7;
			imageData.data[i + 4 * imageWidth - 4] += error * 3;
			imageData.data[i + 4 * imageWidth] += error * 5;
			imageData.data[i + 4 * imageWidth + 4] += error * 1;
			imageData.data[i + 1] = imageData.data[i + 2] = imageData.data[i];
		}
		CANVAS_CTX.putImageData(imageData, 0, 0);
	});

	BUTTON_GREYSCALE_ALGORITHM.addEventListener('click', () => {
		let imageData = CANVAS_CTX.getImageData(0, 0, CANVAS.width, CANVAS.height);
		for (let i = 0; i < imageData.data.length; i += 4) {
			let avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
			imageData.data[i] = avg;
			imageData.data[i + 1] = avg;
			imageData.data[i + 2] = avg;
		}
		console.log('grey');
		CANVAS_CTX.putImageData(imageData, 0, 0);
	});

	BUTTON_REVERSE_ALGORITHM.addEventListener('click', () => {
		let imageData = CANVAS_CTX.getImageData(0, 0, CANVAS.width, CANVAS.height);
		for (let i = 0; i < imageData.data.length; i += 4) {
			imageData.data[i] = 255 - imageData.data[i];
			imageData.data[i + 1] = 255 - imageData.data[i + 1];
			imageData.data[i + 2] = 255 - imageData.data[i + 2];
			imageData.data[i + 3] = 255;
		}
		CANVAS_CTX.putImageData(imageData, 0, 0);
	});

	function loadImage(url) {
		return new Promise(resolve => {
			let i = new Image();
			i.onload = () => { resolve(i) };
			i.src = url;
		});
	}

	function correctCanvasSizes(image) {
		CANVAS.width = image.width;
		CANVAS.height = image.height;
	}

	async function createCanvasImage(file) {
		let reader = new FileReader();
		let url = URL.createObjectURL(file);
		let image = await loadImage(url);
		image.onload = function () {
			CANVAS_CTX.drawImage(image, 0, 0, CANVAS.width, CANVAS.height, 0, 0, image.width, image.height);
			CANVAS_CTX.fillStyle = "rgba(0, 0, 0, 0.1)";
			CANVAS_CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
		};
		image.src = url;
		correctCanvasSizes(image);
	}
})();