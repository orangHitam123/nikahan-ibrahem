/* Kontrol cover undangan dan musik */
document.addEventListener("DOMContentLoaded", () => {
  const cover = document.getElementById("invitation-cover");
  const openButton = document.getElementById("open-invitation");
  const mainContent = document.getElementById("main-content");
  const music = document.getElementById("background-music");
  const musicToggle = document.getElementById("music-toggle");

  function updateMusicButton() {
    if (!music || !musicToggle) return;
    const playing = !music.paused;
    musicToggle.textContent = playing ? "♫" : "♪";
    musicToggle.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
    musicToggle.setAttribute("aria-pressed", String(playing));
  }

  if (music && musicToggle) {
    music.volume = 0.5;
    musicToggle.addEventListener("click", async () => {
      if (music.paused) {
        try {
          await music.play();
        } catch (error) {
          console.warn("Musik tidak dapat diputar:", error);
        }
      } else {
        music.pause();
      }
      updateMusicButton();
    });
    music.addEventListener("play", updateMusicButton);
    music.addEventListener("pause", updateMusicButton);
    updateMusicButton();
  }

  if (!cover || !openButton || !mainContent) return;
  openButton.focus({ preventScroll: true });

  function openInvitation() {
    if (cover.classList.contains("is-closing")) return;
    openButton.disabled = true;
    cover.classList.add("is-closing");

    if (music) {
      music.play().catch((error) => {
        console.warn("Musik belum dapat diputar:", error);
      });
    }

    let completed = false;
    function finish() {
      if (completed) return;
      completed = true;
      cover.remove();
      document.body.classList.remove("cover-open");
      mainContent.focus({ preventScroll: true });
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      finish();
    } else {
      cover.addEventListener("transitionend", (event) => {
        if (event.target === cover && event.propertyName === "opacity") finish();
      });
      window.setTimeout(finish, 900);
    }
  }

  openButton.addEventListener("click", openInvitation);

  document.addEventListener("keydown", (event) => {
    if (document.body.classList.contains("cover-open") && event.key === "Tab") {
      event.preventDefault();
      openButton.focus({ preventScroll: true });
    }
  });
});
