(function($) {
  "use strict"; // Start of use strict

  // Validate form
  $("#frm_quote").validate({
    rules: {
      txt_email: {
        required: true,
        email: true
      },
      txt_telefono: {
        required: true,
        number: true,
        minlength: 8,
        maxlength: 9
      },
      txt_ruc: {
        required: true,
        number: true,
        minlength: 8,
        maxlength: 11
      },
      txt_planilla: {
        required: true,
        number: true
      },
      txt_honorarios: {
        required: true,
        number: true
      }
    },
    messages: {
      txt_email: {
        required: "Ingrese su correo electrónico",
        email: "Ingrese un correo electónico válido"
      },
      txt_telefono: {
        required: "Ingrese su número de teléfono",
        number: "Ingrese un número de teléfono válido",
        minlength: "Su número debe tener mínimo 8 dígitos",
        maxlength: "Su número debe tener máximo 9 dígitos"
      },
      txt_ruc: {
        required: "Ingrese el RUC de su empresa",
        number: "Ingrese un RUC válido",
        minlength: "Su número debe tener mínimo 8 dígitos",
        maxlength: "Su número debe tener máximo 11 dígitos"
      },
      txt_planilla: {
        required: "Ingrese el número de trabajadores en planilla",
        number: "Ingrese sólo número",
      },
      txt_honorarios: {
        required: "Ingrese el número de trabajadores en recibo por honorarios",
        number: "Ingrese sólo número",
      },
    },
    submitHandler: function(form) {
      $.ajax({
        url: "processo.php", 
        type: "POST",             
        data: new FormData($(form)),
        cache: false,             
        processData: false,      
        success: function(data) {
          console.log("done")
            //$('#loading').hide();
            //$("#message").html(data);
        }
    });
    return false;
    }

  });

  //Logic to send info
  $("#btn_validar").on('click', function() {
    var txt_planilla = $("#txt_planilla").val();
    var txt_honorarios = $("#txt_honorarios").val();
    var totalCount = (+txt_planilla) + (+txt_honorarios);

    if (totalCount >= 20) {
      console.log("mostrar plan 3");
    }
    if (totalCount >= 100) {
      console.log("mostrar plan 1, 2");
    }
  });



  // Closes the sidebar menu
  $(".menu-toggle").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
    $(".menu-toggle > .fa-bars, .menu-toggle > .fa-times").toggleClass("fa-bars fa-times");
    $(this).toggleClass("active");
  });

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('#sidebar-wrapper .js-scroll-trigger').click(function() {
    $("#sidebar-wrapper").removeClass("active");
    $(".menu-toggle").removeClass("active");
    $(".menu-toggle > .fa-bars, .menu-toggle > .fa-times").toggleClass("fa-bars fa-times");
  });

  // Scroll to top button appear
  $(document).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

})(jQuery); // End of use strict

// Disable Google Maps scrolling
// See http://stackoverflow.com/a/25904582/1607849
// Disable scroll zooming and bind back the click event
var onMapMouseleaveHandler = function(event) {
  var that = $(this);
  that.on('click', onMapClickHandler);
  that.off('mouseleave', onMapMouseleaveHandler);
  that.find('iframe').css("pointer-events", "none");
}
var onMapClickHandler = function(event) {
  var that = $(this);
  // Disable the click handler until the user leaves the map area
  that.off('click', onMapClickHandler);
  // Enable scrolling zoom
  that.find('iframe').css("pointer-events", "auto");
  // Handle the mouse leave event
  that.on('mouseleave', onMapMouseleaveHandler);
}
// Enable map zooming with mouse scroll when the user clicks the map
$('.map').on('click', onMapClickHandler);
