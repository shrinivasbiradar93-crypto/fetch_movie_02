const movieName = document.getElementById("movieName");
const movieType = document.getElementById("movieType");
const movieRating = document.getElementById("movieRating");
const movieImage = document.getElementById("movieImage");
const movieDate = document.getElementById("movieDate");
const movieDescription = document.getElementById("movieDescription");
const movieForm = document.getElementById("movieForm");
const movieModel = document.getElementById("movieModel");
const addMovieBtn = document.getElementById("addMovieBtn");
const backdrop = document.getElementById("backdrop");
const moviecontainer = document.getElementById("moviecontainer");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const cancleBtn = document.getElementById("cancleBtn");
const closeMovieModalIcon = document.getElementById("closeMovieModalIcon");
const spinner = document.getElementById("spinner");


const BASE_URL = "https://fetchmovies02-default-rtdb.firebaseio.com";
const MOVIE_URL = `${BASE_URL}/movies.json`;


const state = {
    movieArr: [],
    editId: null
};

function snackBar(msg, icon) {
    Swal.fire({
        text: msg,
        icon: icon,
        timer: 3000
    });
}

function rating(rating) {
    if (rating >= 7) {
        return "badge-success";
    } else if (rating >= 3 && rating < 7) {
        return "badge-warning";
    } else {
        return "badge-danger";
    }
}

function showHideSpinner(flag) {
    if (flag) {
        spinner.classList.remove("d-none");
    } else {
        spinner.classList.add("d-none");
    }
}

function onMovieModel() {
    movieModel.classList.toggle("active");
    backdrop.classList.toggle("active");
    updateBtn.classList.add("d-none");
    addBtn.classList.remove("d-none");
    closeMovieModalIcon.classList.toggle("active");
    movieForm.reset();
}

function objToArr(obj) {
    for (const key in obj) {
        obj[key].id = key;
        state.movieArr.unshift(obj[key]);
    }
}

function makeApiCall(url, method, body = null) {
    body = body ? JSON.stringify(body) : null;
    return fetch(url, {
        method: method,
        body: body,
        headers: {
            "content-type": "application/json",
            "authorization": "JWT TOKEN"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Error....!!!");
            }
            return res.json();
        });
}


function showMovies(arr) {
    let result = ``;
    arr.forEach(movie => {
        result += `
            <div class="col-md-3" id="${movie.id}">
                <div class="card mt-3 movieCard">
                    <div class="card-header d-flex justify-content-between">
                        <div>
                            <h4 class="text-white movieTitle">${movie.movieName}</h4>
                            <small class="text-white">Movie Date : ${movie.movieDate}</small>
                            ${movie.updatedAt ? `<br><small class="text-white">Updated At : ${new Date(movie.updatedAt).toLocaleString()}</small>` : ""}
                        </div>
                        <h5 class="m-0">
                            <span class="badge ${rating(movie.movieRating)}">
                                ${movie.movieRating}
                            </span>
                        </h5>
                    </div>
                    <div class="card-body py-0">
                        <figure class="py-0">
                            <img src="${movie.movieImage}" alt="${movie.movieName}">
                            <figcaption>
                                <h5 class="m-0">${movie.movieName}</h5>
                                <h6 class="text-info">Genre : ${movie.movieType}</h6>
                                <p>${movie.movieDescription}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onMovieEdit(this)" type="button" class="btn btn-sm btn-secondary">Edit</button>
                        <button onclick="onMovieDelete(this)" type="button" class="btn btn-sm btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        `;
    });
    moviecontainer.innerHTML = result;
}


function fetchMovies() {
    showHideSpinner(true);
    makeApiCall(MOVIE_URL, "GET")
        .then(data => {
            state.movieArr = [];
            objToArr(data);
            showMovies(state.movieArr);
        })
        .catch(err => {
            snackBar(err.message, "error");
            console.log(err);
        })
        .finally(() => {
            showHideSpinner(false);
        });
}


fetchMovies();
function onCreateMovie(eve) {
    eve.preventDefault();
    let newMovieObj = {
        movieName: movieName.value,
        movieType: movieType.value,
        movieRating: movieRating.value,
        movieImage: movieImage.value,
        movieDate: movieDate.value,
        movieDescription: movieDescription.value,
        createdAt: new Date().toLocaleString()
    };
    
    showHideSpinner(true);
    makeApiCall(MOVIE_URL, "POST", newMovieObj)
        .then(data => {
            newMovieObj.id = data.name;
            state.movieArr.unshift(newMovieObj);
            let col = document.createElement("div");
            col.className = "col-md-3";
            col.id = newMovieObj.id;
            col.innerHTML = `
            <div class="card mt-3 movieCard">
                <div class="card-header d-flex justify-content-between">
                    <div>
                        <h4 class="text-white movieTitle">${newMovieObj.movieName}</h4>
                        <small class="text-white">Movie Date : ${newMovieObj.movieDate}</small>
                    </div>
                    <h5 class="m-0">
                        <span class="badge ${rating(newMovieObj.movieRating)}">
                            ${newMovieObj.movieRating}
                        </span>
                    </h5>
                </div>
                <div class="card-body py-0">
                    <figure class="py-0">
                        <img src="${newMovieObj.movieImage}" alt="${newMovieObj.movieName}">
                        <figcaption>
                            <h5 class="m-0">${newMovieObj.movieName}</h5>
                            <h6 class="text-info">Genre : ${newMovieObj.movieType}</h6>
                            <p>${newMovieObj.movieDescription}</p>
                        </figcaption>
                    </figure>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button onclick="onMovieEdit(this)" type="button" class="btn btn-sm btn-secondary">Edit</button>
                    <button onclick="onMovieDelete(this)" type="button" class="btn btn-sm btn-danger">Delete</button>
                </div>
            </div>
        `;
            moviecontainer.prepend(col);
            movieForm.reset();
            onMovieModel();
            snackBar("The Movie is Added Successfully...!!!", "success");
        })
        .catch(err => {
            snackBar(err.message, "error");
            console.log(err);
        })
        .finally(() => {
            showHideSpinner(false);
        });
}


function onMovieDelete(ele) {
    let REMOVE_ID = ele.closest(".col-md-3").id;
    let REMOVE_URL = `${BASE_URL}/movies/${REMOVE_ID}.json`;
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete it!"
    })
        .then(result => {
            if (result.isConfirmed) {
                showHideSpinner(true);
                makeApiCall(REMOVE_URL, "DELETE")
                    .then(data => {
                        let getIndex = state.movieArr.findIndex(movie => movie.id === REMOVE_ID);
                        state.movieArr.splice(getIndex, 1);
                        ele.closest(".col-md-3").remove();
                        snackBar("The Movie is Deleted Successfully !!!", "success");
                    })
                    .catch(err => {
                        snackBar(err.message, "error");
                        console.log(err);
                    })
                    .finally(() => {
                        showHideSpinner(false);
                    });
            }
        });
}

function onMovieEdit(ele) {
    let EDIT_ID = ele.closest(".col-md-3").id;
    state.editId = EDIT_ID;
    let EDIT_URL = `${BASE_URL}/movies/${EDIT_ID}.json`;

    showHideSpinner(true);

    makeApiCall(EDIT_URL, "GET")
        .then(data => {
            movieName.value = data.movieName;
            movieType.value = data.movieType;
            movieRating.value = data.movieRating;
            movieImage.value = data.movieImage;
            movieDate.value = data.movieDate;
            movieDescription.value = data.movieDescription;

            movieModel.classList.add("active");
            backdrop.classList.add("active");

            updateBtn.classList.remove("d-none");
            addBtn.classList.add("d-none");
        })
        .catch(err => {
            snackBar(err.message, "error");
            cl(err);
        })
        .finally(() => {
            showHideSpinner(false);
        });
}

function onUpdateMovie() {
    let UPDATE_ID = state.editId;
    let getIndex = state.movieArr.findIndex(movie => movie.id === UPDATE_ID);

    if (movieRating.value < 0 || movieRating.value > 10) {
        snackBar("Invalid Rating! Please enter rating between 1 to 10", "warning");
        return;
    }
    let UPDATE_OBJ = {
        movieName: movieName.value,
        movieType: movieType.value,
        movieRating: movieRating.value,
        movieImage: movieImage.value,
        movieDate: movieDate.value,
        movieDescription: movieDescription.value,
        id: UPDATE_ID,
        updatedAt: new Date().toISOString()
    };

    let UPDATE_URL = `${BASE_URL}/movies/${UPDATE_ID}.json`;
    showHideSpinner(true);

    makeApiCall(UPDATE_URL, "PATCH", UPDATE_OBJ)
        .then(data => {
            state.movieArr[getIndex] = UPDATE_OBJ;
            let col = document.getElementById(UPDATE_ID);

            col.innerHTML = `
                <div class="card mt-3 movieCard">
                    <div class="card-header  d-flex justify-content-between">
                        <div>
                            <h4 class="text-white movieTitle">${UPDATE_OBJ.movieName}</h4>
                            <small class="text-white">
                            Movie Date : ${UPDATE_OBJ.movieDate}</small>
                            <br>
                            <small class="text-white">
                                Updated At : ${new Date(UPDATE_OBJ.updatedAt).toLocaleString()}
                            </small>
                        </div>
                        <h5 class="m-0">
                            <span class="badge ${rating(UPDATE_OBJ.movieRating)}">
                                ${UPDATE_OBJ.movieRating}
                            </span>
                        </h5>
                    </div>
                    <div class="card-body py-0">
                        <figure class="py-0">
                            <img src="${UPDATE_OBJ.movieImage}" alt="${UPDATE_OBJ.movieName}">
                            <figcaption>
                                <h5 class="m-0">${UPDATE_OBJ.movieName}</h5>
                                <h6 class="text-info">Genre : ${UPDATE_OBJ.movieType}</h6>
                                <p>${UPDATE_OBJ.movieDescription}</p>
                                
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer  d-flex justify-content-between">
                        <button onclick="onMovieEdit(this)" type="button" class="btn btn-sm btn-secondary">Edit</button>
                        <button onclick="onMovieDelete(this)" type="button" class="btn btn-sm btn-danger">Delete</button>
                    </div>
                </div>
            `;

            onMovieModel();

            updateBtn.classList.add("d-none");
            addBtn.classList.remove("d-none");

            snackBar("The Movie is Updated Successfully !!!", "success");
        })
        .catch(err => {
            snackBar(err.message, "error");
            cl(err);
        })
        .finally(() => {
            showHideSpinner(false);
        });
}



updateBtn.addEventListener("click", onUpdateMovie);

movieForm.addEventListener("submit", onCreateMovie);
addMovieBtn.addEventListener("click", onMovieModel);
cancleBtn.addEventListener("click", onMovieModel);
closeMovieModalIcon.addEventListener("click", onMovieModel);