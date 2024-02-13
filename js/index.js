import { fetchGet } from "./fetch.js";
import { ajaxGet } from "./ajax.js";
import { cargarJuego, palabraJuego, VerificarPalabra, clickLetra, leerPalabra, siguienteNivel } from "./juego.js";

const $form = document.getElementById("form-login");
const $formRegistrar = document.getElementById("formRegistrar");
const { floatingInputUser, floatingInputPass, floatingInputRepetir } = $formRegistrar;
const audioFondo = new Audio("../audio/fondo.mp3");

// const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const usuarios = leerCookie();
// const usuarios = [{ usuario: "fede", password: "1234" }];
const { floatingInput, floatingPassword } = $form;

// console.log(usuarios);

let palabra = palabraJuego();
const $btnOjo = document.getElementById("basic-addon1");

const $btnRegistrarse = document.getElementById("btnRegistrarse");
const $btnRegistrar = document.getElementById("btnRegistrar");
const $btnCerrar = document.getElementById("btnCerrar");
const $dialog = document.getElementById("dialog");

$btnOjo.addEventListener("click", (e) => {
  const iconOjo = document.getElementById("icon-ojo");
  if (iconOjo.classList.value === "bi bi-eye-fill") {
    iconOjo.classList.value = "bi bi-eye-slash-fill";
    floatingPassword.type = "text";
  } else {
    iconOjo.classList.value = "bi bi-eye-fill";
    floatingPassword.type = "password";
  }
});

$btnRegistrarse.addEventListener("click", () => {
  $dialog.setAttribute("open", true);
  document.getElementById("lblUsuario").style.display = "none";
  document.getElementById("lblPass").style.display = "none";
});

function dialogClose() {
  $dialog.removeAttribute("open");
  document.getElementById("lblUsuario").style.display = "inline";
  document.getElementById("lblPass").style.display = "inline";
}

$btnCerrar.addEventListener("click", () => {
  dialogClose();
  floatingInputUser.value = "";
  floatingInputPass.value = "";
  floatingInputRepetir.value = "";
});

$btnRegistrar.addEventListener("click", (e) => {
  e.preventDefault();

  const user = {
    usuario: floatingInputUser.value,
    password: floatingInputPass.value,
    nivel: 1,
  };

  let flag = false;

  if (usuarios.length) {
    usuarios.forEach((element) => {
      if (element.usuario === floatingInputUser.value) {
        alert("No se puede crear. Ese usuario ya existe");
        flag = true;
      }
    });
  }

  if (!flag) {
    if (floatingInputPass.value === floatingInputRepetir.value) {
      usuarios.push(user);
      // localStorage.setItem("usuarios", JSON.stringify(usuarios));
      escribirCookie();
      alert("Usuario creado con exito");
      dialogClose();
    } else alert("Las contraseñas no coinciden");
  }
});

document.getElementById("btnSesion").addEventListener("click", (e) => {
  e.preventDefault();
  const $img = document.getElementById("spinner");
  $img.hidden = false;
  const $fieldset = document.querySelector("fieldset");
  $fieldset.hidden = true;
  setTimeout(() => {
    $fieldset.hidden = false;
    $img.hidden = true;
    let flag = false;
    if (usuarios.length) {
      usuarios.forEach((element) => {
        if (element.usuario === floatingInput.value && element.password === floatingPassword.value) {
          localStorage.setItem("sesion", JSON.stringify(element));
          palabra = palabraJuego();
          flag = true;
        }
      });
    }

    if (!flag) {
      alert("Usuario o contraseña incorrecta!");
    } else if (flag) {
      loadJuego();
      audioFondo.play();
    }
  }, 2000);
});

function escribirCookie() {
  // Nombre y valor de la cookie
  const nombreCookie = "usuarios";
  const valorCookie = JSON.stringify(usuarios);

  // Configurar la fecha de expiración (opcional)
  let fechaExpiracion = new Date();
  fechaExpiracion.setDate(fechaExpiracion.getDate() + 99999); // Caduca en 7 días

  // Crear la cadena de cookie
  let cadenaCookie =
    nombreCookie + "=" + encodeURIComponent(valorCookie) + "; expires=" + fechaExpiracion.toUTCString() + "; path=/";

  // Escribir la cookie
  document.cookie = cadenaCookie;

  // alert("Cookie escrita con éxito.");
}

function leerCookie() {
  // Nombre de la cookie que deseas leer
  const nombreCookie = "usuarios";

  // Separar las cookies en un array
  const cookies = document.cookie.split(";");

  // Buscar la cookie específica
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();

    // Verificar si la cookie comienza con el nombre deseado
    if (cookie.indexOf(nombreCookie + "=") === 0) {
      // Obtener el valor de la cookie
      let valorCookie = cookie.substring(nombreCookie.length + 1);
      // alert("Valor de la cookie: " + decodeURIComponent(valorCookie));

      return JSON.parse(decodeURIComponent(valorCookie));
    }
  }
  return [];
}

//Sonido
audioFondo.addEventListener("ended", () => {
  audioFondo.play();
});

// INICIO JUEGO

window.addEventListener("click", (e) => {
  const target = e.target;
  //OBTENER SELECCION
  if (
    target.matches("button") &&
    (target.parentNode.id === "divPalabraCompletar" || target.parentNode.id === "divPalabraDesordenada")
  ) {
    const $divCompletar = document.getElementById("divPalabraCompletar");
    const $divDesordenado = document.getElementById("divPalabraDesordenada");
    clickLetra($divDesordenado, $divCompletar, e);

    const formada = leerPalabra($divCompletar);
    setTimeout(() => {
      if (VerificarPalabra(formada, palabra, usuarios, $divDesordenado, $divCompletar)) {
        escribirCookie();
        palabra = palabraJuego();
      }
    }, 500);
  } else if (target.matches("button")) {
    const $pause = document.getElementById("dialogPaused");
    const $intentos = document.getElementById("pIntentos");

    if (target.id === "btnAceptar") {
      //Siguiente nivel
      const dialogFin = document.getElementById("dialogFin");
      dialogFin.open = false;
      siguienteNivel();
    } else if (target.id === "btnSalir" || target.id === "btnPausedSalir") {
      location.reload();
    } else if (target.id === "btnPausedContinuar") {
      $pause.open = false;
      $intentos.hidden = false;
      audioFondo.play();
    } else if (target.id === "btnPaused") {
      $intentos.hidden = true;
      audioFondo.pause();
      $pause.open = true;
    }
  }
});

function loadJuego() {
  const url = "../html/juego.html";
  ajaxGet(url, (res) => {
    const parser = new DOMParser();

    // Convertir el HTML en un documento DOM
    const doc = parser.parseFromString(res.responseText, "text/html");

    // Obtener el contenido de la etiqueta <body>
    const contenidoBody = doc.querySelector("body").innerHTML;
    const $body = document.querySelector("body");

    $body.innerHTML = contenidoBody;
    cargarJuego(palabra);
  });
}

// FIN JUEGO
