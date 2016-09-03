/*
A jQuery plugin for a three-sided selector

By Omid Alemi

Created: September 2, 2016
*/

(function ( $ ) {
    var controlWidth = 80;
    var thumSize = 12;
    var container;
    var h = controlWidth * (Math.sqrt(3)/2);
    var contInput = true; 

    var defaults = {
        input : function() {},        
    };

    var methods = {        
        value : function() {              
            t = this.children(".thumb");
            posX = parseInt(t.css('left').substr(0,t.css('left').length-2));
            posX = Math.max(0,-10 + posX);
            posX = Math.min(controlWidth-thumSize/2, posX);
            posY = Math.max(0,-10 + t.position().top - this.position().top);
            console.log("h:"+h);
            _top = (h - posY)/h;
            _left = ((controlWidth-thumSize/2) - posX)/(controlWidth-thumSize/2);
            _right = 1 - _left;  
            console.log(posX + " , " + posY);
            return {
                top: _top,
                left: _left,
                right: _right
            };
          }        
    };

    $.fn.triSelect = function( methodOrOptions ) {         
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.tooltip' );
        }    

        var settings = $.extend( {}, defaults, methodOrOptions );
        var container = this;

        this.addClass("triP");

        // Drawings
        var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        this.append(svg);
       
        var triangle = document.createElementNS("http://www.w3.org/2000/svg","polyline");
        triangle.setAttributeNS(null,"points",(thumSize/2+2)+","+h+" "+(controlWidth/2+2)+","+(thumSize/2+2)+" "+(controlWidth+2)+","+h+" "+(thumSize/2+2)+","+h);
        triangle.setAttributeNS(null,"style","fill:#fafafa;stroke:#ababab;stroke-width:1");
        this.children("svg").append(triangle);
        
        var c1 = document.createElementNS("http://www.w3.org/2000/svg","circle");
        c1.setAttributeNS(null,"cx",thumSize/2+2);
        c1.setAttributeNS(null,"cy",h);
        c1.setAttributeNS(null,"r",thumSize/2);
        c1.setAttributeNS(null,"style","stroke:#ababab;stroke-width:1;fill:white");
        this.children("svg").append(c1);

        var c2 = document.createElementNS("http://www.w3.org/2000/svg","circle");
        c2.setAttributeNS(null,"cx",controlWidth/2+2);
        c2.setAttributeNS(null,"cy",thumSize/2+1);
        c2.setAttributeNS(null,"r",thumSize/2);
        c2.setAttributeNS(null,"style","stroke:#ababab;stroke-width:1;fill:white");
        this.children("svg").append(c2);

        var c3 = document.createElementNS("http://www.w3.org/2000/svg","circle");
        c3.setAttributeNS(null,"cx",controlWidth+2);
        c3.setAttributeNS(null,"cy",h);
        c3.setAttributeNS(null,"r",thumSize/2);
        c3.setAttributeNS(null,"style","stroke:#ababab;stroke-width:1;fill:white");
        this.children("svg").append(c3);

        // Create the thumb
        var thumb = document.createElement("div");
        thumb.className = "thumb";
        this.append(thumb);            

        // Dragging 
        ww = thumb.offsetWidth/2;
        hh = thumb.offsetHeight/2;
        center = this.width()/2 - thumb.clientWidth/2 + 2;
        console.log(this.width());
    
        thumb.style.left = (center)+"px";
        thumb.style.top = (-controlWidth+1)+ "px";
        
        this.children(".thumb" ).draggable({
            containment: "parent",
            drag: function(event, ui){                               
                console.log(event);
                console.log("center: "+center);
                relY = event.clientY - container.position().top;
                relY = Math.min(Math.max(10 + thumSize/2,relY),h+10 + thumSize/2 - ww);

                triWidth = relY/(Math.sqrt(3)/2);

                relX = (event.clientX - container.position().left)/2 ;
                
                a = Math.max((center - triWidth/2 + thumSize/2 +4 ),relX);                
                relX = Math.min(a,(center + triWidth/2 - thumSize/2));

                console.log("eventX diff: " + (event.clientX - container.position().left));
                console.log("relX: "+ relX);                                                    
                console.log("triWidth: "+triWidth);
                console.log("a :" + ((controlWidth/2 - triWidth/2)));
                console.log("b: "+ ((controlWidth/2 + triWidth/2)));                
                
                ui.position.left = relX;//Math.min(Math.max(center-triWidth/2,relX),center+triWidth/2) + 2;
                ui.position.top = (-controlWidth+1) + relY - 10 - thumSize/2;//Math.min(Math.max(ww,relY),h+ww)-ww;
                
                if (contInput)
                   container.trigger("input");                    
            },
            stop: function(event,ui) {
                if (!contInput)
                   container.trigger("input"); 
            }
        }); 


        // Click to select
        this.children("svg").on("click", function(event){
            y = event.offsetY;
            triWidth = y/(Math.sqrt(3)/2);            
            if (y < h && event.offsetX > (center - triWidth/2 + 2 - ww) &&
                event.offsetX < (center + triWidth/2 + 2 + ww) ) {                    
                    xx = event.offsetX+1;
                    xx = Math.max(center - triWidth/2 + 2, xx);
                    yy = (-controlWidth+1)+ event.offsetY-ww;
                    container.children(".thumb").css('left',xx);
                    container.children(".thumb").css('top',yy);

                    // settings.click.call("hahaha");
                    container.trigger("input");                    
                }                
        });

        return this;
    };   
}( jQuery ));