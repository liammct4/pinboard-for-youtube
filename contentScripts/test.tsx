import { useState } from "react";
import * as React from "react"; 
import { getTimestampFromSeconds } from "../src/lib/util/generic/timeUtil.ts"
import { createRoot } from "react-dom/client"
import { CounterTest } from "./CounterTest.tsx";

setTimeout(() => {
	let a: HTMLDivElement = document.querySelector("#top-row #owner") as HTMLDivElement;

	let rootElem = document.createElement("div");

	a.appendChild(rootElem);

	let root = createRoot(rootElem);

	root.render(
		<div>
			<CounterTest defaults={10}/>
		</div>
	);
}, 1000);
