if (localStorage.getItem("isNewUser") === "true") loadSignupForm();

function loadSignupForm() {
    const switchFormButton = document.querySelector("#switch-form-button");

    switchFormBetweenLoginAndSignup({ target: switchFormButton });
}

setupEventListeners();

function setupEventListeners() {
    const form = document.querySelector("form");
    form.addEventListener("submit", validateFormAndLogUserIn);

    const showPasswordIcon = document.querySelector("#show-password-icon");
    showPasswordIcon.addEventListener("click", showOrHidePassword);
    showPasswordIcon.addEventListener("keypress", showOrHidePassword);

    const switchFormButton = document.querySelector("#switch-form-button");
    switchFormButton.addEventListener("click", switchFormBetweenLoginAndSignup);
}

function validateFormAndLogUserIn(event) {
    event.preventDefault();

    try {
        validateInputs();
        logUserIn();
        redirectToIndexPage();
    } catch (error) {
        showAlertMessage(error.message);
    }
}

function validateInputs() {
    validateUsername();
    validatePassword();
    validateEmail();
}

function validateUsername() {
    const username = document.querySelector("#username").value;

    if (!username) {
        throw Error("O nome de usuário não pode ser vazio!");
    }
}

function validatePassword() {
    const passwordLength = document.querySelector("#password").value.length;
    const minLength = 8;
    const maxLength = 16;

    if (passwordLength < minLength || passwordLength > maxLength) {
        throw Error(
            `A senha deve ter entre ${minLength} e ${maxLength} caracteres`
        );
    }
}

function validateEmail() {
    const emailInput = document.querySelector("#email");
    const emailPattern = /[^ ]@[^ ]+\.[a-z]{2,3}$/i;

    if (emailInput.required && !emailPattern.test(emailInput.value)) {
        throw Error("Email inválido!");
    }
}

function logUserIn() {
    const username = document.querySelector("#username").value;

    localStorage.clear();
    localStorage.setItem("username", username);
}

function redirectToIndexPage() {
    window.location = window.location.href.replace("login.html", "index.html");
}

function showAlertMessage(message) {
    const alertBlock = document.querySelector("#alert-block");
    const alertMessage = document.querySelector("#alert-message");

    alertBlock.classList.add("show");
    alertMessage.innerText = message;
}

function showOrHidePassword(event) {
    if (event.type === "click" || event.key === "Enter") {
        changeShowPasswordIcon(event.target);
        changePasswordInputType();
    }
}

function changeShowPasswordIcon(showPasswordIcon) {
    showPasswordIcon.classList.toggle("bi-square");
    showPasswordIcon.classList.toggle("bi-check-square");
}

function changePasswordInputType() {
    const passwordInput = document.querySelector("#password");

    passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
}

function switchFormBetweenLoginAndSignup(event) {
    showOrHideCollapsibleInput();
    changeTextsToMatchForm(event.target);
}

function showOrHideCollapsibleInput() {
    const collapsibleInput = document.querySelector(".collapse > input");

    collapsibleInput.parentElement.classList.toggle("show");
    collapsibleInput.required = !collapsibleInput.required;
    collapsibleInput.value = "";
}

function changeTextsToMatchForm(switchFormButton) {
    const submitFormButton = document.querySelector(
        "form > input[type='submit']"
    );
    [submitFormButton.value, switchFormButton.innerText] = [
        switchFormButton.innerText,
        submitFormButton.value,
    ];

    const footerText = document.querySelector("footer > p");
    footerText.innerText =
        footerText.innerText === "Novo por aqui?"
            ? "Já possui uma conta?"
            : "Novo por aqui?";
}
