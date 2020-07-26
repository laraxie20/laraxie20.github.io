const base_url = "https://api.football-data.org/v2/";
const token = '78d330b2bdfa4ffca1f681452a6c5467';
const year = 2021;

const league_standing = `${base_url}competitions/${year}/standings`;
const league_team = `${base_url}competitions/${year}/teams`;
const team_id = `${base_url}teams/`;

const fetchApi = url => {
  return fetch(url, {
    method: "get",
    mode: "cors",
    headers: {
      'X-Auth-Token': token
    }
  })
    .then(status)
    .then(json)
    .catch(error);
}

function status(response) {
  if (response.status !== 200) {
    console.log('Error : ' + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log('Error : ' + error);
}

//Standing
function getStandings() {
  showLoader();
  if ('caches' in window) {
    caches.match(league_standing).then(response => {
      if (response) {
        response.json().then(data => {
          showStandings(data);
        });
      }
    });
  }

  fetchApi(league_standing).then(data => {
    showStandings(data);
  })
}

//All Team
function getAllTeams() {
  showLoader();
  if ('caches' in window) {
    caches.match(league_team).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          allTeams(data);
        });
      }
    });
  }
  fetchApi(league_team)
    .then(function(data) {
      allTeams(data);
    })
}

//Favorite Team
function getTeam(team) {
  showLoader();
  if ('caches' in window) {
    caches.match(team).then(response => {
      if (response) {
        response.json().then(data => {
          showTeam(data);
          buttonAction(data);
        });
      }
    });
  }

  fetchApi(team).then(data => {
    showTeam(data);
    buttonAction(data);
  })
}

//Menampilkan Data Standing
function showStandings(data) {
  hideLoader();
  var standingsHTML = '';
  data.standings[0].table.forEach(data => {
    standingsHTML +=
      `<tr>
          <td>${data.position}</td>
          <td><a href="team.html?id=${data.team.id}"><img src="${data.team.crestUrl}" class="responsive-img" style="margin-bottom:-6px; width:30px; height:30px" alt="team-logo"></a></td>
          <td><a href="team.html?id=${data.team.id}">${data.team.name}</a></td>
          <td>${data.playedGames}</td>
          <td>${data.won}</td>
          <td>${data.draw}</td>
          <td>${data.lost}</td>
          <td>${data.goalsFor}</td>
          <td>${data.goalsAgainst}</td>
          <td>${data.goalDifference}</td>
          <td><b>${data.points}</b></td>
      </tr>`;
  });

  document.getElementById("standings").innerHTML = standingsHTML;
}

//Menampilkan Semua List Data Team
function allTeams(data) {
  hideLoader();
  var html = `<div class="row">`;
  var str = JSON.stringify(data).replace(/http:/g, 'https:');
  data = JSON.parse(str);
  teamData = data;

  for (team of data.teams) {
    html += `
      <div class="col s12 m6">
        <div class="card center">
          <div class="card-content">
            <img src="${team.crestUrl}" width="64" height="64" alt="team-logo">
            <h6>${team.name}</h6>
            <p>${team.founded}</p>
            <p>${team.venue}</p><br>
            <a href="team.html?id=${team.id}"class="waves-effect waves-light btn-small blue">Selengkapnya</a>
          </div>
      </div>
    </div>`;
  }

  document.getElementById("allteams").innerHTML = html;
};

//Menampilkan Detail Team
function showTeam(data) {
  hideLoader();
  var teamHTML = '';
  var squadHTML = '';
  teamHTML += `
      <blockquote>
        <h5>${data.name}</h5>
      </blockquote>

      <div class="row about">
        <div class="col s12 m6">
          <img src=${data.crestUrl.replace(/^http:\/\//i, 'https://')} class="img-logo" alt="team-logo">
        </div>
        <div class="col s12 m6">
          <p>Tahun Berdiri: ${data.founded}</p>
          <p>Nama Stadion: ${data.venue}</p>
          <p>E-mail: ${data.email}</p>
          <p>Telepon: ${data.phone}</p>
          <p>Alamat: ${data.address}</p>
          <p><a href="${data.website}" target="_blank">${data.website}</a></p>
        </div>
      </div>

      <blockquote>
        <h5>Informasi Pemain</h5>
      </blockquote>`;

  data.squad.forEach( dt => {
    squadHTML += `
      <li>
        <div class="collapsible-header">
          <i class="material-icons">person</i>
          ${dt.name}
        </div>
        <div class="collapsible-body">
          <h5>[${dt.position}] ${dt.name}</h5>
          <p>
            Tempat, Tanggal Lahir : ${dt.countryOfBirth}, ${dt.dateOfBirth}<br>
            Kebangsaan : ${dt.nationality}
          </p>
        </div>
      </li>`;
  });

  document.getElementById("teamDetail").innerHTML = teamHTML;
  document.getElementById("squadDetail").innerHTML = squadHTML;
}

//Menampilkan List Team Favorit
function getFavoriteTeam() {
  hideLoader();
  var dbData = getFavData();
  dbData.then( data => {
    var timfavHTML = '';
    if (data.length > 0) {
      data.forEach( team => {
        timfavHTML += `
          <div class="col s12 m6">
            <div class="card center">
              <div class="card-content">
                <img src=${team.crestUrl.replace(/^http:\/\//i, 'https://')} width="64" height="64" alt="team-logo">
                <h6>${team.name}</h6>
                <p>${team.founded}</p>
                <p>${team.venue}</p><br>
                <a href="team.html?id=${team.id}"class="waves-effect waves-light btn-small blue">Selengkapnya</a>
              </div>
            </div>
          </div>`;
      });
    } else {
      timfavHTML = '<br><br><h6 align="center">Belum ada tim favorit yang kamu tambahkan.</h6>';
    }

    document.getElementById("favorite").innerHTML = timfavHTML;
  });
}

//Button
function buttonAction(data) {
  let btnSave = document.getElementById("btnSave");
  let btnDelete = document.getElementById("btnDelete");

  checkData(data.id).then(() => {
    btnSave.style.display = "none";
    btnDelete.style.display = "block";
  }).catch(() => {
    btnSave.style.display = "block";
    btnDelete.style.display = "none";
  });

  btnSave.onclick = () => {
    addFavorite(data);
    btnSave.style.display = "none";
    btnDelete.style.display = "block";
  };

  btnDelete.onclick = () => {
    deleteFavorite(data);
    btnSave.style.display = "block";
    btnDelete.style.display = "none";
  }
}

//Preloader
function showLoader() {
  var loader = `
    <div class="preloader-wrapper big active">
      <div class="spinner-layer spinner-blue-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>`

  document.getElementById("loader").innerHTML = loader;
}

function hideLoader() {
  document.getElementById("loader").innerHTML = '';
}