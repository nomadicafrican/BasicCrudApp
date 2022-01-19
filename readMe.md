# Shopify Production Engineer Intern - Challenge - Summer 2022

## Initial Setup

1. you will need to install NPM packages, to learn how visit [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Clone this repo. To do this press the green "Code" button. Copy the link and type `git clone (link)` in your terminal
3. Install dependencies using `Npm Install`
4. Setup the Database by following the Creating DB section below.
5. Run server using `npm start`
6. Go to [localhost:8080](http://localhost:8080/) in your browser to see the website!

## Creating DB

1. type `psql` in your terminal then `\c` to see your user.
2. from there type `exit` to leave the psql terminal and use this command `psql -U (your username)`
3. Create a database within the psql by typing `CREATE DATABASE crudapp;`

### Seeding

To seed the data you must first

1. Leave the psql terminal by typing `exit`
2. From the root directory of this project, which is BasicCrudApp/BasicCrudApp type the following without the brackets`psql -U ( your username) -d crudapp` <-- type this without the brackets
3. Once logged in you can type `\i migrations/schema.sql` to setup the schema in the database
4. Once the schema is loaded in you can type `\i seeds/seeds.sql ` to setup the seeds

## Tech Stack

```
Node.js,
Express,
PostgreSQL,
EJS,
CSS
```

## Dependencies

```
Node 10.x or above,
NPM 5.x or above,
PG 6.x
```

### Additional feature

Additional feature chosen: Push a button to export product data to a CSV
