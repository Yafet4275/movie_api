# Movies API
-----------

## Table of Contents
- [Overview](#overview)
- [Essential Features](#Essential Features)
- [Links](#links)
- [Movies](movies)
- [Process](#process)
  - [Programming Languages](#programming languages)
- [User](#users)
- [Authentication](#authentication)


## Overview
This a web application will provide users with access to information about different
movies, directors, and genres. Users will be able to sign up, update their
personal information, and create a list of their favorite movies.


## Essential Features
  - Return a list of ALL movies to the user
  - Return data (description, genre, director, image URL, whether it’s featured or not) about a
  single movie by title to the user
  - Return data about a genre (description) by name/title (e.g., “Thriller”)
  - Return data about a director (bio, birth year, death year) by name
  - Allow new users to register
  - Allow users to update their user info (username, password, email, date of birth)
  - Allow users to add a movie to their list of favorites
  - Allow users to remove a movie from their list of favorites
  - Allow existing users to deregister


## Links
 - [My Code](https://github.com/Yafet4275/movie_api)
 - [Project site]()


## Movies
  GET /movies
  GET /movies/:title
  GET /movies/genres/:name
  GET /movies/directors/:name
  POST /users/:userId/favorites/:movieId
  DELETE /users/:userId/favorites/:movieId


## Process
### Programming Languages
 - HTML
 - CSS
 - JavaScript ES6
 - NodeJS


## Users
  POST /users
  PUT /users/:userId
  DELETE /users/:userId

## Authentication
  POST /login



