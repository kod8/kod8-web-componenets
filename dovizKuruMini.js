const dovizKuruMiniTemplate = document.createElement("template");
dovizKuruMiniTemplate.innerHTML = `
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
        font-size:12px;
        border-radius:5px;
        color:var(--light);
        background:var(--darker);
        padding:.5em;
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
      margin:.5em;
      position:relative;
    }

    .birimler > div .title{
      font-size:1em;
      font-weight:200;
      text-align:end;
    }

    .birimler > .dolar .title:before{
      content: "$";
    
    }
    .birimler > .euro .title:before{
      content: "€";
    }
    .birimler > .dolar .title:before , .birimler > .euro .title:before{
      font-size: 4em;
      font-weight: 800;
      display: block;
      position: absolute;
      color: var(--dark);
      opacity: 0.75;
      top: -25%;
      z-index: 0;
      background: -webkit-linear-gradient(var(--darker), transparent);
     
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }


    .birimler > div .value{
      font-size:2em;
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
<div class="birimler">
    <div class="dolar">
      <div class="title">Dolar</div>
      <div class="value">■.■■</div>
    </div>
    <div class="euro">
      <div class="title">Euro</div>
      <div class="value">■.■■</div>
    </div>
    <div class="altin">
      <div class="title">Altın</div>
      <div class="value">■.■■</div>
    </div>
    <div class="bist">
      <div class="title">BIST</div>
      <div class="value">■.■■</div>
    </div>

</div>
`

class dovizKuruMini extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(dovizKuruMiniTemplate.content.cloneNode(true));

        this.dolarHTML = this.shadowRoot.querySelector(
            ".birimler .dolar .value"
        );

        this.euroHTML = this.shadowRoot.querySelector(
            ".birimler .euro .value"
        );
        this.altinHTML = this.shadowRoot.querySelector(
            ".birimler .altin .value"
        );
        this.bistHTML = this.shadowRoot.querySelector(
            ".birimler .bist .value"
        );

        this.renderData = this.renderData.bind(this);
    }

    connectedCallback() {
        //this.tableHTML = this.getAttribute("data-table-html") || defaultTableHTML;
        this.shadowRoot.querySelector(".birimler").classList.add("loading");
        this.fetchData();
    }

    disconnectedCallback() { }

    fetchData() {
        const url = `https://service.kod8.app/data/doviz/all.json`;
        fetch(url)
            .then(function (res) {
                return res.json();
            })
            .then(this.renderData);
    }

    renderData(data) {
    data=data.trthaber;
        var valueData = [
            data.dolar.value,
            data.euro.value,
            data.gram_altin.value,
            data.bist.value,
        ];
        var valueHTML = [
            this.dolarHTML,
            this.euroHTML,
            this.altinHTML,
            this.bistHTML,
        ];
        valueHTML.forEach((e, i) => (e.innerHTML = valueData[i]));

        this.shadowRoot.querySelector(".birimler").classList.remove("loading");
    }
}

window.customElements.define("doviz-kuru-mini", dovizKuruMini)
