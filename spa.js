const app = {
    response: [],
    html: [],
    cache: {},
    root: null,
    page: 0,
    async init(ev){
        app.root = document.getElementById('root');

        history.replaceState({}, 'Home', '#home');
        window.addEventListener("hashchange", app.hashchange);

        await app.getData();
        app.showHome();
    },
    nav(ev){
        ev.preventDefault();
        let name = ev.target.getAttribute('data-target');
        let countryCode = ev.target.getAttribute('data-country-code');
        history.pushState({countryCode}, name, `#${name}`);
        app.showCountry(countryCode);
    },
    hashchange(){
        if(location.hash.slice(1) === 'home'){
            app.showHome();
        }else{
            let { countryCode } = history.state;
            app.showCountry(countryCode);
        }
    },
    showHome(){
        app.html.length = 0;
        app.html.push(
            `<div id="grid-wrapper">`
        )
        app.response.slice(app.page * 30, app.page*30 + 30).forEach(country => {
            app.html.push(
                `<div class="col-lg-4">
                    <img src=${country.flag} class="bd-placeholder-img rounded-circle" width="140" height="140" alt=${country.name}/>
                    <h4>${country.name}</h4>
                    <p>
                        <a class="nav-link btn btn-secondary"
                            data-target=${country.name.toLowerCase()} data-country-code=${country.alpha2Code}
                            href="#" role="button">
                            View details
                            </a>
                    </p>
                </div>`
        )});
        app.html.push(
            `</div>
            <div class="direction-buttons">
                <button class="btn btn-dark" id="back-button" onclick="app.backButton()">Back</button>
                <button class="btn btn-dark" id="forward-button" onclick="app.forwardButton()">Forward</button>
            </div>`
        )
        app.root.innerHTML = app.html.join("");

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', app.nav)
        });

    },
    backButton(){
        if(app.page){
            app.page--;
            this.showHome();
        }
    },
    forwardButton(){
        if(app.page < app.response.length/30 + 1){
            app.page++;
            this.showHome();
        }
    },
    getData(){
        return fetch('https://restcountries.eu/rest/v2/all')
        .then(response => response.json())
        .then(json => {
            app.response = json;
        });
    },
    async showCountry(code){
        let country;
        if(!app.cache[code]){
            let response = await fetch(`https://restcountries.eu/rest/v2/alpha/${code}`);
            country = await response.json();
            app.cache = {...app.cache, [code]: country}
        }
        else{
            country = app.cache[code];
        }
        app.root.innerHTML = `${country.name}: ${country.capital}`
    }
}

document.addEventListener('DOMContentLoaded', app.init);