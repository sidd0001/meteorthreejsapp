Router.route('/', function () {
  // render some data on root page
  this.render('ThreeJsCanvas', {data: {title: 'MeteorExampleApp'}});
});

