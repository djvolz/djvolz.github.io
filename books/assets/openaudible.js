// OpenAudible.js web page to display audio book library.

// filter out (hide) books not in filter text. If no filter text, all books are shown.
function filter() {
    const text = $("#filter").val();
    const rex = new RegExp(text, 'i');
    $('.searchable tr').hide();
    $('.searchable tr').filter(function () {
        return rex.test($(this).text());
    }).show();
}

function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, escape);
}

function asString(str, len) {
    if (!str) {
        return "";
    }
    if (len) {
        str = str.substring(0, len);
    }
    return str.replace(/(?:\r\n|\r|\n)/g, ' ').replace('  ', ' ');
}

function fileLink(link, kind) {
    if (!link) {
        return "";
    }
    return "<a href=\"" + kind + "/" + fixedEncodeURIComponent(link) + "\" download>" + kind + "</a> ";
}


function authorLink(book) {
    if (!book || !book.author) {
        return "";
    }
    if (book.author_link) {
        return "<a href=\"" + book.author_link + "\">" + asString(book.author)
            + "</a> ";
    }
    return asString(book.author);
}

function publisherLink(book) {
    return asString(book.publisher);
}

function narratorLink(book) {
    if (!book || !book.narrator_link) {
        return asString(book.narrated_by);
    }
    return "<a href=\"" + book.narrator_link + "\">"
        + asString(book.narrated_by) + "</a> ";
}

function seriesLink(book) {
    if (!book) return "";
    var series_link = book.series_link;
    if (series_link) {
        if (series_link.indexOf("/")===0) {
            series_link = "https://audible.com" + series_link;
        }
        if (series_link.indexOf("http")===0) {
            return "<a href=\"" + series_link + "\">" + asString(book.series_name) + "</a> ";

        }
    }

    return asString(book.series_name);
}


function bookImage(book, addLink) {
    var image = (book && book.image && book.image.length > 0)
        ? ("<img src=\"thumb/" + fixedEncodeURIComponent(book.image).replace(" ", "+")
            + "\" width=\"200\" height=\"200\">")
        : "<img src=\"assets/no-cover.png\" width='200' height='200'>";
    return image;
}

// convert the json book data to a format for the book.
function populateBooks(arr, table) {

    let i;
    const data = [];

    for (i = 0; i < arr.length; i++) {
        const book = arr[i];

        // Thumbnail size 200x200
        const row = {};
        const narrated_by = asString(book.narrated_by);
        const author = asString(book.author);

        var title = asString(book.title);
        title += "<br>" + fileLinks(book);

        const duration = asString(book.duration);

        row['book'] = book;
        row['title'] = title;
        row['narrated_by'] = narratorLink(book);
        row['author'] = authorLink(book);	// author;
        row['duration'] = duration;
        row['publisher'] = publisherLink(book);	// publisher link

        row['purchase_date'] = asString(book.purchase_date);
        row['release_date'] = asString(book.release_date);
        row['rating'] = Number(book.rating_average).toFixed(2);
        row['summary'] = asString(book.summary, 500);
        row['description'] = asString(book.description, 800);
        // row['mp3'] = mp3Link(book, book.mp3);
        row['image'] = bookImage(book, true);

        let info = "<strong>" + title + "</strong><br>";
        if (author.length > 0) {
            info += "by <i>" + authorLink(book) + "</i><br>";
        }
        if (narrated_by.length > 0) {
            info += "Narrated by " + narratorLink(book) + "<br>";
        }
        var series = seriesLink(book);
        if (series) {
            info += "Series: " + series + "<br>";
        }
        info += duration;
        row['info'] = info;

        data.push(row);
    }

    // create bootstrapTable and populate table with data.
    if (table && arr.length) {
        $(table).bootstrapTable({data: data})
            .on('click-row.bs.table', function (e, row, elem) {
                showBook(row.book);     // row click handler.
            });
    }

    return data;
}

// display a single book in a modal dialog.
function showBook(book) {
    $("#detail_title").text(asString(book.title));

    const image = bookImage(book, true);
    $("#detail_image").html(image);

    $('#title').text(asString(book.title));
    $('#narrated_by').html(narratorLink(book));
    $('#author').html(authorLink(book));
    $('#purchase_date').text(asString(book.purchase_date));

    $('#series').html(seriesLink(book));


    let rating = Number(book.rating_average).toFixed(2);
    if (rating > 0) {
        let str = "" + rating;
        if (book.rating_count) {
            str += " (" + book.rating_count + ")";
        }
        $('#rating').text(str);
    } else {
        $('#rating').text("");
    }

    $('#duration').text(asString(book.duration));
    const summary = asString(book.summary, 9999).replace(/(?:\r\n|\r|\n)/g,
        '<p />');
    $('#summary').html(summary);

    let audible = "";
    if (book.link_url) {
        audible = "<a href=\"" + book.link_url + "\">" + book.audible + "</a>";
    }
    $('#audible').html(audible);

    var files = fileLinks(book);
    $("#files").html(files.trim());
    $("#detail_modal").modal('show');
}

function fileLinks(book) {
    var files = "";

    $.each(book.files, function (index, kind) {
        var file = kind + "/" + fixedEncodeURIComponent(book.filename) + "." + kind;
        var img = "<img src=\"assets/" + kind + ".png\" width=\"21\" height=\"11\">";
        var link = "<a href=\"" + file + "\" download>" + img + "</a>";
        files += link;
    });

    return files;

}
