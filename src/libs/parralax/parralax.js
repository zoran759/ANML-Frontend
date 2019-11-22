export default class Parralax {
  constructor(element, options) {
    this.element = typeof element == "string" ? document.querySelector(element) : element;
    this.options = { ratio: 0.2, speed: 1 };
    this.isInViewport = false;
    this.position = 0;
    this.current = 0;
    this.bgPosition = window.innerHeight;
    this.last = 0;
    if (this.element) this.init();
  }

  init() {
    this.loop();

    this.element.style.backgroundPosition = "center " + this.bgPosition*this.options.ratio + "px";

    document.addEventListener("scroll", (e) => {
      this.position = this.last - this.getScroll()[1];
      this.last = this.getScroll()[1];

      if (this.isScrolledIntoView(this.element)) {
        this.bgPosition += this.position;
        this.element.style.backgroundPosition = "center " + this.bgPosition*this.options.ratio + "px";
      }

    });
  }

  loop = () => {
    requestAnimationFrame(this.loop);
  }

  getScroll = () => {
    if (window.pageYOffset != undefined) {
      return [pageXOffset, pageYOffset];
    } else {
      var sx, sy, d = document,
        r = d.documentElement,
        b = d.body;
      sx = r.scrollLeft || b.scrollLeft || 0;
      sy = r.scrollTop || b.scrollTop || 0;
      return [sx, sy];
    }
  }

  isScrolledIntoView = (el) => {
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

}