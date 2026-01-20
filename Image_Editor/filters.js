const filters = {
  brightness: {
    value: 100,
    min: 0,
    max: 200,
    unit: "%",
  },
  contrast: {
    value: 100,
    min: 0,
    max: 200,
    unit: "%",
  },

  saturate: {
    value: 100,
    min: 0,
    max: 200,
    unit: "%",
  },
  "hue-rotate": {
    value: 0,
    min: 0,
    max: 200,
    unit: "deg",
  },
  blur: {
    value: 0,
    min: 0,
    max: 30,
    unit: "px",
  },
  grayscale: {
    value: 0,
    min: 0,
    max: 200,
    unit: "%",
  },
  sepia: {
    value: 0,
    min: 0,
    max: 200,
    unit: "%",
  },
  opacity: {
    value: 100,
    min: 0,
    max: 100,
    unit: "%",
  },
  invert: {
    value: 0,
    min: 0,
    max: 100,
    unit: "%",
  },
};

//Creating all filter input sliders dynamically

const filterSec = document.querySelector(".filters");

function createFilterElement(filterName, unit, value, min, max) {
  const filterDiv = document.createElement("div");
  filterDiv.classList.add("filter");

  const input = document.createElement("input");
  input.type = "range";
  input.id = filterName;
  input.min = min;
  input.max = max;
  input.value = value;
  input.setAttribute("data-filter", filterName);
  input.setAttribute("data-unit", unit);

  const p = document.createElement("p");
  p.innerText = filterName;

  filterDiv.appendChild(p);
  filterDiv.appendChild(input);

  return filterDiv;
}

Object.keys(filters).forEach((key) => {
  const filterElement = createFilterElement(
    key,
    filters[key].unit,
    filters[key].value,
    filters[key].min,
    filters[key].max,
  );
  filterSec.appendChild(filterElement);
});
