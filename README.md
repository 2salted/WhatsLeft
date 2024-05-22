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
and I obviously learned much more but this is what really stuck out while making this project!

## Challenges I ran into
The greatest challenge I ran into was when trying to do image upload to my object storage system I had to
convert the images raw base64 data into an octet-binary array buffer so that it could be properly uploaded to minIO. After that I
then had to make sure it gets a full non corrupted image array buffer that can be uploaded to minIO, wait for the URL response from minIO and then store
the minIO URL inside mongoDB without interupion! which is why if you look at the image upload test video it takes quite a bit of time.
