import { ModalNuevaTarea } from "./ModalCrearTarea.js";

const URL_API = "http://localhost:3000/tasks";
let modoEliminar = false;

var peticionPrincipal = new XMLHttpRequest();
peticionPrincipal.open("GET", URL_API);
peticionPrincipal.addEventListener("readystatechange", procesarPeticion);
peticionPrincipal.send();

function crearCardTarea(tarea, container) {
  var div = document.createElement("div");
  div.className = "col-md-4";
  div.innerHTML = `
    <div class="card shadow-sm" data-id="${tarea.id}">
      <div class="card-body">
        <h5 class="card-title">${tarea.titulo}</h5>
        <p class="card-text">${tarea.descripcion}</p>
        <span class="badge badge-${(tarea.estado === "completada") ? "completada" : (tarea.estado === "haciendo") ? "haciendo" : "pendiente"}">${tarea.estado}</span>
        <p class="text-muted small mt-2">${tarea.fecha_creacion}</p>
        <button class="btn btn-danger btn-sm mt-2 d-none btnEliminarTarea">Eliminar Tarea</button>
      </div>
    </div>
  `;
  container.appendChild(div);
  const btnEliminar = div.querySelector(".btnEliminarTarea");
  btnEliminar.addEventListener("click", () => eliminarTarea(tarea.id, div));
}

function procesarResultado(resultado) {
  var divContenedorTareas = document.getElementById("divContenedorTareas");
  divContenedorTareas.innerHTML = "";
  for (var tarea of resultado) {
    crearCardTarea(tarea, divContenedorTareas);
  }
  if (modoEliminar) mostrarBotonesEliminar(true);
}

function procesarPeticion(event) {
  if (this.readyState == 4 && this.status == 200) {
    let resultado = JSON.parse(this.responseText);
    procesarResultado(resultado);
  }
}

function eliminarTarea(id, cardElemento) {
  if (!confirm("¿Seguro que quieres eliminar esta tarea?")) return;
  fetch(`${URL_API}/${id}`, { method: "DELETE" })
    .then((res) => {
      if (!res.ok) throw new Error("Error al eliminar la tarea");
      cardElemento.remove();
    })
    .catch((err) => alert("No se pudo eliminar la tarea: " + err.message));
}

function mostrarBotonesEliminar(mostrar) {
  const botones = document.querySelectorAll(".btnEliminarTarea");
  botones.forEach((btn) => {
    if (mostrar) btn.classList.remove("d-none");
    else btn.classList.add("d-none");
  });
}

const modalNuevaTarea = new ModalNuevaTarea();
modalNuevaTarea.cargar().then(() => {
  const btn = document.getElementById("btnCrearTarea");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    modalNuevaTarea.mostrar();
  });
});

const btnEliminarMenu = document.getElementById("btnEliminar");
btnEliminarMenu.addEventListener("click", (e) => {
  e.preventDefault();
  modoEliminar = !modoEliminar;
  mostrarBotonesEliminar(modoEliminar);
  btnEliminarMenu.textContent = modoEliminar ? "Cancelar eliminación" : "Eliminar tarea";
});
