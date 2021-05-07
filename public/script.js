let socket = null;
const settings = {
    paused: false
}

document.querySelector('#control__start').addEventListener('click', () => {
    socket = io('/');
    socket.on('user-connected', () => {
        document.querySelector('.alert').style.display = "flex";
    });

    socket.on('data-received', (data) => {
        if(!settings.paused) {
            const p = document.createElement('p');
            p.innerHTML = data;
            document.querySelector('.logs').appendChild(p);
            document.querySelector('.logview').scrollTop = document.querySelector('.logview').scrollHeight;
        }
    });
});

document.querySelector('#control__pause').addEventListener('click', () => {
    settings.paused = !settings.paused;
    document.querySelector('#control__pause').innerHTML = settings.paused ? 'Resume' : 'Pause';
    document.querySelector('.paused').style.display = settings.paused ? 'block' : 'none';
});

document.querySelector('#data').addEventListener('click', () => {
    socket.emit('test');
});

document.querySelector('#alert__close').addEventListener('click', () => {
    document.querySelector('.alert').style.display = "none";
});