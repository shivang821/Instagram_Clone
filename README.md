instructions to run this project on your local system
-> first install and setup node.js and mongodb in your system
-> then clone this project in your system
-> then navigate to Insta_Frontend and run npm i in terminal and then navigate Insta_Backend and run same command in terminal
-> then make config.env file in Insta_Backend repository and paste following things
    DATABASE= mongodb://localhost:27017
    PORT=4000
    JWT_SECRET=DFGHJYTRGNMVBNMNGFGHJKLFFJSKJEKSMDNREWUI
    JWT_EXPIRE=30d

-> then make .env file in Insta_Frontend and paste following
   VITE_BACKEND_URL=http://localhost:4000/

-> now setup is ready 
-> navigate to Insta_Backend in terminal (suggested vs code) and run nodemon server.js
-> then navigate to Insta_Frontend in terminal and run npm run dev
-> now you can see project by pressing ctrl + clik on Local link

