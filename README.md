# Quick Summary
- this app uses VITE, with Typescript SWC ("speedy web compiler")
- it also uses VITE PWA ("Progressive Web App") to support downloading the app, and a prompt to manually update the version
- it also has a white-labelling system to configure various runtime environments for different brands
- uses Volta node version manager to standardize node version across deployments
- uses `pnpm` as the more efficient alternative to base `npm` when installing packages

#### Things I nver got around to
- I never got around to applying Firebase functions and learning how the emulator works lol
- I never got around to setting up white-labeled hosting, but that shouldn't be a large lift

# Focus Questions

- Creating White-labeled Runtime Environments as a product offering
- Firebase back-end service to facilitate product development
- The business value of a Progressive Web App
- Extending an third-party UI Library for an out-of-the-box toolkit
- Optimizing deployment lifecycle
- Standardizing formatting using prettier
- Options in organizing CSS, and why this boilerplate uses react-jss
- Data Management using Hooks in React Applications
- WTF is workbox, and how does it work with a service-worker

# Getting Started

- What are you building for?
  This boilerplate was meant to provide a white-label application set-up, if this is beyond the scope of your project intentions, then puruse something simpler -- perhpas as an MVP or a proof of concept.
- Do you know how to build?
  This boilerplate combines my personally recommended best practices and set-up as of the time I set it up. If you are unfamiliar with front-end development, then this repo may expose you to my methodology (which is good) but you may end up mucking it up over-time (which is bad). Take some time to understand why it's set-up the way it is, relative to what you would want to add.

### Build

- install Volta node version manager `curl https://get.volta.sh | bash`
- install performance NPM `npm install -g pnpm`
- use PNPM to install packages `pnpm i`

### Customizing Runtime

- update all required values, everything that does in manifest is required
- make sure that all logo images are the correct size (refer to manifext)
- if needed, utilize the [mantine colors generator UI](https://mantine.dev/colors-generator/) to sample out your brand colours

### Firebase

!!! NVM firebase has been removed from this project for the sake of simplicity

Drop your firebase configuration into `/runtime-environments/index.ts` > `prodFirebaseConfig`

- this app _expects_ you to be using firebase auth, and is set-up for the following methods:
  - email sign-in link
  - email and password
  - google account login

- this app _is set-up_ to support Firestore AND Real-time Database
  - if you are not using Firebase Database (firestore) then remove the field for firebase database from the type and the configuration

- this app _is set-up_ to support Cloud Functions and hosting (functions requires hosting)
  - if you are not using Firebase Cloud Functions, then ignore the folder `./functions`, and ignore the functions configuration, and rewrites on the `firebase.json` file

To run, make sure you have 
```
npm i -g firebase-tools
firebase login
firebase init
```
in order to run the emulator, you will also need java. Run `java -version` to make sure you have it installed. If you need to install it, use chatGPT to determine the steps to install it for your system. For linux it should be:
```
sudo apt update
sudo apt install default-jdk -y

mkdir -p $HOME/java && tar -xvzf jdk.tar.gz -C $HOME/java
export JAVA_HOME=$HOME/java/jdk-17.x.x
export PATH=$JAVA_HOME/bin:$PATH
java --version
```

# Deployment

## Local Instance Deployment

Vercel provides a simple way to deploy this app with minimal set-up. This will work with the `default` runtime configuration by default.

```
npm run dev --runtime=your_brand_name
npm run build --runtime=your_brand_name
```

## Git Tags

Git tags are a reliable way to identify new versions and handle new deployment triggers. For example, for the `<tag_name>` of `0.0.1-alpha`:

```
git tag 0.0.1-alpha
git push --follow-tags
```

Tags combined with triggers on a cloud platform should allow for all the white-labeled deployments to go out at once.