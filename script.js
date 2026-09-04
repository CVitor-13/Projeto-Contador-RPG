const defaults = {
  pv: { current: 80, max: 80 },
  pd: { current: 12, max: 12 }
};

const savedState = JSON.parse(sessionStorage.getItem("contador-rpg") || "null");
const state = savedState && savedState.pv && savedState.pd ? savedState : structuredClone(defaults);

function updateResource(resourceName, value, max) {
  const current = Math.max(0, Math.min(Number(value) || 0, max));
  const safeMax = Math.max(1, Number(max) || 1);
  state[resourceName] = { current, max: safeMax };

  const currentInput = document.querySelector(`[data-value="${resourceName}"]`);
  const maxInput = document.querySelector(`[data-max="${resourceName}"]`);
  const rangeInput = document.querySelector(`[data-range="${resourceName}"]`);
  const bar = document.querySelector(`[data-bar="${resourceName}"]`);
  const percentage = document.querySelector(`[data-percentage="${resourceName}"]`);
  const percent = Math.round((current / safeMax) * 100);

  currentInput.value = current;
  maxInput.value = safeMax;
  rangeInput.max = safeMax;
  rangeInput.value = current;
  bar.style.width = `${percent}%`;
  percentage.textContent = `${percent}%`;
  sessionStorage.setItem("contador-rpg", JSON.stringify(state));
}

function changeResource(resourceName, amount) {
  const resource = state[resourceName];
  updateResource(resourceName, resource.current + amount, resource.max);
}

for (const resourceName of Object.keys(defaults)) {
  const resource = state[resourceName];
  updateResource(resourceName, resource.current, resource.max);

  document.querySelector(`[data-value="${resourceName}"]`).addEventListener("input", (event) => {
    updateResource(resourceName, event.target.value, state[resourceName].max);
  });

  document.querySelector(`[data-max="${resourceName}"]`).addEventListener("change", (event) => {
    updateResource(resourceName, state[resourceName].current, event.target.value);
  });

  document.querySelector(`[data-range="${resourceName}"]`).addEventListener("input", (event) => {
    updateResource(resourceName, event.target.value, state[resourceName].max);
  });
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    changeResource(button.dataset.target, button.dataset.action === "increase" ? 1 : -1);
  });
});

document.querySelector("#resetButton").addEventListener("click", () => {
  for (const resourceName of Object.keys(defaults)) {
    updateResource(resourceName, defaults[resourceName].current, defaults[resourceName].max);
  }
  document.querySelector("#statusText").textContent = "Valores restaurados";
});
