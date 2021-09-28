"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn_close-modal");
const btnsOpenModal = document.querySelectorAll(".btn_show-modal");
const btnScrollTo = document.querySelector(".btn_scroll-to");
const section1 = document.querySelector("#section_1");
const tabs = document.querySelectorAll(".operations_tab");
const tabsContainer = document.querySelector(".operations_container");
const tabsContent = document.querySelectorAll(".operation_content");
const nav = document.querySelector(".nav");
const navHeight = nav.getBoundingClientRect().height;
const header = document.querySelector(".header");
const allSections = document.querySelectorAll(".section");
const slides = document.querySelectorAll(".slide");
const btnRight = document.querySelector(".slider_btn-right");
const btnLeft = document.querySelector(".slider_btn-left");
const dotContainer = document.querySelector(".dots");

//Revealing sections
const revealSection = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section_hidden");
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section_hidden");
});

//Sticky Navigation
const stickyNav = function (entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      nav.classList.add("sticky");
    } else nav.classList.remove("sticky");
  });
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Menu Fade Animation
function hoverOnLinks(e, opacity) {
  if (e.target.classList.contains("nav_link")) {
    const link = e.target;
    const siblings = link.closest("nav").querySelectorAll(".nav_link");
    const logo = link.closest("nav").querySelector(".nav_logo");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = opacity;
    });

    logo.style.opacity = opacity;
  }
}

nav.addEventListener("mouseover", function (e) {
  hoverOnLinks(e, 0.5);
});

nav.addEventListener("mouseout", function (e) {
  hoverOnLinks(e, 1);
});

//To open and close modal
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//Page Navigation
btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

//using Event Delegation
document.querySelector(".nav_lists").addEventListener("click", function (e) {
  e.preventDefault();
  //e.target - is returns the html component you click on
  if (e.target.classList.contains("nav_link")) {
    const sections = e.target.getAttribute("href");
    document.querySelector(sections).scrollIntoView({ behavior: "smooth" });
  }
});

//Tabbed Component
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations_tab");
  if (!clicked) return;

  //Remove active classes
  tabs.forEach((tab) => tab.classList.remove("operation_tab-active"));
  tabsContent.forEach((content) =>
    content.classList.remove("operation_content-active")
  );

  //Activate a tab
  clicked.classList.add("operation_tab-active");

  //Display content
  document
    .querySelector(`.operation_content-${clicked.getAttribute("number")}`)
    .classList.add("operation_content-active");
});

//Lazy Loading images
const targetImages = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.getAttribute("data-src");

    entry.target.addEventListener("load", function (e) {
      entry.target.classList.remove("lazy_img");
    });

    observer.unobserve(entry.target);
  });
};

const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

targetImages.forEach((img) => imageObserver.observe(img));

//Sliders
let curSlide = 0;
const maxSlides = slides.length;

function goToSlides(slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
}

function nextSlide() {
  if (curSlide === maxSlides - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlides(curSlide);
  activateDot(curSlide);
}

function previousSlide() {
  if (curSlide === 0) {
    curSlide = maxSlides - 1;
  } else {
    curSlide--;
  }
  goToSlides(curSlide);
  activateDot(curSlide);
}

const createDots = function () {
  slides.forEach((s, i) => {
    const html = `<button class="dots_dot" data-slide="${i}"></button>`;
    dotContainer.insertAdjacentHTML("beforeend", html);
  });
};

const activateDot = function (slide) {
  document.querySelectorAll(".dots_dot").forEach((dot) => {
    dot.classList.remove("dots_dot--active");
  });

  document
    .querySelector(`.dots_dot[data-slide="${slide}`)
    .classList.add("dots_dot--active");
};

const init = function () {
  createDots();
  activateDot(curSlide);
  goToSlides(curSlide);
};

init();

btnRight.addEventListener("click", nextSlide);

btnLeft.addEventListener("click", previousSlide);

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") nextSlide();

  if (e.key === "ArrowLeft") previousSlide();
});

dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots_dot")) {
    const slide = e.target.getAttribute("data-slide");
    goToSlides(slide);
    activateDot(slide);
  }
});

//DOMContentLoaded
document.addEventListener("DOMContentLoaded", function (e) {
  console.log("HTML parsed and DOM tree built!", e);
});

//Windows load - this occurs after the html has loaded
window.addEventListener("load", function (e) {
  console.log("Page fully loaded", e);
});

//Windows beforeunload - it let you know that you are leaving the page .
// window.addEventListener("beforeunload", function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = "";
// });
