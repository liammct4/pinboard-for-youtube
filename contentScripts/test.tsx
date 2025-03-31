import { useState } from "react";
import * as React from "react"; 
import { getTimestampFromSeconds } from "../src/lib/util/generic/timeUtil.ts"
import { createRoot } from "react-dom/client"

function CounterTest() {
	const [ counter, setCounter ] = useState<number>(1);

	return (
		<div>
			<h2>Counter: </h2>
			<p>{counter}</p>
			<p>Time: {getTimestampFromSeconds(counter)}</p>
			<button onClick={() => setCounter(counter + 1)}>Inc</button>
			<button onClick={() => setCounter(counter - 1)}>Dec</button>
		</div>
	);
}

setTimeout(() => {
	let a: HTMLDivElement = document.querySelector("#top-row #owner") as HTMLDivElement;

	let rootElem = document.createElement("div");

	a.appendChild(rootElem);

	let root = createRoot(rootElem);

	root.render(
		<div>
			<CounterTest/>
		</div>
	);
}, 1000);
