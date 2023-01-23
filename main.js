var myInput = document.querySelector('#myInput'),
 myDiv = document.querySelector('#myDiv'),
 apiURL = 'https://api.github.com/search/repositories?q=',
 inputs = Rx.Observable.fromEvent(myInput, 'keyup'),
 projectsList = new Rx.BehaviorSubject([]);

 inputs
    .debounce(() => Rx.Observable.interval(500))
    .map(event => event.target.value)
    .filter(text => text.length > 2)
    .subscribe(searchProjects)

    function searchProjects(projectName) {
        Rx.Observable.fromPromise(fetch(`${apiURL}${projectName}`))
            .subscribe(response => {
                response
                    .json()
                    .then(result => result.items)
                    .then(itemsList => { projectsList.next(itemsList) })
            })
    }

projectsList.subscribe(projects => {
    var template = '';
    projects.forEach(project => {
        template += `
            <li class="list-item">
                <img class="avatar" src="${project.owner.avatar_url}">
                <div class="info">
                    <b>${project.owner.login}</b>
                    / ${project.name}
                </div>
                <div class="info">
                    Forks: ${project.forks}
                </div>
            <li>;
        `
    });
    myDiv.innerHTML = `
        <ul class="list">${template}</ul>
    `
})