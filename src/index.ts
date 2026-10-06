import { interval } from "rxjs";
import { dateTimestampProvider } from "rxjs/internal/scheduler/dateTimestampProvider";

class Calculadora {
  private id: number;
  private contenedorPadre: HTMLElement;
  private contenedorPropio!: HTMLDivElement;

  constructor(id: number, contenedorPadre: HTMLElement) {
    this.id = id;
    this.contenedorPadre = contenedorPadre;
    this.crearInterfaz();
    this.registrarEventos();
  }

  private crearInterfaz(): void {
    this.contenedorPropio = document.createElement("div");
    this.contenedorPropio.className = "calc-card";

    this.contenedorPropio.innerHTML = `
      <h3>Calculadora #${this.id}</h3>
      <input type="number" class="calc-input num1" placeholder="Primer número">
      <input type="number" class="calc-input num2" placeholder="Segundo número">

      <div class="calc-buttons">
        <button class="btn-op" data-op="sumar">+</button>
        <button class="btn-op" data-op="restar">-</button>
        <button class="btn-op" data-op="multiplicar">*</button>
        <button class="btn-op" data-op="dividir">/</button>
      </div>

      <div class="calc-resultado">El resultado es: —</div>
    `;

    this.contenedorPadre.appendChild(this.contenedorPropio);
  }

  private registrarEventos(): void {
    const botones = this.contenedorPropio.querySelectorAll<HTMLButtonElement>(".btn-op");
    botones.forEach((boton) => {
      boton.addEventListener("click", () => {
        const operacion = boton.getAttribute("data-op");
        if (operacion) {
          this.calcular(operacion);
        }
      });
    });
  }

  private calcular(operacion: string): void {
    const input1 = this.contenedorPropio.querySelector<HTMLInputElement>(".num1");
    const input2 = this.contenedorPropio.querySelector<HTMLInputElement>(".num2");
    const resDiv = this.contenedorPropio.querySelector<HTMLDivElement>(".calc-resultado");

    if (!input1 || !input2 || !resDiv) return;

    const num1 = parseFloat(input1.value);
    const num2 = parseFloat(input2.value);

    if (isNaN(num1) || isNaN(num2)) {
      resDiv.innerText = "Error: Ingrese números válidos.";
      return;
    }

    let resultado: number;

    switch (operacion) {
      case "sumar":
        resultado = num1 + num2;
        break;
      case "restar":
        resultado = num1 - num2;
        break;
      case "multiplicar":
        resultado = num1 * num2;
        break;
      case "dividir":
        if (num2 === 0) {
          resDiv.innerText = "Que no se puede dividir entre 0 espabilao";
          return;
        }
        resultado = num1 / num2;
        break;
      default:
        return;
    }

    resDiv.innerText = `El resultado es: ${resultado}`;
  }
}

const contenedorGrid = document.getElementById("calculadoras-grid") as HTMLElement;

if (contenedorGrid) {
  const cantidadDeseada = 7;
  for (let i = 1; i <= cantidadDeseada; i++) {
    new Calculadora(i, contenedorGrid);
  }
}


