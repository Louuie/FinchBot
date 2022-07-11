
# **LouieBot - Client(s)**

## **SETTING UP YOUR ENVIRONMENT**

[bot-website](#bot-website) | [twitch-bot](#twitch-bot)

## bot-website

Cd into the bot-website directory

``` zsh
cd bot-website/
```

Enter yarn into the terminal to install all the required packages to run the bot-website.

``` zsh
yarn
```

After installing the required packages using yarn enter yarn start into the terminal to run the bot-website locally on your machine.

``` zsh
yarn start
```

If the react-app complied the terminal should tell you that the app complied successfully.

---

## twitch-bot

Cd into the twitch-bot directory.

``` zsh
cd twitch-bot/
```

Enter yarn into the terminal to install all the required packages to run the bot-website.

``` zsh
yarn
```

After installing the required packages using yarn enter yarn start into the terminal to run the nodemon instance of the twitch-bot locally on your machine.

``` zsh
yarn start
```

You should see something like this if everything goes correctly.

``` zsh
yarn run v1.22.17
$ nodemon bot.ts
[nodemon] 2.0.16
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node bot.ts`
```
