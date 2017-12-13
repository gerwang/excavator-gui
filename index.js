/**
 * Created by Gerwa on 2017/12/12.
 */
if (shared.loaded === null) {
    $(() => {
        shared.loaded = false;
        nprogress.start();
        dll.load((err, res) => {
            nprogress.done();
            if (err) {
                alert(err.message);
            } else {
                shared.loaded = true;
            }
        });
    });
}

$('#search_form_homepage').submit(function (event) {
    if (!shared.loaded || !$("#search_form_input_homepage").val()) {
        event.preventDefault();
    }
});

$('a').click(function (event) {
    event.preventDefault();
    electron.shell.openExternal($(this).attr('href'));
});
