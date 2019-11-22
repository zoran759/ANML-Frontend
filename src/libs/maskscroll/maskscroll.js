export default class MaskScroll {

  constructor(element, options, onChanged) {
    this.options = {};
    this.states = {};
    this.sections = [];
    this.scrollNextCount = 0;
    this.current = 0;
    this.isTransition = false;
    this.container = this.element = typeof element == "string" ? document.querySelector(element) : element;
    this.mask = null;
    this.clipPath = null;
    this.isRender = false;
    this.states = { ts: null, isTouched: false, isScroll: false, direction: 1, isPaused: false, isMobile: false };
    this.segments = 6;

    this.startw = 16.6666;
    this.destw = 0;
    this.duration = 600;
    this.start = null;
    this.end = null;
    this.now = Date.now();

    this.isMobile = false;

    this.onChanged = onChanged;

    if (this.container && window.innerWidth > 991) this.init();
  }

  init() {

    this.sections = this.container.querySelectorAll(".mask-scroll-section");
    this.mask = this.container.querySelector(".mask");
    this.clipPath = this.mask.querySelector("clipPath");
    this.rects = this.mask.querySelectorAll("rect");



    if(window.innerWidth < 991) {
      this.isMobile = true;
      this.segments = 4;
      this.startw = 100/this.segments;
    } 
    
    this.buildMask();
    this.scrollEvents();
    this.draw();
  }

  buildMask = () => {

    for(let i=0; i<this.segments; i++) {
      this.rects[i].setAttribute("width", 100/this.segments + "%");
      this.rects[i].setAttribute("x", i*(100/this.segments) + "%");
    }

    if(this.segments == 4) {
      this.rects[4].setAttribute("width", 0 + "%");
      this.rects[5].setAttribute("width", 0 + "%");
    }

  }

  scrollEvents() {
    if (this.container.addEventListener) {
      if ('onwheel' in document) {
        this.container.addEventListener("wheel", this.onWheel);
      } else if ('onmousewheel' in document) {
        this.container.addEventListener("mousewheel", this.onWheel);
      } else {
        this.container.addEventListener("MozMousePixelScroll", this.onWheel);
      }
    } else {
      this.container.attachEvent("onmousewheel", this.onWheel);
    }

    this.container.addEventListener("touchmove", this.onWheel);

    this.container.addEventListener("touchstart", this.onTouch);
    this.container.addEventListener("touchstop", this.onstopTouch);
    this.container.addEventListener("touchmove", this.onWheel);

  }

  onTouch = (e) => {
    this.states.isTouched = true;
    this.states.isMobile ? this.states.ts = e.touches[0].clientX : this.states.ts = e.touches[0].clientY;
  }

  onstopTouch = (e) => {
    this.states.isTouched = false;
  }


  onWheel = (e) => {

    e = e || window.event;
    this.states.isPaused = true;
    let delta = null;

    this.states.isMobile ? delta = e.deltaX || e.detail || e.wheelDelta : delta = e.deltaY || e.detail || e.wheelDelta;

    if (e.type == 'touchmove') {
      let te = null;

      this.states.isMobile ? te = e.changedTouches[0].clientX : te = e.changedTouches[0].clientY;
      (this.states.ts > te) ? delta = 1 : delta = -1;
    }

    (delta > 0) ? this.states.direction = 1 : this.states.direction = -1;

    if (!this.isTransition) {

      let isScrollable = this.sections[this.current].querySelector(".mask-scrollable");
      let isBodyScrollable = this.sections[this.current].querySelector(".body-scrollable");

      if (!isScrollable && !isBodyScrollable) {
        this.clear();
        this.previous = this.current;

        if (this.states.direction > 0) {
          this.current < this.sections.length - 1 ? this.current++ : this.current = this.current;
        }

        if (this.states.direction < 0) {
          this.current > 0 ? this.current-- : this.current = this.current;
        }

        this.setActive();
      } else {
        
        let rect = this.sections[this.current].getBoundingClientRect();
        let scrollable = null;

        isBodyScrollable ?  scrollable = window.pageYOffset : scrollable = isScrollable.scrollTop;

        if (this.states.direction > 0) {

          if (scrollable + 10 > rect.height) {

            if (this.scrollNextCount > 0) {

              this.previous = this.current;
              this.clear();
              this.current < this.sections.length - 1 ? this.current++ : this.current = this.current;
              this.setActive();
              this.scrollNextCount = 0;
            }
            this.scrollNextCount++;
          }

        }

        if (this.states.direction < 0) {
          if (scrollable - 10 < 0) {
            if (this.scrollNextCount > 0) {
              this.previous = this.current;
              this.clear();
              this.current > 0 ? this.current-- : this.current = this.current;
              this.setActive();
              this.scrollNextCount = 0;
            }
            this.scrollNextCount++;
          }
        }
      }
    }
  }

  setActive = () => {
    this.isTransition = true;
    this.isRender = true;

    this.disableAllScroll();

    this.start = Date.now();
    this.end = this.start + this.duration;

    this.container.classList.add("transition-left");
    this.container.classList.add("scroll");
    this.sections[this.current].classList.add("active");
    this.sections[this.previous].classList.add("to-back");

    setTimeout(() => {
      this.container.classList.remove("transition-left");
      this.sections[this.current].classList.add("to-top");
      this.isTransition = false;
      this.onRendered();
      this.enableScroll();
    }, this.duration);

    setTimeout(() => {
      this.sections[this.current].classList.add("scroll");
    }, !this.isMobile ? 1200 : 200 );
  }

  enableScroll = ()=>{
    
    let isScrollable = this.sections[this.current].querySelector(".mask-scrollable");
    let isBodyScrollable = this.sections[this.current].querySelector(".body-scrollable");
    let body = document.body;

    if(isScrollable) this.sections[this.current].classList.remove("disable-scroll");
    if(isBodyScrollable) body.classList.remove("disable-scroll");
  }

  disableAllScroll = () => {
    this.sections.forEach((section)=>{
      let isScrollable = section.querySelector(".mask-scrollable");
      let isBodyScrollable = section.querySelector(".body-scrollable");
      let body = document.body;

      if(isScrollable) section.classList.add("disable-scroll");
      if(isBodyScrollable) body.classList.add("disable-scroll");
    });
  }

  onRendered = () => {
    this.isRender = false;
    this.onChanged(this.sections[this.current]);
  }

  clear = () => {

    this.container.classList.remove("transition-left");
    this.container.classList.remove("transition-right");

    this.sections.forEach((section) => {
      section.classList.remove("active");
      section.classList.remove("to-top");
      section.classList.remove("to-back");
      section.classList.remove("scroll");
    })

    let rects = this.mask.querySelectorAll("rect");
    rects.forEach((rect) => {
      rect.setAttribute("width", "16.6666%")
    });
  }

  draw = () => {
    this.now = Date.now();

    if (this.isRender) {
      if (this.now - this.start >= this.duration) this.isRender = false;

      var p = (this.now - this.start) / this.duration;
      let val = this.inOutQuad(p);
      let w = this.startw + (this.destw - this.startw) * val;

      this.rects.forEach((rect, i) => {
          this.segments == 4 & (i==4 || i==5) ? rect.setAttribute("width", 0 + "%") : rect.setAttribute("width", w + "%")
      });
    }

    requestAnimationFrame(this.draw);
  }

  destroy(){

  }

  inOutQuad = (n) => {
    n *= 2;
    if (n < 1) return 0.5 * n * n;
    return - 0.5 * (--n * (n - 2) - 1);
  };

  easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  lerp = (a, b, n) => {
    return (1 - n) * a + n * b;
  }

}