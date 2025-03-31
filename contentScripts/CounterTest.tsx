import { useState } from "react";
import * as React from "react";
import { getTimestampFromSeconds } from "../src/lib/util/generic/timeUtil";
import "./CounterTest.css"

export interface ICounterTestProperties {
	defaults: number;
}

export function CounterTest({ defaults }: ICounterTestProperties): React.ReactNode {
	const [ counter, setCounter ] = useState<number>(defaults);

	return (
		<div className="counter-random-a">
			<h2>Counter: </h2>
			<p>{counter}</p>
			<p>Time: {getTimestampFromSeconds(counter)}</p>
			<button onClick={() => setCounter(counter + 1)}>Inc</button>
			<button onClick={() => setCounter(counter - 1)}>Dec</button>
		</div>
	);
}
