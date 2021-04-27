const namazVaktiMiniTemplate = document.createElement("template");
namazVaktiMiniTemplate.innerHTML = `
<!--
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;400;800&display=swap" rel="stylesheet">
-->
<style>
   :host * {
      /*font-family: 'Manrope', sans-serif;*/
      /*font-family: 'Rajdhani', sans-serif;*/
    }

    :host{
      --detay:visible;
        --lighter: hsl(0, 0%, 100%);;
        --hue:220;
        padding:1em;
        
        --light: hsl(var(--hue), 70%, 90%);
    --main: hsl(var(--hue), 77%, 28%);
    --dark: hsl(var(--hue), 77%, 24%);
    --darker: hsl(var(--hue), 87%, 15%);
        --gr1:linear-gradient(180deg, var(--dark), var(--darker));
        --gr2:linear-gradient(180deg, var(--light), var(--main));
        --gr3:linear-gradient(0deg, var(--darker), transparent);
        --gr4:linear-gradient(0deg, var(--dark), transparent);


        display:flex;
        flex-direction:row;
        flex-wrap:wrap;
        align-items:stretch;
        justify-content:center;
        font-size:12px;
        border-radius:5px;
        color:var(--light);
        background:var(--main);
        position:relative;
    } 

    .timer{
      display:flex;
      align-items:center;
      justify-content:space-between;
      width:100%;
      margin-top:10px;
    }

    .timerLabel{
      font-size:1.5em;
      font-weight:200;
    }

    .timerValue{
      font-size:2em;
      font-weight:800;
    }

    .vakitler{
      position:absolute;
      top:105%;
      right:0;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      padding:1em;
      padding-left:0px;
      visibility:hidden;
      background:var(--main);
      border-radius:5px;

      flex-direction:row;
      width:400px;
    }

    :host(:hover) .vakitler{
      visibility:var(--detay);
      z-index: 800;
    }

    .vakitler .vakit{
      display:flex;
      flex-direction:column;
      margin:.25em 0;
      padding-left:10px;
      padding-right:10px;
      opacity:.3;
    }

    .vakitler .vakit.current{
      border-bottom:5px solid white;
      opacity:.6;
    }

    .vakitler .vakit.current + .vakit{
      border-bottom:5px solid lightgreen;
      opacity:1;
    }

    .vakitler .vakit .label{
     font-size:1em;
     font-weight:200;
    }

    .vakitler .vakit .value{
      font-size:1.5em;
      font-weight:800;
    }

    
    .city{
      background: var(--darker);
    font-size: 1em;
    font-weight: 400;
    color: var(--light);
    padding:.5em 1em;
    padding:0;
    letter-spacing: 2.5px;
    line-height: 13px;
    border: none;
    border-radius: 5px;
    width:100%;
    }


    

/*LOADING */

:host(.loading) .value
 {
	width: 100%;
	color: var(--light);
	position: relative;
	overflow: hidden;
}

:host(.loading) .value:before
 {
	content: "";
	width: 50%;
	height: 100%;
	position: absolute;
	left: 0;
  opacity:.75;
  color:var(--dark);
	background: linear-gradient(
		to right,
    transparent 0%,
      var(--light) 50%,
      transparent 100%
	);
	animation: placeholder .75s ease-in both infinite;
}

:host(.loading) .value, :host(.loading) .value:before{
  color:var(--dark);
  opacity:.5;
}

:host(.loading) .label:after, :host(.loading) .value:after, :host(.loading) .value:after{
  content:"";
}

@keyframes placeholder {
	0% {
		left: -100%;
	}
	100% {
		left: 100%;
	}
}		
</style>


    <select class="city"></select>

    <div class="row timer">
        <div class="timerLabel value">■■■■</div>
        <div class="timerValue value">■■:■■</div>
    </div>

    <div class="vakitler">
        <div class="vakit imsak">
          <div class="label">İmsak</div>
          <div class="value">■■:■■</div>
        </div>
        <div class="vakit gunes">
          <div class="label">Güneş</div>
          <div class="value">■■:■■</div>
      </div>
      <div class="vakit ogle">
        <div class="label">Öğle</div>
        <div class="value">■■:■■</div>
      </div>
      <div class="vakit ikindi">
        <div class="label">İkindi</div>
        <div class="value">■■:■■</div>
      </div>
      <div class="vakit aksam">
        <div class="label">Akşam</div>
        <div class="value">■■:■■</div>
      </div>
      <div class="vakit yatsi">
        <div class="label">Yatsı</div>
        <div class="value">■■:■■</div>
      </div>

    </div>

`;

class namazVaktiMini extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(namazVaktiMiniTemplate.content.cloneNode(true));

    this.citySelectElement = this.shadowRoot.querySelector("select.city");
    this.timerLabel = this.shadowRoot.querySelector(".timer .timerLabel");
    this.timerValue = this.shadowRoot.querySelector(".timer .timerValue");
    this.vakitlerDOM = this.shadowRoot.querySelector(".vakitler");


    this.handleData = this.handleData.bind(this);
    this.handleSelectInput = this.handleSelectInput.bind(this);
    this.timer = this.timer.bind(this);


    //Initialize select element
    for (var plate in this.cities) {
      var option = document.createElement("option")
      option.value = plate;
      option.innerText = this.cities[plate].name;
      this.citySelectElement.appendChild(option);
    }
  }

  connectedCallback() {
    var city = localStorage.getItem("namazCity") || this.getAttribute("city") || "34";
    this.citySelectElement.value = city;
    this.fetchData();
    this.citySelectElement.addEventListener("change", this.handleSelectInput);
    this.timerInterval = setInterval(this.timer, 1000);
  }

  disconnectedCallback() {
    this.citySelectElement.removeEventListener("change", this.handleSelectInput);
    clearInterval(this.timerInterval);
  }

  static get observedAttributes() {
    return ['city', 'theme'];
  }

  attributeChangedCallback(name, oldVal, newVal) {

    if (name == "city") this.fetchData(newVal);
    else if (name == "theme") {
      this.setTheme(newVal);
    }

  }

  fetchData(plate) {
    var city = plate || localStorage.getItem("namazCity") || this.getAttribute("city") || "34";

    const url = `https://service.kod8.app/api/namaz/${city}`

    fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(this.handleData);
  }

  handleData(data) {
    for (var vakit in data[0].vakitler) {
      var day = data[0].date.split("-");
      day[1] = Number(day[1]) - 1;
      let time1 = data[0].vakitler[vakit];
      this.vakitler[vakit].valueDateObj = new Date(...day, ...time1.split(":"));
      this.vakitler[vakit].value = time1;
    }
    var day2 = data[1].date.split("-");
    day2[1] = Number(day2[1]) - 1;
    var time2 = data[1].vakitler["imsak"];
    this.vakitler["imsak2"].valueDateObj = new Date(...day2, ...time2.split(":"));
    this.vakitler["imsak2"].value = time2;

    this.findVakit();
  };

  findVakit() {
    var now = new Date();
    var minDifference = -Infinity;
    var currentVakit = null;
    for (var vakit in this.vakitler) {
      let difference = this.vakitler[vakit].valueDateObj - now;
      if (difference > minDifference && difference < 0) {
        minDifference = difference;
        currentVakit = vakit;
      }
    }

    this.currentVakit = currentVakit;

    this.renderCity();
  }

  renderCity(plate) {
    this.classList.add("loading");
    this.vakitlerDOM.querySelector(`.${this.currentVakit}`).classList.add("current");

    for (var vakit in this.vakitler) {
      if (vakit == "imsak2") continue;
      this.vakitlerDOM.querySelector(`.${vakit} .value`).innerText = this.vakitler[vakit].value;
    }
    var next = this.getAttribute("ramazan") == "" ? this.vakitler[this.currentVakit].nextRamazan : this.vakitler[this.currentVakit].next

    this.timerLabel.innerText = this.vakitler[next].label
    if (this.getAttribute("ramazan") == "" && next == "aksam") {
      this.timerLabel.innerText = "İftar'a"
    }




    this.classList.remove("loading");
  }

  timer() {
    var next;
    if (this.currentVakit == null) { next = "imsak"; }
    else {
      next = this.getAttribute("ramazan") == "" ? this.vakitler[this.currentVakit].nextRamazan : this.vakitler[this.currentVakit].next
    }

    var now = new Date();
    var nextDateObj = this.vakitler[next].valueDateObj;
    var diff = Math.round((nextDateObj.getTime() - now.getTime()) / 60000);
    var hour = Math.floor((diff / 60));
    var min = Math.floor(diff % 60);
    var remainingText = String(hour).padStart(2, '0') + ":" + String(min).padStart(2, '0');
    this.timerValue.innerText = remainingText;
    if (diff < 0) {
      this.findVakit();
    }


  }

  setTheme(themeID) {
    if (this.themes[themeID]) {
      this.style.setProperty("--hue", this.themes[themeID])
    }
    else {
      this.style.setProperty("--hue", themeID)
    }
  }

  handleSelectInput(e) {
    if (this.getAttribute("city") !== e.target.value) {
      this.setAttribute("city", e.target.value);
      localStorage.setItem('namazCity', e.target.value);
    }
  }

  themes = {
    "mavi": "220",
    "lacivert": "249",
    "mor": "282",
    "turkuaz": "182",
    "kirmizi": "7",
    "kahve": "35"
  }

  vakitler = {
    "imsak": {
      name: "İmsak",
      label: "İmsak'a",
      value: "",
      valueDateObj: "",
      icon: "",
      next: "gunes",
      nextRamazan: "aksam"
    },
    "gunes": {
      name: "Güneş",
      label: "Güneş'e",
      value: "",
      valueDateObj: "",
      icon: "",
      next: "ogle",
      nextRamazan: "aksam"
    },
    "ogle": {
      name: "Öğle",
      label: "Öğle'ye",
      value: "",
      valueDateObj: "",
      icon: "",
      next: "ikindi",
      nextRamazan: "aksam"
    },
    "ikindi": {
      name: "İkindi",
      label: "İkindi'ye",
      value: "",
      valueDateObj: "",
      icon: "",
      next: "aksam",
      nextRamazan: "aksam"
    },
    "aksam": {
      name: "Akşam",
      label: "Akşam'a",
      value: "",
      valueDateObj: "",
      icon: "",
      next: "yatsi",
      nextRamazan: "imsak2"
    },
    "yatsi": {
      name: "Yatsı",
      label: "Yatsı'ya",
      value: "",
      valueDateObj: "",
      icon: "",
      next: "imsak2",
      nextRamazan: "imsak2"
    },
    "imsak2": {
      name: "İmsak",
      label: "İmsak'a",
      value: "",
      valueDateObj: "",
      icon: "",
      next: "gunes",
      nextRamazan: "aksam"
    }
  }


  cities = { "1": { "plate": 1, "name": "ADANA", "slug": "adana" }, "2": { "plate": 2, "name": "ADIYAMAN", "slug": "adiyaman" }, "3": { "plate": 3, "name": "AFYONKARAHİSAR", "slug": "afyonkarahisar" }, "4": { "plate": 4, "name": "AĞRI", "slug": "agri" }, "5": { "plate": 5, "name": "AMASYA", "slug": "amasya" }, "6": { "plate": 6, "name": "ANKARA", "slug": "ankara" }, "7": { "plate": 7, "name": "ANTALYA", "slug": "antalya" }, "8": { "plate": 8, "name": "ARTVİN", "slug": "artvin" }, "9": { "plate": 9, "name": "AYDIN", "slug": "aydin" }, "10": { "plate": 10, "name": "BALIKESİR", "slug": "balikesir" }, "11": { "plate": 11, "name": "BİLECİK", "slug": "bilecik" }, "12": { "plate": 12, "name": "BİNGÖL", "slug": "bingol" }, "13": { "plate": 13, "name": "BİTLİS", "slug": "bitlis" }, "14": { "plate": 14, "name": "BOLU", "slug": "bolu" }, "15": { "plate": 15, "name": "BURDUR", "slug": "burdur" }, "16": { "plate": 16, "name": "BURSA", "slug": "bursa" }, "17": { "plate": 17, "name": "ÇANAKKALE", "slug": "canakkale" }, "18": { "plate": 18, "name": "ÇANKIRI", "slug": "cankiri" }, "19": { "plate": 19, "name": "ÇORUM", "slug": "corum" }, "20": { "plate": 20, "name": "DENİZLİ", "slug": "denizli" }, "21": { "plate": 21, "name": "DİYARBAKIR", "slug": "diyarbakir" }, "22": { "plate": 22, "name": "EDİRNE", "slug": "edirne" }, "23": { "plate": 23, "name": "ELAZIĞ", "slug": "elazig" }, "24": { "plate": 24, "name": "ERZİNCAN", "slug": "erzincan" }, "25": { "plate": 25, "name": "ERZURUM", "slug": "erzurum" }, "26": { "plate": 26, "name": "ESKİŞEHİR", "slug": "eskisehir" }, "27": { "plate": 27, "name": "GAZİANTEP", "slug": "gaziantep" }, "28": { "plate": 28, "name": "GİRESUN", "slug": "giresun" }, "29": { "plate": 29, "name": "GÜMÜŞHANE", "slug": "gumushane" }, "30": { "plate": 30, "name": "HAKKARİ", "slug": "hakkari" }, "31": { "plate": 31, "name": "HATAY", "slug": "hatay" }, "32": { "plate": 32, "name": "ISPARTA", "slug": "isparta" }, "33": { "plate": 33, "name": "MERSİN(İÇEL)", "slug": "mersin" }, "34": { "plate": 34, "name": "İSTANBUL", "slug": "istanbul" }, "35": { "plate": 35, "name": "İZMİR", "slug": "izmir" }, "36": { "plate": 36, "name": "KARS", "slug": "kars" }, "37": { "plate": 37, "name": "KASTAMONU", "slug": "kastamonu" }, "38": { "plate": 38, "name": "KAYSERİ", "slug": "kayseri" }, "39": { "plate": 39, "name": "KIRKLARELİ", "slug": "kirklareli" }, "40": { "plate": 40, "name": "KIRŞEHİR", "slug": "kirsehir" }, "41": { "plate": 41, "name": "KOCAELİ", "slug": "kocaeli" }, "42": { "plate": 42, "name": "KONYA", "slug": "konya" }, "43": { "plate": 43, "name": "KÜTAHYA", "slug": "kutahya" }, "44": { "plate": 44, "name": "MALATYA", "slug": "malatya" }, "45": { "plate": 45, "name": "MANİSA", "slug": "manisa" }, "46": { "plate": 46, "name": "KAHRAMANMARAŞ", "slug": "kahramanmaras" }, "47": { "plate": 47, "name": "MARDİN", "slug": "mardin" }, "48": { "plate": 48, "name": "MUĞLA", "slug": "mugla" }, "49": { "plate": 49, "name": "MUŞ", "slug": "mus" }, "50": { "plate": 50, "name": "NEVŞEHİR", "slug": "nevsehir" }, "51": { "plate": 51, "name": "NİĞDE", "slug": "nigde" }, "52": { "plate": 52, "name": "ORDU", "slug": "ordu" }, "53": { "plate": 53, "name": "RİZE", "slug": "rize" }, "54": { "plate": 54, "name": "SAKARYA", "slug": "sakarya" }, "55": { "plate": 55, "name": "SAMSUN", "slug": "samsun" }, "56": { "plate": 56, "name": "SİİRT", "slug": "siirt" }, "57": { "plate": 57, "name": "SİNOP", "slug": "sinop" }, "58": { "plate": 58, "name": "SİVAS", "slug": "sivas" }, "59": { "plate": 59, "name": "TEKİRDAĞ", "slug": "tekirdag" }, "60": { "plate": 60, "name": "TOKAT", "slug": "tokat" }, "61": { "plate": 61, "name": "TRABZON", "slug": "trabzon" }, "62": { "plate": 62, "name": "TUNCELİ", "slug": "tunceli" }, "63": { "plate": 63, "name": "ŞANLIURFA", "slug": "sanliurfa" }, "64": { "plate": 64, "name": "UŞAK", "slug": "usak" }, "65": { "plate": 65, "name": "VAN", "slug": "van" }, "66": { "plate": 66, "name": "YOZGAT", "slug": "yozgat" }, "67": { "plate": 67, "name": "ZONGULDAK", "slug": "zonguldak" }, "68": { "plate": 68, "name": "AKSARAY", "slug": "aksaray" }, "69": { "plate": 69, "name": "BAYBURT", "slug": "bayburt" }, "70": { "plate": 70, "name": "KARAMAN", "slug": "karaman" }, "71": { "plate": 71, "name": "KIRIKKALE", "slug": "kirikkale" }, "72": { "plate": 72, "name": "BATMAN", "slug": "batman" }, "73": { "plate": 73, "name": "ŞIRNAK", "slug": "sirnak" }, "74": { "plate": 74, "name": "BARTIN", "slug": "bartin" }, "75": { "plate": 75, "name": "ARDAHAN", "slug": "ardahan" }, "76": { "plate": 76, "name": "IĞDIR", "slug": "igdir" }, "77": { "plate": 77, "name": "YALOVA", "slug": "yalova" }, "78": { "plate": 78, "name": "KARABÜK", "slug": "karabuk" }, "79": { "plate": 79, "name": "KİLİS", "slug": "kilis" }, "80": { "plate": 80, "name": "OSMANİYE", "slug": "osmaniye" }, "81": { "plate": 81, "name": "DÜZCE", "slug": "duzce" } };

}

window.customElements.define("namaz-vakti-mini", namazVaktiMini)

