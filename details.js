 
// ======================================
// LARPTIX - MOVIE DETAILS
// ======================================

// GET SELECTED MOVIE

const selectedMovie = JSON.parse(
    localStorage.getItem("selectedMovie")
);


// ======================================
// WIKIPEDIA PHOTO SEARCH
// ======================================

async function getPersonPhoto(name) {

    try {

        const url =
            "https://en.wikipedia.org/w/api.php" +
            "?action=query" +
            "&generator=search" +
            "&gsrsearch=" + encodeURIComponent(name) +
            "&gsrnamespace=0" +
            "&gsrlimit=5" +
            "&prop=pageimages" +
            "&piprop=thumbnail" +
            "&pithumbsize=400" +
            "&format=json" +
            "&origin=*";

        const response = await fetch(url);

        if (!response.ok) return null;

        const data = await response.json();

        const pages = data.query?.pages;

        if (!pages) return null;

        const results = Object.values(pages);

        const exactMatch = results.find(page =>
            page.title.toLowerCase() === name.toLowerCase()
            && page.thumbnail?.source
        );

        if (exactMatch) {
            return exactMatch.thumbnail.source;
        }

        const resultWithPhoto = results.find(page =>
            page.thumbnail?.source
        );

        return resultWithPhoto?.thumbnail?.source || null;

    } catch (error) {

        console.log("Photo search failed:", name, error);

        return null;

    }

}


// ======================================
// DISPLAY FALLBACK INITIAL
// ======================================

function showInitial(element, name) {

    element.textContent =
        name.charAt(0).toUpperCase();

    element.style.display = "flex";

}


// ======================================
// CHECK MOVIE SELECTION
// ======================================

if (!selectedMovie) {

    document.getElementById("movie-name").textContent =
        "No movie selected";

} else {


    // ======================================
    // MOVIE INFORMATION
    // ======================================

    const movieImage =
        document.getElementById("movie-image");

    movieImage.src = selectedMovie.image;
    movieImage.alt = selectedMovie.name;

    document.getElementById("movie-name").textContent =
        selectedMovie.name;

    document.getElementById("movie-rating").textContent =
        selectedMovie.rating;

    document.getElementById("movie-genre").textContent =
        selectedMovie.genre;

    document.getElementById("movie-year").textContent =
        selectedMovie.year;

    document.getElementById("movie-duration").textContent =
        selectedMovie.duration;

    document.getElementById("movie-language").textContent =
        selectedMovie.language;

    document.getElementById("movie-description").textContent =
        selectedMovie.description;


    // ======================================
    // DIRECTOR PHOTO
    // ======================================

    const directorName =
        selectedMovie.director.split(",")[0].trim();

    const directorImage =
        document.getElementById("director-image");

    const directorPlaceholder =
        document.getElementById("director-placeholder");

    document.getElementById("director-name").textContent =
        selectedMovie.director;

    directorImage.style.display = "none";

    showInitial(directorPlaceholder, directorName);

    getPersonPhoto(directorName).then(photo => {

        if (!photo) return;

        directorImage.onload = () => {

            directorImage.style.display = "block";
            directorPlaceholder.style.display = "none";

        };

        directorImage.onerror = () => {

            directorImage.style.display = "none";
            directorPlaceholder.style.display = "flex";

        };

        directorImage.src = photo;

    });


    // ======================================
    // CAST CARDS
    // ======================================

    const castList =
        document.getElementById("cast-list");

    const castMembers =
        selectedMovie.cast.split(",");

    castList.innerHTML = castMembers.map((actor, index) => {

        const actorName = actor.trim();

        return `
            <div class="cast-card">

                <div class="cast-photo-wrapper">

                    <div
                        class="cast-placeholder"
                        id="cast-placeholder-${index}"
                    >
                        ${actorName.charAt(0).toUpperCase()}
                    </div>

                    <img
                        class="actor-image"
                        id="actor-image-${index}"
                        alt="${actorName}"
                        loading="lazy"
                        referrerpolicy="no-referrer"
                    >

                </div>

                <h3>${actorName}</h3>

                <p>Actor</p>

            </div>
        `;

    }).join("");


    // ======================================
    // LOAD ACTOR PHOTOS
    // ======================================

    castMembers.forEach(async (actor, index) => {

        const actorName = actor.trim();

        const actorImage =
            document.getElementById(
                `actor-image-${index}`
            );

        const placeholder =
            document.getElementById(
                `cast-placeholder-${index}`
            );

        const photo = await getPersonPhoto(actorName);

        if (!photo) return;

        actorImage.onload = () => {

            actorImage.style.display = "block";
            placeholder.style.display = "none";

        };

        actorImage.onerror = () => {

            actorImage.style.display = "none";
            placeholder.style.display = "flex";

        };

        actorImage.src = photo;

    });


    // ======================================
    // BOOKING BUTTON
    // ======================================

    const bookButton =
        document.getElementById("book-ticket");

    bookButton.addEventListener("click", function () {

        window.location.href = "booking.html";

    });

}
