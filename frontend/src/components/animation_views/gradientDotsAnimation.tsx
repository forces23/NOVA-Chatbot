import React, { useEffect, useRef } from 'react';

interface Point {
    x: number;
    y: number;
    vx: number;
    vy: number;
    buddy?: Point;
    color: string;
}

export default function GradientDotsAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef<Point[]>([]);

    const velocity2: number = 10;
    const radius: number = 5;
    const boundaryX: number = 400;
    const boundaryY: number = 400;
    const numberOfPoints: number = 30;
    // const strokeColor: string = '#310dff'; //'#8ab2d8';
    // const ballColor: string = '#4221ff'; //'#97badc';
    const colorStops = [
        { position: 0, color: '#f50dfc' },    // Magenta
        { position: 0.33, color: '#0000ff' }, // Blue
        { position: 0.66, color: '#9c02b0' }, 
        { position: 1, color: '#594d99' }     
    ];

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

    function interpolateColor(color1: string, color2: string, factor: number): string {
        const r1 = parseInt(color1.substr(1, 2), 16);
        const g1 = parseInt(color1.substr(3, 2), 16);
        const b1 = parseInt(color1.substr(5, 2), 16);

        const r2 = parseInt(color2.substr(1, 2), 16);
        const g2 = parseInt(color2.substr(3, 2), 16);
        const b2 = parseInt(color2.substr(5, 2), 16);

        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

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
        point.color = getGradientColor(Math.random()); // Use a random position for initial color
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

    function getGradientColor(position: number): string {
        for (let i = 1; i < colorStops.length; i++) {
            if (position <= colorStops[i].position) {
                const leftStop = colorStops[i - 1];
                const rightStop = colorStops[i];
                const factor = (position - leftStop.position) / (rightStop.position - leftStop.position);
                return interpolateColor(leftStop.color, rightStop.color, factor);
            }
        }
        return colorStops[colorStops.length - 1].color;
    }

    function drawCircle(context: CanvasRenderingContext2D, x: number, y: number, color: string) {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();
    }

    function drawLine(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color1: string, color2: string) {
        const gradient = context.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);

        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.strokeStyle = gradient;
        context.stroke();
    }

    function draw(context: CanvasRenderingContext2D) {
        for (let i = 0; i < pointsRef.current.length; i++) {
            let point = pointsRef.current[i];
            point.x += point.vx;
            point.y += point.vy;
            point.color = getGradientColor((point.x + point.y) / (boundaryX + boundaryY));
            drawCircle(context, point.x, point.y, point.color);

            if (point.buddy) {
                drawLine(context, point.x, point.y, point.buddy.x, point.buddy.y, point.color, point.buddy.color);
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
                <canvas ref={canvasRef} className='dotAnimation ' width={boundaryX} height={boundaryY}></canvas>
            </div>
        </>
    )
}

