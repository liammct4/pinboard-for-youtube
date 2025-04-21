import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import replace from "@rollup/plugin-replace"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import css from "rollup-plugin-import-css"
import webpack from "webpack"
import json from "@rollup/plugin-json";
import svgr from "vite-plugin-svgr";

export default {
	input: "src/contentScript/main.ts",
	output: {
		format: "iife",
		file: "dist/pfyContentScript.js"
	},
	plugins: [
		typescript(),
		babel({
			extensions: [".ts", ".tsx", ".js", ".jsx"],
			presets: [ "@babel/preset-react", "@babel/preset-typescript" ],
		}),
		svgr(),
		commonjs(),
		nodeResolve(),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			}
		}),
		json(),
		replace({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
		css({
			inject: true
		}),
	]
}
