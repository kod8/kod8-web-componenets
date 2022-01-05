const yerelGazetelerTemplate = document.createElement("template");
yerelGazetelerTemplate.innerHTML = `
<link rel="stylesheet" type="text/css" href="https://static.haber8.pro/assets/splide/css/splide.min.css" async="">
<div class="ust">
<h2 class="title">Yerel Gazeteler</h2>
<select class="city"></select>
</div>


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
      --title-border-radius:5px;
      --item-border-radius:5px;
        --gr1:linear-gradient(0deg, var(--birincil), #121212);
        font-family: 'Montserrat', sans-serif;
        display:block;
        color:var(--main);
        background: var(--gr1);
        padding: 2em 1em;
        border-radius: 5px;
    } 
    :host([type=grid]) .splide__list{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 1em!important;
      box-sizing: border-box;
    }

    :host([type=grid]) .splide__slide{
      margin-bottom: 2em;
    }

    :host([type=grid]) .splide__slide img{
      width:250px;
    }

    :host([type=grid]) .gazete.item span{
      bottom: 0;
      height: 5em;
      border-radius:0;
      display:flex;
      width:100%;
      color: #ffffff;
      background: #000000cc;
    }

    :host([type=grid]) .gazete.item:hover img, :host([type=grid]) .gazete.item:hover span{
      transform:unset;
    }

    .ust{
      z-index: 1;
    position: relative;
    margin-top: 0;
    margin-bottom: 2em;
    padding: 1em 2em;
    background: #fcfcfc1f;
    color: var(--light);
    border-radius: var(--title-border-radius);
    border-top: 5px solid var(--birincil);
    display: flex;
    align-items: center;
    justify-content: space-between;
    }

    .city {
      padding: 1em;
      border-radius: 7em;
      background: var(--birincil);
      color: white;
      border: navajowhite;
  }

    .title{
      margin:0
    }



    :host([title="hidden"]) .title{
      display:none;
    }

    .list{
    }

    .list .item{
      position: relative;
      color: var(--light);
      cursor: pointer;
      border-radius: var(--item-border-radius);
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
    border-radius: var(--item-border-radius);
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
      border-radius: var(--item-border-radius);
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


@media (min-width: 320px) and (max-width: 480px) {
  
  :host([type=grid]) .splide__slide img{
    width:100px;
  }

  :host([type=grid]) .splide__slide span{
    font-size:12px;
  }
  
}

</style>
`;

class yerelGazeteler extends HTMLElement {
  /*runs when element created*/
  constructor() {
    super();
    /* Create shadow dom and append content via template*/
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(yerelGazetelerTemplate.content.cloneNode(true));
    this.slider = this.shadowRoot.querySelector("#gazeteSlider");
    this.titleEl = this.shadowRoot.querySelector(".title");

    this.citySelectElement = this.shadowRoot.querySelector("select.city");

    this.list = this.shadowRoot.querySelector(".list .splide__list");
    this.handleData = this.handleData.bind(this);
    this.handleSelectInput = this.handleSelectInput.bind(this);
    this.loadExternalFile = this.loadExternalFile.bind(this);
    this.openModal = this.openModal.bind(this);
    //Initialize select element
    for (var plate in this.cities) {
      var option = document.createElement("option")
      option.value = plate;
      option.innerText = this.cities[plate].name;
      this.citySelectElement.appendChild(option);
    }
  }
    
  /* runs when element added to DOM*/
  connectedCallback() {
    var city = localStorage.getItem("gazete_city") || this.getAttribute("city") || "34";
    this.citySelectElement.value = city;
    this.fetchData(city);
    this.citySelectElement.addEventListener("change", this.handleSelectInput);

    var PICOMODALURL = "https://static.haber8.pro/assets/picoModal.js";
    var SPLIDEJSURL = "https://static.haber8.pro/assets/splide/js/splide.min.js";
    this.loadExternalFile(PICOMODALURL, "js", true);
    this.loadExternalFile(SPLIDEJSURL, "js", true, "fetchData");
  }
  
  /* runs when element removed from DOM*/
  disconnectedCallback() {
    this.citySelectElement.removeEventListener("change", this.handleSelectInput);

  }
    
  static get observedAttributes() {
    return ["city"];
  }
  
  attributeChangedCallback(name, oldVal, newVal) {
    if (name == "city") this.fetchData(newVal);
  }
    
  fetchData(plate) {
    const url = `https://service.kod8.app/data/gazeteler/yerel/${plate}.json`;
    fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(this.handleData);
  };

  handleData(data){
    const BASEDIR="https://service.kod8.app/data/gazeteler/yerel/";
    this.list.innerHTML="";
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

      if(this.getAttribute("type")=="grid"){
        this.splide.destroy();
      }
  }

  handleSelectInput(e) {
    if (this.getAttribute("city") !== e.target.value) {
      this.setAttribute("city", e.target.value);
      localStorage.setItem('gazete_city', e.target.value);
    }

    if(this.getAttribute("also-trigger")){
      var targetComponent=this.getAttribute("also-trigger");
      document.querySelectorAll(targetComponent).forEach(el=>el.changeCityFromOutside(e.target.value));
    }
  }

  changeCityFromOutside(city){
    var event = new Event('change');
    this.citySelectElement.value=city;
    this.citySelectElement.dispatchEvent(event);
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
  if (typeof fileref != "undefined"){
    document.getElementsByTagName("head")[0].appendChild(fileref);
  }
    
   if (cb){ fileref.addEventListener("load", function(){
      this[cb]();
    }.bind(this));
  }
}
  cities = { "1": { "plate": 1, "name": "ADANA", "slug": "adana" }, "2": { "plate": 2, "name": "ADIYAMAN", "slug": "adiyaman" }, "3": { "plate": 3, "name": "AFYONKARAHİSAR", "slug": "afyonkarahisar" }, "4": { "plate": 4, "name": "AĞRI", "slug": "agri" }, "5": { "plate": 5, "name": "AMASYA", "slug": "amasya" }, "6": { "plate": 6, "name": "ANKARA", "slug": "ankara" }, "7": { "plate": 7, "name": "ANTALYA", "slug": "antalya" }, "8": { "plate": 8, "name": "ARTVİN", "slug": "artvin" }, "9": { "plate": 9, "name": "AYDIN", "slug": "aydin" }, "10": { "plate": 10, "name": "BALIKESİR", "slug": "balikesir" }, "11": { "plate": 11, "name": "BİLECİK", "slug": "bilecik" }, "12": { "plate": 12, "name": "BİNGÖL", "slug": "bingol" }, "13": { "plate": 13, "name": "BİTLİS", "slug": "bitlis" }, "14": { "plate": 14, "name": "BOLU", "slug": "bolu" }, "15": { "plate": 15, "name": "BURDUR", "slug": "burdur" }, "16": { "plate": 16, "name": "BURSA", "slug": "bursa" }, "17": { "plate": 17, "name": "ÇANAKKALE", "slug": "canakkale" }, "18": { "plate": 18, "name": "ÇANKIRI", "slug": "cankiri" }, "19": { "plate": 19, "name": "ÇORUM", "slug": "corum" }, "20": { "plate": 20, "name": "DENİZLİ", "slug": "denizli" }, "21": { "plate": 21, "name": "DİYARBAKIR", "slug": "diyarbakir" }, "22": { "plate": 22, "name": "EDİRNE", "slug": "edirne" }, "23": { "plate": 23, "name": "ELAZIĞ", "slug": "elazig" }, "24": { "plate": 24, "name": "ERZİNCAN", "slug": "erzincan" }, "25": { "plate": 25, "name": "ERZURUM", "slug": "erzurum" }, "26": { "plate": 26, "name": "ESKİŞEHİR", "slug": "eskisehir" }, "27": { "plate": 27, "name": "GAZİANTEP", "slug": "gaziantep" }, "28": { "plate": 28, "name": "GİRESUN", "slug": "giresun" }, "29": { "plate": 29, "name": "GÜMÜŞHANE", "slug": "gumushane" }, "30": { "plate": 30, "name": "HAKKARİ", "slug": "hakkari" }, "31": { "plate": 31, "name": "HATAY", "slug": "hatay" }, "32": { "plate": 32, "name": "ISPARTA", "slug": "isparta" }, "33": { "plate": 33, "name": "MERSİN(İÇEL)", "slug": "mersin" }, "34": { "plate": 34, "name": "İSTANBUL", "slug": "istanbul" }, "35": { "plate": 35, "name": "İZMİR", "slug": "izmir" }, "36": { "plate": 36, "name": "KARS", "slug": "kars" }, "37": { "plate": 37, "name": "KASTAMONU", "slug": "kastamonu" }, "38": { "plate": 38, "name": "KAYSERİ", "slug": "kayseri" }, "39": { "plate": 39, "name": "KIRKLARELİ", "slug": "kirklareli" }, "40": { "plate": 40, "name": "KIRŞEHİR", "slug": "kirsehir" }, "41": { "plate": 41, "name": "KOCAELİ", "slug": "kocaeli" }, "42": { "plate": 42, "name": "KONYA", "slug": "konya" }, "43": { "plate": 43, "name": "KÜTAHYA", "slug": "kutahya" }, "44": { "plate": 44, "name": "MALATYA", "slug": "malatya" }, "45": { "plate": 45, "name": "MANİSA", "slug": "manisa" }, "46": { "plate": 46, "name": "KAHRAMANMARAŞ", "slug": "kahramanmaras" }, "47": { "plate": 47, "name": "MARDİN", "slug": "mardin" }, "48": { "plate": 48, "name": "MUĞLA", "slug": "mugla" }, "49": { "plate": 49, "name": "MUŞ", "slug": "mus" }, "50": { "plate": 50, "name": "NEVŞEHİR", "slug": "nevsehir" }, "51": { "plate": 51, "name": "NİĞDE", "slug": "nigde" }, "52": { "plate": 52, "name": "ORDU", "slug": "ordu" }, "53": { "plate": 53, "name": "RİZE", "slug": "rize" }, "54": { "plate": 54, "name": "SAKARYA", "slug": "sakarya" }, "55": { "plate": 55, "name": "SAMSUN", "slug": "samsun" }, "56": { "plate": 56, "name": "SİİRT", "slug": "siirt" }, "57": { "plate": 57, "name": "SİNOP", "slug": "sinop" }, "58": { "plate": 58, "name": "SİVAS", "slug": "sivas" }, "59": { "plate": 59, "name": "TEKİRDAĞ", "slug": "tekirdag" }, "60": { "plate": 60, "name": "TOKAT", "slug": "tokat" }, "61": { "plate": 61, "name": "TRABZON", "slug": "trabzon" }, "62": { "plate": 62, "name": "TUNCELİ", "slug": "tunceli" }, "63": { "plate": 63, "name": "ŞANLIURFA", "slug": "sanliurfa" }, "64": { "plate": 64, "name": "UŞAK", "slug": "usak" }, "65": { "plate": 65, "name": "VAN", "slug": "van" }, "66": { "plate": 66, "name": "YOZGAT", "slug": "yozgat" }, "67": { "plate": 67, "name": "ZONGULDAK", "slug": "zonguldak" }, "68": { "plate": 68, "name": "AKSARAY", "slug": "aksaray" }, "69": { "plate": 69, "name": "BAYBURT", "slug": "bayburt" }, "70": { "plate": 70, "name": "KARAMAN", "slug": "karaman" }, "71": { "plate": 71, "name": "KIRIKKALE", "slug": "kirikkale" }, "72": { "plate": 72, "name": "BATMAN", "slug": "batman" }, "73": { "plate": 73, "name": "ŞIRNAK", "slug": "sirnak" }, "74": { "plate": 74, "name": "BARTIN", "slug": "bartin" }, "75": { "plate": 75, "name": "ARDAHAN", "slug": "ardahan" }, "76": { "plate": 76, "name": "IĞDIR", "slug": "igdir" }, "77": { "plate": 77, "name": "YALOVA", "slug": "yalova" }, "78": { "plate": 78, "name": "KARABÜK", "slug": "karabuk" }, "79": { "plate": 79, "name": "KİLİS", "slug": "kilis" }, "80": { "plate": 80, "name": "OSMANİYE", "slug": "osmaniye" }, "81": { "plate": 81, "name": "DÜZCE", "slug": "duzce" } };

}

window.customElements.define("yerel-gazeteler", yerelGazeteler);
