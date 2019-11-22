export default class MaskCarousel {
  constructor(element, options) {
    this.selector = element;
    this.containers = [];
    this.items = null;
    this.controls = null;
    this.current = 0;
    this.previous = null;
    this.options = options;
    this.isDirection = false;
    if (this.selector) this.init();
  }

  init() {

    let containers = document.querySelectorAll(".mask-carousel");

    containers.forEach((container, i)=>{
      this.containers.push({container: container, items: container.querySelectorAll(".mask-carousel-items > div")})
      this.containers[i].items[this.current].classList.add("active");
    });

    this.previous = null;
    this.buildControls();

    if(this.options.autoplay) {
      setInterval(() => {
        this.clear();
        this.current + 1 < this.items.length ? this.current++ : this.current = 0;
        this.items[this.current].classList.add("active")
      }, 2000);
    }

  }

  buildControls = () => {
    let contrContainer = document.createElement("div");
    let left = document.createElement("div");
    let right = document.createElement("div");
    let controllContainer = this.containers[this.options.controlsContainer];

    left.classList.add("mask-carousel-control-left");
    right.classList.add("mask-carousel-control-right");

    left.innerHTML = this.options.controls[0];
    right.innerHTML = this.options.controls[1];

    contrContainer.classList.add("mask-carousel-controls");
    contrContainer.appendChild(left);
    contrContainer.appendChild(right);

    controllContainer.container.appendChild(contrContainer);

    right.addEventListener("click", ()=>{
      this.previous = this.current;
      this.current + 1 < controllContainer.items.length ? this.current++ : this.current = 0;
      this.setCurrent("forward");
      if(!this.isDirection) right.click();
      this.isDirection = true;
    });

    left.addEventListener("click", ()=>{
      this.previous = this.current;
      this.current - 1 > -1 ? this.current-- : this.current = controllContainer.items.length-1;
      this.setCurrent("backward");
      if(this.isDirection) left.click();
      this.isDirection = false;
    });
  }

  setCurrent = (direction) => {
    this.clear();
    this.containers.forEach((container)=>{
      container.items[this.previous].classList.add(direction);
      container.items[this.current].classList.add(direction);
    })
  }

  clear = () => {
    this.containers.forEach((container)=>{
      container.items.forEach((item) => {
        item.classList.remove("previous");
        item.classList.remove("forward");
        item.classList.remove("backward");
      })
    })
  }
}