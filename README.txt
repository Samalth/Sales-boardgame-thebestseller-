# Project sales-boardgame "the bestseller"
This project was dedicated to my team and I by Danish clients from the Copenhagen Business School via the Dutch Hogeschool Utrecht.

##Contents
-General information

- Techstack

- How to run? (ENG)
install guide and starting guide

- Copyright info

- Contact info



##General information
This project was dedicated to my team and I by Danish clients from the Copenhagen Business School via the Dutch Hogeschool Utrecht.
This is a questions based digital boardgame, created for a sales educational course for students in the Netherlands and in Denmark.
In the "diagrams" folder in the project files, you could see a sequence diagram that explains the flow of most of the information in our project, note that this is not complete and some of the information that is written in the diagram hasn't been implemented.
Ownership of the code and project is devided between the developers who made the project (all code made until 01-07-2024), de Dutch Hogeschool Utrecht (to date) and the Danish Copenhagen Buisiness (to date) school.
More about this in "Copyright".

##techstack
See component diagram for the complete techstack.

##How to run ENG:
First split the terminal or open a second terminal window.
The files are split in a client side and a server side, to run both (so you can start the application correctly):
- Type "cd server" in the first console window
- Type "cd client" in the second console window

Secondly, make sure NodeJS (https://nodejs.org/en/download/) is installed and install all the packages from the package.json (skip this step if it is already installed).
Enter this in both the terminal/CMD windows:
- Type "npm install" in the 'server' window
- Type "npm install" in the 'client' window 

To start and run the database, (skip this step if you already did this)
1. install the program called XAMPP through the following link: https://www.apachefriends.org/download.html
2. After installation run the program
3. When running click on the button that says "start" behind 'Apache'
4. After that, click on "start" behind 'MySQL'
5. Then click on "Admin" behind 'MySQL'
After it takes you to 'phpMyAdmin' you'll see a button called "new" on the left side of the screen, 
6. When you click the button it will ask you for a name, type in "thebestseller" and click on create
*Congratulations, you just made a database!*
7. Standby the .CSV file that you can find seperately in the filestructure under "database"
IMPORTANT: do not change the name of any file within this project unless you know what you are doing!
In the phpMyAdmin you will see that the database you just named "thebestseller" is now standing at the bottom of a row of some other automatically created databases
8. Click on the new database and on the almost top of your screen you will see some options, one of them is called import, click on it
9. After you get to the import screen, click on 'choose file' and select the .CSV file
10. Scroll down to the options and change 'Columns seperated by' from ',' to a ';'.
11. Next scroll down to the bottom of the import screen and you'll see a switch with the text "first line ..." switch this box to on 
IMPORTANT: do not click other buttons or switches in the import screen unless you know what you are doing!
12. At the bottom of the page you will see a button called "import" click it and your database is ready
IMPORTANT for anyone wanting to change the database, if the database is not started with the correct configurations (read database.js) the server will not start

Lastly, you should start both sides (client and server) of the project:
- Type "npm start" in the 'server' window
- Type "npm start" in the 'client' window


##IMPORTANT NOTE:
Everytime your pc is restarted or something in this category, you will need to do the following things again to start the project:
Database:
1. Startup XAMPP
2. Start Apache
3. Start MySQL
Server:
4. Split terminal/cmd or open a second window
5. On one of those windows type "cd server" to select the server directory
6. Type "npm start" to activate the server
Client: 
7. Select the second terminal/cmd window
8. On the second window type "cd client"
9. Type "npm start" to run the application


IMPORTANT when pushing codes, the following file and folder must not be pushed:
- 'package-lock.json' (file in server and client)
- 'node_modules' (folder in server and client)


##Copyright
 IMPORTANT:
 This project may not be used for commercial gains.
 All rights to the intellectual property and creative content within this project are reserved.
 Unauthorized use, reproduction, or distribution of any part of this project for commercial purposes is strictly prohibited.
 The project is intended solely for educational and personal use.
 For permissions beyond the scope of this license, please contact the project contributors.

###Contact Information about this repository:
Sam T (gitCustodian and developer)
- Samalthcode@gmail.com
Samuel (lead-developer)
- NO CONTACT INFO
Noordin M (designer and developer)
- NO CONTACT INFO
Susmita D (productowner and developer)
- NO CONTACT INFO
Kees v.d. Z (Scrum Master and developer)
- NO CONTACT INFO
