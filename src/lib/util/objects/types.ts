export type Size = {
	width: number;
	height: number;
}

export type Coordinates = {
	x: number;
	y: number;
}

export type Rect = {
	position: Coordinates;
	size: Size;
}

export type GUID = `${string}-${string}-${string}-${string}-${string}`;
