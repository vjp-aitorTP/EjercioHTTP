import { ModalNuevaTarea } from "./ModalCrearTarea.js";

const URL_API = "http://localhost:3000/tasks";
let modoEliminar = false;
let modoModificar = false;

// Obtenemos la lista de tareas desde la API
var peticionPrincipal = new XMLHttpRequest();
peticionPrincipal.open("GET", URL_API);
peticionPrincipal.addEventListener("readystatechange", procesarPeticion);
peticionPrincipal.send();

/** Creamos una tarjeta (card) para mostrar los datos de una tarea */
function crearCardTarea(tarea, container) {
  const fechaTexto = tarea.fecha || tarea.fecha_creacion || "";
  const horaTexto = tarea.hora || "";

  var div = document.createElement("div");
  div.className = "col-md-4";
  div.innerHTML = `
    <div class="card shadow-sm" data-id="${tarea.id}">
      <div class="card-body">
        <input class="form-control mb-2 d-none inputTitulo" value="${tarea.titulo || ""}">
        <h5 class="card-title">${tarea.titulo || ""}</h5>

        <textarea class="form-control mb-2 d-none inputDescripcion">${tarea.descripcion || ""}</textarea>
        <p class="card-text">${tarea.descripcion || ""}</p>

        <select class="form-select mb-2 d-none inputEstado">
          <option value="pendiente" ${tarea.estado === "pendiente" ? "selected" : ""}>pendiente</option>
          <option value="haciendo" ${tarea.estado === "haciendo" ? "selected" : ""}>haciendo</option>
          <option value="completada" ${tarea.estado === "completada" ? "selected" : ""}>completada</option>
        </select>
        <span class="badge badge-${(tarea.estado === "completada") ? "completada" : (tarea.estado === "haciendo") ? "haciendo" : "pendiente"}">${tarea.estado}</span>

        <div class="mt-2 d-none grupoFecha">
          <label class="form-label small mb-1">Fecha:</label>
          <input type="date" class="form-control mb-2 inputFecha" value="${fechaTexto}">
          <label class="form-label small mb-1">Hora:</label>
          <input type="time" class="form-control mb-2 inputHora" value="${horaTexto}">
        </div>

        <p class="text-muted small mt-2 fechaTexto">${fechaTexto ? `${fechaTexto} ${horaTexto}` : "Sin fecha"}</p>

        <button class="btn btn-danger btn-sm mt-2 d-none btnEliminarTarea">Eliminar</button>
        <button class="btn btn-primary btn-sm mt-2 d-none btnModificarTarea">Modificar</button>
      </div>
    </div>
  `;
  container.appendChild(div);

  // Configuramos el botón para eliminar la tarea
  const btnEliminar = div.querySelector(".btnEliminarTarea");
  btnEliminar.addEventListener("click", () => eliminarTarea(tarea.id, div));

  // Configuramos el botón para modificar la tarea
  const btnModificar = div.querySelector(".btnModificarTarea");
  btnModificar.addEventListener("click", () => modificarTarea(tarea.id, div));
}

/** Mostramos todas las tareas en el contenedor principal */
function procesarResultado(resultado) {
  var divContenedorTareas = document.getElementById("divContenedorTareas");
  divContenedorTareas.innerHTML = "";
  for (var tarea of resultado) {
    crearCardTarea(tarea, divContenedorTareas);
  }
  mostrarBotonesEliminar(modoEliminar);
  activarModoModificar(modoModificar);
}

/** Procesamos la respuesta de la API y llamamos a procesarResultado */
function procesarPeticion(event) {
  if (this.readyState == 4 && this.status == 200) {
    let resultado = JSON.parse(this.responseText);
    procesarResultado(resultado);
  }
}

/** Eliminamos una tarea específica y actualizamos la vista */
function eliminarTarea(id, cardElemento) {
  if (!confirm("¿Seguro que quieres eliminar esta tarea?")) return;
  fetch(`${URL_API}/${id}`, { method: "DELETE" })
    .then((res) => {
      if (!res.ok) throw new Error("Error al eliminar la tarea");
      cardElemento.remove();
    })
    .catch((err) => alert("No se pudo eliminar la tarea: " + err.message));
}

/** Modificamos los datos de una tarea y recargamos la lista */
function modificarTarea(id, cardElemento) {
  if (!confirm("¿Seguro que quieres modificar esta tarea?")) return;
  const titulo = cardElemento.querySelector(".inputTitulo").value;
  const descripcion = cardElemento.querySelector(".inputDescripcion").value;
  const estado = cardElemento.querySelector(".inputEstado").value;
  const fecha = cardElemento.querySelector(".inputFecha").value;
  const hora = cardElemento.querySelector(".inputHora").value;

  const tarea = { titulo, descripcion, estado, fecha, hora };

  fetch(`${URL_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tarea)
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al modificar la tarea");
      return res.json();
    })
    .then(() => {
      peticionPrincipal.open("GET", URL_API);
      peticionPrincipal.addEventListener("readystatechange", procesarPeticion);
      peticionPrincipal.send();
    })
    .catch((err) => alert("No se pudo modificar la tarea: " + err.message));
}

/** Mostramos u ocultamos los botones de eliminar según el modo */
function mostrarBotonesEliminar(mostrar) {
  const botones = document.querySelectorAll(".btnEliminarTarea");
  botones.forEach((btn) => btn.classList.toggle("d-none", !mostrar));
}

/** Activamos o desactivamos el modo de modificación */
function activarModoModificar(activar) {
  const botones = document.querySelectorAll(".btnModificarTarea");
  const titulos = document.querySelectorAll(".inputTitulo");
  const descripciones = document.querySelectorAll(".inputDescripcion");
  const estados = document.querySelectorAll(".inputEstado");
  const h5 = document.querySelectorAll(".card-title");
  const p = document.querySelectorAll(".card-text");
  const badge = document.querySelectorAll(".badge");
  const grupoFechas = document.querySelectorAll(".grupoFecha");
  const fechaTexto = document.querySelectorAll(".fechaTexto");

  botones.forEach((btn) => btn.classList.toggle("d-none", !activar));
  titulos.forEach((i) => i.classList.toggle("d-none", !activar));
  descripciones.forEach((i) => i.classList.toggle("d-none", !activar));
  estados.forEach((i) => i.classList.toggle("d-none", !activar));
  grupoFechas.forEach((g) => g.classList.toggle("d-none", !activar));
  h5.forEach((i) => i.classList.toggle("d-none", activar));
  p.forEach((i) => i.classList.toggle("d-none", activar));
  badge.forEach((i) => i.classList.toggle("d-none", activar));
  fechaTexto.forEach((f) => f.classList.toggle("d-none", activar));
}

// Cargamos el modal de nueva tarea y mostramos al hacer clic
const modalNuevaTarea = new ModalNuevaTarea();
modalNuevaTarea.cargar().then(() => {
  const btn = document.getElementById("btnCrearTarea");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    modalNuevaTarea.mostrar();
  });
});

// Gestionamos el modo eliminar desde el menú
const btnEliminarMenu = document.getElementById("btnEliminar");
const btnModificarMenu = document.getElementById("btnModificar");

btnEliminarMenu.addEventListener("click", (e) => {
  e.preventDefault();
  if (modoModificar) { 
    modoModificar = false;
    activarModoModificar(false);
    btnModificarMenu.textContent = "Modificar Tarea";
  }
  modoEliminar = !modoEliminar;
  mostrarBotonesEliminar(modoEliminar);
  btnEliminarMenu.textContent = modoEliminar ? "Cancelar eliminación" : "Eliminar tarea";
});

// Gestionamos el modo modificar desde el menú
btnModificarMenu.addEventListener("click", (e) => {
  e.preventDefault();
  if (modoEliminar) { 
    modoEliminar = false;
    mostrarBotonesEliminar(false);
    btnEliminarMenu.textContent = "Eliminar tarea";
  }
  modoModificar = !modoModificar;
  activarModoModificar(modoModificar);
  btnModificarMenu.textContent = modoModificar ? "Cancelar modificación" : "Modificar Tarea";
});

// Volvemos a la vista principal y desactivamos los modos activos al hacer clic en el logo
const logoTareas = document.getElementById("Inicio");

logoTareas.addEventListener("click", (e) => {
  e.preventDefault();
  if (modoEliminar) {
    modoEliminar = false;
    mostrarBotonesEliminar(false);
    btnEliminarMenu.textContent = "Eliminar tarea";
  }
  if (modoModificar) {
    modoModificar = false;
    activarModoModificar(false);
    btnModificarMenu.textContent = "Modificar Tarea";
  }
  peticionPrincipal.open("GET", URL_API);
  peticionPrincipal.addEventListener("readystatechange", procesarPeticion);
  peticionPrincipal.send();
});
