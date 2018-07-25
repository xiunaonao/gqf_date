
axios.get('/dating_api/new_user').then(function (res) {
    if (res.data.success) {
        gotoreg.style.display = 'block';
    } else {
        location.href = '#list';
    }
})


function testAuth() {
    location.href = '#register';
    //axios.get('/dating_api/new_user').then(function (res) {
    //    if (res.data.success) {
    //        location.href = '#register';
    //    } else {
    //        location.href = '#list';
    //    }
    //})
}