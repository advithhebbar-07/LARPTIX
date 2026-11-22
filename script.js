 
// ======================================
// LARPTIX - MOVIE DATABASE
// ======================================

const movies = [

    {
        name: "Interstellar",
        genre: "Sci-Fi / Adventure",
        rating: "8.7",
        year: 2014,
        duration: "2h 49m",
        language: "English",
        director: "Christopher Nolan",
        cast: "Matthew McConaughey, Anne Hathaway",
        description: "A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.",
        image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
    },

    {
        name: "Inception",
        genre: "Sci-Fi / Thriller",
        rating: "8.8",
        year: 2010,
        duration: "2h 28m",
        language: "English",
        director: "Christopher Nolan",
        cast: "Leonardo DiCaprio, Joseph Gordon-Levitt",
        description: "A skilled thief enters people's dreams to steal secrets and attempts the impossible task of planting an idea.",
        image: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"
    },

    {
        name: "The Dark Knight",
        genre: "Action / Crime",
        rating: "9.0",
        year: 2008,
        duration: "2h 32m",
        language: "English",
        director: "Christopher Nolan",
        cast: "Christian Bale, Heath Ledger",
        description: "Batman faces the Joker, a criminal mastermind who brings chaos to Gotham City.",
        image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
    },

    {
        name: "Dune: Part Two",
        genre: "Sci-Fi / Action",
        rating: "8.5",
        year: 2024,
        duration: "2h 46m",
        language: "English",
        director: "Denis Villeneuve",
        cast: "Timothée Chalamet, Zendaya",
        description: "Paul Atreides joins the Fremen and seeks revenge while facing an extraordinary destiny.",
        image: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"
    },

    {
        name: "Oppenheimer",
        genre: "Drama / History",
        rating: "8.3",
        year: 2023,
        duration: "3h",
        language: "English",
        director: "Christopher Nolan",
        cast: "Cillian Murphy, Emily Blunt",
        description: "The story of J. Robert Oppenheimer and his role in developing the atomic bomb.",
        image: "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg"
    },

    {
        name: "Avengers: Endgame",
        genre: "Action / Sci-Fi",
        rating: "8.4",
        year: 2019,
        duration: "3h 1m",
        language: "English",
        director: "Anthony Russo, Joe Russo",
        cast: "Robert Downey Jr., Chris Evans",
        description: "The Avengers assemble once more to reverse Thanos' devastating actions.",
        image: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg"
    },

    {
        name: "Joker",
        genre: "Crime / Drama",
        rating: "8.3",
        year: 2019,
        duration: "2h 2m",
        language: "English",
        director: "Todd Phillips",
        cast: "Joaquin Phoenix, Robert De Niro",
        description: "A troubled comedian's descent into madness transforms him into Gotham's infamous Joker.",
        image: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"
    },

    {
        name: "The Batman",
        genre: "Action / Crime",
        rating: "7.8",
        year: 2022,
        duration: "2h 56m",
        language: "English",
        director: "Matt Reeves",
        cast: "Robert Pattinson, Zoë Kravitz",
        description: "Batman investigates corruption in Gotham while hunting a mysterious serial killer.",
        image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg"
    },

    {
        name: "Spider-Man: No Way Home",
        genre: "Action / Adventure",
        rating: "8.2",
        year: 2021,
        duration: "2h 28m",
        language: "English",
        director: "Jon Watts",
        cast: "Tom Holland, Zendaya",
        description: "Peter Parker asks Doctor Strange for help, but a spell brings dangerous visitors from other universes.",
        image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg"
    },

    {
        name: "The Shawshank Redemption",
        genre: "Drama",
        rating: "9.3",
        year: 1994,
        duration: "2h 22m",
        language: "English",
        director: "Frank Darabont",
        cast: "Tim Robbins, Morgan Freeman",
        description: "Two imprisoned men build a powerful friendship while holding on to hope behind prison walls.",
        image: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
    },

    {
        name: "Parasite",
        genre: "Thriller / Drama",
        rating: "8.5",
        year: 2019,
        duration: "2h 12m",
        language: "Korean",
        director: "Bong Joon-ho",
        cast: "Song Kang-ho, Choi Woo-shik",
        description: "A poor family gradually becomes involved in the lives of a wealthy household, with unexpected consequences.",
        image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"
    },

    {
        name: "Top Gun: Maverick",
        genre: "Action / Drama",
        rating: "8.2",
        year: 2022,
        duration: "2h 10m",
        language: "English",
        director: "Joseph Kosinski",
        cast: "Tom Cruise, Miles Teller",
        description: "Maverick trains a new generation of fighter pilots for a dangerous mission.",
        image: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg"
    }

];


// ======================================
// DISPLAY MOVIES ON HOMEPAGE
// ======================================

const movieList = document.getElementById("movie-list");

if (movieList) {

    movieList.innerHTML = movies.map((movie, index) => `

        <div class="movie-card">

            <img
                src="${movie.image}"
                alt="${movie.name}"
                loading="lazy"
            >

            <div class="movie-info">

                <h3>${movie.name}</h3>

                <p>${movie.genre}</p>

                <p>${movie.year} | ${movie.duration}</p>

                <div class="movie-bottom">

                    <span>
                        <span style="color: #F5C518;">★</span>
                        ${movie.rating}
                    </span>

                    <button onclick="viewMovie(${index})">
                        View Details
                    </button>

                </div>

            </div>

        </div>

    `).join("");

}


// ======================================
// OPEN SEPARATE MOVIE DETAILS PAGE
// ======================================

function viewMovie(index) {

    const selectedMovie = movies[index];

    // Save selected movie in browser storage

    localStorage.setItem(
        "selectedMovie",
        JSON.stringify(selectedMovie)
    );

    // Open movie details page

    window.location.href = "movie-details.html";

}


// ======================================
// BOOK MOVIE - TEMPORARY
// ======================================

function bookMovie(name) {

    alert("Booking for " + name + " is coming soon!");

}
