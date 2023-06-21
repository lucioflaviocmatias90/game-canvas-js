function createTable(condition) {
  if (condition) {
    const table = document.querySelector("table");

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

        tr.appendChild(td);
      });

      table.appendChild(tr);
    });
  }
}

function createSelect() {
  const select = document.querySelector("select");

  const option = document.createElement("option");

  option.setAttribute("value", "0");
  option.innerText = "0";
  option.selected = true;

  select.appendChild(option);

  Object.entries(mapConstants).forEach((mapConstant) => {
    const option = document.createElement("option");

    option.setAttribute("value", mapConstant[1]);
    option.innerText = mapConstant[0];

    select.appendChild(option);
  });

  // <option value="volvo">Volvo</option>
  // <option value="saab">Saab</option>
  // <option value="vw">VW</option>
  // <option value="audi" selected>Audi</option>
}

function insertColor(td, column) {
  switch (Number(column)) {
    case mapConstants.rock:
      td.style.backgroundColor = "rgba(128, 128, 128, 0.2)";
      break;

    case mapConstants.monster:
      td.style.backgroundColor = "rgba(160, 32, 240, 0.2)";
      break;

    case mapConstants.boundary:
      td.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
      break;

    case mapConstants.tree:
      td.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
      break;

    case 0:
      td.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      break;

    default:
      break;
  }
}

createTable(false);
createSelect();

window.addEventListener("click", (ev) => {
  if (ev.target instanceof HTMLTableCellElement) {
    // console.log(.innerHTML);
    const selectedValue = document.querySelectorAll("option:checked")[0].value;

    const td = ev.target;

    const positionX = Number(td.getAttribute("data-position-x")) - 1;
    const positionY = Number(td.getAttribute("data-position-y")) - 1;

    const index = positionY * 70 + positionX;

    td.innerText = selectedValue;

    insertColor(td, selectedValue);

    collisions[index] = Number(selectedValue);
  }
});
