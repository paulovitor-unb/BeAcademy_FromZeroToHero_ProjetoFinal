/* Page body */
const body = document.body;

/* Header */
const header = document.querySelector("header");
const navButton = document.querySelector("#nav-button");
const sectionLinks = document.querySelectorAll(".section-link");
const loginLinks = document.querySelectorAll(".login-link");

/* Main sections */
const sections = document.querySelectorAll("section");

/* CEP and Google Maps section */
const cepForm = document.querySelector("#cep-form");
const cepInput = document.querySelector("#cep");
const cepSearchButton = document.querySelector("#cep-search-button");
const cepAlert = document.querySelector("#cep-alert");
const mapsIframe = document.querySelector("#maps-iframe");

/* Contact section */
const contactForm = document.querySelector("#contact-form");
const contactFormInputs = document.querySelectorAll(
    "#contact-form .form-input"
);
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const messageInput = document.querySelector("#message");
const contactMessage = document.querySelector("#contact-message");

/*  */
const username = localStorage.getItem("username");

if (username) {
    loginLinks[0].innerText = username;
    loginLinks[1].innerText = "Sair";

    localStorage.clear();
}

/*  */
handleScrollY();

window.addEventListener("scroll", handleScrollY);

function handleScrollY() {
    changeHeaderStyleOnScrollY();
    highlightCurrentSection();
}

function changeHeaderStyleOnScrollY() {
    scrollY
        ? header.classList.add("scroll")
        : header.classList.remove("scroll");
}

function highlightCurrentSection() {
    const targetLine = scrollY + innerHeight / 2;

    for (let i = 0; i < sections.length; i++) {
        const sectionTop = sections[i].offsetTop;
        const sectionBottom = sectionTop + sections[i].offsetHeight;

        if (sectionTop <= targetLine && sectionBottom > targetLine) {
            sectionLinks[i].classList.add("highlight");
        } else {
            sectionLinks[i].classList.remove("highlight");
        }
    }
}

/*  */
navButton.addEventListener("click", openOrCloseNavigationMenuOnMobile);

sectionLinks.forEach((sectionLink) => {
    sectionLink.addEventListener("click", openOrCloseNavigationMenuOnMobile);
});

function openOrCloseNavigationMenuOnMobile() {
    if (window.innerWidth < 768) {
        body.classList.toggle("nav-bar-open");
        header.classList.toggle("nav-bar-open");
        navButton.classList.toggle("active");
    } else {
        body.classList.remove("nav-bar-open");
        header.classList.remove("nav-bar-open");
        navButton.classList.remove("active");
    }
}

/*  */
loginLinks.forEach((loginLink) => {
    loginLink.addEventListener("click", LogUserOutOrRedirectToLoginPage);
});

function LogUserOutOrRedirectToLoginPage(event) {
    username ? logUserOut(event) : redirectToLoginPage(event);
}

function logUserOut(event) {
    event.preventDefault();

    if (event.target.innerText !== username) localStorage.clear();

    window.location.reload();
}

function redirectToLoginPage(event) {
    localStorage.setItem(
        "isNewUser",
        event.target.innerText === "Cadastrar-se"
    );
}

/*  */
cepForm.addEventListener("submit", searchCEPAndUpdateMapsIframe);

async function searchCEPAndUpdateMapsIframe(event) {
    event.preventDefault();

    try {
        disableCEPSearchButton();
        checkIfCEPInputIsValid();
        const data = await searchCEP();
        const newMapsIframeSrc = getNewMapsIframeSrc(data);
        setNewMapsIframeSrc(newMapsIframeSrc);
        removeCEPAlertMessage();
        clearCEPInput();
    } catch (error) {
        showCEPAlertMessage(error.message);
    } finally {
        enableCEPSearchButton();
    }
}

function disableCEPSearchButton() {
    cepSearchButton.disabled = true;
    cepSearchButton.value = "Buscando...";
}

function checkIfCEPInputIsValid() {
    const cep = cepInput.value;
    const cepPattern = /^[0-9]{5}-[0-9]{3}$/;

    if (!cepPattern.test(cep)) {
        throw Error("CEP inválido!");
    }
}

async function searchCEP() {
    const cep = cepInput.value;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        return data;
    } catch {
        throw Error("Erro na busca do CEP!");
    }
}

function getNewMapsIframeSrc(data) {
    try {
        const logradouroToURL = data.logradouro.split(/[ /]/).join("+");
        const bairroToURL = data.bairro.split(/[ /]/).join("+");

        const newMapsIframeSrc = `https://maps.google.com/maps?hl=pt-br&ie=UTF8&output=embed&q=mercado+${logradouroToURL}+${bairroToURL}`;

        return newMapsIframeSrc;
    } catch {
        throw Error("CEP não encontrado!");
    }
}

function setNewMapsIframeSrc(newMapsIframeSrc) {
    mapsIframe.src = newMapsIframeSrc;
}

function removeCEPAlertMessage() {
    cepAlert.classList.remove("alert");
    cepAlert.innerText = "";
}

function clearCEPInput() {
    cepInput.value = "";
}

function showCEPAlertMessage(message) {
    cepAlert.classList.add("alert");
    cepAlert.innerText = message;
}

function enableCEPSearchButton() {
    cepSearchButton.disabled = false;
    cepSearchButton.value = "Buscar";
}

/*  */
cepInput.addEventListener("input", maskCEPInput);

function maskCEPInput() {
    cepInput.value = cepInput.value.replace(/[^0-9]/g, "");

    cepInput.value = cepInput.value.replace(/^(\d{5})(\d{3})(\d+)/, "$1-$2");
    cepInput.value = cepInput.value.replace(/^(\d{5})(\d)/, "$1-$2");
}

/*  */
contactForm.addEventListener("submit", validateFormAndSendMessage);

function validateFormAndSendMessage(event) {
    event.preventDefault();

    try {
        validateInputs();
        showContactSuccessMessage();
        clearContactFormInputs();
    } catch (error) {
        showContactAlertMessage(error.message);
    }
}

function validateInputs() {
    validateName();
    validateEmail();
    validatePhone();
    validateMessage();
}

function validateName() {
    const name = nameInput.value;
    if (!name) {
        throw Error("Nome não pode ser vazio!");
    }
}

function validateEmail() {
    const email = emailInput.value;
    const emailPattern = /[^ ]@[^ ]+\.[a-z]{2,3}$/i;
    if (!emailPattern.test(email)) {
        throw Error("Email inválido!");
    }
}

function validatePhone() {
    const phone = phoneInput.value;
    const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!phonePattern.test(phone)) {
        throw Error("Telefone inválido!");
    }
}

function validateMessage() {
    const message = messageInput.value;
    if (!message) {
        throw Error("Mensagem não pode ser vazia!");
    }
}

function showContactSuccessMessage() {
    const successMessage = "Mensagem enviada com sucesso!";

    contactMessage.classList.remove("alert");
    contactMessage.classList.add("success");
    contactMessage.innerText = successMessage;

    setInterval(() => {
        contactMessage.classList.remove("success");
        contactMessage.innerText = "";
    }, 3000);
}

function clearContactFormInputs() {
    contactFormInputs.forEach((contactFormInput) => {
        contactFormInput.value = "";
    });
}

function showContactAlertMessage(message) {
    contactMessage.classList.remove("success");
    contactMessage.classList.add("alert");
    contactMessage.innerText = message;
}

/*  */
phoneInput.addEventListener("input", maskPhoneInput);

function maskPhoneInput() {
    phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "");

    phoneInput.value = phoneInput.value.replace(
        /^(\d{2})(\d{5})(\d{4})(\d+)/,
        "($1) $2-$3"
    );
    phoneInput.value = phoneInput.value.replace(
        /^(\d{2})(\d{5})(\d)/,
        "($1) $2-$3"
    );
    phoneInput.value = phoneInput.value.replace(/^(\d{2})(\d)/, "($1) $2");
    phoneInput.value = phoneInput.value.replace(/^(\d)/, "($1");
}
