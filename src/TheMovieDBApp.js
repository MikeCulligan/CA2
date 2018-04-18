import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Link} from 'react-router-dom';

//import Home from './Components/Home';
//import MyMovies from './Components/MyMovies';
import About from './Components/About';
//import Movie from './Components/Movie';

const popularURL = 'https://api.themoviedb.org/3/discover/movie?api_key=957d6c19054703726e7f9d1fe6bed3e9&with_genres=16&language-en&sort_by=popularity.desc',
      upcomingURL = 'https://api.themoviedb.org/3/discover/movie?api_key=957d6c19054703726e7f9d1fe6bed3e9&with_genres=16&language-en&primary_release_date.gte=2018-04-20&sort_by=popularity.desc',
      recentURL = 'https://api.themoviedb.org/3/discover/movie?api_key=957d6c19054703726e7f9d1fe6bed3e9&with_genres=16&primary_release_date.lte=2018-04-19&original_language=en&vote_count.gte=11&sort_by=release_date.desc';

let upcomingMovies = [],
    popularMovies = [],
    recentMovies = [],
    chosenData = [],
    currentComponent = "popularMovies";

//The URLs for the various fetchs
const baseURL = 'http://image.tmdb.org/t/p/original';

let myFavouriteMovies = [];

//https://api.themoviedb.org/3/movie/now_playing?page=1&language=en-US&api_key=%3C%3Capi_key%3E%3E

class TheMovieDBApp extends React.Component {
    //the constructor, addFavourite and removeFavourite are unused; attempts to seperate the componets into seperate classes that didn't pan out.
    constructor() {
        super();
        this.state = {
            favouriteMovies: [],
            id: '',
            title: '',
            overview: '',
            release_date: '',
            rating: '',
            total_votes: '',
            poster: ''
        };
        this.addFavourite = this.addFavourite.bind(this);
        this.removeFavourite = this.removeFavourite.bind(this);
    }
    
    addFavourite(movie) {
        let movieAlreadyInList = false;
        for(let count = 0; count < this.state.favouriteMovies.length; count++)
        {
            if (this.state.favouriteMovies[count].id === movie.props.id) {
                movieAlreadyInList = true;
            }
        }
        if (!movieAlreadyInList) {
            console.log("movie added");
            console.log(movie);
            this.setState( { movies: this.state.favouriteMovies.push(movie) } );
            console.log(this.state.favouriteMovies);
        }
        else {
            alert("That movie is already in your favourites.");
        }
    }
    
    removeFavourite(movie) {
        let movieAlreadyInList = false;
        for(let count = 0; count < this.state.favouriteMovies.length; count++)
        {
            if (this.state.favouriteMovies[count].id === movie.props.id) {
                movieAlreadyInList = true;
                this.setState( { movies: this.state.favouriteMovies.splice(count) } );
                console.log("movie removed");
                console.log(this.state.favouriteMovies);
            }
        }
        if (!movieAlreadyInList) {
            alert("That movie has already been removed from your favourites.")
        }
    }
    
    render() {
        return(
            <BrowserRouter>
                <div class="menu">
                    <h1>Animation Movies Database</h1>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/myMovies">My Movies</Link></li>
                        <li><Link to="/about">About</Link></li>
                    </ul>
                    <hr/>

                    {/* The exact keyword ensures the '/' route matches only '/' and not '/anything-else'--> */}
                    <Route 
                        exact path="/" component={Home} addFavourite={this.addFavourite}
                    />
                    <Route 
                        path="/myMovies" removeFavourite={this.removeFavourite} component={MyMovies}
                        /*render={(routeProps) =>
                            <MyMovies {routeProps} {this.state.favouriteMovies} />
                        }*/
                    />
                    <Route 
                        path="/about" component={About}/>
                </div>
            </BrowserRouter>
        );
    }
}

class Home extends React.Component {
    constructor(props) {
        super();
        this.state = {
            movies: [],
            id: '',
            title: '',
            original_language: '',
            overview: '',
            release_date: '',
            //runtime: '', //Unused; not provided
            vote_average: '',
            vote_count: '',
            poster_path: '',
            //video: '' //Unused
        };
        this.handleListChange = this.handleListChange.bind(this);
    }

    componentDidMount() {
        
        //There are three different fetches used. First is the fetch and data processing for popular movies. 
        fetch(popularURL)
        .then(popularMoviesResponse => {
            if(popularMoviesResponse.ok) return popularMoviesResponse.json();
            throw new Error('Request failed.');
        })
        .then(popularMoviesData => {
            console.log(popularMoviesData);
            
            const movies = popularMoviesData.results.map(movie => {
                return {id: movie.id,
                        title: movie.title,
                        original_language: movie.original_language,
                        overview: movie.overview,
                        release_date: movie.release_date,
                        //runtime: movie.runtime,
                        vote_average: movie.vote_average,
                        vote_count: movie.vote_count,
                        poster_path: movie.poster_path
                        //video: movie.video
                }
            });
            this.setState({movies: popularMoviesData.results});
            popularMovies = this.state.movies;
            
        })
        .catch(popularMoviesError => {
            console.log(popularMoviesError);
        });
        
        //Next is the fetch and data processing for recent movies
        fetch(recentURL)
        
        .then(recentMoviesResponse => {
            if(recentMoviesResponse.ok) return recentMoviesResponse.json();
            throw new Error('Request failed.');
        })
        .then(recentMoviesData => {
            console.log(recentMoviesData);
            
            const movies = recentMoviesData.results.map(movie => {
                return {title: movie.title,
                        original_language: movie.original_language,
                        overview: movie.overview,
                        release_date: movie.release_date,
                        //runtime: movie.runtime,
                        vote_average: movie.vote_average,
                        vote_count: movie.vote_count,
                        poster_path: movie.poster_path
                        //video: movie.video
                }
            });
            this.setState({movies: recentMoviesData.results});
            recentMovies = this.state.movies;
            
        })
        .catch(recentMoviesError => {
            console.log(recentMoviesError);
        });
        
        //Finally there is the fetch and data processing for upcoming movies.
        fetch(upcomingURL)
        
        .then(upcomingMoviesResponse => {
            if(upcomingMoviesResponse.ok) return upcomingMoviesResponse.json();
            throw new Error('Request failed.');
        })
        .then(upcomingMoviesData => {
            console.log(upcomingMoviesData);
            
            const movies = upcomingMoviesData.results.map(movie => {
                return {title: movie.title,
                        original_language: movie.original_language,
                        overview: movie.overview,
                        release_date: movie.release_date,
                        //runtime: movie.runtime,
                        vote_average: movie.vote_average,
                        vote_count: movie.vote_count,
                        poster_path: movie.poster_path
                        //video: movie.video
                }
            });
            this.setState({movies: upcomingMoviesData.results});
            upcomingMovies = this.state.movies;
            
        })
        .catch(upcomingMoviesError => {
            console.log(upcomingMoviesError);
        });
    }

    handleListChange() {
        const listFilter = document.getElementById("filterSelect").value;
        console.log(listFilter);
        
        if (listFilter === "recentMovies") {
            //this.setState( {movies: recentMoviesData.results} );
            currentComponent = "recentMovies"
        }
        else if (listFilter === "upcomingMovies") {
            //this.setState( {movies: upcomingMoviesData.results} );
            currentComponent = "upcomingMovies"
        }
        else if (listFilter === "popularMovies") {
            //this.setState( {movies: popularMoviesData.results} );
            currentComponent = "popularMovies"
        }
        this.setState( { } );
    };

    render() {
        if (currentComponent === "recentMovies") {
            chosenData = recentMovies;    
        }
        else if (currentComponent === "upcomingMovies") {
            chosenData = upcomingMovies;
        }
        else if (currentComponent === "popularMovies") {
            chosenData = popularMovies;
        }
        
        const list = chosenData.map ( (movie, count) => {
            return <Movie
            key={movie.id}
            id={movie.id}
            poster={movie.poster_path}
            title={movie.title}
            overview={movie.overview}
            release_date={movie.release_date}
            /*runtime={movie.runtime}*/
            rating={movie.vote_average}
            total_votes={movie.vote_count}
            addFavourite={this.addFavourite} />;
        });
        
        return(
            <div>
                <div class="movieChoiceBox">
                    <h2 id="displayTitle">Animated Movies</h2>
                    <label>Choose Movies To View: </label>
                    <select id="filterSelect" name="filterSelect" onChange={this.handleListChange}>
                        <option value="popularMovies">Popular Movies</option>
                        <option value="recentMovies">Recently Released Movies</option>
                        <option value="upcomingMovies">Upcoming Movies</option>
                    </select>
                </div>
                <div class="row">
                    {list}
                </div>
            </div>
        );
    }
}

class MyMovies extends React.Component {
    render() {
        console.log(myFavouriteMovies);
        //myFavouriteMovies is this.props.favouriteMovies in the attempted version to have the components in seperate classes
        const favouritesList = myFavouriteMovies.map ( (count) => {
            return <Movie 
                key={count.id} 
                id={count.id} 
                poster={count.poster} 
                title={count.title} 
                overview={count.overview} 
                release_date={count.release_date} 
                //runtime={count.runtime} 
                rating={count.rating} 
                total_votes={count.total_votes}
                favourite="yes" 
                removeFavourite={this.removeFavourite}/>;
        });
        console.log(this.props.favouriteMovies);
        return (
            <div class="movieChoiceBox">
                <h2>My Favourite Movies</h2>
                {favouritesList}
            </div>
        );
    }
}

class Movie extends React.Component {
    
    render() {
        if (this.props.favourite !== "yes") {
            return (
                <div style={{'width': '267px'}} class="card movieDisplayBox col-lg-2 col-md-3 col-sm-6 col-xs-12 w-5" >
                    <div class="posterDisplayBox">
                        <img class="card-img-top" src={baseURL + this.props.poster} alt="Film Poster" height="400"></img>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">{this.props.title}</h3>
                        <p class="card-text">{this.props.overview}</p>
                        <p>Released on: {this.props.release_date}</p>
                        <p>User Average: {this.props.rating} (Based on {this.props.total_votes} votes)</p>
                        <button class="submitButton" type="button" onClick={this.favouritesAdd.bind(this, this.props.id)}>Add to Favourites</button>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div class="movieDisplayBox col-md-2">
                    <div class="posterDisplayBox">
                        <img src={baseURL + this.props.poster} alt="Film Poster" width="267"></img>
                    </div>
                    <h3>{this.props.title}</h3>
                    <p>{this.props.overview}</p>
                    <p>Released on: {this.props.release_date}</p>
                    <p>User Average: {this.props.rating} (Based on {this.props.total_votes} votes)</p>
                    <button class="submitButton" type="button" onClick={this.favouritesRemove.bind(this, this.props.id)}>Remove from Favourites</button>
                </div>
            );
        }
    }
    
    favouritesAdd() {
        let movieAlreadyInList = false;
        for(let count = 0; count < myFavouriteMovies.length; count++)
        {
            if (myFavouriteMovies[count].id === this.props.id) { movieAlreadyInList = true; }
        }
        if (!movieAlreadyInList) {
            console.log("movie added");
            console.log(this.props);
            myFavouriteMovies.push(this.props);
            console.log(myFavouriteMovies);
        }
        else {
            alert("That movie is already in your favourites.");
        }
        //this.props.addFavourite(this.state);
    }
    favouritesRemove() {
        let movieAlreadyInList = false;
        for(let count = 0; count < myFavouriteMovies.length; count++)
        {
            if (myFavouriteMovies[count].id === this.props.id) { 
                movieAlreadyInList = true;
                myFavouriteMovies.splice(count);
                console.log("Removed a movie from your Favourites");
            }
        }
        if (!movieAlreadyInList) {
            alert("That movie has already been removed from your favourites.");
        }
        //this.props.removeFavourite(this.state);
    }
    //this.setState( { } );
}

//The render statements that makes the base class show itself
ReactDOM.render(
    <TheMovieDBApp />,
    document.getElementById('root')
);

export default TheMovieDBApp;