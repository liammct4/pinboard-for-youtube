export function useLocalVideoControls() {
	let video = document.querySelector("video");

	if (video == null) {
		return {
			setCurrentTime: () => { },
			play: () => { },
			pause: () => { }
		};
	}

	const setCurrentTime = (seconds: number) => video.currentTime = seconds;
	const play = () => video.play();
	const pause = () => video.pause();

	return { setCurrentTime, play, pause }
}
