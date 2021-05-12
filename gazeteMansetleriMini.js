const mansetTemplate = document.createElement("template");
mansetTemplate.innerHTML = `
<h2 class="title">Gazete Manşetleri</h2>
<div class="list"></div>
<style>
    :host{
      --light: #e1e1e1;
      --main: #6b6b6b;
      --dark: #5f5f5f;
      --darker: #212121;
        --gr1:linear-gradient(25deg, var(--darker), var(--dark));
        font-family: 'Montserrat', sans-serif;
        display:block;
        color:var(--main);
        background: var(--light);
        padding: 1em;
        border-radius: 5px;

        padding-top: 0;
    } 


    .title{
      z-index: 1;
      position:relative;
      width: fit-content;
      margin: 18px auto;

      margin-top: 0;
      padding: 30px 20px 15px 20px;
      background: var(--gr1);
      color: var(--light);
      border-radius: 0px 0px 15px 15px;
    }

    .list{
      display:flex;
      flex-wrap:wrap;
      justify-content: center;
    }

    .list .item{
      color:var(--light);
      background:var(--gr1);
      margin:5px;
      padding:5px 10px;
      cursor:pointer;
      border-radius: 5px;
      font-size: 12px;
    font-weight: 600;
    }
</style>
`;

class gazeteMansetleriMini extends HTMLElement {
  //runs when element created
  constructor() {
    super();
    // Create shadow dom and append content via template
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(mansetTemplate.content.cloneNode(true));
  
    this.list = this.shadowRoot.querySelector(".list");
    this.handleData = this.handleData.bind(this);
    this.loadExternalFile = this.loadExternalFile.bind(this);
    this.openModal = this.openModal.bind(this);
    
  }
    
  // runs when element added to DOM
  connectedCallback() {
    var PICOMODALURL = "https://static.haber8.pro/assets/picoModal.js"
    this.loadExternalFile(PICOMODALURL, "js", true);
    this.fetchData();
  }
  
  // runs when element removed from DOM
  disconnectedCallback() {
  
  }
    
  static get observedAttributes() {
    return ["pressType"];
  }
  
  attributeChangedCallback(name, oldVal, newVal) {
  
  }
    
  fetchData() {
    const url = `https://service.kod8.app/data/gazeteler/list.json`
    fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(this.handleData);
  };

  handleData(data){
    const BASEDIR="https://service.kod8.app/data/gazeteler/"
      for(const gazete of data){
        var el=document.createElement("div");
          el.classList.add("gazete");
          el.classList.add("item");
          el.innerHTML=gazete.name;
          el.dataset.image=BASEDIR+gazete.imageName+"_full.jpg"
          //todo thumb
          this.list.appendChild(el);
          el.addEventListener("click",this.openModal)
      }
  }

  openModal(e){
    /*console.log(e.target.dataset.image)*/
    var imageUrl=e.target.dataset.image;
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
        styles.padding = "0"
      }
    })
  
    modal.show();

  }





loadExternalFile(filename, filetype, isAsync) {
  if (filetype == "js") { //if filename is a external JavaScript file
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
    isAsync ? fileref.setAttribute("async", "") : "";
  }
  else if (filetype == "css") { //if filename is an external CSS file
    var fileref = document.createElement("link")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", filename)
    isAsync ? fileref.setAttribute("async", "") : "";
  }
  if (typeof fileref != "undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref)
}



}

window.customElements.define("gazete-mansetleri-mini", gazeteMansetleriMini);
