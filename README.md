
# **FinchBot**

## **What is FinchBot?**

FinchBot is an open source, simple, free and easy to use Song Request twitch bot. FinchBot Client(s) is written in TypeScript while the backend is written in Go for fast API calls.

### **Setting Up your Enviroment**

[bot-website](#bot-website) | [twitch-bot](#twitch-bot) | [backend](https://github.com/Louuie/FinchBot-backend)

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
