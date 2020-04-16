"use strict";

const searchUrl = "https://www.balldontlie.io/api/v1/players";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayPlayerInfo(responseJson) {
  $(".results-list").empty();
  for (let i = 0; i < responseJson.data.length; i++) {
    $(".results-list").append(
      `<li>Player Name: ${responseJson.data[i].first_name +
        " " +
        responseJson.data[i].last_name}</li>
      <li>Height: ${responseJson.data[i].height_feet +
        "'" +
        responseJson.data[i].height_inches}</li>
      <li>Position: ${responseJson.data[i].position}</li>
      <li>Weight(lbs): ${responseJson.data[i].weight_pounds}</li>`
    );
  }
  $(".results").removeClass("hidden");
}

function getStats(playerID, season) {
  const statsUrl = `https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${playerID}&season=${season}`;
  fetch(statsUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      displayResults(responseJson), console.log(responseJson.data);
    })
    .catch(err => {
      $(".error-message").text(`Something went wrong: ${err.message}`);
    });
}

function displayResults(responseJson) {
  $(".stats").empty();
  if (responseJson.data.length == 0) {
    $(".stats").append(`<li> This player did not play during the season </li>`);
    console.log("hey");
  } else {
    for (let i = 0; i < responseJson.data.length; i++) {
      $(".stats").append(
        `
      <li> Season: ${responseJson.data[i].season}</li>
      <li> Games Played: ${responseJson.data[i].games_played}</li>
      <li> Minutes: ${responseJson.data[i].min}</li>
      <li> Points: ${responseJson.data[i].pts}</li>
      <li> Rebounds: ${responseJson.data[i].reb}</li>
      <li> Assist: ${responseJson.data[i].ast}</li>
      <li> Steals: ${responseJson.data[i].stl}</li>
      <li> Blocks: ${responseJson.data[i].blk}</li>`
      );
    }
  }
  $(".player-stats").removeClass("hidden");
}

function getPlayers(player, year) {
  const params = {
    search: player
  };
  const queryString = formatQueryParams(params);
  const url = searchUrl + "?" + queryString;
  const season = year;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      displayPlayerInfo(responseJson);
      getStats(responseJson.data[0].id, season);
    })
    .catch(err => {
      $(".error-message").text(`Something went wrong: ${err.message}`);
    });
}

function handleForm() {
  $("form").submit(event => {
    event.preventDefault();
    const searchTerm = $("#search").val();
    const seasonTerm = $("#season").val();
    getPlayers(searchTerm, seasonTerm);
  });
}

$(handleForm);
