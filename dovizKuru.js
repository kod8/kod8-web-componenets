const dovizKuruTemplate = document.createElement("template");
dovizKuruTemplate.innerHTML = `
<link href="https://fonts.googleapis.com/css2?family=Changa:wght@300;400;600;800&display=swap" rel="stylesheet">
<style>
   :host * {
    font-family: 'Changa', sans-serif;

   }

    :host{
        --light: #91d5f2;
        --lighter: #ffffff;
        --main: #185f7dff;
        --dark: #10394a;
        --darker: #071728;
        --gr1:linear-gradient(180deg, var(--darker), var(--main));
        --gr2:linear-gradient(180deg, var(--light), var(--main));
        --gr3:linear-gradient(0deg, var(--darker), transparent);


        display:block;
        font-size:14px;
        border-radius:5px;
        color:var(--light);
        background:var(--darker);
        padding:1em 2em;
		  background:var(--gr1);
        height:100%;
        border-radius:5px;
    } 

    h5.title{
      font-size:1.5em;
      font-weight:300;
      margin:.5em 0;
      letter-spacing:.5em;
    }

    .birimler{
      display:flex;
      align-items:center;
      justify-content:space-around;
      position:relative;
      flex-grow:2;
      flex-wrap:wrap;
    }

    .birimler > div{
      margin:1em;
      position:relative;
    }

    .birimler > div > div{
      margin:.25em 0;
    }

    .birimler > div .title{
      font-size:1.55em;
      font-weight:400;
      text-align:end;
    }

    .birimler > .dolar .title:before{
      content: "$";
    
    }
    .birimler > .euro .title:before{
      content: "€";
    }
    .birimler > .dolar .title:before , .birimler > .euro .title:before{
      font-size: 5em;
      font-weight: 800;
      display: block;
      position: absolute;
      color: var(--dark);
      opacity: 0.5;
      top: -25px;
      z-index: 0;
      background: -webkit-linear-gradient(var(--darker), transparent);
     
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }


    .birimler > div .value{
      font-size:1.5em;
      font-weight:600;
      color:var(--lighter);
      text-align:end;
      position:relative;
    }

    .birimler > div .value.alis:before{
      content:"Alış";
      font-size:.65em;
      font-weight:300;
      color:var(--light);
      vertical-align:middle;
      padding-right:.5em;
    }

    .birimler > div .value.satis:before{
      content:"Satış";
      font-size:.65em;
      font-weight:300;
      color:var(--light);
      vertical-align:middle;
      padding-right:.5em;
    }

    
    

/*LOADING */

.loading.birimler div .value
 {
	width: 100%;
	color: var(--light);
	position: relative;
	overflow: hidden;
}

.loading.birimler div .value:after
 {
	content: "";
	width: 75%;
	height: 100%;
	position: absolute;
	left: 0;
  opacity:.75;
  color:white;
	background: linear-gradient(
		to right,
		  transparent 0%,
      var(--darker) 50%,
      transparent 100%
	);
	animation: placeholder .75s ease-in both infinite;
}

.loading.birimler div .value, .loading.birimler div .value:before{
  color:var(--main)
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

<h5 class = "title">DÖVİZ KURU</h5>
<div class="birimler">
    <div class="dolar">
      <div class="title">Dolar</div>
      <div class="value alis">■.■■</div>
      <div class="value satis">■.■■</div>
    </div>
    <div class="euro">
      <div class="title">Euro</div>
      <div class="value alis">■.■■</div>
      <div class="value satis">■.■■</div>
    </div>
    <div class="gram">
      <div class="title">Gram Altın</div>
      <div class="value alis">■.■■</div>
      <div class="value satis">■.■■</div>
    </div>
    <div class="ceyrek">
      <div class="title">Çeyrek Altın</div>
      <div class="value alis">■.■■</div>
      <div class="value satis">■.■■</div>
    </div>

</div>

`

class dovizKuru extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(dovizKuruTemplate.content.cloneNode(true));

    this.dolarAlisHTML = this.shadowRoot.querySelector(".birimler .dolar .value.alis");

    this.euroAlisHTML = this.shadowRoot.querySelector(".birimler .euro .value.alis") ;
    this.gramAlisHTML = this.shadowRoot.querySelector(".birimler .gram .value.alis") ;
    this.ceyrekAlisHTML = this.shadowRoot.querySelector(".birimler .ceyrek .value.alis") ;

    this.dolarSatisHTML = this.shadowRoot.querySelector(".birimler .dolar .value.satis");
    this.euroSatisHTML = this.shadowRoot.querySelector(".birimler .euro .value.satis") ;
    this.gramSatisHTML = this.shadowRoot.querySelector(".birimler .gram .value.satis") ;
    this.ceyrekSatisHTML = this.shadowRoot.querySelector(".birimler .ceyrek .value.satis") ;


    this.renderData = this.renderData.bind(this);

  }

  connectedCallback() {
    //this.tableHTML = this.getAttribute("data-table-html") || defaultTableHTML;
    this.shadowRoot.querySelector(".birimler").classList.add("loading");
    this.fetchData();

   
  }

  disconnectedCallback() {
   
}

  fetchData = function () {
    const url = `https://finans.truncgil.com/today.json`
    fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(this.renderData);
  };

  renderData = function (data) {
    var alisData = [data["ABD DOLARI"]["Alış"] ,data["EURO"]["Alış"], data["Gram Altın"]["Alış"], data["Çeyrek Altın"]["Alış"]]
    var alisHTML = [this.dolarAlisHTML, this.euroAlisHTML, this.gramAlisHTML, this.ceyrekAlisHTML]
    alisHTML.forEach((e,i)=>e.innerHTML = alisData[i] )
    var satisData = [data["ABD DOLARI"]["Satış"] ,data["EURO"]["Satış"], data["Gram Altın"]["Satış"], data["Çeyrek Altın"]["Satış"]];
    var satisHTML = [this.dolarSatisHTML, this.euroSatisHTML, this.gramSatisHTML, this.ceyrekSatisHTML]
    satisHTML.forEach((e,i )=>e.innerHTML = satisData[i] )

    this.shadowRoot.querySelector(".birimler").classList.remove("loading");
  };
}

window.customElements.define("doviz-kuru", dovizKuru)