import { Coordinates, Rect } from "../objects/types";

export function rectIntersects(a: Rect, b: Rect) {
	return (
		(a.position.x + a.size.width) >= b.position.x &&
		a.position.x <= b.position.x + b.size.width &&
		(a.position.y + a.size.height >= b.position.y) &&
		a.position.y <= b.position.y + b.size.height
	);
}

export function distanceTwoPoints(a: Coordinates, b: Coordinates): number {
	return Math.hypot(b.x - a.x, b.y - a.y);
}
