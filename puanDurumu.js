const template = document.createElement("template");
template.innerHTML = `
<style>
    :root{
        background:green;
    } 
    
    .puanDurumu{
        background:green;
        width:100%;
    }

    table{
        width:100%;
        background:teal;
    }
    
    
</style>

<div class="puanDurumu">
    <h5 class = "title"> </h5>
</div>

</div>


`


class PuanDurumu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:"open"})
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        //this.tableHTML = this.getAttribute("data-table-html") || defaultTableHTML;
        

    }

    connectedCallback() {
        //this.tableHTML = this.getAttribute("data-table-html") || defaultTableHTML;

        //this.innerHTML = this.tableHTML;

        this.shadowRoot.querySelector(".puanDurumu h5.title").innerText = this.getAttribute("lig");
        this.shadowRoot.querySelector(".puanDurumu").innerHTML += this.getAttribute("data-table-html");



    }

    
}

var defaultTableHTML = 
`
    <p> hello </p>
    
`


window.customElements.define("puan-durumu", PuanDurumu)