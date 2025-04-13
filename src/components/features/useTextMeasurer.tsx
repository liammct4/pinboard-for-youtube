import { createContext, useContext, useEffect, useRef, useState } from "react";
import { IWrapperProperties } from "./wrapper";
import { Size } from "../../lib/util/objects/types";

export function useTextMeasurer() {
	const { cache, setCache, context } = useContext<ITextMeasureWrapperContext>(TextMeasureWrapperContext);

	const measureText = (text: string, font: string): Size => {
		let cached = cache.find(x => x.font == font && x.text == text);

		if (cached != null) {
			return cached.size;
		}
		
		context.font = font;
		const result = context.measureText(text);

		let measure: MeasureredText = {
			font: font,
			text: text,
			size: {
				width: result.width,
				height: result.emHeightDescent
			}
		}

		setCache([ ...cache, measure ]);

		return measure.size;
	};

	return { measureText };
}

export function TextMeasurerWrapper({ children }: IWrapperProperties) {
	const measurerCanvas = useRef<HTMLCanvasElement>(null!);
	const context = useRef<CanvasRenderingContext2D>(null!);
	const [ cache, setCache ] = useState<MeasureredText[]>([]);

	if (measurerCanvas.current == null) {
		measurerCanvas.current = document.createElement("canvas");
		context.current = measurerCanvas.current.getContext("2d")!;
	}

	return ( 
		<TextMeasureWrapperContext.Provider
			value={{
				cache,
				setCache,
				context: context.current
			}}>
			{children}
		</TextMeasureWrapperContext.Provider>
	);
}

type MeasureredText = {
	text: string;
	font: string;
	size: Size;
}

interface ITextMeasureWrapperContext {
	cache: MeasureredText[];
	setCache: (measure: MeasureredText[]) => void;
	context: CanvasRenderingContext2D;
}

const TextMeasureWrapperContext = createContext<ITextMeasureWrapperContext>({
	cache: [],
	setCache: () => console.error("TextMeasureWrapperContext.setCache: no context provided."),
	context: null!
});
