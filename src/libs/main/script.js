import { iefixes, scrollTo, getPosition, serialize, disable_scroll, enable_scroll } from './utils.js';
import CoverAnim from '../coveranim/coveranim';
import SepText from '../septext/septext';
import FlowImages from '../flowimages/flowimages';
import MaskCarousel from '../maskcarousel/MaskCarousel';
import Odometer from '../odometer/Odometer';
import Parralax from '../parralax/Parralax';
import styles from '../../scss/style.scss';
import '../tinyslider/tiny-slider.scss';
import { tns } from "../tinyslider/tiny-slider";
import InfiniteScroll from "../infinitescroll/infinitescroll";
import MaskScroll from "../maskscroll/maskscroll";
import Siema from "../siema/siema";
import LazyLoad from "vanilla-lazyload";
import Pristine from "pristinejs";

let enter = null, isEntered = false, state = null, MaskScrollClass = null, mouseX = 0, mouseY = 0, cursor = null, loaded = null, isLoadbar = true, scrollNextCount = 0, isNav = false, hero = null, coverAnimCont = null, intro = null, cover = null, header = null, menuToggler = null, grid = null, menu = null, content = null, next = null, loaderBar = null, isContent = false;

//document.body.style.cursor = "url('./assets/img/cursor.svg') 3 3, auto";

document.body.setAttribute("style", "cursor:url('./assets/img/cursor.svg') 3 3, auto")

const segmentsCount = 6;
let coverAnim = null;
let sepText = null;
let flowImages = null;
const domain = window.location.hostname;
const body = document.body.innerHTML;
let isIntro = true;

buildGrid();
buildCover();
iefixes();
play();

function init() {

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('popstate', function (event) {
    event.preventDefault();
    window.location.href = event.target.location.href;
  }, false);

  if (typeof isIndex == 'undefined') {
    isIntro = false;

    applyTemplate(() => {
      initGlobal();
      setTimeout(() => {
        initBeforeContent();
      }, 1000)
      setTimeout(() => {
        initContent();
      }, 2000)
      clearCover();
      initEvents();
      initHeader();
      initLinks();
      openPage();
      initSpecialLinks();
    })
  } else {
    initGlobal();
    initBeforeContent();
    initContent();
    initIntro();
    initCoverAnim();
    initEvents();
    initHeader();
    initLinks();
    initSpecialLinks();
  }

}

function customCursor() {

  if (cursor) cursor.remove();

  let onElement;

  const createState = (e) => {

    const defaultState = {
      x: e.clientX,
      y: e.clientY,
      width: 42,
      height: 42,
      radius: '100px'
    }

    const computedState = {}

    if (onElement != null) {
      let top, left, width, height, radius;

      if (onElement != "resize") {
        top = onElement.getBoundingClientRect().top
        left = onElement.getBoundingClientRect().left
        width = onElement.getBoundingClientRect().width
        height = onElement.getBoundingClientRect().height
        radius = window.getComputedStyle(onElement).borderTopLeftRadius
      } else {
        top = e.clientY - defaultState.width * 1.4 / 2
        left = e.clientX - defaultState.height * 1.4 / 2
        width = defaultState.width * 1.4;
        height = defaultState.height * 1.4;
        radius = "50%";
      }

      computedState.x = left + width / 2
      computedState.y = top + height / 2
      computedState.width = width
      computedState.height = height
      computedState.radius = radius
    }

    return {
      ...defaultState,
      ...computedState
    }
  }

  if(!state) state = createState({clientX:0, clientY:0});

  cursor = document.createElement("div");
  cursor.classList.add("cursor");

  document.documentElement.appendChild(cursor);

  const updateProperties = (elem, state) => {

    elem.style.setProperty('transform', `translate(${(state.x - state.width / 2)}px, ${(state.y - state.height / 2)}px)`)
    elem.style.setProperty('width', `${state.width}px`)
    elem.style.setProperty('height', `${state.height}px`)
    elem.style.setProperty('--radius', state.radius)
    elem.style.setProperty('--scale', state.scale)

  } 

  requestAnimationFrame(render);

  document.addEventListener('mousemove', (e) => {

    mouseX = e.clientX;
    mouseY = e.clientY;


    if (document.elementFromPoint(e.clientX, e.clientY).closest("[data-theme]")) {
      let theme = document.elementFromPoint(e.clientX, e.clientY).closest("[data-theme]").dataset.theme;
      cursor.classList.remove("black", "white");
      cursor.classList.add(theme);
      theme == "black" ? document.body.setAttribute("style", "cursor:url('./assets/img/cursor-black.svg') 3 3, auto") : document.body.setAttribute("style", "cursor:url('./assets/img/cursor.svg') 3 3, auto");
    }
  })

  document.querySelectorAll('[data-cursor]').forEach((elem) => {
    elem.addEventListener('mouseenter', () => onElement = elem)
    elem.addEventListener('mouseleave', () => onElement = undefined)
  })

  document.querySelectorAll('a, [data-cursorh]').forEach((elem) => {
    elem.addEventListener('mouseenter', () => onElement = "resize")
    elem.addEventListener('mouseleave', () => onElement = undefined)
  })

  function render() {
    state = createState({clientX:lerp(state.x, mouseX, 0.15), clientY:lerp(state.y, mouseY, 0.15)});
    updateProperties(cursor, state)
    requestAnimationFrame(render);
  }

  function lerp(a, b, n) {
    return (1 - n) * a + n * b;
  }
}

function clearCover() {
  cover.classList.remove("step-1", "step-2", "reverse");
}

function initBeforeContent() {
  hero = document.querySelector(".hero");

  if (hero) {
    setTimeout(() => {
      hero.classList.add("active");
    }, 600);
  }
}

function initSpecialLinks() {
  let links = document.querySelectorAll(".link-special");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      //e.preventDefault();
      clearSpecialLinks();
      link.classList.toggle("active");
    });
  });
}

function clearSpecialLinks() {
  let links = document.querySelectorAll(".link-special");
  links.forEach((link) => {
    link.classList.remove("active");
  });
}

function openPage() {

  setTimeout(() => {
    cover.classList.add("expanded");
    header.classList.add("active");
  }, 1000);

}

function applyTemplate(calback) {
  let newLoaded = document.createElement("div");
  let html = '';
  let xmlhttp = new XMLHttpRequest();

  let elements = document.querySelectorAll(".hero, .content, .next, .mask-scroll, .cover-video");

  elements.forEach((element) => {
    if (element) element.remove();
  });

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
      html = xmlhttp.responseText;
      html = createElementFromHTML(html);

      html.forEach((elm) => {
        document.body.prepend(elm);
      });

      newLoaded.classList.add("loaded");
      document.body.appendChild(newLoaded);
      newLoaded.innerHTML = body.replace('<script src="./assets/bundle.js"></script>', '');

      let title = document.querySelector("#page-title");
      document.title = title.innerHTML;

      calback();
    }
  };

  xmlhttp.open("GET", "./template.html", true);
  xmlhttp.send();
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  return div.childNodes;
}

function initGlobal() {
  header = document.querySelector(".header");
  menuToggler = document.querySelector(".menu-toggler");
  menu = document.querySelector(".menu");
  loaderBar = document.querySelector(".hero .scroll-line");
  loaded = document.querySelector(".loaded");
}

function initContent() {
  content = document.querySelector(".content");
  next = document.querySelector(".next");

  entry("[data-entry]");
  //initLockedViews();
  initCarousels();
  initMaskCarousels();
  initOdometer();
  initInfiniteScroll();
  initParralax();
  gridToBackWard();
  initArrowLinks();
  initMaskScroll();
  simpleGrid();
  forms();
  customCursor();
  mobileOptimization();
  initConfigs();

  const pageLazyLoad = new LazyLoad({
    elements_selector: "[data-src]",
    use_native: true,
  });
}

function initConfigs() {

  grid.classList.remove("op02", "op0");
  document.querySelector(".loaded").classList.remove("fixed")

  let videocover = document.querySelector(".cover-video");
  if (videocover) {
    videocover.remove();
    document.body.appendChild(videocover);
  }

  let gridOpacity = document.querySelector("[data-grid]");
  if (gridOpacity) gridOpacity = gridOpacity.dataset.grid;

  let gridmobdisabled = document.querySelector("[data-gridmobdisabled]");
  if (gridmobdisabled) gridmobdisabled = gridmobdisabled.dataset.gridmobdisabled;


  if (window.innerWidth < 991) if (gridmobdisabled) grid.classList.add(gridmobdisabled);
  if (gridOpacity) grid.classList.add(gridOpacity);

}

function mobileOptimization() {
  if (window.innerWidth < 991) {
    let videos = document.querySelectorAll(".remove-md");

    videos.forEach((video) => {
      video.remove();
    });
  }

}

function initMaskScroll() {
  let maskScroll = document.querySelector(".mask-scroll");

  if (MaskScrollClass) MaskScrollClass.destroy();


  if (maskScroll || window.innerWidth > 991) {
    MaskScrollClass = new MaskScroll(maskScroll, {}, (data) => {
      data.dataset.grid ? addClassToGrid(data.dataset.grid) : clearGrid("to-backward");
      setHeaderTheme();
    });
  }
}

function setHeaderTheme() {
  cursor.classList.remove("black", "white");
  header.classList.remove("black", "white");
  let theme = document.elementFromPoint(0, 50).closest("[data-theme]").dataset.theme;
  header.classList.add(theme);
  //cursor.classList.add(theme);

  //theme == "black" ? document.body.style.cursor = "url('./assets/img/cursor-black.svg') 3 3, auto" : document.body.style.cursor = "url('./assets/img/cursor.svg') 3 3, auto";
}

function initArrowLinks() {
  let links = document.querySelectorAll(".pressets-logos a");

  links.forEach((link) => {
    let icon = document.createElement("i");
    icon.classList.add("icon-arrow-right-n");
    if (link.getAttribute("href")) {
      link.classList.add("with-link");
      link.appendChild(icon);
    }
  });
}

function gridToBackWard() {
  if (!isIntro) {
    let disableToBackward = document.querySelector("[data-grid=disabled]");

    setTimeout(() => {
      if (!disableToBackward) {
        addClassToGrid("to-backward");
      }
    }, 0);
  }
}

function initInfiniteScroll() {
  let infiniteScrolls = document.querySelectorAll(".infinite-scroll");

  if (infiniteScrolls) {

    // infiniteScrolls.forEach((infiniteScroll) => {
    //   let slider = tns({
    //     container: infiniteScroll,
    //     items: 3,
    //     center:true,
    //     preventScrollOnTouch: "force",
    //     controls:false,
    //     nav:false,
    //     loop: true,
    //     axis: "vertical",
    //     autoplay: false,
    //     autoplayButtonOutput: false,
    //     mouseDrag: true,
    //   });
    // });



    infiniteScrolls.forEach((infiniteScroll) => {
      new InfiniteScroll(infiniteScroll, {}, () => {
        initLinks();
      });
    });
  }
}

function initOdometer() {
  let odometers = document.querySelectorAll("[odometer]");
  if (odometers) {
    odometers.forEach((odometer) => {
      new Odometer(odometer);
    });
  }
}

function initParralax() {
  let parralaxs = document.querySelectorAll("[parralax]");
  if (parralaxs) {
    parralaxs.forEach((parralax) => {
      new Parralax(parralax);
    });
  }
}

function initMaskCarousels() {
  if (document.querySelector(".mask-carousel")) {
    let maskCarousel = new MaskCarousel(".mask-carousel", {
      autoplay: false,
      controlsContainer: 1,
      controls: ["<i class='icon-arrow-left'></i>", "<i class='icon-arrow-right'></i>"]
    });
  }
}

function initCarousels() {
  let carousels = document.querySelectorAll(".block-carousel-items");
  let galleries = document.querySelectorAll(".block-gallery-carousel");
  let galleries3 = document.querySelectorAll(".block-gallery-carousel-3");
  let simple = document.querySelectorAll(".block-carousel-simple");
  let black = document.querySelectorAll(".block-carousel-black");

  carousels.forEach((carousel) => {

    var slider = tns({
      container: carousel,
      items: 1,
      slideBy: 'page',
      autoplay: true,
      edgePadding: 20,
      gutter: carousel.dataset.gutter ? carousel.dataset.gutter : 0,
      edgePadding: carousel.dataset.edge ? carousel.dataset.edge : 0,
      autoplayButtonOutput: false,
      controlsPosition: "bottom",
      navPosition: "bottom",
      mouseDrag: true,
      responsive: {
        767: {
          edgePadding: 20,
          gutter: 20,
          items: 1
        },
      },
      controlsText: ["<i class='icon-arrow-left'></i>", "<i class='icon-arrow-right'></i>"]
    });
  });

  black.forEach((gallery) => {
    let slides = gallery.querySelectorAll(".block-carousel-item");

    slides.forEach((slide, i) => {
      slide.setAttribute("index", i + 1);
    })

    var slider = new Siema({
      selector: gallery,
      duration: 500,
      easing: 'ease-out',
      autoHeight:true,
      perPage: {
        320: 3,
        768: 3,
        991: 1,
        1600: 1,
      },
      startIndex: 0,
      draggable: true,
      multipleDrag: true,
      threshold: 20,
      loop: true,
      rtl: false,
      onInit: onInit,
      onChange: printSlideIndex,
    });

    function onInit() {

      let nav = document.createElement("div")
      nav.classList.add("block-gallery-controls", "wide");
      nav.innerHTML = "<button type='button'><i class='block-gallery-prev icon-arrow-left'></i></button><button type='button'><i class='block-gallery-next icon-arrow-right'></i></button>";
      gallery.parentNode.appendChild(nav);

      let next = gallery.parentNode.querySelector(".block-gallery-next");
      let prev = gallery.parentNode.querySelector(".block-gallery-prev");

      slides.forEach((slide) => {
        slide.classList.remove("active");
      })

      window.innerWidth > 991 ? slides[0].classList.add("active") : slides[1].classList.add("active");

      prev.addEventListener('click', () => slider.prev(1));
      next.addEventListener('click', () => slider.next(1));

    }

    function printSlideIndex() {

      let rect = gallery.getBoundingClientRect();
      let slides = gallery.querySelectorAll(".block-carousel-item");

      let position = rect.top > 0 ? (rect.top + 100) : (window.innerHeight + rect.top) / 2;

      setTimeout(() => {
        slides.forEach((slide) => {
          slide.classList.remove("active");
        })

        let element = document.elementFromPoint(window.innerWidth / 2 + 20, position);
        if (element) element.closest(".block-carousel-item").classList.add("active");

      }, 250);

    }
  });

  simple.forEach((gallery) => {
    let slides = gallery.querySelectorAll(".block-carousel-item");

    slides.forEach((slide, i) => {
      slide.setAttribute("index", i + 1);
    })

    var slider = new Siema({
      selector: gallery,
      duration: 500,
      easing: 'ease-out',
      perPage: {
        320: 3,
        768: 3,
        1024: 3,
        1600: 3,
      },
      startIndex: 0,
      draggable: true,
      multipleDrag: true,
      threshold: 20,
      loop: true,
      rtl: false,
      onInit: onInit,
      onChange: printSlideIndex,
    });

    function onInit() {
      slides.forEach((slide) => {
        slide.classList.remove("active");
      })

      window.innerWidth > 1024 ? slides[1].classList.add("active") : slides[1].classList.add("active");
    }

    function printSlideIndex() {

      let rect = gallery.getBoundingClientRect();
      let slides = gallery.querySelectorAll(".block-carousel-item");

      let position = rect.top > 0 ? (rect.top + 100) : (window.innerHeight + rect.top) / 2;

      setTimeout(() => {
        slides.forEach((slide) => {
          slide.classList.remove("active");
        })

        let element = document.elementFromPoint(window.innerWidth / 2 + 20, position);
        if (element) element.parentNode.classList.add("active");

      }, 250);

    }
  });

  galleries3.forEach((gallery) => {
    let slides = gallery.querySelectorAll(".block-gallery-item");

    slides.forEach((slide, i) => {
      slide.setAttribute("index", i + 1);
    })

    var slider = new Siema({
      selector: gallery,
      duration: 500,
      easing: 'ease-out',
      perPage: {
        320: 3,
        768: 3,
        1024: 3,
        1600: 3,
      },
      startIndex: 0,
      draggable: true,
      multipleDrag: true,
      threshold: 20,
      loop: true,
      rtl: false,
      onInit: onInit,
      onChange: printSlideIndex,
    });

    function onInit() {
      let counter = document.createElement("div")
      let nav = document.createElement("div")
      nav.classList.add("block-gallery-controls", "wide");
      counter.classList.add("block-gallery-counter");
      nav.innerHTML = "<button type='button'><i class='block-gallery-prev icon-arrow-left'></i></button><button type='button'><i class='block-gallery-next icon-arrow-right'></i></button>";
      counter.innerHTML = "<span class='block-gallery-current'>0</span> / <span class='block-gallery-length'>0</span>";
      gallery.parentNode.appendChild(nav);
      gallery.parentNode.appendChild(counter);
      let current = gallery.parentNode.querySelector(".block-gallery-current");

      let next = gallery.parentNode.querySelector(".block-gallery-next");
      let prev = gallery.parentNode.querySelector(".block-gallery-prev");
      let length = gallery.parentNode.querySelector(".block-gallery-length");

      length.innerHTML = this.innerElements.length > 10 ? this.innerElements.length : ('0' + this.innerElements.length);
      current.innerHTML = window.innerWidth > 1024 ? "02" : "02";

      slides.forEach((slide) => {
        slide.classList.remove("active");
      })

      window.innerWidth > 1024 ? slides[1].classList.add("active") : slides[1].classList.add("active");

      prev.addEventListener('click', () => slider.prev(1));
      next.addEventListener('click', () => slider.next(1));
    }

    function printSlideIndex() {

      let rect = gallery.getBoundingClientRect();
      let slides = gallery.querySelectorAll(".block-gallery-item");
      let current = gallery.parentNode.querySelector(".block-gallery-current");

      let position = rect.top > 0 ? (rect.top + 100) : (window.innerHeight + rect.top) / 2;

      setTimeout(() => {
        slides.forEach((slide) => {
          slide.classList.remove("active");
        })

        let element = document.elementFromPoint(window.innerWidth / 2 + 20, position);
        if (element) element.classList.add("active");
        let index = element.getAttribute("index");

        current.innerHTML = index > 10 ? index : ('0' + index);

      }, 250);

    }

  });

  galleries.forEach((gallery) => {
    let slides = gallery.querySelectorAll(".block-gallery-item");

    slides.forEach((slide, i) => {
      slide.setAttribute("index", i + 1);
    })

    var slider = new Siema({
      selector: gallery,
      duration: 500,
      easing: 'ease-out',
      perPage: {
        320: 3,
        768: 3,
        1024: 3,
        1400: 3,
      },
      startIndex: 0,
      draggable: true,
      multipleDrag: true,
      threshold: 20,
      loop: true,
      rtl: false,
      onInit: onInit,
      onChange: printSlideIndex,
    });

    function onInit() {
      let counter = document.createElement("div")
      let nav = document.createElement("div")
      nav.classList.add("block-gallery-controls");
      counter.classList.add("block-gallery-counter");
      nav.innerHTML = "<button type='button'><i class='block-gallery-prev icon-arrow-left'></i></button><button type='button'><i class='block-gallery-next icon-arrow-right'></i></button>";
      counter.innerHTML = "<span class='block-gallery-current'>0</span> / <span class='block-gallery-length'>0</span>";
      gallery.parentNode.appendChild(nav);
      gallery.parentNode.appendChild(counter);
      let current = gallery.parentNode.querySelector(".block-gallery-current");

      let next = gallery.parentNode.querySelector(".block-gallery-next");
      let prev = gallery.parentNode.querySelector(".block-gallery-prev");
      let length = gallery.parentNode.querySelector(".block-gallery-length");

      length.innerHTML = this.innerElements.length > 10 ? this.innerElements.length : ('0' + this.innerElements.length);
      current.innerHTML = window.innerWidth > 1400 ? "01" : "01";

      slides.forEach((slide) => {
        slide.classList.remove("active");
      })

      window.innerWidth > 1400 ? slides[1].classList.add("active") : slides[1].classList.add("active");

      prev.addEventListener('click', () => slider.prev(1));
      next.addEventListener('click', () => slider.next(1));
    }

    function printSlideIndex() {

      let rect = gallery.getBoundingClientRect();
      let slides = gallery.querySelectorAll(".block-gallery-item");
      let current = gallery.parentNode.querySelector(".block-gallery-current");

      let position = rect.top > 0 ? (rect.top + 100) : (window.innerHeight + rect.top) / 2;

      setTimeout(() => {
        slides.forEach((slide) => {
          slide.classList.remove("active");
        })

        let element = document.elementFromPoint(window.innerWidth / 2 + 20, position);
        if (element) element.classList.add("active");
        let index = element.getAttribute("index");

        current.innerHTML = index > 10 ? index : ('0' + index);

      }, 250);
    }
  });
}

function initIntro() {
  enter = document.querySelector(".enter");
  intro = document.querySelector(".intro");
  sepText = new SepText();
  flowImages = new FlowImages(".flow-images");
  document.querySelector("html").classList.add("disable-scroll");
  document.body.classList.add("disable-scroll");
  disableScroll(intro);
}

function initCoverAnim() {
  coverAnimCont = document.querySelector(".cover-anim");
  coverAnim = new CoverAnim(".cover-anim");
}

function initLinks() {
  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      let target = link.getAttribute("target");
      if (!target) {

        e.preventDefault();
        let href = link.getAttribute("href");
        let delay = link.getAttribute("link-delay");
        let cdelay = link.getAttribute("cover-delay");

        if (href) {
          link.classList.add("active");

          setTimeout(() => {
            link.classList.remove("active");
          }, 2000)

          if (!delay) delay = 0;
          if (!cdelay) cdelay = 650;

          navigate(href, delay, cdelay, e);
        }
      }
    });
  });
};

function navigate(href, delay, delayP = 900, e) {

  enable_scroll();

  scrollNextCount = 0;
  if (!isNav) {

    isNav = true;

    if (((href.indexOf('./') + 1) && href.length == 2) || ((href.indexOf('./') + 1) && href.length == domain.length)) {
      window.location = href;
      return;
    }

    if ((href.indexOf('./') + 1) || (href.indexOf(domain) + 1)) {
      if (e) e.preventDefault();

      if (document.querySelector("#page-title")) document.querySelector("#page-title").remove();
      if (document.querySelector(".cover-video")) document.querySelector(".cover-video").remove();

      var html = '';
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
          setTimeout(() => {
            html = xmlhttp.responseText;
            cover.classList.remove("step-1", "step-2", "expanded", "hide-left", "reverse");

            clearGrid("to-backward");

            setTimeout(() => {
              loaded.innerHTML = html;

              preloader(false, () => {
                let pageTitle = document.querySelector("#page-title").innerHTML;
                document.title = pageTitle;
                window.history.pushState({ "pageTitle": pageTitle }, "", href);

                setTimeout(() => {
                  document.body.scrollTop = document.documentElement.scrollTop = 0;
                  cover.classList.add("expanded");

                  initBeforeContent();

                  setTimeout(() => {
                    initContent();
                    initLinks();
                    //initLockedViews();
                    clearSpecialLinks();
                    isNav = false;
                  }, 1200);
                }, 0); // 1300 for preloader
              });
            }, delayP);
          }, delay);
        }
      };

      xmlhttp.open("GET", href, true);
      xmlhttp.send();
    }
  }
}

function entry(c) {
  const sections = document.querySelectorAll(c);

  check();

  document.onscroll = function () {
    check();
  };

  function check() {
    sections.forEach(function (element) {
      if (isScrolledIntoView(element)) {
        element.classList.add(element.dataset.entry);
        if (element.dataset.delay) element.classList.add(element.dataset.delay);
      }
    });
  }

}

function initHeader() {
  let theme = "white";

  document.addEventListener("scroll", () => {
    if (cursor) cursor.classList.remove("black", "white");
    header.classList.remove("black", "white");
    let container = document.elementFromPoint(0, 50).closest("[data-theme]");
    if (container) theme = container.dataset.theme;

    header.classList.add(theme);
    if (cursor) cursor.classList.add(theme);

    theme == "black" ? document.body.setAttribute("style", "cursor:url('./assets/img/cursor-black.svg') 3 3, auto") : document.body.setAttribute("style", "cursor:url('./assets/img/cursor.svg') 3 3, auto");
  });
}

function forms() {

  let form = document.getElementById("contact-form");

  if (form) {
    let pristine = new Pristine(form);

    NodeList.prototype.map = Array.prototype.map;
    var inputs = document.querySelectorAll("input, textarea");

    inputs.map(function (elm) {
      elm.addEventListener("change", function (e) {
        if (elm.value.length > 0) {
          elm.dataset.empty = false;
        } else {
          elm.dataset.empty = true;
        }
      });
    });

    var forms = document.querySelectorAll("form");

    forms.map(function (elm) {
      elm.addEventListener("submit", function (e) {
        e.preventDefault();

        let form = e.target;
        let action = form.getAttribute("action");
        let xhttp = new XMLHttpRequest();

        let valid = pristine.validate();

        if (valid) {
          xhttp.open("POST", action, true);
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          let email = form.querySelector("[type=email]").value;
          xhttp.send(serialize(elm) + "&email=" + email);

          xhttp.onreadystatechange = function (data) {
            if (xhttp.status == 200 && xhttp.readyState == 4) {
              if (data.target.responseText == "1") {
                elm.classList.add("succes");
              } else {
                elm.classList.add("error");
              }
            } else {
              elm.classList.add("error");
            }
          }
        }
      });
    });
  }
}

function initEvents() {

  menuEvents();
  scrollEvents();
  coverEvents();
  globalEvents();

}


function globalEvents() {
  window.addEventListener("resize", () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
}

function coverEvents() {
  if (coverAnim) {
    enter.addEventListener("click", () => {
      goToPage();
    });

    coverAnim.titles.forEach((elm, i) => {
      elm.querySelector("a").addEventListener("click", (e) => {
        coverAnim.open(i);
        isContent = true;
      });
    });
    //enter.click();
  }
}

function scrollEvents() {
  if (document.addEventListener) {
    if ('onwheel' in document) {
      document.addEventListener("wheel", onWheel);
    } else if ('onmousewheel' in document) {
      document.addEventListener("mousewheel", onWheel);
    } else {
      document.addEventListener("MozMousePixelScroll", onWheel);
    }
  } else {
    document.attachEvent("onmousewheel", onWheel);
  }

  document.addEventListener("touchmove", onWheel);

  function onWheel() {
    if (next && !next.classList.contains('disabled')) {
      const href = next.dataset.target;
      const type = next.dataset.type;
      if (type != "click") {
        var rect = next.getBoundingClientRect();
        if (rect.top < 1) {
          if (scrollNextCount > 10) {
            navigate(href, 0, 650, null);
            scrollNextCount = 0;
          }
          scrollNextCount++;
        }
      }
    }
  }
}

function menuEvents() {
  const menuLinks = menu.querySelectorAll("a");

  menuToggler.addEventListener("click", () => {
    menuToggler.classList.toggle("active");
    menu.classList.toggle("active");
    header.classList.remove("black", "white");
    // document.querySelector("html").classList.add("disable-scroll");
    // document.body.classList.add("disable-scroll");
    disable_scroll();

    if (menuToggler.classList.contains("active")) {
      document.body.setAttribute("style", "cursor:url('./assets/img/cursor.svg') 3 3, auto");
      cursor.classList.remove("black");
      cursor.classList.add("white");
      cover.classList.add("formenu");
      addClassToGrid("formenu");
      loaderBar.classList.add("formenu");
      header.classList.add("white");
      isContent ? cover.classList.add("z-31") : coverAnimCont ? coverAnimCont.classList.add("formenu") : '';
    } else {
      enable_scroll();
      // document.querySelector("html").classList.remove("disable-scroll");
      // document.body.classList.remove("disable-scroll");
      menu.classList.add("hide");
      setTimeout(() => {
        menu.classList.remove("hide");
        cover.classList.remove("formenu");

        setTimeout(() => {
          clearGrid("formenu");
        }, 600);

        loaderBar.classList.remove("formenu");

        let theme = document.elementFromPoint(0, 50).closest("[data-theme]").dataset.theme;
        header.classList.add(theme);

        isContent ? setTimeout(() => { cover.classList.remove("z-31") }, 1500) : cover.classList.remove("z-31");
        if (coverAnimCont) coverAnimCont.classList.remove("formenu");
      }, 600);
    }

    if (isContent) {
      if (menuToggler.classList.contains("active")) {
      } else {
        content.classList.add("active");
      }
    }
  })

  menuLinks.forEach((link) => {
    let target = link.getAttribute("target");
    if (!target) {
      link.addEventListener("click", () => {
        menuToggler.classList.remove("active");
        menu.classList.add("hide");
        menu.classList.remove("active");
        document.querySelector("html").classList.remove("disable-scroll");
        document.body.classList.remove("disable-scroll");
        cover.classList.remove("formenu");
        grid.classList.remove("formenu");
        cover.classList.remove("z-31");

        setTimeout(() => {
          menu.classList.remove("hide");
        }, 600)

        if (coverAnimCont) coverAnimCont.classList.remove("formenu");
      });
    }
  });
}

function addClassToGrid(className) {
  let grids = document.querySelectorAll(".grid");
  grids.forEach((gridE) => {
    gridE.classList.add(className);
  });
}

function clearGrid(className) {
  let grids = document.querySelectorAll(".grid");
  grids.forEach((gridE) => {
    gridE.classList.remove(className);
  });
}

function isScrolledIntoView(el) {
  let top = el.offsetTop + 100;
  let left = el.offsetLeft;
  let width = el.offsetWidth;
  let height = el.offsetHeight;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top < (window.pageYOffset + window.innerHeight) &&
    left < (window.pageXOffset + window.innerWidth) &&
    (top + height) > window.pageYOffset &&
    (left + width) > window.pageXOffset
  );
}

function checkIntroScroll() {

  const container = document.querySelector(".intro");
  if (container) {
    let isMobile = false;
    let isTouched = false;
    let ts = null;

    if (container.addEventListener) {
      if ('onwheel' in document) {
        container.addEventListener("wheel", onWheel);
      } else if ('onmousewheel' in document) {
        container.addEventListener("mousewheel", onWheel);
      } else {
        container.addEventListener("MozMousePixelScroll", onWheel);
      }
    } else {
      container.attachEvent("onmousewheel", onWheel);
    }

    //window.innerWidth > 991 ? isMobile = false : isMobile = true;

    container.addEventListener("touchstart", onTouch);
    container.addEventListener("touchstop", onstopTouch);
    container.addEventListener("touchmove", onWheel);


    function onTouch(e) {
      isTouched = true;
      isMobile ? ts = e.touches[0].clientX : ts = e.touches[0].clientY;
    }

    function onstopTouch(e) {
      isTouched = false;
    }

    function onWheel(e) {
      e = e || window.event;
      let delta = null;

      isMobile ? delta = e.deltaX || e.detail || e.wheelDelta : delta = e.deltaY || e.detail || e.wheelDelta;

      if (e.type == 'touchmove') {
        let te = null;

        isMobile ? te = e.changedTouches[0].clientX : te = e.changedTouches[0].clientY;

        (ts > te) ? delta = 1 : delta = -1;
      }

      (delta > 0) ? goToPage(1) : '';

    }
  }
}

function goToPage() {
  isEntered = true;
  intro.classList.add("close");
  cover.classList.add("step-1");
  cover.classList.add("step-2");
  header.classList.add("active");
  coverAnim.play();
  isIntro = false;

  localStorage.setItem('introViewed', Date.now() + 3600000);

  setTimeout(() => {
    document.querySelector("html").classList.remove("disable-scroll");
    document.body.classList.remove("disable-scroll");
    if (coverAnim) coverAnim.states.isScroll = false;
    if (coverAnim) coverAnim.states.isdisablesScroll = false;
  }, 1400);
}

function buildCover() {
  const coverConrainer = document.createElement("div");
  const coverSegment = document.createElement("div");

  coverSegment.classList.add("cover-segment");
  coverConrainer.classList.add("cover");
  document.body.appendChild(coverConrainer);

  for (let i = 0; i < segmentsCount; i++) {
    coverConrainer.appendChild(coverSegment.cloneNode());
  }

  cover = document.querySelector(".cover");
}

function buildGrid() {
  const gridContainer = document.createElement("div");
  const gridLine = document.createElement("div");
  let segments = [];

  gridLine.classList.add("grid-line");
  gridContainer.classList.add("grid");
  document.body.appendChild(gridContainer);

  for (let i = 0; i < segmentsCount; i++) {
    segments.push(gridLine.cloneNode());
    gridContainer.appendChild(segments[i]);
  }

  grid = document.querySelector(".grid");
}

function simpleGrid() {
  if (document.querySelector(".simple-grid")) {

    let grids = document.querySelectorAll(".simple-grid");

    grids.forEach((gridC) => {
      const gridContainer = document.createElement("div");
      const gridLine = document.createElement("div");
      let segments = [];

      gridLine.classList.add("grid-line");
      gridContainer.classList.add("grid");
      gridC.appendChild(gridContainer);

      for (let i = 0; i < segmentsCount; i++) {
        segments.push(gridLine.cloneNode());
        gridContainer.appendChild(segments[i]);
      }

      grid = document.querySelector(".grid");
    });

  }
}

function preloader(isFirst = false, calback) {

  let delay = 1000;

  if (!isFirst) {
    cover.classList.remove("step-1", "step-2", "expanded");
    loadbar();
  }

  function loadbar() {
    var prog = document.createElement('div'),
      img = document.images,
      c = 0,
      tot = img.length;

    prog.classList.add("progress");

    if (isLoadbar) {
      document.body.appendChild(prog);
      setTimeout(() => {
        if (prog) prog.remove();
      }, 2000);
    } else {
      delay = 0;
    }

    isLoadbar = false;

    if (tot == 0) {
      imitate(0);
    }

    function imitate(i) {
      if (i < 11) {
        setTimeout(() => {
          imitate(i + 1);
          prog.style.height = i * 10 + "%";
        }, 0); // 50 for imitate
      } else {
        return doneLoading();
      }
    }

    function imgLoaded() {
      c += 1;
      var perc = ((100 / tot * c) << 0) + "%";
      prog.style.height = perc;
      if (c === tot) return doneLoading();
    }
    function doneLoading() {
      setTimeout(() => {
        prog.classList.add("hide");
        calback();
      }, delay);
    }
    for (var i = 0; i < tot; i++) {
      var tImg = new Image();
      tImg.onload = imgLoaded;
      tImg.onerror = imgLoaded;
      tImg.src = img[i].src;
    }
  }
  document.addEventListener('DOMContentLoaded', loadbar, false);
}

function disableScroll(container) {
  if (container.addEventListener) {
    if ('onwheel' in document) {
      container.addEventListener("wheel", onWheel);
    } else if ('onmousewheel' in document) {
      container.addEventListener("mousewheel", onWheel);
    } else {
      container.addEventListener("MozMousePixelScroll", onWheel);
    }
  } else {
    container.attachEvent("onmousewheel", onWheel);
  }
  container.addEventListener("touchmove", onWheel);

  function onWheel(e) {
    e.preventDefault();
  }


}

function play() {
  const ovrl = document.querySelector(".overlay");

  preloader(true, () => {
    init();

    let viewedTime = localStorage.getItem('introViewed');

    if (coverAnim) {
      coverAnim.show();

      if (viewedTime > Date.now()) {
        setTimeout(() => {
          ovrl.classList.add("d-none");
          grid.classList.add("active");
          intro.classList.add("step-1");
          intro.classList.add("step-2");
          intro.classList.add("close");
          flowImages.show();
          sepText.play();
          checkIntroScroll();
          enter.click();
        }, 500);
      } else {

        setTimeout(() => {
          ovrl.classList.add("d-none");
          grid.classList.add("active");
        }, 500);
        setTimeout(() => {
          intro.classList.add("step-1");
          setTimeout(() => {
            setTimeout(() => {
              intro.classList.add("step-2");
              sepText.play();
              setTimeout(() => {
                flowImages.show();
                checkIntroScroll();
                setTimeout(() => {
                  if (!isEntered) {
                    //enter.click();
                  }
                }, 10000)
              }, 600);
            }, 1400);
          }, 600);
        }, 1000);
      }
    } else {
      setTimeout(() => {
        grid.classList.add("active", "x5");
      }, 500);
    }
  });
}