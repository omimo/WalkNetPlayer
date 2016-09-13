/*
A jQuery plugin for a three-sided selector

By Omid Alemi

Created: September 2, 2016
*/

(function ( $ ) {
    var controlWidth = 100;
    var thumSize = 12;
    var container;
    // var h = controlWidth * (Math.sqrt(3)/2);
    var sideWidth = controlWidth - thumSize;
    var triHeight = sideWidth*(Math.sqrt(3)/2);
    var contInput = true; 
    var sqrt3 = Math.sqrt(3);

    var defaults = {
        input : function() {},        
    };

    var methods = {
        value : function() {
            // it has to be the distance from the thumb to each of the corners            
            t = this.children(".thumb");        

            posX = parseInt(t.css('left').substr(0,t.css('left').length-2));
            posX = Math.max(0, + posX);
            posX = Math.min(sideWidth-thumSize/2, posX);
            posXL = sideWidth-posX - thumSize/2;
            
            // relY = t.position().top - container.position().top;
                
            posY = Math.abs(-thumSize/2 + sideWidth + parseInt(t.css('top').substr(0,t.css('top').length-2)));
            posY = Math.max(0,posY);        
            posY = Math.min(triHeight,posY);
  
            // console.log('>> X '+ posX);
            // console.log('>> XL '+ posXL);
            

            topDist = (-thumSize*2 + sideWidth -1) - posY;
            rightDist = Math.round(Math.sqrt(Math.max(0,Math.pow(posX,2) - Math.pow(topDist,2))));
            leftDist = Math.round(Math.sqrt(Math.max(0,Math.pow(posXL,2) - Math.pow(topDist,2))));

            // console.log('triHeight: '+sideWidth);
            // console.log('topDist: '+topDist);
            // console.log('leftDist: '+leftDist);
            // console.log('rightDist: '+rightDist);

            _top = topDist/(-thumSize*2 + sideWidth -1);            
            _left = leftDist/(sideWidth-thumSize/2);
            _right = rightDist/(sideWidth-thumSize/2);
                    
            return {
                top: Math.min(Math.max(_top,0),1),
                left: Math.min(Math.max(_left,0),1),
                right: _right//Math.min(Math.max(_right,0),1)
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

        container.addClass("triP");
        container.width(sideWidth+thumSize/2+2);
        container.height(triHeight+thumSize/2+1);

        // Drawings
        var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.margin = "0";
        container.append(svg);
       
        var triangle = document.createElementNS("http://www.w3.org/2000/svg","polyline");
        triangle.setAttributeNS(null,"points",(thumSize/2+1)+","+triHeight+" "+(sideWidth/2+1)+","+(thumSize/2+1)+" "+(sideWidth+1)+","+triHeight+" "+(thumSize/2+1)+","+triHeight);
        triangle.setAttributeNS(null,"style","fill:#fafafa;stroke:#ababab;stroke-width:1");
        this.children("svg").append(triangle);
        
        var c1 = document.createElementNS("http://www.w3.org/2000/svg","circle");
        c1.setAttributeNS(null,"cx",thumSize/2+1);
        c1.setAttributeNS(null,"cy",triHeight);
        c1.setAttributeNS(null,"r",thumSize/2);
        c1.setAttributeNS(null,"style","stroke:#ababab;stroke-width:1;fill:white");
        this.children("svg").append(c1);

        var c2 = document.createElementNS("http://www.w3.org/2000/svg","circle");
        c2.setAttributeNS(null,"cx",sideWidth/2+1);
        c2.setAttributeNS(null,"cy",thumSize/2+1);
        c2.setAttributeNS(null,"r",thumSize/2);
        c2.setAttributeNS(null,"style","stroke:#ababab;stroke-width:1;fill:white");
        this.children("svg").append(c2);

        var c3 = document.createElementNS("http://www.w3.org/2000/svg","circle");
        c3.setAttributeNS(null,"cx",sideWidth+1);
        c3.setAttributeNS(null,"cy",triHeight);
        c3.setAttributeNS(null,"r",thumSize/2);
        c3.setAttributeNS(null,"style","stroke:#ababab;stroke-width:1;fill:white");
        this.children("svg").append(c3);

        // Create the thumb
        var thumb = document.createElement("div");
        thumb.className = "thumb";
        this.append(thumb);            

        // Dragging 
        center = sideWidth/2 ;        
    
        thumb.style.left = (center-thumSize/2+1)+"px";
        thumb.style.top = (-triHeight-thumSize/2)+ "px";
        
        this.children(".thumb" ).draggable({
            containment: "parent",
            drag: function(event, ui){            
                var $this = $(this);
                $this.addClass('selected');   
            },
            stop: function(event,ui) {
                var $this = $(this);
                
                $this.removeClass('selected');

                posX = parseInt($this.css('left').substr(0,$this.css('left').length-2));
                relY = $this.position().top - container.position().top;                
                triWidth = relY/(Math.sqrt(3)/2); 
                if (posX < (center - triWidth/2 - thumSize/2  +1 )) { 
                        $this.css('left', center - triWidth/2 - thumSize/2+1);                                           
                } else if (posX > (center + triWidth/2 - 3 ) ) { 
                        $this.css('left', center + triWidth/2 - thumSize/2+5);                      
                }

                posY = -parseInt($this.css('top').substr(0,$this.css('top').length-2));
                if (posY > sideWidth-thumSize/2) 
                    $this.css('top',-sideWidth+thumSize/2);
                else if (posY <= thumSize)
                     $this.css('top',-thumSize-1);

                // if (!contInput)
                   container.trigger("input"); 
            }
        }); 

        // Click to select
        this.children("svg").on("click", function(event){
            y = event.offsetY;
            triWidth = y/(Math.sqrt(3)/2);            
            if (y < triHeight && event.offsetX > (center - triWidth/2 + 4 ) &&
                event.offsetX < (center + triWidth/2 + 4 ) ) {                    
                    xx = event.offsetX-thumSize/2+1;                    
                    yy = (-sideWidth+1)+ event.offsetY;
                    container.children(".thumb").css('left',xx);
                    container.children(".thumb").css('top',yy);
                    
                    container.trigger("input");                    
                }                
        });
        return this;
    };   
}( jQuery ));