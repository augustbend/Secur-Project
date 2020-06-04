(function($) {
  "use strict"; // Start of use strict

  var userIP = null;    // Variable to get user ip

  function getUserIP() {
    return $.getJSON('https://api.ipify.org?format=json').then(function(data){
      return data.ip;
    });
  }
  
  var userIP = getUserIP().then(function(returndata){
    userIP = returndata;
  });

  // Validate form
  $("#frm_quote").validate({
    rules: {
      trleVemail: {
        required: true,
        email: true
      },
      trleVphone: {
        required: true,
        number: true,
        minlength: 8,
        maxlength: 9
      },
      trleRuc: {
        required: true,
        number: true,
        minlength: 8,
        maxlength: 11
      },
      trleNumtr: {
        required: true,
        number: true
      },
      trleNumHonor: {
        required: true,
        number: true
      }
    },
    messages: {
      trleVemail: {
        required: "Ingrese su correo electrónico",
        email: "Ingrese un correo electónico válido"
      },
      trleVphone: {
        required: "Ingrese su número de teléfono",
        number: "Ingrese un número de teléfono válido",
        minlength: "Su número debe tener mínimo 8 dígitos",
        maxlength: "Su número debe tener máximo 9 dígitos"
      },
      trleRuc: {
        required: "Ingrese el RUC de su empresa",
        number: "Ingrese un RUC válido",
        minlength: "Su número debe tener mínimo 8 dígitos",
        maxlength: "Su número debe tener máximo 11 dígitos"
      },
      trleNumtr: {
        required: "Ingrese el número de trabajadores en planilla",
        number: "Ingrese sólo número",
      },
      trleNumHonor: {
        required: "Ingrese el número de trabajadores en recibo por honorarios",
        number: "Ingrese sólo número",
      },
    },
    errorElement: 'span',
    errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.form-group').append(error);
    },
    highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid');
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass('is-invalid');
    },
    submitHandler: function(form) {
      console.log(userIP);
      var txt_planilla = $("#trleNumtr").val();
      var txt_honorarios = $("#trleNumHonor").val();
      var totalCount = (+txt_planilla) + (+txt_honorarios);

      $.ajax({
        url: "http://qa-ec2-1315226441.us-east-1.elb.amazonaws.com:8096/api/v1/plan/tTransactionLeads", 
        type: "POST",             
        data: $(form).serialize(),
        success: function(data) {
          console.log("done")
        },
        error: function (xhr, ajaxOptions, thrownError) {
          //alert(xhr.status);
          //alert(xhr.responseText);
          //alert(thrownError);
        },
    });
    return false;
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
