import { Coordinates, Rect } from "../objects/types";

export function isInside(box: Rect, point: Coordinates) {
	return (point.x >= box.position.x && point.x <= box.position.x + box.size.width) &&
		(point.y >= box.position.y && point.y <= box.position.y + box.size.height);
}

// Temporary...
export function rectIntersects(a: Rect, b: Rect) {
	let bTopRight: Coordinates = {
		x: b.position.x + b.size.width,
		y: b.position.y
	};

	let bBottomLeft: Coordinates = {
		x: b.position.x,
		y: b.position.y + b.size.height
	};

	let bBottomRight: Coordinates = {
		x: b.position.x + b.size.width,
		y: b.position.y + b.size.height
	};

	let aTopRight: Coordinates = {
		x: a.position.x + a.size.width,
		y: a.position.y
	};

	let aBottomLeft: Coordinates = {
		x: a.position.x,
		y: a.position.y + a.size.height
	};

	let aBottomRight: Coordinates = {
		x: a.position.x + a.size.width,
		y: a.position.y + a.size.height
	};

	return (
		isInside(a, b.position) ||
		isInside(a, bTopRight) ||
		isInside(a, bBottomRight) ||
		isInside(a, bBottomLeft) ||
		isInside(b, a.position) ||
		isInside(b, aTopRight) ||
		isInside(b, aBottomRight) ||
		isInside(b, aBottomLeft)
	);
}
