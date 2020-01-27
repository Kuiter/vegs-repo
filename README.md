# Introduction

**What is VEGS, and why use it?**

Virtual E-Grocery Store (VEGS)is a configurable, and open-source web application for enabling researchers to design, and conduct experiments in the context of online shopping. The base application provides support for implementing a number of common treatment variation. Supported use cases are:

- Change Displayed (Product-) Information \& Shop-Functions Based on Treatment Specification
- Recommendations-Systems & - Agents
- Positioning, Arrangement & (Re-) Placement
- Partitioning & Bundling
- Salience & Additional Information
- (Smart) Disclosure & Feedback
- Economic Incentives

# Installation

## Prerequisites

Both applications are based on npm and node. Therefore first install node, which should automatically install npm as well. You could also think about installing these frameworks using nvm. If the version commands do not return the version number of either npm or node it did not install correctly. 

For installation instructions specific to your system these links might be useful. 


- https://treehouse.github.io/installation-guides/windows/node-windows.html Node for Windows
- https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/ Install Node and NPM on Linux
https://www.webucator.com/how-to/how-install-nodejs-on-mac.cfm Install Node and NPM on Mac

For testing the validity of the installation check each version command:

```
sudo apt install nodejs
# check installed versions
node -v
npm -v
```

For running the back-end application you also need a running instance of MongoDB as the database server. For installation instructions see your operating system specific instructions provided here: https://docs.mongodb.com/manual/installation/. By default MongoDB listens on localhost:27017. This port is also configured by default for the back-end application. MongoDB needs to be running before you start the back-end application. If MongoDB does not start automatically you can start it by typing the following command.

```
sudo service mongod start
```

The code-base is versioned and managed using the freely available versioning tool Git. For installation instructions follow your operating system specific installation steps found here https://git-scm.com/book/en/v2/Getting-Started-Installing-Git. You can either follow the link and download the repository as a zip file or clone the repository with the following script line.

```
git clone https://github.com/Kuiter/vegs-repo
```

With this you cloned or downloaded the front-end, and back-end application. The dependencies for both applications are managed using npm. To install the necessary dependencies change directory into the root folders for both applications and run the following command:

```
npm install
```

This will install all necessary dependencies to run the applications. After this you might want to update the dependencies, and audit-fix any critical security issues by running the following commands. With this the dependencies are updated and any security issues are fixed, when they have known fixes.

```
npm update
npm audit fix
```

## Local hosting and development

For localy hosting the front-end, and back-end applications input the following commands inside the root folder of each project folder. 

```
# front-end, during development mode, restarts when changes are made to code-base
npm run start

#back-end, in development mode, restarts when changes are made to code-base
npm run start-watch
```

Doing this both applications are hosted in "development mode", after changing source files the applications are recompiled, and the sever is automatically restarted. The above commands act as aliases for the following commands specified in the respective package.json file in the root folder of each application.

```
# front-end
"scripts": {
    ...
    "start": "ng serve --proxy-config proxy.conf.json",
  }
# back-end
"scripts": {
	  ...
    "start-watch": "nodemon src/index.js",
  } 
```

After starting the development server the front-end is is hosted on localhost:4200, and the back-end listens on localhost:3000.
