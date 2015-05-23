Meteor.publish('Planes', function(){
    return Planes.find();
});