export class ModalNuevaTarea {
  constructor() {
    this.modal = null;
  }

  async cargar(callback) {
    const response = await fetch("modales/modalNuevaTarea.html");
    const html = await response.text();
    document.body.insertAdjacentHTML("beforeend", html);

    this.modal = new bootstrap.Modal(document.getElementById("modalNuevaTarea"));
    const form = document.getElementById("formNuevaTarea");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const tarea = {
        titulo: document.getElementById("titulo").value,
        descripcion: document.getElementById("descripcion").value,
        estado: document.getElementById("estado").value,
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value,
      };

      try {
        const res = await fetch("http://localhost:3000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(tarea)
        });

        if (!res.ok) throw new Error("Error al crear la tarea");

        const tareaCreada = await res.json();

        if (callback) callback(tareaCreada); // devolvemos la tarea creada al JS principal

        this.modal.hide();
        form.reset();
        window.scrollTo(0, 0);

      } catch (error) {
        console.error(error);
        alert("No se pudo crear la tarea");
      }
    });
  }

  mostrar() {
    this.modal.show();
  }
}
