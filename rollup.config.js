import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import replace from "@rollup/plugin-replace"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import webpack from "webpack"

export default {
	input: "contentScripts/test.tsx",
	output: {
		dir: "dist",
		format: "iife"
	},
	plugins: [
		typescript(),
		babel({
			extensions: [".ts", ".tsx", ".js", ".jsx"],
			presets: [ "@babel/preset-react", "@babel/preset-typescript" ]
		}),
		commonjs(),
		nodeResolve(),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			}
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify('production')
		})
	]
}
