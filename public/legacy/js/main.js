/* -------------------------------------------

Name: 		Ruizarch
Version:    1.0
Developer:	Nazar Miller (millerDigitalDesign)
Portfolio:  https://themeforest.net/user/millerdigitaldesign/portfolio?ref=MillerDigitalDesign

p.s. I am available for Freelance hire (UI design, web development). email: miller.themes@gmail.com

------------------------------------------- */

$(function () {
  "use strict";

  /***************************

    swup

    ***************************/
  const options = {
    containers: ["#swupMain", "#swupMenu"],
    animateHistoryBrowsing: true,
    linkSelector: "a:not([data-no-swup])",
    animationSelector: '[class="mil-main-transition"]',
  };
  const swup = new Swup(options);

  /***************************

    register gsap plugins

    ***************************/
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  /***************************

    smooth scroll

    ***************************/

  // Smooth scrolling handled via GSAP ScrollTo in smooth-anchors.js
  window.smoothScroll = null;
  /***************************

    color variables

    ***************************/

  var accent = "#F0B265"; // Updated accent
  var dark = "#000";
  var light = "#fff";

  /***************************

    preloader
    
    ***************************/

  var timeline = gsap.timeline();

  timeline.to(".mil-preloader-animation", {
    opacity: 1,
  });

  timeline.fromTo(
    ".mil-animation-1 .mil-h3",
    {
      y: "30px",
      opacity: 0,
    },
    {
      y: "0px",
      opacity: 1,
      stagger: 0.4,
    }
  );

  timeline.to(
    ".mil-animation-1 .mil-h3",
    {
      opacity: 0,
      y: "-30",
    },
    "+=.3"
  );

  timeline.fromTo(
    ".mil-reveal-box",
    0.1,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      x: "-30",
    }
  );

  timeline.to(
    ".mil-reveal-box",
    0.45,
    {
      width: "100%",
      x: 0,
    },
    "+=.1"
  );
  timeline.to(".mil-reveal-box", {
    right: "0",
  });
  timeline.to(".mil-reveal-box", 0.3, {
    width: "0%",
  });
  timeline.fromTo(
    ".mil-animation-2 .mil-h3",
    {
      opacity: 0,
    },
    {
      opacity: 1,
    },
    "-=.5"
  );
  timeline.to(
    ".mil-animation-2 .mil-h3",
    0.6,
    {
      opacity: 0,
      y: "-30",
    },
    "+=.5"
  );
  timeline.to(
    ".mil-preloader",
    0.8,
    {
      opacity: 0,
      ease: "sine",
    },
    "+=.2"
  );
  timeline.fromTo(
    ".mil-up",
    0.8,
    {
      opacity: 0,
      y: 40,
      scale: 0.98,
      ease: "sine",
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      onComplete: function () {
        $(".mil-preloader").addClass("mil-hidden");
      },
    },
    "-=1"
  );
  /***************************

    append

    ***************************/
  $(document).ready(function () {
    $(".mil-arrow").clone().appendTo(".mil-arrow-place");
    $(".mil-dodecahedron").clone().appendTo(".mil-animation");
    $(".mil-lines").clone().appendTo(".mil-lines-place");
    $(".mil-main-menu ul li.mil-active > a")
      .clone()
      .appendTo(".mil-current-page");
  });
  /***************************

    accordion

    ***************************/

  let groups = gsap.utils.toArray(".mil-accordion-group");
  let menus = gsap.utils.toArray(".mil-accordion-menu");
  let menuToggles = groups.map(createAnimation);

  menus.forEach((menu) => {
    menu.addEventListener("click", () => toggleMenu(menu));
  });

  function toggleMenu(clickedMenu) {
    menuToggles.forEach((toggleFn) => toggleFn(clickedMenu));
  }

  function createAnimation(element) {
    let menu = element.querySelector(".mil-accordion-menu");
    let box = element.querySelector(".mil-accordion-content");
    let symbol = element.querySelector(".mil-symbol");
    let minusElement = element.querySelector(".mil-minus");
    let plusElement = element.querySelector(".mil-plus");

    gsap.set(box, {
      height: "auto",
    });

    let animation = gsap
      .timeline()
      .from(box, {
        height: 0,
        duration: 0.4,
        ease: "sine",
      })
      .from(
        minusElement,
        {
          duration: 0.4,
          autoAlpha: 0,
          ease: "none",
        },
        0
      )
      .to(
        plusElement,
        {
          duration: 0.4,
          autoAlpha: 0,
          ease: "none",
        },
        0
      )
      .to(
        symbol,
        {
          background: accent,
          ease: "none",
        },
        0
      )
      .reverse();

    return function (clickedMenu) {
      if (clickedMenu === menu) {
        animation.reversed(!animation.reversed());
      } else {
        animation.reverse();
      }
    };
  }
  /***************************

    back to top

    ***************************/
  const btt = document.querySelector(".mil-back-to-top .mil-link");

  gsap.set(btt, {
    x: -30,
    opacity: 0,
  });

  gsap.to(btt, {
    x: 0,
    opacity: 1,
    ease: "sine",
    scrollTrigger: {
      trigger: "body",
      start: "top -40%",
      end: "top -40%",
      toggleActions: "play none reverse none",
    },
  });
  /***************************

    cursor

    ***************************/
  const cursor = document.querySelector(".mil-ball");

  gsap.set(cursor, {
    xPercent: -50,
    yPercent: -50,
  });

  document.addEventListener("pointermove", movecursor, { passive: true });

  function movecursor(e) {
    gsap.to(cursor, {
      duration: 0.6,
      ease: "sine",
      x: e.clientX,
      y: e.clientY,
    });
  }

  $(".mil-drag, .mil-more, .mil-choose").mouseover(function () {
    gsap.to($(cursor), 0.2, {
      width: 90,
      height: 90,
      opacity: 1,
      ease: "sine",
    });
  });

  $(".mil-drag, .mil-more, .mil-choose").mouseleave(function () {
    gsap.to($(cursor), 0.2, {
      width: 20,
      height: 20,
      opacity: 0.1,
      ease: "sine",
    });
  });

  $(".mil-accent-cursor").mouseover(function () {
    console.log("Cursor hover - adding mil-accent class");

    // Check for multiple cursor elements
    var allCursors = document.querySelectorAll(".mil-ball");
    console.log("Number of cursor elements found:", allCursors.length);

    // Apply to all cursor elements
    allCursors.forEach(function (cursorElement) {
      cursorElement.classList.add("mil-accent");
      cursorElement.setAttribute(
        "style",
        "--bs-orange: #00ff00 !important; background-color: #00ff00 !important; background: #00ff00 !important; color: #00ff00 !important; border-color: #00ff00 !important; outline-color: #00ff00 !important;"
      );
    });

    console.log("Cursor background set to:", accent);

    // Debug: Check computed style
    setTimeout(function () {
      var computedStyle = window.getComputedStyle(cursor);
      console.log("Computed background-color:", computedStyle.backgroundColor);
      console.log("Computed background:", computedStyle.background);
      console.log("Inline style:", cursor.style.backgroundColor);
      console.log(
        "Bootstrap orange variable:",
        computedStyle.getPropertyValue("--bs-orange")
      );

      // Check all cursor elements
      allCursors.forEach(function (cursorElement, index) {
        var style = window.getComputedStyle(cursorElement);
        console.log("Cursor " + index + " background:", style.backgroundColor);
      });
    }, 100);
  });

  $(".mil-accent-cursor").mouseleave(function () {
    console.log("Cursor leave - removing mil-accent class");
    $(cursor).removeClass("mil-accent");
    $(cursor).css("background-color", dark);
    $(cursor).css("background", dark);

    // Ensure accent color is preserved after GSAP animations
    setTimeout(function () {
      $(cursor).css("background-color", dark);
      $(cursor).css("background", dark);
    }, 250);
  });

  $(".mil-drag").mouseover(function () {
    gsap.to($(".mil-ball .mil-icon-1"), 0.2, {
      scale: "1",
      ease: "sine",
    });
  });

  $(".mil-drag").mouseleave(function () {
    gsap.to($(".mil-ball .mil-icon-1"), 0.2, {
      scale: "0",
      ease: "sine",
    });
  });

  $(".mil-more").mouseover(function () {
    // Disable GSAP animation to prevent color conflicts
    $(".mil-ball .mil-more-text").css("transform", "scale(1)");
  });

  $(".mil-more").mouseleave(function () {
    // Disable GSAP animation to prevent color conflicts
    $(".mil-ball .mil-more-text").css("transform", "scale(0)");
  });

  $(".mil-choose").mouseover(function () {
    // Disable GSAP animation to prevent color conflicts
    $(".mil-ball .mil-choose-text").css("transform", "scale(1)");
  });

  $(".mil-choose").mouseleave(function () {
    // Disable GSAP animation to prevent color conflicts
    $(".mil-ball .mil-choose-text").css("transform", "scale(0)");
  });

  $(
    'a:not(".mil-choose , .mil-more , .mil-drag , .mil-accent-cursor"), input , textarea, .mil-accordion-menu'
  ).mouseover(function () {
    // Disable GSAP animation to prevent color conflicts
    $(cursor).css("transform", "scale(0)");
    $(".mil-ball svg").css("transform", "scale(0)");
  });

  $(
    'a:not(".mil-choose , .mil-more , .mil-drag , .mil-accent-cursor"), input, textarea, .mil-accordion-menu'
  ).mouseleave(function () {
    // Disable GSAP animation to prevent color conflicts
    $(cursor).css("transform", "scale(1)");
    $(".mil-ball svg").css("transform", "scale(1)");

    // Ensure cursor color is preserved
    if (!$(cursor).hasClass("mil-accent")) {
      $(cursor).css("background-color", dark);
      $(cursor).css("background", dark);
    }
  });

  $("body").mousedown(function () {
    // Disable GSAP animation to prevent color conflicts
    $(cursor).css("transform", "scale(0.1)");
  });
  $("body").mouseup(function () {
    // Disable GSAP animation to prevent color conflicts
    $(cursor).css("transform", "scale(1)");
  });
  /***************************

     menu

    ***************************/
  $(".mil-menu-btn").on("click", function () {
    $(".mil-menu-btn").toggleClass("mil-active");
    $(".mil-menu").toggleClass("mil-active");
    $(".mil-menu-frame").toggleClass("mil-active");
  });
  /***************************

    main menu

    ***************************/
  $(".mil-has-children > a").on("click", function (e) {
    e.preventDefault();
    var $currentDropdown = $(this).next();
    var $currentLink = $(this);

    // Close other dropdowns
    $(".mil-has-children ul").not($currentDropdown).removeClass("mil-active");
    $(".mil-has-children a").not($currentLink).removeClass("mil-active");

    // Toggle current dropdown
    $currentLink.toggleClass("mil-active");
    $currentDropdown.toggleClass("mil-active");
  });
  /***************************

    progressbar

    ***************************/
  if (document.querySelector(".mil-progress")) {
    gsap.to(".mil-progress", {
      height: "100%",
      ease: "sine",
      scrollTrigger: {
        scrub: 0.3,
      },
    });
  }
  /***************************

    scroll animations

    ***************************/

  const appearance = document.querySelectorAll(".mil-up");

  appearance.forEach((section) => {
    gsap.fromTo(
      section,
      {
        opacity: 0,
        y: 40,
        scale: 0.98,
        ease: "sine",
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        scrollTrigger: {
          trigger: section,
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  const scaleImage = document.querySelectorAll(".mil-scale");

  scaleImage.forEach((section) => {
    var value1 = $(section).data("value-1");
    var value2 = $(section).data("value-2");
    gsap.fromTo(
      section,
      {
        ease: "sine",
        scale: value1,
      },
      {
        scale: value2,
        scrollTrigger: {
          trigger: section,
          scrub: true,
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  const parallaxImage = document.querySelectorAll(".mil-parallax");

  if ($(window).width() > 960) {
    parallaxImage.forEach((section) => {
      var value1 = $(section).data("value-1");
      var value2 = $(section).data("value-2");
      gsap.fromTo(
        section,
        {
          ease: "sine",
          y: value1,
        },
        {
          y: value2,
          scrollTrigger: {
            trigger: section,
            scrub: true,
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }

  const rotate = document.querySelectorAll(".mil-rotate");

  rotate.forEach((section) => {
    var value = $(section).data("value");
    gsap.fromTo(
      section,
      {
        ease: "sine",
        rotate: 0,
      },
      {
        rotate: value,
        scrollTrigger: {
          trigger: section,
          scrub: true,
          toggleActions: "play none none reverse",
        },
      }
    );
  });
  /***************************

    fancybox

    ***************************/
  $('[data-fancybox="gallery"]').fancybox({
    buttons: ["slideShow", "zoom", "fullScreen", "close"],
    loop: false,
    protect: true,
  });
  $.fancybox.defaults.hash = false;
  /***************************

    reviews slider

    ***************************/

  var menu = [
    '<div class="mil-custom-dot mil-slide-1"></div>',
    '<div class="mil-custom-dot mil-slide-2"></div>',
    '<div class="mil-custom-dot mil-slide-3"></div>',
    '<div class="mil-custom-dot mil-slide-4"></div>',
    '<div class="mil-custom-dot mil-slide-5"></div>',
    '<div class="mil-custom-dot mil-slide-6"></div>',
    '<div class="mil-custom-dot mil-slide-7"></div>',
  ];
  var mySwiper = new Swiper(".mil-reviews-slider", {
    // If we need pagination
    pagination: {
      el: ".mil-revi-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + menu[index] + "</span>";
      },
    },
    speed: 800,
    effect: "fade",
    parallax: true,
    navigation: {
      nextEl: ".mil-revi-next",
      prevEl: ".mil-revi-prev",
    },
  });

  /***************************

    infinite slider

    ***************************/
  var swiper = new Swiper(".mil-infinite-show", {
    slidesPerView: "auto",
    spaceBetween: 40,
    speed: 5000,
    autoplay: true,
    autoplay: {
      delay: 0,
    },
    loop: true,
    freeMode: true,
    breakpoints: {
      992: {
        slidesPerView: "auto",
        spaceBetween: 40,
      },
    },
  });

  /***************************

    portfolio slider

    ***************************/
  var swiper = new Swiper(".mil-portfolio-slider", {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 800,
    parallax: true,
    mousewheel: {
      enable: true,
    },
    navigation: {
      nextEl: ".mil-portfolio-next",
      prevEl: ".mil-portfolio-prev",
    },
    pagination: {
      el: ".swiper-portfolio-pagination",
      type: "fraction",
    },
  });
  /***************************

    1 item slider

    ***************************/
  var swiper = new Swiper(".mil-1-slider", {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 800,
    parallax: true,
    navigation: {
      nextEl: ".mil-portfolio-next",
      prevEl: ".mil-portfolio-prev",
    },
    pagination: {
      el: ".swiper-portfolio-pagination",
      type: "fraction",
    },
  });
  /***************************

    2 item slider

    ***************************/
  var swiper = new Swiper(".mil-2-slider", {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 800,
    parallax: true,
    navigation: {
      nextEl: ".mil-portfolio-next",
      prevEl: ".mil-portfolio-prev",
    },
    pagination: {
      el: ".swiper-portfolio-pagination",
      type: "fraction",
    },
    breakpoints: {
      992: {
        slidesPerView: 2,
      },
    },
  });

  /*----------------------------------------------------------
    ------------------------------------------------------------

    REINIT

    ------------------------------------------------------------
    ----------------------------------------------------------*/
  document.addEventListener("swup:contentReplaced", function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      0
    );

    if (document.querySelector(".mil-progress")) {
      gsap.to(".mil-progress", {
        height: 0,
        ease: "sine",
        onComplete: () => {
          ScrollTrigger.refresh();
        },
      });
    } else {
      ScrollTrigger.refresh();
    }
    /***************************

         menu

        ***************************/
    $(".mil-menu-btn").removeClass("mil-active");
    $(".mil-menu").removeClass("mil-active");
    $(".mil-menu-frame").removeClass("mil-active");
    /***************************

        append

        ***************************/
    $(document).ready(function () {
      $(
        ".mil-arrow-place .mil-arrow, .mil-animation .mil-dodecahedron, .mil-current-page a"
      ).remove();
      $(".mil-arrow").clone().appendTo(".mil-arrow-place");
      $(".mil-dodecahedron").clone().appendTo(".mil-animation");
      $(".mil-lines").clone().appendTo(".mil-lines-place");
      $(".mil-main-menu ul li.mil-active > a")
        .clone()
        .appendTo(".mil-current-page");
    });
    /***************************

        accordion

        ***************************/

    let groups = gsap.utils.toArray(".mil-accordion-group");
    let menus = gsap.utils.toArray(".mil-accordion-menu");
    let menuToggles = groups.map(createAnimation);

    menus.forEach((menu) => {
      menu.addEventListener("click", () => toggleMenu(menu));
    });

    function toggleMenu(clickedMenu) {
      menuToggles.forEach((toggleFn) => toggleFn(clickedMenu));
    }

    function createAnimation(element) {
      let menu = element.querySelector(".mil-accordion-menu");
      let box = element.querySelector(".mil-accordion-content");
      let symbol = element.querySelector(".mil-symbol");
      let minusElement = element.querySelector(".mil-minus");
      let plusElement = element.querySelector(".mil-plus");

      gsap.set(box, {
        height: "auto",
      });

      let animation = gsap
        .timeline()
        .from(box, {
          height: 0,
          duration: 0.4,
          ease: "sine",
        })
        .from(
          minusElement,
          {
            duration: 0.4,
            autoAlpha: 0,
            ease: "none",
          },
          0
        )
        .to(
          plusElement,
          {
            duration: 0.4,
            autoAlpha: 0,
            ease: "none",
          },
          0
        )
        .to(
          symbol,
          {
            background: accent,
            ease: "none",
          },
          0
        )
        .reverse();

      return function (clickedMenu) {
        if (clickedMenu === menu) {
          animation.reversed(!animation.reversed());
        } else {
          animation.reverse();
        }
      };
    }

    /***************************

        cursor

        ***************************/

    $(".mil-drag, .mil-more, .mil-choose").mouseover(function () {
      gsap.to($(cursor), 0.2, {
        width: 90,
        height: 90,
        opacity: 1,
        ease: "sine",
      });
    });

    $(".mil-drag, .mil-more, .mil-choose").mouseleave(function () {
      gsap.to($(cursor), 0.2, {
        width: 20,
        height: 20,
        opacity: 0.1,
        ease: "sine",
      });
    });

    $(".mil-accent-cursor").mouseover(function () {
      console.log("Cursor hover - adding mil-accent class");

      // Check for multiple cursor elements
      var allCursors = document.querySelectorAll(".mil-ball");
      console.log("Number of cursor elements found:", allCursors.length);

      // Apply to all cursor elements
      allCursors.forEach(function (cursorElement) {
        cursorElement.classList.add("mil-accent");
        cursorElement.setAttribute(
          "style",
          "--bs-orange: " +
            accent +
            " !important; background-color: " +
            accent +
            " !important; background: " +
            accent +
            " !important; color: " +
            accent +
            " !important; border-color: " +
            accent +
            " !important; outline-color: " +
            accent +
            " !important;"
        );

        // Target inner elements specifically
        var innerElements = cursorElement.querySelectorAll(
          ".mil-more-text, .mil-choose-text, .mil-icon-1, .mil-icon-1 svg"
        );
        innerElements.forEach(function (innerElement) {
          if (
            innerElement.classList.contains("mil-more-text") ||
            innerElement.classList.contains("mil-choose-text")
          ) {
            // Text elements - accent background, white text, keep within bounds, center text
            innerElement.setAttribute(
              "style",
              "background-color: " +
                accent +
                " !important; background: " +
                accent +
                " !important; color: #ffffff !important; border-color: " +
                accent +
                " !important; outline-color: " +
                accent +
                " !important; opacity: 1 !important; visibility: visible !important; display: flex !important; align-items: center !important; justify-content: center !important; text-align: center !important; width: 100% !important; height: 100% !important; max-width: 100% !important; max-height: 100% !important; overflow: hidden !important; border-radius: 50% !important; box-sizing: border-box !important;"
            );
          } else {
            // Icon elements - accent background, white fill
            innerElement.setAttribute(
              "style",
              "background-color: " +
                accent +
                " !important; background: " +
                accent +
                " !important; color: #ffffff !important; border-color: " +
                accent +
                " !important; outline-color: " +
                accent +
                " !important; fill: #ffffff !important;"
            );
          }
        });
      });

      console.log("Cursor background set to:", accent);

      // Continuous monitoring to prevent orange color
      var monitorInterval = setInterval(function () {
        if ($(cursor).hasClass("mil-accent")) {
          var computedStyle = window.getComputedStyle(cursor);
          var bgColor = computedStyle.backgroundColor;
          if (
            bgColor.includes("255") ||
            bgColor.includes("orange") ||
            bgColor.includes("fd7e14")
          ) {
            console.log("Orange detected, fixing...");
            $(cursor).css("background-color", accent);
            $(cursor).css("background", accent);
          }
        } else {
          clearInterval(monitorInterval);
        }
      }, 50);

      // Debug: Check computed style
      setTimeout(function () {
        var computedStyle = window.getComputedStyle(cursor);
        console.log(
          "Computed background-color:",
          computedStyle.backgroundColor
        );
        console.log("Computed background:", computedStyle.background);
        console.log("Inline style:", cursor.style.backgroundColor);
        console.log(
          "Bootstrap orange variable:",
          computedStyle.getPropertyValue("--bs-orange")
        );

        // Check all cursor elements
        allCursors.forEach(function (cursorElement, index) {
          var style = window.getComputedStyle(cursorElement);
          console.log(
            "Cursor " + index + " background:",
            style.backgroundColor
          );
        });
      }, 100);
    });

    $(".mil-accent-cursor").mouseleave(function () {
      console.log("Cursor leave - removing mil-accent class");
      $(cursor).removeClass("mil-accent");
      $(cursor).css("background-color", dark);
      $(cursor).css("background", dark);
    });

    $(".mil-drag").mouseover(function () {
      gsap.to($(".mil-ball .mil-icon-1"), 0.2, {
        scale: "1",
        ease: "sine",
      });
    });

    $(".mil-drag").mouseleave(function () {
      gsap.to($(".mil-ball .mil-icon-1"), 0.2, {
        scale: "0",
        ease: "sine",
      });
    });

    $(".mil-more").mouseover(function () {
      gsap.to($(".mil-ball .mil-more-text"), 0.2, {
        scale: "1",
        ease: "sine",
      });
    });

    $(".mil-more").mouseleave(function () {
      gsap.to($(".mil-ball .mil-more-text"), 0.2, {
        scale: "0",
        ease: "sine",
      });
    });

    $(".mil-choose").mouseover(function () {
      gsap.to($(".mil-ball .mil-choose-text"), 0.2, {
        scale: "1",
        ease: "sine",
      });
    });

    $(".mil-choose").mouseleave(function () {
      gsap.to($(".mil-ball .mil-choose-text"), 0.2, {
        scale: "0",
        ease: "sine",
      });
    });

    $(
      'a:not(".mil-choose , .mil-more , .mil-drag , .mil-accent-cursor"), input , textarea, .mil-accordion-menu'
    ).mouseover(function () {
      gsap.to($(cursor), 0.2, {
        scale: 0,
        ease: "sine",
      });
      gsap.to($(".mil-ball svg"), 0.2, {
        scale: 0,
      });
    });

    $(
      'a:not(".mil-choose , .mil-more , .mil-drag , .mil-accent-cursor"), input, textarea, .mil-accordion-menu'
    ).mouseleave(function () {
      gsap.to($(cursor), 0.2, {
        scale: 1,
        ease: "sine",
      });

      gsap.to($(".mil-ball svg"), 0.2, {
        scale: 1,
      });
    });

    $("body").mousedown(function () {
      gsap.to($(cursor), 0.2, {
        scale: 0.1,
        ease: "sine",
      });
    });
    $("body").mouseup(function () {
      gsap.to($(cursor), 0.2, {
        scale: 1,
        ease: "sine",
      });
    });
    /***************************

        main menu

        ***************************/
    $(".mil-has-children > a").on("click", function (e) {
      e.preventDefault();
      var $currentDropdown = $(this).next();
      var $currentLink = $(this);

      // Close other dropdowns
      $(".mil-has-children ul").not($currentDropdown).removeClass("mil-active");
      $(".mil-has-children a").not($currentLink).removeClass("mil-active");

      // Toggle current dropdown
      $currentLink.toggleClass("mil-active");
      $currentDropdown.toggleClass("mil-active");
    });
    /***************************

        scroll animations

        ***************************/

    const appearance = document.querySelectorAll(".mil-up");

    appearance.forEach((section) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 40,
          scale: 0.98,
          ease: "sine",
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          scrollTrigger: {
            trigger: section,
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    const scaleImage = document.querySelectorAll(".mil-scale");

    scaleImage.forEach((section) => {
      var value1 = $(section).data("value-1");
      var value2 = $(section).data("value-2");
      gsap.fromTo(
        section,
        {
          ease: "sine",
          scale: value1,
        },
        {
          scale: value2,
          scrollTrigger: {
            trigger: section,
            scrub: true,
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    const parallaxImage = document.querySelectorAll(".mil-parallax");

    if ($(window).width() > 960) {
      parallaxImage.forEach((section) => {
        var value1 = $(section).data("value-1");
        var value2 = $(section).data("value-2");
        gsap.fromTo(
          section,
          {
            ease: "sine",
            y: value1,
          },
          {
            y: value2,
            scrollTrigger: {
              trigger: section,
              scrub: true,
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    const rotate = document.querySelectorAll(".mil-rotate");

    rotate.forEach((section) => {
      var value = $(section).data("value");
      gsap.fromTo(
        section,
        {
          ease: "sine",
          rotate: 0,
        },
        {
          rotate: value,
          scrollTrigger: {
            trigger: section,
            scrub: true,
            toggleActions: "play none none reverse",
          },
        }
      );
    });
    /***************************

        fancybox

        ***************************/
    $('[data-fancybox="gallery"]').fancybox({
      buttons: ["slideShow", "zoom", "fullScreen", "close"],
      loop: false,
      protect: true,
    });
    $.fancybox.defaults.hash = false;
    /***************************

        reviews slider

        ***************************/

    var menu = [
      '<div class="mil-custom-dot mil-slide-1"></div>',
      '<div class="mil-custom-dot mil-slide-2"></div>',
      '<div class="mil-custom-dot mil-slide-3"></div>',
      '<div class="mil-custom-dot mil-slide-4"></div>',
      '<div class="mil-custom-dot mil-slide-5"></div>',
      '<div class="mil-custom-dot mil-slide-6"></div>',
      '<div class="mil-custom-dot mil-slide-7"></div>',
    ];
    var mySwiper = new Swiper(".mil-reviews-slider", {
      // If we need pagination
      pagination: {
        el: ".mil-revi-pagination",
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + menu[index] + "</span>";
        },
      },
      speed: 800,
      effect: "fade",
      parallax: true,
      navigation: {
        nextEl: ".mil-revi-next",
        prevEl: ".mil-revi-prev",
      },
    });

    /***************************

        infinite slider

        ***************************/
    var swiper = new Swiper(".mil-infinite-show", {
      slidesPerView: "auto",
      spaceBetween: 40,
      speed: 5000,
      autoplay: true,
      autoplay: {
        delay: 0,
      },
      loop: true,
      freeMode: true,
      breakpoints: {
        992: {
          slidesPerView: "auto",
          spaceBetween: 40,
        },
      },
    });

    /***************************

        portfolio slider

        ***************************/
    var swiper = new Swiper(".mil-portfolio-slider", {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 800,
      parallax: true,
      mousewheel: {
        enable: true,
      },
      navigation: {
        nextEl: ".mil-portfolio-next",
        prevEl: ".mil-portfolio-prev",
      },
      pagination: {
        el: ".swiper-portfolio-pagination",
        type: "fraction",
      },
    });
    /***************************

        1 item slider

        ***************************/
    var swiper = new Swiper(".mil-1-slider", {
      slidesPerView: 1,
      spaceBetween: 30,
      speed: 800,
      parallax: true,
      navigation: {
        nextEl: ".mil-portfolio-next",
        prevEl: ".mil-portfolio-prev",
      },
      pagination: {
        el: ".swiper-portfolio-pagination",
        type: "fraction",
      },
    });
    /***************************

        2 item slider

        ***************************/
    var swiper = new Swiper(".mil-2-slider", {
      slidesPerView: 1,
      spaceBetween: 30,
      speed: 800,
      parallax: true,
      navigation: {
        nextEl: ".mil-portfolio-next",
        prevEl: ".mil-portfolio-prev",
      },
      pagination: {
        el: ".swiper-portfolio-pagination",
        type: "fraction",
      },
      breakpoints: {
        992: {
          slidesPerView: 2,
        },
      },
    });
  });
});
