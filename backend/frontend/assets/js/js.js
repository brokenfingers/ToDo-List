const url = 'http://localhost:5001/'
const progressBar = document.querySelector('.progress-bar')

const getData = (id = '') => {

    fetch(url + id)
        .then(response => response.json())
        .then(data => {
            let html = ''

            if (data.status == 'success' && data.mode != 'edit') {
                html = '<ul class="list-group">'
                let progress = {
                    total: 0,
                    done: 0
                }
                data.data.forEach(element => {
                    progress.total++
                    if (element.done) {
                        progress.done++
                    }
                    let done = element.done ? 'done' : ''
                    html += `<li data-id="${element.id}" class="list-group-item">
                        <div class="task-title">
                            <input type="checkbox" class="mass-delete"/>
                            <a class="mark-done link-primary ${done}">${element.task}</a>
                        </div>
                        <div class="task-options">
                            <a class="btn btn-outline-secondary delete-todo">Trinti</a>
                            <a class="btn btn-outline-secondary edit-todo">Redaguoti</a>
                        </div>
                    </li>`;
                })
                html += '</ul>'
                progressBar.style.width = Math.round(progress.done / progress.total * 100) + '%'
                progressBar.textContent = `${progress.done} / ${progress.total}`
                document.querySelector('#todos').innerHTML = html

                document.querySelectorAll('.mark-done').forEach(element => {
                    element.addEventListener('click', (e) => {
                        let id = e.target.parentElement.parentElement.getAttribute('data-id')
                        console.log(id)
                        doFetch(url + 'mark-done/' + id, 'PUT', getData)
                    })
                })

                document.querySelectorAll('.edit-todo').forEach(element => {
                    element.addEventListener('click', (e) => {
                        let id = e.target.parentElement.parentElement.getAttribute("data-id")
                        getData(id)
                    })
                })


                document.querySelectorAll('.delete-todo').forEach(element => {
                    element.addEventListener('click', (e) => {
                        let id = e.target.parentElement.parentElement.getAttribute("data-id")

                        doFetch(url + 'delete-task/' + id, 'DELETE', getData)

                    })
                })

            } else if (data.status == 'success' && data.mode == 'edit') {
                document.querySelector('#todos').innerHTML = ''
                let editBtn = document.querySelector('#add-new-todo')
                editBtn.textContent = 'Redaguoti'
                editBtn.setAttribute('data-id', id)
                let todoElement = document.querySelector("#new-todo")
                todoElement.value = data.data[0].task
                console.log(data)

            } else {
                let messages = document.querySelector('.messages')
                messages.style.display = 'flex'
                messages.innerHTML = data.message
            }
        })
}

function doFetch(link, method, fnct) {
    fetch(link, { method })
        .then(response => response.json())
        .then(data => fnct())
}

getData()

document.querySelector('#mass-delete').addEventListener('click', () => {
    let ids = []
    document.querySelectorAll('.mass-delete:checked').forEach(element => {
        ids.push(element.parentElement.parentElement.getAttribute('data-id'))
    })
    fetch(url + 'mass-delete', {
        method: 'DELETE', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
    })
        .then(response => response.json())
        .then(data => {
            getData()
        })
        .catch(error => {
            console.error('Error:', error);
        });
})


document.querySelector('#add-new-todo').addEventListener('click', (e) => {
    let newTask = document.querySelector('#new-todo').value
    let messages = document.querySelector('.messages')
    if (newTask == '') {
        messages.style.display = 'flex'
        messages.innerHTML = 'Ivesties langelis tuscias'
        return
    }
    messages.style.display = 'none'
    if (e.target.textContent == 'Prideti') {
        let dataURL = new URL(url + 'add-task')
        dataURL.searchParams.append('task', newTask);
        doFetch(dataURL, 'POST', getData)
        return
    }
    if (e.target.textContent == 'Redaguoti') {
        let dataURL = new URL(url + 'edit-todo/' + e.target.getAttribute('data-id'));
        dataURL.searchParams.append('id', e.target.getAttribute('data-id'));
        dataURL.searchParams.append('value', newTask)
        fetch(dataURL, { method: 'PUT' })
            .then(response => response.json())
            .then(data => {
                messages.style.display = 'flex'
                messages.innerHTML = 'Irasas sekmingai atnaujintas'
                document.querySelector('#add-new-todo').textContent = 'Prideti';
                getData()
            })
    }


})

