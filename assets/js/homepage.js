// global variables
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function (user) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        // format response as json()
        response.json().then(function (data) {
          // send response data to displayRepos() after conversion
          displayRepos(data, user);
        });
      } else {
        alert("Error:" + response.statusText);
      }
    })
    .catch(function (error) {
      // Notice this '.catch()' getting chained onto the end of the '.then()'
      alert("Unable to connect to GitHub");
    });
};
// get the value of the form <input> element and send it over to getUserRepos()
var formSubmitHandler = function (event) {
  event.preventDefault();

  // get value from input element
  var username = nameInputEl.value.trim();

  // validates if username is null
  if (username) {
    // if username has value passes data from username as an argument
    getUserRepos(username);
    // clear the form
    nameInputEl.value = "";
  } else {
    // if null alert message
    alert("Please enter a GitHub username");
  }
};
// Display Repos
var displayRepos = function (repos, searchTerm) {
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }

  // clear old content
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  // loop over repos
  for (var i = 0; i < repos.length; ++i) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a container for each repo and style
    var repoEl = document.createElement("div");
    repoEl.classList = "list-item flex-row justify-space-between align-center";

    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append titleEl to container div
    repoEl.appendChild(titleEl);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    //check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class= 'fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        "issue(s)";
    } else {
      statusEl.innerHTML =
        "<i class= 'fas fa-check-square status-icon icon-success'></i>";
    }

    // append statusEl to container
    repoEl.appendChild(statusEl);

    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }
};

// event listener to execute function formSubmitHandler when "Get User" button clicked
userFormEl.addEventListener("submit", formSubmitHandler);
