const app = document.getElementById("root");

var orderId = 0;
var ordersList = [];
const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = "0" + dd;
if (mm < 10) mm = "0" + mm;

const formattedToday = dd + "/" + mm + "/" + yyyy;

function textToArray(textareaId) {
  const textarea = app.querySelector(`#${textareaId}`);
  const content = textarea.value;
  const array = content.split("\n").filter((line) => line.trim() !== "");
  return array;
}

function uLister(targetParent, targetArr) {
  const array = targetArr;

  const ul = app.createElement("ul");
  array.forEach((item) => {
    const li = app.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });

  targetParent.appendChild(ul);
}

function createDiv() {
  const fiambreArray = textToArray("fiambreria");
  const verduArray = textToArray("verduleria");
  const carneArray = textToArray("carniceria");
  const almacArray = textToArray("almacen");

  const formaDePago = app.getElementById("forma-de-pago").value.toLowerCase();
  var newOrder = {
    id: orderId,
    nro: app.getElementById("nro").value,
    cliente: app.getElementById("cliente").value,
    telefono: app.getElementById("telefono").value,
    fechaPedido: formattedToday,
    fechaEntrega: app.getElementById("fecha").value,
    direccion: app.getElementById("direccion").value,
    fiambreria: fiambreArray,
    almacen: almacArray,
    verduleria: verduArray,
    carniceria: carneArray,
    ctaCte:
      formaDePago == "transferencia" || formaDePago == "efectivo"
        ? "DELIVERY"
        : "CTA CTE CLIENTE",
    formaDePago: formaDePago,
    statusPago: "OK",
    tipo: "FRESCOS",
    entrega: "CADETE",
    estadoPedido: "ABIERTO",
  };
  ordersList.push(newOrder);
  const newOrderArr = [
    newOrder.fechaPedido,
    newOrder.fechaEntrega,
    newOrder.estadoPedido,
    newOrder.cliente,
    "$0",
    newOrder.ctaCte,
    newOrder.formaDePago,
    newOrder.statusPago,
    newOrder.tipo,
    newOrder.entrega,
    "",
  ];
  console.log(newOrderArr);
  let container = app.querySelector("#table");
  container.insertRow();
  for (let cell of newOrderArr) {
    let newCell = container.rows[container.rows.length - 1].insertCell();
    newCell.textContent = cell;
    newCell.classList.add("table-cell");
  }

  let lastCell = container.lastChild.lastChild.lastChild;
  let printBtn = app.createElement("button");
  printBtn.setAttribute("id", `${newOrder.id}`);
  printBtn.innerHTML = `print`;
  printBtn.addEventListener("click", handleClick);
  lastCell.appendChild(printBtn);

  orderId += 1;

  console.log(newOrder.fiambreria);
}

const createDivBtn = app.getElementById("create-div");
createDivBtn.addEventListener("click", createDiv);

function getObjectById(objectsArray, id) {
  for (let i = 0; i < objectsArray.length; i++) {
    if (objectsArray[i].id === id) {
      return objectsArray[i];
    }
  }
  return null;
}

function handleClick(event) {
  const buttonId = event.target.id;
  const objectId = parseInt(buttonId); // assuming the button's id is a number
  const object = getObjectById(ordersList, objectId);
  printThis(object);
}

function printThis(thingy) {
  var a = window.open("", "", "height=900, width=800");
  a.document.write("<html>");
  a.document.write(
    `<body > <p>PEDIDO<br><br>NRO: ${thingy.nro}<br>CLIENTE: ${thingy.cliente}<br>TELEFONO: ${thingy.telefono}<br>FECHA: ${thingy.fechaEntrega}  <br>DIRECCION: ${thingy.direccion}<br> <br>Fiambreria:<br><div id='listaFiambreria'></div><br>Almacen:<br><div id='listaAlmacen'></div><br>Verduleria:<br><div id='listaVerduleria'></div><br>Carniceria:<br><div id='listaCarniceria'></div><br>FORMA DE PAGO: ${thingy.formaDePago}</p>`
  );
  a.document.write("</body></html>");
  a.document.close();
  let fiambreriaList = a.document.querySelector("#listaFiambreria");
  uLister(fiambreriaList, thingy.fiambreria);
  let almacenList = a.document.querySelector("#listaAlmacen");
  uLister(almacenList, thingy.almacen);
  let verduList = a.document.querySelector("#listaVerduleria");
  uLister(verduList, thingy.verduleria);
  let carneList = a.document.querySelector("#listaCarniceria");
  uLister(carneList, thingy.carniceria);
  a.print();
}
