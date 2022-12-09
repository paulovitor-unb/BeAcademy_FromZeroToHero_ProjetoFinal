if (localStorage.getItem("username")) loadUsername();

function loadUsername() {
    const username = localStorage.getItem("username");
    const loginLinks = document.querySelectorAll(
        "#menu a[href='./login.html']"
    );

    loginLinks[0].innerText = username;
    loginLinks[1].innerText = "Sair";
}

changeHeaderStyleOnScrollY();

function changeHeaderStyleOnScrollY() {
    const header = document.querySelector("header");

    scrollY
        ? header.classList.add("scroll")
        : header.classList.remove("scroll");
}

setupEventListeners();

function setupEventListeners() {
    window.addEventListener("scroll", changeHeaderStyleOnScrollY);

    const menuButton = document.querySelector("#nav-menu-button");
    menuButton.addEventListener("click", openOrCloseNavigationMenuOnMobile);

    const sectionLinks = document.querySelectorAll(".section-link");
    for (let sectionLink of sectionLinks) {
        sectionLink.addEventListener(
            "click",
            openOrCloseNavigationMenuOnMobile
        );
    }

    const loginLinks = document.querySelectorAll(
        "#menu a[href='./login.html']"
    );
    for (let loginLink of loginLinks) {
        loginLink.addEventListener("click", LogUserOutOrRedirectToLoginPage);
    }

    const cepForm = document.querySelector("#search-cep form");
    cepForm.addEventListener("submit", searchCEPToUpdateMapsIframe);

    const cepInput = document.querySelector("#cep");
    cepInput.addEventListener("input", maskCEPInput);

    const contactForm = document.querySelector("#contact-form");
    contactForm.addEventListener("submit", validateFormAndSendMessage);

    const phoneInput = document.querySelector("#phone");
    phoneInput.addEventListener("input", maskPhoneInput);
}

function openOrCloseNavigationMenuOnMobile() {
    const body = document.querySelector("body");
    body.classList.toggle("menu-open");

    const header = document.querySelector("header");
    header.classList.toggle("menu-open");

    const menuButton = document.querySelector("#menu-button");
    menuButton.classList.toggle("active");
}

function LogUserOutOrRedirectToLoginPage(event) {
    localStorage.getItem("username")
        ? logUserOut(event)
        : redirectToLoginPage(event);
}

function logUserOut(event) {
    event.preventDefault();

    if (event.target.innerText !== localStorage.getItem("username"))
        localStorage.clear();

    window.location.reload();
}

function redirectToLoginPage(event) {
    localStorage.setItem(
        "isNewUser",
        event.target.innerText === "Cadastrar-se"
    );
}

async function searchCEPToUpdateMapsIframe(event) {
    event.preventDefault();

    try {
        checkIfCEPInputIsValid();
        const data = await searchCEP();
        const newMapsIframeSrc = getNewMapsIframeSrc(data);
        setNewMapsIframeSrc(newMapsIframeSrc);
    } catch (error) {
        alert(error.message);
    }
}

function checkIfCEPInputIsValid() {
    const cep = document.querySelector("#cep").value;
    const cepPattern = /^[0-9]{5}-[0-9]{3}$/;

    if (!cepPattern.test(cep)) {
        throw Error("CEP inválido!");
    }
}

async function searchCEP() {
    const cep = document.querySelector("#cep").value;

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
    const iframeMaps = document.querySelector("iframe");

    iframeMaps.src = newMapsIframeSrc;
}

function maskCEPInput(event) {
    const cepInput = event.target;

    cepInput.value = cepInput.value.replace(/[^0-9]/g, "");
    cepInput.value = cepInput.value.replace(/^(\d{5})(\d)/, "$1-$2");
}

function validateFormAndSendMessage(event) {
    event.preventDefault();

    try {
        validateInputs();
        alert("Mensagem enviada com sucesso!");
    } catch (error) {
        alert(error.message);
    }
}

function validateInputs() {
    validateName();
    validateEmail();
    validatePhone();
    validateMessage();
}

function validateName() {
    const name = document.querySelector("#name").value;
    if (!name) {
        throw Error("Nome não pode ser vazio!");
    }
}

function validateEmail() {
    const email = document.querySelector("#email").value;
    const emailPattern = /[^ ]@[^ ]+\.[a-z]{2,3}$/i;
    if (!emailPattern.test(email)) {
        throw Error("Email inválido!");
    }
}

function validatePhone() {
    const phone = document.querySelector("#phone").value;
    const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!phonePattern.test(phone)) {
        throw Error("Telefone inválido!");
    }
}

function validateMessage() {
    const message = document.querySelector("#message").value;
    if (!message) {
        throw Error("Mensagem não pode ser vazia!");
    }
}

function maskPhoneInput(event) {
    const phoneInput = event.target;

    phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "");

    phoneInput.value = phoneInput.value.replace(
        /^(\d{2})(\d{5})(\d)/,
        "($1) $2-$3"
    );
    phoneInput.value = phoneInput.value.replace(/^(\d{2})(\d)/, "($1) $2");
    phoneInput.value = phoneInput.value.replace(/^(\d)/, "($1");
}
