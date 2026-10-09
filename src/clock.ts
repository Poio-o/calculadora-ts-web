import { interval, Subscription } from "rxjs";

export class Clock {
  private id: number;
  private contenedorPadre: HTMLElement;
  private contenedorPropio!: HTMLDivElement;
  private sub: Subscription | null = null;

  constructor(id: number, contenedorPadre: HTMLElement) {
    this.id = id;
    this.contenedorPadre = contenedorPadre;
    this.crearInterfaz();
    this.registrarEventos();
  }

  private crearInterfaz(): void {
    this.contenedorPropio = document.createElement("div");
    this.contenedorPropio.className = "card reloj-card";

    this.contenedorPropio.innerHTML = `
      <h3>Reloj #${this.id}</h3>
      <div class="display-tiempo">--:--:--</div>
      <div class="botones-control">
        <button class="btn-play">Suscribir</button>
        <button class="btn-stop" disabled>Desuscribir</button>
      </div>
    `;
    this.contenedorPadre.appendChild(this.contenedorPropio);
  }

  private registrarEventos(): void {
    const btnPlay = this.contenedorPropio.querySelector<HTMLButtonElement>(".btn-play")!;
    const btnStop = this.contenedorPropio.querySelector<HTMLButtonElement>(".btn-stop")!;
    const display = this.contenedorPropio.querySelector<HTMLDivElement>(".display-tiempo")!;

    btnPlay.addEventListener("click", () => {
      if (!this.sub) {
        // Nos suscribimos al flujo de RxJS
        this.sub = interval(1000).subscribe(() => {
          display.innerText = new Date().toLocaleTimeString();
        });

        btnPlay.disabled = true;
        btnStop.disabled = false;
      }
    });

    btnStop.addEventListener("click", () => {
      if (this.sub) {
        this.sub.unsubscribe(); // Desuscripción limpia
        this.sub = null;
        display.innerText = "--:--:--";
        btnPlay.disabled = false;
        btnStop.disabled = true;
      }
    });
  }
}