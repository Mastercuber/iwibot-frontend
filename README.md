# iwibot - frontend
1. [Setup environment](#getting-your-environment-set-up)  
1.1 [Environment configuration](#environment-configuration)
2. [Deploy the frontend](#deploy-the-frontend)  
2.1 [Github Pages](#github-pages)  
2.2 [Kubernetes](#kubernetes)
3. [Coding](#coding)  
3.1 [Docker](#docker)  
3.2 [Coding Scaffolding](#code-scaffolding)  
3.3 [Build](#build)  
3.4 [Progressive Webapp](#progressive-web-app)
4. [Testing](#testing)    
4.1 [Running Unittests](#running-unit-tests)  
4.2 [end-to-end-Tests](#running-end-to-end-tests)  
  
*Step 1 is needed to setup the environment*
## Getting your environment set up  
1. Make sure you have installed a [nodejs](https://nodejs.org/en/download/) runtime and the node package manager (npm) for your OS. Supported versions are 12.13.x
    1. (optional) Install the [Angular CLI](https://github.com/angular/angular-cli) globally with `npm install -g @angular/cli`
    2. (optional) Install the [yarn package manager](https://yarnpkg.com/lang/en/) globally with `npm install -g yarn`
2. If you haven't got **git**... [go get it](https://git-scm.com/downloads). 
Then clone the Github project with `git clone https://github.com/HSKA-IWI-VSYS/iwibot-frontend`.
3. Navigate to root directory of the project
4. Run `npm install` or `yarn install` to install the dependencies  
5. Run `npm run start` or `yarn run start` for a dev server. Navigate to `http://localhost:4200/` in a **Chrome Web-Browser**! The app will automatically reload if you change any of the source files.

### Environment configuration

If you have deployed your own [iwibot-openwhisk](https://github.com/HSKA-IWI-VSYS/iwibot-openwhisk) Back-End and want to configure the Front-End to use your deployed Back-End:
1. Navigate to `src/environments`
2. Change `CONVERSATION_API_URL` in `environment.prod.ts` and `environment.ts`  to fit your conversation api url.

Steps to find your `CONVERSATION_API_URL`
1. Make sure you have deployed [iwibot-openwhisk](https://github.com/HSKA-IWI-VSYS/iwibot-openwhisk)
2. Run `ibmcloud wsk api list` in your console
3. Find the URL that ends with `/iwibot/router` and copy it
 
## Deploy the frontend

### GitHub Pages
We use [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages) to deploy the project to GitHub Pages.

1. Run `ng build --prod --base-href "https://user-name.github.io/repo/"
2. Run `ngh` to the deploy the build to GitHub Pages
### Kubernetes
Use [minikube](https://kubernetes.io/de/docs/setup/minikube/) or something like that to setup a kubernetes cluster. If it is ready and the `kubectl` is configured you can deploy the frontend with `kubectl apply -f manifest.yml`.

Create a [service](https://kubernetes.io/docs/concepts/services-networking/service/) to get an ip address and loadbalancing functionality. Use the `kubectl apply -f service-manifest.yml` for creating this service.

Next create an [ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) for the service by invoking `kubectl apply -f ingress-manifest.yml`.
## Coding
### Docker
With `docker-compose up -d --build` you can setup a daemonized docker instance of the frontend.

To e.g. see the config, you can use `docker-compose run iwibot-frontend /bin/bash` to get access to a bash inside the container.
### Code scaffolding

* Run `ng generate component conversation` to generate a component named conversation
* Run `ng generate service conversation` to generate a service named conversation
* Run `ng generate directive conversation` to generate a directive named conversation.  

You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.  

For more details see [here](https://scotch.io/tutorials/use-the-angular-cli-for-faster-angular-2-projects#toc-generate-parts-of-your-application)

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

For more details on how to build the application see [here](https://scotch.io/tutorials/use-the-angular-cli-for-faster-angular-2-projects#toc-building-our-app)

### Progressive Web App
See [Documentation](doku/pwa.md)

## Testing

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
