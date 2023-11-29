  const autocompleteConfig = {
    renderOption(movie){
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src="${imgSrc}" />
        ${movie.Title} (${movie.Year})
       `;
    },
    inputValue(movie){
        return movie.Title;
    },
        async fetchData(searchTerm) {
            const response = await axios.get("http://www.omdbapi.com/", {
              params: {
                apikey: "93474ec5",
                s: searchTerm,
              },
            });
                
            if (response.data.Error) {
              return [];
            }
            return response.data.Search;
          }
  }
  
  
  createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
  });
  createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }     
  });

  let leftMovie;
  let rightMovie;

  const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "93474ec5",
        i: movie.imdbID,
      },
    });
  
    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie){
         runComparison();
    }
  };

  const runComparison = () => {
    const leftSideStarts = document.querySelectorAll('#left-summary .notification');
    const rightSideStarts = document.querySelectorAll('#right-summary .notification');

    leftSideStarts.forEach((leftStart, index) => {
        const rightStart = rightSideStarts[index];

        const leftSideValue = leftStart.dataset.value;
        const rightSideValue = rightStart.dataset.value;

        // const leftSideValue = parseInt(leftStat.dataset.value);
        // const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue){
            leftStart.classList.remove('is-primary');
            leftStart.classList.add('is-warning');
        } else {
            rightStart.classList.remove('is-primary');
            rightStart.classList.add('is-warning');
        }
    });
  };

  const movieTemplate = (movieDetail) => {
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,'' ));
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);

    if(isNaN(value)) {
        return prev;
    } else {
        return prev + value;
    }
  }, 0);

    return `
      <article class="media">
        <figure class="media-left">
          <p class="image">
            <img src="${movieDetail.Poster}" />
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <h1>${movieDetail.Title}</h1>
            <h4>${movieDetail.Genre}</h4>
            <p>${movieDetail.Plot}</p>
          </div>
        </div>
      </article>

      <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
      </article>
      <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
      </article>
      <article data-value=${metascore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
      </article>
      <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
      </article>
      <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
      </article>
    `;
  };