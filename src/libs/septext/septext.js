export default class SepText {
  constructor() {
    this.texts = [];
    this.init();
    this.isReady = false;
  }

  init() {
    this.texts = document.querySelectorAll("[data-sep]");

    this.texts.forEach((text) => {
      let words = null;
      words = text.innerHTML.split('');
      text.innerHTML = '';

      words.forEach((word) => {
        let wraper = document.createElement("div");
        wraper.classList.add("d" + this.getRandom(3))
        word != ' ' ? wraper.innerHTML = word : wraper.innerHTML = "&nbsp;";
        text.appendChild(wraper);
      });
    })

    this.isReady = true;
  }

  play() {

    this.texts.forEach((text) => {
      text.classList.add("play");
    })

  }

  getRandom = (n) => {
    return Math.floor(Math.random() * n);
  }
}