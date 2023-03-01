const router = require('express').Router();
const database = include('databaseConnection');
const dbModel = include('databaseAccessLayer');
//const dbModel = include('staticData');

router.get('/', async (req, res) => {
	console.log("page hit");
	
	try {
		const result = await dbModel.getAllUsers();
		res.render('index', {allUsers: result});

		//Output the results of the query to the Heroku Logs
		console.log(result);
	}
	catch (err) {
		res.render('error', {message: 'Error reading from MySQL'});
		console.log("Error reading from mysql");
	}
});

router.get('/review/:restaurantId', (req, res) => {
	// implement the getReviewsFromRestId()
	const restaurant = dbModel.getAllReviewsByRestId(req.params.restaurantId);
	res.render('reviews', {review: restaurant});
})

module.exports = router;
