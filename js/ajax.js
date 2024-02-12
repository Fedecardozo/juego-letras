//Traer todos
export const ajaxGet = (url, call) => {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        // const data = JSON.parse(xhr.responseText);
        //Aca tengo que hacer algo
        //   call();
        call(xhr);
        // return data;
      } else {
        console.error("Errro: " + xhr.status + " " + xhr.statusText);
      }
    }
  });
  xhr.open("GET", url);
  xhr.send();
};

//Create post
export const ajaxPostCreate = (url, $img, data, $table) => {
  $img.hidden = false;
  $table.hidden = true;

  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        // alert(data);
      } else {
        console.error("Error: " + xhr.status + " " + xhr.statusText);
      }
      $img.hidden = true;
      $table.hidden = false;
    }
  });
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
  xhr.send(JSON.stringify(data));
};

//Modificar put obtiene el id de la data
export const ajaxPut = (url, data, $spinner, $table) => {
  const xhr = new XMLHttpRequest();
  $spinner.hidden = false;
  $table.hidden = true;

  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        // const json = JSON.parse(xhr.responseText);
        $spinner.hidden = true;
        $table.hidden = false;
      } else {
        console.error("Error: " + xhr.status + " " + xhr.statusText);
      }
    }
  });
  xhr.open("PUT", url + "/" + data.id);
  xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
  xhr.send(JSON.stringify(data));
};
