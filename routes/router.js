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

router.get('/showReviews', async (req, res) => {
	try {
	  const chosenRestaurant = await dbModel.getRestaurantById(req.query.id);
	  const restaurantName = chosenRestaurant.name;
	  console.log("Chosen Restaurant: " + chosenRestaurant);
	  const restaurant = await dbModel.getAllReviewsByRestId(req.query.id);
	  console.log("RESTAURANT:" + restaurant)
	  res.render('reviews', {review: restaurant, restaurantName});
	} catch (error) {
	  res.render('error', {message: 'Error reading from MySQL'});
	  console.log("Error reading from mysql");
	}
  })

router.get('/deleteRestaurant', async (req, res) => {
	const id = req.query.id;
	try {
		await dbModel.deleteRestaurant(id);
	} catch (error) {
		console.log(err);
	}
	res.redirect('/');
});

router.get('/deleteReview', async (req, res) => {
	const id = req.query.id;
	try {
		await dbModel.deleteReview(id);
	} catch (error) {
		console.log(err);
	}
	res.redirect('/');
});

router.post('/addRestaurant', async (req, res) => {
	const rName = req.body.restaurant_name;
	const rDesc = req.body.description;
	try {
		success = await dbModel.addRestaurant(rName, rDesc);
		console.log(success);
		if(success) {
			res.redirect('/');
		} else {
			res.render('error', { message: "Error writing to MySQL" });
			console.log("Error writing to MySQL");
		}
	} catch (error) {
		res.render('error', { message: "Error writing to MySQL" });
		console.log("Error writing to MySQL");
		console.log(err);
	}
});

router.post('/addReview', async (req, res) => {
	const rName = req.body.name;
	const details = req.body.review;
	const rating = req.body.rating;
	try {
		success = await dbModel.addRestaurant(rName, details, rating);
		console.log(success);
		if(success) {
			res.redirect('/');
		} else {
			res.render('error', { message: "Error writing to MySQL" });
			console.log("Error writing to MySQL");
		}
	} catch (error) {
		res.render('error', { message: "Error writing to MySQL" });
		console.log("Error writing to MySQL");
		console.log(err);
	}
});

module.exports = router;
