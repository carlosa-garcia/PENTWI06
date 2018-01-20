var application =  (function() {
    return {
        refresh: function() {
            var pending = 0
            var done = 0
            var disableAllButton = function(bool) {
                $('#clearAll').prop('disabled', bool);
            };
            var disableCompletedButton = function(bool) {
                $('#clearComplete').prop('disabled', bool);
            };
            var updateProgressBar = function(valueMax, valueNow, width, html) {
                $('.progress-bar').attr('aria-valuemax', valueMax)
                .attr('aria-valuenow', valueNow)
                .css('width',  width)
                .html(html);
            };
            pending = $('.list-group-item').not('.list-group-item-success').length;
            done = $('.list-group-item-success').length;

            if (pending === 0 && done === 0) {
                $('.progress').hide();
                $('#banner').html('Awesome task app.')
                disableCompletedButton(true);
                disableAllButton(true);
                updateProgressBar(0, 0, '0%', '0%');
            } else {
                disableAllButton(false);
                progress = (done / (pending + done)) * 100;
                $('#banner').html("Progress...");
                $('.progress').show();
                updateProgressBar(pending + done, done, progress + '%', Math.round(progress * 10) / 10 + '%');
            };
            if (done === 0) {
                disableCompletedButton(true)
            } else {
                disableCompletedButton(false)
            };
        }
    }
})
();

function initializeApp() {
    // Prepare Application for first use
    $('#myInput').focus();
    $('#clearComplete').prop('disabled', true);
    $('#clearAll').prop('disabled', true);
    $('#myInput').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        var $scope = angular.element('#myInput').scope();
        if (keycode == '13') {
            $scope.addTask();
            $scope.$apply();
        }
    });
};
