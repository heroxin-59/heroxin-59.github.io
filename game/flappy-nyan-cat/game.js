var canvas = document.getElementById("canvas");
var gameContainer = document.getElementById("game-container");

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

if(canvas.getContext) {

    var	context = canvas.getContext("2d");

    var game = {
        width: canvas.width,
        height: canvas.height,
        imgsrc: [
            "cool.png",
            "cat.png",
            "techno.png", 
            "skin0.png", 
            "skin1.png", 
            "skin2.png",
            "speakerOn.png", 
            "speakerOff.png", 
            "blockUpper.png", 
            "blockLower.png", 
            "star.png"
        ],
        images: [],
        highScore: 0,
        started: false,
        speed: 7,
        reset: function() {
            this.score = 0;
            this.speed = 7;
            this.blocks = [];
        },
        update: function() {
            this.score++;
            this.speed = Math.min(this.speed + 0.2, 20);
        }
    };
        
    for(var i = 0; i < game.imgsrc.length; i++) {
        game.images[i] = new Image();
        game.images[i].src = "https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/" + game.imgsrc[i];
    }
    
    var mousePosition = {
        x: 0,
        y: 0
    }

    var audioSwitch = {
        x: game.width - 45,
        y: game.height - 45,
        width: 32,
        height: 32,
        playing: 0, // 1 on, 0 off
        img: game.images[7],
        mainAudio: new Audio("https://heroxin.oss-cn-beijing.aliyuncs.com/blog/sound/main.mp3"),
        jumpAudio: new Audio("https://heroxin.oss-cn-beijing.aliyuncs.com/blog/sound/jump.wav"),
        deadAudio: new Audio("https://heroxin.oss-cn-beijing.aliyuncs.com/blog/sound/dead.wav"),
        start: function() {
            document.addEventListener("click", this.change);
            this.mainAudio.volume = 0;
            this.jumpAudio.volume = this.deadAudio.volume = 0;
            this.mainAudio.loop = true;
        },
        draw: function() {
            context.drawImage(this.img, this.x, this.y);
        },
        change: function(event) {
            if(collisionPointObj(event.pageX - canvas.offsetLeft - 10, event.pageY - canvas.offsetTop - 10, audioSwitch)) {
                audioSwitch.playing = audioSwitch.playing ? 0 : 1;
                audioSwitch.img = game.images[7 - audioSwitch.playing];
                audioSwitch.mainAudio.volume = audioSwitch.mainAudio.volume ? 0 : 0.1;
                audioSwitch.jumpAudio.volume = audioSwitch.jumpAudio.volume ? 0 : 0.1;
                audioSwitch.deadAudio.volume = audioSwitch.deadAudio.volume ? 0 : 0.1;
                audioSwitch.mainAudio.play();
            }
        },
        playJumpSound: function() {
            this.jumpAudio.play();
        },
        playDeadSound: function() {
            this.deadAudio.play();
        }
    }

    audioSwitch.start();
        
    var cat = {
        width: 105,
        height: 65,
        img: game.images[1],
        skin: 1,
        imgPosition: 0,
        trail: [],
        trailLength: 50,
        update: function(n) {
            this.y += this.speed;
            this.speed = Math.min(this.speed + this.acceleration, this.startSpeed);
            this.acceleration = Math.min(this.acceleration + 0.02, 1);
            this.drawTrail();

            var n = Math.floor(this.imgPosition / 4);
            
            context.drawImage(this.img, 0, n * this.height + n, // + n pixels for gap between sprites to prevent border artifact
                this.width, this.height,
                this.x, this.y, this.width, this.height);

            this.imgPosition++;
            if(this.imgPosition > 20) {
                this.imgPosition = 0;
            }
            
        },
        drawTrail: function() {
            this.trail.push(new trailElement(this.x + 13, this.y + 9));

			for(var i = 0; i < this.trail.length; i++) {
                this.trail[i].update(i / this.trailLength);
            }
            
			if(this.trail.length > this.trailLength) {
				this.trail.splice(0, 1);
			}
        },
        jump: function() {
            this.hasJumped = true;
            this.speed = -14;
            this.acceleration = 1;
            audioSwitch.playJumpSound();
        },
        init: function() {
            this.x = game.width / 2 - 50;
            this.y = 170;
            this.speed = 1;
            this.startSpeed = 8;
            this.acceleration = 0.2;
            this.hasJumped = false;
        }
    };

    var trailElement = function(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 42;
    };
    trailElement.prototype.update = function(opacity) {
        // #FD0000 #FD9800 #FEFE00 #33FD00 #0099FD #6633FD
        var background = context.createLinearGradient(this.x + this.width / 2, this.y, this.x + this.width / 2, this.y + this.height);

        background.addColorStop(0.000, "rgba(253, 0, 0, " + opacity + ")");
        background.addColorStop(0.165, "rgba(253, 0, 0, " + opacity + ")");
        background.addColorStop(0.166, "rgba(253, 152, 0, " + opacity + ")");
        background.addColorStop(0.330, "rgba(253, 152, 0, " + opacity + ")");
        background.addColorStop(0.331, "rgba(254, 254, 0, " + opacity + ")");
        background.addColorStop(0.497, "rgba(254, 254, 0, " + opacity + ")");
        background.addColorStop(0.498, "rgba(51, 253, 0, " + opacity + ")");
        background.addColorStop(0.663, "rgba(51, 253, 0, " + opacity + ")");
        background.addColorStop(0.664, "rgba(0, 153, 253, " + opacity + ")");
        background.addColorStop(0.830, "rgba(0, 153, 253, " + opacity + ")");
        background.addColorStop(0.831, "rgba(102, 51, 253, " + opacity + ")");
        background.addColorStop(1.000, "rgba(102, 51, 253, " + opacity + ")");

		context.fillStyle = background;
        context.fillRect(this.x, this.y, this.width, this.height);
        
        this.x -= this.width;
        this.width = game.speed + 3;
    };

    var block = function(x, y, img, isUpper, height) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = height || Math.random() * 200 + 100;
        this.hasPassed = false;
        this.img = img;
        this.isUpper = isUpper;
    };
    block.prototype.reset = function(x, y, height) {
        this.x = x;
        this.y = y;
        this.height = height || Math.random() * 200 + 100;
        this.hasPassed = false;
    };
    block.prototype.draw = function() {
        context.fillStyle = "#ff0000";
        context.drawImage(this.img, 0, this.isUpper ? 400 - this.height : 0, this.width, this.height,
                this.x, this.y, this.width, this.height);
        this.x -= game.speed;
    };

    var backgroundElement = function(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = 19;
        this.height = 19;
        this.img = game.images[10];
        this.imgPosition = Math.floor(Math.random() * 35);
        this.speed = speed || 5;
    };
    backgroundElement.prototype.update = function() {
        var n = Math.floor(this.imgPosition / 7);
            
        context.drawImage(this.img, n * this.width, 0,
            this.width, this.height,
            this.x, this.y, this.width, this.height);

        this.imgPosition++;
        if(this.imgPosition > 35) {
            this.imgPosition = 0;
        }

        this.x -= game.speed - this.speed;
        if(this.x < -this.width) {
            this.speed = Math.random() * 4 + 2;
            this.x = Math.random() * 200 + game.width;
        }
    };

    var backgroundElements = [];

    for(var i = 0; i < 10; i++) { 
        backgroundElements.push(new backgroundElement(Math.random() * (game.width - 50) + 50, (i + 1) * 60, Math.random() * 4 + 2));
    }

    var menuButton = function(x, y, width, height, text, img) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = 0;
        this.text = text;
        this.opacity = 0;
        this.img = img || null;
    };
    
    var playButton = new menuButton(game.width / 2 - 98, 270, 200, 60, "Play");

    var skinButtons = [];

    for(var i = 0; i < 3; i++) {
        skinButtons.push(new menuButton(i * 250 + 238, 440, 220, 180, "", game.images[i + 3]));
    }

    function onKeyDown(event) {
        switch(event.keyCode) {
            case 87: // W
            case 38: // arrow up
            case 32: // space
                if(!cat.hasJumped) {
                    cat.jump();
                }
                break;
            case 27: // escape
                if(game.started) {
                    menu();
                }
                break;
        }
    }
    function onKeyUp(event) {
        switch(event.keyCode) {
            case 87: // W
            case 38: // arrow up
            case 32: // space
                cat.hasJumped = false;
                break;
        }
    }

    function onMouseDown(event) {
        if(event.button === 0) {
            if(!cat.hasJumped) {
                cat.jump();
            }
        }
    }

    function onMouseUp(event) {
        cat.hasJumped = false;
    }

    function onMouseMove(event) {
        mousePosition.x = event.pageX - canvas.offsetLeft;
        mousePosition.y = event.pageY - canvas.offsetTop;
    }

    function getHighScore() {
        var cookies = document.cookie.split(";");
        for(var i = 0; i < cookies.length; i++) {
            if(cookies[i].split("=")[0].trim() === "highscore") {
                return cookies[i].split("=")[1];
            }
        }
        return 0;
    }

    function setHighScore(value) {
        var expires = "";
        var date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
        document.cookie = "highscore=" + (value || 0)  + expires + "; path=/";
    }

    function collisionPointObj(px, py, obj) {
        return px <= obj.x + obj.width && px >= obj.x && py <= obj.y + obj.height && py >= obj.y;
    }

    function collision(obj1, obj2) {
        return obj1.x <= obj2.x + obj2.width && obj1.x + obj1.width >= obj2.x &&
            obj1.y <= obj2.y + obj2.height && obj1.y + obj1.height >= obj2.y;
    }

    function initGame() {
        start();
        
        canvas.removeEventListener("click", menuSelect);
        canvas.removeEventListener("mousemove", onMouseMove);
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mouseup", onMouseUp);
    }

    function removeGameListeners() {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
        document.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mouseup", onMouseUp);
    }

    function start() {
        if(game.score > game.highScore) {
            setHighScore(game.score);
        }

        game.highScore = getHighScore();

        game.reset();

        cat.init();

        for(var i = 0, j = 0; i < 4; i++) {
            if(i % 2 == 0) {
                game.blocks.push(new block(game.width + 150 + j * 700, 0, game.images[8], true));
            }
            else {
                var blockGap = Math.random() * 100 + 200;
                game.blocks.push(new block(game.width + 150 + j++ * 700, game.blocks[i - 1].height + blockGap, game.images[9], false, game.height - game.blocks[i - 1].height - blockGap));
            }
        }
    }

    function updateBlocks() {
        for(var i = 0; i < game.blocks.length; i++) {
            var block = game.blocks[i];
            if(block.x <= -block.width) {
                if(i % 2 === 0) {
                    block.reset(game.width + 100, 0);
                }
                else {
                    var blockGap = Math.random() * 100 + 200;
                    block.reset(game.blocks[i - 1].x, game.blocks[i - 1].height + blockGap, game.height - game.blocks[i - 1].height - blockGap);
                }
            }

            if(collision(cat, block)) {
                audioSwitch.playDeadSound();
                start();
            }

            // update score
            if(i % 2 === 0 && !block.hasPassed && cat.x > block.x + block.width) {
                game.update();
                block.hasPassed = true;
            }

            block.draw();
        }
    }

    function updateBackground() {
        for(var i = 0; i < backgroundElements.length; i++) {
            backgroundElements[i].update();
        }
    }

    function menuSelect(event) {
        // on play button click
        if(collisionPointObj(event.pageX - canvas.offsetLeft - 10, event.pageY - canvas.offsetTop - 10, playButton)) {
            initGame();
            game.started = true;
        }

        // on skin buttons click
        for(var i = 0; i < skinButtons.length; i++) {
            if(collisionPointObj(event.pageX - canvas.offsetLeft - 10, event.pageY - canvas.offsetTop - 10, skinButtons[i])) {
                cat.skin = i;
                cat.img = game.images[i];
            }
        }
    }

    function menu() {
        game.started = false;

        removeGameListeners();

        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("click", menuSelect);

        cat.init();

        // print game title
        context.textAlign = "center";
        context.font = "40px 'Press Start 2P'";
        context.fillStyle = "#222";
        context.fillText("Flappy Nyan Cat", game.width / 2, 122);
        context.fillStyle = "#fff";
        context.fillText("Flappy Nyan Cat", game.width / 2 - 3, 120);
        
        context.font = "24px 'Press Start 2P'";
        context.strokeStyle = "rgba(0, 0, 0, 1)";
        context.lineWidth = 1;
        
        context.strokeRect(playButton.x, playButton.y, playButton.width, playButton.height);

        // play button hover
        if(collisionPointObj(mousePosition.x - 10, mousePosition.y - 10, playButton)) {
            context.fillStyle = "rgba(0, 0, 0, " + playButton.opacity + ")";
            playButton.opacity = Math.min(0.2, playButton.opacity + 0.02);
            context.fillRect(playButton.x, playButton.y, playButton.width, playButton.height);
        }
        else {
            context.fillStyle = "rgba(0, 0, 0, " + playButton.opacity + ")";
            playButton.opacity = Math.max(0, playButton.opacity - 0.02);
            context.fillRect(playButton.x, playButton.y, playButton.width, playButton.height);
        }

        // print play button text
        context.fillStyle = "#222";
        context.fillText(playButton.text, playButton.x + playButton.width / 2 + 4, playButton.y + 45);
        context.fillStyle = "#fff";
        context.fillText(playButton.text, playButton.x + playButton.width / 2 + 2, playButton.y + 43);

        game.highScore = getHighScore();

        // print high score
        context.font = "16px 'Press Start 2P'";
        context.fillStyle = "#222";
        context.fillText("High score: " + game.highScore, game.width / 2 + 2, 372);
        context.fillStyle = "#fff";
        context.fillText("High score: " + game.highScore, game.width / 2, 370);

        context.lineWidth = 4;
        context.fillStyle = "rgba(0, 0, 0, 0.15)";

        // draw skin buttons
        for(var i = 0; i < skinButtons.length; i++) {
            context.strokeStyle = "rgba(0, 0, 0, 0.4)";

            // current skin
            if(cat.skin === i) {
                context.fillRect(skinButtons[i].x + 2, skinButtons[i].y + 2, skinButtons[i].width - 3, skinButtons[i].height - 3);
            }

            // skin button hover
            if(collisionPointObj(mousePosition.x - 10, mousePosition.y - 10, skinButtons[i])) {
                context.strokeStyle = "#f6ec66";
            }
            
            context.strokeRect(skinButtons[i].x, skinButtons[i].y, skinButtons[i].width, skinButtons[i].height);

            context.drawImage(skinButtons[i].img, skinButtons[i].x + 22, skinButtons[i].y + 30);
        }
    }

    function update() {
        requestAnimationFrame(update);

        context.clearRect(0, 0, game.width, game.height);
        
        // background
        var background = context.createRadialGradient(game.width / 2, game.height / 2, 0, game.width / 2, game.height / 2, 800);
        background.addColorStop(0, "#5ebfff");
        background.addColorStop(1, "#0790ed");
        context.fillStyle = background;
        context.fillRect(0, 0, game.width, game.height);

        // background elements
        updateBackground();

        // animate cat
        cat.update();

        // game has started
        if(game.started) {

            updateBlocks();

            // if cat hits upper or lower borders then restart
            if(cat.y <= 0 || cat.y + cat.height >= game.height) {
                audioSwitch.playDeadSound();
                start();
            }

            // print score
            context.textAlign = "center";
            context.font = "36px 'Press Start 2P'";
            context.fillStyle = "#222";
            context.fillText(game.score, game.width / 2, 62);
            context.fillStyle = "#fff";
            context.fillText(game.score, game.width / 2 - 3, 60);

            // print high score
            context.textAlign = "left";
            context.font = "16px 'Press Start 2P'";
            context.fillStyle = "#222";
            context.fillText("High score: " + game.highScore, 20, game.height - 12);
            context.fillStyle = "#fff";
            context.fillText("High score: " + game.highScore, 18, game.height - 14);
        }
        // main menu
        else {
            menu();
        }

        audioSwitch.draw();
        
    }

    cat.init();
    update();
}
