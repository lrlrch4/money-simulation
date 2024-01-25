document.addEventListener("DOMContentLoaded", function() {
    // Mostrar la ventana emergente al cargar la página
    showPopup();
});

function showPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}
