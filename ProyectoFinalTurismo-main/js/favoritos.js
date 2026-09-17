// favoritos.js — Lógica de favoritos con localStorage

function getFavoritos() {
  return JSON.parse(localStorage.getItem("favoritosDestinos")) || [];
}

function esFavorito(id) {
  if (!id) return false;
  return getFavoritos().some(f => String(f.id) === String(id) || f.lugar === String(id));
}

function toggleFavorito(destino, btn) {
  const favs = getFavoritos();
  const id   = String(destino.id || destino.lugar);
  const idx  = favs.findIndex(f => String(f.id) === id || f.lugar === id);

  if (idx === -1) {
    favs.push(destino);
    btn.classList.add("activo");
    btn.title = "Quitar de favoritos";
    mostrarToastFav(`❤️ ${destino.lugar || destino.nombre} agregado a favoritos`);
  } else {
    favs.splice(idx, 1);
    btn.classList.remove("activo");
    btn.title = "Agregar a favoritos";
    mostrarToastFav(`💔 ${destino.lugar || destino.nombre} quitado de favoritos`);
  }

  localStorage.setItem("favoritosDestinos", JSON.stringify(favs));
}

function mostrarToastFav(mensaje) {
  let toast = document.getElementById("toastFavorito");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastFavorito";
    toast.style.cssText = `
      position: fixed; bottom: 90px; right: 28px; z-index: 9999;
      background: #333; color: white; padding: 10px 18px;
      border-radius: 8px; font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = mensaje;
  toast.style.opacity = "1";
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => { toast.style.opacity = "0"; }, 2500);
}