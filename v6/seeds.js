var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");
var data = [
    {
        name:"Aferraron Meadows",
        image:"https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg",
        description:"The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother's keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers. And you will know My name is the Lord when I lay My vengeance upon thee."
    },
    {
        name:"Glomtom Hill",
        image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
        description:"Your bones don't break, mine do. That's clear. Your cells react to bacteria and viruses differently than mine. You don't get sick, I do. That's also clear. But for some reason, you and I react the exact same way to water. We swallow it too fast, we choke. We get some in our lungs, we drown. However unreal it may seem, we are connected, you and I. We're on the same curve, just on opposite ends."
    },
    {
        name:"Wavefire Pit",
        image:"https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
        description:"You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I don't know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out. Now we took an oath, that I'm breaking now. We said we'd say it was the snow that killed the other two, but it wasn't. Nature is lethal but it doesn't hold a candle to man."
    },
    {
        name:"Besloor Beach",
        image:"https://farm8.staticflickr.com/7205/7121863467_eb0aa64193.jpg",
        description:"My money's in that office, right? If she start giving me some bullshit about it ain't there, and we got to go someplace else and get it, I'm gonna shoot you in the head then and there. Then I'm gonna shoot that bitch in the kneecaps, find out where my goddamn money is. She gonna tell me too. Hey, look at me when I'm talking to you, motherfucker. You listen: we go in there, and that nigga Winston or anybody else is in there, you the first motherfucker to get shot. You understand?"
    }
    
]

function seedDB(){
    //REMOVE ALL CAMPS
  Campground.remove({}, function(err){
    if(err){
        console.log(err);
    }
    console.log("removed campgrounds");
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
               if(err){
                   console.log(err);
               } else {
                   console.log("added a campground");
                   //create a comment
                   Comment.create(
                       {
                           text: "This place rules but i wish it had internet",
                            author: "Homer"   
                       }, function(err, comment){
                          if(err){
                              console.log(err);
                          } else {
                              campground.comments.push(comment);
                              campground.save();
                              console.log("Created a new comment")
                          }
                       });
               }
            }); 
        });
    });
}  
module.exports = seedDB;




