//
// site.js
//
// the arbor.js website
//
(function($){
  // var trace = function(msg){
  //   if (typeof(window)=='undefined' || !window.console) return
  //   var len = arguments.length, args = [];
  //   for (var i=0; i<len; i++) args.push("arguments["+i+"]")
  //   eval("console.log("+args.join(",")+")")
  // }

    var CLR = {
      branch:"#b2b19d",
      coding:"orange",
      experience:"#922E00",
      demo:"#a7af00",
      pub:"#779bdb",
      speaches: "#ffd800",
      skills: "#2d8386"
    };

    var parentNodes = {
      //First Level
      "Diego Rabatone Oliveira":{color:"red", shape:"dot", alpha:1, show:1},

      //Second Level
      Education:{color:CLR.branch, shape:"dot", alpha:1, show:1},
      Experience:{color:CLR.branch, shape:"dot", alpha:1, show:1},
      Speaches:{color:CLR.branch, shape:"dot", alpha:1, show:1},
      Coding:{color:CLR.branch, shape:"dot", alpha:1, show:1},
      Publications:{color:CLR.branch, shape: "dot", alpha:1, show:1},
      Skills:{color:CLR.branch, shape: "dot", alpha:1, show:1},

      //Third level
      online:{color:CLR.pub, shape:"dot", alpha:0, show:0},
      printed:{color:CLR.pub, shape:"dot", alpha:0, show:0},

      polignu:{color:CLR.pub, shape:"dot",alpha:0,show:0}

    };

    var lastLeafNodes = {
          //Education
             Formal:{color:CLR.demo, alpha:0, link:'#education-formal'},
             Complementary:{color:CLR.demo, alpha:0, link:'#education-complementary'},

          //Speaches and Presentations
             "www2013 Conference":{color:CLR.speaches, alpha:0, link:'http://www.w3.org/2013/05/w3c-track.html'},
             "SevenMasters OpenData":{color:CLR.speaches, alpha:0, link:'http://setemasters.imasters.com.br/mestres/diego-rabatone-oliveira/'},
             "II Brazilian National Conference on Open Data":{color:CLR.speaches, alpha:0, link:'http://www.w3.org/Consortium/Offices/blog/2014/04/08/ii-brazilian-national-conference-on-open-data/'},

          // Experience
             //reference:{color:CLR.experience, alpha:0, link:'#reference'},
             "Other Jobs":{color:CLR.experience, alpha:0, link:'#experience-other-jobs'},
             "Other Experiencess":{color:CLR.experience, alpha:0, link:'#experience-other-experiences'},
             "O Estado de S.Paulo":{color:CLR.experience, alpha:0, link:'#experience-estadao'},
             PoliGNU:{color:CLR.experience, alpha:0, link:'#experience-polignu'},

          //Code
             github:{color:CLR.coding, alpha:0, link:'https://github.com/diraol'},

          //Publications
            //Online
             "diraol.polignu.org":{color:CLR.pub, alpha:0, link:"http://diraol.polignu.org"},
              //PoliGNU
              twitterAPI:{color:CLR.pub, alpha:0, link:"http://polignu.org/artigo/twitter-api-elasticsearch-e-kibana-analisando-rede-social"},
            //Printed
             "Revista iMasters - pg59":{color:CLR.pub, alpha:0, link:'http://issuu.com/imasters/docs/revista-imasters7'},
             "Caderno PoliGNU - Software e Cultura Livres - Vol.1":{color:CLR.pub, alpha:0, link:'http://polignu.org/sites/polignu.org/files/administrativo/arquivos/2012021919/caderno_polignu_vol1.pdf'},

          //Skills
            Python:{color:CLR.skills, alpha:0, link:''},
            JavaScript:{color:CLR.skills, alpha:0, link:''},
            nginx:{color:CLR.skills, alpha:0, link:''},
            DataViz:{color:CLR.skills, alpha:0, link:''},
            R:{color:CLR.skills, alpha:0, link:''},
            CartoDB:{color:CLR.skills, alpha:0, link:''},
            Mapping:{color:CLR.skills, alpha:0, link:''},
            Speaking:{color:CLR.skills, alpha:0, link:''},
            Teaching:{color:CLR.skills, alpha:0, link:''},
            "Team Work":{color:CLR.skills, alpha:0, link:''}
    };

  var Renderer = function(elt){
    var dom = $(elt),
        canvas = dom.get(0),
        ctx = canvas.getContext("2d"),
        gfx = arbor.Graphics(canvas),
        sys = null,
        _vignette = null,
        selected = null,
        nearest = null,
        _mouseP = null;


    var that = {
      init:function(pSystem){
        sys = pSystem;
        sys.screen({size:{width:dom.width(), height:dom.height()},
                    padding:[36,60,36,60]});

        $(window).resize(that.resize);
        that.resize();
        that._initMouseHandling();

        //if (document.referrer.match(/echolalia|atlas|halfviz/)){
        //  // if we got here by hitting the back button in one of the demos,
        //  // start with the demos section pre-selected
        //  that.switchSection('demos');
        //}
      },
      resize:function(){
        canvas.width = $(window).width();
        canvas.height = .75* $(window).height();
        sys.screen({size:{width:canvas.width, height:canvas.height}});
        _vignette = null;
        that.redraw()
      },
      redraw:function(){
        gfx.clear();
        sys.eachEdge(function(edge, p1, p2){
          if (edge.source.data.alpha * edge.target.data.alpha == 0) return;
          gfx.line(p1, p2, {stroke:"#b2b19d", width:2, alpha:edge.target.data.alpha});
        });
        sys.eachNode(function(node, pt){
          var w = Math.max(20, gfx.textWidth(node.name) );
          if (node.data.alpha===0) return;
          if (node.data.shape=='dot'){
            gfx.oval(pt.x-w/2, pt.y-w/2, w, w, {fill:node.data.color, alpha:node.data.alpha});
            gfx.text(node.name, pt.x, pt.y+5, {color:"white", align:"center", font:"Montserrat", size:10});
          } else {
            gfx.rect(pt.x-w/2, pt.y-8, w, 20, 4, {fill:node.data.color, alpha:node.data.alpha});
            gfx.text(node.name, pt.x, pt.y+7, {color:"white", align:"center", font:"Montserrat", size:10});
            gfx.text(node.name, pt.x, pt.y+7, {color:"white", align:"center", font:"Montserrat", size:10});
          }
        });
        that._drawVignette();
      },

      _drawVignette:function(){
        var w = canvas.width;
        var h = canvas.height;
        var r = 20;

        if (!_vignette){
          var top = ctx.createLinearGradient(0,0,0,r);
          top.addColorStop(0, "#e0e0e0");
          top.addColorStop(.7, "rgba(255,255,255,0)");

          var bot = ctx.createLinearGradient(0,h-r,0,h);
          bot.addColorStop(0, "rgba(255,255,255,0)");
          bot.addColorStop(1, "white");

          _vignette = {top:top, bot:bot};
        }

        // top
        ctx.fillStyle = _vignette.top;
        ctx.fillRect(0,0, w,r);

        // bot
        ctx.fillStyle = _vignette.bot;
        ctx.fillRect(0,h-r, w,r);
      },

      switchMode:function(e){
        if (e.mode=='hidden'){
          dom.stop(true).fadeTo(e.dt,0, function(){
            if (sys) sys.stop();
            $(this).hide();
          });
        }else if (e.mode=='visible'){
          dom.stop(true).css('opacity',0).show().fadeTo(e.dt,1,function(){
            that.resize();
          });
          if (sys) sys.start();
        }
      },

      switchSection:function(newSection){
        var parent = sys.getEdgesFrom(newSection)[0].source;
        if (parent.data.alpha==0) return;
        var children = $.map(sys.getEdgesFrom(newSection), function(edge){
          return edge.target;
        });
        var toShow = children;
        var depth = 0;

        function _get_parent_tree(node){
          if (node.data.show==0){
            depth += 1;
            toShow.push(node);
            var parent = sys.getEdgesTo(node.name)[0].source;
            if (parent != node) _get_parent_tree(parent);
          }
        }
        _get_parent_tree(parent);

        sys.eachNode(function(node){
          if (node.data.show==1) return; // skip all but leafnodes

          var nowVisible = ($.inArray(node, toShow)>=0);
          var newAlpha = (nowVisible) ? 1 : 0;
          var dt = (nowVisible) ? 1 : .5;
          sys.tweenNode(node, dt, {alpha:newAlpha});

          if (newAlpha==1){
            node.p.x = parent.p.x + Math.pow(0.05,depth)*Math.random() + Math.pow(0.025,depth);
            node.p.y = parent.p.y + Math.pow(0.05,depth)*Math.random() + Math.pow(0.025,depth);
            node.tempMass = 1.01;
          }
        })
      },


      _initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        selected = null;
        nearest = null;
        var dragged = null;
        var oldmass = 1;

        var _section = null;

        var handler = {
          moved: _.debounce(function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);
            nearest = sys.nearest(_mouseP);

            if (!nearest.node) return false;

            if (nearest.node.data.shape!='dot'){
              selected = (nearest.distance < 50) ? nearest : null;
              if (selected && selected.node.data.link!=''){
                 dom.addClass('linkable');
                 window.status = selected.node.data.link.replace(/^\//,"http://"+window.location.host+"/").replace(/^#/,'');
              }
              else{
                 dom.removeClass('linkable');
                 window.status = '';
              }
            }else if ($.inArray(nearest.node.name, Object.keys(parentNodes)) >=0 ){
              if (nearest.node.name!=_section){
                _section = nearest.node.name;
                that.switchSection(_section);
              }
              dom.removeClass('linkable');
              window.status = '';
            }

            return false;
          },50),
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);
            nearest = dragged = sys.nearest(_mouseP);

            if (nearest && selected && nearest.node===selected.node && selected.node.data.link!=''){
              var link = selected.node.data.link;
              if (link.match(/^#/)){
                 $(that).trigger({type:"navigate", path:link.substr(1)});
              }else{
                    if (link.match(/github\.com/)){
                        $(".openlink").attr('href',link);
                        $("#openHelper").css({'background': selected.node.data.color});
                        $("#openHelper").css({'top': e.pageY-pos.top, 'left': e.pageX-pos.left});
                        $("#openHelper").show();
                    } else {
                        $(".frameLoader").show();
                        $("#outframe").attr('src',"");//clear content
                        $("#outframe").attr('src',link);
                        $("#outsideContent").fadeIn(800);
                    }
              }
              return false;
            }


            if (dragged && dragged.node !== null) dragged.node.fixed = true;

            $(canvas).unbind('mousemove', handler.moved);
            $(canvas).bind('mousemove', handler.dragged);
            $(window).bind('mouseup', handler.dropped);

            return false;
          },
          dragged:function(e){
            var old_nearest = nearest && nearest.node._id;
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);

            if (!nearest) return;
            if (dragged !== null && dragged.node !== null){
              dragged.node.p = sys.fromScreen(s);
            }

            return false;
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return;
            if (dragged.node !== null) dragged.node.fixed = false;
            dragged.node.tempMass = 1000;
            dragged = null;
            // selected = null;
            $(canvas).unbind('mousemove', handler.dragged);
            $(window).unbind('mouseup', handler.dropped);
            $(canvas).bind('mousemove', handler.moved);
            _mouseP = null;
            return false;
          }


        };

        $(canvas).mousedown(handler.clicked);
        $(canvas).mousemove(handler.moved);

      }
    };

    return that;
  };


  var Nav = function(elt){
    var dom = $(elt);

    var _path = null;

    var that = {
      init:function(){
        $(window).bind('popstate',that.navigate);
        dom.find('> a').click(that.back);
        $('.more').one('click',that.more);

        $('#experience dl:not(.datastructure) dt').click(that.reveal);
        that.update();
        return that;
      },
      more:function(e){
        $(this).removeAttr('href').addClass('less').html('&nbsp;').siblings().fadeIn();
        $(this).next('h2').find('a').one('click', that.less);

        return false;
      },
      less:function(e){
        var more = $(this).closest('h2').prev('a');
        $(this).closest('h2').prev('a')
        .nextAll().fadeOut(function(){
          $(more).text('creation & use').removeClass('less').attr('href','#');
        });
        $(this).closest('h2').prev('a').one('click',that.more);

        return false;
      },
      reveal:function(e){
        $(this).next('dd').fadeToggle('fast');
        return false;
      },
      back:function(){
        _path = "/";
        if (window.history && window.history.pushState){
          window.history.pushState({path:_path}, "", _path);
        }
        that.update();
        return false;
      },
      navigate:function(e){
        var oldpath = _path;
        if (e.type=='navigate'){
          _path = e.path;
          if (window.history && window.history.pushState){
             window.history.pushState({path:_path}, "", _path);
          }else{
            that.update();
          }
        }else if (e.type=='popstate'){
          var state = e.originalEvent.state || {};
          _path = state.path || window.location.pathname.replace(/^\//,'');
        }
        if (_path != oldpath) that.update();
      },
      update:function(){
        var dt = 'fast';
        if (_path===null){
          // this is the original page load. don't animate anything just jump
          // to the proper state
          _path = window.location.pathname.replace(/^\//,'');
          dt = 0;
          dom.find('p').css('opacity',0).show().fadeTo('slow',1);
        }

        switch (_path){
          case '':
          case '/':
          dom.find('p').text('Diego Rabatone Oliveira');
          dom.find('> a').removeClass('active').attr('href','#');

          $('#experience').fadeTo('fast',0, function(){
            $(this).hide();
            $(that).trigger({type:'mode', mode:'visible', dt:dt});
          });
          document.title = "Diego Rabatone Oliveira CV » ";
          break;

          case 'experience-other-experiences':
          case 'experience-other-jobs':
          case 'experience-estadao':
          case 'experience-polignu':
          case 'education-formal':
          case 'education-complementary':
          case 'reference':
          $(that).trigger({type:'mode', mode:'hidden', dt:dt});
          dom.find('> p').text(_path);
          dom.find('> a').addClass('active').attr('href','#');
          $('#experience').stop(true).css({opacity:0}).show().delay(333).fadeTo('fast',1);
          $('#experience').find(">div").hide();
          $('#experience').find('#'+_path).show();
          document.title = "Diego Rabatone Oliveira CV » " + _path;
          break;
        }

      }
    };
    return that;
  };

  $(document).ready(function(){


    var theUI = {
      nodes: $.extend(parentNodes, lastLeafNodes),
      edges:{
        "Diego Rabatone Oliveira":{
          Education:{length:.5},
          Experience:{length:.5},
          Coding:{length:.5},
          Publications:{length:.5},
          Speaches:{length:.5},
          Skills:{}
        },
        Skills:{
          Python:{},
          JavaScript:{},
          nginx:{},
          DataViz:{},
          R:{},
          CartoDB:{},
          Mapping:{},
          Speaking:{},
          Teaching:{},
          "Team Work":{}
        },
        Speaches:{
          "www2013 Conference":{},
          "SevenMasters OpenData":{},
          "II Brazilian National Conference on Open Data":{}
        },
        Education:{
               Formal:{},
               Complementary:{}
        },
        Experience:{
          //reference:{},
              "Other Experiencess":{},
              "Other Jobs":{},
              "O Estado de S.Paulo":{},
              PoliGNU:{}
        },
        Coding:{
              "github":{}
        },
        Publications:{
          online:{length:.6},
          printed:{length:.6}
        },
        online:{
          polignu:{length:.6},
          "diraol.polignu.org":{length:.6}
        },
        printed:{
          "Revista iMasters - pg59":{},
          "Caderno PoliGNU - Software e Cultura Livres - Vol.1":{}
        },
        polignu:{
          twitterAPI:{length:.6},
        }
      }
    };


    var sys = arbor.ParticleSystem();
    sys.parameters({stiffness:900, repulsion:1000, gravity:true, dt:0.015});
    sys.renderer = Renderer("#sitemap");
    sys.graft(theUI);

    var nav = Nav("#nav");
    $(sys.renderer).bind('navigate', nav.navigate);
    $(nav).bind('mode', sys.renderer.switchMode);
    nav.init();
  })
})(this.jQuery);

function mouseX(evt) {
    if (evt.pageX) {
        return evt.pageX;
    } else if (evt.clientX) {
       return evt.clientX + (document.documentElement.scrollLeft ?
           document.documentElement.scrollLeft :
           document.body.scrollLeft);
    } else {
        return null;
    }
}

function mouseY(evt) {
    if (evt.pageY) {
        return evt.pageY;
    } else if (evt.clientY) {
       return evt.clientY + (document.documentElement.scrollTop ?
       document.documentElement.scrollTop :
       document.body.scrollTop);
    } else {
        return null;
    }
}

function gen_url_link_list(container,list){
  var _list = $(container);
  $.each(list,function(idx,item){
    var _li = null;
    if (item['img']) {
      _li = $('<li/>',{
          class: 'with_image'
      });
      var img = item['img'];
      var _img = $('<img/>',{
        alt: item['title'],
        title: item['title'],
        src: img['src'],
        class: img['class']
      });
      _li.append(_img);
    } else {
      _li = $('<li/>');
    }
    var _apt = $('<a/>',{
      href: item['link'],
      title: item['title'],
      alt: item['title'],
      text: item['title']
    });
    var _small = $("<span/>",{
      class: 'gtranslated'
    });
    $('<a/>',{
      href: "https://translate.google.com/translate?hl=pt-BR&sl=pt&tl=en&u=" + encodeURIComponent(item['link']),
      //title: item['title'], // How to get it translated? #TODO
      //alt: item['title'], // How to get it translated? #TODO
      text: "(Google Translated)"
    }).appendTo(_small);
    _li.append(_apt);
    _li.append(" - ");
    _li.append(_small);
    _list.append(_li);
  });
}

function onIframeLoad(){
    $(".frameLoader").hide();
};

function closeOutsideFrame(){
    $('#outsideContent').fadeOut(500,function(){
        $("#outframe").attr("src","");
        $(".frameLoader").show();
    });
}

$("#outframe").load(onIframeLoad);
