const table = document.querySelector("table");

collisionsMap.forEach((row) => {
  const tr = document.createElement("tr");

  row.forEach((column) => {
    const td = document.createElement("td");

    td.innerHTML = column;
    td.style.width = "30px";
    td.style.height = "30px";

    switch (column) {
      case 27:
        td.style.backgroundColor = "rgba(0, 0, 255, 0.2)";
        break;

      case 39:
        td.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
        break;

      case 1025:
        td.style.backgroundColor = "rgba(255, 0, 0, 0.2)";

      default:
        break;
    }

    tr.appendChild(td);
  });

  table.appendChild(tr);
});

console.log(table);
