let url = "https://pokeapi.co/api/v2";
const container = document.querySelector(".container");

let limit = 20;
let offset = 0;
let selecType = "all";
let pokemons = [];

const allDataPokemon = async () => {
  const res = await fetch(`${url}/pokemon?limit=${limit}&offset=${offset}`);
  const data = await res.json();
  showDataPokemons(data.results);
};

allDataPokemon();

function showDataPokemons(pokemons) {
  pokemons.forEach(async (pokemon) => {
    const respons = await fetch(pokemon.url);
    const dataPokemon = await respons.json();

    renderCard(dataPokemon);
  });
}

const renderCard = async (dataPokemon) => {
  let pokeCard = document.createElement("div");
  pokeCard.className = "pokeCard";
  pokeCard.innerHTML = `
          <div class = "headerCard">
              <p>${dataPokemon.name}</p>
              <i class = "fa-sharp fa-regular fa-heart"></i>
          </div>

          <img class = "imgPoke" src = "${dataPokemon.sprites.other["official-artwork"].front_default}">
          <div>
            <p>Exp ${dataPokemon.base_experience}</p>
            <button>Buy</button>
          </div>
            `;

  container.appendChild(pokeCard);
};

const filterDataPokemon = async (type) => {
  const res = await fetch(`${url}/type`);
  const data = await res.json();

  await Promise.all(
    data.results.map(async (result) => {
      if (type === result.name) {
        const response = await fetch(result.url);
        const typeData = await response.json();

        pokemons = typeData.pokemon.map((pokemons) => pokemons.pokemon);
        console.log(pokemons);
      }
    })
  );
};

const filterRenderCard = async (type) => {
  await filterDataPokemon(type);
  showDataPokemonSlice();
};

const filter = document.querySelectorAll(".type");

filter.forEach((filterType) => {
  filterType.addEventListener("click", (event) => {
    event.preventDefault();
    selecType = filterType.textContent.toLowerCase();
    cleanDataFilter();
    if (selecType != "all") {
      filterRenderCard(selecType);
    } else {
      allDataPokemon();
    }
  });
});

function cleanDataFilter() {
  container.innerHTML = "";
  offset = 0;
  limit = 20;
}

function addEventClickBtnMore() {
  const btnMore = document.querySelector(".btnMore");
  btnMore.addEventListener("click", async () => {
    offset += limit;
    if (selecType != "all") {
      showDataPokemonSlice();
    } else {
      allDataPokemon();
    }
    console.log(offset);
    console.log(limit);
  });
}

addEventClickBtnMore();

function showDataPokemonSlice() {
  const pokemonsSlice = pokemons.slice(offset, limit);

  showDataPokemons(pokemonsSlice);
}

// const filterByType = (type) => {
//   const cards = document.querySelectorAll(".pokeCard");
//   cards.forEach((card) => {
//     const cardType1 = card.getAttribute("type1");
//     const cardType2 = card.getAttribute("type2");

//     if (type === "all" || cardType1 === type || cardType2 === type) {
//       card.classList.remove("hidden");
//     } else {
//       card.classList.add("hidden");
//     }
//   });
// };
