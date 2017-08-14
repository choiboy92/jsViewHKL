
function make_bigcircle ( Hmax_data, Vmax_data )  {
    var canvas = document.getElementById('hklzone');
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(10, 10, 10, 1)';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.Hsep = 300/Hmax_data;
    this.Vsep = 300/Vmax_data;
    ctx.beginPath();
    ctx.arc(350,325,310,0, Math.PI*2, 1);
    ctx.stroke();
    ctx.closePath();
}

function Hdraw_arrow ( col_labels )  {
    var canvas = document.getElementById('hklzone');
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;
    var linestart_x = 0;
    var linestart_y = 325;
    var lineend_x = 675;
    var lineend_y = linestart_y;

    ctx.beginPath();
    ctx.font = '25px arial';
    ctx.fillStyle   = 'rgba(250, 0, 0, 0.75)';
    ctx.fillText(col_labels, 670, 308);
    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(250, 0, 0, 0.75)';
    ctx.moveTo(linestart_x, linestart_y);
    ctx.lineTo(lineend_x,lineend_y);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle   = 'rgba(250, 0, 0, 0.75)';
    ctx.moveTo(lineend_x,lineend_y-10);
    ctx.lineTo(lineend_x,lineend_y+10);
    ctx.lineTo(lineend_x + 15,lineend_y);
    ctx.fill();
    ctx.closePath();

  }


  function Vdraw_arrow (col_labels) {
      var canvas = document.getElementById('hklzone');
      var ctx = canvas.getContext('2d');
      ctx.lineWidth = 4;

      var linestart_x = 350;
      var linestart_y = 650;
      var lineend_y = 15;
      var lineend_x = linestart_x;

      ctx.beginPath();
      ctx.fillStyle   = 'rgba(250, 0, 0, 0.75)';
      ctx.font = '25px arial';
      ctx.fillText(col_labels, 360, 20);
      ctx.closePath();

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(250, 0, 0, 0.75)';
      ctx.moveTo(linestart_x, linestart_y);
      ctx.lineTo(lineend_x,lineend_y);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle   = 'rgba(250, 0, 0, 0.75)';
      ctx.moveTo(lineend_x-10,lineend_y);
      ctx.lineTo(lineend_x+10,lineend_y);
      ctx.lineTo(lineend_x,lineend_y-15);
      ctx.fill();
      ctx.closePath();

  }


function erf(x){
    // erf(x) = 2/sqrt(pi) * integrate(from=0, to=x, e^-(t^2) ) dt
    // with using Taylor expansion,
    //        = 2/sqrt(pi) * sigma(n=0 to +inf, ((-1)^n * x^(2n+1))/(n! * (2n+1)))
    // calculationg n=0 to 50 bellow (note that inside sigma equals x when n = 0, and 50 may be enough)
    var m = 1.00;
    var s = 1.00;
    var sum = x * 1.0;
    for(var i = 1; i < 50; i++){
        m *= i;
        s *= -1;
        sum += (s * Math.pow(x, 2.0 * i + 1.0)) / (m * (2.0 * i + 1.0));
    }
    return 2 * sum / Math.sqrt(3.14159265358979);
}


  function make_HKdot (h,k,V, maxV) {
      var canvas = document.getElementById('hklzone');
      var ctx = canvas.getContext('2d');
      maxRad = (this.Hsep+this.Vsep)/5.0;
      var x = 350+(h*this.Hsep);
      var y = 325+(k*this.Vsep);

      ithresh   = 1.0;
      vcontrast = 0.5;
      rmin      = 1;
      rmax      = maxRad;

      Vmax = maxV*ithresh;

      val = Math.min(1.0,V/Vmax) - 0.5;
      val = (1.0 + erf(3.0*vcontrast*val)/erf(3.0*vcontrast/2.0))/2.0;

      val = Math.pow ( Math.abs(val),0.66 );

      logv = Math.max ( 0.0,val*Vmax );
      r2 = logv/Vmax;
      r2 = Math.max ( 1.02*rmin,rmax*Math.min(1.0,Math.sqrt(r2)) );
      r1 = rmax*vcontrast - rmax/Vmax*(Vmax-logv);
      r1 = Math.max ( 1.01*rmin,Math.sqrt(r1)  );
      r1 = Math.min ( r1,r2-0.01*rmin     );

      vm = Math.max ( Vmax*vcontrast,logv );
      vm = logv/vm;

      color_range = 230;

      if (vcontrast<=0.01)  c = 0;
                      else  c = Math.round(color_range*(1.0-Math.min(1.0,vm)));
      c = Math.max ( c,0   );
      c = Math.min ( c,255 );
      //alert('c = ' + c);

      //draw spot with radius 'r2' and color (c,c,c)
      ctx.beginPath();
      ctx.lineWidth = 0;
      ctx.arc(x,y,r2,0, Math.PI*2, 1);
      ctx.fillStyle = 'rgba('+c+', '+c+', '+c+', 1)';
      ctx.fill();
      ctx.closePath();
  }


jsViewHKL.prototype.add_options =  function () {
      var cnt = 1;
      for (var z = 1; z < this.ndif; z++) {
          for (var b = 0; b < this.dataset[z].col_labels.length; b++) {
              holder = document.createElement('option');
              holder.setAttribute('value', cnt);
              holder.innerHTML = this.dataset[z].col_labels[b];
              this.V_select.appendChild(holder);
              cnt++;
          }
      }
  }


jsViewHKL.prototype.makeTab4 = function ()  {
    var tab4 = document.getElementById ( "tab4" );
    tab4.innerHTML ='<canvas id="hklzone" width="700" height="650" >'+
    'Use a compatible browser</canvas><br>';
    make_bigcircle();

    //alert('Sep = '+ sep);

    this.V_val = 3;

    //Make buttons
    var HK_button = document.createElement ('button');
    var HL_button = document.createElement ('button');
    var KL_button = document.createElement ('button');
    tab4.appendChild( HK_button );
    tab4.appendChild( HL_button );
    tab4.appendChild( KL_button );
    $( HK_button ).button({
        label: "h k 0"
    });
    $( HL_button ).button({
        label: "h 0 l"
    });
    $( KL_button ).button({
        label: "0 k l"
    });

    //implement selectMenu
    this.V_select  = document.createElement ('select');
    this.add_options();
    tab4.appendChild( this.V_select  );

    function draw_spots ( t )  {
      var maxV = t.max[t.V_val];
      var minV = t.min[t.V_val];
      var bigcircle = make_bigcircle( t.max[0], t.max[1] );
      var ver_arrow = Vdraw_arrow( t.dataset[0].col_labels[1] );
      var hrz_arrow = Hdraw_arrow( t.dataset[0].col_labels[0] );
      for (var i = 0; i<t.nrows; i++) {
          var h = t.get_value ( i,0 );
          var k = t.get_value ( i,1 );
          var l = t.get_value ( i,2 );
          var V = t.get_value ( i,t.V_val );
          if (!isNaN(V))  {
             if (Math.abs(l)<0.000001)  {
                //draw circle at (h,k) with radius ~ math.log10(V)
                make_HKdot (h,k,V,maxV);
                make_HKdot (-h,-k,V,maxV);
                make_HKdot (-h,k,V,maxV);
                make_HKdot (h,-k,V,maxV);
            }
          }
      }
    }


    (function(t){
        $( t.V_select ).selectmenu({
            select: function(event,ui)  {
                t.V_val = 2+ parseInt(ui.item.value);
                var maxV = t.max[t.V_val];
                var minV = t.min[t.V_val];
                var bigcircle = make_bigcircle( t.max[0], t.max[1] );
                var ver_arrow = Vdraw_arrow( t.dataset[0].col_labels[1] );
                var hrz_arrow = Hdraw_arrow( t.dataset[0].col_labels[0] );
                for (var i = 0; i<t.nrows; i++) {
                    var h = t.get_value ( i,0 );
                    var k = t.get_value ( i,1 );
                    var l = t.get_value ( i,2 );
                    var V = t.get_value ( i,t.V_val );
                    if (!isNaN(V))  {
                       if (Math.abs(l)<0.000001)  {
                          //draw circle at (h,k) with radius ~ math.log10(V)
                          make_HKdot (h,k,V,maxV);
                          make_HKdot (-h,-k,V,maxV);
                          make_HKdot (-h,k,V,maxV);
                          make_HKdot (h,-k,V,maxV);
                      }
                    }
                }
            }
        });

    draw_spots ( t );

    $( HK_button ).click( function(event) {
      draw_spots ( t );
    });
    $( HL_button ).click( function(event) {
        var maxV = t.max[t.V_val];
        var minV = t.min[t.V_val];
        var bigcircle = make_bigcircle( t.max[0], t.max[2] );
        var ver_arrow = Vdraw_arrow( t.dataset[0].col_labels[2] );
        var hrz_arrow = Hdraw_arrow( t.dataset[0].col_labels[0] );
        for (var i = 0; i<t.nrows; i++) {
            var h = t.get_value ( i,0 );
            var k = t.get_value ( i,1 );
            var l = t.get_value ( i,2 );
            var V = t.get_value ( i,t.V_val );
            if (!isNaN(V))  {
               if (Math.abs(k)<0.000001)  {
                  //draw circle at (h,k) with radius ~ math.log10(V)
                  make_HKdot (h,l,V,maxV);
                  make_HKdot (-h,-l,V,maxV);
                  make_HKdot (-h,l,V,maxV);
                  make_HKdot (h,-l,V,maxV);
              }
            }
        }
    });
    $( KL_button ).click( function(event) {
        var maxV = t.max[t.V_val];
        var minV = t.min[t.V_val];
        var bigcircle = make_bigcircle( t.max[1], t.max[2] );
        var ver_arrow = Vdraw_arrow( t.dataset[0].col_labels[2] );
        var hrz_arrow = Hdraw_arrow( t.dataset[0].col_labels[1] );
        for (var i = 0; i<t.nrows; i++) {
            var h = t.get_value ( i,0 );
            var k = t.get_value ( i,1 );
            var l = t.get_value ( i,2 );
            var V = t.get_value ( i,t.V_val );
            if (!isNaN(V))  {
               if (Math.abs(h)<0.000001)  {
                  //draw circle at (h,k) with radius ~ math.log10(V)
                  make_HKdot (k,l,V,maxV);
                  make_HKdot (-k,-l,V,maxV);
                  make_HKdot (-k,l,V,maxV);
                  make_HKdot (k,-l,V,maxV);
              }
            }
        }
    });
}(this))

}
