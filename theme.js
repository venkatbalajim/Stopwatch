document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('themeToggle');

    themeToggle.addEventListener('change', function () {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
    });
});
