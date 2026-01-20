const imageCanvas = document.getElementById("image-canvas");

const CanvasCtx = imageCanvas.getContext("2d");

const imageInput = document.querySelector("#image-input");
let file = null;
let image = null;

imageInput.addEventListener("change", (event) => {
  console.log("Image is being selected");
  const imgPlaceholder = document.querySelector(".placeholder");

  file = event.target.files[0];
  if (!file) return;

  imgPlaceholder.style.display = "none";
  //   console.log(file);

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    imageCanvas.style.display = "block";
    image = img;
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;
    CanvasCtx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
    applyFilters(); // Apply current slider values to the new image
  };
});

const blurInput = document.querySelector("#blur");

let resetBtn = document.querySelector("#reset-btn");

blurInput.addEventListener("input", () => {
  CanvasCtx.filter = `blur(${blurInput.value}px)`;
  CanvasCtx.drawImage(image, 0, 0);
});

const sepiaInput = document.querySelector("#sepia");
sepiaInput.addEventListener("input", () => {
  CanvasCtx.filter = `sepia(${sepiaInput.value}%)`;
  CanvasCtx.drawImage(image, 0, 0);
});

//! Below filters not working
/*
const contrastInput = document.querySelector("#contrast");
contrastInput.addEventListener("input", () => {
  CanvasCtx.filter = `contrast(${contrastInput.value}%)`;
  CanvasCtx.drawImage(image, 0, 0);
});

const opacityInput = document.querySelector("#opacity");
opacityInput.addEventListener("input", () => {
  CanvasCtx.filter = `opacity(${opacityInput.value}px)`;
  CanvasCtx.drawImage(image, 0, 0);
});

const brightnessInput = document.querySelector("#brightness");
brightnessInput.addEventListener("input", () => {
  CanvasCtx.filter = `brightness(${brightnessInput.value}px)`;
  CanvasCtx.drawImage(image, 0, 0);
});
const invertInput = document.querySelector("#invert");
invertInput.addEventListener("input", () => {
  CanvasCtx.filter = `invert(${invertInput.value}px)`;
  CanvasCtx.drawImage(image, 0, 0);
});
const hueRotationInput = document.querySelector("#hue-rotation");
hueRotationInput.addEventListener("input", () => {
  CanvasCtx.filter = `hue-rotation(${hueRotationInput.value}px)`;
  CanvasCtx.drawImage(image, 0, 0);
});
*/

const filtersInput = document.querySelectorAll(".filters input");

filtersInput.forEach((inp) => {
  inp.addEventListener("input", applyFilters);
});

function applyFilters() {
  if (!image) {
    return;
  }

  let filterString = "";

  filtersInput.forEach((input) => {
    const filterName = input.getAttribute("data-filter");
    const unit = input.getAttribute("data-unit") || "";
    const value = input.value;

    filterString += `${filterName}(${value}${unit})`;
  });

  CanvasCtx.filter = filterString.trim();
  CanvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
  CanvasCtx.drawImage(image, 0, 0, imageCanvas.width, imageCanvas.height);
}

//? Reset button
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    // Reset inputs to their defaults if defined, or some standard defaults
    // For now, let's just use the values from filters definition if available,
    // but reading the DOM is easier since we don't strictly have the 'filters' object in scope
    // in a clean module way, though it is global.
    // Let's manually set standard defaults for a "clean" image.

    filtersInput.forEach((input) => {
      const name = input.getAttribute("data-filter");
      let defaultValue = 0;
      if (name == "brightness" || name == "contrast" || name == "saturate") {
        defaultValue = 100;
      } else if (name == "opacity") {
        defaultValue = 100;
      }

      input.value = defaultValue;
    });

    applyFilters();
  });
}

const downloadBtn = document.querySelector("#download-btn");
if (downloadBtn && imageCanvas) {
  //if image exists then only add event listener
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = imageCanvas.toDataURL("image/png");
    link.click();
  });
}
