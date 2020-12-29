const puanDurumuTemplate = document.createElement("template");
puanDurumuTemplate.innerHTML = `
<link href="https://fonts.googleapis.com/css2?family=Changa:wght@300;400;600;800&display=swap" rel="stylesheet">
<style>
      :host{
      font-family: 'Changa', sans-serif;

        --light: #b0ade0;
        --lighter: #c3c1e6ff;
        --main: #36308aff;
        --dark: #686778ff;
        --darker: #2e2c4aff;

        --gr1:linear-gradient(90deg, var(--darker), var(--main));
        --gr2:linear-gradient(25deg, var(--light), var(--main));
        --gr3:linear-gradient(90deg, var(--light), var(--lighter));
        --gr4:linear-gradient(10deg, var(--light), var(--lighter));

        --cell-pad: 2.5px;
        display:block;
        font-size:12px;
        border-radius:10px;
        color:var(--main);
        background:var(--lighter);
        padding:1em;
    		background:var(--gr2);
    } 

    
    
    .puanDurumuHTML{
        width:100%;
    }

    .puanDurumuHTML.loading{
       
    }

    table{
        border-collapse: collapse;
        width:100%;
        line-height:1.2;
    }

    caption{
        background:var(--darker);
        color:var(--lighter);
        border-radius: 10px 10px 0 0;
        letter-spacing:2px;
    }

    caption h2{
      text-align:left;
      margin:0;
      padding:10px 20px;
      font-size:1.25em;
  }

    abbr{
        text-decoration:none;
    }

    table thead{
        background:var(--main);
        color:var(--lighter);
    }

    table tr td{
        margin:1em;
        font-weight:400;
    }

    table tr td:last-child{
      padding-right:1em;
      font-weight:600;
  }

    table tbody tr{
        background:var(--gr4);
    }

    table tr:nth-child(2n){
        color:var(--darker);
        background:var(--lighter)
    }

    table tbody tr.hl{
      background:var(--main);
      color:var(--lighter);
   }

    table tbody tr:hover{
      background:var(--main);
      color:var(--lighter);
  }


    table tr td, table tr th{
        text-align: center;
        cursor:pointer;
    }

    table tr td:nth-child(2),table tr th:nth-child(2){
        text-align: left;
    }

    table th{
        font-size:1.1em;
        padding:10px 5px;
    }

    table td{
        padding:var(--cell-pad) 2.5px;
    }

/*LOADING */

.loading table tr td
 {
	width: 100%;
	color: var(--lighter);
	position: relative;
	overflow: hidden;
}

.loading table tr td::before
 {
	content: "";
	width: 75%;
	height: 50%;
	position: absolute;
	left: 0;
  top: 25%;
  opacity:.25;
	background: linear-gradient(
		to right,
		transparent 0%,
      var(--main) 50%,
      transparent 100%
	);
	animation: placeholder 1s ease-in both infinite;
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

<div class="puanDurumuHTML">
    
</div>
`

class PuanDurumu extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(puanDurumuTemplate.content.cloneNode(true));
    //this.tableHTML = this.getAttribute("data-table-html") || defaultTableHTML;
    //this.shadowRoot.querySelector("h5.title").innerText = this.getAttribute("lig");
    this.shadowRoot.querySelector(".puanDurumuHTML").innerHTML = defaultTableHTML;

    this.setTableHTML = this.setTableHTML.bind(this);
    this.setTableHTMLFromJSON = this.setTableHTMLFromJSON.bind(this);

  }

  connectedCallback() {
    //this.tableHTML = this.getAttribute("data-table-html") || defaultTableHTML;
    this.shadowRoot.querySelector(".puanDurumuHTML").classList.add("loading");
    //this.fetchTableHTML(this.getAttribute("lig"))
    this.fetchTableJSON(this.getAttribute("lig"));
    if(this.getAttribute("theme")){
      this.setTheme(this.getAttribute("theme"));
    }
    //document.head.innerHTML += `<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Changa:wght@300;400;600;800&display=swap" rel="stylesheet">`;
  }

  disconnectedCallback() {
   
}

static get observedAttributes() {
	return ['hl', 'lig', 'theme'];
  }
 
 attributeChangedCallback(name,oldVal,newVal) {
	if(name == "hl") this.setHighlight();
  //else if(name == "lig") this.fetchTableHTML(newVal);
  else if(name == "lig") this.fetchTableJSON(newVal);
  else if(name == "theme") {
    this.setTheme(newVal);
  }
  
}

  fetchTableHTML(lig) {
    fetch(`https://raw.githubusercontent.com/kod8/haber8-scraper/main/data/spor/html/puan/${lig}.html`)
      .then(function (res) {
        return res.text();
      })
      .then(this.setTableHTML);
  };

  setTableHTML(html) {
    this.shadowRoot.querySelector(".puanDurumuHTML").innerHTML = html;
    this.shadowRoot
      .querySelector(".puanDurumuHTML")
      .classList.remove("loading");
    this.setHighlight();
  };

  fetchTableJSON(lig) {
    fetch(`https://raw.githubusercontent.com/kod8/haber8-scraper/main/data/spor/json/puan/${lig}.json`)
      .then(function (res) {
        return res.json();
      })
      .then(this.setTableHTMLFromJSON);
  };

  //Render by using json data

  setTableHTMLFromJSON(data) {
    var html = "";
    var table = document.createElement("table");
    table.innerHTML = `
    <caption><h2>${data.tableTitle}</h2></caption>
    <thead>
      <tr>
        ${
          data.columns.map(col=>{
            return `<th><abbr title=${this.abbr[col]}>${col}</abbr></th>`
          }).join("\n")
        } 
      </tr>
    </thead>
     <tbody>
    </tbody>
  `;

    data.list.forEach(function(team){
      var row = document.createElement("tr");
      var trInner = "";
      data.columns.forEach((col)=>{
        var cell = `<td>${team[col]}</td>`
        trInner+=cell;
      })
      row.innerHTML = trInner;
      table.querySelector("tbody").appendChild(row);
    })
    html=table.outerHTML
    this.setTableHTML(html);
  };


  setHighlight() {
    if (this.getAttribute("hl")) {
      var hl = this.getAttribute("hl");
      this.shadowRoot.querySelectorAll("tr td:nth-child(2)").forEach(function (team) {
		  if (team.innerText.trim() == hl) 
		  	team.closest("tr").classList.add("hl");
		  else 
		  	team.closest("tr").classList.remove("hl");
        });
    }
  };

  setTheme(themeID){
    if(this.themes[themeID]){
      for(var color in this.themes[themeID]){
        this.style.setProperty(color, this.themes[themeID][color])
      }
    }
  }

  themes = {
    "t1":{
      "--darker": "#27282E",
      "--dark": "#2E334A",
     "--main": "#0D1B61",
     "--light": "#6F81DE",
      "--lighter": "#F5F7FF"
    },
    "t2":{
      "--darker": "#00171F",
      "--dark": "#003459",
     "--main": "#007EA7",
     "--light": "#00A7E1",
      "--lighter": "#FFFFFF"
    }
    ,
    "t3":{
      "--darker": "#142916",
      "--dark": "#3B7A40",
     "--main": "#188B22",
     "--light": "#7AE183",
      "--lighter": "#B5E3BA"
    }, 
    "t4":{
      "--darker": "#6F81DE",
      "--dark": "#0D1B61",
     "--main": "#F5F7FF",
     "--light": "#2E334A",
      "--lighter": "#27282E"
    },
    "t5":{
      "--darker": "#76D076",
      "--dark": "#3DF53D",
     "--main": "#98dc98",
     "--light": "#0B470B",
      "--lighter": "#0B1E0B"
    }
  }

  abbr = {
    "S":"Sıra",
    "Takım":"Takım",
    "O":"Oynadığı Maç",
    "G":"Galibiyet",
    "B":"Beraberlik",
    "M":"Mağlubiyet",
    "A":"Attığı Gol",
    "Y":"Yediği Gol",
    "Av":"Averaj",
    "P":"Puan"
  }
}

var defaultTableHTML = 
`
<table class="liste">
<caption>
   <h2>- Puan Durumu</h2>
</caption>
<thead>
   <tr>
      <th><abbr title="Sıra">S</abbr></th>
      <th>Takım</th>
      <th><abbr title="Oynadığı Maç">O</abbr></th>
      <th><abbr title="Galibiyet">G</abbr></th>
      <th><abbr title="Beraberlik">B</abbr></th>
      <th><abbr title="Mağlubiyet">M</abbr></th>
      <th><abbr title="Attığı Gol">A</abbr></th>
      <th><abbr title="Yediği Gol">Y</abbr></th>
      <th><abbr title="Averaj">Av</abbr></th>
      <th><abbr title="Puan">P</abbr></th>
   </tr>
</thead>
<tbody>
   ${`<tr>${`<td>-</td>`.repeat(10)}</tr>`.repeat(21) }
</tbody>
</table>
    
`

window.customElements.define("puan-durumu", PuanDurumu)

 