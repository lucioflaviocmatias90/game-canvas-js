function createTable(condition = false) {
  const table = document.querySelector("table");

  if (condition) {
    collisionsMap.forEach((row, i) => {
      const tr = document.createElement("tr");

      row.forEach((column, j) => {
        const td = document.createElement("td");

        td.innerHTML = column;
        td.style.width = "30px";
        td.style.height = "30px";
        td.setAttribute("data-position-x", j + 1);
        td.setAttribute("data-position-y", i + 1);

        insertColor(td, column);

        td.style.color = Number(column) === 0 ? "#000" : "#fff";

        tr.appendChild(td);
      });

      table.appendChild(tr);
    });
  } else {
    table.innerHTML = "";
  }
}

function createSelect() {
  const select = document.querySelector("select");
  const option = document.createElement("option");

  option.setAttribute("value", "0");
  option.innerText = "0";
  option.selected = true;

  select.appendChild(option);

  mapConstants.forEach((mapConstant) => {
    const option = document.createElement("option");

    option.setAttribute("value", mapConstant.code);
    option.innerText = mapConstant.name;

    select.appendChild(option);
  });
}

function insertColor(td, column) {
  const rgbColor =
    Number(column) === 0
      ? "rgb(255, 255, 255)"
      : mapConstants.find((m) => m.code === Number(column)).color.join();

  td.style.backgroundColor = `rgb(${rgbColor}`;
}

window.addEventListener("click", (ev) => {
  if (ev.target instanceof HTMLTableCellElement) {
    const selectedValue = document.querySelectorAll("option:checked")[0].value;

    const td = ev.target;

    const positionX = Number(td.getAttribute("data-position-x")) - 1;
    const positionY = Number(td.getAttribute("data-position-y")) - 1;

    const index = positionY * 70 + positionX;

    td.innerText = selectedValue;

    td.style.color = Number(selectedValue) === 0 ? "#000" : "#fff";

    insertColor(td, selectedValue);

    collisions[index] = Number(selectedValue);
  }
});

createTable();
createSelect();
