document.getElementById('testClick').addEventListener('click', () => {
    alert('Test test test');
})
$('#testClick').on('click', (e) => {
    alert('1234');
})