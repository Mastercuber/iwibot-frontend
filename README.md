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
2. Clone the Github project with `git clone https://github.com/HSKA-IWI-VSYS/iwibot-frontend`.
3. Navigate to root directory of the project
4. Run `npm install` or `yarn install` to install the dependencies  
5. Run `npm run start` or `yarn run start` for a dev server. Navigate to `http://localhost:4200/` in a **Chrome Web-Browser**! The app will automatically reload if you change any of the source files.

### Environment configuration

If you have deployed your own [iwibot-backend](https://github.com/HSKA-IWI-VSYS/iwibot-backend) and want to configure the frontend to use your deployed backend:
1. Navigate to `src/environments`
2. Change `CONVERSATION_API_URL` in `environment.prod.ts` and `environment.ts`  to fit your conversation api url.

Steps to find your `CONVERSATION_API_URL`
1. Run `ibmcloud wsk api list` in your terminal in the backend container (`docker-compose run iwibot /bin/bash`)
2. Find the URL that ends with `/iwibot/router` and copy it
3. Paste it as `CONVERSATION_API_URL` value
 
## Deploy the frontend

### GitHub Pages
We use [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages) to deploy the project to GitHub Pages.

1. Run `ng build --prod --base-href "https://user-name.github.io/repo/"
2. Run `ngh` to the deploy the build to GitHub Pages
### Kubernetes
Before deploying with kubernetes you need to build the image: `docker build . -t iwibot-frontend`

Keep in mind that you need to build the image with the docker daemon used by the kubernetes cluster. To get access to the minikubes docker daemon for one terminal session run `eval $(minikube docker-env)` in a terminal, then build the image.  

Use [minikube](https://kubernetes.io/de/docs/setup/minikube/) or something like that to setup a kubernetes cluster. If it is ready and the `kubectl` is configured you can deploy the frontend with `kubectl apply -f manifest.yml`.

Create a [service](https://kubernetes.io/docs/concepts/services-networking/service/) to get an ip address and loadbalancing functionality. Use the `kubectl apply -f service-manifest.yml` for creating this service.

Next create an [ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) for the service by invoking `kubectl apply -f ingress-manifest.yml`.

By invoking `kubectl get ingress` you can get the address your service is available at (e.g. `192.168.13.100`).

For ***deleting*** the *deployment*, *service* and *ingress* run the following commands: 
```
kubectl delete deployment iwibot-frontend
``` 
```
kubectl delete service service-iwibot-frontend
```
 ```
kubectl delete ingress ingress-iwibot-frontend
```
## Coding
### Docker
With `docker-compose up -d --build` you can setup a daemonized docker instance of the frontend.

To e.g. see the config, you can use `docker-compose run iwibot-frontend /bin/bash` to get access to a bash inside the container.

Just type `localhost` in your browser to get access to the frontend. To use another port instead of the default port 80 modify the [docker-compose.yml](docker-compose.yml) to use e.g. `8080:80`.
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
