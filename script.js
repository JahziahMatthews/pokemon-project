const nameInput = document.getElementById("pokemonInput");
const searchBtn = document.getElementById("searchBtn");
const imgCont = document.getElementById("pokemonImage");
const infoBox = document.getElementById("pokemonInfo");
const errorBox = document.getElementById("errorBox");

function makeCapital(str) {
  if (str.length === 0) {
    return "";
  }

  str = str.slice(1, -1);
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}

async function getFetch() {
  const name = nameInput.value.trim().toLowerCase();

  errorBox.classList.remove("text-[#EF4444]", "text-emerald-400");
  if (name === "") {
    errorBox.classList.add("text-[#EF4444]");
    errorBox.textContent = "No Name Entered";

    imgCont.src = "";
    return;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) throw new Error("Pokémon not found!");

    const pkData = await response.json();

    const pkName = JSON.stringify(pkData.name);
    const pkImgUrl = pkData.sprites.other["official-artwork"].front_default;

    if (pkData.types && pkData.types.length > 0) {
      const types = pkData.types
        .map((t) => makeCapital(JSON.stringify(t.type.name)))
        .join(", ");
      infoBox.textContent = `Name: ${makeCapital(pkName)}, ID: ${
        pkData.id
      }, Type: ${types}`;
    } else {
      infoBox.textContent = `Name: ${makeCapital(pkName)}, ID: ${
        pkData.id
      }, Type: Unknown`;
    }

    imgCont.src = pkImgUrl;

    // console.log(pkData) // uncommented this out so much just to see the data man 😭✌️

    errorBox.textContent = "Success!";
    errorBox.classList.add("text-emerald-400");

    console.log(`Pokemon Found: ${name.toUpperCase()}`);
  } catch (e) {
    errorBox.classList.add("text-[#EF4444]");
    errorBox.textContent = e;

    console.error("Error fetching Pokémon:", e);
    imgCont.src = "";
  }
}

let onCooldown = false;

function handleSearch() {
  if (onCooldown) return;

  getFetch();
  onCooldown = true;

  searchBtn.disabled = true;
  searchBtn.classList.add("cursor-not-allowed");
  searchBtn.classList.remove("hover:scale-105");
  searchBtn.textContent = "Please wait...";

  setTimeout(() => {
    onCooldown = false;
    searchBtn.disabled = false;
    searchBtn.classList.add("hover:scale-105");
    searchBtn.classList.remove("cursor-not-allowed");
    searchBtn.textContent = "Search...";
  }, 800);
}

searchBtn.addEventListener("click", handleSearch);
nameInput.addEventListener("keydown", (i) => {
  if (i.key === "Enter") {
    handleSearch();
  }
});