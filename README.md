# FocusPocus

productivity pixelated!

client:

git init
cd client
npm install
npm install react-bootstarp
npm install react-bootstrap

npm install react-google-button

npm install react-router-dom  
npm install web-vitals
npm install react-router-dom axios
npm install vite@latest  
npm run dev

server:
cd FocusPocus/server
npm install express
npm install mongoose
npm install dotenv  
npm install cors
or npm install express mongoose nodemon bcrypt jsonwebtoken cors dotenv cookie-parser
npm install nodemailer

npm start - inside server

first run server then client

---

Git Commands to be used:

1. Create a folder on your local system and initialize git on it using:
   git init -y

2. Then, clone the respository:
   git clone <focus-pocus-app-repo-link>

3. Before starting to contribute, ensure that you are up-to-date with the repo by issuing a pull request while you are in your 'main' branch
   git pull origin main

4. Any contributions that are made, should be made by creating a branch and not directly to the master. To create a branch:
   git branch <branch-name>

   Keep the branch name associated with what contribution you want to make through it.

5. Then, traverse to the particular branch
   git checkout <branch-name>

6. Now, you can make the required changes

7. Then, commit the changes you have performed after ensuring that the code works properly:
   git commit -m "description message for the commit"

8. Now, the local branch you had created has been updated remotely. Ensuring that there are no inconsistencies, you can merge the two local branches: main and <branch-name>:
   git checkout main
   git merge <branch-name>

9. Finally, push the changes that are now reflected in your local main to the master repo:
   git push origin main

--commands

git init
git clone <repository-url>
cd <repository-name>
git pull origin main
git branch branch-name
git checkout branch-name

Make your changes here

git add .
git commit -m "Description message for the commit"
git push origin room
git checkout main
git merge room
git push origin main
