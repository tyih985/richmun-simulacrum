# Deployment

Deployment preview [https://simulacrum-theta.vercel.app/](https://simulacrum-theta.vercel.app/)

# Quick Summary

- this app uses VITE, with Typescript SWC ("speedy web compiler")
- uses VITE PWA ("Progressive Web App") to support downloading the app, and a prompt to manually update the version
- has a white-labelling system to configure various runtime environments for different brands
- uses Volta node version manager to standardize node version across deployments
- uses `pnpm` as the more efficient alternative to base `npm` when installing packages

### Build

- install Volta node version manager `curl https://get.volta.sh | bash`
- install performance NPM `npm install -g pnpm`
- use PNPM to install packages `pnpm i`

### Customizing Runtime

- update all required values, everything that is in the manifest is required
- make sure that all logo images are the correct size (refer to manifest)
- if needed, utilize the [mantine colours generator UI](https://mantine.dev/colors-generator/) to sample out your brand colours

### Firebase

To run, make sure you have

```
npm i -g firebase-tools
firebase login
firebase init
```

In order to run the emulator, you will also need Java. Run `java -version` to make sure you have it installed. For Linux it should be:

```
sudo apt update
sudo apt install default-jdk -y

mkdir -p $HOME/java && tar -xvzf jdk.tar.gz -C $HOME/java
export JAVA_HOME=$HOME/java/jdk-17.x.x
export PATH=$JAVA_HOME/bin:$PATH
java --version
```
