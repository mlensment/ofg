var Gallery = function(){
  this.gDir = 'galleries/';
  this.imgList = [];
  this.galleryList = [];
  this.currentGallery = null;
  this.display = false;
  
  this.bindHandlers();
  this.router();
};

Gallery.start = function(){ return new Gallery(); };

Gallery.prototype.loadGalleries = function(){
  var that = this;
  $.get('system/lib/dirList.php', function(data) {
    that.galleryList = data;
    that.displayGalleries();
  }, 'json');
};

Gallery.prototype.displayGalleries = function(){
  for(var i in this.galleryList){
    $('#galleries').append('<div><a href="#/' + this.galleryList[i][0] + '/' + this.galleryList[i][1] + '" class="gallery-link"><img src="' + this.gDir + this.galleryList[i][0] + '/' + this.galleryList[i][1] + '" class="small-image" />' + this.galleryList[i][0] + '</a></div>')
  }
}


Gallery.prototype.loadImages = function(gallery){
  var that = this;
  $.get('system/lib/dirList.php', {
    action: 'loadImages',
    dir: gallery
  }, function(data){
    that.imgList = data;
  }, 'json');
};

Gallery.prototype.initDisplay = function(imgId){
  $('#galleries').hide();
  $('#display-tag').attr('src',  this.gDir + this.currentGallery + '/' + imgId);
  $('#display').show();
}

Gallery.prototype.switchImg = function(imgId){
  $('#display-tag').attr('src',  this.gDir + this.currentGallery + '/' + imgId);
};

Gallery.prototype.bindHandlers = function(){
  var that = this;
  var i = 0;
  $(document).keydown(function(e){
    if(!that.display)
      return;
    if(e.keyCode == 39){
      if(i < that.imgList.length - 1)
        i++;
      if((i + 1) < that.imgList.length)
        new Image().src = that.gDir + that.imgList[i + 1];
      document.location = '#/' + that.currentGallery + '/' + that.imgList[i];
    }else if(e.keyCode == 37){
      if(i > 0)
        i--;
      document.location = '#/' + that.currentGallery + '/' + that.imgList[i];
    }
  });
};

Gallery.prototype.setTitle = function(title){
  title = title || null;
  if(title != null)
    $('#title').html(title);
};

Gallery.prototype.router = function(){
  var that = this;
  var router = Backbone.Router.extend({
    routes: {
      '/:gallery/:imgId': 'displayGallery',
      '*defaults': 'defaultRoute'
    },
    displayGallery: function(gallery, imgId){
      if(!that.display){
       that.setTitle(gallery);
       that.loadImages(gallery);
       that.currentGallery = gallery;
       that.initDisplay(imgId);
       that.display = true;
      }else{
        that.switchImg(imgId);
      }
    },
    defaultRoute: function(){
      that.display = false;
      $('#display-tag').attr('src', '');
      $('#galleries').show();
      $('#display').hide();
      that.setTitle('Choose the gallery');
      if($('#galleries').html().length == 0){
        that.loadGalleries();
      }
    }
  });
  var appRouter = new router();
  Backbone.history.start();
};


$(document).ready(function(){
  Gallery.start();
});