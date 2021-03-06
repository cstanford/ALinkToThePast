var PacmanIntro = function() {};

PacmanIntro.prototype = {
	player: null,
	cherries: null,
	enemies: null,
	walls: null,
	door: null,

	preload: function() {
	},

	create: function() {
		//Sets up the walls

		this.test = false;
		this.walls = game.add.group();
		this.walls.enableBody = true;

		var w1 = this.walls.create(0, 0, 'topwall');
		w1.body.immovable = true;
		game.physics.arcade.enable(w1);
		var w2 = this.walls.create(0, 600-40, 'topwall');
		w2.body.immovable = true;

		for(var i = 0; i < 2; i++){
			var w3 = this.walls.create(i*(800-40), 40, 'sidewall');
			w3.body.immovable = true;
			if(i != 1){
				var w5 = this.walls.create(i*(800-40), 40+220, 'sidewall');
				w5.body.immovable = true;
			}
			var w4 = this.walls.create(i*(800-40), 600 - 40 - 220, 'sidewall');
			w4.body.immovable = true;
		}
		this.add.image(0, 0, "pacground");
		// this.add.text(10, 10, "PacmanIntro", {font: '30px Helvetica', fill: '#ffffff'});


		this.cherries = [];

		this.player = new Player();
		this.player.constructor(game, 100, 100);

		this.enemies = [];

		for(var i = 0; i < 5; i++){
			var en = new Enemy();
			en.constructor(game, 750 + Math.floor(Math.random() * 0), (600-80)/7*i + 2/7*(600-80) + Math.floor(Math.random() * 0), this.player, 1);
			this.enemies.push(en);
		}

		score.constructor("pacman_music");
		this.door = game.add.sprite(800-80, 260, 'door');
		game.physics.arcade.enable(this.door);
		this.door.body.setSize(40,40,20,0);
		this.door.scale.setTo(2, 2);
		this.door.visible = false;
		this.door.body.immovable = true;
	},

	update: function() {

		if(isGameOver) { return ;}
		var won = true;
		for(var i = 0; i < this.enemies.length; i++){
			if(this.enemies[i].enabled){
				won = false;
			}
		}
		if(won){
			if(this.player.sprite.body.x > 780){
				game.state.start('BeforeNBA');
			}
			this.door.visible = true;
		} else {
			game.physics.arcade.collide(this.player.sprite, this.door);
		}
		this.player.update();
		game.physics.arcade.collide(this.player.sprite, this.walls);

		for (var i = 0; i < this.enemies.length; i++){
			game.physics.arcade.collide(this.enemies[i].sprite, this.walls);
			game.physics.arcade.overlap(this.enemies[i].sprite, this.player.sprite, this.player.onHit);
			this.enemies[i].update();
			this.enemies[i].sprite.bringToTop();
		}
		this.player.sprite.bringToTop();

		for(var i = 0; i < this.cherries.length; i++){
			game.physics.arcade.overlap(this.cherries[i].sprite, this.player.sprite, this.cherries[i].collect);
		}

		for(var bt = 0; bt < this.player.bullets.length; bt++){
			for(var et = 0; et < this.enemies.length; et++){
				game.physics.arcade.overlap(this.player.bullets[bt].sprite, this.enemies[et].sprite, this.enemies[et].onHit);
			}
		}

		score.draw();
	}
}
