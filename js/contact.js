document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const fname = document.getElementById('fname');
    const lname = document.getElementById('lname');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    const STORAGE_KEY = 'contactFormData';

    function loadSavedData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            fname.value = data.fname || '';
            lname.value = data.lname || '';
            email.value = data.email || '';
            message.value = data.message || '';
        }
    }

    function saveData() {
        const data = {
            fname: fname.value,
            lname: lname.value,
            email: email.value,
            message: message.value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    [fname, lname, email, message].forEach(function (input) {
        input.addEventListener('input', saveData);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        saveData();

        alert('The message has been sent successfully!');
        localStorage.removeItem(STORAGE_KEY);
        form.reset();
    });

    loadSavedData();
});