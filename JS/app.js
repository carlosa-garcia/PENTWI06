function updateStatusBar () {
    var pending = $('.list-group-item').not('.list-group-item-success').length;
    var done = $('.list-group-item-success').length;

    if (pending === 0 && done === 0) {
        $('.progress').hide();
        $('#banner').html('Awesome task app.')
        $('#clearAll').prop('disabled', true)
    } else {
        progress = (done / (pending + done)) * 100
        $('#banner').html("Progress...");
        $('.progress').show();
        $('.progress-bar').attr('aria-valuemax', pending + done);
        $('.progress-bar').attr('aria-valuenow', done);
        $('.progress-bar').css('width',  progress + '%');
        $('.progress-bar').html(Math.round(progress * 10) / 10 + '%')
    }
    if (done === 0) {
        $('#clearComplete').prop('disabled', true)
    } else {
        $('#clearComplete').prop('disabled', false)
    }
}
