export default class FlowImages {
  constructor(element) {
    this.selector = element;
    this.rowsCount = 2;
    this.baseSpeed = 0.02;
    this.isReady = false;
    this.rows = [];
    this.images = [];
    this.container = document.querySelector(element);
    if(this.container) this.init();
  }

  init() {
    this.images = this.container.querySelectorAll("img");
    this.container.innerHTML = '';

    for (let i = 0; i < this.rowsCount; i++) {
      let row = document.createElement("div");
      let imgW = document.createElement("div");
      let imgC = document.createElement("div");
      let clones = [];
      row.classList.add(this.selector.replace('.', '') + "-row");
      this.rows.push({ element: row, position: 0, direction: (this.rows[i - 1] ? this.rows[i - 1].direction * -1 : 1) });
      this.container.appendChild(this.rows[i].element);

      for (let y = 0; y < this.images.length / this.rowsCount; y++) {
        let wrapper = document.createElement("div");
        let z = this.images.length / this.rowsCount * i + y;
        let cloneImg = this.images[z].cloneNode();
        let cloneWrapper = wrapper.cloneNode();
        cloneWrapper.appendChild(cloneImg)
        wrapper.appendChild(this.images[z]);
        clones.push(cloneWrapper);
        imgW.appendChild(wrapper);
      }

      this.rows[i].element.appendChild(imgW);

      clones.forEach((clone) => {
        imgC.appendChild(clone);
      });

      this.rows[i].direction > 0 ? this.rows[i].element.appendChild(imgC) : this.rows[i].element.prepend(imgC);

      const elh = this.rows[i].element.offsetHeight;
      const wh = window.innerHeight;
      const perc = wh / (elh / 100);

      this.rows[i].startPosition = this.rows[i].direction > 0 ? -50 : 0;
      this.rows[i].position = this.rows[i].direction > 0 ? -50 : 0;
    }

    this.isReady = true;

    requestAnimationFrame(this.render);
  }

  render = () => {

    this.rows.forEach((row) => {
      if(row.direction>0) {
        row.position < 0 ? row.position += this.baseSpeed * row.direction : row.position = row.startPosition;
      }else{
        row.position > -50 ? row.position += this.baseSpeed * row.direction : row.position = row.startPosition;
      }
      
      
      row.element.style.transform = "translate3d(0," + row.position + "%, 0)";
    });

    requestAnimationFrame(this.render);
  }

  show() {
    this.isReady ? this.container.classList.add("active") : this.show();
  }

  hide() {
    this.container.classList.remove("active");
  }

}