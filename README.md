
# **FinchBot**

## **What is FinchBot?**

FinchBot is an open source, simple, free and easy to use Song Request twitch bot. FinchBot Client(s) is written in TypeScript while the backend is written in Go for fast API calls.

### **Setting Up your Enviroment**

[bot-website](#bot-website) | [twitch-bot](#twitch-bot) | [backend](#backend)

---

## bot-website

Cd into the bot-website directory.

``` zsh
cd bot-website/
```

Enter yarn into the terminal to install the required node packages when in the bot-website directory.

``` zsh
yarn
```

After installing the required node packages, Enter yarn start into the terminal to compile the react-app.

``` zsh
yarn start
```

If all goes well the command should output a message along the lines like `Compiled successfully!` in the terminal.

### ***PLEASE NOTE:***

***As of July 12, 2022*** the only page that is currently being worked on is the home page, meaning this section is NOT fully complete and will be constantly updated.

---

## twitch-bot

Cd into the twitch-bot directory.

``` zsh
cd twitch-bot/
```

Enter yarn into the terminal to install the required node packages when in the twitch-bot directory.

``` zsh
yarn
```

After installing the required node packages, Enter yarn start into the terminal to run the nodemon instance.

``` zsh
yarn start
```

If all goes well the command should output this in the terminal.

``` zsh
$ nodemon bot.ts
[nodemon] 2.0.16
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node bot.ts`
```

---

## **Backend**

### Docker

Docker is required for this project to setup a local Postgres database. We use the database to store our song request. Please follow the following steps below to setup your local Docker container.

- First, create a docker container using the following command in the terminal.

    ``` docker
    docker run --name some-docker-name -e POSTGRES_PASSWORD=some-secret-password -d postgres
    ```

- After we have created the Docker container, start the container if you haven't already.

- Once the container has been started, we should be able to connect to it using some sort of Postgres DB tool of your choice.

### Environment Variables

- After successfully setting up your local docker container, the next step is to setup your environment variables.

- Since in Go environment variables aren't based of a file rather they are based off of the operating systems own environment. Meaning we must set the environment variables in either our .bashrc or .zshrc.

- The list of the required environment variables can be found below.

    |  variable | value |
    |---|---|
    |  TWITCH_CLIENT_ID | Twitch Application CLIENT_ID   |
    |  TWITCH_CLIENT_SECRET | Twitch Application CLEINT_SECRET  |  
    |  GOOGLE_API_KEY | Google Application API_KEY (most have YouTube API Enabled for the key to work) |
    | POSTGRES_CONN | postgresql://postgres-name:postgrespassword@localhost:port/table-name?sslmode=disable |
    | UNIT_TESTING_AUTH_CODE | ***(ONLY USE FOR UNIT TESTING! THIS IS NOT THE ACCESS_TOKEN, THIS IS THE CODE YOU USE TO AUTHENTICATE THE USER)*** twitch auth code  |

### Starting the Server

Once you have completed all the steps above, you can finally start the Fiber server. To do so Cd into the LouieBot-backend directory if you haven't already.

``` zsh
cd LouieBot-backend/
```

Then you can simply start the server by running the following command into the terminal.

```zsh
go run .
```

The terminal will then output the information of the server, meaning things are running correctly.

```zsh
 ┌───────────────────────────────────────────────────┐
 │                   Fiber v2.34.0                   │
 │               http://127.0.0.1:3030               │
 │       (bound on host 0.0.0.0 and port 3030)       │
 │                                                   │
 │ Handlers ............ 14  Processes ........... 1 │
 │ Prefork ....... Disabled  PID .............. 8759 │
 └───────────────────────────────────────────────────┘
```
