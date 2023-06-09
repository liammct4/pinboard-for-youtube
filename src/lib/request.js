export function requestGet(url) {
	var request = new XMLHttpRequest();

	request.open("GET", url, false);
	request.send(null);

	return request.responseText;          
}
