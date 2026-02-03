document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").textContent = new Date().getFullYear();
});

function openEndpoint(endpoint) {
    window.open(endpoint, '_blank');
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    document.querySelector('.navbar').classList.toggle('dark-theme');
    document.querySelectorAll('.card').forEach(card => card.classList.toggle('dark-theme'));
    document.querySelectorAll('.card-header').forEach(header => header.classList.toggle('dark-theme'));
    document.querySelector('.footer').classList.toggle('dark-theme');
}
