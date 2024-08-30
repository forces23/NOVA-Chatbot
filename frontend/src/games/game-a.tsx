/*
* Did not create i found a Javascript asteroid game and converted to TypeScript
* there is still some issue with the game but it works pretty well for now
*/

import { useEffect, useRef } from 'react';
import { GameContext, GameEngine } from './gameContext-gameA';
import '../styles/game_a.css';

interface Point {
    x: number;
    y: number;
}
interface Window {
    requestAnimFrame: (callback: FrameRequestCallback) => number;
}
interface Size {
    x: number;
    y: number;
}

interface Input {
    mouse: Point;
    fire: boolean;
    left: boolean;
    right: boolean;
    forward: boolean;
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

class Polygon implements GameObject {
    name: string;
    position: Point;
    velocity: Point;
    color: string;
    points: Point[];
    rotation: number = 0;
    base: Point;
    size: Size;
    newcnv: HTMLCanvasElement;
    newctx: CanvasRenderingContext2D;
    delete: boolean = false;

    constructor(options: {
        name?: string;
        color?: string;
        points?: Point[];
        position?: Point;
        velocity?: Point;
        size?: Size;
        base?: Point;
    }) {
        this.name = options.name || "Polygon";
        this.color = options.color || "#0F0";
        this.points = options.points || [{ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 10, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 10 }, { x: 10, y: 10 }];
        this.position = options.position || { x: 0, y: 0 };
        this.velocity = options.velocity || { x: 0, y: 0 };
        this.size = options.size || { x: 100, y: 100 };
        this.base = options.base || { x: 50, y: 50 };

        this.newcnv = document.createElement("canvas");
        this.newctx = this.newcnv.getContext("2d")!;
        this.newcnv.width = this.size.x;
        this.newcnv.height = this.size.y;
    }

    Start(): void { }
    Update(): void { }

    Draw(ctx: CanvasRenderingContext2D): void {
        this.newctx.clearRect(0, 0, this.newcnv.width, this.newcnv.height);
        this.newctx.save();
        this.newctx.translate(this.base.x, this.base.y);
        this.newctx.beginPath();
        this.newctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            this.newctx.lineTo(this.points[i].x, this.points[i].y);
        }
        this.newctx.closePath();
        this.newctx.shadowBlur = 5;
        this.newctx.shadowColor = this.color;
        this.newctx.strokeStyle = this.color;
        this.newctx.stroke();
        this.newctx.restore();

        // Draw this object 8 times to simulate closed space near canvas edges.
        const drawPositions = [
            { x: 0, y: 0 },
            { x: -ctx.canvas.width, y: 0 },
            { x: ctx.canvas.width, y: 0 },
            { x: 0, y: -ctx.canvas.height },
            { x: 0, y: ctx.canvas.height },
            { x: -ctx.canvas.width, y: -ctx.canvas.height },
            { x: ctx.canvas.width, y: -ctx.canvas.height },
            { x: -ctx.canvas.width, y: ctx.canvas.height },
            { x: ctx.canvas.width, y: ctx.canvas.height }
        ];

        drawPositions.forEach(pos => {
            ctx.save();
            ctx.translate(this.position.x + pos.x, this.position.y + pos.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.drawImage(this.newcnv, -this.base.x, -this.base.y);
            ctx.restore();
        });
    }
}

class Asteroid extends Polygon {
    rotationSpeed: number = 0;
    radius: number = 0;
    score: number = 0;
    private game: GameEngine;

    constructor(game: GameEngine, rad: number) {
        // const game = useContext(GameContext);
        if (!game) throw new Error(`Invalid game context`);
        super({
            points: asteroidVertices(Math.max(Math.floor(rad / 5), 3), rad),
            color: game.color,
            name: "asteroid",
            // size: { x: 210, y: 210 },
            // base: { x: 105, y: 105 },
            size: { x: rad * 2, y: rad * 2 },
            base: { x: rad, y: rad },
            velocity: { x: (Math.random() * 2 - 1) * Math.random() * 2, y: (Math.random() * 2 - 1) * Math.random() * 2 },
            position: { x: Math.random() * 500, y: Math.random() * 1000 }
        });
        this.game = game;
    }

    Start(): void {
        this.rotationSpeed = (Math.random() * 2 - 1) * Math.random() * 2;
        this.radius = this.size.x / 2;
        this.score = (80 / this.radius) * 5;
    }

    Update(): void {
        console.log(`Asteroid position: (${this.position.x}, ${this.position.y})`);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Teleporting on edges
        if (this.position.x > this.game.canvas.width) {
            this.position.x -= this.game.canvas.width;
        }
        if (this.position.x < 0) {
            this.position.x += this.game.canvas.width;
        }
        if (this.position.y > this.game.canvas.height) {
            this.position.y -= this.game.canvas.height;
        }
        if (this.position.y < 0) {
            this.position.y += this.game.canvas.height;
        }

        // Set rotation
        this.rotation += this.rotationSpeed;
        if (this.rotation >= 360) {
            this.rotation -= 360;
        }
        if (this.rotation < 0) {
            this.rotation += 360;
        }
    }
    // Draw(ctx: CanvasRenderingContext2D): void {
    //     super.Draw(ctx);

    //     // Draw collision boundary
    //     ctx.beginPath();
    //     ctx.strokeStyle = 'blue';
    //     ctx.lineWidth = 1;
    //     for (let i = 0; i < this.points.length; i++) {
    //         const point = RotatePoint(this.points[i], { x: 0, y: 0 }, this.rotation * Math.PI / 180);
    //         if (i === 0) {
    //             ctx.moveTo(this.position.x + point.x, this.position.y + point.y);
    //         } else {
    //             ctx.lineTo(this.position.x + point.x, this.position.y + point.y);
    //         }
    //     }
    //     ctx.closePath();
    //     ctx.stroke();
    // }
}


class Bullet extends Polygon {
    private game: GameEngine;
    private ship: Ship;

    constructor(game: GameEngine, ship: Ship) {
        // const game = useContext(GameContext);
        if (!game) throw new Error(`Invalid game context`);
        super({
            points: [
                { x: 0, y: 0 },
                { x: 0, y: -5 }
            ],
            size: { x: 10, y: 15 },
            base: { x: 5, y: 10 },
            color: game.color,
            name: "bullet"
        });
        this.game = game;
        this.ship = ship;
    }

    Start(): void {
        const posDelta = RotatePoint({ x: 0, y: -20 }, { x: 0, y: 0 }, this.ship.rotation * Math.PI / 180);
        this.position = { x: this.ship.position.x + posDelta.x, y: this.ship.position.y + posDelta.y };
        this.rotation = this.ship.rotation;
        this.velocity = { x: posDelta.x / 2, y: posDelta.y / 2 };
    }

    Update(): void {
        // Move
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Check for intersection with asteroid
        let collision = false;
        this.game.eachByName("asteroid", (node: GameObject) => {
            const asteroidNode = node as Asteroid;
            // Use asteroidNode instead of node
            if (Math.sqrt((asteroidNode.position.x - this.position.x) ** 2 + (asteroidNode.position.y - this.position.y) ** 2) < asteroidNode.radius) {
                const verts = node.points.map(p => {
                    const np = RotatePoint(p, { x: 0, y: 0 }, node.rotation * Math.PI / 180);
                    return {
                        x: np.x + node.position.x,
                        y: np.y + node.position.y
                    };
                });
                if (CheckPointInPoly(this.position, verts)) {
                    collision = true;
                    const asteroidNode = node as Asteroid;
                    const r = asteroidNode.radius / 2;

                    if (r > 5) {
                        const ast1 = new Asteroid(this.game, asteroidNode.radius / 2);
                        const ast2 = new Asteroid(this.game, asteroidNode.radius / 2);
                        ast1.Start();
                        ast2.Start();

                        ast1.velocity = RotatePoint(node.velocity, { x: 0, y: 0 }, 10 * Math.PI / 180);
                        ast2.velocity = RotatePoint(node.velocity, { x: 0, y: 0 }, 350 * Math.PI / 180);

                        ast1.position = { x: node.position.x + ast1.velocity.x, y: node.position.y + ast1.velocity.y };
                        ast2.position = { x: node.position.x + ast2.velocity.x, y: node.position.y + ast2.velocity.y };

                        this.game.objects.push(ast1, ast2);
                        node.delete = true;  // Mark the small asteroid for deletion
                    } else {
                        const burst = new Burst(this.game, { position: node.position, color: this.game.color });
                        this.game.objects.push(burst);
                        node.delete = true;  // Mark the small asteroid for deletion
                    }
                    node.delete = true;
                    // this.game.score += asteroidNode.score;
                    this.game.updateScore(asteroidNode.score);
                    
                }
            }
        });
        if (collision) {
            this.delete = true;
            // this.game.updateScore(asteroidNode.score);
        }

        // Delete if it goes out of world bounds
        if (this.position.x < 0 || this.position.y < 0 || this.position.x > this.game.canvas.width || this.position.y > this.game.canvas.height) {
            this.delete = true;
        }
    }
}

class Burst implements GameObject {
    name: string;
    position: Point;
    velocity: Point = { x: 0, y: 0 };
    color: string;
    points: Point[] = [];
    rotation: number = 0;
    base: Point = { x: 0, y: 0 };
    size: Size = { x: 0, y: 0 };
    newcnv: HTMLCanvasElement = document.createElement('canvas');
    newctx: CanvasRenderingContext2D;
    delete: boolean = false;
    radius: number = 0;
    count: number;
    length: number;
    speed: number;
    private game: GameEngine;

    constructor(game: GameEngine, options: {
        length?: number;
        count?: number;
        color?: string;
        name?: string;
        position?: Point;
        speed?: number;
    }) {
        this.length = options.length || 10;
        this.count = options.count || 36;
        this.color = options.color || "#F00";
        this.name = options.name || "burst";
        this.position = options.position || { x: 0, y: 0 };
        this.speed = options.speed || 10;
        this.newctx = this.newcnv.getContext('2d')!;
        this.game = game;
    }

    Start(): void { }

    Update(): void {
        this.radius += this.speed;
        if (this.radius > this.game.canvas.width || this.radius > this.game.canvas.height) {
            this.delete = true;
        }
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.beginPath();
        for (let i = 0; i < this.count; i++) {
            const v1 = RotatePoint({ x: 0, y: this.radius }, { x: 0, y: 0 }, 2 / this.count * i * Math.PI);
            const v2 = RotatePoint({ x: 0, y: this.radius + this.length }, { x: 0, y: 0 }, 2 / this.count * i * Math.PI);
            ctx.moveTo(v1.x, v1.y);
            ctx.lineTo(v2.x, v2.y);
        }
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;
        ctx.stroke();
        ctx.restore();
    }
}

class Ship extends Polygon {
    rotationSpeed: number = 0;
    speed: number = 0;
    inertia: number = 0;
    inertiaMax: number = 0;
    shootDate: number = 0;
    private game: GameEngine;

    constructor(game: GameEngine, options: {
        points: Point[];
        color: string;
        name: string;
        size: Size;
        base: Point;
    }) {
        super(options);
        this.game = game;
    }

    Start(): void {
        this.position = { x: this.game.canvas.width / 2, y: this.game.canvas.height / 2 };
        this.rotationSpeed = 7;
        this.speed = 0.2;
        this.inertia = 0;
        this.inertiaMax = 0.99;
        this.shootDate = 0;
    }

    Update(): void {
        // Your existing update logic here
        if (this.game.input.left) {
            this.rotation -= this.rotationSpeed;
        }
        if (this.game.input.right) {
            this.rotation += this.rotationSpeed;
        }
        this.rotation = (this.rotation + 360) % 360;

        // Change velocity vector when engine is on
        if (this.game.input.forward) {
            this.velocity.x -= Math.sin(-this.rotation * Math.PI / 180) * this.speed;
            this.velocity.y -= Math.cos(-this.rotation * Math.PI / 180) * this.speed;
            this.inertia = this.inertiaMax;

            // Draw flame
            this.points = [
                { x: 0, y: 0 },
                { x: 10, y: 10 },
                { x: 0, y: -20 },
                { x: -10, y: 10 },
                { x: 0, y: 0 },
                { x: 3, y: 8 },
                { x: 0, y: 15 },
                { x: -3, y: 8 }
            ];
        } else {
            // Hide flame
            this.points = [
                { x: 0, y: 0 },
                { x: 10, y: 10 },
                { x: 0, y: -20 },
                { x: -10, y: 10 }
            ];
        }

        // fire
        if (this.game.input.fire && Date.now() - this.shootDate > 300) {
            const b = new Bullet(this.game, this);
            b.Start();
            this.game.objects.push(b);
            this.shootDate = Date.now();
        }

        // Add inertia
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.x *= this.inertia;
        this.velocity.y *= this.inertia;

        // Teleporting
        this.position.x = (this.position.x + this.game.canvas.width) % this.game.canvas.width;
        this.position.y = (this.position.y + this.game.canvas.height) % this.game.canvas.height;

        // Check intersection with asteroid
        let collision = false;
        this.game.eachByName("asteroid", (node: GameObject) => {
            const asteroidNode = node as Asteroid;
            const dx = asteroidNode.position.x - this.position.x;
            const dy = asteroidNode.position.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only check for detailed collision if the asteroid is close enough
            if (distance < asteroidNode.radius + 50) { // 20 is an approximation of ship's size
                // for (let i = 0; i < this.points.length; i++) {
                    
                //     const s1 = i;
                //     const s2 = (i + 1) % this.points.length;

                //     const rs1 = RotatePoint(this.points[s1], { x: 0, y: 0 }, this.rotation * Math.PI / 180);
                //     const rs2 = RotatePoint(this.points[s2], { x: 0, y: 0 }, this.rotation * Math.PI / 180);

                //     const shipPoint1 = { x: rs1.x + this.position.x, y: rs1.y + this.position.y };
                //     const shipPoint2 = { x: rs2.x + this.position.x, y: rs2.y + this.position.y };

                //     for (let j = 0; j < asteroidNode.points.length; j++) {
                //         const n1 = j;
                //         const n2 = (j + 1) % asteroidNode.points.length;

                //         const rn1 = RotatePoint(asteroidNode.points[n1], { x: 0, y: 0 }, asteroidNode.rotation * Math.PI / 180);
                //         const rn2 = RotatePoint(asteroidNode.points[n2], { x: 0, y: 0 }, asteroidNode.rotation * Math.PI / 180);

                //         const asteroidPoint1 = { x: rn1.x + asteroidNode.position.x, y: rn1.y + asteroidNode.position.y };
                //         const asteroidPoint2 = { x: rn2.x + asteroidNode.position.x, y: rn2.y + asteroidNode.position.y };

                //         if (CheckIntersection(shipPoint1, shipPoint2, asteroidPoint1, asteroidPoint2)) {
                //             collision = true;
                //             console.log("Ship collided with asteroid");
                //             console.log(`Ship position: (${this.position.x}, ${this.position.y})`);
                //             console.log(`Colliding asteroid position: (${asteroidNode.position.x}, ${asteroidNode.position.y})`);
                //             return; // Exit the loop early if collision is detected
                //         }
                //     }
                // }
                const shipPoints = this.points.map(p => {
                    const rotated = RotatePoint(p, { x: 0, y: 0 }, this.rotation * Math.PI / 180);
                    return {
                        x: rotated.x + this.position.x,
                        y: rotated.y + this.position.y
                    };
                });

                const asteroidPoints = asteroidNode.points.map(p => {
                    const rotated = RotatePoint(p, { x: 0, y: 0 }, asteroidNode.rotation * Math.PI / 180);
                    return {
                        x: rotated.x + asteroidNode.position.x,
                        y: rotated.y + asteroidNode.position.y
                    };
                });

                if (PolygonsIntersect(shipPoints, asteroidPoints)) {
                    collision = true;
                    console.log("Ship collided with asteroid");
                    console.log(`Ship position: (${this.position.x}, ${this.position.y})`);
                    console.log(`Colliding asteroid position: (${asteroidNode.position.x}, ${asteroidNode.position.y})`);
                    return; // Exit the loop early if collision is detected
                }
                
            }
        });
        if (collision) {
            this.delete = true;
            const burst = new Burst(this.game, { position: this.position, color: this.game.color });
            this.game.objects.push(burst);
            EndGameMessage("#g-leaderboard", this.game.score);
            const endGameElement = document.querySelector("#g-endgame");
            if (endGameElement) {
                (endGameElement as HTMLElement).style.display = "block";
            }
        }

        // Make new asteroids
        let asteroidCount = 0;
        this.game.eachByName("asteroid", () => { asteroidCount++; });
        if (asteroidCount < 1) {
            for (let i = 0; i < 4; i++) {
                let rock: Asteroid;
                do{
                    rock = new Asteroid(this.game, 80);
                    rock.Start();
                } while(Math.sqrt((rock.position.x - this.position.x) ** 2 + (rock.position.y - this.position.y) ** 2) < 100);
                this.game.objects.push(rock);
            }
        }

        
    };
    // Draw(ctx: CanvasRenderingContext2D): void {
    //     super.Draw(ctx);

    //     // Draw collision boundary
    //     ctx.beginPath();
    //     ctx.strokeStyle = 'red';
    //     ctx.lineWidth = 1;
    //     for (let i = 0; i < this.points.length; i++) {
    //         const point = RotatePoint(this.points[i], { x: 0, y: 0 }, this.rotation * Math.PI / 180);
    //         if (i === 0) {
    //             ctx.moveTo(this.position.x + point.x, this.position.y + point.y);
    //         } else {
    //             ctx.lineTo(this.position.x + point.x, this.position.y + point.y);
    //         }
    //     }
    //     ctx.closePath();
    //     ctx.stroke();
    // }
}

/* Helpers */
function CheckIntersection(v1: Point, v2: Point, v3: Point, v4: Point): boolean {
    const uA = ((v4.x-v3.x)*(v1.y-v3.y) - (v4.y-v3.y)*(v1.x-v3.x)) / ((v4.y-v3.y)*(v2.x-v1.x) - (v4.x-v3.x)*(v2.y-v1.y));
    const uB = ((v2.x-v1.x)*(v1.y-v3.y) - (v2.y-v1.y)*(v1.x-v3.x)) / ((v4.y-v3.y)*(v2.x-v1.x) - (v4.x-v3.x)*(v2.y-v1.y));

    return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
}

function CheckPointInPoly(p: Point, poly: Point[]): boolean {
    let res = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const v1 = poly[i];
        const v2 = poly[j];
        if ((v1.y > p.y) !== (v2.y > p.y) &&
            p.x < (v2.x - v1.x) * (p.y - v1.y) / (v2.y - v1.y) + v1.x) {
            res = !res;
        }
    }
    return res;
}

function RotatePoint(p: Point, center: Point, angle: number): Point {
    return {
        x: ((p.x - center.x) * Math.cos(angle) - (p.y - center.y) * Math.sin(angle)) + center.x,
        y: ((p.x - center.x) * Math.sin(angle) + (p.y - center.y) * Math.cos(angle)) + center.y
    };
}

function asteroidVertices(count: number, rad: number): Point[] {
    const p: Point[] = [];
    for (let i = 0; i < count; i++) {
        const angle = (360 / count) * i * Math.PI / 180;
        const randomness = 1 - Math.random() * 0.3;  // Reduced randomness
        p[i] = {
            // x: (-Math.sin((360 / count) * i * Math.PI / 180) + Math.round(Math.random() * 2 - 1) * Math.random() / 3) * rad,
            // y: (-Math.cos((360 / count) * i * Math.PI / 180) + Math.round(Math.random() * 2 - 1) * Math.random() / 3) * rad
            x: -Math.sin(angle) * rad * randomness,
            y: -Math.cos(angle) * rad * randomness
        };
    }
    return p;
}

function EndGameMessage(selector: string, score: number): void {
    const scores: { name: string, score: number }[] = [];
    if (typeof (Storage) !== "undefined") {
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage[`board.${i}.name`] !== undefined) {
                scores.push({
                    name: localStorage[`board.${i}.name`],
                    score: parseInt(localStorage[`board.${i}.score`])
                });
            }
        }
        scores.sort((a, b) => b.score - a.score);

        let html = "<ol class=\"b-scores\">";
        for (let j = 0; j < scores.length; j++) {
            html += "<li class=\"b-scores__box\">";
            if (score > scores[j].score) {
                html += `Your score: ${score}. <input onchange="SaveName(this)" value="" autofocus="autofocus" type="text" placeholder="Enter your name" class="b-scores__input" /></li><li class="b-scores__box">`;
                score = 0;
            }
            html += `${scores[j].score}: ${scores[j].name}</li>`;
        }
        if (score !== 0) {
            html += `<li class="b-scores__box">Your score: ${score}. <input onchange="SaveName(this)" value="" autofocus="autofocus" type="text" placeholder="Enter your name" class="b-scores__input" /></li>`;
        }
        html += "</ol>";

        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = html;
        }
    }
}

function PolygonsIntersect(poly1: Point[], poly2: Point[]): boolean {
    for (let i = 0; i < poly1.length; i++) {
        const next = (i + 1) % poly1.length;
        if (PolyLineIntersect(poly2, poly1[i], poly1[next])) {
            return true;
        }
    }
    return false;
}

function PolyLineIntersect(poly: Point[], p1: Point, p2: Point): boolean {
    for (let i = 0; i < poly.length; i++) {
        const next = (i + 1) % poly.length;
        if (CheckIntersection(p1, p2, poly[i], poly[next])) {
            return true;
        }
    }
    return false;
}









export default function Game_A() {
    const gameRef = useRef<GameEngine | null>(null);

    /**
     * Cross-browser wrapper for function "requestAnimationFrame"
     */
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            (window as any).webkitRequestAnimationFrame ||
            (window as any).mozRequestAnimationFrame ||
            function (callback: FrameRequestCallback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    useEffect(() => {
        // Making new game object
        gameRef.current = new GameEngine("#g-game", "#g-score");
        gameRef.current.color = "";
        if (typeof (Storage) !== "undefined") {
            gameRef.current.color = localStorage["game.color"] || "#0F0";
            let c = 0;
            switch (gameRef.current.color) {
                case "#F00":
                    c = 1;
                    break;
                case "#06F":
                    c = 2;
                    break;
                default:
                    c = 0;
            }
            ChangeGameColor(c);
        }

        // Adding ship
        const ship = new Ship(gameRef.current, {
            points: [
                { x: 0, y: 0 },
                { x: 10, y: 10 },
                { x: 0, y: -20 },
                { x: -10, y: 10 }
            ],
            color: gameRef.current.color,
            name: "ship",
            size: { x: 30, y: 45 },
            base: { x: 15, y: 25 }
        });

        gameRef.current.objects.push(ship);

        // Making procedural asteroids
        for (let i = 0; i < 4; i++) {
            const rock = new Asteroid(gameRef.current, 80);
            rock.Start();
            gameRef.current.objects.push(rock);
        }

        // Run game
        gameRef.current.Run();

        // Cleanup function
        return () => {
            // Add any necessary cleanup here
            console.log('game finished')
        };
    }, []);


    function ChangeGameColor(color: number): void {
        if (!gameRef.current) return;
        let c = "#0F0";
        const page = document.querySelector("body");
        switch (color) {
            case 1:
                c = "#F00";
                if (page) page.className = "m-red";
                break;
            case 2:
                c = "#06F";
                if (page) page.className = "m-blue";
                break;
            default:
                c = "#0F0";
                if (page) page.className = "m-green";
        }
        for (let i = 0; i < gameRef.current.objects.length; i++) {
            gameRef.current.objects[i].color = c;
        }
        gameRef.current.color = c;
        localStorage["game.color"] = c;
    }

    function SaveScore(score: number, node: HTMLElement): void {
        if (!gameRef.current) return;
        if (score > 0 && typeof (Storage) !== "undefined") {
            let k = 0;
            for (let i = 0; i < localStorage.length; i++) {
                if (localStorage[`board.${i}.name`] !== undefined) {
                    k = i + 1;
                }
            }
            localStorage[`board.${k}.name`] = gameRef.current.name;
            localStorage[`board.${k}.score`] = score.toString();
            node.innerHTML = "Done!";
        }
    }

    function SaveName(node: HTMLInputElement): void {
        if (!gameRef.current) return;
        gameRef.current.name = node.value;
    }


    return (
        <GameContext.Provider value={gameRef.current}>
            <div className="b-panel">
                Score:
                <span id="g-score">0</span>
                <div className="b-panel_right">
                    Change color:
                    <label><input onClick={() => { ChangeGameColor(1) }} type="radio" name="color" />Red</label>
                    <label><input onClick={() => { ChangeGameColor(0) }} type="radio" checked={true} name="color" />Green</label>
                    <label><input onClick={() => { ChangeGameColor(2) }} type="radio" name="color" />Blue</label>
                </div>
            </div>
            <canvas id="g-game"></canvas>
            <div id="g-endgame" className="b-msgbox">
                <div id="g-leaderboard"></div>
                <button className="b-button" onClick={(e) => { gameRef.current && SaveScore(gameRef.current.score, e.currentTarget as HTMLElement) }}>Save score</button>
                <button className="b-button" onClick={() => { (function () { window.location.href = window.location.pathname })() }}>New game</button>
            </div>
        </GameContext.Provider>
    )




}





