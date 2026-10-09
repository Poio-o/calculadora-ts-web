import { interval, Subscription } from "rxjs";

export class Cronometro {
  private id: number;
  private contenedorPadre: HTMLElement;
  private contenedorPropio!: HTMLDivElement;
  private sub: Subscription | null = null;
  
  // Variables para el cálculo exacto del tiempo
  private tiempoAcumulado = 0;
  private tiempoInicio = 0;
  private milisegundosMuestra = 0;
  
  private modo: "normal" | "atras" = "normal";

  constructor(id: number, contenedorPadre: HTMLElement) {
    this.id = id;
    this.contenedorPadre = contenedorPadre;
    this.crearInterfaz();
    this.registrarEventos();
  }

  private crearInterfaz(): void {
    this.contenedorPropio = document.createElement("div");
    this.contenedorPropio.className = "card crono-card";

    this.contenedorPropio.innerHTML = `
      <h3>Cronómetro #${this.id}</h3>
      
      <div class="crono-config">
        <select class="crono-modo">
          <option value="normal">Normal</option>
          <option value="atras">Cuenta Atrás</option>
        </select>
        <input type="number" class="crono-input-segundos" placeholder="Segundos" min="1" value="10" style="display: none;">
      </div>

      <div class="display-tiempo">00:00:00.000</div>
      
      <div class="botones-control">
        <button class="btn-start">Play</button>
        <button class="btn-pause" disabled>Pausa</button>
        <button class="btn-reset">Reiniciar</button>
      </div>
    `;
    this.contenedorPadre.appendChild(this.contenedorPropio);
  }

  private registrarEventos(): void {
    const btnStart = this.contenedorPropio.querySelector<HTMLButtonElement>(".btn-start")!;
    const btnPause = this.contenedorPropio.querySelector<HTMLButtonElement>(".btn-pause")!;
    const btnReset = this.contenedorPropio.querySelector<HTMLButtonElement>(".btn-reset")!;
    const selectModo = this.contenedorPropio.querySelector<HTMLSelectElement>(".crono-modo")!;
    const inputSegundos = this.contenedorPropio.querySelector<HTMLInputElement>(".crono-input-segundos")!;

    selectModo.addEventListener("change", () => {
      this.modo = selectModo.value as "normal" | "atras";
      inputSegundos.style.display = this.modo === "atras" ? "block" : "none";
      this.reiniciar();
    });

    btnStart.addEventListener("click", () => this.iniciar());
    btnPause.addEventListener("click", () => this.pausar());
    btnReset.addEventListener("click", () => this.reiniciar());
  }

  private iniciar(): void {
    if (!this.sub) {
      const btnStart = this.contenedorPropio.querySelector<HTMLButtonElement>(".btn-start")!;
      const btnPause = this.contenedorPropio.querySelector<HTMLButtonElement>(".btn-pause")!;
      const selectModo = this.contenedorPropio.querySelector<HTMLSelectElement>(".crono-modo")!;
      const inputSegundos = this.contenedorPropio.querySelector<HTMLInputElement>(".crono-input-segundos")!;

      // Capturamos la marca de tiempo exacta del sistema al arrancar o reanudar
      this.tiempoInicio = Date.now();

      if (this.modo === "atras" && this.tiempoAcumulado === 0) {
        const segundosIniciales = parseInt(inputSegundos.value) || 10;
        this.tiempoAcumulado = segundosIniciales * 1000;
      }

      selectModo.disabled = true;
      inputSegundos.disabled = true;
      btnStart.disabled = true;
      btnPause.disabled = false;

      // El intervalo sirve solo para "despertar" al renderizador, no para contar
      this.sub = interval(10).subscribe(() => {
        const tiempoPasado = Date.now() - this.tiempoInicio;

        if (this.modo === "normal") {
          this.milisegundosMuestra = this.tiempoAcumulado + tiempoPasado;
        } else {
          this.milisegundosMuestra = this.tiempoAcumulado - tiempoPasado;
          
          if (this.milisegundosMuestra <= 0) {
            this.milisegundosMuestra = 0;
            this.tiempoAcumulado = 0;
            this.actualizarDisplay();
            this.pausar();
            return;
          }
        }
        this.actualizarDisplay();
      });
    }
  }

  private pausar(): void {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;

      // Al pausar, guardamos el tiempo que ya ha transcurrido
      if (this.modo === "normal") {
        this.tiempoAcumulado += Date.now() - this.tiempoInicio;
      } else {
        this.tiempoAcumulado -= Date.now() - this.tiempoInicio;
        if (this.tiempoAcumulado < 0) this.tiempoAcumulado = 0;
      }

      const btnStart = this.contenedorPropio.querySelector<HTMLButtonElement>(".btn-start")!;
      const btnPause = this.contenedorPropio.querySelector<HTMLButtonElement>(".btn-pause")!;
      btnStart.disabled = false;
      btnPause.disabled = true;
    }
  }

  private reiniciar(): void {
    this.pausar();
    this.tiempoAcumulado = 0;
    this.milisegundosMuestra = 0;

    const selectModo = this.contenedorPropio.querySelector<HTMLSelectElement>(".crono-modo")!;
    const inputSegundos = this.contenedorPropio.querySelector<HTMLInputElement>(".crono-input-segundos")!;
    
    selectModo.disabled = false;
    inputSegundos.disabled = false;

    if (this.modo === "atras") {
      const segundosIniciales = parseInt(inputSegundos.value) || 10;
      this.tiempoAcumulado = segundosIniciales * 1000;
      this.milisegundosMuestra = this.tiempoAcumulado;
    }

    this.actualizarDisplay();
  }

  private actualizarDisplay(): void {
    const display = this.contenedorPropio.querySelector<HTMLDivElement>(".display-tiempo")!;
    
    const totalSegundos = Math.floor(this.milisegundosMuestra / 1000);
    const ms = this.milisegundosMuestra % 1000; 
    
    const hrs = Math.floor(totalSegundos / 3600);
    const mins = Math.floor((totalSegundos % 3600) / 60);
    const segs = totalSegundos % 60;

    const pad = (num: number) => num.toString().padStart(2, "0");
    const padMs = (num: number) => num.toString().padStart(3, "0");

    display.innerText = `${pad(hrs)}:${pad(mins)}:${pad(segs)}.${padMs(ms)}`;
  }
}