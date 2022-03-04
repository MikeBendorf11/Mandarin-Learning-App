# Chapp Assistant

Chapp is a Chinese Learning Assistant that allows its users (mostly just me) to memorize Hanzi characters. The UI has not been fully tested. It was the first app I ever created so it's not fancy, but it supports learning, 学习中文！


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![](/client/public/images/snapshot4.png)
> If you use the debugger on a computer browser and then reduce the screen width to about 430px then you are looking at the mobile version I use. (Tested on Firefox Android). This example is hosted at: [thechapp.herokuapp.com](https://thechapp.herokuapp.com)
---

#### Features:
- Navigate, create and search lessons, character combinations and sentences (You will need a Chinese Keyboard installed on your device)
- Practice by drawing characters and displaying translation hints
- Offline support using NodeJS, IndexedDB & MongoDB (good for the subway rides)
- SVG, PNG mixed backgrounds
- Embedded dictionaries

####  Learning progress:
- 1450 Character combinations
- 750 lessons
- 415 unique characters 

#### Resources:
- The drawing feature is based on an open source [project](http://www.kiang.org/jordan/software/hanzilookup/) by Jordan Kiang and  Erik Peterson.
- The 750 characters db is based on the SUBTLEX-CH open database of Chinese Word and Character Frequencies Based on Film. More info [here](http://crr.ugent.be/programs-data/subtitle-frequencies/subtlex-ch)

