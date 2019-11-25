export default class CoverAnim {
  constructor(selector, options) {
    this.options = { segments: window.innerWidth > 767 ? 7 : 5, slideDelay: 5000, autoplay: false };
    this.states = { currentSlide: 0, ts: null, isTouched: false, isScroll: true, length: 0, direction: 1, isPaused: false, isMobile: false, isdisablesScroll: false };
    this.bgsContainers = [];
    this.progressSegments = [];
    this.titles = [];
    this.container = document.querySelector(selector);
    this.cover = null;
    this.intro = null;
    this.next = null;
    this.header = null;
    this.played = false;
    this.pauseTimer = null;
    this.progress = null;
    if (this.container) this.init();
  }

  init() {
    this.cover = document.querySelector(".cover");
    this.intro = document.querySelector(".intro");
    this.next = document.querySelector(".next");
    this.header = document.querySelector(".header");
    this.scroll = this.container.querySelector(".scroll-line");

    this.buildBgs();
    this.buildBar();
    this.parseTitles();
    this.scrollEvents();
    this.buttonsEvents();
  }

  buttonsEvents = () => {

  }

  open(i) {

    this.states.isPaused = true;
    this.states.isScroll = true;

    setTimeout(() => {
      this.titles.forEach((elm) => {
        elm.classList.remove("active");
      });

      this.container.classList.add("expanded");
    }, 600)

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

    window.innerWidth > 991 ? this.states.isMobile = false : this.states.isMobile = true;

    this.container.addEventListener("touchstart", this.onTouch);
    this.container.addEventListener("touchstop", this.onstopTouch);
    this.container.addEventListener("touchmove", this.onWheel);

  }

  onTouch = (e) => {
    this.states.isTouched = true;
    if (e.type == 'touchstart') {
      this.states.isMobile ? this.states.ts = e.touches[0].clientY : this.states.ts = e.touches[0].clientY;
    }
    if (e.type == 'mousedown') {
      this.states.ts = e.clientX;
    }
  }

  onstopTouch = (e) => {
    this.states.isTouched = false;
  }

  onWheel = (e) => {
    if (!this.states.isdisablesScroll) {
      e = e || window.event;
      e.preventDefault();
      this.states.isPaused = true;
      let delta = null;

      this.states.isMobile ? delta = e.deltaY || e.detail || e.wheelDelta : delta = e.deltaY || e.detail || e.wheelDelta;

      if (e.type == 'touchmove') {
        let te = null;

        this.states.isMobile ? te = e.changedTouches[0].clientY : te = e.changedTouches[0].clientY;

        (this.states.ts > te) ? delta = 1 : delta = -1;

      }

      (delta > 0) ? this.move(1) : this.move(-1);
    }
  }

  parseTitles = () => {
    this.titles = this.container.querySelectorAll(".cover-anim-titles .cover-anim-title");
  }

  move = (direction) => {
    if (!this.states.isScroll) {
      this.states.isScroll = true;
      setTimeout(() => {
        this.states.isScroll = false;
        if (this.pauseTimer) clearTimeout(this.pauseTimer);
        if (!this.isIntro) {
          this.pauseTimer = setTimeout(() => {
            //this.states.isPaused = false;
          }, this.options.slideDelay)
        }
      }, 1500)

      if (direction == 1) {
        this.isIntro = false;
        if ((this.states.currentSlide < this.states.length - 1) && (this.states.currentSlide !== false) && (this.states.currentSlide < this.options.segments - 1)) {
          this.clearSliderStates();
          this.states.currentSlide = this.states.currentSlide + direction;
          this.bgsContainers[this.states.currentSlide].classList.add("forward");
          setTimeout(() => {
            this.bgsContainers[this.states.currentSlide].classList.add("active");
          }, 50);
          this.bgsContainers[this.states.currentSlide].classList.add("stop");
          ((this.states.currentSlide - 1) >= 0) ? this.bgsContainers[this.states.currentSlide - 1].classList.add("played") : this.bgsContainers[(this.states.length - 1)].classList.add("played");
          if(this.states.currentSlide < this.options.segments - 1) {
            this.progressSegments[this.states.currentSlide].classList.add("active")
          }else{
            this.scroll.classList.remove("active");
            this.progress.classList.add("hide")
          }
          this.clearTitles();
          if (this.titles[this.states.currentSlide]) this.titles[this.states.currentSlide].classList.add("active");
        }
      } else {
        if (this.states.currentSlide > 0) {
          this.clearSliderStates();
          this.bgsContainers[this.states.currentSlide].classList.add("played");
          this.states.currentSlide = this.states.currentSlide + direction;
          this.bgsContainers[this.states.currentSlide].classList.add("backward");
          setTimeout(() => {
            this.bgsContainers[this.states.currentSlide].classList.add("active");
          }, 50);

          if (this.states.currentSlide < this.options.segments - 2) {
            this.progressSegments[this.states.currentSlide + 1].classList.remove("active")
          }else{
            this.progress.classList.remove("hide");
            this.scroll.classList.add("active")
          };

          this.clearTitles();
          if (this.titles[this.states.currentSlide]) this.titles[this.states.currentSlide].classList.add("active");
        } else {
          setTimeout(() => {
            if (this.pauseTimer) clearTimeout(this.pauseTimer);
            this.clearSlider();
            this.clearTitles();
            this.clearSliderStates();
            document.body.classList.remove("disable-touch");
          }, 1000);

          document.body.classList.add("disable-touch");
          this.states.isdisablesScroll = true;
          this.states.currentSlide = 0;
          this.states.isPaused = true;
          this.isIntro = true;
          this.intro.classList.remove("close");
          this.cover.classList.remove("step-1", "step-2", "hide-left", "show-right");
          this.cover.classList.add("reverse");
          this.header.classList.remove("active");
        };
      }
    }
  }

  clearTitles = () => {
    this.titles.forEach((title) => {
      title.classList.remove("active");
    })
  }

  clearSliderStates = () => {
    this.bgsContainers.forEach((bgContainer) => {
      bgContainer.classList.remove("active");
      bgContainer.classList.remove("played");
      bgContainer.classList.remove("forward");
      bgContainer.classList.remove("backward");
    })
  }

  expandSlider = () => {

  }

  clearSlider = () => {
    this.states.currentSlide = 0;
    this.bgsContainers.forEach((bgContainer) => {
      bgContainer.classList.remove("active");
      bgContainer.classList.remove("stop");
      bgContainer.classList.remove("played");
      bgContainer.classList.remove("forward");
      bgContainer.classList.remove("backward");
    })
    this.progressSegments.forEach((progress) => {
      progress.classList.remove("active");
    })
    this.bgsContainers[this.states.currentSlide].classList.add("forward");
    this.bgsContainers[(this.states.length - 1)].classList.add("played");
    setTimeout(() => {
      this.bgsContainers[this.states.currentSlide].classList.add("active");
      this.bgsContainers[this.states.currentSlide].classList.add("stop");
    }, 50)

    this.clearTitles();
    if (this.titles[this.states.currentSlide]) this.titles[this.states.currentSlide].classList.add("active");
  }

  buildBgs() {
    this.bgsContainers = this.container.querySelectorAll(".cover-anim-bg");
    this.titles = this.container.querySelectorAll(".cover-anim-title");
    const segment = document.createElement("div");
    const bg = document.createElement("div");
    let segments = [];
    this.states.length = this.bgsContainers.length;

    segment.classList.add("cover-anim-bg-segment");

    this.bgsContainers.forEach((bgContainer, i) => {
      if (window.innerWidth > 991) {
        addCover(bgContainer, i, this);
      } else {
        if ((i < this.options.segments - 1 || i == this.states.length - 1)) {
          addCover(bgContainer, i, this);
        } else {
          this.titles[i].remove();
          bgContainer.remove();
        }
      }
    });

    this.bgsContainers = this.container.querySelectorAll(".cover-anim-bg");
    this.states.length = this.bgsContainers.length;

    function addCover(bgContainer, i, self) {
      let style = null;
      let img = null;
      segments[i] = [];

      img = bgContainer.querySelector("img");
      img ? style = 'background:url(' + img.src + ')' : style = 'background-color: #000';

      if (img) {
        img.remove()
      } else {
        bgContainer.setAttribute("style", "");
      };

      for (let y = 0; y < self.options.segments - 1; y++) {
        segments[i].push(segment.cloneNode());
        let temp = bg.cloneNode();
        temp.setAttribute("style", style);
        segments[i][y].appendChild(temp);
        bgContainer.appendChild(segments[i][y]);
      }
    }
  }

  buildBar() {
    this.progress = document.createElement("div");
    const segment = document.createElement("div");
    const bar = document.createElement("div");
    const label = document.createElement("div");

    this.progress.classList.add("cover-anim-progress");
    segment.classList.add("cover-anim-progress-segment");
    bar.classList.add("cover-anim-progress-bar");
    label.classList.add("cover-anim-progress-label");

    this.container.appendChild(this.progress);

    for (let i = 0; i < this.options.segments - 1; i++) {
      this.progressSegments.push(segment.cloneNode());
      let temp = label.cloneNode();
      if (i < this.bgsContainers.length) temp.innerHTML = "0" + (i + 1);
      this.progressSegments[i].appendChild(temp);
      this.progressSegments[i].appendChild(bar.cloneNode());
      this.progress.appendChild(this.progressSegments[i]);
    }

  }

  show() {
    this.bgsContainers[this.states.currentSlide].classList.add("forward");
    this.bgsContainers[this.states.currentSlide].classList.add("active");
  }

  play() {
    if (!this.played) {
      this.played = true;
      setInterval(() => {
        this.loop();
      }, this.options.slideDelay);
    } else {
      this.bgsContainers[this.states.currentSlide].classList.add("forward");
      this.bgsContainers[this.states.currentSlide].classList.add("active");
      this.states.isPaused = false;
    }

    this.bgsContainers[this.states.currentSlide].classList.add("stop");
    this.progressSegments[this.states.currentSlide].classList.add("active");
    this.titles[this.states.currentSlide].classList.add("active")
  }

  loop() {

    if (!this.states.isPaused && this.options.autoplay) {
      this.move(1);
    }
  }
}