import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { store } from "./app/store.js"
import { Provider } from "react-redux"
import { getActiveTab } from './lib/browser/page.ts'
import './main.css'

// Link the YouTube page to the chrome messaging system.
chrome.scripting.executeScript({
	target: { tabId: (await getActiveTab()).id },
	files: ["content_script.js"]
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<App/>
		</Provider>
	</React.StrictMode>,
);
