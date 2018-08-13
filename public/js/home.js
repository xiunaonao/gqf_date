
axios.get('/dating_api/new_user').then(function (res) {
    if (res.data.success) {
        gotoreg.style.display = 'block';
    } else {
        setTimeout(function(){
            location.href = '#list';
        },3000)
        
    }
})


function testAuth() {
    location.href = '#readme';
    //axios.get('/dating_api/new_user').then(function (res) {
    //    if (res.data.success) {
    //        location.href = '#register';
    //    } else {
    //        location.href = '#list';
    //    }
    //})
}