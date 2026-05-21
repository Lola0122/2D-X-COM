export class Unit {
    constructor(scene, x, y, config) {
        this.scene = scene;
        this.name = config.name;
        this.type = config.type;
        this.role = config.role || null;
        this.maxHp = config.hp;
        this.hp = config.hp;
        this.attack = config.attack;
        this.defense = config.defense;
        this.accuracy = config.accuracy;
        this.moveRange = config.moveRange || 3;
        this.actionsLeft = 2;
        this.tile = null;


        let texture = config.type === 'player' ? 'player_unit' : 'enemy_unit';

        if (config.role === "swarm") {
            texture = "aling"
        }
        this.sprite = scene.add.sprite(x, y, texture).setDepth(5);

        if (config.role === "swarm") {
            this.sprite.play('aling_idle');
            this.sprite.displayWidth = 32;
            this.sprite.displayHeight = 32;
        }

        this.marker = scene.add.circle(x, y - 30, 8, 0xffd700).setDepth(6);
        this.marker.setVisible(false);
        this.nameLabel = scene.add.text(x, y - 45, config.name, {
            fontSize: '11px', fontFamily: 'Segoe UI', color: '#64748b'
        }).setOrigin(0.5).setDepth(6);
        this.setupInteractivity();
    }

    setupInteractivity() {
        this.sprite.setInteractive();
        this.sprite.on('pointerover', () => {
            if (this.scene.selectedUnit !== this) this.sprite.setTint(0xdddddd);
        });
        this.sprite.on('pointerout', () => {
            if (this.scene.selectedUnit !== this) this.sprite.clearTint();
        });
        this.sprite.on('pointerdown', () => {
            this.scene.selectUnit(this);
        });
    }

    hasActions() { return this.actionsLeft > 0; }
    useAction(amount = 1) { this.actionsLeft = Math.max(0, this.actionsLeft - amount); }
    endTurn() { this.actionsLeft = 0; }

    resetActions() {
        this.actionsLeft = 2;
        this.sprite.setAlpha(1);
    }

    select() {
        this.marker.setVisible(true);
        this.sprite.setTint(this.type === 'player' ? 0x44ff44 : 0xe3e300);
    }

    deselect() {
        this.marker.setVisible(false);
        this.sprite.clearTint();
    }


    get isAlive() {
        return this.hp > 0;
    }

    moveTo(tile) {
        this.setTile(tile);
        const { x, y } = this.scene.tilemap.gridToWorld(tile.gridX, tile.gridY);
        this.sprite.setPosition(x, y);
        this.marker.setPosition(x, y - 30);
        this.nameLabel.setPosition(x, y - 45);
        this.useAction(1);
        this.scene.infoPanel.update(this);
    }

    setTile(tile) {
        if (this.tile && this.tile.unit === this) {
            this.tile.unit = null;
        }

        this.tile = tile;

        if (tile) {
            tile.unit = this;
        }
    }

}