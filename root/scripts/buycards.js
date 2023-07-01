let url = "https://pokeapi.co/api/v2/pokemon";

const getpokemon = async () => {
    try {
        const res = await fetch(url);
        const data = await res.json();

        data.results.forEach(async(pokemon) => {
            const respons = await fetch(pokemon.url);
            const dataPokemon = await respons.json();

            const [type1,type2]= dataPokemon.types.map(
                (typePokemon) => typePokemon.type.name
              );

            const container = document.querySelector('.container');
            
            let pokeCard = document.createElement('div');
            pokeCard.className = 'pokeCard';
            pokeCard.innerHTML = `
                <div class = "headerCard">
                    <p>${dataPokemon.name}</p>
                    <i class = "fa-sharp fa-regular fa-heart"></i>
                </div>

                <img class = "imgPoke" src = "${dataPokemon.sprites.other["home"].front_default}">
                <div>
                    <p>Exp ${dataPokemon.base_experience}</p>
                    <button>Buy</button>
                </div>

            `

                container.appendChild(pokeCard);

                pokeCard.setAttribute("type1", type1);
                pokeCard.setAttribute("type2", type2);
        });
    } catch (error){
        alert("Error en la url");
    }
}

getpokemon();

const filter = document.querySelectorAll('.type');

filter.forEach((filterType) => {
    filterType.addEventListener("click", (event) => {
      event.preventDefault();
      const type = filterType.textContent.toLowerCase();
      filterByType(type);
    });
  });
  
  const filterByType = (type) => {
    const cards = document.querySelectorAll(".pokeCard");
    cards.forEach((card) => {
      const cardType1 = card.getAttribute("type1");
      const cardType2 = card.getAttribute("type2");
  
      if (type === "all" || cardType1 === type || cardType2 === type) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  };