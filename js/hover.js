$('img').hover(
    function(){
    	alert("hover called");
        $(this).css('opacity','.5');
        var a = $(this).attr('alt');
        $(this).parent().append('<div class="title">' + a + '</div>');
        // $(this).css('opacity','1');
        // $(this).next().remove('.title');
    }
);
