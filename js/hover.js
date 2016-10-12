$('.photo-gallery li img')hover(
    function(){
        $(this).css('opacity','.5');
        var a = $(this).attr('alt');
        $(this).parent().append('<div class="title">' + a + '</div>');
    },
    function(){
        $(this).css('opacity','1');
        $(this).next().remove('.title');
    }
);
