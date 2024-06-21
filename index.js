function selectServer(name, group, port) {
    var menu = document.getElementById("menu");
    menu.style.top = "-100vh";
    document.getElementById("file-section").style.display = "flex";
    listFiles(name);
}
function listFiles(name) {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = ''; // Limpiar el contenido del contenedor fileList

    let url;

    switch (name) {
        case 'Debian':
            url = 'http://localhost:3000/files';
            break;
        case 'Fedora':
            url = 'http://localhost:3001/files';
            break;
        case 'FreeBSD':
            url = 'http://localhost:3002/files';
            break;
        case 'Solaris':
            url = 'http://localhost:3003/files';
            break;
        default:
            console.error('Nombre de servidor no reconocido:', name);
            return;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'fileItem';
                fileItem.innerHTML = `
                    <input type="checkbox" id="${file}" class="btnFile poppins-regular fs-20 typeW">
                    <label class="typeW poppins-bold fs-20" for="${file}">${file}</label>
                `;
                fileList.appendChild(fileItem);
            });
        })
        .catch(error => {
            console.error('Error al obtener archivos:', error);
        });
}

function showOptions() {
    const menu = document.getElementById('menu');
    menu.style.top = "0";
}
document.getElementById('fileInput').addEventListener('change', function() {
    const file = this.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        listFiles();
    });
});

function deleteSelectedFiles() {
    const checkboxes = document.querySelectorAll('.btnFile:checked');
    checkboxes.forEach(checkbox => {
        const filename = checkbox.id;
        fetch(`http://localhost:3000/delete/${filename}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            listFiles();
        });
    });
}
