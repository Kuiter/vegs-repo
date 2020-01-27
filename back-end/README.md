# API for research Web-Shop

This is the functional documentation for the research Web-Shop in connection with the Master Thesis of Sebastian Kuiter

## Starting Development server

For starting the development server first start MongoDB on the system. Linux instruction: `service mongodb start`. Make sure no processes are running on the ports needed. To run this application either run `npm run start`, or for running it with nodemon (updates after detected change in source files) run `npm run start-watch`. The development server starts on port :3000 can be changed in the configuration files.

## Environment configuration 

The .env package is installed. Either modify the .env file or the corresponding /config/{env}.json file for a corresponding environment. To add environment variables add needed variable to the config.js file in the root folder.

To configure the enironment valiable you can either pass them as arguments when running the application, configure them in the config..json files, or in the .env file.

## Application structure

### General Structure

Each data object is represented in its own subfolder eg. src/user. Also each general functionality is organized in a unique subfolder eg. src/auth, or src/session. 

The data model is configured in *.model.js files, route access in *.route.js, and all functionality connected to handeling requests is written in *.controller.js. 
