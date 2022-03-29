const url = 'http://localhost:5001/'
const progressBar = document.querySelector('.progress-bar')
const inputBar = document.querySelector('#new-todo');
const messageArea = document.querySelector('.messages')

const messageDisplay = (status, message) => {
    let className = 'alert-danger'
    if (status == 'success') {
        className = 'alert-success'
    }
    messageArea.classList.remove('alert-success', 'alert-danger')
    messageArea.classList.add(className)
    messageArea.style.display = 'flex'
    messageArea.innerHTML = message
    setTimeout(() => {
        messageArea.style.display = 'none'
    }, 5000)
}


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
        .then(data => {
            messageDisplay(data.status, data.message)
            fnct()
        })
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
            messageDisplay(data.status, data.message)
            getData()
        })
})


document.querySelector('#add-new-todo').addEventListener('click', (e) => {


    if (inputBar.value == '') {
        messageDisplay(data.status, data.message)
        return
    }

    if (e.target.textContent == 'Prideti') {
        let dataURL = new URL(url + 'add-task')
        dataURL.searchParams.append('task', inputBar.value);
        inputBar.value = ''
        doFetch(dataURL, 'POST', getData)
        return
    }
    if (e.target.textContent == 'Redaguoti') {
        let dataURL = new URL(url + 'edit-todo/' + e.target.getAttribute('data-id'));
        dataURL.searchParams.append('id', e.target.getAttribute('data-id'));
        dataURL.searchParams.append('value', inputBar.value)
        inputBar.value = ''
        fetch(dataURL, { method: 'PUT' })
            .then(response => response.json())
            .then(data => {
                messageDisplay(data.status, data.message)
                document.querySelector('#add-new-todo').textContent = 'Prideti';
                getData()
            })
    }


})


