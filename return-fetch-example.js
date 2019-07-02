function returnFetch() {
  return fetch(url).then((respo) => respo.json())
}

returnFetch().then((json) => helper);

function helper(json) {

}
