//Henter input i fra brukeren og tømmer de for nytt søk etterpå

async function searchCharacters() {
  const query = document.getElementById("searchInput").value;
  const charactersDiv = document.getElementById("characters");
  const episodesDiv = document.getElementById("episodes");
  charactersDiv.innerHTML = "";
  episodesDiv.innerHTML = "";

  //Henter info i fra API

  try {
    const res = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${query}`
    );
    const data = await res.json();

    //Går igjennom alle karakterene og lager en div for karakterene og gir klassen "card" for styling i CSS.

    data.results.forEach((character) => {
      const card = document.createElement("div");
      card.className = "card";

      //Fyller kortene med bilde og info.

      card.innerHTML = `
          <img src="${character.image}" alt="${character.name}" />
          <h3>${character.name}</h3>
          <p>Status: ${character.status}</p>
          <p>Rase: ${character.species}</p>
        `;

      //Viser informasjon om hvilke episoder karakterene er med i.
      card.onclick = () => showEpisodes(character);
      charactersDiv.appendChild(card);
    });

    //Feilmelding hvis det skulle oppstå en error.
  } catch (err) {
    charactersDiv.innerHTML = "<p>No characters found.. 😢</p>";
  }
}

//Viser tekst med at informasjon hentes.
async function showEpisodes(character) {
  const episodesDiv = document.getElementById("episodes");
  episodesDiv.innerHTML = `<h2>Episoder med ${character.name}</h2><p>Loading...</p>`;

  //Henter episodene karakteren er med i.
  try {
    const episodeURLs = character.episode;
    const episodePromises = episodeURLs.map((url) =>
      fetch(url).then((res) => res.json())
    );

    // Viser episodene i en liste.
    const episodes = await Promise.all(episodePromises);
    episodesDiv.innerHTML =
      `<h2>Episoder med ${character.name}</h2><ul>` +
      episodes.map((ep) => `<li>${ep.episode} - ${ep.name}</li>`).join("") +
      `</ul>`;

    //Feilmelding hvis error oppstår.
  } catch (err) {
    episodesDiv.innerHTML = "<p>Could not load episodes.</p>";
  }
}

//Lar oss bruke enter-knapp istedenfor å trykke på "search".
document
  .getElementById("searchInput")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      searchCharacters();
    }
  });
