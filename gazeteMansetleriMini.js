const mansetTemplate = document.createElement("template");
mansetTemplate.innerHTML = `
<link rel="stylesheet" type="text/css" href="https://static.haber8.pro/assets/splide/css/splide.min.css" async="">

<h2 class="title">Gazete Manşetleri</h2>

<div id="gazeteSlider" class="list splide">
  <div class="splide__track">
      <div class="splide__list">

      </div>
  </div>
</div>

<style>
    :host{
      --light: #e1e1e1;
      --main: #6b6b6b;
      --dark: #5f5f5f;
      --darker: #212121;
        --gr1:linear-gradient(0deg, var(--birincil), #121212);
        font-family: 'Montserrat', sans-serif;
        display:block;
        color:var(--main);
        background: var(--gr1);
        padding: 2em 1em;
        border-radius: 5px;
    } 


    .title{
      z-index: 1;
    position: relative;
    width: fit-content;
    margin: 20px auto;
    margin-top: 0;
    padding: 10px 20px;
    background: #fcfcfc1f;
    color: var(--light);
    border-radius: 5px;
    border-top: 5px solid var(--birincil);
    }

    .list{
    }

    .list .item{
      position: relative;
      color: var(--light);
      cursor: pointer;
      border-radius: 5px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
    height: 100%;
    }

    .list .item img{    
      object-fit: cover;
    border-radius: 5px;
    width: 90%;
    height: inherit;
    box-shadow: 1px 1px 9px 0px #00000099;
    transition: all .25s ease;
    }

    .list .item:hover img{
      transform:scale(1.05);
    }

    .list .item span{    
      position: absolute;
      width: 90%;
      text-align: center;
      color: var(--light);
      background: hsl(0deg 0% 0% / 61%);
      cursor: pointer;
      border-radius: 5px;
      font-size: 150%;
      font-weight: 800;
      object-fit: cover;
      height: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
    }

    .list .item span{  
      display:none;
    }

    .list .item:hover span{  
      display:flex;
      transform: scale(1.05);
    }

    .list .item img{  
      filter:unset;
    }

    .splide__arrow {
      width: 3em;
      height: 3em;
      opacity: .8;
      background: var(--ikincil);
  }

</style>
`;

class gazeteMansetleriMini extends HTMLElement {
  /*runs when element created*/
  constructor() {
    super();
    /* Create shadow dom and append content via template*/
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(mansetTemplate.content.cloneNode(true));
    this.slider = this.shadowRoot.querySelector("#gazeteSlider");

    this.list = this.shadowRoot.querySelector(".list .splide__list");
    this.handleData = this.handleData.bind(this);
    this.loadExternalFile = this.loadExternalFile.bind(this);
    this.openModal = this.openModal.bind(this);
    
  }
    
  /* runs when element added to DOM*/
  connectedCallback() {
    var PICOMODALURL = "https://static.haber8.pro/assets/picoModal.js";
    var SPLIDEJSURL = "https://static.haber8.pro/assets/splide/js/splide.min.js";
    this.loadExternalFile(PICOMODALURL, "js", true);
    this.loadExternalFile(SPLIDEJSURL, "js", true, "fetchData");
  }
  
  /* runs when element removed from DOM*/
  disconnectedCallback() {
  
  }
    
  static get observedAttributes() {
    return ["pressType"];
  }
  
  attributeChangedCallback(name, oldVal, newVal) {
  
  }
    
  fetchData() {
    const url = `https://service.kod8.app/data/gazeteler/list.json`;
    fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(this.handleData);
  };

  handleData(data){
    const BASEDIR="https://service.kod8.app/data/gazeteler/";
      for(const gazete of data){
        var el=document.createElement("div");
          el.classList.add("splide__slide");
          el.innerHTML=`
          <div class="gazete item" data-image=${BASEDIR+gazete.imageName+"_full.jpg"}>
          <img src="${BASEDIR+gazete.imageName+"_thumb.jpg"}" alt="${gazete.name}">
          <span>${gazete.name}</span>
          </div>
          `;
          this.list.appendChild(el);
          el.addEventListener("click",this.openModal);
      }

      this.splide = new Splide( this.slider, {
        type:"slide",
        padding: {
          right: '5rem',
          left : '5rem',
        },
        rewind      : true,
        perPage:"3",
        perMove:"3",
        gap         : 20,
        pagination  : false,
        cover       : true,
        breakpoints: {
          '960': {
            padding: {
              right: '1rem',
              left : '1rem',
            },
          
            perPage: "3",
            perMove:"3"
          },

          '640': {
            padding: {
              right: '1rem',
              left : '1rem',
            },
          
            perPage: "2",
            perMove:"2"
          },
        }
      } ).mount();
  }

  openModal(e){
    /*console.log(e.target.dataset.image)*/
    var imageUrl=e.target.dataset.image ? e.target.dataset.image :e.target.closest(".gazete.item").dataset.image ;
    var name=e.target.innerText.trim();
    var modalContent = `
    <div class="gazeteImageContainer" style="height: 90vh;overflow-y: scroll;">
      <img src="${imageUrl}" title="${name}" style="width:100%"/>
    </div>
    `;
  
    var modal = picoModal({
      content: modalContent,
      overlayStyles: {
        backgroundColor: "#000",
        opacity: 0.75
      },
      closeHtml: "<span>X</span>",
      closeStyles: {
        position: "absolute",
        top: "25px",
        right: "25px",
        width:"40px",
        height:"40px",
        background: "var(--ikincil)",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: "800",
        border: "none",
        borderRadius: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      modalStyles: function (styles) {
        styles.width = '95vw';
        styles.display = "flex";
        styles.alignItems = "center";
        styles.justifyContent = "center";
        styles.padding = "0";
      }
    })
  
    modal.show();

  }


loadExternalFile(filename, filetype, isAsync,cb) {
  if (filetype == "js") {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
    isAsync ? fileref.setAttribute("async", "") : "";
  }
  else if (filetype == "css") {
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    isAsync ? fileref.setAttribute("async", "") : "";
  }
  if (typeof fileref != "undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref);
   if (cb){ fileref.addEventListener("load", function(){
      this[cb]();
    }.bind(this));
  }
}

}

window.customElements.define("gazete-mansetleri-mini", gazeteMansetleriMini);
