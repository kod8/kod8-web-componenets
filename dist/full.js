const havaDurumuMiniTemplate = document.createElement("template");
havaDurumuMiniTemplate.innerHTML = `<!-- <link href="https://fonts.googleapis.com/css2?family=Changa:wght@300;400;600;800&display=swap" rel="stylesheet">--><style>:host * {font-family: var(--family);}:host{--lighter: hsl(0, 0%, 100%);--cityVisible:block;--family:"montserrat";--hue:220;padding:1em;--light: hsl(var(--hue), 43%, 81%);--main: hsl(var(--hue), 77%, 74%);--dark: hsl(var(--hue), 77%, 34%);--darker: hsl(var(--hue), 77%, 17%);--gr1:linear-gradient(180deg, var(--dark), var(--darker));--gr2:linear-gradient(180deg, var(--light), var(--main));--gr3:linear-gradient(0deg, var(--darker), transparent);--gr4:linear-gradient(0deg, var(--dark), transparent);display:flex;flex-direction:row;flex-wrap:wrap;align-items:stretch;justify-content:center;font-size:12px;border-radius:10px;color:var(--light);background:var(--darker);background:var(--gr1);} .city{display:var(--cityVisibile);font-family: var(--family);font-size: 1.4em;font-weight: 800;padding:0 .5em;padding:0letter-spacing: 2.5px;line-height: 13px;border: none;border-radius: 5px;margin-bottom:10px;}.today{display:flex;flex-direction:column;align-items:stretch;justify-content:space-between;flex-grow:2;}.today .row{position:relative;display:flex;justify-content: space-between;align-items:center;}.today .row div{margin:0 5px;}.today .degree{font-size:4em;font-weight:800;min-width:30%;color:var(--lighter);}.today .condition{font-size:1em;font-weight:400;color:var(--lighter);flex-grow:2;text-align:end;}.today .icon{width:75px;min-width:15%;}.days .item {padding:1em 1em;display:flex;flex-direction:column;align-items:center;justify-content:space-around;background:var(--gr4);margin:0 1em;}.days .item .dayName{font-size:1.25em;}.days .item .icon{width:2.25em;}.days .item .maxDegree, .days .item .minDegree{font-size:1.25em;font-weight:800;}.days .item .maxDegree{color:var(--lighter);}.days .item .minDegree{color:var(--light);}.degree, .minDegree, .maxDegree {position:relative;}.degree:after {content:"c°";font-size:.5em;font-weight:400;position:absolute;top:0;color:var(--lighter)}.minDegree:after, .maxDegree:after {content:"c°";font-size:.5em;font-weight:400;position:absolute;}/*LOADING */:host(.loading) .val{width: 100%;color: var(--light);position: relative;overflow: hidden;}:host(.loading) .val:before{content: "";width: 50%;height: 100%;position: absolute;left: 0;opacity:.75;color:var(--dark);background: linear-gradient(to right,transparent 0%,var(--light) 50%,transparent 100%);animation: placeholder .75s ease-in both infinite;}:host(.loading) .val, :host(.loading) .val:before{color:var(--dark);opacity:.5;}:host(.loading) .degree:after, :host(.loading) .minDegree:after, :host(.loading) .maxDegree:after{content:"";}@keyframes placeholder {0% {left: -100%;}100% {left: 100%;}} </style><div class="today"><select class="city"></select><div class="row"><div class="val icon"></div><div class="val degree">■■</div><div class="val condition">■■■ ■■■■■</div></div></div>`;
class havaDurumuMini extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: "open"
        });
        this.shadowRoot.appendChild(havaDurumuMiniTemplate.content.cloneNode(true));
        this.citySelectElement = this.shadowRoot.querySelector("select.city");
        this.todayDegreeElement = this.shadowRoot.querySelector(".today .degree");
        this.todayConditionElement = this.shadowRoot.querySelector(".today .condition");
        this.todayIconElement = this.shadowRoot.querySelector(".today .icon");
        this.dayOrNight = ((new Date()).getHours()) - 6 < 12 ? "day" : "night";
        this.handleData = this.handleData.bind(this);
        this.handleSelectInput = this.handleSelectInput.bind(this);
        
		this.themes = {
        "mavi": "220",
        "lacivert": "249",
        "mor": "282",
        "turkuaz": "182",
        "kirmizi": "7",
        "kahve": "35"
    };
    this.conditions = {
        "Açık": {
            icon: "1",
            general: "clear",
        },
        "Az Bulutlu": {
            icon: "2",
            general: "cloudy",
        },
        "Parçalı Bulutlu": {
            icon: "2",
            general: "cloudy",
        },
        "Çok Bulutlu": {
            icon: "3",
            general: "cloudy",
        },
        "Puslu": {
            icon: "8",
            general: "misty",
        },
        "Sisli": {
            icon: "8",
            general: "misty",
        },
        "Duman": {
            icon: "8",
            general: "misty",
        },
        "Rüzgarlı": {
            icon: "10",
            general: "windy",
        },
        "Toz veya Kum Fırtınası": {
            icon: "10",
            general: "windy",
        },
        "Dolu": {
            icon: "11",
            general: "hail",
        },
        "Hafif Yağmurlu": {
            icon: "12",
            general: "drizzle",
        },
        "Hafif Sağanak Yağışlı": {
            icon: "12",
            general: "drizzle",
        },
        "Yağmurlu": {
            icon: "4",
            general: "rainy",
        },
        "Sağanak Yağışlı": {
            icon: "4",
            general: "rainy",
        },
        "Kuvvetli Yağmurlu": {
            icon: "4",
            general: "rainy",
        },
        "Gökgürültülü Sağanak Yağışlı": {
            icon: "5",
            general: "thunder",
        },
        "Kuvvetli Sağanak Yağışlı": {
            icon: "4",
            general: "rainy",
        },
        "Kuvvetli Gökgürültülü Sağanak Yağışlı": {
            icon: "4",
            general: "rainy",
        },
        "Kar Yağışlı": {
            icon: "6",
            general: "snow",
        },
        "Hafif Kar Yağışlı": {
            icon: "9",
            general: "snow",
        },
        "Yoğun Kar Yağışlı": {
            icon: "9",
            general: "snow",
        },
        "Karla Karışık Yağmurlu": {
            icon: "6",
            general: "snow",
        },
    };
    this.days = {
        "Pazartesi": "Pt",
        "Salı": "Sa",
        "Çarşamba": "Ça",
        "Perşembe": "Pe",
        "Cuma": "Cu",
        "Cumartesi": "Ct",
        "Pazar": "Pa",
    };
    this.weatherIcons = {
        "1": {
            "day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g><circle cx="32" cy="32" r="11.64" fill="#f4a71d"/><path fill="none" stroke="#f4a71d" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M32 15.71V9.5M32 54.5v-6.21M43.52 20.48l4.39-4.39M16.09 47.91l4.39-4.39M20.48 20.48l-4.39-4.39M47.91 47.91l-4.39-4.39M15.71 32H9.5M54.5 32h-6.21"/><animateTransform attributeName="transform" dur="45s" from="0 32 32" repeatCount="indefinite" to="360 32 32" type="rotate"/></g></svg>`,
            "night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g><path fill="#72b9d5" stroke="#72b9d5" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M46.66 36.2a16.66 16.66 0 01-16.78-16.55 16.29 16.29 0 01.55-4.15A16.56 16.56 0 1048.5 36.1c-.61.06-1.22.1-1.84.1z"/><animateTransform attributeName="transform" dur="10s" repeatCount="indefinite" type="rotate" values="-5 32 32;15 32 32;-5 32 32"/></g></svg>`
        },
        "2": {
            "day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><path fill="none" d="M10.55 34.21l-3.83-3.42-2-6 1-7 4-5 5-3h6l5 1 3 3 2.56 4.36-4.56 4.64h-5l-5 5v3l-6.17 3.42z"/></clipPath></defs><g clip-path="url(#a)"><g><circle cx="19.22" cy="24.29" r="5.95" fill="#f4a71d"/><path fill="none" stroke="#f4a71d" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M19.22 15.97v-3.18M19.22 35.79v-3.17M25.11 18.4l2.24-2.24M11.09 32.42l2.24-2.24M13.33 18.4l-2.24-2.24M27.35 32.42l-2.24-2.24M10.89 24.29H7.72M30.72 24.29h-3.17"/><animateTransform attributeName="transform" dur="45s" from="0 19.22 24.293" repeatCount="indefinite" to="360 19.22 24.293" type="rotate"/></g></g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/></svg>`,
            "night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><path fill="none" d="M10.55 34.21l-3.83-3.42-2-6 1-7 4-5 5-3h6l5 1 3 3 2.56 4.36-4.56 4.64h-5l-5 5v3l-6.17 3.42z"/></clipPath></defs><g clip-path="url(#a)"><g><path fill="#72b9d5" stroke="#72b9d5" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M29.33 27.13A10.6 10.6 0 0118.65 16.6 10.44 10.44 0 0119 14a10.54 10.54 0 1011.5 13.07 11.46 11.46 0 01-1.17.06z"/><animateTransform attributeName="transform" dur="10s" repeatCount="indefinite" type="rotate" values="-10 19.22 24.293;10 19.22 24.293;-10 19.22 24.293"/></g></g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/></svg>`
        },
        "3": {
            "day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/><animateTransform attributeName="transform" dur="7s" repeatCount="indefinite" type="translate" values="-3 0; 3 0; -3 0"/></g></svg>`,
            "night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/><animateTransform attributeName="transform" dur="7s" repeatCount="indefinite" type="translate" values="-3 0; 3 0; -3 0"/></g></svg>`
        },
        "4": {
            "day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><path fill="none" d="M42 64l2.85-17h-23.8L17 64"/></clipPath></defs><g clip-path="url(#a)"><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M24.52 49.05l-1.04 5.9"/><animateTransform attributeName="transform" dur="0.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" dur="0.5s" repeatCount="indefinite" values="1;1;0"/></g><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M31.52 49.05l-1.04 5.9"/><animateTransform attributeName="transform" begin="-0.3s" dur="0.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" begin="-0.3s" dur="0.5s" repeatCount="indefinite" values="1;1;0"/></g><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M38.52 49.05l-1.04 5.9"/><animateTransform attributeName="transform" begin="-0.1s" dur="0.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" begin="-0.1s" dur="0.5s" repeatCount="indefinite" values="1;1;0"/></g></g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/></svg>`,
            "night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><path fill="none" d="M42 64l2.85-17h-23.8L17 64"/></clipPath></defs><g clip-path="url(#a)"><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M24.52 49.05l-1.04 5.9"/><animateTransform attributeName="transform" dur="0.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" dur="0.5s" repeatCount="indefinite" values="1;1;0"/></g><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M31.52 49.05l-1.04 5.9"/><animateTransform attributeName="transform" begin="-0.3s" dur="0.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" begin="-0.3s" dur="0.5s" repeatCount="indefinite" values="1;1;0"/></g><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M38.52 49.05l-1.04 5.9"/><animateTransform attributeName="transform" begin="-0.1s" dur="0.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" begin="-0.1s" dur="0.5s" repeatCount="indefinite" values="1;1;0"/></g></g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/></svg>`
        },
        "5": {
            "day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/><g><path fill="#f4a71d" d="M30 36l-4 12h4l-2 10 10-14h-6l4-8h-6z"/><animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="1;1;1;1;1;1;0.1;1;0.1;1;1;0.1;1;0.1;1"/></g></svg>`,
            "night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/><g><path fill="#f4a71d" d="M30 36l-4 12h4l-2 10 10-14h-6l4-8h-6z"/><animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="1;1;1;1;1;1;0.1;1;0.1;1;1;0.1;1;0.1;1"/></g></svg>`
        },
        "6": {
            "day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><path fill="none" d="M21.17 46.81L18 64h24l2.75-17.19H21.17z"/></clipPath></defs><g clip-path="url(#a)"><g><g><g><path fill="#72b8d4" d="M32.29 47.2l.29.82a.29.29 0 00.41.17l.79-.37a.3.3 0 01.4.4l-.37.79a.29.29 0 00.17.41l.82.29a.31.31 0 010 .58l-.82.29a.29.29 0 00-.17.41l.37.79a.3.3 0 01-.4.4l-.78-.37a.29.29 0 00-.41.17l-.29.82a.31.31 0 01-.58 0l-.3-.8a.29.29 0 00-.41-.17l-.79.37a.3.3 0 01-.4-.4l.37-.79a.29.29 0 00-.17-.41l-.82-.29a.31.31 0 010-.58l.82-.29a.29.29 0 00.17-.41l-.37-.79a.3.3 0 01.4-.4l.79.37a.29.29 0 00.41-.17l.29-.82a.31.31 0 01.58-.02z"/><animateTransform attributeName="transform" dur="9s" repeatCount="indefinite" type="rotate" values="0 32 50; 180 32 50; 360 32 50"/></g><animateTransform attributeName="transform" dur="3s" repeatCount="indefinite" type="translate" values="-3 0; 3 0"/></g><animateTransform attributeName="transform" dur="3s" repeatCount="indefinite" type="translate" values="2 -6; -2 12"/><animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="1;1;1;0"/></g><g><g><g><path fill="#72b8d4" d="M39.29 47.2l.29.82a.29.29 0 00.41.17l.79-.37a.3.3 0 01.4.4l-.37.79a.29.29 0 00.17.41l.82.29a.31.31 0 010 .58l-.82.29a.29.29 0 00-.17.41l.37.79a.3.3 0 01-.4.4l-.78-.37a.29.29 0 00-.41.17l-.29.82a.31.31 0 01-.58 0l-.3-.8a.29.29 0 00-.41-.17l-.79.37a.3.3 0 01-.4-.4l.37-.79a.29.29 0 00-.17-.41l-.82-.29a.31.31 0 010-.58l.82-.29a.29.29 0 00.17-.41l-.37-.79a.3.3 0 01.4-.4l.79.37a.29.29 0 00.41-.17l.29-.82a.31.31 0 01.58-.02z"/><animateTransform attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 39 50; 180 39 50; 360 39 50"/></g><animateTransform attributeName="transform" begin="-1s" dur="3s" repeatCount="indefinite" type="translate" values="0 0; 3 0"/></g><animateTransform attributeName="transform" begin="-1s" dur="3s" repeatCount="indefinite" type="translate" values="2 -6; -2 12"/><animate attributeName="opacity" begin="-1s" dur="3s" repeatCount="indefinite" values="1;1;1;0"/></g><g><g><g><path fill="#72b8d4" d="M25.29 47.2l.29.82a.29.29 0 00.41.17l.79-.37a.3.3 0 01.4.4l-.37.79a.29.29 0 00.17.41l.82.29a.31.31 0 010 .58l-.82.29a.29.29 0 00-.17.41l.37.79a.3.3 0 01-.4.4l-.78-.37a.29.29 0 00-.41.17l-.29.82a.31.31 0 01-.58 0l-.3-.8a.29.29 0 00-.41-.17l-.79.37a.3.3 0 01-.4-.4l.37-.79a.29.29 0 00-.17-.41l-.82-.29a.31.31 0 010-.58l.82-.29a.29.29 0 00.17-.41l-.37-.79a.3.3 0 01.4-.4l.79.37a.29.29 0 00.41-.17l.29-.82a.31.31 0 01.58-.02z"/><animateTransform attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 25 50; 180 25 50; 360 25 50"/></g><animateTransform attributeName="transform" begin="-1.5s" dur="3s" repeatCount="indefinite" type="translate" values="-3 0; 2 0"/></g><animateTransform attributeName="transform" begin="-1.5s" dur="3s" repeatCount="indefinite" type="translate" values="2 -6; -2 12"/><animate attributeName="opacity" begin="-1.5s" dur="3s" repeatCount="indefinite" values="1;1;1;0"/></g></g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/></svg>`,
            "night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><path fill="none" d="M21.17 46.81L18 64h24l2.75-17.19H21.17z"/></clipPath></defs><g clip-path="url(#a)"><g><g><g><path fill="#72b8d4" d="M32.29 47.2l.29.82a.29.29 0 00.41.17l.79-.37a.3.3 0 01.4.4l-.37.79a.29.29 0 00.17.41l.82.29a.31.31 0 010 .58l-.82.29a.29.29 0 00-.17.41l.37.79a.3.3 0 01-.4.4l-.78-.37a.29.29 0 00-.41.17l-.29.82a.31.31 0 01-.58 0l-.3-.8a.29.29 0 00-.41-.17l-.79.37a.3.3 0 01-.4-.4l.37-.79a.29.29 0 00-.17-.41l-.82-.29a.31.31 0 010-.58l.82-.29a.29.29 0 00.17-.41l-.37-.79a.3.3 0 01.4-.4l.79.37a.29.29 0 00.41-.17l.29-.82a.31.31 0 01.58-.02z"/><animateTransform attributeName="transform" dur="9s" repeatCount="indefinite" type="rotate" values="0 32 50; 180 32 50; 360 32 50"/></g><animateTransform attributeName="transform" dur="3s" repeatCount="indefinite" type="translate" values="-3 0; 3 0"/></g><animateTransform attributeName="transform" dur="3s" repeatCount="indefinite" type="translate" values="2 -6; -2 12"/><animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="1;1;1;0"/></g><g><g><g><path fill="#72b8d4" d="M39.29 47.2l.29.82a.29.29 0 00.41.17l.79-.37a.3.3 0 01.4.4l-.37.79a.29.29 0 00.17.41l.82.29a.31.31 0 010 .58l-.82.29a.29.29 0 00-.17.41l.37.79a.3.3 0 01-.4.4l-.78-.37a.29.29 0 00-.41.17l-.29.82a.31.31 0 01-.58 0l-.3-.8a.29.29 0 00-.41-.17l-.79.37a.3.3 0 01-.4-.4l.37-.79a.29.29 0 00-.17-.41l-.82-.29a.31.31 0 010-.58l.82-.29a.29.29 0 00.17-.41l-.37-.79a.3.3 0 01.4-.4l.79.37a.29.29 0 00.41-.17l.29-.82a.31.31 0 01.58-.02z"/><animateTransform attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 39 50; 180 39 50; 360 39 50"/></g><animateTransform attributeName="transform" begin="-1s" dur="3s" repeatCount="indefinite" type="translate" values="0 0; 3 0"/></g><animateTransform attributeName="transform" begin="-1s" dur="3s" repeatCount="indefinite" type="translate" values="2 -6; -2 12"/><animate attributeName="opacity" begin="-1s" dur="3s" repeatCount="indefinite" values="1;1;1;0"/></g><g><g><g><path fill="#72b8d4" d="M25.29 47.2l.29.82a.29.29 0 00.41.17l.79-.37a.3.3 0 01.4.4l-.37.79a.29.29 0 00.17.41l.82.29a.31.31 0 010 .58l-.82.29a.29.29 0 00-.17.41l.37.79a.3.3 0 01-.4.4l-.78-.37a.29.29 0 00-.41.17l-.29.82a.31.31 0 01-.58 0l-.3-.8a.29.29 0 00-.41-.17l-.79.37a.3.3 0 01-.4-.4l.37-.79a.29.29 0 00-.17-.41l-.82-.29a.31.31 0 010-.58l.82-.29a.29.29 0 00.17-.41l-.37-.79a.3.3 0 01.4-.4l.79.37a.29.29 0 00.41-.17l.29-.82a.31.31 0 01.58-.02z"/><animateTransform attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 25 50; 180 25 50; 360 25 50"/></g><animateTransform attributeName="transform" begin="-1.5s" dur="3s" repeatCount="indefinite" type="translate" values="-3 0; 2 0"/></g><animateTransform attributeName="transform" begin="-1.5s" dur="3s" repeatCount="indefinite" type="translate" values="2 -6; -2 12"/><animate attributeName="opacity" begin="-1.5s" dur="3s" repeatCount="indefinite" values="1;1;1;0"/></g></g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/></svg>`
        },
        "7": {
            "day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><path fill="none" d="M10.55 34.21l-3.83-3.42-2-6 1-7 4-5 5-3h6l5 1 3 3 2.56 4.36-4.56 4.64h-5l-5 5v3l-6.17 3.42z"/></clipPath><clipPath id="b"><path fill="none" d="M42 64l2.85-17h-23.8L17 64"/></clipPath></defs><g clip-path="url(#a)"><g><circle cx="19.22" cy="24.29" r="5.95" fill="#f4a71d"/><path fill="none" stroke="#f4a71d" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M19.22 15.97v-3.18M19.22 35.79v-3.17M25.11 18.4l2.24-2.24M11.09 32.42l2.24-2.24M13.33 18.4l-2.24-2.24M27.35 32.42l-2.24-2.24M10.89 24.29H7.72M30.72 24.29h-3.17"/><animateTransform attributeName="transform" dur="45s" from="0 19.22 24.293" repeatCount="indefinite" to="360 19.22 24.293" type="rotate"/></g></g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/><g clip-path="url(#b)"><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M24.52 49.05l-1.04 5.9"/><animateTransform attributeName="transform" dur="0.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" dur="0.5s" repeatCount="indefinite" values="1;1;0"/></g><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M31.52 49.05l-1.04 5.9"/><animateTransform attributeName="transform" begin="-0.3s" dur="0.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" begin="-0.3s" dur="0.5s" repeatCount="indefinite" values="1;1;0"/></g><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M38.52 49.05l-1.04 5.9"/><animateTransform attributeName="transform" begin="-0.1s" dur="0.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" begin="-0.1s" dur="0.5s" repeatCount="indefinite" values="1;1;0"/></g></g></svg>`,
            "night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><path fill="none" d="M10.55 34.21l-3.83-3.42-2-6 1-7 4-5 5-3h6l5 1 3 3 2.56 4.36-4.56 4.64h-5l-5 5v3l-6.17 3.42z"/></clipPath><clipPath id="b"><path fill="none" d="M42 64l2.85-17h-23.8L17 64"/></clipPath></defs><g clip-path="url(#a)"><g><path fill="#72b9d5" stroke="#72b9d5" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M29.33 27.13A10.6 10.6 0 0118.65 16.6 10.44 10.44 0 0119 14a10.54 10.54 0 1011.5 13.07 11.46 11.46 0 01-1.17.06z"/><animateTransform attributeName="transform" dur="10s" repeatCount="indefinite" type="rotate" values="-10 19.22 24.293;10 19.22 24.293;-10 19.22 24.293"/></g></g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/><g clip-path="url(#b)"><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M24.52 49.05l-1.04 5.9"/><animateTransform attributeName="transform" dur="0.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" dur="0.5s" repeatCount="indefinite" values="1;1;0"/></g><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M31.52 49.05l-1.04 5.9"/><animateTransform attributeName="transform" begin="-0.3s" dur="0.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" begin="-0.3s" dur="0.5s" repeatCount="indefinite" values="1;1;0"/></g><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M38.52 49.05l-1.04 5.9"/><animateTransform attributeName="transform" begin="-0.1s" dur="0.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" begin="-0.1s" dur="0.5s" repeatCount="indefinite" values="1;1;0"/></g></g></svg>`
        },
        "8": {
            "day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g><path fill="none" stroke="#efefef" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M17 25h30"/><animateTransform attributeName="transform" begin="0s" dur="5s" repeatCount="indefinite" type="translate" values="-4 0; 4 0; -4 0"/></g><g><path fill="none" stroke="#efefef" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M17 32h30"/><animateTransform attributeName="transform" begin="-2s" dur="5s" repeatCount="indefinite" type="translate" values="-3 0; 3 0; -3 0"/></g><g><path fill="none" stroke="#efefef" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M17 39h30"/><animateTransform attributeName="transform" begin="-4s" dur="5s" repeatCount="indefinite" type="translate" values="-4 0; 4 0; -4 0"/></g></svg>`,
            "night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g><path fill="none" stroke="#efefef" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M17 25h30"/><animateTransform attributeName="transform" begin="0s" dur="5s" repeatCount="indefinite" type="translate" values="-4 0; 4 0; -4 0"/></g><g><path fill="none" stroke="#efefef" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M17 32h30"/><animateTransform attributeName="transform" begin="-2s" dur="5s" repeatCount="indefinite" type="translate" values="-3 0; 3 0; -3 0"/></g><g><path fill="none" stroke="#efefef" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M17 39h30"/><animateTransform attributeName="transform" begin="-4s" dur="5s" repeatCount="indefinite" type="translate" values="-4 0; 4 0; -4 0"/></g></svg>`
        },
        "9": {
            "day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><path fill="none" d="M10.55 34.21l-3.83-3.42-2-6 1-7 4-5 5-3h6l5 1 3 3 2.56 4.36-4.56 4.64h-5l-5 5v3l-6.17 3.42z"/></clipPath><clipPath id="b"><path fill="none" d="M21.17 46.81L18 64h24l2.75-17.19H21.17z"/></clipPath></defs><g clip-path="url(#a)"><g><circle cx="19.22" cy="24.29" r="5.95" fill="#f4a71d"/><path fill="none" stroke="#f4a71d" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M19.22 15.97v-3.18M19.22 35.79v-3.17M25.11 18.4l2.24-2.24M11.09 32.42l2.24-2.24M13.33 18.4l-2.24-2.24M27.35 32.42l-2.24-2.24M10.89 24.29H7.72M30.72 24.29h-3.17"/><animateTransform attributeName="transform" dur="45s" from="0 19.22 24.293" repeatCount="indefinite" to="360 19.22 24.293" type="rotate"/></g></g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/><g clip-path="url(#b)"><g><g><g><path fill="#72b8d4" d="M32.29 47.2l.29.82a.29.29 0 00.41.17l.79-.37a.3.3 0 01.4.4l-.37.79a.29.29 0 00.17.41l.82.29a.31.31 0 010 .58l-.82.29a.29.29 0 00-.17.41l.37.79a.3.3 0 01-.4.4l-.78-.37a.29.29 0 00-.41.17l-.29.82a.31.31 0 01-.58 0l-.3-.8a.29.29 0 00-.41-.17l-.79.37a.3.3 0 01-.4-.4l.37-.79a.29.29 0 00-.17-.41l-.82-.29a.31.31 0 010-.58l.82-.29a.29.29 0 00.17-.41l-.37-.79a.3.3 0 01.4-.4l.79.37a.29.29 0 00.41-.17l.29-.82a.31.31 0 01.58-.02z"/><animateTransform attributeName="transform" dur="9s" repeatCount="indefinite" type="rotate" values="0 32 50; 180 32 50; 360 32 50"/></g><animateTransform attributeName="transform" dur="3s" repeatCount="indefinite" type="translate" values="-3 0; 3 0"/></g><animateTransform attributeName="transform" dur="3s" repeatCount="indefinite" type="translate" values="2 -6; -2 12"/><animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="1;1;1;0"/></g><g><g><g><path fill="#72b8d4" d="M39.29 47.2l.29.82a.29.29 0 00.41.17l.79-.37a.3.3 0 01.4.4l-.37.79a.29.29 0 00.17.41l.82.29a.31.31 0 010 .58l-.82.29a.29.29 0 00-.17.41l.37.79a.3.3 0 01-.4.4l-.78-.37a.29.29 0 00-.41.17l-.29.82a.31.31 0 01-.58 0l-.3-.8a.29.29 0 00-.41-.17l-.79.37a.3.3 0 01-.4-.4l.37-.79a.29.29 0 00-.17-.41l-.82-.29a.31.31 0 010-.58l.82-.29a.29.29 0 00.17-.41l-.37-.79a.3.3 0 01.4-.4l.79.37a.29.29 0 00.41-.17l.29-.82a.31.31 0 01.58-.02z"/><animateTransform attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 39 50; 180 39 50; 360 39 50"/></g><animateTransform attributeName="transform" begin="-1s" dur="3s" repeatCount="indefinite" type="translate" values="0 0; 3 0"/></g><animateTransform attributeName="transform" begin="-1s" dur="3s" repeatCount="indefinite" type="translate" values="2 -6; -2 12"/><animate attributeName="opacity" begin="-1s" dur="3s" repeatCount="indefinite" values="1;1;1;0"/></g><g><g><g><path fill="#72b8d4" d="M25.29 47.2l.29.82a.29.29 0 00.41.17l.79-.37a.3.3 0 01.4.4l-.37.79a.29.29 0 00.17.41l.82.29a.31.31 0 010 .58l-.82.29a.29.29 0 00-.17.41l.37.79a.3.3 0 01-.4.4l-.78-.37a.29.29 0 00-.41.17l-.29.82a.31.31 0 01-.58 0l-.3-.8a.29.29 0 00-.41-.17l-.79.37a.3.3 0 01-.4-.4l.37-.79a.29.29 0 00-.17-.41l-.82-.29a.31.31 0 010-.58l.82-.29a.29.29 0 00.17-.41l-.37-.79a.3.3 0 01.4-.4l.79.37a.29.29 0 00.41-.17l.29-.82a.31.31 0 01.58-.02z"/><animateTransform attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 25 50; 180 25 50; 360 25 50"/></g><animateTransform attributeName="transform" begin="-1.5s" dur="3s" repeatCount="indefinite" type="translate" values="-3 0; 2 0"/></g><animateTransform attributeName="transform" begin="-1.5s" dur="3s" repeatCount="indefinite" type="translate" values="2 -6; -2 12"/><animate attributeName="opacity" begin="-1.5s" dur="3s" repeatCount="indefinite" values="1;1;1;0"/></g></g></svg>`,
            "night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><path fill="none" d="M10.55 34.21l-3.83-3.42-2-6 1-7 4-5 5-3h6l5 1 3 3 2.56 4.36-4.56 4.64h-5l-5 5v3l-6.17 3.42z"/></clipPath><clipPath id="b"><path fill="none" d="M21.17 46.81L18 64h24l2.75-17.19H21.17z"/></clipPath></defs><g clip-path="url(#a)"><g><path fill="#72b9d5" stroke="#72b9d5" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M29.33 27.13A10.6 10.6 0 0118.65 16.6 10.44 10.44 0 0119 14a10.54 10.54 0 1011.5 13.07 11.46 11.46 0 01-1.17.06z"/><animateTransform attributeName="transform" dur="10s" repeatCount="indefinite" type="rotate" values="-10 19.22 24.293;10 19.22 24.293;-10 19.22 24.293"/></g></g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/><g clip-path="url(#b)"><g><g><g><path fill="#72b8d4" d="M32.29 47.2l.29.82a.29.29 0 00.41.17l.79-.37a.3.3 0 01.4.4l-.37.79a.29.29 0 00.17.41l.82.29a.31.31 0 010 .58l-.82.29a.29.29 0 00-.17.41l.37.79a.3.3 0 01-.4.4l-.78-.37a.29.29 0 00-.41.17l-.29.82a.31.31 0 01-.58 0l-.3-.8a.29.29 0 00-.41-.17l-.79.37a.3.3 0 01-.4-.4l.37-.79a.29.29 0 00-.17-.41l-.82-.29a.31.31 0 010-.58l.82-.29a.29.29 0 00.17-.41l-.37-.79a.3.3 0 01.4-.4l.79.37a.29.29 0 00.41-.17l.29-.82a.31.31 0 01.58-.02z"/><animateTransform attributeName="transform" dur="9s" repeatCount="indefinite" type="rotate" values="0 32 50; 180 32 50; 360 32 50"/></g><animateTransform attributeName="transform" dur="3s" repeatCount="indefinite" type="translate" values="-3 0; 3 0"/></g><animateTransform attributeName="transform" dur="3s" repeatCount="indefinite" type="translate" values="2 -6; -2 12"/><animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="1;1;1;0"/></g><g><g><g><path fill="#72b8d4" d="M39.29 47.2l.29.82a.29.29 0 00.41.17l.79-.37a.3.3 0 01.4.4l-.37.79a.29.29 0 00.17.41l.82.29a.31.31 0 010 .58l-.82.29a.29.29 0 00-.17.41l.37.79a.3.3 0 01-.4.4l-.78-.37a.29.29 0 00-.41.17l-.29.82a.31.31 0 01-.58 0l-.3-.8a.29.29 0 00-.41-.17l-.79.37a.3.3 0 01-.4-.4l.37-.79a.29.29 0 00-.17-.41l-.82-.29a.31.31 0 010-.58l.82-.29a.29.29 0 00.17-.41l-.37-.79a.3.3 0 01.4-.4l.79.37a.29.29 0 00.41-.17l.29-.82a.31.31 0 01.58-.02z"/><animateTransform attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 39 50; 180 39 50; 360 39 50"/></g><animateTransform attributeName="transform" begin="-1s" dur="3s" repeatCount="indefinite" type="translate" values="0 0; 3 0"/></g><animateTransform attributeName="transform" begin="-1s" dur="3s" repeatCount="indefinite" type="translate" values="2 -6; -2 12"/><animate attributeName="opacity" begin="-1s" dur="3s" repeatCount="indefinite" values="1;1;1;0"/></g><g><g><g><path fill="#72b8d4" d="M25.29 47.2l.29.82a.29.29 0 00.41.17l.79-.37a.3.3 0 01.4.4l-.37.79a.29.29 0 00.17.41l.82.29a.31.31 0 010 .58l-.82.29a.29.29 0 00-.17.41l.37.79a.3.3 0 01-.4.4l-.78-.37a.29.29 0 00-.41.17l-.29.82a.31.31 0 01-.58 0l-.3-.8a.29.29 0 00-.41-.17l-.79.37a.3.3 0 01-.4-.4l.37-.79a.29.29 0 00-.17-.41l-.82-.29a.31.31 0 010-.58l.82-.29a.29.29 0 00.17-.41l-.37-.79a.3.3 0 01.4-.4l.79.37a.29.29 0 00.41-.17l.29-.82a.31.31 0 01.58-.02z"/><animateTransform attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 25 50; 180 25 50; 360 25 50"/></g><animateTransform attributeName="transform" begin="-1.5s" dur="3s" repeatCount="indefinite" type="translate" values="-3 0; 2 0"/></g><animateTransform attributeName="transform" begin="-1.5s" dur="3s" repeatCount="indefinite" type="translate" values="2 -6; -2 12"/><animate attributeName="opacity" begin="-1.5s" dur="3s" repeatCount="indefinite" values="1;1;1;0"/></g></g></svg>`
        },
        "10": {
            "day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g><path fill="none" stroke="#efefef" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M43.64 20a5 5 0 113.61 8.46h-35.5M29.14 44a5 5 0 103.61-8.46h-21"/><animateTransform attributeName="transform" dur="2s" repeatCount="indefinite" type="translate" values="-8 2; 0 -2; 8 0; 0 1; -8 2"/></g></svg>`,
            "night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g><path fill="none" stroke="#efefef" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M43.64 20a5 5 0 113.61 8.46h-35.5M29.14 44a5 5 0 103.61-8.46h-21"/><animateTransform attributeName="transform" dur="2s" repeatCount="indefinite" type="translate" values="-8 2; 0 -2; 8 0; 0 1; -8 2"/></g></svg>`
        },
        "11": {
            "day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><path fill="none" d="M21.17 46.81L18 64h24l2.75-17.19H21.17z"/></clipPath></defs><g clip-path="url(#a)"><g><circle cx="32" cy="50" r="1.5" fill="#72b8d4"/><animateTransform attributeName="transform" dur="0.6s" repeatCount="indefinite" type="translate" values="2 -10; -2 12; -1 9"/><animate attributeName="opacity" dur="0.6s" repeatCount="indefinite" values="1;1;0"/></g><g><circle cx="39" cy="50" r="1.5" fill="#72b8d4"/><animateTransform attributeName="transform" begin="-0.4s" dur="0.6s" repeatCount="indefinite" type="translate" values="2 -10; -2 12; -1 9"/><animate attributeName="opacity" begin="-0.4s" dur="0.6s" repeatCount="indefinite" values="1;1;0"/></g><g><circle cx="25" cy="50" r="1.5" fill="#72b8d4"/><animateTransform attributeName="transform" begin="-0.2s" dur="0.6s" repeatCount="indefinite" type="translate" values="2 -10; -2 12; -1 9"/><animate attributeName="opacity" begin="-0.2s" dur="0.6s" repeatCount="indefinite" values="1;1;0"/></g></g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/></svg>`,
            "night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><path fill="none" d="M21.17 46.81L18 64h24l2.75-17.19H21.17z"/></clipPath></defs><g clip-path="url(#a)"><g><circle cx="32" cy="50" r="1.5" fill="#72b8d4"/><animateTransform attributeName="transform" dur="0.6s" repeatCount="indefinite" type="translate" values="2 -10; -2 12; -1 9"/><animate attributeName="opacity" dur="0.6s" repeatCount="indefinite" values="1;1;0"/></g><g><circle cx="39" cy="50" r="1.5" fill="#72b8d4"/><animateTransform attributeName="transform" begin="-0.4s" dur="0.6s" repeatCount="indefinite" type="translate" values="2 -10; -2 12; -1 9"/><animate attributeName="opacity" begin="-0.4s" dur="0.6s" repeatCount="indefinite" values="1;1;0"/></g><g><circle cx="25" cy="50" r="1.5" fill="#72b8d4"/><animateTransform attributeName="transform" begin="-0.2s" dur="0.6s" repeatCount="indefinite" type="translate" values="2 -10; -2 12; -1 9"/><animate attributeName="opacity" begin="-0.2s" dur="0.6s" repeatCount="indefinite" values="1;1;0"/></g></g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/></svg>`
        },
        "12": {
            "day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><path fill="none" d="M42 64l2.85-17h-23.8L17 64"/></clipPath></defs><g clip-path="url(#a)"><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M32.08 49.01l-.16.98"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" dur="1.5s" repeatCount="indefinite" values="1;1;0"/></g><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M26.08 49.01l-.16.98"/><animateTransform attributeName="transform" begin="-0.5s" dur="1.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" begin="-0.5s" dur="1.5s" repeatCount="indefinite" values="1;1;0"/></g><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M38.08 49.01l-.16.98"/><animateTransform attributeName="transform" begin="-1s" dur="1.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" begin="-1s" dur="1.5s" repeatCount="indefinite" values="1;1;0"/></g></g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/></svg>`,
            "night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="a"><path fill="none" d="M42 64l2.85-17h-23.8L17 64"/></clipPath></defs><g clip-path="url(#a)"><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M32.08 49.01l-.16.98"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" dur="1.5s" repeatCount="indefinite" values="1;1;0"/></g><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M26.08 49.01l-.16.98"/><animateTransform attributeName="transform" begin="-0.5s" dur="1.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" begin="-0.5s" dur="1.5s" repeatCount="indefinite" values="1;1;0"/></g><g><path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M38.08 49.01l-.16.98"/><animateTransform attributeName="transform" begin="-1s" dur="1.5s" repeatCount="indefinite" type="translate" values="2 -10; -2 10"/><animate attributeName="opacity" begin="-1s" dur="1.5s" repeatCount="indefinite" values="1;1;0"/></g></g><path fill="#efefef" stroke="#efefef" stroke-miterlimit="10" stroke-width="3" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/></svg>`
        }
    };
    this.cities = {
        "1": {
            "plate": 1,
            "name": "ADANA",
            "slug": "adana"
        },
        "2": {
            "plate": 2,
            "name": "ADIYAMAN",
            "slug": "adiyaman"
        },
        "3": {
            "plate": 3,
            "name": "AFYONKARAHİSAR",
            "slug": "afyonkarahisar"
        },
        "4": {
            "plate": 4,
            "name": "AĞRI",
            "slug": "agri"
        },
        "5": {
            "plate": 5,
            "name": "AMASYA",
            "slug": "amasya"
        },
        "6": {
            "plate": 6,
            "name": "ANKARA",
            "slug": "ankara"
        },
        "7": {
            "plate": 7,
            "name": "ANTALYA",
            "slug": "antalya"
        },
        "8": {
            "plate": 8,
            "name": "ARTVİN",
            "slug": "artvin"
        },
        "9": {
            "plate": 9,
            "name": "AYDIN",
            "slug": "aydin"
        },
        "10": {
            "plate": 10,
            "name": "BALIKESİR",
            "slug": "balikesir"
        },
        "11": {
            "plate": 11,
            "name": "BİLECİK",
            "slug": "bilecik"
        },
        "12": {
            "plate": 12,
            "name": "BİNGÖL",
            "slug": "bingol"
        },
        "13": {
            "plate": 13,
            "name": "BİTLİS",
            "slug": "bitlis"
        },
        "14": {
            "plate": 14,
            "name": "BOLU",
            "slug": "bolu"
        },
        "15": {
            "plate": 15,
            "name": "BURDUR",
            "slug": "burdur"
        },
        "16": {
            "plate": 16,
            "name": "BURSA",
            "slug": "bursa"
        },
        "17": {
            "plate": 17,
            "name": "ÇANAKKALE",
            "slug": "canakkale"
        },
        "18": {
            "plate": 18,
            "name": "ÇANKIRI",
            "slug": "cankiri"
        },
        "19": {
            "plate": 19,
            "name": "ÇORUM",
            "slug": "corum"
        },
        "20": {
            "plate": 20,
            "name": "DENİZLİ",
            "slug": "denizli"
        },
        "21": {
            "plate": 21,
            "name": "DİYARBAKIR",
            "slug": "diyarbakir"
        },
        "22": {
            "plate": 22,
            "name": "EDİRNE",
            "slug": "edirne"
        },
        "23": {
            "plate": 23,
            "name": "ELAZIĞ",
            "slug": "elazig"
        },
        "24": {
            "plate": 24,
            "name": "ERZİNCAN",
            "slug": "erzincan"
        },
        "25": {
            "plate": 25,
            "name": "ERZURUM",
            "slug": "erzurum"
        },
        "26": {
            "plate": 26,
            "name": "ESKİŞEHİR",
            "slug": "eskisehir"
        },
        "27": {
            "plate": 27,
            "name": "GAZİANTEP",
            "slug": "gaziantep"
        },
        "28": {
            "plate": 28,
            "name": "GİRESUN",
            "slug": "giresun"
        },
        "29": {
            "plate": 29,
            "name": "GÜMÜŞHANE",
            "slug": "gumushane"
        },
        "30": {
            "plate": 30,
            "name": "HAKKARİ",
            "slug": "hakkari"
        },
        "31": {
            "plate": 31,
            "name": "HATAY",
            "slug": "hatay"
        },
        "32": {
            "plate": 32,
            "name": "ISPARTA",
            "slug": "isparta"
        },
        "33": {
            "plate": 33,
            "name": "MERSİN(İÇEL)",
            "slug": "mersin"
        },
        "34": {
            "plate": 34,
            "name": "İSTANBUL",
            "slug": "istanbul"
        },
        "35": {
            "plate": 35,
            "name": "İZMİR",
            "slug": "izmir"
        },
        "36": {
            "plate": 36,
            "name": "KARS",
            "slug": "kars"
        },
        "37": {
            "plate": 37,
            "name": "KASTAMONU",
            "slug": "kastamonu"
        },
        "38": {
            "plate": 38,
            "name": "KAYSERİ",
            "slug": "kayseri"
        },
        "39": {
            "plate": 39,
            "name": "KIRKLARELİ",
            "slug": "kirklareli"
        },
        "40": {
            "plate": 40,
            "name": "KIRŞEHİR",
            "slug": "kirsehir"
        },
        "41": {
            "plate": 41,
            "name": "KOCAELİ",
            "slug": "kocaeli"
        },
        "42": {
            "plate": 42,
            "name": "KONYA",
            "slug": "konya"
        },
        "43": {
            "plate": 43,
            "name": "KÜTAHYA",
            "slug": "kutahya"
        },
        "44": {
            "plate": 44,
            "name": "MALATYA",
            "slug": "malatya"
        },
        "45": {
            "plate": 45,
            "name": "MANİSA",
            "slug": "manisa"
        },
        "46": {
            "plate": 46,
            "name": "KAHRAMANMARAŞ",
            "slug": "kahramanmaras"
        },
        "47": {
            "plate": 47,
            "name": "MARDİN",
            "slug": "mardin"
        },
        "48": {
            "plate": 48,
            "name": "MUĞLA",
            "slug": "mugla"
        },
        "49": {
            "plate": 49,
            "name": "MUŞ",
            "slug": "mus"
        },
        "50": {
            "plate": 50,
            "name": "NEVŞEHİR",
            "slug": "nevsehir"
        },
        "51": {
            "plate": 51,
            "name": "NİĞDE",
            "slug": "nigde"
        },
        "52": {
            "plate": 52,
            "name": "ORDU",
            "slug": "ordu"
        },
        "53": {
            "plate": 53,
            "name": "RİZE",
            "slug": "rize"
        },
        "54": {
            "plate": 54,
            "name": "SAKARYA",
            "slug": "sakarya"
        },
        "55": {
            "plate": 55,
            "name": "SAMSUN",
            "slug": "samsun"
        },
        "56": {
            "plate": 56,
            "name": "SİİRT",
            "slug": "siirt"
        },
        "57": {
            "plate": 57,
            "name": "SİNOP",
            "slug": "sinop"
        },
        "58": {
            "plate": 58,
            "name": "SİVAS",
            "slug": "sivas"
        },
        "59": {
            "plate": 59,
            "name": "TEKİRDAĞ",
            "slug": "tekirdag"
        },
        "60": {
            "plate": 60,
            "name": "TOKAT",
            "slug": "tokat"
        },
        "61": {
            "plate": 61,
            "name": "TRABZON",
            "slug": "trabzon"
        },
        "62": {
            "plate": 62,
            "name": "TUNCELİ",
            "slug": "tunceli"
        },
        "63": {
            "plate": 63,
            "name": "ŞANLIURFA",
            "slug": "sanliurfa"
        },
        "64": {
            "plate": 64,
            "name": "UŞAK",
            "slug": "usak"
        },
        "65": {
            "plate": 65,
            "name": "VAN",
            "slug": "van"
        },
        "66": {
            "plate": 66,
            "name": "YOZGAT",
            "slug": "yozgat"
        },
        "67": {
            "plate": 67,
            "name": "ZONGULDAK",
            "slug": "zonguldak"
        },
        "68": {
            "plate": 68,
            "name": "AKSARAY",
            "slug": "aksaray"
        },
        "69": {
            "plate": 69,
            "name": "BAYBURT",
            "slug": "bayburt"
        },
        "70": {
            "plate": 70,
            "name": "KARAMAN",
            "slug": "karaman"
        },
        "71": {
            "plate": 71,
            "name": "KIRIKKALE",
            "slug": "kirikkale"
        },
        "72": {
            "plate": 72,
            "name": "BATMAN",
            "slug": "batman"
        },
        "73": {
            "plate": 73,
            "name": "ŞIRNAK",
            "slug": "sirnak"
        },
        "74": {
            "plate": 74,
            "name": "BARTIN",
            "slug": "bartin"
        },
        "75": {
            "plate": 75,
            "name": "ARDAHAN",
            "slug": "ardahan"
        },
        "76": {
            "plate": 76,
            "name": "IĞDIR",
            "slug": "igdir"
        },
        "77": {
            "plate": 77,
            "name": "YALOVA",
            "slug": "yalova"
        },
        "78": {
            "plate": 78,
            "name": "KARABÜK",
            "slug": "karabuk"
        },
        "79": {
            "plate": 79,
            "name": "KİLİS",
            "slug": "kilis"
        },
        "80": {
            "plate": 80,
            "name": "OSMANİYE",
            "slug": "osmaniye"
        },
        "81": {
            "plate": 81,
            "name": "DÜZCE",
            "slug": "duzce"
        }
    };
		for (var plate in this.cities) {
            var option = document.createElement("option");
            option.value = plate;
            option.innerText = this.cities[plate].name;
            this.citySelectElement.appendChild(option);
        }
		
		
		
		
		
		
		
    }
    connectedCallback() {
        var city = localStorage.getItem("city") || this.getAttribute("city") || "1";
        this.renderCity(city);
        this.fetchData();
        this.citySelectElement.addEventListener("change", this.handleSelectInput);
    }
    disconnectedCallback() {
        this.citySelectElement.removeEventListener("change", this.handleSelectInput)
    }
    static get observedAttributes() {
        return ['city', 'theme'];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        if (name == "city")
            this.renderCity(newVal);
        else if (name == "theme") {
            this.setTheme(newVal);
        }
    }
    fetchData() {
        const url = `https://raw.githubusercontent.com/kod8/haber8-scraper/main/data/hava/hava_trt.json`;
        fetch(url).then(function (res) {
            return res.json();
        }).then(this.handleData);
    };
    handleData(data) {
        for (var plate in data) {
            this.cities[plate].hava = data[plate].durum;
        }
        var city = localStorage.getItem("city") || this.getAttribute("city") || "1";
        this.renderCity(city);
    };
    renderCity(plate) {
        this.classList.add("loading");
        var data = this.cities[plate].hava || "load";
        if (data == "load")
            return;
        if (this.citySelectElement.value !== plate)
            this.citySelectElement.value = plate;
        this.todayDegreeElement.innerText = Math.floor(data[0].now);
        this.todayConditionElement.innerText = data[0].condition;
        var iconId = this.conditions[data[0].condition].icon || "1";
        this.todayIconElement.innerHTML = this.weatherIcons[iconId][this.dayOrNight];
        this.classList.remove("loading");
    }
    setTheme(themeID) {
        if (this.themes[themeID]) {
            this.style.setProperty("--hue", this.themes[themeID])
        } else {
            this.style.setProperty("--hue", themeID)
        }
    }
    handleSelectInput(e) {
        if (this.getAttribute("city") !== e.target.value) {
            this.setAttribute("city", e.target.value);
            localStorage.setItem('city', e.target.value);
        }
    }
    changeCityFromOutside(city) {
        var event = new Event('change');
        this.citySelectElement.value = city;
        this.citySelectElement.dispatchEvent(event);
    }
    
}
window.customElements.define("hava-durumu-mini", havaDurumuMini);
const dovizKuruMiniTemplate = document.createElement("template");
dovizKuruMiniTemplate.innerHTML = `<!--<link href="https://fonts.googleapis.com/css2?family=Changa:wght@300;400;600;800&display=swap" rel="stylesheet">--><style>:host * {font-family: var(--family);}:host{--light: #91d5f2;--lighter: #ffffff;--main: #185f7dff;--dark: #10394a;--darker: #071728;--gr1:linear-gradient(180deg, var(--darker), var(--main));--gr2:linear-gradient(180deg, var(--light), var(--main));--gr3:linear-gradient(0deg, var(--darker), transparent);--dolar:block;--euro:block;--altin:block;--bist:block;--family:"montserrat";font-family: var(--family);display:block;font-size:12px;border-radius:5px;color:var(--light);background:var(--darker);padding:.5em;background:var(--gr1);height:100%;border-radius:5px;} h5.title{font-size:1.5em;font-weight:300;margin:.5em 0;letter-spacing:.5em;}.birimler{display:flex;align-items:center;justify-content:space-around;position:relative;flex-grow:2;flex-wrap:wrap;}.birimler > div{margin:.5em;position:relative;}.birimler > div .title{font-size:1em;font-weight:400;text-align:end;}.birimler > .dolar .title:before{content: "$";}.birimler > .euro .title:before{content: "€";}.birimler > .dolar .title:before , .birimler > .euro .title:before{font-size: 4em;font-weight: 800;display: block;position: absolute;color: var(--dark);opacity: 0.75;top: -25%;z-index: 0;background: -webkit-linear-gradient(var(--darker), transparent);background: -webkit-linear-gradient(#ffffff66, transparent);-webkit-background-clip: text;-webkit-text-fill-color: transparent;}.birimler > div .value{font-size:2em;font-weight:800;color:var(--lighter);text-align:end;position:relative;}.birimler > div .value.alis:before{content:"Alış";font-size:.65em;font-weight:300;color:var(--light);vertical-align:middle;padding-right:.5em;}.birimler > div .value.satis:before{content:"Satış";font-size:.65em;font-weight:300;color:var(--light);vertical-align:middle;padding-right:.5em;}.birimler .dolar{display:var(--dolar);}.birimler .euro{display:var(--euro);}.birimler .altin{display:var(--altin);}.birimler .bist{display:var(--bist);}/*LOADING */.loading.birimler div .value{width: 100%;color: var(--light);position: relative;overflow: hidden;}.loading.birimler div .value:after{content: "";width: 75%;height: 100%;position: absolute;left: 0;opacity:.75;color:white;background: linear-gradient(to right,transparent 0%,var(--darker) 50%,transparent 100%);animation: placeholder .75s ease-in both infinite;}.loading.birimler div .value, .loading.birimler div .value:before{color:var(--main)}@keyframes placeholder {0% {left: -100%;}100% {left: 100%;}} </style><div class="birimler"><div class="dolar"><div class="title">Dolar</div><div class="value">■.■■</div></div><div class="euro"><div class="title">Euro</div><div class="value">■.■■</div></div><div class="altin"><div class="title">Altın</div><div class="value">■.■■</div></div><div class="bist"><div class="title">BIST</div><div class="value">■.■■</div></div></div>`;
class dovizKuruMini extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: "open"
        });
        this.shadowRoot.appendChild(dovizKuruMiniTemplate.content.cloneNode(true));
        this.dolarHTML = this.shadowRoot.querySelector(".birimler .dolar .value");
        this.euroHTML = this.shadowRoot.querySelector(".birimler .euro .value");
        this.altinHTML = this.shadowRoot.querySelector(".birimler .altin .value");
        this.bistHTML = this.shadowRoot.querySelector(".birimler .bist .value");
        this.renderData = this.renderData.bind(this);
    }
    connectedCallback() {
        this.shadowRoot.querySelector(".birimler").classList.add("loading");
        this.fetchData();
    }
    disconnectedCallback() {}
    fetchData() {
        const url = `https://service.kod8.app/data/doviz/all.json`;
        fetch(url).then(function (res) {
            return res.json();
        }).then(this.renderData);
    }
    renderData(data) {
        data = data.trthaber;
        var valueData = [data.dolar.value, data.euro.value, data.gram_altin.value, data.bist.value, ];
        var valueHTML = [this.dolarHTML, this.euroHTML, this.altinHTML, this.bistHTML, ];
        valueHTML.forEach(function(e, i) {e.innerHTML = valueData[i]});
        this.shadowRoot.querySelector(".birimler").classList.remove("loading");
    }
}
window.customElements.define("doviz-kuru-mini", dovizKuruMini);
const namazVaktiMiniTemplate = document.createElement("template");
namazVaktiMiniTemplate.innerHTML = `<!--<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;700&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;400;800&display=swap" rel="stylesheet">--><style>:host * {font-family: var(--family);}:host{--detay:visible;--cityVisibile:block;--family:"montserrat";--lighter: hsl(0, 0%, 100%);;--hue:220;padding:1em;--light: hsl(var(--hue), 70%, 90%);--main: hsl(var(--hue), 77%, 28%);--dark: hsl(var(--hue), 77%, 24%);--darker: hsl(var(--hue), 87%, 15%);--gr1:linear-gradient(180deg, var(--dark), var(--darker));--gr2:linear-gradient(180deg, var(--light), var(--main));--gr3:linear-gradient(0deg, var(--darker), transparent);--gr4:linear-gradient(0deg, var(--dark), transparent);display:flex;flex-direction:row;flex-wrap:wrap;align-items:stretch;justify-content:center;font-size:12px;border-radius:5px;color:var(--light);background:var(--main);position:relative;} .timer{display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:10px;}.timerLabel{font-size:1.5em;font-weight:400;}.timerValue{font-size:2em;font-weight:800;}.vakitler{position:absolute;top:105%;right:0;display:flex;flex-direction:column;justify-content:space-between;padding:1em;/*padding-left:0px;*/visibility:hidden;background:var(--main);border-radius:5px;flex-direction:row;width:400px;}:host(:hover) .vakitler{visibility:var(--detay);z-index: 800;}.vakitler .vakit{display:flex;flex-direction:column;margin:.25em 0;padding-left:10px;padding-right:10px;opacity:.3;}.vakitler .vakit.current{border-bottom:5px solid white;opacity:.6;}.vakitler .vakit.current + .vakit{border-bottom:5px solid lightgreen;opacity:1;background: #40404066;padding: .25em 1em;border-radius: 5px;}.vakitler .vakit .label{font-size:1em;font-weight:400;}.vakitler .vakit .value{font-size:1.5em;font-weight:800;}.city{display:var(--cityVisibile);font-size: 1.4em;font-weight: 800;padding:.5em 1em;padding:0;letter-spacing: 2.5px;line-height: 13px;border: none;border-radius: 5px;width:100%;font-family: var(--family);}/*LOADING */:host(.loading) .value{width: 100%;color: var(--light);position: relative;overflow: hidden;}:host(.loading) .value:before{content: "";width: 50%;height: 100%;position: absolute;left: 0;opacity:.75;color:var(--dark);background: linear-gradient(to right,transparent 0%,var(--light) 50%,transparent 100%);animation: placeholder .75s ease-in both infinite;}:host(.loading) .value, :host(.loading) .value:before{color:var(--dark);opacity:.5;}:host(.loading) .label:after, :host(.loading) .value:after, :host(.loading) .value:after{content:"";}@keyframes placeholder {0% {left: -100%;}100% {left: 100%;}} </style><select class="city"></select><div class="row timer"><div class="timerLabel value">■■■■</div><div class="timerValue value">■■:■■</div></div><div class="vakitler"><div class="vakit imsak"><div class="label">İmsak</div><div class="value">■■:■■</div></div><div class="vakit gunes"><div class="label">Güneş</div><div class="value">■■:■■</div></div><div class="vakit ogle"><div class="label">Öğle</div><div class="value">■■:■■</div></div><div class="vakit ikindi"><div class="label">İkindi</div><div class="value">■■:■■</div></div><div class="vakit aksam"><div class="label">Akşam</div><div class="value">■■:■■</div></div><div class="vakit yatsi"><div class="label">Yatsı</div><div class="value">■■:■■</div></div></div>`;
class namazVaktiMini extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: "open"
        });
        this.shadowRoot.appendChild(namazVaktiMiniTemplate.content.cloneNode(true));
        this.citySelectElement = this.shadowRoot.querySelector("select.city");
        this.timerLabel = this.shadowRoot.querySelector(".timer .timerLabel");
        this.timerValue = this.shadowRoot.querySelector(".timer .timerValue");
        this.vakitlerDOM = this.shadowRoot.querySelector(".vakitler");
        this.handleData = this.handleData.bind(this);
        this.handleSelectInput = this.handleSelectInput.bind(this);
        this.timer = this.timer.bind(this); 
		
		
		this.themes = {
        "mavi": "220",
        "lacivert": "249",
        "mor": "282",
        "turkuaz": "182",
        "kirmizi": "7",
        "kahve": "35"
    };
	
    this.vakitler = {
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
    };
    this.cities = {
        "1": {
            "plate": 1,
            "name": "ADANA",
            "slug": "adana"
        },
        "2": {
            "plate": 2,
            "name": "ADIYAMAN",
            "slug": "adiyaman"
        },
        "3": {
            "plate": 3,
            "name": "AFYONKARAHİSAR",
            "slug": "afyonkarahisar"
        },
        "4": {
            "plate": 4,
            "name": "AĞRI",
            "slug": "agri"
        },
        "5": {
            "plate": 5,
            "name": "AMASYA",
            "slug": "amasya"
        },
        "6": {
            "plate": 6,
            "name": "ANKARA",
            "slug": "ankara"
        },
        "7": {
            "plate": 7,
            "name": "ANTALYA",
            "slug": "antalya"
        },
        "8": {
            "plate": 8,
            "name": "ARTVİN",
            "slug": "artvin"
        },
        "9": {
            "plate": 9,
            "name": "AYDIN",
            "slug": "aydin"
        },
        "10": {
            "plate": 10,
            "name": "BALIKESİR",
            "slug": "balikesir"
        },
        "11": {
            "plate": 11,
            "name": "BİLECİK",
            "slug": "bilecik"
        },
        "12": {
            "plate": 12,
            "name": "BİNGÖL",
            "slug": "bingol"
        },
        "13": {
            "plate": 13,
            "name": "BİTLİS",
            "slug": "bitlis"
        },
        "14": {
            "plate": 14,
            "name": "BOLU",
            "slug": "bolu"
        },
        "15": {
            "plate": 15,
            "name": "BURDUR",
            "slug": "burdur"
        },
        "16": {
            "plate": 16,
            "name": "BURSA",
            "slug": "bursa"
        },
        "17": {
            "plate": 17,
            "name": "ÇANAKKALE",
            "slug": "canakkale"
        },
        "18": {
            "plate": 18,
            "name": "ÇANKIRI",
            "slug": "cankiri"
        },
        "19": {
            "plate": 19,
            "name": "ÇORUM",
            "slug": "corum"
        },
        "20": {
            "plate": 20,
            "name": "DENİZLİ",
            "slug": "denizli"
        },
        "21": {
            "plate": 21,
            "name": "DİYARBAKIR",
            "slug": "diyarbakir"
        },
        "22": {
            "plate": 22,
            "name": "EDİRNE",
            "slug": "edirne"
        },
        "23": {
            "plate": 23,
            "name": "ELAZIĞ",
            "slug": "elazig"
        },
        "24": {
            "plate": 24,
            "name": "ERZİNCAN",
            "slug": "erzincan"
        },
        "25": {
            "plate": 25,
            "name": "ERZURUM",
            "slug": "erzurum"
        },
        "26": {
            "plate": 26,
            "name": "ESKİŞEHİR",
            "slug": "eskisehir"
        },
        "27": {
            "plate": 27,
            "name": "GAZİANTEP",
            "slug": "gaziantep"
        },
        "28": {
            "plate": 28,
            "name": "GİRESUN",
            "slug": "giresun"
        },
        "29": {
            "plate": 29,
            "name": "GÜMÜŞHANE",
            "slug": "gumushane"
        },
        "30": {
            "plate": 30,
            "name": "HAKKARİ",
            "slug": "hakkari"
        },
        "31": {
            "plate": 31,
            "name": "HATAY",
            "slug": "hatay"
        },
        "32": {
            "plate": 32,
            "name": "ISPARTA",
            "slug": "isparta"
        },
        "33": {
            "plate": 33,
            "name": "MERSİN(İÇEL)",
            "slug": "mersin"
        },
        "34": {
            "plate": 34,
            "name": "İSTANBUL",
            "slug": "istanbul"
        },
        "35": {
            "plate": 35,
            "name": "İZMİR",
            "slug": "izmir"
        },
        "36": {
            "plate": 36,
            "name": "KARS",
            "slug": "kars"
        },
        "37": {
            "plate": 37,
            "name": "KASTAMONU",
            "slug": "kastamonu"
        },
        "38": {
            "plate": 38,
            "name": "KAYSERİ",
            "slug": "kayseri"
        },
        "39": {
            "plate": 39,
            "name": "KIRKLARELİ",
            "slug": "kirklareli"
        },
        "40": {
            "plate": 40,
            "name": "KIRŞEHİR",
            "slug": "kirsehir"
        },
        "41": {
            "plate": 41,
            "name": "KOCAELİ",
            "slug": "kocaeli"
        },
        "42": {
            "plate": 42,
            "name": "KONYA",
            "slug": "konya"
        },
        "43": {
            "plate": 43,
            "name": "KÜTAHYA",
            "slug": "kutahya"
        },
        "44": {
            "plate": 44,
            "name": "MALATYA",
            "slug": "malatya"
        },
        "45": {
            "plate": 45,
            "name": "MANİSA",
            "slug": "manisa"
        },
        "46": {
            "plate": 46,
            "name": "KAHRAMANMARAŞ",
            "slug": "kahramanmaras"
        },
        "47": {
            "plate": 47,
            "name": "MARDİN",
            "slug": "mardin"
        },
        "48": {
            "plate": 48,
            "name": "MUĞLA",
            "slug": "mugla"
        },
        "49": {
            "plate": 49,
            "name": "MUŞ",
            "slug": "mus"
        },
        "50": {
            "plate": 50,
            "name": "NEVŞEHİR",
            "slug": "nevsehir"
        },
        "51": {
            "plate": 51,
            "name": "NİĞDE",
            "slug": "nigde"
        },
        "52": {
            "plate": 52,
            "name": "ORDU",
            "slug": "ordu"
        },
        "53": {
            "plate": 53,
            "name": "RİZE",
            "slug": "rize"
        },
        "54": {
            "plate": 54,
            "name": "SAKARYA",
            "slug": "sakarya"
        },
        "55": {
            "plate": 55,
            "name": "SAMSUN",
            "slug": "samsun"
        },
        "56": {
            "plate": 56,
            "name": "SİİRT",
            "slug": "siirt"
        },
        "57": {
            "plate": 57,
            "name": "SİNOP",
            "slug": "sinop"
        },
        "58": {
            "plate": 58,
            "name": "SİVAS",
            "slug": "sivas"
        },
        "59": {
            "plate": 59,
            "name": "TEKİRDAĞ",
            "slug": "tekirdag"
        },
        "60": {
            "plate": 60,
            "name": "TOKAT",
            "slug": "tokat"
        },
        "61": {
            "plate": 61,
            "name": "TRABZON",
            "slug": "trabzon"
        },
        "62": {
            "plate": 62,
            "name": "TUNCELİ",
            "slug": "tunceli"
        },
        "63": {
            "plate": 63,
            "name": "ŞANLIURFA",
            "slug": "sanliurfa"
        },
        "64": {
            "plate": 64,
            "name": "UŞAK",
            "slug": "usak"
        },
        "65": {
            "plate": 65,
            "name": "VAN",
            "slug": "van"
        },
        "66": {
            "plate": 66,
            "name": "YOZGAT",
            "slug": "yozgat"
        },
        "67": {
            "plate": 67,
            "name": "ZONGULDAK",
            "slug": "zonguldak"
        },
        "68": {
            "plate": 68,
            "name": "AKSARAY",
            "slug": "aksaray"
        },
        "69": {
            "plate": 69,
            "name": "BAYBURT",
            "slug": "bayburt"
        },
        "70": {
            "plate": 70,
            "name": "KARAMAN",
            "slug": "karaman"
        },
        "71": {
            "plate": 71,
            "name": "KIRIKKALE",
            "slug": "kirikkale"
        },
        "72": {
            "plate": 72,
            "name": "BATMAN",
            "slug": "batman"
        },
        "73": {
            "plate": 73,
            "name": "ŞIRNAK",
            "slug": "sirnak"
        },
        "74": {
            "plate": 74,
            "name": "BARTIN",
            "slug": "bartin"
        },
        "75": {
            "plate": 75,
            "name": "ARDAHAN",
            "slug": "ardahan"
        },
        "76": {
            "plate": 76,
            "name": "IĞDIR",
            "slug": "igdir"
        },
        "77": {
            "plate": 77,
            "name": "YALOVA",
            "slug": "yalova"
        },
        "78": {
            "plate": 78,
            "name": "KARABÜK",
            "slug": "karabuk"
        },
        "79": {
            "plate": 79,
            "name": "KİLİS",
            "slug": "kilis"
        },
        "80": {
            "plate": 80,
            "name": "OSMANİYE",
            "slug": "osmaniye"
        },
        "81": {
            "plate": 81,
            "name": "DÜZCE",
            "slug": "duzce"
        }
    };
		
		for (var plate in this.cities) {
            var option = document.createElement("option");
            option.value = plate;
            option.innerText = this.cities[plate].name;
            this.citySelectElement.appendChild(option);
        }
		
    }
    connectedCallback() {
        var city = localStorage.getItem("city") || this.getAttribute("city") || "34";
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
        if (name == "city")
            this.fetchData(newVal);
        else if (name == "theme") {
            this.setTheme(newVal);
        }
    }
    fetchData(plate) {
        var city = plate || localStorage.getItem("city") || this.getAttribute("city") || "34";
        const url = `https://service.kod8.app/api/namaz/${city}`;
        fetch(url).then(function (res) {
            return res.json();
        }).then(this.handleData);
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
        var current = this.currentVakit == null ? "yatsi" : this.currentVakit;
        this.vakitlerDOM.querySelector(`.${current}`).classList.add("current");
        for (var vakit in this.vakitler) {
            if (vakit == "imsak2")
                continue;
            this.vakitlerDOM.querySelector(`.${vakit} .value`).innerText = this.vakitler[vakit].value;
        }
        var next = this.getAttribute("ramazan") == "" ? this.vakitler[current].nextRamazan : this.vakitler[current].next;
        this.timerLabel.innerText = this.vakitler[next].label + " Kalan";
        if (this.getAttribute("ramazan") == "" && next == "aksam") {
            this.timerLabel.innerText = "İftar'a Kalan"
        }
        this.classList.remove("loading");
    }
    timer() {
        if (this.classList.contains("loading"))
            return;
        var next;
        var current = this.currentVakit == null ? "yatsi" : this.currentVakit;
        if (this.currentVakit == null) {
            next = "imsak";
        } else {
            next = this.getAttribute("ramazan") == "" ? this.vakitler[current].nextRamazan : this.vakitler[current].next
        }
        var now = new Date();
        var nextDateObj = this.vakitler[next].valueDateObj;
		if(!nextDateObj.getTime||!now.getTime) {return;}
        var diff = Math.round((nextDateObj.getTime() - now.getTime()) / 1000);
        var hour = Math.floor((diff / 3600));
        var min = Math.floor((diff / 60) % 60);
        var sec = Math.floor(diff % 60);
        var remainingText = String(hour).padStart(2, '0') + ":" + String(min).padStart(2, '0') + ":" + String(sec).padStart(2, '0');
        this.timerValue.innerText = remainingText;
        if (diff < 0) {
            this.findVakit();
        }
    }
    setTheme(themeID) {
        if (this.themes[themeID]) {
            this.style.setProperty("--hue", this.themes[themeID])
        } else {
            this.style.setProperty("--hue", themeID)
        }
    }
    handleSelectInput(e) {
        if (this.getAttribute("city") !== e.target.value) {
            this.setAttribute("city", e.target.value);
            localStorage.setItem('city', e.target.value);
        }
        if (this.getAttribute("also-trigger")) {
            var targetComponent = this.getAttribute("also-trigger");
            document.querySelectorAll(targetComponent).forEach(function(el){ el.changeCityFromOutside(e.target.value)})
        }
    }
    changeCityFromOutside(city) {
        var event = new Event('change');
        this.citySelectElement.value = city;
        this.citySelectElement.dispatchEvent(event);
    }
    
}
window.customElements.define("namaz-vakti-mini", namazVaktiMini)
