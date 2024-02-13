import { ganador, regalo } from "./gifs.js";
// INICIO JUEGO
export const palabras = [
  "SOL",
  "GATO",
  "FLOR",
  "ARBOL",
  "CASA",
  "SILLA",
  "PIANO",
  "OSCURO",
  "AMISTAD",
  "CRUCERO",
  "COLORES",
  "TRABAJO",
  "GUITARRA",
  "ELEFANTE",
  "VEHICULO",
];

export function alertMsj(titulo, msj, img) {
  Swal.fire({
    title: titulo,
    text: msj,
    imageUrl: img,
    imageWidth: 100,
    imageHeight: 100,
    confirmButtonText: "Aceptar",
  });
}

export function cargarJuego(palabra) {
  const usuario = JSON.parse(localStorage.getItem("sesion"));

  if (usuario.nivel > palabras.length) {
    alertMsj("Felicitaciones", "Ya completaste todo el juego!", ganador);
    location.reload();
  } else {
    let nivel = usuario.nivel - 1;
    const $h1 = document.querySelector("h1");
    const $p = document.getElementById("pIntentos");
    $h1.textContent =
      "Hola " +
      usuario.usuario +
      "! Te encuentras en el nivel " +
      usuario.nivel +
      " y tienes " +
      nivel * 1000 +
      " puntos";

    const intentos = usuario.intentos || 0;
    $p.textContent = "Intentos: " + intentos;

    const $divCompletar = document.getElementById("divPalabraCompletar");
    const $divDesordenado = document.getElementById("divPalabraDesordenada");

    function desordenar(palabra) {
      // Convertir la palabra en un array de caracteres
      let letras = palabra.split("");

      // Barajar las letras del array
      for (let i = letras.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = letras[i];
        letras[i] = letras[j];
        letras[j] = temp;
      }

      // Unir las letras nuevamente en una palabra desordenada
      let palabraDesordenada = letras.join("");

      return palabraDesordenada;
    }

    let palabraDesordenada = desordenar(palabra);

    while (palabraDesordenada === palabra) {
      palabraDesordenada = desordenar(palabra);
    }

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < palabraDesordenada.length; i++) {
      const btn = document.createElement("button");
      btn.textContent = palabraDesordenada[i];
      btn.classList.add("btnLetra");
      btn.setAttribute("data-posicion", i);
      btn.setAttribute("data-div", "des");
      fragment.appendChild(btn);
    }

    $divDesordenado.appendChild(fragment);

    const fragment2 = document.createDocumentFragment();
    for (let i = 0; i < palabra.length; i++) {
      const btn = document.createElement("button");
      // btn.textContent = palabra[i];
      btn.classList.add("btnLetra");
      btn.setAttribute("data-div", "com");
      fragment2.appendChild(btn);
    }

    $divCompletar.appendChild(fragment2);
  }
}

export function palabraJuego() {
  const usuario = JSON.parse(localStorage.getItem("sesion"));

  return palabras[usuario ? usuario.nivel - 1 : 0];
}

export function leerPalabra($divCompletar) {
  const lenDiv = $divCompletar.childNodes;
  let palabra = "";
  lenDiv.forEach((e) => {
    palabra += e.textContent;
  });
  return palabra;
}

export function clickLetra($divDesordenado, $divCompletar, e) {
  if (e.target.dataset.div === "des") {
    const lenDiv = $divCompletar.childNodes;

    for (let i = 0; i < lenDiv.length; i++) {
      if (lenDiv[i].textContent === "") {
        lenDiv[i].textContent = e.target.textContent;
        e.target.textContent = "";
        lenDiv[i].setAttribute("data-des", e.target.dataset.posicion);
        break;
      }
    }
  } else if (e.target.dataset.div === "com" && e.target.textContent != "") {
    const lenDiv = $divDesordenado.childNodes;
    lenDiv[e.target.dataset.des].textContent = e.target.textContent;
    e.target.textContent = "";
  }
}

export function VerificarPalabra(formada, palabra, usuarios, $divDesordenado, $divCompletar) {
  if (formada.length == palabra.length) {
    const $p = document.getElementById("pIntentos");
    const usuario = JSON.parse(localStorage.getItem("sesion"));
    let indice = usuarios.findIndex((user) => user.usuario === usuario.usuario);

    if (palabra === formada) {
      const audioVictoria = new Audio("../audio/victoria.mp3");
      audioVictoria.play();
      usuario.fecha = new Date();
      usuario.intentos = 0;
      const dialogFin = document.getElementById("dialogFin");
      $p.hidden = true;
      dialogFin.setAttribute("open", true);
      activarDesactivarBotones(true);

      const h3 = document.getElementById("h3Dialog");
      const img = document.getElementById("imgDialog");
      if (usuario.nivel === 10) {
        img.setAttribute("src", regalo);
        h3.textContent = "Te ganaste un 20% de descuento en productos seleccionados en nuestra tienda";
      } else if (usuario.nivel === palabras.length - 1) {
        img.setAttribute("src", regalo);
        h3.textContent = "Te ganaste una orden de compra por $20.000!";
      } else if (usuario.nivel === palabras.length) {
        img.setAttribute("src", ganador);
        h3.textContent = "Superaste todos los niveles!";
      } else {
        h3.textContent = "Ya completaste tu nivel del dia!";
      }

      usuario.nivel++;
    } else {
      const $modal = document.getElementById("dialogError");
      const audioDerrota = new Audio("../audio/derrota.mp3");
      audioDerrota.play();
      let intentos = isNaN($p.dataset.intentos) ? 0 : parseInt($p.dataset.intentos);
      intentos++;
      usuario.intentos = intentos;
      $p.setAttribute("data-intentos", intentos);
      $p.textContent = "Intentos: " + intentos;
      activarDesactivarBotones(true);
      setTimeout(() => {
        reinciarJuego($divDesordenado, $divCompletar);
      }, 2000);
      $modal.open = true;
      document.querySelector("main").appendChild($modal);
      setTimeout(() => {
        $modal.open = false;
      }, 2000);
    }
    usuarios[indice] = usuario;
    localStorage.setItem("sesion", JSON.stringify(usuario));
  }
}

function reinciarJuego($divDesordenado, $divCompletar) {
  const lenDiv = $divDesordenado.childNodes;
  const div = $divCompletar.childNodes;

  for (let i = 0; i < lenDiv.length; i++) {
    setTimeout(() => {
      const index = div[i].dataset.des;
      lenDiv[index].textContent = div[i].textContent;
      setTimeout(() => {
        div[i].textContent = "";
        activarDesactivarBotones(false);
      }, 1000);
    }, 900);
  }
}

function activarDesactivarBotones(boolean) {
  const botones = document.querySelectorAll(".btnLetra");

  botones.forEach(function (boton) {
    boton.disabled = boolean;
  });
}
// FIN JUEGO
