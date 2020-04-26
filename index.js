"use strict";

const searchUrl = "https://www.balldontlie.io/api/v1/players";
const googleToken = "AIzaSyAgE8IayOAxLdH5XFeo9Nd8crgDXroYX_E";

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
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $(".error-message").text(`Something went wrong: ${err.message}`);
    });
}

function getVideos(searchQuery) {
  $("#go").on("click", event => {
    const videoUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&order=relevance&q=${searchQuery}&type=video&key=${googleToken}`;
    fetch(videoUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayVideos(responseJson))
      .catch(err => {
        $(".error-message").text(`Something went wrong: ${err.message}`);
      });
  });
}

function displayVideos(responseJson) {
  $(".vids").empty();
  for (let i = 0; i < responseJson.items.length; i++) {
    $(".vids").append(
      `<div class="yt-item"> <iframe src=\"https://www.youtube.com/embed/${responseJson.items[i].id.videoId}/"></iframe> </div>`
    );
  }
  $(".videos").removeClass("hidden");
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
      <li> Season: ${responseJson.data[i].season} Games Played: ${responseJson.data[i].games_played}</li>
      <li> Minutes: ${responseJson.data[i].min} Points: ${responseJson.data[i].pts}</li>
      <li> Rebounds: ${responseJson.data[i].reb} Assist: ${responseJson.data[i].ast}</li>
      <li> Steals: ${responseJson.data[i].stl} Blocks: ${responseJson.data[i].blk}</li>`
      );
    }
  }
  $(".player-stats").removeClass("hidden");
  $(".content-container").removeClass("hidden");
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
    getVideos(searchTerm);
    if (searchTerm.split(" ").length == 2) {
      getPlayers(searchTerm, seasonTerm);
    } else {
      alert("please provide a full name");
    }
  });
}

$(handleForm);
