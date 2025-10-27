import { ModalNuevaTarea } from "./ModalCrearTarea.js";

var peticionPrincipal = new XMLHttpRequest();
peticionPrincipal.open("GET","http://localhost:3000/tasks")
peticionPrincipal.addEventListener("readystatechange", procesarPeticion)
peticionPrincipal.send()

function crearCardTarea(tarea, container){
    var div = document.createElement("div");

    div.className = "col-md-4"

    div.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">${tarea.titulo}</h5>
                    <p class="card-text">${tarea.descripcion}</p>
                    <span class="badge badge-${(tarea.estado === "completada") ? "completada" : (tarea.estado === "haciendo") ? "haciendo" : "pendiente" }">${tarea.estado}</span>
                    <p class="text-muted small mt-2">${tarea.fecha_creacion}</p>
                </div>
            </div>
    `;

    container.appendChild(div)
}

function procesarResultado(resultado){
    var divContenedorTareas = document.getElementById("divContenedorTareas");
    for (var tarea of resultado) {
        crearCardTarea(tarea, divContenedorTareas);
    }
}

function procesarPeticion(event){
    if (this.readyState == 4 && this.status == 200) {
        let resultado = JSON.parse(this.responseText);
        procesarResultado(resultado);
    }
}

const modalNuevaTarea = new ModalNuevaTarea();

modalNuevaTarea.cargar().then(() => {
  const btn = document.getElementById("btnCrearTarea");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    modalNuevaTarea.mostrar();
  });
});