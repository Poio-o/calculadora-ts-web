import { interval } from "rxjs";

class Clock {
    private id: number;
    private contenedorPadre: HTMLElement;
    private contenedorPropio!: HTMLDivElement;

    constructor(id: number, contenedorPadre: HTMLElement) {
        this.id = id;
        this.contenedorPadre = contenedorPadre;
    }

}


const tiempoH = document.getElementById("tiempo-grid") as HTMLElement;

if (tiempoH) {
    const source = interval(1000);
    const subscription = source.subscribe(value => {
        tiempoH.innerText = new Date().toLocaleTimeString();
    });
}

// en clases separadas y que se pueda parar pausar, que reinicier o play pa que inicie