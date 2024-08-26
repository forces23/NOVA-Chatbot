import React from 'react';
// import { GameEngine } from './GameEngine'; // Adjust the import path as needed

interface Point {
    x: number;
    y: number;
}

interface Size {
    x: number;
    y: number;
}

interface GameObject {
    name: string;
    position: Point;
    velocity: Point;
    color: string;
    points: Point[];
    rotation: number;
    base: Point;
    size: Size;
    newcnv: HTMLCanvasElement;
    newctx: CanvasRenderingContext2D;
    delete: boolean;
    Start(): void;
    Update(): void;
    Draw(ctx: CanvasRenderingContext2D): void;
}

interface Input {
    mouse: Point;
    fire: boolean;
    left: boolean;
    right: boolean;
    forward: boolean;
}

/**
     * Basic game class constructor
     * @param {String} canvasSelector
     * @param {String} scoreSelector
     */
export class GameEngine implements GameEngine {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    score: number = 0;
    objects: GameObject[] = [];
    input: Input = {
        mouse: { x: 0, y: 0 },
        fire: false,
        left: false,
        right: false,
        forward: false
    };
    color: string = "";
    name: string = "";

    constructor(canvasSelector: string, scoreSelector: string) {
        const cnv = document.querySelector(canvasSelector) as HTMLCanvasElement || document.querySelector("canvas") as HTMLCanvasElement;
        const ctx = cnv.getContext("2d")!;
        const scr = document.querySelector(scoreSelector) as HTMLElement;
        const w = 320;
        const h = 240;

        // Setting default leaderboard data
        if (typeof (Storage) !== "undefined") {
            localStorage["board.0.name"] = "John Doe";
            localStorage["board.0.score"] = "9990";
            localStorage["board.1.name"] = "Artem N";
            localStorage["board.1.score"] = "1700";
        }

        this.canvas = cnv;
        this.context = ctx;

        /* Input events */
        this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
            this.input.mouse.x = e.offsetX;
            this.input.mouse.y = e.offsetY;
        });

        document.addEventListener("keydown", (e: KeyboardEvent) => {
            switch (e.keyCode) {
                case 32:
                    this.input.fire = true;
                    break;
                // Left:
                case 37:
                case 65:
                    this.input.left = true;
                    break;
                // Right:
                case 39:
                case 68:
                    this.input.right = true;
                    break;
                // Forward:
                case 38:
                case 87:
                    this.input.forward = true;
                    break;
            }
        });

        document.addEventListener("keyup", (e: KeyboardEvent) => {
            switch (e.keyCode) {
                case 32:
                    this.input.fire = false;
                    break;
                // Left:
                case 37:
                case 65:
                    this.input.left = false;
                    break;
                // Right:
                case 39:
                case 68:
                    this.input.right = false;
                    break;
                // Forward:
                case 38:
                case 87:
                    this.input.forward = false;
                    break;
            }
        });
    }

    updateScore(points: number): void {
        this.score += points;
        const scoreElement = document.querySelector("#g-score");
        if (scoreElement) {
            scoreElement.textContent = this.score.toString();
        }
    }
    
    eachByName(name: string, callback: (obj: GameObject, index: number) => void): void {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].name === name) {
                callback(this.objects[i], i);
            }
        }
    }

    Run(): void {
        const Load = () => {
            this.canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 320);
            this.canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 240) - 48;

            for (let i = 0; i < this.objects.length; i++) {
                this.objects[i].Start();
            }
        };

        const Update = () => {
            console.log("Start of update cycle");
            console.log(`Total objects: ${this.objects.length}, Asteroids: ${this.objects.filter(obj => obj.name === "asteroid").length}, Bullets: ${this.objects.filter(obj => obj.name === "bullet").length}`);

            const prevScore = this.score;

            // Clear canvas
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Delete unused objects
            const objectsBeforeDeletion = this.objects.length;
            this.objects = this.objects.filter(obj => !obj.delete);
            const objectsAfterDeletion = this.objects.length;
            if (objectsBeforeDeletion !== objectsAfterDeletion) {
                console.log(`Objects removed: ${objectsBeforeDeletion - objectsAfterDeletion}`);
            }

            // Update objects
            // for (let j = 0; j < this.objects.length; j++) {
            //     this.objects[j].Update();
            //     this.objects[j].Draw(this.context);
            // }
            this.objects.forEach((obj, index) => {
                console.log(`Updating object ${index}: ${obj.name} at (${obj.position.x}, ${obj.position.y})`);
                obj.Update();
                obj.Draw(this.context);
            });

            // Update score
            if (this.score > prevScore) {
                (document.querySelector("#g-score") as HTMLElement).innerHTML = this.score.toString();
            }

            // Game loop
            window.requestAnimationFrame(Update);
        };

        Load();
        Update();
    }
}


export const GameContext = React.createContext<GameEngine | null>(null);