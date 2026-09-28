function calcular(operacion: string): void {
  const input1 = document.getElementById("num1") as HTMLInputElement | null;
  const input2 = document.getElementById("num2") as HTMLInputElement | null;
  const elementoResultado = document.getElementById("resultado");

  if (!input1 || !input2 || !elementoResultado) {
    return;
  }

  const num1 = parseFloat(input1.value);
  const num2 = parseFloat(input2.value);

  if (isNaN(num1) || isNaN(num2)) {
    elementoResultado.innerText = "Error: Número no válido.";
    return;
  }

  let resultado: number;

  switch (operacion) {
    case 'sumar':
      resultado = num1 + num2;
      break;
    case 'restar':
      resultado = num1 - num2;
      break;
    case 'multiplicar':
      resultado = num1 * num2;
      break;
    case 'dividir':
      if (num2 === 0) {
        elementoResultado.innerText = "Error: Entre cero no se divide espabilao que eres tú mu espabilao.";
        return;
      }
      resultado = num1 / num2;
      break;
    default:
      elementoResultado.innerText = "Operación no válida.";
      return;
  }

  elementoResultado.innerText = `El resultado es: ${resultado}`;
}

(window as any).calcular = calcular;