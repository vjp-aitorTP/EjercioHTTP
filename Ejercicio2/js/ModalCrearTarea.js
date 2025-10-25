export class ModalNuevaTarea {
  constructor() {
    this.modal = null;
  }

  async cargar() {
    const response = await fetch("modales/modalNuevaTarea.html");
    const html = await response.text();
    document.body.insertAdjacentHTML("beforeend", html);

    this.modal = new bootstrap.Modal(document.getElementById("modalNuevaTarea"));
    const form = document.getElementById("formNuevaTarea");

    // Al enviar, cerramos modal y "volvemos al inicio"
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.modal.hide();
      form.reset();
      window.scrollTo(0, 0); // Vuelve arriba
    });
  }

  mostrar() {
    this.modal.show();
  }
}
