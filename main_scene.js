// don't let cheese Counter go below 0!!!!!

var cheeseCounter, catCounter, autoclick_tiers, autoclickers, next_autoclick_tier_index;
var forkAC, spoonAC, sporkAC,  shovelAC, pickaxeAC, jackhammerAC, drillAC, excavatorAC, cheesemineAC
var MainScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "MainScene" });
    },
    init: function() {
    },
    preload: function() {
        // import background photo
        this.load.setBaseURL('https://laurareese03.github.io/');
        this.load.image('space_back', 'assets/space_back2.jpg');
        this.load.image('moon', 'assets/moon.png');
        this.load.image('button', 'assets/Button.png');
        this.load.image('cat', 'assets/cat.png');
        this.load.image('fork', 'assets/fork.png');
        this.load.image('spoon', 'assets/spoon.png');
        this.load.image('shovel', 'assets/shovel.png');
        this.load.image('pickaxe', 'assets/pickaxe.png');
        this.load.image('jackhammer', 'assets/jackhammer.png');
        this.load.image('drill', 'assets/drill.png');
        this.load.image('excavator', 'assets/excavator.png');
        this.load.image('cheesemine', 'assets/cheesemine.png');
    },

    create: function() {
      // set up background
      const back_img = this.add.image(640, 360, 'space_back').setOrigin(0.5);
      back_img.scale = 0.7

      // set up cheese count
      cheese_amount = 0;
      cheese_per_sec = 0;

      // set up cat amount
      cat_amount = 1;
      cats_per_sec = 0;

      // Cheese Visual
      const moon_img = this.add.image(640, 300, 'moon').setOrigin(0.5);
      moon_img.scale = 3.5; 

        // cat visual
        this.add.image(640, 125, 'cat').setOrigin(0.5);

        moon_img.setInteractive();
        moon_img.on('pointerdown', () => this.onClickCheese() );

      // building visual
      const upgradebuildingBtn = this.add.text(640, 300, 'upgrade building', { fill: '#fff', fontSize: 50, fontFamily: "American Typewriter" }).setOrigin(0.5);
      upgradebuildingBtn.setInteractive();
      upgradebuildingBtn.on('pointerdown', () => this.onClickUpgradeBuilding() );

      autoclick_tiers = [1,3,7,15,30,50,75,100,150]
      
      // set up all objects for buying
      this.createAutoClickers();
      this.createBuildings();
      this.createCatInstants();
      this.createCatProgressives();

      cheeseCounter = this.add.text(640, 250, cheese_amount, { fill: '#fff', fontSize: 50, fontFamily: "American Typewriter" }).setOrigin(0.5);
      catCounter = this.add.text(640, 450, cat_amount, { fill: '#fff', fontSize: 50, fontFamily: "American Typewriter" }).setOrigin(0.5);

      cheesepersecCounter = this.add.text(640, 600, cheese_per_sec, { fill: '#fff', fontSize: 50, fontFamily: "American Typewriter" }).setOrigin(0.5);
      autoclickers = [forkAC, spoonAC, sporkAC,  shovelAC, pickaxeAC, jackhammerAC, drillAC, excavatorAC, cheesemineAC]
      next_autoclick_tier_index = 1;

      setInterval(this.updateStatsBySecond, 1000);
    
    },
    update: function() {
      cheeseCounter.setText(cheese_amount);
      catCounter.setText(Math.floor(cat_amount));
      cheesepersecCounter.setText(cheese_per_sec);
      forkCounter.setText(forkAC.owned);
    },

    // onclick of cheese
    onClickCheese: function() {
        // increase cheese amount
        cheese_amount += 1;
    },

    // onclick of buying an autoclicker
    onClickBuyAutoClicker: function(clicker) {
        console.log("auto", forkAC.owned);
        // check if it's unlocked
        if (clicker.is_unlocked) {    
            // get cost of clicker
            click_cost = clicker.cost;
            // if enough cheese owned
            if (cheese_amount >= click_cost) {
                // subtract amount of cheese cost from owned
                cheese_amount -= click_cost;
                // increase cheese per second amount
                cheese_per_sec += clicker.base_output;
                // increase owned number of autoclicker
                clicker.owned += 1;
            }
        }
    },

    onClickUpgradeBuilding: function() {
        // get the next building object
        next_building = buildings[curr_building + 1];
        // check enough cheese to buy
        if (cheese_amount >= next_building.cost) {
            // move current building location
            curr_building += 1;
            // update cat max
            max_cats = curr_building.cat_limit;
        }
    },

    onClickBuyCatInstant(item) {
        console.log(item.cost);
        // get cost of item
        item_cost = item.cost;
        // if enough cheese owned
        if (cheese_amount >= item_cost) {
            // subtract amount of cheese cost from owned
            cheese_amount -= item_cost;
            // increase number of cats
            cat_amount += item.num_cats;
        }
    },

    onClickBuyCatProgressive(item) {
      // check if it's been unlocked
      if (item.is_unlocked) {
        // get cost of item
        item_cost = item.cost;
        // if enough cheese owned
        if (cheese_amount >= item_cost) {
          // subtract amount of cheese cost from owned
          cheese_amount -= item_cost;
          // increase cats per second amount
          cats_per_sec += item.cats_per_sec;
          // update displayed cats per minute
        }
      }
    },

    updateStatsBySecond: function() {
        // add cheese per second to cheese amount
        cheese_amount += cheese_per_sec;
        // add cats per second to cats amount    
        cat_amount += cats_per_sec;
        console.log(cat_amount, autoclick_tiers[next_autoclick_tier_index])
        if (cat_amount >= autoclick_tiers[next_autoclick_tier_index]) {
          console.log(autoclickers[next_autoclick_tier_index], 'blah')
          autoclickers[next_autoclick_tier_index].setUnlock()
          next_autoclick_tier_index += 1;
        }
        
    },

    createAutoClickers: function() {
        forkAC = new AutoClick(1, autoclick_tiers[0], 1, 0, true);
        spoonAC = new AutoClick(3, autoclick_tiers[1], 1, 0, false);
        sporkAC = new AutoClick(5, autoclick_tiers[2], 1, 0, false);
        shovelAC = new AutoClick(10, autoclick_tiers[3], 1, 0, false);
        pickaxeAC = new AutoClick(50, autoclick_tiers[4], 1, 0, false);
        jackhammerAC = new AutoClick(100, autoclick_tiers[5], 1, 0, false);
        drillAC = new AutoClick(500, autoclick_tiers[6], 1, 0, false);
        excavatorAC = new AutoClick(1000, autoclick_tiers[7], 1, 0, false);
        cheesemineAC = new AutoClick(5000, autoclick_tiers[8], 1, 0, false);

        // Autoclickers
        forkCounter = this.add.text(35, 60, forkAC.owned, { fill: '#fff', fontSize: 35, fontFamily: "American Typewriter" }).setOrigin(0.5);
        forkCost = this.add.text(315, 60, "$" + forkAC.cost, { fill: '#fff', fontSize: 30, fontFamily: "American Typewriter" }).setOrigin(0.5);
        const forkDisplay = this.add.image(175, 60, 'fork').setOrigin(0.5);
        forkDisplay.scale = 1.4;
        forkDisplay.setInteractive();
        forkDisplay.on('pointerdown', () => this.onClickBuyAutoClicker(forkAC) );

        const spoonDisplay = this.add.image(150, 135, 'spoon').setOrigin(0.5);
        spoonDisplay.scale = 1.4;
        spoonDisplay.setInteractive();
        spoonDisplay.on('pointerdown', () => this.onClickBuyAutoClicker(spoonAC) );

        const sporkDisplay = this.add.image(150, 210, 'spoon').setOrigin(0.5);
        sporkDisplay.scale = 1.4;
        sporkDisplay.setInteractive();
        sporkDisplay.on('pointerdown', () => this.onClickBuyAutoClicker(sporkAC) ).setOrigin(0.5);

        const shovelDisplay = this.add.image(150, 285, 'shovel').setOrigin(0.5);
        shovelDisplay.scale = 1.4;
        shovelDisplay.setInteractive();
        shovelDisplay.on('pointerdown', () => this.onClickBuyAutoClicker(shovelAC) );
        spoonDisplay.scale = 1.4;

        const pickaxeDisplay = this.add.image(150, 360, 'pickaxe').setOrigin(0.5);
        pickaxeDisplay.scale = 1.4;
        pickaxeDisplay.setInteractive();
        pickaxeDisplay.on('pointerdown', () => this.onClickBuyAutoClicker(pickaxeAC) );

        const jackhammerDisplay = this.add.image(150, 435, 'jackhammer').setOrigin(0.5);
        jackhammerDisplay.scale = 1.4;
        jackhammerDisplay.setInteractive();
        jackhammerDisplay.on('pointerdown', () => this.onClickBuyAutoClicker(jackhammerAC) ).setOrigin(0.5);

        const drillDisplay = this.add.image(150, 510, 'drill').setOrigin(0.5);
        drillDisplay.scale = 1.4;
        drillDisplay.setInteractive();
        drillDisplay.on('pointerdown', () => this.onClickBuyAutoClicker(drillAC) ).setOrigin(0.5);

        const excavatorDisplay = this.add.image(150, 585, 'excavator').setOrigin(0.5);
        excavatorDisplay.scale = 1.4;
        excavatorDisplay.setInteractive();
        excavatorDisplay.on('pointerdown', () => this.onClickBuyAutoClicker(excavatorAC) ).setOrigin(0.5);

        const cheesemineDisplay = this.add.image(150, 660, 'cheesemine').setOrigin(0.5);
        cheesemineDisplay.scale = 1.4;
        cheesemineDisplay.setInteractive();
        cheesemineDisplay.on('pointerdown', () => this.onClickBuyAutoClicker(cheesemineAC) ).setOrigin(0.5);
    },

    createBuildings: function() {

        curr_building = 0;
        
        const cardboardboxB = new Building(1, 1);
        const catCaveB = new Building(1, 3);
        const shedB = new Building(1, 50);
        const houseB = new Building(1, 250);
        const barnB = new Building(1, 500);
        const studioApartmentComplexB = new Building(1, 1000);
        const multibedApartmentComplexB = new Building(1, 2000);
        const catopiaB = new Building(1, 10000);

        buildings = [];
        buildings.push(cardboardboxB, catCaveB, shedB, houseB, barnB, studioApartmentComplexB, multibedApartmentComplexB, catopiaB);
    },

    createCatInstants: function() {
        let treatCI = new CatInstant(1, 1);   
        const treatDisplay = this.add.text(1100, 50, 'Treat', { fill: '#fff', fontSize: 40 }).setOrigin(0.5);
        treatDisplay.setInteractive();
        treatDisplay.on('pointerdown', () => this.onClickBuyCatInstant(treatCI) );

        let treatpileCI = new CatInstant(1, 1);
        const treatpileDisplay = this.add.text(1100, 100, 'Treat Pile', { fill: '#fff', fontSize: 40 }).setOrigin(0.5);
        treatpileDisplay.setInteractive();
        treatpileDisplay.on('pointerdown', () => this.onClickBuyCatInstant(treatpileCI) );        

        let cheesewheelCI = new CatInstant(1, 1);
        const cheesewheelDisplay = this.add.text(1100, 150, 'Cheese Wheel', { fill: '#fff', fontSize: 40 }).setOrigin(0.5);
        cheesewheelDisplay.setInteractive();
        cheesewheelDisplay.on('pointerdown', () => this.onClickBuyCatInstant(cheesewheelCI) );

        let catnipCI = new CatInstant(1, 1);
        const catnipDisplay = this.add.text(1100, 200, 'Catnip', { fill: '#fff', fontSize: 40 }).setOrigin(0.5);
        catnipDisplay.setInteractive();
        catnipDisplay.on('pointerdown', () => this.onClickBuyCatInstant(catnipCI) );

    }, 

    createCatProgressives: function() {
        const ballCP = new CatProgressive(1, 0.033, 0, true);
        const ballDisplay = this.add.text(1100, 250, 'Ball', { fill: '#fff', fontSize: 40 }).setOrigin(0.5);
        ballDisplay.setInteractive();
        ballDisplay.on('pointerdown', () => this.onClickBuyCatProgressive(ballCP) );

        const mouseCP = new CatProgressive(1, 0.083, 0, true);
        const mouseDisplay = this.add.text(1100, 300, 'Mouse', { fill: '#fff', fontSize: 40 }).setOrigin(0.5);
        mouseDisplay.setInteractive();
        mouseDisplay.on('pointerdown', () => this.onClickBuyCatProgressive(mouseCP) );

        const ponytailholderCP = new CatProgressive(1, 0.17, 0, true);
        const ponytailholderDisplay = this.add.text(1100, 350, 'Ponytail Holder', { fill: '#fff', fontSize: 40 }).setOrigin(0.5);
        ponytailholderDisplay.setInteractive();
        ponytailholderDisplay.on('pointerdown', () => this.onClickBuyCatProgressive(ponytailholderCP) );

        const twisttieCP = new CatProgressive(1, 1, 0.33, true);
        const twisttieDisplay = this.add.text(1100, 400, 'Twist Tie', { fill: '#fff', fontSize: 40 }).setOrigin(0.5);
        twisttieDisplay.setInteractive();
        twisttieDisplay.on('pointerdown', () => this.onClickBuyCatProgressive(twisttieCP) );

        const laserpointerCP = new CatProgressive(1, 0.5, 0, true);
        const laserpointerDisplay = this.add.text(1100, 450, 'Laser Pointer', { fill: '#fff', fontSize: 40 }).setOrigin(0.5);
        laserpointerDisplay.setInteractive();
        laserpointerDisplay.on('pointerdown', () => this.onClickBuyCatProgressive(laserpointerCP) );

        const cushionCP = new CatProgressive(1, 1, 0.83, true);
        const cushionDisplay = this.add.text(1100, 500, 'Cushion', { fill: '#fff', fontSize: 40 }).setOrigin(0.5);
        cushionDisplay.setInteractive();
        cushionDisplay.on('pointerdown', () => this.onClickBuyCatProgressive(cushionCP) );

        const keyboardCP = new CatProgressive(1, 1, 1.67, true);
        const keyboardDisplay = this.add.text(1100, 550, 'Keyboard', { fill: '#fff', fontSize: 40 }).setOrigin(0.5);
        keyboardDisplay.setInteractive();
        keyboardDisplay.on('pointerdown', () => this.onClickBuyCatProgressive(keyboardCP) );

        const scratcherCP = new CatProgressive(1, 1, 2.5, true);
        const scratcherDisplay = this.add.text(1100, 600, 'Scratcher', { fill: '#fff', fontSize: 40 }).setOrigin(0.5);
        scratcherDisplay.setInteractive();
        scratcherDisplay.on('pointerdown', () => this.onClickBuyCatProgressive(scratcherCP) );

        const treeCP = new CatProgressive(1, 1, 3.33, true);
        const treeDisplay = this.add.text(1100, 650, 'Tree', { fill: '#fff', fontSize: 40 }).setOrigin(0.5);
        treeDisplay.setInteractive();
        treeDisplay.on('pointerdown', () => this.onClickBuyCatProgressive(treeCP) );


    }

});

