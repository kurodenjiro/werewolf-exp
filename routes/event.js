var express = require('express');
var router = express.Router();
var knex = require('knex');



const db = knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    database: 'test',
  }
})


function loginRequired(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next()
}

var counter = 1;

router
	.get('/event:event_id', loginRequired, (req, res, next) => {
			const { event_id } = req.params;
			counter += 18;
				db('events')
				.where('id', event_id)
				.first()
				.update({
					clickCount: counter
				})
				.then(()=> {
					db("events")
					.where("id", event_id)
					.first()
					.then((event) => {
						res.render('event', {
								event,
								title: event.title,
								partials: {
									header: './partials/header',
									footer: './partials/footer'
								},
								currentFill: function() {
									return event.participants.split(',').length;
								},
								authenticated: req.isAuthenticated(),
								joined: function() {
									if (event.participantsID.indexOf(req.user.id) > -1) {
										return 'joined'	
									}
								},
								currentUser: req.user.nickname,
								owned: function() {
									if (event.user_id !== req.user.id) {
										return 'notOwned';
									}
								}
							})
						console.log(event.filePath)
					}, next)
				})
	})
	.post('/event:event_id', loginRequired, (req, res, next) => {
		const { event_id } = req.params;
		db('events')
			.where('id', event_id)
			.first()
			.then((event) => {
				var parsedString = ',' + req.user.nickname;
				var updatedString = event.participants + parsedString;
				console.log(updatedString)
				var currentFillNumber = updatedString.split(',').length;

				var parsedID = ',' + req.user.id;
				var updatedID = event.participantsID + parsedID;
				db('events')
					.where('id', event_id)
					.first()
					.update({
					    participants: updatedString,
					    currentFill: currentFillNumber,
					    participantsID: updatedID
					})
					.then(()=> {
						res.redirect('event'+event_id)
					})
			})
			
	})
	.get('/delete:event_id', loginRequired, (req, res, next) => {
		const { event_id } = req.params;
		db('events')
			.where('id', event_id)
			.first()
			.then((event)=>{
				if (req.user.id !== event.user_id) {
					res.render('notAuthorized')
				}
				db('events')
				.where('id', event_id)
				.first()
				.delete()
				.then((result) => {
				if (result === 0) {
					return res.send(404)
					}
					res.redirect('/');
				}, next)
			})
		})
	.get('/update:event_id', loginRequired, (req, res, next) => {
		const { event_id } = req.params;
		db('events')
			.where('id', event_id)
			.first()
			.then((event)=> {
				if (req.user.id !== event.user_id) {
					res.render('notAuthorized')
				}
				res.render('updateEvent', {
					event,							
					authenticated: req.isAuthenticated(),
					partials: {
						header: './partials/header',
						footer: './partials/footer'
					}
				})
			})
	})
	.post('/update:event_id', loginRequired, (req, res, next) => {
		const { event_id } = req.params;
		console.log(req.params);
		const newEvent = {
	        title: req.body.eventName,
	        type: req.body.eventType,
	        date: '2017-01-01 19:00:00',
	        capacity: req.body.eventCapacity,
	        address: req.body.eventAddress,
	        note: req.body.eventNote,
	        user_id: req.user.id,
	        user_nickname: req.user.nickname,
	        participants: req.user.nickname,
	        currentFill: 1,
	        participantsID: req.user.id
	      }
		db('events')
			.where('id', event_id)
			.first()
			.update(newEvent)
			.then((event)=> {
				res.redirect('/event' + event_id)
			})
	})


module.exports = router