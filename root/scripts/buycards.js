let url = "https://pokeapi.co/api/v2/pokemon";

const getpokemon = async () => {
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        data.results.forEach(async(pokemon) => {
            const respons = await fetch(pokemon.url);
            const dataPokemon = await respons.json();

            const container = document.querySelector('.container');
            
            let pokeCard = document.createElement('div');
            pokeCard.className = 'pokeCard';
            pokeCard.innerHTML = `
                <div class = "headerCard">
                    <p>${dataPokemon.name}</p>
                    <i>
                </div>

                <img class = "imgPoke" src = "${dataPokemon.sprites.other["home"].front_default}">
                <div>
                    <p>${dataPokemon.base_experience}</p>
                    <button>Buy</button>
                </div>

            `

                container.appendChild(pokeCard);
        });
    } catch (error){
        alert("Error en la url");
    }
}

getpokemon();