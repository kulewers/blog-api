## Description

Full Stack JavaScript blogging application. Features two frontends: one for author, one for visitors. Author can write, draft and publish articles while visitors can view published articles and comment on them

## Requirements

The following are .env requirements for the backend to work:

MONGODB - your MongoDB connection string <br>
SECRET - your JWT encryption secret

.env file needs to be created in blog-backend folder

## Installation
Clone the repository using the link on the repository page

cd into the repository folder and type:
```
cd blog-frontend
npm install
npm run dev
```
in another terminal window type:
```
cd blog-backend
npm install
```
create .env file with `touch .env` and add following environment variables:
```
MONGODB="<your MongoDB connection string>"
SECRET="<your JWT secret>"
```
and finally run the server with:
```
npm run serverstart
```
