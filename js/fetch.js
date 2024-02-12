export const fetchGet = (url, call) => {
  // $img.hidden = false;

  fetch(url)
    .then((res) => {
      return res.ok ? res.json() : Promise.reject(res);
    })
    .then((data) => {
      call(data);
    })
    .catch((err) => {
      console.error("Error: " + err.status + " " + err.statusText);
      call([]);
    })
    .finally(() => {
      // $img.hidden = true;
    });
};

export const fetchGetAsyc = async (url, call) => {
  // $spinner.hidden = false;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return await call(await response.json());
  } catch (err) {
    console.error("Error:", err);
    return await call([]);
  } finally {
    // $spinner.hidden = true;
  }
};
