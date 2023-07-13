export class Widget {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  static get markup() {
    return sessionStorage.getItem("container")
      ? sessionStorage.getItem("container")
      : `
      <div class="posts"></div>
      <form class="post-add">
        <textarea class="input-post-text"placeholder="What's new?"></textarea>
      </form>
      <div class="modal"></div>
      `;
  }

  bindToDOM() {
    this.parentEl.innerHTML = Widget.markup;
    this.form = document.querySelector(".post-add");
    this.form.addEventListener("keyup", this.getLocation);
  }

  getLocation(e) {
    if (e.code === "Enter") {
      if (navigator.geolocation) {
        const modal = document.querySelector(".modal");
        let coords;

        navigator.geolocation.getCurrentPosition(
          function (data) {
            const { latitude, longitude } = data.coords;

            coords = { lat: latitude, long: longitude };
            Widget.addPost(coords);
          },
          function (err) {
            modal.classList.add("modal-active");
            if (err.code === 1) {
              modal.innerHTML = `<p>К сожалению, нам не удалось определить ваше&nbsp;местоположение.</p>
              <p>Пожалуйста, дайте разрешение на&nbsp;использование геолокации, или&nbsp;введите координаты вручную.</p>
              <p>Широта и долгота через запятую</p>
              <form class="coords-form">
                <input class="input-coords" placeholder="51.50851, −0.12572"></input>
                <button class="coords-btn back" type="button">Отмена</button>
                <button class="coords-btn" type="submit">OK</button>
              </form>`;
              const backBtn = document.querySelector(".coords-btn.back");
              backBtn.addEventListener("click", () => {
                modal.classList.remove("modal-active");
              });
              const coordsForm = document.querySelector(".coords-form");
              coordsForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const input = e.target.querySelector(".input-coords");

                coords = Widget.coordsValidation(input.value);
                if (coords) {
                  modal.classList.remove("modal-active");
                  Widget.addPost(coords);
                } else {
                  input.classList.add("invalid");
                }
              });
            }
          },
          { enableHighAccuracy: true }
        );
      }
    }
  }

  static coordsValidation(inputCoords) {
    let coords;
    
    try {
      const lat = inputCoords.split(",")[0].trim();
      const long = inputCoords.split(",")[1].trim();
      coords = { lat: lat, long: long };
      
      if (lat[0] === "[" && long.at(-1) === "]") {
        coords.lat = lat.slice(1, lat.length);
        coords.long = long.slice(0, long.length - 1);
      }

      const regexLat = /^(\d{1,2}){1}\.\d+/
      const regexLong = /^((-?|−?)\d{1,3}){1}\.\d+/
      if (!regexLat.test(coords.lat) || !regexLong.test(coords.long)) {
        return
      }

    } catch (err) {}
    return coords;
  }

  static addPost(coords) {
    let container = document.querySelector(".container");
    const textarea = document.querySelector(".input-post-text");
    const post = document.createElement("div");
    const postHeader = document.createElement("div");
    const postLocation = document.createElement("div");
    const dateText = document.createElement("div");
    const dateTime = new Date();
    const date = dateTime
      .toISOString()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join(".");
    const time = dateTime.toString().slice(16, 21);

    post.classList.add("post");
    post.textContent = textarea.value;

    postHeader.classList.add("post-header");

    postLocation.classList.add("post-location");
    postLocation.textContent = "[" + coords.lat + ", " + coords.long + "]";

    dateText.classList.add("post-date");
    dateText.textContent = date + " " + time;

    postHeader.append(postLocation);
    postHeader.append(dateText);

    post.append(postHeader);

    textarea.value = "";

    document.querySelector(".posts").append(post);

    sessionStorage.setItem("container", container.innerHTML);
  }
}
