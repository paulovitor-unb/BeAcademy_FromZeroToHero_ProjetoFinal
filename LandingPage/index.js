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

    const menuButton = document.querySelector("#menu-button");
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
