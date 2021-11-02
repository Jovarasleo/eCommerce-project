document.querySelector(".cartIcon i").addEventListener("click", () => {
  if (JSON.parse(localStorage.getItem("cart")).length) {
    document.querySelector(".cart").classList.toggle("is-active");
  } else {
    document.querySelector(".cart").classList.remove("is-active");
  }
});
