# Battleship Project by IL

Battleship is a single, and 2-player board game. Uses express with Ajax and jQuery/EJS scripting with css and html.

## Purpose

**_BEWARE:_ This application was published for learning purposes. It is _not_ intended for use in production-grade software.**

This project was created and published by me as part of my learnings at Lighthouse Labs.

## Usage

**Deployed on GCP**
**Accessible by internet network at:**
[ian.laksono.net/](http://ian.laksono.net/) OR
[tiny-app-291120.uk.r.appspot.com](http://tiny-app-291120.uk.r.appspot.com)

## Requires/Imports

**express**
API for creating server environment and request, response CRUD methods

**body-parser**
Interpret keys and values in request data to object format

**cookie-session**
Identify which client/player is making request

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` command.

## Final Product

!["Battle page"](https://github.com/ilaksono/battleship/blob/master/docs/battle-page.png)
!["Set Ships Page"](https://github.com/ilaksono/battleship/blob/master/docs/set-page.png)

## Documentation

**The board mechanics functions can be found in /helpers/gameFunctions.js**

**The AI/CPU functions can be found in /helpers/computer.js**

**There is currently 1 server module, router modules for set/battle will be added in future**

## Dependencies

- Express
- Node 5.10.x or above
- body-parser
- cookie-session
- ejs
- method-override
