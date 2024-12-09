import React, { useEffect, useRef } from 'react';
import '../../styles/waitingView.css';

interface Point {
    x: number;
    y: number;
    vx: number;
    vy: number;
    buddy?: Point;
}

export default function PinkDotsAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef<Point[]>([]);

    const velocity2: number = 10; // velocity squared -- OG 5
    const radius: number = 5;
    const boundaryX: number = 400; // OG 200
    const boundaryY: number = 400; // OG 200
    const numberOfPoints: number = 30; // OG 30
    const strokeColor: string = '#f50dfc'; //'#8ab2d8';
    const ballColor: string = '#f827ff'; //'#97badc';

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Initialize points
        pointsRef.current = [];
        for (let i = 0; i < numberOfPoints; i++) {
            createPoint();
        }

        // Create connections
        for (let i = 0; i < pointsRef.current.length; i++) {
            if (i === 0) {
                pointsRef.current[i].buddy = pointsRef.current[pointsRef.current.length - 1];
            } else {
                pointsRef.current[i].buddy = pointsRef.current[i - 1];
            }
        }

        let animationId: number;

        function animate() {
            if (context) {
                context.clearRect(0, 0, boundaryX, boundaryY);
                draw(context);
            }
            animationId = requestAnimationFrame(animate);
        }

        animate();

        // Cleanup function
        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);

    function createPoint(): void {
        let point: Point = {} as Point;
        let vx2: number;
        let vy2: number;

        point.x = Math.random() * boundaryX;
        point.y = Math.random() * boundaryY;

        // random vx 
        point.vx = (Math.floor(Math.random()) * 2 - 1) * Math.random();
        vx2 = Math.pow(point.vx, 2);
        // vy^2 = velocity^2 - vx^2
        vy2 = velocity2 - vx2;
        point.vy = Math.sqrt(vy2) * (Math.random() * 2 - 1);
        pointsRef.current.push(point);
    }

    function resetVelocity(point: Point, axis: 'x' | 'y', dir: number): void {
        let vx2: number;
        let vy2: number;
        if (axis === 'x') {
            point.vx = dir * Math.random();
            vx2 = Math.pow(point.vx, 2);
            // vy^2 = velocity^2 - vx^2
            vy2 = velocity2 - vx2;
            point.vy = Math.sqrt(vy2) * (Math.random() * 2 - 1);
        } else {
            point.vy = dir * Math.random();
            vy2 = Math.pow(point.vy, 2);
            // vy^2 = velocity^2 - vx^2
            vx2 = velocity2 - vy2;
            point.vx = Math.sqrt(vx2) * (Math.random() * 2 - 1);
        }
    }

    function drawCircle(context: CanvasRenderingContext2D, x: number, y: number) {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = ballColor;
        context.fill();
    }

    function drawLine(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.strokeStyle = strokeColor
        context.stroke();
    }

    function draw(context: CanvasRenderingContext2D) {
        for (let i = 0; i < pointsRef.current.length; i++) {
            // circles
            let point = pointsRef.current[i];
            point.x += point.vx;
            point.y += point.vy;
            drawCircle(context, point.x, point.y);
            // lines
            if (point.buddy) {
                drawLine(context, point.x, point.y, point.buddy.x, point.buddy.y);
            }
            // check for edge
            if (point.x < 0 + radius) {
                resetVelocity(point, 'x', 1);
            } else if (point.x > boundaryX - radius) {
                resetVelocity(point, 'x', -1);
            } else if (point.y < 0 + radius) {
                resetVelocity(point, 'y', 1);
            } else if (point.y > boundaryY - radius) {
                resetVelocity(point, 'y', -1);
            }
        }
    }

    return (
        <>
            <div className=''>
                <canvas ref={canvasRef} className='dotAnimation' width={boundaryX} height={boundaryY}></canvas>
            </div>
        </>
    )
}

