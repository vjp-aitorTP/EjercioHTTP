export class ModalNuevaTarea {
  constructor() {
    /** Inicializamos la referencia al modal */
    this.modal = null;
  }

  /** Cargamos el HTML del modal y configuramos el formulario de nueva tarea */
  async cargar(callback) {
    // Obtenemos el contenido del modal desde un archivo HTML
    const response = await fetch("modales/modalNuevaTarea.html");
    const html = await response.text();

    // Insertamos el modal en el body
    document.body.insertAdjacentHTML("beforeend", html);

    // Inicializamos el modal con Bootstrap
    this.modal = new bootstrap.Modal(document.getElementById("modalNuevaTarea"));

    // Obtenemos el formulario del modal
    const form = document.getElementById("formNuevaTarea");

    // Configuramos el submit del formulario
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Creamos un objeto tarea con los datos del formulario
      const tarea = {
        titulo: document.getElementById("titulo").value,
        descripcion: document.getElementById("descripcion").value,
        estado: document.getElementById("estado").value,
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value,
      };

      try {
        // Enviamos la nueva tarea a la API
        const res = await fetch("http://localhost:3000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(tarea)
        });

        if (!res.ok) throw new Error("Error al crear la tarea");

        // Obtenemos la tarea creada desde la respuesta
        const tareaCreada = await res.json();

        // Llamamos al callback con la tarea creada
        if (callback) callback(tareaCreada);

        // Cerramos el modal, reseteamos el formulario y hacemos scroll al inicio
        this.modal.hide();
        form.reset();
        window.scrollTo(0, 0);

      } catch (error) {
        // Mostramos error si no se pudo crear la tarea
        console.error(error);
        alert("No se pudo crear la tarea");
      }
    });
  }

  /** Mostramos el modal de nueva tarea */
  mostrar() {
    this.modal.show();
  }
}
