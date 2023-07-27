let url = "https://pokeapi.co/api/v2";
const container = document.querySelector(".container");

let limit = 20;
let offset = 0;
let selecType = "all";
let pokemons = [];
let countCards = 0;

const allDataPokemon = async () => {
  const res = await fetch(`${url}/pokemon?limit=20&offset=${offset}`);
  const data = await res.json();
  showDataPokemons(data.results);
  console.log(offset);
  console.log(limit);
};

allDataPokemon();

const showDataPokemons = (pokemons) => {
  pokemons.forEach(async (pokemon) => {
    const respons = await fetch(pokemon.url);
    const dataPokemon = await respons.json();

    renderCard(dataPokemon);
  });
};

const renderCard = async (dataPokemon) => {
  let pokeCard = document.createElement("div");

  const colorThief = new ColorThief();
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.crossOrigin = "Anonymous";
      img.src = src;
    });

  const imageSrc = dataPokemon.sprites.other["official-artwork"].front_default;

  const imagePoke = await loadImage(imageSrc);
  const color = `rgb(${colorThief.getColor(imagePoke).join()})`;

  const hexColor = rgbToHex(color);

  const pokemonName = dataPokemon.name.charAt(0).toUpperCase() + dataPokemon.name.slice(1);
  pokeCard.className = "pokeCard";
  pokeCard.style.background = `repeating-linear-gradient(45deg, ${hexColor},#FFFFFF, ${hexColor},#FFFFFF,${hexColor})`;
  pokeCard.innerHTML = `
          <div class = "headerCard">
              <p>${pokemonName}</p>
              <i class = "fa-sharp fa-regular fa-heart"></i>
          </div>

          <img class = "imgPoke" src = "${dataPokemon.sprites.other["official-artwork"].front_default}" >
          <div class = "footerCard">
            <p>Exp ${dataPokemon.base_experience}</p>
            <button class = "btnCard">Buy</button>
          </div>
            `;

  container.appendChild(pokeCard);
  countCards++;
  const totalCards = document.querySelector(".cardsCount");
  totalCards.textContent = `${countCards} Cards`;
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
      }
    })
  );
};

const filterRenderCard = async (type) => {
  await filterDataPokemon(type);
  showDataPokemonSlice();
};

const getTypes = async () => {
  const resType = await fetch(`${url}/type`);
  const allTypes = await resType.json();
  typesPokemon = allTypes.results.map((type) => type.name);
  typesPokemon.length = typesPokemon.length - 2;
  renderNav();
};

getTypes();

const renderNav = () => {
  const navTypes = document.querySelector(".nav");
  typesPokemon.forEach(async (typePokemon) => {
    const capitalizedType =
      typePokemon.charAt(0).toUpperCase() + typePokemon.slice(1);

    let liType = document.createElement("li");
    liType.className = "navType";
    liType.innerHTML = `
        <a  href="#" class="link">${capitalizedType}</a>
      `;
    //Select div container and push li with type name
    navTypes.appendChild(liType);
  });
  filterByType();
};

const filterByType = () => {
  const filter = document.querySelectorAll(".link");

  filter.forEach((typesPokemon) => {
    typesPokemon.addEventListener("click", (event) => {
      event.preventDefault();
      selecType = typesPokemon.textContent.toLowerCase();
      console.log(selecType);
      cleanDataFilter();
      if (selecType != "all") {
        filterRenderCard(selecType);
      } else {
        countCards = 0;
        allDataPokemon();
      }
    });
  });
};

const cleanDataFilter = () => {
  container.innerHTML = "";
  offset = 0;
  limit = 20;
};

const addEventClickBtnMore = () => {
  const btnMore = document.querySelector(".btnMore");
  btnMore.addEventListener("click", async () => {
    offset = limit;
    limit = limit + 20;

    if (selecType != "all") {
      showDataPokemonSlice();
    } else {
      allDataPokemon();
    }
  });
};

addEventClickBtnMore();

const showDataPokemonSlice = () => {
  const pokemonsSlice = pokemons.slice(offset, limit);
  countCards = offset;
  showDataPokemons(pokemonsSlice);
};

const rgbToHex = (rgb) => {
  const regex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
  const match = rgb.match(regex);

  if (!match) {
    throw new Error('Formato RGB inválido. Debe ser en formato "rgb(r, g, b)".');
  }

  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
}
