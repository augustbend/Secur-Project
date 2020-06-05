(function($) {
  "use strict"; // Start of use strict
  var queryString = new Array();

  function getBase64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        var encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
  
        if (encoded.length % 4 > 0) {
          encoded += '='.repeat(4 - encoded.length % 4);
        }
  
        resolve(encoded);
      };
  
      reader.onerror = function (error) {
        return reject(error);
      };
    });
  }
  


  function getUserIP() {
    return $.getJSON('https://api.ipify.org?format=json').then(function(data){
      return data.ip;
    });
  }
  

  if (queryString.length == 0) {
    if (window.location.search.split('?').length > 1) {
        var params = window.location.search.split('?')[1].split('&');
        for (var i = 0; i < params.length; i++) {
            var key = params[i].split('=')[0];
            var value = decodeURIComponent(params[i].split('=')[1]);
            queryString[key] = value;
        }
    }
}

if (queryString["id"] != null) {
  $("#trleIident").val(queryString["id"]);
}
if (queryString["ct"] != null) {
  if (+(queryString["ct"]) >= 20) {
    $("#plan3").css("display", "block");
  }
  if (+(queryString["ct"]) >= 100) {
    console.log("mas de 100");
    $("#plan1").css("display", "block");
    $("#plan2").css("display", "block");
  }
  
}

$(".btn-contratar").on("click", function(e) {
  var plan = $(this).data("plan");
  $("#trleVplanSele").val(plan);
})

  //utility function
function getFormData(data) {
  var unindexed_array = data;
  var indexed_array = {};

  $.map(unindexed_array, function(n, i) {
   indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}

  getUserIP().then(function(returndata){
    var userIP = returndata;
    $("#auditVipad").val(userIP);
  });

  // Show names in file input
  $('input[type="file"]').on("change", function() {
    var filenames = [];
    var files = document.getElementById("excelFile").files;
    if (files.length > 1) {
      filenames.push("Total Files (" + files.length + ")");
    } else {
      var i;
      for (i in files) {
        if (files.hasOwnProperty(i)) {
          filenames.push(files[i].name);
        }
      }
    }
    $(this)
      .next(".custom-file-label")
      .html(filenames.join(","));
  });






// Upload excel form
$("#frm_uploadExcel").validate({
  rules: {
    excelFile: {
      required: true
    }
  },
  messages: {
    excelFile: {
      required: "Elija la plantilla"
    }
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
    
    
     getBase64(document.querySelector('input[type="file"]').files[0]).then(function(data) {
      $("#trleVfileBa64").val(data);
      var formData = $(form).serializeArray();

      $.ajax({
        url: "https://uatgateway.zumseguros.com/input/api/v1/plan/loadPlantilla",
        type: "post",
        data: JSON.stringify(getFormData(formData)),
        headers: {
          'codCanal':'200',
        },
        dataType: "json",
        cache: false,
        contentType : "application/json",
        processData: false,
        success: function(data) {
          console.log("done");
          window.location.href = "http://localhost:3000/resultado.html";
        },
      }).done(function(res){
              console.log(res);
      });

    });


  }

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
      trleVnameComer: {
        required: true,
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
      trleVnameComer: {
        required: "Ingrese la razón social de su empresa",
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
      var txt_planilla = $("#trleNumtrPlani").val();
      var txt_honorarios = $("#trleNumtr").val();
      var totalCount = (+txt_planilla) + (+txt_honorarios);
      var data = $(form).serializeArray();

      $.ajax({
        url: "https://uatgateway.zumseguros.com/input/api/v1/plan/tTransactionLeads",
        type: "POST",             
        data: JSON.stringify(getFormData(data)),
        headers: {
          'codCanal':'200',
        },
        dataType: "json",
        contentType : "application/json",
        success: function(data) {
          console.log("done");
          window.location.href = "http://localhost:3000/planes.html?id="+data.payload.id_transaccion+"&ct="+totalCount;
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
