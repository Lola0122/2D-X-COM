export class AlingAI {
    constructor(scene) {
        this.scene = scene;
    }

    canProcess(enemy) {
        return enemy.role === 'swarm';
    }

    process(enemy) {
        const pathfinder = this.scene.pathfinder;

        const achievableTiles = pathfinder
            .getTilesInRange(enemy.tile, enemy.moveRange)
            .filter(t => !t.unit);

        if (achievableTiles.length === 0) {
            return;
        }

        const randomTile =
            achievableTiles[
            Phaser.Math.Between(0, achievableTiles.length - 1)
            ];


        this.scene.movementManager.moveUnitTo(enemy, randomTile);

    }
}