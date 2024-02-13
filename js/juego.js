// INICIO JUEGO
const palabras = [
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

export function cargarJuego(palabra) {
  const usuario = JSON.parse(localStorage.getItem("sesion"));

  if (usuario.nivel === palabras.length) {
    alert("Ya completataste todo el juego!");
    location.reload();
  } else {
    let nivel = usuario.nivel - 1;
    const $h1 = document.querySelector("h1");
    $h1.textContent =
      "Hola " +
      usuario.usuario +
      "! Te encuentras en el nivel " +
      usuario.nivel +
      " y tienes " +
      nivel * 1000 +
      " puntos";

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
    let retorno = false;
    const $p = document.getElementById("pIntentos");

    if (palabra === formada) {
      const audioVictoria = new Audio("../audio/victoria.mp3");
      audioVictoria.play();
      const usuario = JSON.parse(localStorage.getItem("sesion"));
      usuario.nivel++;
      localStorage.setItem("sesion", JSON.stringify(usuario));
      let indice = usuarios.findIndex((user) => user.usuario === usuario.usuario);
      usuario.fecha = new Date();
      usuarios[indice] = usuario;
      retorno = true;
      const dialogFin = document.getElementById("dialogFin");
      $p.hidden = true;
      dialogFin.setAttribute("open", true);
      activarDesactivarBotones(true);

      const h3 = document.getElementById("h3Dialog");
      if (usuario.nivel === 10) {
        h3.textContent = "Te ganaste un 20% de descuento en productos seleccionados en nuestra tienda";
      } else if (usuario.nivel === palabras.length) {
        h3.textContent = "Te ganaste una orden de compra por $20.000!";
      } else {
        h3.textContent = "Formaste la palabra correctamente!";
      }
    } else {
      const $modal = document.createElement("dialog");
      const $h2 = document.createElement("h2");
      const audioDerrota = new Audio("../audio/derrota.mp3");
      audioDerrota.play();
      let intentos = isNaN($p.dataset.intentos) ? 0 : parseInt($p.dataset.intentos);
      intentos++;
      $p.hidden = false;
      $p.setAttribute("data-intentos", intentos);
      $p.textContent = "Intentos: " + intentos;
      $h2.textContent = "Palabra incorrecta! Intentelo nuevamente";
      activarDesactivarBotones(true);
      setTimeout(() => {
        reinciarJuego($divDesordenado, $divCompletar);
      }, 2000);
      $modal.appendChild($h2);
      $modal.open = true;
      document.querySelector("main").appendChild($modal);
      setTimeout(() => {
        $modal.open = false;
      }, 2000);
    }
    return retorno;
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

export function siguienteNivel() {
  const $p = document.getElementById("pIntentos");

  const $divCompletar = document.getElementById("divPalabraCompletar");
  const $divDesordenado = document.getElementById("divPalabraDesordenada");
  while ($divCompletar.firstChild) {
    $divCompletar.removeChild($divCompletar.firstChild);
  }
  while ($divDesordenado.firstChild) {
    $divDesordenado.removeChild($divDesordenado.firstChild);
  }

  cargarJuego(palabraJuego());

  const intentos = 0;
  $p.setAttribute("data-intentos", intentos);
  $p.textContent = "Intentos: " + intentos;
  $p.hidden = false;
}

// FIN JUEGO
