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

//* Presets

const presets = {
  cyberpunk: {
    brightness: 110,
    contrast: 140,
    saturate: 160,
    hueRotate: 180,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    opacity: 100,
  },

  oldschool: {
    brightness: 105,
    contrast: 90,
    saturate: 80,
    sepia: 40,
    blur: 1,
    grayscale: 0,
    hueRotate: 0,
    opacity: 100,
  },

  noir: {
    brightness: 100,
    contrast: 130,
    saturate: 0,
    grayscale: 100,
    blur: 0,
    sepia: 0,
    hueRotate: 0,
    opacity: 100,
  },

  sunset: {
    brightness: 110,
    contrast: 105,
    saturate: 130,
    sepia: 25,
    hueRotate: 10,
    blur: 0,
    grayscale: 0,
    opacity: 100,
  },

  arctic: {
    brightness: 95,
    contrast: 120,
    saturate: 90,
    hueRotate: 200,
    sepia: 0,
    blur: 0,
    grayscale: 0,
    opacity: 100,
  },

  dreamy: {
    brightness: 115,
    contrast: 95,
    saturate: 120,
    blur: 2,
    sepia: 0,
    grayscale: 0,
    hueRotate: 0,
    opacity: 100,
  },

  horror: {
    brightness: 80,
    contrast: 150,
    saturate: 70,
    grayscale: 20,
    blur: 1,
    sepia: 0,
    hueRotate: 0,
    opacity: 100,
  },

  washed: {
    brightness: 115,
    contrast: 90,
    saturate: 110,
    sepia: 10,
    blur: 0,
    grayscale: 0,
    hueRotate: 0,
    opacity: 100,
  },
};

const presetContainer = document.querySelector(".preset-container");

Object.keys(presets).forEach((key) => {
  const presetBtn = document.createElement("button");
  presetBtn.classList.add("preset");
  presetBtn.innerText = key;
  presetContainer.appendChild(presetBtn);

  presetBtn.addEventListener("click", () => {
    const preset = presets[key];

    Object.keys(preset).forEach((filterName) => {
      const input = document.querySelector(`[data-filter="${filterName}"]`);
      if (input) {
        input.value = preset[filterName];
      }
    });

    applyFilters();
  });
});
