/*document.addEventListener("DOMContentLoaded", function() {
    var breadcrumbs = document.getElementById("breadcrumbs");

    if (localStorage.getItem("breadcrumbs")) {
        breadcrumbs.innerHTML = localStorage.getItem("breadcrumbs");
    }

    var navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(function(link) {
        link.addEventListener("click", function(event) {
            console.log("Clicked link:", link.getAttribute("href"));
            breadcrumbs.innerHTML = "";

            var homeCrumb = document.createElement("a");
            homeCrumb.textContent = "Home";
            homeCrumb.href = "index.html";
            breadcrumbs.appendChild(homeCrumb);
            breadcrumbs.innerHTML += " > ";

            if (link.getAttribute("href") === "Checkout.html") {
                var cartCrumb = document.createElement("a");
                cartCrumb.classList.add('nav-link');
                cartCrumb.textContent = "Cart";
                cartCrumb.href = "Cart.html"; 
                breadcrumbs.appendChild(cartCrumb);
                breadcrumbs.innerHTML += " > ";

                var checkoutCrumb = document.createElement("span");
                checkoutCrumb.textContent = "Checkout";
                breadcrumbs.appendChild(checkoutCrumb);
            } else {
                var currentPageCrumb = document.createElement("span");
                currentPageCrumb.textContent = link.textContent;
                breadcrumbs.appendChild(currentPageCrumb);
            }
            localStorage.setItem("breadcrumbs", breadcrumbs.innerHTML);
        });
    });
});*/

document.addEventListener('DOMContentLoaded', function() {
    const productNameElement = document.getElementById('productName');
    const storedProductName = localStorage.getItem('productName');
    if (productNameElement && storedProductName) {
        productNameElement.textContent = storedProductName;
    }
});


/*document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("loading").style.display = "block";
        document.getElementById("loading-screen").style.transition = "transition: 0.5s  ease-in-out";
    }, 1000); // Change the time (in milliseconds) as needed
});*/

/*document.addEventListener("DOMContentLoaded", function() {
    var acc = document.getElementsByClassName("accordion");
    var i;
     for(i=0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        this.parentElement.classList.toggle("active");

        var panel = this.nextElementSibling;

        if(panel.style.display === "block"){
            panel.style.display ="none";
        }
        else{
            panel.style.display ="block";
        }
     })
    }
});*/



document.addEventListener("DOMContentLoaded", function() {
    const bar = document.getElementById('bar');
    const nav = document.getElementById('navbar');
    const close = document.getElementById('close');

    if (bar) {
        bar.addEventListener("click", function() {
            nav.classList.add("active");
        });
    }
    if (close) {
        close.addEventListener("click", function() {
            nav.classList.remove("active");
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");
    const sign_in_btn2 = document.querySelector("#sign-in-btn2");
    const sign_up_btn2 = document.querySelector("#sign-up-btn2");
    sign_up_btn.addEventListener("click", () => {
        container.classList.add("sign-up-mode");
    });
    sign_in_btn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
    });
    sign_up_btn2.addEventListener("click", () => {
        container.classList.add("sign-up-mode2");
    });
    sign_in_btn2.addEventListener("click", () => {
        container.classList.remove("sign-up-mode2");
    })
});

document.addEventListener('DOMContentLoaded', () => {
    const hero = document.getElementById('hero');
    const images = [
        '../AgriPic/backgrounds/bg7.png',
        '../AgriPic/backgrounds/bg5.png',
        '../AgriPic/backgrounds/bg2.png',
        '../AgriPic/backgrounds/bg6.png'
    ];
    let currentImageIndex = 0;

    function changeBackgroundImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        hero.style.backgroundImage = `url('${images[currentImageIndex]}')`;
    }

    hero.style.backgroundImage = `url('${images[currentImageIndex]}')`;

    setInterval(changeBackgroundImage, 6000); 
    hero.style.animation = 'slideshow 8s ease-in-out infinite'; 
});



function displaySuccessMessage() {
    const successModal = document.getElementById('successModal');
    successModal.style.display = 'block';

    const successCloseBtn = successModal.querySelector('.close');
    successCloseBtn.addEventListener('click', () => {
        successModal.style.display = 'none';
    });
}

function displayErrorMessage(message) {
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.textContent = message;

    const errorModal = document.getElementById('errorModal');
    errorModal.style.display = 'flex';

    const closeBtn = errorModal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        errorModal.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    const scrollDownBtn = document.getElementById('scrollDownBtn');

    const header = document.getElementById('scroll');
    const footer = document.getElementById('footer');

    scrollUpBtn.addEventListener('click', () => {
        header.scrollIntoView({ behavior: 'smooth' });
    });

    scrollDownBtn.addEventListener('click', () => {
        footer.scrollIntoView({ behavior: 'smooth' });
    });
});

  
document.addEventListener('DOMContentLoaded', function() {
    const previewLink = document.querySelector('.preview-link');

    previewLink.addEventListener('click', function(event) {
        event.preventDefault(); 
        const linkURL = this.getAttribute('href');
        
        alert('Opening the link in a new window.');

        window.open(linkURL, '_blank');
    });
});

document.addEventListener('DOMContentLoaded', function () {
   
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    function handleScroll() {
        const sections = document.querySelectorAll('.transform');
        
        sections.forEach(section => {
            if (isInViewport(section)) {
                section.classList.add('visible');
            }
        });
    }
    window.addEventListener('scroll', handleScroll);
});

document.addEventListener('DOMContentLoaded', () => {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            tabLinks.forEach(link => link.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(link.getAttribute('data-tab')).classList.add('active');
        });
    });

    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
});








  














