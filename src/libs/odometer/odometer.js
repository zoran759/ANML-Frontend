export default class Odometer {
  constructor(element, options) {
    this.container = this.element = typeof element == "string" ? document.querySelector(element) : element;
    this.outer = null;
    this.Number = 0;
    this.transition = 500;
    this.options = {random: true};
    if (this.container) this.init();
  }

  init() {
    this.Number = Number(this.container.innerHTML)+1;
    this.outer = document.createElement("div");
    this.outer.classList.add("odometer-outer");
    if (this.options.random) this.transition = this.randomIntFromInterval(5, 10)*100;
    this.outer.style.transitionDuration = this.transition+"ms";
    this.container.innerHTML = '';
    this.container.appendChild(this.outer);
    this.buildNumbers();

    document.addEventListener("scroll", ()=>{
      if(this.isScrolledIntoView(this.container)) {
        this.container.classList.add("active");
      }
    });
  }

  randomIntFromInterval = (min, max) => { 
    return Math.floor(Math.random() * (max - min + 1) + min);
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

  buildNumbers = () => {

    for(let i=0; i<this.Number; i++){
      let n = document.createElement("div");
      n.innerHTML = i;
      this.outer.appendChild(n);
    }

  }
}