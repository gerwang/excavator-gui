/**
 * Created by Gerwa on 2017/12/13.
 */
nprogress.start();

const query_object = require('query-string').parse(location.search);
$('#search_form_input').val(query_object.q);
$(document).ready(function () {
    document.title = query_object.q + '位于TruckTruckGo';
})

function open_extern(element, event) {
    event.preventDefault();
    electron.shell.openExternal($(element).attr('href'));
}

dll.divide_line(query_object.q, (err, res) => {
    const line_str = res.join(' ');
    const pattern = res.map(str => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")).join('|')
    const re = new RegExp(pattern, 'gi');
    const max_length = 150, max_before = 15;
    const shrink = str => {
        const index = str.search(re);
        if (index > max_before) {
            str = '... ' + str.substr(index - max_before);
        }
        if (str.length > max_length) {
            str = str.substr(0, max_length) + ' ...';
        }
        return str.replace(re, '<strong>$&</strong>');
    };
    dll.query_line(line_str, (err, res) => {
        const doc_template = doc =>
            `<div class="result__body links_main links_deep"><h2 class="result__title">
                                <a onclick="open_extern(this,event);" class="result__a" href="${doc.url}">${shrink(doc.title)}</a>
                            </h2>
                                <div class="result__snippet">
                                    ${shrink(doc.content)}
                                </div>
                                <div class="result__extras">
                                    <div class="result__extras__url"><a class="result__url" href="${doc.url}" onclick="open_extern(this,event);"><span
                                            class="result__url__domain">${doc.url.replace(/^(https?:\/\/)?(www\.)?/, '')}</span><span
                                            class="result__url__full"></span></a></div>
                                </div>
                            </div>`;
        const wrapper_template = id => `<div id="doc${id}" class="result results_links_deep highlight_d"></div>`;
        const all_cnt = res.length;
        let done_cnt = 0;
        if (all_cnt === 0) {
            nprogress.done();
        } else {
            for (let i = 0; i < res.length; i++) {
                const id = res[i];
                $('#links').append(wrapper_template(id));
                dll.get_doc(id, (err, doc) => {
                    $('#doc' + id).append(doc_template(doc));
                    nprogress.set(++done_cnt / all_cnt);
                    if (done_cnt === all_cnt) {
                        nprogress.done();
                    }
                });
            }
        }
    });
});