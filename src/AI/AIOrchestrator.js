import { StupidAI } from "./StupidAI";
import { AlingAI } from "./AlingAI";
import { SupportAI } from "./SupportAI";
import { SniperAI } from "./SniperAI";
import { BruteAI } from "./BruteAI";

export class AIOrchestrator {
    constructor(scene) {
        this.scene = scene;
        //Добавляйте сюда свои ИИ порядок не особо важен главное, 
        // чтобы StupidAI был в самом конце так как это поведение в случае
        //  отказа всех остальных в идеале оно вообще не должно вызываться
        this.aiControllers = [new SupportAI(scene), new BruteAI(scene), new SniperAI(scene), new AlingAI(scene), new StupidAI(scene)];
    }

    processAIActions(enemy) {

        const chosenController = this.getAIForEnemy(enemy);

        if (!chosenController)
            return false;

        // Все действия противника применяем прям в process, окончание 
        // хода и задержка будут обработаны извне
        chosenController.process(enemy);

        return true;
    }

    getAIForEnemy(enemy) {
        for (const controller of this.aiControllers) {
            
            // В canProcess каждый должен проверять именно свой тип противников
            if (!controller.canProcess(enemy)) {
                continue;
            }

            return controller;
        }

        return null;
    }
}