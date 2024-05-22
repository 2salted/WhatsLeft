# WhatsLeft
WhatsLeft is a messaging app similar to WhatsApp and Signal made to chat with your friends and family! WhatsLeft was made using the React Native framework in (Expo) and is tailored to IOS and Android only (WhatsLeft is not available on web).
<div style="display: flex; flex-direction: row">
  <img src='images/img2.JPG' height="50%" width="20%" />
  <img src='images/img1.JPG' height="50%" width="20%" />
  <img src='images/img3.JPG' height="50%" width="20%" />
</div>

## How I built it
The development stack used to make this project was:

* [React Native](https://reactnative.dev/) for the frontend <br>
* [Native Wind](https://www.nativewind.dev/) for CSS styling<br>
* [NativeWind](https://www.nativewind.dev/) for writing easier CSS<br>
* [Expo](https://expo.dev/) for building environment, bundling TS & routing<br>
* [Clerk](https://clerk.com/) for user authentication<br>
* [Socket.io](https://socket.io/) for websockets and realtime messaging<br>
* [MongoDB](https://www.mongodb.com/) for user database<br>
* [MinIO](https://min.io/) for High-Performance Object Storage system (image upload)<br>
* [ExpressJS](https://expressjs.com/) for backend framework<br>
* [NodeJS](https://nodejs.org/en) for running backend and frontend servers in dev<br>
* [Github](https://github.com/) for version control<br>

## What I learned
1. I learned the basics HTTP request and response between my frontend and backend(express and node)<br>
2. I learned how to work with websockets and realtime messaging(socket.io)<br>
3. I learned how to work with a non-relational document database (MongoDB)<br>
4. I learned how file based routing works (expo router)<br>
5. I learned the basics of how to turn base64 raw image data into an array buffer<br>
6. I learned the basics of asynchronous javascript mostly for fetching data<br>
7. I learned how to use javascripts in built hashmap functionality for the first time<br>
and I obviously learned much more but this is what really stuck out while making this project!

## Challenges I ran into
The greatest challenge I ran into was when trying to do image upload to my object storage system I had to
convert the images raw base64 data into an octet-binary array buffer so that it could be properly uploaded to minIO. After that I
then had to make sure it gets a full non corrupted image array buffer that can be uploaded to minIO, wait for the URL response from minIO and then store
the minIO URL inside mongoDB without interupion! which is why if you look at the image upload test video it takes quite a bit of time.

## How to run this project
If you are courageous enough to run this project here are some steps to get the project up and running:
before we start I just want to say this project was developed in a Linux environment using Neovim I have no idea how well the dependecies 
would be on any other device or code editor, anyways lets get started!
1. in the CLI run: "gh repo clone 2salted/WhatsLeft" then go into the directory using "cd WhatsLeft/"
2. run "rm -rf .git/" unless you want to contribute to the project which you are more than welcome to :)
3. now while still being in the root directory run "npm install" or "npm i"
4. create a .env file in the root dir using "touch .env" command
5. using your text editor open the .env file, for me it's "nvim .env"
6. inside the .env create a variable called "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=" then paste your [clerk publishable key](https://clerk.com/)
7. create a second variable "IPV4=" and then paste your actual ipv4, for example mine could be 192.0.2.1
8. now go into the backend folder using "cd backend/" and create another .env file and go into it ("nvim .env")
9. now create "MONGODB_CONNECTION=" variable and paste your mongodb connection link key also put the same ipv4 variable as the last env file
10. copy paste the following variables: MINIO_SECRET_KEY=minioadmin, MINIO_ACCESS_KEY=minioadmin, MINIO_DEFAULT_BUCKET=test-bucket, MINIO_ENDPOINT=127.0.0.1:9000, MINIO_ROOT_USER=minioadmin, MINIO_ROOT_PASSWORD=minioadmin
11. while you are still inside the backend folder run "npm install" or "npm i"
